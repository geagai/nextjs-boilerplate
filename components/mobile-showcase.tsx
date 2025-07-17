
'use client'

import { motion } from 'framer-motion'
import { Smartphone, Zap, Camera, MapPin, Bell, Fingerprint } from 'lucide-react'

const mobileFeatures = [
  {
    icon: Zap,
    title: 'Native Performance',
    description: 'Optimized for mobile with native device capabilities'
  },
  {
    icon: Camera,
    title: 'Camera Access',
    description: 'Seamless camera integration for photo capture'
  },
  {
    icon: MapPin,
    title: 'Geolocation',
    description: 'GPS and location services integration'
  },
  {
    icon: Bell,
    title: 'Push Notifications',
    description: 'Real-time notifications across platforms'
  },
  {
    icon: Fingerprint,
    title: 'Biometric Auth',
    description: 'Touch ID and Face ID authentication'
  }
]

export function MobileShowcase() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Mobile-First Architecture
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Built with Capacitor for seamless iOS and Android deployment. 
                Your web app becomes a native mobile experience with full access to device features.
              </p>
            </div>

            <div className="space-y-6">
              {mobileFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Cross-Platform Deployment</h4>
              <p className="text-sm text-muted-foreground">
                One codebase deploys to web, iOS App Store, and Google Play Store. 
                Maintain feature parity across all platforms with minimal configuration.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="bg-gray-800 rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-background rounded-[2.5rem] overflow-hidden w-64 h-[500px] relative">
                  {/* Phone Content */}
                  <div className="h-full bg-gradient-to-br from-background to-muted/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-sm">NextGeag BP</span>
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="bg-card rounded-lg p-4 shadow-sm">
                        <div className="h-2 bg-primary/20 rounded mb-2"></div>
                        <div className="h-2 bg-muted rounded w-2/3"></div>
                      </div>
                      <div className="bg-card rounded-lg p-4 shadow-sm">
                        <div className="h-2 bg-primary/20 rounded mb-2"></div>
                        <div className="h-2 bg-muted rounded w-3/4"></div>
                      </div>
                      <div className="bg-card rounded-lg p-4 shadow-sm">
                        <div className="h-2 bg-primary/20 rounded mb-2"></div>
                        <div className="h-2 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="bg-primary/10 rounded-lg h-12 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-primary/10 rounded-lg h-12 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-primary/10 rounded-lg h-12 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
              >
                <Bell className="w-5 h-5" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full p-3 shadow-lg"
              >
                <Zap className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
