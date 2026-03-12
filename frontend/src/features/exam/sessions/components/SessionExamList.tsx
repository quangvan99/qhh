'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, Users, Upload } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/components/composite/form-field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import type { SessionExam, SessionStatus } from '../types'

const statusLabels: Record<SessionStatus, string> = { preparing: 'Chuẩn bị', active: 'Đang thi', completed: 'Hoàn thành' }
const statusVariants: Record<SessionStatus, 'info' | 'warning' | 'success'> = { preparing: 'info', active: 'warning', completed: 'success' }

const mockExams: SessionExam[] = Array.from({ length: 6 }, (_, i) => ({
  id: `se-${i}`, sessionId: 's-1', name: `Ca thi ${i + 1}`,
  examPaperId: `e-${i}`, examPaperName: `Đề thi ${i + 1}`,
  examDate: '2026-03-15', startTime: `0${7 + i}:00`, durationMinutes: 45,
  room: `P.${101 + i}`, supervisors: [{ id: 'u-1', name: 'GV. A' }],
  maxStudents: 40, studentCount: 35 + i, status: (['preparing', 'active', 'completed'] as const)[i % 3] as SessionStatus,
}))

export function SessionExamList({ sessionId }: { sessionId: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const columns: ColumnDef<SessionExam, unknown>[] = [
    { accessorKey: 'name', header: 'Tên ca thi' },
    { accessorKey: 'examPaperName', header: 'Đề thi' },
    { id: 'time', header: 'Thời gian', cell: ({ row }) => `${row.original.examDate} ${row.original.startTime}` },
    { accessorKey: 'studentCount', header: 'Số HS' },
    { accessorKey: 'room', header: 'Phòng' },
    { accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={statusVariants[row.original.status]} dot>{statusLabels[row.original.status]}</AppBadge> },
    {
      id: 'actions', header: '', size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Pencil className="h-3 w-3" /></Button>
          <Link href={`/exam/sessions/${sessionId}/exams/${row.original.id}/students`}><Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Users className="h-3 w-3" /></Button></Link>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3 w-3" /></Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Ca thi"
        breadcrumbs={[{ label: 'Tổ chức thi', href: '/exam/sessions' }, { label: 'Ca thi' }]}
        actions={[
          { label: 'Thêm ca thi', icon: <Plus className="h-4 w-4" />, onClick: () => setAddOpen(true) },
          { label: 'Import Excel', variant: 'outline', icon: <Upload className="h-4 w-4" /> },
        ]}
      />
      <DataTable data={mockExams} columns={columns} pageSize={20} />

      {/* Add exam session dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm ca thi</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <FormField name="name" label="Tên ca thi" required><Input placeholder="VD: Ca 1 - Sáng" /></FormField>
            <FormField name="exam" label="Đề thi" required>
              <Select><SelectTrigger><SelectValue placeholder="Chọn đề thi" /></SelectTrigger><SelectContent><SelectItem value="e-1">Đề thi 1</SelectItem></SelectContent></Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="date" label="Ngày thi" required><Input type="date" /></FormField>
              <FormField name="time" label="Giờ bắt đầu" required><Input type="time" /></FormField>
            </div>
            <FormField name="duration" label="Thời gian (phút)" required><Input type="number" defaultValue="45" /></FormField>
            <FormField name="room" label="Phòng thi"><Input placeholder="VD: P.101" /></FormField>
            <FormField name="maxStudents" label="Số HS tối đa"><Input type="number" defaultValue="40" /></FormField>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddOpen(false)} className="cursor-pointer">Hủy</Button><Button className="cursor-pointer">Thêm</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa ca thi" description="Xóa ca thi này?" variant="danger" />
    </div>
  )
}
