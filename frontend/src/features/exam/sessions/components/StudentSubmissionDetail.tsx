'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Clock, Award } from 'lucide-react'
import Link from 'next/link'

// ── Types ──
interface QuestionAnswer {
  id: string
  number: number
  type: 'mcq' | 'essay'
  question: string
  options?: { id: string; label: string; text: string }[]
  selectedOptionIds?: string[]
  correctOptionIds?: string[]
  textAnswer?: string
  isCorrect?: boolean
  score: number | null
  maxScore: number
}

// ── Mock 10 MCQ + 2 Essay ──
const optA = ['Mitochondria', 'H₂O', 'Newton', 'DNA', 'Quang hợp', 'Vecto', 'Electron', 'Oxi', 'Cacbon', 'Protein']
const optB = ['Ribosome', 'CO₂', 'Einstein', 'RNA', 'Hô hấp', 'Ma trận', 'Proton', 'Nitơ', 'Hydro', 'Lipid']
const optC = ['Nucleus', 'O₂', 'Galileo', 'mRNA', 'Hấp thụ', 'Tích phân', 'Neutron', 'Heli', 'Sắt', 'Glucid']
const optD = ['Golgi', 'NaCl', 'Copernicus', 'tRNA', 'Trao đổi chất', 'Đạo hàm', 'Photon', 'Neon', 'Đồng', 'Vitamin']
const questions = [
  'Bào quan nào được gọi là "nhà máy năng lượng" của tế bào?',
  'Công thức hóa học của nước là gì?',
  'Ai phát minh ra 3 định luật về chuyển động?',
  'Axit nucleic nào mang thông tin di truyền?',
  'Quá trình tổng hợp chất hữu cơ từ CO₂ và H₂O nhờ ánh sáng gọi là?',
  'Đại lượng có cả độ lớn và hướng gọi là?',
  'Hạt mang điện tích âm trong nguyên tử là?',
  'Nguyên tố nào chiếm 21% trong không khí?',
  'Nguyên tố nào là thành phần chính của kim cương?',
  'Chất nào cấu tạo nên enzyme?',
]

const mockAnswers: QuestionAnswer[] = [
  ...Array.from({ length: 10 }, (_, i) => {
    const opts = [
      { id: `q${i}-a`, label: 'A', text: optA[i] ?? '' },
      { id: `q${i}-b`, label: 'B', text: optB[i] ?? '' },
      { id: `q${i}-c`, label: 'C', text: optC[i] ?? '' },
      { id: `q${i}-d`, label: 'D', text: optD[i] ?? '' },
    ]
    const correctId = `q${i}-a`
    const selectedId = i % 4 === 3 ? `q${i}-b` : `q${i}-a`
    return {
      id: `q-${i}`,
      number: i + 1,
      type: 'mcq' as const,
      question: questions[i] ?? '',
      options: opts,
      selectedOptionIds: [selectedId],
      correctOptionIds: [correctId],
      isCorrect: selectedId === correctId,
      score: selectedId === correctId ? 1 : 0,
      maxScore: 1,
    }
  }),
  {
    id: 'q-10', number: 11, type: 'essay',
    question: 'Trình bày quá trình quang hợp ở thực vật. Nêu vai trò của quang hợp đối với sự sống trên Trái Đất.',
    textAnswer: 'Quang hợp là quá trình tổng hợp chất hữu cơ từ CO₂ và H₂O nhờ năng lượng ánh sáng. Quá trình gồm 2 pha: pha sáng diễn ra ở thylakoid và pha tối diễn ra ở chất nền lục lạp. Vai trò: cung cấp O₂ cho hô hấp, tạo chất hữu cơ nuôi sống sinh vật, điều hòa khí hậu.',
    isCorrect: undefined, score: null, maxScore: 3,
  },
  {
    id: 'q-11', number: 12, type: 'essay',
    question: 'Phân tích ý nghĩa của các định luật Newton trong đời sống. Cho ví dụ minh họa cho mỗi định luật.',
    textAnswer: 'Định luật 1 Newton: Vật đứng yên sẽ tiếp tục đứng yên nếu không có lực tác dụng. VD: hành khách bị nghiêng khi xe phanh gấp. Định luật 2: F=ma, lực càng lớn gia tốc càng lớn. VD: đẩy xe nặng cần lực lớn hơn. Định luật 3: Lực và phản lực. VD: khi bơi, đẩy nước ra sau, nước đẩy người về trước.',
    isCorrect: undefined, score: null, maxScore: 4,
  },
]

interface StudentSubmissionDetailProps {
  sessionId: string
  examId: string
  studentId: string
}

export function StudentSubmissionDetail({ sessionId, examId, studentId }: StudentSubmissionDetailProps) {
  const [essayScores, setEssayScores] = useState<Record<string, string>>({})

  const mcqQuestions = mockAnswers.filter((a) => a.type === 'mcq')
  const essayQuestions = mockAnswers.filter((a) => a.type === 'essay')
  const mcqCorrect = mcqQuestions.filter((a) => a.isCorrect).length
  const mcqTotal = mcqQuestions.length
  const mcqScore = mcqQuestions.reduce((sum, a) => sum + (a.score ?? 0), 0)
  const totalMaxScore = mockAnswers.reduce((sum, a) => sum + a.maxScore, 0)

  const handleSaveGrading = () => {
    toast.success('Đã lưu điểm chấm tự luận')
  }

  return (
    <div>
      <PageHeader
        title="Chi tiết bài làm"
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Học sinh', href: `/exam/sessions/${sessionId}/exams/${examId}/students` },
          { label: `HS ${studentId}`, href: `/exam/sessions/${sessionId}/exams/${examId}/students/${studentId}` },
          { label: 'Bài làm' },
        ]}
      />

      {/* Header info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <AppAvatar name="Nguyễn Văn An" size="lg" role="student" />
            <div>
              <h2 className="text-lg font-semibold">Nguyễn Văn An</h2>
              <p className="text-sm text-muted-foreground">Lớp 12A1 • Mã báo danh: 001 • Ca thi: Ca 1 - Sáng</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Thời gian nộp</p>
                <p className="text-sm font-medium">15/03/2026 08:38</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Điểm trắc nghiệm</p>
                <p className="text-sm font-medium">{mcqScore}/{mcqTotal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Câu đúng</p>
                <p className="text-sm font-medium">{mcqCorrect}/{mcqTotal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Tổng điểm tối đa</p>
                <p className="text-sm font-medium">{totalMaxScore}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCQ Questions */}
      <h3 className="font-semibold text-base mb-3">Phần trắc nghiệm ({mcqTotal} câu)</h3>
      <div className="space-y-3 mb-8">
        {mcqQuestions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground mr-2">Câu {q.number}.</span>
                  {q.question}
                </p>
                {q.isCorrect ? (
                  <AppBadge semantic="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-1" /> Đúng</AppBadge>
                ) : (
                  <AppBadge semantic="error" size="sm"><XCircle className="h-3 w-3 mr-1" /> Sai</AppBadge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 ml-4">
                {q.options?.map((opt) => {
                  const isSelected = q.selectedOptionIds?.includes(opt.id)
                  const isCorrect = q.correctOptionIds?.includes(opt.id)
                  let className = 'text-sm px-3 py-1.5 rounded border '
                  if (isCorrect) className += 'border-green-300 bg-green-50 text-green-800 '
                  else if (isSelected && !isCorrect) className += 'border-red-300 bg-red-50 text-red-800 '
                  else className += 'border-transparent text-muted-foreground '

                  return (
                    <div key={opt.id} className={className}>
                      <span className="font-medium mr-1">{opt.label}.</span> {opt.text}
                      {isSelected && <span className="ml-1 text-xs">(đã chọn)</span>}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-4">Điểm: {q.score ?? 0}/{q.maxScore}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Essay Questions */}
      <h3 className="font-semibold text-base mb-3">Phần tự luận ({essayQuestions.length} câu)</h3>
      <div className="space-y-4 mb-6">
        {essayQuestions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground mr-2">Câu {q.number}.</span>
                  {q.question}
                </p>
                <AppBadge semantic="neutral" size="sm">Tối đa: {q.maxScore} điểm</AppBadge>
              </div>

              {/* Student answer */}
              <div className="ml-4 mb-3">
                <p className="text-xs text-muted-foreground mb-1">Bài làm của học sinh:</p>
                <div className="bg-muted/50 rounded p-3 text-sm">{q.textAnswer}</div>
              </div>

              {/* Grading */}
              <div className="ml-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Chấm điểm:</span>
                  <Input
                    type="number"
                    min={0}
                    max={q.maxScore}
                    step={0.5}
                    value={essayScores[q.id] ?? ''}
                    onChange={(e) => setEssayScores((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={`0-${q.maxScore}`}
                    className="w-24 h-8"
                  />
                  <span className="text-sm text-muted-foreground">/ {q.maxScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save button */}
      <div className="flex gap-3">
        <Button className="cursor-pointer" onClick={handleSaveGrading}>Lưu điểm chấm</Button>
        <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students/${studentId}`}>
          <Button variant="outline" className="cursor-pointer">Quay lại hồ sơ</Button>
        </Link>
      </div>
    </div>
  )
}
