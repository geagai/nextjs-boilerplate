
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ImageUpload } from './image-upload'
import { SortableMarketingFeatures } from './sortable-marketing-features'
import { SortablePricingOptions } from './sortable-pricing-options'
import { productFormSchema, ProductFormData } from '@/lib/product-schema'
import { toast } from 'sonner'
import { Loader2, Save, Package } from 'lucide-react'

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
  mode?: 'create' | 'edit'
}

export function ProductForm({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false, 
  submitLabel = 'Create Product',
  mode = 'create'
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      statementDescriptor: '',
      category: '',
      marketingFeatures: [],
      pricing: [{
        id: `pricing-${Date.now()}`,
        type: 'recurring',
        amount: 0,
        currency: 'usd',
        interval: 'month',
        isDefault: true,
        active: true,
        isNew: true
      }],
      taxBehavior: 'unspecified',
      credits: 0,
      creditsRollover: false,
      ...initialData,
      mostPopular: initialData.mostPopular ?? false,
      redirectUrl: initialData.redirectUrl ?? '',
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  const watchedImageUrl = watch('imageUrl')
  const watchedMarketingFeatures = watch('marketingFeatures')
  const watchedPricing = watch('pricing')

  const handleFormSubmit: import('react-hook-form').SubmitHandler<ProductFormData> = async (data) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter product name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="e.g., SaaS, Digital Product"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your product"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="statementDescriptor">Statement Descriptor</Label>
            <Input
              id="statementDescriptor"
              {...register('statementDescriptor')}
              placeholder="How it appears on credit card statements (max 22 chars)"
              maxLength={22}
              className={errors.statementDescriptor ? 'border-red-500' : ''}
            />
            {errors.statementDescriptor && (
              <p className="text-sm text-red-500">{errors.statementDescriptor.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              This text will appear on your customers&apos; credit card statements
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="mostPopular"
              checked={watch('mostPopular')}
              onCheckedChange={(checked) => setValue('mostPopular', checked)}
            />
            <Label htmlFor="mostPopular">Mark as Most Popular</Label>
          </div>
        </CardContent>
      </Card>

      {/* Product Image */}
      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={watchedImageUrl}
            onChange={(url) => setValue('imageUrl', url)}
            onRemove={() => setValue('imageUrl', '')}
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-500 mt-2">{errors.imageUrl.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Marketing Features */}
      <Card>
        <CardContent className="pt-6">
          <SortableMarketingFeatures
            features={watchedMarketingFeatures}
            onChange={(features) => setValue('marketingFeatures', features)}
            errors={errors.marketingFeatures as Array<{ title?: string; description?: string }> | undefined}
          />
        </CardContent>
      </Card>

      {/* Pricing Options */}
      <Card>
        <CardContent className="pt-6">
          <SortablePricingOptions
            pricing={watchedPricing}
            onChange={(pricing) => setValue('pricing', pricing)}
            errors={errors.pricing as Array<{ [key: string]: string }> | undefined}
          />
          {errors.pricing?.message && (
            <p className="text-sm text-red-500 mt-2">{errors.pricing.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="taxBehavior">Tax Behavior</Label>
            <Select
              value={watch('taxBehavior')}
              onValueChange={(value: 'inclusive' | 'exclusive' | 'unspecified') => 
                setValue('taxBehavior', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unspecified">Unspecified</SelectItem>
                <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                <SelectItem value="exclusive">Tax Exclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="0"
                {...register('credits', { valueAsNumber: true })}
                placeholder="0"
              />
              <p className="text-sm text-muted-foreground">
                Number of credits included with this product
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="creditsRollover"
                checked={watch('creditsRollover')}
                onCheckedChange={(checked) => setValue('creditsRollover', checked)}
              />
              <Label htmlFor="creditsRollover">Allow credits rollover</Label>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="redirectUrl">Redirect URL</Label>
            <Input
              id="redirectUrl"
              {...register('redirectUrl')}
              placeholder="https://example.com/success"
              className={errors.redirectUrl ? 'border-red-500' : ''}
            />
            {errors.redirectUrl && (
              <p className="text-sm text-red-500">{errors.redirectUrl.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Where to redirect customers after successful purchase
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="min-w-[150px]"
        >
          {(isSubmitting || isLoading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
