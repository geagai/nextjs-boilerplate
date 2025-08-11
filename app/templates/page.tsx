import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Templates & Repos – Production Ready Software Templates',
  description: 'Explore our collection of production-ready software templates and repositories. Jumpstart your next project with battle-tested codebases featuring authentication, payments, and modern development practices.',
  keywords: 'software templates, repositories, production ready, NextJS, React, TypeScript, boilerplate',
  openGraph: {
    title: 'Templates & Repos – Production Ready Software Templates',
    description: 'Explore our collection of production-ready software templates and repositories. Jumpstart your next project with battle-tested codebases featuring authentication, payments, and modern development practices.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Templates & Repos – Production Ready Software Templates',
    description: 'Explore our collection of production-ready software templates and repositories. Jumpstart your next project with battle-tested codebases featuring authentication, payments, and modern development practices.',
  },
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="pt-16 pb-24 mb-8 bg-gradient-to-br from-primary to-secondary dark:from-background dark:to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white dark:text-foreground">
              Templates & Repos
            </h1>
            <p className="text-xl text-white/90 dark:text-muted-foreground leading-relaxed">
              Jumpstart your next project with our collection of production-ready software templates. 
              Each template is battle-tested and includes essential features like authentication, payments, 
              and modern development practices to help you ship faster.
            </p>
          </div>
        </div>
      </section>

             {/* Membership Description */}
       <section className="pb-8">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white border border-[#d8d8d8] rounded-lg p-6">
             <p className="text-muted-foreground leading-relaxed">
               Get access to all templates with the <strong>AI Elite Membership</strong>. This membership comes with instant access to all template, 5,000 monthly AI Credits, vibe coding video tutorials showing you how to launch your AI application idea in a day, access to the AI Business Idea Skool community, professional assistance consultations and much more. See the <Link href="/pricing" className="text-primary hover:underline">Pricing Page</Link> for more information.
             </p>
           </div>
         </div>
       </section>

       {/* Templates Grid */}
       <section className="pb-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
                         {/* NextJS Boilerplate Template */}
             <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
               <Link href="/nextjs-boilerplate" className="block">
                                  <div className="relative h-80 bg-muted">
                   <Image
                     src="/nextjs-boilerplate.png"
                     alt="NextJS Boilerplate Application"
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    NextJS Boilerplate Application
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Enterprise-grade Next.js 15 boilerplate with authentication, payments, mobile support, 
                    and essential integrations. Built with React 19, TypeScript, Supabase, and Stripe for 
                    rapid development and deployment.
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:underline">
                    Explore Template
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

                         {/* React Expo Mobile App Template */}
             <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
               <Link href="/react-expo-mobile-app" className="block">
                 <div className="relative h-80 bg-muted">
                   <Image
                     src="/mobile-boilerplate.png"
                     alt="React Expo Mobile App"
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    React Expo Mobile App
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Complete mobile application template with AI-powered features, user authentication, 
                    task management, and image analysis. Built with React Native, Expo, Supabase, and 
                    integrated billing solutions for rapid mobile app development.
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:underline">
                    Explore Template
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
