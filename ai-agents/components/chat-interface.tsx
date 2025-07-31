"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, AlertCircle, Bot } from 'lucide-react'
import { DynamicFormFields } from './dynamic-form-fields'
import { ResponseDisplay } from './response-display'
import { useChat } from '../hooks/use-chat'
import { loadAgent } from '@/lib/ai-agent-utils'
import { useAuth } from '@/components/auth-provider'
import type { Agent } from '@/lib/types'
import { toast } from '@/hooks/use-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  rawData?: any
}

interface ChatInterfaceProps {
  agentId: string
  agent?: Agent
  user?: any
  className?: string
  hideAgentHeader?: boolean
  sessionId?: string | null
  initialMessages?: Message[]
  // Optional form state props (if not provided, component manages its own)
  formData?: Record<string, any>
  onFormDataChange?: (data: Record<string, any>) => void
  isFormValid?: boolean
  onValidationChange?: (isValid: boolean, errors: string[]) => void
}

export function ChatInterface({ 
  agentId, 
  agent: externalAgent,
  user: externalUser,
  className = "", 
  hideAgentHeader = false, 
  sessionId,
  initialMessages,
  formData: externalFormData,
  onFormDataChange: externalOnFormDataChange,
  isFormValid: externalIsFormValid,
  onValidationChange: externalOnValidationChange
}: ChatInterfaceProps) {
  const [agent, setAgent] = useState<Agent | null>(externalAgent || null)
  const [isAgentLoading, setIsAgentLoading] = useState(!externalAgent)
  const [agentError, setAgentError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(externalUser || null)
  
  // Auth context (only used if external data not provided)
  const { user: authUser, loading: authLoading } = useAuth()
  
  // Form state for dynamic fields (only used if not provided by parent)
  const [internalFormData, setInternalFormData] = useState<Record<string, any>>({})
  const [internalIsFormValid, setInternalIsFormValid] = useState(true)
  const [formErrors, setFormErrors] = useState<string[]>([])
  
  // Use external form state if provided, otherwise use internal
  const formData = externalFormData !== undefined ? externalFormData : internalFormData
  const setFormData = externalOnFormDataChange || setInternalFormData
  const isFormValid = externalIsFormValid !== undefined ? externalIsFormValid : internalIsFormValid
  
  const handleValidationChange = (valid: boolean, errors: string[]) => {
    if (externalOnValidationChange) {
      externalOnValidationChange(valid, errors)
    } else {
      setInternalIsFormValid(valid)
    }
    setFormErrors(errors)
  }
  
  // Chat input state
  const [inputMessage, setInputMessage] = useState('')
  
  // Chat hook for message management - must be called before any conditional returns
  const {
    messages,
    isLoading: isChatLoading,
    sendMessage,
    retryMessage,
    sessionId: activeSessionId,
    loadHistory
  } = useChat({
    agent: agent || { id: '', name: '', description: '', config: null, is_public: false, UID: '' },
    userId: currentUser?.id || '',
    sessionId: sessionId || undefined,
    initialMessages: initialMessages || [],
    onError: (error) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
  })

  // Load user and agent data only if not provided externally
  useEffect(() => {
    if (externalAgent && externalUser) {
      // Data provided externally, no need to load
      setAgent(externalAgent)
      setCurrentUser(externalUser)
      setIsAgentLoading(false)
      return
    }

    if (authLoading) return; // wait for auth session ready

    const loadUserAndAgent = async () => {
      try {
        setIsAgentLoading(true)
        setAgentError(null)
        // Use user from AuthProvider (may be null for anonymous)
        setCurrentUser(authUser ?? null)
        
        // Load agent data (for both anonymous and logged-in users)
        const agentResult = await loadAgent(agentId, (authUser as any)?.id)
        
        if (!agentResult.success || !agentResult.agent) {
          throw new Error(agentResult.error || 'Failed to load agent')
        }
        
        setAgent(agentResult.agent)
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        setAgentError(errorMessage)
        console.error('Failed to load user and agent:', error)
      } finally {
        setIsAgentLoading(false)
      }
    }
    
    if (agentId) {
      loadUserAndAgent()
    }
  }, [agentId, authLoading, authUser, externalAgent, externalUser])

  // Error state: Only show error if loading is done and agentError is set
  if (!isAgentLoading && agentError) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {agentError}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Loading state
  if (isAgentLoading) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading agent...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Guard: If agent is still null after loading, nothing to show
  if (!agent) {
    return null
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !agent || !currentUser) return
    
    // Check form validation for dynamic fields
    if (agent.config?.body && agent.config.body.length > 0 && !isFormValid) {
      toast({
        title: "Form Validation Error",
        description: "Please fix the form errors before sending your message.",
        variant: "destructive"
      })
      return
    }
    
    try {
      await sendMessage(inputMessage, formData)
      setInputMessage('') // Clear input after successful send
    } catch (error) {
      // Error handling is done in the useChat hook
      console.error('Send message error:', error)
    }
  }

  const handleRetry = async (messageId: string) => {
    try {
      await retryMessage(messageId)
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: "Failed to retry the message. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDeleteMessage = async (id: string) => {
    // Fallback: reload history after deletion
    await loadHistory();
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Scrollable Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto pb-56 mb-24 md:pb-56 md:mb-24 pb-80 mb-32">
          {/* Agent Header - Only show if not hidden */}
          {!hideAgentHeader && (
            <Card className="hidden sm:block">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{agent.name}</h2>
                    {agent.description && (
                      <p className="text-sm text-muted-foreground mt-1">{agent.description}</p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          {/* Dynamic Form Fields - Only show if no external form management */}
          {!externalFormData && agent.config?.body && agent.config.body.length > 0 && (
            <DynamicFormFields
              agent={agent}
              formData={formData}
              onFormDataChange={setFormData}
              onValidationChange={handleValidationChange}
              disabled={isChatLoading}
            />
          )}

          {/* Chat Messages */}
          <ResponseDisplay
            messages={messages}
            isLoading={isChatLoading}
            agent={{
              name: agent.name,
              config: agent.config || undefined
            }}
            onRetry={handleRetry}
            onDeleteMessage={handleDeleteMessage}
          />
        </div>
      </ScrollArea>

      {/* Fixed Input Area - Fixed to bottom of viewport */}
      {currentUser ? (
        <div
          className="fixed bottom-0 left-0 right-0 border-t p-4 z-50"
          style={{ 
            height: '114px',
            backgroundColor: 'hsl(var(--header-bg))',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div
            className="max-w-4xl mx-auto h-full flex items-center"
            style={{ height: '100%' }}
          >
            <div
              className="flex space-x-2 w-full"
              style={{ alignItems: 'flex-end' }}
            >
              {/* On mobile, increase height and align top */}
              <style>{`
                @media (max-width: 640px) {
                  .chat-bar-mobile { height: 164px !important; }
                  .chat-bar-mobile .chat-bar-align { align-items: flex-start !important; }
                }
              `}</style>
              {/* Add classes for mobile targeting */}
              <div className="chat-bar-mobile" style={{ width: '100%' }}>
                <div className="chat-bar-align flex space-x-2 w-full" style={{ alignItems: 'flex-end' }}>
                  <textarea
                    placeholder={agent.config?.options?.placeholder || `Ask ${agent.name} anything...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isChatLoading}
                    className="flex-1 bg-background rounded-md border border-input px-3 py-2 resize-none min-h-[48px] max-h-[120px] text-base focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    style={{ minHeight: 48, maxHeight: 120, fontSize: '1rem' }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !inputMessage.trim() || !isFormValid}
                    size="icon"
                    className="self-end"
                  >
                    {isChatLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {/* Form validation errors */}
            {formErrors.length > 0 && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      ) : (
        <>
          <style>{`
            @media (max-width: 640px) {
              .login-register-message-bar { margin-bottom: 20px !important; }
            }
          `}</style>
          <div
            className="fixed bottom-0 left-0 right-0 border-t p-4 z-50 flex items-center justify-center login-register-message-bar"
            style={{ 
              height: '114px', 
              textAlign: 'center',
              backgroundColor: 'hsl(var(--header-bg))',
              backdropFilter: 'blur(12px)'
            }}
          >
            <span className="text-base font-medium text-muted-foreground">Please Login or Register to use this Agent.</span>
          </div>
        </>
      )}
    </div>
  );
}