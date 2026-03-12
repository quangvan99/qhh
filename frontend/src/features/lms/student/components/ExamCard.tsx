'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppBadge } from '@/components/base'
import type { StudentExamSession } from '../types/student.types'

interface ExamCardProps {
  exam: StudentExamSession
}

const statusMap = {
  upcoming: { label: 'Sắp diễn ra', semantic: 'info' as const },
  ongoing: { label: 'Đang thi', semantic: 'warning' as const },
  completed: { label: 'Đã kết thúc', semantic: 'neutral' as const },
  missed: { label: 'Bỏ lỡ', semantic: 'error' as const },
}

function useExamCountdown(startTime: string) {
  const [text, setText] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = new Date(startTime).getTime() - Date.now()
      if (diff <= 0 || diff > 30 * 60 * 1000) {
        setText('')
        return
      }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setText(`${m}:${String(s).padStart(2, '0')}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startTime])

  return text
}

export function ExamCard({ exam }: ExamCardProps) {
  const st = statusMap[exam.status]
  const countdown = useExamCountdown(exam.startTime)
  const startDate = new Date(exam.startTime)

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{exam.examTitle}</h3>
          <AppBadge semantic={st.semantic} size="sm">{st.label}</AppBadge>
        </div>

        <AppBadge semantic="neutral" size="sm">{exam.subject}</AppBadge>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{startDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} — {exam.duration} phút</span>
          </div>
          {exam.room && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{exam.room}</span>
            </div>
          )}
        </div>

        {countdown && (
          <p className="text-sm font-medium text-amber-600">
            Bắt đầu sau: {countdown}
          </p>
        )}

        {exam.score !== undefined && exam.status === 'completed' && (
          <p className="text-sm font-medium">
            Điểm: {exam.score}/{exam.passingScore} (tối thiểu)
            {exam.rank && ` — Xếp hạng: ${exam.rank}/${exam.totalParticipants}`}
          </p>
        )}

        <div className="flex gap-2">
          {exam.status === 'upcoming' && !exam.registered && (
            <Link href={`/my-exams/register/${exam.id}`}>
              <Button size="sm" className="cursor-pointer">Đăng ký thi</Button>
            </Link>
          )}
          {exam.status === 'upcoming' && exam.registered && (
            <Button size="sm" variant="outline" disabled className="cursor-pointer">Đã đăng ký ✓</Button>
          )}
          {exam.status === 'ongoing' && (
            <Link href={`/my-exams/room/${exam.id}`}>
              <Button size="sm" className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white">
                Vào phòng thi
              </Button>
            </Link>
          )}
          {exam.status === 'completed' && exam.score !== undefined && (
            <Link href={`/my-exams/result/${exam.id}`}>
              <Button size="sm" variant="outline" className="cursor-pointer">Xem kết quả</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
