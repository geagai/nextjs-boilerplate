"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User } from 'lucide-react'
import { useAdminSettings } from '@/components/admin-settings-provider'
import { useAuth } from '@/components/auth-provider'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

interface Agent {
  id: string | number
  name: string
  description?: string | null
  config?: {
    options?: {
      icon?: string
    }
  }
}

interface ChatInterfaceProps {
  agent: Agent
  sessionId: string | null
  onSessionCreate: (sessionId: string) => void
}

export function ChatInterface({ agent, sessionId, onSessionCreate }: ChatInterfaceProps) {
  const { getButtonStyles, getButtonHoverStyles } = useAdminSettings()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load messages for current session
  useEffect(() => {
    if (sessionId) {
      const loadMessages = () => {
        try {
          const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`)
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages))
          } else {
            setMessages([])
          }
        } catch (error) {
          console.error('Error loading messages:', error)
          setMessages([])
        }
      }

      loadMessages()
    } else {
      setMessages([])
    }
  }, [sessionId])

  const saveMessages = (newMessages: Message[]) => {
    if (sessionId) {
      try {
        localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(newMessages))
      } catch (error) {
        console.error('Error saving messages:', error)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    let currentSessionId = sessionId
    if (!currentSessionId) {
      // Create new session if none exists
      currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      onSessionCreate(currentSessionId)
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: `Hello! I'm ${agent.name}. I received your message: "${userMessage.content}". This is a placeholder response. In a real implementation, this would connect to your AI backend.`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      saveMessages(finalMessages)

      // Update session in localStorage
      try {
        const existingSessions = localStorage.getItem(`agent_sessions_${agent.id}`)
        const sessions = existingSessions ? JSON.parse(existingSessions) : []
        
        const sessionIndex = sessions.findIndex((s: any) => s.id === currentSessionId)
        const sessionData = {
          id: currentSessionId,
          title: userMessage.content.substring(0, 50),
          created_at: sessionIndex === -1 ? new Date().toISOString() : sessions[sessionIndex].created_at,
          updated_at: new Date().toISOString()
        }

        if (sessionIndex === -1) {
          sessions.unshift(sessionData)
        } else {
          sessions[sessionIndex] = sessionData
        }

        localStorage.setItem(`agent_sessions_${agent.id}`, JSON.stringify(sessions))
      } catch (error) {
        console.error('Error updating session:', error)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      // Remove the user message on error
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-sm">
                Ask {agent.name} anything to get started!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${agent.name}...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            style={getButtonStyles()}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, getButtonHoverStyles())}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, getButtonStyles())}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 