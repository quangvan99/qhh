'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { AppBadge } from '@/components/base'
import { useGetMyAssignment, useGetMyClass } from '@/features/lms/student/api/student.api'

export default function AssignmentResultPage() {
  const params = useParams<{ classId: string; assignmentId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data: assignment, isLoading } = useGetMyAssignment(params.assignmentId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!assignment) return null

  return (
    <div>
      <PageHeader
        title={`Kết quả — ${assignment.title}`}
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Bài tập', href: `/my-classes/${params.classId}/assignments` },
          { label: 'Kết quả' },
        ]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Kết quả
              <AppBadge semantic={assignment.status === 'graded' ? 'success' : 'info'} size="sm">
                {assignment.status === 'graded' ? 'Đã chấm' : 'Chờ chấm'}
              </AppBadge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.score !== undefined ? (
              <p className="text-4xl font-bold">
                {assignment.score}/{assignment.maxScore}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground">Chưa có điểm</p>
            )}

            {assignment.feedback && (
              <div>
                <p className="text-sm font-medium">Nhận xét giáo viên:</p>
                <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
              </div>
            )}

            {assignment.feedbackFiles && assignment.feedbackFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium">File phản hồi:</p>
                <ul className="space-y-1">
                  {assignment.feedbackFiles.map((f: { name: string; url: string }, i: number) => (
                    <li key={i}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bài đã nộp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {assignment.submittedAt && (
              <p className="text-muted-foreground">
                Nộp lúc: {new Date(assignment.submittedAt).toLocaleString('vi-VN')}
              </p>
            )}
            {assignment.submissionFiles && assignment.submissionFiles.length > 0 && (
              <div>
                <p className="font-medium">File đính kèm:</p>
                <ul className="space-y-1">
                  {assignment.submissionFiles.map((f: { name: string; url: string }, i: number) => (
                    <li key={i}>
                      <a href={f.url} className="text-blue-600 hover:underline">{f.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {assignment.submissionText && (
              <div>
                <p className="font-medium">Nội dung:</p>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.submissionText }} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Link href={`/my-classes/${params.classId}/assignments`}>
            <Button variant="outline" className="cursor-pointer">Quay lại</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
