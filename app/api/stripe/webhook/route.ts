
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  let event: any

  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('⚠️ Webhook secret not configured, skipping signature verification')
      event = JSON.parse(body)
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  console.log('📡 Received webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`)
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

async function handleCheckoutCompleted(session: any) {
  console.log('✅ Checkout session completed:', session.id)
  
  const { userId, plan } = session.metadata || {}
  
  if (!userId || !plan) {
    console.error('❌ Missing metadata in checkout session')
    return
  }

  // Update user subscription status in database
  // Note: This would typically update a subscriptions table
  console.log(`🎉 User ${userId} subscribed to ${plan} plan`)
  
  // You could update user metadata or a subscriptions table here
  // For now, we'll just log the successful subscription
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('📝 Subscription created:', subscription.id)
  
  // Handle new subscription creation
  // Update user's subscription status
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('🔄 Subscription updated:', subscription.id)
  
  // Handle subscription changes (plan upgrades/downgrades)
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('❌ Subscription cancelled:', subscription.id)
  
  // Handle subscription cancellation
  // Update user to free plan
}

async function handlePaymentSucceeded(invoice: any) {
  console.log('💰 Payment succeeded:', invoice.id)
  
  // Handle successful payment
  // Could send confirmation email, update billing history, etc.
}

async function handlePaymentFailed(invoice: any) {
  console.log('💸 Payment failed:', invoice.id)
  
  // Handle failed payment
  // Could send notification email, suspend account, etc.
}
