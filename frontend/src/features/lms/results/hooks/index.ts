import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  LearningResult,
  ContentProgress,
  StudentAssignmentResult,
  StudentExamResult,
  ActivityLogEntry,
} from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Mock data generators
// ─────────────────────────────────────────────────────────────────────────────

const STUDENT_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
  'Vũ Thị Phương', 'Đặng Văn Giang', 'Bùi Thị Hà', 'Đỗ Văn Hùng', 'Ngô Thị Lan',
  'Dương Văn Mạnh', 'Lý Thị Ngọc', 'Trịnh Văn Oanh', 'Phan Thị Phúc', 'Cao Văn Quân',
  'Đinh Thị Rằn', 'Tạ Văn Sơn', 'Lưu Thị Tâm', 'Hà Văn Thái', 'Mai Thị Uyên',
  'Quách Văn Việt', 'Tiêu Thị Xuân', 'Kiều Văn Yên', 'Chu Thị Zung', 'Tống Văn Anh',
  'Diệp Thị Bảo', 'Thái Văn Chiến', 'Mạc Thị Dịu', 'Khuất Văn Đức', 'Lương Thị Ến',
  'Văn Thị Phong', 'Nông Văn Ghi', 'Từ Thị Huyền', 'Thẩm Văn Inh', 'Khổng Thị Jỡi',
  'Ứng Văn Khỏe', 'Lão Thị Lanh', 'Nhâm Văn Minh',
]

const CONTENT_GROUPS = ['Chương 1: Tổng quan CSDL', 'Chương 2: Mô hình ERD', 'Chương 3: SQL cơ bản', 'Chương 4: SQL nâng cao', 'Chương 5: Normalization']
const CONTENT_NAMES = [
  'Giới thiệu cơ sở dữ liệu', 'Các hệ quản trị CSDL phổ biến', 'Mô hình ERD và ký hiệu',
  'Xác định Entities và Relationships', 'Cardinality và Participation', 'Chuyển ERD sang mô hình quan hệ',
  'DDL: CREATE TABLE, ALTER, DROP', 'DML: INSERT, UPDATE, DELETE', 'DQL: SELECT cơ bản',
  'JOIN operations', 'Subqueries', 'Aggregation & GROUP BY',
  'Window Functions', 'Stored Procedures', 'Triggers & Views',
  '1NF, 2NF, 3NF', 'BCNF', 'Dependency Analysis',
  'Transaction & ACID', 'Indexing', 'Query Optimization',
]

const CONTENT_TYPES: ContentProgress['contentType'][] = ['scorm', 'video', 'text', 'file']

// Seeded pseudo-random for consistency
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function generateLearningResults(classId: string): LearningResult[] {
  return STUDENT_NAMES.map((name, i) => {
    const r = seededRand(i * 7 + 1)
    const progress = Math.round(r * 80 + 20) // 20–100%
    const assignmentAvg = Math.round((seededRand(i * 3 + 2) * 4 + 6) * 10) / 10 // 6.0–10.0
    const examScore = i % 5 === 4 ? null : Math.round((seededRand(i * 5 + 3) * 4 + 5) * 10) / 10
    const finalScore =
      progress >= 80 && assignmentAvg !== null && examScore !== null
        ? Math.round((assignmentAvg * 0.4 + examScore * 0.6) * 10) / 10
        : null

    const completionStatus: LearningResult['completionStatus'] =
      progress === 100 && finalScore !== null
        ? 'completed'
        : progress > 30
        ? 'in_progress'
        : 'not_started'

    return {
      id: `result-${i + 1}`,
      studentId: `s-${i + 1}`,
      studentName: name,
      studentCode: `SV${String(i + 1).padStart(5, '0')}`,
      studentAvatar: undefined,
      classId,
      contentProgress: progress,
      assignmentAvg,
      examScore,
      finalScore,
      completionStatus,
      completedAt: completionStatus === 'completed' ? '2026-03-10T15:00:00Z' : undefined,
    }
  })
}

function generateContentProgress(studentId: string): ContentProgress[] {
  const idx = parseInt(studentId.replace('s-', ''), 10) - 1
  return CONTENT_NAMES.map((name, i) => {
    const r = seededRand(idx * 13 + i)
    const completed = r > 0.3
    const score: number | null =
      CONTENT_TYPES[i % 4] === 'scorm'
        ? Math.round((seededRand(idx * 7 + i) * 4 + 6) * 10) / 10
        : null
    const lastDate = new Date('2026-03-01')
    lastDate.setDate(lastDate.getDate() + i)

    return {
      id: `cp-${studentId}-${i + 1}`,
      contentGroupName: CONTENT_GROUPS[Math.floor(i / 4)] ?? CONTENT_GROUPS[0]!,
      contentName: name,
      contentType: CONTENT_TYPES[i % 4]!,
      accessCount: completed ? Math.floor(seededRand(i + 1) * 8) + 1 : Math.floor(seededRand(i + 1) * 2),
      studyTimeMinutes: completed
        ? Math.floor(seededRand(idx + i * 2) * 90) + 15
        : Math.floor(seededRand(idx + i * 2) * 10),
      score,
      completed,
      lastAccessedAt: completed || seededRand(idx + i) > 0.5 ? lastDate.toISOString() : undefined,
    }
  })
}

function generateAssignmentResults(studentId: string): StudentAssignmentResult[] {
  const idx = parseInt(studentId.replace('s-', ''), 10) - 1
  const assignments = [
    'Bài tập chương 1: Giới thiệu CSDL',
    'Bài tập chương 2: Mô hình ERD',
    'Bài luận giữa kỳ',
    'Bài tập chương 3: SQL cơ bản',
    'Bài tập chương 4: SQL nâng cao',
    'Bài tập nhóm: Xây dựng ứng dụng',
    'Bài tập chương 5: Normalization',
  ]

  return assignments.map((name, i) => {
    const r = seededRand(idx * 11 + i)
    const submitted = r > 0.15
    const score = submitted ? Math.round((seededRand(idx * 5 + i) * 4 + 6) * 10) / 10 : null
    const deadline = new Date('2026-03-01')
    deadline.setDate(deadline.getDate() + i * 7)
    const submittedDate = new Date(deadline)
    submittedDate.setDate(submittedDate.getDate() - Math.floor(seededRand(idx + i) * 3))

    return {
      id: `ar-${studentId}-${i + 1}`,
      assignmentName: name,
      deadline: deadline.toISOString().split('T')[0]!,
      submittedAt: submitted ? submittedDate.toISOString().split('T')[0]! : undefined,
      score,
      feedback:
        score !== null && score >= 8
          ? 'Bài làm xuất sắc, trình bày rõ ràng và đầy đủ.'
          : score !== null && score >= 6
          ? 'Đạt yêu cầu. Cần bổ sung thêm phần ví dụ minh họa.'
          : score !== null
          ? 'Cần xem lại và làm lại bài.'
          : undefined,
    }
  })
}

function generateExamResults(studentId: string): StudentExamResult[] {
  const idx = parseInt(studentId.replace('s-', ''), 10) - 1
  const sessions = [
    { name: 'Kiểm tra 15 phút - Tuần 4', date: '2026-02-25' },
    { name: 'Kiểm tra giữa kỳ - Tuần 8', date: '2026-03-12' },
    { name: 'Kiểm tra thực hành - Tuần 10', date: '2026-03-26' },
  ]

  return sessions.map((session, i) => {
    const r = seededRand(idx * 17 + i)
    return {
      id: `er-${studentId}-${i + 1}`,
      sessionName: session.name,
      takenAt: session.date,
      score: r > 0.1 ? Math.round((seededRand(idx * 7 + i + 1) * 5 + 5) * 10) / 10 : null,
      rank: r > 0.1 ? Math.floor(seededRand(idx + i * 3) * 35) + 1 : null,
      attemptId: r > 0.1 ? `attempt-${studentId}-${i + 1}` : undefined,
    }
  })
}

function generateActivityLog(studentId: string): ActivityLogEntry[] {
  const idx = parseInt(studentId.replace('s-', ''), 10) - 1
  const types: ActivityLogEntry['type'][] = ['access', 'submit', 'exam', 'login', 'access', 'access']
  const descriptions = [
    'Truy cập bài học: Giới thiệu cơ sở dữ liệu',
    'Nộp bài tập: Bài tập chương 1',
    'Tham gia thi: Kiểm tra 15 phút',
    'Đăng nhập hệ thống',
    'Xem video: SQL Joins Overview',
    'Truy cập tài liệu: ERD Notation Guide',
    'Nộp bài tập: Bài tập chương 2',
    'Xem SCORM: Normalization Tutorial',
    'Tham gia thi: Kiểm tra giữa kỳ',
    'Truy cập tài liệu: SQL Cheat Sheet',
    'Đăng nhập hệ thống',
    'Xem video: Transaction & ACID',
  ]

  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date('2026-03-12T08:00:00Z')
    date.setDate(date.getDate() - i)
    date.setHours(8 + (idx % 6) + (i % 4))

    return {
      id: `log-${studentId}-${i + 1}`,
      timestamp: date.toISOString(),
      type: types[(idx + i) % types.length]!,
      description: descriptions[(idx + i) % descriptions.length]!,
      durationMinutes:
        types[(idx + i) % types.length] === 'access' || types[(idx + i) % types.length] === 'exam'
          ? Math.floor(seededRand(idx + i) * 60) + 10
          : undefined,
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache for generated data (avoid regenerating on each call)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_RESULTS: Record<string, LearningResult[]> = {}
const MOCK_CONTENT_PROGRESS: Record<string, ContentProgress[]> = {}
const MOCK_ASSIGNMENT_RESULTS: Record<string, StudentAssignmentResult[]> = {}
const MOCK_EXAM_RESULTS: Record<string, StudentExamResult[]> = {}
const MOCK_ACTIVITY_LOGS: Record<string, ActivityLogEntry[]> = {}

function getOrGenerateResults(classId: string): LearningResult[] {
  if (!MOCK_RESULTS[classId]) MOCK_RESULTS[classId] = generateLearningResults(classId)
  return MOCK_RESULTS[classId]!
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch helpers
// ─────────────────────────────────────────────────────────────────────────────

async function fetchClassResults(
  classId: string,
  params?: { search?: string; semester?: string; year?: string }
): Promise<PaginatedResponse<LearningResult>> {
  try {
    return await apiFetch<PaginatedResponse<LearningResult>>(
      `/api/lms/classes/${classId}/results?${new URLSearchParams(params as Record<string, string>).toString()}`
    )
  } catch {
    let data = getOrGenerateResults(classId)
    if (params?.search) {
      const q = params.search.toLowerCase()
      data = data.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.studentCode.toLowerCase().includes(q)
      )
    }
    return {
      data,
      pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
    }
  }
}

async function fetchStudentResult(classId: string, studentId: string): Promise<ApiResponse<LearningResult>> {
  try {
    return await apiFetch<ApiResponse<LearningResult>>(`/api/lms/classes/${classId}/results/${studentId}`)
  } catch {
    const all = getOrGenerateResults(classId)
    const found = all.find((r) => r.studentId === studentId) ?? all[0]!
    return { data: found, success: true }
  }
}

async function fetchContentProgress(classId: string, studentId: string): Promise<ApiResponse<ContentProgress[]>> {
  try {
    return await apiFetch<ApiResponse<ContentProgress[]>>(`/api/lms/classes/${classId}/results/${studentId}/content`)
  } catch {
    if (!MOCK_CONTENT_PROGRESS[studentId]) {
      MOCK_CONTENT_PROGRESS[studentId] = generateContentProgress(studentId)
    }
    return { data: MOCK_CONTENT_PROGRESS[studentId]!, success: true }
  }
}

async function fetchAssignmentResults(classId: string, studentId: string): Promise<ApiResponse<StudentAssignmentResult[]>> {
  try {
    return await apiFetch<ApiResponse<StudentAssignmentResult[]>>(
      `/api/lms/classes/${classId}/results/${studentId}/assignments`
    )
  } catch {
    if (!MOCK_ASSIGNMENT_RESULTS[studentId]) {
      MOCK_ASSIGNMENT_RESULTS[studentId] = generateAssignmentResults(studentId)
    }
    return { data: MOCK_ASSIGNMENT_RESULTS[studentId]!, success: true }
  }
}

async function fetchExamResults(classId: string, studentId: string): Promise<ApiResponse<StudentExamResult[]>> {
  try {
    return await apiFetch<ApiResponse<StudentExamResult[]>>(
      `/api/lms/classes/${classId}/results/${studentId}/exams`
    )
  } catch {
    if (!MOCK_EXAM_RESULTS[studentId]) {
      MOCK_EXAM_RESULTS[studentId] = generateExamResults(studentId)
    }
    return { data: MOCK_EXAM_RESULTS[studentId]!, success: true }
  }
}

async function fetchActivityLog(classId: string, studentId: string): Promise<PaginatedResponse<ActivityLogEntry>> {
  try {
    return await apiFetch<PaginatedResponse<ActivityLogEntry>>(
      `/api/lms/classes/${classId}/results/${studentId}/activity-log`
    )
  } catch {
    if (!MOCK_ACTIVITY_LOGS[studentId]) {
      MOCK_ACTIVITY_LOGS[studentId] = generateActivityLog(studentId)
    }
    const data = MOCK_ACTIVITY_LOGS[studentId]!
    return {
      data,
      pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────────────────────────────────────

const keys = {
  results: (classId: string) => ['lms', 'results', classId] as const,
  studentResult: (classId: string, studentId: string) => ['lms', 'results', classId, studentId] as const,
  contentProgress: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'content'] as const,
  assignmentResults: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'assignments'] as const,
  examResults: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'exams'] as const,
  activityLog: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'activity'] as const,
  gradeBook: (classId: string) => ['lms', 'results', classId, 'gradebook'] as const,
  analytics: (classId: string) => ['lms', 'results', classId, 'analytics'] as const,
  atRisk: (classId: string) => ['lms', 'results', classId, 'at-risk'] as const,
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useGetClassResults(classId: string, params?: { search?: string; semester?: string; year?: string }) {
  return useQuery({
    queryKey: [...keys.results(classId), params],
    queryFn: () => fetchClassResults(classId, params),
    enabled: !!classId,
  })
}

export function useGetStudentResult(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.studentResult(classId, studentId),
    queryFn: () => fetchStudentResult(classId, studentId),
    enabled: !!classId && !!studentId,
  })
}

export function useGetContentProgress(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.contentProgress(classId, studentId),
    queryFn: () => fetchContentProgress(classId, studentId),
    enabled: !!classId && !!studentId,
  })
}

export function useGetStudentAssignmentResults(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.assignmentResults(classId, studentId),
    queryFn: () => fetchAssignmentResults(classId, studentId),
    enabled: !!classId && !!studentId,
  })
}

export function useGetStudentExamResults(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.examResults(classId, studentId),
    queryFn: () => fetchExamResults(classId, studentId),
    enabled: !!classId && !!studentId,
  })
}

export function useGetActivityLog(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.activityLog(classId, studentId),
    queryFn: () => fetchActivityLog(classId, studentId),
    enabled: !!classId && !!studentId,
  })
}

/**
 * Gradebook: full cross-table of all students × all assignments with scores.
 */
export function useGetGradeBook(classId: string) {
  return useQuery({
    queryKey: keys.gradeBook(classId),
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<GradeBookData>>(`/api/lms/classes/${classId}/gradebook`)
      } catch {
        return buildMockGradeBook(classId)
      }
    },
    enabled: !!classId,
  })
}

/**
 * Class-wide analytics: performance overview, score distribution, trends.
 */
export function useGetClassAnalytics(classId: string) {
  return useQuery({
    queryKey: keys.analytics(classId),
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<ClassAnalytics>>(`/api/lms/classes/${classId}/analytics`)
      } catch {
        return buildMockAnalytics(classId)
      }
    },
    enabled: !!classId,
  })
}

/**
 * At-risk students: low progress, no submissions, or failing grades.
 */
export function useGetAtRiskStudents(classId: string) {
  return useQuery({
    queryKey: keys.atRisk(classId),
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<AtRiskStudent[]>>(`/api/lms/classes/${classId}/at-risk`)
      } catch {
        const results = getOrGenerateResults(classId)
        const atRisk: AtRiskStudent[] = results
          .filter(
            (r) =>
              r.contentProgress < 40 ||
              (r.assignmentAvg !== null && r.assignmentAvg < 5) ||
              r.completionStatus === 'not_started'
          )
          .map((r) => ({
            studentId: r.studentId,
            studentName: r.studentName,
            studentCode: r.studentCode,
            contentProgress: r.contentProgress,
            assignmentAvg: r.assignmentAvg,
            lastActive: '2026-02-28T10:00:00Z',
            riskReasons: [
              ...(r.contentProgress < 40 ? ['Tiến độ học thấp (<40%)'] : []),
              ...(r.assignmentAvg !== null && r.assignmentAvg < 5 ? ['Điểm bài tập trung bình dưới 5'] : []),
              ...(r.completionStatus === 'not_started' ? ['Chưa bắt đầu học'] : []),
            ],
          }))
        return { data: atRisk, success: true }
      }
    },
    enabled: !!classId,
  })
}

export function useCompleteResult(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentIds: string[]; complete: boolean }) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/results/complete`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.results(classId) })
    },
  })
}

export function useUpdateTranscript(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentIds: string[]; semester: string; overwrite?: boolean }) =>
      apiFetch<ApiResponse<{ success: number; failed: number }>>(
        `/api/lms/classes/${classId}/results/update-transcript`,
        { method: 'POST', body: JSON.stringify(data) }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.results(classId) })
    },
  })
}

export function useSendNotification(classId: string) {
  return useMutation({
    mutationFn: (data: { studentId: string; title: string; content: string; channels: string[] }) =>
      apiFetch<ApiResponse<void>>(
        `/api/lms/classes/${classId}/results/${data.studentId}/notify`,
        { method: 'POST', body: JSON.stringify(data) }
      ),
  })
}

export function useAddExamAttempt(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentId: string; sessionId: string; count: number; note?: string }) =>
      apiFetch<ApiResponse<void>>(
        `/api/lms/classes/${classId}/results/${data.studentId}/add-exam-attempt`,
        { method: 'POST', body: JSON.stringify(data) }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.results(classId) })
    },
  })
}

/**
 * Export gradebook to Excel/CSV.
 */
export function useExportResults(classId: string) {
  return useMutation({
    mutationFn: (format: 'xlsx' | 'csv') =>
      apiFetch<Blob>(`/api/lms/classes/${classId}/results/export?format=${format}`),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GradeBook types & builder
// ─────────────────────────────────────────────────────────────────────────────

export interface GradeBookAssignment {
  id: string
  title: string
  maxScore: number
  deadline: string
}

export interface GradeBookRow {
  studentId: string
  studentName: string
  studentCode: string
  scores: Record<string, number | null>  // assignmentId -> score
  assignmentAvg: number | null
  examScore: number | null
  finalScore: number | null
}

export interface GradeBookData {
  assignments: GradeBookAssignment[]
  rows: GradeBookRow[]
  classStats: {
    avgScore: number
    minScore: number
    maxScore: number
    passRate: number
    distribution: { range: string; count: number }[]
  }
}

function buildMockGradeBook(classId: string): ApiResponse<GradeBookData> {
  const assignments: GradeBookAssignment[] = Array.from({ length: 7 }, (_, i) => ({
    id: `asgn-${i + 1}`,
    title: [
      'BT Chương 1', 'BT Chương 2', 'Bài luận GK', 'BT Chương 3',
      'BT Chương 4', 'BT Nhóm', 'BT Chương 5',
    ][i]!,
    maxScore: i === 2 ? 20 : i === 5 ? 20 : 10,
    deadline: new Date(2026, 1, 10 + i * 7).toISOString().split('T')[0]!,
  }))

  const students = STUDENT_NAMES.map((name, i) => ({
    id: `s-${i + 1}`,
    name,
    code: `SV${String(i + 1).padStart(5, '0')}`,
  }))

  const rows: GradeBookRow[] = students.map(({ id, name, code }, si) => {
    const scores: Record<string, number | null> = {}
    let sum = 0
    let cnt = 0

    assignments.forEach((a, ai) => {
      const r = seededRand(si * 23 + ai)
      const score = r > 0.12 ? Math.round((r * 4 + 6) * 10) / 10 : null
      scores[a.id] = score
      if (score !== null) { sum += score; cnt++ }
    })

    const assignmentAvg = cnt > 0 ? Math.round((sum / cnt) * 10) / 10 : null
    const examScore = si % 5 === 4 ? null : Math.round((seededRand(si * 5 + 3) * 4 + 5) * 10) / 10
    const finalScore =
      assignmentAvg !== null && examScore !== null
        ? Math.round((assignmentAvg * 0.4 + examScore * 0.6) * 10) / 10
        : null

    return { studentId: id, studentName: name, studentCode: code, scores, assignmentAvg, examScore, finalScore }
  })

  const allFinalScores = rows.map((r) => r.finalScore).filter((s): s is number => s !== null)
  const avg = allFinalScores.length ? allFinalScores.reduce((a, b) => a + b, 0) / allFinalScores.length : 0
  const passRate = allFinalScores.length
    ? (allFinalScores.filter((s) => s >= 5).length / allFinalScores.length) * 100
    : 0
  const distribution = [
    { range: '0-4', count: allFinalScores.filter((s) => s < 5).length },
    { range: '5-6', count: allFinalScores.filter((s) => s >= 5 && s < 7).length },
    { range: '7-8', count: allFinalScores.filter((s) => s >= 7 && s < 9).length },
    { range: '9-10', count: allFinalScores.filter((s) => s >= 9).length },
  ]

  return {
    success: true,
    data: {
      assignments,
      rows,
      classStats: {
        avgScore: Math.round(avg * 10) / 10,
        minScore: allFinalScores.length ? Math.min(...allFinalScores) : 0,
        maxScore: allFinalScores.length ? Math.max(...allFinalScores) : 0,
        passRate: Math.round(passRate * 10) / 10,
        distribution,
      },
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics types & builder
// ─────────────────────────────────────────────────────────────────────────────

export interface ClassAnalytics {
  overview: {
    totalStudents: number
    completed: number
    inProgress: number
    notStarted: number
    avgContentProgress: number
    avgAssignmentScore: number | null
    avgExamScore: number | null
    avgFinalScore: number | null
    submissionRate: number
  }
  weeklyActivity: { week: string; logins: number; submissions: number; studyMinutes: number }[]
  scoreDistribution: { range: string; count: number; percent: number }[]
  assignmentStats: { name: string; submitted: number; notSubmitted: number; avgScore: number; passRate: number }[]
  examStats: { name: string; taken: number; avgScore: number; highest: number; lowest: number; passRate: number }[]
  contentEngagement: { groupName: string; avgProgress: number; avgTime: number; accessCount: number }[]
  trendMonthly: { month: string; avgScore: number; completionRate: number }[]
}

function buildMockAnalytics(classId: string): ApiResponse<ClassAnalytics> {
  const results = getOrGenerateResults(classId)
  const total = results.length
  const completed = results.filter((r) => r.completionStatus === 'completed').length
  const inProgress = results.filter((r) => r.completionStatus === 'in_progress').length
  const notStarted = results.filter((r) => r.completionStatus === 'not_started').length

  const progressValues = results.map((r) => r.contentProgress)
  const avgProgress = Math.round(progressValues.reduce((a, b) => a + b, 0) / total)

  const assignmentScores = results.map((r) => r.assignmentAvg).filter((s): s is number => s !== null)
  const avgAssignment = assignmentScores.length
    ? Math.round((assignmentScores.reduce((a, b) => a + b, 0) / assignmentScores.length) * 10) / 10
    : null

  const examScores = results.map((r) => r.examScore).filter((s): s is number => s !== null)
  const avgExam = examScores.length
    ? Math.round((examScores.reduce((a, b) => a + b, 0) / examScores.length) * 10) / 10
    : null

  const finalScores = results.map((r) => r.finalScore).filter((s): s is number => s !== null)
  const avgFinal = finalScores.length
    ? Math.round((finalScores.reduce((a, b) => a + b, 0) / finalScores.length) * 10) / 10
    : null

  const weeklyActivity = Array.from({ length: 8 }, (_, i) => {
    const week = new Date('2026-01-12')
    week.setDate(week.getDate() + i * 7)
    return {
      week: `Tuần ${i + 1}`,
      logins: Math.floor(seededRand(i * 7) * 150) + 50,
      submissions: Math.floor(seededRand(i * 5 + 1) * 35) + 5,
      studyMinutes: Math.floor(seededRand(i * 3 + 2) * 2000) + 500,
    }
  })

  const dist = [
    { range: '< 5 (Trượt)', count: finalScores.filter((s) => s < 5).length },
    { range: '5-6 (TB)', count: finalScores.filter((s) => s >= 5 && s < 7).length },
    { range: '7-8 (Khá)', count: finalScores.filter((s) => s >= 7 && s < 9).length },
    { range: '9-10 (Giỏi)', count: finalScores.filter((s) => s >= 9).length },
  ].map((d) => ({
    ...d,
    percent: finalScores.length ? Math.round((d.count / finalScores.length) * 100) : 0,
  }))

  const assignmentStats = [
    'BT Chương 1', 'BT Chương 2', 'Bài luận GK', 'BT Chương 3', 'BT Chương 4',
  ].map((name, i) => ({
    name,
    submitted: total - Math.floor(seededRand(i * 3) * 5),
    notSubmitted: Math.floor(seededRand(i * 3) * 5),
    avgScore: Math.round((seededRand(i * 7 + 1) * 3 + 7) * 10) / 10,
    passRate: Math.round((seededRand(i * 5 + 2) * 20 + 75) * 10) / 10,
  }))

  const examStats = [
    { name: 'Kiểm tra 15 phút' },
    { name: 'Kiểm tra giữa kỳ' },
    { name: 'Kiểm tra thực hành' },
  ].map(({ name }, i) => {
    const scores = examScores.slice(i * 5, i * 5 + 35)
    return {
      name,
      taken: total - Math.floor(seededRand(i + 1) * 3),
      avgScore: Math.round((seededRand(i * 9 + 1) * 3 + 6.5) * 10) / 10,
      highest: Math.round((seededRand(i * 11 + 2) * 1 + 9) * 10) / 10,
      lowest: Math.round((seededRand(i * 13 + 3) * 2 + 3) * 10) / 10,
      passRate: Math.round((seededRand(i * 7 + 4) * 20 + 70) * 10) / 10,
    }
  })

  const contentEngagement = CONTENT_GROUPS.map((group, i) => ({
    groupName: group,
    avgProgress: Math.round(seededRand(i * 11) * 40 + 60),
    avgTime: Math.floor(seededRand(i * 7 + 1) * 50) + 20,
    accessCount: Math.floor(seededRand(i * 5 + 2) * 200) + 50,
  }))

  const trendMonthly = ['Tháng 1', 'Tháng 2', 'Tháng 3'].map((month, i) => ({
    month,
    avgScore: Math.round((seededRand(i * 13 + 1) * 2 + 6.5) * 10) / 10,
    completionRate: Math.round(seededRand(i * 7 + 2) * 40 + 40),
  }))

  return {
    success: true,
    data: {
      overview: {
        totalStudents: total,
        completed,
        inProgress,
        notStarted,
        avgContentProgress: avgProgress,
        avgAssignmentScore: avgAssignment,
        avgExamScore: avgExam,
        avgFinalScore: avgFinal,
        submissionRate: 87.5,
      },
      weeklyActivity,
      scoreDistribution: dist,
      assignmentStats,
      examStats,
      contentEngagement,
      trendMonthly,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// At-risk type
// ─────────────────────────────────────────────────────────────────────────────

export interface AtRiskStudent {
  studentId: string
  studentName: string
  studentCode: string
  contentProgress: number
  assignmentAvg: number | null
  lastActive: string
  riskReasons: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Composable feature hooks (re-export for convenience)
// ─────────────────────────────────────────────────────────────────────────────
export { useClassResults } from './useClassResults'
export { useStudentResult } from './useStudentResult'
export { useClassAnalytics } from './useClassAnalytics'
