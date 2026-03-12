'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AppBadge, AppSelect, AppInput } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'

interface CameraLog {
  id: string
  timestamp: string
  camera: string
  facesDetected: number
  facesRecognized: number
  avgConfidence: number
  status: 'success' | 'partial' | 'error'
}

const mockLogs: CameraLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `log-${i + 1}`,
  timestamp: new Date(2026, 2, 12, 7 + Math.floor(i / 3), (i * 7) % 60).toISOString(),
  camera: (['Cổng chính', 'Sân trường A', 'Hành lang B', 'Thư viện', 'Căn tin'] as const)[i % 5] as string,
  facesDetected: Math.floor(Math.random() * 20) + 5,
  facesRecognized: Math.floor(Math.random() * 15) + 3,
  avgConfidence: Math.round((Math.random() * 15 + 82) * 10) / 10,
  status: i % 7 === 0 ? 'error' : i % 4 === 0 ? 'partial' : 'success',
}))

export function CameraAnalysisLogPage() {
  const [camera, setCamera] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const cameraOptions = [
    { value: 'all', label: 'Tất cả camera' },
    { value: 'Cổng chính', label: 'Cổng chính' },
    { value: 'Sân trường A', label: 'Sân trường A' },
    { value: 'Hành lang B', label: 'Hành lang B' },
    { value: 'Thư viện', label: 'Thư viện' },
    { value: 'Căn tin', label: 'Căn tin' },
  ]

  const filtered = mockLogs.filter(r => {
    if (camera && camera !== 'all' && r.camera !== camera) return false
    return true
  })

  const columns: ColumnDef<CameraLog, unknown>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Thời gian',
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleString('vi-VN'),
    },
    { accessorKey: 'camera', header: 'Camera' },
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
        title="Nhật ký phân tích camera"
        subtitle="Log phân tích nhận dạng khuôn mặt từ camera"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Nhật ký', href: '/ai-attendance/logs/cameras' },
          { label: 'Camera' },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <AppSelect
          label="Camera"
          options={cameraOptions}
          value={camera || 'all'}
          onChange={(v) => setCamera(v === 'all' ? '' : v)}
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

      <DataTable<CameraLog>
        data={filtered}
        columns={columns}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
