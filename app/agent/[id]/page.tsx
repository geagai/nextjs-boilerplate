import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import AgentPageWrapper from '@/components/ai-agents/AgentPageWrapper'

export default async function AgentRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = await params
  
  if (!agentId) {
    notFound()
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

  return <AgentPageWrapper />;
} 