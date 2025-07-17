"use client";
import React from 'react';
import AddonMissing from '../agents/AddonMissing';

export default function MyAgentsTableWrapper() {
  let MyAgentsTable: React.ComponentType | null = null;
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

  return <MyAgentsTable />;
} 