import Link from 'next/link'
import { Plus } from 'lucide-react'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import type { Metadata } from 'next'
import { searchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { AgentsClientWrapper } from '@/ai-agents/components/agents-client-wrapper'

export const metadata: Metadata = {
  title: 'AI Agents Library – Intelligent Automation & Business Development',
  description: 'Discover a wide range of AI Agents to automate tasks, grow your business and develop production ready applications.',
  keywords: 'AI agents, automation, business development, software development, intelligent assistants',
  openGraph: {
    title: 'AI Agents Library – Intelligent Automation & Business Development',
    description: 'Discover a wide range of AI Agents to automate tasks, grow your business and develop production ready applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agents Library – Intelligent Automation & Business Development',
    description: 'Discover a wide range of AI Agents to automate tasks, grow your business and develop production ready applications.',
  },
}

export default async function AgentsPage() {
  // Get searchParams directly from the URL
  const params = await searchParams();
  const resolvedSearchParams = { cat: params.get('cat') || undefined };
  // Optional server-side auth check - don't redirect if not logged in
  let user = null;
  let isAdmin = false;
  
  try {
    const authResult = await getServerSession();
    user = authResult?.user || null;
    isAdmin = user?.role?.toLowerCase() === 'admin';
  } catch (error) {
    // User is not logged in, continue without authentication
    user = null;
    isAdmin = false;
  }

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

  // Transform category parameter to match database format
  const transformCategory = (cat: string | undefined): string | undefined => {
    if (!cat) return undefined;
    
    // Replace hyphens with spaces and convert to title case
    return cat
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const transformedCategory = transformCategory(resolvedSearchParams.cat);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 pr-32">
            <h1 className="text-3xl font-bold text-primary mb-2">Advanced AI Agents</h1>
            <p className="text-muted-foreground">
              Discover powerful AI agents designed to revolutionize your workflow. From content creation to data analysis, our intelligent assistants help you automate complex tasks and boost productivity. Our software development agents can generate code, debug issues, create documentation, and assist with project planning. Whether you're building web applications, mobile apps, or enterprise solutions, our AI agents provide expert guidance and accelerate your development process.
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
        initialCategory={transformedCategory}
      />
    </div>
  )
} 