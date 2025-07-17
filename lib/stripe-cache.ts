// lib/stripe-cache.ts

import Stripe from 'stripe'
import { stripe as envStripe } from './stripe'

interface CachedProducts {
  data: (Stripe.Product & { prices: Stripe.Price[] })[]
  timestamp: number
}

const CACHE_TTL = 1000 * 60 * 60 // 1 hour

let productCache: CachedProducts | null = null

/**
 * Fetch Stripe products (and attached prices) with simple in-process caching.
 * This keeps public pages fast while avoiding unnecessary Stripe API calls.
 */
export async function getStripeProductsCached() {
  const now = Date.now()
  if (productCache && now - productCache.timestamp < CACHE_TTL) {
    return productCache.data
  }

  const stripe = envStripe // Only use envStripe

  if (!stripe) {
    return null
  }

  // Fetch active products
  const productsResp = await stripe.products.list({ limit: 100, active: true })

  // Attach active prices for each product
  const productsWithPrices = await Promise.all(
    productsResp.data.map(async (product) => {
      const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 })
      // @ts-expect-error - dynamic import for stripe cache, type not statically known
      product.prices = prices.data
      return product as Stripe.Product & { prices: Stripe.Price[] }
    })
  )

  productCache = { data: productsWithPrices, timestamp: now }
  return productsWithPrices
}

export function clearStripeProductsCache() {
  productCache = null
} 