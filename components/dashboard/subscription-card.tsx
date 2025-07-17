
'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown } from 'lucide-react'

interface SubscriptionCardProps {
  subscription?: {
    plan: string
    status: string
    currentPeriodEnd: Date | null
    stripeCustomerId: string | null
  } | null
  subscriptions?: Array<{
    subscription_id: string
    cost: number
    billing_term: string
    created_at: string
    status: string
  }>
  purchases?: Array<{
    subscription_id: string
    cost: number
    billing_term: string
    created_at: string
    status: string
  }>
  isPurchasesBlock?: boolean
  className?: string
}

export function SubscriptionCard({ subscriptions = [], purchases = [], isPurchasesBlock = false, className }: SubscriptionCardProps) {
  // Removed unused variables and imports per lint errors

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-primary" />
          {isPurchasesBlock ? 'Purchases' : 'Active Subscriptions'}
        </CardTitle>
        <CardDescription>
          {isPurchasesBlock
            ? 'Below you will see all the purchases you have made of subscriptions and one off payments.'
            : 'Manage your active subscriptions.'}
        </CardDescription>
      </CardHeader>
      {((isPurchasesBlock && purchases.length > 0) || (!isPurchasesBlock && subscriptions.length > 0)) && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subscription ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Billing Term</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                {!isPurchasesBlock && (
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {(isPurchasesBlock ? purchases : subscriptions).map((sub, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-xs break-all">{sub.subscription_id}</td>
                  <td className="px-4 py-2 text-xs">${sub.cost.toFixed(2)}</td>
                  <td className="px-4 py-2 text-xs">{
                    sub.billing_term.charAt(0).toUpperCase() + sub.billing_term.slice(1)
                  }</td>
                  <td className="px-4 py-2 text-xs">{new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-4 py-2 text-xs">
                    {isPurchasesBlock ? (
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold">Paid</span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold">Active</span>
                    )}
                  </td>
                  {!isPurchasesBlock && (
                    <td className="px-4 py-2 text-xs">
                      {(sub.billing_term === 'month' || sub.billing_term === 'monthly' || sub.billing_term === 'year' || sub.billing_term === 'yearly') ? (
                        <a
                          href={`https://dashboard.stripe.com/subscriptions/${sub.subscription_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-xs font-medium"
                        >
                          Manage Subscription
                        </a>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
