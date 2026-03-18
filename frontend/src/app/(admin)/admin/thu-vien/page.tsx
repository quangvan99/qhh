'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockBooks, mockStudents } from '@/lib/mock/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/composite/empty-state'
import { toast } from 'sonner'
import {
  Search, Plus, BookOpen, BookMarked, Clock, AlertTriangle,
  Eye, Pencil, RotateCcw, ArrowRightLeft, Library, FileDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { differenceInDays } from 'date-fns'

type Book = typeof mockBooks[number]

// Mock borrow records
const mockBorrows = [
  { id: 'bor-001', studentId: 'hs-001', studentName: 'Nguyễn Văn An', studentClass: '10A1', bookId: 'book-001', bookTitle: 'Giải tích 1', borrowDate: '2025-01-05', dueDate: '2025-01-19', status: 'borrowed' },
  { id: 'bor-002', studentId: 'hs-002', studentName: 'Trần Thị Bình', studentClass: '10A1', bookId: 'book-004', bookTitle: 'Tiếng Anh B1', borrowDate: '2024-12-20', dueDate: '2025-01-03', status: 'overdue' },
  { id: 'bor-003', studentId: 'hs-003', studentName: 'Lê Đức Chi', studentClass: '10A2', bookId: 'book-002', bookTitle: 'Vật lý đại cương', borrowDate: '2025-01-10', dueDate: '2025-01-24', status: 'borrowed' },
  { id: 'bor-004', studentId: 'hs-010', studentName: 'Lý Văn Minh', studentClass: '11A1', bookId: 'book-013', bookTitle: 'Hóa học vô cơ', borrowDate: '2024-12-15', dueDate: '2024-12-29', status: 'overdue' },
  { id: 'bor-005', studentId: 'hs-015', studentName: 'Dương Lý Oanh', studentClass: '11A2', bookId: 'book-016', bookTitle: 'Truyện Kiều', borrowDate: '2025-01-08', dueDate: '2025-01-22', status: 'borrowed' },
  { id: 'bor-006', studentId: 'hs-020', studentName: 'Hồ Công An', studentClass: '12A1', bookId: 'book-005', bookTitle: 'Hóa học hữu cơ', borrowDate: '2024-12-01', dueDate: '2024-12-15', status: 'overdue' },
  { id: 'bor-007', studentId: 'hs-025', studentName: 'Ngô Đức Minh', studentClass: '12A2', bookId: 'book-009', bookTitle: 'Ngữ pháp tiếng Anh', borrowDate: '2025-01-12', dueDate: '2025-01-26', status: 'borrowed' },
]

const CATEGORIES = ['Tất cả', 'Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Văn học', 'Lịch sử', 'Địa lý', 'Ngoại ngữ', 'Tin học', 'Khác']

function AvailabilityBadge({ available, total }: { available: number; total: number }) {
  const pct = total > 0 ? available / total : 0
  if (available === 0) return <Badge variant="destructive" className="text-xs">Hết sách</Badge>
  if (pct < 0.3) return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">Còn ít ({available}/{total})</Badge>
  return <Badge variant="outline" className="text-xs text-green-700 border-green-300">{available}/{total}</Badge>
}

function DueBadge({ dueDate, status }: { dueDate: string; status: string }) {
  if (status === 'overdue') {
    const days = differenceInDays(new Date(), new Date(dueDate))
    return <Badge variant="destructive" className="text-xs">Quá hạn {days} ngày</Badge>
  }
  const daysLeft = differenceInDays(new Date(dueDate), new Date())
  if (daysLeft <= 3) return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">Còn {daysLeft} ngày</Badge>
  return <span className="text-xs text-muted-foreground">Còn {daysLeft} ngày</span>
}

function AddBookDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mutation = useMutation({
    mutationFn: async () => { await new Promise(r => setTimeout(r, 500)) },
    onSuccess: () => { toast.success('Đã thêm sách mới!'); onClose() },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Thêm sách mới</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tên sách</Label>
            <Input placeholder="Nhập tên sách" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tác giả</Label>
              <Input placeholder="Tên tác giả" />
            </div>
            <div className="space-y-1.5">
              <Label>ISBN</Label>
              <Input placeholder="978..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Thể loại</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Chọn thể loại" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.slice(1).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Số lượng</Label>
              <Input type="number" placeholder="1" min="1" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">Hủy</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="cursor-pointer">
            {mutation.isPending ? 'Đang thêm...' : 'Thêm sách'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-10 w-80 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        {Array(6).fill(0).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />)}
      </div>
    </div>
  )
}

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [addBookOpen, setAddBookOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'books', search, categoryFilter],
    queryFn: () => adminMockApi.getBooks({
      search: search || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
    }),
  })

  if (isLoading) return <PageSkeleton />

  const books = data?.data ?? []
  const total = data?.total ?? 0
  const overdueCount = mockBorrows.filter(b => b.status === 'overdue').length
  // Tab "Đang mượn" hiển thị cả records quá hạn (chưa trả) để highlight bg đỏ
  const borrowedRecords = mockBorrows.filter(b => b.status === 'borrowed' || b.status === 'overdue')
  const overdueRecords = mockBorrows.filter(b => b.status === 'overdue')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Thư viện</h1>
          <Badge variant="secondary">{total} đầu sách</Badge>
        </div>
        <Button size="sm" className="gap-2 cursor-pointer" onClick={() => setAddBookOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm sách
        </Button>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">Danh mục sách</TabsTrigger>
          <TabsTrigger value="borrowing">Đang mượn ({borrowedRecords.length})</TabsTrigger>
          <TabsTrigger value="overdue" className="gap-1">
            Quá hạn
            {overdueCount > 0 && <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[9px]">{overdueCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="cards">Thẻ thư viện</TabsTrigger>
        </TabsList>

        {/* Danh mục sách */}
        <TabsContent value="catalog" className="mt-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm ISBN / Tên sách / Tác giả..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={v => v && setCategoryFilter(v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                {CATEGORIES.slice(1).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {books.length === 0 ? (
            <EmptyState
              title="Không tìm thấy sách"
              description="Thử thay đổi từ khóa hoặc thể loại"
              icon={<Library className="h-12 w-12" />}
              action={{ label: 'Thêm sách', onClick: () => setAddBookOpen(true) }}
            />
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Tên sách</th>
                    <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Tác giả</th>
                    <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">ISBN</th>
                    <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Có sẵn</th>
                    <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Thể loại</th>
                    <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-7 shrink-0 rounded bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-sm line-clamp-2 max-w-[200px]">{book.title}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-muted-foreground">{book.author}</td>
                      <td className="px-3 py-3">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{book.isbn}</code>
                      </td>
                      <td className="px-3 py-3">
                        <AvailabilityBadge available={book.available} total={book.total} />
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className="text-xs">{book.category}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 cursor-pointer" onClick={() => toast.info(`Xem ${book.title}`)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 cursor-pointer" onClick={() => toast.info(`Sửa ${book.title}`)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
                            onClick={() => toast.success(`Đã cho mượn: ${book.title}`)}
                            disabled={book.available === 0}>
                            <BookMarked className="h-3.5 w-3.5" /> Mượn
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Đang mượn */}
        <TabsContent value="borrowing" className="mt-6">
          <BorrowTable records={borrowedRecords} showAll />
        </TabsContent>

        {/* Quá hạn */}
        <TabsContent value="overdue" className="mt-6">
          {overdueRecords.length === 0 ? (
            <EmptyState
              title="Không có sách quá hạn"
              description="Tất cả sách đã được trả đúng hạn"
              icon={<BookOpen className="h-12 w-12" />}
            />
          ) : (
            <BorrowTable records={overdueRecords} showAll />
          )}
        </TabsContent>

        {/* Thẻ thư viện */}
        <TabsContent value="cards" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Thẻ thư viện</h2>
            <Button size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Cấp thẻ mới')}>
              <Plus className="h-4 w-4" /> Cấp thẻ mới
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mockStudents.slice(0, 9).map((s, i) => {
              const cls = s.classId.replace('lop-', '').toUpperCase().replace('-', '')
              return (
                <div key={s.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {s.name.split(' ').pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.id} · {s.classId.replace('lop-', '').replace('-', '').toUpperCase()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-[10px] h-4">Còn hiệu lực</Badge>
                      <span className="text-[10px] text-muted-foreground">HSD: 31/05/2025</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <AddBookDialog open={addBookOpen} onClose={() => setAddBookOpen(false)} />
    </div>
  )
}

function BorrowTable({ records, showAll = false }: { records: typeof mockBorrows; showAll?: boolean }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Học sinh</th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Sách</th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Ngày mượn</th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Hạn trả</th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Còn lại</th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground text-xs">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id} className={cn(
              'border-t hover:bg-muted/30 transition-colors',
              record.status === 'overdue' && 'bg-red-50/50 dark:bg-red-950/20'
            )}>
              <td className="px-3 py-3">
                <div>
                  <p className="font-medium text-sm">{record.studentName}</p>
                  <p className="text-xs text-muted-foreground">{record.studentClass}</p>
                </div>
              </td>
              <td className="px-3 py-3">
                <p className="text-sm max-w-[160px] truncate">{record.bookTitle}</p>
              </td>
              <td className="px-3 py-3 text-sm text-muted-foreground">{record.borrowDate}</td>
              <td className="px-3 py-3 text-sm">{record.dueDate}</td>
              <td className="px-3 py-3">
                <DueBadge dueDate={record.dueDate} status={record.status} />
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
                    onClick={() => toast.success(`Đã gia hạn cho ${record.studentName}`)}>
                    <Clock className="h-3 w-3" /> Gia hạn
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
                    onClick={() => toast.success(`${record.studentName} đã trả sách`)}>
                    <RotateCcw className="h-3 w-3" /> Trả
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
