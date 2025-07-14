
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { SettingsHeader } from '@/components/settings/settings-header'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const sessionData = await getServerSession()

  if (!sessionData) {
    redirect('/login')
  }

  const { user } = sessionData

  // Fetch display_name and email from user_data table
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  if (!supabase) return null;
  let dbDisplayName = null
  let dbEmail = null
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('display_name, email')
      .eq('UID', user.id)
      .single()
    if (!error && data) {
      dbDisplayName = data.display_name
      dbEmail = data.email
    }
  } catch (e) {
    // fallback to session values
  }

  // Create user object that matches expected format
  const userWithMetadata = {
    id: user.id,
    email: dbEmail || user.email!,
    name: dbDisplayName || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'USER',
    subscription: user.user_metadata?.subscription || {
      id: 'default',
      plan: 'FREE',
      status: 'ACTIVE'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsHeader />
        
        <div className="space-y-8 mt-8">
          <ProfileSettings user={userWithMetadata} />
          <SecuritySettings />
        </div>
      </div>
    </div>
  )
}
