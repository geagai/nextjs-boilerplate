"use client"

import { useState, useMemo } from 'react'
import { AgentList } from '@/ai-agents/components/agent-list'
import { AgentsControls } from '@/ai-agents/components/agents-controls'
import { ComingSoonAgents } from '@/ai-agents/components/coming-soon-agents'

interface Agent {
  id: string
  name: string
  description: string
  category: string
  icon?: string | null
  [key: string]: any
}

interface AgentsClientWrapperProps {
  agents: Agent[]
  user: any
  isAdmin: boolean
  initialCategory?: string
}

export function AgentsClientWrapper({ agents, user, isAdmin, initialCategory }: AgentsClientWrapperProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Extract categories from agents - split comma-separated categories
  const categories = useMemo(() => {
    const allCategories = agents
      .map((a) => a.category)
      .filter(Boolean)
      .flatMap(category => 
        category.split(',').map(cat => cat.trim()).filter(Boolean)
      );
    return Array.from(new Set(allCategories));
  }, [agents])

  // Filter agents based on search and category
  const filteredAgents = useMemo(() => {
    let filtered = agents

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => {
        if (!agent.category) return false;
        const agentCategories = agent.category.split(',').map(cat => cat.trim());
        return agentCategories.includes(selectedCategory);
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [agents, selectedCategory, searchQuery])

  return (
    <>
      {/* Controls */}
      <AgentsControls
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onViewModeChange={setViewMode}
        initialViewMode={viewMode}
      />

      {/* Content */}
      <AgentList
        agents={filteredAgents}
        viewMode={viewMode}
        emptyMessage={
          searchQuery || selectedCategory !== 'all'
            ? 'No agents found matching your criteria.'
            : 'No public agents available yet.'
        }
        emptyAction={!user ? (
          <a href="/login">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
              Sign in to create agents
            </button>
          </a>
        ) : isAdmin ? (
          <a href="/create-agent">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
              Create the first public agent
            </button>
          </a>
        ) : null}
      />

      {/* Stats */}
      {filteredAgents.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Coming Soon Agents */}
      <ComingSoonAgents />
    </>
  )
} 