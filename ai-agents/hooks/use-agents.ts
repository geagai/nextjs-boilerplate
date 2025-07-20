"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface UseAgentsOptions {
  onlyPublic?: boolean
  category?: string
  searchQuery?: string
}

export function useAgents(options: UseAgentsOptions = {}, enabled = true) {
  const supabase = createClient()
  const [agents, setAgents] = useState<any[]>([])
  const [isLoading, setLoading] = useState(enabled) // Start with loading state based on enabled
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  // Debug logging
  console.log('useAgents debug:', { enabled, supabase: !!supabase, options })

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    
    async function fetchAgents() {
      setLoading(true)
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      
      // Build query with filters
      let query = supabase.from('agents').select('*')
      
      // Default to public only unless explicitly set to false
      const { onlyPublic = true, category, searchQuery } = options
      
      if (onlyPublic) {
        query = query.eq('is_public', true)
      }
      
      if (category) {
        query = query.ilike('category', `%${category}%`)
      }
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }
      
      console.log('Supabase query:', query)
      const { data, error } = await query
      console.log('Supabase result:', { data, error })
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
  }, [supabase, enabled, options.onlyPublic, options.category, options.searchQuery])

  return { agents, isLoading, error, categories }
} 