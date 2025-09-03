import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db'
import { z } from 'zod'

const emailTemplateSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  signature: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to view email templates.' },
        { status: 401 }
      )
    }

    // Fetch the user's email templates
    const { data: templates, error } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching email templates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email templates.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error in GET /api/email-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to create email templates.' },
        { status: 401 }
      )
    }

    // Parse and validate the request body
    const body = await request.json()
    const validatedData = emailTemplateSchema.parse(body)

    // Create the email template
    const { data: template, error } = await supabaseClient
      .from('email_templates')
      .insert({
        user_id: user.id,
        subject: validatedData.subject,
        body: validatedData.body,
        signature: validatedData.signature || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating email template:', error)
      return NextResponse.json(
        { error: 'Failed to create email template.' },
        { status: 500 }
      )
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data.', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error in POST /api/email-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
