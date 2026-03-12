'use client'

import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { useGetBookDetail } from '@/features/library/api/library.api'
import type { BookCopy } from '@/features/library/types/library.types'
import { AppBadge } from '@/components/base'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface BookDetailPortalProps {
  bookId: string
}

const conditionLabel: Record<string, string> = {
  good: 'Tốt',
  fair: 'Khá',
  poor: 'Kém',
  lost: 'Mất',
}

export function BookDetailPortal({ bookId }: BookDetailPortalProps) {
  const { data: book, isLoading } = useGetBookDetail(bookId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-8">
          <Skeleton className="h-80 w-56 rounded-lg shrink-0" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return <div className="text-center py-12 text-muted-foreground">Không tìm thấy sách</div>
  }

  const copies = book.copies ?? []

  return (
    <div className="space-y-8">
      {/* Book info */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={book.title} width={224} height={320} className="rounded-lg object-cover shadow-lg" />
          ) : (
            <div className="flex h-80 w-56 items-center justify-center rounded-lg bg-purple-50 text-purple-300 shadow-lg">
              <BookOpen className="h-16 w-16" />
            </div>
          )}
        </div>
        <div className="space-y-4 flex-1">
          <h1 className="text-3xl font-bold text-foreground">{book.title}</h1>
          <p className="text-lg text-muted-foreground">{book.author}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><span className="text-muted-foreground">ISBN:</span> <span className="font-medium">{book.isbn || '—'}</span></div>
            <div><span className="text-muted-foreground">NXB:</span> <span className="font-medium">{book.publisher ?? '—'}</span></div>
            <div><span className="text-muted-foreground">Năm XB:</span> <span className="font-medium">{book.publishYear ?? '—'}</span></div>
            <div><span className="text-muted-foreground">Danh mục:</span> <span className="font-medium">{book.categoryName ?? '—'}</span></div>
            <div><span className="text-muted-foreground">Vị trí:</span> <span className="font-medium">{book.locationName ?? '—'}</span></div>
          </div>

          <div className="pt-2">
            <AppBadge semantic={book.status === 'available' ? 'success' : 'error'} size="lg">
              {book.availableCopies} bản có sẵn / {book.totalCopies} bản tổng
            </AppBadge>
          </div>

          {book.description && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-2">Mô tả</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Copy list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tình trạng lưu kho</CardTitle>
        </CardHeader>
        <CardContent>
          {copies.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có thông tin bản sao</p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left">Mã cá biệt</th>
                    <th className="px-4 py-2 text-left">Tình trạng</th>
                    <th className="px-4 py-2 text-left">Vị trí</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {copies.map((copy: BookCopy) => (
                    <tr key={copy.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{copy.copyCode}</td>
                      <td className="px-4 py-2">{conditionLabel[copy.condition] ?? copy.condition}</td>
                      <td className="px-4 py-2">{copy.locationName ?? '—'}</td>
                      <td className="px-4 py-2">
                        <AppBadge semantic={copy.isAvailable ? 'success' : 'warning'} size="sm">
                          {copy.isAvailable ? 'Có sẵn' : 'Đang mượn'}
                        </AppBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
