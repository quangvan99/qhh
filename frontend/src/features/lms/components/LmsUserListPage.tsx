'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppBadge } from '@/components/base/app-badge'
import { AppSelect } from '@/components/base/app-select'
import { PageHeader } from '@/components/composite/page-header'
import { SearchBar } from '@/components/composite/search-bar'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { DataTable } from '@/components/patterns/data-table'
import { toast } from 'sonner'

interface LmsUser {
  id: string
  fullName: string
  username: string
  role: string
  unit: string
  status: 'active' | 'inactive'
}

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' }> = {
  active: { label: 'Hoạt động', variant: 'success' },
  inactive: { label: 'Chưa kích hoạt', variant: 'warning' },
}

const roleOptions = [
  { value: '', label: 'Tất cả vai trò' },
  { value: 'admin_lms', label: 'Admin LMS' },
  { value: 'teacher', label: 'Giảng viên' },
  { value: 'assistant', label: 'Trợ giảng' },
  { value: 'student', label: 'Học viên' },
  { value: 'guest', label: 'Khách' },
]

const mockUsers: LmsUser[] = [
  { id: '1', fullName: 'Nguyễn Văn An', username: 'nguyenvanan', role: 'admin_lms', unit: 'Phòng CNTT', status: 'active' },
  { id: '2', fullName: 'Trần Thị Bình', username: 'tranthibinh', role: 'teacher', unit: 'Khoa Toán', status: 'active' },
  { id: '3', fullName: 'Lê Hoàng Cường', username: 'lehoangcuong', role: 'teacher', unit: 'Khoa Lý', status: 'active' },
  { id: '4', fullName: 'Phạm Minh Đức', username: 'phamminhduc', role: 'assistant', unit: 'Khoa Hóa', status: 'active' },
  { id: '5', fullName: 'Hoàng Thị Hoa', username: 'hoangthihoa', role: 'student', unit: 'Lớp 12A1', status: 'active' },
  { id: '6', fullName: 'Vũ Quang Hùng', username: 'vuquanghung', role: 'student', unit: 'Lớp 12A2', status: 'inactive' },
  { id: '7', fullName: 'Đặng Thị Mai', username: 'dangthimai', role: 'teacher', unit: 'Khoa Văn', status: 'active' },
  { id: '8', fullName: 'Bùi Thanh Nam', username: 'buithanhnam', role: 'student', unit: 'Lớp 11B1', status: 'active' },
  { id: '9', fullName: 'Ngô Thị Phương', username: 'ngothiphuong', role: 'guest', unit: 'Ngoài trường', status: 'active' },
  { id: '10', fullName: 'Đinh Văn Quân', username: 'dinhvanquan', role: 'assistant', unit: 'Khoa Toán', status: 'active' },
  { id: '11', fullName: 'Trương Hoàng Sơn', username: 'truonghoangson', role: 'student', unit: 'Lớp 10A1', status: 'inactive' },
  { id: '12', fullName: 'Lý Thị Trang', username: 'lythitrang', role: 'teacher', unit: 'Khoa Anh', status: 'active' },
]

export function LmsUserListPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<LmsUser | null>(null)

  const filtered = mockUsers.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false
    if (search && !u.fullName.toLowerCase().includes(search.toLowerCase()) && !u.username.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const columns: ColumnDef<LmsUser, unknown>[] = [
    {
      accessorKey: 'fullName',
      header: 'Họ tên',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.fullName}</p>
          <p className="text-xs text-muted-foreground">@{row.original.username}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Vai trò LMS',
      cell: ({ row }) => {
        const opt = roleOptions.find((r) => r.value === row.original.role)
        return <AppBadge semantic="info">{opt?.label ?? row.original.role}</AppBadge>
      },
    },
    { accessorKey: 'unit', header: 'Đơn vị' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = statusMap[row.original.status]
        return s ? <AppBadge semantic={s.variant} dot>{s.label}</AppBadge> : null
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/lms/users/${row.original.id}/edit`)} className="cursor-pointer h-8 w-8 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)} className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      enableSorting: false,
      size: 80,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Người dùng LMS"
        subtitle="Quản lý người dùng hệ thống LMS"
        breadcrumbs={[
          { label: 'LMS', href: '/lms/users' },
          { label: 'Người dùng' },
        ]}
        actions={[
          { label: 'Import', onClick: () => router.push('/lms/users/import'), icon: <Upload className="h-4 w-4" /> },
          { label: 'Thêm người dùng', onClick: () => router.push('/lms/users/new'), icon: <Plus className="h-4 w-4" /> },
        ]}
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, username..." className="max-w-sm" />
        <AppSelect options={roleOptions} value={roleFilter} onChange={setRoleFilter} placeholder="Vai trò" className="w-44" />
      </div>

      <DataTable data={filtered} columns={columns} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => {
          toast.success(`Đã xóa người dùng "${deleteTarget?.fullName}"`)
          setDeleteTarget(null)
        }}
        title="Xóa người dùng"
        description={`Bạn có chắc chắn muốn xóa người dùng "${deleteTarget?.fullName ?? ''}" khỏi LMS?`}
        variant="danger"
        confirmLabel="Xóa"
      />
    </div>
  )
}
