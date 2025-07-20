'use client'

import { AgentForm } from '@/ai-agents/components/agent-form'
import type { Agent } from '@/lib/types'

interface EditAgentPageProps {
  agent: Agent
}

export default function EditAgentPage({ agent }: EditAgentPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <AgentForm mode="edit" initialData={agent} />
    </div>
  )
} 