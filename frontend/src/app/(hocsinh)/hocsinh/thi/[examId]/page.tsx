'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useExamStore } from '@/stores/exam.store'
import { mockExams } from '@/lib/mock'
import { ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// ─── Mock exam questions ───────────────────────────────────────────
interface Question {
  id: string
  number: number
  text: string
  options: string[]
  correctAnswer: string
}

const QUESTION_POOL: Array<{ text: string; options: string[]; correctIdx: number }> = [
  { text: 'Cho phương trình bậc hai x² - 5x + m = 0 có hai nghiệm phân biệt. Điều kiện của m là:', options: ['m < 25/4', 'm > 25/4', 'm ≤ 25/4', 'm ≥ 0'], correctIdx: 0 },
  { text: 'Đạo hàm của hàm số f(x) = x³ - 3x² + 2x tại x = 1 bằng:', options: ["f'(1) = 2", "f'(1) = 1", "f'(1) = -1", "f'(1) = 0"], correctIdx: 3 },
  { text: 'Hàm số y = x² - 4x + 3 có giá trị nhỏ nhất bằng:', options: ['-1', '0', '1', '3'], correctIdx: 0 },
  { text: 'Tổng tất cả các nghiệm thực của phương trình x⁴ - 5x² + 4 = 0 là:', options: ['0', '2', '4', '6'], correctIdx: 0 },
  { text: 'Giới hạn lim(x→2) (x² - 4)/(x - 2) bằng:', options: ['2', '4', '0', '1'], correctIdx: 1 },
  { text: 'Số nghiệm thực của phương trình sin(x) = 0.5 trong [0, 2π] là:', options: ['1', '2', '3', '4'], correctIdx: 1 },
  { text: 'Vector nào sau đây vuông góc với vector a = (1, 2, 3)?', options: ['(3, -1, 1)', '(2, 2, 2)', '(0, 0, 0)', '(1, 1, 1)'], correctIdx: 0 },
  { text: 'Diện tích hình phẳng giới hạn bởi y = x² và y = x bằng:', options: ['1/6', '1/3', '1/2', '1'], correctIdx: 0 },
  { text: 'Tích phân ∫(0→1) x² dx bằng:', options: ['1/3', '1/2', '2/3', '1'], correctIdx: 0 },
  { text: 'Số cách sắp xếp 4 học sinh trong hàng ngang là:', options: ['12', '16', '24', '48'], correctIdx: 2 },
]

function generateQuestions(_examId: string, total: number): Question[] {
  return Array.from({ length: total }, (_, i) => {
    const poolItem = QUESTION_POOL[i % QUESTION_POOL.length]
    if (!poolItem) return { id: `q-${i + 1}`, number: i + 1, text: `Câu hỏi ${i + 1}`, options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' }
    return {
      id: `q-${i + 1}`,
      number: i + 1,
      text: poolItem.text,
      options: poolItem.options,
      correctAnswer: String.fromCharCode(65 + poolItem.correctIdx),
    }
  })
}

// ─── Timer display ────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function TimerDisplay({ seconds }: { seconds: number }) {
  const color = seconds < 300 ? 'text-red-500' : seconds < 600 ? 'text-orange-500' : seconds < 1800 ? 'text-yellow-600' : 'text-foreground'
  return (
    <span className={cn('font-mono font-bold text-base tabular-nums', color, seconds < 300 && 'animate-pulse')}>
      ⏱ {formatTime(seconds)}
    </span>
  )
}

// ─── Screens ────────────────────────────────────────────────────
function WaitingScreen({ exam, onStart }: { exam: NonNullable<typeof mockExams[0]>; onStart: () => void }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-background">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-primary-foreground font-black text-xl">QH</span>
          </div>
          <h1 className="text-xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{exam.subject}</p>
        </div>

        {/* Exam info */}
        <div className="rounded-2xl bg-card border p-4 mb-4 space-y-3">
          <h2 className="font-semibold text-sm uppercase text-muted-foreground tracking-wide">Thông tin kỳ thi</h2>
          {[
            { label: 'Số câu hỏi', value: `${exam.totalQuestions} câu trắc nghiệm` },
            { label: 'Thời gian', value: `${exam.duration} phút` },
            { label: 'Môn học', value: exam.subject },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 mb-6">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Quy định</p>
          <ul className="space-y-1.5 text-sm text-amber-800">
            <li>• Không được rời khỏi ứng dụng khi đang thi</li>
            <li>• Không dùng tài liệu bên ngoài</li>
            <li>• Nộp bài trước khi hết giờ</li>
          </ul>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="h-5 w-5 rounded border-2"
          />
          <span className="text-sm">Tôi đã đọc và đồng ý với quy định thi</span>
        </label>

        <Button
          className="w-full min-h-[56px] text-base font-bold"
          disabled={!agreed}
          onClick={onStart}
        >
          Bắt đầu làm bài →
        </Button>
      </div>
    </div>
  )
}

function ResultScreen({ exam, questions, answers, onReview }: {
  exam: NonNullable<typeof mockExams[0]>
  questions: ReturnType<typeof generateQuestions>
  answers: Record<string, string>
  onReview: () => void
}) {
  const router = useRouter()
  const [showAnswers, setShowAnswers] = useState(false)
  const [countUp, setCountUp] = useState(0)

  const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length
  const total = questions.length
  const scoreRaw = (correct / total) * 10
  const score = Math.round(scoreRaw * 10) / 10

  const grade = score >= 9 ? 'Xuất sắc 🌟' : score >= 8 ? 'Giỏi 🎉' : score >= 6.5 ? 'Khá 👍' : score >= 5 ? 'Trung bình' : 'Cần cố gắng'

  // Count-up animation
  useEffect(() => {
    const start = Date.now()
    const duration = 1200
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const prog = Math.min(elapsed / duration, 1)
      setCountUp(Math.round(prog * score * 10) / 10)
      if (prog >= 1) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [score])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center justify-between px-4 h-12 border-b">
        <button onClick={() => router.push('/hocsinh/thi')} className="flex items-center gap-1 text-sm text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Lịch thi
        </button>
        <span className="font-semibold text-sm">Kết quả</span>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Score */}
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{exam.subject}</p>
          <div className="text-7xl font-black text-green-600 leading-none">{countUp.toFixed(1)}</div>
          <div className="text-xl text-muted-foreground mt-1">/ 10</div>
          <div className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-bold text-lg">
            {grade}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl bg-card border p-4 mb-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-green-600">{correct}</p>
            <p className="text-xs text-muted-foreground">✅ Đúng</p>
          </div>
          <div>
            <p className="text-2xl font-black text-red-500">{total - correct - (total - Object.keys(answers).length)}</p>
            <p className="text-xs text-muted-foreground">❌ Sai</p>
          </div>
          <div>
            <p className="text-2xl font-black text-muted-foreground">{total - Object.keys(answers).length}</p>
            <p className="text-xs text-muted-foreground">⬜ Bỏ</p>
          </div>
        </div>

        {/* Compare */}
        <div className="rounded-2xl bg-card border p-4 mb-4">
          <p className="text-sm font-medium mb-2">So sánh với lớp</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">{score}</span>
            <span className="text-xs text-green-600">▲ cao hơn TB lớp</span>
            <span className="text-sm text-muted-foreground ml-auto">TB lớp: 7.1</span>
          </div>
        </div>

        {/* Answers review */}
        <Button variant="outline" className="w-full mb-3" onClick={() => setShowAnswers(!showAnswers)}>
          {showAnswers ? 'Ẩn đáp án' : '📋 Xem đáp án'}
        </Button>

        {showAnswers && (
          <div className="space-y-3 mb-4">
            {questions.filter((_, i) => i < 10).map(q => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correctAnswer
              const isSkipped = !userAnswer
              return (
                <div key={q.id} className={cn('rounded-xl p-3 border', isCorrect ? 'bg-green-50 border-green-200' : isSkipped ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200')}>
                  <div className="flex items-start gap-2">
                    <span className={cn('text-xs font-bold shrink-0 mt-0.5', isCorrect ? 'text-green-700' : isSkipped ? 'text-gray-500' : 'text-red-700')}>
                      {isCorrect ? '✅' : isSkipped ? '⬜' : '❌'} Câu {q.number}
                    </span>
                    <p className="text-xs text-muted-foreground flex-1 line-clamp-2">{q.text}</p>
                  </div>
                  {!isCorrect && (
                    <div className="mt-2 pl-6 text-xs space-y-0.5">
                      {userAnswer && <p className="text-red-600">Bạn chọn: {userAnswer}</p>}
                      <p className="text-green-700 font-medium">Đáp án: {q.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )
            })}
            {questions.length > 10 && (
              <p className="text-center text-xs text-muted-foreground py-2">Hiển thị 10/{questions.length} câu</p>
            )}
          </div>
        )}

        <Button className="w-full min-h-[48px]" onClick={() => router.push('/hocsinh/thi')}>
          Về trang thi
        </Button>
      </div>
    </div>
  )
}

// ─── Main exam page ───────────────────────────────────────────────
export default function ExamRoomPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params)
  const router = useRouter()
  const { answers, currentQuestion, timeRemaining, startedAt, startExam, setAnswer, setQuestion, tickTimer, submitExam } = useExamStore()

  const [phase, setPhase] = useState<'waiting' | 'exam' | 'result'>('waiting')
  const [showConfirm, setShowConfirm] = useState(false)
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  const exam = mockExams.find(e => e.id === examId) ?? mockExams[0]!
  const questions = generateQuestions(examId, exam?.totalQuestions ?? 10)
  const q = questions[currentQuestion] ?? questions[0]!

  // Timer
  useEffect(() => {
    if (phase !== 'exam') return
    if (timeRemaining <= 0) {
      handleSubmit()
      return
    }
    const interval = setInterval(() => tickTimer(), 1000)
    return () => clearInterval(interval)
  }, [phase, timeRemaining])

  function handleStart() {
    startExam(examId, exam.duration)
    setPhase('exam')
  }

  function handleSubmit() {
    submitExam()
    setShowConfirm(false)
    setPhase('result')
  }

  function toggleFlag(qId: string) {
    setFlagged(prev => {
      const next = new Set(prev)
      next.has(qId) ? next.delete(qId) : next.add(qId)
      return next
    })
  }

  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount

  if (phase === 'waiting') {
    return <WaitingScreen exam={exam} onStart={handleStart} />
  }

  if (phase === 'result') {
    return (
      <ResultScreen
        exam={exam}
        questions={questions}
        answers={answers}
        onReview={() => {}}
      />
    )
  }

  // ─── Exam room ───
  if (!q) return null
  const DOTS_PER_ROW = 8
  const visibleDots = Math.min(questions.length, DOTS_PER_ROW)
  const startDotIdx = Math.max(0, Math.min(currentQuestion - Math.floor(DOTS_PER_ROW / 2), questions.length - visibleDots))

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Fixed top bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b bg-background/95 backdrop-blur shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirm(true)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">
            Câu {currentQuestion + 1}/{questions.length}
          </span>
        </div>
        <TimerDisplay seconds={timeRemaining} />
        <Button
          variant="destructive"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setShowConfirm(true)}
        >
          Nộp bài
        </Button>
      </div>

      {/* Question area — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Question header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Câu {q.number}</span>
          <button
            onClick={() => toggleFlag(q.id)}
            className={cn('flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors',
              flagged.has(q.id) ? 'bg-amber-100 border-amber-300 text-amber-700' : 'border-border text-muted-foreground'
            )}
          >
            <Flag className="h-3 w-3" />
            {flagged.has(q.id) ? 'Đã đánh dấu' : 'Đánh dấu'}
          </button>
        </div>

        {/* Question text */}
        <p className="text-base leading-relaxed mb-6 font-medium">{q.text}</p>

        {/* Answer options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i) // A, B, C, D
            const isSelected = answers[q.id] === letter
            return (
              <button
                key={letter}
                onClick={() => setAnswer(q.id, letter)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all min-h-[60px]',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-border bg-card hover:border-blue-300 hover:bg-blue-50/30'
                )}
              >
                <div className={cn(
                  'h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm',
                  isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-muted-foreground/40 text-muted-foreground'
                )}>
                  {letter}
                </div>
                <span className={cn('text-sm flex-1', isSelected && 'font-medium text-blue-800')}>{opt}</span>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="border-t bg-background/95 backdrop-blur shrink-0 px-4 py-3 space-y-3">
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 overflow-hidden">
          {questions.slice(startDotIdx, startDotIdx + visibleDots).map((q, i) => {
            const realIdx = startDotIdx + i
            const isAnswered = !!answers[q.id]
            const isCurrent = realIdx === currentQuestion
            const isFlagged = flagged.has(q.id)
            return (
              <button
                key={q.id}
                onClick={() => setQuestion(realIdx)}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  isCurrent ? 'w-6 bg-orange-500' :
                  isFlagged ? 'w-2.5 bg-amber-400' :
                  isAnswered ? 'w-2.5 bg-blue-500' : 'w-2.5 bg-muted-foreground/30'
                )}
              />
            )
          })}
          {questions.length > visibleDots && (
            <span className="text-xs text-muted-foreground ml-1">
              {currentQuestion + 1}/{questions.length}
            </span>
          )}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 min-h-[48px]"
            disabled={currentQuestion === 0}
            onClick={() => setQuestion(currentQuestion - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Trước
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button
              className="flex-1 min-h-[48px]"
              onClick={() => setQuestion(currentQuestion + 1)}
            >
              Sau <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="flex-1 min-h-[48px]"
              onClick={() => setShowConfirm(true)}
            >
              Nộp bài
            </Button>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Nộp bài?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Thời gian còn lại</span>
              <TimerDisplay seconds={timeRemaining} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Đã trả lời</span>
              <span className="font-semibold text-green-600">{answeredCount} câu</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chưa trả lời</span>
                <span className="font-semibold text-red-500">{unansweredCount} câu</span>
              </div>
            )}
            {unansweredCount > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs text-amber-700">
                  ⚠️ Còn {unansweredCount} câu chưa trả lời. Kiểm tra lại trước khi nộp nhé!
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Sau khi nộp, bạn sẽ không thể vào phòng thi lại.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
              Quay lại làm
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleSubmit}>
              Nộp ngay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
