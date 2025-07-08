import { requireAuth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import MyProductsClient from './my-products-client'

export const dynamic = 'force-dynamic'

export default async function MyProductsPage() {
  // Ensure user is authenticated
  const { user } = await requireAuth()

  // Get Stripe secret & dev mode flag from admin_settings
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('stripe_secret, dev_mode')
    .limit(1)
    .maybeSingle()

  if (!settings?.stripe_secret) {
    return <div className="p-8 text-center text-red-500">Stripe is not configured.</div>
  }

  const stripe = new Stripe(settings.stripe_secret, { apiVersion: '2025-05-28.basil' })

  // Fetch products
  const productsResp = await stripe.products.list({ limit: 100 })

  // Fetch prices for each product
  const productData = await Promise.all(
    productsResp.data.map(async (product) => {
      const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 })
      return {
        id: product.id,
        name: product.name,
        image: product.images?.[0] || null,
        metadata: product.metadata || {},
        prices: prices.data.map((p) => ({
          id: p.id,
          amount: p.unit_amount,
          currency: p.currency,
          type: p.type,
          interval: p.recurring?.interval || null,
        })),
      }
    })
  )

  return (
    <MyProductsClient
      products={productData}
      devMode={settings.dev_mode === true}
    />
  )
} 