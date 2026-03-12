"use client"

import { BookOpen, Users, TrendingUp, Activity } from "lucide-react"
import { StatGrid } from "@/components/patterns/stat-grid"
import { ChartCard } from "@/components/patterns/chart-card"
import { PageHeader } from "@/components/composite/page-header"
import type { ClassDashboardStats } from "../types/class.types"

interface ClassDashboardProps {
  stats?: ClassDashboardStats
  loading?: boolean
}

export function ClassDashboard({ stats, loading }: ClassDashboardProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard lớp học"
        breadcrumbs={[
          { label: "LMS", href: "/lms" },
          { label: "Lớp học", href: "/lms/classes" },
          { label: "Dashboard" },
        ]}
      />

      <StatGrid
        cols={4}
        stats={[
          { title: "Tổng lớp học", value: stats?.totalClasses ?? 0, icon: <BookOpen className="h-5 w-5" />, module: "lms", loading },
          { title: "Tổng học sinh", value: stats?.totalStudents ?? 0, icon: <Users className="h-5 w-5" />, module: "lms", loading },
          { title: "Hoàn thành TB", value: `${stats?.avgCompletion ?? 0}%`, icon: <TrendingUp className="h-5 w-5" />, module: "lms", loading },
          { title: "Lớp đang hoạt động", value: stats?.activeClasses ?? 0, icon: <Activity className="h-5 w-5" />, module: "lms", loading },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Phân bố học sinh theo lớp"
          type="bar"
          data={stats?.studentDistribution?.map((d) => ({ name: d.name, count: d.count })) ?? []}
          dataKey="count"
          loading={loading}
        />
        <ChartCard
          title="Tỉ lệ hoàn thành theo lớp"
          type="bar"
          data={stats?.completionByClass?.map((d) => ({ name: d.name, completion: d.completion })) ?? []}
          dataKey="completion"
          loading={loading}
        />
      </div>
    </div>
  )
}
