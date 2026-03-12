import { create } from 'zustand'
import type { ExamQuestion } from '../types/student.types'

interface ExamStore {
  sessionId: string
  questions: ExamQuestion[]
  answers: Record<string, string | string[]>
  currentQuestion: number
  markedQuestions: Set<number>
  timeLeft: number
  lastSavedAt: string | null
  isDirty: boolean

  // Actions
  init: (params: {
    sessionId: string
    questions: ExamQuestion[]
    answers: Record<string, string | string[]>
    timeLeft: number
  }) => void
  setAnswer: (questionId: string, answer: string | string[]) => void
  toggleMark: (questionIndex: number) => void
  setCurrentQuestion: (index: number) => void
  setTimeLeft: (timeLeft: number) => void
  tick: () => void
  markSaved: () => void
  reset: () => void
}

export const useExamStore = create<ExamStore>((set) => ({
  sessionId: '',
  questions: [],
  answers: {},
  currentQuestion: 0,
  markedQuestions: new Set(),
  timeLeft: 0,
  lastSavedAt: null,
  isDirty: false,

  init: ({ sessionId, questions, answers, timeLeft }) =>
    set({
      sessionId,
      questions,
      answers,
      timeLeft,
      currentQuestion: 0,
      markedQuestions: new Set(),
      lastSavedAt: null,
      isDirty: false,
    }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
      isDirty: true,
    })),

  toggleMark: (questionIndex) =>
    set((state) => {
      const newMarked = new Set(state.markedQuestions)
      if (newMarked.has(questionIndex)) {
        newMarked.delete(questionIndex)
      } else {
        newMarked.add(questionIndex)
      }
      return { markedQuestions: newMarked }
    }),

  setCurrentQuestion: (index) => set({ currentQuestion: index }),

  setTimeLeft: (timeLeft) => set({ timeLeft }),

  tick: () =>
    set((state) => ({
      timeLeft: Math.max(0, state.timeLeft - 1),
    })),

  markSaved: () =>
    set({
      lastSavedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isDirty: false,
    }),

  reset: () =>
    set({
      sessionId: '',
      questions: [],
      answers: {},
      currentQuestion: 0,
      markedQuestions: new Set(),
      timeLeft: 0,
      lastSavedAt: null,
      isDirty: false,
    }),
}))
