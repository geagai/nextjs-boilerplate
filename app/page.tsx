
import { Hero } from '@/components/hero'
import { TechStack } from '@/components/tech-stack'
import { Features } from '@/components/features'
import { PricingSection } from '@/components/pricing-section'
import { MobileShowcase } from '@/components/mobile-showcase'
import { DeveloperExperience } from '@/components/developer-experience'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TechStack />
      <Features />
      <PricingSection />
      <MobileShowcase />
      <DeveloperExperience />
      <ContactSection />
      <Footer />
    </div>
  )
}
