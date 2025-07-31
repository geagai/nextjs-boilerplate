"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, MessageSquare, X, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSupabaseReady } from '@/hooks/use-supabase-ready'
import { useAuth } from '@/components/auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'

interface Session {
  session_id: string
  prompt: string
  created_at: string
}

interface SessionSidebarProps {
  agentId: string
  currentSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
  adminSettings?: any
}

export function SessionSidebar({
  agentId,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  isOpen,
  onClose,
  isMobile,
  adminSettings
}: SessionSidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameSessionId, setRenameSessionId] = useState<string | null>(null);
  const [renameLoading, setRenameLoading] = useState(false);

  const supaReady = useSupabaseReady();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper functions for button styling
  const getButtonStyles = (variant: string = 'default') => {
    if (!adminSettings) {
      return {
        backgroundColor: '#000000',
        color: '#ffffff',
        borderColor: '#000000'
      }
    }

    return {
      backgroundColor: adminSettings.button_color || '#000000',
      color: adminSettings.button_text_color || '#ffffff',
      borderColor: adminSettings.button_color || '#000000'
    }
  }

  const getButtonHoverStyles = (variant: string = 'default') => {
    if (!adminSettings) {
      return {
        backgroundColor: '#333333',
        color: '#ffffff'
      }
    }

    return {
      backgroundColor: adminSettings.button_hover_color || '#333333',
      color: adminSettings.button_text_color || '#ffffff'
    }
  }

  useEffect(() => {
    console.log('Main useEffect running for agentId:', agentId, 'isOpen:', isOpen);
    if (!supaReady || authLoading || !isOpen) {
      setIsLoading(false); // Force loading to false if conditions not met
      return;
    }
    
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('[SessionSidebar] Safety timeout triggered, setting loading to false');
      setIsLoading(false);
    }, 10000); // 10 second timeout
    
    // Load sessions from server-side API - same code as refresh button
    const loadSessions = async () => {
      setIsLoading(true)
      console.log('[loadSessions] Entered');
      try {
        console.log('[SessionSidebar] Fetching sessions for agentId:', agentId);
        
        const response = await fetch(`/api/agents/sessions?agentId=${encodeURIComponent(agentId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('[SessionSidebar] Error fetching sessions:', errorData.error);
          throw new Error(errorData.error || 'Failed to fetch sessions');
        }

        const data = await response.json();
        console.log('[SessionSidebar] API response:', data);
        
        if (data.sessions) {
          console.log('[SessionSidebar] Setting sessions:', data.sessions);
          setSessions(data.sessions);
        } else {
          console.log('[SessionSidebar] No sessions found, setting empty array');
          setSessions([]);
        }
      } catch (error) {
        console.error('[SessionSidebar] Error in loadSessions:', error);
        setSessions([]);
      } finally {
        console.log('[SessionSidebar] Setting loading to false');
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };
    
    loadSessions();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [supaReady, authLoading, isOpen, agentId, user]);

  const handleSessionClick = (sessionId: string) => {
    // Navigate to the URL with sessionId for server-side loading
    const params = new URLSearchParams(searchParams)
    params.set('sessionId', sessionId)
    router.push(`?${params.toString()}`)
    
    // Also update the client state for immediate UI feedback
    onSessionSelect(sessionId)
    if (isMobile) {
      onClose()
    }
  }

  const handleNewSession = () => {
    // Clear sessionId from URL for new chat
    const params = new URLSearchParams(searchParams)
    params.delete('sessionId')
    router.push(`?${params.toString()}`)
    
    // Also update the client state
    onNewSession()
    onClose()
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      if (!user) {
        setSessions([]);
        setIsLoading(false);
        return;
      }
      
      console.log('[SessionSidebar] Deleting session:', sessionId, 'for agentId:', agentId);
      
      const response = await fetch(`/api/agents/sessions?agentId=${encodeURIComponent(agentId)}&sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[SessionSidebar] Error deleting session:', errorData.error);
        throw new Error(errorData.error || 'Failed to delete session');
      }

      console.log('[SessionSidebar] Session deleted successfully');
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      toast({
        title: "Session deleted",
        description: "The session has been deleted successfully.",
      });
    } catch (error) {
      console.error('[SessionSidebar] Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- RENAME SESSION LOGIC ---
  const openRenameModal = (session: Session) => {
    setRenameSessionId(session.session_id);
    setRenameValue(session.prompt);
    setRenameModalOpen(true);
  };
  const closeRenameModal = () => {
    setRenameModalOpen(false);
    setRenameSessionId(null);
    setRenameValue('');
  };
  const handleRenameSession = async () => {
    if (!renameSessionId || !renameValue.trim()) return;
    
    setRenameLoading(true);
    try {
      if (!user) {
        setSessions([]);
        setRenameLoading(false);
        return;
      }
      
      console.log('[SessionSidebar] Renaming session:', renameSessionId, 'to:', renameValue, 'for agentId:', agentId);
      
      const response = await fetch(`/api/agents/sessions?agentId=${encodeURIComponent(agentId)}&sessionId=${encodeURIComponent(renameSessionId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: renameValue })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[SessionSidebar] Error renaming session:', errorData.error);
        throw new Error(errorData.error || 'Failed to rename session');
      }

      console.log('[SessionSidebar] Session renamed successfully');
      setSessions((prev) => prev.map((s) =>
        s.session_id === renameSessionId ? { ...s, prompt: renameValue } : s
      ));
      toast({
        title: "Session renamed",
        description: "The session has been renamed successfully.",
      });
      closeRenameModal();
    } catch (error) {
      console.error('[SessionSidebar] Error renaming session:', error);
      toast({
        title: "Error",
        description: "Failed to rename session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRenameLoading(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="font-semibold text-lg">Sessions</span>
        <button
          className="flex items-center gap-1 p-2 rounded hover:bg-muted transition"
          title="Refresh"
          onClick={() => {
            (async () => {
              setIsLoading(true);
              
              // Safety timeout for refresh button
              const timeoutId = setTimeout(() => {
                console.log('[SessionSidebar] Refresh safety timeout triggered');
                setIsLoading(false);
              }, 5000); // 5 second timeout for refresh
              
              try {
                console.log('[SessionSidebar] Refreshing sessions for agentId:', agentId);
                
                const response = await fetch(`/api/agents/sessions?agentId=${encodeURIComponent(agentId)}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  console.error('[SessionSidebar] Error refreshing sessions:', errorData.error);
                  throw new Error(errorData.error || 'Failed to refresh sessions');
                }

                const data = await response.json();
                console.log('[SessionSidebar] Refresh API response:', data);
                
                if (data.sessions) {
                  console.log('[SessionSidebar] Setting refreshed sessions:', data.sessions);
                  setSessions(data.sessions);
                } else {
                  console.log('[SessionSidebar] No sessions found on refresh, setting empty array');
                  setSessions([]);
                }
              } catch (error) {
                console.error('[SessionSidebar] Refresh error:', error);
                setSessions([]);
              } finally {
                setIsLoading(false);
                clearTimeout(timeoutId);
              }
            })();
          }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="ml-1 select-none">Refresh</span>
        </button>
      </div>
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
              <div key={`${session.session_id}-${session.created_at}`} className="relative group bg-card text-card-foreground" style={{ border: '1px solid #d8d8d8', borderRadius: '6px', background: '#ffffff' }}>
                <Button
                  variant={currentSessionId === session.session_id ? 'secondary' : 'ghost'}
                  className={`w-full justify-start text-left h-auto p-3${currentSessionId === session.session_id ? ' active-session' : ''}`}
                  style={currentSessionId === session.session_id ? { backgroundColor: '#fafafa' } : {}}
                  onClick={() => handleSessionClick(session.session_id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">
                      {session.prompt ? session.prompt.slice(0, 50) : 'New Chat'}
                    </div>
                    <div className="text-xs font-medium truncate">
                      {session.created_at ? new Date(session.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </Button>
                {/* RENAME and DELETE BUTTONS */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2" style={{ marginTop: '15px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 font-medium"
                    style={{ padding: '0 6px' }}
                    onClick={e => { e.stopPropagation(); openRenameModal(session); }}
                    aria-label="Rename session"
                  >
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive font-medium"
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.session_id); }}
                    aria-label="Delete session"
                  >
                    Delete
                  </Button>
                </div>
              </div>
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
      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onOpenChange={setRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Session</DialogTitle>
            <DialogDescription>Enter a new name for this session.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            placeholder="Session name"
            disabled={renameLoading}
            maxLength={100}
            autoFocus
          />
          <DialogFooter>
            <Button onClick={handleRenameSession} disabled={renameLoading || !renameValue.trim()}>
              {renameLoading ? 'Saving...' : 'Submit'}
            </Button>
            <Button variant="ghost" onClick={closeRenameModal} disabled={renameLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 