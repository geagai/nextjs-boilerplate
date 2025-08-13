import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'
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

  // Fetch software templates
  let softwareTemplates: Array<{
    template_name: string
    description: string
    link: string
    version: string
  }> = []
  {
    const { data } = await supabase
      .from('software_templates')
      .select('template_name, description, link, version')
    if (data) {
      softwareTemplates = data as any
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
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-primary" />
                    Software Templates
                  </CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                {softwareTemplates.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Template Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Version</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Link</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {softwareTemplates.map((tpl, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-xs break-all">{tpl.template_name}</td>
                            <td className="px-4 py-2 text-xs">{tpl.description}</td>
                            <td className="px-4 py-2 text-xs">{tpl.version}</td>
                            <td className="px-4 py-2 text-xs">
                              <a href={tpl.link} target="_blank" rel="noopener noreferrer">
                                <Button size="sm">View Repo</Button>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
