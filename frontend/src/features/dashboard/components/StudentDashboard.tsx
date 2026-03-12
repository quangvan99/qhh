'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BookOpen, Clock, Award, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { useStudentSummary } from '../api/dashboard.api'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Link from 'next/link'
import type { StudentAssignment } from '../types/dashboard.types'

// Mock assignments
const MOCK_PENDING: StudentAssignment[] = [
  { id: '1', title: 'Bài tập Toán chương 3', className: '10A1 — Toán', dueDate: '2026-03-15', status: 'pending' },
  { id: '2', title: 'Thuyết trình Văn', className: '10A1 — Ngữ văn', dueDate: '2026-03-16', status: 'pending' },
  { id: '3', title: 'Lab Hóa học', className: '10A1 — Hóa học', dueDate: '2026-03-17', status: 'pending' },
]

const MOCK_OVERDUE: StudentAssignment[] = [
  { id: '4', title: 'Bài kiểm tra Lý', className: '10A1 — Vật lý', dueDate: '2026-03-10', status: 'overdue' },
]

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'Giáo viên đã đăng bài tập mới — Toán chương 4', time: '2 giờ trước' },
  { id: '2', text: 'Điểm kiểm tra giữa kỳ đã được cập nhật', time: '5 giờ trước' },
  { id: '3', text: 'Lớp 10A1 có buổi học bù vào thứ 7', time: '1 ngày trước' },
  { id: '4', text: 'Thư viện thông báo: sách mượn sắp hết hạn', time: '2 ngày trước' },
]

export function StudentDashboard() {
  const { data: summary, isLoading } = useStudentSummary()
  const { user } = useAuth()

  const stats = [
    {
      title: 'Lớp đang học',
      value: summary?.enrolledClasses ?? 0,
      icon: <BookOpen className="h-5 w-5" />,
      module: 'lms' as const,
      loading: isLoading,
    },
    {
      title: 'Bài tập sắp hạn',
      value: summary?.upcomingDeadlines ?? 0,
      icon: <Clock className="h-5 w-5" />,
      module: 'exam' as const,
      loading: isLoading,
    },
    {
      title: 'Điểm TB tháng này',
      value: summary?.avgScore ?? 0,
      icon: <Award className="h-5 w-5" />,
      module: 'exam' as const,
      loading: isLoading,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chào ${user?.name ?? 'bạn'}!`}
        subtitle="Lớp 10A1 — Năm học 2025-2026"
      />

      <StatGrid stats={stats} cols={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments with tabs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Bài tập của tôi</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={0}>
              <TabsList className="mb-3">
                <TabsTrigger value={0} className="cursor-pointer">
                  Chưa nộp ({MOCK_PENDING.length})
                </TabsTrigger>
                <TabsTrigger value={1} className="cursor-pointer">
                  Sắp hết hạn ({MOCK_OVERDUE.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value={0}>
                <AssignmentList assignments={MOCK_PENDING} />
              </TabsContent>
              <TabsContent value={1}>
                <AssignmentList assignments={MOCK_OVERDUE} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Thông báo từ lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex gap-3 items-start">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{n.text}</p>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AssignmentList({ assignments }: { assignments: StudentAssignment[] }) {
  if (assignments.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Không có bài tập</p>
  }

  return (
    <div className="space-y-2">
      {assignments.map((a) => (
        <Link
          key={a.id}
          href={`/my-classes/${a.id}`}
          className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
        >
          <div>
            <p className="text-sm font-medium">{a.title}</p>
            <p className="text-xs text-muted-foreground">{a.className}</p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <Badge variant={a.status === 'overdue' ? 'destructive' : 'secondary'}>
              {format(new Date(a.dueDate), 'dd/MM')}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}
