'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { InventoryItem } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { StatGrid, DataTable } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertTriangle, Archive, Download } from 'lucide-react'
import { toast } from 'sonner'

interface InventoryReportPageProps {
  sessionId: string
}

const rptBookNames = ['Lập trình Python', 'Toán cao cấp', 'Kinh tế vĩ mô', 'Vật lý đại cương', 'Tiếng Anh chuyên ngành']
const missingBooks = ['Cơ sở dữ liệu', 'Mạng máy tính', 'Triết học']
const damagedBooks = ['Lịch sử Đảng', 'Xác suất thống kê']

const mockResults: InventoryItem[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    sessionId: '1',
    copyCode: `QH-${String(1000 + i).padStart(5, '0')}`,
    bookTitle: rptBookNames[i % 5]!,
    location: `Tầng ${(i % 3) + 1} - Kệ ${String.fromCharCode(65 + (i % 5))}`,
    scanStatus: 'scanned' as const,
    scannedAt: new Date(2026, 2, 12, 8 + Math.floor(i / 5), i * 2).toISOString(),
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: String(21 + i),
    sessionId: '1',
    copyCode: `QH-${String(1020 + i).padStart(5, '0')}`,
    bookTitle: missingBooks[i]!,
    location: `Tầng 2 - Kệ ${String.fromCharCode(65 + i)}`,
    scanStatus: 'missing' as const,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: String(24 + i),
    sessionId: '1',
    copyCode: `QH-${String(1023 + i).padStart(5, '0')}`,
    bookTitle: damagedBooks[i]!,
    location: `Tầng 1 - Kệ ${String.fromCharCode(67 + i)}`,
    scanStatus: 'damaged' as const,
  })),
]

const statusLabels: Record<string, string> = {
  scanned: 'Đủ',
  missing: 'Mất',
  damaged: 'Hỏng',
  not_scanned: 'Chưa kiểm',
}

const statusColors: Record<string, 'success' | 'error' | 'warning' | 'neutral'> = {
  scanned: 'success',
  missing: 'error',
  damaged: 'warning',
  not_scanned: 'neutral',
}

const totalChecked = mockResults.length
const okCount = mockResults.filter((it) => it.scanStatus === 'scanned').length
const missingCount = mockResults.filter((it) => it.scanStatus === 'missing').length
const damagedCount = mockResults.filter((it) => it.scanStatus === 'damaged').length

export function InventoryReportPage({ sessionId }: InventoryReportPageProps) {
  const columns: ColumnDef<InventoryItem, unknown>[] = [
    { accessorKey: 'copyCode', header: 'Mã sách', size: 130 },
    { accessorKey: 'bookTitle', header: 'Tên sách' },
    { accessorKey: 'location', header: 'Vị trí', size: 160 },
    {
      accessorKey: 'scanStatus',
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
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo kết quả kiểm kê"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Kiểm kê', href: '/library/inventory/warehouse' },
          { label: 'Báo cáo kết quả' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            onClick: () => toast.success('Đã xuất báo cáo kiểm kê'),
            icon: <Download className="h-4 w-4" />,
            variant: 'outline',
          },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng kiểm', value: totalChecked, icon: <Archive className="h-5 w-5" />, module: 'library' },
          { title: 'Đủ', value: okCount, icon: <CheckCircle2 className="h-5 w-5" />, module: 'library' },
          { title: 'Mất', value: missingCount, icon: <XCircle className="h-5 w-5" />, module: 'library' },
          { title: 'Hỏng', value: damagedCount, icon: <AlertTriangle className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <DataTable<InventoryItem>
        data={mockResults}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm sách..."
      />
    </div>
  )
}
