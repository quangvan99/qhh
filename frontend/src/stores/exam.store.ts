import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ExamStore {
  examId: string | null
  answers: Record<string, string>
  currentQuestion: number
  timeRemaining: number
  startedAt: string | null
  startExam: (examId: string, totalTime: number) => void
  setAnswer: (questionId: string, answer: string) => void
  setQuestion: (index: number) => void
  tickTimer: () => void
  submitExam: () => void
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      examId: null,
      answers: {},
      currentQuestion: 0,
      timeRemaining: 0,
      startedAt: null,
      startExam: (examId, totalTime) =>
        set({
          examId,
          answers: {},
          currentQuestion: 0,
          timeRemaining: totalTime * 60,
          startedAt: new Date().toISOString(),
        }),
      setAnswer: (questionId, answer) =>
        set(s => ({ answers: { ...s.answers, [questionId]: answer } })),
      setQuestion: (index) => set({ currentQuestion: index }),
      tickTimer: () =>
        set(s => ({ timeRemaining: Math.max(0, s.timeRemaining - 1) })),
      submitExam: () =>
        set({ examId: null, answers: {}, currentQuestion: 0, timeRemaining: 0, startedAt: null }),
    }),
    { name: 'qh-exam-session' }
  )
)

// Expose getter for use outside React (e.g., interval timer)
export const getExamState = () => useExamStore.getState()
