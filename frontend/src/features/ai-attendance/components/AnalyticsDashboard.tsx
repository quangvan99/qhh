'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users } from 'lucide-react'
import { PageHeader } from '@/components/composite'
import { StatGrid, ChartCard } from '@/components/patterns'
import { AppInput } from '@/components/base'
import { useGetAttendanceAnalytics } from '../api/attendance.api'

export function AnalyticsDashboard() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { data: analytics, isLoading } = useGetAttendanceAnalytics({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const barData = (analytics?.byClass ?? []).map(c => ({
    name: c.name,
    rate: Number(c.rate.toFixed(1)),
  }))

  const lineData = (analytics?.dailyTrend ?? []).map(d => ({
    name: d.date,
    rate: Number(d.rate.toFixed(1)),
  }))

  return (
    <div>
      <PageHeader
        title="Phân tích điểm danh"
        subtitle="Thống kê tổng quan và xu hướng điểm danh"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Phân tích' },
        ]}
      />

      <div className="mb-6 flex items-end gap-3">
        <AppInput
          type="date"
          label="Từ ngày"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[180px]"
        />
        <AppInput
          type="date"
          label="Đến ngày"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-[180px]"
        />
      </div>

      <StatGrid
        cols={3}
        stats={[
          {
            title: 'Tỉ lệ điểm danh',
            value: analytics ? `${analytics.overallRate.toFixed(1)}%` : '—',
            module: 'ai',
            icon: <TrendingUp className="h-5 w-5" />,
            loading: isLoading,
          },
          {
            title: 'Tổng phiên',
            value: analytics?.totalSessions ?? 0,
            module: 'ai',
            icon: <BarChart3 className="h-5 w-5" />,
            loading: isLoading,
          },
          {
            title: 'Có mặt TB',
            value: analytics?.avgPresent ?? 0,
            module: 'ai',
            icon: <Users className="h-5 w-5" />,
            loading: isLoading,
          },
        ]}
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Tỉ lệ điểm danh theo lớp"
          type="bar"
          data={barData}
          dataKey="rate"
          xKey="name"
          loading={isLoading}
          colors={['#2563eb']}
        />
        <ChartCard
          title="Xu hướng điểm danh 30 ngày"
          type="line"
          data={lineData}
          dataKey="rate"
          xKey="name"
          loading={isLoading}
          colors={['#2563eb']}
        />
      </div>
    </div>
  )
}
