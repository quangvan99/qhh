'use client'

import { useState } from 'react'
import { MessageSquare, ThumbsUp, Edit3, Send, ChevronRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Mock data
const MOCK_THREADS = [
  {
    id: 't1', subject: 'Toán', studentName: 'Nguyễn Văn Minh',
    question: 'Cho phương trình x² - 5x + 6 = 0, tại sao khi tính Δ lại ra số âm? Em tính Δ = 25 - 24 = 1 nhưng cô giáo nói kết quả khác ạ.',
    time: '2 giờ trước', likes: 5, replies: 3, resolved: true,
    answers: [
      { id: 'a1', author: 'Nguyễn Thị Bích', role: 'teacher', content: 'Δ = b² - 4ac = 25 - 4(1)(6) = 25 - 24 = 1 > 0. Vậy phương trình có 2 nghiệm phân biệt. Em tính đúng rồi! Có thể em nhìn nhầm bài khác.', time: '1 giờ trước' },
      { id: 'a2', author: 'Trần Thị B', role: 'student', content: 'Em cũng gặp trường hợp này, cảm ơn cô!', time: '45 phút trước' },
    ]
  },
  {
    id: 't2', subject: 'Vật lý', studentName: 'Lê Thị C',
    question: 'Công thức tính lực điện Coulomb giữa hai điện tích là gì? Em quên mất hệ số k bằng bao nhiêu.',
    time: '4 giờ trước', likes: 8, replies: 2, resolved: true,
    answers: [
      { id: 'a3', author: 'Trần Văn Hùng', role: 'teacher', content: 'F = k.q₁q₂/r². Trong đó k = 9×10⁹ N.m²/C² là hằng số điện.', time: '3 giờ trước' },
    ]
  },
  {
    id: 't3', subject: 'Hóa học', studentName: 'Phạm Văn D',
    question: 'Tại sao Fe(OH)₃ có màu nâu đỏ? Em đọc sách nhưng chưa hiểu lý do.',
    time: '1 ngày trước', likes: 3, replies: 1, resolved: false,
    answers: []
  },
  {
    id: 't4', subject: 'Ngữ văn', studentName: 'Hoàng Thị E',
    question: 'Trong bài Truyện Kiều, nhân vật Kim Trọng đại diện cho lý tưởng gì của Nguyễn Du? Em đọc nhiều phân tích khác nhau quá.',
    time: '2 ngày trước', likes: 12, replies: 5, resolved: true,
    answers: [
      { id: 'a4', author: 'Phạm Văn Đức', role: 'teacher', content: 'Kim Trọng đại diện cho mẫu người quân tử Nho giáo: tài, đức, trung thành. Đây là hình mẫu lý tưởng về tình yêu và nhân cách trong tư tưởng Nguyễn Du.', time: '1 ngày trước' },
    ]
  },
  {
    id: 't5', subject: 'Tiếng Anh', studentName: 'Vũ Văn F',
    question: 'Difference between "used to" and "would" when talking about past habits? Both seem similar to me.',
    time: '3 ngày trước', likes: 6, replies: 2, resolved: true,
    answers: [
      { id: 'a5', author: 'Đặng Thị Hoa', role: 'teacher', content: '"Used to" refers to past states AND habits. "Would" only refers to past habits/actions (not states). E.g., "I used to be shy" ✓ but "I would be shy" ✗', time: '2 ngày trước' },
    ]
  },
]

const CLASS_THREADS = [
  { id: 'c1', author: 'Nguyễn Thị Bích', role: 'teacher', subject: 'Toán', content: 'Các em lưu ý: Tuần sau có kiểm tra 1 tiết Chương 2 - Hàm số. Ôn lại các bài tập trong SGK trang 45-60.', time: '1 giờ trước', likes: 15 },
  { id: 'c2', author: 'Ban cán sự lớp', role: 'monitor', subject: null, content: 'Thông báo: Thứ 6 tuần này có thi thể dục, các bạn nhớ mặc đồ thể thao nhé!', time: '3 giờ trước', likes: 22 },
  { id: 'c3', author: 'Trần Văn Hùng', role: 'teacher', subject: 'Vật lý', content: 'Bài tập về nhà: Trang 78, bài 3, 4, 5. Nộp vào thứ 3 tuần sau.', time: 'Hôm qua', likes: 8 },
]

const SUBJECTS = ['Tất cả', 'Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh']

function ThreadCard({ thread, onOpen }: { thread: typeof MOCK_THREADS[0]; onOpen: (t: typeof MOCK_THREADS[0]) => void }) {
  const subjectColors: Record<string, string> = {
    'Toán': 'bg-blue-100 text-blue-700',
    'Vật lý': 'bg-purple-100 text-purple-700',
    'Hóa học': 'bg-green-100 text-green-700',
    'Ngữ văn': 'bg-orange-100 text-orange-700',
    'Tiếng Anh': 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="rounded-2xl bg-card border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={cn('text-[10px] px-1.5 py-0', subjectColors[thread.subject] ?? 'bg-gray-100 text-gray-700')}>
          {thread.subject}
        </Badge>
        <span className="text-xs text-muted-foreground">{thread.studentName}</span>
        <span className="text-xs text-muted-foreground ml-auto">{thread.time}</span>
      </div>
      <p className="text-sm line-clamp-2 mb-3 font-medium">{thread.question}</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ThumbsUp className="h-3.5 w-3.5" /> {thread.likes}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" /> {thread.replies} trả lời
        </div>
        <Badge className={cn('ml-auto text-[10px] px-1.5 py-0', thread.resolved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
          {thread.resolved ? '✓ Đã giải quyết' : '⏳ Chờ trả lời'}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 w-full text-xs text-primary hover:text-primary/80 gap-1"
        onClick={() => onOpen(thread)}
      >
        Xem thread <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export default function ThaoluanPage() {
  const [subjectFilter, setSubjectFilter] = useState('Tất cả')
  const [selectedThread, setSelectedThread] = useState<typeof MOCK_THREADS[0] | null>(null)
  const [threadOpen, setThreadOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [askOpen, setAskOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ subject: 'Toán', content: '' })

  const filtered = MOCK_THREADS.filter(t =>
    subjectFilter === 'Tất cả' || t.subject === subjectFilter
  )

  function openThread(thread: typeof MOCK_THREADS[0]) {
    setSelectedThread(thread)
    setThreadOpen(true)
  }

  function handleReply() {
    if (!replyText.trim()) return
    toast.success('Đã gửi câu trả lời!')
    setReplyText('')
  }

  function handleAsk() {
    if (newQuestion.content.trim().length < 10) {
      toast.error('Câu hỏi quá ngắn')
      return
    }
    toast.success('Đã gửi câu hỏi! GV sẽ trả lời sớm.')
    setAskOpen(false)
    setNewQuestion({ subject: 'Toán', content: '' })
  }

  return (
    <div className="mx-auto max-w-lg pb-24 relative">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold">Thảo luận</h1>
      </div>

      <Tabs defaultValue="ask">
        <TabsList className="w-full rounded-none border-b bg-background h-11 px-4">
          <TabsTrigger value="ask" className="flex-1 text-xs data-[state=active]:font-bold">
            Hỏi bài 🙋
          </TabsTrigger>
          <TabsTrigger value="class" className="flex-1 text-xs data-[state=active]:font-bold">
            Thảo luận lớp 💬
          </TabsTrigger>
        </TabsList>

        {/* Tab: Hỏi bài */}
        <TabsContent value="ask" className="pt-3">
          {/* Subject filters */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
            {SUBJECTS.map(s => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  subjectFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="px-4 space-y-3">
            {filtered.map(thread => (
              <ThreadCard key={thread.id} thread={thread} onOpen={openThread} />
            ))}
          </div>
        </TabsContent>

        {/* Tab: Thảo luận lớp */}
        <TabsContent value="class" className="px-4 pt-4 space-y-3">
          {CLASS_THREADS.map(item => (
            <div key={item.id} className="rounded-2xl bg-card border shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                  item.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                )}>
                  {item.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{item.author}</span>
                    {item.role === 'teacher' && (
                      <Badge className="bg-blue-100 text-blue-700 text-[9px] px-1 py-0">GV</Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
              {item.subject && (
                <Badge variant="outline" className="text-[10px] mb-2">{item.subject}</Badge>
              )}
              <p className="text-sm leading-relaxed">{item.content}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5" /> {item.likes}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* FAB */}
      <Sheet open={askOpen} onOpenChange={setAskOpen}>
        <SheetTrigger
          render={<button className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-30 hover:bg-primary/90 transition-colors" aria-label="Đặt câu hỏi" />}
        >
          <Edit3 className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <h3 className="font-bold text-base mb-4">Đặt câu hỏi</h3>

          {/* Subject select */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-3">
            {['Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh', 'Lịch sử'].map(s => (
              <button
                key={s}
                onClick={() => setNewQuestion(p => ({ ...p, subject: s }))}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors',
                  newQuestion.subject === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Viết câu hỏi của bạn... (tối thiểu 10 ký tự)"
            className="min-h-[140px] text-sm resize-none mb-4"
            value={newQuestion.content}
            onChange={e => setNewQuestion(p => ({ ...p, content: e.target.value }))}
          />
          <Button
            className="w-full min-h-[48px] gap-2"
            disabled={newQuestion.content.trim().length < 10}
            onClick={handleAsk}
          >
            <Send className="h-4 w-4" /> Gửi câu hỏi
          </Button>
        </SheetContent>
      </Sheet>

      {/* Thread detail sheet */}
      <Sheet open={threadOpen} onOpenChange={setThreadOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col p-0">
          {selectedThread && (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b">
                <button onClick={() => setThreadOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <h3 className="font-bold text-sm flex-1 truncate">Thread hỏi bài</h3>
                <Badge className={cn('text-[10px]', selectedThread.resolved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                  {selectedThread.resolved ? '✓ Giải quyết' : 'Chờ trả lời'}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Original question */}
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {selectedThread.studentName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium">{selectedThread.studentName}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{selectedThread.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{selectedThread.question}</p>
                </div>

                {/* Replies */}
                {selectedThread.answers.map(answer => (
                  <div key={answer.id} className={cn('rounded-xl p-3', answer.role === 'teacher' ? 'border-l-4 border-blue-500 bg-blue-50' : 'bg-card border')}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0', answer.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700')}>
                        {answer.author.charAt(0)}
                      </div>
                      <span className="text-xs font-medium">{answer.author}</span>
                      {answer.role === 'teacher' && (
                        <Badge className="bg-blue-100 text-blue-700 text-[9px] px-1 py-0">GV</Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{answer.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{answer.content}</p>
                  </div>
                ))}

                {selectedThread.answers.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Chưa có câu trả lời nào. Hãy kiên nhẫn chờ GV!
                  </div>
                )}
              </div>

              {/* Reply input */}
              <div className="border-t p-4 flex gap-3">
                <Textarea
                  placeholder="Nhập câu trả lời..."
                  className="flex-1 min-h-[48px] max-h-24 text-sm resize-none"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <Button
                  size="icon"
                  className="h-12 w-12 shrink-0 self-end"
                  disabled={!replyText.trim()}
                  onClick={handleReply}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
