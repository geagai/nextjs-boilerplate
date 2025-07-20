import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { requireAuth, isAdmin } from '@/lib/auth'
import EditAgentPageWrapper from '@/components/ai-agents/EditAgentPageWrapper'

export default async function EditAgentRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = await params
  
  if (!agentId) {
    notFound()
  }

  // Require authentication and admin access
  const { user } = await requireAuth()
  if (!isAdmin(user)) {
    redirect('/dashboard')
  }

  // Fetch agent data server-side
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }
  
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .eq('UID', (user as any).id)
    .single()

  if (error || !agent) {
    notFound()
  }

  // Process agent data
  const processedAgent = {
    ...agent,
    icon: agent.config?.options?.icon || null
  }

  return <EditAgentPageWrapper agent={processedAgent} />
} 