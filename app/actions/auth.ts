'use server'

import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    redirect('/login')
  }
  
  try {
    await supabase.auth.signOut()
    redirect('/login')
  } catch (error) {
    console.error('Error signing out:', error)
    redirect('/login')
  }
} 