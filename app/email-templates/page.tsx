import { createSupabaseServerClient } from '@/lib/db'
import { redirect } from 'next/navigation'
import { EmailTemplatesClient } from './email-templates-client'

export default async function EmailTemplatesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Fetch user's email templates
  const { data: templates, error: templatesError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('user_id', user.id)

  if (templatesError) {
    console.error('Error fetching email templates:', templatesError)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage your email templates for outreach campaigns.
          </p>
        </div>

        <EmailTemplatesClient 
          initialTemplates={templates || []} 
          userId={user.id}
        />
      </div>
    </div>
  )
}
