'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { useGetBooks, useGetCategories } from '@/features/library/api/library.api'
import type { LibraryBook, LibraryCategory } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { StatGrid, ChartCard, DataTable } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { BookOpen, Archive, CheckCircle2, XCircle } from 'lucide-react'

export function InventoryReport() {
  const { data: booksData, isLoading } = useGetBooks({ search: '' })
  const { data: categories } = useGetCategories()
  const books = booksData?.data ?? []

  const totalBooks = books.length
  const totalCopies = books.reduce((sum: number, b: LibraryBook) => sum + b.totalCopies, 0)
  const availableCopies = books.reduce((sum: number, b: LibraryBook) => sum + b.availableCopies, 0)
  const unavailableBooks = books.filter((b: LibraryBook) => b.status === 'unavailable').length

  const categoryData = categories?.map((cat: LibraryCategory) => ({
    name: cat.name,
    value: cat.bookCount,
  })) ?? []

  const columns: ColumnDef<LibraryBook, unknown>[] = [
    { accessorKey: 'title', header: 'Tên sách' },
    { accessorKey: 'author', header: 'Tác giả' },
    { accessorKey: 'categoryName', header: 'Danh mục' },
    { accessorKey: 'totalCopies', header: 'Tổng bản', size: 100 },
    { accessorKey: 'availableCopies', header: 'Có sẵn', size: 100 },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={val === 'available' ? 'success' : 'error'}>
            {val === 'available' ? 'Có sẵn' : 'Hết'}
          </AppBadge>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo kiểm kê"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Kiểm kê' },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng đầu sách', value: totalBooks, icon: <BookOpen className="h-5 w-5" />, module: 'library' },
          { title: 'Tổng bản sao', value: totalCopies, icon: <Archive className="h-5 w-5" />, module: 'library' },
          { title: 'Bản có sẵn', value: availableCopies, icon: <CheckCircle2 className="h-5 w-5" />, module: 'library' },
          { title: 'Hết sách', value: unavailableBooks, icon: <XCircle className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <ChartCard
        title="Sách theo danh mục"
        type="pie"
        data={categoryData}
        dataKey="value"
        colors={['#7c3aed', '#a855f7', '#c084fc', '#e9d5ff', '#6d28d9', '#5b21b6']}
      />

      <DataTable<LibraryBook>
        data={books}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm sách..."
      />
    </div>
  )
}
