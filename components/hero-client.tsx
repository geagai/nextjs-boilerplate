'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Github, Zap, Shield, Smartphone, Settings } from 'lucide-react'

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
                The Next Great<br />
                <span className="gradient-text"> NextJS Application</span>
                <br /><span className="gradient-text"> Starts Here</span>
              </motion.h1>

                        {/* Subtitle */}
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
             >
               Use this incredible NextJS Boilerplate to create your amazing application
               <br className="hidden lg:block" />
               using the power of AI Coding Assistants.
             </motion.p>

                           {/* Three Columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12"
              >
                                                               {/* Left Column - App Setup Card */}
                 <div className="flex flex-col items-center">
                   <Card className="h-full card-hover w-full">
                     <CardHeader className="text-center pb-8">
                       <div className="flex justify-center mb-4">
                         <Settings className="h-12 w-12 text-primary" />
                       </div>
                       <CardTitle className="text-2xl">App Setup Guide</CardTitle>
                       <CardDescription className="text-base text-left">
                         Click the button below to start the step by step NextJS Application Setup Guide
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6 pt-0">
                       <Link href="/deploy-guide">
                         <Button 
                           className="w-full"
                           variant="outline"
                         >
                           Get Started
                         </Button>
                       </Link>
                     </CardContent>
                   </Card>
                 </div>

                               {/* Middle Column - AI Agents Card */}
                <div className="flex flex-col items-center">
                  <Card className="h-full card-hover w-full">
                    <CardHeader className="text-center pb-8">
                      <div className="flex justify-center mb-4">
                        <Zap className="h-12 w-12 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">AI Agents</CardTitle>
                      <CardDescription className="text-base text-left">
                        Use the Geag AI Agents to come up with application ideas, generate software development PRDs, video coding task generation and much more.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                      <a 
                        href="https://agent.geag.ai/agents" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button 
                          className="w-full"
                          variant="outline"
                        >
                          Free Trial
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>

                               {/* Right Column - Join the Community Card */}
                <div className="flex flex-col items-center">
                  <Card className="h-full card-hover w-full">
                    <CardHeader className="text-center pb-8">
                      <div className="flex justify-center mb-4">
                        <Github className="h-12 w-12 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">Join the Community</CardTitle>
                      <CardDescription className="text-base text-left">
                        Join our Skool Community and get daily Web and Mobile application ideas with prompts, get access to premium GitHub repos, how to video tutorial courses and much more.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                      <a 
                        href="https://www.skool.com/daily-business-startup-ideas-4055" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button 
                          className="w-full"
                          variant="outline"
                        >
                          Join the Community
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>
             </motion.div>

          

          

          
        </motion.div>
      </div>
    </section>
  )
} 