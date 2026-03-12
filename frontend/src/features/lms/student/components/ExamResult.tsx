'use client'

import Link from 'next/link'
import { Check, X, Minus, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppBadge } from '@/components/base'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useGetExamResult } from '../api/student.api'
import type { ExamResultQuestion, ExamResultOption } from '../types/student.types'

interface ExamResultProps {
  sessionId: string
}

export function ExamResult({ sessionId }: ExamResultProps) {
  const { data: result, isLoading } = useGetExamResult(sessionId)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <Skeleton className="mx-auto h-32 w-32 rounded-full" />
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-32" />
      </div>
    )
  }

  if (!result) return null

  const passed = result.score >= result.totalScore * 0.5 // generic pass threshold
  const scoreColor = result.score >= result.totalScore * 0.8
    ? 'text-emerald-600'
    : result.score >= result.totalScore * 0.5
    ? 'text-amber-600'
    : 'text-red-600'

  const timeTakenMin = Math.floor(result.timeTaken / 60)
  const timeTakenSec = result.timeTaken % 60

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      {/* Score card */}
      <Card className="text-center">
        <CardContent className="py-8 space-y-4">
          <div className={cn('text-6xl font-bold', scoreColor)}>
            {result.score}/{result.totalScore}
          </div>
          <AppBadge semantic={passed ? 'success' : 'error'} size="lg">
            {passed ? 'Đạt' : 'Không đạt'}
          </AppBadge>
          <div className="grid grid-cols-3 gap-4 pt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Đúng</p>
              <p className="text-lg font-semibold">{result.correctCount}/{result.totalQuestions} câu</p>
            </div>
            <div>
              <p className="text-muted-foreground">Thời gian</p>
              <p className="text-lg font-semibold">{timeTakenMin}:{String(timeTakenSec).padStart(2, '0')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Xếp hạng</p>
              <p className="text-lg font-semibold flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                {result.rank ?? '-'}/{result.totalParticipants ?? '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail questions */}
      {result.showDetail && result.questions && result.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết từng câu</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion>
              {result.questions.map((q: ExamResultQuestion) => (
                <AccordionItem key={q.id} value={q.id}>
                  <AccordionTrigger className="px-2">
                    <span className="flex items-center gap-2">
                      {q.isCorrect ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : q.userAnswer ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">
                        Câu {q.index + 1}
                        {q.isCorrect ? ' — Đúng' : q.userAnswer ? ' — Sai' : ' — Bỏ qua'}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 space-y-2">
                    <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: q.content }} />
                    {q.options && (
                      <ul className="space-y-1">
                        {q.options.map((opt: ExamResultOption) => {
                          const isCorrectOpt = Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.includes(opt.key)
                            : q.correctAnswer === opt.key
                          const isUserOpt = Array.isArray(q.userAnswer)
                            ? q.userAnswer.includes(opt.key)
                            : q.userAnswer === opt.key

                          return (
                            <li
                              key={opt.key}
                              className={cn(
                                'rounded-md border p-2 text-sm',
                                isCorrectOpt && 'border-emerald-300 bg-emerald-50',
                                isUserOpt && !isCorrectOpt && 'border-red-300 bg-red-50'
                              )}
                            >
                              <span className="font-medium mr-1">{opt.key}.</span>
                              {opt.label}
                              {isCorrectOpt && <span className="ml-2 text-xs text-emerald-600">✓ Đáp án đúng</span>}
                              {isUserOpt && !isCorrectOpt && <span className="ml-2 text-xs text-red-600">✗ Đáp án của bạn</span>}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {q.explanation && (
                      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Link href="/my-exams">
          <Button variant="outline" className="cursor-pointer">Về trang kỳ thi</Button>
        </Link>
      </div>
    </div>
  )
}
