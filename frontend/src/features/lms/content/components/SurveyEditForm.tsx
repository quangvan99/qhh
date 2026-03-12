'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite/page-header'
import { AppInput } from '@/components/base/app-input'
import { AppButton } from '@/components/base/app-button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SurveyBuilder } from './SurveyBuilder'
import { toast } from 'sonner'
import type { SurveyQuestion } from '../types/content.types'

interface SurveyEditFormProps {
  classId: string
  groupId: string
  surveyId: string
}

const mockQuestions: SurveyQuestion[] = [
  {
    id: 'q1',
    type: 'radio',
    content: 'Bạn đánh giá chất lượng bài giảng như thế nào?',
    required: true,
    order: 1,
    options: [
      { id: 'o1', label: 'Rất tốt' },
      { id: 'o2', label: 'Tốt' },
      { id: 'o3', label: 'Trung bình' },
      { id: 'o4', label: 'Kém' },
    ],
  },
  {
    id: 'q2',
    type: 'checkbox',
    content: 'Bạn muốn cải thiện điều gì? (chọn nhiều)',
    required: false,
    order: 2,
    options: [
      { id: 'o5', label: 'Nội dung bài giảng' },
      { id: 'o6', label: 'Phương pháp giảng dạy' },
      { id: 'o7', label: 'Tài liệu học tập' },
      { id: 'o8', label: 'Bài tập thực hành' },
    ],
  },
  {
    id: 'q3',
    type: 'text',
    content: 'Góp ý thêm cho giảng viên',
    required: false,
    order: 3,
    placeholder: 'Nhập ý kiến của bạn...',
    maxLength: 500,
  },
]

export function SurveyEditForm({ classId, groupId, surveyId }: SurveyEditFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('Khảo sát chất lượng bài giảng')
  const [anonymous, setAnonymous] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const [questions, setQuestions] = useState<SurveyQuestion[]>(mockQuestions)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      toast.success('Đã cập nhật khảo sát')
      router.push(`/lms/classes/${classId}/content/${groupId}/survey`)
    }, 800)
  }

  return (
    <div>
      <PageHeader
        title="Chỉnh sửa khảo sát"
        breadcrumbs={[
          { label: 'LMS', href: '/lms' },
          { label: 'Nội dung', href: `/lms/classes/${classId}/content` },
          { label: 'Khảo sát', href: `/lms/classes/${classId}/content/${groupId}/survey` },
          { label: 'Chỉnh sửa' },
        ]}
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <AppInput label="Tiêu đề khảo sát" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." />
          <div className="flex flex-col gap-3 justify-end">
            <div className="flex items-center gap-3">
              <Switch checked={anonymous} onCheckedChange={(v) => setAnonymous(!!v)} id="editAnon" />
              <Label htmlFor="editAnon" className="cursor-pointer">Ẩn danh</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={showResults} onCheckedChange={(v) => setShowResults(!!v)} id="editResults" />
              <Label htmlFor="editResults" className="cursor-pointer">Hiện kết quả cho HS</Label>
            </div>
          </div>
        </div>

        <SurveyBuilder questions={questions} onChange={setQuestions} />

        <div className="flex gap-2 justify-end">
          <AppButton variant="outline" onClick={() => router.back()}>Hủy</AppButton>
          <AppButton module="lms" loading={saving} disabled={!title || questions.length === 0} onClick={handleSave}>
            Cập nhật khảo sát
          </AppButton>
        </div>
      </div>
    </div>
  )
}
