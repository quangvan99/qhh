'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface RubricRow { id: string; criterion: string; maxScore: number; description: string }

export function EssayForm({ questionId }: { questionId?: string }) {
  const isEdit = !!questionId
  const [content, setContent] = useState('')
  const [suggestedAnswer, setSuggestedAnswer] = useState('')
  const [rubric, setRubric] = useState<RubricRow[]>([
    { id: '1', criterion: '', maxScore: 0, description: '' },
  ])

  const addRubricRow = () => setRubric((prev) => [...prev, { id: String(Date.now()), criterion: '', maxScore: 0, description: '' }])
  const removeRubricRow = (id: string) => setRubric((prev) => prev.filter((r) => r.id !== id))

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa câu hỏi tự luận' : 'Thêm câu hỏi tự luận'}
        breadcrumbs={[{ label: 'Ngân hàng câu hỏi', href: '/exam/question-bank' }, { label: isEdit ? 'Sửa' : 'Thêm mới' }]}
        actions={[
          { label: 'Lưu nháp', variant: 'outline', onClick: () => toast.success('Đã lưu nháp') },
          { label: 'Lưu', onClick: () => { if (!content.trim()) { toast.error('Nhập đề bài'); return }; toast.success('Đã lưu') } },
        ]}
      />
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Thông tin chung</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="category" label="Danh mục" required>
                <Select><SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger><SelectContent><SelectItem value="math">Toán học</SelectItem><SelectItem value="lit">Ngữ văn</SelectItem></SelectContent></Select>
              </FormField>
              <FormField name="difficulty" label="Độ khó" required>
                <Select><SelectTrigger><SelectValue placeholder="Chọn độ khó" /></SelectTrigger><SelectContent><SelectItem value="easy">Dễ</SelectItem><SelectItem value="medium">TB</SelectItem><SelectItem value="hard">Khó</SelectItem></SelectContent></Select>
              </FormField>
            </div>
            <FormField name="maxScore" label="Điểm tối đa"><Input type="number" defaultValue="10" min={0} className="w-32" /></FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Đề bài</CardTitle></CardHeader>
          <CardContent><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Nhập nội dung đề bài..." /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Đáp án gợi ý</CardTitle></CardHeader>
          <CardContent><Textarea value={suggestedAnswer} onChange={(e) => setSuggestedAnswer(e.target.value)} rows={6} placeholder="Nhập đáp án gợi ý..." /></CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center justify-between"><CardTitle>Rubric chấm điểm</CardTitle><Button variant="outline" size="sm" onClick={addRubricRow} className="cursor-pointer"><Plus className="h-3 w-3 mr-1" /> Thêm tiêu chí</Button></div></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rubric.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-2 items-start">
                  <Input placeholder="Tiêu chí" className="col-span-4" value={row.criterion} onChange={(e) => setRubric((prev) => prev.map((r) => r.id === row.id ? { ...r, criterion: e.target.value } : r))} />
                  <Input type="number" placeholder="Điểm" className="col-span-2" value={row.maxScore || ''} onChange={(e) => setRubric((prev) => prev.map((r) => r.id === row.id ? { ...r, maxScore: Number(e.target.value) } : r))} />
                  <Input placeholder="Mô tả" className="col-span-5" value={row.description} onChange={(e) => setRubric((prev) => prev.map((r) => r.id === row.id ? { ...r, description: e.target.value } : r))} />
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 cursor-pointer text-destructive col-span-1" onClick={() => removeRubricRow(row.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
