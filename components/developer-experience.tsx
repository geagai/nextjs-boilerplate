
'use client'

import { motion } from 'framer-motion'
import { Code2, TestTube, Palette, GitBranch, Zap, Shield } from 'lucide-react'

const devTools = [
  {
    icon: Code2,
    title: 'Storybook Integration',
    description: 'Component-driven development with interactive documentation and testing playground.'
  },
  {
    icon: TestTube,
    title: 'Testing Suite',
    description: 'Vitest for unit tests, Playwright for e2e testing. Comprehensive test coverage out of the box.'
  },
  {
    icon: Palette,
    title: 'Design System',
    description: 'Radix UI components with Tailwind CSS and Tiptap rich text editing. Consistent, accessible, and beautiful by default.'
  },
  {
    icon: GitBranch,
    title: 'Monorepo Ready',
    description: 'Optimized for team collaboration with semantic versioning and CI/CD pipeline configuration.'
  },
  {
    icon: Zap,
    title: 'Hot Reload',
    description: 'Lightning-fast development with Next.js 15 Turbopack and optimized build pipeline.'
  },
  {
    icon: Shield,
    title: 'Type Safety',
    description: 'Strict TypeScript configuration with Supabase-generated types for end-to-end type safety.'
  }
]

export function DeveloperExperience() {
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
            Developer Experience First
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built by developers, for developers. Every tool and configuration is optimized for productivity and maintainability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {devTools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-background rounded-xl p-6 border shadow-sm card-hover">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{tool.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-background rounded-xl border shadow-sm overflow-hidden"
        >
          <div className="bg-muted/50 px-6 py-4 border-b">
            <h3 className="font-semibold">Quick Start Example</h3>
          </div>
          <div className="p-6">
            <pre className="text-sm text-muted-foreground overflow-x-auto">
              <code>{`
# Clone and setup
git clone https://github.com/your-username/your-project
cd nextgeag-bp
npm install

# Configure environment
cp .env.example .env.local
# Add your Supabase credentials

# Setup database
# Configure your Supabase project
# Run database migrations if needed
npm run db:seed

# Start development
npm run dev

# Your app is ready at http://localhost:3000
              `}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
