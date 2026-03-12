// GDĐT Integration Types

export interface GDDTClass {
  id: string
  code: string
  name: string
  grade: 10 | 11 | 12
  year: string
  teacher: string
  studentCount: number
  syncStatus: 'synced' | 'pending' | 'error'
  lastSyncAt: string
}

export interface GDDTStudent {
  id: string
  code: string
  name: string
  dob: string
  gender: 'male' | 'female'
  conduct: 'excellent' | 'good' | 'average' | 'weak'
  avgScore: number
  conductScore?: number
  classId: string
}

export interface ConductCriteria {
  id: string
  code: string
  name: string
  group: string
  maxScore: number
  minScore?: number
  grades: ('10' | '11' | '12')[]
  order: number
  description?: string
  active: boolean
}

export interface ConductScore {
  criteriaId: string
  criteriaName: string
  criteriaGroup: string
  maxScore: number
  score: number
  note?: string
}

export interface StudentConductData {
  student: GDDTStudent
  className: string
  term: string
  year: string
  scores: ConductScore[]
  totalScore: number
  classification: string
  comment?: string
}

export interface ScholarshipLevel {
  id: string
  name: string
  value: number
  valueType: 'amount' | 'percent'
  minAvgScore: number
  minConduct: 'excellent' | 'good' | 'average'
  grades: ('10' | '11' | '12')[]
  active: boolean
  note?: string
}

export interface ScholarshipSession {
  id: string
  name: string
  year: string
  term: 'HK1' | 'HK2' | 'CN'
  startDate: string
  endDate: string
  levelIds: string[]
  status: 'pending' | 'processing' | 'completed'
}

export interface ScholarshipResult {
  id: string
  studentId: string
  studentCode: string
  studentName: string
  className: string
  avgScore: number
  conduct: string
  conductScore: number
  levelName: string
  scholarshipValue: number
  note?: string
}

export interface ScholarshipSummary {
  totalStudents: number
  totalValue: number
  percentage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
