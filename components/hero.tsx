import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Mail, Search } from "lucide-react"

export function Hero() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
             <div className="container mx-auto px-4 py-16 max-w-[1400px]">
        <div className="text-center mb-16">
                                                         <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 mt-0 pt-0 bg-gradient-to-r from-purple-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                     AI-Powered Outreach Platform
                   </h1>
                                       <p className="text-xl text-paragraph max-w-[50rem] mx-auto">
                    We make finding leads and automated outreach easy with intelligent AI agents that make and receive calls, send or respond to SMS, and email prospects at scale.
                  </p>
        </div>
        
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[100rem] mx-auto">
                     <Card className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                 <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
               </div>
                               <CardTitle className="text-2xl text-blue-600">AI Call Agents</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 flex flex-col">
               <CardDescription className="text-base mb-6 text-left">
                 Intelligent voice agents that make personalized calls, handle objections, and schedule meetings automatically.
               </CardDescription>
               <div className="mt-auto">
                 <Button 
                   asChild 
                   className="w-full !bg-blue-600 hover:!bg-blue-700 text-white"
                 >
                   <a href="#ai-call-agents">Learn More</a>
                 </Button>
               </div>
             </CardContent>
           </Card>

                     <Card className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                 <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
               </div>
                               <CardTitle className="text-2xl text-green-600">AI SMS Messaging</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 flex flex-col">
               <CardDescription className="text-base mb-6 text-left">
                 Automated text message campaigns with smart responses, follow-ups, and engagement tracking.
               </CardDescription>
               <div className="mt-auto">
                 <Button 
                   asChild 
                   className="w-full !bg-green-600 hover:!bg-green-700 text-white"
                 >
                   <a href="#ai-sms-messaging">Learn More</a>
                 </Button>
               </div>
             </CardContent>
           </Card>

                     <Card className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                 <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
               </div>
                               <CardTitle className="text-2xl text-purple-600">AI Cold Email Outreach</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 flex flex-col">
               <CardDescription className="text-base mb-6 text-left">
                 Personalized email sequences that adapt to responses, optimize timing, and increase reply rates.
               </CardDescription>
               <div className="mt-auto">
                 <Button 
                   asChild 
                   className="w-full !bg-purple-600 hover:!bg-purple-700 text-white"
                 >
                   <a href="#ai-cold-email">Learn More</a>
                 </Button>
               </div>
             </CardContent>
           </Card>

                       <Card className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                                 <CardTitle className="text-2xl text-orange-600">Contact & Lead Finder</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="text-base mb-6 text-left">
                  Advanced prospecting tools to find and qualify leads with AI-powered contact discovery and verification.
                </CardDescription>
                <div className="mt-auto">
                  <Button 
                    asChild 
                    className="w-full !bg-orange-600 hover:!bg-orange-700 text-white"
                  >
                    <a href="#contact-lead-finder">Learn More</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
         </div>
       </div>
     </div>
   )
 }
