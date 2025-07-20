"use client"

import { useState, useEffect, useMemo } from 'react'
import { Search, LayoutGrid, List as ListIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { debounce } from '@/ai-agents/lib/ai-agent-utils'

interface AgentsControlsProps {
  categories: string[]
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  initialViewMode?: 'grid' | 'list'
}

export function AgentsControls({
  categories,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
  initialViewMode = 'grid'
}: AgentsControlsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)

  // Debounce search input
  const debouncedSetSearch = useMemo(
    () => debounce((query: string) => onSearchChange(query), 300),
    [onSearchChange]
  )

  useEffect(() => {
    debouncedSetSearch(searchQuery)
  }, [searchQuery, debouncedSetSearch])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    onViewModeChange(mode)
  }

  return (
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
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
          onClick={() => handleViewModeChange('grid')}
          className="rounded-none"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleViewModeChange('list')}
          className="rounded-none"
        >
          <ListIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 