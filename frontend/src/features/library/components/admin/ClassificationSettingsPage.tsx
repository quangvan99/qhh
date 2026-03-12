'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ClassificationSystem } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppInput, AppTextarea, AppBadge } from '@/components/base'
import { toast } from 'sonner'

const mockClassifications: ClassificationSystem[] = [
  { id: '1', code: 'DDC', name: 'Dewey Decimal Classification', description: 'Hệ thống phân loại thập phân Dewey', isActive: true },
  { id: '2', code: 'LC', name: 'Library of Congress Classification', description: 'Hệ thống phân loại Thư viện Quốc hội Mỹ', isActive: true },
  { id: '3', code: 'VN', name: 'Phân loại Việt Nam', description: 'Hệ thống phân loại dùng cho thư viện Việt Nam', isActive: false },
]

const columns: ColumnDef<ClassificationSystem, unknown>[] = [
  { accessorKey: 'code', header: 'Mã', size: 100 },
  { accessorKey: 'name', header: 'Tên hệ thống' },
  { accessorKey: 'description', header: 'Mô tả' },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    size: 120,
    cell: ({ getValue }) => {
      const active = getValue<boolean>()
      return (
        <AppBadge semantic={active ? 'success' : 'neutral'}>
          {active ? 'Đang dùng' : 'Tắt'}
        </AppBadge>
      )
    },
  },
]

export function ClassificationSettingsPage() {
  const [data, setData] = useState(mockClassifications)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ClassificationSystem | null>(null)
  const [formData, setFormData] = useState({ code: '', name: '', description: '' })

  const openCreate = () => {
    setEditing(null)
    setFormData({ code: '', name: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (row: ClassificationSystem) => {
    setEditing(row)
    setFormData({ code: row.code, name: row.name, description: row.description ?? '' })
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Vui lòng nhập đầy đủ mã và tên')
      return
    }
    if (editing) {
      setData((prev) => prev.map((item) => item.id === editing.id ? { ...item, ...formData } : item))
      toast.success('Đã cập nhật hệ thống phân loại')
    } else {
      setData((prev) => [...prev, { id: String(Date.now()), ...formData, isActive: true }])
      toast.success('Đã tạo hệ thống phân loại')
    }
    setDialogOpen(false)
  }

  const handleDelete = (row: ClassificationSystem) => {
    setData((prev) => prev.filter((item) => item.id !== row.id))
    toast.success('Đã xóa hệ thống phân loại')
  }

  return (
    <>
      <CrudPage<ClassificationSystem>
        title="Khung phân loại"
        subtitle="Quản lý hệ thống phân loại tài liệu thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Cài đặt' },
          { label: 'Khung phân loại' },
        ]}
        data={data}
        columns={columns}
        loading={false}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm hệ thống phân loại..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa hệ thống phân loại' : 'Thêm hệ thống phân loại'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AppInput
              label="Mã hệ thống"
              required
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
              placeholder="VD: DDC, LC..."
            />
            <AppInput
              label="Tên hệ thống"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nhập tên hệ thống phân loại..."
            />
            <AppTextarea
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả ngắn..."
            />
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
