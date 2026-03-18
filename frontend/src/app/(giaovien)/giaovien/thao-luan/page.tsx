'use client'

import { useState } from 'react'
import { SplitView } from '@/components/shared'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, MessageCircle, CheckCircle2, ThumbsUp, Clock, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

type Reply = {
  id: string
  authorName: string
  authorRole: 'teacher' | 'student'
  content: string
  upvotes: number
  createdAt: string
}

type Thread = {
  id: string
  question: string
  subject: string
  studentName: string
  studentId: string
  createdAt: string
  isResolved: boolean
  replyCount: number
  replies: Reply[]
}

const MOCK_THREADS: Thread[] = [
  {
    id: 'th-1',
    question: 'Thầy/cô ơi, em không hiểu tại sao lim(x→0) sin(x)/x = 1 mà không phải là 0/0?',
    subject: 'Toán',
    studentName: 'Nguyễn Văn An',
    studentId: 'hs-001',
    createdAt: '2 giờ trước',
    isResolved: false,
    replyCount: 0,
    replies: [],
  },
  {
    id: 'th-2',
    question: 'Em chưa rõ cách phân biệt cực đại và cực tiểu của hàm số, thầy có thể giải thích thêm không ạ?',
    subject: 'Toán',
    studentName: 'Trần Thị Bình',
    studentId: 'hs-002',
    createdAt: '5 giờ trước',
    isResolved: true,
    replyCount: 2,
    replies: [
      { id: 'r-1', authorName: 'Nguyễn Thị Bích', authorRole: 'teacher', content: 'Để xác định cực đại hay cực tiểu, ta dùng dấu của đạo hàm cấp hai: f\'\'(x₀) < 0 → cực đại, f\'\'(x₀) > 0 → cực tiểu.', upvotes: 3, createdAt: '4 giờ trước' },
      { id: 'r-2', authorName: 'Trần Thị Bình', authorRole: 'student', content: 'Em hiểu rồi ạ, cảm ơn thầy/cô!', upvotes: 0, createdAt: '3 giờ trước' },
    ],
  },
  {
    id: 'th-3',
    question: 'Công thức tính tích phân từng phần là gì ạ? Em hay nhầm lẫn giữa u và dv.',
    subject: 'Toán',
    studentName: 'Lê Văn Cường',
    studentId: 'hs-003',
    createdAt: '1 ngày trước',
    isResolved: false,
    replyCount: 1,
    replies: [
      { id: 'r-3', authorName: 'Nguyễn Thị Bích', authorRole: 'teacher', content: 'Công thức: ∫u dv = uv - ∫v du. Bí quyết: u chọn hàm giảm dần khi lấy đạo hàm (x^n, ln x, arctan x...), dv chọn hàm dễ tích phân.', upvotes: 5, createdAt: '20 giờ trước' },
    ],
  },
  {
    id: 'th-4',
    question: 'Đề thi giữa kỳ sẽ có những dạng bài nào ạ? Thầy/cô có thể cho biết cấu trúc đề không?',
    subject: 'Toán',
    studentName: 'Phạm Văn Dũng',
    studentId: 'hs-004',
    createdAt: '1 ngày trước',
    isResolved: false,
    replyCount: 0,
    replies: [],
  },
  {
    id: 'th-5',
    question: 'Em gặp lỗi khi làm bài tập online, màn hình cứ báo timeout. Làm sao để nộp bài ạ?',
    subject: 'Toán',
    studentName: 'Hoàng Anh Em',
    studentId: 'hs-005',
    createdAt: '2 ngày trước',
    isResolved: true,
    replyCount: 3,
    replies: [
      { id: 'r-4', authorName: 'Nguyễn Thị Bích', authorRole: 'teacher', content: 'Em thử xóa cache trình duyệt và thử lại. Nếu vẫn lỗi hãy báo cho thầy/cô qua email.', upvotes: 1, createdAt: '2 ngày trước' },
    ],
  },
  {
    id: 'th-6',
    question: 'Khi tính đạo hàm của hàm hợp f(g(x)), có cần nhân thêm g\'(x) không ạ?',
    subject: 'Toán',
    studentName: 'Vũ Thị Phương',
    studentId: 'hs-006',
    createdAt: '3 ngày trước',
    isResolved: false,
    replyCount: 0,
    replies: [],
  },
  {
    id: 'th-7',
    question: 'Bài essay "My future career" có cần trích dẫn nguồn không ạ?',
    subject: 'Tiếng Anh',
    studentName: 'Đặng Thị Giang',
    studentId: 'hs-007',
    createdAt: '3 ngày trước',
    isResolved: true,
    replyCount: 1,
    replies: [
      { id: 'r-5', authorName: 'Nguyễn Thị Bích', authorRole: 'teacher', content: 'Không bắt buộc trích dẫn cho bài essay này, nhưng nếu có thì sẽ được cộng điểm thêm.', upvotes: 2, createdAt: '3 ngày trước' },
    ],
  },
  {
    id: 'th-8',
    question: 'Khi tính giới hạn dạng vô định 0/0, có phải lúc nào cũng dùng quy tắc L\'Hôpital không ạ?',
    subject: 'Toán',
    studentName: 'Bùi Văn Hà',
    studentId: 'hs-008',
    createdAt: '4 ngày trước',
    isResolved: false,
    replyCount: 0,
    replies: [],
  },
  {
    id: 'th-9',
    question: 'Thầy có thể giải thích ý nghĩa hình học của đạo hàm là gì không ạ?',
    subject: 'Toán',
    studentName: 'Ngô Thị Hương',
    studentId: 'hs-009',
    createdAt: '5 ngày trước',
    isResolved: true,
    replyCount: 4,
    replies: [
      { id: 'r-6', authorName: 'Nguyễn Thị Bích', authorRole: 'teacher', content: 'Về mặt hình học, f\'(x₀) là hệ số góc (độ dốc) của đường tiếp tuyến với đồ thị y = f(x) tại điểm có hoành độ x₀. Nếu f\'(x₀) > 0, hàm số tăng tại đó; f\'(x₀) < 0, hàm số giảm.', upvotes: 7, createdAt: '5 ngày trước' },
    ],
  },
  {
    id: 'th-10',
    question: 'Em không biết bắt đầu từ đâu để ôn thi cuối kỳ, thầy có gợi ý không ạ?',
    subject: 'Toán',
    studentName: 'Lý Văn Khánh',
    studentId: 'hs-010',
    createdAt: '1 tuần trước',
    isResolved: false,
    replyCount: 0,
    replies: [],
  },
]

const SUBJECT_COLORS: Record<string, string> = {
  'Toán': 'bg-blue-100 text-blue-700',
  'Tiếng Anh': 'bg-green-100 text-green-700',
  'Vật lý': 'bg-purple-100 text-purple-700',
}

type ThreadFilter = 'all' | 'pending' | 'resolved'

export default function ThaoluanPage() {
  const [threads, setThreads] = useState(MOCK_THREADS)
  const [filter, setFilter] = useState<ThreadFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const filtered = threads.filter(t => {
    if (filter === 'pending' && t.isResolved) return false
    if (filter === 'resolved' && !t.isResolved) return false
    if (search && !t.question.toLowerCase().includes(search.toLowerCase()) && !t.studentName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selectedThread = threads.find(t => t.id === selectedId) ?? null

  function markResolved(id: string) {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, isResolved: true } : t))
    toast.success('Đã đánh dấu đã giải quyết')
  }

  function sendReply() {
    if (!replyText.trim() || !selectedId) return
    setThreads(prev => prev.map(t => {
      if (t.id !== selectedId) return t
      const newReply: Reply = {
        id: `r-new-${Date.now()}`,
        authorName: 'Nguyễn Thị Bích',
        authorRole: 'teacher',
        content: replyText,
        upvotes: 0,
        createdAt: 'Vừa xong',
      }
      return { ...t, replies: [...t.replies, newReply], replyCount: t.replyCount + 1 }
    }))
    toast.success('Đã gửi trả lời')
    setReplyText('')
  }

  function upvote(threadId: string, replyId: string) {
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t
      return { ...t, replies: t.replies.map(r => r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r) }
    }))
  }

  const pendingCount = threads.filter(t => !t.isResolved).length

  const LEFT = (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b bg-muted/30 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-sm"
            placeholder="Tìm câu hỏi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {([
            { key: 'all' as const, label: 'Tất cả' },
            { key: 'pending' as const, label: 'Chưa trả lời', count: pendingCount, badge: true },
            { key: 'resolved' as const, label: 'Đã giải quyết' },
          ]).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex-1 rounded text-[11px] py-1 px-1.5 font-medium transition-colors flex items-center justify-center gap-1',
                filter === f.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
              )}
            >
              {f.label}
              {f.badge && f.count !== undefined && f.count > 0 && (
                <span className={cn('rounded-full h-4 px-1 text-[10px]', filter === f.key ? 'bg-primary-foreground/20' : 'bg-red-100 text-red-700')}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y">
        {filtered.map(thread => (
          <button
            key={thread.id}
            onClick={() => setSelectedId(thread.id)}
            className={cn(
              'w-full text-left p-3 hover:bg-muted/50 transition-colors border-l-2',
              selectedId === thread.id ? 'bg-muted/50 border-l-primary' : !thread.isResolved ? 'border-l-red-400' : 'border-l-transparent'
            )}
          >
            <div className="flex items-start gap-2">
              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                <AvatarFallback className="text-[10px] bg-primary/10">
                  {thread.studentName.split(' ').slice(-2).map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Badge className={cn('text-[9px] h-4 px-1.5', SUBJECT_COLORS[thread.subject] ?? 'bg-gray-100 text-gray-700')}>
                    {thread.subject}
                  </Badge>
                  {thread.isResolved && <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />}
                </div>
                <p className="text-xs font-medium line-clamp-2 leading-snug">{thread.question}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{thread.studentName}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{thread.createdAt}</span>
                  {thread.replyCount > 0 && (
                    <span className="text-[10px] text-muted-foreground">· {thread.replyCount} trả lời</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">Không có câu hỏi nào</p>
          </div>
        )}
      </div>
    </div>
  )

  const RIGHT = !selectedThread ? (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
      <p className="font-medium">Chọn câu hỏi để xem</p>
      <p className="text-sm text-muted-foreground mt-1">Chọn một câu hỏi từ danh sách bên trái</p>
    </div>
  ) : (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className={cn('text-xs', SUBJECT_COLORS[selectedThread.subject])}>{selectedThread.subject}</Badge>
              {selectedThread.isResolved && <Badge className="bg-green-100 text-green-700 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Đã giải quyết</Badge>}
            </div>
            <p className="font-medium text-sm leading-snug">{selectedThread.question}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] bg-primary/10">
                  {selectedThread.studentName.split(' ').slice(-2).map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span>{selectedThread.studentName}</span>
              <span>·</span>
              <Clock className="h-3 w-3" />
              <span>{selectedThread.createdAt}</span>
            </div>
          </div>
          {!selectedThread.isResolved && (
            <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 border-green-300 text-green-700 hover:bg-green-50" onClick={() => markResolved(selectedThread.id)}>
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Đánh dấu đã giải quyết
            </Button>
          )}
        </div>
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedThread.replies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">Chưa có câu trả lời nào</p>
            <p className="text-xs mt-1">Hãy là người đầu tiên trả lời</p>
          </div>
        ) : selectedThread.replies.map(reply => (
          <div key={reply.id} className={cn('flex gap-3', reply.authorRole === 'teacher' && 'flex-row-reverse')}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={cn('text-[10px]', reply.authorRole === 'teacher' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                {reply.authorName.split(' ').slice(-2).map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={cn('max-w-[75%] space-y-1', reply.authorRole === 'teacher' && 'items-end flex flex-col')}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{reply.authorName}</span>
                {reply.authorRole === 'teacher' && <Badge className="bg-primary/10 text-primary text-[9px] h-4">GV</Badge>}
                <span>·</span>
                <span>{reply.createdAt}</span>
              </div>
              <div className={cn('rounded-xl px-3 py-2 text-sm', reply.authorRole === 'teacher' ? 'bg-primary/10 dark:bg-primary/20 rounded-tr-none' : 'bg-muted rounded-tl-none')}>
                {reply.content}
              </div>
              <button
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => upvote(selectedThread.id, reply.id)}
              >
                <ThumbsUp className="h-3 w-3" />
                {reply.upvotes}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply box */}
      <div className="border-t p-3 space-y-2">
        <Textarea
          placeholder="Nhập câu trả lời của bạn..."
          className="h-20 resize-none text-sm"
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) sendReply() }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Ctrl+Enter để gửi</span>
          <Button size="sm" disabled={!replyText.trim()} onClick={sendReply}>
            Gửi trả lời
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-3 h-[calc(100vh-8rem)]">
      <div className="shrink-0">
        <h1 className="text-xl font-bold">Thảo luận Q&A</h1>
        <p className="text-sm text-muted-foreground">{pendingCount} câu hỏi chưa được trả lời</p>
      </div>

      <SplitView
        left={LEFT}
        right={RIGHT}
        defaultLeftWidth={35}
        minLeftWidth={28}
        maxLeftWidth={50}
        mobileLayout="tabs"
        storageKey="gv-thaoluan"
        className="border rounded-lg"
      />
    </div>
  )
}
