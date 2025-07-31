"use client"

import { useState, useEffect } from 'react'
import { generateSessionId } from '@/lib/ai-agent-utils'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/ai-agents/components/chat-interface'
import { ArrowLeft, Bot, Loader2, Settings } from 'lucide-react'
import Link from 'next/link'
import { SessionSidebar } from '@/ai-agents/components/session-sidebar'
import { AgentConfigSidebar } from '@/ai-agents/components/agent-config-sidebar'
import type { Agent } from '@/lib/types'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  rawData?: any
}

interface AgentChatClientProps {
  agentId: string
  agent: Agent
  user: any
  sessionId?: string | null
  initialMessages?: Message[]
}

export function AgentChatClient({ 
  agentId, 
  agent, 
  user, 
  sessionId: serverSessionId,
  initialMessages 
}: AgentChatClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isConfigSidebarOpen, setIsConfigSidebarOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(serverSessionId || null)
  
  // Form state for agent config
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isFormValid, setIsFormValid] = useState(true)
  const [formErrors, setFormErrors] = useState<string[]>([])
  
  const handleValidationChange = (valid: boolean, errors: string[]) => {
    setIsFormValid(valid)
    setFormErrors(errors)
  }

  // Update selectedSessionId when serverSessionId changes
  useEffect(() => {
    setSelectedSessionId(serverSessionId || null)
  }, [serverSessionId])

  return (
    <div className="flex bg-background" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Chat History Sidebar */}
      <SessionSidebar
        agentId={agentId}
        currentSessionId={selectedSessionId}
        onSessionSelect={setSelectedSessionId}
        onNewSession={() => setSelectedSessionId(generateSessionId())}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={false}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Chat Interface (fills entire space, now includes scrollable header) */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Header (now scrollable) */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ height: 97, minHeight: 97 }}>
            <div className="flex items-center justify-between p-4 h-full max-h-full">
              <div className="flex items-center gap-3 max-h-full">
                {/* Back Button */}
                <Link href="/agents">
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
                    <h1 className="text-lg font-semibold" style={{ marginTop: 0 }}>{agent.name}</h1>
                    <p className="text-sm text-muted-foreground hidden md:block">
                      {agent.description || 'Interact with your AI agent'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ChatInterface 
            agentId={agentId}
            agent={agent}
            user={user}
            hideAgentHeader={true}
            sessionId={selectedSessionId}
            initialMessages={initialMessages}
            formData={formData}
            onFormDataChange={setFormData}
            isFormValid={isFormValid}
            onValidationChange={handleValidationChange}
          />
        </div>
      </div>
      
      {/* Agent Config Sidebar */}
      {agent && (
        <AgentConfigSidebar
          agent={agent}
          formData={formData}
          onFormDataChange={setFormData}
          onValidationChange={setIsFormValid}
          disabled={false}
          isOpen={isConfigSidebarOpen}
          onClose={() => setIsConfigSidebarOpen(false)}
          isMobile={false}
          user={user}
        />
      )}
      
      {/* Chat History Button - fixed to bottom left of viewport */}
      <div style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 100 }}>
        <Button variant="outline" onClick={() => setIsSidebarOpen(open => !open)}>
          Chat History
        </Button>
      </div>
      
      {/* Agent Config Button - fixed to bottom right of viewport */}
      {agent?.config?.body && agent.config.body.length > 0 && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 100 }}>
          <Button variant="outline" onClick={() => setIsConfigSidebarOpen(open => !open)}>
            <Settings className="w-4 h-4 mr-2" />
            Agent Config
          </Button>
        </div>
      )}
    </div>
  )
} 