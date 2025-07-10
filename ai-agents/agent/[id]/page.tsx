'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/ai-agents/components/chat-interface'
import { SessionSidebar } from '@/ai-agents/components/session-sidebar'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { useAdminSettings } from '@/components/admin-settings-provider'
import { useChat } from '@/ai-agents/hooks/use-chat'
import { Menu, ArrowLeft } from 'lucide-react'
import * as Icons from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string | number
  name: string
  description?: string | null
  is_public: boolean
  UID: string
  config?: {
    options?: {
      icon?: string
    }
  }
}

export default function AgentChatPage() {
  const params = useParams()
  const { user } = useAuth()
  const { getButtonStyles, getButtonHoverStyles } = useAdminSettings()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const agentId = params?.id as string

  const { sessionId, createNewSession, setSessionId } = useChat({
    agentId,
    onSessionCreate: (newSessionId: string) => {
      // Session created callback
    }
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!agentId || !user) return

    // Try to load agent from sessionStorage first
    const cachedAgent = sessionStorage.getItem(`agent_${agentId}`)
    if (cachedAgent) {
      setAgent(JSON.parse(cachedAgent))
      setIsLoading(false)
      return
    }

    const loadAgent = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
        // Load agent (public agents or owned by user)
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .single()

        if (agentError) {
          setError('Agent not found')
          return
        }

        // Check if user can access this agent
        if (!agentData.is_public && agentData.UID !== user.id) {
          setError('You do not have permission to access this agent')
          return
        }

        setAgent(agentData)
        sessionStorage.setItem(`agent_${agentId}`, JSON.stringify(agentData))
      } catch (err) {
        console.error('Error loading agent:', err)
        setError('Failed to load agent')
      } finally {
        setIsLoading(false)
      }
    }

    loadAgent()
  }, [agentId, user])

  const handleNewSession = () => {
    const newSessionId = createNewSession()
    setIsSidebarOpen(false)
  }

  const handleSessionSelect = (selectedSessionId: string) => {
    setSessionId(selectedSessionId)
  }

  if (!agentId) {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground">{error || 'Agent not found'}</p>
          <Link href="/ai-agents/agents" className="inline-block mt-4">
            <Button 
              style={getButtonStyles()}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, getButtonHoverStyles())}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, getButtonStyles())}
            >
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const iconName = agent.config?.options?.icon || 'Bot'
  const IconComponent = (Icons as any)[iconName] || Icons.Bot

  return (
    <div className="flex bg-background" style={{ height: 'calc(100vh - 100px)' }} data-agent-page>
      {/* Session Sidebar */}
      <SessionSidebar
        agentId={agentId}
        currentSessionId={sessionId}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (fixed height) */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ height: 97, minHeight: 97 }}>
          <div className="flex items-center justify-between p-4 h-full max-h-full">
            <div className="flex items-center gap-3 max-h-full">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>

              {/* Back Button */}
              <Link href="/ai-agents/agents">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              {/* Agent Info */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 w-full">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mb-1 md:mb-0 hidden md:block">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 w-full break-words overflow-y-auto max-h-16">
                  <h1 className="font-semibold text-[16px] md:text-lg break-words w-full whitespace-normal">{agent.name}</h1>
                  <p className="text-[12px] md:text-sm text-muted-foreground break-words w-full whitespace-normal">
                    {agent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Session Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex"
            >
              {isSidebarOpen ? 'Hide' : 'Show'} History
            </Button>
          </div>
        </div>

        {/* Chat Interface (fills remaining space below header) */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatInterface
            agent={agent}
            sessionId={sessionId}
            onSessionCreate={(newSessionId: string) => {
              setSessionId(newSessionId)
            }}
          />
        </div>
      </div>
    </div>
  )
} 