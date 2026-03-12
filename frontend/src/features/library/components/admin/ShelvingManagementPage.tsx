'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppSelect, AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ShelvingRecord {
  id: string
  copyCode: string
  bookTitle: string
  currentLocation: string
  status: 'shelved' | 'transfer' | 'disposal'
}

const shelvingMgmtBooks = ['Lập trình C++', 'Đại số tuyến tính', 'Quản trị học', 'Sinh học đại cương', 'Pháp luật đại cương']
const shelvingStatuses: Array<'shelved' | 'transfer' | 'disposal'> = ['shelved', 'transfer', 'disposal']

const mockRecords: ShelvingRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  copyCode: `QH-${String(3000 + i).padStart(5, '0')}`,
  bookTitle: shelvingMgmtBooks[i % 5]!,
  currentLocation: `Tầng ${(i % 3) + 1} - Kệ ${String.fromCharCode(65 + (i % 5))}`,
  status: shelvingStatuses[i % 3]!,
}))

const locationOptions = [
  { value: '', label: 'Chọn vị trí mới...' },
  { value: 'T1-KA', label: 'Tầng 1 - Kệ A' },
  { value: 'T1-KB', label: 'Tầng 1 - Kệ B' },
  { value: 'T2-KA', label: 'Tầng 2 - Kệ A' },
  { value: 'T2-KB', label: 'Tầng 2 - Kệ B' },
  { value: 'T3-KA', label: 'Tầng 3 - Kệ A' },
]

const disposalReasonOptions = [
  { value: '', label: 'Chọn lý do...' },
  { value: 'damaged', label: 'Hư hỏng nặng' },
  { value: 'outdated', label: 'Lỗi thời' },
  { value: 'duplicate', label: 'Trùng lặp' },
  { value: 'other', label: 'Khác' },
]

export function ShelvingManagementPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'transfer' | 'disposal'>('transfer')
  const [selected, setSelected] = useState<ShelvingRecord | null>(null)
  const [newLocation, setNewLocation] = useState('')
  const [disposalReason, setDisposalReason] = useState('')

  const shelvedItems = mockRecords.filter((r) => r.status === 'shelved')
  const transferItems = mockRecords.filter((r) => r.status === 'transfer')
  const disposalItems = mockRecords.filter((r) => r.status === 'disposal')

  const openTransfer = (item: ShelvingRecord) => {
    setSelected(item)
    setDialogType('transfer')
    setNewLocation('')
    setDialogOpen(true)
  }

  const openDisposal = (item: ShelvingRecord) => {
    setSelected(item)
    setDialogType('disposal')
    setDisposalReason('')
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (dialogType === 'transfer' && !newLocation) {
      toast.error('Vui lòng chọn vị trí mới')
      return
    }
    if (dialogType === 'disposal' && !disposalReason) {
      toast.error('Vui lòng chọn lý do thanh lý')
      return
    }
    toast.success(dialogType === 'transfer' ? 'Đã chuyển kho thành công' : 'Đã đánh dấu thanh lý')
    setDialogOpen(false)
  }

  const baseColumns: ColumnDef<ShelvingRecord, unknown>[] = [
    { accessorKey: 'copyCode', header: 'Mã sách', size: 130 },
    { accessorKey: 'bookTitle', header: 'Tên sách' },
    { accessorKey: 'currentLocation', header: 'Vị trí hiện tại', size: 180 },
  ]

  const shelvingColumns: ColumnDef<ShelvingRecord, unknown>[] = [
    ...baseColumns,
    {
      id: 'actions',
      header: '',
      size: 200,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openTransfer(row.original)} className="cursor-pointer">
            Chuyển kho
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openDisposal(row.original)} className="cursor-pointer">
            Thanh lý
          </Button>
        </div>
      ),
    },
  ]

  const transferColumns: ColumnDef<ShelvingRecord, unknown>[] = [
    ...baseColumns,
    {
      id: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: () => <AppBadge semantic="warning">Đang chuyển</AppBadge>,
    },
  ]

  const disposalColumns: ColumnDef<ShelvingRecord, unknown>[] = [
    ...baseColumns,
    {
      id: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: () => <AppBadge semantic="error">Thanh lý</AppBadge>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Xếp giá / Chuyển kho / Thanh lý"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Xếp giá' },
        ]}
      />

      <Tabs defaultValue="shelving">
        <TabsList>
          <TabsTrigger value="shelving">Xếp giá ({shelvedItems.length})</TabsTrigger>
          <TabsTrigger value="transfer">Chuyển kho ({transferItems.length})</TabsTrigger>
          <TabsTrigger value="disposal">Thanh lý ({disposalItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="shelving" className="mt-4">
          <DataTable<ShelvingRecord>
            data={shelvedItems}
            columns={shelvingColumns}
            loading={false}
            searchable
            searchPlaceholder="Tìm sách..."
          />
        </TabsContent>

        <TabsContent value="transfer" className="mt-4">
          <DataTable<ShelvingRecord>
            data={transferItems}
            columns={transferColumns}
            loading={false}
            searchable
            searchPlaceholder="Tìm sách..."
          />
        </TabsContent>

        <TabsContent value="disposal" className="mt-4">
          <DataTable<ShelvingRecord>
            data={disposalItems}
            columns={disposalColumns}
            loading={false}
            searchable
            searchPlaceholder="Tìm sách..."
          />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'transfer' ? 'Chuyển kho' : 'Thanh lý'}: {selected?.bookTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Mã sách:</span> {selected?.copyCode}</p>
              <p><span className="text-muted-foreground">Vị trí hiện tại:</span> {selected?.currentLocation}</p>
            </div>
            {dialogType === 'transfer' ? (
              <AppSelect
                label="Vị trí mới"
                options={locationOptions}
                value={newLocation}
                onChange={setNewLocation}
              />
            ) : (
              <AppSelect
                label="Lý do thanh lý"
                options={disposalReasonOptions}
                value={disposalReason}
                onChange={setDisposalReason}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant={dialogType === 'disposal' ? 'destructive' : 'default'}
              className="cursor-pointer"
            >
              {dialogType === 'transfer' ? 'Chuyển kho' : 'Thanh lý'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
