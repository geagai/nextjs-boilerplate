import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { AgentChatClient } from '@/ai-agents/components/agent-chat-client'

export const dynamic = 'force-dynamic'

export default async function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  console.log('=== AGENT PAGE LOADING ===');
  console.error('=== AGENT PAGE ERROR LOG ===');
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

  // Get user session - same pattern as dashboard
  const sessionData = await getServerSession();
  console.log('Session data:', sessionData);
  let user = null;
  let userCredits = 0;
  
  if (sessionData && sessionData.user) {
    user = sessionData.user;
    console.log('User found:', user.id);
    
    // Fetch user credits - same pattern as dashboard
    try {
      const { data: userData, error: userDataError } = await supabase
        .from('user_data')
        .select('credits')
        .eq('UID', user.id)
        .single();
      
      console.log('User data fetch result:', { userData, userDataError });
      
      if (!userDataError && userData) {
        if (userData.credits === null || userData.credits === undefined) {
          userCredits = 0;
        } else {
          userCredits = userData.credits;
        }
        console.log('Final userCredits:', userCredits);
      }
    } catch (e) {
      console.log('Error fetching credits:', e);
      // fallback to 0 credits
      userCredits = 0;
    }
  } else {
    console.log('No session data or user');
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
      userCredits={userCredits}
    />
  );
} 