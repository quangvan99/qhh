'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import type { ActivityLog } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppSelect, AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Download, Printer } from 'lucide-react'
import { toast } from 'sonner'

const actionTypes = [
  { value: '', label: 'Tất cả thao tác' },
  { value: 'create', label: 'Tạo mới' },
  { value: 'update', label: 'Cập nhật' },
  { value: 'delete', label: 'Xóa' },
  { value: 'borrow', label: 'Mượn sách' },
  { value: 'return', label: 'Trả sách' },
]

const names = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Đức Duy', 'Hoàng Thu Hà']
const actions = ['create', 'update', 'delete', 'borrow', 'return']
const objTypes = ['Book', 'Member', 'BorrowRecord', 'Category', 'Location']

const mockLogs: ActivityLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  timestamp: new Date(2026, 2, 12 - Math.floor(i / 3), 8 + i, 30).toISOString(),
  userId: `U${100 + i}`,
  userName: names[i % 5]!,
  action: actions[i % 5]!,
  objectType: objTypes[i % 5]!,
  objectName: `${objTypes[i % 5]!} ${i + 1}`,
  ipAddress: `192.168.1.${100 + i}`,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
}))

const actionLabels: Record<string, string> = {
  create: 'Tạo mới',
  update: 'Cập nhật',
  delete: 'Xóa',
  borrow: 'Mượn sách',
  return: 'Trả sách',
}

const actionColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  create: 'success',
  update: 'warning',
  delete: 'error',
  borrow: 'info',
  return: 'neutral',
}

export function ActivityLogPage() {
  const router = useRouter()
  const [actionFilter, setActionFilter] = useState('')
  const [exportOpen, setExportOpen] = useState(false)

  const filtered = actionFilter
    ? mockLogs.filter((l) => l.action === actionFilter)
    : mockLogs

  const columns: ColumnDef<ActivityLog, unknown>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Thời gian',
      size: 170,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString('vi-VN'),
    },
    { accessorKey: 'userName', header: 'Người dùng', size: 160 },
    {
      accessorKey: 'action',
      header: 'Thao tác',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={actionColors[val]}>
            {actionLabels[val] ?? val}
          </AppBadge>
        )
      },
    },
    { accessorKey: 'objectType', header: 'Loại đối tượng', size: 140 },
    { accessorKey: 'objectName', header: 'Đối tượng' },
    { accessorKey: 'ipAddress', header: 'IP', size: 140 },
    {
      id: 'detail',
      header: '',
      size: 80,
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => router.push(`/library/activity-log/${row.original.id}`)} className="cursor-pointer">
          Chi tiết
        </Button>
      ),
    },
  ]

  const handleExport = (format: string) => {
    toast.success(`Đã xuất nhật ký định dạng ${format}`)
    setExportOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhật ký sử dụng"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Nhật ký sử dụng' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            onClick: () => setExportOpen(true),
            icon: <Download className="h-4 w-4" />,
            variant: 'outline',
          },
          {
            label: 'In',
            onClick: () => window.print(),
            icon: <Printer className="h-4 w-4" />,
            variant: 'outline',
          },
        ]}
      />

      <div className="flex items-center gap-3">
        <AppSelect
          options={actionTypes}
          value={actionFilter}
          onChange={setActionFilter}
          placeholder="Lọc thao tác"
          className="w-48"
        />
      </div>

      <DataTable<ActivityLog>
        data={filtered}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm nhật ký..."
      />

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xuất nhật ký</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Chọn định dạng xuất:</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleExport('Excel')} className="cursor-pointer">
                Excel (.xlsx)
              </Button>
              <Button variant="outline" onClick={() => handleExport('CSV')} className="cursor-pointer">
                CSV (.csv)
              </Button>
              <Button variant="outline" onClick={() => handleExport('PDF')} className="cursor-pointer">
                PDF (.pdf)
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
