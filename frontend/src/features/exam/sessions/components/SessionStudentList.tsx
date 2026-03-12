'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Upload, Download, Settings, UserPlus } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/components/composite/form-field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import type { SessionStudent, AttemptStatus } from '../types'
import { AddStudentFromSystemModal } from './AddStudentFromSystemModal'

const attemptLabels: Record<AttemptStatus, string> = { not_started: 'Chưa thi', in_progress: 'Đang thi', submitted: 'Đã nộp', graded: 'Đã chấm' }
const attemptVariants: Record<AttemptStatus, 'neutral' | 'warning' | 'info' | 'success'> = { not_started: 'neutral', in_progress: 'warning', submitted: 'info', graded: 'success' }

const mockStudents: SessionStudent[] = Array.from({ length: 35 }, (_, i) => ({
  id: `ss-${i}`, sessionExamId: 'se-1', studentId: `s-${i}`,
  studentName: `Học sinh ${i + 1}`, studentCode: `HS${String(i + 1).padStart(4, '0')}`,
  className: `12A${(i % 4) + 1}`, registrationNumber: String(100 + i),
  room: `P.${101 + Math.floor(i / 10)}`, seatNumber: String(i + 1),
  extraTimeMinutes: i === 2 ? 15 : 0, extraAttempts: 0, exceptionNote: i === 2 ? 'Khuyết tật' : undefined,
  attemptStatus: (['not_started', 'submitted', 'graded', 'graded'] as const)[i % 4] as AttemptStatus,
  score: i % 4 >= 2 ? Math.round(Math.random() * 10 * 10) / 10 : null,
}))

export function SessionStudentList({ sessionId, examId }: { sessionId: string; examId: string }) {
  const [exceptionOpen, setExceptionOpen] = useState(false)
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<SessionStudent | null>(null)

  const columns: ColumnDef<SessionStudent, unknown>[] = [
    { accessorKey: 'registrationNumber', header: 'SBD', size: 60 },
    { accessorKey: 'studentName', header: 'Học sinh', cell: ({ row }) => (
      <div className="flex items-center gap-2"><AppAvatar name={row.original.studentName} size="xs" role="student" /><span>{row.original.studentName}</span></div>
    )},
    { accessorKey: 'className', header: 'Lớp' },
    { accessorKey: 'room', header: 'Phòng' },
    { id: 'exception', header: 'Ngoại lệ', cell: ({ row }) => row.original.extraTimeMinutes > 0 ? <AppBadge semantic="warning" size="sm">+{row.original.extraTimeMinutes} phút</AppBadge> : '—' },
    { accessorKey: 'attemptStatus', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={attemptVariants[row.original.attemptStatus]} dot>{attemptLabels[row.original.attemptStatus]}</AppBadge> },
    { accessorKey: 'score', header: 'Điểm', cell: ({ row }) => row.original.score?.toFixed(1) ?? '—' },
    {
      id: 'actions', header: '', size: 140,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students/${row.original.studentId}`}>
            <Button variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs">Hồ sơ</Button>
          </Link>
          <Button variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs" onClick={() => { setSelectedStudent(row.original); setExceptionOpen(true) }}>
            <Settings className="h-3 w-3 mr-1" /> Ngoại lệ
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Học sinh trong ca thi"
        breadcrumbs={[{ label: 'Tổ chức thi', href: '/exam/sessions' }, { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` }, { label: 'Học sinh' }]}
        actions={[
          { label: 'Thêm học sinh', icon: <UserPlus className="h-4 w-4" />, onClick: () => setAddStudentOpen(true) },
          { label: 'Import Excel', variant: 'outline', icon: <Upload className="h-4 w-4" />, href: `/exam/sessions/${sessionId}/exams/${examId}/students/import` },
          { label: 'Xuất Excel', variant: 'outline', icon: <Download className="h-4 w-4" /> },
        ]}
      />
      <DataTable data={mockStudents} columns={columns} selectable searchable pageSize={20} />

      {/* Exception dialog */}
      <Dialog open={exceptionOpen} onOpenChange={setExceptionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thiết lập ngoại lệ — {selectedStudent?.studentName}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <FormField name="extraTime" label="Thời gian extra (phút)"><Input type="number" defaultValue={selectedStudent?.extraTimeMinutes ?? 0} min={0} /></FormField>
            <FormField name="extraAttempts" label="Lượt thi thêm"><Input type="number" defaultValue={selectedStudent?.extraAttempts ?? 0} min={0} /></FormField>
            <FormField name="note" label="Ghi chú"><Input defaultValue={selectedStudent?.exceptionNote ?? ''} placeholder="Ghi chú..." /></FormField>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setExceptionOpen(false)} className="cursor-pointer">Hủy</Button><Button className="cursor-pointer">Lưu ngoại lệ</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add student from system modal */}
      <AddStudentFromSystemModal open={addStudentOpen} onOpenChange={setAddStudentOpen} />
    </div>
  )
}
