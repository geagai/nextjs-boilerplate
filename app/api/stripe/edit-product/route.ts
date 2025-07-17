
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface PricingOption {
  id: string
  stripeId?: string
  type: 'recurring' | 'one_time'
  amount: number
  currency: string
  interval?: 'month' | 'year'
  isDefault: boolean
  active: boolean
  trialPeriodDays?: number
  trialRequiresPaymentMethod?: boolean
  trialEndBehavior?: 'cancel' | 'create_invoice' | 'continue'
  isNew?: boolean
  shouldArchive?: boolean
}

interface ProductData {
  productId: string
  name: string
  description: string
  imageUrl?: string
  statementDescriptor?: string
  category?: string
  marketingFeatures: Array<{
    id: string
    title: string
    description?: string
    order: number
  }>
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
    const supabase = createServerClient(await cookies())
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    // Check admin role
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .select('user_role')
      .eq('UID', user.id)
      .single()

    if (userError || userData?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get Stripe configuration from environment variable
    const stripeSecret = process.env.NEXT_PUBLIC_STRIPE_SECRET;
    if (!stripeSecret) {
      return NextResponse.json({
        error: 'Stripe configuration not found. Please set NEXT_PUBLIC_STRIPE_KEY and NEXT_PUBLIC_STRIPE_SECRET as environment variables in your hosting provider\'s dashboard or in your local .env file to enable Stripe product editing.'
      }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2025-06-30.basil' as any
    });

    const productData: ProductData = await request.json()

    // Validate required fields
    if (!productData.productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 })
    }

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

    const defaultPrices = productData.pricing.filter(p => p.isDefault && p.active)
    if (defaultPrices.length !== 1) {
      return NextResponse.json({ 
        error: 'Exactly one active pricing option must be set as default' 
      }, { status: 400 })
    }

    // Update product in Stripe
    const stripeProduct = await stripe.products.update(productData.productId, {
      name: productData.name,
      description: productData.description,
      images: productData.imageUrl ? [productData.imageUrl] : undefined,
      statement_descriptor: productData.statementDescriptor,
      metadata: {
        category: productData.category || '',
        marketing_features: JSON.stringify(productData.marketingFeatures),
        credits: productData.credits?.toString() || '0',
        credits_rollover: productData.creditsRollover?.toString() || 'false',
        redirect_url: productData.redirectUrl || '',
        tax_behavior: productData.taxBehavior,
        most_popular: productData.mostPopular ? 'true' : 'false'
      }
    })

    // Handle pricing updates
    const updatedPrices = []
    let defaultPriceId = ''

    for (const pricing of productData.pricing) {
      if (pricing.shouldArchive && pricing.stripeId) {
        // Archive existing price
        await stripe.prices.update(pricing.stripeId, { active: false })
        continue
      }

      if (pricing.isNew || !pricing.stripeId) {
        // Create new price
        const priceData: Stripe.PriceCreateParams = {
          product: productData.productId,
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
        updatedPrices.push(stripePrice)

        if (pricing.isDefault) {
          defaultPriceId = stripePrice.id
        }
      } else {
        // Update existing price (limited updates possible in Stripe)
        const updatedPrice = await stripe.prices.update(pricing.stripeId, {
          active: pricing.active,
          metadata: {
            order: productData.pricing.indexOf(pricing).toString(),
            is_default: pricing.isDefault.toString(),
            trial_requires_payment_method: pricing.trialRequiresPaymentMethod?.toString() || 'false',
            trial_end_behavior: pricing.trialEndBehavior || 'cancel'
          }
        })
        updatedPrices.push(updatedPrice)

        if (pricing.isDefault && pricing.active) {
          defaultPriceId = pricing.stripeId
        }
      }
    }

    // Update product with default price if it changed
    if (defaultPriceId && defaultPriceId !== stripeProduct.default_price) {
      await stripe.products.update(productData.productId, {
        default_price: defaultPriceId
      })
    }

    return NextResponse.json({
      success: true,
      product: stripeProduct,
      prices: updatedPrices,
      defaultPriceId
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update product'
    }, { status: 500 })
  }
}
