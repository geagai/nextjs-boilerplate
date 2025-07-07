
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { hexToHsl } from '@/lib/utils'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: settings } = await supabase
    .from('admin_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  const vars: Record<string, string> = {
    '--background': hexToHsl(settings?.background_color ?? '#F7F9FB'),
    '--primary': hexToHsl(settings?.primary_color ?? '#3A72BB'),
    '--secondary': hexToHsl(settings?.secondary_color ?? '#33363B'),
    '--link': hexToHsl(settings?.link_color ?? '#33363B'),
    '--link-hover': hexToHsl(settings?.link_hover_color ?? '#3872BB'),
    '--header-bg': hexToHsl(settings?.header_background_color ?? '#F7F9FB'),
  }

  const cssVars = Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')

  const darkVars: Record<string, string> = {
    '--background': hexToHsl(settings?.dark_background_color ?? '#0D0D0D'),
    '--primary': hexToHsl(settings?.dark_primary_color ?? '#3A72BB'),
    '--secondary': hexToHsl(settings?.dark_secondary_color ?? '#2C2C2C'),
    '--link': hexToHsl(settings?.dark_link_color ?? '#FFFFFF'),
    '--link-hover': hexToHsl(settings?.dark_link_hover_color ?? '#3872BB'),
    '--header-bg': hexToHsl(settings?.dark_header_background_color ?? '#0D0D0D'),
  }
  const darkCssVars = Object.entries(darkVars).map(([k,v])=>`${k}: ${v};`).join(' ');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Dynamic color variables */}
        <style>{`:root { ${cssVars} } html.dark { ${darkCssVars} }`}</style>
      </head>
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
