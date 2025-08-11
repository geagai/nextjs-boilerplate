import { MobileHero } from '@/components/mobile-hero'
import { TechStackMobile } from '@/components/tech-stack-mobile'
import { FeaturesMobile } from '@/components/features-mobile'
import { PricingCards } from '@/components/pricing/pricing-cards'
import { getServerSession } from '@/lib/auth'
import { getStripeProductsCached } from '@/lib/stripe-cache'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { MobileShowcaseMobile } from '@/components/mobile-showcase-mobile'
import { DeveloperExperience } from '@/components/developer-experience'
import { ContactSection } from '@/components/contact-section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React Expo Mobile App with AI Features & Billing | Ship Faster',
  description: 'Jumpstart your mobile app development with a battle-tested React Native Expo template featuring AI chat, task management, image analysis, authentication, and integrated billing solutions.',
  keywords: 'React Native, Expo, mobile app, AI chat, task manager, image analysis, authentication, billing, Supabase, Stripe, RevenueCat',
  openGraph: {
    title: 'React Expo Mobile App with AI Features & Billing | Ship Faster',
    description: 'Jumpstart your mobile app development with a battle-tested React Native Expo template featuring AI chat, task management, image analysis, authentication, and integrated billing solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Expo Mobile App with AI Features & Billing | Ship Faster',
    description: 'Jumpstart your mobile app development with a battle-tested React Native Expo template featuring AI chat, task management, image analysis, authentication, and integrated billing solutions.',
  },
}

export default async function ReactExpoMobileAppPage() {
  const sessionData = await getServerSession();

  // Use only .env variables for Stripe config (match /pricing)
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
  const hasStripeConfig = publishableKey;

  return (
    <div className="min-h-screen">
      <MobileHero />
      
      {/* Membership Description */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#d8d8d8] rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed">
              Get access to all templates with the <strong>AI Elite Membership</strong>. This membership comes with instant access to all template, 5,000 monthly AI Credits, vibe coding video tutorials showing you how to launch your AI application idea in a day, access to the AI Business Idea Skool community, professional assistance consultations and much more. See the <Link href="/pricing" className="text-primary hover:underline">Pricing Page</Link> for more information.
            </p>
          </div>
        </div>
      </section>
      
      <TechStackMobile />
      <FeaturesMobile />
      {/* Replace PricingSection with PricingCards logic */}
      {hasStripeConfig ? (
        <PricingCards 
          session={sessionData} 
          products={await getStripeProductsCached() ?? []} 
          publishableKey={publishableKey}
          categoryFilter={undefined} // Show all categories like main pricing page
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
      <MobileShowcaseMobile />
      <DeveloperExperience />
      <ContactSection />
    </div>
  );
}
