import type { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Route, MessageCircle, Calendar, BarChart3, User, Clock, Mail, Search } from "lucide-react"

export const metadata: Metadata = {
  title: 'AI Outreach Platform - Automate Calls, SMS & Email',
  description: 'AI-powered outreach platform with intelligent agents for calls, SMS messaging, and cold email campaigns.',
  keywords: 'AI outreach, AI calls, AI SMS, AI email, automation, sales outreach',
  openGraph: {
    title: 'AI Outreach Platform - Automate Calls, SMS & Email',
    description: 'AI-powered outreach platform with intelligent agents for calls, SMS messaging, and cold email campaigns.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Outreach Platform - Automate Calls, SMS & Email',
    description: 'AI-powered outreach platform with intelligent agents for calls, SMS messaging, and cold email campaigns.',
  },
}

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
             {/* AI Call Agents Section */}
               <div id="ai-call-agents" className="container mx-auto px-4 py-16 bg-blue-50/50">
                    <div className="text-center mb-16 max-w-full mx-auto">
                                     <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 mt-0 pt-0 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent" style={{ lineHeight: '1.2' }}>
              AI Call Agents That Perform Like Real People
            </h2>
                                                                                                       <p className="text-[1.1rem] text-paragraph text-left mb-6" style={{ maxWidth: '60rem', margin: '50px auto' }}>
                 Transform your sales outreach and inbound calls with AI-powered voice agents that intelligently handle every function of a real person. Our advanced AI technology understands context, handles objections naturally, personalizes conversations. Whether it is outbound sales calls or inbound customer service, your AI agent will get your objectives achieved.
               </p>
            <div className="text-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <a href="/ai-call">Learn More</a>
              </Button>
            </div>
          </div>
          
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full mx-auto">
             <Card className="text-center hover:shadow-lg transition-shadow duration-300">
               <CardHeader>
                 <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                   <Route className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                 </div>
                 <CardTitle className="text-xl">Smart Call Routing</CardTitle>
               </CardHeader>
               <CardContent>
                 <CardDescription className="text-base">
                   AI automatically routes calls to the right agent based on prospect needs and availability.
                 </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center hover:shadow-lg transition-shadow duration-300">
               <CardHeader>
                 <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                   <MessageCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <CardTitle className="text-xl">Objection Handling</CardTitle>
               </CardHeader>
               <CardContent>
                 <CardDescription className="text-base">
                   AI agents intelligently respond to common objections with personalized solutions.
                 </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center hover:shadow-lg transition-shadow duration-300">
               <CardHeader>
                 <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                   <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                 </div>
                 <CardTitle className="text-xl">Meeting Scheduling</CardTitle>
               </CardHeader>
               <CardContent>
                 <CardDescription className="text-base">
                   Automatically schedule follow-up meetings and sync with your calendar systems.
                 </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center hover:shadow-lg transition-shadow duration-300">
               <CardHeader>
                 <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                   <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <CardTitle className="text-xl">Call Analytics</CardTitle>
               </CardHeader>
               <CardContent>
                 <CardDescription className="text-base">
                   Track call performance, conversion rates, and optimize your outreach strategy.
                 </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center hover:shadow-lg transition-shadow duration-300">
               <CardHeader>
                 <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                   <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                 </div>
                 <CardTitle className="text-xl">Personalization</CardTitle>
               </CardHeader>
               <CardContent>
                 <CardDescription className="text-base">
                   AI adapts conversation style and content based on prospect data and preferences.
                 </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center hover:shadow-lg transition-shadow duration-300">
               <CardHeader>
                 <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                   <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <CardTitle className="text-xl">24/7 Availability</CardTitle>
               </CardHeader>
               <CardContent>
                 <CardDescription className="text-base">
                   Never miss a prospect call with round-the-clock AI agent availability.
                 </CardDescription>
               </CardContent>
             </Card>
           </div>
       </div>
       
       {/* AI SMS Messaging Section */}
               <div id="ai-sms-messaging" className="container mx-auto px-4 py-16 bg-green-50/50">
          <div className="text-center mb-16 max-w-full mx-auto">
                       <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 mt-0 pt-0 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent" style={{ lineHeight: '1.2' }}>
              AI SMS Messaging That Drives Engagement
            </h2>
                                               <p className="text-[1.1rem] text-paragraph text-left mb-6" style={{ maxWidth: '60rem', margin: '50px auto' }}>
               Transform your text message campaigns with intelligent AI agents that understand context, personalize conversations, and drive real engagement. Our AI technology handles responses naturally, manages follow-ups automatically, and integrates seamlessly with your existing systems to scale your SMS outreach without losing the personal touch.
             </p>
            <div className="text-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <a href="/ai-sms">Learn More</a>
              </Button>
            </div>
         </div>
         
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Smart Response Handling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI intelligently responds to customer messages with personalized, context-aware replies that feel human.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                  <Route className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Automated Follow-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Intelligent follow-up sequences that adapt based on customer engagement and response patterns.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Personalization Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Dynamic content that adapts to customer data, preferences, and previous interactions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Engagement Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track response rates, engagement metrics, and optimize your SMS campaigns in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI-optimized timing for maximum engagement based on customer behavior and time zones.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Never miss a customer message with round-the-clock AI agent availability and instant responses.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
       </div>
       
       {/* AI Cold Email Outreach Section */}
               <div id="ai-cold-email" className="container mx-auto px-4 py-16 bg-purple-50/50">
          <div className="text-center mb-16 max-w-full mx-auto">
                       <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 mt-0 pt-0 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent" style={{ lineHeight: '1.2' }}>
              AI Cold Email Outreach That Converts
            </h2>
                                               <p className="text-[1.1rem] text-paragraph text-left mb-6" style={{ maxWidth: '60rem', margin: '50px auto' }}>
               Transform your email campaigns with intelligent AI agents that craft personalized messages, handle responses naturally, and optimize your outreach strategy. Our AI technology personalizes content at scale, manages follow-up sequences, and integrates with your CRM to create authentic connections that drive real results.
             </p>
            <div className="text-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <a href="/ai-email">Learn More</a>
              </Button>
            </div>
         </div>
         
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Smart Personalization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI dynamically personalizes email content based on prospect data, industry, and engagement history.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                  <Route className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-xl">Automated Sequences</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Intelligent follow-up sequences that adapt based on prospect responses and engagement patterns.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Response Handling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI intelligently responds to prospect replies with personalized, context-aware messages.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-xl">Campaign Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track open rates, reply rates, and optimize your email campaigns with real-time insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Smart Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI-optimized send times and frequency for maximum open rates and engagement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-xl">24/7 Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Never miss an opportunity with round-the-clock email automation and instant response handling.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
       </div>
       
               {/* Contact & Lead Finder Section */}
                <div id="contact-lead-finder" className="container mx-auto px-4 py-16 bg-orange-50/50">
           <div className="text-center mb-16 max-w-full mx-auto">
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 mt-0 pt-0 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent" style={{ lineHeight: '1.2' }}>
              Contact & Lead Finder
            </h2>
                                                                                                                                                                                         <p className="text-[1.1rem] text-paragraph text-left mb-6" style={{ maxWidth: '60rem', margin: '50px auto' }}>
                Find and qualify the perfect leads with AI-powered contact discovery and verification. Our advanced prospecting tools research over 1.3 billion+ companies in real-time, delivering accurate contact information for decision-makers across every industry and company size.
              </p>
            <div className="text-center mb-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <a href="/leads">Find Leads Now</a>
              </Button>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full mx-auto">
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

           <Card className="text-center hover:shadow-lg transition-shadow duration-300">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                 <Calendar className="w-8 h-8 text-amber-600 dark:text-amber-400" />
               </div>
               <CardTitle className="text-xl">Job Change Tracking</CardTitle>
             </CardHeader>
             <CardContent>
               <CardDescription className="text-base">
                 Automatically track job changes of your most valuable customers to get new contact information and maintain active pipelines.
               </CardDescription>
             </CardContent>
           </Card>

           <Card className="text-center hover:shadow-lg transition-shadow duration-300">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                 <Route className="w-8 h-8 text-orange-600 dark:text-orange-400" />
               </div>
               <CardTitle className="text-xl">Data Enrichment</CardTitle>
             </CardHeader>
             <CardContent>
               <CardDescription className="text-base">
                 Turn any email, phone, or domain into a complete contact record with automatic CRM enrichment and data validation.
               </CardDescription>
             </CardContent>
           </Card>

           <Card className="text-center hover:shadow-lg transition-shadow duration-300">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                 <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
               </div>
               <CardTitle className="text-xl">Real-Time Accuracy</CardTitle>
             </CardHeader>
             <CardContent>
               <CardDescription className="text-base">
                 Get the most accurate data possible with real-time searches powered by AI that crawl the web for up-to-date contact information.
               </CardDescription>
             </CardContent>
           </Card>
         </div>
       </div>
     </div>
   );
 }
