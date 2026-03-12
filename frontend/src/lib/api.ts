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

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`

  // Get token from cookie or session storage
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1] ?? null
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new APIError(401, 'Unauthorized')
  }
  if (response.status === 403) {
    if (typeof window !== 'undefined') window.location.href = '/unauthorized'
    throw new APIError(403, 'Forbidden')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new APIError(response.status, error.message ?? 'API Error', error)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
