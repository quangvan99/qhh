'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Pencil, Trash2, Play } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/patterns/data-table'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import {
  useGetScholarshipSessions,
  useCreateScholarshipSession,
  useUpdateScholarshipSession,
  useDeleteScholarshipSession,
  useProcessScholarshipSession,
} from '../api/gddt.api'
import type { ScholarshipSession } from '../types/gddt.types'
import { toast } from 'sonner'

const sessionSchema = z.object({
  name: z.string().min(1, 'Tên đợt là bắt buộc'),
  year: z.string().min(1, 'Năm học là bắt buộc'),
  term: z.enum(['HK1', 'HK2', 'CN']),
  startDate: z.string().min(1, 'Chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Chọn ngày kết thúc'),
  levelIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 mức'),
})

type FormValues = z.infer<typeof sessionSchema>

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  pending: { label: 'Chưa xét', variant: 'secondary' },
  processing: { label: 'Đang xét', variant: 'outline' },
  completed: { label: 'Đã xét', variant: 'default' },
}

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const y = currentYear - i
  return `${y}-${y + 1}`
})

export function ScholarshipSessionForm() {
  const { data, isLoading } = useGetScholarshipSessions()
  const createMutation = useCreateScholarshipSession()
  const updateMutation = useUpdateScholarshipSession()
  const deleteMutation = useDeleteScholarshipSession()
  const processMutation = useProcessScholarshipSession()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<ScholarshipSession | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ScholarshipSession | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      year: yearOptions[0] ?? '',
      term: 'HK1',
      startDate: '',
      endDate: '',
      levelIds: [],
    },
  })

  const openCreate = () => {
    setEditingSession(null)
    form.reset({
      name: '',
      year: yearOptions[0] ?? '',
      term: 'HK1',
      startDate: '',
      endDate: '',
      levelIds: [],
    })
    setDialogOpen(true)
  }

  const openEdit = (session: ScholarshipSession) => {
    setEditingSession(session)
    form.reset({
      name: session.name,
      year: session.year,
      term: session.term,
      startDate: session.startDate,
      endDate: session.endDate,
      levelIds: session.levelIds,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingSession) {
        await updateMutation.mutateAsync({
          id: editingSession.id,
          status: editingSession.status,
          ...values,
        })
        toast.success('Cập nhật đợt xét tuyển thành công')
      } else {
        await createMutation.mutateAsync(values)
        toast.success('Thêm đợt xét tuyển thành công')
      }
      setDialogOpen(false)
    } catch {
      toast.error('Lỗi khi lưu')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('Xóa thành công')
      setDeleteTarget(null)
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  const handleProcess = async (id: string) => {
    try {
      await processMutation.mutateAsync(id)
      toast.success('Đang xét học bổng...')
    } catch {
      toast.error('Xét học bổng thất bại')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  const columns: ColumnDef<ScholarshipSession, unknown>[] = [
    { accessorKey: 'name', header: 'Tên đợt xét tuyển' },
    { accessorKey: 'year', header: 'Năm học' },
    {
      accessorKey: 'term',
      header: 'Học kỳ',
      cell: ({ getValue }) => {
        const val = getValue() as string
        const map: Record<string, string> = { HK1: 'Học kỳ 1', HK2: 'Học kỳ 2', CN: 'Cả năm' }
        return map[val] ?? val
      },
    },
    {
      id: 'period',
      header: 'Thời gian xét',
      cell: ({ row }) => {
        const s = row.original
        const fmt = (d: string) => new Date(d).toLocaleDateString('vi-VN')
        return `${fmt(s.startDate)} – ${fmt(s.endDate)}`
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ getValue }) => {
        const val = getValue() as string
        const config = statusMap[val]
        if (!config) return val
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)} className="cursor-pointer h-8 w-8 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(row.original)}
            className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {row.original.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleProcess(row.original.id)}
              className="cursor-pointer h-8 w-8 p-0 text-primary"
              disabled={processMutation.isPending}
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
      enableSorting: false,
      size: 120,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Đợt xét tuyển</h3>
        <Button onClick={openCreate} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Thêm đợt
        </Button>
      </div>

      <DataTable
        data={data ?? []}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm đợt xét tuyển..."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSession ? 'Sửa đợt xét tuyển' : 'Thêm đợt xét tuyển'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Tên đợt *</Label>
              <Input id="name" {...form.register('name')} placeholder="VD: Đợt 1 - HK1 2025-2026" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Năm học *</Label>
                <Select value={form.watch('year')} onValueChange={(v) => { if (v) form.setValue('year', v) }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Học kỳ *</Label>
                <Select value={form.watch('term')} onValueChange={(v) => { if (v) form.setValue('term', v as 'HK1' | 'HK2' | 'CN') }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HK1">Học kỳ 1</SelectItem>
                    <SelectItem value="HK2">Học kỳ 2</SelectItem>
                    <SelectItem value="CN">Cả năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Từ ngày *</Label>
                <Input id="startDate" type="date" {...form.register('startDate')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">Đến ngày *</Label>
                <Input id="endDate" type="date" {...form.register('endDate')} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSession ? 'Cập nhật' : 'Thêm'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa đợt xét tuyển này?"
        variant="danger"
        confirmLabel="Xóa"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
