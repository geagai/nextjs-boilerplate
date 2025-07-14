import { requireAuth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import MyProductsClient from './my-products-client'
import { AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyProductsPage() {
  await requireAuth()

  // Get Stripe secret & dev mode flag from admin_settings
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  if (!supabase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <h3 className="text-xl font-semibold mb-2">Unable to load products</h3>
          <p className="text-muted-foreground mb-6">Supabase client could not be initialized.</p>
        </div>
      </div>
    )
  }
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('stripe_secret, stripe_publishable_key, dev_mode')
    .limit(1)
    .maybeSingle()

  if (!settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <h3 className="text-xl font-semibold mb-2">Unable to load products</h3>
          <p className="text-muted-foreground mb-6">Admin settings could not be loaded.</p>
        </div>
      </div>
    )
  }

  // Check Stripe configuration: admin_settings first, then env as backup
  let publishableKey = settings?.stripe_publishable_key
  let secretKey = settings?.stripe_secret

  if (!publishableKey || !secretKey) {
    publishableKey = publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    secretKey = secretKey || process.env.STRIPE_SECRET_KEY
  }

  const hasStripeConfig = publishableKey && secretKey

  if (!hasStripeConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Stripe Configuration Required</h3>
          <p className="text-muted-foreground mb-6">
            Please configure your Stripe publishable key and secret key to view your products.
          </p>
          <a
            href="/admin-settings"
            className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Configure Stripe Settings
          </a>
        </div>
      </div>
    )
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2025-05-28.basil' })

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