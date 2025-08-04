import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import NavigationClient from './navigation-client'

export const dynamic = 'force-dynamic'

export default async function Navigation({ sticky = true, siteName = 'NextGeag BP' }: { sticky?: boolean, siteName?: string }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }

  // Fetch user session server-side
  const { data: { user: baseUser }, error } = await supabase.auth.getUser()
  
  let user = null
  if (!error && baseUser) {
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

    user = {
      ...baseUser,
      subscription: baseUser.user_metadata?.subscription || null,
      role: dbRole || baseUser.user_metadata?.role || 'user'
    }
  }

  // Check if agents table exists
  let agentsTableExists = false;
  try {
    const { data: agentsData, error: agentsError } = await supabase
      .from('agents')
      .select('id')
      .limit(1);
    agentsTableExists = !agentsError;
  } catch (err) {
    // Table doesn't exist
  }

  // Fetch admin settings server-side
  let adminSettings = null;
  try {
    const { data: adminSettingsData } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    adminSettings = adminSettingsData;
  } catch (err) {
    // Table doesn't exist yet, ignore error
  }

  return <NavigationClient user={user} adminSettings={adminSettings} agentsTableExists={agentsTableExists} sticky={sticky} siteName={siteName} />
}
