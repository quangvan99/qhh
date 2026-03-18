'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { mockClasses, mockTeachers } from '@/lib/mock/data'
import { HeatmapGrid } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { MonitorPlay, Users, BookOpen, Activity, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock e-learning data
const mockELearningClasses = [
  { id: 'el-1', classId: 'lop-12a1', className: '12A1', subject: 'Toán', teacherId: 'gv-001', teacherName: 'Nguyễn Thị Bích', studentCount: 39, avgProgress: 78, lastActivity: '2025-01-15 14:30', status: 'active' },
  { id: 'el-2', classId: 'lop-12a2', className: '12A2', subject: 'Ngữ văn', teacherId: 'gv-004', teacherName: 'Phạm Văn Đức', studentCount: 35, avgProgress: 65, lastActivity: '2025-01-15 11:00', status: 'active' },
  { id: 'el-3', classId: 'lop-11a1', className: '11A1', subject: 'Vật lý', teacherId: 'gv-002', teacherName: 'Trần Văn Hùng', studentCount: 40, avgProgress: 45, lastActivity: '2025-01-14 16:00', status: 'active' },
  { id: 'el-4', classId: 'lop-11a2', className: '11A2', subject: 'Hóa học', teacherId: 'gv-003', teacherName: 'Lê Thị Lan', studentCount: 37, avgProgress: 89, lastActivity: '2025-01-15 09:15', status: 'active' },
  { id: 'el-5', classId: 'lop-10a1', className: '10A1', subject: 'Tiếng Anh', teacherId: 'gv-007', teacherName: 'Đặng Thị Hoa', studentCount: 38, avgProgress: 52, lastActivity: '2025-01-13 15:45', status: 'inactive' },
  { id: 'el-6', classId: 'lop-10a3', className: '10A3', subject: 'Sinh học', teacherId: 'gv-009', teacherName: 'Ngô Thị Hương', studentCount: 37, avgProgress: 71, lastActivity: '2025-01-15 08:30', status: 'active' },
  { id: 'el-7', classId: 'lop-12a3', className: '12A3', subject: 'Toán', teacherId: 'gv-022', teacherName: 'Từ Văn Phúc', studentCount: 38, avgProgress: 83, lastActivity: '2025-01-15 13:00', status: 'active' },
  { id: 'el-8', classId: 'lop-11a3', className: '11A3', subject: 'Lịch sử', teacherId: 'gv-005', teacherName: 'Hoàng Thị Mai', studentCount: 38, avgProgress: 60, lastActivity: '2025-01-14 10:30', status: 'active' },
]

function generateHeatmapData(studentCount: number, lessonCount: number) {
  const students = Array.from({ length: Math.min(studentCount, 15) }, (_, i) => ({
    id: `s-${i}`,
    label: `Học sinh ${i + 1}`,
  }))
  const lessons = Array.from({ length: lessonCount }, (_, i) => ({
    id: `l-${i}`,
    label: `BH${i + 1}`,
  }))
  const data = students.flatMap(s =>
    lessons.map(l => ({
      rowId: s.id,
      colId: l.id,
      value: Math.random() > 0.25 ? 1 : 0,
      tooltip: `${s.label} — ${l.label}`,
    }))
  )
  return { rows: students, cols: lessons, data }
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-blue-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums font-medium w-8 text-right">{value}%</span>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}
      </div>
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
      </div>
    </div>
  )
}

export default function ELearningPage() {
  const [selectedClass, setSelectedClass] = useState<typeof mockELearningClasses[number] | null>(null)
  const [heatmapData, setHeatmapData] = useState<ReturnType<typeof generateHeatmapData> | null>(null)

  const activeClasses = mockELearningClasses.filter(c => c.status === 'active')
  const avgCompletion = Math.round(mockELearningClasses.reduce((sum, c) => sum + c.avgProgress, 0) / mockELearningClasses.length)

  const handleViewDetail = (cls: typeof mockELearningClasses[number]) => {
    setSelectedClass(cls)
    setHeatmapData(generateHeatmapData(cls.studentCount, 15))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">E-Learning Monitor</h1>
        <p className="text-sm text-muted-foreground">Theo dõi tiến độ học tập trực tuyến của học sinh</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <MonitorPlay className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{mockELearningClasses.length}</p>
          <p className="text-xs text-muted-foreground">Tổng lớp E-learning</p>
        </div>
        <div className="rounded-xl border bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 p-4 text-center">
          <Activity className="h-5 w-5 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{activeClasses.length}</p>
          <p className="text-xs text-green-700">Đang hoạt động</p>
        </div>
        <div className="rounded-xl border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 p-4 text-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{avgCompletion}%</p>
          <p className="text-xs text-blue-700">Hoàn thành TB</p>
        </div>
      </div>

      {/* Classes Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold">Danh sách lớp học trực tuyến</h2>
          <Badge variant="secondary">{mockELearningClasses.length} lớp</Badge>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Lớp / Môn</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Giáo viên</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Học sinh</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Tiến độ TB</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Hoạt động gần nhất</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mockELearningClasses.map(cls => (
              <tr key={cls.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold">{cls.className}</p>
                    <p className="text-xs text-muted-foreground">{cls.subject}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{cls.teacherName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {cls.studentCount}
                  </div>
                </td>
                <td className="px-4 py-3 min-w-[140px]">
                  <ProgressBar value={cls.avgProgress} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{cls.lastActivity}</td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
                    onClick={() => handleViewDetail(cls)}>
                    <MonitorPlay className="h-3 w-3" /> Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết E-learning: {selectedClass?.className} — {selectedClass?.subject}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xl font-bold">{selectedClass?.studentCount}</p>
                <p className="text-xs text-muted-foreground">Học sinh</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xl font-bold">{selectedClass?.avgProgress}%</p>
                <p className="text-xs text-muted-foreground">Tiến độ TB</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">Bài học</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-sm">Heatmap tiến độ (Học sinh × Bài học)</h3>
              <div className="mb-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-green-500 inline-block" /> Hoàn thành</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-red-300 inline-block" /> Chưa học</span>
              </div>
              {heatmapData && (
                <div className="overflow-auto max-h-80">
                  <HeatmapGrid
                    rows={heatmapData.rows}
                    cols={heatmapData.cols}
                    data={heatmapData.data}
                    mode="attendance"
                    cellSize="md"
                    stickyFirstCol
                    rowLabelWidth={100}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
