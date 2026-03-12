'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { InventoryItem } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppInput, AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { Scan } from 'lucide-react'
import { toast } from 'sonner'

interface InventoryExecutionPageProps {
  sessionId: string
}

const totalItems = 30
const initialScanned = 15

const bookNames = [
  'Lập trình Python', 'Toán cao cấp', 'Kinh tế vĩ mô', 'Vật lý đại cương',
  'Tiếng Anh chuyên ngành', 'Cơ sở dữ liệu', 'Mạng máy tính',
  'Triết học Mác-Lênin', 'Lịch sử Đảng', 'Xác suất thống kê',
]

const mockItems: InventoryItem[] = Array.from({ length: totalItems }, (_, i) => ({
  id: String(i + 1),
  sessionId: '1',
  copyCode: `QH-${String(1000 + i).padStart(5, '0')}`,
  bookTitle: bookNames[i % 10]!,
  location: `Tầng ${(i % 3) + 1} - Kệ ${String.fromCharCode(65 + (i % 5))}`,
  scanStatus: i < initialScanned ? 'scanned' : 'not_scanned',
  scannedAt: i < initialScanned ? new Date(2026, 2, 12, 8 + Math.floor(i / 5), i * 2).toISOString() : undefined,
}))

const statusLabels: Record<string, string> = {
  scanned: 'Đã quét',
  not_scanned: 'Chưa quét',
  missing: 'Mất',
  damaged: 'Hỏng',
}

const statusColors: Record<string, 'success' | 'neutral' | 'error' | 'warning'> = {
  scanned: 'success',
  not_scanned: 'neutral',
  missing: 'error',
  damaged: 'warning',
}

export function InventoryExecutionPage({ sessionId }: InventoryExecutionPageProps) {
  const [items, setItems] = useState(mockItems)
  const [barcode, setBarcode] = useState('')

  const scannedCount = items.filter((it) => it.scanStatus === 'scanned').length
  const progressPct = Math.round((scannedCount / totalItems) * 100)

  const handleScan = () => {
    if (!barcode.trim()) {
      toast.error('Vui lòng nhập mã barcode')
      return
    }
    const idx = items.findIndex((it) => it.copyCode === barcode.trim() && it.scanStatus === 'not_scanned')
    if (idx >= 0) {
      const found = items[idx]!
      setItems((prev) => prev.map((it, i) =>
        i === idx ? { ...it, scanStatus: 'scanned' as const, scannedAt: new Date().toISOString() } : it
      ))
      toast.success(`Đã quét: ${found.bookTitle}`)
    } else {
      const existing = items.find((it) => it.copyCode === barcode.trim())
      if (existing) {
        toast.info('Sách này đã được quét trước đó')
      } else {
        toast.error('Không tìm thấy sách với mã barcode này')
      }
    }
    setBarcode('')
  }

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
    {
      accessorKey: 'scannedAt',
      header: 'Thời gian quét',
      size: 170,
      cell: ({ getValue }) => {
        const val = getValue<string | undefined>()
        return val ? new Date(val).toLocaleString('vi-VN') : '—'
      },
    },
  ]

  const recentScanned = items
    .filter((it) => it.scanStatus === 'scanned')
    .sort((a, b) => (b.scannedAt ?? '').localeCompare(a.scannedAt ?? ''))
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thực hiện kiểm kê"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Kiểm kê', href: '/library/inventory/warehouse' },
          { label: 'Thực hiện' },
        ]}
      />

      <Card>
        <CardContent className="p-4">
          <Progress value={progressPct}>
            <ProgressLabel>Tiến độ kiểm kê</ProgressLabel>
            <ProgressValue />
          </Progress>
          <p className="text-sm text-muted-foreground mt-1">{scannedCount}/{totalItems} ({progressPct}%)</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scan input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Quét barcode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AppInput
              placeholder="Nhập hoặc quét mã barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan} className="w-full cursor-pointer">
              Nhập
            </Button>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Đã quét gần đây:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentScanned.map((item) => (
                  <div key={item.id} className="text-sm p-2 bg-green-50 dark:bg-green-950/20 rounded border">
                    <span className="font-medium">{item.copyCode}</span> — {item.bookTitle}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Full list */}
        <div className="lg:col-span-2">
          <DataTable<InventoryItem>
            data={items}
            columns={columns}
            loading={false}
            searchable
            searchPlaceholder="Tìm sách..."
          />
        </div>
      </div>
    </div>
  )
}
