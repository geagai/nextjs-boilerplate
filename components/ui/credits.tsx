import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface CreditsProps {
  userId: string
}

export default async function Credits({ userId }: CreditsProps) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  let credits = 0
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase
      .from('user_data')
      .select('credits')
      .eq('UID', userId)
      .single()
    if (!error && data) {
      if (data.credits === null || data.credits === undefined) {
        credits = 0;
      } else {
        credits = data.credits;
      }
    }
  } catch (e) {
    // fallback to 0
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits</p>
            <p className="font-semibold text-green-600">{credits}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 