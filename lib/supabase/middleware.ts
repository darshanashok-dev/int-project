import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  const role = user?.user_metadata?.role || 'founder'
  const protectedRoles = ['admin', 'founder', 'mentor', 'investor', 'manager']

  if (user) {
    // Redirect away from auth/landing pages to the user's dashboard
    if (path === '/' || path === '/login' || path === '/register') {
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }

    // Enforce role-based access — only admin can access any route, others only their own
    const matchedRole = protectedRoles.find(r => path.startsWith(`/${r}`))
    if (matchedRole && matchedRole !== role && role !== 'admin') {
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }
  } else {
    // Unauthenticated — block access to any dashboard route
    const isProtected = protectedRoles.some(r => path.startsWith(`/${r}`))
    if (isProtected) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
