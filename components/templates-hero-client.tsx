'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github, Zap, Shield, Smartphone, PenTool, TrendingUp } from 'lucide-react'

interface TemplatesHeroClientProps {
  adminSettings: any
}

export default function TemplatesHeroClient({ adminSettings }: TemplatesHeroClientProps) {
  const getStartedButtonStyle = {
    color: adminSettings?.button_text_color || adminSettings?.dark_button_text_color || '#ffffff'
  }

  const getPrimaryButtonStyle = () => {
    // Check if we're in dark mode by looking at the document
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        return {
          backgroundColor: adminSettings?.dark_primary_color || adminSettings?.dark_button_color || '#3872BB',
          color: adminSettings?.dark_button_text_color || '#ffffff'
        }
      } else {
        return {
          backgroundColor: adminSettings?.primary_color || adminSettings?.button_color || '#3872BB',
          color: adminSettings?.button_text_color || '#ffffff'
        }
      }
    }
    // Default fallback
    return {
      backgroundColor: adminSettings?.primary_color || adminSettings?.button_color || '#3872BB',
      color: adminSettings?.button_text_color || '#ffffff'
    }
  }

  return (
    <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
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
            className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight"
            style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
          >
            Templates & <span className="gradient-text">Repos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
          >
            Jumpstart your next project with our collection of production-ready software templates. 
            Each template is battle-tested and includes essential features like authentication, payments, 
            and modern development practices to help you ship faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="#templates">
              <Button size="lg" className="px-8 py-6 btn-glow">
                Explore Templates
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" className="px-8 py-6" style={getPrimaryButtonStyle()}>
                Get Membership
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
