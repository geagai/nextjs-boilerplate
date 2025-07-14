
import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client for browser usage
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
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
