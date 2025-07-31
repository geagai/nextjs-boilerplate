
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')

  let event: Stripe.Event;

  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('⚠️ Webhook secret not configured, skipping signature verification')
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET
      ) as Stripe.Event;
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Type assertion for event
  const stripeEvent = event;

  console.log('📡 Received webhook event:', stripeEvent.type)

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object as Stripe.Checkout.Session)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${stripeEvent.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// TODO: Use proper Stripe types for session, subscription, and invoice
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout session completed:', session.id)
  const { userId, plan, credits } = session.metadata || {}
  
  if (!userId) {
    console.error('❌ Missing userId in checkout session metadata')
    return
  }

  // Initialize Supabase client
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    console.error('❌ Could not initialize Supabase client')
    return
  }

  try {
    // Parse credits as number, default to 0 if not provided or invalid
    const creditsToAdd = credits ? parseInt(credits, 10) : 0
    
    if (creditsToAdd > 0) {
      // Get current user credits
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('credits')
        .eq('UID', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Error fetching user credits:', fetchError)
        return
      }

      const currentCredits = userData?.credits || 0
      const newCredits = currentCredits + creditsToAdd

      // Update user credits
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          UID: userId,
          credits: newCredits
        })

      if (updateError) {
        console.error('❌ Error updating user credits:', updateError)
        return
      }

      console.log(`🎉 Added ${creditsToAdd} credits to user ${userId}. New total: ${newCredits}`)
    }

    // Store metadata in subscription for future invoice events
    if (session.subscription && stripe) {
      try {
        await stripe.subscriptions.update(session.subscription as string, {
          metadata: {
            userId: userId,
            credits: credits || '0',
            plan: plan || 'unknown'
          }
        })
        console.log(`📝 Updated subscription ${session.subscription} with metadata`)
      } catch (err) {
        console.error('❌ Error updating subscription metadata:', err)
      }
    }

    if (plan) {
      console.log(`🎉 User ${userId} subscribed to ${plan} plan`)
    }
  } catch (error) {
    console.error('❌ Error processing checkout completion:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('📝 Subscription created:', subscription.id)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription cancelled:', subscription.id)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Payment succeeded:', invoice.id)
  
  // Get the first line item to extract product information
  const lineItem = invoice.lines?.data?.[0]
  if (!lineItem) {
    console.log('❌ No line items found in invoice')
    return
  }

  // Get subscription ID from line item
  const subscriptionId = lineItem.parent?.subscription_item_details?.subscription
  if (!subscriptionId) {
    console.log('❌ No subscription ID found in line item')
    return
  }

  // Initialize Supabase client
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    console.error('❌ Could not initialize Supabase client')
    return
  }

  try {
    // Get subscription to extract metadata
    if (!stripe) {
      console.error('❌ Stripe not configured')
      return
    }
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const { userId, credits: creditsStr } = subscription.metadata || {}
    
    if (!userId) {
      console.log('❌ No userId found in subscription metadata')
      return
    }

    // Parse credits from subscription metadata
    const creditsToAdd = creditsStr ? parseInt(creditsStr, 10) : 0
    console.log(`💳 Credits from subscription: ${creditsToAdd}`)

    if (creditsToAdd > 0) {
      // Get current user credits
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('credits')
        .eq('UID', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Error fetching user credits:', fetchError)
        return
      }

      const currentCredits = userData?.credits || 0
      const newCredits = currentCredits + creditsToAdd

      // Update user credits
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          UID: userId,
          credits: newCredits
        })

      if (updateError) {
        console.error('❌ Error updating user credits:', updateError)
        return
      }

      console.log(`🎉 Added ${creditsToAdd} credits to user ${userId}. New total: ${newCredits}`)
    }

    console.log(`💰 Payment succeeded for user ${userId}, subscription ${subscriptionId}`)
  } catch (error) {
    console.error('❌ Error processing payment success:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('💸 Payment failed:', invoice.id)
}
