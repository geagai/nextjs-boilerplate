
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Basic authentication system',
      'Core UI components library',
      'Community support',
      'Up to 1 project',
      'Basic documentation access',
      'Standard templates'
    ],
    limitations: [
      'Limited to basic features',
      'Community support only',
      'Standard templates only'
    ],
    popular: false,
    cta: 'Get Started Free'
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: 10,
    description: 'Ideal for small projects',
    features: [
      'Everything in Free',
      'Stripe payment integration',
      'Email support',
      'Up to 5 projects',
      'Basic analytics dashboard',
      'Premium UI components',
      'Form validation library',
      'Basic mobile optimization'
    ],
    limitations: [
      'Email support only',
      'Basic analytics'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 20,
    description: 'For growing businesses',
    features: [
      'Everything in Starter',
      'Advanced security features',
      'Priority email support',
      'Up to 20 projects',
      'Advanced analytics & insights',
      'Custom API integrations',
      'Team collaboration tools',
      'Advanced mobile features',
      'Custom deployment options',
      'Performance monitoring'
    ],
    limitations: [
      'Email support only'
    ],
    popular: false,
    cta: 'Upgrade to Pro'
  },
  {
    id: 'ELITE',
    name: 'Elite',
    price: 30,
    description: 'For enterprise teams',
    features: [
      'Everything in Pro',
      'White-label customization',
      'Dedicated support manager',
      'Unlimited projects',
      'Custom feature development',
      'Priority feature requests',
      'SLA guarantee (99.9% uptime)',
      'Advanced security compliance',
      'Custom training sessions',
      'Enterprise SSO integration',
      'Advanced team management',
      'Custom reporting'
    ],
    limitations: [],
    popular: false,
    cta: 'Contact Sales'
  }
]

interface PricingCardsProps {
  session: any
}

export function PricingCards({ session }: PricingCardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSelectPlan = async (planId: string) => {
    if (!session) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to upgrade your plan',
        variant: 'destructive'
      })
      return
    }

    if (planId === 'FREE') {
      toast({
        title: 'Already on Free Plan',
        description: 'You are already on the free plan',
      })
      return
    }

    if (planId === 'ELITE') {
      toast({
        title: 'Contact Sales',
        description: 'Please contact our sales team for Enterprise pricing',
      })
      return
    }

    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: planId })
      })

      const data = await response.json()

      if (response.ok) {
        const stripe = await stripePromise
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId })
        }
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="relative"
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </span>
            </div>
          )}
          
          <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} card-hover`}>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-base">{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-0">
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? 'Processing...' : plan.cta}
              </Button>

              <div>
                <h4 className="font-semibold mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
