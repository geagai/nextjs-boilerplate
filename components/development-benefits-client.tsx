'use client'

import { motion } from 'framer-motion'
import { Bot, Zap, Shield, Target, Settings, BarChart } from 'lucide-react'

interface DevelopmentBenefitsClientProps {
  adminSettings: any
}

export default function DevelopmentBenefitsClient({ adminSettings }: DevelopmentBenefitsClientProps) {
  const benefits = [
    {
      icon: Bot,
      title: "Custom AI Agent Development",
      description: "Leveraging advanced tools like AutoGen Studio and CrewAI, we craft custom AI agents tailored to your unique business needs. Whether you need virtual assistance, task automation, or decision-making support, our team creates AI agents that are flexible enough to adapt to future changes.",
    },
    {
      icon: Settings,
      title: "AI Agent Integration",
      description: "Whether you prefer single-agent or multi-agent systems, we ensure seamless integration into your workflows. Using advanced techniques in API architecture, microservices, and containerization, we streamline data flow and foster smooth collaboration between AI agents and your systems.",
    },
    {
      icon: Target,
      title: "AI Agent Strategy Consulting",
      description: "From evaluating your current setup to identifying AI agent implementation opportunities, we provide tailored consulting for successful collaboration. Our consulting encompasses determining the ideal AI agent type, selecting the appropriate LLM, and defining the necessary tech stack.",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Our AI agents are designed for maximum efficiency and speed. We optimize response times, reduce computational costs, and ensure your agents can handle high-volume tasks while maintaining accuracy and reliability.",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "We implement robust security measures and ensure compliance with industry standards. Your AI agents are built with data protection, privacy controls, and secure communication protocols to safeguard your business operations.",
    },
    {
      icon: BarChart,
      title: "Analytics & Monitoring",
      description: "Comprehensive monitoring and analytics tools help you track agent performance, user interactions, and business impact. Get detailed insights into how your AI agents are driving results and areas for continuous improvement.",
    },
  ]

  const getCardStyle = () => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        return {
          backgroundColor: adminSettings?.dark_background_color || '#1a1a1a',
          borderColor: adminSettings?.dark_primary_color || '#3872BB',
        }
      } else {
        return {
          backgroundColor: adminSettings?.background_color || '#ffffff',
          borderColor: adminSettings?.primary_color || '#3872BB',
        }
      }
    }
    return {
      backgroundColor: adminSettings?.background_color || '#ffffff',
      borderColor: adminSettings?.primary_color || '#3872BB',
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-7xl mx-auto mb-16"
          >
            <h2 
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
              style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
            >
              Our AI Agent Development Benefits & Solutions
            </h2>
            <p 
              className="text-xl leading-relaxed"
              style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
            >
              We are the #1 AI Agent Development company, and our expert AI Agent Development and Support team is committed to assisting our clients in developing and enhancing their AI platforms.
            </p>
          </motion.div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {benefits.map((benefit, index) => {
             const Icon = benefit.icon
             return (
               <motion.div
                 key={benefit.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: index * 0.1 }}
                 viewport={{ once: true }}
                 className="p-8 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                 style={getCardStyle()}
               >
                 <div className="flex justify-center mb-6">
                   <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                     <Icon className="h-6 w-6 text-primary" />
                   </div>
                 </div>
                 <h3 
                   className="text-xl font-bold mb-3"
                   style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
                 >
                   {benefit.title}
                 </h3>
                 <p 
                   className="leading-relaxed"
                   style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
                 >
                   {benefit.description}
                 </p>
               </motion.div>
             )
           })}
         </div>
      </div>
    </section>
  )
}
