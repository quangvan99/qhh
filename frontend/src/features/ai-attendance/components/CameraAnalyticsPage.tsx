'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Camera, Activity, CheckCircle } from 'lucide-react'
import { AppBadge } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable, StatGrid } from '@/components/patterns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CameraAnalytics {
  id: string
  name: string
  location: string
  totalEvents: number
  accuracyRate: number
  uptimePercent: number
  status: 'online' | 'offline'
}

const mockCameras: CameraAnalytics[] = [
  { id: 'cam-1', name: 'Cổng chính', location: 'Cổng A', totalEvents: 4523, accuracyRate: 96.2, uptimePercent: 99.5, status: 'online' },
  { id: 'cam-2', name: 'Sân trường A', location: 'Khu A', totalEvents: 3201, accuracyRate: 94.8, uptimePercent: 98.2, status: 'online' },
  { id: 'cam-3', name: 'Hành lang B', location: 'Khu B', totalEvents: 1890, accuracyRate: 92.1, uptimePercent: 97.8, status: 'online' },
  { id: 'cam-4', name: 'Thư viện', location: 'Tòa C', totalEvents: 2567, accuracyRate: 95.5, uptimePercent: 99.1, status: 'online' },
  { id: 'cam-5', name: 'Phòng lab', location: 'Tòa D', totalEvents: 890, accuracyRate: 89.3, uptimePercent: 85.6, status: 'offline' },
  { id: 'cam-6', name: 'Cổng phụ', location: 'Cổng B', totalEvents: 1456, accuracyRate: 93.7, uptimePercent: 98.9, status: 'online' },
  { id: 'cam-7', name: 'Sân bóng', location: 'Ngoài trời', totalEvents: 678, accuracyRate: 88.5, uptimePercent: 96.3, status: 'online' },
  { id: 'cam-8', name: 'Căn tin', location: 'Khu A', totalEvents: 3102, accuracyRate: 94.1, uptimePercent: 99.0, status: 'online' },
]

export function CameraAnalyticsPage() {
  const totalEvents = mockCameras.reduce((s, c) => s + c.totalEvents, 0)
  const avgAccuracy = (mockCameras.reduce((s, c) => s + c.accuracyRate, 0) / mockCameras.length).toFixed(1)
  const avgUptime = (mockCameras.reduce((s, c) => s + c.uptimePercent, 0) / mockCameras.length).toFixed(1)

  const columns: ColumnDef<CameraAnalytics, unknown>[] = [
    { accessorKey: 'name', header: 'Camera' },
    { accessorKey: 'location', header: 'Vị trí' },
    {
      accessorKey: 'totalEvents',
      header: 'Tổng sự kiện',
      cell: ({ row }) => <span className="font-medium">{row.original.totalEvents.toLocaleString()}</span>,
    },
    {
      accessorKey: 'accuracyRate',
      header: 'Accuracy',
      cell: ({ row }) => {
        const rate = row.original.accuracyRate
        return <span className={`font-mono ${rate >= 95 ? 'text-green-600' : rate >= 90 ? 'text-amber-600' : 'text-red-600'}`}>{rate}%</span>
      },
    },
    {
      accessorKey: 'uptimePercent',
      header: 'Uptime',
      cell: ({ row }) => <span className="font-mono">{row.original.uptimePercent}%</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = row.original.status
        return <AppBadge semantic={s === 'online' ? 'success' : 'error'} size="sm">{s === 'online' ? 'Online' : 'Offline'}</AppBadge>
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link href={`/ai-attendance/analytics/cameras/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Chi tiết
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Phân tích theo camera"
        subtitle="Dữ liệu phân tích hiệu suất từng camera"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Phân tích', href: '/ai-attendance/analytics' },
          { label: 'Camera' },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng camera', value: mockCameras.length, module: 'ai', icon: <Camera className="h-5 w-5" /> },
          { title: 'Tổng sự kiện', value: totalEvents.toLocaleString(), module: 'ai', icon: <Activity className="h-5 w-5" /> },
          { title: 'Accuracy TB', value: `${avgAccuracy}%`, module: 'ai', icon: <CheckCircle className="h-5 w-5" /> },
          { title: 'Uptime TB', value: `${avgUptime}%`, module: 'ai', icon: <Activity className="h-5 w-5" /> },
        ]}
        className="mb-6"
      />

      <DataTable<CameraAnalytics>
        data={mockCameras}
        columns={columns}
        searchable
        searchPlaceholder="Tìm camera..."
      />
    </div>
  )
}
