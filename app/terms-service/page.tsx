import { Metadata } from 'next'
import { PageEditor } from '@/components/page-editor'
import { createClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for our platform'
}

export default async function TermsServicePage() {
  const supabase = createClient()
  
  if (!supabase) {
    // Return fallback content when Supabase is not available
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Terms of Service</h1>
          <div className="prose max-w-none">
            <p>Terms of Service content will be available once the application is properly configured.</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Fetch the current terms of service content
  const { data } = await supabase
    .from('pages')
    .select('terms_service')
    .limit(1)
    .maybeSingle()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Terms of Service</h1>
        <PageEditor 
          column="terms_service"
          initialContent={data?.terms_service || null}
        />
      </div>
    </div>
  )
} 