
const { createClient } = require('@supabase/supabase-js')

// Note: This script requires the Supabase URL and service role key
// You'll need to set these environment variables or update the script with your values

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('Setting up database tables...')

    // Check if user_data table exists and create if needed
    const { data: userData, error: userTableError } = await supabase
      .from('user_data')
      .select('id')
      .limit(1)

    if (userTableError && userTableError.code === 'PGRST116') {
      console.log('Creating user_data table...')
      // Table doesn't exist, but we can't create it via JS client
      console.log('Please run the SQL from setup-database.sql in your Supabase SQL editor')
    } else if (userTableError) {
      console.error('Error checking user_data table:', userTableError)
    } else {
      console.log('user_data table already exists')
    }

    // Check if website_settings table exists
    const { data: settingsData, error: settingsTableError } = await supabase
      .from('website_settings')
      .select('id')
      .limit(1)

    if (settingsTableError && settingsTableError.code === 'PGRST116') {
      console.log('Creating website_settings table...')
      console.log('Please run the SQL from setup-database.sql in your Supabase SQL editor')
    } else if (settingsTableError) {
      console.error('Error checking website_settings table:', settingsTableError)
    } else {
      console.log('website_settings table already exists')
    }

    // Try to create storage bucket
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
    
    if (!bucketListError) {
      const productImagesBucket = buckets.find(bucket => bucket.id === 'product-images')
      
      if (!productImagesBucket) {
        console.log('Creating product-images storage bucket...')
        const { error: bucketError } = await supabase.storage.createBucket('product-images', {
          public: true
        })
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError)
        } else {
          console.log('product-images bucket created successfully')
        }
      } else {
        console.log('product-images bucket already exists')
      }
    }

    console.log('Database setup complete!')
    console.log('\nIMPORTANT: Make sure to run the SQL from setup-database.sql in your Supabase SQL editor to create the tables and policies.')

  } catch (error) {
    console.error('Setup error:', error)
  }
}

setupDatabase()
