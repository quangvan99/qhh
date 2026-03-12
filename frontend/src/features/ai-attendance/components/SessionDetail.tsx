'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { AppBadge } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable, StatGrid } from '@/components/patterns'
import { useGetSessionDetail, useGetAttendanceRecords } from '../api/attendance.api'
import type { AttendanceRecord } from '../types/attendance.types'

interface SessionDetailProps {
  sessionId: string
}

export function SessionDetail({ sessionId }: SessionDetailProps) {
  const { data: session } = useGetSessionDetail(sessionId)
  const { data: records = [], isLoading } = useGetAttendanceRecords({ sessionId })

  const columns: ColumnDef<AttendanceRecord, unknown>[] = [
    { accessorKey: 'studentName', header: 'Học sinh' },
    {
      accessorKey: 'detectedAt',
      header: 'Thời gian phát hiện',
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
        if (c == null) return '—'
        return <span className="font-mono text-sm">{c.toFixed(1)}%</span>
      },
    },
    {
      accessorKey: 'isManualOverride',
      header: 'Chỉnh sửa',
      cell: ({ row }) =>
        row.original.isManualOverride ? (
          <AppBadge semantic="info" size="sm">Thủ công</AppBadge>
        ) : null,
    },
  ]

  const total = session
    ? session.presentCount + session.absentCount + session.lateCount
    : 0

  return (
    <div>
      <PageHeader
        title={session ? `Phiên điểm danh — ${session.className}` : 'Chi tiết phiên'}
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Phiên điểm danh', href: '/ai-attendance/sessions' },
          { label: 'Chi tiết' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            icon: <Download className="h-4 w-4" />,
            variant: 'outline',
            onClick: () => toast.info('Tính năng xuất Excel đang phát triển'),
          },
        ]}
      />

      {session && (
        <StatGrid
          cols={4}
          stats={[
            { title: 'Có mặt', value: session.presentCount, module: 'ai', icon: null },
            { title: 'Vắng', value: session.absentCount, module: 'ai', icon: null },
            { title: 'Muộn', value: session.lateCount, module: 'ai', icon: null },
            { title: 'Tổng', value: total, module: 'ai', icon: null },
          ]}
          className="mb-6"
        />
      )}

      <DataTable<AttendanceRecord>
        data={records}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm học sinh..."
      />
    </div>
  )
}
