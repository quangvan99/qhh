'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetMembers, useDeleteMember } from '@/features/library/api/library.api'
import type { LibraryMember } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { AppBadge, AppSelect } from '@/components/base'
import { toast } from 'sonner'

const memberTypeLabel: Record<string, string> = {
  student: 'Học sinh',
  teacher: 'Giáo viên',
  staff: 'Nhân viên',
}

const statusLabel: Record<string, string> = {
  active: 'Hoạt động',
  suspended: 'Tạm khóa',
  expired: 'Hết hạn',
}

export function MemberList() {
  const router = useRouter()
  const [filters, setFilters] = useState({ search: '', memberType: '', status: '' })
  const { data: membersData, isLoading } = useGetMembers(filters)
  const deleteMut = useDeleteMember()

  const columns: ColumnDef<LibraryMember, unknown>[] = [
    { accessorKey: 'memberCode', header: 'Mã thẻ', size: 120 },
    { accessorKey: 'fullName', header: 'Họ tên' },
    {
      accessorKey: 'memberType',
      header: 'Loại',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge role={val === 'student' ? 'student' : val === 'teacher' ? 'teacher' : 'staff'}>
            {memberTypeLabel[val] ?? val}
          </AppBadge>
        )
      },
    },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'currentBorrows', header: 'Đang mượn', size: 100 },
    {
      accessorKey: 'cardExpiry',
      header: 'Hạn thẻ',
      size: 120,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const semantic = val === 'active' ? 'success' : val === 'suspended' ? 'error' : 'warning'
        return <AppBadge semantic={semantic}>{statusLabel[val] ?? val}</AppBadge>
      },
    },
  ]

  const handleDelete = (row: LibraryMember) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa thành viên'),
      onError: () => toast.error('Không thể xóa'),
    })
  }

  const memberTypeOptions = [
    { value: '', label: 'Tất cả loại' },
    { value: 'student', label: 'Học sinh' },
    { value: 'teacher', label: 'Giáo viên' },
    { value: 'staff', label: 'Nhân viên' },
  ]

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'suspended', label: 'Tạm khóa' },
    { value: 'expired', label: 'Hết hạn' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AppSelect
          options={memberTypeOptions}
          value={filters.memberType}
          onChange={(v) => setFilters((p) => ({ ...p, memberType: v }))}
          placeholder="Loại thành viên"
          className="w-44"
        />
        <AppSelect
          options={statusOptions}
          value={filters.status}
          onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
          placeholder="Trạng thái"
          className="w-40"
        />
      </div>
      <CrudPage<LibraryMember>
        title="Quản lý bạn đọc"
        subtitle="Danh sách thành viên thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Bạn đọc' },
        ]}
        data={membersData?.data ?? []}
        columns={columns}
        loading={isLoading}
        onCreate={() => router.push('/library/members/new')}
        onEdit={(row) => router.push(`/library/members/${row.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm theo tên, mã thẻ..."
      />
    </div>
  )
}
