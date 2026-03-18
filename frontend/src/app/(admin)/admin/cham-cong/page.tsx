'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockClasses } from '@/lib/mock/data'
import { ConfidenceBadge } from '@/components/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Camera, WifiOff, AlertTriangle, RefreshCw, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type CameraType = { id: string; name: string; location: string; ip: string; status: string; lastSeen: string }

function CameraStatusBadge({ status }: { status: string }) {
  if (status === 'online') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />Online</Badge>
  if (status === 'offline') return <Badge variant="secondary" className="gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 inline-block" />Offline</Badge>
  return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block animate-pulse" />Lỗi</Badge>
}

function CameraCell({ camera }: { camera: CameraType }) {
  const isOnline = camera.status === 'online'

  return (
    <div className={cn(
      'relative rounded-xl border-2 overflow-hidden bg-slate-900',
      isOnline ? 'border-green-500' : camera.status === 'offline' ? 'border-slate-500' : 'border-red-500'
    )}>
      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        {isOnline ? (
          <div className="text-center">
            <Camera className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Live Feed</p>
            <div className="mt-2 flex gap-1 justify-center">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-1 w-4 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            {camera.status === 'offline' ? (
              <WifiOff className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            ) : (
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            )}
            <p className="text-xs text-slate-500">{camera.status === 'offline' ? 'Mất kết nối' : 'Lỗi camera'}</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-white text-xs font-medium truncate">{camera.name}</p>
        <p className="text-slate-300 text-[10px]">{camera.location} · {camera.ip}</p>
      </div>

      <div className="absolute top-2 right-2">
        <CameraStatusBadge status={camera.status} />
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="aspect-video animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function ChamCongPage() {
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: cameras, isLoading: camLoading } = useQuery({
    queryKey: ['admin', 'cameras'],
    queryFn: () => adminMockApi.getCameras(),
    refetchInterval: 30000,
  })

  const { data: attendance } = useQuery({
    queryKey: ['admin', 'attendance-today', classFilter],
    queryFn: () => adminMockApi.getAttendanceToday(classFilter !== 'all' ? classFilter : undefined),
  })

  if (camLoading) return <PageSkeleton />

  const allCameras = cameras ?? []
  const onlineCount = allCameras.filter(c => c.status === 'online').length
  const allAttendance = attendance ?? []

  const presentCount = allAttendance.filter(a => a.status === 'present').length
  const absentCount = allAttendance.filter(a => a.status === 'absent').length
  const lowConfidence = allAttendance.filter(a => a.confidence !== null && a.confidence < 0.85)

  const filteredAttendance = allAttendance.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Chấm công AI</h1>
          <p className="text-sm text-muted-foreground">
            {onlineCount}/{allCameras.length} camera online · Hôm nay: {presentCount} có mặt, {absentCount} vắng
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={() => toast.success('Đã làm mới dữ liệu')}>
          <RefreshCw className="h-4 w-4" /> Làm mới
        </Button>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="camera">Camera Live</TabsTrigger>
          <TabsTrigger value="today">
            Hôm nay
            {lowConfidence.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 h-4 min-w-4 px-1 text-[9px]">{lowConfidence.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="devices">Thiết bị</TabsTrigger>
        </TabsList>

        {/* Camera Live */}
        <TabsContent value="camera" className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
              <p className="text-xs text-muted-foreground">Camera online</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-red-500">{allCameras.length - onlineCount}</p>
              <p className="text-xs text-muted-foreground">Camera offline/lỗi</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold">{presentCount}</p>
              <p className="text-xs text-muted-foreground">Vào hôm nay</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{lowConfidence.length}</p>
              <p className="text-xs text-muted-foreground">Cần xác nhận</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {allCameras.map(cam => (
              <CameraCell key={cam.id} camera={cam} />
            ))}
          </div>
        </TabsContent>

        {/* Điểm danh hôm nay — hiện ConfidenceBadge mặc định */}
        <TabsContent value="today" className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-green-50 dark:bg-green-950 border-green-200 p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-xs text-green-700">Có mặt</p>
            </div>
            <div className="rounded-xl border bg-red-50 dark:bg-red-950 border-red-200 p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-red-700">Vắng</p>
            </div>
            <div className="rounded-xl border bg-yellow-50 dark:bg-yellow-950 border-yellow-200 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{lowConfidence.length}</p>
              <p className="text-xs text-yellow-700">Cần xác nhận ⚠️</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={classFilter} onValueChange={v => v && setClassFilter(v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tất cả lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {mockClasses.slice(0, 8).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={v => v && setStatusFilter(v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="present">Có mặt</SelectItem>
                <SelectItem value="absent">Vắng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidence badges panel */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-semibold mb-3">Độ tin cậy nhận diện AI</h3>
            <div className="flex flex-wrap gap-2">
              <ConfidenceBadge value={0.97} />
              <ConfidenceBadge value={0.91} />
              <ConfidenceBadge value={0.83} />
              <ConfidenceBadge value={0.76} />
              <ConfidenceBadge value={0.62} />
              <ConfidenceBadge value={0.55} />
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">Học sinh</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">Lớp</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">Giờ vào</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">Độ tin cậy</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">Trạng thái</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">P. thức</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map(a => {
                  const isLowConf = a.confidence !== null && a.confidence < 0.85
                  const cls = mockClasses.find(c => c.id === a.classId)
                  return (
                    <tr key={a.id} className={cn('border-t', isLowConf && 'bg-yellow-50 dark:bg-yellow-950/30')}>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {a.studentName.split(' ').pop()?.[0]}
                          </div>
                          <span className="font-medium text-xs">{a.studentName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-xs">{cls?.name ?? a.classId}</Badge>
                      </td>
                      <td className="px-3 py-2 text-xs">{a.checkInTime ?? '—'}</td>
                      <td className="px-3 py-2">
                        {a.confidence !== null ? <ConfidenceBadge value={a.confidence} size="sm" /> : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant={a.status === 'present' ? 'default' : 'destructive'} className="text-xs">
                          {a.status === 'present' ? 'Có mặt' : 'Vắng'}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {a.method === 'face_recognition' ? '🤖 AI' : '✋ Thủ công'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Thiết bị */}
        <TabsContent value="devices" className="mt-6">
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Camera</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Vị trí</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">IP</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Lần cuối</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {allCameras.map(cam => (
                  <tr key={cam.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cam.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cam.location}</td>
                    <td className="px-4 py-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cam.ip}</code></td>
                    <td className="px-4 py-3"><CameraStatusBadge status={cam.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(cam.lastSeen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="h-7 text-xs cursor-pointer"
                        onClick={() => toast.info(`Kiểm tra camera ${cam.name}`)}>
                        <Activity className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
