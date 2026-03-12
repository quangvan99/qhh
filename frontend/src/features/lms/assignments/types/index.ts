// ── LMS Assignment Types ──

export type AssignmentStatus = 'draft' | 'open' | 'closed'
export type SubmissionType = 'file' | 'text' | 'both'
export type SubmissionStatus = 'on_time' | 'late' | 'not_submitted'
export type GradingStatus = 'graded' | 'ungraded'
export type ScoreVisibility = 'hidden' | 'visible' | 'scheduled'

export interface Assignment {
  id: string
  classId: string
  title: string
  description: string
  submissionType: SubmissionType
  openDate: string
  deadline: string
  maxScore: number
  allowLate: boolean
  lateDeadline?: string
  allowResubmit: boolean
  maxResubmitCount?: number
  hideScore: boolean
  status: AssignmentStatus
  submittedCount: number
  totalStudents: number
  attachments?: FileAttachment[]
  createdAt: string
}

export interface FileAttachment {
  id: string
  name: string
  url: string
  size: number
  mimeType: string
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  studentAvatar?: string
  submittedAt?: string
  submissionStatus: SubmissionStatus
  gradingStatus: GradingStatus
  score: number | null
  feedback?: string
  textContent?: string
  files?: FileAttachment[]
  feedbackFiles?: FileAttachment[]
}

export interface ScoreSettings {
  visibility: ScoreVisibility
  visibleFrom?: string
  showFeedback: boolean
  showCorrectAnswer: boolean
}
