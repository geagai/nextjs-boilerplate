import { requireAuth, isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import CreateProductClient from './create-product-client'

export default async function CreateProductStripePage() {
  // Server-side auth check
  const { user } = await requireAuth()
  if (!isAdmin(user)) {
    redirect('/dashboard')
  }

  // Check Stripe config server-side
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('stripe_publishable_key, stripe_secret')
    .limit(1)
    .maybeSingle()

  if (!settings?.stripe_secret || !settings?.stripe_publishable_key) {
    // redirect to settings with notice
    redirect('/settings?tab=stripe')
  }

  // All good – render client component
  return <CreateProductClient />
}
