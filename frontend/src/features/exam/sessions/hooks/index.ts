import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  ExamSession,
  SessionExam,
  SessionStudent,
  ExamAttempt,
  AttemptAnswer,
  SessionCategory,
  SessionStatus,
  AttemptStatus,
} from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePaginated<T>(data: T[]): PaginatedResponse<T> {
  return {
    data,
    pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
  }
}

function makeApiResponse<T>(data: T): ApiResponse<T> {
  return { data, success: true }
}

// ── Mock Session Categories ──────────────────────────────────────────────────

const MOCK_SESSION_CATEGORIES: SessionCategory[] = [
  {
    id: 'sc-2024', name: '2024-2025',
    children: [
      { id: 'sc-2024-hk1', name: 'Học kỳ 1', parentId: 'sc-2024' },
      { id: 'sc-2024-hk2', name: 'Học kỳ 2', parentId: 'sc-2024' },
    ],
  },
  {
    id: 'sc-2025', name: '2025-2026',
    children: [
      { id: 'sc-2025-hk1', name: 'Học kỳ 1', parentId: 'sc-2025' },
      { id: 'sc-2025-hk2', name: 'Học kỳ 2', parentId: 'sc-2025' },
    ],
  },
  {
    id: 'sc-2026', name: '2026-2027',
    children: [
      { id: 'sc-2026-hk1', name: 'Học kỳ 1', parentId: 'sc-2026' },
    ],
  },
]

// ── Mock Sessions ─────────────────────────────────────────────────────────────

const SESSION_STATUS_CYCLE: SessionStatus[] = ['preparing', 'preparing', 'active', 'completed', 'completed', 'completed']
const SESSION_NAMES = [
  'Kiểm tra 15 phút đợt 1', 'Kiểm tra 1 tiết lần 1',
  'Kiểm tra giữa kỳ', 'Kiểm tra 1 tiết lần 2',
  'Kiểm tra 15 phút đợt 2', 'Kiểm tra cuối kỳ',
]
const CAT_IDS_MAP = ['sc-2024-hk1', 'sc-2024-hk2', 'sc-2025-hk1', 'sc-2025-hk2', 'sc-2026-hk1']
const CAT_NAMES_MAP = [
  'HK1 – 2024-2025', 'HK2 – 2024-2025',
  'HK1 – 2025-2026', 'HK2 – 2025-2026',
  'HK1 – 2026-2027',
]

const MOCK_SESSIONS: ExamSession[] = Array.from({ length: 18 }, (_, i): ExamSession => {
  const catIdx = Math.floor(i / 4) % CAT_IDS_MAP.length
  const yearBase = 2024 + Math.floor(i / 6)
  const monthStr = String(Math.min(9, (i % 6) + 1)).padStart(2, '0')
  const dayStart = String(Math.min(28, i * 2 + 1)).padStart(2, '0')
  const dayEnd = String(Math.min(28, i * 2 + 5)).padStart(2, '0')
  return {
    id: `session-${i}`,
    name: `${SESSION_NAMES[i % SESSION_NAMES.length]!} (${yearBase}-${yearBase + 1})`,
    categoryId: CAT_IDS_MAP[catIdx],
    categoryName: CAT_NAMES_MAP[catIdx],
    academicYear: `${yearBase}-${yearBase + 1}`,
    semester: String((i % 2) + 1),
    startDate: `2026-${monthStr}-${dayStart}`,
    endDate: `2026-${monthStr}-${dayEnd}`,
    description: `Đợt kiểm tra định kỳ tháng ${(i % 6) + 3} năm học ${yearBase}-${yearBase + 1}`,
    examCount: 3 + (i % 8),
    studentCount: 80 + i * 15,
    status: SESSION_STATUS_CYCLE[i % SESSION_STATUS_CYCLE.length]!,
    showAnswersAfter: i % 3 === 0 ? `2026-${monthStr}-28` : undefined,
    showScoreImmediately: i % 3 !== 0,
    createdAt: `2026-${monthStr}-01`,
  }
})

// ── Mock Session Exams ────────────────────────────────────────────────────────

const ROOMS = ['P.101', 'P.102', 'P.103', 'P.104', 'P.201', 'P.202', 'P.203', 'Hội trường A', 'Hội trường B']
const EXAM_PAPER_NAMES = [
  'Đề thi Toán GK1', 'Đề thi Vật lý GK1', 'Đề thi Hóa học GK1', 'Đề thi Ngữ văn GK1',
  'Đề thi Tiếng Anh GK1', 'Đề thi Sinh học GK1', 'Đề thi Lịch sử GK1', 'Đề thi Địa lý GK1',
]
const SESSION_START_TIMES = ['07:00', '09:00', '13:30', '15:30']
const SESSION_DURATIONS = [45, 60, 90, 120]
const SHIFT_NAMES = ['Sáng', 'Trưa', 'Chiều', 'Tối']
const SUPERVISOR_NAMES = ['GV. Nguyễn Văn A', 'GV. Trần Thị B', 'GV. Lê Hoàng C', 'GV. Phạm Thu D', 'GV. Hoàng Minh E']
const SE_STATUS_CYCLE: SessionStatus[] = ['preparing', 'preparing', 'active', 'completed', 'completed', 'completed']

const MOCK_SESSION_EXAMS: Record<string, SessionExam[]> = Object.fromEntries(
  Array.from({ length: 18 }, (_, si): [string, SessionExam[]] => {
    const count = 3 + (si % 6)
    const exams: SessionExam[] = Array.from({ length: count }, (_, i): SessionExam => {
      const dateMonth = String(Math.min(9, (si % 6) + 1)).padStart(2, '0')
      const dateDay = String(Math.min(28, si + i + 1)).padStart(2, '0')
      return {
        id: `se-${si}-${i}`,
        sessionId: `session-${si}`,
        name: `Ca ${i + 1} – ${SHIFT_NAMES[i % 4]}`,
        examPaperId: `exam-${(si + i) % 25}`,
        examPaperName: EXAM_PAPER_NAMES[(si + i) % EXAM_PAPER_NAMES.length]!,
        examDate: `2026-${dateMonth}-${dateDay}`,
        startTime: SESSION_START_TIMES[i % 4]!,
        durationMinutes: SESSION_DURATIONS[i % 4]!,
        room: ROOMS[(si + i) % ROOMS.length],
        supervisors: [
          { id: `sup-${(si + i) % 5}`, name: SUPERVISOR_NAMES[(si + i) % SUPERVISOR_NAMES.length]! },
          ...(si % 3 === 0 ? [{ id: `sup-${(si + i + 1) % 5}`, name: SUPERVISOR_NAMES[(si + i + 1) % SUPERVISOR_NAMES.length]! }] : []),
        ],
        maxStudents: 35 + (i % 3) * 5,
        studentCount: 28 + (si + i) % 10,
        status: SE_STATUS_CYCLE[(si + i) % SE_STATUS_CYCLE.length]!,
        notes: si % 4 === 0 ? 'Phòng máy lạnh, cần kiểm tra trước 30 phút' : undefined,
      }
    })
    return [`session-${si}`, exams]
  })
)

// ── Mock Session Students ─────────────────────────────────────────────────────

const STUDENT_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
  'Vũ Thị Phương', 'Đặng Minh Quang', 'Bùi Thị Hoa', 'Ngô Đức Hùng', 'Lý Thị Kim',
  'Trương Văn Long', 'Mai Thị Ngọc', 'Đinh Văn Phúc', 'Dương Thị Quỳnh', 'Hồ Văn Sơn',
  'Phan Thị Thảo', 'Lâu Văn Ước', 'Cao Thị Vân', 'Trịnh Văn Xuân', 'Từ Thị Yến',
  'Kiều Văn Anh', 'Đoàn Thị Bé', 'Tô Văn Chiến', 'Lê Thị Diệu', 'Hà Văn Giang',
  'Tăng Thị Hiền', 'Mạc Văn Khoa', 'Liêu Thị Lan', 'Ninh Văn Minh', 'Trần Ngọc Nhung',
  'Phùng Văn Oanh', 'Nghiêm Thị Phú', 'Chử Văn Quyết', 'Đỗ Thị Ru', 'Bùi Văn Sang',
]
const CLASS_NAMES = ['10A1', '10A2', '11A1', '11A2', '11A3', '12A1', '12A2', '12A3', '12A4']
const ATTEMPT_STATUS_CYCLE: AttemptStatus[] = ['not_started', 'not_started', 'submitted', 'graded', 'graded', 'graded']

const MOCK_SESSION_STUDENTS: Record<string, SessionStudent[]> = {}
for (let si = 0; si < 18; si++) {
  const sessionExams = MOCK_SESSION_EXAMS[`session-${si}`] ?? []
  for (const se of sessionExams) {
    const students: SessionStudent[] = Array.from({ length: se.studentCount }, (_, i): SessionStudent => {
      const attemptStatus = ATTEMPT_STATUS_CYCLE[(si + i) % ATTEMPT_STATUS_CYCLE.length]!
      const isGraded = attemptStatus === 'graded'
      const isSubmitted = attemptStatus === 'submitted' || isGraded
      const hasException = i === 2 || i === 7 || i === 15
      return {
        id: `ss-${se.id}-${i}`,
        sessionExamId: se.id,
        studentId: `student-${i}`,
        studentName: STUDENT_NAMES[i % STUDENT_NAMES.length]!,
        studentCode: `HS${String(i + 1).padStart(4, '0')}`,
        className: CLASS_NAMES[i % CLASS_NAMES.length]!,
        registrationNumber: String(100 + i),
        room: se.room,
        seatNumber: String(i + 1),
        extraTimeMinutes: hasException ? (i === 2 ? 15 : i === 7 ? 20 : 30) : 0,
        extraAttempts: 0,
        exceptionNote: hasException
          ? (i === 2 ? 'Khuyết tật vận động' : i === 7 ? 'Khiếm thị nhẹ' : 'Hoàn cảnh đặc biệt')
          : undefined,
        attemptStatus,
        score: isGraded ? Math.round((5 + Math.random() * 5) * 10) / 10 : null,
        attemptId: isSubmitted ? `attempt-${se.id}-${i}` : undefined,
      }
    })
    MOCK_SESSION_STUDENTS[se.id] = students
  }
}

// ── Mock Attempts ─────────────────────────────────────────────────────────────

const Q_CONTENTS = [
  'Bào quan nào được gọi là "nhà máy năng lượng" của tế bào?',
  'Công thức hóa học của nước là gì?',
  'Ai là người phát minh ra 3 định luật về chuyển động?',
  'Axit nucleic nào mang thông tin di truyền trong tế bào?',
  'Quá trình tổng hợp chất hữu cơ từ CO₂ và H₂O nhờ ánh sáng gọi là gì?',
  'Đại lượng có cả độ lớn và hướng gọi là đại lượng gì?',
  'Hạt mang điện tích âm trong nguyên tử là hạt nào?',
  'Nguyên tố chiếm tỉ lệ 21% trong không khí là gì?',
  'Nguyên tố nào là thành phần chính của kim cương?',
  'Chất nào là thành phần chủ yếu cấu tạo nên enzyme?',
]

function buildAttempt(attemptId: string, sessionExamId: string, studentId: string, studentName: string): ExamAttempt {
  const seed = parseInt(studentId.replace('student-', ''), 10) || 0
  const OPTIONS = ['a', 'b', 'c', 'd'] as const
  const answers: AttemptAnswer[] = Array.from({ length: 10 }, (_, i): AttemptAnswer => {
    const correctId = `q${i}-a`
    const selectedId = `q${i}-${OPTIONS[(seed + i) % 4]!}`
    const isCorrect = selectedId === correctId
    return {
      questionId: `q-${i}`,
      questionContent: Q_CONTENTS[i % Q_CONTENTS.length]!,
      questionType: 'single_choice',
      selectedOptionIds: [selectedId],
      correctOptionIds: [correctId],
      isCorrect,
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      explanation: `Đáp án đúng là A. ${Q_CONTENTS[i % Q_CONTENTS.length]}`,
    }
  })
  const correctCount = answers.filter((a) => a.isCorrect).length
  const totalScore = answers.reduce((s, a) => s + (a.score ?? 0), 0)
  const submittedMin = 38 + (seed % 20)
  return {
    id: attemptId,
    sessionExamId,
    studentId,
    studentName,
    startedAt: '2026-03-15T07:00:00',
    submittedAt: `2026-03-15T07:${String(submittedMin).padStart(2, '0')}:00`,
    score: totalScore,
    correctCount,
    totalQuestions: 10,
    timeSpentMinutes: 35 + (seed % 15),
    rank: (seed % 35) + 1,
    answers,
  }
}

// ── Query Keys ──────────────────────────────────────────────────────────────

const keys = {
  categories: ['exam', 'session-categories'] as const,
  sessions: ['exam', 'sessions'] as const,
  sessionList: (params?: object) => ['exam', 'sessions', 'list', params] as const,
  session: (id: string) => ['exam', 'sessions', id] as const,
  sessionExams: (sessionId: string) => ['exam', 'sessions', sessionId, 'exams'] as const,
  sessionStudents: (sessionId: string, examId: string) => ['exam', 'sessions', sessionId, 'exams', examId, 'students'] as const,
  attempts: (sessionExamId: string) => ['exam', 'attempts', sessionExamId] as const,
  attempt: (attemptId: string) => ['exam', 'attempt', attemptId] as const,
  stats: (sessionId: string) => ['exam', 'sessions', sessionId, 'stats'] as const,
}

// ── Category Hooks ───────────────────────────────────────────────────────────

export function useGetSessionCategories() {
  return useQuery({
    queryKey: keys.categories,
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<SessionCategory[]>>('/api/exam/session-categories')
      } catch {
        return makeApiResponse(MOCK_SESSION_CATEGORIES)
      }
    },
  })
}

export function useCreateSessionCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; parentId?: string }) =>
      apiFetch<ApiResponse<SessionCategory>>('/api/exam/session-categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}

export function useUpdateSessionCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; parentId?: string }) =>
      apiFetch<ApiResponse<SessionCategory>>(`/api/exam/session-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}

export function useDeleteSessionCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/session-categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}

// ── Session CRUD ─────────────────────────────────────────────────────────────

export function useGetSessions(params?: { categoryId?: string; status?: string; q?: string }) {
  return useQuery({
    queryKey: keys.sessionList(params),
    queryFn: async () => {
      try {
        return await apiFetch<PaginatedResponse<ExamSession>>(
          `/api/exam/sessions?${new URLSearchParams((params ?? {}) as Record<string, string>).toString()}`
        )
      } catch {
        let data = [...MOCK_SESSIONS]
        if (params?.status) data = data.filter((s) => s.status === params.status)
        if (params?.categoryId) data = data.filter((s) => s.categoryId === params.categoryId)
        if (params?.q) {
          const q = params.q.toLowerCase()
          data = data.filter((s) => s.name.toLowerCase().includes(q))
        }
        return makePaginated(data)
      }
    },
  })
}

export function useGetSession(id: string) {
  return useQuery({
    queryKey: keys.session(id),
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<ExamSession>>(`/api/exam/sessions/${id}`)
      } catch {
        const found = MOCK_SESSIONS.find((s) => s.id === id) ?? MOCK_SESSIONS[0]!
        return makeApiResponse(found)
      }
    },
    enabled: !!id,
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamSession>) =>
      apiFetch<ApiResponse<ExamSession>>('/api/exam/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessions }) },
  })
}

export function useUpdateSession(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamSession>) =>
      apiFetch<ApiResponse<ExamSession>>(`/api/exam/sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.sessions })
      qc.invalidateQueries({ queryKey: keys.session(id) })
    },
  })
}

export function useDeleteSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/sessions/${sessionId}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessions }) },
  })
}

export function useActivateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<ApiResponse<ExamSession>>(`/api/exam/sessions/${sessionId}/activate`, { method: 'POST' }),
    onSuccess: (_, sessionId) => {
      qc.invalidateQueries({ queryKey: keys.sessions })
      qc.invalidateQueries({ queryKey: keys.session(sessionId) })
    },
  })
}

export function useCompleteSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<ApiResponse<ExamSession>>(`/api/exam/sessions/${sessionId}/complete`, { method: 'POST' }),
    onSuccess: (_, sessionId) => {
      qc.invalidateQueries({ queryKey: keys.sessions })
      qc.invalidateQueries({ queryKey: keys.session(sessionId) })
    },
  })
}

// ── Session Exam CRUD ────────────────────────────────────────────────────────

export function useGetSessionExams(sessionId: string) {
  return useQuery({
    queryKey: keys.sessionExams(sessionId),
    queryFn: async () => {
      try {
        return await apiFetch<PaginatedResponse<SessionExam>>(`/api/exam/sessions/${sessionId}/exams`)
      } catch {
        const data = MOCK_SESSION_EXAMS[sessionId] ?? []
        return makePaginated(data)
      }
    },
    enabled: !!sessionId,
  })
}

export function useCreateSessionExam(sessionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SessionExam>) =>
      apiFetch<ApiResponse<SessionExam>>(`/api/exam/sessions/${sessionId}/exams`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionExams(sessionId) }) },
  })
}

export function useUpdateSessionExam(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SessionExam>) =>
      apiFetch<ApiResponse<SessionExam>>(`/api/exam/sessions/${sessionId}/exams/${examId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionExams(sessionId) }) },
  })
}

export function useDeleteSessionExam(sessionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/sessions/${sessionId}/exams/${examId}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionExams(sessionId) }) },
  })
}

export function useImportSessionExams(sessionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<ApiResponse<{ success: number; failed: number; errors: string[] }>>(
        `/api/exam/sessions/${sessionId}/exams/import`,
        { method: 'POST', body: formData, headers: {} }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionExams(sessionId) }) },
  })
}

// ── Session Student Hooks ────────────────────────────────────────────────────

export function useGetSessionStudents(sessionId: string, examId: string) {
  return useQuery({
    queryKey: keys.sessionStudents(sessionId, examId),
    queryFn: async () => {
      try {
        return await apiFetch<PaginatedResponse<SessionStudent>>(
          `/api/exam/sessions/${sessionId}/exams/${examId}/students`
        )
      } catch {
        const data = MOCK_SESSION_STUDENTS[examId] ?? []
        return makePaginated(data)
      }
    },
    enabled: !!sessionId && !!examId,
  })
}

export function useAddSessionStudents(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentIds: string[] }) =>
      apiFetch<ApiResponse<void>>(
        `/api/exam/sessions/${sessionId}/exams/${examId}/students`,
        { method: 'POST', body: JSON.stringify(data) }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

export function useRemoveSessionStudent(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentId: string) =>
      apiFetch<ApiResponse<void>>(
        `/api/exam/sessions/${sessionId}/exams/${examId}/students/${studentId}`,
        { method: 'DELETE' }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

export function useUpdateStudentException(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      studentId: string
      extraTimeMinutes: number
      extraAttempts: number
      privateRoom?: boolean
      specialSupport?: boolean
      note?: string
    }) =>
      apiFetch<ApiResponse<void>>(
        `/api/exam/sessions/${sessionId}/exams/${examId}/students/${data.studentId}/exception`,
        { method: 'PUT', body: JSON.stringify(data) }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

export function useImportStudents(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<ApiResponse<{ success: number; failed: number; errors: string[] }>>(
        `/api/exam/sessions/${sessionId}/exams/${examId}/students/import`,
        { method: 'POST', body: formData, headers: {} }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

export function useImportExceptions(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<ApiResponse<{ success: number; failed: number; errors: string[] }>>(
        `/api/exam/sessions/${sessionId}/exams/${examId}/students/exceptions/import`,
        { method: 'POST', body: formData, headers: {} }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

export function useImportSessionStudents(sessionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<ApiResponse<{ success: number; failed: number; errors: string[] }>>(
        `/api/exam/sessions/${sessionId}/students/import`,
        { method: 'POST', body: formData, headers: {} }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessions }) },
  })
}

// ── Attempt Hooks ────────────────────────────────────────────────────────────

export function useGetAttempts(sessionExamId: string) {
  return useQuery({
    queryKey: keys.attempts(sessionExamId),
    queryFn: async () => {
      try {
        return await apiFetch<PaginatedResponse<ExamAttempt>>(
          `/api/exam/session-exams/${sessionExamId}/attempts`
        )
      } catch {
        const students = MOCK_SESSION_STUDENTS[sessionExamId] ?? []
        const data = students
          .filter((s) => s.attemptId)
          .map((s) => buildAttempt(s.attemptId!, sessionExamId, s.studentId, s.studentName))
        return makePaginated(data)
      }
    },
    enabled: !!sessionExamId,
  })
}

export function useGetAttempt(attemptId: string) {
  return useQuery({
    queryKey: keys.attempt(attemptId),
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<ExamAttempt>>(`/api/exam/attempts/${attemptId}`)
      } catch {
        // Parse out student index from attemptId: "attempt-{seId}-{idx}"
        const parts = attemptId.split('-')
        const studentIdx = parseInt(parts[parts.length - 1] ?? '0', 10)
        const studentName = STUDENT_NAMES[studentIdx % STUDENT_NAMES.length] ?? 'Học sinh'
        return makeApiResponse(buildAttempt(attemptId, 'se-0-0', `student-${studentIdx}`, studentName))
      }
    },
    enabled: !!attemptId,
  })
}

export function useGradeEssay(attemptId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { questionId: string; score: number; feedback?: string }) =>
      apiFetch<ApiResponse<void>>(`/api/exam/attempts/${attemptId}/grade`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.attempt(attemptId) })
    },
  })
}

export function useBulkGradeEssay(attemptId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { grades: { questionId: string; score: number; feedback?: string }[] }) =>
      apiFetch<ApiResponse<void>>(`/api/exam/attempts/${attemptId}/grade-bulk`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.attempt(attemptId) })
    },
  })
}

export function useResetAttempt() {
  return useMutation({
    mutationFn: (data: { sessionExamId: string; studentId: string }) =>
      apiFetch<ApiResponse<void>>(
        `/api/exam/session-exams/${data.sessionExamId}/students/${data.studentId}/reset`,
        { method: 'POST' }
      ),
  })
}

// ── Stats Hooks ──────────────────────────────────────────────────────────────

export function useGetSessionStats(sessionId: string) {
  return useQuery({
    queryKey: keys.stats(sessionId),
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<{
          totalStudents: number
          submitted: number
          graded: number
          notStarted: number
          avgScore: number
          medianScore: number
          passRate: number
          scoreDistribution: { range: string; count: number }[]
        }>>(`/api/exam/sessions/${sessionId}/stats`)
      } catch {
        // Deterministic mock based on sessionId
        const seed = parseInt(sessionId.replace('session-', ''), 10) || 0
        const total = 80 + seed * 15
        const submitted = Math.round(total * (0.85 + (seed % 3) * 0.03))
        const graded = Math.round(submitted * 0.92)
        return makeApiResponse({
          totalStudents: total,
          submitted,
          graded,
          notStarted: total - submitted,
          avgScore: 6.8 + (seed % 5) * 0.3,
          medianScore: 7.2 + (seed % 4) * 0.2,
          passRate: 0.78 + (seed % 5) * 0.02,
          scoreDistribution: [
            { range: '0-2', count: Math.max(1, Math.round(total * 0.01)) },
            { range: '2-4', count: Math.round(total * 0.04) },
            { range: '4-5', count: Math.round(total * 0.08) },
            { range: '5-6.5', count: Math.round(total * 0.15) },
            { range: '6.5-8', count: Math.round(total * 0.32) },
            { range: '8-9', count: Math.round(total * 0.28) },
            { range: '9-10', count: Math.round(total * 0.12) },
          ],
        })
      }
    },
    enabled: !!sessionId,
  })
}

export function useExportSessionResults() {
  return useMutation({
    mutationFn: (data: { sessionId: string; format: 'excel' | 'pdf' }) =>
      apiFetch<Blob>(`/api/exam/sessions/${data.sessionId}/export`, {
        method: 'POST',
        body: JSON.stringify({ format: data.format }),
      }),
  })
}
