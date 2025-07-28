import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
  try {
    const { session_id, agent_id, prompt, message } = await request.json();
    const { user } = await requireAuth();
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }
    const { error } = await supabase
      .from('agent_messages')
      .insert({
        session_id,
        agent_id,
        prompt,
        message,
        UID: user.id
      });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 