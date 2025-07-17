
'use client'

import { motion } from 'framer-motion'
import { 
  Lock, 
  CreditCard, 
  Smartphone, 
  Shield, 
  Code2, 
  Zap,
  Database,
  TestTube,
  Users,
  BarChart3,
  Palette,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Complete Authentication',
    description: 'Supabase authentication with email/password login, session management, role-based access control, and secure user management.'
  },
  {
    icon: CreditCard,
    title: 'Stripe Payments',
    description: 'Full payment processing with 4 subscription tiers, webhook handling, customer portal, and payment history tracking.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Capacitor integration for iOS/Android deployment, responsive design, and native device feature access.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Arcjet integration for bot protection, rate limiting, WAF capabilities, and PII data redaction.'
  },
  {
    icon: Database,
    title: 'Type-Safe Database',
    description: 'Supabase PostgreSQL with auto-generated types, real-time subscriptions, and comprehensive database relations.'
  },
  {
    icon: Code2,
    title: 'MCP Server Integration',
    description: 'Model Context Protocol support with TaskMaster, Supabase, and GitHub integrations for easy setup and custom development workflows.'
  },
  {
    icon: TestTube,
    title: 'Testing Suite',
    description: 'Vitest for unit tests, Playwright for e2e testing, Storybook for component development and documentation.'
  },
  {
    icon: Zap,
    title: 'Performance Optimized',
    description: 'Next.js 15 with Turbopack, React 19 compiler, Server Components, and optimized build pipeline.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Monorepo architecture, semantic versioning, multi-environment support, and CI/CD pipeline configuration.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Ready',
    description: 'PostHog integration for user analytics, event tracking, feature flags, and performance monitoring.'
  },
  {
    icon: Palette,
    title: 'Design System',
    description: 'Radix UI components, Tiptap rich text editing, Tailwind CSS theming, dark mode support, and consistent design tokens.'
  },
  {
    icon: Globe,
    title: 'SEO Optimized',
    description: 'Dynamic metadata, JSON-LD structured data, Open Graph support, and automatic sitemap generation.'
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Ship Fast
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            NextGeag BP includes all the essential features and integrations to build production-ready applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 border shadow-sm card-hover">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
