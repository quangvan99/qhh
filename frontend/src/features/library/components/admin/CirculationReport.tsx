'use client'

import { useState } from 'react'
import { useGetBorrows } from '@/features/library/api/library.api'
import type { BorrowRecord } from '@/features/library/types/library.types'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { StatGrid, ChartCard, DataTable } from '@/components/patterns'
import { AppBadge, AppInput } from '@/components/base'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Users, Clock, AlertTriangle } from 'lucide-react'

export function CirculationReport() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { data: borrowsData, isLoading } = useGetBorrows({ status: '' })
  const borrows = borrowsData?.data ?? []

  const totalBorrows = borrows.length
  const activeBorrows = borrows.filter((b: BorrowRecord) => b.status === 'borrowed').length
  const overdueBorrows = borrows.filter((b: BorrowRecord) => b.status === 'overdue').length
  const returnedBorrows = borrows.filter((b: BorrowRecord) => b.status === 'returned').length

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      name: `T${d.getMonth() + 1}`,
      value: borrows.filter((b: BorrowRecord) => {
        const bd = new Date(b.borrowedAt)
        return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear()
      }).length,
    }
  })

  const columns: ColumnDef<BorrowRecord, unknown>[] = [
    { accessorKey: 'memberName', header: 'Người mượn' },
    { accessorKey: 'bookTitle', header: 'Tài liệu' },
    { accessorKey: 'borrowedAt', header: 'Ngày mượn', cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN') },
    { accessorKey: 'dueDate', header: 'Hạn trả', cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN') },
    {
      accessorKey: 'status', header: 'Trạng thái',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const semantic = val === 'returned' ? 'success' : val === 'overdue' ? 'error' : 'info'
        const label = val === 'returned' ? 'Đã trả' : val === 'overdue' ? 'Quá hạn' : 'Đang mượn'
        return <AppBadge semantic={semantic}>{label}</AppBadge>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo lưu thông"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Lưu thông' },
        ]}
      />

      <div className="flex items-center gap-4">
        <AppInput label="Từ ngày" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-44" />
        <AppInput label="Đến ngày" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-44" />
      </div>

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng lượt mượn', value: totalBorrows, icon: <BookOpen className="h-5 w-5" />, module: 'library' },
          { title: 'Đang mượn', value: activeBorrows, icon: <Users className="h-5 w-5" />, module: 'library' },
          { title: 'Quá hạn', value: overdueBorrows, icon: <AlertTriangle className="h-5 w-5" />, module: 'library' },
          { title: 'Đã trả', value: returnedBorrows, icon: <Clock className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily" className="cursor-pointer">Theo tháng</TabsTrigger>
          <TabsTrigger value="detail" className="cursor-pointer">Chi tiết</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          <ChartCard
            title="Lượt mượn theo tháng"
            type="bar"
            data={monthlyData}
            dataKey="value"
            colors={['#7c3aed']}
          />
        </TabsContent>
        <TabsContent value="detail" className="mt-4">
          <DataTable<BorrowRecord>
            data={borrows}
            columns={columns}
            loading={isLoading}
            searchable
            searchPlaceholder="Tìm kiếm..."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
