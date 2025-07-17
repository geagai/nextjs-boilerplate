'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Mail, Calendar, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase'

interface Submission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

interface SubmissionsClientProps {
  initialSubmissions: Submission[]
}

export default function SubmissionsClient({ initialSubmissions }: SubmissionsClientProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const deleteSubmission = async (id: string) => {
    if (!supabase) return;
    setLoading(id)
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSubmissions(prev => prev.filter(sub => sub.id !== id))
      toast({ title: 'Submission deleted successfully' })
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast({ 
        title: 'Failed to delete submission', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Mail className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
          <p className="text-muted-foreground">
            Contact form submissions will appear here when users submit the form.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recent Submissions</h2>
          <p className="text-sm text-muted-foreground">
            {submissions.length} total submission{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {submission.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {submission.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(submission.created_at)}
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSubmission(submission.id)}
                  disabled={loading === submission.id}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.subject && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-sm">{submission.subject}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{submission.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 