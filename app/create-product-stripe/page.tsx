import { requireAuth, isAdmin } from '@/lib/auth'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import CreateProductClient from './create-product-client'
import { AlertTriangle } from 'lucide-react'

export default async function CreateProductStripePage() {
  // Server-side auth check
  const { user } = await requireAuth()
  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground mb-6">You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Check Stripe config server-side
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  if (!supabase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md mx-auto text-center py-16">
          <h3 className="text-xl font-semibold mb-2">Unable to load page</h3>
          <p className="text-muted-foreground mb-6">Supabase client could not be initialized.</p>
        </div>
      </div>
    )
  }
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('stripe_publishable_key, stripe_secret')
    .limit(1)
    .maybeSingle()

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
            Please configure your Stripe publishable key and secret key to create products.
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

  // All good – render client component
  return <CreateProductClient />
}
