
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name
        },
        emailRedirectTo: undefined // Disable email confirmation redirect
      }
    })

    if (error) {
      console.error('Supabase auth signup error:', error)
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      console.error('No user data returned from Supabase')
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Insert user data record
    try {
      const { error: insertError } = await supabase
        .from('user_data')
        .insert({
          user_id: data.user.id,
          role: 'user'
        })

      if (insertError) {
        console.error('User data insertion error:', insertError)
        // If user_data insertion fails, we should ideally clean up the auth user
        // But for now, we'll continue as the user was created successfully in auth
      }
    } catch (insertErr) {
      console.error('Error inserting user data:', insertErr)
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
