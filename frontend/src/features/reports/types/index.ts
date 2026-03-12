export type ReportType = 'students' | 'attendance' | 'learning' | 'library' | 'activity'
export type ExportFormat = 'excel' | 'csv' | 'pdf'
export type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom'

export interface ReportFilter {
  dateRange: DateRange
  dateFrom?: string
  dateTo?: string
  classId?: string
  subject?: string
}

export interface ReportMeta {
  id: ReportType
  title: string
  description: string
  icon: string
  color: string
}

export interface StudentReportRow {
  id: string
  code: string
  name: string
  className: string
  avgScore: number | null
  rank: 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu'
  attendance: number
}

export interface AttendanceReportRow {
  date: string
  className: string
  total: number
  present: number
  absent: number
  rate: number
}

export interface LearningReportRow {
  id: string
  studentName: string
  studentCode: string
  className: string
  subject: string
  assignmentAvg: number | null
  examScore: number | null
  finalScore: number | null
}

export interface LibraryReportRow {
  id: string
  bookTitle: string
  borrowCount: number
  returnedCount: number
  overdueCount: number
  category: string
}

export interface ActivityReportRow {
  id: string
  userName: string
  action: string
  detail: string
  timestamp: string
  module: string
}

export type ReportRow = StudentReportRow | AttendanceReportRow | LearningReportRow | LibraryReportRow | ActivityReportRow
