import { requireAuth, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import MyAgentsTableWrapper from './my-agents-table-wrapper';

export default async function MyAgentsPage() {
  const { user } = await requireAuth();
  if (!isAdmin(user)) {
    redirect('/dashboard');
  }

  // Fetch agents data server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client');
  }
  
  const { data: agents, error } = await supabase
    .from('agents')
    .select('*')
    .eq('UID', (user as any).id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch agents: ${error.message}`);
  }

  // Process agents data
  const processedAgents = (agents || []).map((agent: any) => ({
    ...agent,
    icon: agent.config?.options?.icon || null
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 pr-32">
            <h1 className="text-3xl font-bold text-primary mb-2">My Agents</h1>
            <p className="text-muted-foreground">
              View and manage all agents in the system. Only admins can access this page.
            </p>
          </div>
        </div>
      </div>
      <MyAgentsTableWrapper agents={processedAgents} />
    </div>
  );
} 