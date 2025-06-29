'use client'

import { User, CreditCard, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardHeaderProps {
  user: {
    name: string | null
    email: string
    subscription: {
      plan: string
      status: string
    } | null
    credits?: number | null
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const planColors = {
    FREE: 'bg-gray-100 text-gray-800',
    STARTER: 'bg-blue-100 text-blue-800',
    PRO: 'bg-purple-100 text-purple-800',
    ELITE: 'bg-gold-100 text-gold-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name || 'User'}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your NextGeag BP account today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{user.subscription?.plan || 'FREE'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="font-semibold text-green-600">{user.credits ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
