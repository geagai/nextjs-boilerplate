"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Brain } from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string | number
  name: string
  description?: string | null
  icon?: string | null
}

interface AgentListProps {
  agents: Agent[]
  viewMode: 'grid' | 'list'
  emptyMessage: string
  emptyAction?: React.ReactNode
}

function renderAgentIcon(icon: any) {
  if (!icon) return <Bot className="w-12 h-12 text-muted-foreground" />;
  if (icon === 'Bot') return <Bot className="w-12 h-12" />;
  if (icon === 'Brain') return <Brain className="w-12 h-12" />;
  // Emoji or fallback
  if (typeof icon === 'string' && /\p{Emoji}/u.test(icon)) {
    return <span className="w-12 h-12 inline-block text-3xl">{icon}</span>;
  }
  return <span className="w-12 h-12 inline-block text-3xl">{icon}</span>;
}

export function AgentList({ agents, viewMode, emptyMessage, emptyAction }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="flex flex-col relative">
            <div className="absolute top-4 right-4 text-muted-foreground">
              {renderAgentIcon(agent.icon)}
            </div>
            <CardHeader>
              <CardTitle className="text-primary pr-10">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {agent.description ?? 'No description provided.'}
              </p>
              <Link href={`/agent/${agent.id}`} className="mt-4 inline-block">
                <Button size="sm">View</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // list view
  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="relative">
          <div className="absolute top-4 right-4 text-muted-foreground">
            {renderAgentIcon(agent.icon)}
          </div>
          <CardHeader>
            <CardTitle className="text-primary pr-10">{agent.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {agent.description ?? 'No description provided.'}
            </p>
            <Link href={`/agent/${agent.id}`} className="mt-4 inline-block">
              <Button size="sm">View</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 