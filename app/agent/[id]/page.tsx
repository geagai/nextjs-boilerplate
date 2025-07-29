import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import AgentPageWrapper from '@/components/ai-agents/AgentPageWrapper'

export default async function AgentRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = await params
  
  if (!agentId) {
    notFound()
  }

  // Get user session
  const sessionData = await getServerSession();
  let user = null;
  
  if (sessionData && sessionData.user) {
    user = sessionData.user;
  }

  // Fetch agent data server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }
  
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .eq('is_public', true)
    .single();

  if (error || !agent) {
    notFound()
  }

  // Process agent data
  const processedAgent = {
    ...agent,
    icon: agent.config?.options?.icon || null
  };

  return <AgentPageWrapper agent={processedAgent} user={user} />;
} 