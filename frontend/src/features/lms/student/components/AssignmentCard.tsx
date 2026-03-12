'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AppBadge } from '@/components/base'
import type { StudentAssignment } from '../types/student.types'

interface AssignmentCardProps {
  assignment: StudentAssignment
}

const statusMap = {
  pending: { label: 'Chưa nộp', semantic: 'error' as const },
  submitted: { label: 'Đã nộp', semantic: 'success' as const },
  graded: { label: 'Đã chấm', semantic: 'info' as const },
  late: { label: 'Nộp muộn', semantic: 'warning' as const },
  expired: { label: 'Hết hạn', semantic: 'neutral' as const },
}

function useCountdown(deadline: string) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      const end = new Date(deadline).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('')
        setIsUrgent(false)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours < 24) {
        setTimeLeft(`Còn ${hours} giờ ${minutes} phút`)
        setIsUrgent(true)
      } else {
        setTimeLeft('')
        setIsUrgent(false)
      }
    }

    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [deadline])

  return { timeLeft, isUrgent }
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const st = statusMap[assignment.status]
  const { timeLeft, isUrgent } = useCountdown(assignment.deadline)
  const deadlineDate = new Date(assignment.deadline)
  const deadlineStr = deadlineDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link href={`/my-classes/${assignment.classId}/assignments/${assignment.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="font-medium">{assignment.title}</span>
            </div>
            <AppBadge semantic={st.semantic} size="sm">{st.label}</AppBadge>
          </div>

          <p className="text-sm text-muted-foreground">{assignment.className}</p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Hạn nộp: {deadlineStr}</span>
          </div>

          {timeLeft && (
            <p className={isUrgent ? 'text-sm font-medium text-red-600' : 'text-sm text-muted-foreground'}>
              {timeLeft}
            </p>
          )}

          {assignment.score !== undefined && (
            <p className="text-sm font-medium">
              Điểm: {assignment.score}/{assignment.maxScore}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
