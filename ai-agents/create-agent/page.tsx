'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AgentForm } from '@/ai-agents/components/agent-form'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

export default function CreateAgentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true)
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AgentForm mode="create" />
    </div>
  )
} 