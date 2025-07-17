
import Stripe from 'stripe'

// Only create Stripe instance if the secret key is available
export const stripe = process.env.NEXT_PUBLIC_STRIPE_SECRET ? new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET, {
  apiVersion: '2025-06-30.basil' as any,
  typescript: true,
}) : null

export const getStripeInstance = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_SECRET) {
    return null
  }
  return stripe
}

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    stripePriceId: null,
    features: [
      'Basic authentication',
      'Basic components',
      'Community support',
      '1 project'
    ]
  },
  STARTER: {
    name: 'Starter',
    price: 10,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_KEY || null,
    features: [
      'Everything in Free',
      'Payment integration',
      'Email support',
      '5 projects',
      'Basic analytics'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 20,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_KEY || null,
    features: [
      'Everything in Starter',
      'Advanced security features',
      'Priority support',
      '20 projects',
      'Advanced analytics',
      'Custom integrations'
    ]
  },
  ELITE: {
    name: 'Elite',
    price: 30,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_KEY || null,
    features: [
      'Everything in Pro',
      'White-label options',
      'Dedicated support',
      'Unlimited projects',
      'Custom development',
      'Priority feature requests'
    ]
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
