'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { AppBadge } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { DataTable } from '@/components/patterns/data-table'
import { useGetRoles, useDeleteRole } from '../api/admin.api'
import type { Role } from '../types/admin.types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

export function RoleList() {
  const router = useRouter()
  const { data: roles, isLoading } = useGetRoles()
  const deleteRole = useDeleteRole()
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const columns: ColumnDef<Role, unknown>[] = [
    { accessorKey: 'name', header: 'Tên vai trò' },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }) => row.original.description || '—',
    },
    {
      accessorKey: 'userCount',
      header: 'Số người dùng',
      cell: ({ row }) => row.original.userCount,
    },
    {
      accessorKey: 'isSystem',
      header: 'Loại',
      cell: ({ row }) => (
        <AppBadge semantic={row.original.isSystem ? 'info' : 'neutral'}>
          {row.original.isSystem ? 'Hệ thống' : 'Tùy chỉnh'}
        </AppBadge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/roles/${row.original.id}/edit`)}
            className="cursor-pointer h-8 w-8 p-0"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {!row.original.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(row.original)}
              className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
      enableSorting: false,
      size: 80,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Vai trò & Phân quyền"
        subtitle="Quản lý vai trò và phân quyền hệ thống"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/roles' },
          { label: 'Vai trò' },
        ]}
        actions={[
          { label: 'Tạo vai trò mới', onClick: () => router.push('/admin/roles/new'), icon: <Plus className="h-4 w-4" /> },
        ]}
      />

      <DataTable
        data={roles ?? []}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm vai trò..."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => {
          if (deleteTarget) {
            deleteRole.mutate(deleteTarget.id, {
              onSuccess: () => {
                toast.success('Đã xóa vai trò')
                setDeleteTarget(null)
              },
            })
          }
        }}
        title="Xóa vai trò"
        description={`Bạn có chắc chắn muốn xóa vai trò "${deleteTarget?.name ?? ''}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmLabel="Xóa"
        loading={deleteRole.isPending}
      />
    </div>
  )
}
