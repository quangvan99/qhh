'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/composite/page-header'
import { Users, CheckCircle } from 'lucide-react'

interface SurveyReportPageProps {
  classId: string
  groupId: string
  surveyId: string
}

const mockReport = {
  title: 'Khảo sát chất lượng bài giảng',
  totalParticipants: 32,
  totalStudents: 40,
  completionRate: 80,
  questions: [
    {
      id: 'q1',
      content: 'Bạn đánh giá chất lượng bài giảng như thế nào?',
      type: 'radio' as const,
      results: [
        { label: 'Rất tốt', count: 12, percent: 37.5 },
        { label: 'Tốt', count: 14, percent: 43.75 },
        { label: 'Trung bình', count: 5, percent: 15.63 },
        { label: 'Kém', count: 1, percent: 3.12 },
      ],
    },
    {
      id: 'q2',
      content: 'Bạn muốn cải thiện điều gì? (chọn nhiều)',
      type: 'checkbox' as const,
      results: [
        { label: 'Nội dung bài giảng', count: 8, percent: 25 },
        { label: 'Phương pháp giảng dạy', count: 18, percent: 56.25 },
        { label: 'Tài liệu học tập', count: 15, percent: 46.88 },
        { label: 'Bài tập thực hành', count: 22, percent: 68.75 },
      ],
    },
    {
      id: 'q3',
      content: 'Góp ý thêm cho giảng viên',
      type: 'text' as const,
      results: [
        { label: 'Cần thêm bài tập thực hành', count: 1, percent: 0 },
        { label: 'Giảng viên rất nhiệt tình', count: 1, percent: 0 },
        { label: 'Nên có thêm video minh họa', count: 1, percent: 0 },
      ],
    },
  ],
}

export function SurveyReportPage({ classId, groupId, surveyId }: SurveyReportPageProps) {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title={`Báo cáo: ${mockReport.title}`}
        breadcrumbs={[
          { label: 'LMS', href: '/lms' },
          { label: 'Nội dung', href: `/lms/classes/${classId}/content` },
          { label: 'Khảo sát', href: `/lms/classes/${classId}/content/${groupId}/survey` },
          { label: 'Báo cáo' },
        ]}
        actions={[
          { label: 'Quay lại', onClick: () => router.back() },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số người tham gia</p>
                <p className="text-2xl font-bold">{mockReport.totalParticipants} <span className="text-sm font-normal text-muted-foreground">/ {mockReport.totalStudents}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2.5">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold">{mockReport.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Reports */}
      <div className="space-y-6">
        {mockReport.questions.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-base">
                Câu {idx + 1}: {q.content}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.type === 'text' ? (
                <div className="space-y-2">
                  {q.results.map((r, ri) => (
                    <div key={ri} className="rounded-lg border p-3 text-sm">
                      {r.label}
                    </div>
                  ))}
                </div>
              ) : (
                q.results.map((r, ri) => (
                  <div key={ri} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{r.label}</span>
                      <span className="font-medium">{r.count} ({r.percent.toFixed(1)}%)</span>
                    </div>
                    <Progress value={r.percent} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
