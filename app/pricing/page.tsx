
import { getServerSession } from '@/lib/auth'
import { PricingHero } from '@/components/pricing/pricing-hero'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { PricingFAQ } from '@/components/pricing/pricing-faq'
import { getStripeProductsCached } from '@/lib/stripe-cache'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const sessionData = await getServerSession()
  const products = await getStripeProductsCached()

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  const { data: settings } = await supabase
    .from("admin_settings")
    .select("pricing_page_headline, pricing_page_description, pricing_page_faq, header_background_color, dark_header_background_color")
    .limit(1)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PricingHero
          headline={settings?.pricing_page_headline}
          description={settings?.pricing_page_description}
        />
        <PricingCards session={sessionData} products={products} />
        <PricingFAQ
          faqs={settings?.pricing_page_faq}
          headerBackgroundColor={settings?.header_background_color}
          darkHeaderBackgroundColor={settings?.dark_header_background_color}
        />
      </div>
    </div>
  )
}
