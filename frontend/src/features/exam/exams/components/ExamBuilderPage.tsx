'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Settings, Download, Save, Eye } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppBadge } from '@/components/base/app-badge'
import { toast } from 'sonner'
import { ExamSectionModal, type SectionFormData } from './ExamSectionModal'
import { RandomStructureModal } from './RandomStructureModal'
import { QuestionPickerModal } from './QuestionPickerModal'
import { ExamExportModal } from './ExamExportModal'

const mockSections: SectionFormData[] = [
  { id: 's1', name: 'Phần I - Trắc nghiệm', type: 'random', questionCount: 30, pointPerQuestion: 0.25 },
  { id: 's2', name: 'Phần II - Tự luận', type: 'specific', questionCount: 5, pointPerQuestion: 1.5 },
]

export function ExamBuilderPage({ examId }: { examId?: string }) {
  const isEdit = !!examId

  // Exam info state
  const [examName, setExamName] = useState(isEdit ? 'Đề kiểm tra cuối kỳ Toán 12' : '')
  const [category, setCategory] = useState(isEdit ? 'math' : '')
  const [duration, setDuration] = useState(isEdit ? '90' : '45')
  const [description, setDescription] = useState('')

  // Sections state
  const [sections, setSections] = useState<SectionFormData[]>(isEdit ? mockSections : [])

  // Modal states
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionFormData | null>(null)
  const [randomModalOpen, setRandomModalOpen] = useState(false)
  const [pickerModalOpen, setPickerModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)

  // Computed
  const totalQuestions = sections.reduce((sum, s) => sum + s.questionCount, 0)
  const totalScore = sections.reduce((sum, s) => sum + s.questionCount * s.pointPerQuestion, 0)

  // Section handlers
  const handleAddSection = () => {
    setEditingSection(null)
    setSectionModalOpen(true)
  }

  const handleEditSection = (section: SectionFormData) => {
    setEditingSection(section)
    setSectionModalOpen(true)
  }

  const handleSaveSection = (data: SectionFormData) => {
    if (editingSection) {
      setSections((prev) => prev.map((s) => s.id === editingSection.id ? data : s))
      toast.success('Đã cập nhật phần thi')
    } else {
      setSections((prev) => [...prev, data])
      toast.success('Đã thêm phần thi')
    }
  }

  const handleDeleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
    toast.success('Đã xóa phần thi')
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    const newSections = [...sections]
    const temp = newSections[index]!
    newSections[index] = newSections[newIndex]!
    newSections[newIndex] = temp
    setSections(newSections)
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Chỉnh sửa đề thi' : 'Tạo đề thi mới'}
        breadcrumbs={[
          { label: 'Đề thi', href: '/exam/exams' },
          { label: isEdit ? 'Chỉnh sửa' : 'Tạo mới' },
        ]}
        actions={[
          { label: 'Xuất đề', variant: 'outline', icon: <Download className="h-4 w-4" />, onClick: () => setExportModalOpen(true) },
          { label: 'Xem trước', variant: 'outline', icon: <Eye className="h-4 w-4" />, onClick: () => toast.info('Chức năng xem trước đang phát triển') },
          { label: 'Lưu nháp', variant: 'outline', icon: <Save className="h-4 w-4" />, onClick: () => toast.success('Đã lưu nháp') },
          { label: 'Lưu đề thi', onClick: () => toast.success('Đã lưu đề thi thành công!') },
        ]}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Exam Info */}
        <Card>
          <CardHeader><CardTitle>Thông tin đề thi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField name="exam-name" label="Tên đề thi" required>
              <Input value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Nhập tên đề thi..." />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="exam-category" label="Danh mục" required>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Toán học</SelectItem>
                    <SelectItem value="physics">Vật lý</SelectItem>
                    <SelectItem value="chemistry">Hóa học</SelectItem>
                    <SelectItem value="literature">Ngữ văn</SelectItem>
                    <SelectItem value="english">Tiếng Anh</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField name="exam-duration" label="Thời gian (phút)" required>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min={1} />
              </FormField>
            </div>
            <FormField name="exam-desc" label="Mô tả">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Mô tả đề thi..." />
            </FormField>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách phần thi</CardTitle>
              <Button size="sm" className="cursor-pointer" onClick={handleAddSection}>
                <Plus className="h-3 w-3 mr-1" /> Thêm phần thi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Chưa có phần thi nào.</p>
                <p className="text-xs mt-1">Bấm &quot;Thêm phần thi&quot; để bắt đầu cấu trúc đề thi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div key={section.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                    <div className="flex flex-col gap-0.5">
                      <button
                        className="p-0.5 rounded hover:bg-muted cursor-pointer disabled:opacity-30"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(index, 'up')}
                      >
                        <GripVertical className="h-3 w-3 text-muted-foreground rotate-180" />
                      </button>
                      <button
                        className="p-0.5 rounded hover:bg-muted cursor-pointer disabled:opacity-30"
                        disabled={index === sections.length - 1}
                        onClick={() => handleMoveSection(index, 'down')}
                      >
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{section.name}</p>
                        <AppBadge semantic={section.type === 'random' ? 'info' : 'success'} size="sm">
                          {section.type === 'random' ? 'Ngẫu nhiên' : 'Đích danh'}
                        </AppBadge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {section.questionCount} câu • {section.pointPerQuestion} điểm/câu
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {(section.questionCount * section.pointPerQuestion).toFixed(2)}đ
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => handleEditSection(section)} title="Chỉnh sửa">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => handleDeleteSection(section.id)} title="Xóa">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {sections.length > 0 && (
              <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
                <span>Tổng số câu: <strong>{totalQuestions}</strong></span>
                <span>Tổng điểm: <strong>{totalScore.toFixed(2)}</strong></span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ExamSectionModal
        open={sectionModalOpen}
        onOpenChange={setSectionModalOpen}
        onSave={handleSaveSection}
        initialData={editingSection}
        onOpenRandomConfig={() => { setSectionModalOpen(false); setRandomModalOpen(true) }}
        onOpenQuestionPicker={() => { setSectionModalOpen(false); setPickerModalOpen(true) }}
      />

      <RandomStructureModal
        open={randomModalOpen}
        onOpenChange={setRandomModalOpen}
        onApply={(config) => {
          toast.success(`Đã cấu hình bộ lọc: ${config.count} câu`)
          setRandomModalOpen(false)
        }}
      />

      <QuestionPickerModal
        open={pickerModalOpen}
        onOpenChange={setPickerModalOpen}
        onConfirm={(ids) => {
          toast.success(`Đã chọn ${ids.length} câu hỏi`)
          setPickerModalOpen(false)
        }}
      />

      <ExamExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        examName={examName}
      />
    </div>
  )
}
