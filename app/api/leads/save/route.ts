import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

const saveLeadSchema = z.object({
  place_id: z.string().min(1, 'Place ID is required'),
  business_name: z.string().min(1, 'Business name is required'),
  formatted_address: z.string().optional(),
  formatted_phone_number: z.string().optional(),
  website: z.string().optional(),
  rating: z.number().optional(),
  user_ratings_total: z.number().optional(),
  price_level: z.number().optional(),
  business_status: z.string().optional(),
  business_types: z.array(z.string()).optional(),
  search_business_type: z.string().min(1, 'Search business type is required'),
  search_location: z.string().min(1, 'Search location is required'),
  search_radius: z.number().min(1, 'Search radius is required'),
  search_coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received save lead request:', body)
    
    const validatedData = saveLeadSchema.parse(body)
    console.log('Validated lead data:', validatedData)

    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json(
        { error: 'You must be logged in to save leads. Please sign in and try again.' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', user.id)

    // Check if lead already exists for this user and place
    const { data: existingLead, error: checkError } = await supabaseClient
      .from('leads')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_id', validatedData.place_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking existing lead:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing lead' },
        { status: 500 }
      )
    }

    if (existingLead) {
      console.log('Lead already exists for user:', existingLead.id)
      return NextResponse.json(
        { error: 'Lead already saved' },
        { status: 409 }
      )
    }

    // Insert the new lead
    const { data: newLead, error: insertError } = await supabaseClient
      .from('leads')
      .insert({
        user_id: user.id,
        place_id: validatedData.place_id,
        business_name: validatedData.business_name,
        formatted_address: validatedData.formatted_address,
        formatted_phone_number: validatedData.formatted_phone_number,
        website: validatedData.website,
        rating: validatedData.rating,
        user_ratings_total: validatedData.user_ratings_total,
        price_level: validatedData.price_level,
        business_status: validatedData.business_status,
        business_types: validatedData.business_types,
        search_business_type: validatedData.search_business_type,
        search_location: validatedData.search_location,
        search_radius: validatedData.search_radius,
        search_coordinates: validatedData.search_coordinates
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting lead:', insertError)
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      )
    }

    console.log('Lead saved successfully:', newLead.id)

    return NextResponse.json({
      message: 'Lead saved successfully',
      lead: newLead
    }, { status: 201 })

  } catch (error) {
    console.error('Save lead error:', error)
    
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
