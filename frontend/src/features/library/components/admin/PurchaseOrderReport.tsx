'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { StatGrid, DataTable } from '@/components/patterns'
import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface MonthlyReport {
  month: string
  total: number
  approved: number
  rejected: number
  pending: number
  totalAmount: number
}

const mockMonthly: MonthlyReport[] = [
  { month: 'Tháng 1/2026', total: 15, approved: 10, rejected: 3, pending: 2, totalAmount: 22500000 },
  { month: 'Tháng 2/2026', total: 12, approved: 8, rejected: 2, pending: 2, totalAmount: 18000000 },
  { month: 'Tháng 3/2026', total: 10, approved: 5, rejected: 1, pending: 4, totalAmount: 15000000 },
]

const columns: ColumnDef<MonthlyReport, unknown>[] = [
  { accessorKey: 'month', header: 'Tháng' },
  { accessorKey: 'total', header: 'Tổng đề xuất', size: 120 },
  { accessorKey: 'approved', header: 'Đã duyệt', size: 100 },
  { accessorKey: 'rejected', header: 'Từ chối', size: 100 },
  { accessorKey: 'pending', header: 'Chờ duyệt', size: 100 },
  {
    accessorKey: 'totalAmount',
    header: 'Tổng giá trị',
    size: 150,
    cell: ({ getValue }) => `${getValue<number>().toLocaleString('vi-VN')} ₫`,
  },
]

const totalAll = mockMonthly.reduce((s, m) => s + m.total, 0)
const approvedAll = mockMonthly.reduce((s, m) => s + m.approved, 0)
const rejectedAll = mockMonthly.reduce((s, m) => s + m.rejected, 0)
const pendingAll = mockMonthly.reduce((s, m) => s + m.pending, 0)

export function PurchaseOrderReport() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo duyệt mua"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Đơn đặt mua', href: '/library/orders' },
          { label: 'Báo cáo' },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng đề xuất', value: totalAll, icon: <FileText className="h-5 w-5" />, module: 'library' },
          { title: 'Đã duyệt', value: approvedAll, icon: <CheckCircle2 className="h-5 w-5" />, module: 'library' },
          { title: 'Từ chối', value: rejectedAll, icon: <XCircle className="h-5 w-5" />, module: 'library' },
          { title: 'Chờ duyệt', value: pendingAll, icon: <Clock className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <DataTable<MonthlyReport>
        data={mockMonthly}
        columns={columns}
        loading={false}
      />
    </div>
  )
}
