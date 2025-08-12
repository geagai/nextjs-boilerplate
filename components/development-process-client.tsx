'use client'

import { motion } from 'framer-motion'
import { Search, PenTool, TestTube, Rocket } from 'lucide-react'

interface DevelopmentProcessClientProps {
  adminSettings: any
}

export default function DevelopmentProcessClient({ adminSettings }: DevelopmentProcessClientProps) {
  const processSteps = [
    {
      number: "01",
      icon: Search,
      title: "Discover & Strategize",
      description: "We begin by understanding your goals, challenges, and vision. Our team crafts a tailored roadmap to guide your project."
    },
    {
      number: "02", 
      icon: PenTool,
      title: "Design & Develop",
      description: "With a user-centric approach, we design and develop your AI solution using cutting-edge tools and methodologies."
    },
    {
      number: "03",
      icon: TestTube,
      title: "Test & Optimize",
      description: "Our rigorous testing ensures a secure, efficient, and flawless platform. We optimize performance for maximum scalability."
    },
    {
      number: "04",
      icon: Rocket,
      title: "Launch & Support",
      description: "We assist with seamless deployment and provide ongoing support to ensure your AI solution thrives in the market."
    }
  ]

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
            Our AI Agent Development <span className="gradient-text">Process</span>
          </h2>
          <p 
            className="text-xl leading-relaxed"
            style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
          >
            A proven methodology that ensures successful AI agent implementation from concept to deployment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              {/* Connection line (hidden on last item) */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-1/2 z-0" />
              )}
              
              <div className="relative z-10">
                {/* Step number */}
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold border-4"
                  style={{ 
                    backgroundColor: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB',
                    color: adminSettings?.button_text_color || '#ffffff',
                    borderColor: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB'
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <step.icon 
                    size={48} 
                    className="mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ color: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB' }}
                  />
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p 
                  className="leading-relaxed"
                  style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl border-2" style={{ borderColor: adminSettings?.primary_color || '#3872BB' }}>
            <div className="text-left">
              <div 
                className="text-lg font-semibold"
                style={{ color: adminSettings?.headline_text_color || adminSettings?.dark_headline_text_color }}
              >
                Ready to get started?
              </div>
              <div 
                className="text-sm"
                style={{ color: adminSettings?.paragraph_text_color || adminSettings?.dark_paragraph_text_color }}
              >
                Let's discuss your AI agent development needs
              </div>
            </div>
            <a
              href="/contact"
              className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: adminSettings?.primary_color || adminSettings?.dark_primary_color || '#3872BB',
                color: adminSettings?.button_text_color || '#ffffff'
              }}
            >
              Get Started
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
