import { getServerAdminSettings } from '@/lib/admin-settings'
import DevelopmentTechStackClient from './development-tech-stack-client'

export const dynamic = 'force-dynamic'

export async function DevelopmentTechStack() {
  const adminSettings = await getServerAdminSettings()

  return <DevelopmentTechStackClient adminSettings={adminSettings} />
}