'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/composite'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useExamStore } from '../stores/exam.store'
import {
  useGetExamAttempt,
  useStartExamAttempt,
  useSaveExamAnswers,
  useSubmitExam,
} from '../api/student.api'
import { ExamTimer } from './ExamTimer'
import { QuestionNav } from './QuestionNav'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ExamRoomProps {
  sessionId: string
}

export function ExamRoom({ sessionId }: ExamRoomProps) {
  const router = useRouter()
  const store = useExamStore()
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: attempt, isLoading: attemptLoading } = useGetExamAttempt(sessionId)
  const startAttempt = useStartExamAttempt()
  const saveAnswers = useSaveExamAnswers()
  const submitExam = useSubmitExam()

  // Init store from attempt data
  useEffect(() => {
    if (attempt) {
      store.init({
        sessionId,
        questions: attempt.questions,
        answers: attempt.answers,
        timeLeft: attempt.timeLeft,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, sessionId])

  // Timer tick
  useEffect(() => {
    if (!store.sessionId) return
    const id = setInterval(() => store.tick(), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.sessionId])

  // Auto-save every 30s
  useEffect(() => {
    if (!store.sessionId) return
    saveTimer.current = setInterval(() => {
      if (store.isDirty) {
        saveAnswers.mutate(
          { sessionId: store.sessionId, answers: store.answers },
          { onSuccess: () => store.markSaved() }
        )
      }
    }, 30000)
    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.sessionId])

  // Auto-submit on timeout
  useEffect(() => {
    if (store.timeLeft === 0 && store.sessionId) {
      handleAutoSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.timeLeft])

  // Prevent accidental navigation
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  // Anti-cheat: log tab changes
  useEffect(() => {
    const handler = () => {
      // Log to console; in production, POST to server
      console.warn('[Exam] Tab switch detected')
    }
    window.addEventListener('blur', handler)
    return () => window.removeEventListener('blur', handler)
  }, [])

  // Disable right-click
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [])

  const handleAnswerChange = useCallback(
    (questionId: string, answer: string | string[]) => {
      store.setAnswer(questionId, answer)

      // Debounced save
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        saveAnswers.mutate(
          { sessionId: store.sessionId, answers: { ...store.answers, [questionId]: answer } },
          { onSuccess: () => store.markSaved() }
        )
      }, 1000)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.sessionId]
  )

  const handleAutoSubmit = async () => {
    // Save first
    try {
      await saveAnswers.mutateAsync({ sessionId: store.sessionId, answers: store.answers })
    } catch { /* best effort */ }
    await submitExam.mutateAsync(store.sessionId)
    store.reset()
    router.push(`/my-exams/result/${sessionId}`)
  }

  const handleSubmit = async () => {
    try {
      await saveAnswers.mutateAsync({ sessionId: store.sessionId, answers: store.answers })
    } catch { /* best effort */ }
    await submitExam.mutateAsync(store.sessionId)
    store.reset()
    router.push(`/my-exams/result/${sessionId}`)
  }

  // Start attempt if none exists
  if (attemptLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Sẵn sàng bắt đầu thi?</h2>
        <p className="text-muted-foreground">Nhấn bắt đầu để vào phòng thi</p>
        <Button
          onClick={() => startAttempt.mutate(sessionId)}
          disabled={startAttempt.isPending}
          className="cursor-pointer"
        >
          {startAttempt.isPending ? 'Đang tải...' : 'Bắt đầu thi'}
        </Button>
      </div>
    )
  }

  const currentQ = store.questions[store.currentQuestion]
  if (!currentQ) return null

  const unansweredCount = store.questions.filter((q) => !store.answers[q.id]).length

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Fixed header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
        <h1 className="text-sm font-semibold truncate max-w-[40%]">
          {attempt.questions.length > 0 ? 'Phòng thi' : ''}
        </h1>
        <ExamTimer timeLeft={store.timeLeft} />
        <div className="flex items-center gap-2">
          {store.lastSavedAt && (
            <span className="text-xs text-muted-foreground">Đã lưu {store.lastSavedAt}</span>
          )}
          <Button
            size="sm"
            onClick={() => setShowSubmitDialog(true)}
            className="cursor-pointer"
          >
            Nộp bài
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Câu {store.currentQuestion + 1}/{store.questions.length}
                </h2>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={store.markedQuestions.has(store.currentQuestion)}
                    onCheckedChange={() => store.toggleMark(store.currentQuestion)}
                  />
                  Đánh dấu xem lại
                </label>
              </div>

              {/* Question content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentQ.content }}
              />
              {currentQ.imageUrl && (
                <img src={currentQ.imageUrl} alt="" className="max-h-64 rounded-lg" />
              )}

              {/* Answer section */}
              <div className="space-y-3">
                {(currentQ.type === 'single_choice' || currentQ.type === 'true_false') && currentQ.options && (
                  <RadioGroup
                    value={(store.answers[currentQ.id] as string | undefined) ?? ''}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                  >
                    {currentQ.options.map((opt) => (
                      <div key={opt.key} className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={opt.key} id={`opt-${opt.key}`} />
                        <Label htmlFor={`opt-${opt.key}`} className="flex-1 cursor-pointer">
                          <span className="font-medium mr-2">{opt.key}.</span>
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQ.type === 'multiple_choice' && currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map((opt) => {
                      const currentAnswers = (store.answers[currentQ.id] as string[] | undefined) ?? []
                      const isChecked = currentAnswers.includes(opt.key)
                      return (
                        <div key={opt.key} className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newAnswers = checked
                                ? [...currentAnswers, opt.key]
                                : currentAnswers.filter((a) => a !== opt.key)
                              handleAnswerChange(currentQ.id, newAnswers)
                            }}
                          />
                          <Label className="flex-1 cursor-pointer">
                            <span className="font-medium mr-2">{opt.key}.</span>
                            {opt.label}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                )}

                {currentQ.type === 'essay' && (
                  <Textarea
                    value={(store.answers[currentQ.id] as string | undefined) ?? ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    rows={8}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => store.setCurrentQuestion(Math.max(0, store.currentQuestion - 1))}
                  disabled={store.currentQuestion === 0}
                  className="cursor-pointer"
                >
                  ← Câu trước
                </Button>
                <Button
                  variant="outline"
                  onClick={() => store.setCurrentQuestion(Math.min(store.questions.length - 1, store.currentQuestion + 1))}
                  disabled={store.currentQuestion === store.questions.length - 1}
                  className="cursor-pointer"
                >
                  Câu tiếp →
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Sidebar - Question navigator */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l bg-card p-4">
          <QuestionNav
            questions={store.questions}
            answers={store.answers}
            currentQuestion={store.currentQuestion}
            markedQuestions={store.markedQuestions}
            onSelect={(i) => store.setCurrentQuestion(i)}
          />
        </aside>
      </div>

      <ConfirmDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        title="Xác nhận nộp bài"
        description={
          unansweredCount > 0
            ? `Bạn có ${unansweredCount} câu chưa trả lời. Xác nhận nộp bài?`
            : 'Bạn đã trả lời tất cả câu hỏi. Xác nhận nộp bài?'
        }
        onConfirm={handleSubmit}
        confirmLabel="Nộp bài"
        loading={submitExam.isPending}
        variant="warning"
      />
    </div>
  )
}
