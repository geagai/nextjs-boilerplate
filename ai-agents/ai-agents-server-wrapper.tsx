import { getServerAdminSettings } from '@/lib/admin-settings'
import AIAgentsPageWrapper from '@/components/ai-agents/AIAgentsPageWrapper'

export const dynamic = 'force-dynamic'

export async function AIAgentsServerWrapper() {
  const adminSettings = await getServerAdminSettings()

  return (
    <AIAgentsPageWrapper adminSettings={adminSettings} />
  )
} 