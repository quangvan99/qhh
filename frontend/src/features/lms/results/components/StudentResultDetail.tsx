'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ContentProgress, StudentAssignmentResult, StudentExamResult } from '../types'

const mockContent: ContentProgress[] = Array.from({ length: 10 }, (_, i) => ({
  id: `c-${i}`, contentGroupName: `Chương ${Math.floor(i / 3) + 1}`, contentName: `Bài ${i + 1}: Nội dung học`,
  contentType: (['scorm', 'video', 'text', 'file'] as const)[i % 4] as ContentProgress['contentType'], accessCount: Math.floor(Math.random() * 10) + 1,
  studyTimeMinutes: Math.floor(Math.random() * 120), score: i % 2 === 0 ? Math.round(Math.random() * 100) : null,
  completed: i < 6, lastAccessedAt: '2026-03-10T10:30:00Z',
}))

const mockAssignments: StudentAssignmentResult[] = Array.from({ length: 5 }, (_, i) => ({
  id: `a-${i}`, assignmentName: `Bài tập ${i + 1}`, deadline: '2026-03-15', submittedAt: i < 3 ? '2026-03-14' : undefined,
  score: i < 3 ? Math.round(Math.random() * 10 * 10) / 10 : null, feedback: i < 2 ? 'Bài làm tốt' : undefined,
}))

const mockExams: StudentExamResult[] = Array.from({ length: 3 }, (_, i) => ({
  id: `e-${i}`, sessionName: `Ca thi ${i + 1}`, takenAt: '2026-03-10', score: Math.round(Math.random() * 10 * 10) / 10,
  rank: i + 1, attemptId: `att-${i}`,
}))

const contentCols: ColumnDef<ContentProgress, unknown>[] = [
  { accessorKey: 'contentGroupName', header: 'Nhóm' },
  { accessorKey: 'contentName', header: 'Nội dung' },
  { accessorKey: 'contentType', header: 'Loại', cell: ({ row }) => <AppBadge semantic="info">{row.original.contentType.toUpperCase()}</AppBadge> },
  { accessorKey: 'accessCount', header: 'Lần truy cập' },
  { accessorKey: 'studyTimeMinutes', header: 'Thời gian (phút)' },
  { accessorKey: 'score', header: 'Điểm', cell: ({ row }) => row.original.score ?? '—' },
  { accessorKey: 'completed', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={row.original.completed ? 'success' : 'neutral'} dot>{row.original.completed ? 'Hoàn thành' : 'Chưa HT'}</AppBadge> },
]

const assignmentCols: ColumnDef<StudentAssignmentResult, unknown>[] = [
  { accessorKey: 'assignmentName', header: 'Tên bài tập' },
  { accessorKey: 'deadline', header: 'Hạn nộp' },
  { accessorKey: 'submittedAt', header: 'Nộp lúc', cell: ({ row }) => row.original.submittedAt ?? '—' },
  { accessorKey: 'score', header: 'Điểm', cell: ({ row }) => row.original.score?.toFixed(1) ?? '—' },
  { accessorKey: 'feedback', header: 'Nhận xét', cell: ({ row }) => row.original.feedback ?? '—' },
]

const examCols: ColumnDef<StudentExamResult, unknown>[] = [
  { accessorKey: 'sessionName', header: 'Ca thi' },
  { accessorKey: 'takenAt', header: 'Thời điểm' },
  { accessorKey: 'score', header: 'Điểm', cell: ({ row }) => row.original.score?.toFixed(1) ?? '—' },
  { accessorKey: 'rank', header: 'Rank' },
]

export function StudentResultDetail({ classId, studentId }: { classId: string; studentId: string }) {
  return (
    <div>
      <PageHeader
        title="Chi tiết kết quả"
        breadcrumbs={[
          { label: 'Lớp học', href: '/lms/classes' },
          { label: 'Kết quả', href: `/lms/classes/${classId}/results` },
          { label: 'Chi tiết' },
        ]}
        actions={[
          { label: 'Xét hoàn thành', variant: 'default' },
          { label: 'Gửi thông báo', variant: 'outline' },
        ]}
      />

      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <AppAvatar name="Nguyễn Văn A" size="lg" role="student" />
          <div>
            <p className="font-semibold text-lg">Nguyễn Văn A</p>
            <p className="text-sm text-muted-foreground">Mã HS: HS0001 • Lớp: 12A1</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-center"><p className="text-2xl font-bold">8.5</p><p className="text-xs text-muted-foreground">Tổng kết</p></div>
            <AppBadge semantic="success" dot>Hoàn thành</AppBadge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Nội dung học</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="exams">Lịch sử thi</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4">
          <DataTable data={mockContent} columns={contentCols} pageSize={10} />
        </TabsContent>
        <TabsContent value="assignments" className="mt-4">
          <DataTable data={mockAssignments} columns={assignmentCols} pageSize={10} />
        </TabsContent>
        <TabsContent value="exams" className="mt-4">
          <DataTable data={mockExams} columns={examCols} pageSize={10} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
