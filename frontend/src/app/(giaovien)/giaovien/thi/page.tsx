'use client'

import { useQuery } from '@tanstack/react-query'
import { teacherMockApi } from '@/lib/mock'
import { useClassStore } from '@/stores/class.store'
import { toast } from 'sonner'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, ClipboardList, BarChart2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock exam results
const MOCK_EXAM_RESULTS = Array.from({ length: 25 }, (_, i) => ({
  studentName: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Minh Em'][i % 5] + ` (${i + 1})`,
  score: parseFloat((Math.random() * 4 + 6).toFixed(1)),
  timeTaken: `${Math.floor(Math.random() * 30 + 50)} phút`,
  rank: '',
})).map(r => ({
  ...r,
  rank: r.score >= 8.5 ? 'Giỏi' : r.score >= 6.5 ? 'Khá' : r.score >= 5 ? 'TB' : 'Yếu',
})).sort((a, b) => b.score - a.score)

type Exam = {
  id: string
  title: string
  classId: string
  teacherId: string
  subject: string
  scheduledAt: string
  duration: number
  totalQuestions: number
  status: string
  avgScore?: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-700' },
  active: { label: 'Đang thi', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Đã xong', color: 'bg-gray-100 text-gray-700' },
  draft: { label: 'Nháp', color: 'bg-yellow-100 text-yellow-700' },
}

// Wizard state type
type WizardData = {
  title: string
  subject: string
  classes: string[]
  date: string
  startTime: string
  duration: string
  mcCount: string
  essayCount: string
  shuffleQ: boolean
  shuffleA: boolean
  showResult: boolean
  lateLimit: string
}

export default function ThiPage() {
  const { currentClassId } = useClassStore()
  const [showCreate, setShowCreate] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    title: '',
    subject: 'Toán',
    classes: [],
    date: '',
    startTime: '07:30',
    duration: '90',
    mcCount: '40',
    essayCount: '0',
    shuffleQ: true,
    shuffleA: true,
    showResult: false,
    lateLimit: '10',
  })

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['gv', 'exams', currentClassId],
    queryFn: () => teacherMockApi.getExams(currentClassId ?? ''),
    enabled: !!currentClassId,
  })

  // All exams for GV
  const { data: allExams = [] } = useQuery({
    queryKey: ['gv', 'all-exams'],
    queryFn: async () => {
      const { mockExams } = await import('@/lib/mock/data')
      return mockExams
    },
  })

  const displayExams = currentClassId ? exams : allExams

  function handleCreateExam() {
    toast.success(`Đã tạo kỳ thi "${wizardData.title}"`)
    setShowCreate(false)
    setWizardStep(1)
  }

  const WizardStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label>Tên kỳ thi *</Label>
        <Input className="mt-1" placeholder="VD: Kiểm tra Giữa kỳ 1 - Toán 12" value={wizardData.title} onChange={e => setWizardData(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Môn học</Label>
          <Select value={wizardData.subject} onValueChange={v => setWizardData(p => ({ ...p, subject: String(v ?? p.subject) }))}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Thời lượng (phút)</Label>
          <Input className="mt-1" type="number" value={wizardData.duration} onChange={e => setWizardData(p => ({ ...p, duration: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Ngày thi *</Label>
          <Input className="mt-1" type="date" value={wizardData.date} onChange={e => setWizardData(p => ({ ...p, date: e.target.value }))} />
        </div>
        <div>
          <Label>Giờ bắt đầu</Label>
          <Input className="mt-1" type="time" value={wizardData.startTime} onChange={e => setWizardData(p => ({ ...p, startTime: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label>Lớp thi (multi-select)</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {['10A1', '11A2', '12A1'].map(cls => (
            <label key={cls} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={wizardData.classes.includes(cls)}
                onCheckedChange={v => setWizardData(p => ({
                  ...p,
                  classes: v ? [...p.classes, cls] : p.classes.filter(c => c !== cls),
                }))}
              />
              <span className="text-sm">Lớp {cls}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const WizardStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Số câu Trắc nghiệm</Label>
          <Input className="mt-1" type="number" value={wizardData.mcCount} onChange={e => setWizardData(p => ({ ...p, mcCount: e.target.value }))} />
        </div>
        <div>
          <Label>Số câu Tự luận</Label>
          <Input className="mt-1" type="number" value={wizardData.essayCount} onChange={e => setWizardData(p => ({ ...p, essayCount: e.target.value }))} />
        </div>
      </div>
      <div className="rounded-lg border p-3 bg-muted/20">
        <p className="text-sm font-medium mb-2">Chọn từ ngân hàng câu hỏi</p>
        <Button variant="outline" size="sm" onClick={() => toast.info('Mở ngân hàng câu hỏi')}>
          <ClipboardList className="h-4 w-4 mr-1.5" />
          Chọn câu hỏi ({wizardData.mcCount} TN + {wizardData.essayCount} TL)
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Hoặc để hệ thống tự chọn ngẫu nhiên từ ngân hàng</p>
      </div>
    </div>
  )

  const WizardStep3 = () => (
    <div className="space-y-4">
      {[
        { key: 'shuffleQ', label: 'Xáo trộn câu hỏi', desc: 'Mỗi HS nhận đề câu hỏi theo thứ tự khác nhau' },
        { key: 'shuffleA', label: 'Xáo trộn đáp án', desc: 'Thứ tự A/B/C/D thay đổi với từng HS' },
        { key: 'showResult', label: 'Hiện kết quả sau thi', desc: 'HS xem điểm ngay sau khi nộp' },
      ].map(item => (
        <div key={item.key} className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Switch
            checked={wizardData[item.key as keyof WizardData] as boolean}
            onCheckedChange={v => setWizardData(p => ({ ...p, [item.key]: v }))}
          />
        </div>
      ))}
      <div>
        <Label>Giới hạn vào muộn</Label>
        <Select value={wizardData.lateLimit} onValueChange={v => setWizardData(p => ({ ...p, lateLimit: String(v ?? p.lateLimit) }))}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 phút</SelectItem>
            <SelectItem value="10">10 phút</SelectItem>
            <SelectItem value="15">15 phút</SelectItem>
            <SelectItem value="0">Không cho vào muộn</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const WizardStep4 = () => (
    <div className="rounded-lg border bg-muted/20 p-4 space-y-3 text-sm">
      <p className="font-semibold text-base">{wizardData.title || '(Chưa đặt tên)'}</p>
      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
        <span>Môn:</span><span className="text-foreground font-medium">{wizardData.subject}</span>
        <span>Ngày:</span><span className="text-foreground">{wizardData.date ? new Date(wizardData.date).toLocaleDateString('vi-VN') : '—'}</span>
        <span>Giờ bắt đầu:</span><span className="text-foreground">{wizardData.startTime}</span>
        <span>Thời lượng:</span><span className="text-foreground">{wizardData.duration} phút</span>
        <span>Câu TN:</span><span className="text-foreground">{wizardData.mcCount} câu</span>
        <span>Câu TL:</span><span className="text-foreground">{wizardData.essayCount} câu</span>
        <span>Lớp:</span><span className="text-foreground">{wizardData.classes.join(', ') || '(Chưa chọn)'}</span>
        <span>Xáo câu:</span><span className="text-foreground">{wizardData.shuffleQ ? 'Có' : 'Không'}</span>
        <span>Xáo đáp án:</span><span className="text-foreground">{wizardData.shuffleA ? 'Có' : 'Không'}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Tổ chức thi</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Tạo kỳ thi
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14" />)}</div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên kỳ thi</TableHead>
                <TableHead className="hidden sm:table-cell">Môn</TableHead>
                <TableHead className="hidden md:table-cell">Ngày thi</TableHead>
                <TableHead className="hidden sm:table-cell">Thời gian</TableHead>
                <TableHead className="hidden md:table-cell">Câu hỏi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>Chưa có kỳ thi nào</p>
                  </TableCell>
                </TableRow>
              ) : displayExams.map(exam => {
                const cfg = STATUS_CONFIG[exam.status] ?? { label: 'Chưa biết', color: 'bg-gray-100 text-gray-800' }
                const date = new Date(exam.scheduledAt)
                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{exam.subject}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{date.toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{exam.duration} phút</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{exam.totalQuestions} câu</TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', cfg.color)}>{cfg.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {exam.status === 'completed' ? (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setSelectedExam(exam as Exam); setShowResults(true) }}>
                          <BarChart2 className="h-3 w-3 mr-1" />
                          Kết quả
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 text-xs">Sửa</Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Wizard Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo kỳ thi mới</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex items-center gap-1">
                  <div className={cn('h-6 w-6 rounded-full text-xs flex items-center justify-center font-medium', wizardStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                    {wizardStep > step ? <CheckCircle2 className="h-3.5 w-3.5" /> : step}
                  </div>
                  {step < 4 && <div className={cn('h-0.5 w-6', wizardStep > step ? 'bg-primary' : 'bg-muted')} />}
                </div>
              ))}
              <span className="text-xs text-muted-foreground ml-2">
                {['Thông tin', 'Cấu trúc', 'Cài đặt', 'Xác nhận'][wizardStep - 1]}
              </span>
            </div>
          </DialogHeader>

          <div className="py-2">
            {wizardStep === 1 && <WizardStep1 />}
            {wizardStep === 2 && <WizardStep2 />}
            {wizardStep === 3 && <WizardStep3 />}
            {wizardStep === 4 && <WizardStep4 />}
          </div>

          <DialogFooter className="gap-2">
            {wizardStep > 1 && <Button variant="outline" onClick={() => setWizardStep(p => p - 1)}>← Quay lại</Button>}
            {wizardStep < 4 ? (
              <Button onClick={() => setWizardStep(p => p + 1)}>Tiếp theo →</Button>
            ) : (
              <Button onClick={handleCreateExam} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Lưu và kích hoạt
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kết quả — {selectedExam?.title}</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Điểm TB', value: selectedExam.avgScore?.toFixed(1) ?? '—', color: 'text-blue-600' },
                  { label: 'Cao nhất', value: '9.5', color: 'text-green-600' },
                  { label: 'Thấp nhất', value: '4.0', color: 'text-red-600' },
                  { label: '% Đạt', value: '88%', color: 'text-purple-600' },
                ].map(s => (
                  <div key={s.label} className="rounded-lg border p-3 text-center">
                    <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border overflow-hidden max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Xếp loại</TableHead>
                      <TableHead>Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_EXAM_RESULTS.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                        <TableCell className="font-medium text-sm">{r.studentName}</TableCell>
                        <TableCell className={cn('font-bold', r.score >= 8 ? 'text-green-600' : r.score >= 6.5 ? 'text-blue-600' : r.score >= 5 ? 'text-yellow-600' : 'text-red-600')}>
                          {r.score}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{r.rank}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.timeTaken}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResults(false)}>Đóng</Button>
            <Button onClick={() => toast.success('Đã xuất Excel')}>📥 Xuất Excel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
