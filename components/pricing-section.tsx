
'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Basic authentication',
      'Basic components',
      'Community support',
      '1 project',
      'Basic documentation'
    ],
    popular: false,
    cta: 'Get Started'
  },
  {
    name: 'Starter',
    price: 10,
    description: 'Ideal for small projects',
    features: [
      'Everything in Free',
      'Payment integration',
      'Email support',
      '5 projects',
      'Basic analytics',
      'Premium components'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Pro',
    price: 20,
    description: 'For growing businesses',
    features: [
      'Everything in Starter',
      'Advanced security features',
      'Priority support',
      '20 projects',
      'Advanced analytics',
      'Custom integrations',
      'Team collaboration'
    ],
    popular: false,
    cta: 'Upgrade to Pro'
  },
  {
    name: 'Elite',
    price: 30,
    description: 'For enterprise teams',
    features: [
      'Everything in Pro',
      'White-label options',
      'Dedicated support',
      'Unlimited projects',
      'Custom development',
      'Priority feature requests',
      'SLA guarantee'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
]

export function PricingSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include core features with increasing limits and premium support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''} card-hover`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={plan.price === 0 ? "/signup" : "/pricing"} className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required for Free plan.
          </p>
          <Link href="/pricing">
            <Button variant="outline">
              View Detailed Comparison
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
