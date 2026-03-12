'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Copy, Trash2, Download, FileEdit } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'
import type { ExamPaper } from '../types'

const mockExams: ExamPaper[] = Array.from({ length: 15 }, (_, i) => ({
  id: `e-${i}`, name: `Đề thi ${i + 1}: Kiểm tra cuối kỳ`, categoryName: ['Toán học', 'Vật lý', 'Hóa học'][i % 3],
  totalQuestions: 30 + (i % 20), duration: 45 + (i % 4) * 15, totalScore: 10,
  sections: [], authorId: 'u-1', authorName: 'GV. Nguyễn Văn A',
  status: i % 3 === 0 ? 'draft' : 'published' as const,
  createdAt: '2026-03-01', updatedAt: '2026-03-10',
}))

export function ExamList() {
  const [search, setSearch] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const filtered = mockExams.filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()))

  const columns: ColumnDef<ExamPaper, unknown>[] = [
    { accessorKey: 'name', header: 'Tên đề thi', cell: ({ row }) => (
      <Link href={`/exam/exams/${row.original.id}/edit`} className="font-medium hover:underline cursor-pointer">{row.original.name}</Link>
    )},
    { accessorKey: 'categoryName', header: 'Danh mục' },
    { accessorKey: 'totalQuestions', header: 'Số câu' },
    { accessorKey: 'duration', header: 'Thời gian (phút)' },
    { accessorKey: 'authorName', header: 'Tác giả' },
    { accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <AppBadge semantic={row.original.status === 'published' ? 'success' : 'neutral'} dot>{row.original.status === 'published' ? 'Đã xuất bản' : 'Nháp'}</AppBadge> },
    {
      id: 'actions', header: '', size: 140,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/exams/${row.original.id}/edit`}><Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Chỉnh sửa"><Pencil className="h-3 w-3" /></Button></Link>
          <Link href={`/exam/exams/${row.original.id}/builder`}><Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Exam Builder"><FileEdit className="h-3 w-3" /></Button></Link>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Sao chép" onClick={() => toast.success('Đã sao chép đề thi')}><Copy className="h-3 w-3" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Xuất đề"><Download className="h-3 w-3" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3 w-3" /></Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader title="Đề thi" actions={[{ label: 'Tạo đề thi', icon: <Plus className="h-4 w-4" />, href: '/exam/exams/new' }]} />
      <div className="flex items-center gap-3 mb-4">
        <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Danh mục" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select>
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm đề thi..." className="max-w-sm" />
      </div>
      <DataTable data={filtered} columns={columns} pageSize={20} />
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa đề thi" description="Bạn có chắc muốn xóa đề thi này?" variant="danger" />
    </div>
  )
}
