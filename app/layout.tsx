
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { ConditionalFooter } from '@/components/conditional-footer'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { hexToHsl } from '@/lib/utils'
import { getServerSession } from '@/lib/auth'

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

  const showHeader = settings?.show_header ?? true
  const stickyHeader = settings?.sticky_header ?? true

  const vars: Record<string, string> = {
    '--background': hexToHsl(settings?.background_color ?? '#F7F9FB'),
    '--primary': hexToHsl(settings?.primary_color ?? '#3A72BB'),
    '--secondary': hexToHsl(settings?.secondary_color ?? '#33363B'),
    '--link': hexToHsl(settings?.link_color ?? '#33363B'),
    '--link-hover': hexToHsl(settings?.link_hover_color ?? '#3872BB'),
    '--header-bg': hexToHsl(settings?.header_background_color ?? '#F7F9FB'),
    '--headline': hexToHsl(settings?.headline_text_color ?? '#3A72BB'),
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
    '--foreground': hexToHsl(settings?.dark_paragraph_text_color ?? '#EDEDED'),
    '--headline': hexToHsl(settings?.dark_headline_text_color ?? '#3A72BB'),
  }
  const darkCssVars = Object.entries(darkVars).map(([k,v])=>`${k}: ${v};`).join(' ');

  const footerBg = settings?.footer_background_color ?? '#F7F9FB'
  const footerText = settings?.footer_text_color ?? '#33363B'
  const footerLink = settings?.footer_link_color ?? '#3A72BB'
  const footerHtmlOne = settings?.footer_html_one ?? null
  const footerHtmlTwo = settings?.footer_html_two ?? null
  const siteName = settings?.site_name ?? 'NextGeag BP'

  const sessionData = await getServerSession()

  if (typeof window !== 'undefined') {
    const originalWarn = console.warn;
    console.warn = function (...args) {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Do not use the user object from getSession() or onAuthStateChange() for authentication or authorization')
      ) {
        originalWarn.apply(console, args);
        console.trace('Supabase session warning stack trace:');
      } else {
        originalWarn.apply(console, args);
      }
    };
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Dynamic color variables */}
        <style>{`:root { ${cssVars} } html.dark { ${darkCssVars} }`}</style>
      </head>
      <body className={inter.className}>
        <Providers initialUser={sessionData?.user} initialSession={sessionData?.session}>
          <div className="min-h-screen bg-background text-foreground">
            {showHeader && <Navigation sticky={stickyHeader} siteName={siteName} />}
            <main>{children}</main>
            <ConditionalFooter siteName={siteName} bgColor={footerBg} textColor={footerText} linkColor={footerLink} htmlOne={footerHtmlOne} htmlTwo={footerHtmlTwo} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
