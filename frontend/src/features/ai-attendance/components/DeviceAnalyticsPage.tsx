'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Cpu, Activity, CheckCircle } from 'lucide-react'
import { AppBadge } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable, StatGrid } from '@/components/patterns'
import { Button } from '@/components/ui/button'

interface DeviceAnalytics {
  id: string
  name: string
  location: string
  totalEvents: number
  accuracyRate: number
  uptimePercent: number
  primaryMethod: 'face' | 'card' | 'pin'
  status: 'online' | 'offline'
}

const mockDevices: DeviceAnalytics[] = [
  { id: 'dev-1', name: 'Máy ĐD Cổng A', location: 'Cổng A', totalEvents: 3456, accuracyRate: 97.1, uptimePercent: 99.2, primaryMethod: 'face', status: 'online' },
  { id: 'dev-2', name: 'Máy ĐD Cổng B', location: 'Cổng B', totalEvents: 2890, accuracyRate: 96.5, uptimePercent: 98.8, primaryMethod: 'face', status: 'online' },
  { id: 'dev-3', name: 'Máy ĐD Thư viện', location: 'Thư viện', totalEvents: 1234, accuracyRate: 95.2, uptimePercent: 97.5, primaryMethod: 'card', status: 'online' },
  { id: 'dev-4', name: 'Máy ĐD Phòng lab', location: 'Phòng lab', totalEvents: 890, accuracyRate: 93.8, uptimePercent: 89.3, primaryMethod: 'pin', status: 'offline' },
  { id: 'dev-5', name: 'Máy ĐD Văn phòng', location: 'Văn phòng', totalEvents: 2100, accuracyRate: 96.8, uptimePercent: 99.5, primaryMethod: 'face', status: 'online' },
  { id: 'dev-6', name: 'Máy ĐD Căn tin', location: 'Căn tin', totalEvents: 1678, accuracyRate: 94.5, uptimePercent: 98.1, primaryMethod: 'card', status: 'online' },
]

export function DeviceAnalyticsPage() {
  const totalEvents = mockDevices.reduce((s, d) => s + d.totalEvents, 0)
  const avgAccuracy = (mockDevices.reduce((s, d) => s + d.accuracyRate, 0) / mockDevices.length).toFixed(1)
  const avgUptime = (mockDevices.reduce((s, d) => s + d.uptimePercent, 0) / mockDevices.length).toFixed(1)

  const columns: ColumnDef<DeviceAnalytics, unknown>[] = [
    { accessorKey: 'name', header: 'Thiết bị' },
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
      accessorKey: 'primaryMethod',
      header: 'Phương thức chính',
      cell: ({ row }) => {
        const m = row.original.primaryMethod
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
        return <AppBadge semantic={s === 'online' ? 'success' : 'error'} size="sm">{s === 'online' ? 'Online' : 'Offline'}</AppBadge>
      },
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" /> Chi tiết
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Phân tích theo máy điểm danh"
        subtitle="Dữ liệu phân tích hiệu suất từng thiết bị điểm danh"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Phân tích', href: '/ai-attendance/analytics' },
          { label: 'Thiết bị' },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng thiết bị', value: mockDevices.length, module: 'ai', icon: <Cpu className="h-5 w-5" /> },
          { title: 'Tổng sự kiện', value: totalEvents.toLocaleString(), module: 'ai', icon: <Activity className="h-5 w-5" /> },
          { title: 'Accuracy TB', value: `${avgAccuracy}%`, module: 'ai', icon: <CheckCircle className="h-5 w-5" /> },
          { title: 'Uptime TB', value: `${avgUptime}%`, module: 'ai', icon: <Activity className="h-5 w-5" /> },
        ]}
        className="mb-6"
      />

      <DataTable<DeviceAnalytics>
        data={mockDevices}
        columns={columns}
        searchable
        searchPlaceholder="Tìm thiết bị..."
      />
    </div>
  )
}
