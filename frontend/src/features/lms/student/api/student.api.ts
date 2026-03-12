import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  StudentClass,
  PublicClass,
  StudentContentGroup,
  StudentContentItem,
  StudentAssignment,
  StudentExamSession,
  ExamAttempt,
  ExamResult,
  DiscussionThread,
  DiscussionReply,
  AccessLog,
  ClassNotification,
  StudentClassResult,
  PaginatedResponse,
} from '../types/student.types'

// ─── My Classes ─────────────────────────────────────────────────

export function useGetMyClasses(filters?: { status?: string }) {
  return useQuery({
    queryKey: ['student-classes', filters],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters?.status) params.set('status', filters.status)
      return apiFetch<StudentClass[]>(`/api/v1/student/classes?${params.toString()}`)
    },
  })
}

export function useGetMyClass(id: string) {
  return useQuery({
    queryKey: ['student-class', id],
    queryFn: () => apiFetch<StudentClass>(`/api/v1/student/classes/${id}`),
    enabled: !!id,
  })
}

export function useSearchPublicClasses(q: string) {
  return useQuery({
    queryKey: ['public-classes', q],
    queryFn: () => apiFetch<PaginatedResponse<PublicClass>>(`/api/v1/lms/classes/public?q=${encodeURIComponent(q)}&status=open`),
    enabled: q.length > 0,
  })
}

export function useEnrollClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (classId: string) =>
      apiFetch<{ message: string }>(`/api/v1/lms/classes/${classId}/enroll`, { method: 'POST' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-classes'] })
    },
  })
}

// ─── Content ────────────────────────────────────────────────────

export function useGetMyContentGroups(classId: string) {
  return useQuery({
    queryKey: ['student-content', classId],
    queryFn: () => apiFetch<StudentContentGroup[]>(`/api/v1/student/classes/${classId}/content`),
    enabled: !!classId,
  })
}

export function useGetContentItem(classId: string, itemId: string) {
  return useQuery({
    queryKey: ['student-content-item', classId, itemId],
    queryFn: () => apiFetch<StudentContentItem>(`/api/v1/student/classes/${classId}/content/${itemId}`),
    enabled: !!classId && !!itemId,
  })
}

export function useMarkContentViewed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ classId, itemId }: { classId: string; itemId: string }) =>
      apiFetch<void>(`/api/v1/student/classes/${classId}/content/${itemId}/complete`, { method: 'POST' }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-content', variables.classId] })
    },
  })
}

export function useUpdateScormProgress() {
  return useMutation({
    mutationFn: ({ classId, itemId, ...data }: { classId: string; itemId: string; score?: number; time?: number; completed?: boolean }) =>
      apiFetch<void>(`/api/v1/student/classes/${classId}/content/${itemId}/progress`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  })
}

// ─── Assignments ────────────────────────────────────────────────

export function useGetMyAssignments(filters?: { classId?: string; status?: string }) {
  return useQuery({
    queryKey: ['student-assignments', filters],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters?.classId) params.set('classId', filters.classId)
      if (filters?.status) params.set('status', filters.status)
      return apiFetch<StudentAssignment[]>(`/api/v1/student/assignments?${params.toString()}`)
    },
  })
}

export function useGetMyAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ['student-assignment', assignmentId],
    queryFn: () => apiFetch<StudentAssignment>(`/api/v1/student/assignments/${assignmentId}`),
    enabled: !!assignmentId,
  })
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ assignmentId, files, textContent }: { assignmentId: string; files?: File[]; textContent?: string }) => {
      const formData = new FormData()
      if (textContent) formData.append('textContent', textContent)
      if (files) {
        for (const file of files) {
          formData.append('files[]', file)
        }
      }
      return apiFetch<{ message: string }>(`/api/v1/student/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-assignments'] })
      void queryClient.invalidateQueries({ queryKey: ['student-assignment'] })
    },
  })
}

export function useSaveDraft() {
  return useMutation({
    mutationFn: ({ assignmentId, textContent }: { assignmentId: string; textContent: string }) =>
      apiFetch<void>(`/api/v1/student/assignments/${assignmentId}/draft`, {
        method: 'PUT',
        body: JSON.stringify({ textContent }),
      }),
  })
}

// ─── Exams ──────────────────────────────────────────────────────

export function useGetMyExams(filters?: { status?: string }) {
  return useQuery({
    queryKey: ['student-exams', filters],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters?.status) params.set('status', filters.status)
      return apiFetch<StudentExamSession[]>(`/api/v1/student/exams?${params.toString()}`)
    },
  })
}

export function useGetExamSession(sessionId: string) {
  return useQuery({
    queryKey: ['exam-session', sessionId],
    queryFn: () => apiFetch<StudentExamSession>(`/api/v1/student/exams/${sessionId}`),
    enabled: !!sessionId,
  })
}

export function useRegisterExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) =>
      apiFetch<{ message: string }>(`/api/v1/student/exams/${examId}/register`, { method: 'POST' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-exams'] })
    },
  })
}

export function useGetExamAttempt(sessionId: string) {
  return useQuery({
    queryKey: ['exam-attempt', sessionId],
    queryFn: () => apiFetch<ExamAttempt>(`/api/v1/student/exams/${sessionId}/attempt`),
    enabled: !!sessionId,
  })
}

export function useStartExamAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<ExamAttempt>(`/api/v1/student/exams/${sessionId}/attempt`, { method: 'POST' }),
    onSuccess: (_data, sessionId) => {
      void queryClient.invalidateQueries({ queryKey: ['exam-attempt', sessionId] })
    },
  })
}

export function useSaveExamAnswers() {
  return useMutation({
    mutationFn: ({ sessionId, answers }: { sessionId: string; answers: Record<string, string | string[]> }) =>
      apiFetch<void>(`/api/v1/student/exams/${sessionId}/answers`, {
        method: 'PUT',
        body: JSON.stringify({ answers }),
      }),
  })
}

export function useSubmitExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<{ message: string }>(`/api/v1/student/exams/${sessionId}/submit`, { method: 'POST' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-exams'] })
    },
  })
}

export function useGetExamResult(sessionId: string) {
  return useQuery({
    queryKey: ['exam-result', sessionId],
    queryFn: () => apiFetch<ExamResult>(`/api/v1/student/exams/${sessionId}/result`),
    enabled: !!sessionId,
  })
}

export function useGetExamHistory() {
  return useQuery({
    queryKey: ['exam-history'],
    queryFn: () => apiFetch<StudentExamSession[]>('/api/v1/student/exams/history'),
  })
}

// ─── Discussions ────────────────────────────────────────────────

export function useGetDiscussions(classId: string, sort?: string) {
  return useQuery({
    queryKey: ['student-discussions', classId, sort],
    queryFn: () => {
      const params = new URLSearchParams()
      if (sort) params.set('sort', sort)
      return apiFetch<DiscussionThread[]>(`/api/v1/student/classes/${classId}/discussions?${params.toString()}`)
    },
    enabled: !!classId,
  })
}

export function useGetDiscussionThread(classId: string, threadId: string) {
  return useQuery({
    queryKey: ['student-discussion', classId, threadId],
    queryFn: () => apiFetch<{ thread: DiscussionThread; replies: DiscussionReply[] }>(
      `/api/v1/student/classes/${classId}/discussions/${threadId}`
    ),
    enabled: !!classId && !!threadId,
  })
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ classId, title, content, files }: { classId: string; title: string; content: string; files?: File[] }) => {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (files) {
        for (const file of files) formData.append('files[]', file)
      }
      return apiFetch<DiscussionThread>(`/api/v1/student/classes/${classId}/discussions`, {
        method: 'POST',
        body: formData,
        headers: {},
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-discussions', variables.classId] })
    },
  })
}

export function useReplyDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ classId, threadId, content, files }: { classId: string; threadId: string; content: string; files?: File[] }) => {
      const formData = new FormData()
      formData.append('content', content)
      if (files) {
        for (const file of files) formData.append('files[]', file)
      }
      return apiFetch<DiscussionReply>(`/api/v1/student/classes/${classId}/discussions/${threadId}/replies`, {
        method: 'POST',
        body: formData,
        headers: {},
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-discussion', variables.classId, variables.threadId] })
    },
  })
}

export function useDeleteReply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ classId, threadId, replyId }: { classId: string; threadId: string; replyId: string }) =>
      apiFetch<void>(`/api/v1/student/classes/${classId}/discussions/${threadId}/replies/${replyId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-discussion', variables.classId, variables.threadId] })
    },
  })
}

// ─── Results ────────────────────────────────────────────────────

export function useGetMyClassResult(classId: string) {
  return useQuery({
    queryKey: ['student-class-result', classId],
    queryFn: () => apiFetch<StudentClassResult>(`/api/v1/student/classes/${classId}/results`),
    enabled: !!classId,
  })
}

// ─── History / Notifications ────────────────────────────────────

export function useGetAccessHistory(classId: string, dateRange?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['access-history', classId, dateRange],
    queryFn: () => {
      const params = new URLSearchParams()
      if (dateRange?.from) params.set('from', dateRange.from)
      if (dateRange?.to) params.set('to', dateRange.to)
      return apiFetch<PaginatedResponse<AccessLog>>(`/api/v1/student/classes/${classId}/history?${params.toString()}`)
    },
    enabled: !!classId,
  })
}

export function useGetClassNotifications(classId: string) {
  return useQuery({
    queryKey: ['class-notifications', classId],
    queryFn: () => apiFetch<ClassNotification[]>(`/api/v1/student/classes/${classId}/notifications`),
    enabled: !!classId,
  })
}
