
import { getServerSession } from '@/lib/auth'
import { PricingHero } from '@/components/pricing/pricing-hero'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { PricingFAQ } from '@/components/pricing/pricing-faq'
import { getStripeProductsCached } from '@/lib/stripe-cache'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const sessionData = await getServerSession()

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-muted-foreground">Unable to load pricing information.</p>
        </div>
      </div>
    )
  }
  
  const { data: settings } = await supabase
    .from("admin_settings")
    .select("stripe_publishable_key, stripe_secret, pricing_page_headline, pricing_page_description, pricing_page_faq, header_background_color, dark_header_background_color")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PricingHero
          headline={settings?.pricing_page_headline}
          description={settings?.pricing_page_description}
        />
        
        {!hasStripeConfig ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stripe Configuration Required</h3>
              <p className="text-muted-foreground mb-6">
                Please configure your Stripe publishable key and secret key to display pricing.
              </p>
              <a
                href="/admin-settings"
                className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                Configure Stripe Settings
              </a>
            </div>
          </div>
        ) : (
          <>
            <PricingCards 
              session={sessionData} 
              products={await getStripeProductsCached()} 
              publishableKey={publishableKey}
            />
          </>
        )}

        <PricingFAQ
          faqs={settings?.pricing_page_faq}
          headerBackgroundColor={settings?.header_background_color}
          darkHeaderBackgroundColor={settings?.dark_header_background_color}
        />
      </div>
    </div>
  )
}
