"use client"

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, MessageSquare, X } from 'lucide-react'
import { useAdminSettings } from '@/components/admin-settings-provider'

interface Session {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface SessionSidebarProps {
  agentId: string
  currentSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export function SessionSidebar({
  agentId,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  isOpen,
  onClose,
  isMobile
}: SessionSidebarProps) {
  const { getButtonStyles, getButtonHoverStyles } = useAdminSettings()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load sessions from Supabase agent_messages table
    const loadSessions = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const user = await supabase.auth.getUser()
        const UID = user.data.user?.id
        if (!UID) throw new Error('User not authenticated')
        // Query agent_messages for this UID and agentId
        const { data, error } = await supabase
          .from('agent_messages')
          .select('session_id, prompt, created_at')
          .eq('UID', UID)
          .eq('agent_id', agentId)
          .order('created_at', { ascending: true })
        if (error) throw error
        // Group by session_id, only keep the first row per session
        const sessionMap = new Map<string, Session>()
        for (const row of data || []) {
          if (!row.session_id || sessionMap.has(row.session_id)) continue
          sessionMap.set(row.session_id, {
            id: row.session_id,
            title: (row.prompt || 'New Chat').slice(0, 50),
            created_at: row.created_at,
            updated_at: row.created_at
          })
        }
        setSessions(Array.from(sessionMap.values()))
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading sessions:', error)
        setSessions([])
        setIsLoading(false)
      }
    }
    if (agentId && isOpen) {
      loadSessions()
    }
  }, [agentId, isOpen])

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId)
    if (isMobile) {
      onClose()
    }
  }

  const handleNewSession = () => {
    onNewSession()
    if (isMobile) {
      onClose()
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={handleNewSession}
          className="w-full"
          style={getButtonStyles()}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, getButtonHoverStyles())}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, getButtonStyles())}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat history yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Button
                key={session.id}
                variant={currentSessionId === session.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start text-left h-auto p-3${currentSessionId === session.id ? ' active-session' : ''}`}
                style={currentSessionId === session.id ? { backgroundColor: '#fafafa' } : {}}
                onClick={() => handleSessionClick(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">
                    {session.title || 'New Chat'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {new Date(session.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0" style={{ width: 400, maxWidth: '95vw' }}>
          <SheetHeader className="sr-only">
            <SheetTitle>Chat History</SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={`bg-background border-r transition-all duration-300 ${
        isOpen ? '' : 'w-0'
      } overflow-hidden`}
      style={isOpen ? { width: 400, maxWidth: '95vw' } : { width: 0 }}
    >
      {isOpen && sidebarContent}
    </div>
  )
} 