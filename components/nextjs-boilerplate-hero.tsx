'use client'

import { motion } from 'framer-motion'
import { 
  Code2, 
  Zap, 
  Shield, 
  Smartphone, 
  Database, 
  TestTube,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const keyHighlights = [
  'Next.js 15 + React 19 + TypeScript',
  'Supabase Auth + Database + Real-time',
  'Stripe Payments + Subscriptions',
  'Mobile App with Capacitor',
  'Testing Suite + Storybook',
  'MCP Integrations + Analytics'
]

export function NextJSBoilerplateHero() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                Production-Ready Boilerplate
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">NextJS Boilerplate</span> That Ships
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Jumpstart your next project with a battle-tested foundation. Complete with authentication, payments, mobile support, testing, and all the integrations you need to build and deploy faster.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {keyHighlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{highlight}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#features">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Feature Icons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Top Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Modern Stack</h3>
                <p className="text-sm text-muted-foreground">Next.js 15, React 19, TypeScript</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Enterprise Ready</h3>
                <p className="text-sm text-muted-foreground">Auth, RBAC, Security</p>
              </motion.div>

              {/* Bottom Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mobile First</h3>
                <p className="text-sm text-muted-foreground">iOS & Android Ready</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Development</h3>
                <p className="text-sm text-muted-foreground">Hot Reload + Testing</p>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -top-4 -right-4 bg-primary/5 rounded-full p-4 border border-primary/20"
            >
              <Database className="h-8 w-8 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -bottom-4 -left-4 bg-primary/5 rounded-full p-4 border border-primary/20"
            >
              <TestTube className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
