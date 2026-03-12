'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchOPAC, useGetCategories } from '@/features/library/api/library.api'
import type { LibraryBook } from '@/features/library/types/library.types'
import { AppBadge, AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export function OPACSearch() {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [author, setAuthor] = useState('')
  const [yearFrom, setYearFrom] = useState<number | undefined>()
  const [yearTo, setYearTo] = useState<number | undefined>()
  const [available, setAvailable] = useState(false)
  const [page, setPage] = useState(1)

  const { data: categories } = useGetCategories()
  const { data: searchData, isLoading } = useSearchOPAC({
    q: query,
    categoryId: categoryId || undefined,
    author: author || undefined,
    yearFrom,
    yearTo,
    available: available || undefined,
    page,
    pageSize: 20,
  })

  const categoryOptions = [
    { value: '', label: 'Tất cả thể loại' },
    ...(categories?.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name })) ?? []),
  ]

  const books = searchData?.data ?? []
  const total = searchData?.total ?? 0
  const totalPages = Math.ceil(total / 20) || 1

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <AppInput
          placeholder="Tìm theo tên sách, tác giả, ISBN, từ khóa..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          leftAddon={<Search className="h-5 w-5" />}
          className="text-lg"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <AppSelect
          options={categoryOptions}
          value={categoryId}
          onChange={(v) => { setCategoryId(v); setPage(1) }}
          placeholder="Thể loại"
          className="w-48"
        />
        <AppInput
          placeholder="Tác giả..."
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setPage(1) }}
          className="w-44"
        />
        <AppInput
          type="number"
          placeholder="Từ năm"
          value={yearFrom !== undefined ? String(yearFrom) : ''}
          onChange={(e) => { setYearFrom(e.target.value ? Number(e.target.value) : undefined); setPage(1) }}
          className="w-28"
        />
        <AppInput
          type="number"
          placeholder="Đến năm"
          value={yearTo !== undefined ? String(yearTo) : ''}
          onChange={(e) => { setYearTo(e.target.value ? Number(e.target.value) : undefined); setPage(1) }}
          className="w-28"
        />
        <div className="flex items-center gap-2 pb-1">
          <Switch checked={available} onCheckedChange={(v) => { setAvailable(v); setPage(1) }} />
          <Label className="text-sm">Chỉ có sẵn</Label>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {isLoading ? 'Đang tìm...' : `Tìm thấy ${total} kết quả`}
      </p>

      {/* Card grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.map((book: LibraryBook) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function BookCard({ book }: { book: LibraryBook }) {
  return (
    <Link href={`/library-portal/opac/${book.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <div className="aspect-[3/4] relative bg-purple-50">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-purple-300">
              <BookOpen className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="p-3 space-y-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
          <AppBadge
            semantic={book.status === 'available' ? 'success' : 'error'}
            size="sm"
          >
            {book.status === 'available' ? `Có sẵn (${book.availableCopies})` : 'Hết sách'}
          </AppBadge>
        </div>
      </div>
    </Link>
  )
}
