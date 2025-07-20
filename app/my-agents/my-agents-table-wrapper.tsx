"use client";
import React from 'react';

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

interface MyAgentsTableWrapperProps {
  agents: any[];
}

export default function MyAgentsTableWrapper({ agents }: MyAgentsTableWrapperProps) {
  let MyAgentsTable: React.ComponentType<{ agents: any[] }> | null = null;
  try {
    // eslint-disable-next-line
    const mod = require('@/ai-agents/my-agents/my-agents-table');
    MyAgentsTable = mod.default || null;
  } catch (e) {
    MyAgentsTable = null;
  }

  if (!MyAgentsTable) {
    return <AddonMissing addonName="AI Agents" purchaseUrl="https://www.geag.ai/ai-agents-addon" />;
  }

  return <MyAgentsTable agents={agents} />;
} 