'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, Eye, FolderPlus } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import Link from 'next/link'
import type { ExamSession, SessionStatus } from '../types'
import {
  useGetSessions,
  useDeleteSession,
  useActivateSession,
  useCompleteSession,
  useGetSessionCategories,
} from '../hooks'

const STATUS_LABELS: Record<SessionStatus, string> = {
  preparing: 'Chuẩn bị',
  active: 'Đang thi',
  completed: 'Đã kết thúc',
}
const STATUS_SEMANTICS: Record<SessionStatus, 'info' | 'warning' | 'success'> = {
  preparing: 'info',
  active: 'warning',
  completed: 'success',
}

export function SessionList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string | undefined>()
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: sessionsData, isLoading } = useGetSessions({ q: search, status, categoryId })
  const { data: catData } = useGetSessionCategories()
  const deleteMut = useDeleteSession()
  const activateMut = useActivateSession()
  const completeMut = useCompleteSession()

  const sessions = sessionsData?.data ?? []
  const categories = catData?.data ?? []

  // Flatten categories for sidebar
  const flatCats = categories.flatMap((c) => [
    { id: c.id, name: c.name, level: 0 },
    ...(c.children ?? []).map((child) => ({ id: child.id, name: child.name, level: 1 })),
  ])

  const columns: ColumnDef<ExamSession, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Tên đợt thi',
      cell: ({ row }) => (
        <Link href={`/exam/sessions/${row.original.id}/exams`} className="font-medium hover:underline cursor-pointer">
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'categoryName', header: 'Danh mục' },
    {
      id: 'period',
      header: 'Thời gian',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.startDate).toLocaleDateString('vi-VN')} —{' '}
          {new Date(row.original.endDate).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      accessorKey: 'examCount',
      header: 'Số ca thi',
      cell: ({ row }) => <span>{row.original.examCount} ca</span>,
    },
    {
      accessorKey: 'studentCount',
      header: 'Số HS',
      cell: ({ row }) => <span>{row.original.studentCount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge semantic={STATUS_SEMANTICS[row.original.status]} dot>
          {STATUS_LABELS[row.original.status]}
        </AppBadge>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 160,
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/exam/sessions/${s.id}/exams`}>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Xem ca thi">
                <Eye className="h-3 w-3" />
              </Button>
            </Link>
            <Link href={`/exam/sessions/${s.id}/edit`}>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Chỉnh sửa">
                <Pencil className="h-3 w-3" />
              </Button>
            </Link>
            {s.status === 'preparing' && (
              <Button
                variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs text-amber-600"
                onClick={() => activateMut.mutate(s.id, { onSuccess: () => toast.success('Đã mở đợt thi') })}
                disabled={activateMut.isPending}
              >
                Mở
              </Button>
            )}
            {s.status === 'active' && (
              <Button
                variant="ghost" size="sm" className="h-7 px-2 cursor-pointer text-xs text-emerald-600"
                onClick={() => completeMut.mutate(s.id, { onSuccess: () => toast.success('Đã kết thúc đợt thi') })}
                disabled={completeMut.isPending}
              >
                Kết thúc
              </Button>
            )}
            <Button
              variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" title="Xóa"
              onClick={() => setDeleteId(s.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Category sidebar */}
      <Card className="lg:col-span-1 h-fit">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">Danh mục đợt thi</p>
            <Link href="/exam/sessions/categories">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer" title="Quản lý danh mục">
                <FolderPlus className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-0.5 text-sm">
            <button
              className={`w-full text-left px-2 py-1.5 rounded hover:bg-muted cursor-pointer font-medium ${!categoryId ? 'bg-muted' : ''}`}
              onClick={() => setCategoryId(undefined)}
            >
              Tất cả đợt thi
            </button>
            {flatCats.map((cat) => (
              <button
                key={cat.id}
                className={`w-full text-left py-1.5 rounded hover:bg-muted cursor-pointer ${
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

      {/* Main content */}
      <div className="lg:col-span-3">
        <PageHeader
          title="Tổ chức thi"
          actions={[{ label: 'Tạo đợt thi', icon: <Plus className="h-4 w-4" />, href: '/exam/sessions/new' }]}
        />
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={status ?? 'all'} onValueChange={(v: string | null) => setStatus(!v || v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="preparing">Chuẩn bị</SelectItem>
              <SelectItem value="active">Đang thi</SelectItem>
              <SelectItem value="completed">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm đợt thi..." className="max-w-sm" />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <DataTable data={sessions} columns={columns} pageSize={20} />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        onConfirm={() => {
          if (deleteId) {
            deleteMut.mutate(deleteId, {
              onSuccess: () => { toast.success('Đã xóa đợt thi'); setDeleteId(null) },
              onError: () => toast.error('Xóa thất bại'),
            })
          }
        }}
        title="Xóa đợt thi"
        description="Xóa đợt thi sẽ xóa tất cả ca thi và dữ liệu liên quan. Hành động này không thể hoàn tác."
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  )
}
