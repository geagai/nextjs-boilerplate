import { Suspense } from 'react'
import { requireAuth, isAdmin } from '@/lib/auth'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import EditProductClient from './edit-product-client'

export default async function EditProductStripePage() {
  // Server-side auth check
  const { user } = await requireAuth()
  const userIsAdmin = isAdmin(user)

  // Check Stripe configuration
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }
  
  const { data: settings, error: settingsError } = await supabase
    .from('admin_settings')
    .select('stripe_secret, stripe_publishable_key')
    .single()

  // Use only .env variables for Stripe config
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
  const hasStripeConfig = !!publishableKey;

  if (!hasStripeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Stripe Configuration Required</h3>
                        <p className="text-muted-foreground mb-6">
                Please set <code>NEXT_PUBLIC_STRIPE_KEY</code> as an environment variable in your hosting provider's dashboard or in your local <code>.env</code> file to enable Stripe product editing.
              </p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <EditProductClient 
        isAdmin={userIsAdmin}
        hasStripeConfig={hasStripeConfig}
      />
    </Suspense>
  )
}
