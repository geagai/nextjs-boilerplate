"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { 
  callAgentApi, 
  saveAgentMessages, 
  loadSessionMessages,
  generateSessionId,
  generateMessageId,
  validateSessionId
} from '@/lib/ai-agent-utils'
import { createClient } from '@/lib/supabase'
import type { Agent, AgentMessage } from '@/lib/types'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  isLoading?: boolean
  error?: string
  rawData?: any
}

interface UseChatOptions {
  agent: Agent
  userId: string
  sessionId?: string
  onError?: (error: string) => void
  onSuccess?: (message: string) => void
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  sessionId: string
  sendMessage: (content: string, formData?: Record<string, any>) => Promise<void>
  retryMessage: (messageId: string) => Promise<void>
  clearMessages: () => void
  loadHistory: () => Promise<void>
  isHistoryLoaded: boolean
}

export function useChat({
  agent,
  userId,
  sessionId: providedSessionId,
  onError,
  onSuccess
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const sessionId = useMemo(() => validateSessionId(providedSessionId), [providedSessionId])
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false)
  const [retryData, setRetryData] = useState<Map<string, { content: string; formData?: Record<string, any> }>>(new Map())

  const loadHistory = useCallback(async () => {
    try {
      const result = await loadSessionMessages(sessionId, userId)
      if (result.success && result.messages) {
        // Only show the assistant's response (message column) for each row
        const formattedMessages: Message[] = result.messages
          .filter(msg => msg.message && msg.message.trim() !== '')
          .map(msg => ({
            id: msg.id || generateMessageId(),
            content: msg.message ?? '',
            role: 'assistant',
            timestamp: msg.created_at || new Date().toISOString(),
            rawData: msg
          }))
        setMessages(formattedMessages)
      }
      setIsHistoryLoaded(true)
    } catch (error) {
      console.error('Failed to load chat history:', error)
      setIsHistoryLoaded(true)
    }
  }, [sessionId, userId])

  useEffect(() => {
    setMessages([])
    setIsHistoryLoaded(false)
  }, [sessionId])

  // Load conversation history on mount or when sessionId changes
  useEffect(() => {
    if (sessionId && userId && !isHistoryLoaded) {
      loadHistory()
    }
  }, [sessionId, userId, isHistoryLoaded, loadHistory])

  const clearMessages = useCallback(() => {
    setMessages([])
    setRetryData(new Map())
  }, [])

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: generateMessageId(),
      timestamp: new Date().toISOString(),
      ...message
    }
    
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }, [])

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ))
  }, [])

  const sendMessage = useCallback(async (content: string, formData?: Record<string, any>) => {
    if (!content.trim() || isLoading) return
    
    // Add user message
    const userMessage = addMessage({
      content: content.trim(),
      role: 'user'
    })
    
    // Store retry data
    setRetryData(prev => new Map(prev).set(userMessage.id, { content, formData }))
    
    // Add loading assistant message
    const assistantMessage = addMessage({
      content: '',
      role: 'assistant',
      isLoading: true
    })
    
    setIsLoading(true)
    // --- Begin spinner timeout logic ---
    let timeoutId: NodeJS.Timeout | null = null
    timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 10000) // 10 seconds
    // --- End spinner timeout logic ---
    
    try {
      // Make API call to agent
      const response = await callAgentApi({
        agent,
        userMessage: content,
        formData: formData || {},
        sessionId,
        userId
      })
      
      if (response.success && response.message) {
        // Update assistant message with response
        updateMessage(assistantMessage.id, {
          content: response.message,
          isLoading: false,
          rawData: response.data
        })
        
        // Save messages to database
        const supabase = createClient()
        if (supabase) {
          const saveResult = await saveAgentMessages(
            supabase,
            agent.id,
            sessionId,
            content,
            response.message,
            userId
          )
          if (!saveResult.success) {
            console.warn('Failed to save messages to database:', saveResult.error)
            // Don't show error to user since the main functionality worked
          }
        } else {
          console.warn('Supabase client not available, skipping message save.')
        }
        
        onSuccess?.(response.message)
        
      } else {
        // Handle API error
        const errorMessage = response.error || 'Failed to get response from agent'
        updateMessage(assistantMessage.id, {
          content: '',
          isLoading: false,
          error: errorMessage
        })
        
        onError?.(errorMessage)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      updateMessage(assistantMessage.id, {
        content: '',
        isLoading: false,
        error: errorMessage
      })
      
      onError?.(errorMessage)
      
    } finally {
      setIsLoading(false)
      // --- Clear spinner timeout if API returns first ---
      if (timeoutId) clearTimeout(timeoutId)
      // --- End spinner timeout logic ---
    }
  }, [agent, userId, sessionId, isLoading, addMessage, updateMessage, onError, onSuccess])

  const retryMessage = useCallback(async (messageId: string) => {
    const retryInfo = retryData.get(messageId)
    if (!retryInfo) {
      console.error('No retry data found for message:', messageId)
      return
    }
    
    // Find and remove the failed assistant message
    setMessages(prev => prev.filter(msg => {
      // Remove the assistant message that came after this user message
      const messageIndex = prev.findIndex(m => m.id === messageId)
      const assistantIndex = messageIndex + 1
      return !(messageIndex >= 0 && assistantIndex < prev.length && prev[assistantIndex].role === 'assistant')
    }))
    
    // Retry sending the message
    await sendMessage(retryInfo.content, retryInfo.formData)
  }, [retryData, sendMessage])

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    retryMessage,
    clearMessages,
    loadHistory,
    isHistoryLoaded
  }
} 