import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, User, BarChart3, Calendar, Route, Clock, CheckCircle, Globe, Shield, Zap, Users, Database, Key, Eye, ShieldCheck, Globe2, Zap as Lightning, Target, ArrowRight, Phone, QrCode, Languages, Smartphone, Mail, MessageCircle, Cpu, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: 'AI Lead Finder - Find & Qualify Perfect B2B Prospects | Reach Them',
  description: 'Find and qualify the perfect leads with AI-powered contact discovery and verification. Research over 1.3 billion+ companies in real-time for accurate contact information.',
  keywords: 'AI lead finder, B2B prospecting, contact discovery, lead generation, sales intelligence, prospect research, contact verification',
}

export default function AILeadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-[75rem] mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 mt-0 pt-0 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '1' }}>
            Find Contact Info for Anyone
          </h1>
          <p className="text-xl text-paragraph max-w-3xl mx-auto">
            Real-time research and validation on over 1.3 billion+ business contacts and 121 million+ companies. 
            Find and qualify the perfect leads with AI-powered contact discovery and verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <a href="/leads">Find Leads Now</a>
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
              <a href="/contact">Schedule Demo</a>
            </Button>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">Real-Time Contact Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Find anyone's email address and phone number in seconds with AI-powered research across 1.8 billion+ business emails and 414 million+ phone numbers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-xl">Decision Maker Targeting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Identify and reach the right decision-makers with complete contact profiles including job titles, company information, and social connections.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">Buyer Intent Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Find prospects who are ready to buy with credit card in hand using AI-powered intent signals and engagement tracking.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* What is AI Lead Finder Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              What is AI Lead Finder
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              AI-powered contact discovery and verification that researches over 1.3 billion+ companies in real-time, 
              delivering accurate contact information for decision-makers across every industry and company size. Our advanced 
              prospecting tools help you find and qualify the perfect leads with precision and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-600">Transform Your Prospecting</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Access 1.3 billion+ business contacts with real-time accuracy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Research 121 million+ companies and domains instantly</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Get verified contact information for decision-makers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span>Build targeted prospect lists in seconds, not hours</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <Search className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Starting at $0.10/contact</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Professional lead research at enterprise scale</p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                  <a href="/leads">Get Started Today</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Core Features
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Everything you need to find, qualify, and connect with your ideal prospects using the world's most 
              advanced AI-powered sales intelligence platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Prospector</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Discover your ideal contacts and accounts, complete with full contact info. Over 121+ million companies and domains researched.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl">Buyer Intent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Find all the prospects who are ready to buy with credit card in hand using AI-powered intent signals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Job Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track job changes of your most valuable customers to get new contact info and maintain active pipelines.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <Route className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl">Data Enrichment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Turn any email, phone, or domain into a complete contact record with automatic CRM enrichment and validation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">CRM Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fill your CRM with all the contact and company profiles to grow your business. Integrates with all your favorite sales tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl">AI Research</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get anything researched about anyone in seconds using the power of AI for comprehensive prospect intelligence.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              How AI Lead Finder Works
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Our AI-powered platform researches and validates business contact information in real-time for the greatest accuracy. 
              Find, verify, and connect with your ideal prospects in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Real-Time Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Every search scours the public web in real-time to pull the freshest, most up-to-date contact data available.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl">AI Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our AI technology uses multiple data points to verify and validate contact information for accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Contact Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get complete contact profiles with job titles, company information, and social connections.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl">List Building</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Build targeted prospect lists with advanced filters and export directly to your CRM or sales tools.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              AI Lead Finder Use Cases
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              From sales prospecting to market research, our AI-powered platform helps teams across every industry 
              find and connect with their ideal prospects efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl text-center">Sales Prospecting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Build targeted prospect lists for outbound sales campaigns. Find decision-makers with verified contact 
                  information and company insights to personalize your outreach.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl text-center">Market Research</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Research competitors, identify market opportunities, and understand industry landscapes with comprehensive 
                  company and contact data across 121+ million businesses.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl text-center">Recruitment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Find and connect with potential candidates, industry experts, and thought leaders for recruitment, 
                  partnerships, and business development initiatives.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enterprise Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Built to meet the evolving demands of modern enterprises with scalable solutions, real-time analytics, 
              and enterprise-level data accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-600">Your OS for Lead Generation</h3>
              <p className="text-lg mb-6">
                For enterprises, our AI lead finder goes beyond basic contact discovery. You'll gain access to advanced 
                analytics, custom integrations, team collaboration tools, and the ability to scale your prospecting efforts infinitely.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Advanced team collaboration and role-based access control</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom API integrations with your existing tech stack</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Bulk data enrichment and CRM synchronization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Advanced reporting and analytics dashboards</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-600">Dedicated Infrastructure for Infinite Scale</h3>
              <p className="text-lg mb-6">
                Lead generation happens at critical moments—when prospects are ready to engage or when market opportunities arise. 
                With dedicated infrastructure, your enterprise will be prepared to scale and handle any volume of research requests.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>99.99% uptime with enterprise-grade reliability</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Auto-scaling to handle unlimited concurrent searches</span>
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
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent" style={{ lineHeight: '4rem', marginTop: '2rem' }}>
              Security & Compliance
            </h2>
            <p className="text-xl text-paragraph max-w-4xl mx-auto">
              Own your lead generation end-to-end with enterprise-grade security, compliance certifications, 
              and complete data sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Data In-House</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Store and manage your prospect information in-house, reducing external risks and maintaining full control.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
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
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Globe2 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">CCPA Compliant</CardTitle>
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
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent">
            Ready to Transform Your Lead Generation?
          </h2>
          <p className="text-xl text-paragraph mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using AI lead finder to increase efficiency, reduce research time, and discover 
            qualified prospects that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <a href="/leads">Find Leads Now</a>
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
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
