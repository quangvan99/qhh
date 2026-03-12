// ── LMS Results Types ──

export type CompletionStatus = 'completed' | 'in_progress' | 'not_started'
export type ContentType = 'scorm' | 'video' | 'text' | 'file'

export interface LearningResult {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  studentAvatar?: string
  classId: string
  contentProgress: number
  assignmentAvg: number | null
  examScore: number | null
  finalScore: number | null
  completionStatus: CompletionStatus
  completedAt?: string
}

export interface ContentProgress {
  id: string
  contentGroupName: string
  contentName: string
  contentType: ContentType
  accessCount: number
  studyTimeMinutes: number
  score: number | null
  completed: boolean
  lastAccessedAt?: string
}

export interface StudentAssignmentResult {
  id: string
  assignmentName: string
  deadline: string
  submittedAt?: string
  score: number | null
  feedback?: string
}

export interface StudentExamResult {
  id: string
  sessionName: string
  takenAt: string
  score: number | null
  rank: number | null
  attemptId?: string
}

export interface ActivityLogEntry {
  id: string
  timestamp: string
  type: 'access' | 'submit' | 'exam' | 'login'
  description: string
  durationMinutes?: number
}
