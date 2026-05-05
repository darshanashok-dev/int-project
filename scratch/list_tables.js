
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function listTables() {
  const { data, error } = await supabase.rpc('get_tables')
  if (error) {
    // If rpc fails, try to query information_schema
    const { data: tables, error: tableError } = await supabase.from('pg_catalog.pg_tables').select('tablename').eq('schemaname', 'public')
    if (tableError) {
      console.error('Error listing tables:', tableError)
      return
    }
    console.log('Tables:', tables.map(t => t.tablename))
  } else {
    console.log('Tables:', data)
  }
}

listTables()
