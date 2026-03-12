// ── Exam Session Types ──

export type SessionStatus = 'preparing' | 'active' | 'completed'
export type AttemptStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded'

export interface SessionCategory {
  id: string
  name: string
  parentId?: string
  children?: SessionCategory[]
}

export interface ExamSession {
  id: string
  name: string
  categoryId?: string
  categoryName?: string
  academicYear: string
  semester: string
  startDate: string
  endDate: string
  description?: string
  examCount: number
  studentCount: number
  status: SessionStatus
  showAnswersAfter?: string
  showScoreImmediately: boolean
  createdAt: string
}

export interface SessionExam {
  id: string
  sessionId: string
  name: string
  examPaperId: string
  examPaperName: string
  examDate: string
  startTime: string
  durationMinutes: number
  room?: string
  supervisors: { id: string; name: string }[]
  maxStudents?: number
  studentCount: number
  status: SessionStatus
  notes?: string
}

export interface SessionStudent {
  id: string
  sessionExamId: string
  studentId: string
  studentName: string
  studentAvatar?: string
  studentCode: string
  className: string
  registrationNumber?: string
  room?: string
  seatNumber?: string
  extraTimeMinutes: number
  extraAttempts: number
  exceptionNote?: string
  attemptStatus: AttemptStatus
  score: number | null
  attemptId?: string
}

export interface ExamAttempt {
  id: string
  sessionExamId: string
  studentId: string
  studentName: string
  startedAt: string
  submittedAt?: string
  score: number | null
  correctCount: number
  totalQuestions: number
  timeSpentMinutes: number
  rank?: number
  answers: AttemptAnswer[]
}

export interface AttemptAnswer {
  questionId: string
  questionContent: string
  questionType: string
  selectedOptionIds?: string[]
  textAnswer?: string
  correctOptionIds?: string[]
  isCorrect?: boolean
  score: number | null
  maxScore: number
  explanation?: string
}
