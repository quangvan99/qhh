'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Activity, Gauge, Clock, Server } from 'lucide-react'
import { AppBadge } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable, StatGrid } from '@/components/patterns'

interface PipelineCamera {
  id: string
  name: string
  status: 'running' | 'idle' | 'error'
  fps: number
  latency: number
  facesDetectedToday: number
}

const mockCameras: PipelineCamera[] = [
  { id: 'cam-1', name: 'Cổng chính', status: 'running', fps: 15, latency: 42, facesDetectedToday: 234 },
  { id: 'cam-2', name: 'Sân trường A', status: 'running', fps: 14, latency: 55, facesDetectedToday: 189 },
  { id: 'cam-3', name: 'Hành lang B', status: 'idle', fps: 0, latency: 0, facesDetectedToday: 78 },
  { id: 'cam-4', name: 'Thư viện', status: 'running', fps: 13, latency: 48, facesDetectedToday: 156 },
  { id: 'cam-5', name: 'Phòng lab', status: 'error', fps: 0, latency: 0, facesDetectedToday: 12 },
  { id: 'cam-6', name: 'Cổng phụ', status: 'running', fps: 15, latency: 39, facesDetectedToday: 98 },
  { id: 'cam-7', name: 'Sân bóng', status: 'idle', fps: 0, latency: 0, facesDetectedToday: 45 },
  { id: 'cam-8', name: 'Căn tin', status: 'running', fps: 12, latency: 62, facesDetectedToday: 201 },
]

export function PipelineStatusPage() {
  const runningCount = mockCameras.filter(c => c.status === 'running').length
  const avgFps = Math.round(mockCameras.filter(c => c.status === 'running').reduce((s, c) => s + c.fps, 0) / (runningCount || 1))
  const avgLatency = Math.round(mockCameras.filter(c => c.status === 'running').reduce((s, c) => s + c.latency, 0) / (runningCount || 1))

  const columns: ColumnDef<PipelineCamera, unknown>[] = [
    { accessorKey: 'name', header: 'Camera' },
    {
      accessorKey: 'status',
      header: 'Trạng thái Pipeline',
      cell: ({ row }) => {
        const s = row.original.status
        const semantic = s === 'running' ? 'success' : s === 'idle' ? 'warning' : 'error'
        const label = s === 'running' ? 'Đang chạy' : s === 'idle' ? 'Chờ' : 'Lỗi'
        return <AppBadge semantic={semantic} size="sm">{label}</AppBadge>
      },
    },
    {
      accessorKey: 'fps',
      header: 'FPS hiện tại',
      cell: ({ row }) => <span className="font-mono">{row.original.fps}</span>,
    },
    {
      accessorKey: 'latency',
      header: 'Latency (ms)',
      cell: ({ row }) => {
        const l = row.original.latency
        return <span className={`font-mono ${l > 50 ? 'text-amber-600' : 'text-green-600'}`}>{l || '—'}</span>
      },
    },
    {
      accessorKey: 'facesDetectedToday',
      header: 'Khuôn mặt nhận dạng hôm nay',
      cell: ({ row }) => <span className="font-medium">{row.original.facesDetectedToday}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Pipeline AI - Trạng thái xử lý"
        subtitle="Dashboard realtime trạng thái xử lý nhận dạng khuôn mặt"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Pipeline' },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: 'Queue Size', value: 12, module: 'ai', icon: <Server className="h-5 w-5" /> },
          { title: 'FPS Trung bình', value: avgFps, module: 'ai', icon: <Gauge className="h-5 w-5" /> },
          { title: 'Latency TB', value: `${avgLatency}ms`, module: 'ai', icon: <Clock className="h-5 w-5" /> },
          { title: 'Uptime', value: '99.7%', module: 'ai', icon: <Activity className="h-5 w-5" /> },
        ]}
        className="mb-6"
      />

      <DataTable<PipelineCamera>
        data={mockCameras}
        columns={columns}
        searchable
        searchPlaceholder="Tìm camera..."
      />
    </div>
  )
}
