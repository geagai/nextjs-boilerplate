'use client'

import { motion } from 'framer-motion'
import { 
  Bot, 
  Code2, 
  Zap, 
  Smartphone, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const platformFeatures = [
  { icon: Bot, title: 'AI Agent Marketplace', description: 'Curated agents for content, code, research, and operations.' },
  { icon: Code2, title: 'Developer Optimization', description: 'Code generation, debugging help, docs, task flows.' },
  { icon: Zap, title: 'Vibe Coding', description: 'Context-aware guidance aligned to your project and patterns.' },
  { icon: Smartphone, title: 'Templates for Web & Mobile', description: 'NextJS boilerplate + mobile app starters, prewired.' }
]

const howItWorks = [
  { step: '1', title: 'Pick an Agent', desc: 'Choose an agent or start from a template.' },
  { step: '2', title: 'Customize', desc: 'Adjust prompts, settings, and outputs for your workflow.' },
  { step: '3', title: 'Ship Faster', desc: 'Automate tasks and build with production-ready scaffolding.' }
]

const templateFeatures = [
  'Auth + RBAC',
  'Stripe Subscriptions',
  'Type-safe DB (Supabase)',
  'Testing (Vitest + Playwright)',
  'MCP Integrations',
  'SEO + Analytics'
]

export function AIPlatformInfo() {
  return (
    <section className="py-24 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Build Smarter with AI Agents + Templates</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            We help developers optimize software delivery and vibe-code with purpose-built AI agents and production-grade templates.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {platformFeatures.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="bg-card rounded-xl p-7 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {howItWorks.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 border"
            >
              <div className="text-3xl font-bold text-primary mb-2">{s.step}</div>
              <div className="font-semibold mb-1">{s.title}</div>
              <div className="text-sm text-muted-foreground">{s.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Templates CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 border shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Production-Ready Templates</h3>
              <p className="text-muted-foreground mb-6">Start from our NextJS boilerplate and mobile starters—auth, payments, testing, and integrations included.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {templateFeatures.map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nextjs-boilerplate">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/agents">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View All Agents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="w-16 h-8 bg-primary/20 rounded" />
                  <div className="w-16 h-8 bg-muted rounded" />
                  <div className="w-16 h-8 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
