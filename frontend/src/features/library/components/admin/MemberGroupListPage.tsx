'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { CrudPage } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppInput, AppTextarea } from '@/components/base'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface MemberGroup {
  id: string
  name: string
  description: string
  memberCount: number
  defaultDurationMonths: number
  maxBooks: number
  maxBorrowDays: number
  registrationFee: number
  autoRenew: boolean
  status: 'active' | 'inactive'
}

const mockGroups: MemberGroup[] = [
  { id: '1', name: 'Học sinh', description: 'Nhóm dành cho học sinh các cấp', memberCount: 245, defaultDurationMonths: 12, maxBooks: 5, maxBorrowDays: 14, registrationFee: 0, autoRenew: true, status: 'active' },
  { id: '2', name: 'Giáo viên', description: 'Nhóm dành cho giáo viên, cán bộ giảng dạy', memberCount: 42, defaultDurationMonths: 24, maxBooks: 10, maxBorrowDays: 30, registrationFee: 0, autoRenew: true, status: 'active' },
  { id: '3', name: 'Cán bộ', description: 'Nhóm dành cho cán bộ, nhân viên nhà trường', memberCount: 18, defaultDurationMonths: 24, maxBooks: 8, maxBorrowDays: 21, registrationFee: 0, autoRenew: true, status: 'active' },
  { id: '4', name: 'Sinh viên liên kết', description: 'Sinh viên từ các trường liên kết', memberCount: 35, defaultDurationMonths: 6, maxBooks: 3, maxBorrowDays: 14, registrationFee: 50000, autoRenew: false, status: 'active' },
  { id: '5', name: 'Khách', description: 'Bạn đọc bên ngoài, sử dụng dịch vụ thư viện', memberCount: 12, defaultDurationMonths: 3, maxBooks: 2, maxBorrowDays: 7, registrationFee: 100000, autoRenew: false, status: 'inactive' },
]

const statusLabel: Record<string, string> = { active: 'Hoạt động', inactive: 'Ngừng hoạt động' }

const columns: ColumnDef<MemberGroup, unknown>[] = [
  { accessorKey: 'name', header: 'Tên nhóm' },
  { accessorKey: 'description', header: 'Mô tả' },
  { accessorKey: 'memberCount', header: 'Số thành viên', size: 130 },
  {
    accessorKey: 'defaultDurationMonths',
    header: 'Thời hạn (tháng)',
    size: 140,
    cell: ({ getValue }) => `${getValue<number>()} tháng`,
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    size: 140,
    cell: ({ getValue }) => {
      const val = getValue<string>()
      return <AppBadge semantic={val === 'active' ? 'success' : 'neutral'}>{statusLabel[val] ?? val}</AppBadge>
    },
  },
]

interface FormState {
  name: string
  description: string
  defaultDurationMonths: number
  maxBooks: number
  maxBorrowDays: number
  registrationFee: number
  autoRenew: boolean
  status: 'active' | 'inactive'
}

const defaultForm: FormState = {
  name: '',
  description: '',
  defaultDurationMonths: 12,
  maxBooks: 5,
  maxBorrowDays: 14,
  registrationFee: 0,
  autoRenew: false,
  status: 'active',
}

export function MemberGroupListPage() {
  const [data, setData] = useState<MemberGroup[]>(mockGroups)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MemberGroup | null>(null)
  const [form, setForm] = useState<FormState>(defaultForm)

  const openCreate = () => {
    setEditing(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  const openEdit = (row: MemberGroup) => {
    setEditing(row)
    setForm({
      name: row.name,
      description: row.description,
      defaultDurationMonths: row.defaultDurationMonths,
      maxBooks: row.maxBooks,
      maxBorrowDays: row.maxBorrowDays,
      registrationFee: row.registrationFee,
      autoRenew: row.autoRenew,
      status: row.status,
    })
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên nhóm')
      return
    }
    if (editing) {
      setData((prev) => prev.map((g) => (g.id === editing.id ? { ...g, ...form } : g)))
      toast.success('Đã cập nhật nhóm bạn đọc')
    } else {
      const newGroup: MemberGroup = { id: String(Date.now()), memberCount: 0, ...form }
      setData((prev) => [...prev, newGroup])
      toast.success('Đã tạo nhóm bạn đọc')
    }
    setDialogOpen(false)
  }

  const handleDelete = (row: MemberGroup) => {
    setData((prev) => prev.filter((g) => g.id !== row.id))
    toast.success('Đã xóa nhóm bạn đọc')
  }

  return (
    <>
      <CrudPage<MemberGroup>
        title="Nhóm bạn đọc"
        subtitle="Quản lý các nhóm thành viên thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Bạn đọc', href: '/library/members' },
          { label: 'Nhóm bạn đọc' },
        ]}
        data={data}
        columns={columns}
        loading={false}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm nhóm bạn đọc..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa nhóm bạn đọc' : 'Thêm nhóm bạn đọc'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AppInput
              label="Tên nhóm"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nhập tên nhóm..."
            />
            <AppTextarea
              label="Mô tả"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả nhóm bạn đọc..."
            />
            <div className="grid grid-cols-2 gap-4">
              <AppInput
                label="Thời hạn thẻ (tháng)"
                type="number"
                required
                value={String(form.defaultDurationMonths)}
                onChange={(e) => setForm((p) => ({ ...p, defaultDurationMonths: Number(e.target.value) }))}
              />
              <AppInput
                label="Số sách mượn tối đa"
                type="number"
                required
                value={String(form.maxBooks)}
                onChange={(e) => setForm((p) => ({ ...p, maxBooks: Number(e.target.value) }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AppInput
                label="Số ngày mượn tối đa"
                type="number"
                required
                value={String(form.maxBorrowDays)}
                onChange={(e) => setForm((p) => ({ ...p, maxBorrowDays: Number(e.target.value) }))}
              />
              <AppInput
                label="Phí đăng ký (VNĐ)"
                type="number"
                value={String(form.registrationFee)}
                onChange={(e) => setForm((p) => ({ ...p, registrationFee: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.autoRenew}
                onCheckedChange={(v) => setForm((p) => ({ ...p, autoRenew: v }))}
              />
              <Label>Tự động gia hạn thẻ</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="cursor-pointer">
              {editing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
