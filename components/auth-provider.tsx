'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export interface AuthUser extends User {
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

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: AuthUser | null
  initialSession?: Session | null
}

export function AuthProvider({ children, initialUser = null, initialSession = null }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Create auth user with role (fetch from DB)
  const createAuthUserWithRole = useCallback(async (sessionUser: User): Promise<AuthUser> => {
    if (!supabase) return { ...sessionUser, role: 'user' };
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('user_role')
        .eq('UID', sessionUser.id)
        .single();
      if (error) {
        console.error('Error fetching user role:', error);
        return { ...sessionUser, role: 'user' };
      }
      return {
        ...sessionUser,
        subscription: sessionUser.user_metadata?.subscription || null,
        role: data?.user_role || 'user'
      };
    } catch (err) {
      console.error('Error fetching user role:', err);
      return { ...sessionUser, role: 'user' };
    }
  }, [supabase]);

  useEffect(() => {
    // If we already have initial session, skip extra fetch
    if (initialSession) {
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      if (!supabase) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const authUser = await createAuthUserWithRole(user);
          setUser(authUser);
          // Optionally, get session if needed
          const { data: { session: sessionData } } = await supabase.auth.getSession();
          setSession(sessionData);
        }
      } catch (error) {
        console.error('Error getting initial user:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes (with DB role fetch)
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    let subscription: ReturnType<typeof supabase.auth.onAuthStateChange>["data"]["subscription"] | null = null;
    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event) => {
          try {
            if (event === 'SIGNED_IN') {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const authUser = await createAuthUserWithRole(user);
                setUser(authUser);
                // Optionally, fetch session if needed
                const { data: { session: sessionData } } = await supabase.auth.getSession();
                setSession(sessionData);
              } else {
                setUser(null);
                setSession(null);
              }
              setLoading(false);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setSession(null);
              setLoading(false); // <-- moved here
              router.push('/login');
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
      subscription = authSubscription;
    }

    return () => subscription?.unsubscribe();
  }, [supabase, router, initialSession, createAuthUserWithRole]);

  useEffect(() => {
    if (!loading) {
      const isAdmin = user?.role?.toLowerCase() === 'admin';
      console.log('[AuthProvider] Admin status:', isAdmin);
    }
  }, [loading, user]);

  const signOut = async () => {
    if (!supabase) return;
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
