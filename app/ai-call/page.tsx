import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Clock, Shield, Zap, Users, BarChart3, MessageSquare, Calendar, CheckCircle, Globe, Lock, Server, Cpu, Headphones, Mic, Volume2, Smartphone, Database, Key, Eye, ShieldCheck, Globe2, Zap as Lightning } from "lucide-react"

export const metadata: Metadata = {
  title: 'AI Call Agents - Intelligent Voice Agents That Sound Human | Reach Them',
  description: 'Transform your business with AI phone agents that sound human, speak any language, and work 24/7. Handle sales, scheduling, and customer support with intelligent voice technology.',
  keywords: 'AI call agents, voice AI, phone automation, customer support AI, sales calls, appointment booking, voice agents, conversational AI',
}

export default function AICallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-[65rem] mx-auto">
                     <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 mt-0 pt-0 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '2' }}>
             AI Call Agents That Sound Human
           </h1>
          <p className="text-xl text-paragraph max-w-3xl mx-auto">
            Transform your business with intelligent voice agents that make personalized calls, handle objections naturally, 
            and work 24/7. Our AI technology understands context, speaks any language, and delivers exceptional customer experiences.
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
             <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
               <a href="/signup">Start Free Trial</a>
             </Button>
             <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
               <a href="/contact">Schedule Demo</a>
             </Button>
           </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Human-Like Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our AI agents understand context, handle objections naturally, and maintain engaging conversations that feel completely human.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Multi-Language Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Speak to customers in their preferred language with AI agents that fluently communicate in multiple languages.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">24/7 Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Never miss a customer call. Our AI agents work around the clock, handling inquiries and opportunities at any time.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* What is AI Call Agents Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              What is AI Call Agents
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              AI phone agents that sound human, speak any language, and work 24/7. Build the perfect employee to handle sales, 
              scheduling, and all your customer support needs. Our AI technology makes it simple to integrate the latest 
              conversational AI into your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Transform Your Customer Experience</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Handle thousands of calls simultaneously with auto-scaling infrastructure</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Integrate seamlessly with your existing CRM, scheduler, and business systems</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Reduce call costs while maintaining exceptional service quality</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Provide consistent, on-brand customer interactions every time</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <Phone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Starting at $0.09/minute</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Professional AI calls at enterprise scale</p>
                                 <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                   <a href="/signup">Get Started Today</a>
                 </Button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              How AI Call Agents Work
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Book an appointment. Update a CRM. Send a text. All in one workflow. Our AI agents don't just talk, 
              they take action and integrate with your existing systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Conversational Pathways</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Map out conversations and define decisions your AI makes. Our pathways ensure hallucination-proof AI interactions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Smart Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with your CRM, scheduler, ERP, or any external tool to take actions at the right moment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Human Handoff</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Warm transfers to human agents when needed, ensuring complex issues get personal attention.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Real-time analytics and insights to optimize your call strategies and improve conversion rates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              AI Call Agent Use Cases
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              From appointment booking to complex sales calls, our AI agents handle every type of customer interaction 
              with intelligence and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-center">Appointment Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automate scheduling calls, confirm appointments, and handle rescheduling requests. Integrate with 
                  your calendar system for seamless booking management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl text-center">Sales & Lead Qualification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Conduct outbound sales calls, qualify leads, handle objections, and schedule follow-up meetings. 
                  Our AI understands sales psychology and closing techniques.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Headphones className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-center">Customer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Handle customer inquiries, troubleshoot issues, process returns, and escalate complex problems 
                  to human agents when necessary.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enterprise Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Built to meet the evolving demands of modern enterprises with scalable solutions, real-time analytics, 
              and 99.99% uptime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Your OS for Customer Experience</h3>
              <p className="text-lg mb-6">
                For enterprises, our AI call agents go beyond phone calls. You'll gain access to campaign analytics, 
                model fine-tuning, warm transfers, SMS integration, and the ability to hook up any external tool.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Advanced campaign analytics and performance tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom model fine-tuning for industry-specific terminology</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Seamless human handoff and escalation protocols</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Multi-channel integration (phone, SMS, email)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Dedicated Infrastructure for Infinite Scale</h3>
              <p className="text-lg mb-6">
                Customer calls happen at critical moments—when they need help or when they're ready to take action. 
                With dedicated infrastructure, your enterprise will be prepared to scale and handle any number of concurrent calls.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>99.99% uptime with five 9's reliability</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Auto-scaling to handle thousands of concurrent calls</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Global infrastructure with regional compliance</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Real-time monitoring and alerting systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Compliance Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Security & Compliance
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Own your customer experience end-to-end with enterprise-grade security, compliance certifications, 
              and complete data sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Data In-House</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Store and manage your information in-house, reducing external risks and maintaining full control.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Follow strict security protocols with regular monitoring to ensure your data remains protected.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Globe2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">GDPR Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Follow EU privacy standards, guaranteeing transparency and secure handling of personal information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">HIPAA Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Prioritize security and privacy of sensitive customer data with full protection throughout.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-xl text-paragraph mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using AI call agents to increase efficiency, reduce costs, and deliver 
            exceptional customer service 24/7.
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
               <a href="/signup">Start Free Trial</a>
             </Button>
             <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
               <a href="/contact">Schedule Demo</a>
             </Button>
             <Button size="lg" variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-50" asChild>
               <a href="/pricing">View Pricing</a>
             </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
