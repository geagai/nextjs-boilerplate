
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Disable NextAuth routes - we're using Supabase now
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'NextAuth has been disabled. Please use /login for authentication.' },
    { status: 404 }
  )
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'NextAuth has been disabled. Please use /login for authentication.' },
    { status: 404 }
  )
}
