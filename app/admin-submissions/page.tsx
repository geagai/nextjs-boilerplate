import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/db'
import SubmissionsClient from './submissions-client'

export const metadata: Metadata = {
  title: 'Admin - Contact Submissions',
  description: 'Manage contact form submissions'
}

export default async function AdminSubmissionsPage() {
  const supabase = createSupabaseServerClient()
  
  // Check if user is admin
  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  if (userError || !userData?.user) {
    redirect('/auth/login')
  }

  // Check admin status
  const { data: isAdminData } = await supabase.rpc('is_admin')
  
  if (!isAdminData) {
    redirect('/')
  }

  // Fetch submissions
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage contact form submissions from your website.
          </p>
        </div>
        
        <SubmissionsClient initialSubmissions={submissions || []} />
      </div>
    </div>
  )
} 