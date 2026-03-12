'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { SearchBar } from '@/components/composite/search-bar'

interface Teacher { id: string; name: string; email: string; avatar?: string; roleInClass: 'main' | 'support' }

const mockTeachers: Teacher[] = [
  { id: 't-1', name: 'Nguyễn Thị Hương', email: 'huong@quochoc.edu.vn', roleInClass: 'main' },
  { id: 't-2', name: 'Trần Văn Minh', email: 'minh@quochoc.edu.vn', roleInClass: 'support' },
  { id: 't-3', name: 'Lê Thị Lan', email: 'lan@quochoc.edu.vn', roleInClass: 'support' },
]

export function TeacherList({ classId }: { classId: string }) {
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const mainTeacher = mockTeachers.find((t) => t.roleInClass === 'main')
  const supportTeachers = mockTeachers.filter((t) => t.roleInClass === 'support')

  const columns: ColumnDef<Teacher, unknown>[] = [
    { accessorKey: 'name', header: 'Giảng viên', cell: ({ row }) => (
      <div className="flex items-center gap-2"><AppAvatar name={row.original.name} size="xs" role="teacher" /><span>{row.original.name}</span></div>
    )},
    { accessorKey: 'email', header: 'Email' },
    { id: 'actions', header: '', cell: () => (
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3 w-3" /></Button>
    ), enableSorting: false },
  ]

  return (
    <div>
      <PageHeader
        title="Giảng viên"
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Giảng viên' }]}
        actions={[{ label: 'Thêm giảng viên', icon: <Plus className="h-4 w-4" />, onClick: () => setAddOpen(true) }]}
      />
      {mainTeacher && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Giảng viên chính</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-3">
            <AppAvatar name={mainTeacher.name} size="md" role="teacher" showRing />
            <div><p className="font-semibold">{mainTeacher.name}</p><p className="text-sm text-muted-foreground">{mainTeacher.email}</p></div>
            <AppBadge role="teacher" size="sm" className="ml-auto">Giảng viên chính</AppBadge>
            <Button variant="outline" size="sm" className="cursor-pointer">Thay đổi</Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Giảng viên hỗ trợ</CardTitle>
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setAddOpen(true)}><Plus className="h-3 w-3 mr-1" /> Thêm</Button>
        </CardHeader>
        <CardContent><DataTable data={supportTeachers} columns={columns} pageSize={10} /></CardContent>
      </Card>
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm giảng viên</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tìm giảng viên</Label><SearchBar value="" onChange={() => {}} placeholder="Tìm theo tên hoặc email..." /></div>
            <div><Label>Vai trò</Label><Select><SelectTrigger><SelectValue placeholder="Chọn vai trò" /></SelectTrigger><SelectContent><SelectItem value="main">Giảng viên chính</SelectItem><SelectItem value="support">Hỗ trợ</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddOpen(false)} className="cursor-pointer">Hủy</Button><Button className="cursor-pointer">Thêm</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa giảng viên" description="Bạn có chắc muốn xóa giảng viên này khỏi lớp?" variant="danger" />
    </div>
  )
}
