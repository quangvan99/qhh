// ── Exam Types ──

export type ExamStatus = 'draft' | 'published'

export interface ExamPaper {
  id: string
  name: string
  categoryId?: string
  categoryName?: string
  totalQuestions: number
  duration: number // minutes
  totalScore: number
  description?: string
  instructions?: string
  sections: ExamSection[]
  authorId: string
  authorName?: string
  status: ExamStatus
  createdAt: string
  updatedAt: string
}

export type SectionSelectionMode = 'random' | 'manual'

export interface ExamSection {
  id: string
  name: string
  questionType: string
  scorePerQuestion: number
  selectionMode: SectionSelectionMode
  questions?: { questionId: string; order: number }[]
  randomConfig?: RandomConfig[]
  order: number
}

export interface RandomConfig {
  categoryId: string
  difficulty: string
  count: number
}
