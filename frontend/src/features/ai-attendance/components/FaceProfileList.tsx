'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { AppAvatar, AppBadge, AppSelect } from '@/components/base'
import { PageHeader, SearchBar } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { Plus } from 'lucide-react'
import { useGetFaceProfiles } from '../api/attendance.api'
import type { FaceProfile } from '../types/attendance.types'

export function FaceProfileList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { data: profiles = [], isLoading } = useGetFaceProfiles({
    search: search || undefined,
    status: statusFilter || undefined,
  })

  const columns: ColumnDef<FaceProfile, unknown>[] = [
    {
      accessorKey: 'studentName',
      header: 'Học sinh',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <AppAvatar name={row.original.studentName} src={row.original.thumbnail} size="sm" />
          <div>
            <div className="font-medium">{row.original.studentName}</div>
            <div className="text-xs text-muted-foreground">{row.original.studentCode}</div>
          </div>
        </div>
      ),
    },
    { accessorKey: 'studentCode', header: 'Mã HS' },
    {
      accessorKey: 'photoCount',
      header: 'Số ảnh',
      cell: ({ row }) => <span className="font-medium">{row.original.photoCount}</span>,
    },
    {
      accessorKey: 'enrolledAt',
      header: 'Ngày đăng ký',
      cell: ({ row }) => new Date(row.original.enrolledAt).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge
          semantic={row.original.status === 'active' ? 'success' : 'warning'}
          size="sm"
        >
          {row.original.status === 'active' ? 'Đã ĐK' : 'Chờ duyệt'}
        </AppBadge>
      ),
    },
  ]

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đã đăng ký' },
    { value: 'pending', label: 'Chờ duyệt' },
  ]

  return (
    <div>
      <PageHeader
        title="Quản lý khuôn mặt"
        subtitle="Đăng ký và quản lý ảnh khuôn mặt học sinh"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Khuôn mặt' },
        ]}
        actions={[
          {
            label: 'Thêm mới',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => router.push('/ai-attendance/faces/new'),
          },
        ]}
      />
      <div className="mb-4 flex items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm học sinh..."
          className="max-w-sm"
        />
        <AppSelect
          options={statusOptions}
          value={statusFilter || 'all'}
          onChange={(v) => setStatusFilter(v === 'all' ? '' : v)}
          placeholder="Trạng thái"
          className="w-[180px]"
        />
      </div>
      <DataTable<FaceProfile>
        data={profiles}
        columns={columns}
        loading={isLoading}
        searchable={false}
      />
    </div>
  )
}
