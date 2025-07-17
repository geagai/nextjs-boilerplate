
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { missingEnvVars } from '@/lib/checkEnv'

export async function middleware(request: NextRequest) {
  // Redirect to /deploy-guide if required env vars are missing, except on /deploy-guide
  const missing = missingEnvVars();
  const isDeployGuide = request.nextUrl.pathname.startsWith('/deploy-guide');
  if (missing.length > 0 && !isDeployGuide) {
    return NextResponse.redirect(new URL('/deploy-guide', request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Only create Supabase client and do auth checks if env vars are present
  if (missing.length === 0) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Refresh session if needed
    if (!supabase) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: { user }, error } = await supabase.auth.getUser()

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                            request.nextUrl.pathname.startsWith('/settings') ||
                            request.nextUrl.pathname.startsWith('/create-product-stripe') ||
                            request.nextUrl.pathname.startsWith('/edit-product-stripe')

    if (isProtectedRoute && (!user || error)) {
      // Redirect to login if accessing protected route without authentication
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!deploy-guide).*)'], // Apply to all routes except /deploy-guide
}
