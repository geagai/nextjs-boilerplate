import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/db'
import SubmissionsClient from './submissions-client'
import { requireAuth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin - Contact Submissions',
  description: 'Manage contact form submissions'
}

export default async function AdminSubmissionsPage() {
  await requireAuth()
  const supabaseClient = await createSupabaseServerClient()

  if (!supabaseClient) throw new Error('Database connection failed');

  // Check admin status (replace with your admin check logic)
  // Example: check user.role or use a DB RPC
  const { data: isAdminData } = await supabaseClient.rpc('is_admin')
  if (!isAdminData) {
    redirect('/')
  }

  // Fetch submissions
  const { data: submissions, error } = await supabaseClient
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