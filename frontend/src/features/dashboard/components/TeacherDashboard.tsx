'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BookOpen, AlertTriangle, FileText, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { RecentActivity } from './RecentActivity'
import { useTeacherSummary } from '../api/dashboard.api'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Link from 'next/link'
import type { TeacherClassItem, TeacherAssignment } from '../types/dashboard.types'

// Mock data for teacher
const MOCK_CLASSES: TeacherClassItem[] = [
  { id: '1', name: 'Toán 10A1', semester: 'HK2 2025-2026', progress: 72, studentCount: 42 },
  { id: '2', name: 'Toán 10A2', semester: 'HK2 2025-2026', progress: 68, studentCount: 40 },
  { id: '3', name: 'Toán 11B1', semester: 'HK2 2025-2026', progress: 85, studentCount: 38 },
  { id: '4', name: 'Toán 11B2', semester: 'HK2 2025-2026', progress: 60, studentCount: 41 },
  { id: '5', name: 'Toán 12A1', semester: 'HK2 2025-2026', progress: 90, studentCount: 39 },
]

const MOCK_ASSIGNMENTS: TeacherAssignment[] = [
  { id: '1', title: 'Bài tập chương 3: Hàm số', className: '10A1', dueDate: '2026-03-15', notSubmitted: 8 },
  { id: '2', title: 'Kiểm tra giữa kỳ', className: '11B1', dueDate: '2026-03-14', notSubmitted: 12 },
  { id: '3', title: 'Ôn tập tích phân', className: '12A1', dueDate: '2026-03-16', notSubmitted: 5 },
]

export function TeacherDashboard() {
  const { data: summary, isLoading } = useTeacherSummary()
  const { user } = useAuth()

  const today = format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })

  const stats = [
    {
      title: 'Lớp đang dạy',
      value: summary?.teachingClasses ?? 0,
      icon: <BookOpen className="h-5 w-5" />,
      module: 'lms' as const,
      loading: isLoading,
    },
    {
      title: 'HS cần hỗ trợ',
      value: summary?.studentsNeedHelp ?? 0,
      icon: <AlertTriangle className="h-5 w-5" />,
      module: 'exam' as const,
      loading: isLoading,
    },
    {
      title: 'Bài tập chờ chấm',
      value: summary?.pendingAssignments ?? 0,
      icon: <FileText className="h-5 w-5" />,
      module: 'exam' as const,
      loading: isLoading,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${user?.name ?? 'Giáo viên'}`}
        subtitle={today}
      />

      <StatGrid stats={stats} cols={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My classes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Lớp học của tôi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {MOCK_CLASSES.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/lms/classes/${cls.id}`}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-semibold text-sm shrink-0">
                      {cls.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{cls.name}</p>
                        <span className="text-xs text-muted-foreground">{cls.studentCount} HS</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Progress value={cls.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{cls.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System notifications placeholder */}
        <RecentActivity />
      </div>

      {/* Upcoming assignments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Bài tập sắp hết hạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Tên bài tập</th>
                  <th className="pb-2 font-medium">Lớp</th>
                  <th className="pb-2 font-medium">Hạn nộp</th>
                  <th className="pb-2 font-medium text-right">Chưa nộp</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ASSIGNMENTS.map((assignment) => (
                  <tr key={assignment.id} className="border-b last:border-0">
                    <td className="py-2.5">{assignment.title}</td>
                    <td className="py-2.5">
                      <Badge variant="outline">{assignment.className}</Badge>
                    </td>
                    <td className="py-2.5">{format(new Date(assignment.dueDate), 'dd/MM/yyyy')}</td>
                    <td className="py-2.5 text-right">
                      <Badge variant={assignment.notSubmitted > 10 ? 'destructive' : 'secondary'}>
                        {assignment.notSubmitted}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
