import Link from 'next/link'
import { Plus } from 'lucide-react'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

import { Button } from '@/components/ui/button'

import { AgentsClientWrapper } from '@/ai-agents/components/agents-client-wrapper'

export default async function AgentsPage() {
  // Server-side auth check
  const { user } = await requireAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin'

  // Fetch agents server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }
  
  const { data: agents, error } = await supabase
    .from('agents')
    .select('*')
    .eq('is_public', true);

  if (error) {
    throw new Error(`Failed to fetch agents: ${error.message}`)
  }

  // Process agents data
  const processedAgents = (agents || []).map((agent: any) => ({
    ...agent,
    icon: agent.config?.options?.icon || null
  }));

  // Extract categories
  const categories = Array.from(new Set(processedAgents.map((a: any) => a.category).filter(Boolean)));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 pr-32">
            <h1 className="text-3xl font-bold text-primary mb-2">AI Agents</h1>
            <p className="text-muted-foreground">
              Explore our library of intelligent agents to automate tasks and find information.
            </p>
          </div>
          {isAdmin && (
            <Link href="/create-agent" className="absolute right-0 top-0">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Agent
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <AgentsClientWrapper
        agents={processedAgents}
        user={user}
        isAdmin={isAdmin}
      />
    </div>
  )
} 