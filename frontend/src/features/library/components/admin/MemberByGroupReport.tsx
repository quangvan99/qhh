'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'

interface GroupReport {
  id: string
  groupName: string
  memberCount: number
  borrowingCount: number
  overdueCount: number
  usageRate: number
}

const mockData: GroupReport[] = [
  { id: '1', groupName: 'Học sinh', memberCount: 245, borrowingCount: 87, overdueCount: 12, usageRate: 35.5 },
  { id: '2', groupName: 'Giáo viên', memberCount: 42, borrowingCount: 28, overdueCount: 2, usageRate: 66.7 },
  { id: '3', groupName: 'Cán bộ', memberCount: 18, borrowingCount: 8, overdueCount: 1, usageRate: 44.4 },
  { id: '4', groupName: 'Sinh viên liên kết', memberCount: 35, borrowingCount: 15, overdueCount: 4, usageRate: 42.9 },
  { id: '5', groupName: 'Khách', memberCount: 12, borrowingCount: 3, overdueCount: 0, usageRate: 25.0 },
]

const columns: ColumnDef<GroupReport, unknown>[] = [
  { accessorKey: 'groupName', header: 'Nhóm bạn đọc' },
  { accessorKey: 'memberCount', header: 'Số thành viên', size: 130 },
  { accessorKey: 'borrowingCount', header: 'Đang mượn sách', size: 140 },
  { accessorKey: 'overdueCount', header: 'Quá hạn', size: 120 },
  {
    accessorKey: 'usageRate',
    header: 'Tỷ lệ sử dụng',
    size: 140,
    cell: ({ getValue }) => {
      const val = getValue<number>()
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground w-12 text-right">{val}%</span>
        </div>
      )
    },
  },
]

export function MemberByGroupReport() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo bạn đọc theo nhóm"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo', href: '/library/reports/members' },
          { label: 'Theo nhóm' },
        ]}
      />

      <DataTable<GroupReport>
        data={mockData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm nhóm..."
      />
    </div>
  )
}
