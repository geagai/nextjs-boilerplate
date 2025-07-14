import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { requireAuth } from '@/lib/auth'

export async function POST(request: Request) {
  const { user } = await requireAuth()
  try {
    const body = await request.json()
    const { display_name, email } = body
    if (!display_name || !email) {
      return NextResponse.json({ error: 'Missing display_name or email' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
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
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
} 