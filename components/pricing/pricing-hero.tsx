
'use client'

interface PricingHeroProps {
  headline?: string | null
  description?: string | null
}

export function PricingHero({ headline, description }: PricingHeroProps) {
  return (
    <div className="text-center mb-4">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-headline">
        {headline || 'Choose Your Perfect Plan'}
      </h1>
      <p className="mt-6 text-xl text-paragraph max-w-2xl mx-auto">
        {description || 'Start free and scale as you grow. All plans include core features with increasing limits and premium support.'}
      </p>
    </div>
  )
}
