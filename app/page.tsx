import { Hero } from '@/components/hero'
import { FeaturedAgents } from '@/components/featured-agents'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export default async function HomePage() {
  // Fetch agents server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  let agents = [];
  
  if (supabase) {
    const { data: agentsData, error } = await supabase
      .from('agents')
      .select('*')
      .eq('is_public', true)
      .limit(6);

    if (!error && agentsData) {
      agents = agentsData.map((agent: any) => ({
        ...agent,
        icon: agent.config?.options?.icon || null
      }));
    }
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedAgents agents={agents} />
    </div>
  );
}
