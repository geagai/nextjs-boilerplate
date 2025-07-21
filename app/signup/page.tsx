import { getServerAdminSettings } from '@/lib/admin-settings'
import SignupPageClient from './signup-page-client'

export const dynamic = 'force-dynamic'

export default async function SignupPage() {
  const adminSettings = await getServerAdminSettings()

  return <SignupPageClient adminSettings={adminSettings} />
}
