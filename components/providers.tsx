
'use client'

import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { AdminSettingsProvider } from './admin-settings-provider'
import { Toaster } from './ui/toaster'
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { AuthUser } from './auth-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children, initialUser, initialSession }: ProvidersProps & { initialUser?: AuthUser | null; initialSession?: Session | null }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider initialUser={initialUser} initialSession={initialSession}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
      >
        <AdminSettingsProvider>
          {children}
          {mounted && <Toaster />}
        </AdminSettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
