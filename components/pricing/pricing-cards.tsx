
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
  session: unknown
  products: (Stripe.Product & { prices: Stripe.Price[] })[]
  publishableKey?: string
  columns?: 3 | 4 // number of columns for grid, default 4
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
  // trial_period_days is not a standard property on Stripe.Price; check for its existence
  // 'trial_period_days' is not in Stripe.Price type; using type assertion as Stripe.Price & { trial_period_days?: number }
  const trialDays = 'trial_period_days' in price ? (price as Stripe.Price & { trial_period_days?: number }).trial_period_days : undefined
  if (trialDays && trialDays > 0) {
    return 'Start Trial'
  }

  // No trial – decide label by pricing term
  if (activeTab === 'one_time') return 'Purchase'
  return 'Subscribe'
}

// Helper: decide whether to show "No Credit Card Required" note
function showNoCardText(price: Stripe.Price) {
  // trial_period_days is not a standard property on Stripe.Price; check for its existence
  // 'trial_period_days' is not in Stripe.Price type; using type assertion as Stripe.Price & { trial_period_days?: number }
  const trialDays = 'trial_period_days' in price ? (price as Stripe.Price & { trial_period_days?: number }).trial_period_days : undefined
  const hasTrial = trialDays && trialDays > 0
  const requiresCardMeta = price.metadata?.trial_requires_payment_method === 'true'
  return hasTrial && !requiresCardMeta
}

// Helper: extract marketing features from product metadata
function getMarketingFeatures(product: Stripe.Product): string[] {
  const features: string[] = []
  
  if (product.metadata) {
    // First, try to get features from the new format (feature_1, feature_2, etc.)
    const featureEntries: Array<{ number: number; value: string }> = []
    Object.keys(product.metadata).forEach(key => {
      if (key.startsWith('feature_')) {
        const featureNumber = parseInt(key.replace('feature_', ''))
        const featureValue = product.metadata[key]
        if (featureValue && typeof featureValue === 'string' && !isNaN(featureNumber)) {
          featureEntries.push({ number: featureNumber, value: featureValue })
        }
      }
    })
    
    if (featureEntries.length > 0) {
      // Use new format
      featureEntries
        .sort((a, b) => a.number - b.number)
        .forEach(entry => features.push(entry.value))
    } else if (product.metadata.marketing_features) {
      // Fallback to old JSON format for backward compatibility
      try {
        const oldFeatures = JSON.parse(product.metadata.marketing_features)
        if (Array.isArray(oldFeatures)) {
          oldFeatures.forEach((feature: any) => {
            if (feature && typeof feature.title === 'string') {
              features.push(feature.title)
            }
          })
        }
      } catch (error) {
        console.warn('Failed to parse old marketing features format:', error)
      }
    }
  }
  
  return features
}

export function PricingCards({ session, products, publishableKey, columns = 4 }: PricingCardsProps) {
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

  const formatAmount = (amount?: number | null) => {
    if (!amount) return ''
    return `${(amount / 100).toFixed(0)}`
  }

  const gridColsClass = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <div className="mb-16 max-w-[1200px] mx-auto">
      {/* Tabs (full width, centered) */}
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
      {/* Only the cards are in a grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-8`}>
        {filteredProducts.map((product, index) => {
          const price = getPriceForTab(product.prices, activeTab)
          if (!price) return null
          const popular = product.metadata?.most_popular === 'true'
          const marketingFeatures = getMarketingFeatures(product)
          
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
                    <span className="text-4xl font-bold">${formatAmount(price.unit_amount)}</span>
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
                  {marketingFeatures.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">What&rsquo;s included:</h4>
                      <ul className="space-y-2">
                        {marketingFeatures.slice(0, 8).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
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
