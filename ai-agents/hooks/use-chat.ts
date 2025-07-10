"use client"

import { useState, useCallback } from 'react'

interface UseChatOptions {
  agentId: string
  onSessionCreate?: (sessionId: string) => void
}

export function useChat({ agentId, onSessionCreate }: UseChatOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null)

  const createNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    onSessionCreate?.(newSessionId)
    return newSessionId
  }, [onSessionCreate])

  const updateSessionId = useCallback((newSessionId: string) => {
    setSessionId(newSessionId)
  }, [])

  return {
    sessionId,
    createNewSession,
    setSessionId: updateSessionId
  }
} 