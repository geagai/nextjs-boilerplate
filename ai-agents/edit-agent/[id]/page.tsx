'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AgentForm } from '@/ai-agents/components/agent-form'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'
import { loadAgent } from '@/lib/ai-agent-utils'
import type { Agent } from '@/lib/types'

export default function EditAgentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const agentId = params?.id as string
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [initialData, setInitialData] = useState<Agent | undefined>(undefined)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true)
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchAgent() {
      if (!agentId || !user) return
      setFetching(true)
      setError(null)
      try {
        const result = await loadAgent(agentId, user.id)
        if (!result.success || !result.agent) {
          setError(result.error || 'Failed to load agent')
          setInitialData(undefined)
        } else {
          setInitialData(result.agent)
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error')
        setInitialData(undefined)
      } finally {
        setFetching(false)
      }
    }
    if (user) fetchAgent()
  }, [agentId, user])

  if (loading || isRedirecting || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AgentForm mode="edit" initialData={initialData} />
    </div>
  )
} 