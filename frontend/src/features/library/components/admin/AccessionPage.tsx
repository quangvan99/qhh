'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { AccessionItem } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppInput, AppSelect, AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

const conditionOptions = [
  { value: 'good', label: 'Tốt' },
  { value: 'damaged', label: 'Hư hỏng' },
  { value: 'partial', label: 'Thiếu' },
]

const accBookNames = ['Lập trình Web', 'Thuật toán', 'Kinh tế vi mô', 'Hóa hữu cơ', 'Tâm lý giáo dục', 'An ninh mạng', 'Trí tuệ nhân tạo', 'Kế toán quản trị', 'Ngôn ngữ học', 'Xã hội học']
const accOrderedQty = [10, 20, 15, 8, 25, 12, 6, 18, 10, 14]
const accReceivedQty = [10, 18, 15, 8, 25, 10, 6, 16, 10, 14]
const accConditions: Array<'good' | 'damaged' | 'partial'> = ['good', 'good', 'good', 'good', 'good', 'damaged', 'good', 'partial', 'good', 'good']
const accStatuses: Array<'pending' | 'accepted' | 'rejected'> = ['pending', 'pending', 'accepted', 'pending', 'accepted', 'pending', 'pending', 'pending', 'accepted', 'pending']

const mockItems: AccessionItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  orderCode: `PO-2026-${String(i + 1).padStart(3, '0')}`,
  bookTitle: accBookNames[i]!,
  orderedQuantity: accOrderedQty[i]!,
  receivedQuantity: accReceivedQty[i]!,
  condition: accConditions[i]!,
  accessionStatus: accStatuses[i]!,
}))

const statusLabels: Record<string, string> = {
  pending: 'Chờ kiểm nhận',
  accepted: 'Đã kiểm nhận',
  rejected: 'Từ chối',
}

const statusColors: Record<string, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
}

const conditionLabels: Record<string, string> = {
  good: 'Tốt',
  damaged: 'Hư hỏng',
  partial: 'Thiếu',
}

export function AccessionPage() {
  const [data, setData] = useState(mockItems)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<AccessionItem | null>(null)
  const [receivedQty, setReceivedQty] = useState(0)
  const [condition, setCondition] = useState('good')

  const openAccession = (item: AccessionItem) => {
    setSelected(item)
    setReceivedQty(item.receivedQuantity)
    setCondition(item.condition)
    setDialogOpen(true)
  }

  const handleAccept = () => {
    if (selected) {
      setData((prev) =>
        prev.map((it) =>
          it.id === selected.id
            ? { ...it, receivedQuantity: receivedQty, condition: condition as AccessionItem['condition'], accessionStatus: 'accepted' as const }
            : it
        )
      )
      toast.success(`Đã kiểm nhận: ${selected.bookTitle}`)
    }
    setDialogOpen(false)
  }

  const columns: ColumnDef<AccessionItem, unknown>[] = [
    { accessorKey: 'orderCode', header: 'Mã đơn hàng', size: 140 },
    { accessorKey: 'bookTitle', header: 'Tên ấn phẩm' },
    { accessorKey: 'orderedQuantity', header: 'SL đặt', size: 80 },
    { accessorKey: 'receivedQuantity', header: 'SL nhận', size: 80 },
    {
      accessorKey: 'condition',
      header: 'Tình trạng',
      size: 110,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return conditionLabels[val] ?? val
      },
    },
    {
      accessorKey: 'accessionStatus',
      header: 'Trạng thái',
      size: 140,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={statusColors[val]}>
            {statusLabels[val] ?? val}
          </AppBadge>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      size: 120,
      cell: ({ row }) =>
        row.original.accessionStatus === 'pending' ? (
          <Button size="sm" onClick={() => openAccession(row.original)} className="cursor-pointer">
            Kiểm nhận
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kiểm nhận & Mở khóa ấn phẩm"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Kiểm nhận' },
        ]}
      />

      <DataTable<AccessionItem>
        data={data}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm theo mã đơn hàng hoặc tên ấn phẩm..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kiểm nhận: {selected?.bookTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Mã đơn hàng:</span> {selected?.orderCode}</p>
              <p><span className="text-muted-foreground">Số lượng đặt:</span> {selected?.orderedQuantity}</p>
            </div>
            <AppInput
              label="Số lượng nhận được"
              type="number"
              value={String(receivedQty)}
              onChange={(e) => setReceivedQty(Number(e.target.value))}
            />
            <AppSelect
              label="Tình trạng"
              options={conditionOptions}
              value={condition}
              onChange={setCondition}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleAccept} className="cursor-pointer">
              Xác nhận kiểm nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
