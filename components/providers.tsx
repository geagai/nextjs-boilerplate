
'use client'

import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { PostHogProvider } from './posthog-provider'
import { Toaster } from './ui/toaster'
import { useEffect, useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <PostHogProvider>
          {children}
          {mounted && <Toaster />}
        </PostHogProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
