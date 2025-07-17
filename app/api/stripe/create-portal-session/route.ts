
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  const { user } = await requireAuth()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripeCustomerId = user.user_metadata?.stripeCustomerId

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: 'No Stripe customer found' },
      { status: 400 }
    )
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: portalSession.url })
}
