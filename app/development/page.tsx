import { DevelopmentHero } from '@/components/development-hero'
import { DevelopmentFeatures } from '@/components/development-features'
import { DevelopmentBenefits } from '@/components/development-benefits'
import { DevelopmentProcess } from '@/components/development-process'
import { DevelopmentTechStack } from '@/components/development-tech-stack'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Agent Development Services | Advanced AI Solutions',
  description: 'We create intelligent AI agents using leading-edge tools, technology and AI Models. Our AI Agents handle research, analysis, code generation, reviews, audits, online exploration, sales and segmentation.',
  keywords: 'AI agent development, AI automation, intelligent agents, AI consulting, custom AI solutions, AI integration',
  openGraph: {
    title: 'AI Agent Development Services | Advanced AI Solutions',
    description: 'We create intelligent AI agents using leading-edge tools, technology and AI Models. Our AI Agents handle research, analysis, code generation, reviews, audits, online exploration, sales and segmentation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agent Development Services | Advanced AI Solutions', 
    description: 'We create intelligent AI agents using leading-edge tools, technology and AI Models. Our AI Agents handle research, analysis, code generation, reviews, audits, online exploration, sales and segmentation.',
  },
}

export default async function DevelopmentPage() {
  return (
    <div className="min-h-screen">
      <DevelopmentHero />
      <DevelopmentBenefits />
      <DevelopmentFeatures />
      <DevelopmentProcess />
      <DevelopmentTechStack />
    </div>
  )
}
