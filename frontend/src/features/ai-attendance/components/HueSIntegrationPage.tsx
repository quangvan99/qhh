'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { RefreshCw, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { AppBadge, AppInput, AppSelect } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface SyncHistory {
  id: string
  timestamp: string
  records: number
  status: 'success' | 'error' | 'partial'
}

const mockSyncHistory: SyncHistory[] = [
  { id: 's1', timestamp: '2026-03-12T08:30:00', records: 156, status: 'success' },
  { id: 's2', timestamp: '2026-03-12T08:15:00', records: 142, status: 'success' },
  { id: 's3', timestamp: '2026-03-12T08:00:00', records: 38, status: 'partial' },
  { id: 's4', timestamp: '2026-03-12T07:45:00', records: 0, status: 'error' },
  { id: 's5', timestamp: '2026-03-12T07:30:00', records: 128, status: 'success' },
]

export function HueSIntegrationPage() {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.hues.vn/v1/attendance')
  const [apiKey, setApiKey] = useState('sk-hues-****-****-****')
  const [syncFrequency, setSyncFrequency] = useState('15')
  const [autoSync, setAutoSync] = useState(true)
  const [connectionStatus] = useState<'online' | 'offline'>('online')

  const frequencyOptions = [
    { value: '5', label: 'Mỗi 5 phút' },
    { value: '15', label: 'Mỗi 15 phút' },
    { value: '60', label: 'Mỗi 1 giờ' },
  ]

  const handleTestConnection = () => {
    toast.success('Kết nối Hue-S thành công!')
  }

  const handleSyncNow = () => {
    toast.success('Đã bắt đầu đồng bộ dữ liệu với Hue-S')
  }

  const historyColumns: ColumnDef<SyncHistory, unknown>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Thời gian',
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleString('vi-VN'),
    },
    {
      accessorKey: 'records',
      header: 'Số bản ghi',
      cell: ({ row }) => <span className="font-medium">{row.original.records}</span>,
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
        title="Cấu hình chia sẻ dữ liệu Hue-S"
        subtitle="Quản lý kết nối và đồng bộ dữ liệu điểm danh với hệ thống Hue-S"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Hue-S Sync' },
        ]}
      />

      <div className="space-y-6">
        {/* Connection status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              Trạng thái kết nối
              <AppBadge semantic={connectionStatus === 'online' ? 'success' : 'error'} size="sm">
                {connectionStatus === 'online' ? 'Đã kết nối' : 'Mất kết nối'}
              </AppBadge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Configuration form */}
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình kết nối</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <AppInput
                label="API Endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <AppInput
                label="API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <AppSelect
                label="Tần suất đồng bộ"
                options={frequencyOptions}
                value={syncFrequency}
                onChange={setSyncFrequency}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={autoSync} onCheckedChange={(v) => setAutoSync(!!v)} />
              <Label>Tự động đồng bộ</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleTestConnection}>
                <Zap className="h-4 w-4 mr-2" />
                Test kết nối
              </Button>
              <Button onClick={handleSyncNow}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Đồng bộ ngay
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync history */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử đồng bộ gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable<SyncHistory>
              data={mockSyncHistory}
              columns={historyColumns}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
