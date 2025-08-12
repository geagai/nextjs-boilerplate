import { getServerAdminSettings } from '@/lib/admin-settings'
import DevelopmentBenefitsClient from './development-benefits-client'

export const dynamic = 'force-dynamic'

export async function DevelopmentBenefits() {
  const adminSettings = await getServerAdminSettings()

  return <DevelopmentBenefitsClient adminSettings={adminSettings} />
}