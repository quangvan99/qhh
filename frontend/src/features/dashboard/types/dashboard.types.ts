import type { UserRole } from '@/types'

// ── Admin Summary ──
export interface AdminSummary {
  students: number
  classes: number
  attendanceToday: number
  booksOnLoan: number
  studentsDelta?: number
  classesDelta?: number
  attendanceDelta?: number
}

// ── Teacher Summary ──
export interface TeacherSummary {
  teachingClasses: number
  studentsNeedHelp: number
  pendingAssignments: number
  completionRate?: number
}

// ── Student Summary ──
export interface StudentSummary {
  enrolledClasses: number
  upcomingDeadlines: number
  avgScore: number
  scormCompletion?: number
}

// ── Dashboard Summary (role-based union) ──
export type DashboardSummary = AdminSummary | TeacherSummary | StudentSummary

// ── Chart Data ──
export interface ChartDataPoint {
  name: string
  value: number
}

export interface DashboardCharts {
  classStudents: ChartDataPoint[]
  attendance7Days: ChartDataPoint[]
}

// ── Activity ──
export interface ActivityItem {
  id: string
  type: 'login' | 'submission' | 'attendance' | 'borrow' | 'grade' | 'announcement'
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
}

// ── Shortcut ──
export interface QuickShortcutItem {
  label: string
  href: string
  icon: React.ReactNode
  module?: 'lms' | 'exam' | 'ai' | 'library' | 'admin'
}

// ── Teacher class item ──
export interface TeacherClassItem {
  id: string
  name: string
  semester: string
  progress: number
  studentCount: number
}

// ── Student assignment ──
export interface StudentAssignment {
  id: string
  title: string
  className: string
  dueDate: string
  status: 'pending' | 'overdue' | 'submitted'
}

// ── Teacher assignment for table ──
export interface TeacherAssignment {
  id: string
  title: string
  className: string
  dueDate: string
  notSubmitted: number
}
