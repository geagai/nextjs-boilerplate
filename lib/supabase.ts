
import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client for browser usage
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client factory
export function createServerClient(cookieStore: ReadonlyRequestCookies) {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // This will be a no-op in server components
        },
        remove(name: string, options: CookieOptions) {
          // This will be a no-op in server components
        },
      },
    }
  )
}
