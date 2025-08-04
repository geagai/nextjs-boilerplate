'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/product/product-form'
import { ProductFormData } from '@/lib/product-schema'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CreateProductClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create product')
      toast.success('Product created successfully!')
      router.push('/my-products')
    } catch (err) {
      console.error('Product creation error:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
            <p className="text-muted-foreground mt-2">Create a new subscription or one-time product with Stripe integration</p>
          </div>
        </div>

        {/* Form */}
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Create Product"
          mode="create"
        />
      </div>
    </div>
  )
} 