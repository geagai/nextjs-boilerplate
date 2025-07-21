import { getServerAdminSettings } from '@/lib/admin-settings'
import AIAgentsPageWrapper from '@/components/ai-agents/AIAgentsPageWrapper'

export const dynamic = 'force-dynamic'

interface AIAgentsServerWrapperProps {
  children: React.ReactNode
}

export async function AIAgentsServerWrapper({ children }: AIAgentsServerWrapperProps) {
  const adminSettings = await getServerAdminSettings()

  return (
    <AIAgentsPageWrapper adminSettings={adminSettings}>
      {children}
    </AIAgentsPageWrapper>
  )
} 