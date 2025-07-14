// lib/stripe-cache.ts

import Stripe from 'stripe'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
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

  // Determine which Stripe secret to use: admin_settings first, else env
  let secretFromSettings: string | undefined
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)
    if (supabase) {
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('stripe_secret')
        .limit(1)
        .maybeSingle()

      if (settings?.stripe_secret) {
        secretFromSettings = settings.stripe_secret as string
      }
    }
  } catch (_) {/* ignore */}

  const stripe = secretFromSettings
    ? new Stripe(secretFromSettings, { apiVersion: '2025-05-28.basil' })
    : envStripe // fallback global instance (env var)

  if (!stripe) {
    throw new Error('Stripe not configured')
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