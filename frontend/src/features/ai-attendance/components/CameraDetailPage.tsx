'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { AppBadge, AppInput, AppSelect } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

const mockCamera = {
  id: 'cam-1',
  name: 'Cổng chính',
  ip: '192.168.1.100',
  location: 'Cổng A',
  status: 'online' as const,
  model: 'Hikvision DS-2CD',
  firmware: 'v5.7.12',
  fps: 15,
  resolution: '1080p',
  lastSeen: '2026-03-12T08:30:00',
  installedAt: '2025-06-15',
}

interface ConnectionLog {
  id: string
  timestamp: string
  event: 'connected' | 'disconnected' | 'error'
  duration: string
  details: string
}

const mockLogs: ConnectionLog[] = Array.from({ length: 10 }, (_, i) => ({
  id: `log-${i + 1}`,
  timestamp: new Date(2026, 2, 12, 8 - i, Math.floor(Math.random() * 60)).toISOString(),
  event: i % 3 === 0 ? 'disconnected' : i % 5 === 0 ? 'error' : 'connected',
  duration: i % 3 === 0 ? '—' : `${Math.floor(Math.random() * 120) + 10} phút`,
  details: i % 3 === 0 ? 'Mất kết nối mạng' : i % 5 === 0 ? 'Timeout kết nối' : 'Kết nối ổn định',
}))

interface CameraDetailPageProps {
  cameraId: string
}

export function CameraDetailPage({ cameraId: _cameraId }: CameraDetailPageProps) {
  const camera = mockCamera
  const [resolution, setResolution] = useState(camera.resolution)
  const [fps, setFps] = useState(String(camera.fps))

  const logColumns: ColumnDef<ConnectionLog, unknown>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Thời gian',
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleString('vi-VN'),
    },
    {
      accessorKey: 'event',
      header: 'Sự kiện',
      cell: ({ row }) => {
        const e = row.original.event
        const semantic = e === 'connected' ? 'success' : e === 'disconnected' ? 'warning' : 'error'
        const label = e === 'connected' ? 'Kết nối' : e === 'disconnected' ? 'Ngắt kết nối' : 'Lỗi'
        return <AppBadge semantic={semantic} size="sm">{label}</AppBadge>
      },
    },
    { accessorKey: 'duration', header: 'Thời lượng' },
    { accessorKey: 'details', header: 'Chi tiết' },
  ]

  const handleSaveSettings = () => {
    toast.success('Đã lưu cài đặt camera')
  }

  return (
    <div>
      <PageHeader
        title={camera.name}
        subtitle={`Camera ${camera.model} — ${camera.ip}`}
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Camera', href: '/ai-attendance/cameras' },
          { label: 'Chi tiết' },
        ]}
      />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="history">Lịch sử hoạt động</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin camera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên</span>
                    <span className="font-medium">{camera.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Địa chỉ IP</span>
                    <span className="font-mono text-sm">{camera.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vị trí</span>
                    <span className="font-medium">{camera.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <AppBadge semantic={camera.status === 'online' ? 'success' : 'error'} size="sm">
                      {camera.status === 'online' ? 'Trực tuyến' : 'Ngoại tuyến'}
                    </AppBadge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">{camera.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Firmware</span>
                    <span className="font-mono text-sm">{camera.firmware}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FPS</span>
                    <span className="font-medium">{camera.fps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Độ phân giải</span>
                    <span className="font-medium">{camera.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày lắp đặt</span>
                    <span>{new Date(camera.installedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lần cuối hoạt động</span>
                    <span>{new Date(camera.lastSeen).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <DataTable<ConnectionLog>
            data={mockLogs}
            columns={logColumns}
            searchable
            searchPlaceholder="Tìm kiếm..."
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt camera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Độ phân giải</Label>
                <AppSelect
                  options={[
                    { value: '720p', label: '720p (HD)' },
                    { value: '1080p', label: '1080p (Full HD)' },
                    { value: '1440p', label: '1440p (2K)' },
                    { value: '2160p', label: '2160p (4K)' },
                  ]}
                  value={resolution}
                  onChange={setResolution}
                />
              </div>
              <div className="space-y-2">
                <AppInput
                  label="FPS"
                  type="number"
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveSettings}>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
