"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Brain, Target, Zap, Code, MessageSquare, PenTool, TrendingUp, Heart } from 'lucide-react'
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
  if (icon === 'Target') return <Target className="w-12 h-12" />;
  if (icon === 'Zap') return <Zap className="w-12 h-12" />;
  if (icon === 'Code') return <Code className="w-12 h-12" />;
  if (icon === 'MessageSquare') return <MessageSquare className="w-12 h-12" />;
  if (icon === 'PenTool') return <PenTool className="w-12 h-12" />;
  if (icon === 'TrendingUp') return <TrendingUp className="w-12 h-12" />;
  if (icon === 'Heart') return <Heart className="w-12 h-12" />;
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
          <Card key={agent.id} className="flex flex-col relative min-h-[220px]">
            <div className="absolute top-4 right-4 text-muted-foreground">
              {renderAgentIcon(agent.icon)}
            </div>
            <CardHeader>
              <CardTitle className="text-primary pr-10">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {agent.description ?? 'No description provided.'}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <Link href={`/agent/${agent.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
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
        <Card key={agent.id} className="relative min-h-[220px]">
          <div className="absolute top-4 right-4 text-muted-foreground">
            {renderAgentIcon(agent.icon)}
          </div>
          <CardHeader>
            <CardTitle className="text-primary pr-10">{agent.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {agent.description ?? 'No description provided.'}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Link href={`/agent/${agent.id}`}>
                <Button size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 