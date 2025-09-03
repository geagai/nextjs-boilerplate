import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

const leadsSearchSchema = z.object({
  businessType: z.string().min(1, 'Business type is required'),
  location: z.string().min(1, 'Location is required'),
  radius: z.number().min(1, 'Radius must be at least 1').max(100, 'Radius must be 100 or less'),
  pageToken: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const supabaseClient = await createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json(
        { error: 'You must be logged in to view leads.' },
        { status: 401 }
      )
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')?.trim()
    const city = searchParams.get('city')?.trim()
    const state = searchParams.get('state')?.trim()

    // Start building the query
    let query = supabaseClient
      .from('leads')
      .select(`
        id,
        business_name,
        formatted_phone_number,
        formatted_address,
        website,
        email,
        rating,
        user_ratings_total,
        contacted_email,
        contacted_text,
        contacted_call,
        created_at
      `)
      .eq('user_id', user.id)

    // Apply filters
    if (keyword) {
      query = query.or(`business_name.ilike.%${keyword}%,formatted_address.ilike.%${keyword}%,website.ilike.%${keyword}%`)
    }

    if (city) {
      query = query.ilike('formatted_address', `%${city}%`)
    }

    if (state) {
      query = query.ilike('formatted_address', `%${state}%`)
    }

    // Order by creation date
    query = query.order('created_at', { ascending: false })

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      leads: leads || []
    })

  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    const validatedData = leadsSearchSchema.parse(body)
    console.log('Validated data:', validatedData)

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    console.log('API key exists:', !!apiKey)
    console.log('API key length:', apiKey?.length)
    console.log('API key starts with:', apiKey?.substring(0, 10) + '...')
    
    if (!apiKey) {
      console.error('Google Places API key not found in environment variables')
      return NextResponse.json(
        { error: 'Google Places API key not configured. Please add GOOGLE_PLACES_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    console.log('API key found, proceeding with search...')

    // Test the API key with a simple geocoding request first
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`
    console.log('Testing API key with URL:', testUrl)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minutes timeout
      
      const testResponse = await fetch(testUrl, { signal: controller.signal })
      clearTimeout(timeoutId)
      const testData = await testResponse.json()
      console.log('API key test response status:', testData.status)
      if (testData.status === 'REQUEST_DENIED') {
        console.error('API key is invalid or has restrictions:', testData.error_message)
        return NextResponse.json(
          { error: `Google Places API key error: ${testData.error_message}` },
          { status: 500 }
        )
      }
    } catch (testError) {
      if (testError instanceof Error && testError.name === 'AbortError') {
        console.error('API key test timed out after 3 minutes')
        return NextResponse.json(
          { error: 'Google Places API test timed out. Please try again.' },
          { status: 408 }
        )
      }
      console.error('Error testing API key:', testError)
    }

    // First, get the coordinates for the location using Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(validatedData.location)}&key=${apiKey}`
    console.log('Geocoding URL:', geocodeUrl)
    
    const geocodeController = new AbortController()
    const geocodeTimeoutId = setTimeout(() => geocodeController.abort(), 180000) // 3 minutes timeout
    
    let geocodeResponse
    try {
      geocodeResponse = await fetch(geocodeUrl, { signal: geocodeController.signal })
      clearTimeout(geocodeTimeoutId)
    } catch (error) {
      clearTimeout(geocodeTimeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Geocoding API request timed out after 3 minutes')
        return NextResponse.json(
          { error: 'Location search timed out. Please try again.' },
          { status: 408 }
        )
      }
      throw error
    }
    
    const geocodeData = await geocodeResponse.json()
    console.log('Geocoding response status:', geocodeData.status)

    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      console.error('Geocoding failed:', geocodeData)
      return NextResponse.json(
        { error: `Location not found: ${geocodeData.error_message || 'Invalid location'}` },
        { status: 400 }
      )
    }

    const location = geocodeData.results[0].geometry.location
    const { lat, lng } = location
    console.log('Coordinates:', { lat, lng })

    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = Math.round(validatedData.radius * 1609.34)

    // Search for places using Places API
    let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusInMeters}&type=establishment&keyword=${encodeURIComponent(validatedData.businessType)}&key=${apiKey}`
    
    // Add pageToken if provided (for pagination)
    if (validatedData.pageToken) {
      placesUrl += `&pagetoken=${validatedData.pageToken}`
    }
    console.log('Places search URL:', placesUrl)
    
    const placesController = new AbortController()
    const placesTimeoutId = setTimeout(() => placesController.abort(), 180000) // 3 minutes timeout
    
    let placesResponse
    try {
      placesResponse = await fetch(placesUrl, { signal: placesController.signal })
      clearTimeout(placesTimeoutId)
    } catch (error) {
      clearTimeout(placesTimeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Places API request timed out after 3 minutes')
        return NextResponse.json(
          { error: 'Business search timed out. Please try again.' },
          { status: 408 }
        )
      }
      throw error
    }
    
    const placesData = await placesResponse.json()
    console.log('Places API response status:', placesData.status)

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', placesData.status, placesData.error_message)
      return NextResponse.json(
        { error: `Failed to search for businesses: ${placesData.error_message || placesData.status}` },
        { status: 500 }
      )
    }

    console.log('Found places:', placesData.results?.length || 0)

    // Get detailed information for each place
    const detailedPlaces = await Promise.all(
      (placesData.results || []).map(async (place: any) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,price_level,types,business_status,geometry&key=${apiKey}`
          
          const detailsController = new AbortController()
          const detailsTimeoutId = setTimeout(() => detailsController.abort(), 180000) // 3 minutes timeout
          
          let detailsResponse
          try {
            detailsResponse = await fetch(detailsUrl, { signal: detailsController.signal })
            clearTimeout(detailsTimeoutId)
          } catch (error) {
            clearTimeout(detailsTimeoutId)
            if (error instanceof Error && error.name === 'AbortError') {
              console.error('Place details API request timed out after 3 minutes')
              return place // Return place without details if timeout
            }
            throw error
          }
          
          const detailsData = await detailsResponse.json()

          if (detailsData.status === 'OK') {
            return {
              ...place,
              ...detailsData.result
            }
          }
          
          return place
        } catch (error) {
          console.error('Error fetching place details:', error)
          return place
        }
      })
    )

    // Check which places are already saved by the current user
    let savedPlaceIds = new Set<string>()
    try {
      const supabaseClient = await createSupabaseServerClient()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      if (user) {
        const { data: savedLeads } = await supabaseClient
          .from('leads')
          .select('place_id')
          .eq('user_id', user.id)
        
        if (savedLeads) {
          savedPlaceIds = new Set(savedLeads.map(lead => lead.place_id))
        }
      }
    } catch (error) {
      console.error('Error checking saved leads:', error)
      // Continue without saved status if there's an error
    }

    // Add is_saved field to each place
    const placesWithSavedStatus = detailedPlaces.map(place => ({
      ...place,
      is_saved: savedPlaceIds.has(place.place_id)
    }))

    return NextResponse.json({
      message: 'Search completed successfully',
      results: placesWithSavedStatus,
      totalResults: placesWithSavedStatus.length,
      nextPageToken: placesData.next_page_token || null,
      searchParams: {
        businessType: validatedData.businessType,
        location: validatedData.location,
        radius: validatedData.radius,
        coordinates: { lat, lng }
      }
    })

  } catch (error) {
    console.error('Full error details:', error)
    
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Leads search error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
