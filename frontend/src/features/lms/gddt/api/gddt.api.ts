import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  GDDTClass,
  GDDTStudent,
  ConductCriteria,
  StudentConductData,
  ScholarshipLevel,
  ScholarshipSession,
  ScholarshipResult,
  ScholarshipSummary,
  PaginatedResponse,
} from '../types/gddt.types'

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_GDDT_CLASSES: GDDTClass[] = [
  { id: 'gddt-cls-1', code: '10A1', name: 'Lớp 10A1', grade: 10, year: '2025-2026', teacher: 'Nguyễn Văn An', studentCount: 42, syncStatus: 'synced', lastSyncAt: '2026-03-10T08:00:00Z' },
  { id: 'gddt-cls-2', code: '10A2', name: 'Lớp 10A2', grade: 10, year: '2025-2026', teacher: 'Trần Thị Bích', studentCount: 40, syncStatus: 'synced', lastSyncAt: '2026-03-10T08:05:00Z' },
  { id: 'gddt-cls-3', code: '10B1', name: 'Lớp 10B1', grade: 10, year: '2025-2026', teacher: 'Lê Minh Cường', studentCount: 38, syncStatus: 'pending', lastSyncAt: '2026-03-09T14:00:00Z' },
  { id: 'gddt-cls-4', code: '11A1', name: 'Lớp 11A1', grade: 11, year: '2025-2026', teacher: 'Phạm Thị Dung', studentCount: 45, syncStatus: 'synced', lastSyncAt: '2026-03-10T09:00:00Z' },
  { id: 'gddt-cls-5', code: '11A2', name: 'Lớp 11A2', grade: 11, year: '2025-2026', teacher: 'Hoàng Văn Em', studentCount: 43, syncStatus: 'synced', lastSyncAt: '2026-03-10T09:10:00Z' },
  { id: 'gddt-cls-6', code: '11B1', name: 'Lớp 11B1', grade: 11, year: '2025-2026', teacher: 'Nguyễn Văn An', studentCount: 41, syncStatus: 'error', lastSyncAt: '2026-03-08T10:00:00Z' },
  { id: 'gddt-cls-7', code: '12A1', name: 'Lớp 12A1', grade: 12, year: '2025-2026', teacher: 'Trần Thị Bích', studentCount: 44, syncStatus: 'synced', lastSyncAt: '2026-03-10T10:00:00Z' },
  { id: 'gddt-cls-8', code: '12A2', name: 'Lớp 12A2', grade: 12, year: '2025-2026', teacher: 'Lê Minh Cường', studentCount: 40, syncStatus: 'synced', lastSyncAt: '2026-03-10T10:05:00Z' },
  { id: 'gddt-cls-9', code: '12B1', name: 'Lớp 12B1', grade: 12, year: '2025-2026', teacher: 'Phạm Thị Dung', studentCount: 39, syncStatus: 'pending', lastSyncAt: '2026-03-09T11:00:00Z' },
]

const STUDENT_NAMES_GDDT = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
  'Vũ Thị Phương', 'Đặng Văn Giang', 'Bùi Thị Hà', 'Đỗ Văn Hùng', 'Ngô Thị Lan',
  'Dương Văn Mạnh', 'Lý Thị Ngọc', 'Trịnh Văn Oanh', 'Phan Thị Phúc', 'Cao Văn Quân',
  'Đinh Thị Rằn', 'Tạ Văn Sơn', 'Lưu Thị Tâm', 'Hà Văn Thái', 'Mai Thị Uyên',
]
const CONDUCT_LEVELS: GDDTStudent['conduct'][] = ['excellent', 'good', 'good', 'average', 'excellent', 'good', 'good', 'good', 'average', 'weak']

function makeGDDTStudents(classId: string, count: number): GDDTStudent[] {
  return Array.from({ length: Math.min(count, 20) }, (_, i): GDDTStudent => ({
    id: `gddt-stu-${classId}-${i + 1}`,
    code: `HS${String(2000 + i + 1).padStart(6, '0')}`,
    name: STUDENT_NAMES_GDDT[i % STUDENT_NAMES_GDDT.length]!,
    dob: `200${5 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    gender: i % 3 === 1 ? 'female' : 'male',
    conduct: CONDUCT_LEVELS[i % CONDUCT_LEVELS.length]!,
    avgScore: Math.round((6 + (i % 4)) * 10) / 10,
    conductScore: 70 + (i % 30),
    classId,
  }))
}

const studentCache: Record<string, GDDTStudent[]> = {}

function getStudentsForClass(classId: string): GDDTStudent[] {
  if (!studentCache[classId]) {
    const cls = MOCK_GDDT_CLASSES.find((c) => c.id === classId)
    studentCache[classId] = makeGDDTStudents(classId, cls?.studentCount ?? 20)
  }
  return studentCache[classId]!
}

const MOCK_CONDUCT_CRITERIA: ConductCriteria[] = [
  { id: 'cc-1', code: 'TC01', name: 'Đạo đức, lối sống', group: 'Phẩm chất đạo đức', maxScore: 20, grades: ['10', '11', '12'], order: 1, description: 'Thái độ sống, cư xử với mọi người', active: true },
  { id: 'cc-2', code: 'TC02', name: 'Chấp hành nội quy', group: 'Phẩm chất đạo đức', maxScore: 15, grades: ['10', '11', '12'], order: 2, description: 'Chấp hành nội quy nhà trường, lớp học', active: true },
  { id: 'cc-3', code: 'TC03', name: 'Kết quả học tập', group: 'Năng lực học tập', maxScore: 20, grades: ['10', '11', '12'], order: 3, description: 'Kết quả học tập, điểm trung bình', active: true },
  { id: 'cc-4', code: 'TC04', name: 'Tham gia hoạt động', group: 'Năng lực học tập', maxScore: 15, grades: ['10', '11', '12'], order: 4, description: 'Tham gia hoạt động ngoại khoá, phong trào', active: true },
  { id: 'cc-5', code: 'TC05', name: 'Ý thức tập thể', group: 'Phẩm chất công dân', maxScore: 10, grades: ['10', '11', '12'], order: 5, description: 'Ý thức xây dựng tập thể lớp, trường', active: true },
  { id: 'cc-6', code: 'TC06', name: 'Tinh thần đoàn kết', group: 'Phẩm chất công dân', maxScore: 10, grades: ['10', '11', '12'], order: 6, description: 'Tinh thần giúp đỡ bạn bè, đoàn kết', active: true },
  { id: 'cc-7', code: 'TC07', name: 'Ý thức bảo vệ môi trường', group: 'Phẩm chất công dân', maxScore: 10, grades: ['10', '11', '12'], order: 7, description: 'Ý thức giữ gìn vệ sinh, bảo vệ môi trường', active: true },
]

const MOCK_SCHOLARSHIP_LEVELS: ScholarshipLevel[] = [
  { id: 'sl-1', name: 'Học bổng loại Xuất sắc', value: 3000000, valueType: 'amount', minAvgScore: 9.0, minConduct: 'excellent', grades: ['10', '11', '12'], active: true, note: 'Dành cho học sinh xuất sắc toàn diện' },
  { id: 'sl-2', name: 'Học bổng loại Giỏi', value: 2000000, valueType: 'amount', minAvgScore: 8.0, minConduct: 'good', grades: ['10', '11', '12'], active: true, note: 'Dành cho học sinh học lực giỏi' },
  { id: 'sl-3', name: 'Học bổng hỗ trợ', value: 50, valueType: 'percent', minAvgScore: 7.0, minConduct: 'good', grades: ['10', '11', '12'], active: true, note: 'Giảm 50% học phí cho học sinh có hoàn cảnh khó khăn' },
  { id: 'sl-4', name: 'Học bổng khuyến học', value: 1000000, valueType: 'amount', minAvgScore: 7.5, minConduct: 'good', grades: ['10', '11', '12'], active: true },
]

const MOCK_SCHOLARSHIP_SESSIONS: ScholarshipSession[] = [
  { id: 'ss-1', name: 'Học bổng HK1 2025-2026', year: '2025-2026', term: 'HK1', startDate: '2026-01-15', endDate: '2026-02-15', levelIds: ['sl-1', 'sl-2', 'sl-3'], status: 'completed' },
  { id: 'ss-2', name: 'Học bổng HK2 2025-2026', year: '2025-2026', term: 'HK2', startDate: '2026-06-15', endDate: '2026-07-15', levelIds: ['sl-1', 'sl-2', 'sl-3', 'sl-4'], status: 'pending' },
  { id: 'ss-3', name: 'Học bổng cả năm 2024-2025', year: '2024-2025', term: 'CN', startDate: '2025-07-01', endDate: '2025-08-01', levelIds: ['sl-1', 'sl-2'], status: 'completed' },
]

function generateScholarshipResults(sessionId: string): ScholarshipResult[] {
  return Array.from({ length: 15 }, (_, i): ScholarshipResult => ({
    id: `sr-${sessionId}-${i + 1}`,
    studentId: `gddt-stu-gddt-cls-${(i % 3) + 1}-${i + 1}`,
    studentCode: `HS${String(2000 + i + 1).padStart(6, '0')}`,
    studentName: STUDENT_NAMES_GDDT[i % STUDENT_NAMES_GDDT.length]!,
    className: `${10 + (i % 3)}A${(i % 2) + 1}`,
    avgScore: Math.round((8 + (i % 2)) * 10) / 10,
    conduct: i % 3 === 0 ? 'Xuất sắc' : 'Tốt',
    conductScore: 85 + (i % 15),
    levelName: i % 4 === 0 ? 'Học bổng loại Xuất sắc' : i % 4 === 1 ? 'Học bổng loại Giỏi' : i % 4 === 2 ? 'Học bổng hỗ trợ' : 'Học bổng khuyến học',
    scholarshipValue: i % 4 === 0 ? 3000000 : i % 4 === 1 ? 2000000 : i % 4 === 2 ? 1500000 : 1000000,
  }))
}

function generateConductData(studentId: string, classId: string, term: string, year: string): StudentConductData {
  const student = getStudentsForClass(classId).find((s) => s.id === studentId)
    ?? getStudentsForClass(classId)[0]!
  const scores = MOCK_CONDUCT_CRITERIA.map((c) => ({
    criteriaId: c.id,
    criteriaName: c.name,
    criteriaGroup: c.group,
    maxScore: c.maxScore,
    score: Math.round(c.maxScore * 0.8),
    note: undefined,
  }))
  const totalScore = scores.reduce((s, c) => s + c.score, 0)
  return {
    student,
    className: MOCK_GDDT_CLASSES.find((c) => c.id === classId)?.name ?? classId,
    term,
    year,
    scores,
    totalScore,
    classification: totalScore >= 85 ? 'Xuất sắc' : totalScore >= 65 ? 'Tốt' : totalScore >= 50 ? 'Khá' : 'Trung bình',
    comment: 'Học sinh chăm chỉ, có ý thức học tập tốt.',
  }
}

function paginate<T>(items: T[], page = 1, pageSize = 20): PaginatedResponse<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total, page, pageSize, totalPages }
}

// ─── GDĐT Classes ──────────────────────────────────────────────

export function useGetGDDTClasses(filters: { year?: string; grade?: string; q?: string }) {
  return useQuery({
    queryKey: ['gddt-classes', filters],
    queryFn: async (): Promise<PaginatedResponse<GDDTClass>> => {
      try {
        const params = new URLSearchParams()
        if (filters.year) params.set('year', filters.year)
        if (filters.grade) params.set('grade', filters.grade)
        if (filters.q) params.set('q', filters.q)
        return await apiFetch<PaginatedResponse<GDDTClass>>(`/api/gddt/classes?${params.toString()}`)
      } catch {
        let data = [...MOCK_GDDT_CLASSES]
        if (filters.year) data = data.filter((c) => c.year === filters.year)
        if (filters.grade) data = data.filter((c) => String(c.grade) === filters.grade)
        if (filters.q) {
          const q = filters.q.toLowerCase()
          data = data.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        }
        return paginate(data)
      }
    },
  })
}

export function useGetGDDTStudents(classId: string) {
  return useQuery({
    queryKey: ['gddt-students', classId],
    queryFn: async (): Promise<PaginatedResponse<GDDTStudent>> => {
      try {
        return await apiFetch<PaginatedResponse<GDDTStudent>>(`/api/gddt/classes/${classId}/students`)
      } catch {
        return paginate(getStudentsForClass(classId))
      }
    },
    enabled: !!classId,
  })
}

export function useSyncGDDTClasses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      try {
        return await apiFetch<{ message: string }>('/api/gddt/sync', { method: 'POST' })
      } catch {
        // Simulate sync by updating syncStatus
        MOCK_GDDT_CLASSES.forEach((c, i) => {
          MOCK_GDDT_CLASSES[i] = { ...c, syncStatus: 'synced', lastSyncAt: new Date().toISOString() }
        })
        return { message: 'Đồng bộ thành công 9 lớp học.' }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gddt-classes'] })
    },
  })
}

// ─── Conduct Criteria ──────────────────────────────────────────

export function useGetConductCriteria() {
  return useQuery({
    queryKey: ['conduct-criteria'],
    queryFn: async (): Promise<ConductCriteria[]> => {
      try {
        return await apiFetch<ConductCriteria[]>('/api/gddt/conduct-criteria')
      } catch {
        return MOCK_CONDUCT_CRITERIA
      }
    },
  })
}

export function useGetConductCriteriaById(id: string) {
  return useQuery({
    queryKey: ['conduct-criteria', id],
    queryFn: async (): Promise<ConductCriteria> => {
      try {
        return await apiFetch<ConductCriteria>(`/api/gddt/conduct-criteria/${id}`)
      } catch {
        const found = MOCK_CONDUCT_CRITERIA.find((c) => c.id === id)
        if (!found) throw new Error(`Criteria ${id} not found`)
        return found
      }
    },
    enabled: !!id,
  })
}

export function useCreateConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<ConductCriteria, 'id'>): Promise<ConductCriteria> => {
      try {
        return await apiFetch<ConductCriteria>('/api/gddt/conduct-criteria', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        const newCriteria: ConductCriteria = { ...data, id: `cc-${Date.now()}` }
        MOCK_CONDUCT_CRITERIA.push(newCriteria)
        return newCriteria
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

export function useUpdateConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: ConductCriteria): Promise<ConductCriteria> => {
      try {
        return await apiFetch<ConductCriteria>(`/api/gddt/conduct-criteria/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        const idx = MOCK_CONDUCT_CRITERIA.findIndex((c) => c.id === id)
        if (idx !== -1) MOCK_CONDUCT_CRITERIA[idx] = { id, ...data }
        return MOCK_CONDUCT_CRITERIA.find((c) => c.id === id) ?? MOCK_CONDUCT_CRITERIA[0]!
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

export function useDeleteConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/gddt/conduct-criteria/${id}`, { method: 'DELETE' })
      } catch {
        const idx = MOCK_CONDUCT_CRITERIA.findIndex((c) => c.id === id)
        if (idx !== -1) MOCK_CONDUCT_CRITERIA.splice(idx, 1)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

export function useBulkDeleteConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]): Promise<void> => {
      try {
        return await apiFetch<void>('/api/gddt/conduct-criteria/bulk', {
          method: 'DELETE',
          body: JSON.stringify({ ids }),
        })
      } catch {
        for (const id of ids) {
          const idx = MOCK_CONDUCT_CRITERIA.findIndex((c) => c.id === id)
          if (idx !== -1) MOCK_CONDUCT_CRITERIA.splice(idx, 1)
        }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

// ─── Conduct Scores ────────────────────────────────────────────

export function useGetStudentConductScores(studentId: string, term?: string, year?: string) {
  return useQuery({
    queryKey: ['conduct-scores', studentId, term, year],
    queryFn: async (): Promise<StudentConductData> => {
      try {
        const params = new URLSearchParams()
        if (term) params.set('term', term)
        if (year) params.set('year', year)
        return await apiFetch<StudentConductData>(`/api/gddt/conduct-score/${studentId}?${params.toString()}`)
      } catch {
        // Find classId from student cache
        let classId = 'gddt-cls-1'
        for (const [cId, students] of Object.entries(studentCache)) {
          if (students.some((s) => s.id === studentId)) {
            classId = cId
            break
          }
        }
        return generateConductData(studentId, classId, term ?? 'HK1', year ?? '2025-2026')
      }
    },
    enabled: !!studentId,
  })
}

export function useSaveStudentConductScores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      studentId,
      ...data
    }: {
      studentId: string
      term: string
      year: string
      scores: { criteriaId: string; score: number; note?: string }[]
      comment?: string
    }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/gddt/conduct-score/${studentId}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        // Mock: silently succeed
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-scores'] })
    },
  })
}

export function useImportConductScores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File): Promise<{ imported: number; errors: { row: number; message: string }[] }> => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        return await apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
          '/api/gddt/conduct-score/import',
          {
            method: 'POST',
            body: formData,
            headers: {},
          }
        )
      } catch {
        return { imported: 20, errors: [] }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-scores'] })
    },
  })
}

// ─── Scholarship Levels ────────────────────────────────────────

export function useGetScholarshipLevels() {
  return useQuery({
    queryKey: ['scholarship-levels'],
    queryFn: async (): Promise<ScholarshipLevel[]> => {
      try {
        return await apiFetch<ScholarshipLevel[]>('/api/gddt/scholarship/levels')
      } catch {
        return MOCK_SCHOLARSHIP_LEVELS
      }
    },
  })
}

export function useCreateScholarshipLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<ScholarshipLevel, 'id'>): Promise<ScholarshipLevel> => {
      try {
        return await apiFetch<ScholarshipLevel>('/api/gddt/scholarship/levels', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        const newLevel: ScholarshipLevel = { ...data, id: `sl-${Date.now()}` }
        MOCK_SCHOLARSHIP_LEVELS.push(newLevel)
        return newLevel
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-levels'] })
    },
  })
}

export function useUpdateScholarshipLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: ScholarshipLevel): Promise<ScholarshipLevel> => {
      try {
        return await apiFetch<ScholarshipLevel>(`/api/gddt/scholarship/levels/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        const idx = MOCK_SCHOLARSHIP_LEVELS.findIndex((l) => l.id === id)
        if (idx !== -1) MOCK_SCHOLARSHIP_LEVELS[idx] = { id, ...data }
        return MOCK_SCHOLARSHIP_LEVELS.find((l) => l.id === id) ?? MOCK_SCHOLARSHIP_LEVELS[0]!
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-levels'] })
    },
  })
}

export function useDeleteScholarshipLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/gddt/scholarship/levels/${id}`, { method: 'DELETE' })
      } catch {
        const idx = MOCK_SCHOLARSHIP_LEVELS.findIndex((l) => l.id === id)
        if (idx !== -1) MOCK_SCHOLARSHIP_LEVELS.splice(idx, 1)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-levels'] })
    },
  })
}

// ─── Scholarship Sessions ──────────────────────────────────────

export function useGetScholarshipSessions() {
  return useQuery({
    queryKey: ['scholarship-sessions'],
    queryFn: async (): Promise<ScholarshipSession[]> => {
      try {
        return await apiFetch<ScholarshipSession[]>('/api/gddt/scholarship/sessions')
      } catch {
        return MOCK_SCHOLARSHIP_SESSIONS
      }
    },
  })
}

export function useCreateScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<ScholarshipSession, 'id' | 'status'>): Promise<ScholarshipSession> => {
      try {
        return await apiFetch<ScholarshipSession>('/api/gddt/scholarship/sessions', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        const newSession: ScholarshipSession = { ...data, id: `ss-${Date.now()}`, status: 'pending' }
        MOCK_SCHOLARSHIP_SESSIONS.push(newSession)
        return newSession
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
    },
  })
}

export function useUpdateScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: ScholarshipSession): Promise<ScholarshipSession> => {
      try {
        return await apiFetch<ScholarshipSession>(`/api/gddt/scholarship/sessions/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        const idx = MOCK_SCHOLARSHIP_SESSIONS.findIndex((s) => s.id === id)
        if (idx !== -1) MOCK_SCHOLARSHIP_SESSIONS[idx] = { id, ...data }
        return MOCK_SCHOLARSHIP_SESSIONS.find((s) => s.id === id) ?? MOCK_SCHOLARSHIP_SESSIONS[0]!
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
    },
  })
}

export function useDeleteScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/gddt/scholarship/sessions/${id}`, { method: 'DELETE' })
      } catch {
        const idx = MOCK_SCHOLARSHIP_SESSIONS.findIndex((s) => s.id === id)
        if (idx !== -1) MOCK_SCHOLARSHIP_SESSIONS.splice(idx, 1)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
    },
  })
}

export function useProcessScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      try {
        return await apiFetch<{ message: string }>(`/api/gddt/scholarship/sessions/${id}/process`, {
          method: 'POST',
        })
      } catch {
        const idx = MOCK_SCHOLARSHIP_SESSIONS.findIndex((s) => s.id === id)
        if (idx !== -1) {
          MOCK_SCHOLARSHIP_SESSIONS[idx] = { ...MOCK_SCHOLARSHIP_SESSIONS[idx]!, status: 'completed' }
        }
        return { message: 'Xử lý học bổng thành công.' }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
      void queryClient.invalidateQueries({ queryKey: ['scholarship-results'] })
    },
  })
}

// ─── Scholarship Results ───────────────────────────────────────

export function useGetScholarshipResults(filters: {
  sessionId?: string
  level?: string
  grade?: string
  q?: string
}) {
  return useQuery({
    queryKey: ['scholarship-results', filters],
    queryFn: async (): Promise<{
      data: ScholarshipResult[]
      summary: ScholarshipSummary
    }> => {
      try {
        const params = new URLSearchParams()
        if (filters.sessionId) params.set('sessionId', filters.sessionId)
        if (filters.level) params.set('level', filters.level)
        if (filters.grade) params.set('grade', filters.grade)
        if (filters.q) params.set('q', filters.q)
        return await apiFetch<{
          data: ScholarshipResult[]
          summary: ScholarshipSummary
        }>(`/api/gddt/scholarship/results?${params.toString()}`)
      } catch {
        let data = generateScholarshipResults(filters.sessionId ?? 'ss-1')
        if (filters.level) data = data.filter((r) => r.levelName === filters.level)
        if (filters.q) {
          const q = filters.q.toLowerCase()
          data = data.filter(
            (r) => r.studentName.toLowerCase().includes(q) || r.studentCode.toLowerCase().includes(q)
          )
        }
        const summary: ScholarshipSummary = {
          totalStudents: data.length,
          totalValue: data.reduce((s, r) => s + r.scholarshipValue, 0),
          percentage: Math.round((data.length / 40) * 100),
        }
        return { data, summary }
      }
    },
    enabled: !!filters.sessionId,
  })
}

export function useExportScholarshipResults() {
  return useMutation({
    mutationFn: async (filters: { sessionId: string; level?: string; grade?: string }) => {
      try {
        const params = new URLSearchParams()
        params.set('sessionId', filters.sessionId)
        if (filters.level) params.set('level', filters.level)
        if (filters.grade) params.set('grade', filters.grade)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
        const response = await fetch(
          `${baseUrl}/api/gddt/scholarship/results/export?${params.toString()}`
        )
        if (!response.ok) throw new Error('Export failed')
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `scholarship-results-${filters.sessionId}.xlsx`
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        // Mock: alert or no-op in dev environment
        console.warn('[Mock] Export scholarship results - API not available')
      }
    },
  })
}

export function useExportStudents() {
  return useMutation({
    mutationFn: async (classId: string) => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
        const response = await fetch(`${baseUrl}/api/gddt/classes/${classId}/students/export`)
        if (!response.ok) throw new Error('Export failed')
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `students-${classId}.xlsx`
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        console.warn('[Mock] Export students - API not available')
      }
    },
  })
}
