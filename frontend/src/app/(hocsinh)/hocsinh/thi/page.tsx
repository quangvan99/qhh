'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import Link from 'next/link'
import { Calendar, Clock, HelpCircle, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

function formatCountdown(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`
  if (hours > 0) return `Còn ${hours} giờ ${mins} phút`
  return `Còn ${mins} phút`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} · ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const SUBJECT_COLORS: Record<string, string> = {
  'Toán': 'from-blue-400 to-blue-600',
  'Vật lý': 'from-purple-400 to-purple-600',
  'Ngữ văn': 'from-orange-400 to-orange-600',
  'Tiếng Anh': 'from-yellow-400 to-yellow-600',
  'Hóa học': 'from-green-400 to-green-600',
}

const SUBJECT_ICONS: Record<string, string> = {
  'Toán': '📐', 'Vật lý': '🔬', 'Ngữ văn': '📗', 'Tiếng Anh': '🌐', 'Hóa học': '⚗️',
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="flex gap-2">
        {[1, 2].map(i => <div key={i} className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />)}
      </div>
      {Array(3).fill(0).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />)}
    </div>
  )
}

export default function ThiPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['hs', 'exams', 'hs-001'],
    queryFn: () => studentMockApi.getMyExams('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const upcoming = (exams ?? []).filter(e => e.status === 'upcoming')
  const completed = (exams ?? []).filter(e => e.status === 'completed')

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold">Lịch thi</h1>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full rounded-none border-b bg-background h-11 px-4">
          <TabsTrigger value="upcoming" className="flex-1 text-xs data-[state=active]:font-bold gap-1.5">
            Sắp thi
            {upcoming.length > 0 && <Badge variant="outline" className="h-4 px-1 text-[9px]">{upcoming.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 text-xs data-[state=active]:font-bold">
            Đã thi
          </TabsTrigger>
        </TabsList>

        {/* Tab: Sắp thi */}
        <TabsContent value="upcoming" className="px-4 pt-4 space-y-4">
          {upcoming.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-5xl block mb-4">📅</span>
              <p className="text-base font-semibold">Không có kỳ thi sắp tới</p>
              <p className="text-sm text-muted-foreground mt-1">Tất cả kỳ thi đã hoàn thành</p>
            </div>
          ) : upcoming.map(exam => {
            const gradient = SUBJECT_COLORS[exam.subject] ?? 'from-gray-400 to-gray-600'
            const icon = SUBJECT_ICONS[exam.subject] ?? '📝'
            const countdown = formatCountdown(exam.scheduledAt)
            const canEnter = !countdown // no countdown = past time = can enter
            const diff = new Date(exam.scheduledAt).getTime() - Date.now()
            const within15min = diff > 0 && diff < 15 * 60 * 1000

            return (
              <div key={exam.id} className="rounded-2xl bg-card border shadow-sm overflow-hidden">
                <div className={cn('bg-gradient-to-br px-4 py-3 flex items-center gap-3', gradient)}>
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-white font-bold text-base leading-tight">{exam.title}</p>
                    <p className="text-white/80 text-xs">{exam.subject}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{formatDate(exam.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{exam.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{exam.totalQuestions} câu hỏi</span>
                    </div>
                  </div>

                  {/* Countdown */}
                  {countdown && (
                    <div className={cn(
                      'mb-4 p-3 rounded-xl text-center font-bold text-base',
                      within15min ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-muted text-foreground'
                    )}>
                      ⏳ {countdown}
                    </div>
                  )}

                  <Link href={`/hocsinh/thi/${exam.id}`}>
                    <Button
                      className="w-full min-h-[48px]"
                      variant={canEnter || within15min ? 'default' : 'secondary'}
                      disabled={!canEnter && !within15min}
                    >
                      {canEnter ? 'Vào phòng thi →' : within15min ? 'Vào phòng thi (15 phút nữa bắt đầu) →' : `Chưa đến giờ`}
                    </Button>
                  </Link>
                  {!canEnter && !within15min && (
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      Nút sẽ mở 15 phút trước giờ thi
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* Tab: Đã thi */}
        <TabsContent value="completed" className="px-4 pt-4 space-y-3">
          {completed.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">📊</span>
              <p className="text-sm text-muted-foreground">Chưa có kỳ thi nào được hoàn thành</p>
            </div>
          ) : completed.map(exam => {
            const avgScore = (exam as typeof exam & { avgScore?: number }).avgScore
            return (
              <div key={exam.id} className="rounded-2xl bg-card border shadow-sm p-4 flex items-center gap-3">
                <span className="text-2xl shrink-0">{SUBJECT_ICONS[exam.subject] ?? '📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{exam.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(exam.scheduledAt).split('·')[0]}</p>
                </div>
                {avgScore !== undefined && (
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-green-600">{avgScore}</p>
                    <Badge className="bg-green-100 text-green-800 text-[10px] mt-0.5">
                      {avgScore >= 8 ? 'Giỏi' : avgScore >= 6.5 ? 'Khá' : 'TB'}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
