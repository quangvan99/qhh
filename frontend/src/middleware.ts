import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

/**
 * Use the lightweight authConfig (Edge Runtime safe) — NOT lib/auth.ts.
 * lib/auth.ts imports Credentials provider which uses Node.js APIs and
 * cannot run in the Edge Runtime. Importing it here caused NextAuth to
 * silently fall back to "http://localhost:3000" as the base URL instead
 * of reading the real Host header, producing wrong redirect origins.
 */
const { auth } = NextAuth(authConfig)

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
