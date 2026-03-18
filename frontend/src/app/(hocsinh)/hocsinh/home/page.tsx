'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import Link from 'next/link'
import { Bell, Clock, BookOpen, ChevronRight, Calendar, AlertCircle, Play, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const DAY_NAMES = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

function formatCountdown(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return { text: 'Quá hạn', urgent: true }
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  if (hours < 1) return { text: `còn ${mins} phút`, urgent: true }
  if (hours < 24) return { text: `còn ${hours}h ${mins}p`, urgent: hours < 2 }
  const days = Math.floor(hours / 24)
  return { text: `còn ${days} ngày`, urgent: false }
}

function formatUpcomingDate(dateStr: string) {
  const d = new Date(dateStr)
  const diff = d.getTime() - Date.now()
  const days = Math.floor(diff / 86400000)
  if (days < 0) return { text: 'Đã qua', color: 'text-muted-foreground' }
  if (days === 0) return { text: 'Hôm nay', color: 'text-red-600' }
  if (days === 1) return { text: 'Ngày mai', color: 'text-orange-500' }
  if (days <= 3) return { text: `${days} ngày nữa`, color: 'text-amber-500' }
  if (days <= 7) return { text: `${days} ngày nữa`, color: 'text-yellow-600' }
  return { text: `${d.getDate()}/${d.getMonth() + 1}`, color: 'text-green-600' }
}

function parseMinutes(time: string): number {
  const parts = time.split(':')
  return (Number(parts[0] ?? 0)) * 60 + Number(parts[1] ?? 0)
}

function getCurrentTimeSlot(schedule: Array<{ time: string }>) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  return schedule.findIndex((item, i) => {
    const start = parseMinutes(item.time)
    const next = schedule[i + 1]
    const end = next ? parseMinutes(next.time) : start + 90
    return currentMinutes >= start && currentMinutes < end
  })
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}

export default function HSHomePage() {
  const { data: agenda, isLoading } = useQuery({
    queryKey: ['hs', 'agenda', 'hs-001'],
    queryFn: () => studentMockApi.getTodayAgenda('hs-001'),
  })

  const { data: subjects } = useQuery({
    queryKey: ['hs', 'subjects', 'hs-001'],
    queryFn: () => studentMockApi.getMySubjects('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const today = new Date()
  const dayName = DAY_NAMES[today.getDay()]
  const dateStr = `${dayName}, ${today.getDate()}/${today.getMonth() + 1}`

  const lastSubject = subjects?.sort((a, b) =>
    new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
  )[0]

  const currentSlotIdx = agenda?.today ? getCurrentTimeSlot(agenda.today) : -1

  const mockNotifications = [
    { id: '1', title: 'GV Bích đã chấm bài Toán', body: 'Điểm: 8.5/10. Xem ngay!', type: 'grade', time: '5 phút trước', read: false },
    { id: '2', title: 'Bài tập Đạo hàm sắp đến hạn', body: 'Còn 2 giờ — Hạn: 17/03 21:00', type: 'deadline', time: '1 giờ trước', read: false },
    { id: '3', title: 'Kỳ thi Toán sau 3 ngày', body: 'Kiểm tra Giữa kỳ 1 — 20/03', type: 'exam', time: 'Hôm qua', read: true },
  ]
  const unreadCount = mockNotifications.filter(n => !n.read).length

  return (
    <div className="mx-auto max-w-lg pb-24">
      {/* Greeting Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Chào Minh! 👋</h1>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>
        <Sheet>
          <SheetTrigger
            render={
              <button className="relative h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" />
            }
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white font-bold">
                {unreadCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">Thông báo</h2>
              <button className="text-xs text-primary font-medium">Đánh dấu tất cả đã đọc</button>
            </div>
            <div className="space-y-3 pb-4">
              {mockNotifications.map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'flex gap-3 p-3 rounded-xl border',
                    !n.read ? 'bg-blue-50 border-blue-200' : 'bg-card border-border'
                  )}
                >
                  <div className={cn(
                    'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                    n.type === 'grade' ? 'bg-green-500' :
                    n.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* SECTION 1 — Cần làm ngay */}
      {agenda?.urgent && agenda.urgent.length > 0 && (
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">🔴 Cần làm ngay</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
            {agenda.urgent.map((item, i) => {
              const countdown = formatCountdown(item.deadline as string)
              return (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[260px] rounded-2xl bg-red-50 border border-red-200 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">BÀI TẬP</Badge>
                  </div>
                  <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{item.subject}</p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Clock className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span className={cn('text-sm font-semibold', countdown.urgent ? 'text-red-600 animate-pulse' : 'text-orange-600')}>
                      {countdown.text}
                    </span>
                  </div>
                  <Link href="/hocsinh/bai-tap">
                    <Button size="sm" variant="destructive" className="w-full min-h-[44px]">
                      Làm ngay →
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* SECTION 2 — Lịch hôm nay */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">📅 Lịch hôm nay</p>
        <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
          {agenda?.today?.map((item, i) => {
            const isActive = i === currentSlotIdx
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 border-b last:border-b-0',
                  isActive ? 'bg-blue-50' : ''
                )}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  isActive ? 'bg-blue-500' :
                  item.subject === 'Toán' ? 'bg-blue-400' :
                  item.subject === 'Vật lý' ? 'bg-purple-400' : 'bg-orange-400'
                )} />
                <span className="text-xs font-mono text-muted-foreground w-10 shrink-0">{item.time}</span>
                <span className={cn('text-sm flex-1 font-medium', isActive && 'text-blue-700')}>{item.title}</span>
                {item.room && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {item.room}
                  </div>
                )}
                {isActive && (
                  <Badge className="bg-blue-500 text-white text-[10px] px-1.5 shrink-0">Đang học</Badge>
                )}
              </div>
            )
          })}
          {(!agenda?.today || agenda.today.length === 0) && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Không có tiết học hôm nay
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 — Tiếp tục học */}
      {lastSubject && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">▶️ Tiếp tục học</p>
          <div className="rounded-2xl bg-card border shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base">{lastSubject.name}</p>
                <p className="text-xs text-muted-foreground">GV: {lastSubject.teacher}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">{lastSubject.progress}%</span>
            </div>
            <Progress value={lastSubject.progress} className="h-2 mb-2" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">
                {lastSubject.completedLessons}/{lastSubject.totalLessons} bài hoàn thành
              </span>
              <span className="text-xs text-muted-foreground">
                Học lúc {new Date(lastSubject.lastAccessed).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <Link href={`/hocsinh/hoc-tap/${lastSubject.id}`}>
              <Button className="w-full min-h-[48px] gap-2">
                <Play className="h-4 w-4" />
                Tiếp tục học
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* SECTION 4 — Sắp tới */}
      {agenda?.upcoming && agenda.upcoming.length > 0 && (
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">📌 Sắp tới</p>
            <Link href="/hocsinh/thi" className="text-xs text-primary flex items-center gap-0.5">
              Xem thêm <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
            {agenda.upcoming.map((item, i) => {
              const dateInfo = formatUpcomingDate((item.date || item.deadline) as string)
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
                  <div className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                    item.type === 'exam' ? 'bg-purple-100' : 'bg-orange-100'
                  )}>
                    {item.type === 'exam'
                      ? <span className="text-base">📝</span>
                      : <span className="text-base">📋</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subject}</p>
                  </div>
                  <span className={cn('text-xs font-semibold shrink-0', dateInfo.color)}>
                    {dateInfo.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Điểm gần đây mini */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">🏆 Điểm gần đây</p>
          <Link href="/hocsinh/ket-qua" className="text-xs text-primary flex items-center gap-0.5">
            Xem tất cả <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { subject: 'Toán', score: 8.5, type: 'BT số 4', color: 'bg-blue-50 border-blue-200', scoreColor: 'text-green-700' },
            { subject: 'Hóa học', score: 9.0, type: 'KT 15 phút', color: 'bg-green-50 border-green-200', scoreColor: 'text-green-700' },
          ].map((item, i) => (
            <Link key={i} href="/hocsinh/ket-qua">
              <div className={cn('rounded-xl border p-3 cursor-pointer hover:shadow-md transition-shadow', item.color)}>
                <p className="text-xs text-muted-foreground">{item.subject}</p>
                <p className={cn('text-2xl font-bold', item.scoreColor)}>{item.score}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.type}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
