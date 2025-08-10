import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import AgentPageWrapper from '@/components/ai-agents/AgentPageWrapper'
import { Metadata } from 'next'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  rawData?: any
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id: agentId } = await params
  
  if (!agentId) {
    return {
      title: 'Agent Not Found - Geag AI',
      description: 'The requested agent could not be found.'
    }
  }

  // Fetch agent data for metadata
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    return {
      title: 'Error - Geag AI',
      description: 'Unable to load agent information.'
    }
  }
  
  const { data: agent, error } = await supabase
    .from('agents')
    .select('name, description')
    .eq('id', agentId)
    .eq('is_public', true)
    .single();

  if (error || !agent) {
    return {
      title: 'Agent Not Found - Geag AI',
      description: 'The requested agent could not be found.'
    }
  }

  const title = `${agent.name} - Geag AI`;
  const description = agent.description ? agent.description.substring(0, 60) + (agent.description.length > 60 ? '...' : '') : 'AI Agent powered by Geag AI';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function AgentRoute({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ sessionId?: string }>
}) {
  const { id: agentId } = await params
  const { sessionId } = await searchParams
  
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

  // Fetch sessions server-side (EXACT same logic as the API route)
  let sessions = [];
  if (user) {
    try {
      // Convert UUID values to strings to match the text columns in the database
      const UID = String(user.id);
      const agent_id = String(agentId);

      const { data, error } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('UID', UID)
        .eq('agent_id', agent_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Server] Error fetching sessions:', error);
        sessions = [];
      } else if (data) {
        // Group messages by session_id and create Session objects
        const sessionMap = new Map();
        data.forEach((message: any) => {
          if (!sessionMap.has(message.session_id)) {
            sessionMap.set(message.session_id, {
              session_id: message.session_id,
              prompt: message.prompt,
              created_at: message.created_at
            });
          }
        });
        
        sessions = Array.from(sessionMap.values());
      } else {
        console.log('[Server] No data found');
        sessions = [];
      }
    } catch (error) {
      console.error('[Server] Error fetching sessions:', error);
      sessions = [];
    }
  }

  // Process agent data
  const processedAgent = {
    ...agent,
    icon: agent.config?.options?.icon || null
  };

  return <AgentPageWrapper agent={processedAgent} user={user} sessionId={sessionId || null} initialMessages={initialMessages} initialSessions={sessions} />;
} 