"use client";
import dynamic from 'next/dynamic';
import React from 'react';
import AddonMissing from '../agents/AddonMissing';

const MyAgentsTable = dynamic(
  async () => {
    try {
      // @ts-expect-error: This import may not exist, but is handled at runtime
      const mod = await import('@/ai-agents/my-agents/my-agents-table');
      return mod.default;
    } catch (e) {
      return () => <AddonMissing addonName="AI Agents" purchaseUrl="https://www.geag.ai/ai-agents-addon" />;
    }
  },
  { ssr: false }
);

export default function MyAgentsTableWrapper() {
  return <MyAgentsTable />;
} 