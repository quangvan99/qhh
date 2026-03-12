'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppBadge, AppInput } from '@/components/base'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Download } from 'lucide-react'

interface BorrowHistoryRow {
  id: string
  borrowedAt: string
  returnedAt: string
  memberName: string
  bookTitle: string
  returnStatus: 'on_time' | 'overdue'
  fineAmount: number
}

function generateMockData(): BorrowHistoryRow[] {
  const members = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em', 'Võ Văn Phúc', 'Đặng Thu Giang', 'Bùi Quang Hải', 'Ngô Thị Ích', 'Trương Văn Kiên']
  const books = ['Toán cao cấp', 'Lập trình Python', 'Vật lý đại cương', 'Hóa học hữu cơ', 'Tiếng Anh giao tiếp', 'Lịch sử Việt Nam', 'Sinh học tế bào', 'Kinh tế vi mô', 'Triết học Marx', 'Ngữ văn 10', 'Địa lý tự nhiên', 'Tin học cơ bản', 'Giáo dục công dân', 'Thể dục thể thao', 'Âm nhạc cơ bản', 'Mỹ thuật', 'Công nghệ thông tin', 'Quản trị kinh doanh', 'Luật học', 'Xã hội học']
  return Array.from({ length: 20 }, (_, i) => {
    const isOverdue = i % 4 === 0
    const borrowDay = 1 + (i * 3) % 28
    const returnDay = Math.min(28, borrowDay + 14 + (isOverdue ? 5 : 0))
    return {
      id: `bh${i}`,
      borrowedAt: `2026-0${1 + Math.floor(i / 10)}-${String(borrowDay).padStart(2, '0')}`,
      returnedAt: `2026-0${1 + Math.floor(i / 10)}-${String(returnDay).padStart(2, '0')}`,
      memberName: members[i % members.length]!,
      bookTitle: books[i]!,
      returnStatus: isOverdue ? 'overdue' as const : 'on_time' as const,
      fineAmount: isOverdue ? (i + 1) * 2000 : 0,
    }
  })
}

export function BorrowHistoryReport() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const allData = useMemo(() => generateMockData(), [])

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (dateFrom && row.borrowedAt < dateFrom) return false
      if (dateTo && row.borrowedAt > dateTo) return false
      if (memberSearch && !row.memberName.toLowerCase().includes(memberSearch.toLowerCase())) return false
      if (bookSearch && !row.bookTitle.toLowerCase().includes(bookSearch.toLowerCase())) return false
      return true
    })
  }, [allData, dateFrom, dateTo, memberSearch, bookSearch])

  const handleExportExcel = () => {
    toast.success('Đang xuất file Excel...')
  }

  const columns: ColumnDef<BorrowHistoryRow, unknown>[] = [
    {
      accessorKey: 'borrowedAt',
      header: 'Ngày mượn',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'returnedAt',
      header: 'Ngày trả',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    { accessorKey: 'memberName', header: 'Bạn đọc' },
    { accessorKey: 'bookTitle', header: 'Sách' },
    {
      accessorKey: 'returnStatus',
      header: 'Tình trạng trả',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={val === 'overdue' ? 'error' : 'success'}>
            {val === 'overdue' ? 'Quá hạn' : 'Đúng hạn'}
          </AppBadge>
        )
      },
    },
    {
      accessorKey: 'fineAmount',
      header: 'Tiền phạt',
      cell: ({ getValue }) => {
        const val = getValue<number>()
        return val > 0 ? `${val.toLocaleString('vi-VN')}đ` : '—'
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo lịch sử mượn trả"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Lịch sử mượn trả' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            icon: <Download className="h-4 w-4" />,
            onClick: handleExportExcel,
          },
        ]}
      />

      <div className="flex flex-wrap items-end gap-4">
        <AppInput label="Từ ngày" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-44" />
        <AppInput label="Đến ngày" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-44" />
        <AppInput label="Bạn đọc" placeholder="Tìm bạn đọc..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="w-48" />
        <AppInput label="Sách" placeholder="Tìm sách..." value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} className="w-48" />
      </div>

      <DataTable<BorrowHistoryRow>
        data={filteredData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
