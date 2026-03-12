import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const publicPaths = ['/login', '/api/auth', '/api/health', '/unauthorized', '/library-portal']

function isPublic(pathname: string) {
  return publicPaths.some((p) => pathname.startsWith(p))
}

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (isPublic(pathname)) return NextResponse.next()

  // Allow static assets and Next internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check authentication
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
