
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export const getStripeInstance = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
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
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID!,
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
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
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
    stripePriceId: process.env.STRIPE_ELITE_PRICE_ID!,
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
