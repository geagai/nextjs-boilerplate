"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { 
  callAgentApi, 
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
  initialMessages?: Message[]
  onError?: (error: string) => void
  onSuccess?: (message: string) => void
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  sessionId: string
  sendMessage: (content: string, formData?: Record<string, any>) => Promise<void>
  retryMessage: (messageId: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  clearMessages: () => void
  loadHistory: () => Promise<void>
  isHistoryLoaded: boolean
}

export function useChat({
  agent,
  userId,
  sessionId: providedSessionId,
  initialMessages,
  onError,
  onSuccess
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [isLoading, setIsLoading] = useState(false)
  const sessionId = useMemo(() => validateSessionId(providedSessionId), [providedSessionId])
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(!!initialMessages)
  const [retryData, setRetryData] = useState<Map<string, { content: string; formData?: Record<string, any> }>>(new Map())

  const loadHistory = useCallback(async () => {
    // If we have initialMessages, use them instead of loading from client
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages)
      setIsHistoryLoaded(true)
      return
    }
    
    try {
      const result = await loadSessionMessages(sessionId, userId)
      if (result.success && result.messages) {
        // Create both user prompt and AI response messages for each row
        const formattedMessages: Message[] = []
        
        result.messages.forEach(msg => {
          // Add user prompt message if it exists
          if (msg.prompt && msg.prompt.trim() !== '') {
            formattedMessages.push({
              id: `${msg.id}-user`,
              content: msg.prompt,
              role: 'user',
              timestamp: msg.created_at || new Date().toISOString(),
              rawData: { ...msg, isUserMessage: true }
            })
          }
          
          // Add AI response message if it exists
          if (msg.message && msg.message.trim() !== '') {
            formattedMessages.push({
              id: `${msg.id}-assistant`,
              content: msg.message,
              role: 'assistant',
              timestamp: msg.created_at || new Date().toISOString(),
              rawData: { ...msg, isAssistantMessage: true }
            })
          }
        })
        
        setMessages(formattedMessages)
      }
      setIsHistoryLoaded(true)
    } catch (error) {
      console.error('Failed to load chat history:', error)
      setIsHistoryLoaded(true)
    }
  }, [sessionId, userId, initialMessages])

  useEffect(() => {
    // Always clear messages when sessionId changes
    setMessages([])
    // Reset history loaded state
    setIsHistoryLoaded(false)
  }, [sessionId])

  // Load conversation history on mount or when sessionId changes
  useEffect(() => {
    // Only load history if we have a valid sessionId and userId
    if (sessionId && userId && !isHistoryLoaded) {
      loadHistory()
    } else if (!sessionId || !userId) {
      // If no session or user, mark as loaded to prevent infinite loading
      setIsHistoryLoaded(true)
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
        
        // Save messages to database via server-side API
        const saveResult = await fetch('/api/agents/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentId: agent.id,
            sessionId,
            userPrompt: content,
            assistantResponse: response.message
          })
        });

        if (!saveResult.ok) {
          const errorData = await saveResult.json();
          console.warn('Failed to save messages to database:', errorData.error);
          // Don't show error to user since the main functionality worked
        } else {
          console.log('[useChat] Message saved successfully');
          
          // Update the user message with the database row ID for proper deletion
          const saveResultData = await saveResult.json();
          if (saveResultData.messageId) {
            updateMessage(userMessage.id, {
              rawData: { id: saveResultData.messageId, isUserMessage: true }
            });
            // Extract model information from API response
            let modelInfo = null;
            if (Array.isArray(response.data) && response.data.length > 0) {
              modelInfo = response.data[0]?.model;
            } else if (response.data?.model) {
              modelInfo = response.data.model;
            }
            
            updateMessage(assistantMessage.id, {
              rawData: { 
                ...(typeof response.data === 'object' && response.data !== null ? response.data : {}), 
                id: saveResultData.messageId, 
                isAssistantMessage: true,
                model: modelInfo
              }
            });
          }
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
    
    // Find and remove both the user message and the failed assistant message
    setMessages(prev => {
      const messageIndex = prev.findIndex(m => m.id === messageId)
      if (messageIndex === -1) return prev
      
      // Find the corresponding assistant message (should be the next message)
      const assistantIndex = messageIndex + 1
      const assistantMessage = prev[assistantIndex]
      
      // Remove both messages if they belong to the same database row
      if (assistantMessage && assistantMessage.role === 'assistant') {
        const userDbRowId = prev[messageIndex].rawData?.id || prev[messageIndex].id.split('-')[0]
        const assistantDbRowId = assistantMessage.rawData?.id || assistantMessage.id.split('-')[0]
        
        if (userDbRowId === assistantDbRowId) {
          return prev.filter((_, index) => index !== messageIndex && index !== assistantIndex)
        }
      }
      
      // Fallback: just remove the user message
      return prev.filter((_, index) => index !== messageIndex)
    })
    
    // Retry sending the message
    await sendMessage(retryInfo.content, retryInfo.formData)
  }, [retryData, sendMessage])

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      // Find the message to be deleted
      const messageToDelete = messages.find(msg => msg.id === messageId);
      if (!messageToDelete) {
        throw new Error('Message not found');
      }

      // Extract the database row ID from the message
      const dbRowId = messageToDelete.rawData?.id || messageId;
      
      // Call the API route to delete the message from the database
      const response = await fetch('/api/agents/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: dbRowId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete message');
      }

      // Remove both user prompt and AI response messages for this database row
      setMessages(prev => prev.filter(msg => {
        const msgDbRowId = msg.rawData?.id || msg.id;
        return msgDbRowId !== dbRowId;
      }));
      
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }, [messages])

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    retryMessage,
    deleteMessage,
    clearMessages,
    loadHistory,
    isHistoryLoaded
  }
} 