import React from 'react';
import type { Metadata } from 'next';

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

const AddonMissing = ({ addonName, purchaseUrl }: { addonName: string; purchaseUrl: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20">
    <div className="max-w-md mx-auto text-center py-16">
      <h3 className="text-xl font-semibold mb-2">{addonName} Add-on Not Installed</h3>
      <p className="text-muted-foreground mb-6">
        You need to purchase and install the {addonName} add-on to use this feature.
      </p>
      <a
        href={purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Purchase {addonName} Add-on
      </a>
    </div>
  </div>
);

export default async function AgentsRoute({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  let AgentsPage: React.ComponentType | null = null;
  try {
    // eslint-disable-next-line
    const mod = require('../../ai-agents/agents/page');
    AgentsPage = mod.default || mod.AgentsPage || null;
  } catch (e) {
    AgentsPage = null;
  }

  if (!AgentsPage) {
    return (
      <AddonMissing
        addonName="AI Agents"
        purchaseUrl="https://www.geag.ai/ai-agents-addon"
      />
    );
  }

  return <AgentsPage />;
} 