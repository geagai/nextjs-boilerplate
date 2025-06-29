
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'
import { IPLookupTool } from '@/components/dashboard/ip-lookup-tool'
import { PaymentHistory } from '@/components/dashboard/payment-history'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const sessionData = await getServerSession()

  if (!sessionData) {
    redirect('/login')
  }

  const { user } = sessionData

  // Create user object that matches expected format
  const userWithMetadata = {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'USER',
    subscription: user.user_metadata?.subscription || {
      id: 'default',
      plan: 'FREE',
      status: 'ACTIVE'
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
      </div>
    </div>
  )
}
