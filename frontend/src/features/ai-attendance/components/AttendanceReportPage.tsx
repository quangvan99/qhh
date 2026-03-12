'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { AppSelect } from '@/components/base'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppInput } from '@/components/base'
import { useGetAttendanceReport, useExportAttendanceReport } from '../api/attendance.api'
import type { AttendanceReport } from '../types/attendance.types'

export function AttendanceReportPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [classId, setClassId] = useState('')
  const { data: reports = [], isLoading } = useGetAttendanceReport({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    classId: classId || undefined,
  })
  const exportReport = useExportAttendanceReport()

  const classOptions = [
    { value: 'all', label: 'Tất cả lớp' },
    { value: 'c1', label: 'Lớp 10A1' },
    { value: 'c2', label: 'Lớp 10A2' },
    { value: 'c3', label: 'Lớp 11B1' },
  ]

  const columns: ColumnDef<AttendanceReport, unknown>[] = [
    {
      accessorKey: 'date',
      header: 'Ngày',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString('vi-VN'),
    },
    { accessorKey: 'className', header: 'Lớp' },
    {
      accessorKey: 'present',
      header: 'Có mặt',
      cell: ({ row }) => <span className="text-green-600 font-medium">{row.original.present}</span>,
    },
    {
      accessorKey: 'absent',
      header: 'Vắng',
      cell: ({ row }) => <span className="text-red-600 font-medium">{row.original.absent}</span>,
    },
    {
      accessorKey: 'late',
      header: 'Muộn',
      cell: ({ row }) => <span className="text-amber-600 font-medium">{row.original.late}</span>,
    },
    {
      accessorKey: 'attendanceRate',
      header: 'Tỉ lệ ĐD',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.attendanceRate.toFixed(1)}%</span>
      ),
    },
  ]

  const handleExport = async () => {
    try {
      await exportReport.mutateAsync({
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        classId: classId || undefined,
      })
      toast.success('Xuất báo cáo thành công')
    } catch {
      toast.error('Xuất báo cáo thất bại')
    }
  }

  return (
    <div>
      <PageHeader
        title="Báo cáo điểm danh"
        subtitle="Thống kê điểm danh theo lớp và thời gian"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Báo cáo' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            icon: <Download className="h-4 w-4" />,
            variant: 'outline',
            onClick: () => void handleExport(),
            loading: exportReport.isPending,
          },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <AppInput
          type="date"
          label="Từ ngày"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[180px]"
        />
        <AppInput
          type="date"
          label="Đến ngày"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-[180px]"
        />
        <AppSelect
          label="Lớp"
          options={classOptions}
          value={classId || 'all'}
          onChange={(v) => setClassId(v === 'all' ? '' : v)}
          className="w-[180px]"
        />
      </div>

      <DataTable<AttendanceReport>
        data={reports}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
