import { Hero } from '@/components/hero'
import { FeaturedAgents } from '@/components/featured-agents'
import { AIPlatformInfo } from '@/components/ai-platform-info'
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
      {/* Content Creation Agents Hero Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Supercharge</span> Your Content Creation
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform your content workflow with AI agents designed for modern creators. Generate blog posts, design visuals, brainstorm ideas, and produce videos—all powered by intelligent automation that learns your brand voice and style.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-8 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Blog Post Agents</h3>
              <p className="text-sm text-muted-foreground">From SEO-optimized outlines to long-form articles tailored to your brand voice and audience.</p>
            </div>
            <div className="group p-8 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Image Generation</h3>
              <p className="text-sm text-muted-foreground">Create stunning visuals, product mockups, and campaign assets that align with your brand guidelines.</p>
            </div>
            <div className="group p-8 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Content Ideas</h3>
              <p className="text-sm text-muted-foreground">Never run out of ideas with AI that researches trends and generates content calendars.</p>
            </div>
            <div className="group p-8 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Video Creation</h3>
              <p className="text-sm text-muted-foreground">Generate scripts, storyboards, and edit social-ready clips that capture attention.</p>
            </div>
          </div>
        </div>
      </section>
      <AIPlatformInfo />
      <FeaturedAgents agents={agents} />
    </div>
  );
}
