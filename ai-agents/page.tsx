"use client"

// no side-effects or redirects needed
import Link from 'next/link'
import { Bot, Zap, Users, Shield, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'

export default function AIAgentsPage() {
  const { user, loading } = useAuth()

  // Show same content for all visitors, regardless of auth status

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const features = [
    {
      icon: Bot,
      title: 'Smart AI Agents',
      description: 'Create custom AI agents tailored to your specific needs and workflows.'
    },
    {
      icon: Zap,
      title: 'Instant Automation',
      description: 'Automate repetitive tasks and get instant responses from your AI assistants.'
    },
    {
      icon: Users,
      title: 'Collaborative Platform',
      description: 'Share your agents with the community and discover agents created by others.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main content */}
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-primary/10 mb-6">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Intelligent AI Agents
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Create, customize, and deploy AI agents that understand your needs. Automate tasks, find information, and boost your productivity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/agents">
                <Button size="lg" className="text-lg px-8 py-6">
                  Explore Agents
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AI Agents?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the future of productivity with our intelligent agent platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={idx}
                    className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who are already automating their workflows with AI agents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/agents">
                <Button size="lg" className="text-lg px-8 py-6">
                  Browse Agents
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 