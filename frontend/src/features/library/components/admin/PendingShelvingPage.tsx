'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { PendingShelvingItem } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

const shelvingBookNames = ['Lập trình Java', 'Giải tích 1', 'Marketing căn bản', 'Hóa học đại cương', 'Văn học Việt Nam', 'Điện tử số', 'Kiến trúc máy tính', 'Tâm lý học']
const shelvingQuantities = [5, 10, 8, 3, 15, 7, 4, 12]
const shelvingSuppliers = ['Fahasa', 'NXB Giáo dục', 'Nhà sách Trí Việt', 'NXB ĐHQG']

const mockItems: PendingShelvingItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  copyCode: `QH-${String(2000 + i).padStart(5, '0')}`,
  bookTitle: shelvingBookNames[i]!,
  quantity: shelvingQuantities[i]!,
  supplier: shelvingSuppliers[i % 4]!,
  receivedAt: new Date(2026, 2, 5 + i).toISOString(),
}))

const locationOptions = [
  { value: '', label: 'Chọn vị trí...' },
  { value: 'T1-KA', label: 'Tầng 1 - Kệ A' },
  { value: 'T1-KB', label: 'Tầng 1 - Kệ B' },
  { value: 'T2-KA', label: 'Tầng 2 - Kệ A' },
  { value: 'T2-KB', label: 'Tầng 2 - Kệ B' },
  { value: 'T3-KA', label: 'Tầng 3 - Kệ A' },
]

export function PendingShelvingPage() {
  const [data, setData] = useState(mockItems)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<PendingShelvingItem | null>(null)
  const [location, setLocation] = useState('')

  const openShelving = (item: PendingShelvingItem) => {
    setSelected(item)
    setLocation('')
    setDialogOpen(true)
  }

  const handleShelve = () => {
    if (!location) {
      toast.error('Vui lòng chọn vị trí')
      return
    }
    if (selected) {
      setData((prev) => prev.filter((it) => it.id !== selected.id))
      toast.success(`Đã xếp giá: ${selected.bookTitle}`)
    }
    setDialogOpen(false)
  }

  const columns: ColumnDef<PendingShelvingItem, unknown>[] = [
    { accessorKey: 'copyCode', header: 'Mã sách', size: 130 },
    { accessorKey: 'bookTitle', header: 'Tên sách' },
    { accessorKey: 'quantity', header: 'Số lượng', size: 100 },
    { accessorKey: 'supplier', header: 'Nhà cung cấp', size: 160 },
    {
      accessorKey: 'receivedAt',
      header: 'Ngày nhập',
      size: 120,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      id: 'actions',
      header: '',
      size: 100,
      cell: ({ row }) => (
        <Button size="sm" onClick={() => openShelving(row.original)} className="cursor-pointer">
          Xếp giá
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ấn phẩm chờ xếp giá"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Xếp giá', href: '/library/shelving' },
          { label: 'Chờ xếp giá' },
        ]}
      />

      <DataTable<PendingShelvingItem>
        data={data}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm ấn phẩm..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xếp giá: {selected?.bookTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Mã sách:</span> {selected?.copyCode}</p>
              <p><span className="text-muted-foreground">Số lượng:</span> {selected?.quantity}</p>
            </div>
            <AppSelect
              label="Chọn vị trí xếp giá"
              options={locationOptions}
              value={location}
              onChange={setLocation}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleShelve} className="cursor-pointer">
              Xác nhận xếp giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
