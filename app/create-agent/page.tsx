"use client";
import dynamic from 'next/dynamic';
import AddonMissing from '../agents/AddonMissing';

const CreateAgentPage = dynamic(
  async () => {
    try {
      const mod = await import('@/ai-agents/create-agent/page');
      return mod.default;
    } catch {
      return () => <AddonMissing addonName="AI Agents" purchaseUrl="https://www.geag.ai/ai-agents-addon" />;
    }
  },
  { ssr: false }
);

export default function CreateAgentRoute() {
  return <CreateAgentPage />;
} 