// ── Exam Question Bank Types ──

export type QuestionType = 'single_choice' | 'multi_choice' | 'parent_child' | 'essay' | 'true_false' | 'fill_blank'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'very_hard'

export interface QuestionCategory {
  id: string
  name: string
  parentId?: string
  children?: QuestionCategory[]
}

export interface QuestionOption {
  id: string
  content: string
  isCorrect: boolean
  order: number
}

export interface Question {
  id: string
  type: QuestionType
  categoryId: string
  categoryName?: string
  difficulty: Difficulty
  content: string
  options?: QuestionOption[]
  explanation?: string
  tags: string[]
  authorId: string
  authorName?: string
  parentId?: string
  children?: Question[]
  rubric?: RubricItem[]
  maxScore?: number
  suggestedAnswer?: string
  createdAt: string
  updatedAt: string
}

export interface RubricItem {
  id: string
  criterion: string
  maxScore: number
  description: string
}
