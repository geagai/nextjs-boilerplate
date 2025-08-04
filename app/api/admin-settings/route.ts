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

    // Check if user is admin using existing pattern
    const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data
    const formData = await request.json();
    
    // Get existing settings to get the ID
    const { data: existingSettings } = await supabase
      .from('admin_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    let result;
    if (existingSettings?.id) {
      // Update existing settings
      result = await supabase
        .from('admin_settings')
        .update(formData)
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Insert new settings
      result = await supabase
        .from('admin_settings')
        .insert(formData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 