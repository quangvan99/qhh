'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { adminMockApi } from '@/lib/mock'
import { KPICard } from '@/components/shared'
import {
  GraduationCap, Users, BookOpen, Library,
  UserPlus, UserCheck, CalendarCheck, BookMarked,
  BarChart3, Trophy, Bell, Settings, AlertCircle,
  AlertTriangle, Info, Clock, BookOpenCheck, Scan, XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

// Mock chart data
const attendanceWeek = [
  { day: 'T2', present: 895, absent: 65 },
  { day: 'T3', present: 910, absent: 50 },
  { day: 'T4', present: 872, absent: 88 },
  { day: 'T5', present: 930, absent: 30 },
  { day: 'T6', present: 842, absent: 118 },
  { day: 'T7', present: 780, absent: 180 },
  { day: 'CN', present: 0, absent: 0 },
]

const bookCategories = [
  { name: 'Toán học', value: 9 },
  { name: 'Vật lý', value: 8 },
  { name: 'Văn học', value: 5 },
  { name: 'Ngoại ngữ', value: 4 },
  { name: 'Hóa học', value: 5 },
  { name: 'Khác', value: 14 },
]

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

const quickActions = [
  { label: 'Thêm học sinh', icon: UserPlus, href: '/admin/hoc-sinh', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { label: 'Thêm giáo viên', icon: UserCheck, href: '/admin/giao-vien', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { label: 'Điểm danh', icon: Scan, href: '/admin/diem-danh', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { label: 'Mượn sách', icon: BookMarked, href: '/admin/thu-vien', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { label: 'Báo cáo', icon: BarChart3, href: '/admin/bao-cao', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  { label: 'Tạo kỳ thi', icon: Trophy, href: '/admin/thi', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { label: 'Thông báo', icon: Bell, href: '#', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
  { label: 'Hệ thống', icon: Settings, href: '/admin/he-thong', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
]

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="h-16 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

function AlertBanner({ alerts }: { alerts: Array<{ id: string; level: string; message: string; link: string }> }) {
  if (!alerts || alerts.length === 0) return null

  const errors = alerts.filter(a => a.level === 'error')
  const warnings = alerts.filter(a => a.level === 'warning')
  const infos = alerts.filter(a => a.level === 'info')

  return (
    <div className="space-y-2">
      {errors.map(alert => (
        <div key={alert.id} className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1 text-sm text-red-800 dark:text-red-300">{alert.message}</p>
          <Link href={alert.link}>
            <Button variant="ghost" size="sm" className="h-7 text-red-700 hover:text-red-900 hover:bg-red-100">Xem →</Button>
          </Link>
        </div>
      ))}
      {warnings.map(alert => (
        <div key={alert.id} className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-800 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600" />
          <p className="flex-1 text-sm text-yellow-800 dark:text-yellow-300">{alert.message}</p>
          <Link href={alert.link}>
            <Button variant="ghost" size="sm" className="h-7 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100">Xem →</Button>
          </Link>
        </div>
      ))}
      {infos.map(alert => (
        <div key={alert.id} className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
          <Info className="h-4 w-4 shrink-0 text-blue-600" />
          <p className="flex-1 text-sm text-blue-800 dark:text-blue-300">{alert.message}</p>
          <Link href={alert.link}>
            <Button variant="ghost" size="sm" className="h-7 text-blue-700 hover:text-blue-900 hover:bg-blue-100">Xem →</Button>
          </Link>
        </div>
      ))}
    </div>
  )
}

const notificationIcons: Record<string, React.ReactNode> = {
  attendance: <Scan className="h-4 w-4 text-purple-500" />,
  assignment: <BookOpenCheck className="h-4 w-4 text-blue-500" />,
  library: <Library className="h-4 w-4 text-orange-500" />,
  exam: <Trophy className="h-4 w-4 text-yellow-500" />,
}

export default function AdminDashboardPage() {
  const searchParams = useSearchParams()
  const simulateError = searchParams?.get('simulate') === 'error'

  const { data: kpis, isLoading: kpisLoading, isError: kpisError } = useQuery({
    queryKey: ['admin', 'kpis'],
    queryFn: () => adminMockApi.getKPIs(),
  })

  const { data: notifications, isLoading: notiLoading } = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => adminMockApi.getNotifications(),
  })

  if (kpisLoading) return <PageSkeleton />

  if (simulateError || kpisError) {
    return (
      <div data-testid="error-state" className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold">Lỗi tải dữ liệu</h2>
        <p className="text-muted-foreground text-sm">Không thể kết nối đến máy chủ. Vui lòng thử lại.</p>
        <button
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm cursor-pointer hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    )
  }

  const attendancePct = kpis?.todayAttendance.percentage ?? 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Tổng quan hệ thống THPT Quốc Học Huế — {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Alert Banner */}
      {kpis?.alerts && <AlertBanner alerts={kpis.alerts} />}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Điểm danh hôm nay"
          value={`${kpis?.todayAttendance.present}/${kpis?.todayAttendance.total}`}
          subtitle={`${attendancePct}% có mặt`}
          icon={GraduationCap}
          variant={attendancePct >= 90 ? 'success' : attendancePct >= 80 ? 'warning' : 'danger'}
          trend={{ value: 1.2, label: '+1.2% so với hôm qua', isPositive: true }}
          onClick={() => window.location.href = '/admin/diem-danh'}
        />
        <KPICard
          title="Giáo viên đang dạy"
          value={`${kpis?.activeTeachers.count}/${kpis?.activeTeachers.total}`}
          subtitle={`${(kpis?.activeTeachers.total ?? 0) - (kpis?.activeTeachers.count ?? 0)} giáo viên nghỉ phép`}
          icon={Users}
          variant="default"
          onClick={() => window.location.href = '/admin/giao-vien'}
        />
        <KPICard
          title="Lớp học active"
          value={`${kpis?.activeClasses.withLesson}/${kpis?.activeClasses.count}`}
          subtitle="đang có tiết học"
          icon={BookOpen}
          variant="default"
          onClick={() => window.location.href = '/admin/lop-hoc'}
        />
        <KPICard
          title="Sách quá hạn"
          value={kpis?.libraryBorrows.overdue ?? 0}
          subtitle={`${kpis?.libraryBorrows.today} lượt mượn hôm nay`}
          icon={Library}
          variant={(kpis?.libraryBorrows.overdue ?? 0) > 0 ? 'danger' : 'default'}
          onClick={() => window.location.href = '/admin/thu-vien'}
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Thao tác nhanh</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <div className={cn(
                  'flex flex-col items-center gap-2 rounded-xl p-3 transition-all cursor-pointer',
                  action.color
                )}>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bar chart - Điểm danh 7 ngày */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="mb-4 font-semibold">Điểm danh 7 ngày gần nhất</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceWeek} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val, name) => [val as string, (name === 'present' ? 'Có mặt' : 'Vắng') as string]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="present" name="Có mặt" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent" name="Vắng" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart - Phân bổ sách */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="mb-4 font-semibold">Phân bổ sách theo thể loại</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={bookCategories} dataKey="value" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                  {bookCategories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [String(val) + ' đầu sách', name as string]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {bookCategories.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="flex-1 text-muted-foreground">{cat.name}</span>
                  <span className="font-medium">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 font-semibold">Hoạt động gần đây</h2>
        {notiLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)}
          </div>
        ) : (
          <div className="space-y-1">
            {(notifications ?? []).slice(0, 5).map((n) => (
              <div key={n.id} className={cn(
                'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50',
                !n.read && 'bg-muted/30'
              )}>
                <div className="mt-0.5 shrink-0">
                  {notificationIcons[n.type] ?? <Info className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !n.read && 'font-medium')}>{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(n.createdAt), { locale: vi, addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
