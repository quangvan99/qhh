'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockExams, mockClasses, mockTeachers, mockQuestions } from '@/lib/mock/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/composite/empty-state'
import { toast } from 'sonner'
import {
  Plus, ClipboardList, Eye, Pencil, Trash2,
  Clock, Users, BookOpen, BarChart3, ChevronRight,
  Check, Trophy, Search, X,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

type Question = typeof mockQuestions[number]

const QUESTION_SUBJECTS = ['Toán', 'Ngữ văn', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'Lịch sử', 'Địa lý']
const QUESTION_LEVELS = [
  { value: 'nhan-biet', label: 'Nhận biết' },
  { value: 'thong-hieu', label: 'Thông hiểu' },
  { value: 'van-dung', label: 'Vận dụng' },
]
const QUESTION_TYPES = [
  { value: 'trac-nghiem', label: 'Trắc nghiệm' },
  { value: 'tu-luan', label: 'Tự luận' },
]

function QuestionBankModal({
  open,
  onClose,
  onConfirm,
  initialSelected = [],
}: {
  open: boolean
  onClose: () => void
  onConfirm: (questions: Question[]) => void
  initialSelected?: Question[]
}) {
  const [search, setSearch] = useState('')
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected.map(q => q.id)))

  const filtered = useMemo(() => {
    return mockQuestions.filter(q => {
      if (filterSubject && filterSubject !== 'all' && q.subject !== filterSubject) return false
      if (filterLevel && filterLevel !== 'all' && q.level !== filterLevel) return false
      if (filterType && filterType !== 'all' && q.type !== filterType) return false
      if (search && !q.content.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, filterSubject, filterLevel, filterType])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    const chosen = mockQuestions.filter(q => selected.has(q.id))
    onConfirm(chosen)
  }

  const levelLabel = (l: string) => QUESTION_LEVELS.find(x => x.value === l)?.label ?? l
  const typeLabel = (t: string) => QUESTION_TYPES.find(x => x.value === t)?.label ?? t

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col" data-testid="question-bank-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Ngân hàng câu hỏi
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 py-1">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              data-testid="question-search-input"
              placeholder="Tìm câu hỏi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Select value={filterSubject} onValueChange={(v: string | null) => v != null && setFilterSubject(v)}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Môn học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả môn</SelectItem>
              {QUESTION_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterLevel} onValueChange={(v: string | null) => v != null && setFilterLevel(v)}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Cấp độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cấp độ</SelectItem>
              {QUESTION_LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(v: string | null) => v != null && setFilterType(v)}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Loại câu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {QUESTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Question list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 py-1 min-h-0" style={{ maxHeight: '380px' }}>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Không tìm thấy câu hỏi phù hợp</p>
          ) : (
            filtered.map(q => (
              <div
                key={q.id}
                className={cn(
                  'flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer hover:bg-muted/30 transition-colors',
                  selected.has(q.id) ? 'border-primary bg-primary/5' : 'border-border'
                )}
                onClick={() => toggleSelect(q.id)}
              >
                <input
                  type="checkbox"
                  data-testid={`question-checkbox-${q.id}`}
                  checked={selected.has(q.id)}
                  onChange={() => toggleSelect(q.id)}
                  onClick={e => e.stopPropagation()}
                  className="mt-0.5 h-4 w-4 accent-primary cursor-pointer shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2">{q.content}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-[10px] h-4 px-1">{q.subject}</Badge>
                    <Badge variant="outline" className="text-[10px] h-4 px-1">{levelLabel(q.level)}</Badge>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">{typeLabel(q.type)}</Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            Đã chọn <strong>{selected.size}</strong> câu hỏi
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="cursor-pointer">Hủy</Button>
            <Button
              data-testid="confirm-add-questions"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="cursor-pointer"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Thêm vào đề ({selected.size})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type Exam = typeof mockExams[number]

const SUBJECTS = ['Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh', 'Sinh học', 'Tin học']

// Mock score distribution
const scoreDistribution = [
  { range: '0-2', count: 2 },
  { range: '2-4', count: 4 },
  { range: '4-5', count: 8 },
  { range: '5-6', count: 12 },
  { range: '6-7', count: 18 },
  { range: '7-8', count: 15 },
  { range: '8-9', count: 10 },
  { range: '9-10', count: 6 },
]

function ExamStatusBadge({ status }: { status: string }) {
  if (status === 'upcoming') return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sắp diễn ra</Badge>
  if (status === 'active') return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 animate-pulse">Đang diễn ra</Badge>
  return <Badge variant="secondary">Đã kết thúc</Badge>
}

function ExamRow({ exam, onViewResults }: { exam: Exam; onViewResults: (exam: Exam) => void }) {
  const cls = mockClasses.find(c => c.id === exam.classId)
  const teacher = mockTeachers.find(t => t.id === exam.teacherId)
  const scheduledDate = new Date(exam.scheduledAt)

  return (
    <tr className="border-t hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-sm">{exam.title}</p>
          <p className="text-xs text-muted-foreground">{exam.subject}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs">{cls?.name ?? exam.classId}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {teacher?.name?.split(' ').slice(-1)[0] ?? exam.teacherId}
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm">{format(scheduledDate, 'dd/MM/yyyy', { locale: vi })}</p>
          <p className="text-xs text-muted-foreground">{format(scheduledDate, 'HH:mm', { locale: vi })}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          {exam.duration} phút
        </div>
      </td>
      <td className="px-4 py-3 text-sm">{exam.totalQuestions} câu</td>
      <td className="px-4 py-3"><ExamStatusBadge status={exam.status} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {exam.status === 'completed' && (
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
              onClick={() => onViewResults(exam)}>
              <BarChart3 className="h-3 w-3" /> Kết quả
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive hover:text-destructive"
            onClick={() => toast.success('Đã xóa kỳ thi')}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

function ExamResultsModal({ exam, open, onClose }: { exam: Exam | null; open: boolean; onClose: () => void }) {
  if (!exam) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kết quả: {exam.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-primary">{'avgScore' in exam ? (exam as Exam & { avgScore?: number }).avgScore : '—'}</p>
              <p className="text-xs text-muted-foreground">Điểm TB</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">
                {mockClasses.find(c => c.id === exam.classId)?.studentCount ?? '—'}
              </p>
              <p className="text-xs text-muted-foreground">Tổng số HS</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{exam.duration}</p>
              <p className="text-xs text-muted-foreground">Phút làm bài</p>
            </div>
          </div>

          {/* Histogram */}
          <div>
            <h3 className="font-medium text-sm mb-3">Phân bố điểm</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreDistribution} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [String(val) + ' học sinh', 'Số lượng']} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Multi-step exam creation dialog
function CreateExamDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '', subject: '', classId: '', teacherId: '', scheduledAt: '',
    duration: 45, totalQuestions: 40,
    shuffleQuestions: true, lateJoinLimit: 10, showResults: false,
  })
  const [showQuestionBank, setShowQuestionBank] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => { await new Promise(r => setTimeout(r, 600)) },
    onSuccess: () => {
      toast.success('Đã tạo kỳ thi mới!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'exams'] })
      onClose()
      setStep(1)
      setSelectedQuestions([])
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const steps = ['Thông tin cơ bản', 'Cài đặt', 'Xác nhận']

  return (
    <>
    <Dialog open={open} onOpenChange={() => { onClose(); setStep(1) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo kỳ thi mới</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium',
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {step > i + 1 ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className={cn('text-xs', step === i + 1 ? 'font-medium' : 'text-muted-foreground')}>{s}</span>
              {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <Separator />

        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Tên kỳ thi</Label>
              <Input
                value={formData.title}
                onChange={e => setFormData(d => ({ ...d, title: e.target.value }))}
                placeholder="VD: Kiểm tra Giữa kỳ - Toán 12"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Môn thi</Label>
                <Select onValueChange={(v: string | null) => v != null && setFormData(d => ({ ...d, subject: v }))}>
                  <SelectTrigger><SelectValue placeholder="Chọn môn" /></SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Lớp</Label>
                <Select onValueChange={(v: string | null) => v != null && setFormData(d => ({ ...d, classId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                  <SelectContent>
                    {mockClasses.slice(0, 8).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Thời gian bắt đầu</Label>
                <Input type="datetime-local" onChange={e => setFormData(d => ({ ...d, scheduledAt: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Thời lượng (phút)</Label>
                <Input type="number" value={formData.duration} onChange={e => setFormData(d => ({ ...d, duration: +e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Số câu hỏi</Label>
              <Input type="number" value={formData.totalQuestions} onChange={e => setFormData(d => ({ ...d, totalQuestions: +e.target.value }))} />
            </div>
          </div>
        )}

        {/* Step 2: Settings */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            {/* Question Bank section */}
            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Câu hỏi từ ngân hàng</p>
                  <p className="text-xs text-muted-foreground">Chọn câu hỏi có sẵn trong hệ thống</p>
                </div>
                <Button
                  data-testid="open-question-bank"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 cursor-pointer"
                  onClick={() => setShowQuestionBank(true)}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Chọn từ ngân hàng câu hỏi
                </Button>
              </div>
              {selectedQuestions.length > 0 && (
                <p className="text-xs text-primary font-medium" data-testid="selected-questions-count">
                  Đã chọn: {selectedQuestions.length} câu hỏi
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Xáo trộn câu hỏi</p>
                <p className="text-xs text-muted-foreground">Mỗi học sinh có thứ tự câu hỏi khác nhau</p>
              </div>
              <Switch checked={formData.shuffleQuestions} onCheckedChange={v => setFormData(d => ({ ...d, shuffleQuestions: v }))} />
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">Giới hạn vào muộn</p>
                  <p className="text-xs text-muted-foreground">Không cho vào sau X phút</p>
                </div>
              </div>
              <Input
                type="number"
                value={formData.lateJoinLimit}
                onChange={e => setFormData(d => ({ ...d, lateJoinLimit: +e.target.value }))}
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Hiện kết quả ngay</p>
                <p className="text-xs text-muted-foreground">HS xem điểm sau khi nộp bài</p>
              </div>
              <Switch checked={formData.showResults} onCheckedChange={v => setFormData(d => ({ ...d, showResults: v }))} />
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-3 py-2">
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
              <ConfirmRow label="Tên kỳ thi" value={formData.title || '—'} />
              <ConfirmRow label="Môn" value={formData.subject || '—'} />
              <ConfirmRow label="Lớp" value={mockClasses.find(c => c.id === formData.classId)?.name ?? '—'} />
              <ConfirmRow label="Thời lượng" value={`${formData.duration} phút`} />
              <ConfirmRow label="Số câu hỏi" value={String(formData.totalQuestions)} />
              <ConfirmRow label="Xáo trộn" value={formData.shuffleQuestions ? 'Bật' : 'Tắt'} />
              <ConfirmRow label="Hiện kết quả ngay" value={formData.showResults ? 'Có' : 'Không'} />
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="cursor-pointer">Quay lại</Button>
          )}
          <Button variant="outline" onClick={() => { onClose(); setStep(1); setSelectedQuestions([]) }} className="cursor-pointer">Hủy</Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} className="cursor-pointer">Tiếp theo</Button>
          ) : (
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="cursor-pointer">
              {mutation.isPending ? 'Đang tạo...' : 'Tạo kỳ thi'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <QuestionBankModal
      open={showQuestionBank}
      onClose={() => setShowQuestionBank(false)}
      onConfirm={(questions) => {
        setSelectedQuestions(questions)
        setShowQuestionBank(false)
        toast.success(`Đã thêm ${questions.length} câu hỏi vào đề`)
      }}
      initialSelected={selectedQuestions}
    />
    </>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function ExamTable({ exams, onViewResults }: { exams: Exam[]; onViewResults: (exam: Exam) => void }) {
  if (exams.length === 0) {
    return (
      <EmptyState
        title="Không có kỳ thi"
        description="Chưa có kỳ thi nào trong trạng thái này"
        icon={<ClipboardList className="h-12 w-12" />}
      />
    )
  }
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Kỳ thi</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Lớp</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Giáo viên</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Thời gian</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Thời lượng</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Câu hỏi</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Trạng thái</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => <ExamRow key={exam.id} exam={exam} onViewResults={onViewResults} />)}
        </tbody>
      </table>
    </div>
  )
}

export default function ExamsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [resultsModal, setResultsModal] = useState<Exam | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'exams'],
    queryFn: () => adminMockApi.getExams(),
  })

  const allExams = data?.data ?? mockExams
  const upcoming = allExams.filter(e => e.status === 'upcoming')
  const active = allExams.filter(e => e.status === 'active')
  const completed = allExams.filter(e => e.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Thi & Kiểm tra</h1>
          <Badge variant="secondary">{allExams.length} kỳ thi</Badge>
        </div>
        <Button size="sm" className="gap-2 cursor-pointer" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Tạo kỳ thi
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-1">
            Sắp diễn ra
            {upcoming.length > 0 && <Badge variant="outline" className="h-4 min-w-4 px-1 text-[9px]">{upcoming.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-1">
            Đang diễn ra
            {active.length > 0 && <Badge className="bg-orange-100 text-orange-700 h-4 min-w-4 px-1 text-[9px]">{active.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed">Đã kết thúc ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <ExamTable exams={upcoming} onViewResults={setResultsModal} />
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <ExamTable exams={active} onViewResults={setResultsModal} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <ExamTable exams={completed} onViewResults={setResultsModal} />
        </TabsContent>
      </Tabs>

      <CreateExamDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
      <ExamResultsModal exam={resultsModal} open={!!resultsModal} onClose={() => setResultsModal(null)} />
    </div>
  )
}
