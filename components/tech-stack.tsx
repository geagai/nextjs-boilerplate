
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const technologies = [
  {
    name: 'Next.js 15',
    logo: 'https://i.pinimg.com/originals/e3/82/52/e3825274a94bafc3f0282cae29c19972.png',
    description: 'React framework with App Router'
  },
  {
    name: 'React 19',
    logo: 'https://pluspng.com/img-png/react-logo-png-black-and-blue-atom-icon-screenshot-react-javascript-responsive-920x1000.png',
    description: 'Latest React with new hooks'
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
    name: 'Tailwind CSS',
    logo: 'https://logospng.org/download/tailwind-css/tailwind-css-1536.png',
    description: 'Utility-first styling'
  },
  {
    name: 'Capacitor',
    logo: 'https://static.vecteezy.com/system/resources/previews/013/432/843/original/cable-wire-joint-capacitors-blue-solid-logo-with-place-for-tagline-free-vector.jpg',
    description: 'Mobile app conversion'
  },
  {
    name: 'TipTap',
    logo: 'https://avatars.githubusercontent.com/u/57147217?s=200&v=4', // TipTap GitHub org logo
    description: 'Full blogging solution built in.'
  }
]

export function TechStack() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built with Modern Technologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            NextGeag BP leverages the latest and most powerful tools in the JavaScript ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
