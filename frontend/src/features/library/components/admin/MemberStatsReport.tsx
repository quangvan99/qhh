'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { StatGrid, DataTable } from '@/components/patterns'
import { AppSelect } from '@/components/base'
import { Users, UserCheck, UserX, Lock } from 'lucide-react'

interface GroupStat {
  id: string
  name: string
  total: number
  active: number
  expired: number
  suspended: number
}

const mockGroupStats: GroupStat[] = [
  { id: '1', name: 'Học sinh', total: 245, active: 210, expired: 25, suspended: 10 },
  { id: '2', name: 'Giáo viên', total: 42, active: 38, expired: 3, suspended: 1 },
  { id: '3', name: 'Cán bộ', total: 18, active: 16, expired: 2, suspended: 0 },
  { id: '4', name: 'Sinh viên liên kết', total: 35, active: 28, expired: 5, suspended: 2 },
  { id: '5', name: 'Khách', total: 12, active: 8, expired: 3, suspended: 1 },
]

const yearOptions = [
  { value: '2025-2026', label: 'Năm học 2025-2026' },
  { value: '2024-2025', label: 'Năm học 2024-2025' },
  { value: '2023-2024', label: 'Năm học 2023-2024' },
]

const columns: ColumnDef<GroupStat, unknown>[] = [
  { accessorKey: 'name', header: 'Nhóm bạn đọc' },
  { accessorKey: 'total', header: 'Tổng thành viên', size: 140 },
  { accessorKey: 'active', header: 'Đang hoạt động', size: 140 },
  { accessorKey: 'expired', header: 'Hết hạn', size: 120 },
  { accessorKey: 'suspended', header: 'Bị khóa', size: 120 },
]

export function MemberStatsReport() {
  const [year, setYear] = useState('2025-2026')

  const totalMembers = mockGroupStats.reduce((s, g) => s + g.total, 0)
  const totalActive = mockGroupStats.reduce((s, g) => s + g.active, 0)
  const totalExpired = mockGroupStats.reduce((s, g) => s + g.expired, 0)
  const totalSuspended = mockGroupStats.reduce((s, g) => s + g.suspended, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thống kê tổng hợp bạn đọc"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo', href: '/library/reports/members' },
          { label: 'Thống kê tổng hợp' },
        ]}
      />

      <div className="flex items-center gap-4">
        <AppSelect
          label="Năm học"
          options={yearOptions}
          value={year}
          onChange={setYear}
          className="w-52"
        />
      </div>

      <StatGrid
        cols={4}
        stats={[
          { title: 'Tổng bạn đọc', value: totalMembers, icon: <Users className="h-5 w-5" />, module: 'library' },
          { title: 'Đang hoạt động', value: totalActive, icon: <UserCheck className="h-5 w-5" />, module: 'library' },
          { title: 'Thẻ hết hạn', value: totalExpired, icon: <UserX className="h-5 w-5" />, module: 'library' },
          { title: 'Thẻ bị khóa', value: totalSuspended, icon: <Lock className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <DataTable<GroupStat>
        data={mockGroupStats}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm nhóm..."
      />
    </div>
  )
}
