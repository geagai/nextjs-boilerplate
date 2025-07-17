import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const sessionData = await getServerSession()

  if (!sessionData) {
    redirect('/login')
  }

  const { user } = sessionData

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  if (!supabase) {
    redirect('/login')
  }
  let userDataTableExists = true
  try {
    const { error: tableError } = await supabase
      .from('user_data')
      .select('UID')
      .limit(1)
    if (tableError && tableError.code === '42P01') {
      userDataTableExists = false
    }
  } catch (e) {
    userDataTableExists = false
  }

  let dbEmail = user.email
  let dbUserRole = 'Free Subscriber'
  let dbCredits = 0
  let dbUID = user.id
  if (userDataTableExists) {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('UID, email, user_role, credits')
        .eq('UID', user.id)
        .single()
      if (!error && data) {
        if (data.UID) dbUID = data.UID
        if (data.email) dbEmail = data.email
        if (data.user_role) dbUserRole = data.user_role.replace(/\b\w/g, (c: string) => c.toUpperCase())
        if (data.credits === null || data.credits === undefined) {
          dbCredits = 0
        } else {
          dbCredits = data.credits
        }
      }
    } catch (e) {
      // fallback to session values
    }
  }

  let userSubscriptions: Array<{
    customer_id: string
    subscription_id: string
    cost: number
    billing_term: string
    created_at: string
    status: string
  }> = []
  if (userDataTableExists) {
    try {
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('customer_id, subscription_id, cost, billing_term, created_at, status')
        .eq('UID', dbUID)
      if (!subsError && subs) {
        userSubscriptions = subs.filter(sub =>
          sub.status === 'active' &&
          (sub.billing_term === 'month' || sub.billing_term === 'monthly' || sub.billing_term === 'year' || sub.billing_term === 'yearly')
        )
      }
    } catch (e) {
      // ignore
    }
  }

  let allPurchases: Array<{
    customer_id: string
    subscription_id: string
    cost: number
    billing_term: string
    created_at: string
    status: string
  }> = []
  if (userDataTableExists) {
    try {
      const { data: allSubs, error: allSubsError } = await supabase
        .from('subscriptions')
        .select('customer_id, subscription_id, cost, billing_term, created_at, status')
        .eq('UID', dbUID)
      if (!allSubsError && allSubs) {
        allPurchases = allSubs
      }
    } catch (e) {
      // ignore
    }
  }

  // Create user object that matches expected format
  const userWithMetadata = {
    id: dbUID,
    email: dbEmail!,
    name: user.user_metadata?.name || dbEmail?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'USER',
    credits: dbCredits,
    subscription: {
      id: 'default',
      plan: dbUserRole,
      status: '',
      currentPeriodEnd: null,
      stripeCustomerId: null
    },
    payments: []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userDataTableExists && (
          <>
            <DashboardHeader user={userWithMetadata} />
            <div className="space-y-8">
              <SubscriptionCard subscription={userWithMetadata.subscription} subscriptions={userSubscriptions} className="mt-[20px]" />
              <SubscriptionCard purchases={allPurchases} isPurchasesBlock className="mt-8" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
