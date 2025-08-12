'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Brain, Code, Search, Target, Zap } from 'lucide-react'

interface DevelopmentHeroClientProps {
  adminSettings: any
}

export default function DevelopmentHeroClient({ adminSettings }: DevelopmentHeroClientProps) {
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
    // Default fallback for light mode
    return {
      backgroundColor: adminSettings?.primary_color || adminSettings?.button_color || '#3872BB',
      color: adminSettings?.button_text_color || '#ffffff'
    }
  }

  const getSecondaryButtonStyle = () => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        return {
          backgroundColor: 'transparent',
          color: adminSettings?.dark_button_text_color || adminSettings?.dark_primary_color || '#ffffff',
          border: `2px solid ${adminSettings?.dark_primary_color || adminSettings?.dark_button_color || '#3872BB'}`
        }
      } else {
        return {
          backgroundColor: 'transparent',
          color: adminSettings?.button_text_color || adminSettings?.primary_color || '#3872BB',
          border: `2px solid ${adminSettings?.primary_color || adminSettings?.button_color || '#3872BB'}`
        }
      }
    }
    return {
      backgroundColor: 'transparent',
      color: adminSettings?.primary_color || '#3872BB',
      border: `2px solid ${adminSettings?.primary_color || '#3872BB'}`
    }
  }

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-40" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-primary/20"
        >
          <Bot size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-20 text-primary/20"
        >
          <Brain size={50} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-20 text-primary/20"
        >
          <Code size={35} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-60 right-40 text-primary/20"
        >
          <Search size={45} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-60 right-20 text-primary/20"
        >
          <Target size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-32 right-60 text-primary/20"
        >
          <Zap size={38} />
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
            <span className="gradient-text">AI Agent Development</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
          >
            We create intelligent AI agents using leading-edge tools, technology and AI Models. By harnessing the power of large language models (LLMs) and our extensive expertise, our AI Agents are equipped to handle a wide array of tasks, including research, analysis, code generation, reviews, audits, online exploration, sales and segmentation.
          </motion.p>

                     <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.45 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
           >
                           <Link href="/contact">
                <Button size="lg" className="px-8 py-6 btn-glow">
                  Start Your Project
                </Button>
              </Link>
                           <Link href="#features">
                <Button size="lg" className="px-8 py-6" style={getPrimaryButtonStyle()}>
                  View Our Services
                </Button>
              </Link>
           </motion.div>

                     {/* Key Statistics */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-muted-foreground/20"
           >
                           <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold" style={{ color: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB' }}>10,000+ Agent Runs</div>
                <div className="text-sm text-muted-foreground">AI Agents Deployed</div>
              </div>
             <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold" style={{ color: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB' }}>99%</div>
               <div className="text-sm text-muted-foreground">Task Accuracy</div>
             </div>
             <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold" style={{ color: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB' }}>24/7</div>
               <div className="text-sm text-muted-foreground">Agent Support</div>
             </div>
             <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold" style={{ color: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB' }}>15+</div>
               <div className="text-sm text-muted-foreground">Years Experience</div>
             </div>
           </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
