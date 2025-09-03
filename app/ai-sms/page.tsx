import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, Shield, Zap, Users, BarChart3, Smartphone, Calendar, CheckCircle, Globe, Lock, Server, Cpu, Headphones, Mic, Volume2, Database, Key, Eye, ShieldCheck, Globe2, Zap as Lightning, Phone, QrCode, Languages, Target, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: 'AI SMS - Intelligent Text Messaging That Converts Leads | Reach Them',
  description: 'Transform your business with AI text messaging that engages leads, schedules calls, and follows up 24/7. Turn old leads into meetings with intelligent SMS automation.',
  keywords: 'AI SMS, text messaging automation, lead engagement, SMS marketing, AI texting, conversational AI, lead nurturing, appointment scheduling',
}

export default function AISMSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-[65rem] mx-auto">
                     <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 mt-0 pt-0 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '2' }}>
             AI SMS Growth Platform
           </h1>
          <p className="text-xl text-paragraph max-w-3xl mx-auto">
            Meera's AI texting engages leads, schedules calls and follows up — so your team connects with more prospects with less effort.
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
                <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">9X Your Connect Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Constant cold calls and robotic chat bots annoy your customers. Meera uses a unique text messaging framework to turn more leads into calls.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Respond 24/7</CardTitle>
            <CardContent>
              <CardDescription className="text-base">
                Meera works like an AI sales assistant who never sleeps. It responds instantly to new leads, handles basic questions, and knows when to loop in your team.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Automate Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Reschedule missed meetings. Remind attendees about events. Or spark new conversations with old leads. Meera automates dozens of tedious follow-up tasks.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* What is AI SMS Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              What is AI SMS
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              AI text messaging that engages leads, schedules calls, and follows up automatically. Build the perfect AI sales assistant to handle lead nurturing, 
              appointment scheduling, and all your customer engagement needs. Our AI technology makes it simple to integrate intelligent texting into your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Transform Your Lead Engagement</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Handle thousands of text conversations simultaneously with auto-scaling infrastructure</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Integrate seamlessly with your existing CRM, scheduler, and business systems</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Reduce manual follow-up time while maintaining exceptional engagement quality</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Provide consistent, on-brand customer interactions every time</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Starting at $0.05 per message</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Professional AI texting at enterprise scale</p>
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
              How AI SMS Works
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Book an appointment. Update a CRM. Send a text. All in one workflow. Our AI texting doesn't just send messages, 
              it takes action and integrates with your existing systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Connect Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Meera knows when a new lead comes in and sends a relevant message right away.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Engage & Qualify</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Meera qualifies leads before scheduling a meeting with your team.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Transfer to Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Meera warm-transfers leads to your agents at the right moment.
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
                  Real-time analytics and insights to optimize your text strategies and improve conversion rates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              AI SMS Use Cases
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              From lead nurturing to appointment scheduling, our AI texting handles every type of customer interaction 
              with intelligence and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-center">Appointment Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automate scheduling texts, confirm appointments, and handle rescheduling requests. Integrate with 
                  your calendar system for seamless booking management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl text-center">Lead Nurturing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automate lead follow-up and engagement. Qualify leads, handle objections, and schedule follow-up meetings. 
                  Our AI understands sales psychology and engagement techniques.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-center">Inbound Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Scan a QR code or tap a link to open a pre-filled text. Generate leads through interactive marketing campaigns.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Industry Solutions Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Industry Solutions
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Tailored AI texting solutions for specific industries and use cases, designed to maximize engagement and conversion rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Higher Education</h3>
              <p className="text-lg mb-6">
                Increase your application rates with AI texting that engages prospective students, answers questions, 
                and guides them through the enrollment process.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Automate lead follow-up and engagement</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Schedule campus tours and information sessions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Handle application status updates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Increase lead-to-enrollment conversion rates</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Insurance & Financial Services</h3>
              <p className="text-lg mb-6">
                Automate policy renewals, loan applications, and customer service with AI texting that maintains 
                compliance while improving customer engagement.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Automate policy renewal reminders</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Qualify loan applications and schedule consultations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Handle customer service inquiries</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Maintain regulatory compliance</span>
                </li>
              </ul>
            </div>
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
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Multilingual Support</h3>
              <p className="text-lg mb-6">
                Meera can text and translate 90+ languages, making it easy to engage with global customers in their preferred language.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>90+ language support with automatic translation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Cultural context awareness and localization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Seamless language switching within conversations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Regional compliance and messaging standards</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Advanced Integrations</h3>
              <p className="text-lg mb-6">
                Easily integrate Meera with your tech stack including Salesforce, HubSpot, Five9, and more. 
                Connect with any external tool to take actions at the right moment.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>CRM integration (Salesforce, HubSpot, Pipedrive)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Contact center platforms (Five9, Zendesk)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Marketing automation tools</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom API integrations and webhooks</span>
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
              Control your messaging compliant — without any guesswork. Enterprise-grade security and compliance 
              certifications for complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Data Control</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Store and manage your information securely, reducing external risks and maintaining full control.
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
                <CardTitle className="text-lg">TCPA Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Ensure compliance with telephone consumer protection laws and messaging regulations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
            Ready to Transform Your Lead Engagement?
          </h2>
          <p className="text-xl text-paragraph mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using AI SMS to increase efficiency, reduce manual follow-up time, and deliver 
            exceptional customer engagement 24/7.
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
