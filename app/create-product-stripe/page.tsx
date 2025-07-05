'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProductForm } from '@/components/product/product-form'
import { ProductFormData } from '@/lib/product-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, AlertCircle, Settings } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CreateProductStripePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasStripeConfig, setHasStripeConfig] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuthAndPermissions()
  }, [])

  const checkAuthAndPermissions = async () => {
    try {
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/login')
        return
      }

      setIsAuthenticated(true)

      // Check admin role
      const { data: userData, error: userError } = await supabase
        .from('user_data')
        .select('user_role')
        .eq('UID', user.id)
        .single()

      if (userError || userData?.user_role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)

      // Check Stripe configuration
      const { data: settings, error: settingsError } = await supabase
        .from('admin_settings')
        .select('stripe_publishable_key, stripe_secret')
        .single()

      if (!settingsError && settings?.stripe_secret && settings?.stripe_publishable_key) {
        setHasStripeConfig(true)
      }

    } catch (error) {
      console.error('Auth check error:', error)
      toast.error('Failed to verify permissions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create product')
      }

      toast.success('Product created successfully!')
      
      // Redirect to products page or dashboard
      router.push('/dashboard?tab=products')
      
    } catch (error) {
      console.error('Product creation error:', error)
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
          <p className="text-muted-foreground">Loading...</p>
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
              Please configure your Stripe API keys before creating products.
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
            <p className="text-muted-foreground mt-2">
              Create a new subscription or one-time product with Stripe integration
            </p>
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
