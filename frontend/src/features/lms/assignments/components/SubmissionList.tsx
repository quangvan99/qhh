'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download, Settings } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import type { Submission, SubmissionStatus, GradingStatus } from '../types'

const subStatusLabels: Record<SubmissionStatus, string> = { on_time: 'Đúng hạn', late: 'Nộp muộn', not_submitted: 'Chưa nộp' }
const subStatusVariants: Record<SubmissionStatus, 'success' | 'warning' | 'error'> = { on_time: 'success', late: 'warning', not_submitted: 'error' }

const mockSubs: Submission[] = Array.from({ length: 32 }, (_, i) => ({
  id: `sub-${i}`, assignmentId: 'a-1', studentId: `s-${i}`,
  studentName: `Học sinh ${i + 1}`, submittedAt: i < 25 ? '2026-03-14T10:30:00Z' : undefined,
  submissionStatus: (i < 20 ? 'on_time' : i < 25 ? 'late' : 'not_submitted') as SubmissionStatus,
  gradingStatus: (i < 15 ? 'graded' : 'ungraded') as GradingStatus,
  score: i < 15 ? Math.round(Math.random() * 10 * 10) / 10 : null, feedback: i < 10 ? 'Tốt' : undefined,
}))

export function SubmissionList({ classId, assignmentId }: { classId: string; assignmentId: string }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const submitted = mockSubs.filter((s) => s.submissionStatus !== 'not_submitted').length
  const graded = mockSubs.filter((s) => s.gradingStatus === 'graded').length
  const avgScore = mockSubs.filter((s) => s.score !== null).reduce((sum, s) => sum + (s.score ?? 0), 0) / (graded || 1)

  const filtered = statusFilter === 'all' ? mockSubs : mockSubs.filter((s) => s.submissionStatus === statusFilter)

  const columns: ColumnDef<Submission, unknown>[] = [
    { accessorKey: 'studentName', header: 'Học sinh', cell: ({ row }) => (
      <div className="flex items-center gap-2"><AppAvatar name={row.original.studentName} size="xs" role="student" /><span>{row.original.studentName}</span></div>
    )},
    { accessorKey: 'submittedAt', header: 'Thời điểm nộp', cell: ({ row }) => row.original.submittedAt ? new Date(row.original.submittedAt).toLocaleString('vi-VN') : '—' },
    { accessorKey: 'submissionStatus', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={subStatusVariants[row.original.submissionStatus]} dot>{subStatusLabels[row.original.submissionStatus]}</AppBadge> },
    { accessorKey: 'score', header: 'Điểm', cell: ({ row }) => row.original.score?.toFixed(1) ?? '—' },
    { accessorKey: 'gradingStatus', header: 'Đã chấm', cell: ({ row }) => <AppBadge semantic={row.original.gradingStatus === 'graded' ? 'success' : 'neutral'}>{row.original.gradingStatus === 'graded' ? 'Đã chấm' : 'Chưa chấm'}</AppBadge> },
    { id: 'actions', header: '', cell: ({ row }) => row.original.submissionStatus !== 'not_submitted' ? (
      <Link href={`/lms/classes/${classId}/assignments/${assignmentId}/submissions/${row.original.id}`}>
        <span className="text-primary hover:underline cursor-pointer text-sm">Xem & Chấm →</span>
      </Link>
    ) : null, enableSorting: false },
  ]

  return (
    <div>
      <PageHeader
        title="Bài nộp"
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Bài tập', href: `/lms/classes/${classId}/assignments` }, { label: 'Bài nộp' }]}
        actions={[
          { label: 'Hiển thị điểm', variant: 'outline', icon: <Settings className="h-4 w-4" /> },
          { label: 'Xuất Excel', variant: 'outline', icon: <Download className="h-4 w-4" /> },
        ]}
      />
      <StatGrid cols={4} stats={[
        { title: 'Đã nộp', value: submitted, module: 'lms' },
        { title: 'Chưa nộp', value: mockSubs.length - submitted, module: 'lms' },
        { title: 'Đã chấm', value: graded, module: 'lms' },
        { title: 'Điểm TB', value: avgScore.toFixed(1), module: 'lms' },
      ]} />
      <div className="my-4">
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="on_time">Đúng hạn</SelectItem>
            <SelectItem value="late">Nộp muộn</SelectItem>
            <SelectItem value="not_submitted">Chưa nộp</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable data={filtered} columns={columns} pageSize={20} />
    </div>
  )
}
