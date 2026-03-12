'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/features/library/api/library.api'
import type { LibraryLocation } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppInput } from '@/components/base'
import { AppTextarea } from '@/components/base'
import { toast } from 'sonner'

const columns: ColumnDef<LibraryLocation, unknown>[] = [
  { accessorKey: 'code', header: 'Mã', size: 100 },
  { accessorKey: 'name', header: 'Tên kho/vị trí' },
  { accessorKey: 'floor', header: 'Tầng', size: 80 },
  { accessorKey: 'description', header: 'Mô tả' },
]

export function LocationCrudPage() {
  const { data, isLoading } = useGetLocations()
  const createMut = useCreateLocation()
  const updateMut = useUpdateLocation()
  const deleteMut = useDeleteLocation()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<LibraryLocation | null>(null)
  const [formData, setFormData] = useState({ name: '', code: '', floor: '', description: '' })

  const openCreate = () => {
    setEditing(null)
    setFormData({ name: '', code: '', floor: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (row: LibraryLocation) => {
    setEditing(row)
    setFormData({ name: row.name, code: row.code ?? '', floor: row.floor ?? '', description: row.description ?? '' })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên kho/vị trí')
      return
    }
    if (editing) {
      await updateMut.mutateAsync({ ...editing, ...formData })
      toast.success('Đã cập nhật vị trí')
    } else {
      await createMut.mutateAsync(formData)
      toast.success('Đã tạo vị trí')
    }
    setDialogOpen(false)
  }

  const handleDelete = (row: LibraryLocation) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa vị trí'),
      onError: () => toast.error('Không thể xóa vị trí'),
    })
  }

  return (
    <>
      <CrudPage<LibraryLocation>
        title="Kho & Vị trí"
        subtitle="Quản lý kho sách và vị trí lưu trữ"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Cài đặt' },
          { label: 'Kho & Vị trí' },
        ]}
        data={data ?? []}
        columns={columns}
        loading={isLoading}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm vị trí..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa vị trí' : 'Thêm vị trí'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AppInput
              label="Tên vị trí"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nhập tên kho/vị trí..."
            />
            <AppInput
              label="Mã vị trí"
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
              placeholder="VD: K1, K2..."
            />
            <AppInput
              label="Tầng"
              value={formData.floor}
              onChange={(e) => setFormData((p) => ({ ...p, floor: e.target.value }))}
              placeholder="VD: Tầng 1, Tầng 2..."
            />
            <AppTextarea
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả vị trí..."
            />
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
