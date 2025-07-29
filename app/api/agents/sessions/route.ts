import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    
    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    const { user } = await requireAuth();
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Convert UUID values to strings to match the text columns in the database
    const UID = String(user.id);
    const agent_id = String(agentId);

    console.log('[GET /api/agents/sessions] Querying for UID:', UID, 'agentId:', agent_id);

    const { data, error } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('UID', UID)
      .eq('agent_id', agent_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/agents/sessions] Error fetching sessions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data) {
      console.log('[GET /api/agents/sessions] Raw data:', data);
      
      // Group messages by session_id and create Session objects
      const sessionMap = new Map();
      data.forEach((message: any) => {
        if (!sessionMap.has(message.session_id)) {
          sessionMap.set(message.session_id, {
            session_id: message.session_id,
            prompt: message.prompt,
            created_at: message.created_at
          });
        }
      });
      
      const uniqueSessions = Array.from(sessionMap.values());
      console.log('[GET /api/agents/sessions] Returning sessions:', uniqueSessions);
      
      return NextResponse.json({ sessions: uniqueSessions });
    } else {
      console.log('[GET /api/agents/sessions] No data found');
      return NextResponse.json({ sessions: [] });
    }

  } catch (error) {
    console.error('[GET /api/agents/sessions] Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const sessionId = searchParams.get('sessionId');
    
    if (!agentId || !sessionId) {
      return NextResponse.json({ error: 'agentId and sessionId are required' }, { status: 400 });
    }

    const { user } = await requireAuth();
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Convert UUID values to strings to match the text columns in the database
    const UID = String(user.id);
    const agent_id = String(agentId);

    console.log('[DELETE /api/agents/sessions] Deleting session:', sessionId, 'for UID:', UID, 'agentId:', agent_id);

    const { error } = await supabase
      .from('agent_messages')
      .delete()
      .eq('UID', UID)
      .eq('agent_id', agent_id)
      .eq('session_id', sessionId);

    if (error) {
      console.error('[DELETE /api/agents/sessions] Error deleting session:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[DELETE /api/agents/sessions] Session deleted successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[DELETE /api/agents/sessions] Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const sessionId = searchParams.get('sessionId');
    const { prompt } = await request.json();
    
    if (!agentId || !sessionId || !prompt) {
      return NextResponse.json({ error: 'agentId, sessionId, and prompt are required' }, { status: 400 });
    }

    const { user } = await requireAuth();
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Convert UUID values to strings to match the text columns in the database
    const UID = String(user.id);
    const agent_id = String(agentId);

    console.log('[PUT /api/agents/sessions] Updating session:', sessionId, 'prompt to:', prompt, 'for UID:', UID, 'agentId:', agent_id);

    const { error } = await supabase
      .from('agent_messages')
      .update({ prompt })
      .eq('UID', UID)
      .eq('agent_id', agent_id)
      .eq('session_id', sessionId);

    if (error) {
      console.error('[PUT /api/agents/sessions] Error updating session:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[PUT /api/agents/sessions] Session updated successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[PUT /api/agents/sessions] Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 