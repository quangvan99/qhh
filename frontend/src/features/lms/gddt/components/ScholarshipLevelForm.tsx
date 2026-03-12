'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/patterns/data-table'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import {
  useGetScholarshipLevels,
  useCreateScholarshipLevel,
  useUpdateScholarshipLevel,
  useDeleteScholarshipLevel,
} from '../api/gddt.api'
import type { ScholarshipLevel } from '../types/gddt.types'
import { toast } from 'sonner'

const scholarshipLevelSchema = z.object({
  name: z.string().min(1, 'Tên mức là bắt buộc'),
  value: z.number().positive('Giá trị phải lớn hơn 0'),
  valueType: z.enum(['amount', 'percent']),
  minAvgScore: z.number().min(0).max(10),
  minConduct: z.enum(['excellent', 'good', 'average']),
  grades: z.array(z.enum(['10', '11', '12'])).min(1, 'Chọn ít nhất 1 khối'),
  active: z.boolean(),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof scholarshipLevelSchema>

const conductLabels: Record<string, string> = {
  excellent: 'Tốt',
  good: 'Khá',
  average: 'Trung bình',
}

export function ScholarshipLevelForm() {
  const { data, isLoading } = useGetScholarshipLevels()
  const createMutation = useCreateScholarshipLevel()
  const updateMutation = useUpdateScholarshipLevel()
  const deleteMutation = useDeleteScholarshipLevel()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<ScholarshipLevel | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ScholarshipLevel | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(scholarshipLevelSchema),
    defaultValues: {
      name: '',
      value: 0,
      valueType: 'amount',
      minAvgScore: 8,
      minConduct: 'good',
      grades: ['10', '11', '12'],
      active: true,
      note: '',
    },
  })

  const openCreate = () => {
    setEditingLevel(null)
    form.reset({
      name: '',
      value: 0,
      valueType: 'amount',
      minAvgScore: 8,
      minConduct: 'good',
      grades: ['10', '11', '12'],
      active: true,
      note: '',
    })
    setDialogOpen(true)
  }

  const openEdit = (level: ScholarshipLevel) => {
    setEditingLevel(level)
    form.reset({
      name: level.name,
      value: level.value,
      valueType: level.valueType,
      minAvgScore: level.minAvgScore,
      minConduct: level.minConduct,
      grades: level.grades,
      active: level.active,
      note: level.note ?? '',
    })
    setDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingLevel) {
        await updateMutation.mutateAsync({ id: editingLevel.id, ...values } as ScholarshipLevel)
        toast.success('Cập nhật mức học bổng thành công')
      } else {
        await createMutation.mutateAsync(values as Omit<ScholarshipLevel, 'id'>)
        toast.success('Thêm mức học bổng thành công')
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

  const isPending = createMutation.isPending || updateMutation.isPending
  const watchGrades = form.watch('grades')

  const columns: ColumnDef<ScholarshipLevel, unknown>[] = [
    { accessorKey: 'name', header: 'Tên mức học bổng' },
    {
      accessorKey: 'value',
      header: 'Giá trị',
      cell: ({ row }) => {
        const level = row.original
        return level.valueType === 'percent'
          ? `${level.value}%`
          : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(level.value)
      },
    },
    {
      id: 'conditions',
      header: 'Điều kiện',
      cell: ({ row }) => {
        const level = row.original
        return (
          <span className="text-sm">
            ĐTB ≥ {level.minAvgScore} | HK: {conductLabels[level.minConduct] ?? level.minConduct}
          </span>
        )
      },
    },
    {
      accessorKey: 'grades',
      header: 'Khối',
      cell: ({ getValue }) => {
        const grades = getValue() as string[]
        return grades.join(', ')
      },
    },
    {
      accessorKey: 'active',
      header: 'Trạng thái',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'default' : 'secondary'}>
          {getValue() ? 'Đang dùng' : 'Tạm dừng'}
        </Badge>
      ),
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
        </div>
      ),
      enableSorting: false,
      size: 80,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mức học bổng</h3>
        <Button onClick={openCreate} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Thêm mức
        </Button>
      </div>

      <DataTable
        data={data ?? []}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm mức học bổng..."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLevel ? 'Sửa mức học bổng' : 'Thêm mức học bổng'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Tên mức *</Label>
              <Input id="name" {...form.register('name')} placeholder="VD: Loại 1" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="value">Giá trị *</Label>
                <Input id="value" type="number" {...form.register('value', { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Đơn vị</Label>
                <Select value={form.watch('valueType')} onValueChange={(v) => { if (v) form.setValue('valueType', v as 'amount' | 'percent') }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">VNĐ</SelectItem>
                    <SelectItem value="percent">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minAvgScore">Điểm TB tối thiểu</Label>
                <Input id="minAvgScore" type="number" step="0.1" {...form.register('minAvgScore', { valueAsNumber: true })} min={0} max={10} />
              </div>
              <div className="space-y-1.5">
                <Label>Hạnh kiểm tối thiểu</Label>
                <Select value={form.watch('minConduct')} onValueChange={(v) => { if (v) form.setValue('minConduct', v as 'excellent' | 'good' | 'average') }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Tốt</SelectItem>
                    <SelectItem value="good">Khá</SelectItem>
                    <SelectItem value="average">Trung bình</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Áp dụng cho khối *</Label>
              <div className="flex items-center gap-4">
                {(['10', '11', '12'] as const).map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={watchGrades.includes(g)}
                      onCheckedChange={(checked) => {
                        const current = form.getValues('grades')
                        if (checked) {
                          form.setValue('grades', [...current, g])
                        } else {
                          form.setValue('grades', current.filter((v) => v !== g))
                        }
                      }}
                    />
                    <span className="text-sm">Khối {g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" {...form.register('note')} rows={2} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingLevel ? 'Cập nhật' : 'Thêm'}
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
        description="Bạn có chắc chắn muốn xóa mức học bổng này?"
        variant="danger"
        confirmLabel="Xóa"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
