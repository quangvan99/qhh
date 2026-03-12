'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Upload, KeyRound, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { AppSelect } from '@/components/base/app-select'
import { PageHeader } from '@/components/composite/page-header'
import { SearchBar } from '@/components/composite/search-bar'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { DataTable } from '@/components/patterns/data-table'
import type { BulkAction } from '@/components/patterns/data-table'
import { useGetUsers, useDeleteUser, useBulkActivateUsers, useBulkDeactivateUsers } from '../api/admin.api'
import type { SystemUser } from '../types/admin.types'
import { ResetPasswordModal } from './ResetPasswordModal'

const statusMap: Record<string, { label: string; variant: 'success' | 'error' | 'warning' }> = {
  active: { label: 'Hoạt động', variant: 'success' },
  inactive: { label: 'Chưa kích hoạt', variant: 'warning' },
  locked: { label: 'Bị khóa', variant: 'error' },
}

const roleOptions = [
  { value: '', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'student', label: 'Học sinh' },
  { value: 'principal', label: 'Ban giám hiệu' },
  { value: 'librarian', label: 'Thủ thư' },
  { value: 'staff', label: 'Nhân viên' },
]

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Chưa kích hoạt' },
  { value: 'locked', label: 'Bị khóa' },
]

export function UserList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<SystemUser | null>(null)
  const [bulkAction, setBulkAction] = useState<{ type: 'activate' | 'deactivate'; rows: SystemUser[] } | null>(null)
  const [resetUser, setResetUser] = useState<SystemUser | null>(null)

  const { data, isLoading } = useGetUsers({ search, role: roleFilter, status: statusFilter })
  const deleteUser = useDeleteUser()
  const bulkActivate = useBulkActivateUsers()
  const bulkDeactivate = useBulkDeactivateUsers()

  const users = data?.data ?? []

  const columns: ColumnDef<SystemUser, unknown>[] = [
    {
      accessorKey: 'fullName',
      header: 'Người dùng',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <AppAvatar name={row.original.fullName} src={row.original.avatar} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">@{row.original.username}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Vai trò',
      cell: ({ row }) => <AppBadge role={row.original.role}>{row.original.role}</AppBadge>,
    },
    { accessorKey: 'unitName', header: 'Đơn vị' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = statusMap[row.original.status]
        return s ? <AppBadge semantic={s.variant} dot>{s.label}</AppBadge> : null
      },
    },
    {
      accessorKey: 'lastLogin',
      header: 'Đăng nhập cuối',
      cell: ({ row }) => row.original.lastLogin
        ? new Date(row.original.lastLogin).toLocaleDateString('vi-VN')
        : '—',
    },
  ]

  const actionColumn: ColumnDef<SystemUser, unknown> = {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="cursor-pointer h-8 px-2 text-xs" onClick={() => router.push(`/admin/users/${row.original.id}/edit`)}>
          Sửa
        </Button>
        <Button variant="ghost" size="sm" className="cursor-pointer h-8 px-2 text-xs" onClick={() => setResetUser(row.original)}>
          <KeyRound className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="cursor-pointer h-8 px-2 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(row.original)}>
          Xóa
        </Button>
      </div>
    ),
    enableSorting: false,
    size: 160,
  }

  const bulkActions: BulkAction<SystemUser>[] = [
    {
      label: 'Kích hoạt',
      icon: <UserCheck className="h-3.5 w-3.5" />,
      onClick: (rows) => setBulkAction({ type: 'activate', rows }),
    },
    {
      label: 'Vô hiệu hóa',
      icon: <UserX className="h-3.5 w-3.5" />,
      variant: 'destructive',
      onClick: (rows) => setBulkAction({ type: 'deactivate', rows }),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Quản lý tài khoản người dùng hệ thống"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/users' },
          { label: 'Người dùng' },
        ]}
        actions={[
          { label: 'Import', onClick: () => router.push('/admin/users/import'), icon: <Upload className="h-4 w-4" /> },
          { label: 'Thêm người dùng', onClick: () => router.push('/admin/users/new'), icon: <Plus className="h-4 w-4" /> },
        ]}
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, username, email..." className="max-w-sm" />
        <AppSelect options={roleOptions} value={roleFilter} onChange={setRoleFilter} placeholder="Vai trò" className="w-44" />
        <AppSelect options={statusOptions} value={statusFilter} onChange={setStatusFilter} placeholder="Trạng thái" className="w-44" />
      </div>

      <DataTable
        data={users}
        columns={[...columns, actionColumn]}
        loading={isLoading}
        selectable
        bulkActions={bulkActions}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => {
          if (deleteTarget) {
            deleteUser.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) })
          }
        }}
        title="Xóa người dùng"
        description={`Bạn có chắc chắn muốn xóa người dùng "${deleteTarget?.fullName ?? ''}"?`}
        variant="danger"
        confirmLabel="Xóa"
        loading={deleteUser.isPending}
      />

      {/* Bulk action confirmation */}
      <ConfirmDialog
        open={!!bulkAction}
        onOpenChange={(open) => { if (!open) setBulkAction(null) }}
        onConfirm={() => {
          if (!bulkAction) return
          const ids = bulkAction.rows.map((r) => r.id)
          if (bulkAction.type === 'activate') {
            bulkActivate.mutate(ids, { onSettled: () => setBulkAction(null) })
          } else {
            bulkDeactivate.mutate(ids, { onSettled: () => setBulkAction(null) })
          }
        }}
        title={bulkAction?.type === 'activate' ? 'Kích hoạt người dùng' : 'Vô hiệu hóa người dùng'}
        description={`Bạn có chắc chắn muốn ${bulkAction?.type === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} ${bulkAction?.rows.length ?? 0} người dùng đã chọn?`}
        variant={bulkAction?.type === 'deactivate' ? 'danger' : 'default'}
        confirmLabel={bulkAction?.type === 'activate' ? 'Kích hoạt' : 'Vô hiệu hóa'}
        loading={bulkActivate.isPending || bulkDeactivate.isPending}
      />

      {/* Reset password modal */}
      {resetUser && (
        <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />
      )}
    </div>
  )
}
