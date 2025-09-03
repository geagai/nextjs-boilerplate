import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { Metadata } from 'next'
import { LeadsForm } from '@/components/leads-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leads – Find Business Opportunities',
  description: 'Search for business leads by location, radius, and business type.',
  keywords: 'leads, business opportunities, location search, business type',
  openGraph: {
    title: 'Leads – Find Business Opportunities',
    description: 'Search for business leads by location, radius, and business type.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leads – Find Business Opportunities',
    description: 'Search for business leads by location, radius, and business type.',
  },
}

export default async function LeadsPage() {
  const sessionData = await getServerSession()

  if (!sessionData) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[700px]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Find Leads</h1>
        <LeadsForm />
      </div>
    </div>
  )
}
