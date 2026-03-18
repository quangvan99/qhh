'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherMockApi } from '@/lib/mock'
import { mockStudents } from '@/lib/mock/data'
import { SplitView } from '@/components/shared'
import { useClassStore } from '@/stores/class.store'
import { toast } from 'sonner'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  X as XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MY_TEACHER_ID = 'gv-001'

type Assignment = {
  id: string
  title: string
  classId: string
  teacherId: string
  subject: string
  dueDate: string
  maxScore: number
  submittedCount: number
  totalStudents: number
  status: string
}

type Submission = {
  studentId: string
  studentName: string
  submittedAt: string
  isLate: boolean
  score: number | null
}

function mockSubmissions(assignment: Assignment): Submission[] {
  const classStudents = mockStudents.filter(s => s.classId === assignment.classId).slice(0, assignment.submittedCount)
  return classStudents.map((s, i) => ({
    studentId: s.id,
    studentName: s.name,
    submittedAt: new Date(Date.now() - i * 3600000).toLocaleString('vi-VN'),
    isLate: i % 8 === 0,
    score: i < Math.floor(assignment.submittedCount * 0.4) ? parseFloat((6 + (i % 4)).toFixed(1)) : null,
  }))
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'active': return { label: 'Đang mở', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' }
    case 'grading': return { label: 'Đang chấm', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' }
    case 'completed': return { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' }
    default: return { label: status, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' }
  }
}

function AssignmentLeftPanel({
  assignments,
  selectedAssignmentId,
  selectedStudentId,
  onSelectAssignment,
  onSelectStudent,
}: {
  assignments: Assignment[]
  selectedAssignmentId: string | null
  selectedStudentId: string | null
  onSelectAssignment: (id: string) => void
  onSelectStudent: (assignId: string, studentId: string) => void
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b bg-muted/30">
        <p className="text-sm font-semibold">Danh sách bài tập</p>
        <p className="text-xs text-muted-foreground">{assignments.length} bài</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">Chưa có bài tập nào</p>
          </div>
        ) : assignments.map(assignment => {
          const isOpen = selectedAssignmentId === assignment.id
          const cfg = getStatusConfig(assignment.status)
          const submissions = isOpen ? mockSubmissions(assignment) : []
          const dueDate = new Date(assignment.dueDate)
          const isOverdue = dueDate < new Date()

          return (
            <div key={assignment.id} className="rounded-md border overflow-hidden">
              <button
                onClick={() => onSelectAssignment(assignment.id)}
                className={cn(
                  'w-full flex items-start gap-2 p-2.5 text-left hover:bg-muted/50 transition-colors',
                  isOpen && 'bg-muted/50'
                )}
              >
                {isOpen ? <ChevronDown className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{assignment.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium', cfg.color)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {assignment.submittedCount}/{assignment.totalStudents} nộp
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] text-red-600">Quá hạn</span>
                    )}
                  </div>
                  <p className={cn('text-[10px] mt-0.5', isOverdue ? 'text-red-600' : 'text-muted-foreground')}>
                    Hạn: {dueDate.toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </button>

              {isOpen && submissions.length > 0 && (
                <div className="border-t divide-y bg-muted/10">
                  {submissions.map(sub => (
                    <button
                      key={sub.studentId}
                      onClick={() => onSelectStudent(assignment.id, sub.studentId)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-muted/50',
                        selectedStudentId === sub.studentId && 'bg-primary/10'
                      )}
                    >
                      <div className={cn('h-1.5 w-1.5 rounded-full shrink-0', sub.score !== null ? 'bg-green-500' : 'bg-orange-500')} />
                      <span className="flex-1 truncate">{sub.studentName}</span>
                      {sub.isLate && <Clock className="h-3 w-3 text-red-500 shrink-0" />}
                      {sub.score !== null ? (
                        <span className="font-bold text-green-700">{sub.score}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type GradingPanelProps = {
  submission: Submission | null
  assignment: Assignment | null
  onSave: (score: number, feedback: string) => void
  isSaving: boolean
}

function GradingRightPanel({ submission, assignment, onSave, isSaving }: GradingPanelProps) {
  const [score, setScore] = useState<string>('')
  const [feedback, setFeedback] = useState('')

  const QUICK_TEMPLATES = [
    { label: 'Bài làm tốt 👍', text: 'Bài làm tốt, trình bày rõ ràng và đúng phương pháp.' },
    { label: 'Cần bổ sung', text: 'Cần bổ sung thêm giải thích và dẫn chứng cụ thể.' },
    { label: 'Sai phương pháp ❌', text: 'Phương pháp tiếp cận chưa đúng, cần xem lại lý thuyết.' },
    { label: 'Trình bày tốt', text: 'Trình bày rõ ràng, sạch sẽ.' },
  ]

  if (!submission || !assignment) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">Chọn bài nộp để chấm</p>
        <p className="text-sm text-muted-foreground mt-1">Chọn học sinh từ danh sách bên trái</p>
      </div>
    )
  }

  const mockContent = [
    `Bài làm của học sinh ${submission.studentName}`,
    `Môn ${assignment.subject} — ${assignment.title}`,
    '',
    'Câu 1 (3 điểm): Cho hàm số f(x) = x³ - 3x² + 2x. Tìm đạo hàm f\'(x) và các điểm cực trị.',
    '',
    'Giải: Ta có f\'(x) = 3x² - 6x + 2',
    'f\'(x) = 0 ⟺ 3x² - 6x + 2 = 0',
    'Δ = 36 - 24 = 12 > 0',
    'x₁ = (6 - √12)/6 = 1 - √3/3',
    'x₂ = (6 + √12)/6 = 1 + √3/3',
    '',
    'Câu 2 (3 điểm): Tính ∫₀¹ (x² + 2x) dx',
    '',
    'Giải: ∫₀¹ (x² + 2x) dx = [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3',
    '',
    'Câu 3 (4 điểm): Ứng dụng đạo hàm để tìm cực trị của hàm số...',
    'Theo định lý về cực trị, ta có:',
    'f\'\'(x) = 6x - 6',
    'f\'\'(x₁) = 6(1 - √3/3) - 6 < 0 → cực đại',
    'f\'\'(x₂) = 6(1 + √3/3) - 6 > 0 → cực tiểu',
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">{submission.studentName}</p>
          {submission.isLate && <Badge className="bg-red-100 text-red-700 text-[10px]"><Clock className="h-2.5 w-2.5 mr-0.5" />Nộp muộn</Badge>}
          {submission.score !== null && <Badge className="bg-green-100 text-green-700 text-[10px]"><CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />Đã chấm: {submission.score}</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {assignment.title} · Nộp lúc {submission.submittedAt}
        </p>
      </div>

      {/* Mock PDF viewer */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30">
        <div className="bg-white dark:bg-card rounded-lg border p-6 shadow-sm max-w-2xl mx-auto">
          <div className="text-sm leading-relaxed font-mono space-y-1">
            {mockContent.map((line, i) => (
              <p key={i} className={cn(
                line.startsWith('Câu') ? 'font-bold mt-3 text-blue-800 dark:text-blue-300' : '',
                line.startsWith('Giải:') ? 'font-medium text-gray-700 dark:text-gray-300' : '',
                !line ? 'h-2' : ''
              )}>
                {line || <span>&nbsp;</span>}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Grading panel */}
      <div className="border-t p-4 bg-card shrink-0 space-y-3">
        <div className="flex items-center gap-3">
          <div>
            <Label className="text-xs font-medium">Điểm</Label>
            <div className="flex items-center gap-1.5 mt-1">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={score}
                onChange={e => setScore(e.target.value)}
                placeholder={submission.score?.toString() ?? '0'}
                className="w-20 h-9 text-lg font-bold text-center"
              />
              <span className="text-muted-foreground">/ {assignment.maxScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <Label className="text-xs font-medium">Nhận xét</Label>
            <Textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Nhận xét cho học sinh..."
              className="mt-1 h-14 text-xs resize-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_TEMPLATES.map(t => (
            <button
              key={t.label}
              onClick={() => setFeedback(prev => prev ? `${prev} ${t.text}` : t.text)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs hover:bg-muted transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={!score || isSaving}
          onClick={() => {
            onSave(parseFloat(score), feedback)
            setScore('')
            setFeedback('')
          }}
        >
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          {isSaving ? 'Đang lưu...' : '💾 Lưu điểm'}
        </Button>
      </div>
    </div>
  )
}

export default function BaiTapPage() {
  const { currentClassId } = useClassStore()
  const queryClient = useQueryClient()
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: 'Toán', dueDate: '', description: '' })

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['gv', 'assignments', currentClassId],
    queryFn: () => teacherMockApi.getAssignments(currentClassId ?? ''),
    enabled: !!currentClassId,
  })

  const saveMutation = useMutation({
    mutationFn: async ({ score, feedback }: { score: number; feedback: string }) => {
      await new Promise(r => setTimeout(r, 500))
      return { score, feedback }
    },
    onSuccess: ({ score }) => {
      toast.success(`Đã lưu điểm ${score}`)
      queryClient.invalidateQueries({ queryKey: ['gv', 'assignments'] })
    },
  })

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) ?? null
  const allSubmissions = selectedAssignment ? mockSubmissions(selectedAssignment) : []
  const selectedSubmission = allSubmissions.find(s => s.studentId === selectedStudentId) ?? null

  if (!currentClassId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">Chưa chọn lớp</p>
        <p className="text-sm text-muted-foreground mt-1">Chọn lớp để xem bài tập</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold">Bài tập</h1>
        <Button size="sm" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Tạo bài tập
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <SplitView
          left={
            <AssignmentLeftPanel
              assignments={assignments}
              selectedAssignmentId={selectedAssignmentId}
              selectedStudentId={selectedStudentId}
              onSelectAssignment={id => {
                setSelectedAssignmentId(prev => prev === id ? null : id)
                setSelectedStudentId(null)
              }}
              onSelectStudent={(assignId, studentId) => {
                setSelectedAssignmentId(assignId)
                setSelectedStudentId(studentId)
              }}
            />
          }
          right={
            <GradingRightPanel
              submission={selectedSubmission}
              assignment={selectedAssignment}
              onSave={(score, feedback) => saveMutation.mutate({ score, feedback })}
              isSaving={saveMutation.isPending}
            />
          }
          defaultLeftWidth={38}
          minLeftWidth={28}
          maxLeftWidth={55}
          mobileLayout="tabs"
          storageKey="gv-baitap"
          className="border rounded-lg"
        />
      )}

      {/* Create dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo bài tập mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-sm">Tên bài tập *</Label>
              <Input
                className="mt-1"
                placeholder="VD: Bài tập Đạo hàm - Chương 2"
                value={newAssignment.title}
                onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Môn học</Label>
                <Select defaultValue="Toán" onValueChange={v => setNewAssignment(p => ({ ...p, subject: String(v ?? p.subject) }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Hạn nộp *</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={newAssignment.dueDate}
                  onChange={e => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">Mô tả</Label>
              <Textarea
                className="mt-1 h-20 resize-none"
                placeholder="Mô tả yêu cầu bài tập..."
                value={newAssignment.description}
                onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Hủy</Button>
            <Button
              disabled={!newAssignment.title || !newAssignment.dueDate}
              onClick={() => {
                toast.success(`Đã tạo bài tập "${newAssignment.title}"`)
                setShowCreateDialog(false)
                setNewAssignment({ title: '', subject: 'Toán', dueDate: '', description: '' })
              }}
            >
              Lưu bài tập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
