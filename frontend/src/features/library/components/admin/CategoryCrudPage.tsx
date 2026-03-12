'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/library/api/library.api'
import type { LibraryCategory } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppInput } from '@/components/base'
import { AppTextarea } from '@/components/base'
import { toast } from 'sonner'

const columns: ColumnDef<LibraryCategory, unknown>[] = [
  { accessorKey: 'code', header: 'Mã', size: 100 },
  { accessorKey: 'name', header: 'Tên danh mục' },
  { accessorKey: 'description', header: 'Mô tả' },
  { accessorKey: 'bookCount', header: 'Số sách', size: 100 },
]

export function CategoryCrudPage() {
  const { data, isLoading } = useGetCategories()
  const createMut = useCreateCategory()
  const updateMut = useUpdateCategory()
  const deleteMut = useDeleteCategory()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<LibraryCategory | null>(null)
  const [formData, setFormData] = useState({ name: '', code: '', description: '' })

  const openCreate = () => {
    setEditing(null)
    setFormData({ name: '', code: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (row: LibraryCategory) => {
    setEditing(row)
    setFormData({ name: row.name, code: row.code ?? '', description: row.description ?? '' })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục')
      return
    }
    if (editing) {
      await updateMut.mutateAsync({ ...editing, ...formData })
      toast.success('Đã cập nhật danh mục')
    } else {
      await createMut.mutateAsync(formData)
      toast.success('Đã tạo danh mục')
    }
    setDialogOpen(false)
  }

  const handleDelete = (row: LibraryCategory) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa danh mục'),
      onError: () => toast.error('Không thể xóa danh mục'),
    })
  }

  return (
    <>
      <CrudPage<LibraryCategory>
        title="Danh mục sách"
        subtitle="Quản lý danh mục phân loại tài liệu thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Cài đặt' },
          { label: 'Danh mục' },
        ]}
        data={data ?? []}
        columns={columns}
        loading={isLoading}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm danh mục..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AppInput
              label="Tên danh mục"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nhập tên danh mục..."
            />
            <AppInput
              label="Mã danh mục"
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
              placeholder="VD: TN, XH, VH..."
            />
            <AppTextarea
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả ngắn về danh mục..."
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
