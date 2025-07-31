import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { AgentChatClient } from '@/ai-agents/components/agent-chat-client'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  rawData?: any
}

export const dynamic = 'force-dynamic'

export default async function AgentChatPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ sessionId?: string }>
}) {
  const { id: agentId } = await params;
  const { sessionId } = await searchParams;
  
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

  // Fetch messages server-side if sessionId is provided
  let initialMessages: Message[] = [];
  if (sessionId && user?.id) {
    try {
      const { data: messages, error: messagesError } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('UID', user.id)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: true });

      if (!messagesError && messages) {
        initialMessages = messages
          .filter(msg => msg.message && msg.message.trim() !== '')
          .map(msg => ({
            id: msg.id || `msg-${Date.now()}-${Math.random()}`,
            content: msg.message || '',
            role: 'assistant' as const,
            timestamp: msg.created_at || new Date().toISOString(),
            rawData: msg
          }));
      }
    } catch (error) {
      console.error('Failed to load messages server-side:', error);
    }
  }

  return (
    <AgentChatClient 
      agentId={agentId}
      agent={processedAgent}
      user={user}
      sessionId={sessionId || null}
      initialMessages={initialMessages}
    />
  );
} 