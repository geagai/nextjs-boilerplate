
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { missingEnvVars } from '@/lib/checkEnv'

export async function middleware(request: NextRequest) {
  // Skip middleware completely if on /deploy-guide to prevent redirect loops
  const isDeployGuide = request.nextUrl.pathname.startsWith('/deploy-guide');
  if (isDeployGuide) {
    return NextResponse.next();
  }

  // Check if env vars are missing but don't redirect
  const missing = missingEnvVars();
  if (missing.length > 0) {
    // Don't redirect, just continue without Supabase
    return NextResponse.next();
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
