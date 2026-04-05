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

  if (user) {
    // If logged in and hitting auth pages, redirect to dashboard based on role
    if (path === '/login' || path === '/register' || path === '/') {
      const role = user.user_metadata?.role || 'founder'
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }
    
    // Enforce role-based routing
    if (path.startsWith('/admin') && user.user_metadata?.role !== 'admin') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    // Similarly for other roles, basic prefix check:
    const roles = ['admin', 'founder', 'mentor', 'investor', 'manager']
    for (const r of roles) {
      if (path.startsWith(`/${r}`) && user.user_metadata?.role !== r && user.user_metadata?.role !== 'admin') {
        url.pathname = `/${user.user_metadata?.role || 'founder'}`
        return NextResponse.redirect(url)
      }
    }
  } else {
    // If not logged in and hitting protected routes
    if (path !== '/' && path !== '/login' && path !== '/register') {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
