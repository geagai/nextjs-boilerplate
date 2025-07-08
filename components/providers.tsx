
'use client'

import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/toaster'
import { useEffect, useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children, initialUser, initialSession }: ProvidersProps & { initialUser?: any; initialSession?: any }) {
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
        {children}
        {mounted && <Toaster />}
      </ThemeProvider>
    </AuthProvider>
  )
}
