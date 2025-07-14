import { requireAuth, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MyAgentsTableWrapper from './my-agents-table-wrapper';

export default async function MyAgentsPage() {
  const { user } = await requireAuth();
  if (!isAdmin(user)) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <MyAgentsTableWrapper />
    </div>
  );
} 