import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db'
import { z } from 'zod'

const emailTemplateUpdateSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  signature: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to update email templates.' },
        { status: 401 }
      )
    }

    // Parse and validate the request body
    const body = await request.json()
    const validatedData = emailTemplateUpdateSchema.parse(body)

    // Update the email template
    const { data: template, error } = await supabaseClient
      .from('email_templates')
      .update({
        subject: validatedData.subject,
        body: validatedData.body,
        signature: validatedData.signature || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id) // Ensure user owns the template
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Email template not found or you do not have permission to update it.' },
          { status: 404 }
        )
      }
      
      console.error('Error updating email template:', error)
      return NextResponse.json(
        { error: 'Failed to update email template.' },
        { status: 500 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data.', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error in PUT /api/email-templates/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to delete email templates.' },
        { status: 401 }
      )
    }

    // Delete the email template
    const { error } = await supabaseClient
      .from('email_templates')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id) // Ensure user owns the template

    if (error) {
      console.error('Error deleting email template:', error)
      return NextResponse.json(
        { error: 'Failed to delete email template.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Email template deleted successfully.' })
  } catch (error) {
    console.error('Error in DELETE /api/email-templates/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
