'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AppBadge } from '@/components/base/app-badge'
import { AppSelect } from '@/components/base/app-select'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'

interface SyncRecord {
  id: string
  startTime: string
  syncType: string
  totalRecords: number
  successCount: number
  errorCount: number
  duration: string
  status: 'success' | 'failed' | 'partial'
  errors?: string[]
}

const statusMap: Record<SyncRecord['status'], { label: string; variant: 'success' | 'error' | 'warning' }> = {
  success: { label: 'Thành công', variant: 'success' },
  failed: { label: 'Thất bại', variant: 'error' },
  partial: { label: 'Một phần', variant: 'warning' },
}

const syncTypeLabels: Record<string, string> = {
  all: 'Toàn bộ',
  students: 'Học sinh',
  classes: 'Lớp học',
  scores: 'Điểm số',
}

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'success', label: 'Thành công' },
  { value: 'failed', label: 'Thất bại' },
  { value: 'partial', label: 'Một phần' },
]

const mockHistory: SyncRecord[] = [
  { id: '1', startTime: '2026-03-12T06:00:00', syncType: 'all', totalRecords: 12450, successCount: 12447, errorCount: 3, duration: '2m 34s', status: 'partial', errors: ['Không tìm thấy lớp 12A3', 'Trùng mã HS: 20260001', 'Timeout kết nối LGSP'] },
  { id: '2', startTime: '2026-03-11T06:00:00', syncType: 'all', totalRecords: 12445, successCount: 12445, errorCount: 0, duration: '2m 12s', status: 'success' },
  { id: '3', startTime: '2026-03-10T12:30:00', syncType: 'students', totalRecords: 8500, successCount: 8500, errorCount: 0, duration: '1m 45s', status: 'success' },
  { id: '4', startTime: '2026-03-10T06:00:00', syncType: 'all', totalRecords: 12440, successCount: 12438, errorCount: 2, duration: '2m 28s', status: 'partial', errors: ['Trùng mã HS: 20260015', 'Lỗi format điểm lớp 11B2'] },
  { id: '5', startTime: '2026-03-09T06:00:00', syncType: 'all', totalRecords: 12435, successCount: 12435, errorCount: 0, duration: '2m 10s', status: 'success' },
  { id: '6', startTime: '2026-03-08T18:00:00', syncType: 'scores', totalRecords: 5200, successCount: 5200, errorCount: 0, duration: '58s', status: 'success' },
  { id: '7', startTime: '2026-03-08T06:00:00', syncType: 'all', totalRecords: 12430, successCount: 0, errorCount: 12430, duration: '5s', status: 'failed', errors: ['Không thể kết nối LGSP: Connection refused'] },
  { id: '8', startTime: '2026-03-07T06:00:00', syncType: 'all', totalRecords: 12425, successCount: 12425, errorCount: 0, duration: '2m 05s', status: 'success' },
  { id: '9', startTime: '2026-03-06T14:00:00', syncType: 'classes', totalRecords: 120, successCount: 120, errorCount: 0, duration: '12s', status: 'success' },
  { id: '10', startTime: '2026-03-06T06:00:00', syncType: 'all', totalRecords: 12420, successCount: 12418, errorCount: 2, duration: '2m 15s', status: 'partial', errors: ['Thiếu thông tin GVCN lớp 10C1', 'Lỗi encoding tên HS'] },
  { id: '11', startTime: '2026-03-05T06:00:00', syncType: 'all', totalRecords: 12415, successCount: 12415, errorCount: 0, duration: '2m 08s', status: 'success' },
  { id: '12', startTime: '2026-03-04T06:00:00', syncType: 'all', totalRecords: 12410, successCount: 12410, errorCount: 0, duration: '2m 02s', status: 'success' },
  { id: '13', startTime: '2026-03-03T10:00:00', syncType: 'students', totalRecords: 8400, successCount: 8399, errorCount: 1, duration: '1m 38s', status: 'partial', errors: ['Trùng CCCD: 046...123'] },
  { id: '14', startTime: '2026-03-03T06:00:00', syncType: 'all', totalRecords: 12405, successCount: 12405, errorCount: 0, duration: '2m 00s', status: 'success' },
  { id: '15', startTime: '2026-03-02T06:00:00', syncType: 'all', totalRecords: 12400, successCount: 12400, errorCount: 0, duration: '1m 55s', status: 'success' },
]

export function SyncHistoryPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [detailRecord, setDetailRecord] = useState<SyncRecord | null>(null)

  const filtered = mockHistory.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false
    if (dateFilter && !r.startTime.startsWith(dateFilter)) return false
    return true
  })

  const columns: ColumnDef<SyncRecord, unknown>[] = [
    {
      accessorKey: 'startTime',
      header: 'Thời gian',
      cell: ({ row }) => new Date(row.original.startTime).toLocaleString('vi-VN'),
    },
    {
      accessorKey: 'syncType',
      header: 'Loại sync',
      cell: ({ row }) => syncTypeLabels[row.original.syncType] ?? row.original.syncType,
    },
    { accessorKey: 'totalRecords', header: 'Tổng bản ghi' },
    { accessorKey: 'successCount', header: 'Thành công' },
    {
      accessorKey: 'errorCount',
      header: 'Lỗi',
      cell: ({ row }) => (
        <span className={row.original.errorCount > 0 ? 'text-red-600 font-medium' : ''}>
          {row.original.errorCount}
        </span>
      ),
    },
    { accessorKey: 'duration', header: 'Thời gian XL' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const s = statusMap[row.original.status]
        return <AppBadge semantic={s.variant} dot>{s.label}</AppBadge>
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        row.original.errorCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setDetailRecord(row.original)} className="cursor-pointer h-8 px-2 text-xs">
            <Eye className="h-3.5 w-3.5 mr-1" /> Chi tiết
          </Button>
        ) : null,
      enableSorting: false,
      size: 100,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Lịch sử đồng bộ"
        subtitle="Xem lịch sử và log đồng bộ GDĐT"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/sync/history' },
          { label: 'Đồng bộ', href: '/gddt/sync/history' },
          { label: 'Lịch sử' },
        ]}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Ngày</Label>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-44" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Trạng thái</Label>
          <AppSelect options={statusOptions} value={statusFilter} onChange={setStatusFilter} placeholder="Trạng thái" className="w-44" />
        </div>
      </div>

      <DataTable data={filtered} columns={columns} />

      {/* Error Detail Dialog */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => { if (!open) setDetailRecord(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết lỗi đồng bộ</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Thời gian: {detailRecord ? new Date(detailRecord.startTime).toLocaleString('vi-VN') : ''}
            </div>
            <div className="space-y-2">
              {detailRecord?.errors?.map((err, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <span className="font-medium text-red-600">#{idx + 1}</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
