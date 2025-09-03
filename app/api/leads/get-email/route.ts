import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId } = body

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

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

    // Get the lead data
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single()

    if (leadError || !lead) {
      console.error('Lead not found or access denied:', leadError)
      return NextResponse.json(
        { error: 'Lead not found or access denied' },
        { status: 404 }
      )
    }

    // Get the current session
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()

    if (sessionError || !session) {
      console.error('Session error:', sessionError)
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 401 }
      )
    }

    // Prepare the request to geag.ai
    const geagRequest = {
      query: "I want you to find the contact information for this company.",
      company_name: lead.business_name,
      phone_number: lead.formatted_phone_number || "",
      places_id: lead.place_id || "",
      address: lead.formatted_address || "",
      UID: "0e5500bc-22a7-419a-bcc7-1f3d5c81223e",
      model: "x-ai/grok-4",
      session_id: session.access_token
    }

    console.log('Making request to geag.ai:', geagRequest)

    // Make the API call to geag.ai with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minutes timeout

    let geagResponse
    try {
      geagResponse = await fetch('https://api.geag.ai/webhook/email-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Origin': 'https://www.geag.ai',
          'Referer': 'https://www.geag.ai/',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        body: JSON.stringify(geagRequest),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Geag.ai API request timed out after 3 minutes')
        return NextResponse.json(
          { error: 'Email search timed out. Please try again.' },
          { status: 408 }
        )
      }
      throw error
    }

    // Process the response
    let geagData
    let responseText = ''
    
    try {
      // First get the response as text to see what we're dealing with
      responseText = await geagResponse.text()
      console.log('Geag.ai response text (first 500 chars):', responseText.substring(0, 500))
      
      // Try to parse as JSON
      try {
        geagData = JSON.parse(responseText)
        console.log('Geag.ai response parsed as JSON:', geagData)
      } catch (jsonError) {
        console.error('Error parsing geag.ai response as JSON:', jsonError)
        console.log('Full response text:', responseText)
        
        // Check if it's an HTML error page
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          console.error('Received HTML error page instead of JSON response')
          geagData = null
        } else {
          // Try to extract any useful information from the text
          geagData = null
        }
      }
    } catch (textError) {
      console.error('Error reading geag.ai response as text:', textError)
      geagData = null
    }

    // Handle 504 Gateway Timeout more gracefully
    if (!geagResponse.ok) {
      console.error('Geag.ai API error:', geagResponse.status, geagResponse.statusText)
      
      // For 504 Gateway Timeout, try to extract data if available
      if (geagResponse.status === 504 && geagData) {
        console.log('504 Gateway Timeout but attempting to extract data from response')
        // Continue processing with the data we have
      } else {
        return NextResponse.json(
          { error: 'Failed to get email from external service' },
          { status: 500 }
        )
      }
    }

    // Extract email from response
    let email = null
    console.log('Attempting to extract email from geagData:', geagData)
    
    if (geagData && Array.isArray(geagData) && geagData.length > 0) {
      const firstResponse = geagData[0]
      console.log('First response from geag.ai:', firstResponse)
      
      if (firstResponse.message) {
        console.log('Message from geag.ai:', firstResponse.message)
        // Check if the message contains an email address
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
        const emailMatch = firstResponse.message.match(emailRegex)
        if (emailMatch) {
          email = emailMatch[0]
          console.log('Extracted email:', email)
        } else {
          console.log('No email found in message')
        }
      } else {
        console.log('No message field in first response')
      }
    } else {
      console.log('geagData is not in expected format:', typeof geagData, geagData)
    }

    // Update the lead with the email result
    const updateData = {
      email: email || "not found grok",
      updated_at: new Date().toISOString()
    }

    const { data: updatedLead, error: updateError } = await supabaseClient
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating lead with email:', updateError)
      return NextResponse.json(
        { error: 'Failed to update lead with email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Email search completed',
      email: email,
      lead: updatedLead
    })

  } catch (error) {
    console.error('Get email error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
