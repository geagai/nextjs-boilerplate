"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Brain, ArrowRight, Zap, Code, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string | number
  name: string
  description?: string | null
  icon?: string | null
}

interface FeaturedAgentsProps {
  agents: Agent[]
}

function renderAgentIcon(icon: any) {
  if (!icon) return <Bot className="w-8 h-8 text-muted-foreground" />;
  if (icon === 'Bot') return <Bot className="w-8 h-8" />;
  if (icon === 'Brain') return <Brain className="w-8 h-8" />;
  if (icon === 'Zap') return <Zap className="w-8 h-8" />;
  if (icon === 'Code') return <Code className="w-8 h-8" />;
  if (icon === 'MessageSquare') return <MessageSquare className="w-8 h-8" />;
  // Emoji or fallback
  if (typeof icon === 'string' && /\p{Emoji}/u.test(icon)) {
    return <span className="w-8 h-8 inline-block text-2xl">{icon}</span>;
  }
  return <span className="w-8 h-8 inline-block text-2xl">{icon}</span>;
}

export function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  if (agents.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.slice(0, 6).map((agent) => (
            <Card key={agent.id} className="flex flex-col relative min-h-[200px] hover:shadow-lg transition-shadow">
              <div className="absolute top-4 right-4 text-muted-foreground">
                {renderAgentIcon(agent.icon)}
              </div>
              <CardHeader>
                <CardTitle className="text-primary pr-10 text-lg">{agent.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {agent.description ?? 'No description provided.'}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <Link href={`/agent/${agent.id}`}>
                    <Button size="sm">View Agent</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
                 <div className="text-center mt-16">
           <Link href="/agents">
             <Button size="lg" className="text-lg px-8 py-3 btn-glow group">
               View All Agents
               <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
             </Button>
           </Link>
         </div>
      </div>
    </section>
  )
} 