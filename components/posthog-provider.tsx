
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    // Only initialize PostHog on client side
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || 'placeholder-key', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        }
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
