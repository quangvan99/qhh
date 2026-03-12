'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { StatGrid, DataTable } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { Lock, LockOpen, BarChart3 } from 'lucide-react'

interface LockerRow {
  id: string
  lockerNumber: string
  area: string
  status: 'empty' | 'in_use'
  lastUser: string
  lastUsedAt: string
}

function generateMockData(): LockerRow[] {
  const areas = ['Tầng 1 - Khu A', 'Tầng 1 - Khu B', 'Tầng 2 - Khu A', 'Tầng 2 - Khu B']
  const users = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em', 'Võ Văn Phúc', 'Đặng Thu Giang', 'Bùi Quang Hải', 'Ngô Thị Ích', 'Trương Văn Kiên', 'Lý Thị Lan', 'Mai Đức Mạnh', 'Phan Thị Ngọc', 'Dương Văn Ơn', 'Hà Thị Phương', 'Cao Văn Quý', 'Đinh Thị Rạng', 'Lương Văn Sơn', 'Tô Thị Tâm', 'Ưng Văn Uy']
  return Array.from({ length: 20 }, (_, i) => ({
    id: `l${i}`,
    lockerNumber: `T${String(Math.floor(i / 5) + 1).padStart(2, '0')}-${String((i % 5) + 1).padStart(3, '0')}`,
    area: areas[Math.floor(i / 5)]!,
    status: i % 3 === 0 ? 'empty' as const : 'in_use' as const,
    lastUser: users[i]!,
    lastUsedAt: `2026-03-${String(1 + (i % 12)).padStart(2, '0')} ${8 + (i % 10)}:${String(i * 7 % 60).padStart(2, '0')}`,
  }))
}

export function LockerUsageReport() {
  const allData = useMemo(() => generateMockData(), [])

  const totalLockers = allData.length
  const inUse = allData.filter((r) => r.status === 'in_use').length
  const usageRate = totalLockers > 0 ? Math.round((inUse / totalLockers) * 100) : 0

  const columns: ColumnDef<LockerRow, unknown>[] = [
    { accessorKey: 'lockerNumber', header: 'Số tủ' },
    { accessorKey: 'area', header: 'Khu vực' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={val === 'in_use' ? 'info' : 'success'}>
            {val === 'in_use' ? 'Đang dùng' : 'Trống'}
          </AppBadge>
        )
      },
    },
    { accessorKey: 'lastUser', header: 'Người dùng cuối' },
    {
      accessorKey: 'lastUsedAt',
      header: 'Thời gian',
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const d = new Date(val)
        return isNaN(d.getTime()) ? val : d.toLocaleString('vi-VN')
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo sử dụng tủ đựng đồ"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Tủ đựng đồ' },
        ]}
      />

      <StatGrid
        cols={3}
        stats={[
          { title: 'Tổng tủ', value: totalLockers, icon: <Lock className="h-5 w-5" />, module: 'library' },
          { title: 'Đang sử dụng', value: inUse, icon: <LockOpen className="h-5 w-5" />, module: 'library' },
          { title: 'Tỷ lệ sử dụng', value: `${usageRate}%`, icon: <BarChart3 className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <DataTable<LockerRow>
        data={allData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm số tủ, khu vực..."
      />
    </div>
  )
}
