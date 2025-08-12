import { getServerAdminSettings } from '@/lib/admin-settings'
import DevelopmentProcessClient from './development-process-client'

export const dynamic = 'force-dynamic'

export async function DevelopmentProcess() {
  const adminSettings = await getServerAdminSettings()

  return <DevelopmentProcessClient adminSettings={adminSettings} />
}