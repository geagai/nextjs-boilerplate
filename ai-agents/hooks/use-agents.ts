"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface UseAgentsOptions {
  onlyPublic?: boolean
  category?: string
  searchQuery?: string
}

export function useAgents(options: UseAgentsOptions = {}) {
  const supabase = createClient()
  const [agents, setAgents] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true)
      let query = supabase.from('agents').select('*')

      if (options.onlyPublic) query = query.eq('is_public', true)
      if (options.category) query = query.eq('category', options.category)
      if (options.searchQuery)
        query = query.ilike('name', `%${options.searchQuery}%`)

      const { data, error } = await query

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const list = (data ?? []).map((agent: any) => ({
        ...agent,
        icon: agent.config?.options?.icon || null
      })) as any[]
      setAgents(list)
      setCategories(
        Array.from(new Set(list.map((a: any) => a.category).filter(Boolean)))
      )
      setLoading(false)
    }

    fetchAgents()
  }, [options.onlyPublic, options.category, options.searchQuery, supabase])

  return { agents, isLoading, error, categories }
} 