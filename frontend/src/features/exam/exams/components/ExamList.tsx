'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Copy, Trash2, Download, FileEdit, Eye } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import Link from 'next/link'
import type { ExamPaper } from '../types'
import { useGetExams, useDeleteExam, useCopyExam, useGetExamCategories } from '../hooks'

export function ExamList() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [status, setStatus] = useState<string | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: examsData, isLoading } = useGetExams({ q: search, categoryId, status })
  const { data: catData } = useGetExamCategories()
  const deleteMut = useDeleteExam()
  const copyMut = useCopyExam()

  const exams = examsData?.data ?? []
  const categories = catData?.data ?? []

  const columns: ColumnDef<ExamPaper, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Tên đề thi',
      cell: ({ row }) => (
        <Link href={`/exam/exams/${row.original.id}/edit`} className="font-medium hover:underline cursor-pointer">
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'categoryName', header: 'Danh mục' },
    { accessorKey: 'totalQuestions', header: 'Số câu' },
    {
      accessorKey: 'duration',
      header: 'Thời gian',
      cell: ({ row }) => `${row.original.duration} phút`,
    },
    { accessorKey: 'authorName', header: 'Tác giả' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge semantic={row.original.status === 'published' ? 'success' : 'neutral'} dot>
          {row.original.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
        </AppBadge>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 180,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/exams/${row.original.id}/builder`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Exam Builder">
              <FileEdit className="h-3 w-3" />
            </Button>
          </Link>
          <Link href={`/exam/exams/${row.original.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Chỉnh sửa">
              <Pencil className="h-3 w-3" />
            </Button>
          </Link>
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Sao chép"
            onClick={() => copyMut.mutate(row.original.id, { onSuccess: () => toast.success('Đã sao chép đề thi') })}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Xuất đề" onClick={() => toast.info('Đang xuất...')}>
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" title="Xóa"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Đề thi"
        actions={[{ label: 'Tạo đề thi', icon: <Plus className="h-4 w-4" />, href: '/exam/exams/new' }]}
      />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={categoryId ?? 'all'} onValueChange={(v: string | null) => setCategoryId(!v || v === 'all' ? undefined : v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status ?? 'all'} onValueChange={(v: string | null) => setStatus(!v || v === 'all' ? undefined : v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="published">Đã xuất bản</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
          </SelectContent>
        </Select>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm đề thi..." className="max-w-sm" />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : (
        <DataTable data={exams} columns={columns} pageSize={20} />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        onConfirm={() => {
          if (deleteId) {
            deleteMut.mutate(deleteId, {
              onSuccess: () => { toast.success('Đã xóa đề thi'); setDeleteId(null) },
              onError: () => toast.error('Xóa thất bại'),
            })
          }
        }}
        title="Xóa đề thi"
        description="Bạn có chắc muốn xóa đề thi này? Hành động này không thể hoàn tác."
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  )
}
