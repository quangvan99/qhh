export interface Camera {
  id: string
  name: string
  ipAddress: string
  rtspUrl?: string
  location: string
  classId?: string
  status: 'online' | 'offline' | 'error'
  lastSeen?: string
  manufacturer?: string
}

export interface AttendanceDevice {
  id: string
  deviceId: string
  model: string
  firmware: string
  classId?: string
  status: 'active' | 'inactive'
}

export interface FaceProfile {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  photoCount: number
  enrolledAt: string
  status: 'active' | 'pending'
  thumbnail?: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  sessionId: string
  detectedAt: string
  status: 'present' | 'absent' | 'late'
  confidence?: number
  isManualOverride: boolean
  overrideReason?: string
}

export interface AttendanceSession {
  id: string
  classId: string
  className: string
  startedAt?: string
  endedAt?: string
  status: 'scheduled' | 'active' | 'completed'
  presentCount: number
  absentCount: number
  lateCount: number
}

export interface MonitorFeedEntry {
  id: string
  studentId: string
  studentName: string
  detectedAt: string
  status: 'present' | 'absent' | 'late'
  confidence: number
}

export interface AttendanceReport {
  date: string
  classId: string
  className: string
  present: number
  absent: number
  late: number
  total: number
  attendanceRate: number
}

export interface AttendanceAnalytics {
  overallRate: number
  totalSessions: number
  avgPresent: number
  byClass: { name: string; rate: number }[]
  dailyTrend: { date: string; rate: number }[]
}
