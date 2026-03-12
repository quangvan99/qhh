'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ColumnDef } from '@tanstack/react-table'
import { BookOpen, Plus, Pencil, Trash2 } from 'lucide-react'
import { useGetBook, useGetBookCopies, useGetBorrows, useCreateCopy, useUpdateCopy, useDeleteCopy } from '@/features/library/api/library.api'
import type { BookCopy, BorrowRecord } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { AppBadge, AppInput, AppSelect } from '@/components/base'
import { DataTable } from '@/components/patterns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface BookDetailProps {
  bookId: string
}

const conditionOptions = [
  { value: 'good', label: 'Tốt' },
  { value: 'fair', label: 'Khá' },
  { value: 'poor', label: 'Kém' },
  { value: 'lost', label: 'Mất' },
]

const conditionLabel: Record<string, string> = {
  good: 'Tốt',
  fair: 'Khá',
  poor: 'Kém',
  lost: 'Mất',
}

export function BookDetail({ bookId }: BookDetailProps) {
  const { data: book, isLoading } = useGetBook(bookId)
  const { data: copies } = useGetBookCopies(bookId)
  const { data: borrowsData } = useGetBorrows({ status: '', memberId: '' })
  const createCopyMut = useCreateCopy()
  const updateCopyMut = useUpdateCopy()
  const deleteCopyMut = useDeleteCopy()

  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const [editingCopy, setEditingCopy] = useState<BookCopy | null>(null)
  const [copyForm, setCopyForm] = useState({ copyCode: '', condition: 'good', locationId: '' })

  const bookBorrows = borrowsData?.data?.filter(
    (b: BorrowRecord) => copies?.some((c: BookCopy) => c.id === b.copyId)
  ) ?? []

  const openCreateCopy = () => {
    setEditingCopy(null)
    setCopyForm({ copyCode: '', condition: 'good', locationId: '' })
    setCopyDialogOpen(true)
  }

  const openEditCopy = (copy: BookCopy) => {
    setEditingCopy(copy)
    setCopyForm({ copyCode: copy.copyCode, condition: copy.condition, locationId: copy.locationId ?? '' })
    setCopyDialogOpen(true)
  }

  const handleCopySubmit = async () => {
    if (!copyForm.copyCode.trim()) {
      toast.error('Vui lòng nhập mã cá biệt')
      return
    }
    if (editingCopy) {
      await updateCopyMut.mutateAsync({
        ...editingCopy,
        copyCode: copyForm.copyCode,
        condition: copyForm.condition as BookCopy['condition'],
        locationId: copyForm.locationId || undefined,
      })
      toast.success('Đã cập nhật bản sao')
    } else {
      await createCopyMut.mutateAsync({
        bookId,
        copyCode: copyForm.copyCode,
        condition: copyForm.condition,
        locationId: copyForm.locationId || undefined,
      })
      toast.success('Đã thêm bản sao')
    }
    setCopyDialogOpen(false)
  }

  const handleDeleteCopy = (copy: BookCopy) => {
    deleteCopyMut.mutate(copy.id, {
      onSuccess: () => toast.success('Đã xóa bản sao'),
      onError: () => toast.error('Không thể xóa bản sao'),
    })
  }

  const copyColumns: ColumnDef<BookCopy, unknown>[] = [
    { accessorKey: 'copyCode', header: 'Mã cá biệt' },
    {
      accessorKey: 'condition',
      header: 'Tình trạng',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const semantic = val === 'good' ? 'success' : val === 'fair' ? 'info' : val === 'poor' ? 'warning' : 'error'
        return <AppBadge semantic={semantic}>{conditionLabel[val] ?? val}</AppBadge>
      },
    },
    { accessorKey: 'locationName', header: 'Vị trí' },
    {
      accessorKey: 'isAvailable',
      header: 'Trạng thái',
      cell: ({ getValue }) => (
        <AppBadge semantic={getValue<boolean>() ? 'success' : 'warning'}>
          {getValue<boolean>() ? 'Có sẵn' : 'Đang mượn'}
        </AppBadge>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEditCopy(row.original)} className="cursor-pointer h-8 w-8 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCopy(row.original)}
            className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  const borrowColumns: ColumnDef<BorrowRecord, unknown>[] = [
    { accessorKey: 'memberName', header: 'Người mượn' },
    { accessorKey: 'borrowedAt', header: 'Ngày mượn', cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN') },
    { accessorKey: 'dueDate', header: 'Hạn trả', cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN') },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const semantic = val === 'returned' ? 'success' : val === 'overdue' ? 'error' : 'info'
        const label = val === 'returned' ? 'Đã trả' : val === 'overdue' ? 'Quá hạn' : 'Đang mượn'
        return <AppBadge semantic={semantic}>{label}</AppBadge>
      },
    },
  ]

  if (isLoading || !book) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={book.title}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Danh mục sách', href: '/library/catalog' },
          { label: book.title },
        ]}
        actions={[
          { label: 'Sửa', href: `/library/catalog/${bookId}/edit`, variant: 'outline' },
        ]}
      />

      {/* Book info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="shrink-0">
              {book.coverUrl ? (
                <Image src={book.coverUrl} alt={book.title} width={160} height={224} className="rounded-lg object-cover" />
              ) : (
                <div className="flex h-56 w-40 items-center justify-center rounded-lg bg-purple-50 text-purple-400">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="space-y-3 flex-1">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><span className="text-muted-foreground">ISBN:</span> <span className="font-medium">{book.isbn || '—'}</span></div>
                <div><span className="text-muted-foreground">Tác giả:</span> <span className="font-medium">{book.author}</span></div>
                <div><span className="text-muted-foreground">NXB:</span> <span className="font-medium">{book.publisher ?? '—'}</span></div>
                <div><span className="text-muted-foreground">Năm XB:</span> <span className="font-medium">{book.publishYear ?? '—'}</span></div>
                <div><span className="text-muted-foreground">Danh mục:</span> <span className="font-medium">{book.categoryName ?? '—'}</span></div>
                <div><span className="text-muted-foreground">Vị trí:</span> <span className="font-medium">{book.locationName ?? '—'}</span></div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <AppBadge semantic={book.status === 'available' ? 'success' : 'error'} size="lg">
                  {book.availableCopies} bản có sẵn / {book.totalCopies} bản tổng
                </AppBadge>
              </div>
              {book.description && (
                <p className="text-sm text-muted-foreground pt-2">{book.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="copies">
        <TabsList>
          <TabsTrigger value="copies" className="cursor-pointer">Bản sao ({copies?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="borrows" className="cursor-pointer">Lịch sử mượn</TabsTrigger>
        </TabsList>
        <TabsContent value="copies" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Danh sách bản sao</CardTitle>
              <Button size="sm" onClick={openCreateCopy} className="cursor-pointer">
                <Plus className="mr-1 h-4 w-4" /> Thêm bản sao
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable<BookCopy>
                data={copies ?? []}
                columns={copyColumns}
                searchable={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="borrows" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lịch sử mượn trả</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable<BorrowRecord>
                data={bookBorrows}
                columns={borrowColumns}
                searchable={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Copy dialog */}
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCopy ? 'Sửa bản sao' : 'Thêm bản sao'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AppInput
              label="Mã cá biệt"
              required
              value={copyForm.copyCode}
              onChange={(e) => setCopyForm((p) => ({ ...p, copyCode: e.target.value }))}
              placeholder="Nhập mã cá biệt..."
            />
            <AppSelect
              label="Tình trạng"
              options={conditionOptions}
              value={copyForm.condition}
              onChange={(v) => setCopyForm((p) => ({ ...p, condition: v }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCopyDialogOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button
              onClick={handleCopySubmit}
              disabled={createCopyMut.isPending || updateCopyMut.isPending}
              className="cursor-pointer"
            >
              {editingCopy ? 'Cập nhật' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
