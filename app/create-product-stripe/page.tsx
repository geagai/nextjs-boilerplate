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
  const cookieStore = await cookies()
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
                Please set <code>NEXT_PUBLIC_STRIPE_KEY</code> as an environment variable in your hosting provider's dashboard or in your local <code>.env</code> file to enable Stripe product creation.
              </p>
        </div>
      </div>
    )
  }

  // All good – render client component
  return <CreateProductClient />
}
