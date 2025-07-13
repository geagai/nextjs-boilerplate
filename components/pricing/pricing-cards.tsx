
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { loadStripe } from '@stripe/stripe-js'
import type Stripe from 'stripe'

interface PricingCardsProps {
  session: any
  products: (Stripe.Product & { prices: Stripe.Price[] })[]
  publishableKey?: string
}

// Mapping helper to pick price for interval/type
function getPriceForTab(prices: Stripe.Price[], tab: string) {
  switch (tab) {
    case 'monthly':
      return prices.find((p) => p.type === 'recurring' && p.recurring?.interval === 'month')
    case 'yearly':
      return prices.find((p) => p.type === 'recurring' && p.recurring?.interval === 'year')
    case 'one_time':
      return prices.find((p) => p.type === 'one_time')
    default:
      return undefined
  }
}

// Helper: determine CTA button label based on pricing rules
function getButtonLabel(price: Stripe.Price, activeTab: 'monthly' | 'yearly' | 'one_time') {
  // Free trial => "Start Trial"
  const trialDays = (price as any).trial_period_days as number | undefined
  if (trialDays && trialDays > 0) {
    return 'Start Trial'
  }

  // No trial – decide label by pricing term
  if (activeTab === 'one_time') return 'Purchase'
  return 'Subscribe'
}

// Helper: decide whether to show "No Credit Card Required" note
function showNoCardText(price: Stripe.Price) {
  const trialDays = (price as any).trial_period_days as number | undefined
  const hasTrial = trialDays && trialDays > 0
  const requiresCardMeta = price.metadata?.trial_requires_payment_method === 'true'
  return hasTrial && !requiresCardMeta
}

export function PricingCards({ session, products, publishableKey }: PricingCardsProps) {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly' | 'one_time'>('monthly')
  const { toast } = useToast()

  const filteredProducts = useMemo(() => {
    return products.filter((p) => getPriceForTab(p.prices, activeTab))
  }, [products, activeTab])

  const handleSelectPrice = async (priceId: string) => {
    if (!session) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to upgrade your plan',
        variant: 'destructive'
      })
      return
    }

    if (!publishableKey) {
      toast({
        title: 'Payment Processing Unavailable',
        description: 'Stripe is not configured. Please contact support.',
        variant: 'destructive'
      })
      return
    }

    setLoadingPriceId(priceId)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create session')
      
      const stripe = await loadStripe(publishableKey)
      await stripe?.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoadingPriceId(null)
    }
  }

  const formatAmount = (amount?: number | null, currency?: string) => {
    if (!amount) return ''
    return `${(amount / 100).toFixed(0)}`
  }

  return (
    <div className="mb-16">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-5 pt-5">
        {([
          { key: 'monthly', label: 'Monthly' },
          { key: 'yearly', label: 'Yearly' },
          { key: 'one_time', label: 'One Time' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              activeTab === tab.key
                ? 'border-primary text-primary bg-transparent'
                : 'border-[#d8d8d8] bg-[--header-bg] text-muted-foreground'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, index) => {
          const price = getPriceForTab(product.prices, activeTab)
          if (!price) return null
          const popular = product.metadata?.most_popular === 'true'
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <Card className={`h-full ${popular ? 'border-primary shadow-lg scale-105' : ''} card-hover`}>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">${formatAmount(price.unit_amount, price.currency)}</span>
                    {activeTab !== 'one_time' && (
                      <span className="text-muted-foreground">/{activeTab === 'monthly' ? 'month' : 'year'}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-0">
                  <Button
                    className="w-full"
                    variant={popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPrice(price.id)}
                    disabled={loadingPriceId === price.id}
                  >
                    {loadingPriceId === price.id ? 'Processing...' : getButtonLabel(price, activeTab)}
                  </Button>

                  {showNoCardText(price) && (
                    <p className="text-center text-sm text-muted-foreground">No Credit Card Required</p>
                  )}

                  {/* Marketing features from metadata */}
                  {product.metadata?.marketing_features && (
                    <div>
                      <h4 className="font-semibold mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {JSON.parse(product.metadata.marketing_features).slice(0, 8).map((feat: any, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feat.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
