import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Clock, Shield, Zap, Users, BarChart3, MessageSquare, Calendar, CheckCircle, Globe, Lock, Server, Cpu, Database, Key, Eye, ShieldCheck, Globe2, Zap as Lightning, Route, User, Search, Target, ArrowRight, Phone, QrCode, Languages, Smartphone } from "lucide-react"

export const metadata: Metadata = {
  title: 'AI Email Outreach - Intelligent Email Automation That Converts | Reach Them',
  description: 'Transform your business with AI email outreach that finds warm leads, scales campaigns, and reaches primary inboxes. Turn prospects into clients with intelligent email automation.',
  keywords: 'AI email outreach, cold email automation, email marketing, lead generation, sales automation, email campaigns, AI personalization',
}

export default function AIEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-[75rem] mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 mt-0 pt-0 bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent" style={{ lineHeight: '1' }}>
            Find, Contact & Close Your Ideal Clients
          </h1>
          <p className="text-xl text-paragraph max-w-3xl mx-auto">
            Instantly helps you find warm leads, scale email campaigns, reach primary inboxes, engage smarter and win more with AI. 
            Transform your outbound sales with intelligent email automation that drives real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
              <a href="/contact">Schedule Demo</a>
            </Button>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Unlimited Email Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect unlimited email addresses and automatically rotate sending across them to scale your outreach without limits.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-xl">Primary Inbox Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Continuously boost email deliverability with enterprise-grade tools that keep your emails out of spam folders.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Advanced Lead Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Target only the people who will resonate with your message using advanced filters and buying signals.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* What is AI Email Outreach Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              What is AI Email Outreach
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              AI-powered email outreach that finds warm leads, scales campaigns, and reaches primary inboxes. Build the perfect 
              email automation system to handle prospecting, follow-ups, and all your outbound sales needs. Our AI technology 
              makes it simple to integrate the latest email intelligence into your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-purple-600">Transform Your Outbound Sales</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Scale email campaigns with unlimited accounts and intelligent rotation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Reach primary inboxes with enterprise-grade deliverability tools</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Find warm leads using advanced filters and AI-powered research</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Personalize content at scale with AI prompts and dynamic variables</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <Mail className="w-16 h-16 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg font-semibold text-purple-600">AI-Powered Email Intelligence</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent">
              How AI Email Outreach Works
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Our AI email platform works in four simple steps to transform your outbound sales process and drive real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Scale</h3>
              <p className="text-paragraph">
                Connect unlimited email accounts and let AI automatically rotate sending across them for maximum scale.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 dark:bg-violet-900 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-violet-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Warm Leads</h3>
              <p className="text-paragraph">
                Use advanced filters and AI research to discover prospects who are ready to buy and will resonate with your message.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalize & Send</h3>
              <p className="text-paragraph">
                AI crafts personalized content using dynamic variables and prompts to make every email feel human and relevant.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 dark:bg-violet-900 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-violet-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimize & Convert</h3>
              <p className="text-paragraph">
                Track performance, handle responses, and optimize campaigns in real-time to maximize conversions and revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Key Features That Drive Results
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Everything you need to scale your email outreach and turn prospects into paying clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-center">Unlimited Email Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect unlimited email addresses and automatically rotate sending across them. The more accounts you add, 
                  the more emails you can send, and the more new customers you can win.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-xl text-center">Enterprise Deliverability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Continuously boost email deliverability with enterprise-grade tools. Customize automated deliverability 
                  interactions and never worry about getting stuck in spam again.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-center">Advanced Lead Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  From technologies to headcount and revenue - target only the people you know will resonate with your message 
                  using advanced filters and buying signals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-xl text-center">AI Content Writer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Prompt AI inside the platform to craft personalization variables and entire sequences for each prospect. 
                  Automate follow-up on out-of-office responders and common replies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-center">Campaign Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track campaign performance beyond vanity metrics with reporting on opportunities, pipeline, conversions, 
                  and revenue driven. Scale what works and optimize what doesn't.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-xl text-center">Unibox Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Manage conversations across inboxes in one place. AI custom reply labels automatically categorize responses 
                  so you can focus on moving your pipeline forward.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent">
            Ready to Transform Your Email Outreach?
          </h2>
          <p className="text-xl text-paragraph max-w-3xl mx-auto mb-8">
            Join thousands of agencies, sellers, freelancers, and teams who are already scaling their outbound sales with AI-powered email automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
              <a href="/contact">Schedule Demo</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
