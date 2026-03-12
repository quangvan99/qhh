'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetBorrowRules, useCreateBorrowRule, useUpdateBorrowRule, useDeleteBorrowRule } from '@/features/library/api/library.api'
import type { BorrowRule } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppInput, AppSelect } from '@/components/base'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const memberTypeOptions = [
  { value: 'student', label: 'Học sinh' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'staff', label: 'Nhân viên' },
]

const memberTypeLabel: Record<string, string> = {
  student: 'Học sinh',
  teacher: 'Giáo viên',
  staff: 'Nhân viên',
}

const columns: ColumnDef<BorrowRule, unknown>[] = [
  {
    accessorKey: 'memberType',
    header: 'Loại thành viên',
    cell: ({ getValue }) => {
      const val = getValue<string>()
      return (
        <AppBadge role={val === 'student' ? 'student' : val === 'teacher' ? 'teacher' : 'staff'}>
          {memberTypeLabel[val] ?? val}
        </AppBadge>
      )
    },
  },
  { accessorKey: 'maxBooks', header: 'Số sách tối đa', size: 130 },
  { accessorKey: 'loanDays', header: 'Số ngày mượn', size: 130 },
  {
    accessorKey: 'finePerDay',
    header: 'Phí phạt/ngày',
    size: 130,
    cell: ({ getValue }) => `${(getValue<number>()).toLocaleString('vi-VN')}đ`,
  },
  {
    accessorKey: 'renewalAllowed',
    header: 'Gia hạn',
    size: 100,
    cell: ({ getValue }) => (
      <AppBadge semantic={getValue<boolean>() ? 'success' : 'neutral'}>
        {getValue<boolean>() ? 'Có' : 'Không'}
      </AppBadge>
    ),
  },
  { accessorKey: 'maxRenewals', header: 'Số lần gia hạn', size: 130 },
]

interface FormState {
  memberType: string
  maxBooks: number
  loanDays: number
  finePerDay: number
  renewalAllowed: boolean
  maxRenewals: number
}

const defaultForm: FormState = {
  memberType: 'student',
  maxBooks: 5,
  loanDays: 14,
  finePerDay: 1000,
  renewalAllowed: true,
  maxRenewals: 2,
}

export function BorrowRuleCrudPage() {
  const { data, isLoading } = useGetBorrowRules()
  const createMut = useCreateBorrowRule()
  const updateMut = useUpdateBorrowRule()
  const deleteMut = useDeleteBorrowRule()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<BorrowRule | null>(null)
  const [form, setForm] = useState<FormState>(defaultForm)

  const openCreate = () => {
    setEditing(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  const openEdit = (row: BorrowRule) => {
    setEditing(row)
    setForm({
      memberType: row.memberType,
      maxBooks: row.maxBooks,
      loanDays: row.loanDays,
      finePerDay: row.finePerDay,
      renewalAllowed: row.renewalAllowed,
      maxRenewals: row.maxRenewals,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, ...form })
      toast.success('Đã cập nhật quy tắc')
    } else {
      await createMut.mutateAsync(form)
      toast.success('Đã tạo quy tắc')
    }
    setDialogOpen(false)
  }

  const handleDelete = (row: BorrowRule) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa quy tắc'),
      onError: () => toast.error('Không thể xóa'),
    })
  }

  return (
    <>
      <CrudPage<BorrowRule>
        title="Quy tắc mượn trả"
        subtitle="Cấu hình số sách tối đa, thời hạn mượn và phí phạt"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Cài đặt' },
          { label: 'Quy tắc mượn trả' },
        ]}
        data={data ?? []}
        columns={columns}
        loading={isLoading}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchable={false}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa quy tắc' : 'Thêm quy tắc'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AppSelect
              label="Loại thành viên"
              required
              options={memberTypeOptions}
              value={form.memberType}
              onChange={(v) => setForm((p) => ({ ...p, memberType: v }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <AppInput
                label="Số sách tối đa"
                type="number"
                required
                value={String(form.maxBooks)}
                onChange={(e) => setForm((p) => ({ ...p, maxBooks: Number(e.target.value) }))}
              />
              <AppInput
                label="Số ngày mượn"
                type="number"
                required
                value={String(form.loanDays)}
                onChange={(e) => setForm((p) => ({ ...p, loanDays: Number(e.target.value) }))}
              />
            </div>
            <AppInput
              label="Phí phạt/ngày (VNĐ)"
              type="number"
              required
              value={String(form.finePerDay)}
              onChange={(e) => setForm((p) => ({ ...p, finePerDay: Number(e.target.value) }))}
            />
            <div className="flex items-center gap-3">
              <Switch
                checked={form.renewalAllowed}
                onCheckedChange={(v) => setForm((p) => ({ ...p, renewalAllowed: v }))}
              />
              <Label>Cho phép gia hạn</Label>
            </div>
            {form.renewalAllowed && (
              <AppInput
                label="Số lần gia hạn tối đa"
                type="number"
                value={String(form.maxRenewals)}
                onChange={(e) => setForm((p) => ({ ...p, maxRenewals: Number(e.target.value) }))}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMut.isPending || updateMut.isPending}
              className="cursor-pointer"
            >
              {editing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
