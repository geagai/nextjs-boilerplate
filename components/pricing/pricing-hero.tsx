
'use client'

import { motion } from 'framer-motion'
import { Crown, Zap, Users } from 'lucide-react'

export function PricingHero() {
  return (
    <section className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
        >
          <Crown className="w-4 h-4 mr-2" />
          Transparent Pricing
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
        >
          Choose Your <span className="gradient-text">Perfect</span> Plan
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Start free and scale as you grow. All plans include core features with increasing limits and premium support.
        </motion.p>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            14-day free trial
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary" />
            No setup fees
          </div>
          <div className="flex items-center">
            <Crown className="w-4 h-4 mr-2 text-primary" />
            Cancel anytime
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
