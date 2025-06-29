
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface IPInfo {
  ip: string
  country?: string
  region?: string
  city?: string
  timezone?: string
  isp?: string
  organization?: string
  as?: string
}

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json()

    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      )
    }

    // Validate IP format (basic validation)
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      )
    }

    try {
      // Use ip-api.com for free IP geolocation (no API key required)
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,timezone,isp,org,as,query`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP information')
      }

      const data = await response.json()

      if (data.status === 'fail') {
        return NextResponse.json(
          { error: data.message || 'Failed to lookup IP' },
          { status: 400 }
        )
      }

      const ipInfo: IPInfo = {
        ip: data.query,
        country: data.country,
        region: data.regionName,
        city: data.city,
        timezone: data.timezone,
        isp: data.isp,
        organization: data.org,
        as: data.as
      }

      return NextResponse.json({
        success: true,
        data: ipInfo
      })
    } catch (fetchError) {
      console.error('IP lookup API error:', fetchError)
      
      // Fallback response when external API fails
      return NextResponse.json({
        success: true,
        data: {
          ip,
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          timezone: 'Unknown',
          isp: 'Unknown',
          organization: 'Unknown',
          as: 'Unknown'
        },
        note: 'External IP lookup service unavailable, showing fallback data'
      })
    }
  } catch (error) {
    console.error('IP lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'IP Lookup MCP Tool',
    description: 'POST an IP address to get geolocation information',
    usage: {
      method: 'POST',
      body: { ip: '8.8.8.8' },
      response: {
        success: true,
        data: {
          ip: '8.8.8.8',
          country: 'United States',
          region: 'California',
          city: 'Mountain View',
          timezone: 'America/Los_Angeles',
          isp: 'Google LLC',
          organization: 'Google Public DNS',
          as: 'AS15169 Google LLC'
        }
      }
    }
  })
}
