'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/ai-agents/components/chat-interface'
import { ArrowLeft, Bot, Loader2, Settings } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { loadAgent } from '@/lib/ai-agent-utils'
import type { Agent } from '@/lib/types'
import { SessionSidebar } from '@/ai-agents/components/session-sidebar'
import { AgentConfigSidebar } from '@/ai-agents/components/agent-config-sidebar'
import { useAuth } from '@/components/auth-provider'

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params?.id as string
  const { user: authUser, loading: authLoading } = useAuth()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isAgentLoading, setIsAgentLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isConfigSidebarOpen, setIsConfigSidebarOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  
  // Form state for agent config
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isFormValid, setIsFormValid] = useState(true)
  const [formErrors, setFormErrors] = useState<string[]>([])
  
  const handleValidationChange = (valid: boolean, errors: string[]) => {
    setIsFormValid(valid)
    setFormErrors(errors)
  }

  // Load user and agent data for header
  useEffect(() => {
    if (authLoading) return;
    const loadUserAndAgent = async () => {
      try {
        setIsAgentLoading(true)
        const supabase = createClient()
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        // Ensure the Supabase client has the latest session before querying
        await supabase.auth.getSession()

        // Use user information from AuthProvider (already resolved)
        setCurrentUser(authUser ?? null)

        const agentResult = await loadAgent(agentId, authUser?.id)
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
  }, [agentId, authLoading, authUser])

  useEffect(() => {
    // console.log('DEBUG: AgentChatPage selectedSessionId', selectedSessionId)
  }, [selectedSessionId])

  if (!agentId) {
    notFound()
  }

  if (authLoading) {
    return <div className="flex items-center justify-center h-full w-full">Loading authentication...</div>;
  }

  return (
    <div className="flex bg-background" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Chat History Sidebar */}
      <SessionSidebar
        agentId={agentId}
        currentSessionId={selectedSessionId}
        onSessionSelect={setSelectedSessionId}
        onNewSession={() => setSelectedSessionId(null)}
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
                    {isAgentLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-lg font-semibold">Loading agent...</span>
                      </div>
                    ) : agent ? (
                      <>
                        <h1 className="text-lg font-semibold" style={{ marginTop: 0 }}>{agent.name}</h1>
                        <p className="text-sm text-muted-foreground">
                          {agent.description || 'Interact with your AI agent'}
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-lg font-semibold" style={{ marginTop: 0 }}>AI Agent Chat</h1>
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
          <ChatInterface 
            agentId={agentId}
            hideAgentHeader={true}
            sessionId={selectedSessionId}
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