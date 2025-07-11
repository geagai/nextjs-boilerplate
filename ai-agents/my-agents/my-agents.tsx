import { requireAuth, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const MyAgentsTable = dynamic(() => import('./my-agents-table'), { ssr: false });

export default async function MyAgentsPage() {
  // Server-side admin authentication
  const { user } = await requireAuth();
  if (!isAdmin(user)) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 pr-32">
            <h1 className="text-3xl font-bold text-primary mb-2">My Agents (Admin Only)</h1>
            <p className="text-muted-foreground">
              View and manage all agents in the system. Only admins can access this page.
            </p>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="bg-muted/50 p-8 rounded-lg text-center text-muted-foreground">Loading agents table...</div>}>
        <MyAgentsTable />
      </Suspense>
    </div>
  );
} 