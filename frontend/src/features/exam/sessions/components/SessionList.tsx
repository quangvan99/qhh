'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import type { ExamSession, SessionStatus } from '../types'

const statusLabels: Record<SessionStatus, string> = { preparing: 'Chuẩn bị', active: 'Đang thi', completed: 'Đã kết thúc' }
const statusVariants: Record<SessionStatus, 'info' | 'warning' | 'success'> = { preparing: 'info', active: 'warning', completed: 'success' }

const mockSessions: ExamSession[] = Array.from({ length: 10 }, (_, i) => ({
  id: `s-${i}`, name: `Đợt thi ${i + 1}: Kiểm tra giữa kỳ`,
  categoryName: 'HK1 - Giữa kỳ', academicYear: '2025-2026', semester: '1',
  startDate: '2026-03-15', endDate: '2026-03-20', examCount: 3 + (i % 5),
  studentCount: 100 + i * 20, status: (['preparing', 'active', 'completed'] as const)[i % 3] as SessionStatus,
  showScoreImmediately: true, createdAt: '2026-03-01',
}))

export function SessionList() {
  const [search, setSearch] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const filtered = mockSessions.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()))

  const columns: ColumnDef<ExamSession, unknown>[] = [
    { accessorKey: 'name', header: 'Tên đợt thi', cell: ({ row }) => (
      <Link href={`/exam/sessions/${row.original.id}/exams`} className="font-medium hover:underline cursor-pointer">{row.original.name}</Link>
    )},
    { accessorKey: 'categoryName', header: 'Danh mục' },
    { id: 'period', header: 'Thời gian', cell: ({ row }) => `${row.original.startDate} — ${row.original.endDate}` },
    { accessorKey: 'examCount', header: 'Số ca thi' },
    { accessorKey: 'studentCount', header: 'Số HS' },
    { accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={statusVariants[row.original.status]} dot>{statusLabels[row.original.status]}</AppBadge> },
    {
      id: 'actions', header: '', size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/sessions/${row.original.id}/edit`}><Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Pencil className="h-3 w-3" /></Button></Link>
          <Link href={`/exam/sessions/${row.original.id}/exams`}><Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Eye className="h-3 w-3" /></Button></Link>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3 w-3" /></Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Tree sidebar */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <p className="font-semibold text-sm mb-3">Danh mục đợt thi</p>
          <div className="space-y-1 text-sm">
            <button className="w-full text-left px-2 py-1.5 rounded hover:bg-muted cursor-pointer font-medium">Tất cả đợt thi</button>
            <button className="w-full text-left px-4 py-1.5 rounded hover:bg-muted cursor-pointer text-muted-foreground">2025-2026 &gt; HK1</button>
            <button className="w-full text-left px-6 py-1.5 rounded hover:bg-muted cursor-pointer text-muted-foreground">Giữa kỳ</button>
            <button className="w-full text-left px-6 py-1.5 rounded hover:bg-muted cursor-pointer text-muted-foreground">Cuối kỳ</button>
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full cursor-pointer text-xs"><Plus className="h-3 w-3 mr-1" /> Thêm danh mục</Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        <PageHeader title="Tổ chức thi" actions={[{ label: 'Tạo đợt thi', icon: <Plus className="h-4 w-4" />, href: '/exam/sessions/new' }]} />
        <div className="flex items-center gap-3 mb-4">
          <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm đợt thi..." className="max-w-sm" />
        </div>
        <DataTable data={filtered} columns={columns} pageSize={20} />
      </div>
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa đợt thi" description="Xóa đợt thi và tất cả ca thi liên quan?" variant="danger" />
    </div>
  )
}
