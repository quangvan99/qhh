'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'

export function AssignmentForm({ classId, assignmentId }: { classId: string; assignmentId?: string }) {
  const isEdit = !!assignmentId
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submissionType, setSubmissionType] = useState('file')
  const [maxScore, setMaxScore] = useState('10')
  const [allowLate, setAllowLate] = useState(false)
  const [allowResubmit, setAllowResubmit] = useState(false)

  const handleSave = (status: 'draft' | 'open') => {
    if (!title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return }
    toast.success(status === 'draft' ? 'Đã lưu nháp' : 'Đã xuất bản bài tập')
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa bài tập' : 'Tạo bài tập mới'}
        breadcrumbs={[
          { label: 'Lớp học', href: '/lms/classes' },
          { label: 'Bài tập', href: `/lms/classes/${classId}/assignments` },
          { label: isEdit ? 'Sửa' : 'Tạo mới' },
        ]}
        actions={[
          { label: 'Lưu nháp', variant: 'outline', onClick: () => handleSave('draft') },
          { label: 'Xuất bản', onClick: () => handleSave('open') },
        ]}
      />

      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Thông tin bài tập</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField name="title" label="Tiêu đề" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài tập..." />
            </FormField>
            <FormField name="description" label="Mô tả / Yêu cầu" required>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Nhập mô tả chi tiết..." />
            </FormField>
            <FormField name="submissionType" label="Loại nộp">
              <RadioGroup value={submissionType} onValueChange={setSubmissionType} className="flex gap-4">
                <div className="flex items-center gap-2"><RadioGroupItem value="file" id="st-file" /><Label htmlFor="st-file">Nộp file</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="text" id="st-text" /><Label htmlFor="st-text">Văn bản</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="both" id="st-both" /><Label htmlFor="st-both">Cả hai</Label></div>
              </RadioGroup>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Thời gian & Điểm</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="openDate" label="Ngày mở" required><Input type="datetime-local" /></FormField>
              <FormField name="deadline" label="Hạn nộp" required><Input type="datetime-local" /></FormField>
            </div>
            <FormField name="maxScore" label="Điểm tối đa">
              <Input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} min={0} max={100} className="w-32" />
            </FormField>
            <div className="flex items-center gap-3">
              <Switch checked={allowLate} onCheckedChange={setAllowLate} id="allowLate" />
              <Label htmlFor="allowLate">Cho phép nộp muộn</Label>
            </div>
            {allowLate && <FormField name="lateDeadline" label="Hạn nộp muộn"><Input type="datetime-local" /></FormField>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cài đặt nâng cao</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={allowResubmit} onCheckedChange={setAllowResubmit} id="resubmit" />
              <Label htmlFor="resubmit">Cho phép nộp lại</Label>
            </div>
            {allowResubmit && <FormField name="maxResubmit" label="Số lần nộp tối đa"><Input type="number" defaultValue="3" min={1} className="w-32" /></FormField>}
            <div className="flex items-center gap-3">
              <Switch id="hideScore" />
              <Label htmlFor="hideScore">Ẩn điểm cho đến khi GV publish</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
