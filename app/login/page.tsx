import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import LoginForm from './login-form'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }

  // Fetch admin settings server-side
  const { data: adminSettings } = await supabase
    .from('admin_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  return <LoginForm adminSettings={adminSettings} />
}
