import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { PaginatedResponse } from '@/types'
import type {
  SystemUser,
  Role,
  Permission,
  OrgUnit,
  SystemSettings,
  AuditLog,
  Integration,
  UserFilterParams,
  AuditLogFilterParams,
} from '../types/admin.types'

// ── Query Keys ──
const keys = {
  users: ['admin', 'users'] as const,
  user: (id: string) => ['admin', 'users', id] as const,
  roles: ['admin', 'roles'] as const,
  role: (id: string) => ['admin', 'roles', id] as const,
  permissions: ['admin', 'permissions'] as const,
  rolePermissions: (roleId: string) => ['admin', 'roles', roleId, 'permissions'] as const,
  orgUnits: ['admin', 'org-units'] as const,
  settings: ['admin', 'settings'] as const,
  auditLogs: ['admin', 'audit-logs'] as const,
  integrations: ['admin', 'integrations'] as const,
}

// ─── Users ──────────────────────────────────────────────────────

export function useGetUsers(params: UserFilterParams) {
  return useQuery({
    queryKey: [...keys.users, params],
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params.search) searchParams.set('search', params.search)
      if (params.role) searchParams.set('role', params.role)
      if (params.status) searchParams.set('status', params.status)
      if (params.unitId) searchParams.set('unitId', params.unitId)
      return apiFetch<PaginatedResponse<SystemUser>>(`/api/v1/admin/users?${searchParams.toString()}`)
    },
  })
}

export function useGetUser(id: string) {
  return useQuery({
    queryKey: keys.user(id),
    queryFn: () => apiFetch<SystemUser>(`/api/v1/admin/users/${id}`),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SystemUser> & { password?: string }) =>
      apiFetch<SystemUser>('/api/v1/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<SystemUser> & { id: string; password?: string }) =>
      apiFetch<SystemUser>(`/api/v1/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: keys.users })
      void qc.invalidateQueries({ queryKey: keys.user(vars.id) })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/v1/admin/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch<{ message: string }>(`/api/v1/admin/users/${userId}/reset-password`, { method: 'POST' }),
  })
}

export function useBulkActivateUsers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch<void>('/api/v1/admin/users/bulk-activate', { method: 'POST', body: JSON.stringify({ ids }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useBulkDeactivateUsers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch<void>('/api/v1/admin/users/bulk-deactivate', { method: 'POST', body: JSON.stringify({ ids }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useImportUsers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
        '/api/v1/admin/users/import',
        { method: 'POST', body: formData, headers: {} }
      )
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

// ─── Roles ──────────────────────────────────────────────────────

export function useGetRoles() {
  return useQuery({
    queryKey: keys.roles,
    queryFn: () => apiFetch<Role[]>('/api/v1/admin/roles'),
  })
}

export function useGetRole(id: string) {
  return useQuery({
    queryKey: keys.role(id),
    queryFn: () => apiFetch<Role>(`/api/v1/admin/roles/${id}`),
    enabled: !!id,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      apiFetch<Role>('/api/v1/admin/roles', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.roles }) },
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; description?: string }) =>
      apiFetch<Role>(`/api/v1/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.roles }) },
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/v1/admin/roles/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.roles }) },
  })
}

// ─── Permissions ────────────────────────────────────────────────

export function useGetPermissions() {
  return useQuery({
    queryKey: keys.permissions,
    queryFn: () => apiFetch<Permission[]>('/api/v1/admin/permissions'),
  })
}

export function useGetRolePermissions(roleId: string) {
  return useQuery({
    queryKey: keys.rolePermissions(roleId),
    queryFn: () => apiFetch<{ permissionKeys: string[] }>(`/api/v1/admin/roles/${roleId}/permissions`),
    enabled: !!roleId,
  })
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissionKeys }: { roleId: string; permissionKeys: string[] }) =>
      apiFetch<void>(`/api/v1/admin/roles/${roleId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissionKeys }),
      }),
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: keys.rolePermissions(vars.roleId) })
      void qc.invalidateQueries({ queryKey: keys.roles })
    },
  })
}

// ─── Org Units ──────────────────────────────────────────────────

export function useGetOrgUnits() {
  return useQuery({
    queryKey: keys.orgUnits,
    queryFn: () => apiFetch<OrgUnit[]>('/api/v1/admin/org-units'),
  })
}

export function useCreateOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<OrgUnit, 'id' | 'children' | 'userCount'>) =>
      apiFetch<OrgUnit>('/api/v1/admin/org-units', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

export function useUpdateOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<OrgUnit> & { id: string }) =>
      apiFetch<OrgUnit>(`/api/v1/admin/org-units/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

export function useDeleteOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/v1/admin/org-units/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

export function useReorderOrgUnits() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) =>
      apiFetch<void>('/api/v1/admin/org-units/reorder', { method: 'POST', body: JSON.stringify({ items }) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

// ─── Settings ───────────────────────────────────────────────────

export function useGetSettings() {
  return useQuery({
    queryKey: keys.settings,
    queryFn: () => apiFetch<SystemSettings>('/api/v1/admin/settings'),
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) =>
      apiFetch<SystemSettings>('/api/v1/admin/settings', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.settings }) },
  })
}

// ─── Audit Logs ─────────────────────────────────────────────────

export function useGetAuditLogs(params: AuditLogFilterParams) {
  return useQuery({
    queryKey: [...keys.auditLogs, params],
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params.userId) searchParams.set('userId', params.userId)
      if (params.action) searchParams.set('action', params.action)
      if (params.module) searchParams.set('module', params.module)
      if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom)
      if (params.dateTo) searchParams.set('dateTo', params.dateTo)
      if (params.page) searchParams.set('page', String(params.page))
      if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<AuditLog>>(`/api/v1/admin/audit-logs?${searchParams.toString()}`)
    },
  })
}

// ─── Integrations ───────────────────────────────────────────────

export function useGetIntegrations() {
  return useQuery({
    queryKey: keys.integrations,
    queryFn: () => apiFetch<Integration[]>('/api/v1/admin/integrations'),
  })
}

export function useGetIntegration(id: string) {
  return useQuery({
    queryKey: [...keys.integrations, id],
    queryFn: () => apiFetch<Integration>(`/api/v1/admin/integrations/${id}`),
    enabled: !!id,
  })
}

export function useUpdateIntegration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Integration) =>
      apiFetch<Integration>(`/api/v1/admin/integrations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.integrations }) },
  })
}

export function useTestIntegration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean; message: string; latency?: number }>(`/api/v1/admin/integrations/${id}/test`, { method: 'POST' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.integrations }) },
  })
}
