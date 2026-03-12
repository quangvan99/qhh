'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ExamTimerProps {
  timeLeft: number
}

export function ExamTimer({ timeLeft }: ExamTimerProps) {
  const [warned, setWarned] = useState(false)

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const isWarning = timeLeft <= 300 && timeLeft > 0 // 5 minutes
  const isCritical = timeLeft <= 60 && timeLeft > 0

  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0 && !warned) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWarned(true)
      toast.warning('Còn 5 phút!', {
        description: 'Bài thi sẽ tự động nộp khi hết giờ.',
      })
    }
  }, [timeLeft, warned])

  const display = hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div
      className={cn(
        'rounded-lg px-4 py-1.5 font-mono text-lg font-bold tabular-nums transition-colors',
        isCritical
          ? 'bg-red-100 text-red-700 animate-pulse'
          : isWarning
          ? 'bg-amber-100 text-amber-700'
          : 'bg-muted text-foreground'
      )}
    >
      {display}
    </div>
  )
}
