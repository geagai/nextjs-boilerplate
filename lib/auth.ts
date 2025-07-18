
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'

// Enhanced user type with subscription data
export interface AuthUser extends User {
  subscription?: {
    id: string
    plan: string
    status: string
    currentPeriodEnd?: string
  } | null
  role?: string
}

// Monkey-patch console.warn to trace Supabase session warning on the server
if (typeof process !== 'undefined' && process?.versions?.node) {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Do not use the user object from getSession() or onAuthStateChange() for authentication or authorization')
    ) {
      originalWarn.apply(console, args);
      console.trace('Supabase session warning stack trace (server):');
    } else {
      originalWarn.apply(console, args);
    }
  };
}

// Get current session on server side
export async function getServerSession(): Promise<{ user: AuthUser; session: Session | null } | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) return null; // Return null instead of throwing error
  
  try {
    // FIX: Use getSession() for hydration
    const { data: { user: baseUser }, error } = await supabase.auth.getUser();
    if (error || !baseUser) {
      return null
    }

    // Fetch user role from user_data table
    let dbRole = null;
    try {
      const { data: userData, error: userDataError } = await supabase
        .from('user_data')
        .select('user_role')
        .eq('UID', baseUser.id)
        .single();
      if (!userDataError && userData?.user_role) {
        dbRole = userData.user_role;
      }
    } catch (err) {
      // ignore, fallback below
    }

    // Get additional user data from user_metadata or app_metadata
    const user: AuthUser = {
      ...baseUser,
      subscription: baseUser.user_metadata?.subscription || null,
      role: dbRole || baseUser.user_metadata?.role || 'user'
    }

    return { user, session: null }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Require authentication - redirect if not logged in
export async function requireAuth(): Promise<{ user: AuthUser; session: Session | null }> {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  if (!supabase) {
    redirect('/login') // Redirect to login instead of throwing error
  }

  try {
    // Use getUser() for secure authentication
    const { data: { user: baseUser }, error } = await supabase.auth.getUser()
    if (error || !baseUser) {
      redirect('/login')
    }

    // Fetch user role from user_data table
    let dbRole = null;
    try {
      const { data: userData, error: userDataError } = await supabase
        .from('user_data')
        .select('user_role')
        .eq('UID', baseUser.id)
        .single();
      if (!userDataError && userData?.user_role) {
        dbRole = userData.user_role;
      }
    } catch (err) {
      // ignore, fallback below
    }

    const user: AuthUser = {
      ...baseUser,
      subscription: baseUser.user_metadata?.subscription || null,
      role: dbRole || baseUser.user_metadata?.role || 'user'
    }

    return { user, session: null }
  } catch (error) {
    console.error('Error in requireAuth:', error)
    redirect('/login')
  }
}

// Sign out helper
export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) return;
  
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// User role checking helpers
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'admin'
}

export function hasValidSubscription(user: AuthUser | null): boolean {
  return user?.subscription?.status === 'ACTIVE' || user?.subscription?.status === 'active'
}
