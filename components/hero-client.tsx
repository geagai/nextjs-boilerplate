'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github, Zap, Shield, Smartphone, PenTool, TrendingUp } from 'lucide-react'

interface HeroClientProps {
  adminSettings: any
}

export default function HeroClient({ adminSettings }: HeroClientProps) {
  const getStartedButtonStyle = {
    color: adminSettings?.button_text_color || adminSettings?.dark_button_text_color || '#ffffff'
  }

  return (
    <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(56,114,187,0.10),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(56,114,187,0.08),transparent_45%)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-40" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-primary/20"
        >
          <Zap size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-20 text-primary/20"
        >
          <Shield size={50} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-20 text-primary/20"
        >
          <Smartphone size={35} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-60 right-40 text-primary/20"
        >
          <PenTool size={45} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-60 right-20 text-primary/20"
        >
          <TrendingUp size={40} />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight"
          >
            Advanced <span className="gradient-text">AI Agents</span> for
            <br />
            Developers and <span className="gradient-text">Teams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Create, customize, and deploy AI agents. Build faster with production-ready templates for web and mobile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/agents">
              <Button size="lg" className="px-8 py-6 btn-glow">
                Explore Agents
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="px-8 py-6">
                View Templates
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
} 