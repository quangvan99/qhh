'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import { useState, useRef } from 'react'
import { Clock, Paperclip, Camera, PenLine, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function formatDeadline(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const days = Math.floor(hours / 24)

  if (diff <= 0) return { text: 'Quá hạn', color: 'text-gray-500', urgent: false, overdue: true }
  if (hours < 24) return { text: `còn ${hours}h ${mins}p`, color: 'text-red-600', urgent: true, overdue: false }
  if (days <= 2) return { text: `còn ${days} ngày`, color: 'text-orange-500', urgent: false, overdue: false }
  if (days <= 5) return { text: `còn ${days} ngày`, color: 'text-yellow-600', urgent: false, overdue: false }
  return { text: `còn ${days} ngày`, color: 'text-green-600', urgent: false, overdue: false }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const SUBJECT_COLORS: Record<string, string> = {
  'Toán': 'bg-blue-100 text-blue-700',
  'Ngữ văn': 'bg-orange-100 text-orange-700',
  'Tiếng Anh': 'bg-yellow-100 text-yellow-700',
  'Vật lý': 'bg-purple-100 text-purple-700',
  'Hóa học': 'bg-green-100 text-green-700',
  'Lịch sử': 'bg-red-100 text-red-700',
}

function SubmitSheet({ assignment }: { assignment: { id: string; title: string; subject: string } }) {
  const [step, setStep] = useState<'choose' | 'file' | 'text' | 'done'>('choose')
  const [textContent, setTextContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    toast.success('Đã nộp bài thành công! ✓')
    setStep('done')
    setTimeout(() => { setOpen(false); setStep('choose') }, 2000)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="w-full min-h-[48px]" />}>Nộp bài →</SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        {step === 'done' ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
            <p className="text-lg font-bold text-green-700">Đã nộp bài thành công!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Hôm nay {new Date().toLocaleDateString('vi-VN')} · {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ) : step === 'choose' ? (
          <div className="pb-6">
            <h3 className="font-bold text-base mb-4">Nộp bài: {assignment.title}</h3>
            <div className="space-y-3">
              {[
                { icon: Paperclip, label: 'Chọn file từ thiết bị', sub: 'PDF, Word, Excel...', action: () => setStep('file') },
                { icon: Camera, label: 'Chụp ảnh bài làm', sub: 'Bài viết tay, sơ đồ...', action: () => { toast.info('Tính năng camera đang phát triển'); setStep('file') } },
                { icon: PenLine, label: 'Nhập trực tiếp', sub: 'Soạn thảo online', action: () => setStep('text') },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={opt.action}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors text-left min-h-[64px]"
                >
                  <opt.icon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3" onClick={() => setOpen(false)}>Hủy</Button>
          </div>
        ) : step === 'file' ? (
          <div className="pb-6">
            <h3 className="font-bold text-base mb-4">Chọn file</h3>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) setSelectedFile(file.name)
              }}
            />
            {selectedFile ? (
              <div className="p-4 rounded-xl bg-muted flex items-center gap-3 mb-4">
                <Paperclip className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium flex-1 truncate">{selectedFile}</span>
                <button onClick={() => setSelectedFile(null)} className="text-xs text-muted-foreground">Xóa</button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 mb-4 hover:bg-muted/20"
              >
                <Paperclip className="h-8 w-8 text-muted-foreground/40" />
                <span className="text-sm text-muted-foreground">Nhấn để chọn file</span>
              </button>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('choose')}>Quay lại</Button>
              <Button
                className="flex-1 min-h-[48px] gap-2"
                disabled={!selectedFile}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" /> Gửi bài
              </Button>
            </div>
          </div>
        ) : (
          <div className="pb-6">
            <h3 className="font-bold text-base mb-4">Nhập trực tiếp</h3>
            <Textarea
              placeholder="Viết bài làm của bạn tại đây..."
              className="min-h-[180px] text-base resize-none mb-4"
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mb-4">{textContent.length} ký tự</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('choose')}>Quay lại</Button>
              <Button
                className="flex-1 min-h-[48px] gap-2"
                disabled={textContent.trim().length < 10}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" /> Gửi bài
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <div key={i} className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />)}
      </div>
      {Array(3).fill(0).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />)}
    </div>
  )
}

export default function BaiTapPage() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['hs', 'assignments', 'hs-001'],
    queryFn: () => studentMockApi.getMyAssignments('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const pending = assignments?.pending ?? []
  const submitted = assignments?.submitted ?? []
  const graded = assignments?.graded ?? []

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold">Bài tập</h1>
      </div>

      <Tabs defaultValue="pending" className="mt-0">
        <TabsList className="w-full rounded-none border-b bg-background h-11 px-4">
          <TabsTrigger value="pending" className="flex-1 gap-1.5 text-xs data-[state=active]:font-bold">
            Cần nộp
            {pending.length > 0 && (
              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex-1 text-xs data-[state=active]:font-bold">
            Đã nộp
            {submitted.length > 0 && <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[9px]">{submitted.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="graded" className="flex-1 text-xs data-[state=active]:font-bold">
            Đã chấm ✅
          </TabsTrigger>
        </TabsList>

        {/* Tab: Cần nộp */}
        <TabsContent value="pending" className="px-4 pt-4 space-y-4">
          {pending.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-5xl block mb-4">🎉</span>
              <p className="text-base font-semibold">Bạn đã nộp hết bài tập!</p>
              <p className="text-sm text-muted-foreground mt-1">Giỏi quá!</p>
            </div>
          ) : pending.map(a => {
            const dl = formatDeadline(a.dueDate)
            return (
              <div key={a.id} className="rounded-2xl bg-card border shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn('text-[10px] px-1.5 py-0', SUBJECT_COLORS[a.subject ?? ''] ?? 'bg-gray-100 text-gray-700')}>
                    {a.subject}
                  </Badge>
                  <span className="text-xs text-muted-foreground">GV: {
                    a.subject === 'Toán' ? 'Nguyễn Thị Bích' :
                    a.subject === 'Ngữ văn' ? 'Phạm Văn Đức' : 'GV môn'
                  }</span>
                </div>
                <p className="font-bold text-base mb-1">{a.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  Hoàn thành bài tập và nộp trước thời hạn. Đảm bảo đủ nội dung theo yêu cầu.
                </p>
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock className={cn('h-3.5 w-3.5 shrink-0', dl.color)} />
                  <span className={cn('text-sm font-semibold', dl.color, dl.urgent && 'animate-pulse')}>
                    ⏰ Hạn: {formatDate(a.dueDate)} — {dl.text}
                  </span>
                </div>
                <SubmitSheet assignment={a} />
              </div>
            )
          })}
        </TabsContent>

        {/* Tab: Đã nộp */}
        <TabsContent value="submitted" className="px-4 pt-4 space-y-4">
          {submitted.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm text-muted-foreground">Chưa có bài đã nộp</p>
            </div>
          ) : submitted.map(a => (
            <div key={a.id} className="rounded-2xl bg-card border shadow-sm p-4">
              <Badge className={cn('text-[10px] px-1.5 py-0 mb-2', SUBJECT_COLORS[a.subject ?? ''] ?? 'bg-gray-100 text-gray-700')}>
                {a.subject}
              </Badge>
              <p className="font-bold text-base mb-1">{a.title}</p>
              <p className="text-xs text-muted-foreground mb-3">Nộp lúc: {new Date().toLocaleDateString('vi-VN')}</p>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-yellow-50 border border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600 shrink-0" />
                <span className="text-sm text-yellow-700 font-medium">⏳ Đang chờ GV chấm</span>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Tab: Đã chấm */}
        <TabsContent value="graded" className="px-4 pt-4 space-y-4">
          {graded.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">📊</span>
              <p className="text-sm text-muted-foreground">Chưa có bài được chấm</p>
            </div>
          ) : (graded as Array<typeof graded[0] & { score?: number; feedback?: string }>).map(a => {
            const score = a.score ?? 0
            const pct = (score / 10) * 100
            return (
              <div key={a.id} className="rounded-2xl bg-card border shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={cn('text-[10px] px-1.5 py-0', SUBJECT_COLORS[a.subject ?? ''] ?? 'bg-gray-100 text-gray-700')}>
                    {a.subject}
                  </Badge>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Đã chấm</span>
                </div>
                <p className="font-bold text-base mb-3">{a.title}</p>

                {/* Score display */}
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-black text-green-600 leading-none">{score}</span>
                  <div className="pb-1">
                    <span className="text-lg text-muted-foreground">/10</span>
                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                      {score >= 9 ? 'Xuất sắc' : score >= 8 ? 'Giỏi' : score >= 6.5 ? 'Khá' : score >= 5 ? 'TB' : 'Yếu'}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <Progress value={pct} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Điểm của bạn</span>
                    <span className="text-xs text-muted-foreground">TB lớp: 7.2</span>
                  </div>
                </div>

                {a.feedback && (
                  <div className="p-3 rounded-xl bg-muted/50 italic">
                    <p className="text-xs text-muted-foreground mb-0.5">Nhận xét GV:</p>
                    <p className="text-sm">&ldquo;{a.feedback}&rdquo;</p>
                  </div>
                )}
              </div>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
