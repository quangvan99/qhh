'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface ExpiringMember {
  id: string
  fullName: string
  memberCode: string
  group: string
  issuedDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'new'
}

const today = new Date()
const newNames = ['Nguyễn Thị Mai', 'Trần Văn Hùng', 'Lê Hoàng Nam', 'Phạm Thị Thanh', 'Hoàng Văn Đạt', 'Ngô Thị Linh']
const newGroups = ['Học sinh', 'Giáo viên', 'Học sinh', 'Cán bộ', 'Sinh viên liên kết', 'Học sinh']
const expiringNames = ['Bùi Văn Tú', 'Đỗ Thị Hương', 'Vũ Minh Tuấn', 'Lý Thị Phương', 'Trương Hoàng Duy']
const expiringGroups = ['Học sinh', 'Giáo viên', 'Học sinh', 'Khách', 'Cán bộ']
const expiredNames = ['Phan Văn Quang', 'Đặng Thị Ngọc', 'Hồ Minh Khoa', 'Nguyễn Thị Lan']
const expiredGroups = ['Sinh viên liên kết', 'Học sinh', 'Khách', 'Giáo viên']

const mockData: ExpiringMember[] = [
  // New cards (last 30 days)
  ...Array.from({ length: 6 }, (_, i) => {
    const issued = new Date(today)
    issued.setDate(issued.getDate() - (i * 4 + 1))
    const expiry = new Date(issued)
    expiry.setMonth(expiry.getMonth() + 12)
    return {
      id: `new-${i}`,
      fullName: newNames[i] ?? `Bạn đọc mới ${i + 1}`,
      memberCode: `TV${String(100 + i).padStart(4, '0')}`,
      group: newGroups[i] ?? 'Học sinh',
      issuedDate: issued.toISOString(),
      expiryDate: expiry.toISOString(),
      status: 'new' as const,
    }
  }),
  // Expiring soon (next 30 days)
  ...Array.from({ length: 5 }, (_, i) => {
    const expiry = new Date(today)
    expiry.setDate(expiry.getDate() + (i * 5 + 2))
    const issued = new Date(expiry)
    issued.setMonth(issued.getMonth() - 12)
    return {
      id: `expiring-${i}`,
      fullName: expiringNames[i] ?? `Bạn đọc ${i + 1}`,
      memberCode: `TV${String(200 + i).padStart(4, '0')}`,
      group: expiringGroups[i] ?? 'Học sinh',
      issuedDate: issued.toISOString(),
      expiryDate: expiry.toISOString(),
      status: 'active' as const,
    }
  }),
  // Already expired
  ...Array.from({ length: 4 }, (_, i) => {
    const expiry = new Date(today)
    expiry.setDate(expiry.getDate() - (i * 7 + 3))
    const issued = new Date(expiry)
    issued.setMonth(issued.getMonth() - 12)
    return {
      id: `expired-${i}`,
      fullName: expiredNames[i] ?? `Bạn đọc ${i + 1}`,
      memberCode: `TV${String(300 + i).padStart(4, '0')}`,
      group: expiredGroups[i] ?? 'Học sinh',
      issuedDate: issued.toISOString(),
      expiryDate: expiry.toISOString(),
      status: 'expired' as const,
    }
  }),
]

const statusLabel: Record<string, string> = { new: 'Mới cấp', active: 'Sắp hết hạn', expired: 'Đã hết hạn' }

export function MemberExpiringReport() {
  const [tab, setTab] = useState('new')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredData = useMemo(() => {
    if (tab === 'new') return mockData.filter((m) => m.status === 'new')
    if (tab === 'expiring') return mockData.filter((m) => m.status === 'active')
    return mockData.filter((m) => m.status === 'expired')
  }, [tab])

  const handleBulkRenew = () => {
    const count = selectedIds.size || filteredData.length
    toast.success(`Đã gia hạn ${count} thẻ bạn đọc (mock)`)
    setSelectedIds(new Set())
  }

  const columns: ColumnDef<ExpiringMember, unknown>[] = [
    { accessorKey: 'fullName', header: 'Họ tên' },
    { accessorKey: 'memberCode', header: 'Mã thẻ', size: 110 },
    { accessorKey: 'group', header: 'Nhóm', size: 150 },
    {
      accessorKey: 'issuedDate',
      header: 'Ngày cấp',
      size: 120,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'expiryDate',
      header: 'Ngày hết hạn',
      size: 130,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 130,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const semantic = val === 'new' ? 'info' : val === 'active' ? 'warning' : 'error'
        return <AppBadge semantic={semantic}>{statusLabel[val] ?? val}</AppBadge>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thẻ mới cấp & sắp hết hạn"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo', href: '/library/reports/members' },
          { label: 'Thẻ mới & hết hạn' },
        ]}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="new" className="cursor-pointer">Thẻ mới cấp (30 ngày qua)</TabsTrigger>
            <TabsTrigger value="expiring" className="cursor-pointer">Sắp hết hạn (30 ngày tới)</TabsTrigger>
            <TabsTrigger value="expired" className="cursor-pointer">Đã hết hạn</TabsTrigger>
          </TabsList>

          {(tab === 'expiring' || tab === 'expired') && (
            <Button onClick={handleBulkRenew} variant="outline" className="cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" />
              Gia hạn hàng loạt
            </Button>
          )}
        </div>

        <TabsContent value="new" className="mt-4">
          <DataTable<ExpiringMember>
            data={filteredData}
            columns={columns}
            loading={false}
            searchable
            searchPlaceholder="Tìm bạn đọc..."
          />
        </TabsContent>
        <TabsContent value="expiring" className="mt-4">
          <DataTable<ExpiringMember>
            data={filteredData}
            columns={columns}
            loading={false}
            searchable
            searchPlaceholder="Tìm bạn đọc..."
          />
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          <DataTable<ExpiringMember>
            data={filteredData}
            columns={columns}
            loading={false}
            searchable
            searchPlaceholder="Tìm bạn đọc..."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
