
import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton instance – ensures the same client is reused across the app.
let browserClient: ReturnType<typeof createBrowserClient> | null = null

// Client-side Supabase client for browser usage
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return browserClient
}

// Server-side Supabase client factory
export function createServerClient(cookieStore: ReadonlyRequestCookies) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // This will be a no-op in server components
        },
        remove() {
          // This will be a no-op in server components
        },
      },
    }
  )
}
