
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuth() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Key present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Test login
    console.log('\nTesting login with john@doe.com...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'john@doe.com',
      password: 'johndoe123'
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return false;
    } else {
      console.log('✅ Login successful!');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      
      // Test user_data table query
      console.log('\nTesting user_data table query...');
      const { data: userData, error: userError } = await supabase
        .from('user_data')
        .select('role')
        .eq('user_id', data.user.id)
        .single();
      
      if (userError) {
        console.log('User data error (expected):', userError.message);
      } else {
        console.log('✅ User role from DB:', userData.role);
      }
      
      // Test sign out
      await supabase.auth.signOut();
      console.log('✅ Sign out successful');
      return true;
    }
  } catch (err) {
    console.error('Exception:', err.message);
    return false;
  }
}

testAuth();
