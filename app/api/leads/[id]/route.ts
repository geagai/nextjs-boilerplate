import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

const updateLeadSchema = z.object({
  business_name: z.string().min(1, 'Business name is required').optional(),
  formatted_phone_number: z.string().nullable().optional(),
  formatted_address: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  contacted_email: z.boolean().optional(),
  contacted_text: z.boolean().optional(),
  contacted_call: z.boolean().optional(),
  notes: z.string().nullable().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log('Received update lead request:', body)

    const validatedData = updateLeadSchema.parse(body)
    console.log('Validated update data:', validatedData)

    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', user.id)

    // Check if lead exists and belongs to the user
    const { data: existingLead, error: checkError } = await supabaseClient
      .from('leads')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingLead) {
      console.error('Lead not found or access denied:', checkError)
      return NextResponse.json(
        { error: 'Lead not found or access denied' },
        { status: 404 }
      )
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (validatedData.business_name !== undefined) updateData.business_name = validatedData.business_name
    if (validatedData.formatted_phone_number !== undefined) updateData.formatted_phone_number = validatedData.formatted_phone_number
    if (validatedData.formatted_address !== undefined) updateData.formatted_address = validatedData.formatted_address
    if (validatedData.website !== undefined) updateData.website = validatedData.website
    if (validatedData.email !== undefined) updateData.email = validatedData.email
    if (validatedData.contacted_email !== undefined) updateData.contacted_email = validatedData.contacted_email
    if (validatedData.contacted_text !== undefined) updateData.contacted_text = validatedData.contacted_text
    if (validatedData.contacted_call !== undefined) updateData.contacted_call = validatedData.contacted_call
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes

    // Update the lead
    const { data: updatedLead, error: updateError } = await supabaseClient
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating lead:', updateError)
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      )
    }

    console.log('Lead updated successfully:', updatedLead.id)

    return NextResponse.json({
      message: 'Lead updated successfully',
      lead: updatedLead
    })

  } catch (error) {
    console.error('Update lead error:', error)
    
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Received delete lead request for ID:', id)

    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', user.id)

    // Check if lead exists and belongs to the user
    const { data: existingLead, error: checkError } = await supabaseClient
      .from('leads')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingLead) {
      console.error('Lead not found or access denied:', checkError)
      return NextResponse.json(
        { error: 'Lead not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the lead
    const { error: deleteError } = await supabaseClient
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting lead:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete lead' },
        { status: 500 }
      )
    }

    console.log('Lead deleted successfully:', id)

    return NextResponse.json({
      message: 'Lead deleted successfully'
    })

  } catch (error) {
    console.error('Delete lead error:', error)
    
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
