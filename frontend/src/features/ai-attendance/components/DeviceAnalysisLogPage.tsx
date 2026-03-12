'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AppBadge, AppSelect, AppInput } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'

interface DeviceLog {
  id: string
  timestamp: string
  device: string
  facesDetected: number
  facesRecognized: number
  avgConfidence: number
  method: 'face' | 'card' | 'pin'
  status: 'success' | 'partial' | 'error'
}

const mockLogs: DeviceLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `dlog-${i + 1}`,
  timestamp: new Date(2026, 2, 12, 7 + Math.floor(i / 3), (i * 11) % 60).toISOString(),
  device: (['Máy ĐD Cổng A', 'Máy ĐD Cổng B', 'Máy ĐD Thư viện', 'Máy ĐD Phòng lab'] as const)[i % 4] as string,
  facesDetected: Math.floor(Math.random() * 15) + 3,
  facesRecognized: Math.floor(Math.random() * 12) + 2,
  avgConfidence: Math.round((Math.random() * 12 + 85) * 10) / 10,
  method: (['face', 'card', 'pin'] as const)[i % 3] as 'face' | 'card' | 'pin',
  status: i % 8 === 0 ? 'error' : i % 5 === 0 ? 'partial' : 'success',
}))

export function DeviceAnalysisLogPage() {
  const [device, setDevice] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const deviceOptions = [
    { value: 'all', label: 'Tất cả thiết bị' },
    { value: 'Máy ĐD Cổng A', label: 'Máy ĐD Cổng A' },
    { value: 'Máy ĐD Cổng B', label: 'Máy ĐD Cổng B' },
    { value: 'Máy ĐD Thư viện', label: 'Máy ĐD Thư viện' },
    { value: 'Máy ĐD Phòng lab', label: 'Máy ĐD Phòng lab' },
  ]

  const filtered = mockLogs.filter(r => {
    if (device && device !== 'all' && r.device !== device) return false
    return true
  })

  const columns: ColumnDef<DeviceLog, unknown>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Thời gian',
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleString('vi-VN'),
    },
    { accessorKey: 'device', header: 'Thiết bị' },
    {
      accessorKey: 'facesDetected',
      header: 'Khuôn mặt phát hiện',
      cell: ({ row }) => <span className="font-medium">{row.original.facesDetected}</span>,
    },
    {
      accessorKey: 'facesRecognized',
      header: 'Nhận dạng được',
      cell: ({ row }) => <span className="text-green-600 font-medium">{row.original.facesRecognized}</span>,
    },
    {
      accessorKey: 'avgConfidence',
      header: 'Confidence TB',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.avgConfidence}%</span>,
    },
    {
      accessorKey: 'method',
      header: 'Phương thức',
      cell: ({ row }) => {
        const m = row.original.method
        const label = m === 'face' ? 'Khuôn mặt' : m === 'card' ? 'Thẻ' : 'PIN'
        const semantic = m === 'face' ? 'info' : m === 'card' ? 'success' : 'warning'
        return <AppBadge semantic={semantic} size="sm">{label}</AppBadge>
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = row.original.status
        const semantic = s === 'success' ? 'success' : s === 'partial' ? 'warning' : 'error'
        const label = s === 'success' ? 'Thành công' : s === 'partial' ? 'Một phần' : 'Lỗi'
        return <AppBadge semantic={semantic} size="sm">{label}</AppBadge>
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Nhật ký phân tích máy điểm danh"
        subtitle="Log phân tích từ thiết bị điểm danh IoT"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Nhật ký', href: '/ai-attendance/logs/cameras' },
          { label: 'Máy điểm danh' },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <AppSelect
          label="Thiết bị"
          options={deviceOptions}
          value={device || 'all'}
          onChange={(v) => setDevice(v === 'all' ? '' : v)}
          className="w-[200px]"
        />
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
      </div>

      <DataTable<DeviceLog>
        data={filtered}
        columns={columns}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
