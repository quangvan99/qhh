'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Upload, Download, Trash2, Copy, Pencil, FolderPlus, BarChart2 } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { toast } from 'sonner'
import type { Question, Difficulty } from '../types'
import {
  useGetQuestions,
  useDeleteQuestion,
  useCopyQuestion,
  useGetCategories,
  useGetQuestionStats,
  useBulkDeleteQuestions,
} from '../hooks'

const DIFF_LABELS: Record<Difficulty, string> = { easy: 'Dễ', medium: 'TB', hard: 'Khó', very_hard: 'Rất khó' }
const DIFF_VARIANTS: Record<Difficulty, 'success' | 'info' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'info',
  hard: 'warning',
  very_hard: 'error',
}

const TYPE_LABELS: Record<string, string> = {
  single_choice: 'Trắc nghiệm',
  multi_choice: 'Nhiều lựa chọn',
  true_false: 'Đúng / Sai',
  fill_blank: 'Điền khuyết',
  essay: 'Tự luận',
  parent_child: 'Nhóm câu',
}

export function QuestionBankPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<string | undefined>()
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [tab, setTab] = useState<'mcq' | 'essay'>('mcq')

  const isMcq = tab === 'mcq'
  const typeFilter = isMcq ? undefined : 'essay'

  const { data: questionsData, isLoading } = useGetQuestions({
    q: search || undefined,
    difficulty: difficulty,
    categoryId: categoryId,
    type: typeFilter,
  })
  const { data: catData } = useGetCategories()
  const { data: statsData } = useGetQuestionStats()
  const deleteMut = useDeleteQuestion()
  const copyMut = useCopyQuestion()
  const bulkDelete = useBulkDeleteQuestions()

  const allQuestions = questionsData?.data ?? []
  const questions = isMcq
    ? allQuestions.filter((q) => q.type !== 'essay')
    : allQuestions.filter((q) => q.type === 'essay')

  const categories = catData?.data ?? []
  const stats = statsData?.data

  // Flatten categories for sidebar
  const flatCats = categories.flatMap((c) => [
    { id: c.id, name: c.name, level: 0 },
    ...(c.children ?? []).map((ch) => ({ id: ch.id, name: ch.name, level: 1 })),
  ])

  const columns: ColumnDef<Question, unknown>[] = [
    {
      accessorKey: 'type',
      header: 'Loại',
      size: 110,
      cell: ({ row }) => (
        <AppBadge semantic="info" size="sm">
          {TYPE_LABELS[row.original.type] ?? row.original.type}
        </AppBadge>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Nội dung câu hỏi',
      cell: ({ row }) => (
        <span className="text-sm line-clamp-2 block max-w-lg">{row.original.content}</span>
      ),
    },
    { accessorKey: 'categoryName', header: 'Danh mục', size: 120 },
    {
      accessorKey: 'difficulty',
      header: 'Độ khó',
      size: 90,
      cell: ({ row }) => (
        <AppBadge semantic={DIFF_VARIANTS[row.original.difficulty]} size="sm">
          {DIFF_LABELS[row.original.difficulty]}
        </AppBadge>
      ),
    },
    { accessorKey: 'authorName', header: 'Tác giả', size: 130 },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      size: 100,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      id: 'actions',
      header: '',
      size: 110,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/question-bank/${row.original.type === 'essay' ? 'essay' : 'mcq'}/${row.original.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Chỉnh sửa">
              <Pencil className="h-3 w-3" />
            </Button>
          </Link>
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Sao chép"
            onClick={() =>
              copyMut.mutate(row.original.id, { onSuccess: () => toast.success('Đã sao chép câu hỏi') })
            }
          >
            <Copy className="h-3 w-3" />
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left sidebar: categories + stats */}
      <div className="lg:col-span-1 space-y-4">
        {/* Category tree */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm">Danh mục câu hỏi</p>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer" title="Thêm danh mục">
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-0.5 text-sm max-h-72 overflow-y-auto">
              <button
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-muted cursor-pointer font-medium ${!categoryId ? 'bg-muted' : ''}`}
                onClick={() => setCategoryId(undefined)}
              >
                Tất cả câu hỏi
              </button>
              {flatCats.map((cat) => (
                <button
                  key={cat.id}
                  className={`w-full text-left py-1.5 rounded hover:bg-muted cursor-pointer transition-colors ${
                    categoryId === cat.id ? 'bg-muted font-medium' : 'text-muted-foreground'
                  }`}
                  style={{ paddingLeft: `${(cat.level + 1) * 12}px` }}
                  onClick={() => setCategoryId(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats widget */}
        {stats && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-sm">Thống kê</p>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mb-3">câu hỏi</p>
              <div className="space-y-2">
                {Object.entries(stats.byDifficulty).map(([diff, count]) => (
                  <div key={diff}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                      <span>{DIFF_LABELS[diff as Difficulty] ?? diff}</span>
                      <span>{count}</span>
                    </div>
                    <Progress value={(count / stats.total) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main content */}
      <div className="lg:col-span-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'mcq' | 'essay')}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <TabsList>
              <TabsTrigger value="mcq">
                Trắc nghiệm
                {stats && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{(stats.byType.single_choice ?? 0) + (stats.byType.multi_choice ?? 0) + (stats.byType.true_false ?? 0) + (stats.byType.fill_blank ?? 0)}</span>}
              </TabsTrigger>
              <TabsTrigger value="essay">
                Tự luận
                {stats && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{stats.byType.essay ?? 0}</span>}
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Link href={`/exam/question-bank/${tab}/new`}>
                <Button size="sm" className="cursor-pointer">
                  <Plus className="h-3 w-3 mr-1" /> Thêm câu hỏi
                </Button>
              </Link>
              <Link href={`/exam/question-bank/${tab}/import`}>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Upload className="h-3 w-3 mr-1" /> Import
                </Button>
              </Link>
              <Button
                variant="outline" size="sm" className="cursor-pointer"
                onClick={() => toast.success(`Đang xuất ${questions.length} câu hỏi...`)}
              >
                <Download className="h-3 w-3 mr-1" /> Xuất Excel
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Select value={difficulty ?? 'all'} onValueChange={(v: string | null) => setDifficulty(!v || v === 'all' ? undefined : v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
                <SelectItem value="very_hard">Rất khó</SelectItem>
              </SelectContent>
            </Select>
            <SearchBar value={search} onChange={setSearch} placeholder="Tìm câu hỏi theo nội dung..." className="max-w-sm" />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <>
              <TabsContent value="mcq">
                <DataTable data={questions} columns={columns} selectable pageSize={20} />
              </TabsContent>
              <TabsContent value="essay">
                <DataTable data={questions} columns={columns} selectable pageSize={20} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        onConfirm={() => {
          if (deleteId) {
            deleteMut.mutate(deleteId, {
              onSuccess: () => { toast.success('Đã xóa câu hỏi'); setDeleteId(null) },
              onError: () => toast.error('Xóa thất bại'),
            })
          }
        }}
        title="Xóa câu hỏi"
        description="Câu hỏi này sẽ bị xóa khỏi ngân hàng đề thi. Hành động không thể hoàn tác."
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  )
}
