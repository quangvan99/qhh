'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Target, Activity, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/composite'
import { DataTable, StatGrid } from '@/components/patterns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface HourlyEvent {
  hour: string
  detected: number
  recognized: number
  avgConfidence: number
}

interface DayOfWeekStat {
  day: string
  totalEvents: number
  avgAccuracy: number
}

const mockCamera = { id: 'cam-1', name: 'Cổng chính', location: 'Cổng A', model: 'Hikvision DS-2CD' }

const mockHourly: HourlyEvent[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  detected: i >= 6 && i <= 18 ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 5),
  recognized: i >= 6 && i <= 18 ? Math.floor(Math.random() * 25) + 8 : Math.floor(Math.random() * 4),
  avgConfidence: Math.round((Math.random() * 10 + 88) * 10) / 10,
}))

const mockDayOfWeek: DayOfWeekStat[] = [
  { day: 'Thứ Hai', totalEvents: 456, avgAccuracy: 95.2 },
  { day: 'Thứ Ba', totalEvents: 423, avgAccuracy: 94.8 },
  { day: 'Thứ Tư', totalEvents: 478, avgAccuracy: 96.1 },
  { day: 'Thứ Năm', totalEvents: 445, avgAccuracy: 95.5 },
  { day: 'Thứ Sáu', totalEvents: 512, avgAccuracy: 94.3 },
  { day: 'Thứ Bảy', totalEvents: 198, avgAccuracy: 93.7 },
  { day: 'Chủ Nhật', totalEvents: 87, avgAccuracy: 92.1 },
]

interface CameraAnalyticsDetailPageProps {
  cameraId: string
}

export function CameraAnalyticsDetailPage({ cameraId: _cameraId }: CameraAnalyticsDetailPageProps) {
  const totalDetected = mockHourly.reduce((s, h) => s + h.detected, 0)
  const totalRecognized = mockHourly.reduce((s, h) => s + h.recognized, 0)
  const overallAccuracy = totalDetected > 0 ? ((totalRecognized / totalDetected) * 100).toFixed(1) : '0'
  const avgConfidence = (mockHourly.reduce((s, h) => s + h.avgConfidence, 0) / mockHourly.length).toFixed(1)

  const hourlyColumns: ColumnDef<HourlyEvent, unknown>[] = [
    { accessorKey: 'hour', header: 'Giờ' },
    {
      accessorKey: 'detected',
      header: 'Phát hiện',
      cell: ({ row }) => <span className="font-medium">{row.original.detected}</span>,
    },
    {
      accessorKey: 'recognized',
      header: 'Nhận dạng',
      cell: ({ row }) => <span className="text-green-600 font-medium">{row.original.recognized}</span>,
    },
    {
      accessorKey: 'avgConfidence',
      header: 'Confidence TB',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.avgConfidence}%</span>,
    },
  ]

  const dayColumns: ColumnDef<DayOfWeekStat, unknown>[] = [
    { accessorKey: 'day', header: 'Ngày' },
    {
      accessorKey: 'totalEvents',
      header: 'Tổng sự kiện',
      cell: ({ row }) => <span className="font-medium">{row.original.totalEvents}</span>,
    },
    {
      accessorKey: 'avgAccuracy',
      header: 'Accuracy TB',
      cell: ({ row }) => <span className="font-mono">{row.original.avgAccuracy}%</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title={`Phân tích — ${mockCamera.name}`}
        subtitle={`${mockCamera.model} • ${mockCamera.location}`}
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Phân tích', href: '/ai-attendance/analytics' },
          { label: 'Camera', href: '/ai-attendance/analytics/cameras' },
          { label: mockCamera.name },
        ]}
      />

      <StatGrid
        cols={3}
        stats={[
          { title: 'Accuracy', value: `${overallAccuracy}%`, module: 'ai', icon: <Target className="h-5 w-5" /> },
          { title: 'Tổng sự kiện', value: totalDetected, module: 'ai', icon: <Activity className="h-5 w-5" /> },
          { title: 'Confidence TB', value: `${avgConfidence}%`, module: 'ai', icon: <BarChart3 className="h-5 w-5" /> },
        ]}
        className="mb-6"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện theo giờ (hôm nay)</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable<HourlyEvent>
              data={mockHourly}
              columns={hourlyColumns}
              pageSize={24}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo ngày trong tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable<DayOfWeekStat>
              data={mockDayOfWeek}
              columns={dayColumns}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
