import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { agentId, sessionId, userPrompt, assistantResponse } = await request.json();
    const { user } = await requireAuth();
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Convert UUID values to strings to match the text columns in the database
    const UID = String(user.id);
    const agent_id = String(agentId);
    const session_id = String(sessionId);

    console.log('[API] Saving agent message:', {
      session_id,
      UID,
      agent_id,
      prompt: userPrompt,
      message: assistantResponse
    });

    const { error } = await supabase
      .from('agent_messages')
      .insert({
        session_id: session_id,
        "UID": UID,
        agent_id: agent_id,
        prompt: userPrompt,
        message: assistantResponse
      });

    if (error) {
      console.error('[API] Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Server error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

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