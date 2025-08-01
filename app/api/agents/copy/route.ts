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
    const { sourceAgentId, name, description, api_url, category, is_public, icon } = formData;
    
    if (!sourceAgentId) {
      return NextResponse.json({ error: 'Source agent ID is required' }, { status: 400 });
    }

    // First, get the source agent data
    const { data: sourceAgent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', sourceAgentId)
      .eq('UID', user.id)
      .single();

    if (fetchError || !sourceAgent) {
      console.error('Database error:', fetchError);
      return NextResponse.json({ error: 'Source agent not found or access denied' }, { status: 404 });
    }

    // Create new agent data with updated fields
    const newAgentData = {
      ...sourceAgent,
      id: undefined, // Remove the ID so a new one is generated
      name: name || sourceAgent.name,
      description: description || sourceAgent.description,
      api_url: api_url || sourceAgent.api_url,
      category: category || sourceAgent.category,
      is_public: is_public !== undefined ? is_public : sourceAgent.is_public,
      UID: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update the config with the new icon if provided
    if (icon && sourceAgent.config) {
      newAgentData.config = {
        ...sourceAgent.config,
        options: {
          ...sourceAgent.config.options,
          icon: icon
        }
      };
    }

    // Insert the copied agent
    const result = await supabase
      .from('agents')
      .insert(newAgentData)
      .select()
      .single();

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: 'Failed to copy agent' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 