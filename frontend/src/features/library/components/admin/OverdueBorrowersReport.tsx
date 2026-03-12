'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { StatGrid, DataTable } from '@/components/patterns'
import { AppBadge, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AlertTriangle, DollarSign, Send } from 'lucide-react'

interface OverdueBorrower {
  id: string
  memberName: string
  memberType: string
  bookTitle: string
  borrowedAt: string
  overdueDays: number
  fineAmount: number
}

const memberTypeOptions = [
  { value: '', label: 'Tất cả nhóm' },
  { value: 'student', label: 'Học sinh' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'staff', label: 'Nhân viên' },
]

const overdueDaysOptions = [
  { value: '', label: 'Tất cả' },
  { value: '7', label: '> 7 ngày' },
  { value: '14', label: '> 14 ngày' },
  { value: '30', label: '> 30 ngày' },
]

const memberTypeLabel: Record<string, string> = {
  student: 'Học sinh',
  teacher: 'Giáo viên',
  staff: 'Nhân viên',
}

function generateMockData(): OverdueBorrower[] {
  const names = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em', 'Võ Văn Phúc', 'Đặng Thu Giang', 'Bùi Quang Hải', 'Ngô Thị Ích', 'Trương Văn Kiên', 'Lý Thị Lan', 'Mai Đức Mạnh']
  const books = ['Toán cao cấp', 'Lập trình Python', 'Vật lý đại cương', 'Hóa học hữu cơ', 'Tiếng Anh giao tiếp', 'Lịch sử Việt Nam', 'Sinh học tế bào', 'Kinh tế vi mô', 'Triết học Marx', 'Ngữ văn 10', 'Địa lý tự nhiên', 'Tin học cơ bản']
  const types = ['student', 'student', 'student', 'teacher', 'staff']
  return names.map((name, i) => {
    const days = 3 + i * 4
    return {
      id: `ob${i}`,
      memberName: name,
      memberType: types[i % types.length]!,
      bookTitle: books[i]!,
      borrowedAt: `2026-0${1 + Math.floor(i / 8)}-${String(1 + (i * 3) % 28).padStart(2, '0')}`,
      overdueDays: days,
      fineAmount: days * 2000,
    }
  })
}

export function OverdueBorrowersReport() {
  const [memberType, setMemberType] = useState('')
  const [overdueDaysFilter, setOverdueDaysFilter] = useState('')
  const allData = useMemo(() => generateMockData(), [])

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (memberType && row.memberType !== memberType) return false
      if (overdueDaysFilter && row.overdueDays <= parseInt(overdueDaysFilter)) return false
      return true
    })
  }, [allData, memberType, overdueDaysFilter])

  const totalOverdue = filteredData.length
  const totalEstimatedFine = filteredData.reduce((s, r) => s + r.fineAmount, 0)

  const handleSendNotification = () => {
    toast.success(`Đã gửi thông báo nhắc nhở đến ${filteredData.length} bạn đọc quá hạn`)
  }

  const columns: ColumnDef<OverdueBorrower, unknown>[] = [
    { accessorKey: 'memberName', header: 'Bạn đọc' },
    {
      accessorKey: 'memberType',
      header: 'Nhóm',
      cell: ({ getValue }) => memberTypeLabel[getValue<string>()] ?? getValue<string>(),
    },
    { accessorKey: 'bookTitle', header: 'Sách' },
    {
      accessorKey: 'borrowedAt',
      header: 'Ngày mượn',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'overdueDays',
      header: 'Số ngày quá hạn',
      cell: ({ getValue }) => {
        const days = getValue<number>()
        const semantic = days > 30 ? 'error' : days > 14 ? 'warning' : 'info'
        return <AppBadge semantic={semantic}>{days} ngày</AppBadge>
      },
    },
    {
      accessorKey: 'fineAmount',
      header: 'Tiền phạt',
      cell: ({ getValue }) => `${getValue<number>().toLocaleString('vi-VN')}đ`,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo bạn đọc quá hạn"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Bạn đọc quá hạn' },
        ]}
        actions={[
          {
            label: 'Gửi thông báo',
            icon: <Send className="h-4 w-4" />,
            onClick: handleSendNotification,
          },
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="w-48">
          <AppSelect options={memberTypeOptions} value={memberType} onChange={setMemberType} placeholder="Nhóm bạn đọc" />
        </div>
        <div className="w-48">
          <AppSelect options={overdueDaysOptions} value={overdueDaysFilter} onChange={setOverdueDaysFilter} placeholder="Số ngày quá hạn" />
        </div>
      </div>

      <StatGrid
        cols={2}
        stats={[
          { title: 'Tổng quá hạn', value: totalOverdue, icon: <AlertTriangle className="h-5 w-5" />, module: 'library' },
          { title: 'Tổng tiền phạt ước tính', value: `${totalEstimatedFine.toLocaleString('vi-VN')}đ`, icon: <DollarSign className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <DataTable<OverdueBorrower>
        data={filteredData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm bạn đọc..."
      />
    </div>
  )
}
