'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { ChartCard } from '@/components/patterns/chart-card'
import { DataTable } from '@/components/patterns/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const progressData = [
  { name: 'Hoàn thành', value: 18, fill: '#10b981' },
  { name: 'Đang học', value: 10, fill: '#f59e0b' },
  { name: 'Chưa bắt đầu', value: 4, fill: '#94a3b8' },
]

const weeklyData = Array.from({ length: 8 }, (_, i) => ({
  name: `Tuần ${i + 1}`, hoatDong: Math.floor(Math.random() * 100) + 20,
}))

interface ContentRow { name: string; progress: number; score: number | null; time: number; access: number }
interface AssignmentRow { name: string; submitted: number; notSubmitted: number; avgScore: number }
interface ExamRow { name: string; taken: number; avgScore: number; highest: number; lowest: number }

const contentRows: ContentRow[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Nội dung ${i + 1}`, progress: Math.round(Math.random() * 100),
  score: i % 2 === 0 ? Math.round(Math.random() * 100) : null, time: Math.floor(Math.random() * 60), access: Math.floor(Math.random() * 30),
}))

const assignmentRows: AssignmentRow[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Bài tập ${i + 1}`, submitted: 28 + i, notSubmitted: 4 - i, avgScore: 6 + Math.random() * 3,
}))

const examRows: ExamRow[] = Array.from({ length: 3 }, (_, i) => ({
  name: `Ca thi ${i + 1}`, taken: 30 + i, avgScore: 6 + Math.random() * 2, highest: 9 + Math.random(), lowest: 3 + Math.random() * 2,
}))

const contentCols: ColumnDef<ContentRow, unknown>[] = [
  { accessorKey: 'name', header: 'Tên HS' },
  { accessorKey: 'progress', header: 'Tiến độ %' },
  { accessorKey: 'score', header: 'SCORM điểm', cell: ({ row }) => row.original.score ?? '—' },
  { accessorKey: 'time', header: 'Thời gian (phút)' },
  { accessorKey: 'access', header: 'Lần truy cập' },
]

const assignmentCols: ColumnDef<AssignmentRow, unknown>[] = [
  { accessorKey: 'name', header: 'Tên bài tập' },
  { accessorKey: 'submitted', header: 'Đã nộp' },
  { accessorKey: 'notSubmitted', header: 'Chưa nộp' },
  { accessorKey: 'avgScore', header: 'Điểm TB', cell: ({ row }) => row.original.avgScore.toFixed(1) },
]

const examCols: ColumnDef<ExamRow, unknown>[] = [
  { accessorKey: 'name', header: 'Ca thi' },
  { accessorKey: 'taken', header: 'Đã thi' },
  { accessorKey: 'avgScore', header: 'Điểm TB', cell: ({ row }) => row.original.avgScore.toFixed(1) },
  { accessorKey: 'highest', header: 'Cao nhất', cell: ({ row }) => row.original.highest.toFixed(1) },
  { accessorKey: 'lowest', header: 'Thấp nhất', cell: ({ row }) => row.original.lowest.toFixed(1) },
]

export function ClassReports({ classId }: { classId: string }) {
  return (
    <div>
      <PageHeader
        title="Báo cáo lớp"
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Báo cáo' }]}
        actions={[{ label: 'Xuất Excel', variant: 'outline', icon: <Download className="h-4 w-4" /> }]}
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="content">Tiến độ nội dung</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="exams">Thi</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-6">
          <StatGrid cols={4} stats={[
            { title: 'Tổng HS', value: 32, module: 'lms' },
            { title: 'Hoàn thành', value: 18, module: 'lms' },
            { title: 'Điểm TB', value: '7.5', module: 'lms' },
            { title: 'Tỷ lệ nộp BT', value: '87%', module: 'lms' },
          ]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Phân bố tiến độ HS" type="pie" data={progressData} dataKey="value" />
            <ChartCard title="Hoạt động theo tuần" type="line" data={weeklyData} dataKey="hoatDong" xKey="name" />
          </div>
        </TabsContent>
        <TabsContent value="content" className="mt-4"><DataTable data={contentRows} columns={contentCols} pageSize={20} searchable /></TabsContent>
        <TabsContent value="assignments" className="mt-4"><DataTable data={assignmentRows} columns={assignmentCols} pageSize={20} /></TabsContent>
        <TabsContent value="exams" className="mt-4"><DataTable data={examRows} columns={examCols} pageSize={20} /></TabsContent>
      </Tabs>
    </div>
  )
}
