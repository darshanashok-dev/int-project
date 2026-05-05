
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkMentors() {
  const { data, error } = await supabase
    .from('mentors')
    .select('*, users(full_name, email)')
  
  if (error) {
    console.error('Error fetching mentors:', error)
    return
  }
  
  console.log('Mentors in database:', JSON.stringify(data, null, 2))
}

checkMentors()
