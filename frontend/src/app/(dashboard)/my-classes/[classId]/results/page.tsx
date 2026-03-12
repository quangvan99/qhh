'use client'

import { useParams } from 'next/navigation'
import { BookOpen, FileText, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { StatGrid } from '@/components/patterns'
import { useGetMyClass, useGetMyClassResult } from '@/features/lms/student/api/student.api'

export default function ClassResultsPage() {
  const params = useParams<{ classId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data: result, isLoading } = useGetMyClassResult(params.classId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (!result || !cls) return null

  return (
    <div>
      <PageHeader
        title="Kết quả học tập"
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls.name, href: `/my-classes/${cls.id}` },
          { label: 'Kết quả' },
        ]}
      />

      <StatGrid
        cols={3}
        stats={[
          {
            title: 'Tiến độ nội dung',
            value: `${result.contentProgress}%`,
            icon: <BookOpen className="h-5 w-5" />,
            module: 'lms',
          },
          {
            title: 'Điểm BT trung bình',
            value: result.avgAssignmentScore ?? '-',
            icon: <FileText className="h-5 w-5" />,
            module: 'lms',
          },
          {
            title: 'Điểm thi',
            value: result.avgExamScore ?? '-',
            icon: <Award className="h-5 w-5" />,
            module: 'exam',
          },
        ]}
        className="mb-6"
      />

      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>Nội dung đã học</span>
          <span>{result.completedContent}/{result.totalContent}</span>
        </div>
        <Progress value={result.contentProgress} />
      </div>

      {result.assignments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kết quả bài tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Tên bài tập</th>
                    <th className="pb-2 font-medium">Hạn nộp</th>
                    <th className="pb-2 font-medium">Điểm</th>
                    <th className="pb-2 font-medium">Nhận xét</th>
                  </tr>
                </thead>
                <tbody>
                  {result.assignments.map((a: { id: string; title: string; deadline: string; score?: number; feedback?: string }) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{a.title}</td>
                      <td className="py-2 text-muted-foreground">
                        {new Date(a.deadline).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-2">{a.score ?? '-'}</td>
                      <td className="py-2 text-muted-foreground">{a.feedback ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {result.exams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả thi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Ca thi</th>
                    <th className="pb-2 font-medium">Ngày</th>
                    <th className="pb-2 font-medium">Điểm</th>
                    <th className="pb-2 font-medium">Xếp hạng</th>
                  </tr>
                </thead>
                <tbody>
                  {result.exams.map((e: { id: string; title: string; date: string; score?: number; rank?: number }) => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{e.title}</td>
                      <td className="py-2 text-muted-foreground">
                        {new Date(e.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-2">{e.score ?? '-'}</td>
                      <td className="py-2">{e.rank ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
