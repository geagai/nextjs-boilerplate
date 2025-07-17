
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const supabaseClient = await createSupabaseServerClient()
    
    // First, get the contact email from admin settings
    const { data: adminSettings } = await supabaseClient
      .from('admin_settings')
      .select('email')
      .limit(1)
      .maybeSingle()
    
    const { data: submission, error } = await supabaseClient
      .from('submissions')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject || 'General Inquiry',
        message: validatedData.message
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    // Send email notification if contact email is configured
    if (adminSettings?.email) {
      try {
        // For now, we'll log the email content
        // In production, this would integrate with an email service like SendGrid, Resend, etc.
        console.log('Email notification:', {
          to: adminSettings.email,
          subject: `New Contact Form Submission: ${validatedData.subject || 'General Inquiry'}`,
          content: `
            New contact form submission received:
            
            Name: ${validatedData.name}
            Email: ${validatedData.email}
            Subject: ${validatedData.subject || 'General Inquiry'}
            Message: ${validatedData.message}
            
            Submitted at: ${new Date().toISOString()}
          `
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: submission?.id
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

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
