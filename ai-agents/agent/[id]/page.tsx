'use client'

import { useParams, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/ai-agents/components/chat-interface'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params?.id as string

  if (!agentId) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Link href="/ai-agents/agents">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <div>
              <h1 className="text-lg font-semibold">AI Agent Chat</h1>
              <p className="text-sm text-muted-foreground">
                Interact with your AI agent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="container mx-auto px-4 py-6">
        <ChatInterface 
          agentId={agentId}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  )
} 