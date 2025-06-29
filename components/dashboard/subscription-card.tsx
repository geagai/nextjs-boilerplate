
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, ExternalLink, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SubscriptionCardProps {
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: Date | null
    stripeCustomerId: string | null
  } | null
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleManageSubscription = async () => {
    if (!subscription?.stripeCustomerId) {
      toast({
        title: 'No Subscription',
        description: 'Please upgrade to a paid plan to manage your subscription.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        window.open(data.url, '_blank')
      } else {
        throw new Error(data.error || 'Failed to create portal session')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open customer portal. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'past_due': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-primary" />
          Subscription Details
        </CardTitle>
        <CardDescription>
          Manage your current subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
            <p className="font-semibold text-lg">{subscription?.plan || 'FREE'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge className={getStatusColor(subscription?.status || 'active')}>
              {subscription?.status || 'Active'}
            </Badge>
          </div>
        </div>

        {subscription?.currentPeriodEnd && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Next Billing Date</p>
            <p className="font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {subscription?.stripeCustomerId ? (
            <Button 
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Subscription
                </>
              )}
            </Button>
          ) : (
            <Button asChild className="flex-1">
              <a href="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Plan
              </a>
            </Button>
          )}
        </div>

        {subscription?.plan === 'FREE' && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Upgrade for More Features</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Unlock advanced features, priority support, and increased limits with a paid plan.
            </p>
            <Button asChild size="sm" variant="outline">
              <a href="/pricing">View Plans</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
