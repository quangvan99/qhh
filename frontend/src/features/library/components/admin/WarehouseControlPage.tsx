'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { WarehouseLog } from '@/features/library/types/library.types'
import { PageHeader, ConfirmDialog } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'

const mockHistory: WarehouseLog[] = [
  { id: '1', action: 'close', performedBy: 'Admin', performedAt: '2026-03-10T08:00:00.000Z', note: 'Kiểm kê cuối kỳ' },
  { id: '2', action: 'open', performedBy: 'Admin', performedAt: '2026-03-08T14:00:00.000Z', note: 'Hoàn thành kiểm kê' },
  { id: '3', action: 'close', performedBy: 'Thủ kho', performedAt: '2026-02-15T08:00:00.000Z', note: 'Bảo trì kho' },
  { id: '4', action: 'open', performedBy: 'Thủ kho', performedAt: '2026-02-15T16:00:00.000Z', note: 'Hoàn thành bảo trì' },
  { id: '5', action: 'close', performedBy: 'Admin', performedAt: '2026-01-20T08:00:00.000Z', note: 'Kiểm kê định kỳ' },
]

const columns: ColumnDef<WarehouseLog, unknown>[] = [
  {
    accessorKey: 'action',
    header: 'Thao tác',
    size: 120,
    cell: ({ getValue }) => {
      const val = getValue<string>()
      return (
        <AppBadge semantic={val === 'open' ? 'success' : 'error'}>
          {val === 'open' ? 'Mở kho' : 'Đóng kho'}
        </AppBadge>
      )
    },
  },
  { accessorKey: 'performedBy', header: 'Người thực hiện', size: 150 },
  {
    accessorKey: 'performedAt',
    header: 'Thời gian',
    size: 180,
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString('vi-VN'),
  },
  { accessorKey: 'note', header: 'Ghi chú' },
]

export function WarehouseControlPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleToggle = () => {
    if (isOpen) {
      setConfirmOpen(true)
    } else {
      setIsOpen(true)
      toast.success('Đã mở kho. Hoạt động mượn trả được phục hồi.')
    }
  }

  const handleConfirmClose = () => {
    setIsOpen(false)
    setConfirmOpen(false)
    toast.success('Đã đóng kho. Hoạt động mượn trả tạm dừng.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đóng kho / Mở kho"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Kiểm kê', href: '/library/inventory/warehouse' },
          { label: 'Đóng/Mở kho' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái kho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-full flex items-center justify-center ${isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isOpen ? <Unlock className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {isOpen ? 'Kho đang MỞ' : 'Kho đang ĐÓNG'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOpen
                    ? 'Hoạt động mượn trả đang diễn ra bình thường'
                    : 'Tất cả hoạt động mượn trả đã tạm dừng'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggle}
              variant={isOpen ? 'destructive' : 'default'}
              className="cursor-pointer"
            >
              {isOpen ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Đóng kho
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Mở kho
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đóng/mở kho</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<WarehouseLog>
            data={mockHistory}
            columns={columns}
            loading={false}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận đóng kho"
        description="Khi đóng kho, tất cả hoạt động mượn trả sẽ bị tạm dừng. Bạn có chắc chắn muốn đóng kho?"
        confirmLabel="Đóng kho"
        variant="danger"
        onConfirm={handleConfirmClose}
      />
    </div>
  )
}
