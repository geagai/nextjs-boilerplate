import { getServerAdminSettings } from '@/lib/admin-settings'
import ContactSectionClient from './contact-section-client'

export const dynamic = 'force-dynamic'

export async function ContactSection() {
  const adminSettings = await getServerAdminSettings()

  return <ContactSectionClient adminSettings={adminSettings} />
}
