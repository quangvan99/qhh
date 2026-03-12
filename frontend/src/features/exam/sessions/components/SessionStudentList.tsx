'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Upload, Download, Settings, UserPlus, Eye, Trash2, Search } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/components/composite/form-field'
import { toast } from 'sonner'
import Link from 'next/link'
import type { SessionStudent, AttemptStatus } from '../types'
import {
  useGetSessionStudents,
  useRemoveSessionStudent,
  useGetSessionExams,
  useUpdateStudentException,
} from '../hooks'
import { AddStudentFromSystemModal } from './AddStudentFromSystemModal'

const ATTEMPT_LABELS: Record<AttemptStatus, string> = {
  not_started: 'Chưa thi',
  in_progress: 'Đang thi',
  submitted: 'Đã nộp',
  graded: 'Đã chấm',
}
const ATTEMPT_VARIANTS: Record<AttemptStatus, 'neutral' | 'warning' | 'info' | 'success'> = {
  not_started: 'neutral',
  in_progress: 'warning',
  submitted: 'info',
  graded: 'success',
}

export function SessionStudentList({ sessionId, examId }: { sessionId: string; examId: string }) {
  const [exceptionStudent, setExceptionStudent] = useState<SessionStudent | null>(null)
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [extraTime, setExtraTime] = useState(0)
  const [exceptionNote, setExceptionNote] = useState('')

  const { data: studentsData, isLoading } = useGetSessionStudents(sessionId, examId)
  const { data: examsData } = useGetSessionExams(sessionId)
  const removeMut = useRemoveSessionStudent(sessionId, examId)
  const exceptionMut = useUpdateStudentException(sessionId, examId)

  const allStudents = studentsData?.data ?? []
  const examName = examsData?.data?.find((e) => e.id === examId)?.name ?? 'Ca thi'

  const students = search
    ? allStudents.filter(
        (s) =>
          s.studentName.toLowerCase().includes(search.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
          s.className.toLowerCase().includes(search.toLowerCase())
      )
    : allStudents

  // Stats
  const total = allStudents.length
  const graded = allStudents.filter((s) => s.attemptStatus === 'graded').length
  const submitted = allStudents.filter((s) => s.attemptStatus === 'submitted').length
  const notStarted = allStudents.filter((s) => s.attemptStatus === 'not_started').length
  const withException = allStudents.filter((s) => s.extraTimeMinutes > 0).length

  const openException = (s: SessionStudent) => {
    setExceptionStudent(s)
    setExtraTime(s.extraTimeMinutes)
    setExceptionNote(s.exceptionNote ?? '')
  }

  const saveException = () => {
    if (!exceptionStudent) return
    exceptionMut.mutate(
      {
        studentId: exceptionStudent.studentId,
        extraTimeMinutes: extraTime,
        extraAttempts: exceptionStudent.extraAttempts,
        note: exceptionNote,
      },
      {
        onSuccess: () => {
          toast.success('Đã lưu ngoại lệ')
          setExceptionStudent(null)
        },
        onError: () => toast.error('Lưu thất bại'),
      }
    )
  }

  const columns: ColumnDef<SessionStudent, unknown>[] = [
    { accessorKey: 'registrationNumber', header: 'SBD', size: 70 },
    {
      accessorKey: 'studentName',
      header: 'Học sinh',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AppAvatar name={row.original.studentName} size="xs" role="student" />
          <div>
            <p className="font-medium">{row.original.studentName}</p>
            <p className="text-xs text-muted-foreground">{row.original.studentCode}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'className', header: 'Lớp', size: 80 },
    { accessorKey: 'room', header: 'Phòng', size: 80 },
    { accessorKey: 'seatNumber', header: 'Chỗ ngồi', size: 70 },
    {
      id: 'exception',
      header: 'Ngoại lệ',
      size: 100,
      cell: ({ row }) =>
        row.original.extraTimeMinutes > 0 ? (
          <AppBadge semantic="warning" size="sm">+{row.original.extraTimeMinutes} phút</AppBadge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      accessorKey: 'attemptStatus',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge semantic={ATTEMPT_VARIANTS[row.original.attemptStatus]} dot>
          {ATTEMPT_LABELS[row.original.attemptStatus]}
        </AppBadge>
      ),
    },
    {
      accessorKey: 'score',
      header: 'Điểm',
      size: 70,
      cell: ({ row }) =>
        row.original.score !== null ? (
          <span className="font-medium">{row.original.score.toFixed(1)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      size: 160,
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students/${s.studentId}`}>
              <Button variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs" title="Hồ sơ">
                <Eye className="h-3 w-3 mr-1" /> Hồ sơ
              </Button>
            </Link>
            {s.attemptId && (
              <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students/${s.studentId}/submission`}>
                <Button variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs">
                  Bài làm
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 cursor-pointer text-xs text-amber-600"
              onClick={() => openException(s)}
              title="Thiết lập ngoại lệ"
            >
              <Settings className="h-3 w-3 mr-1" /> Ngoại lệ
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 cursor-pointer text-destructive"
              onClick={() =>
                removeMut.mutate(s.studentId, {
                  onSuccess: () => toast.success('Đã xóa học sinh khỏi ca thi'),
                  onError: () => toast.error('Xóa thất bại'),
                })
              }
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title={`Học sinh – ${examName}`}
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Học sinh' },
        ]}
        actions={[
          { label: 'Thêm học sinh', icon: <UserPlus className="h-4 w-4" />, onClick: () => setAddStudentOpen(true) },
          {
            label: 'Import danh sách',
            variant: 'outline',
            icon: <Upload className="h-4 w-4" />,
            href: `/exam/sessions/${sessionId}/exams/${examId}/students/import`,
          },
          {
            label: 'Import ngoại lệ',
            variant: 'outline',
            icon: <Upload className="h-4 w-4" />,
            href: `/exam/sessions/${sessionId}/exams/${examId}/students/exceptions/import`,
          },
          {
            label: 'Xuất Excel',
            variant: 'outline',
            icon: <Download className="h-4 w-4" />,
            onClick: () => toast.info('Đang xuất...'),
          },
        ]}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Tổng HS', value: total, color: 'text-foreground' },
          { label: 'Chưa thi', value: notStarted, color: 'text-muted-foreground' },
          { label: 'Đã nộp', value: submitted, color: 'text-blue-600' },
          { label: 'Đã chấm', value: graded, color: 'text-emerald-600' },
          { label: 'Ngoại lệ', value: withException, color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-md border p-3 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm học sinh..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <DataTable data={students} columns={columns} selectable pageSize={25} />
      )}

      {/* Exception dialog */}
      <Dialog open={!!exceptionStudent} onOpenChange={(open) => { if (!open) setExceptionStudent(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ngoại lệ – {exceptionStudent?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {exceptionStudent?.studentCode} · {exceptionStudent?.className}
            </div>
            <FormField name="extraTime" label="Thời gian extra (phút)">
              <Input
                type="number"
                value={extraTime}
                onChange={(e) => setExtraTime(Number(e.target.value))}
                min={0}
                max={120}
                className="w-32"
              />
            </FormField>
            <FormField name="note" label="Ghi chú">
              <Input
                value={exceptionNote}
                onChange={(e) => setExceptionNote(e.target.value)}
                placeholder="VD: Khuyết tật vận động"
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExceptionStudent(null)} className="cursor-pointer">
              Hủy
            </Button>
            <Button className="cursor-pointer" onClick={saveException} disabled={exceptionMut.isPending}>
              Lưu ngoại lệ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add student from system modal */}
      <AddStudentFromSystemModal open={addStudentOpen} onOpenChange={setAddStudentOpen} />
    </div>
  )
}
