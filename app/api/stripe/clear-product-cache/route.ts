import { NextResponse } from 'next/server'
import { requireAuth, isAdmin } from '@/lib/auth'
import { clearStripeProductsCache } from '@/lib/stripe-cache'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const { user } = await requireAuth()
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    clearStripeProductsCache()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear cache error', error)
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
} 