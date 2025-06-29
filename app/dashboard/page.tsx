import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'
import { IPLookupTool } from '@/components/dashboard/ip-lookup-tool'
import { PaymentHistory } from '@/components/dashboard/payment-history'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import Credits from '@/components/ui/credits'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const sessionData = await getServerSession()

  if (!sessionData) {
    redirect('/login')
  }

  const { user } = sessionData

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  // Fetch email, user_role, and credits from user_data table
  let dbEmail = user.email
  let dbUserRole = 'Free Subscriber'
  let dbCredits = 0
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('email, user_role, credits')
      .eq('UID', user.id)
      .single()
    if (!error && data) {
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

  // Create user object that matches expected format
  const userWithMetadata = {
    id: user.id,
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
        <DashboardHeader user={userWithMetadata} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <SubscriptionCard subscription={userWithMetadata.subscription} />
            <IPLookupTool />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <PaymentHistory payments={userWithMetadata.payments} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Credits userId={userWithMetadata.id} />
        </div>
      </div>
    </div>
  )
}
