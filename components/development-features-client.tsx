'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Code, Search, BarChart3, Users, Cog } from 'lucide-react'

interface DevelopmentFeaturesClientProps {
  adminSettings: any
}

export default function DevelopmentFeaturesClient({ adminSettings }: DevelopmentFeaturesClientProps) {
  const features = [
    {
      icon: MessageSquare,
      title: "Conversational AI",
      description: "Natural language processing and understanding for human-like interactions",
      benefits: ["Real-time responses", "Context awareness", "Multi-language support"]
    },
    {
      icon: Code,
      title: "Code Generation & Reviews",
      description: "Automated code creation, analysis, and quality assurance processes",
      benefits: ["Code optimization", "Bug detection", "Security audits"]
    },
    {
      icon: Search,
      title: "Research & Analysis",
      description: "Comprehensive data gathering and intelligent analysis capabilities",
      benefits: ["Market research", "Competitor analysis", "Trend identification"]
    },
    {
      icon: BarChart3,
      title: "Sales & Segmentation",
      description: "Customer segmentation and sales process automation for better conversion",
      benefits: ["Lead qualification", "Customer insights", "Sales forecasting"]
    },
    {
      icon: Users,
      title: "Multi-Agent Systems",
      description: "Coordinated AI agents working together for complex task completion",
      benefits: ["Task distribution", "Collaborative intelligence", "Scalable operations"]
    },
    {
      icon: Cog,
      title: "Process Automation",
      description: "End-to-end business process automation with intelligent decision making",
      benefits: ["Workflow optimization", "Error reduction", "24/7 operations"]
    }
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
            style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
          >
            <span className="gradient-text">Advanced Features</span> & Capabilities
          </h2>
          <p 
            className="text-xl leading-relaxed"
            style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
          >
            Our AI agents come equipped with cutting-edge capabilities to handle complex business challenges and deliver exceptional results.
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
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl border-2 border-transparent hover:border-primary/20 bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="mb-6 leading-relaxed"
                    style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
                  >
                    {feature.description}
                  </p>

                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB' }}
                        />
                        <span 
                          className="text-sm"
                          style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
                        >
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
