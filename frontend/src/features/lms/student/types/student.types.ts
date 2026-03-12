// ─── Student Class ──────────────────────────────────────────────

export interface StudentClass {
  id: string
  name: string
  subject: string
  teacher: string
  teacherAvatar?: string
  thumbnail?: string
  totalContent: number
  completedContent: number
  progressPercent: number
  status: 'active' | 'completed' | 'archived'
  semester?: string
  year?: string
  startDate?: string
  endDate?: string
  studentCount?: number
  description?: string
}

export interface PublicClass {
  id: string
  name: string
  subject: string
  teacher: string
  teacherAvatar?: string
  thumbnail?: string
  studentCount: number
  capacity: number
  status: 'open' | 'full' | 'pending_approval'
}

// ─── Content ────────────────────────────────────────────────────

export interface StudentContentGroup {
  id: string
  name: string
  order: number
  items: StudentContentItem[]
}

export interface StudentContentItem {
  id: string
  type: 'scorm' | 'video' | 'text' | 'file' | 'survey' | 'offline'
  title: string
  completed: boolean
  locked: boolean
  current?: boolean
  scormProgress?: number
  scormUrl?: string
  videoDuration?: number
  videoProgress?: number
  videoUrl?: string
  textContent?: string
  fileUrl?: string
  fileName?: string
  surveyId?: string
  offlineInfo?: { location: string; time: string; materials?: string }
}

// ─── Assignment ─────────────────────────────────────────────────

export interface StudentAssignment {
  id: string
  title: string
  classId: string
  className: string
  description: string
  deadline: string
  maxScore: number
  type: 'text' | 'file' | 'both'
  status: 'pending' | 'submitted' | 'graded' | 'late' | 'expired'
  submittedAt?: string
  score?: number
  feedback?: string
  attachments?: { name: string; url: string }[]
  submissionFiles?: { name: string; url: string }[]
  submissionText?: string
  feedbackFiles?: { name: string; url: string }[]
  allowResubmit?: boolean
}

// ─── Exam ───────────────────────────────────────────────────────

export interface StudentExamSession {
  id: string
  examTitle: string
  subject: string
  startTime: string
  endTime: string
  duration: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed'
  score?: number
  passingScore: number
  totalQuestions?: number
  room?: string
  registered?: boolean
  rank?: number
  totalParticipants?: number
}

export interface ExamQuestion {
  id: string
  index: number
  content: string
  type: 'single_choice' | 'multiple_choice' | 'essay' | 'true_false'
  options?: { key: string; label: string }[]
  imageUrl?: string
}

export interface ExamAttempt {
  id: string
  sessionId: string
  questions: ExamQuestion[]
  answers: Record<string, string | string[]>
  timeLeft: number
  startedAt: string
}

export interface ExamResult {
  id: string
  sessionId: string
  examTitle: string
  score: number
  totalScore: number
  correctCount: number
  totalQuestions: number
  timeTaken: number
  rank?: number
  totalParticipants?: number
  showDetail?: boolean
  questions?: ExamResultQuestion[]
}

export interface ExamResultOption {
  key: string
  label: string
}

export interface ExamResultQuestion {
  id: string
  index: number
  content: string
  type: 'single_choice' | 'multiple_choice' | 'essay' | 'true_false'
  options?: { key: string; label: string }[]
  userAnswer?: string | string[]
  correctAnswer?: string | string[]
  isCorrect: boolean
  explanation?: string
}

// ─── Discussion ─────────────────────────────────────────────────

export interface DiscussionThread {
  id: string
  classId: string
  title: string
  content: string
  author: { id: string; name: string; avatar?: string; role: 'teacher' | 'student' }
  createdAt: string
  replyCount: number
  pinned: boolean
  unread: boolean
  attachments?: { name: string; url: string }[]
}

export interface DiscussionReply {
  id: string
  threadId: string
  content: string
  author: { id: string; name: string; avatar?: string; role: 'teacher' | 'student' }
  createdAt: string
  attachments?: { name: string; url: string }[]
  isOwn: boolean
}

// ─── History / Notifications ────────────────────────────────────

export interface AccessLog {
  id: string
  action: string
  contentTitle?: string
  timestamp: string
  duration?: number
}

export interface ClassNotification {
  id: string
  title: string
  content: string
  sender: { name: string; avatar?: string }
  createdAt: string
  read: boolean
}

// ─── Student Results ────────────────────────────────────────────

export interface StudentClassResult {
  contentProgress: number
  totalContent: number
  completedContent: number
  avgAssignmentScore?: number
  avgExamScore?: number
  assignments: {
    id: string
    title: string
    deadline: string
    score?: number
    feedback?: string
  }[]
  exams: {
    id: string
    title: string
    date: string
    score?: number
    rank?: number
  }[]
}

// ─── Common ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
