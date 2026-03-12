'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/composite/form-field'
import { Shuffle, MousePointerClick } from 'lucide-react'

export interface SectionFormData {
  id: string
  name: string
  type: 'random' | 'specific'
  questionCount: number
  pointPerQuestion: number
}

interface ExamSectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: SectionFormData) => void
  initialData?: SectionFormData | null
  onOpenRandomConfig?: () => void
  onOpenQuestionPicker?: () => void
}

export function ExamSectionModal({
  open, onOpenChange, onSave, initialData,
  onOpenRandomConfig, onOpenQuestionPicker,
}: ExamSectionModalProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [type, setType] = useState<'random' | 'specific'>(initialData?.type ?? 'random')
  const [questionCount, setQuestionCount] = useState(String(initialData?.questionCount ?? 10))
  const [pointPerQuestion, setPointPerQuestion] = useState(String(initialData?.pointPerQuestion ?? 0.25))
  const [questionType, setQuestionType] = useState('single_choice')

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      id: initialData?.id ?? String(Date.now()),
      name,
      type,
      questionCount: Number(questionCount),
      pointPerQuestion: Number(pointPerQuestion),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Sửa phần thi' : 'Thêm phần thi'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormField name="sec-name" label="Tên phần thi" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Phần I - Trắc nghiệm" />
          </FormField>

          <FormField name="sec-qtype" label="Loại câu hỏi">
            <Select value={questionType} onValueChange={(v) => v && setQuestionType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single_choice">Trắc nghiệm một đáp án</SelectItem>
                <SelectItem value="multi_choice">Nhiều lựa chọn</SelectItem>
                <SelectItem value="essay">Tự luận</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="sec-type" label="Hình thức chọn câu hỏi">
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'random' | 'specific')} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="random" id="sec-random" />
                <Label htmlFor="sec-random" className="cursor-pointer flex items-center gap-1">
                  <Shuffle className="h-3 w-3" /> Ngẫu nhiên
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="specific" id="sec-specific" />
                <Label htmlFor="sec-specific" className="cursor-pointer flex items-center gap-1">
                  <MousePointerClick className="h-3 w-3" /> Đích danh
                </Label>
              </div>
            </RadioGroup>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="sec-count" label="Số câu hỏi">
              <Input type="number" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} min={1} />
            </FormField>
            <FormField name="sec-point" label="Điểm/câu">
              <Input type="number" value={pointPerQuestion} onChange={(e) => setPointPerQuestion(e.target.value)} step={0.25} min={0} />
            </FormField>
          </div>

          {type === 'random' && onOpenRandomConfig && (
            <Button variant="outline" onClick={onOpenRandomConfig} className="cursor-pointer w-full">
              <Shuffle className="h-3 w-3 mr-2" /> Cấu hình bộ lọc ngẫu nhiên
            </Button>
          )}

          {type === 'specific' && onOpenQuestionPicker && (
            <Button variant="outline" onClick={onOpenQuestionPicker} className="cursor-pointer w-full">
              <MousePointerClick className="h-3 w-3 mr-2" /> Chọn câu hỏi
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleSave} disabled={!name.trim()} className="cursor-pointer">Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
