import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../app/globals.css'
import './agent-page.css'
import { Providers } from '@/components/providers'
import Navigation from '@/components/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { hexToHsl } from '@/lib/utils'
import { getServerSession } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Agents - NextGeag BP',
  description: 'AI Agents powered by NextGeag BP',
}

export default async function AIAgentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
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

  const siteName = settings?.site_name ?? 'NextGeag BP'

  const sessionData = await getServerSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`:root { ${cssVars} } html.dark { ${darkCssVars} }`}</style>
      </head>
      <body className={inter.className}>
        <Providers initialUser={sessionData?.user} initialSession={sessionData?.session}>
          <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
            {showHeader && <Navigation sticky={stickyHeader} siteName={siteName} />}
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
} 