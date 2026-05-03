import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  const mockAuth = request.cookies.get('mock-auth')

  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = request.nextUrl.clone()
  const path = url.pathname
  const protectedRoles = ['admin', 'founder', 'mentor', 'investor', 'manager']
  const isProtected = protectedRoles.some(r => path.startsWith(`/${r}`))

  if (isMock) {
    if (mockAuth) {
      // Read mock role from cookie, default to founder
      const role = request.cookies.get('mock-role')?.value || 'founder'
      if (path === '/login' || path === '/register') {
        url.pathname = `/${role}`
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    } else {
      if (isProtected) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  // Extract and normalize role
  const rawRole = (user?.user_metadata?.role || user?.app_metadata?.role || 'founder').toLowerCase()
  const role = protectedRoles.find(r => rawRole.includes(r)) || 'founder'

  if (user) {
    if (path === '/' || path === '/login' || path === '/register') {
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }

    const matchedRole = protectedRoles.find(r => path.startsWith(`/${r}`))
    if (matchedRole && matchedRole !== role && role !== 'admin') {
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }
  } else {
    if (isProtected) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
