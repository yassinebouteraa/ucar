
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  console.log('Checking institutions access...')
  const { data, error } = await supabase.from('institutions').select('id, name').limit(1)
  
  if (error) {
    console.error('Fetch Error:', error)
  } else {
    console.log('Fetch Success:', data)
  }

  // Also check users table access
  console.log('Checking users access...')
  const { data: userData, error: userError } = await supabase.from('users').select('id').limit(1)
  if (userError) {
    console.error('Users Fetch Error:', userError)
  } else {
    console.log('Users Fetch Success:', userData)
  }
}

check()
