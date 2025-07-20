import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { AgentChatClient } from '@/ai-agents/components/agent-chat-client'

export default async function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = await params;
  
  if (!agentId) {
    throw new Error('Agent ID is required');
  }

  // Optional server-side auth check - don't redirect if not logged in
  let user = null;
  
  try {
    const authResult = await requireAuth();
    user = authResult.user;
  } catch (error) {
    // User is not logged in, continue without authentication
    user = null;
  }

  // Fetch agent data server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client');
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