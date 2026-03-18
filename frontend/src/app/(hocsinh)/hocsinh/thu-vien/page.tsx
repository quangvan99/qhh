'use client'

import { useQuery } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { useState } from 'react'
import { Search, BookOpen, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Mock borrowed books
const BORROWED_BOOKS = [
  { id: 'br1', bookId: 'book-001', title: 'Giải tích 1', author: 'Nguyễn Đình Trí', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), category: 'Toán học' },
  { id: 'br2', bookId: 'book-003', title: 'Lịch sử Việt Nam', author: 'Nhiều tác giả', dueDate: new Date(Date.now() + 86400000 * 8).toISOString(), category: 'Lịch sử' },
  { id: 'br3', bookId: 'book-016', title: 'Truyện Kiều', author: 'Nguyễn Du', dueDate: new Date(Date.now() - 86400000).toISOString(), category: 'Văn học' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Toán học': 'from-blue-400 to-blue-600',
  'Vật lý': 'from-purple-400 to-purple-600',
  'Hóa học': 'from-green-400 to-green-600',
  'Lịch sử': 'from-red-400 to-red-600',
  'Ngoại ngữ': 'from-yellow-400 to-yellow-600',
  'Văn học': 'from-orange-400 to-orange-600',
  'Sinh học': 'from-lime-400 to-lime-600',
  'Địa lý': 'from-teal-400 to-teal-600',
  'Tin học': 'from-cyan-400 to-cyan-600',
}

const CATEGORIES = ['📚 Tất cả', '📐 Toán', '📗 Văn', '🔬 Lý', '⚗️ Hóa', '🌐 Anh', '📜 Sử', '🗺️ Địa']
const CATEGORY_MAP: Record<string, string> = {
  '📐 Toán': 'Toán học', '📗 Văn': 'Văn học', '🔬 Lý': 'Vật lý',
  '⚗️ Hóa': 'Hóa học', '🌐 Anh': 'Ngoại ngữ', '📜 Sử': 'Lịch sử', '🗺️ Địa': 'Địa lý',
}

function formatDue(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const days = Math.ceil(diff / 86400000)
  if (days < 0) return { text: `Quá hạn ${Math.abs(days)} ngày`, color: 'text-red-600', bg: 'bg-red-50 border-red-200' }
  if (days <= 3) return { text: `Hạn trả: ${days} ngày nữa`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' }
  return { text: `Hạn trả: ${new Date(dateStr).toLocaleDateString('vi-VN')}`, color: 'text-muted-foreground', bg: 'bg-card border-border' }
}

function BookCover({ title, category, size = 'lg' }: { title: string; category: string; size?: 'sm' | 'lg' }) {
  const gradient = CATEGORY_COLORS[category] ?? 'from-gray-400 to-gray-600'
  const abbr = title.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
  return (
    <div className={cn(
      'rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm',
      gradient,
      size === 'lg' ? 'w-20 h-28' : 'w-10 h-14'
    )}>
      <span className={cn('font-black text-white', size === 'lg' ? 'text-xl' : 'text-xs')}>{abbr}</span>
    </div>
  )
}

function BorrowSheet({ book }: { book: { id: string; title: string; author: string; available: number; category: string } }) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            size="sm"
            variant={book.available > 0 ? 'default' : 'secondary'}
            disabled={book.available === 0}
            className="w-full min-h-[36px] text-xs mt-2"
          />
        }
      >
        {book.available > 0 ? 'Mượn ngay' : 'Hết sách'}
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <div className="pb-6">
          <div className="flex gap-4 mb-4">
            <BookCover title={book.title} category={book.category} />
            <div>
              <h3 className="font-bold text-base">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Còn {book.available} bản</Badge>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-3 mb-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thể loại</span>
              <span className="font-medium">{book.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thời hạn mượn</span>
              <span className="font-medium">14 ngày</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Địa điểm lấy</span>
              <span className="font-medium">Phòng thư viện</span>
            </div>
          </div>
          <Button
            className="w-full min-h-[48px]"
            onClick={() => toast.success('Đã đặt mượn! Đến thư viện lấy sách trong 24h.')}
          >
            Xác nhận mượn
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-3">
        {Array(6).fill(0).map((_, i) => <div key={i} className="h-52 animate-pulse rounded-xl bg-muted" />)}
      </div>
    </div>
  )
}

export default function ThuVienPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('📚 Tất cả')

  const { data: booksData, isLoading } = useQuery({
    queryKey: ['books', search, activeCategory],
    queryFn: () => adminMockApi.getBooks({
      search: search || undefined,
      category: activeCategory !== '📚 Tất cả' ? CATEGORY_MAP[activeCategory] : undefined,
    }),
  })

  if (isLoading) return <MobileSkeleton />

  const books = booksData?.data ?? []

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold mb-3">Thư viện</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm sách, tác giả..."
            className="pl-9 h-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <Tabs defaultValue="search">
        <TabsList className="w-full rounded-none border-b bg-background h-10 px-4">
          <TabsTrigger value="search" className="flex-1 text-xs data-[state=active]:font-bold">Tìm kiếm</TabsTrigger>
          <TabsTrigger value="borrowed" className="flex-1 text-xs data-[state=active]:font-bold">
            Đang mượn ({BORROWED_BOOKS.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Tìm kiếm */}
        <TabsContent value="search" className="px-4 pt-4">
          {books.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Không tìm thấy sách</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {books.map(book => (
                <div key={book.id} className="rounded-xl bg-card border shadow-sm p-3 flex flex-col">
                  <BookCover title={book.title} category={book.category} />
                  <div className="mt-2 flex-1">
                    <p className="text-xs font-semibold line-clamp-2 leading-tight">{book.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{book.author}</p>
                  </div>
                  <div className="mt-2">
                    <Badge className={cn('text-[10px] px-1.5 py-0', book.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                      {book.available > 0 ? `Còn ${book.available} bản` : 'Hết sách'}
                    </Badge>
                    <BorrowSheet book={book} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Đang mượn */}
        <TabsContent value="borrowed" className="px-4 pt-4 space-y-3">
          {BORROWED_BOOKS.map(borrow => {
            const due = formatDue(borrow.dueDate)
            return (
              <div key={borrow.id} className={cn('rounded-xl border p-3 flex items-center gap-3', due.bg)}>
                <BookCover title={borrow.title} category={borrow.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{borrow.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{borrow.author}</p>
                  <p className={cn('text-xs font-medium mt-1', due.color)}>{due.text}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs min-h-[36px]"
                  onClick={() => toast.success('Đã gửi yêu cầu gia hạn!')}
                >
                  Gia hạn
                </Button>
              </div>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
