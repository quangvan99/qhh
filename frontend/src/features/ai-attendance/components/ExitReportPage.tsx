'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { AppSelect, AppInput } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'

interface ExitReport {
  id: string
  date: string
  location: string
  totalExits: number
  peakHour: string
}

const mockData: ExitReport[] = [
  { id: '1', date: '2026-03-12', location: 'Cổng A', totalExits: 342, peakHour: '16:30 - 17:00' },
  { id: '2', date: '2026-03-12', location: 'Cổng B', totalExits: 189, peakHour: '16:45 - 17:15' },
  { id: '3', date: '2026-03-11', location: 'Cổng A', totalExits: 356, peakHour: '16:30 - 17:00' },
  { id: '4', date: '2026-03-11', location: 'Cổng B', totalExits: 201, peakHour: '17:00 - 17:30' },
  { id: '5', date: '2026-03-10', location: 'Cổng A', totalExits: 338, peakHour: '16:15 - 16:45' },
  { id: '6', date: '2026-03-10', location: 'Cổng B', totalExits: 175, peakHour: '16:30 - 17:00' },
  { id: '7', date: '2026-03-09', location: 'Cổng A', totalExits: 310, peakHour: '16:30 - 17:00' },
  { id: '8', date: '2026-03-09', location: 'Cổng B', totalExits: 168, peakHour: '17:00 - 17:30' },
  { id: '9', date: '2026-03-08', location: 'Cổng A', totalExits: 295, peakHour: '16:00 - 16:30' },
  { id: '10', date: '2026-03-08', location: 'Cổng B', totalExits: 152, peakHour: '16:30 - 17:00' },
]

export function ExitReportPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [location, setLocation] = useState('')

  const locationOptions = [
    { value: 'all', label: 'Tất cả địa điểm' },
    { value: 'Cổng A', label: 'Cổng A' },
    { value: 'Cổng B', label: 'Cổng B' },
  ]

  const filtered = mockData.filter(r => {
    if (location && location !== 'all' && r.location !== location) return false
    if (dateFrom && r.date < dateFrom) return false
    if (dateTo && r.date > dateTo) return false
    return true
  })

  const columns: ColumnDef<ExitReport, unknown>[] = [
    {
      accessorKey: 'date',
      header: 'Ngày',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString('vi-VN'),
    },
    { accessorKey: 'location', header: 'Địa điểm' },
    {
      accessorKey: 'totalExits',
      header: 'Tổng lượt ra',
      cell: ({ row }) => <span className="font-medium">{row.original.totalExits}</span>,
    },
    { accessorKey: 'peakHour', header: 'Giờ cao điểm' },
  ]

  return (
    <div>
      <PageHeader
        title="Báo cáo ra theo địa điểm"
        subtitle="Thống kê lượt ra theo camera và địa điểm"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Báo cáo', href: '/ai-attendance/reports' },
          { label: 'Lượt ra' },
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

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <AppInput
          type="date"
          label="Từ ngày"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[180px]"
        />
        <AppInput
          type="date"
          label="Đến ngày"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
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

      <DataTable<ExitReport>
        data={filtered}
        columns={columns}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
