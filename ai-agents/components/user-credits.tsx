"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

interface UserCreditsProps {
  credits: number
}

export function UserCredits({ credits }: UserCreditsProps) {
  const displayCredits = Math.round(credits ?? 0);
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits</p>
            <p className="font-semibold text-green-600">{displayCredits}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 