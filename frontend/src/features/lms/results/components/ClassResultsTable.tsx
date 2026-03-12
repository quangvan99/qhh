'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download, FileText, Bell, Plus, CheckCircle } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { AppAvatar } from '@/components/base/app-avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import type { LearningResult, CompletionStatus } from '../types'

const statusLabels: Record<CompletionStatus, string> = {
  completed: 'Hoàn thành',
  in_progress: 'Đang học',
  not_started: 'Chưa bắt đầu',
}

const statusVariants: Record<CompletionStatus, 'success' | 'warning' | 'neutral'> = {
  completed: 'success',
  in_progress: 'warning',
  not_started: 'neutral',
}

// Mock data
const mockResults: LearningResult[] = Array.from({ length: 50 }, (_, i) => ({
  id: `r-${i}`,
  studentId: `s-${i}`,
  studentName: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
  studentCode: `HS${String(i + 1).padStart(4, '0')}`,
  classId: '1',
  contentProgress: Math.round(Math.random() * 100),
  assignmentAvg: Math.round(Math.random() * 10 * 10) / 10,
  examScore: i % 3 === 0 ? Math.round(Math.random() * 10 * 10) / 10 : null,
  finalScore: i % 4 === 0 ? Math.round(Math.random() * 10 * 10) / 10 : null,
  completionStatus: (['completed', 'in_progress', 'not_started'] as const)[i % 3] as CompletionStatus,
}))

export function ClassResultsTable({ classId, className: _className }: { classId: string; className?: string }) {
  const [search, setSearch] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [addAttemptOpen, setAddAttemptOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<LearningResult | null>(null)

  const filtered = mockResults.filter((r) =>
    !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.studentCode.includes(search)
  )

  const stats = {
    total: mockResults.length,
    completed: mockResults.filter((r) => r.completionStatus === 'completed').length,
    inProgress: mockResults.filter((r) => r.completionStatus === 'in_progress').length,
    notStarted: mockResults.filter((r) => r.completionStatus === 'not_started').length,
  }

  const columns: ColumnDef<LearningResult, unknown>[] = [
    {
      accessorKey: 'studentName',
      header: 'Học sinh',
      cell: ({ row }) => (
        <Link href={`/lms/classes/${classId}/results/${row.original.studentId}`} className="flex items-center gap-2 hover:underline cursor-pointer">
          <AppAvatar name={row.original.studentName} size="xs" role="student" />
          <span className="font-medium">{row.original.studentName}</span>
        </Link>
      ),
    },
    { accessorKey: 'studentCode', header: 'Mã HS', size: 100 },
    {
      accessorKey: 'contentProgress',
      header: 'Tiến độ',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={row.original.contentProgress} className="flex-1 h-2" />
          <span className="text-xs text-muted-foreground w-8">{row.original.contentProgress}%</span>
        </div>
      ),
    },
    { accessorKey: 'assignmentAvg', header: 'Điểm BT TB', cell: ({ row }) => row.original.assignmentAvg?.toFixed(1) ?? '—' },
    { accessorKey: 'examScore', header: 'Điểm thi', cell: ({ row }) => row.original.examScore?.toFixed(1) ?? '—' },
    { accessorKey: 'finalScore', header: 'Tổng kết', cell: ({ row }) => row.original.finalScore?.toFixed(1) ?? '—' },
    {
      accessorKey: 'completionStatus',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge semantic={statusVariants[row.original.completionStatus]} dot>
          {statusLabels[row.original.completionStatus]}
        </AppBadge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs" onClick={() => { setSelectedStudent(row.original); setNotifyOpen(true) }}>
            <Bell className="h-3 w-3 mr-1" /> Thông báo
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs" onClick={() => { setSelectedStudent(row.original); setAddAttemptOpen(true) }}>
            <Plus className="h-3 w-3 mr-1" /> Thêm lượt
          </Button>
        </div>
      ),
      enableSorting: false,
      size: 200,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Kết quả học tập"
        breadcrumbs={[
          { label: 'Lớp học', href: '/lms/classes' },
          { label: 'Kết quả' },
        ]}
        actions={[
          { label: 'Cập nhật học bạ', variant: 'outline', icon: <CheckCircle className="h-4 w-4" /> },
          { label: 'Xuất Excel', variant: 'outline', icon: <Download className="h-4 w-4" /> },
        ]}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Năm học" /></SelectTrigger><SelectContent><SelectItem value="2025-2026">2025-2026</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-[120px]"><SelectValue placeholder="Học kỳ" /></SelectTrigger><SelectContent><SelectItem value="1">HK1</SelectItem><SelectItem value="2">HK2</SelectItem></SelectContent></Select>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm học sinh..." className="max-w-sm" />
        </div>

        <StatGrid cols={4} stats={[
          { title: 'Tổng HS', value: stats.total, module: 'lms' },
          { title: 'Đã hoàn thành', value: stats.completed, module: 'lms' },
          { title: 'Đang học', value: stats.inProgress, module: 'lms' },
          { title: 'Chưa bắt đầu', value: stats.notStarted, module: 'lms' },
        ]} />

        <DataTable data={filtered} columns={columns} selectable searchable={false} pageSize={20} />
      </div>

      {/* Notify dialog */}
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gửi thông báo đến {selectedStudent?.studentName}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tiêu đề *</Label><Input placeholder="Nhập tiêu đề..." /></div>
            <div><Label>Nội dung *</Label><Textarea rows={5} placeholder="Nhập nội dung..." /></div>
            <div className="flex items-center gap-4"><Label className="flex items-center gap-2"><Checkbox /> Email</Label><Label className="flex items-center gap-2"><Checkbox /> Push notification</Label></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setNotifyOpen(false)} className="cursor-pointer">Hủy</Button><Button className="cursor-pointer">Gửi ngay</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add attempt dialog */}
      <Dialog open={addAttemptOpen} onOpenChange={setAddAttemptOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm lượt thi cho {selectedStudent?.studentName}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Ca thi *</Label><Select><SelectTrigger><SelectValue placeholder="Chọn ca thi..." /></SelectTrigger><SelectContent><SelectItem value="1">Giữa kỳ 1</SelectItem></SelectContent></Select></div>
            <div><Label>Số lượt thêm</Label><Input type="number" defaultValue="1" min={1} /></div>
            <div><Label>Ghi chú</Label><Input placeholder="Nhập ghi chú..." /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddAttemptOpen(false)} className="cursor-pointer">Hủy</Button><Button className="cursor-pointer">Thêm lượt</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
