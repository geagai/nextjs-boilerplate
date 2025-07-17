
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic'

// Removed unused: const supabase = createClient(...)

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
  const { userId, plan } = session.metadata || {}
  if (!userId || !plan) {
    console.error('❌ Missing metadata in checkout session')
    return
  }
  // Update user subscription status in database
  console.log(`🎉 User ${userId} subscribed to ${plan} plan`)
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
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('💸 Payment failed:', invoice.id)
}
