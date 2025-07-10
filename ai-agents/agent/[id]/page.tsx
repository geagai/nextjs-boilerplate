'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/ai-agents/components/chat-interface'
import { ArrowLeft, Bot, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { loadAgent } from '@/lib/ai-agent-utils'
import type { Agent } from '@/lib/types'

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params?.id as string
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isAgentLoading, setIsAgentLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Load user and agent data for header
  useEffect(() => {
    const loadUserAndAgent = async () => {
      try {
        setIsAgentLoading(true)
        
        // Get current user
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw new Error(`Failed to get user: ${userError.message}`)
        }
        
        if (!user) {
          throw new Error('You must be logged in to use this feature')
        }
        
        setCurrentUser(user)
        
        // Load agent data
        const agentResult = await loadAgent(agentId, user.id)
        
        if (!agentResult.success || !agentResult.agent) {
          throw new Error(agentResult.error || 'Failed to load agent')
        }
        
        setAgent(agentResult.agent)
        
      } catch (error) {
        console.error('Failed to load user and agent:', error)
      } finally {
        setIsAgentLoading(false)
      }
    }
    
    if (agentId) {
      loadUserAndAgent()
    }
  }, [agentId])

  if (!agentId) {
    notFound()
  }

  return (
    <div className="flex bg-background" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (fixed height) */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ height: 97, minHeight: 97 }}>
          <div className="flex items-center justify-between p-4 h-full max-h-full">
            <div className="flex items-center gap-3 max-h-full">
              {/* Back Button */}
              <Link href="/ai-agents/agents">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              
              {/* Agent Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  {isAgentLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-lg font-semibold">Loading agent...</span>
                    </div>
                  ) : agent ? (
                    <>
                      <h1 className="text-lg font-semibold">{agent.name}</h1>
                      <p className="text-sm text-muted-foreground">
                        {agent.description || 'Interact with your AI agent'}
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-lg font-semibold">AI Agent Chat</h1>
                      <p className="text-sm text-muted-foreground">
                        Interact with your AI agent
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface (fills remaining space below header) */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatInterface 
            agentId={agentId}
            hideAgentHeader={true}
          />
        </div>
      </div>
    </div>
  )
} 