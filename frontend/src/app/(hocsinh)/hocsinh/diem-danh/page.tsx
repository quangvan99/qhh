'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type AttendanceStatus = 'present' | 'absent' | 'late' | null

function getStatusConfig(status: AttendanceStatus) {
  switch (status) {
    case 'present': return { label: 'Có mặt', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' }
    case 'absent': return { label: 'Vắng', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' }
    case 'late': return { label: 'Muộn', color: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' }
    default: return { label: '', color: 'bg-muted', text: 'text-muted-foreground', bg: '' }
  }
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
    </div>
  )
}

export default function DiemDanhPage() {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportDate, setReportDate] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('Đến học nhưng chưa điểm danh')
  const [reportNote, setReportNote] = useState('')

  const { data: history, isLoading } = useQuery({
    queryKey: ['hs', 'attendance', 'hs-001'],
    queryFn: () => studentMockApi.getAttendanceHistory('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const attendanceMap: Record<string, { status: AttendanceStatus; checkIn: string | null; checkOut: string | null }> = {}
  ;(history ?? []).forEach(h => {
    if (h && h.date) {
      attendanceMap[h.date] = { status: (h.status as AttendanceStatus), checkIn: h.checkIn ?? null, checkOut: (h as any).checkOut ?? null }
    }
  })

  // Calendar logic
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startPad = firstDay === 0 ? 6 : firstDay - 1 // Mon-start

  // Stats
  const monthDays = Object.entries(attendanceMap).filter(([d]) => {
    const date = new Date(d)
    return date.getMonth() === viewMonth && date.getFullYear() === viewYear
  })
  const presentCount = monthDays.filter(([, v]) => v.status === 'present').length
  const absentCount = monthDays.filter(([, v]) => v.status === 'absent').length
  const lateCount = monthDays.filter(([, v]) => v.status === 'late').length
  const workdays = monthDays.length

  // Today's status
  const todayStr = (today.toISOString().split('T')[0]) ?? ''
  const todayRecord = todayStr ? attendanceMap[todayStr] : undefined
  const isCheckedIn = todayRecord?.status === 'present' || todayRecord?.status === 'late'

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold">Điểm danh</h1>
      </div>

      {/* Today status */}
      <div className="px-4 pt-4 mb-4">
        {isCheckedIn ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Đã điểm danh hôm nay</p>
              {todayRecord?.checkIn && (
                <p className="text-sm text-green-700">Vào lúc {todayRecord.checkIn}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-500 shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Chưa điểm danh hôm nay</p>
              <p className="text-sm text-red-700">
                {today.getHours() >= 8 ? 'Đã qua 8:00 sáng' : 'Sẽ điểm danh khi đến trường'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-card border shadow-sm p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="font-semibold text-sm">
              Tháng {viewMonth + 1}/{viewYear}
            </p>
            <button onClick={nextMonth} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Padding */}
            {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
            {/* Days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const record = attendanceMap[dateStr]
              const isToday = dateStr === todayStr
              const isWeekend = (() => {
                const d = new Date(dateStr).getDay()
                return d === 0 || d === 6
              })()

              const cfg = getStatusConfig(record?.status ?? null)

              return (
                <button
                  key={day}
                  className={cn(
                    'relative aspect-square rounded-lg flex items-center justify-center transition-colors',
                    isToday ? 'ring-2 ring-primary ring-offset-1' : '',
                    isWeekend ? 'opacity-40' : '',
                    record?.status === 'present' ? 'bg-green-100' :
                    record?.status === 'absent' ? 'bg-red-100' :
                    record?.status === 'late' ? 'bg-amber-100' : 'bg-transparent',
                    'hover:bg-muted/50'
                  )}
                  onClick={() => {
                    if (record) setHoveredDate(hoveredDate === dateStr ? null : dateStr)
                  }}
                >
                  <span className={cn(
                    'text-xs font-medium',
                    isToday ? 'text-primary font-bold' : isWeekend ? 'text-muted-foreground' : 'text-foreground',
                    record?.status === 'absent' && 'text-red-700',
                  )}>
                    {day}
                  </span>
                  {record && (
                    <div className={cn('absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full', cfg.color)} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Hover popover */}
          {hoveredDate && attendanceMap[hoveredDate] && (
            <div className="mt-3 p-3 rounded-xl bg-muted/60 border">
              <p className="text-xs font-semibold mb-1">
                {new Date(hoveredDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
              </p>
              {attendanceMap[hoveredDate].checkIn ? (
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">Vào: <strong>{attendanceMap[hoveredDate].checkIn}</strong></span>
                  <span className="text-muted-foreground">Ra: <strong>{attendanceMap[hoveredDate].checkOut}</strong></span>
                </div>
              ) : (
                <p className="text-xs text-red-600">Vắng mặt</p>
              )}
              {attendanceMap[hoveredDate].status === 'absent' && (
                <Sheet open={reportOpen} onOpenChange={setReportOpen}>
                  <SheetTrigger
                    render={<button className="mt-2 text-xs text-primary underline" />}
                    onClick={() => setReportDate(hoveredDate)}
                  >
                    📢 Báo sai sót
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl">
                    <h3 className="font-bold text-base mb-4">Báo sai sót điểm danh</h3>
                    {reportDate && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Ngày: {new Date(reportDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                    <div className="space-y-3 mb-4">
                      {['Đến học nhưng chưa điểm danh', 'Camera lỗi hoặc không nhận diện', 'Lý do khác'].map(r => (
                        <label key={r} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-muted/30">
                          <input
                            type="radio"
                            name="reason"
                            value={r}
                            checked={reportReason === r}
                            onChange={() => setReportReason(r)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{r}</span>
                        </label>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Ghi chú thêm (tùy chọn)..."
                      className="mb-4 resize-none text-sm"
                      rows={3}
                      value={reportNote}
                      onChange={e => setReportNote(e.target.value)}
                    />
                    <Button
                      className="w-full min-h-[48px] gap-2"
                      onClick={() => {
                        toast.success('Đã gửi báo cáo! Nhà trường sẽ xem xét trong 24h.')
                        setReportOpen(false)
                        setReportNote('')
                      }}
                    >
                      <Send className="h-4 w-4" /> Gửi báo cáo
                    </Button>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t">
            {[
              { color: 'bg-green-400', label: 'Có mặt' },
              { color: 'bg-red-400', label: 'Vắng' },
              { color: 'bg-amber-400', label: 'Muộn' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Tổng kết tháng {viewMonth + 1}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Có mặt', value: presentCount, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
            { label: 'Vắng', value: absentCount, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
            { label: 'Muộn', value: lateCount, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
          ].map(stat => (
            <div key={stat.label} className={cn('rounded-xl border p-3 text-center', stat.bg)}>
              <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        {workdays > 0 && (
          <div className="rounded-xl bg-card border p-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Tỷ lệ chuyên cần</span>
              <span className="font-bold">{Math.round((presentCount / workdays) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${(presentCount / workdays) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{presentCount}/{workdays} ngày</p>
          </div>
        )}
      </div>
    </div>
  )
}
