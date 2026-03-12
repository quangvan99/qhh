'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronRight, ChevronDown, Plus, Pencil, Trash2, FolderTree } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/components/composite/form-field'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'

// ── Types ──
interface TreeNode {
  id: string
  label: string
  level: number
  children?: TreeNode[]
}

interface CategorySession {
  id: string
  name: string
  startDate: string
  endDate: string
  examCount: number
  studentCount: number
  status: 'preparing' | 'active' | 'completed'
}

// ── Mock Tree Data ──
const mockTree: TreeNode[] = [
  {
    id: 'y-2024', label: '2024-2025', level: 0,
    children: [
      { id: 'y-2024-hk1', label: 'Học kỳ 1', level: 1 },
      { id: 'y-2024-hk2', label: 'Học kỳ 2', level: 1 },
    ],
  },
  {
    id: 'y-2025', label: '2025-2026', level: 0,
    children: [
      { id: 'y-2025-hk1', label: 'Học kỳ 1', level: 1 },
      { id: 'y-2025-hk2', label: 'Học kỳ 2', level: 1 },
    ],
  },
]

// ── Mock Sessions ──
const mockSessionsByCategory: Record<string, CategorySession[]> = {
  'y-2024-hk1': [
    { id: 's-1', name: 'Kiểm tra giữa kỳ 1 (2024-2025)', startDate: '2024-10-15', endDate: '2024-10-20', examCount: 5, studentCount: 200, status: 'completed' },
    { id: 's-2', name: 'Kiểm tra cuối kỳ 1 (2024-2025)', startDate: '2024-12-15', endDate: '2024-12-20', examCount: 8, studentCount: 250, status: 'completed' },
  ],
  'y-2024-hk2': [
    { id: 's-3', name: 'Kiểm tra giữa kỳ 2 (2024-2025)', startDate: '2025-03-10', endDate: '2025-03-15', examCount: 5, studentCount: 210, status: 'completed' },
  ],
  'y-2025-hk1': [
    { id: 's-4', name: 'Kiểm tra giữa kỳ 1 (2025-2026)', startDate: '2025-10-15', endDate: '2025-10-20', examCount: 6, studentCount: 220, status: 'completed' },
    { id: 's-5', name: 'Kiểm tra cuối kỳ 1 (2025-2026)', startDate: '2025-12-15', endDate: '2025-12-20', examCount: 10, studentCount: 280, status: 'completed' },
  ],
  'y-2025-hk2': [
    { id: 's-6', name: 'Kiểm tra giữa kỳ 2 (2025-2026)', startDate: '2026-03-15', endDate: '2026-03-20', examCount: 4, studentCount: 180, status: 'preparing' },
    { id: 's-7', name: 'Kiểm tra cuối kỳ 2 (2025-2026)', startDate: '2026-05-15', endDate: '2026-05-20', examCount: 0, studentCount: 0, status: 'preparing' },
  ],
}

const statusLabels: Record<string, string> = { preparing: 'Chuẩn bị', active: 'Đang thi', completed: 'Đã kết thúc' }
const statusVariants: Record<string, 'info' | 'warning' | 'success'> = { preparing: 'info', active: 'warning', completed: 'success' }

export function SessionCategoryTree() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['y-2025']))
  const [selectedNode, setSelectedNode] = useState<string | null>('y-2025-hk2')
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const sessions = selectedNode ? (mockSessionsByCategory[selectedNode] ?? []) : []

  const columns: ColumnDef<CategorySession, unknown>[] = [
    {
      accessorKey: 'name', header: 'Tên đợt thi',
      cell: ({ row }) => (
        <Link href={`/exam/sessions/${row.original.id}/exams`} className="font-medium hover:underline cursor-pointer">
          {row.original.name}
        </Link>
      ),
    },
    { id: 'period', header: 'Thời gian', cell: ({ row }) => `${row.original.startDate} — ${row.original.endDate}` },
    { accessorKey: 'examCount', header: 'Số ca thi' },
    { accessorKey: 'studentCount', header: 'Số HS' },
    {
      accessorKey: 'status', header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge semantic={statusVariants[row.original.status]} dot>
          {statusLabels[row.original.status]}
        </AppBadge>
      ),
    },
  ]

  const renderNode = (node: TreeNode) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isSelected = selectedNode === node.id

    return (
      <div key={node.id}>
        <button
          className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-1 cursor-pointer ${
            isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
          }`}
          style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) toggleExpand(node.id)
            else setSelectedNode(node.id)
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <span className="w-3.5" />
          )}
          <span>{node.label}</span>
        </button>
        {hasChildren && isExpanded && node.children!.map(renderNode)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Tree sidebar */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              <FolderTree className="h-4 w-4" /> Danh mục đợt thi
            </p>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-0.5">
            <button
              className={`w-full text-left px-2 py-1.5 rounded text-sm cursor-pointer ${
                !selectedNode ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedNode(null)}
            >
              Tất cả
            </button>
            {mockTree.map(renderNode)}
          </div>
        </CardContent>
      </Card>

      {/* Right panel - sessions list */}
      <div className="lg:col-span-3">
        <PageHeader
          title="Danh mục đợt thi"
          breadcrumbs={[
            { label: 'Tổ chức thi', href: '/exam/sessions' },
            { label: 'Danh mục' },
          ]}
          actions={[
            { label: 'Tạo đợt thi', icon: <Plus className="h-4 w-4" />, href: '/exam/sessions/new' },
          ]}
        />

        {selectedNode ? (
          <DataTable data={sessions} columns={columns} pageSize={20} />
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <FolderTree className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Chọn một danh mục từ cây bên trái để xem danh sách đợt thi</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add category dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm danh mục</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <FormField name="year" label="Năm học" required>
              <Input placeholder="VD: 2025-2026" />
            </FormField>
            <FormField name="semester" label="Học kỳ" required>
              <Input placeholder="VD: Học kỳ 1" />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="cursor-pointer">Hủy</Button>
            <Button className="cursor-pointer" onClick={() => { setAddOpen(false); toast.success('Đã thêm danh mục') }}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => { setDeleteOpen(false); toast.success('Đã xóa danh mục') }}
        title="Xóa danh mục"
        description="Xóa danh mục sẽ không xóa các đợt thi trong đó. Bạn có chắc chắn?"
        variant="danger"
      />
    </div>
  )
}
