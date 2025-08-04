
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface PricingOption {
  id: string
  type: 'recurring' | 'one_time'
  amount: number
  currency: string
  interval?: 'month' | 'year'
  isDefault: boolean
  active: boolean
  trialPeriodDays?: number
  trialRequiresPaymentMethod?: boolean
  trialEndBehavior?: 'cancel' | 'create_invoice' | 'continue'
}

interface ProductData {
  name: string
  description: string
  imageUrl?: string
  statementDescriptor?: string
  category?: string
  marketingFeatures: string[]
  pricing: PricingOption[]
  taxBehavior: 'inclusive' | 'exclusive' | 'unspecified'
  credits?: number
  creditsRollover?: boolean
  redirectUrl?: string
  mostPopular?: boolean
}

export async function POST(request: Request) {
  const { user } = await requireAuth()
  try {
    // Only allow admins (if you want to keep this logic, you can add your own admin check here)
    // --- Admin check logic removed for brevity, add back if needed ---

    // Get Stripe configuration from environment variable
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({
        error: 'Stripe configuration not found. Please set STRIPE_SECRET_KEY in your environment.'
      }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2025-06-30.basil' as any
    })

    const productData: ProductData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.description) {
      return NextResponse.json({
        error: 'Product name and description are required'
      }, { status: 400 })
    }

    if (!productData.pricing || productData.pricing.length === 0) {
      return NextResponse.json({
        error: 'At least one pricing option is required'
      }, { status: 400 })
    }

    const defaultPrices = productData.pricing.filter(p => p.isDefault)
    if (defaultPrices.length !== 1) {
      return NextResponse.json({
        error: 'Exactly one pricing option must be set as default'
      }, { status: 400 })
    }

    // Prepare metadata with individual feature fields
    const metadata: Record<string, string> = {
      category: productData.category || '',
      credits: productData.credits?.toString() || '0',
      credits_rollover: productData.creditsRollover?.toString() || 'false',
      redirect_url: productData.redirectUrl || '',
      tax_behavior: productData.taxBehavior,
      most_popular: productData.mostPopular ? 'true' : 'false'
    }

    // Add marketing features as individual metadata fields
    productData.marketingFeatures.forEach((feature, index) => {
      if (feature.trim()) {
        metadata[`feature_${index + 1}`] = feature.trim()
      }
    })

    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      images: productData.imageUrl ? [productData.imageUrl] : undefined,
      statement_descriptor: productData.statementDescriptor,
      metadata
    })

    // Create prices in Stripe
    const createdPrices = []
    let defaultPriceId = ''

    for (const pricing of productData.pricing) {
      const priceData: Stripe.PriceCreateParams = {
        product: stripeProduct.id,
        unit_amount: Math.round(pricing.amount * 100), // Convert to cents
        currency: pricing.currency,
        active: pricing.active,
        metadata: {
          order: productData.pricing.indexOf(pricing).toString(),
          is_default: pricing.isDefault.toString()
        }
      }

      if (pricing.type === 'recurring') {
        priceData.recurring = {
          interval: pricing.interval!,
          trial_period_days: pricing.trialPeriodDays
        }
        
        if (pricing.trialPeriodDays && pricing.trialPeriodDays > 0) {
          priceData.metadata!.trial_requires_payment_method = pricing.trialRequiresPaymentMethod?.toString() || 'false'
          priceData.metadata!.trial_end_behavior = pricing.trialEndBehavior || 'cancel'
        }
      } else {
        // One-time payment
        priceData.metadata!.payment_type = 'one_time'
      }

      // Set tax behavior
      if (productData.taxBehavior === 'inclusive') {
        priceData.tax_behavior = 'inclusive'
      } else if (productData.taxBehavior === 'exclusive') {
        priceData.tax_behavior = 'exclusive'
      }

      const stripePrice = await stripe.prices.create(priceData)
      createdPrices.push(stripePrice)

      if (pricing.isDefault) {
        defaultPriceId = stripePrice.id
      }
    }

    // Update product with default price
    if (defaultPriceId) {
      await stripe.products.update(stripeProduct.id, {
        default_price: defaultPriceId
      })
    }

    return NextResponse.json({
      success: true,
      product: stripeProduct,
      prices: createdPrices,
      defaultPriceId
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create product'
    }, { status: 500 })
  }
}
