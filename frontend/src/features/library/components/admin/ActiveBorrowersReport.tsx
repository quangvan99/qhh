'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppBadge, AppSelect } from '@/components/base'
import { Users } from 'lucide-react'

interface ActiveBorrower {
  id: string
  memberName: string
  memberType: string
  bookTitle: string
  borrowedAt: string
  dueDate: string
  status: 'on_time' | 'near_due'
}

const memberTypeOptions = [
  { value: '', label: 'Tất cả nhóm' },
  { value: 'student', label: 'Học sinh' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'staff', label: 'Nhân viên' },
]

const statusFilterOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'on_time', label: 'Đúng hạn' },
  { value: 'near_due', label: 'Sắp hết hạn' },
]

const memberTypeLabel: Record<string, string> = {
  student: 'Học sinh',
  teacher: 'Giáo viên',
  staff: 'Nhân viên',
}

function generateMockData(): ActiveBorrower[] {
  const names = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em', 'Võ Văn Phúc', 'Đặng Thu Giang', 'Bùi Quang Hải', 'Ngô Thị Ích', 'Trương Văn Kiên', 'Lý Thị Lan', 'Mai Đức Mạnh', 'Phan Thị Ngọc', 'Dương Văn Ơn', 'Hà Thị Phương']
  const books = ['Toán cao cấp - Tập 1', 'Lập trình Python', 'Vật lý đại cương', 'Hóa học hữu cơ', 'Tiếng Anh giao tiếp', 'Lịch sử Việt Nam', 'Sinh học tế bào', 'Kinh tế vi mô', 'Triết học Marx', 'Ngữ văn 10', 'Địa lý tự nhiên', 'Tin học cơ bản', 'Giáo dục công dân', 'Thể dục thể thao', 'Âm nhạc cơ bản']
  const types = ['student', 'student', 'student', 'teacher', 'staff']
  return names.map((name, i) => ({
    id: `ab${i}`,
    memberName: name,
    memberType: types[i % types.length]!,
    bookTitle: books[i]!,
    borrowedAt: `2026-0${2 + Math.floor(i / 10)}-${String(1 + (i * 2) % 28).padStart(2, '0')}`,
    dueDate: `2026-03-${String(5 + (i * 2) % 25).padStart(2, '0')}`,
    status: i % 3 === 0 ? 'near_due' as const : 'on_time' as const,
  }))
}

export function ActiveBorrowersReport() {
  const [memberType, setMemberType] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const allData = useMemo(() => generateMockData(), [])

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (memberType && row.memberType !== memberType) return false
      if (statusFilter && row.status !== statusFilter) return false
      return true
    })
  }, [allData, memberType, statusFilter])

  const columns: ColumnDef<ActiveBorrower, unknown>[] = [
    { accessorKey: 'memberName', header: 'Bạn đọc' },
    {
      accessorKey: 'memberType',
      header: 'Nhóm',
      cell: ({ getValue }) => memberTypeLabel[getValue<string>()] ?? getValue<string>(),
    },
    { accessorKey: 'bookTitle', header: 'Sách đang mượn' },
    {
      accessorKey: 'borrowedAt',
      header: 'Ngày mượn',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'dueDate',
      header: 'Hạn trả',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={val === 'near_due' ? 'warning' : 'success'}>
            {val === 'near_due' ? 'Sắp hết hạn' : 'Đúng hạn'}
          </AppBadge>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo bạn đọc đang mượn"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Bạn đọc đang mượn' },
        ]}
        actions={[
          {
            label: `${filteredData.length} bạn đọc`,
            icon: <Users className="h-4 w-4" />,
            variant: 'outline' as const,
          },
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="w-48">
          <AppSelect options={memberTypeOptions} value={memberType} onChange={setMemberType} placeholder="Nhóm bạn đọc" />
        </div>
        <div className="w-48">
          <AppSelect options={statusFilterOptions} value={statusFilter} onChange={setStatusFilter} placeholder="Trạng thái" />
        </div>
      </div>

      <DataTable<ActiveBorrower>
        data={filteredData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm bạn đọc..."
      />
    </div>
  )
}
