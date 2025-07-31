import { requireAuth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'
import MyProductsClient from './my-products-client'
import { AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyProductsPage() {
  await requireAuth()

  // Get Stripe secret & dev mode flag from admin_settings
  const cookieStore = await cookies()
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

  // Use only .env variables for Stripe config
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
  const hasStripeConfig = publishableKey;

  if (!hasStripeConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Stripe Configuration Required</h3>
                        <p className="text-muted-foreground mb-6">
                Please set <code>NEXT_PUBLIC_STRIPE_KEY</code> as an environment variable in your hosting provider's dashboard or in your local <code>.env</code> file to enable Stripe product management.
              </p>
        </div>
      </div>
    )
  }

  if (!stripe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Stripe Configuration Required</h3>
          <p className="text-muted-foreground mb-6">
            Please set <code>STRIPE_SECRET_KEY</code> as an environment variable to enable Stripe product management.
          </p>
        </div>
      </div>
    )
  }

  // Fetch products
  const productsResp = await stripe.products.list({ limit: 100, active: true })

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