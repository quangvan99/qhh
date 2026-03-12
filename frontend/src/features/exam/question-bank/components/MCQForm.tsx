'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface OptionItem { id: string; content: string; isCorrect: boolean }

export function MCQForm({ questionId }: { questionId?: string }) {
  const isEdit = !!questionId
  const [questionContent, setQuestionContent] = useState('')
  const [options, setOptions] = useState<OptionItem[]>([
    { id: 'a', content: '', isCorrect: true },
    { id: 'b', content: '', isCorrect: false },
    { id: 'c', content: '', isCorrect: false },
    { id: 'd', content: '', isCorrect: false },
  ])
  const [explanation, setExplanation] = useState('')
  const [mcqType, setMcqType] = useState('single')

  const updateOption = (id: string, content: string) => {
    setOptions((prev) => prev.map((o) => o.id === id ? { ...o, content } : o))
  }

  const setCorrect = (id: string) => {
    if (mcqType === 'single') {
      setOptions((prev) => prev.map((o) => ({ ...o, isCorrect: o.id === id })))
    } else {
      setOptions((prev) => prev.map((o) => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o))
    }
  }

  const addOption = () => {
    const newId = String.fromCharCode(97 + options.length)
    setOptions((prev) => [...prev, { id: newId, content: '', isCorrect: false }])
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) { toast.error('Cần ít nhất 2 đáp án'); return }
    setOptions((prev) => prev.filter((o) => o.id !== id))
  }

  const handleSave = (draft: boolean) => {
    if (!questionContent.trim()) { toast.error('Vui lòng nhập nội dung câu hỏi'); return }
    if (options.filter((o) => o.content.trim()).length < 2) { toast.error('Cần ít nhất 2 đáp án có nội dung'); return }
    if (mcqType === 'single' && options.filter((o) => o.isCorrect).length !== 1) { toast.error('Cần chọn đúng 1 đáp án đúng'); return }
    if (mcqType === 'multi' && options.filter((o) => o.isCorrect).length < 1) { toast.error('Cần chọn ít nhất 1 đáp án đúng'); return }
    toast.success(draft ? 'Đã lưu nháp' : 'Đã lưu câu hỏi')
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa câu hỏi trắc nghiệm' : 'Thêm câu hỏi trắc nghiệm'}
        breadcrumbs={[{ label: 'Ngân hàng câu hỏi', href: '/exam/question-bank' }, { label: isEdit ? 'Sửa' : 'Thêm mới' }]}
        actions={[
          { label: 'Lưu nháp', variant: 'outline', onClick: () => handleSave(true) },
          { label: 'Lưu', onClick: () => handleSave(false) },
        ]}
      />

      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Thông tin chung</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="category" label="Danh mục" required>
                <Select><SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger><SelectContent><SelectItem value="math">Toán học</SelectItem><SelectItem value="physics">Vật lý</SelectItem></SelectContent></Select>
              </FormField>
              <FormField name="difficulty" label="Độ khó" required>
                <Select><SelectTrigger><SelectValue placeholder="Chọn độ khó" /></SelectTrigger><SelectContent><SelectItem value="easy">Dễ</SelectItem><SelectItem value="medium">Trung bình</SelectItem><SelectItem value="hard">Khó</SelectItem><SelectItem value="very_hard">Rất khó</SelectItem></SelectContent></Select>
              </FormField>
            </div>
            <FormField name="tags" label="Tags"><Input placeholder="Nhập tags, phân cách bằng dấu phẩy..." /></FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Nội dung câu hỏi</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} rows={6} placeholder="Nhập nội dung câu hỏi..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Đáp án</CardTitle>
              <Tabs value={mcqType} onValueChange={setMcqType}>
                <TabsList><TabsTrigger value="single">1 lựa chọn</TabsTrigger><TabsTrigger value="multi">Nhiều lựa chọn</TabsTrigger></TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {options.map((opt, i) => (
              <div key={opt.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 cursor-grab shrink-0" />
                <span className="font-semibold text-sm mt-2 w-6">{String.fromCharCode(65 + i)}.</span>
                <Input value={opt.content} onChange={(e) => updateOption(opt.id, e.target.value)} placeholder={`Đáp án ${String.fromCharCode(65 + i)}`} className="flex-1" />
                <div className="flex items-center gap-2 mt-1.5 shrink-0">
                  {mcqType === 'single' ? (
                    <RadioGroup value={options.find((o) => o.isCorrect)?.id} onValueChange={(v) => v && setCorrect(v)}>
                      <RadioGroupItem value={opt.id} id={`correct-${opt.id}`} />
                    </RadioGroup>
                  ) : (
                    <Checkbox checked={opt.isCorrect} onCheckedChange={() => setCorrect(opt.id)} />
                  )}
                  <Label className="text-xs text-muted-foreground">Đúng</Label>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => removeOption(opt.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addOption} className="cursor-pointer"><Plus className="h-3 w-3 mr-1" /> Thêm đáp án</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Giải thích đáp án</CardTitle></CardHeader>
          <CardContent><Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={4} placeholder="Giải thích đáp án đúng (tùy chọn)..." /></CardContent>
        </Card>
      </div>
    </div>
  )
}
