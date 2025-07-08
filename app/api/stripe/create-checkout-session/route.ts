
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Creating checkout session...')
    
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      console.log('❌ No authenticated user found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan, priceId } = body
    if (priceId) {
      // Fetch price information
      let price: any
      try {
        price = await stripe.prices.retrieve(priceId)
      } catch (err) {
        return NextResponse.json({ error: 'Invalid priceId' }, { status: 400 })
      }

      // Create or get Stripe customer
      let customerId = session.user.user_metadata?.stripeCustomerId
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: session.user.email!,
          name: session.user.user_metadata?.name || undefined,
          metadata: { userId: session.user.id }
        })
        customerId = customer.id
        await supabase.auth.updateUser({
          data: { ...session.user.user_metadata, stripeCustomerId: customerId }
        })
      }

      const mode = price.type === 'recurring' ? 'subscription' : 'payment'

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: price.id, quantity: 1 }],
        mode,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        metadata: {
          userId: session.user.id,
          priceId: price.id,
          productId: price.product as string
        }
      })

      return NextResponse.json({ sessionId: checkoutSession.id })
    }
    console.log('📋 Request data:', { plan, userId: session.user.id })

    if (!plan || !SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
      console.log('❌ Invalid plan:', plan)
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const user = session.user
    const selectedPlan = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]
    console.log('✅ Selected plan:', selectedPlan.name, 'Price ID:', selectedPlan.stripePriceId)

    if (!selectedPlan.stripePriceId) {
      console.log('❌ Free plan attempted')
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.log('❌ Missing NEXT_PUBLIC_APP_URL')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create or get Stripe customer
    let customerId = user.user_metadata?.stripeCustomerId
    console.log('👤 Current customer ID:', customerId)

    if (!customerId) {
      console.log('🔨 Creating new Stripe customer')
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.user_metadata?.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id
      console.log('✅ Created customer:', customerId)

      // Update user metadata with customer ID
      await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          stripeCustomerId: customerId
        }
      })
      console.log('✅ Updated user metadata with customer ID')
    }

    // Create checkout session
    console.log('🛒 Creating checkout session with:', {
      customerId,
      priceId: selectedPlan.stripePriceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    console.log('✅ Checkout session created:', checkoutSession.id)
    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    
    // Provide more specific error information
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}
