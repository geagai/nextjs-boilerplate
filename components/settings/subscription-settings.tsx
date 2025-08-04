
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, ExternalLink, Loader2, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SubscriptionSettingsProps {
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: Date | null
    stripeCustomerId: string | null
  } | null
}

export function SubscriptionSettings({ subscription }: SubscriptionSettingsProps) {
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

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return ['Basic authentication', 'Core components', 'Community support', '1 project']
      case 'STARTER':
        return ['Everything in Free', 'Payment integration', 'Email support', '5 projects']
      case 'PRO':
        return ['Everything in Starter', 'Advanced security', 'Priority support', '20 projects']
      case 'ELITE':
        return ['Everything in Pro', 'White-label options', 'Dedicated support', 'Unlimited projects']
      default:
        return []
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-primary" />
          Subscription Management
        </CardTitle>
        <CardDescription>
          View and manage your subscription plan and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
            <p className="font-semibold text-xl">{subscription?.plan || 'FREE'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge className={getStatusColor(subscription?.status || 'active')}>
              {subscription?.status || 'Active'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Next Billing</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{formatDate(subscription?.currentPeriodEnd ?? null)}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Plan Features</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getPlanFeatures(subscription?.plan || 'FREE').map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

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
                  Manage Billing
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
          
          <Button variant="outline" asChild>
            <a href="/pricing">
              View All Plans
            </a>
          </Button>
        </div>

        {subscription?.plan === 'FREE' && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="font-medium mb-2 text-primary">Unlock Premium Features</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to access advanced features, priority support, and increased project limits.
            </p>
            <Button asChild size="sm">
              <a href="/pricing">Explore Plans</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
