import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ExamSession, SessionExam, SessionStudent, ExamAttempt, SessionCategory } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

const keys = {
  sessions: ['exam', 'sessions'] as const,
  session: (id: string) => ['exam', 'sessions', id] as const,
  sessionExams: (sessionId: string) => ['exam', 'sessions', sessionId, 'exams'] as const,
  sessionStudents: (sessionId: string, examId: string) => ['exam', 'sessions', sessionId, 'exams', examId, 'students'] as const,
  attempts: (sessionExamId: string) => ['exam', 'attempts', sessionExamId] as const,
  attempt: (attemptId: string) => ['exam', 'attempts', 'detail', attemptId] as const,
  categories: ['exam', 'session-categories'] as const,
}

export function useGetSessionCategories() {
  return useQuery({
    queryKey: keys.categories,
    queryFn: () => apiFetch<ApiResponse<SessionCategory[]>>('/api/exam/session-categories'),
  })
}

export function useGetSessions(params?: { categoryId?: string; status?: string }) {
  return useQuery({
    queryKey: [...keys.sessions, params],
    queryFn: () => apiFetch<PaginatedResponse<ExamSession>>(
      `/api/exam/sessions?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
  })
}

export function useGetSession(id: string) {
  return useQuery({
    queryKey: keys.session(id),
    queryFn: () => apiFetch<ApiResponse<ExamSession>>(`/api/exam/sessions/${id}`),
    enabled: !!id,
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamSession>) =>
      apiFetch<ApiResponse<ExamSession>>('/api/exam/sessions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessions }) },
  })
}

export function useUpdateSession(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamSession>) =>
      apiFetch<ApiResponse<ExamSession>>(`/api/exam/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.sessions })
      qc.invalidateQueries({ queryKey: keys.session(id) })
    },
  })
}

export function useDeleteSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/sessions/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessions }) },
  })
}

// Session Exams (ca thi)
export function useGetSessionExams(sessionId: string) {
  return useQuery({
    queryKey: keys.sessionExams(sessionId),
    queryFn: () => apiFetch<PaginatedResponse<SessionExam>>(`/api/exam/sessions/${sessionId}/exams`),
    enabled: !!sessionId,
  })
}

export function useCreateSessionExam(sessionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SessionExam>) =>
      apiFetch<ApiResponse<SessionExam>>(`/api/exam/sessions/${sessionId}/exams`, { method: 'POST', body: JSON.stringify(data) }),
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

// Students in exam session
export function useGetSessionStudents(sessionId: string, examId: string) {
  return useQuery({
    queryKey: keys.sessionStudents(sessionId, examId),
    queryFn: () => apiFetch<PaginatedResponse<SessionStudent>>(`/api/exam/sessions/${sessionId}/exams/${examId}/students`),
    enabled: !!sessionId && !!examId,
  })
}

export function useAddSessionStudent(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentIds: string[] }) =>
      apiFetch<ApiResponse<void>>(`/api/exam/sessions/${sessionId}/exams/${examId}/students`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

export function useUpdateStudentException(sessionId: string, examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentId: string; extraTimeMinutes: number; extraAttempts: number; note?: string }) =>
      apiFetch<ApiResponse<void>>(`/api/exam/sessions/${sessionId}/exams/${examId}/students/${data.studentId}/exception`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.sessionStudents(sessionId, examId) }) },
  })
}

// Attempts
export function useGetAttempts(sessionExamId: string) {
  return useQuery({
    queryKey: keys.attempts(sessionExamId),
    queryFn: () => apiFetch<PaginatedResponse<ExamAttempt>>(`/api/exam/session-exams/${sessionExamId}/attempts`),
    enabled: !!sessionExamId,
  })
}

export function useGetAttempt(attemptId: string) {
  return useQuery({
    queryKey: keys.attempt(attemptId),
    queryFn: () => apiFetch<ApiResponse<ExamAttempt>>(`/api/exam/attempts/${attemptId}`),
    enabled: !!attemptId,
  })
}

export function useGradeEssay(attemptId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { questionId: string; score: number; feedback?: string }) =>
      apiFetch<ApiResponse<void>>(`/api/exam/attempts/${attemptId}/grade`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.attempt(attemptId) })
    },
  })
}
