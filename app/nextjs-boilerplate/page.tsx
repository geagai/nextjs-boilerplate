import { Hero } from '@/components/hero'
import { TechStack } from '@/components/tech-stack'
import { Features } from '@/components/features'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { getServerSession } from '@/lib/auth'
import { getStripeProductsCached } from '@/lib/stripe-cache'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { MobileShowcase } from '@/components/mobile-showcase'
import { DeveloperExperience } from '@/components/developer-experience'
import { ContactSection } from '@/components/contact-section'

export default async function NextjsBoilerplatePage() {
  const sessionData = await getServerSession();

  // Use only .env variables for Stripe config (match /pricing)
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
  const hasStripeConfig = publishableKey;

  return (
    <div className="min-h-screen">
      <Hero />
      <TechStack />
      <Features />
      {/* Replace PricingSection with PricingCards logic */}
      {hasStripeConfig ? (
        <PricingCards 
          session={sessionData} 
          products={await getStripeProductsCached() ?? []} 
          publishableKey={publishableKey}
          columns={3}
          categoryFilter="Software" // Only show Software category products
        />
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stripe Configuration Required</h3>
            <p className="text-muted-foreground mb-6">
              Please configure your Stripe keys to display pricing.
            </p>
            <Link
              href="/admin-settings"
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              Configure Stripe Settings
            </Link>
          </div>
        </div>
      )}
      <MobileShowcase />
      <DeveloperExperience />
      <ContactSection />
    </div>
  );
} 