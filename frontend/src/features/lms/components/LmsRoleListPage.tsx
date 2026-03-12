'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppBadge } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { DataTable } from '@/components/patterns/data-table'
import { toast } from 'sonner'

interface LmsRole {
  id: string
  name: string
  description: string
  userCount: number
  mainPermissions: string
  isSystem: boolean
}

const mockRoles: LmsRole[] = [
  { id: '1', name: 'Admin LMS', description: 'Quản trị viên hệ thống LMS', userCount: 3, mainPermissions: 'Toàn quyền', isSystem: true },
  { id: '2', name: 'Giảng viên', description: 'Giảng viên/Giáo viên', userCount: 45, mainPermissions: 'Quản lý lớp, nội dung, bài tập', isSystem: true },
  { id: '3', name: 'Trợ giảng', description: 'Trợ giảng, TA', userCount: 12, mainPermissions: 'Xem lớp, quản lý bài tập', isSystem: false },
  { id: '4', name: 'Học viên', description: 'Học sinh, sinh viên', userCount: 850, mainPermissions: 'Xem nội dung, nộp bài', isSystem: true },
  { id: '5', name: 'Khách', description: 'Tài khoản khách, hạn chế quyền', userCount: 5, mainPermissions: 'Chỉ xem', isSystem: false },
]

export function LmsRoleListPage() {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<LmsRole | null>(null)

  const columns: ColumnDef<LmsRole, unknown>[] = [
    { accessorKey: 'name', header: 'Tên vai trò' },
    { accessorKey: 'description', header: 'Mô tả' },
    { accessorKey: 'userCount', header: 'Số người dùng' },
    { accessorKey: 'mainPermissions', header: 'Quyền chính' },
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
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/lms/roles/${row.original.id}/edit`)} className="cursor-pointer h-8 w-8 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {!row.original.isSystem && (
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)} className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive">
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
        title="Vai trò LMS"
        subtitle="Quản lý vai trò và phân quyền trong LMS"
        breadcrumbs={[
          { label: 'LMS', href: '/lms/roles' },
          { label: 'Vai trò' },
        ]}
        actions={[
          { label: 'Tạo vai trò mới', onClick: () => router.push('/lms/roles/new'), icon: <Plus className="h-4 w-4" /> },
        ]}
      />

      <DataTable
        data={mockRoles}
        columns={columns}
        searchable
        searchPlaceholder="Tìm vai trò..."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => {
          toast.success(`Đã xóa vai trò "${deleteTarget?.name}"`)
          setDeleteTarget(null)
        }}
        title="Xóa vai trò"
        description={`Bạn có chắc chắn muốn xóa vai trò "${deleteTarget?.name ?? ''}"?`}
        variant="danger"
        confirmLabel="Xóa"
      />
    </div>
  )
}
