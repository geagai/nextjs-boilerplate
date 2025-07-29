'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github, Zap, Shield, Smartphone } from 'lucide-react'

interface HeroClientProps {
  adminSettings: any
}

export default function HeroClient({ adminSettings }: HeroClientProps) {
  // Custom style for Get Started button - default to white text when no admin setting
  const getStartedButtonStyle = {
    color: adminSettings?.button_text_color || adminSettings?.dark_button_text_color || '#ffffff'
  }

  return (
         <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-primary/20"
        >
          <Zap size={40} />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 text-primary/20"
        >
          <Shield size={50} />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-20 text-primary/20"
        >
          <Smartphone size={35} />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >


                                {/* Main Headline */}
                                                                                               <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Advanced <span className="gradient-text">AI Agents</span> for
                <br />
                Business Automation and <span className="gradient-text">Growth</span>
              </motion.h1>

                        {/* Subtitle */}
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
             >
               Create, customize, and deploy AI agents that understand your needs.
               <br className="hidden lg:block" />
               Automate tasks, find information, and boost your productivity.
             </motion.p>

          

          

          
        </motion.div>
      </div>
    </section>
  )
} 