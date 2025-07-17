'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProductForm } from '@/components/product/product-form'
import { ProductFormData } from '@/lib/product-schema'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, AlertCircle, Settings, Package } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import ClearProductCacheButton from '@/components/clear-product-cache-button'
import { useAuth } from '@/components/auth-provider'

interface EditProductClientProps {
  isAdmin: boolean
  hasStripeConfig: boolean
}

export default function EditProductClient({ isAdmin, hasStripeConfig }: EditProductClientProps) {
  const { user, loading: authLoading } = useAuth();
  const [productData, setProductData] = useState<ProductFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productNotFound, setProductNotFound] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams?.get('id') ?? null
  const supabase = createClient()

  const fetchProductData = useCallback(async () => {
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
      
      // Extract marketing features from metadata
      const marketingFeatures: string[] = []
      if (data.product.metadata) {
        // First, try to get features from the new format (feature_1, feature_2, etc.)
        const featureEntries: Array<{ number: number; value: string }> = []
        Object.keys(data.product.metadata).forEach(key => {
          if (key.startsWith('feature_')) {
            const featureNumber = parseInt(key.replace('feature_', ''))
            const featureValue = data.product.metadata[key]
            if (featureValue && typeof featureValue === 'string' && !isNaN(featureNumber)) {
              featureEntries.push({ number: featureNumber, value: featureValue })
            }
          }
        })
        
        if (featureEntries.length > 0) {
          // Use new format
          featureEntries
            .sort((a, b) => a.number - b.number)
            .forEach(entry => marketingFeatures.push(entry.value))
        } else if (data.product.metadata.marketing_features) {
          // Fallback to old JSON format for backward compatibility
          try {
            const oldFeatures = JSON.parse(data.product.metadata.marketing_features)
            if (Array.isArray(oldFeatures)) {
              oldFeatures.forEach((feature: any) => {
                if (feature && typeof feature.title === 'string') {
                  marketingFeatures.push(feature.title)
                }
              })
            }
          } catch (error) {
            console.warn('Failed to parse old marketing features format:', error)
          }
        }
      }
      
      // Transform Stripe product data to form data format
      const formData: ProductFormData = {
        productId: typeof data.product.id === 'string' ? data.product.id : '',
        name: typeof data.product.name === 'string' ? data.product.name : '',
        description: typeof data.product.description === 'string' ? data.product.description : '',
        imageUrl: Array.isArray(data.product.images) && typeof data.product.images[0] === 'string' ? data.product.images[0] : '',
        statementDescriptor: typeof data.product.statement_descriptor === 'string' ? data.product.statement_descriptor : '',
        category: typeof data.product.metadata?.category === 'string' ? data.product.metadata.category : '',
        marketingFeatures,
        pricing: Array.isArray(data.prices)
          ? data.prices.map((price: Record<string, unknown>) => {
              const id = typeof price.id === 'string' ? price.id : '';
              const recurring = typeof price.recurring === 'object' && price.recurring !== null ? price.recurring as Record<string, unknown> : undefined;
              const type = recurring ? 'recurring' : 'one_time';
              const amount = typeof price.unit_amount === 'number' ? price.unit_amount / 100 : 0;
              const currency = typeof price.currency === 'string' ? price.currency : '';
              const interval = recurring && typeof recurring.interval === 'string' ? recurring.interval : undefined;
              const isDefault = data.product.default_price === id;
              const active = typeof price.active === 'boolean' ? price.active : false;
              const trialPeriodDays = recurring && typeof recurring.trial_period_days === 'number' ? recurring.trial_period_days : undefined;
              const metadata = typeof price.metadata === 'object' && price.metadata !== null ? price.metadata as Record<string, unknown> : undefined;
              const trialRequiresPaymentMethod = metadata && metadata.trial_requires_payment_method === 'true';
              const trialEndBehavior = metadata && typeof metadata.trial_end_behavior === 'string' ? metadata.trial_end_behavior : 'cancel';
              return {
                id: `pricing-${id}`,
                stripeId: id,
                type,
                amount,
                currency,
                interval,
                isDefault,
                active,
                trialPeriodDays,
                trialRequiresPaymentMethod,
                trialEndBehavior
              };
            })
          : [],
        taxBehavior: typeof data.product.metadata?.tax_behavior === 'string' ? data.product.metadata.tax_behavior : 'unspecified',
        credits: typeof data.product.metadata?.credits === 'string' ? parseInt(data.product.metadata.credits) : 0,
        creditsRollover: data.product.metadata?.credits_rollover === 'true',
        redirectUrl: typeof data.product.metadata?.redirect_url === 'string' ? data.product.metadata.redirect_url : '',
        mostPopular: data.product.metadata?.most_popular === 'true'
      };

      setProductData(formData)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product data')
      setProductNotFound(true)
    }
  }, [productId])

  useEffect(() => {
    if (!productId) {
      toast.error('Product ID is required')
      router.push('/dashboard')
      return
    }
    // Only fetch product data if user is authenticated and hasStripeConfig
    if (!authLoading && user && hasStripeConfig) {
      fetchProductData()
    }
  }, [productId, router, hasStripeConfig, fetchProductData, user, authLoading])

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading product data...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
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
              The product you&rsquo;re trying to edit could not be found.
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
            <p className="text-muted-foreground mt-2">Update your product details and pricing</p>
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