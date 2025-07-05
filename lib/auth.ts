
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

// Get current session on server side
export async function getServerSession(): Promise<{ user: AuthUser; session: Session } | null> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    // Fetch user role from user_data table
    let dbRole = null;
    try {
      const { data: userData, error: userDataError } = await supabase
        .from('user_data')
        .select('user_role')
        .eq('UID', session.user.id)
        .single();
      if (!userDataError && userData?.user_role) {
        dbRole = userData.user_role;
      }
    } catch (err) {
      // ignore, fallback below
    }

    // Get additional user data from user_metadata or app_metadata
    const user: AuthUser = {
      ...session.user,
      subscription: session.user.user_metadata?.subscription || null,
      role: dbRole || session.user.user_metadata?.role || 'USER'
    }

    return { user, session }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Require authentication - redirect if not logged in
export async function requireAuth(): Promise<{ user: AuthUser; session: Session }> {
  const sessionData = await getServerSession()
  
  if (!sessionData) {
    redirect('/login')
  }
  
  return sessionData
}

// Sign out helper
export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
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
