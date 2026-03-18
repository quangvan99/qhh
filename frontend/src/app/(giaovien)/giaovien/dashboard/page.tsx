'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherMockApi } from '@/lib/mock'
import { mockClasses } from '@/lib/mock/data'
import { useClassStore } from '@/stores/class.store'
import { ClassSwitcher, ProgressRing } from '@/components/shared'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  CheckCircle2,
  BookOpen,
  PenLine,
  AlertCircle,
  ArrowRight,
  Calendar,
  GraduationCap,
  ClipboardList,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const MY_TEACHER_ID = 'gv-001'

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-48" />
    </div>
  )
}

type ScheduleItem = {
  id: string
  classId: string
  className: string
  subject: string
  startTime: string
  endTime: string
  room: string
  type: string
}

function getScheduleStatus(startTime: string, endTime: string) {
  const now = new Date()
  const parts1 = startTime.split(':').map(Number)
  const parts2 = endTime.split(':').map(Number)
  const sh = parts1[0] ?? 0, sm = parts1[1] ?? 0
  const eh = parts2[0] ?? 0, em = parts2[1] ?? 0
  const start = new Date(now)
  start.setHours(sh, sm, 0, 0)
  const end = new Date(now)
  end.setHours(eh, em, 0, 0)

  if (now > end) return 'past'
  if (now >= start && now <= end) return 'active'
  const diff = start.getTime() - now.getTime()
  if (diff <= 30 * 60 * 1000) return 'soon'
  return 'upcoming'
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
  const status = getScheduleStatus(item.startTime, item.endTime)

  const statusConfig = {
    past: { label: 'Đã qua', color: 'text-muted-foreground', borderColor: 'border-l-gray-300', bg: 'opacity-60' },
    active: { label: 'Đang dạy', color: 'text-green-600', borderColor: 'border-l-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
    soon: { label: 'Sắp đến', color: 'text-orange-600', borderColor: 'border-l-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
    upcoming: { label: 'Sắp tới', color: 'text-muted-foreground', borderColor: 'border-l-gray-200', bg: '' },
  }

  const cfg = statusConfig[status]

  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg border-l-4 border border-l', cfg.borderColor, cfg.bg, cfg.bg === 'opacity-60' ? 'opacity-60' : '')}>
      <div className="shrink-0 text-center min-w-[52px]">
        <p className="text-xs font-bold">{item.startTime}</p>
        <p className="text-xs text-muted-foreground">{item.endTime}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{item.className}</span>
          <span className="text-muted-foreground text-xs">—</span>
          <span className="text-sm">{item.subject}</span>
          <Badge variant="outline" className="text-[10px] h-4">{item.room}</Badge>
          {status === 'active' && (
            <Badge className="bg-green-500 text-white text-[10px] h-4 animate-pulse">● Đang dạy</Badge>
          )}
          {status === 'soon' && (
            <Badge className="bg-orange-500 text-white text-[10px] h-4">Sắp đến</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {status === 'active' && (
            <Link href="/giaovien/diem-danh" className={cn(buttonVariants({ size: 'sm' }), 'h-6 text-xs px-2')}>Điểm danh</Link>
          )}
          {status === 'soon' && (
            <Link href="/giaovien/noi-dung" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-6 text-xs px-2')}>Xem trước nội dung</Link>
          )}
          {status === 'past' && (
            <Link href="/giaovien/diem-danh" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-6 text-xs px-2')}>Xem điểm danh</Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Các lớp của giáo viên gv-001
const MY_CLASSES = mockClasses
  .filter(c => ['lop-10a1', 'lop-12a1', 'lop-11a2'].includes(c.id))
  .map(c => ({ id: c.id, name: c.name, subject: c.subject, studentCount: c.studentCount }))

export default function GVDashboardPage() {
  const { currentClassId, setCurrentClass } = useClassStore()
  const queryClient = useQueryClient()

  const { data: schedule, isLoading: loadingSchedule } = useQuery({
    queryKey: ['gv', 'schedule', MY_TEACHER_ID],
    queryFn: () => teacherMockApi.getTodaySchedule(MY_TEACHER_ID),
  })

  const { data: pendingAttendance, isLoading: loadingAttendance } = useQuery({
    queryKey: ['gv', 'pending-attendance', currentClassId ?? 'all'],
    queryFn: () => teacherMockApi.getPendingAttendance(currentClassId ?? 'lop-10a1'),
  })

  const { data: pendingGrading, isLoading: loadingGrading } = useQuery({
    queryKey: ['gv', 'pending-grading', MY_TEACHER_ID],
    queryFn: () => teacherMockApi.getPendingGrading(MY_TEACHER_ID),
  })

  const confirmMutation = useMutation({
    mutationFn: (ids: string[]) => teacherMockApi.confirmAttendance(ids),
    onSuccess: (data) => {
      toast.success(`Đã xác nhận ${data.confirmed} học sinh điểm danh`)
      queryClient.invalidateQueries({ queryKey: ['gv', 'pending-attendance'] })
    },
  })

  const pendingCount = pendingAttendance?.length ?? 0
  const gradingCount = pendingGrading?.length ?? 0
  const todaySchedule = schedule ?? []

  // Quick stats
  const totalStudents = 114 // 38+39+37 — 3 lớp giảng dạy
  const activeAssignments = 3
  const examsThisMonth = 2

  const today = new Date()
  const dateStr = today.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Xin chào, Nguyễn Thị Bích 👋</h1>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>
        <ClassSwitcher
          classes={MY_CLASSES}
          currentClassId={currentClassId ?? MY_CLASSES[0]?.id ?? null}
          onChange={setCurrentClass}
        />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-blue-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold">{totalStudents}</p>
            <p className="text-xs text-muted-foreground">Học sinh đang dạy</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3">
          <PenLine className="h-8 w-8 text-orange-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold">{activeAssignments}</p>
            <p className="text-xs text-muted-foreground">Bài tập đang mở</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-purple-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold">{examsThisMonth}</p>
            <p className="text-xs text-muted-foreground">Kỳ thi tháng này</p>
          </div>
        </div>
      </div>

      {/* ZONE ĐỎ — CẦN LÀM NGAY */}
      {(pendingCount > 0 || gradingCount > 0) && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <h2 className="font-semibold text-red-700 dark:text-red-400 text-sm uppercase tracking-wide">
              🔴 Cần làm ngay
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Điểm danh */}
            {loadingAttendance ? (
              <SkeletonCard />
            ) : pendingCount > 0 ? (
              <div className="rounded-lg border border-red-200 bg-white dark:bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">Điểm danh chờ xác nhận</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-red-500 text-white">{pendingCount} HS</Badge>
                      <span className="text-xs text-muted-foreground">độ tin cậy thấp</span>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-red-400 shrink-0" />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 h-8"
                    onClick={() => {
                      const ids = pendingAttendance?.map(a => a.id) ?? []
                      confirmMutation.mutate(ids)
                    }}
                    disabled={confirmMutation.isPending}
                  >
                    {confirmMutation.isPending ? 'Đang xác nhận...' : `Xác nhận tất cả (${pendingCount})`}
                  </Button>
                  <Link href="/giaovien/diem-danh" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8')}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Bài chấm */}
            {loadingGrading ? (
              <SkeletonCard />
            ) : gradingCount > 0 ? (
              <div className="rounded-lg border border-orange-200 bg-white dark:bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">Bài nộp chưa chấm</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-orange-500 text-white">{gradingCount} bài</Badge>
                    </div>
                  </div>
                  <PenLine className="h-5 w-5 text-orange-400 shrink-0" />
                </div>
                <div className="mt-3 space-y-1">
                  {pendingGrading?.slice(0, 2).map(a => (
                    <div key={a.id} className="text-xs text-muted-foreground flex justify-between">
                      <span className="truncate mr-2">{a.title}</span>
                      <span className="shrink-0">{a.submittedCount}/{a.totalStudents} nộp</span>
                    </div>
                  ))}
                </div>
                <Link href="/giaovien/bai-tap" className={cn(buttonVariants({ size: 'sm' }), 'w-full h-8 mt-3 justify-center')}>
                    Chấm bài ngay <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ZONE VÀNG — LỊCH HÔM NAY */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-600" />
            <h2 className="font-semibold text-sm">🟡 Lịch dạy hôm nay</h2>
          </div>
          <Badge variant="outline" className="text-xs">{todaySchedule.length} tiết</Badge>
        </div>
        <div className="p-4 space-y-2">
          {loadingSchedule ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : todaySchedule.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-sm font-medium">Hôm nay bạn không có tiết dạy</p>
              <p className="text-xs text-muted-foreground mt-1">Tiết gần nhất: Thứ 2, 18/03 — Tiết 1 — 10A1</p>
            </div>
          ) : (
            todaySchedule.map(item => <ScheduleCard key={item.id} item={item} />)
          )}
        </div>
      </div>

      {/* ZONE XANH — TUẦN NÀY */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card">
          <div className="flex items-center gap-2 p-4 border-b">
            <PenLine className="h-4 w-4 text-green-600" />
            <h2 className="font-semibold text-sm">🟢 Bài tập sắp hết hạn</h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { title: 'Bài tập Đạo hàm - Chương 1', class: '12A1', due: '19/03', remaining: 8 },
              { title: 'Phân tích tác phẩm Truyện Kiều', class: '12A2', due: '18/03', remaining: 0 },
              { title: 'Bài tập Điện xoay chiều', class: '11A1', due: '20/03', remaining: 5 },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Lớp {item.class} · Hạn {item.due}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  {item.remaining} chưa nộp
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="flex items-center gap-2 p-4 border-b">
            <ClipboardList className="h-4 w-4 text-green-600" />
            <h2 className="font-semibold text-sm">🟢 Kỳ thi sắp tới</h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { title: 'Kiểm tra Giữa kỳ 1 - Toán 12', class: '12A1', date: '20/03', time: '90 phút' },
              { title: 'Kiểm tra 1 tiết - Hóa học 11', class: '11A1', date: '24/03', time: '45 phút' },
              { title: 'Kiểm tra Cuối kỳ - Ngữ văn 12', class: '12A2', date: '31/03', time: '120 phút' },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Lớp {item.class} · {item.date} · {item.time}</p>
                </div>
                <Link href="/giaovien/thi" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-6 text-xs px-2 shrink-0')}>Xem</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tiến độ khóa học */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center gap-2 p-4 border-b">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <h2 className="font-semibold text-sm">Tiến độ khóa học</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-around gap-6 flex-wrap">
            {[
              { class: '10A1', subject: 'Toán', progress: 78, done: 21, total: 24 },
              { class: '12A1', subject: 'Toán', progress: 45, done: 11, total: 24 },
              { class: '11A2', subject: 'Toán', progress: 92, done: 22, total: 24 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <ProgressRing
                  value={item.progress}
                  size={80}
                  strokeWidth={6}
                  color={item.progress >= 80 ? '#22c55e' : item.progress >= 50 ? '#3b82f6' : '#f97316'}
                  label={`Lớp ${item.class}`}
                  sublabel={`${item.done}/${item.total} bài`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
