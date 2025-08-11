'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const technologies = [
  {
    name: 'React Native',
    logo: 'https://pluspng.com/img-png/react-logo-png-black-and-blue-atom-icon-screenshot-react-javascript-responsive-920x1000.png',
    description: 'Cross-platform mobile development'
  },
  {
    name: 'Expo',
    logo: 'https://avatars.githubusercontent.com/u/12504344?s=200&v=4',
    description: 'Development platform & tools'
  },
  {
    name: 'TypeScript',
    logo: 'https://i.pinimg.com/originals/6e/67/c9/6e67c9d30761c05e364e7e6d8b52eaa4.png',
    description: 'Type-safe development'
  },
  {
    name: 'Supabase',
    logo: 'https://i.pinimg.com/736x/cb/03/e4/cb03e4961860f0271e6ac73e663f26fa.jpg',
    description: 'Database & Authentication'
  },
  {
    name: 'Stripe',
    logo: 'https://i.pinimg.com/originals/f9/d1/0b/f9d10b7005257885d203cc66a96343cc.png',
    description: 'Payment processing'
  },
  {
    name: 'RevenueCat',
    logo: 'https://avatars.githubusercontent.com/u/42759512?s=200&v=4',
    description: 'Mobile subscription management'
  }
]

export function TechStackMobile() {
  return (
    <section id="tech-stack" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built with Modern Mobile Technologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            React Expo Mobile App leverages the latest and most powerful tools in the mobile development ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4 bg-muted rounded-lg overflow-hidden">
                  {tech.logo ? (
                    <Image
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {tech.name[0]}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
