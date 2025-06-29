
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Initialize Supabase with service role key for testing
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration...')
  
  try {
    // Test 1: Check if environment variables are set
    console.log('\n📋 Environment Variables Check:')
    console.log('✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing')
    console.log('✅ STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing')
    console.log('✅ NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'Missing')
    console.log('✅ STRIPE_STARTER_PRICE_ID:', process.env.STRIPE_STARTER_PRICE_ID || 'Missing')
    console.log('✅ STRIPE_PRO_PRICE_ID:', process.env.STRIPE_PRO_PRICE_ID || 'Missing')
    console.log('✅ STRIPE_ELITE_PRICE_ID:', process.env.STRIPE_ELITE_PRICE_ID || 'Missing')

    // Test 2: Try to authenticate with demo account
    console.log('\n🔐 Testing Authentication with Demo Account:')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'john@doe.com',
      password: 'johndoe123'
    })

    if (authError) {
      console.log('❌ Auth Error:', authError.message)
      return
    }

    if (!authData.session) {
      console.log('❌ No session created')
      return
    }

    console.log('✅ Authentication successful')
    console.log('👤 User ID:', authData.user?.id)
    console.log('📧 Email:', authData.user?.email)

    // Test 3: Test Stripe API endpoint
    console.log('\n💳 Testing Stripe Checkout Session Creation:')
    
    const testResponse = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.session.access_token}`,
        'Cookie': `sb-access-token=${authData.session.access_token}; sb-refresh-token=${authData.session.refresh_token}`
      },
      body: JSON.stringify({ plan: 'STARTER' })
    })

    const responseData = await testResponse.json()
    
    console.log('📊 Response Status:', testResponse.status)
    console.log('📊 Response Data:', responseData)

    if (testResponse.ok && (responseData as any).sessionId) {
      console.log('✅ Stripe checkout session created successfully!')
      console.log('🎫 Session ID:', (responseData as any).sessionId)
    } else {
      console.log('❌ Failed to create checkout session')
      console.log('Error details:', responseData)
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

if (require.main === module) {
  testStripeIntegration().catch(console.error)
}

export { testStripeIntegration }
