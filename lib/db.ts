import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Supabase database utilities
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Export a convenience function for database operations
export const db = {
  supabase: createSupabaseServerClient,
}
