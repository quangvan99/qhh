import type { UserRole } from '@/types'

// ── System User ──
export interface SystemUser {
  id: string
  username: string
  fullName: string
  email: string
  role: UserRole
  unitId?: string
  unitName?: string
  avatar?: string
  status: 'active' | 'inactive' | 'locked'
  lastLogin?: string
  createdAt: string
}

// ── Role & Permissions ──
export interface Role {
  id: string
  name: string
  description?: string
  userCount: number
  permissions: string[]
  isSystem: boolean
  createdAt: string
}

export interface Permission {
  key: string
  module: string
  action: string
  label: string
}

// ── Org Unit ──
export interface OrgUnit {
  id: string
  name: string
  code?: string
  type: 'school' | 'department' | 'class' | 'group'
  parentId?: string
  order: number
  children?: OrgUnit[]
  userCount: number
}

// ── Settings ──
export interface SystemSettings {
  general: {
    schoolName: string
    logoUrl?: string
    timezone: string
    language: string
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword?: string
    fromName: string
    fromEmail: string
  }
  security: {
    sessionTimeoutMinutes: number
    passwordMinLength: number
    passwordRequireUppercase: boolean
    passwordRequireNumber: boolean
    passwordRequireSymbol: boolean
    passwordExpiryDays: number
  }
}

// ── Audit Log ──
export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  resourceType: string
  resourceId?: string
  ipAddress: string
  userAgent?: string
  createdAt: string
  before?: unknown
  after?: unknown
}

// ── Integration ──
export interface Integration {
  id: string
  name: string
  type: 'sso' | 'lgsp' | 'email' | 'sms'
  status: 'connected' | 'disconnected' | 'error'
  config: Record<string, unknown>
  lastTestedAt?: string
  lastError?: string
}

// ── Params ──
export interface UserFilterParams {
  search?: string
  role?: string
  status?: string
  unitId?: string
}

export interface AuditLogFilterParams {
  userId?: string
  action?: string
  module?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}
