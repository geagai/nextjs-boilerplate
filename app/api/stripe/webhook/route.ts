
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Removed unused: const supabase = createClient(...)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  let event: unknown // TODO: Use Stripe.Event type

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

  // Type assertion for event
  const stripeEvent = event as any;

  console.log('📡 Received webhook event:', stripeEvent.type)

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object)
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
async function handleCheckoutCompleted(session: unknown) {
  const s = session as any;
  console.log('✅ Checkout session completed:', s.id)
  const { userId, plan } = s.metadata || {}
  if (!userId || !plan) {
    console.error('❌ Missing metadata in checkout session')
    return
  }
  // Update user subscription status in database
  console.log(`🎉 User ${userId} subscribed to ${plan} plan`)
}

async function handleSubscriptionCreated(subscription: unknown) {
  const s = subscription as any;
  console.log('📝 Subscription created:', s.id)
}

async function handleSubscriptionUpdated(subscription: unknown) {
  const s = subscription as any;
  console.log('🔄 Subscription updated:', s.id)
}

async function handleSubscriptionDeleted(subscription: unknown) {
  const s = subscription as any;
  console.log('❌ Subscription cancelled:', s.id)
}

async function handlePaymentSucceeded(invoice: unknown) {
  const i = invoice as any;
  console.log('💰 Payment succeeded:', i.id)
}

async function handlePaymentFailed(invoice: unknown) {
  const i = invoice as any;
  console.log('💸 Payment failed:', i.id)
}
