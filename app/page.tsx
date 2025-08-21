import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NextJS Boilerplate',
  description: 'NextJS Boilerplate Application',
  keywords: 'NextJS, boilerplate, application',
  openGraph: {
    title: 'NextJS Boilerplate',
    description: 'NextJS Boilerplate Application',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextJS Boilerplate',
    description: 'NextJS Boilerplate Application',
  },
}

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Home page content will go here */}
    </div>
  );
}
