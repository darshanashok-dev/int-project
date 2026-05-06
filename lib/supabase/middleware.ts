import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const role = user?.user_metadata?.role || 'founder'
  const protectedPrefixes = ['/admin', '/founder', '/mentor', '/investor', '/manager']
  const isProtected = protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))

  let response = supabaseResponse

  if (user) {
    if (pathname === '/') {
      response = NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  } else {
    if (isProtected) {
      response = NextResponse.redirect(new URL('/login', request.url))
    }
  }

  response.headers.set('x-url', request.url)
  return response
}
