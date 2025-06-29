
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

    const supabase = createSupabaseServerClient()
    
    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject || 'General Inquiry',
        message: validatedData.message,
        created_at: new Date().toISOString()
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
