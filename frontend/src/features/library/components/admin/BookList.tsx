'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { Upload, BookOpen } from 'lucide-react'
import { useGetBooks, useDeleteBook } from '@/features/library/api/library.api'
import { useGetCategories } from '@/features/library/api/library.api'
import type { LibraryBook } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { AppBadge, AppSelect } from '@/components/base'
import { toast } from 'sonner'

export function BookList() {
  const router = useRouter()
  const [filters, setFilters] = useState({ search: '', categoryId: '', status: '' })
  const { data: booksData, isLoading } = useGetBooks(filters)
  const { data: categories } = useGetCategories()
  const deleteMut = useDeleteBook()

  const categoryOptions = [
    { value: '', label: 'Tất cả danh mục' },
    ...(categories?.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name })) ?? []),
  ]

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'available', label: 'Có sẵn' },
    { value: 'unavailable', label: 'Hết sách' },
  ]

  const columns: ColumnDef<LibraryBook, unknown>[] = [
    {
      accessorKey: 'coverUrl',
      header: '',
      size: 56,
      enableSorting: false,
      cell: ({ getValue }) => {
        const url = getValue<string | undefined>()
        return url ? (
          <Image src={url} alt="" width={40} height={56} className="rounded object-cover" />
        ) : (
          <div className="flex h-14 w-10 items-center justify-center rounded bg-purple-50 text-purple-400">
            <BookOpen className="h-5 w-5" />
          </div>
        )
      },
    },
    { accessorKey: 'isbn', header: 'ISBN', size: 130 },
    { accessorKey: 'title', header: 'Tên sách' },
    { accessorKey: 'author', header: 'Tác giả' },
    { accessorKey: 'categoryName', header: 'Danh mục', size: 140 },
    { accessorKey: 'totalCopies', header: 'Tổng', size: 70 },
    { accessorKey: 'availableCopies', header: 'Có sẵn', size: 80 },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={val === 'available' ? 'success' : 'error'}>
            {val === 'available' ? 'Có sẵn' : 'Hết sách'}
          </AppBadge>
        )
      },
    },
  ]

  const handleDelete = (row: LibraryBook) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa sách'),
      onError: () => toast.error('Không thể xóa sách'),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AppSelect
          options={categoryOptions}
          value={filters.categoryId}
          onChange={(v) => setFilters((p) => ({ ...p, categoryId: v }))}
          placeholder="Danh mục"
          className="w-48"
        />
        <AppSelect
          options={statusOptions}
          value={filters.status}
          onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
          placeholder="Trạng thái"
          className="w-40"
        />
      </div>
      <CrudPage<LibraryBook>
        title="Quản lý sách"
        subtitle="Danh sách tài liệu trong thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Danh mục sách' },
        ]}
        data={booksData?.data ?? []}
        columns={columns}
        loading={isLoading}
        onCreate={() => router.push('/library/catalog/new')}
        onEdit={(row) => router.push(`/library/catalog/${row.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm sách theo tên, ISBN, tác giả..."
        extraActions={[
          {
            label: 'Import Excel',
            onClick: () => router.push('/library/catalog/import'),
            icon: <Upload className="h-4 w-4" />,
            variant: 'outline',
          },
        ]}
      />
    </div>
  )
}
