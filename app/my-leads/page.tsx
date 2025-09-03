import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/db'
import { Metadata } from 'next'
import { MyLeadsTable } from '@/components/my-leads-table'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Leads – Your Saved Business Leads',
  description: 'View and manage your saved business leads.',
  keywords: 'my leads, saved leads, business leads, lead management',
  openGraph: {
    title: 'My Leads – Your Saved Business Leads',
    description: 'View and manage your saved business leads.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Leads – Your Saved Business Leads',
    description: 'View and manage your saved business leads.',
  },
}

export default async function MyLeadsPage() {
  const sessionData = await getServerSession()

  if (!sessionData) {
    redirect('/login')
  }

  const supabaseClient = await createSupabaseServerClient()
  
  // Fetch the user's leads
            const { data: leads, error } = await supabaseClient
            .from('leads')
            .select(`
              id,
              business_name,
              formatted_phone_number,
              formatted_address,
              website,
              email,
              rating,
              user_ratings_total,
              contacted_email,
              contacted_text,
              contacted_call,
              created_at
            `)
            .eq('user_id', sessionData.user.id)
            .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Leads</h1>
        <MyLeadsTable leads={leads || []} />
      </div>
    </div>
  )
}
