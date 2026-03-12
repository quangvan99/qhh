'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Play, Square, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { AppBadge, AppButton } from '@/components/base'
import { CrudPage } from '@/components/patterns'
import { useGetAttendanceSessions, useStartSession, useEndSession } from '../api/attendance.api'
import type { AttendanceSession } from '../types/attendance.types'

export function AttendanceSessionList() {
  const router = useRouter()
  const { data: sessions = [], isLoading } = useGetAttendanceSessions()
  const startSession = useStartSession()
  const endSession = useEndSession()

  const handleStart = async (session: AttendanceSession) => {
    try {
      await startSession.mutateAsync(session.id)
      toast.success('Bắt đầu phiên điểm danh')
    } catch {
      toast.error('Không thể bắt đầu phiên')
    }
  }

  const handleEnd = async (session: AttendanceSession) => {
    try {
      await endSession.mutateAsync(session.id)
      toast.success('Kết thúc phiên điểm danh')
    } catch {
      toast.error('Không thể kết thúc phiên')
    }
  }

  const columns: ColumnDef<AttendanceSession, unknown>[] = [
    { accessorKey: 'className', header: 'Lớp' },
    {
      accessorKey: 'startedAt',
      header: 'Ngày',
      cell: ({ row }) => {
        const d = row.original.startedAt
        return d ? new Date(d).toLocaleDateString('vi-VN') : '—'
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = row.original.status
        const semantic = s === 'completed' ? 'success' : s === 'active' ? 'info' : 'neutral'
        const label = s === 'completed' ? 'Hoàn thành' : s === 'active' ? 'Đang diễn ra' : 'Đã lên lịch'
        return <AppBadge semantic={semantic} dot={s === 'active'} size="sm">{label}</AppBadge>
      },
    },
    {
      accessorKey: 'presentCount',
      header: 'Có mặt',
      cell: ({ row }) => <span className="text-green-600 font-medium">{row.original.presentCount}</span>,
    },
    {
      accessorKey: 'absentCount',
      header: 'Vắng',
      cell: ({ row }) => <span className="text-red-600 font-medium">{row.original.absentCount}</span>,
    },
    {
      accessorKey: 'lateCount',
      header: 'Muộn',
      cell: ({ row }) => <span className="text-amber-600 font-medium">{row.original.lateCount}</span>,
    },
    {
      id: 'sessionActions',
      header: '',
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex items-center gap-1">
            {s.status === 'scheduled' && (
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => void handleStart(s)}
                leftIcon={<Play className="h-3.5 w-3.5" />}
                className="text-green-600 hover:text-green-700"
                loading={startSession.isPending}
              >
                Bắt đầu
              </AppButton>
            )}
            {s.status === 'active' && (
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => void handleEnd(s)}
                leftIcon={<Square className="h-3.5 w-3.5" />}
                className="text-red-600 hover:text-red-700"
                loading={endSession.isPending}
              >
                Kết thúc
              </AppButton>
            )}
            <AppButton
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/ai-attendance/sessions/${s.id}`)}
              leftIcon={<Eye className="h-3.5 w-3.5" />}
            >
              Chi tiết
            </AppButton>
          </div>
        )
      },
      enableSorting: false,
      size: 220,
    },
  ]

  return (
    <CrudPage<AttendanceSession>
      title="Phiên điểm danh"
      subtitle="Quản lý các phiên điểm danh"
      breadcrumbs={[
        { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
        { label: 'Phiên điểm danh' },
      ]}
      data={sessions}
      columns={columns}
      loading={isLoading}
      searchPlaceholder="Tìm phiên..."
    />
  )
}
