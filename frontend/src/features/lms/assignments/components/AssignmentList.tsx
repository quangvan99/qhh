'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import type { Assignment, AssignmentStatus } from '../types'

const statusLabels: Record<AssignmentStatus, string> = { draft: 'Nháp', open: 'Đang mở', closed: 'Hết hạn' }
const statusVariants: Record<AssignmentStatus, 'neutral' | 'success' | 'warning'> = { draft: 'neutral', open: 'success', closed: 'warning' }

const mockData: Assignment[] = Array.from({ length: 20 }, (_, i) => ({
  id: `a-${i}`, classId: '1', title: `Bài tập ${i + 1}: Kiểm tra kiến thức`,
  description: '', submissionType: 'file' as const, openDate: '2026-03-01', deadline: '2026-03-15',
  maxScore: 10, allowLate: false, allowResubmit: false, hideScore: false,
  status: (['draft', 'open', 'closed'] as const)[i % 3] as AssignmentStatus,
  submittedCount: Math.floor(Math.random() * 32), totalStudents: 32,
  createdAt: '2026-03-01',
}))

export function AssignmentList({ classId }: { classId: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? mockData : mockData.filter((a) => a.status === filter)

  const columns: ColumnDef<Assignment, unknown>[] = [
    { accessorKey: 'title', header: 'Tên bài tập', cell: ({ row }) => (
      <Link href={`/lms/classes/${classId}/assignments/${row.original.id}/submissions`} className="font-medium hover:underline cursor-pointer">{row.original.title}</Link>
    )},
    { accessorKey: 'submissionType', header: 'Loại', cell: ({ row }) => <AppBadge semantic="info">{row.original.submissionType === 'file' ? 'Nộp file' : row.original.submissionType === 'text' ? 'Văn bản' : 'Cả hai'}</AppBadge> },
    { accessorKey: 'deadline', header: 'Hạn nộp' },
    { id: 'submitted', header: 'Đã nộp', cell: ({ row }) => `${row.original.submittedCount}/${row.original.totalStudents}` },
    { accessorKey: 'maxScore', header: 'Điểm tối đa' },
    { accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={statusVariants[row.original.status]} dot>{statusLabels[row.original.status]}</AppBadge> },
    {
      id: 'actions', header: '', size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/lms/classes/${classId}/assignments/${row.original.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Pencil className="h-3 w-3" /></Button>
          </Link>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <Link href={`/lms/classes/${classId}/assignments/${row.original.id}/submissions`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Eye className="h-3 w-3" /></Button>
          </Link>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Bài tập"
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Bài tập' }]}
        actions={[{ label: 'Tạo bài tập', icon: <Plus className="h-4 w-4" />, href: `/lms/classes/${classId}/assignments/new` }]}
      />
      <div className="flex items-center gap-3 mb-4">
        <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="open">Đang mở</SelectItem>
            <SelectItem value="closed">Hết hạn</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable data={filtered} columns={columns} searchable pageSize={20} />
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa bài tập" description="Bạn có chắc muốn xóa bài tập này? Hành động không thể hoàn tác." variant="danger" />
    </div>
  )
}
