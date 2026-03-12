'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Camera as CameraIcon, Edit3 } from 'lucide-react'
import { AppBadge, AppSelect, AppButton } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { useGetAttendanceSessions, useGetMonitorFeed } from '../api/attendance.api'
import { ManualOverrideModal } from './ManualOverrideModal'
import { CameraStatusBadge } from './CameraStatusBadge'
import type { MonitorFeedEntry } from '../types/attendance.types'

interface AttendanceMonitorProps {
  defaultSessionId?: string
}

export function AttendanceMonitor({ defaultSessionId }: AttendanceMonitorProps = {}) {
  const { data: sessions = [] } = useGetAttendanceSessions()
  const activeSessions = sessions.filter(s => s.status === 'active')
  const [selectedSession, setSelectedSession] = useState(defaultSessionId ?? '')
  const { data: feed = [], isLoading } = useGetMonitorFeed(selectedSession)
  const [overrideOpen, setOverrideOpen] = useState(false)

  const sessionOptions = activeSessions.map(s => ({
    value: s.id,
    label: `${s.className} — Đang diễn ra`,
  }))

  const currentSession = sessions.find(s => s.id === selectedSession)

  const feedColumns: ColumnDef<MonitorFeedEntry, unknown>[] = [
    { accessorKey: 'studentName', header: 'Học sinh' },
    {
      accessorKey: 'detectedAt',
      header: 'Thời gian',
      cell: ({ row }) => {
        const dt = row.original.detectedAt
        return dt ? new Date(dt).toLocaleTimeString('vi-VN') : '—'
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = row.original.status
        const semantic = s === 'present' ? 'success' : s === 'late' ? 'warning' : 'error'
        const label = s === 'present' ? 'Có mặt' : s === 'late' ? 'Muộn' : 'Vắng'
        return <AppBadge semantic={semantic} size="sm">{label}</AppBadge>
      },
    },
    {
      accessorKey: 'confidence',
      header: 'Độ tin cậy',
      cell: ({ row }) => {
        const c = row.original.confidence
        if (!c) return '—'
        const semantic = c >= 90 ? 'success' : c >= 70 ? 'warning' : 'error'
        return <AppBadge semantic={semantic} size="sm">{c.toFixed(1)}%</AppBadge>
      },
    },
  ]

  const cameraPlaceholders = [
    { name: 'Camera Cổng chính', status: 'online' as const },
    { name: 'Camera Sân trường', status: 'online' as const },
    { name: 'Camera Phòng học', status: 'offline' as const },
    { name: 'Camera Thư viện', status: 'error' as const },
  ]

  return (
    <div>
      <PageHeader
        title="Giám sát điểm danh"
        subtitle="Theo dõi điểm danh thời gian thực"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Giám sát' },
        ]}
      />

      <div className="mb-6">
        <AppSelect
          label="Chọn phiên điểm danh"
          options={sessionOptions.length > 0 ? sessionOptions : [{ value: '', label: 'Không có phiên đang diễn ra' }]}
          value={selectedSession}
          onChange={setSelectedSession}
          placeholder="Chọn phiên điểm danh..."
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera feeds placeholder */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {cameraPlaceholders.map((cam, i) => (
              <div key={i} className="rounded-lg border bg-muted/30 p-4 flex flex-col items-center justify-center min-h-[180px]">
                <CameraIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">{cam.name}</p>
                <CameraStatusBadge status={cam.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Live attendance log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nhật ký điểm danh</h3>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => setOverrideOpen(true)}
              leftIcon={<Edit3 className="h-3.5 w-3.5" />}
              disabled={!selectedSession}
            >
              Chỉnh sửa
            </AppButton>
          </div>
          <DataTable<MonitorFeedEntry>
            data={feed}
            columns={feedColumns}
            loading={isLoading}
            pageSize={10}
          />
        </div>
      </div>

      {/* Stats bar */}
      {currentSession && (
        <div className="mt-6 flex items-center gap-8 rounded-lg border p-4 bg-muted/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentSession.presentCount}</div>
            <div className="text-xs text-muted-foreground">Có mặt</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{currentSession.absentCount}</div>
            <div className="text-xs text-muted-foreground">Vắng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{currentSession.lateCount}</div>
            <div className="text-xs text-muted-foreground">Muộn</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{currentSession.presentCount + currentSession.absentCount + currentSession.lateCount}</div>
            <div className="text-xs text-muted-foreground">Tổng</div>
          </div>
        </div>
      )}

      <ManualOverrideModal
        open={overrideOpen}
        onOpenChange={setOverrideOpen}
        sessionId={selectedSession}
      />
    </div>
  )
}
