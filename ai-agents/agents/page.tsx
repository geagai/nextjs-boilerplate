import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from '@/lib/auth'
import type { Metadata } from 'next'

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

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: { cat?: string }
}) {
  const resolvedSearchParams = searchParams;
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
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Advanced <span className="gradient-text">AI Agents</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed mb-16">
              Discover powerful AI agents designed to revolutionize your workflow. From content creation to data analysis, our intelligent assistants help you automate complex tasks and boost productivity. Our software development agents can generate code, debug issues, create documentation, and assist with project planning. Whether you're building web applications, mobile apps, or enterprise solutions, our AI agents provide expert guidance and accelerate your development process.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AgentsClientWrapper
          agents={processedAgents}
          user={user}
          isAdmin={isAdmin}
          initialCategory={transformedCategory}
        />
      </div>
    </>
  )
} 