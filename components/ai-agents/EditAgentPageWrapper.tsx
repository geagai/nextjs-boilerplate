"use client";
import React from 'react';
import AddonMissing from '../../app/agents/AddonMissing';
import type { Agent } from '@/lib/types';

interface EditAgentPageWrapperProps {
  agent: Agent;
}

export default function EditAgentPageWrapper({ agent }: EditAgentPageWrapperProps) {
  let EditAgentPage: React.ComponentType<{ agent: Agent }> | null = null;
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

  return <EditAgentPage agent={agent} />;
} 