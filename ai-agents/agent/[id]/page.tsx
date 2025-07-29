import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { AgentChatClient } from '@/ai-agents/components/agent-chat-client'

export const dynamic = 'force-dynamic'

export default async function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = await params;
  
  if (!agentId) {
    throw new Error('Agent ID is required');
  }

  // Fetch agent data server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client');
  }

  // Get user session
  const sessionData = await getServerSession();
  let user = null;
  
  if (sessionData && sessionData.user) {
    user = sessionData.user;
  }
  
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .eq('is_public', true)
    .single();

  if (error || !agent) {
    throw new Error('Agent not found or not public');
  }

  // Process agent data
  const processedAgent = {
    ...agent,
    icon: agent.config?.options?.icon || null
  };



  return (
    <AgentChatClient 
      agentId={agentId}
      agent={processedAgent}
      user={user}
    />
  );
} 