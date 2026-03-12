'use client'

import { cn } from '@/lib/utils'
import type { ExamQuestion } from '../types/student.types'

interface QuestionNavProps {
  questions: ExamQuestion[]
  answers: Record<string, string | string[]>
  currentQuestion: number
  markedQuestions: Set<number>
  onSelect: (index: number) => void
}

export function QuestionNav({
  questions,
  answers,
  currentQuestion,
  markedQuestions,
  onSelect,
}: QuestionNavProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Danh sách câu hỏi</h3>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const hasAnswer = !!answers[q.id]
          const isMarked = markedQuestions.has(i)
          const isCurrent = i === currentQuestion

          return (
            <button
              key={q.id}
              onClick={() => onSelect(i)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer',
                hasAnswer
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                isMarked && 'bg-amber-100 text-amber-700 hover:bg-amber-200',
                isCurrent && 'ring-2 ring-red-500'
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-100" />
          <span>Đã trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-gray-100" />
          <span>Chưa trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-amber-100" />
          <span>Đánh dấu xem lại</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded ring-2 ring-red-500" />
          <span>Câu hiện tại</span>
        </div>
      </div>
    </div>
  )
}
