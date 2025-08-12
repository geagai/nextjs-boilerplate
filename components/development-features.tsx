import { getServerAdminSettings } from '@/lib/admin-settings'
import DevelopmentFeaturesClient from './development-features-client'

export const dynamic = 'force-dynamic'

export async function DevelopmentFeatures() {
  const adminSettings = await getServerAdminSettings()

  return <DevelopmentFeaturesClient adminSettings={adminSettings} />
}