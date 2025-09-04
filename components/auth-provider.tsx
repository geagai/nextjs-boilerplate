'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

import { AuthUser, AuthSession } from '@/lib/types'
import { useRouter } from 'next/navigation'



interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
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
  initialSession?: AuthSession | null
}

export function AuthProvider({ children, initialUser = null, initialSession = null }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [session, setSession] = useState<AuthSession | null>(initialSession)
  const [loading, setLoading] = useState(!initialUser) // If we have initialUser, don't start loading
  const router = useRouter()
  const supabase = createClient()

  // Create auth user with role (fetch from DB)
  const createAuthUserWithRole = useCallback(async (sessionUser: any): Promise<AuthUser> => {
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
        role: (data as any)?.user_role || 'user'
      };
    } catch (err) {
      console.error('Error fetching user role:', err);
      return { ...sessionUser, role: 'user' };
    }
  }, [supabase]);

  useEffect(() => {
    // If we already have initial user, only set up auth listener, don't fetch again
    if (initialUser) {
      setLoading(false)
    } else {
      // Only fetch initial session if we don't have initial data
      const getInitialSession = async () => {
        if (!supabase) return;
        try {
          // Check if a session exists before calling getUser
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          if (!existingSession) {
            setUser(null);
            setSession(null);
            return;
          }
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error && error.message === 'Auth session missing!') {
            // Ignore, user is not logged in
            setUser(null);
            setSession(null);
            return;
          }
          if (user) {
            const authUser = await createAuthUserWithRole(user);
            setUser(authUser);
            // Optionally, get session if needed
            setSession(existingSession);
          }
        } catch (error) {
          console.error('Error getting initial user:', error);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();
    }

    // Listen for auth changes (with DB role fetch)
    if (!supabase) {
      // Gracefully handle missing Supabase client (e.g., missing env vars)
      setLoading(false);
      return;
    }
    
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event: string) => {
        try {
          if (event === 'SIGNED_IN') {
            // Check if a session exists before calling getUser
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (!existingSession) {
              setUser(null);
              setSession(null);
              setLoading(false);
              return;
            }
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error && error.message === 'Auth session missing!') {
              setUser(null);
              setSession(null);
              setLoading(false);
              return;
            }
            if (user) {
              const authUser = await createAuthUserWithRole(user);
              setUser(authUser);
              setSession(existingSession);
            } else {
              setUser(null);
              setSession(null);
            }
            setLoading(false);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setLoading(false);
            router.push('/login');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    );

    return () => authSubscription?.unsubscribe();
  }, [supabase, router, initialUser, createAuthUserWithRole]);

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

/*
================ LLM INSTRUCTION SECTION ================
When creating new pages or components:
- Always explicitly type event parameters in callbacks, especially for Supabase auth state change handlers.
- Do NOT leave event parameters untyped, as this causes TypeScript 'implicitly has an any type' errors.
- For Supabase auth events, use string type for event parameter as shown above.
=========================================================
*/
