
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('Starting database seed...')

  try {
    // Create demo user using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'john@doe.com',
      password: 'johndoe123',
      email_confirm: true,
      user_metadata: {
        name: 'John Doe',
        role: 'ADMIN'
      }
    })

    if (authError) {
      // If user already exists, try to get the existing user
      console.log('User might already exist, attempting to retrieve...')
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers.users.find(u => u.email === 'john@doe.com')
      
      if (existingUser) {
        console.log('Demo user already exists:', existingUser.email)
      } else {
        throw authError
      }
    } else {
      console.log('Demo user created:', authData.user.email)
    }

    // Create sample contact submissions
    const sampleContacts = [
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Integration Question',
        message: 'I\'m interested in using NextGeag BP for my startup. Can you help me understand the integration process?',
        created_at: new Date().toISOString()
      },
      {
        name: 'Bob Wilson',
        email: 'bob@company.com',
        subject: 'Enterprise Inquiry',
        message: 'We\'re looking at NextGeag BP for our enterprise application. Do you offer custom development services?',
        created_at: new Date().toISOString()
      }
    ]

    for (const contact of sampleContacts) {
      const { error: contactError } = await supabase
        .from('contact_submissions')
        .upsert(contact, { 
          onConflict: 'email,subject',
          ignoreDuplicates: true 
        })

      if (contactError) {
        console.error('Error creating contact submission:', contactError)
      }
    }

    console.log('Sample contact submissions created')
    console.log('Database seed completed successfully!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
