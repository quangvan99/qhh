'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Settings, Shuffle } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ExamSectionItem { id: string; name: string; questionType: string; scorePerQ: number; count: number; mode: 'random' | 'manual' }

export function ExamForm({ examId }: { examId?: string }) {
  const isEdit = !!examId
  const [sections, setSections] = useState<ExamSectionItem[]>([])
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ExamSectionItem | null>(null)
  const [sectionName, setSectionName] = useState('')
  const [sectionType, setSectionType] = useState('single_choice')
  const [sectionScore, setSectionScore] = useState('0.25')
  const [sectionMode, setSectionMode] = useState<'random' | 'manual'>('manual')
  const [sectionCount, setSectionCount] = useState('10')

  const openAddSection = () => {
    setEditingSection(null)
    setSectionName('')
    setSectionType('single_choice')
    setSectionScore('0.25')
    setSectionMode('manual')
    setSectionCount('10')
    setSectionDialogOpen(true)
  }

  const saveSection = () => {
    if (!sectionName.trim()) { toast.error('Nhập tên phần thi'); return }
    const section: ExamSectionItem = {
      id: editingSection?.id ?? String(Date.now()),
      name: sectionName, questionType: sectionType,
      scorePerQ: Number(sectionScore), count: Number(sectionCount), mode: sectionMode,
    }
    if (editingSection) {
      setSections((prev) => prev.map((s) => s.id === editingSection.id ? section : s))
    } else {
      setSections((prev) => [...prev, section])
    }
    setSectionDialogOpen(false)
    toast.success('Đã lưu phần thi')
  }

  const totalQuestions = sections.reduce((sum, s) => sum + s.count, 0)
  const totalScore = sections.reduce((sum, s) => sum + s.count * s.scorePerQ, 0)

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa đề thi' : 'Tạo đề thi mới'}
        breadcrumbs={[{ label: 'Đề thi', href: '/exam/exams' }, { label: isEdit ? 'Sửa' : 'Tạo mới' }]}
        actions={[
          { label: 'Lưu nháp', variant: 'outline', onClick: () => toast.success('Đã lưu nháp') },
          { label: 'Lưu đề thi', onClick: () => toast.success('Đã lưu') },
        ]}
      />
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Thông tin đề thi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField name="name" label="Tên đề thi" required><Input placeholder="Nhập tên đề thi..." /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="category" label="Danh mục" required>
                <Select><SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger><SelectContent><SelectItem value="math">Toán học</SelectItem></SelectContent></Select>
              </FormField>
              <FormField name="duration" label="Thời gian (phút)" required><Input type="number" defaultValue="45" min={1} /></FormField>
            </div>
            <FormField name="totalScore" label="Điểm tổng" required><Input type="number" defaultValue="10" min={0} className="w-32" /></FormField>
            <FormField name="description" label="Mô tả"><Textarea rows={3} placeholder="Mô tả đề thi..." /></FormField>
            <FormField name="instructions" label="Hướng dẫn làm bài"><Textarea rows={3} placeholder="Hướng dẫn cho thí sinh..." /></FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center justify-between"><CardTitle>Cấu trúc đề thi</CardTitle><Button size="sm" className="cursor-pointer" onClick={openAddSection}><Plus className="h-3 w-3 mr-1" /> Thêm phần thi</Button></div></CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có phần thi nào. Bấm &quot;Thêm phần thi&quot; để bắt đầu.</p>
            ) : (
              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{section.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {section.count} câu • {section.scorePerQ}đ/câu • {section.mode === 'random' ? 'Ngẫu nhiên' : 'Chọn đích danh'}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{(section.count * section.scorePerQ).toFixed(2)}đ</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => { setEditingSection(section); setSectionName(section.name); setSectionType(section.questionType); setSectionScore(String(section.scorePerQ)); setSectionMode(section.mode); setSectionCount(String(section.count)); setSectionDialogOpen(true) }}>
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setSections((prev) => prev.filter((s) => s.id !== section.id))}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {sections.length > 0 && (
              <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
                <span>Tổng <strong>{totalQuestions}</strong> câu</span>
                <span>Tổng <strong>{totalScore.toFixed(2)}</strong> điểm</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section dialog */}
      <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingSection ? 'Sửa phần thi' : 'Thêm phần thi'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <FormField name="sName" label="Tên phần" required><Input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="VD: Phần A - Trắc nghiệm" /></FormField>
            <FormField name="sType" label="Loại câu hỏi">
              <Select value={sectionType} onValueChange={(v) => v && setSectionType(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single_choice">Trắc nghiệm 1</SelectItem><SelectItem value="multi_choice">Nhiều lựa chọn</SelectItem><SelectItem value="essay">Tự luận</SelectItem></SelectContent></Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="sScore" label="Điểm/câu"><Input type="number" value={sectionScore} onChange={(e) => setSectionScore(e.target.value)} step={0.25} min={0} /></FormField>
              <FormField name="sCount" label="Số câu"><Input type="number" value={sectionCount} onChange={(e) => setSectionCount(e.target.value)} min={1} /></FormField>
            </div>
            <FormField name="sMode" label="Chọn câu hỏi">
              <RadioGroup value={sectionMode} onValueChange={(v) => setSectionMode(v as 'random' | 'manual')} className="flex gap-4">
                <div className="flex items-center gap-2"><RadioGroupItem value="random" id="s-random" /><Label htmlFor="s-random"><Shuffle className="h-3 w-3 inline mr-1" />Ngẫu nhiên</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="manual" id="s-manual" /><Label htmlFor="s-manual">Chọn đích danh</Label></div>
              </RadioGroup>
            </FormField>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSectionDialogOpen(false)} className="cursor-pointer">Hủy</Button><Button onClick={saveSection} className="cursor-pointer">Xác nhận</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
