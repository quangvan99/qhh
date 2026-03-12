'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import type { PurchaseOrder } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { AppSelect, AppBadge } from '@/components/base'

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
]

const statusLabels: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

const statusColors: Record<string, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

const titles = ['Lập trình Python nâng cao', 'Toán cao cấp A1', 'Kinh tế vĩ mô', 'Vật lý đại cương', 'Tiếng Anh chuyên ngành', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Triết học Mác-Lênin', 'Lịch sử Đảng', 'Xác suất thống kê'] as const
const authors = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Đức Duy', 'Hoàng Thu Hà', 'Vũ Quang', 'Đỗ Hải', 'Bùi Lan', 'Ngô Sơn', 'Mai Anh'] as const
const publishers = ['NXB Giáo dục', 'NXB ĐHQG', 'NXB Khoa học'] as const
const quantities = [10, 20, 15, 5, 30, 8, 12, 25, 18, 10] as const
const prices = [150000, 95000, 120000, 180000, 200000, 135000, 160000, 80000, 75000, 110000] as const
const departments = ['Khoa CNTT', 'Khoa Toán', 'Khoa Kinh tế', 'Khoa Vật lý', 'Khoa Ngoại ngữ'] as const
const requesters = ['Trần Thị Bình', 'Lê Minh Châu', 'Phạm Đức Duy', 'Hoàng Thu Hà', 'Vũ Quang'] as const
const statuses = ['pending', 'approved', 'rejected'] as const

const mockOrders: PurchaseOrder[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  title: titles[i]!,
  author: authors[i]!,
  publisher: publishers[i % 3]!,
  quantity: quantities[i]!,
  estimatedPrice: prices[i]!,
  reason: 'Bổ sung tài liệu cho chương trình đào tạo',
  department: departments[i % 5]!,
  requestedBy: requesters[i % 5]!,
  requestedAt: new Date(2026, 2, 1 + i).toISOString(),
  status: statuses[i % 3]!,
}))

export function PurchaseOrderList() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = statusFilter
    ? mockOrders.filter((o) => o.status === statusFilter)
    : mockOrders

  const columns: ColumnDef<PurchaseOrder, unknown>[] = [
    { accessorKey: 'title', header: 'Ấn phẩm' },
    { accessorKey: 'requestedBy', header: 'Người đề xuất', size: 150 },
    {
      accessorKey: 'requestedAt',
      header: 'Ngày tạo',
      size: 120,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    { accessorKey: 'quantity', header: 'Số lượng', size: 100 },
    {
      accessorKey: 'estimatedPrice',
      header: 'Đơn giá',
      size: 120,
      cell: ({ getValue }) => `${getValue<number>().toLocaleString('vi-VN')} ₫`,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={statusColors[val]}>
            {statusLabels[val] ?? val}
          </AppBadge>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AppSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Trạng thái"
          className="w-48"
        />
      </div>
      <CrudPage<PurchaseOrder>
        title="Đơn đặt mua"
        subtitle="Quản lý yêu cầu đặt mua ấn phẩm"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Đơn đặt mua' },
        ]}
        data={filtered}
        columns={columns}
        loading={false}
        onCreate={() => router.push('/library/orders/new')}
        onEdit={(row) => router.push(`/library/orders/${row.id}/review`)}
        searchPlaceholder="Tìm đơn đặt mua..."
        extraActions={[
          {
            label: 'Báo cáo',
            onClick: () => router.push('/library/orders/report'),
            variant: 'outline',
          },
        ]}
      />
    </div>
  )
}
