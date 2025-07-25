
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
import { missingEnvVars } from '@/lib/checkEnv'
import { headers } from 'next/headers'

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
  const missing = missingEnvVars();
  const headersList = await headers();
  const path = headersList.get('x-invoke-path') || '';
  const isDeployGuide = path.startsWith('/deploy-guide');

  let settings = null;
  let sessionData = null;
  let showHeader = true;
  let stickyHeader = true;
  let siteName = 'NextGeag BP';
  let footerBgLight = '#F7F9FB';
  let footerTextLight = '#33363B';
  let footerLinkLight = '#3A72BB';
  let footerBgDark = '#0D0D0D';
  let footerTextDark = '#EDEDED';
  let footerLinkDark = '#3A72BB';
  let footerHtmlOne = null;
  let footerHtmlTwo = null;
  let vars = {
    '--background': hexToHsl('#F7F9FB'),
    '--primary': hexToHsl('#3A72BB'),
    '--secondary': hexToHsl('#33363B'),
    '--link': hexToHsl('#33363B'),
    '--link-hover': hexToHsl('#3872BB'),
    '--header-bg': hexToHsl('#F7F9FB'),
    '--headline': hexToHsl('#3A72BB'),
  };
  let darkVars = {
    '--background': hexToHsl('#0D0D0D'),
    '--primary': hexToHsl('#3A72BB'),
    '--secondary': hexToHsl('#2C2C2C'),
    '--link': hexToHsl('#FFFFFF'),
    '--link-hover': hexToHsl('#3872BB'),
    '--header-bg': hexToHsl('#0D0D0D'),
    '--foreground': hexToHsl('#EDEDED'),
    '--headline': hexToHsl('#3A72BB'),
  };

  if (!missing.length && !isDeployGuide) {
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    if (supabase) {
      const dbSettings = await supabase
        .from('admin_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      settings = dbSettings.data;
      showHeader = settings?.show_header ?? true;
      stickyHeader = settings?.sticky_header ?? true;
      siteName = settings?.site_name ?? 'NextGeag BP';
      footerBgLight = settings?.footer_background_color ?? '#F7F9FB';
      footerTextLight = settings?.footer_text_color ?? '#33363B';
      footerLinkLight = settings?.footer_link_color ?? '#3A72BB';
      footerBgDark = settings?.dark_footer_background_color ?? footerBgLight;
      footerTextDark = settings?.dark_footer_text_color ?? footerTextLight;
      footerLinkDark = settings?.dark_footer_link_color ?? footerLinkLight;
      footerHtmlOne = settings?.footer_html_one ?? null;
      footerHtmlTwo = settings?.footer_html_two ?? null;
      vars = {
        '--background': hexToHsl(settings?.background_color ?? '#F7F9FB'),
        '--primary': hexToHsl(settings?.primary_color ?? '#3A72BB'),
        '--secondary': hexToHsl(settings?.secondary_color ?? '#33363B'),
        '--link': hexToHsl(settings?.link_color ?? '#33363B'),
        '--link-hover': hexToHsl(settings?.link_hover_color ?? '#3872BB'),
        '--header-bg': hexToHsl(settings?.header_background_color ?? '#F7F9FB'),
        '--headline': hexToHsl(settings?.headline_text_color ?? '#3A72BB'),
      };
      darkVars = {
        '--background': hexToHsl(settings?.dark_background_color ?? '#0D0D0D'),
        '--primary': hexToHsl(settings?.dark_primary_color ?? '#3A72BB'),
        '--secondary': hexToHsl(settings?.dark_secondary_color ?? '#2C2C2C'),
        '--link': hexToHsl(settings?.dark_link_color ?? '#FFFFFF'),
        '--link-hover': hexToHsl(settings?.dark_link_hover_color ?? '#3872BB'),
        '--header-bg': hexToHsl(settings?.dark_header_background_color ?? '#0D0D0D'),
        '--foreground': hexToHsl(settings?.dark_paragraph_text_color ?? '#EDEDED'),
        '--headline': hexToHsl(settings?.dark_headline_text_color ?? '#3A72BB'),
      };
      sessionData = await getServerSession();
    }
  }

  const cssVars = Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ');
  const darkCssVars = Object.entries(darkVars).map(([k, v]) => `${k}: ${v};`).join(' ');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`:root { ${cssVars} } html.dark { ${darkCssVars} }`}</style>
      </head>
      <body className={inter.className}>
        <Providers initialUser={sessionData?.user} initialSession={sessionData?.session}>
          <div className="min-h-screen bg-background text-foreground">
            {showHeader && <Navigation sticky={stickyHeader} siteName={siteName} />}
            <main>{children}</main>
            <ConditionalFooter
              siteName={siteName}
              bgColor={footerBgLight}
              textColor={footerTextLight}
              linkColor={footerLinkLight}
              bgColorDark={footerBgDark}
              textColorDark={footerTextDark}
              linkColorDark={footerLinkDark}
              htmlOne={footerHtmlOne}
              htmlTwo={footerHtmlTwo}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
