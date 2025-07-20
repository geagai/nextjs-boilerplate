
import { getServerAdminSettings } from '@/lib/admin-settings'
import HeroClient from './hero-client'

export const dynamic = 'force-dynamic'

export async function Hero() {
  const adminSettings = await getServerAdminSettings()

  return <HeroClient adminSettings={adminSettings} />
}
