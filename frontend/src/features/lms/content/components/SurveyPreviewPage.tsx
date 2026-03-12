'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { AppBadge } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { Eye } from 'lucide-react'

interface SurveyPreviewPageProps {
  classId: string
  groupId: string
  surveyId: string
}

const mockSurvey = {
  title: 'Khảo sát chất lượng bài giảng',
  description: 'Vui lòng dành vài phút để đánh giá chất lượng bài giảng. Phản hồi của bạn giúp chúng tôi cải thiện chương trình học.',
  questions: [
    {
      id: 'q1',
      type: 'radio' as const,
      content: 'Bạn đánh giá chất lượng bài giảng như thế nào?',
      required: true,
      options: ['Rất tốt', 'Tốt', 'Trung bình', 'Kém'],
    },
    {
      id: 'q2',
      type: 'checkbox' as const,
      content: 'Bạn muốn cải thiện điều gì? (chọn nhiều)',
      required: false,
      options: ['Nội dung bài giảng', 'Phương pháp giảng dạy', 'Tài liệu học tập', 'Bài tập thực hành'],
    },
    {
      id: 'q3',
      type: 'text' as const,
      content: 'Góp ý thêm cho giảng viên',
      required: false,
      options: [],
    },
  ],
}

export function SurveyPreviewPage({ classId, groupId, surveyId }: SurveyPreviewPageProps) {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="Preview khảo sát"
        breadcrumbs={[
          { label: 'LMS', href: '/lms' },
          { label: 'Nội dung', href: `/lms/classes/${classId}/content` },
          { label: 'Khảo sát', href: `/lms/classes/${classId}/content/${groupId}/survey` },
          { label: 'Preview' },
        ]}
        actions={[
          { label: 'Đóng preview', onClick: () => router.back() },
        ]}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Preview Badge */}
        <div className="flex justify-center">
          <AppBadge semantic="warning" size="lg">
            <Eye className="h-4 w-4 mr-1" /> Preview - Không ghi điểm
          </AppBadge>
        </div>

        {/* Survey Header */}
        <Card>
          <CardHeader>
            <CardTitle>{mockSurvey.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{mockSurvey.description}</p>
          </CardContent>
        </Card>

        {/* Questions */}
        {mockSurvey.questions.map((q, idx) => (
          <Card key={q.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-2">
                <span className="font-medium text-sm">Câu {idx + 1}.</span>
                <span className="text-sm">{q.content}</span>
                {q.required && <span className="text-red-500">*</span>}
              </div>

              {q.type === 'radio' && (
                <RadioGroup>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} id={`${q.id}-${oi}`} disabled />
                      <Label htmlFor={`${q.id}-${oi}`} className="text-sm">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === 'checkbox' && (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <Checkbox id={`${q.id}-${oi}`} disabled />
                      <Label htmlFor={`${q.id}-${oi}`} className="text-sm">{opt}</Label>
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'text' && (
                <Textarea placeholder="Nhập câu trả lời..." disabled rows={3} />
              )}
            </CardContent>
          </Card>
        ))}

        {/* Submit (disabled in preview) */}
        <div className="flex justify-center">
          <Button disabled size="lg" className="cursor-not-allowed">
            Gửi khảo sát (Preview)
          </Button>
        </div>
      </div>
    </div>
  )
}
