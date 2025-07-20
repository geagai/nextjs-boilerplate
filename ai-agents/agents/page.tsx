"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, LayoutGrid, List as ListIcon, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { AgentList } from '@/ai-agents/components/agent-list'
import { useAgents } from '@/ai-agents/hooks/use-agents'
import { useAuth } from '@/components/auth-provider'
import { useSupabaseReady } from '@/hooks/use-supabase-ready'
import { debounce } from '@/ai-agents/lib/ai-agent-utils'

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { user, loading: authLoading } = useAuth()
  const supaReady = useSupabaseReady()
  const isAdmin = user?.role?.toLowerCase() === 'admin'

  // Debug logging
  console.log('Agents page debug:', { authLoading, supaReady, user: !!user })

  // Only fetch agents once authentication state has been resolved to avoid
  // race-conditions where the Supabase session token hasn't been applied yet.
  const { agents, isLoading, error, categories } = useAgents(
    {
      onlyPublic: true,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      searchQuery: debouncedSearchQuery,
    },
    !authLoading // Only wait for auth loading to complete
  )

  // Debounce search input
  const debouncedSetSearch = useMemo(
    () => debounce((query: string) => setDebouncedSearchQuery(query), 300),
    []
  )

  useEffect(() => {
    debouncedSetSearch(searchQuery)
  }, [searchQuery, debouncedSetSearch])

  if (authLoading) {
    return <div className="container mx-auto px-4 py-8">Loading authentication...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 pr-32">
            <h1 className="text-3xl font-bold text-primary mb-2">AI Agents</h1>
            <p className="text-muted-foreground">
              Explore our library of intelligent agents to automate tasks and find information.
            </p>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-muted/50 p-4 rounded-lg">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category */}
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden justify-center">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <ListIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {isAdmin && (
            <Link href="/create-agent" className="absolute right-0 top-0">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Agent
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <AgentList
          agents={agents}
          viewMode={viewMode}
          emptyMessage={
            searchQuery || selectedCategory !== 'all'
              ? 'No agents found matching your criteria.'
              : 'No public agents available yet.'
          }
          emptyAction={!user ? (
            <Link href="/login">
              <Button>Sign in to create agents</Button>
            </Link>
          ) : isAdmin ? (
            <Link href="/create-agent">
              <Button>Create the first public agent</Button>
            </Link>
          ) : null}
        />
      )}

      {/* Stats */}
      {!isLoading && agents.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {agents.length} agent{agents.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  )
} 