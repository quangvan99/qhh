'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AppBadge } from '@/components/base/app-badge'
import { AppSelect } from '@/components/base/app-select'
import { PageHeader } from '@/components/composite/page-header'
import { toast } from 'sonner'
import { RefreshCw, Database, AlertCircle, Clock, Play } from 'lucide-react'

const syncTypeOptions = [
  { value: 'all', label: 'Toàn bộ' },
  { value: 'students', label: 'Chỉ học sinh' },
  { value: 'classes', label: 'Chỉ lớp học' },
  { value: 'scores', label: 'Chỉ điểm số' },
]

const scheduleOptions = [
  { value: 'off', label: 'Tắt' },
  { value: '6h', label: 'Mỗi ngày lúc 6:00' },
  { value: '12h', label: 'Mỗi ngày lúc 12:00' },
]

export function SyncTriggerPage() {
  const [syncType, setSyncType] = useState('all')
  const [schedule, setSchedule] = useState('6h')
  const [syncing, setSyncing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSync = () => {
    setSyncing(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setSyncing(false)
          toast.success('Đồng bộ hoàn tất!')
          return 100
        }
        return prev + 8
      })
    }, 300)
  }

  return (
    <div>
      <PageHeader
        title="Kích hoạt đồng bộ GDĐT"
        subtitle="Đồng bộ dữ liệu từ hệ thống GDĐT"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/sync/trigger' },
          { label: 'Đồng bộ', href: '/gddt/sync/trigger' },
          { label: 'Kích hoạt' },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lần đồng bộ cuối</p>
                <p className="text-lg font-semibold">12/03/2026 06:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2.5">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng bản ghi</p>
                <p className="text-lg font-semibold">12,450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-50 p-2.5">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lỗi</p>
                <p className="text-lg font-semibold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Sync Type */}
        <Card>
          <CardHeader><CardTitle className="text-base">Loại đồng bộ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <AppSelect
              options={syncTypeOptions}
              value={syncType}
              onChange={setSyncType}
              placeholder="Chọn loại đồng bộ"
            />
          </CardContent>
        </Card>

        {/* Auto Schedule */}
        <Card>
          <CardHeader><CardTitle className="text-base">Lịch tự động</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <AppSelect
              options={scheduleOptions}
              value={schedule}
              onChange={setSchedule}
              placeholder="Chọn lịch đồng bộ"
            />
            <p className="text-sm text-muted-foreground">
              Hệ thống sẽ tự động đồng bộ theo lịch đã cấu hình.
            </p>
          </CardContent>
        </Card>

        {/* Progress */}
        {syncing && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Đang đồng bộ...
                </span>
                <AppBadge semantic="warning">{Math.min(progress, 100)}%</AppBadge>
              </div>
              <Progress value={Math.min(progress, 100)} />
            </CardContent>
          </Card>
        )}

        {/* Sync Button */}
        <Button
          size="lg"
          onClick={handleSync}
          disabled={syncing}
          className="cursor-pointer w-full md:w-auto"
        >
          <Play className="h-5 w-5 mr-2" />
          {syncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
        </Button>
      </div>
    </div>
  )
}
