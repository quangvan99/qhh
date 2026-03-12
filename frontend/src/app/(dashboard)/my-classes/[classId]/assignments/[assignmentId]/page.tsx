'use client'

import { useParams } from 'next/navigation'
import { Clock, Download, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { AppBadge } from '@/components/base'
import { useMemo, useState } from 'react'
import { useGetMyAssignment, useGetMyClass } from '@/features/lms/student/api/student.api'

export default function AssignmentDetailPage() {
  const params = useParams<{ classId: string; assignmentId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data: assignment, isLoading } = useGetMyAssignment(params.assignmentId)

  const [now] = useState(() => Date.now())
  const deadline = useMemo(() => assignment ? new Date(assignment.deadline) : null, [assignment])
  const isExpired = useMemo(() => deadline ? deadline.getTime() < now : false, [deadline, now])
  const canSubmit = assignment?.status === 'pending' && !isExpired

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!assignment) return null

  return (
    <div>
      <PageHeader
        title={assignment.title}
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Bài tập', href: `/my-classes/${params.classId}/assignments` },
          { label: assignment.title },
        ]}
        actions={canSubmit ? [
          { label: 'Nộp bài', href: `/my-classes/${params.classId}/assignments/${params.assignmentId}/submit` },
        ] : []}
      />

      <div className="space-y-6">
        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bài tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Hạn nộp: {deadline!.toLocaleString('vi-VN')}</span>
            </div>
            <p>Điểm tối đa: {assignment.maxScore}</p>
            <p>Hình thức nộp: {assignment.type === 'text' ? 'Văn bản' : assignment.type === 'file' ? 'File' : 'Cả hai'}</p>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Đề bài</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: assignment.description }} />
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Tệp đính kèm:</p>
                <ul className="space-y-1">
                  {assignment.attachments.map((f: { name: string; url: string }, i: number) => (
                    <li key={i}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <Download className="h-3.5 w-3.5" />
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission */}
        {(assignment.status === 'submitted' || assignment.status === 'graded') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Bài nộp của tôi
                <AppBadge semantic={assignment.status === 'graded' ? 'success' : 'info'} size="sm">
                  {assignment.status === 'graded' ? 'Đã chấm' : 'Đã nộp'}
                </AppBadge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {assignment.submittedAt && (
                <p className="text-muted-foreground">
                  Nộp lúc: {new Date(assignment.submittedAt).toLocaleString('vi-VN')}
                </p>
              )}
              {assignment.score !== undefined && (
                <p className="text-lg font-bold">Điểm: {assignment.score}/{assignment.maxScore}</p>
              )}
              {assignment.feedback && (
                <div>
                  <p className="font-medium">Nhận xét GV:</p>
                  <p className="text-muted-foreground">{assignment.feedback}</p>
                </div>
              )}
              {assignment.submissionFiles && assignment.submissionFiles.length > 0 && (
                <div>
                  <p className="font-medium">File đã nộp:</p>
                  <ul className="space-y-1">
                    {assignment.submissionFiles.map((f: { name: string; url: string }, i: number) => (
                      <li key={i}>
                        <a href={f.url} className="flex items-center gap-1 text-blue-600 hover:underline">
                          <FileText className="h-3.5 w-3.5" />{f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {assignment.allowResubmit && (
                <a href={`/my-classes/${params.classId}/assignments/${params.assignmentId}/submit`}>
                  <Button variant="outline" size="sm" className="cursor-pointer">Nộp lại</Button>
                </a>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
