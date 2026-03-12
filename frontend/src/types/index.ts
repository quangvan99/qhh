// ── User & Auth ──
export type UserRole = 'student' | 'teacher' | 'principal' | 'admin' | 'librarian' | 'staff'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions?: string[]
}

// ── API ──
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// ── Common ──
export interface SelectOption {
  value: string
  label: string
}
