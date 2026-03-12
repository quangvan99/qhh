import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8080'

export const authHandlers = [
  http.post(`${BASE}/api/auth/login`, () =>
    HttpResponse.json({
      token: 'mock-token-123',
      user: { id: '1', name: 'Admin User', email: 'admin@school.edu.vn', role: 'admin' },
    }),
  ),
  http.post(`${BASE}/api/auth/logout`, () =>
    HttpResponse.json({ success: true }),
  ),
  http.get(`${BASE}/api/auth/me`, () =>
    HttpResponse.json({
      id: '1',
      name: 'Admin User',
      email: 'admin@school.edu.vn',
      role: 'admin',
    }),
  ),
]
