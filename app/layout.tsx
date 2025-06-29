
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import dynamic from 'next/dynamic'

const Navigation = dynamic(() => import('@/components/navigation').then(mod => ({ default: mod.Navigation })), {
  ssr: false,
  loading: () => <div className="h-16 bg-background border-b"></div>
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextGeag BP - Enterprise-Grade Next.js Boilerplate',
  description: 'The ultimate Next.js 15 boilerplate with authentication, payments, mobile support, and enterprise-grade features. Built with React 19, TypeScript, Supabase, and Stripe.',
  keywords: 'Next.js, React, TypeScript, Supabase, Stripe, boilerplate, enterprise, mobile, authentication',
  authors: [{ name: 'NextGeag BP Team' }],
  openGraph: {
    title: 'NextGeag BP - Enterprise-Grade Next.js Boilerplate',
    description: 'The ultimate Next.js 15 boilerplate with authentication, payments, mobile support, and enterprise-grade features.',
    url: 'https://nextgeag-bp.com',
    siteName: 'NextGeag BP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextGeag BP - Enterprise-Grade Next.js Boilerplate',
    description: 'The ultimate Next.js 15 boilerplate with authentication, payments, mobile support, and enterprise-grade features.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
