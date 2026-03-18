'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Plus, Search, Eye, Edit, BookOpen, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock 40 questions
const MOCK_QUESTIONS = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `q-toan-${i + 1}`,
    subject: 'Toán',
    chapter: `Chương ${Math.floor(i / 5) + 1}`,
    level: ['Nhận biết', 'Thông hiểu', 'Vận dụng'][i % 3] as string,
    type: 'mc' as const,
    question: [
      'Đạo hàm của hàm số f(x) = x³ - 3x² + 2 tại điểm x = 1 là:',
      'Tích phân ∫₀¹ x² dx bằng:',
      'Giới hạn lim(x→∞) (2x² + 1)/(x² - 3) bằng:',
      'Hàm số f(x) = x² - 4x + 3 đồng biến trên khoảng nào?',
      'Số nghiệm phức của phương trình x⁴ - 1 = 0 là:',
    ][i % 5],
    options: ['A. 0', 'B. 1/3', 'C. 2', 'D. -3'],
    answer: 'A',
    usedCount: i % 4,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `q-van-${i + 1}`,
    subject: 'Ngữ văn',
    chapter: `Phần ${Math.floor(i / 3) + 1}`,
    level: ['Nhận biết', 'Thông hiểu', 'Vận dụng'][i % 3] as string,
    type: 'essay' as const,
    question: [
      'Phân tích giá trị nhân đạo trong tác phẩm Truyện Kiều của Nguyễn Du.',
      'Trình bày cảm nhận về hình ảnh người lính trong thơ ca kháng chiến.',
      'Phân tích tâm trạng nhân vật Chí Phèo trong tác phẩm của Nam Cao.',
    ][i % 3],
    options: [],
    answer: '',
    usedCount: i % 3,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `q-anh-${i + 1}`,
    subject: 'Tiếng Anh',
    chapter: `Unit ${i + 1}`,
    level: ['Nhận biết', 'Thông hiểu', 'Vận dụng'][i % 3] as string,
    type: 'mc' as const,
    question: [
      'Choose the correct form: He _____ (go) to school every day.',
      'Which sentence uses the Present Perfect correctly?',
      'Choose the word that has the different stress pattern:',
    ][i % 3],
    options: ['A. go', 'B. goes', 'C. going', 'D. went'],
    answer: 'B',
    usedCount: i % 2,
  })),
]

const LEVEL_CONFIG = {
  'Nhận biết': { color: 'bg-green-100 text-green-700 border-green-200' },
  'Thông hiểu': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Vận dụng': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

const SUBJECT_COLORS: Record<string, string> = {
  'Toán': 'bg-blue-100 text-blue-700',
  'Ngữ văn': 'bg-orange-100 text-orange-700',
  'Tiếng Anh': 'bg-green-100 text-green-700',
}

export default function CauHoiPage() {
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [viewQuestion, setViewQuestion] = useState<typeof MOCK_QUESTIONS[0] | null>(null)

  // New question form
  const [form, setForm] = useState({
    question: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correct: 'A',
    subject: 'Toán',
    chapter: '',
    level: 'Nhận biết',
  })

  const filtered = MOCK_QUESTIONS.filter(q => {
    if (filterSubject !== 'all' && q.subject !== filterSubject) return false
    if (filterLevel !== 'all' && q.level !== filterLevel) return false
    if (filterType !== 'all' && q.type !== filterType) return false
    return true
  })

  function handleSave() {
    if (!form.question) { toast.error('Vui lòng nhập câu hỏi'); return }
    toast.success('Đã lưu câu hỏi mới')
    setShowCreate(false)
    setForm({ question: '', optA: '', optB: '', optC: '', optD: '', correct: 'A', subject: 'Toán', chapter: '', level: 'Nhận biết' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-muted-foreground">{filtered.length}/{MOCK_QUESTIONS.length} câu hỏi</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Tạo câu hỏi
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

        {/* Subject */}
        <Select value={filterSubject} onValueChange={v => setFilterSubject(String(v ?? 'all'))}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="Môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn</SelectItem>
            <SelectItem value="Toán">Toán</SelectItem>
            <SelectItem value="Ngữ văn">Ngữ văn</SelectItem>
            <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
          </SelectContent>
        </Select>

        {/* Level */}
        {(['all', 'Nhận biết', 'Thông hiểu', 'Vận dụng'] as const).map(l => (
          <button
            key={l}
            onClick={() => setFilterLevel(l)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filterLevel === l ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background hover:bg-muted'
            )}
          >
            {l === 'all' ? 'Tất cả' : l}
          </button>
        ))}

        {/* Type */}
        {([{ key: 'all', label: 'Mọi loại' }, { key: 'mc', label: 'Trắc nghiệm' }, { key: 'essay', label: 'Tự luận' }]).map(t => (
          <button
            key={t.key}
            onClick={() => setFilterType(t.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filterType === t.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background hover:bg-muted'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Question grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(q => (
          <div key={q.id} className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('text-[10px]', SUBJECT_COLORS[q.subject] ?? 'bg-gray-100 text-gray-700')}>
                {q.subject}
              </Badge>
              <Badge variant="outline" className={cn('text-[10px]', LEVEL_CONFIG[q.level as keyof typeof LEVEL_CONFIG]?.color ?? '')}>
                {q.level}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {q.type === 'mc' ? 'TN' : 'TL'}
              </Badge>
            </div>

            <p className="text-sm font-medium line-clamp-2">{q.question}</p>

            {q.type === 'mc' && (
              <div className="grid grid-cols-2 gap-1">
                {q.options.map((opt, i) => (
                  <p key={i} className={cn('text-xs px-2 py-1 rounded border', opt.startsWith(q.answer) ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30' : 'border-transparent text-muted-foreground')}>
                    {opt}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{q.chapter} · Dùng {q.usedCount} lần</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 text-xs px-1.5" onClick={() => setViewQuestion(q)}>
                  <Eye className="h-3 w-3 mr-0.5" />Xem
                </Button>
                <Button size="sm" variant="ghost" className="h-6 text-xs px-1.5" onClick={() => toast.info('Đã thêm vào đề thi')}>
                  <BookOpen className="h-3 w-3 mr-0.5" />Dùng
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy câu hỏi nào</p>
        </div>
      )}

      {/* Create Sheet */}
      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent side="right" className="w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tạo câu hỏi mới</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Câu hỏi *</Label>
              <Textarea
                className="mt-1 h-24 resize-none"
                placeholder="Nhập nội dung câu hỏi..."
                value={form.question}
                onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Đáp án (Trắc nghiệm)</Label>
              <RadioGroup value={form.correct} onValueChange={v => setForm(p => ({ ...p, correct: String(v ?? 'A') }))}>
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const fieldKey = ('opt' + key) as 'optA' | 'optB' | 'optC' | 'optD'
                  return (
                  <div key={key} className="flex items-center gap-2">
                    <RadioGroupItem value={key} id={`opt-${key}`} />
                    <Input
                      placeholder={`Đáp án ${key}...`}
                      value={form[fieldKey]}
                      onChange={e => setForm(p => ({ ...p, [fieldKey]: e.target.value }))}
                      className={cn('flex-1 h-8 text-sm', form.correct === key && 'border-green-400 bg-green-50 dark:bg-green-950/20')}
                    />
                    {form.correct === key && <Badge className="bg-green-500 text-white text-[10px]">Đúng</Badge>}
                  </div>
                  )
                })}
              </RadioGroup>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm">Môn học</Label>
                <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: String(v ?? p.subject) }))}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
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
                <Label className="text-sm">Chương</Label>
                <Input
                  className="mt-1 h-8 text-xs"
                  placeholder="VD: Chương 1"
                  value={form.chapter}
                  onChange={e => setForm(p => ({ ...p, chapter: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm">Cấp độ</Label>
                <Select value={form.level} onValueChange={v => setForm(p => ({ ...p, level: String(v ?? p.level) }))}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Nhận biết', 'Thông hiểu', 'Vận dụng'].map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu câu hỏi</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Question Sheet */}
      {viewQuestion && (
        <Sheet open={!!viewQuestion} onOpenChange={() => setViewQuestion(null)}>
          <SheetContent side="right" className="w-[440px]">
            <SheetHeader>
              <SheetTitle>Chi tiết câu hỏi</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2 flex-wrap">
                <Badge className={cn('text-xs', SUBJECT_COLORS[viewQuestion.subject])}>{viewQuestion.subject}</Badge>
                <Badge variant="outline" className="text-xs">{viewQuestion.chapter}</Badge>
                <Badge variant="outline" className={cn('text-xs', LEVEL_CONFIG[viewQuestion.level as keyof typeof LEVEL_CONFIG]?.color)}>{viewQuestion.level}</Badge>
              </div>
              <p className="font-medium">{viewQuestion.question}</p>
              {viewQuestion.type === 'mc' && (
                <div className="space-y-2">
                  {viewQuestion.options.map((opt, i) => (
                    <div key={i} className={cn('p-2 rounded-md border text-sm', opt.startsWith(viewQuestion.answer) ? 'bg-green-50 border-green-300 font-medium text-green-800 dark:bg-green-950/30' : '')}>
                      {opt}
                      {opt.startsWith(viewQuestion.answer) && <span className="ml-2 text-green-600 text-xs">✓ Đáp án đúng</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => { setViewQuestion(null); setShowCreate(true); }}>
                <Edit className="h-3.5 w-3.5 mr-1.5" />Sửa
              </Button>
              <Button onClick={() => { toast.success('Đã thêm vào đề thi'); setViewQuestion(null) }}>
                Dùng trong đề
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
