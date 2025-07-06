'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthUser extends User {
  subscription?: {
    id: string
    plan: string
    status: string
    currentPeriodEnd?: string
  } | null
  role?: string
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch user role from user_data table
  const getUserRole = async (sessionUser: User): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('user_role')
        .eq('UID', sessionUser.id)
        .single();
      if (error) {
        console.error('Error fetching user role:', error);
        return 'user';
      }
      return data?.user_role || 'user';
    } catch (err) {
      console.error('Error fetching user role:', err);
      return 'user';
    }
  };

  // Create auth user with role (fetch from DB)
  const createAuthUserWithRole = async (sessionUser: User): Promise<AuthUser> => {
    const role = await getUserRole(sessionUser);
    return {
      ...sessionUser,
      subscription: sessionUser.user_metadata?.subscription || null,
      role: role
    };
  };

  useEffect(() => {
    // Get initial session (with DB role fetch)
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const authUser = await createAuthUserWithRole(session.user);
          setUser(authUser);
          setSession(session);
          setLoading(false); // <-- moved here
        } else {
          setUser(null);
          setSession(null);
          setLoading(false); // <-- and here
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
        setSession(null);
        setLoading(false); // <-- and here
      }
    };

    getInitialSession();

    // Listen for auth changes (with DB role fetch)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session) {
            const authUser = await createAuthUserWithRole(session.user);
            setUser(authUser);
            setSession(session);
            setLoading(false); // <-- moved here
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setLoading(false); // <-- moved here
            router.push('/');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
          setSession(null);
          setLoading(false); // <-- moved here
        }
        // setLoading(false) removed from here
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  useEffect(() => {
    if (!loading) {
      const isAdmin = user?.role?.toLowerCase() === 'admin';
      console.log('[AuthProvider] Admin status:', isAdmin);
    }
  }, [loading, user]);

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
