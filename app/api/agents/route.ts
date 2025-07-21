import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Use existing auth pattern
    const { user } = await requireAuth();
    
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Get the form data
    const formData = await request.json();
    
    // Add the user ID to the data
    const agentData = {
      ...formData,
      UID: user.id
    };

    // Insert new agent
    const result = await supabase
      .from('agents')
      .insert(agentData)
      .select()
      .single();

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Use existing auth pattern
    const { user } = await requireAuth();
    
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Get the form data
    const formData = await request.json();
    const { id, ...updateData } = formData;
    
    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // Update existing agent
    const result = await supabase
      .from('agents')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('UID', user.id)
      .select()
      .single();

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
    }

    if (!result.data) {
      return NextResponse.json({ error: 'Agent not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 