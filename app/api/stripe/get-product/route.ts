
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { user } = await requireAuth()
  try {
    const supabase = createServerClient(await cookies())
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
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

    try {
      // Fetch product from Stripe
      const product = await stripe.products.retrieve(productId)

      // Fetch all prices for this product
      const prices = await stripe.prices.list({
        product: productId,
        limit: 100 // Adjust if you need more
      })

      return NextResponse.json({
        success: true,
        product,
        prices: prices.data
      })

    } catch (stripeError: unknown) {
      if (stripeError && typeof stripeError === 'object' && 'statusCode' in stripeError) {
        const err = stripeError as { statusCode?: number; message?: string };
        if (err.statusCode === 404) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
      }
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch product'
    }, { status: 500 })
  }
}
