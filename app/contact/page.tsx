import { Metadata } from 'next'
import { PageEditor } from '@/components/page-editor'
import { ContactForm } from '@/components/contact-form'
import { createClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team'
}

export default async function ContactPage() {
  const supabase = createClient()
  
  if (!supabase) throw new Error('Database connection failed');
  
  // Fetch the current contact us content
  const { data } = await supabase
    .from('pages')
    .select('contact_us')
    .limit(1)
    .maybeSingle()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
        <div className="mb-8">
          <PageEditor 
            column="contact_us"
            initialContent={data?.contact_us || null}
          />
        </div>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
} 