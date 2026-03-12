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
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import Link from 'next/link'
import type { SessionExam, SessionStatus } from '../types'
import { useGetSessionExams, useDeleteSessionExam, useGetSession } from '../hooks'
import { useGetExams } from '../../exams/hooks'

const STATUS_LABELS: Record<SessionStatus, string> = { preparing: 'Chuẩn bị', active: 'Đang thi', completed: 'Hoàn thành' }
const STATUS_VARIANTS: Record<SessionStatus, 'info' | 'warning' | 'success'> = { preparing: 'info', active: 'warning', completed: 'success' }

export function SessionExamList({ sessionId }: { sessionId: string }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const { data: sessionData } = useGetSession(sessionId)
  const { data: examsData, isLoading } = useGetSessionExams(sessionId)
  const { data: allExams } = useGetExams({ status: 'published' })
  const deleteMut = useDeleteSessionExam(sessionId)

  const sessionExams = examsData?.data ?? []
  const availableExams = allExams?.data ?? []
  const sessionName = sessionData?.data?.name ?? 'Đợt thi'

  const columns: ColumnDef<SessionExam, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Tên ca thi',
      cell: ({ row }) => (
        <Link href={`/exam/sessions/${sessionId}/exams/${row.original.id}/students`} className="font-medium hover:underline cursor-pointer">
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'examPaperName', header: 'Đề thi' },
    {
      id: 'time',
      header: 'Thời gian',
      cell: ({ row }) => (
        <span className="text-sm">
          {new Date(row.original.examDate).toLocaleDateString('vi-VN')} {row.original.startTime}
        </span>
      ),
    },
    {
      accessorKey: 'durationMinutes',
      header: 'Thời lượng',
      cell: ({ row }) => `${row.original.durationMinutes} phút`,
    },
    { accessorKey: 'room', header: 'Phòng' },
    {
      id: 'students',
      header: 'Học sinh',
      cell: ({ row }) => (
        <span>
          {row.original.studentCount}
          {row.original.maxStudents ? `/${row.original.maxStudents}` : ''}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge semantic={STATUS_VARIANTS[row.original.status]} dot>
          {STATUS_LABELS[row.original.status]}
        </AppBadge>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/sessions/${sessionId}/exams/${row.original.id}/students`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Học sinh">
              <Users className="h-3 w-3" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Chỉnh sửa">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" title="Xóa"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title={`Ca thi – ${sessionName}`}
        breadcrumbs={[{ label: 'Tổ chức thi', href: '/exam/sessions' }, { label: 'Ca thi' }]}
        actions={[
          { label: 'Thêm ca thi', icon: <Plus className="h-4 w-4" />, onClick: () => setAddOpen(true) },
          { label: 'Import Excel', variant: 'outline', icon: <Upload className="h-4 w-4" />, href: `/exam/sessions/${sessionId}/exams/import` },
        ]}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : (
        <DataTable data={sessionExams} columns={columns} pageSize={20} />
      )}

      {/* Add session exam dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm ca thi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField name="name" label="Tên ca thi" required>
              <Input placeholder="VD: Ca 1 – Sáng" />
            </FormField>
            <FormField name="examPaperId" label="Đề thi" required>
              <Select>
                <SelectTrigger><SelectValue placeholder="Chọn đề thi" /></SelectTrigger>
                <SelectContent>
                  {availableExams.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="examDate" label="Ngày thi" required>
                <Input type="date" />
              </FormField>
              <FormField name="startTime" label="Giờ bắt đầu" required>
                <Input type="time" />
              </FormField>
            </div>
            <FormField name="durationMinutes" label="Thời gian (phút)" required>
              <Input type="number" defaultValue="45" min={15} />
            </FormField>
            <FormField name="room" label="Phòng thi">
              <Input placeholder="VD: P.101" />
            </FormField>
            <FormField name="maxStudents" label="Số HS tối đa">
              <Input type="number" defaultValue="40" min={1} />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="cursor-pointer">Hủy</Button>
            <Button className="cursor-pointer" onClick={() => { toast.success('Đã thêm ca thi'); setAddOpen(false) }}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        onConfirm={() => {
          if (deleteId) {
            deleteMut.mutate(deleteId, {
              onSuccess: () => { toast.success('Đã xóa ca thi'); setDeleteId(null) },
              onError: () => toast.error('Xóa thất bại'),
            })
          }
        }}
        title="Xóa ca thi"
        description="Xóa ca thi này và tất cả dữ liệu học sinh liên quan?"
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  )
}
