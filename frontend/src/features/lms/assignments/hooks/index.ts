import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Assignment, Submission, ScoreSettings, AssignmentStatus, SubmissionStatus, GradingStatus } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_ASSIGNMENTS: Assignment[] = Array.from({ length: 22 }, (_, i) => {
  const statuses: AssignmentStatus[] = ['draft', 'open', 'open', 'closed']
  const types: Assignment['submissionType'][] = ['file', 'text', 'both']
  const openDate = new Date('2026-02-01')
  openDate.setDate(openDate.getDate() + i * 3)
  const deadline = new Date(openDate)
  deadline.setDate(deadline.getDate() + 14)

  return {
    id: `asgn-${i + 1}`,
    classId: '1',
    title: [
      'Bài tập chương 1: Giới thiệu cơ sở dữ liệu',
      'Bài tập chương 2: Mô hình ERD',
      'Bài tập chương 3: Mô hình quan hệ',
      'Bài luận: Phân tích thiết kế hệ thống',
      'Bài tập chương 4: Ngôn ngữ SQL cơ bản',
      'Bài tập chương 5: SQL nâng cao',
      'Bài tập chương 6: Stored Procedure',
      'Bài tập chương 7: Trigger & View',
      'Bài luận giữa kỳ: Thiết kế CSDL thực tế',
      'Bài tập chương 8: Normalization',
      'Bài tập chương 9: Transaction & Concurrency',
      'Bài tập chương 10: Indexing & Performance',
      'Bài tập nhóm: Xây dựng ứng dụng quản lý',
      'Bài tập chương 11: NoSQL Overview',
      'Bài tập chương 12: MongoDB Basics',
      'Bài luận: So sánh SQL và NoSQL',
      'Bài tập chương 13: Redis Caching',
      'Bài tập chương 14: Database Security',
      'Bài tập chương 15: Backup & Recovery',
      'Bài luận cuối kỳ: Dự án thực tế',
      'Bài tập bổ sung: Query Optimization',
      'Bài kiểm tra tổng hợp cuối học phần',
    ][i] ?? `Bài tập ${i + 1}`,
    description: `Mô tả chi tiết yêu cầu bài tập số ${i + 1}. Học sinh cần nghiên cứu và hoàn thành đúng hạn.`,
    submissionType: types[i % 3]!,
    openDate: openDate.toISOString(),
    deadline: deadline.toISOString(),
    maxScore: [10, 10, 10, 20, 10, 10, 10, 10, 30, 10, 10, 10, 20, 10, 10, 20, 10, 10, 10, 40, 10, 10][i] ?? 10,
    allowLate: i % 3 === 0,
    lateDeadline: i % 3 === 0 ? new Date(deadline.getTime() + 3 * 86400000).toISOString() : undefined,
    allowResubmit: i % 4 === 0,
    maxResubmitCount: i % 4 === 0 ? 3 : undefined,
    hideScore: i % 5 === 0,
    status: statuses[i % 4]!,
    submittedCount: Math.floor(Math.random() * 35) + 10,
    totalStudents: 38,
    attachments: i % 3 === 0
      ? [{ id: `att-${i}`, name: `de_bai_${i + 1}.pdf`, url: `/files/de_bai_${i + 1}.pdf`, size: 1024 * (i + 1), mimeType: 'application/pdf' }]
      : undefined,
    createdAt: openDate.toISOString(),
  }
})

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

function generateSubmissions(assignmentId: string): Submission[] {
  const count = 38
  const statusDist: SubmissionStatus[] = ['on_time', 'on_time', 'on_time', 'on_time', 'late', 'not_submitted']
  const gradingDist: GradingStatus[] = ['graded', 'graded', 'graded', 'ungraded']

  return Array.from({ length: count }, (_, i) => {
    const subStatus = statusDist[i % statusDist.length]!
    const gradingStatus: GradingStatus =
      subStatus === 'not_submitted' ? 'ungraded' : gradingDist[i % gradingDist.length]!
    const submittedDate = new Date('2026-03-14T10:00:00Z')
    submittedDate.setHours(submittedDate.getHours() + (i % 8))

    const score =
      gradingStatus === 'graded'
        ? Math.round((Math.random() * 4 + 6) * 10) / 10
        : null

    const feedbacks = [
      'Bài làm tốt, trình bày rõ ràng.',
      'Cần bổ sung thêm phần ví dụ minh họa.',
      'Đúng hướng nhưng thiếu chi tiết.',
      'Xuất sắc! Phân tích sâu và chính xác.',
      'Cần xem lại phần kết luận.',
      'Trình bày đẹp, nội dung đầy đủ.',
      'Thiếu tài liệu tham khảo.',
      'Rất tốt, đặc biệt phần phân tích.',
    ]

    return {
      id: `sub-${assignmentId}-${i + 1}`,
      assignmentId,
      studentId: `s-${i + 1}`,
      studentName: STUDENT_NAMES[i] ?? `Học sinh ${i + 1}`,
      studentAvatar: undefined,
      submittedAt: subStatus !== 'not_submitted' ? submittedDate.toISOString() : undefined,
      submissionStatus: subStatus,
      gradingStatus,
      score,
      feedback: gradingStatus === 'graded' && i < 20 ? feedbacks[i % feedbacks.length] : undefined,
      textContent:
        subStatus !== 'not_submitted' && i % 2 === 0
          ? `Nội dung bài làm của ${STUDENT_NAMES[i] ?? `học sinh ${i + 1}`}. Lorem ipsum dolor sit amet, consectetur adipiscing elit...`
          : undefined,
      files:
        subStatus !== 'not_submitted' && i % 2 !== 0
          ? [
              {
                id: `file-sub-${i}`,
                name: `bai_lam_${i + 1}.pdf`,
                url: `/files/submissions/bai_lam_${i + 1}.pdf`,
                size: 1024 * 512 * (i + 1),
                mimeType: 'application/pdf',
              },
            ]
          : undefined,
      feedbackFiles:
        gradingStatus === 'graded' && i < 5
          ? [
              {
                id: `fbfile-${i}`,
                name: `nhan_xet_${i + 1}.pdf`,
                url: `/files/feedbacks/nhan_xet_${i + 1}.pdf`,
                size: 1024 * 256,
                mimeType: 'application/pdf',
              },
            ]
          : undefined,
    }
  })
}

// Pre-generate submissions for first 5 assignments to keep things fast
const MOCK_SUBMISSIONS: Record<string, Submission[]> = {}
MOCK_ASSIGNMENTS.slice(0, 10).forEach((a) => {
  MOCK_SUBMISSIONS[a.id] = generateSubmissions(a.id)
})

async function fetchAssignments(classId: string, params?: { status?: string; sort?: string }): Promise<PaginatedResponse<Assignment>> {
  try {
    return await apiFetch<PaginatedResponse<Assignment>>(
      `/api/lms/classes/${classId}/assignments?${new URLSearchParams(params as Record<string, string>).toString()}`
    )
  } catch {
    let data = MOCK_ASSIGNMENTS.filter((a) => a.classId === classId || classId === '1')
    if (params?.status) data = data.filter((a) => a.status === params.status)
    if (params?.sort === 'title') data = [...data].sort((a, b) => a.title.localeCompare(b.title))
    return {
      data,
      pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
    }
  }
}

async function fetchAssignment(classId: string, id: string): Promise<ApiResponse<Assignment>> {
  try {
    return await apiFetch<ApiResponse<Assignment>>(`/api/lms/classes/${classId}/assignments/${id}`)
  } catch {
    const found = MOCK_ASSIGNMENTS.find((a) => a.id === id) ?? MOCK_ASSIGNMENTS[0]!
    return { data: found, success: true }
  }
}

async function fetchSubmissions(assignmentId: string, params?: { status?: string; graded?: string }): Promise<PaginatedResponse<Submission>> {
  try {
    return await apiFetch<PaginatedResponse<Submission>>(
      `/api/lms/assignments/${assignmentId}/submissions?${new URLSearchParams(params as Record<string, string>).toString()}`
    )
  } catch {
    const all = MOCK_SUBMISSIONS[assignmentId] ?? generateSubmissions(assignmentId)
    // cache
    if (!MOCK_SUBMISSIONS[assignmentId]) MOCK_SUBMISSIONS[assignmentId] = all
    let data = all
    if (params?.status) data = data.filter((s) => s.submissionStatus === params.status)
    if (params?.graded) data = data.filter((s) => s.gradingStatus === params.graded)
    return {
      data,
      pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
    }
  }
}

async function fetchSubmission(subId: string): Promise<ApiResponse<Submission>> {
  try {
    return await apiFetch<ApiResponse<Submission>>(`/api/lms/submissions/${subId}`)
  } catch {
    // Find across all cached submissions
    for (const subs of Object.values(MOCK_SUBMISSIONS)) {
      const found = subs.find((s) => s.id === subId)
      if (found) return { data: found, success: true }
    }
    const fallback = Object.values(MOCK_SUBMISSIONS)[0]?.[0]
    return { data: fallback!, success: true }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────────────────────────────────────

const keys = {
  assignments: (classId: string) => ['lms', 'assignments', classId] as const,
  assignment: (classId: string, id: string) => ['lms', 'assignments', classId, id] as const,
  submissions: (assignmentId: string) => ['lms', 'submissions', assignmentId] as const,
  submission: (subId: string) => ['lms', 'submissions', 'detail', subId] as const,
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useGetAssignments(classId: string, params?: { status?: string; sort?: string }) {
  return useQuery({
    queryKey: [...keys.assignments(classId), params],
    queryFn: () => fetchAssignments(classId, params),
    enabled: !!classId,
  })
}

export function useGetAssignment(classId: string, id: string) {
  return useQuery({
    queryKey: keys.assignment(classId, id),
    queryFn: () => fetchAssignment(classId, id),
    enabled: !!classId && !!id,
  })
}

export function useCreateAssignment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
      try {
        return await apiFetch<ApiResponse<Assignment>>(`/api/lms/classes/${classId}/assignments`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        const newAssignment: Assignment = {
          id: `asgn-${Date.now()}`,
          classId,
          title: (data.title as string) ?? 'Bài tập mới',
          description: data.description ?? '',
          submissionType: data.submissionType ?? 'file',
          openDate: data.openDate ?? new Date().toISOString(),
          deadline: data.deadline ?? new Date(Date.now() + 14 * 86400000).toISOString(),
          maxScore: data.maxScore ?? 10,
          allowLate: data.allowLate ?? false,
          allowResubmit: data.allowResubmit ?? false,
          hideScore: data.hideScore ?? false,
          status: 'draft',
          submittedCount: 0,
          totalStudents: 38,
          createdAt: new Date().toISOString(),
          ...data,
        } as Assignment
        MOCK_ASSIGNMENTS.push(newAssignment)
        return { data: newAssignment, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.assignments(classId) })
    },
  })
}

export function useUpdateAssignment(classId: string, id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
      try {
        return await apiFetch<ApiResponse<Assignment>>(`/api/lms/classes/${classId}/assignments/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        const idx = MOCK_ASSIGNMENTS.findIndex((a) => a.id === id)
        if (idx !== -1) {
          MOCK_ASSIGNMENTS[idx] = { ...MOCK_ASSIGNMENTS[idx]!, ...data }
        }
        return { data: MOCK_ASSIGNMENTS.find((a) => a.id === id) ?? MOCK_ASSIGNMENTS[0]!, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.assignments(classId) })
      qc.invalidateQueries({ queryKey: keys.assignment(classId, id) })
    },
  })
}

export function useDeleteAssignment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/assignments/${id}`, {
          method: 'DELETE',
        })
      } catch {
        const idx = MOCK_ASSIGNMENTS.findIndex((a) => a.id === id)
        if (idx !== -1) MOCK_ASSIGNMENTS.splice(idx, 1)
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.assignments(classId) })
    },
  })
}

export function useGetSubmissions(assignmentId: string, params?: { status?: string; graded?: string }) {
  return useQuery({
    queryKey: [...keys.submissions(assignmentId), params],
    queryFn: () => fetchSubmissions(assignmentId, params),
    enabled: !!assignmentId,
  })
}

export function useGetSubmission(subId: string) {
  return useQuery({
    queryKey: keys.submission(subId),
    queryFn: () => fetchSubmission(subId),
    enabled: !!subId,
  })
}

export function useGradeSubmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { subId: string; score: number; feedback?: string }): Promise<ApiResponse<Submission>> => {
      try {
        return await apiFetch<ApiResponse<Submission>>(`/api/lms/submissions/${data.subId}/grade`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        // Update in-memory mock
        for (const subs of Object.values(MOCK_SUBMISSIONS)) {
          const idx = subs.findIndex((s) => s.id === data.subId)
          if (idx !== -1) {
            subs[idx] = { ...subs[idx]!, score: data.score, feedback: data.feedback, gradingStatus: 'graded' }
            return { data: subs[idx]!, success: true }
          }
        }
        return { data: {} as Submission, success: true }
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: keys.submission(vars.subId) })
      // Optimistically update cached submission data
      const subId = vars.subId
      qc.setQueriesData<PaginatedResponse<Submission>>(
        { queryKey: ['lms', 'submissions'], exact: false },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((s) =>
              s.id === subId
                ? { ...s, score: vars.score, feedback: vars.feedback, gradingStatus: 'graded' as GradingStatus }
                : s
            ),
          }
        }
      )
    },
  })
}

/**
 * Bulk grade multiple submissions at once.
 * Falls back gracefully on API error.
 */
export function useBulkGrade(assignmentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (items: { subId: string; score: number; feedback?: string }[]): Promise<ApiResponse<{ updated: number }>> => {
      try {
        return await apiFetch<ApiResponse<{ updated: number }>>(`/api/lms/assignments/${assignmentId}/submissions/bulk-grade`, {
          method: 'POST',
          body: JSON.stringify({ items }),
        })
      } catch {
        // Update in-memory mock for each item
        for (const item of items) {
          for (const subs of Object.values(MOCK_SUBMISSIONS)) {
            const idx = subs.findIndex((s) => s.id === item.subId)
            if (idx !== -1) {
              subs[idx] = { ...subs[idx]!, score: item.score, feedback: item.feedback, gradingStatus: 'graded' }
            }
          }
        }
        return { data: { updated: items.length }, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.submissions(assignmentId) })
    },
  })
}

/**
 * Publish / unpublish grades for an assignment (makes scores visible to students).
 */
export function usePublishGrades(assignmentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { publish: boolean; scheduledAt?: string }): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(`/api/lms/assignments/${assignmentId}/publish-grades`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.submissions(assignmentId) })
    },
  })
}

export function useUpdateScoreSettings(assignmentId: string) {
  return useMutation({
    mutationFn: async (data: ScoreSettings): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(`/api/lms/assignments/${assignmentId}/score-settings`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        return { data: undefined as unknown as void, success: true }
      }
    },
  })
}

/**
 * Export submission data to Excel / CSV.
 */
export function useExportSubmissions(assignmentId: string) {
  return useMutation({
    mutationFn: (format: 'xlsx' | 'csv') =>
      apiFetch<Blob>(`/api/lms/assignments/${assignmentId}/submissions/export?format=${format}`, {
        method: 'GET',
      }),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Composable feature hooks (re-export for convenience)
// ─────────────────────────────────────────────────────────────────────────────
export { useAssignments } from './useAssignments'
export { useSubmissions } from './useSubmissions'
