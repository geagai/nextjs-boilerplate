import { getServerAdminSettings } from '@/lib/admin-settings'
import DevelopmentHeroClient from './development-hero-client'

export const dynamic = 'force-dynamic'

export async function DevelopmentHero() {
  const adminSettings = await getServerAdminSettings()

  return <DevelopmentHeroClient adminSettings={adminSettings} />
}
