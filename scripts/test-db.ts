import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!)

async function probeColumn(column: string) {
  const { error } = await supabase.from('funding').select(column).limit(1)
  if (error) {
    console.log(`❌ Column '${column}' is NOT available.`)
  } else {
    console.log(`✅ Column '${column}' IS available!`)
  }
}

async function run() {
  console.log("Probing alternate columns for 'funding':")
  await probeColumn('round_name')
  await probeColumn('stage')
  await probeColumn('type')
  await probeColumn('funding_round')
}

run()
