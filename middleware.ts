
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
  const { data: { session }, error } = await supabase.auth.getSession()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/settings') ||
                          request.nextUrl.pathname.startsWith('/create-product-stripe') ||
                          request.nextUrl.pathname.startsWith('/edit-product-stripe')

  if (isProtectedRoute && (!session || error)) {
    // Redirect to login if accessing protected route without authentication
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/create-product-stripe/:path*', '/edit-product-stripe/:path*']
}
