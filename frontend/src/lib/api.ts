export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// Request timeout in ms — fast enough for tests to fallback to mocks without timing out
const REQUEST_TIMEOUT_MS = 4000

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // In the browser, paths starting with /api/ go through Next.js routes (same origin).
  // This lets Playwright test mocks intercept them at localhost:3000.
  // On the server (SSR), always use the absolute BASE_URL.
  let url: string
  if (path.startsWith('http')) {
    url = path
  } else if (typeof window !== 'undefined' && path.startsWith('/api/')) {
    // Browser: use relative URL → resolved to same origin (localhost:3000 in tests)
    url = path
  } else {
    url = `${BASE_URL}${path}`
  }

  // Get token from cookie or session storage
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1] ?? null
  }

  // Abort controller for timeout — prevents hanging requests from blocking mock fallbacks
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    })
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 401) {
    throw new APIError(401, 'Unauthorized')
  }
  if (response.status === 403) {
    throw new APIError(403, 'Forbidden')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new APIError(response.status, error.message ?? 'API Error', error)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
