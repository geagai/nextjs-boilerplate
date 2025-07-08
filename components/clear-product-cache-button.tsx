// components/clear-product-cache-button.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ClearProductCacheButton() {
  const [loading, setLoading] = useState(false)

  const handleClear = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/clear-product-cache', {
        method: 'POST'
      })
      if (!res.ok) throw new Error('Request failed')
      toast.success('Product cache cleared')
    } catch (e) {
      toast.error('Failed to clear cache')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleClear} disabled={loading} className="whitespace-nowrap">
      {loading ? 'Clearing…' : 'Clear Product Cache'}
    </Button>
  )
} 