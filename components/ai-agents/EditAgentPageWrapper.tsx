"use client";
import React from 'react';
import AddonMissing from '../../app/agents/AddonMissing';

export default function EditAgentPageWrapper() {
  let EditAgentPage: React.ComponentType | null = null;
  try {
    // eslint-disable-next-line
    const mod = require('@/ai-agents/edit-agent/[id]/page');
    EditAgentPage = mod.default || null;
  } catch (e) {
    EditAgentPage = null;
  }

  if (!EditAgentPage) {
    return <AddonMissing addonName="AI Agents" purchaseUrl="https://www.geag.ai/ai-agents-addon" />;
  }

  return <EditAgentPage />;
} 