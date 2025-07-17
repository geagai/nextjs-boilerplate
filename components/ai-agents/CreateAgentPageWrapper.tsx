"use client";
import React from 'react';
import AddonMissing from '../../app/agents/AddonMissing';

export default function CreateAgentPageWrapper() {
  let CreateAgentPage: React.ComponentType | null = null;
  try {
    // eslint-disable-next-line
    const mod = require('@/ai-agents/create-agent/page');
    CreateAgentPage = mod.default || null;
  } catch (e) {
    CreateAgentPage = null;
  }

  if (!CreateAgentPage) {
    return <AddonMissing addonName="AI Agents" purchaseUrl="https://www.geag.ai/ai-agents-addon" />;
  }

  return <CreateAgentPage />;
} 