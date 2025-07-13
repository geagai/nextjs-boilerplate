'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProductForm } from '@/components/product/product-form'
import { ProductFormData } from '@/lib/product-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, AlertCircle, Settings, Package } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import ClearProductCacheButton from '@/components/clear-product-cache-button'

interface EditProductClientProps {
  isAdmin: boolean
  hasStripeConfig: boolean
}

export default function EditProductClient({ isAdmin, hasStripeConfig }: EditProductClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [productData, setProductData] = useState<ProductFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productNotFound, setProductNotFound] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const supabase = createClient()

  useEffect(() => {
    if (!productId) {
      toast.error('Product ID is required')
      router.push('/dashboard')
      return
    }
    
    checkAuthAndPermissions()
  }, [productId])

  const checkAuthAndPermissions = async () => {
    try {
      // Check authentication
      if (!supabase) {
        router.push('/login')
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setIsAuthenticated(true)

      if (hasStripeConfig) {
        await fetchProductData()
      }

    } catch (error) {
      console.error('Auth check error:', error)
      toast.error('Failed to verify permissions')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProductData = async () => {
    try {
      // Fetch product data from Stripe via API route
      const response = await fetch(`/api/stripe/get-product?id=${productId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setProductNotFound(true)
          return
        }
        throw new Error('Failed to fetch product data')
      }

      const data = await response.json()
      
      // Transform Stripe product data to form data format
      const formData: ProductFormData = {
        productId: data.product.id,
        name: data.product.name,
        description: data.product.description || '',
        imageUrl: data.product.images?.[0] || '',
        statementDescriptor: data.product.statement_descriptor || '',
        category: data.product.metadata?.category || '',
        marketingFeatures: data.product.metadata?.marketing_features 
          ? JSON.parse(data.product.metadata.marketing_features)
          : [],
        pricing: data.prices?.map((price: any, index: number) => ({
          id: `pricing-${price.id}`,
          stripeId: price.id,
          type: price.recurring ? 'recurring' : 'one_time',
          amount: price.unit_amount / 100, // Convert from cents
          currency: price.currency,
          interval: price.recurring?.interval,
          isDefault: data.product.default_price === price.id,
          active: price.active,
          trialPeriodDays: price.recurring?.trial_period_days,
          trialRequiresPaymentMethod: price.metadata?.trial_requires_payment_method === 'true',
          trialEndBehavior: price.metadata?.trial_end_behavior || 'cancel'
        })) || [],
        taxBehavior: data.product.metadata?.tax_behavior || 'unspecified',
        credits: parseInt(data.product.metadata?.credits || '0'),
        creditsRollover: data.product.metadata?.credits_rollover === 'true',
        redirectUrl: data.product.metadata?.redirect_url || '',
        mostPopular: data.product.metadata?.most_popular === 'true'
      }

      setProductData(formData)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product data')
      setProductNotFound(true)
    }
  }

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/stripe/edit-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product')
      }

      toast.success('Product updated successfully!')
      
    } catch (error) {
      console.error('Product update error:', error)
      throw error // Re-throw to let ProductForm handle the error display
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading product data...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need admin privileges to access this page.
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasStripeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Settings className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Stripe Configuration Required</h2>
            <p className="text-muted-foreground mb-4">
              Please configure your Stripe API keys before editing products.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/settings?tab=stripe">Configure Stripe</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (productNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The product you're trying to edit could not be found.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/create-product-stripe">Create New Product</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading product data...</p>
        </div>
      </div>
    )
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
            <ClearProductCacheButton />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-muted-foreground mt-2">
              Update your product information and pricing options
            </p>
            {productData.name && (
              <p className="text-sm text-gray-600 mt-1">
                Editing: <span className="font-medium">{productData.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <ProductForm
          initialData={productData}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Update Product"
          mode="edit"
        />
      </div>
    </div>
  )
} 