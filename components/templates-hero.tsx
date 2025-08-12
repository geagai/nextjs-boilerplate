import { getServerAdminSettings } from '@/lib/admin-settings'
import TemplatesHeroClient from './templates-hero-client'

export const dynamic = 'force-dynamic'

export async function TemplatesHero() {
  const adminSettings = await getServerAdminSettings()

  return <TemplatesHeroClient adminSettings={adminSettings} />
}
