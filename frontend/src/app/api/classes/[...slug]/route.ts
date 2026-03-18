/**
 * Proxy route: /api/classes/* → backend /api/lms/classes/*
 * Allows Playwright test mocks to intercept at localhost:3000/api/classes/...
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function handler(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join('/')
  const url = new URL(req.url)
  const target = `${BACKEND}/api/lms/classes/${path}${url.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      // @ts-expect-error Node.js fetch requires duplex for streaming body
      duplex: 'half',
    })
    const body = await res.arrayBuffer()
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    })
  } catch {
    // Backend not available — return 503 so hooks fall back to mock data
    return Response.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
