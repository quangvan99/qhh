'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Users, BookOpen, Camera, Library, Download } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { ChartCard } from '@/components/patterns/chart-card'
import { RecentActivity } from './RecentActivity'
import { QuickShortcuts } from './QuickShortcuts'
import { useAdminSummary, useDashboardCharts } from '../api/dashboard.api'

export function AdminDashboard() {
  const { data: summary, isLoading: summaryLoading } = useAdminSummary()
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts()

  const today = format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })

  const stats = [
    {
      title: 'Tổng học sinh',
      value: summary?.students ?? 0,
      delta: summary?.studentsDelta,
      icon: <Users className="h-5 w-5" />,
      module: 'lms' as const,
      loading: summaryLoading,
    },
    {
      title: 'Lớp đang hoạt động',
      value: summary?.classes ?? 0,
      delta: summary?.classesDelta,
      icon: <BookOpen className="h-5 w-5" />,
      module: 'lms' as const,
      loading: summaryLoading,
    },
    {
      title: 'Điểm danh hôm nay',
      value: summary?.attendanceToday ?? 0,
      delta: summary?.attendanceDelta,
      icon: <Camera className="h-5 w-5" />,
      module: 'ai' as const,
      unit: '%',
      loading: summaryLoading,
    },
    {
      title: 'Sách đang mượn',
      value: summary?.booksOnLoan ?? 0,
      icon: <Library className="h-5 w-5" />,
      module: 'library' as const,
      loading: summaryLoading,
    },
  ]

  const barData = (charts?.classStudents ?? []).map((d) => ({
    name: d.name,
    'Học sinh': d.value,
  }))

  const lineData = (charts?.attendance7Days ?? []).map((d) => ({
    name: d.name,
    'Tỷ lệ %': d.value,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan hệ thống"
        subtitle={today}
        actions={[
          {
            label: 'Xuất báo cáo',
            icon: <Download className="h-4 w-4" />,
            variant: 'outline',
            onClick: () => {},
          },
        ]}
      />

      <StatGrid stats={stats} cols={4} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Học sinh theo lớp"
          type="bar"
          data={barData}
          dataKey="Học sinh"
          loading={chartsLoading}
          height={300}
        />
        <ChartCard
          title="Điểm danh 7 ngày"
          type="line"
          data={lineData}
          dataKey="Tỷ lệ %"
          loading={chartsLoading}
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickShortcuts />
      </div>
    </div>
  )
}
