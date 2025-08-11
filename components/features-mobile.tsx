'use client'

import { motion } from 'framer-motion'
import { 
  Lock, 
  CreditCard, 
  Smartphone, 
  Shield, 
  Code2, 
  Zap,
  Database,
  MessageSquare,
  CheckSquare,
  Image,
  Palette,
  Sparkles,
  Users,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Cross-Platform Development',
    description: 'Build once, deploy everywhere with React Native and Expo. Native performance on iOS and Android with Expo development platform.'
  },
  {
    icon: Lock,
    title: 'User Authentication',
    description: 'Complete user registration and authentication system with Supabase. Secure login, signup, and session management.'
  },
  {
    icon: MessageSquare,
    title: 'AI Agent Chat Interface',
    description: 'Integrated AI chat functionality with intelligent responses, conversation history, and real-time messaging capabilities.'
  },
  {
    icon: CheckSquare,
    title: 'Task Manager',
    description: 'Full-featured task management system with create, edit, delete, and organize tasks with categories and priorities.'
  },
  {
    icon: Image,
    title: 'Image Analysis',
    description: 'Advanced image processing and analysis features using AI to extract insights, recognize objects, and process visual data.'
  },
  {
    icon: Palette,
    title: 'App Theme Settings',
    description: 'Customizable app themes with dark/light mode support, color schemes, and personalized user preferences.'
  },
  {
    icon: Code2,
    title: 'Completely Customizable',
    description: 'Modular architecture allowing easy customization of components, styling, and functionality to match your brand.'
  },
  {
    icon: Sparkles,
    title: 'Splash Screen',
    description: 'Professional splash screen with loading animations, brand integration, and smooth app launch experience.'
  },
  {
    icon: CreditCard,
    title: 'Stripe Integration',
    description: 'Complete payment processing with Stripe for one-time purchases, subscriptions, and secure payment handling.'
  },
  {
    icon: BarChart3,
    title: 'RevenueCat Billing',
    description: 'Mobile subscription management with RevenueCat for in-app purchases, subscription analytics, and revenue tracking.'
  },
  {
    icon: Database,
    title: 'Supabase Backend',
    description: 'Real-time database with PostgreSQL, authentication, storage, and edge functions for scalable mobile backend.'
  },
  {
    icon: Zap,
    title: 'Performance Optimized',
    description: 'Optimized for mobile performance with efficient rendering, memory management, and smooth user experience.'
  }
]

export function FeaturesMobile() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Mobile-First Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            React Expo Mobile App includes all the essential features and integrations to build production-ready mobile applications
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 border shadow-sm card-hover">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
