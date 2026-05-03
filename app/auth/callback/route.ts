import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      const role = user?.user_metadata?.role || 'founder'
      return NextResponse.redirect(`${origin}/${role}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
