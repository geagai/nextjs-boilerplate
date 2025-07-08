
import { getServerSession } from '@/lib/auth'
import { PricingHero } from '@/components/pricing/pricing-hero'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { PricingFAQ } from '@/components/pricing/pricing-faq'
import { getStripeProductsCached } from '@/lib/stripe-cache'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const sessionData = await getServerSession()
  const products = await getStripeProductsCached()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PricingHero />
        <PricingCards session={sessionData} products={products} />
        <PricingFAQ />
      </div>
    </div>
  )
}
