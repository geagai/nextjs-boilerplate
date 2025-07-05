import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { display_name, email } = body
    if (!display_name || !email) {
      return NextResponse.json({ error: 'Missing display_name or email' }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update user_data table
    const { error: updateError } = await supabase
      .from('user_data')
      .update({ display_name, email })
      .eq('UID', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update Supabase Auth user (email and display name)
    const { error: authUpdateError } = await supabase.auth.updateUser({
      email,
      data: { name: display_name }
    })
    if (authUpdateError) {
      return NextResponse.json({ error: authUpdateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
} 