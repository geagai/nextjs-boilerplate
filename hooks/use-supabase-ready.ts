"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase";


/**
 * Returns `true` once the shared Supabase client has hydrated its auth
 * state (JWT present). All components that run Supabase queries should wait
 * for this flag before issuing requests to avoid unauthenticated races.
 */
export function useSupabaseReady(): boolean {
  const { loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return; // still waiting on AuthProvider

    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;

    // Fallback 1: try getSession (resolves immediately if session already hydrated)
    supabase.auth
      .getSession()
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    // Fallback 2: listen for first auth event (fires once hydration completes)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string) => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [loading]);

  return ready;
}

/*
================ LLM INSTRUCTION SECTION ================
When creating new pages or components:
- Always explicitly type event parameters in callbacks, especially for Supabase auth state change handlers.
- Do NOT leave event parameters untyped, as this causes TypeScript 'implicitly has an any type' errors.
- For Supabase auth events, use string type for event parameter as shown above.
=========================================================
*/
