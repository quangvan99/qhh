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

const publicPaths = ['/login', '/api/auth', '/api/health', '/api/classes', '/unauthorized', '/library-portal']

function isPublic(pathname: string) {
  return publicPaths.some((p) => pathname.startsWith(p))
}

// /classes/* → /lms/classes/* redirect map
const classRedirects: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /^\/classes\/new$/, replacement: '/lms/classes/new' },
  { pattern: /^\/classes\/([^/]+)\/edit$/, replacement: '/lms/classes/$1/edit' },
  { pattern: /^\/classes\/([^/]+)\/students$/, replacement: '/lms/classes/$1/students' },
  { pattern: /^\/classes\/([^/]+)\/settings$/, replacement: '/lms/classes/$1/settings' },
  { pattern: /^\/classes\/([^/]+)\/(.+)$/, replacement: '/lms/classes/$1/$2' },
  { pattern: /^\/classes\/([^/]+)$/, replacement: '/lms/classes/$1' },
  { pattern: /^\/classes$/, replacement: '/lms/classes' },
]

// /student/* → frontend routes redirect map (for test compatibility)
const studentRedirects: Array<{ pattern: RegExp; replacement: string }> = [
  // Classes
  { pattern: /^\/student\/classes\/([^/]+)\/history$/, replacement: '/my-classes/$1/history' },
  { pattern: /^\/student\/classes\/([^/]+)\/results\/details$/, replacement: '/my-classes/$1/results' },
  { pattern: /^\/student\/classes\/([^/]+)\/results$/, replacement: '/my-classes/$1/results' },
  { pattern: /^\/student\/classes\/([^/]+)\/assignments\/([^/]+)$/, replacement: '/my-classes/$1/assignments/$2' },
  { pattern: /^\/student\/classes\/([^/]+)\/assignments$/, replacement: '/my-classes/$1/assignments' },
  { pattern: /^\/student\/classes\/([^/]+)\/discussions\/([^/]+)$/, replacement: '/my-classes/$1/discussions/$2' },
  { pattern: /^\/student\/classes\/([^/]+)\/discussions$/, replacement: '/my-classes/$1/discussions' },
  { pattern: /^\/student\/classes\/([^/]+)\/lesson\/([^/]+)$/, replacement: '/my-classes/$1/lesson/$2' },
  { pattern: /^\/student\/classes\/([^/]+)$/, replacement: '/my-classes/$1' },
  { pattern: /^\/student\/classes$/, replacement: '/my-classes' },
  // Exams
  { pattern: /^\/student\/exams\/([^/]+)\/taking$/, replacement: '/my-exams/room/$1' },
  { pattern: /^\/student\/exams\/([^/]+)\/room$/, replacement: '/my-exams/room/$1' },
  { pattern: /^\/student\/exams\/([^/]+)\/result\/details$/, replacement: '/my-exams/result/$1' },
  { pattern: /^\/student\/exams\/([^/]+)\/result$/, replacement: '/my-exams/result/$1' },
  { pattern: /^\/student\/exams\/([^/]+)$/, replacement: '/my-exams/register/$1' },
  { pattern: /^\/student\/exams$/, replacement: '/my-exams' },
  // Exam sessions
  { pattern: /^\/student\/classes\/([^/]+)\/exam-session\/([^/]+)$/, replacement: '/my-exams/room/$2' },
]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Role constants — defined early so they can be reused before auth check
  const adminRoles = ['admin', 'principal', 'staff']
  const teacherRoles = ['teacher']
  const studentRoles = ['student']

  // Redirect /student/* → frontend routes (test compatibility)
  for (const { pattern, replacement } of studentRedirects) {
    if (pattern.test(pathname)) {
      const dest = pathname.replace(pattern, replacement)
      const url = new URL(dest, req.url)
      url.search = req.nextUrl.search
      return NextResponse.redirect(url, { status: 307 })
    }
  }

  // Redirect /classes/* → /lms/classes/* (server-side, fast)
  for (const { pattern, replacement } of classRedirects) {
    if (pattern.test(pathname)) {
      const dest = pathname.replace(pattern, replacement)
      const url = new URL(dest, req.url)
      url.search = req.nextUrl.search
      return NextResponse.redirect(url, { status: 307 })
    }
  }

  // Redirect already-authenticated users away from /login
  if (pathname === '/login' && req.auth?.user) {
    const role = (req.auth?.user as { role?: string })?.role ?? ''
    if (adminRoles.includes(role))   return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    if (teacherRoles.includes(role)) return NextResponse.redirect(new URL('/giaovien/dashboard', req.url))
    if (studentRoles.includes(role)) return NextResponse.redirect(new URL('/hocsinh/home', req.url))
  }

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

  // Role-based routing for v2 routes
  const role = (req.auth?.user as { role?: string })?.role ?? ''

  // Redirect root / to role-specific dashboard
  if (pathname === '/') {
    if (adminRoles.includes(role)) return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    if (teacherRoles.includes(role)) return NextResponse.redirect(new URL('/giaovien/dashboard', req.url))
    if (studentRoles.includes(role)) return NextResponse.redirect(new URL('/hocsinh/home', req.url))
  }

  // Protect role-specific routes
  if (pathname.startsWith('/admin') && !adminRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  if (pathname.startsWith('/giaovien') && !teacherRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  if (pathname.startsWith('/hocsinh') && !studentRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
