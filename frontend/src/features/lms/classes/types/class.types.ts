// LMS Class Types

export interface LMSClass {
  id: string
  name: string
  code: string
  description?: string
  teacher: { id: string; name: string; avatar?: string }
  studentCount: number
  progress: number // 0-100
  status: "active" | "completed" | "upcoming"
  year: string
  term: "HK1" | "HK2" | "full"
  enrollmentType: "open" | "approval" | "locked"
  maxStudents?: number
  startDate?: string
  endDate?: string
  thumbnail?: string
  createdAt: string
  updatedAt?: string
}

export interface ClassStudent {
  id: string
  studentId: string
  name: string
  email: string
  avatar?: string
  code: string
  enrolledAt: string
  progress: number
  status: "approved" | "pending" | "removed"
  currentClass?: string
}

export interface ClassDashboardStats {
  totalClasses: number
  totalStudents: number
  avgCompletion: number
  activeClasses: number
  studentDistribution: { name: string; count: number }[]
  completionByClass: { name: string; completion: number }[]
  lowProgressClasses: LMSClass[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ClassFormData = {
  name: string
  code: string
  description?: string
  year: string
  term: "HK1" | "HK2" | "full"
  startDate?: string
  endDate?: string
  teacherId: string
  enrollmentType: "open" | "approval" | "locked"
  maxStudents?: number
  thumbnail?: string
}
