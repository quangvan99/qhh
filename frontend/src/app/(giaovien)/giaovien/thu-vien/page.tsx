'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { toast } from 'sonner'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, BookOpen, Clock, AlertTriangle, RefreshCw, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

type BookItem = { id: string; title: string; author: string; isbn: string; category: string; available: number; total: number; coverUrl: null }

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Toán học': 'from-blue-400 to-blue-600',
  'Vật lý': 'from-purple-400 to-purple-600',
  'Hóa học': 'from-green-400 to-green-600',
  'Sinh học': 'from-emerald-400 to-emerald-600',
  'Lịch sử': 'from-orange-400 to-orange-600',
  'Địa lý': 'from-teal-400 to-teal-600',
  'Văn học': 'from-red-400 to-red-600',
  'Ngoại ngữ': 'from-yellow-400 to-yellow-600',
  'Tin học': 'from-cyan-400 to-cyan-600',
  default: 'from-gray-400 to-gray-600',
}

// Mock borrowed books
const MOCK_BORROWED = [
  {
    id: 'borrow-1',
    bookId: 'book-001',
    title: 'Giải tích 1',
    author: 'Nguyễn Đình Trí',
    category: 'Toán học',
    borrowedAt: '2026-02-15',
    dueDate: '2026-03-20',
  },
  {
    id: 'borrow-2',
    bookId: 'book-009',
    title: 'Ngữ pháp tiếng Anh',
    author: 'Murphy Raymond',
    category: 'Ngoại ngữ',
    borrowedAt: '2026-03-01',
    dueDate: '2026-03-18',
  },
  {
    id: 'borrow-3',
    bookId: 'book-019',
    title: 'Toán giải tích 2',
    author: 'Nguyễn Đình Trí',
    category: 'Toán học',
    borrowedAt: '2026-03-05',
    dueDate: '2026-04-05',
  },
]

function getDaysUntilDue(dueDateStr: string) {
  const due = new Date(dueDateStr)
  const now = new Date()
  const diff = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function BookCover({ category, title }: { category: string; title: string }) {
  const gradient = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.default
  return (
    <div className={cn('h-32 rounded-t-md bg-gradient-to-br flex items-end p-2', gradient)}>
      <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-md leading-tight">{title}</p>
    </div>
  )
}

function SmallBookCover({ category }: { category: string }) {
  const gradient = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.default
  return (
    <div className={cn('h-12 w-9 rounded shrink-0 bg-gradient-to-br flex items-center justify-center', gradient)}>
      <BookOpen className="h-4 w-4 text-white/80" />
    </div>
  )
}

export default function ThuVienPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['gv', 'books', search, category],
    queryFn: () => adminMockApi.getBooks({
      search: search || undefined,
      category: category !== 'all' ? category : undefined,
      page: 1,
    }),
  })

  const borrowMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await new Promise(r => setTimeout(r, 400))
      return { bookId }
    },
    onSuccess: (_, bookId) => {
      toast.success('Đã gửi yêu cầu mượn sách')
      queryClient.invalidateQueries({ queryKey: ['gv', 'books'] })
    },
  })

  const renewMutation = useMutation({
    mutationFn: async (borrowId: string) => {
      await new Promise(r => setTimeout(r, 400))
      return { borrowId }
    },
    onSuccess: () => {
      toast.success('Đã gia hạn thêm 30 ngày')
    },
  })

  const books: BookItem[] = data?.data ?? []
  const categories = ['Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lý', 'Văn học', 'Ngoại ngữ', 'Tin học']

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Library className="h-6 w-6 text-primary shrink-0" />
        <div>
          <h1 className="text-xl font-bold">Thư viện</h1>
          <p className="text-sm text-muted-foreground">Tìm và mượn sách</p>
        </div>
      </div>

      <Tabs defaultValue="search">
        <TabsList>
          <TabsTrigger value="search">Tìm kiếm</TabsTrigger>
          <TabsTrigger value="borrowed" className="gap-1.5">
            Đang mượn
            <Badge variant="outline" className="text-[10px] h-4 px-1">{MOCK_BORROWED.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4 space-y-4">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Tìm theo tên sách, tác giả..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={v => setCategory(String(v ?? 'all'))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCategory('all')} className={cn('rounded-full border px-3 py-1 text-xs font-medium transition-colors', category === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted')}>
              Tất cả
            </button>
            {categories.slice(0, 6).map(c => (
              <button key={c} onClick={() => setCategory(c)} className={cn('rounded-full border px-3 py-1 text-xs font-medium transition-colors', category === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted')}>
                {c}
              </button>
            ))}
          </div>

          {/* Books grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }, (_, i) => <Skeleton key={i} className="h-48" />)}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-10">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Không tìm thấy sách nào</p>
              <p className="text-sm text-muted-foreground mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {books.map(book => (
                <div key={book.id} className="rounded-lg border overflow-hidden hover:shadow-md transition-shadow bg-card">
                  <BookCover category={book.category} title={book.title} />
                  <div className="p-2.5 space-y-2">
                    <div>
                      <p className="text-xs font-semibold line-clamp-2 leading-tight">{book.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{book.author}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      {book.available > 0 ? (
                        <Badge className="bg-green-100 text-green-700 text-[10px]">Còn {book.available}</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 text-[10px]">Hết sách</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={book.available > 0 ? 'default' : 'outline'}
                      disabled={book.available === 0 || borrowMutation.isPending}
                      className="w-full h-7 text-xs"
                      onClick={() => borrowMutation.mutate(book.id)}
                    >
                      {book.available > 0 ? 'Mượn ngay' : 'Hết sách'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="borrowed" className="mt-4">
          {MOCK_BORROWED.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Bạn chưa mượn sách nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_BORROWED.map(borrow => {
                const daysLeft = getDaysUntilDue(borrow.dueDate)
                const isUrgent = daysLeft <= 3
                return (
                  <div key={borrow.id} className={cn('rounded-lg border p-4 flex items-start gap-4', isUrgent && 'border-red-300 bg-red-50/50 dark:bg-red-950/10')}>
                    <SmallBookCover category={borrow.category} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{borrow.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{borrow.author}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Mượn: {new Date(borrow.borrowedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className={cn('flex items-center gap-1 font-medium', isUrgent ? 'text-red-600' : 'text-foreground')}>
                          {isUrgent && <AlertTriangle className="h-3 w-3" />}
                          Hạn trả: {new Date(borrow.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                        {isUrgent && (
                          <Badge className="bg-red-100 text-red-700 text-[10px] animate-pulse">
                            Sắp hết hạn! ({daysLeft} ngày)
                          </Badge>
                        )}
                        {!isUrgent && daysLeft > 0 && (
                          <span className="text-green-600">Còn {daysLeft} ngày</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs shrink-0"
                      disabled={renewMutation.isPending}
                      onClick={() => renewMutation.mutate(borrow.id)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Gia hạn
                    </Button>
                  </div>
                )
              })}

              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">Bạn đang mượn {MOCK_BORROWED.length} sách</p>
                <p className="text-xs text-muted-foreground mt-0.5">Giới hạn: 5 sách cùng lúc</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
