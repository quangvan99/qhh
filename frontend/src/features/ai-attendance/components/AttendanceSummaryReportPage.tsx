'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { AppSelect, AppInput } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable, StatGrid } from '@/components/patterns'

interface SummaryReport {
  id: string
  date: string
  location: string
  totalIn: number
  totalOut: number
  difference: number
}

const mockData: SummaryReport[] = [
  { id: '1', date: '2026-03-12', location: 'Cổng A', totalIn: 356, totalOut: 342, difference: 14 },
  { id: '2', date: '2026-03-12', location: 'Cổng B', totalIn: 198, totalOut: 189, difference: 9 },
  { id: '3', date: '2026-03-11', location: 'Cổng A', totalIn: 362, totalOut: 356, difference: 6 },
  { id: '4', date: '2026-03-11', location: 'Cổng B', totalIn: 210, totalOut: 201, difference: 9 },
  { id: '5', date: '2026-03-10', location: 'Cổng A', totalIn: 345, totalOut: 338, difference: 7 },
  { id: '6', date: '2026-03-10', location: 'Cổng B', totalIn: 182, totalOut: 175, difference: 7 },
  { id: '7', date: '2026-03-09', location: 'Cổng A', totalIn: 320, totalOut: 310, difference: 10 },
  { id: '8', date: '2026-03-09', location: 'Cổng B', totalIn: 175, totalOut: 168, difference: 7 },
  { id: '9', date: '2026-03-08', location: 'Cổng A', totalIn: 302, totalOut: 295, difference: 7 },
  { id: '10', date: '2026-03-08', location: 'Cổng B', totalIn: 160, totalOut: 152, difference: 8 },
]

export function AttendanceSummaryReportPage() {
  const [period, setPeriod] = useState('week')
  const [location, setLocation] = useState('')

  const periodOptions = [
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
  ]

  const locationOptions = [
    { value: 'all', label: 'Tất cả địa điểm' },
    { value: 'Cổng A', label: 'Cổng A' },
    { value: 'Cổng B', label: 'Cổng B' },
  ]

  const filtered = mockData.filter(r => {
    if (location && location !== 'all' && r.location !== location) return false
    return true
  })

  const totalIn = filtered.reduce((s, r) => s + r.totalIn, 0)
  const totalOut = filtered.reduce((s, r) => s + r.totalOut, 0)
  const totalDiff = filtered.reduce((s, r) => s + r.difference, 0)

  const columns: ColumnDef<SummaryReport, unknown>[] = [
    {
      accessorKey: 'date',
      header: 'Ngày',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString('vi-VN'),
    },
    { accessorKey: 'location', header: 'Địa điểm' },
    {
      accessorKey: 'totalIn',
      header: 'Lượt vào',
      cell: ({ row }) => <span className="text-green-600 font-medium">{row.original.totalIn}</span>,
    },
    {
      accessorKey: 'totalOut',
      header: 'Lượt ra',
      cell: ({ row }) => <span className="text-blue-600 font-medium">{row.original.totalOut}</span>,
    },
    {
      accessorKey: 'difference',
      header: 'Chênh lệch',
      cell: ({ row }) => <span className="text-amber-600 font-medium">{row.original.difference}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Báo cáo tổng hợp vào/ra"
        subtitle="Thống kê tổng hợp lượt vào/ra theo địa điểm"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Báo cáo', href: '/ai-attendance/reports' },
          { label: 'Tổng hợp' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            icon: <Download className="h-4 w-4" />,
            variant: 'outline',
            onClick: () => toast.info('Tính năng xuất Excel đang phát triển'),
          },
        ]}
      />

      <StatGrid
        cols={3}
        stats={[
          { title: 'Tổng lượt vào', value: totalIn, module: 'ai', icon: null },
          { title: 'Tổng lượt ra', value: totalOut, module: 'ai', icon: null },
          { title: 'Chênh lệch', value: totalDiff, module: 'ai', icon: null },
        ]}
        className="mb-6"
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <AppSelect
          label="Kỳ"
          options={periodOptions}
          value={period}
          onChange={setPeriod}
          className="w-[180px]"
        />
        <AppSelect
          label="Địa điểm"
          options={locationOptions}
          value={location || 'all'}
          onChange={(v) => setLocation(v === 'all' ? '' : v)}
          className="w-[180px]"
        />
      </div>

      <DataTable<SummaryReport>
        data={filtered}
        columns={columns}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
