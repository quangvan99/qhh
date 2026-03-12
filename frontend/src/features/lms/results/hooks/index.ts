import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { LearningResult, ContentProgress, StudentAssignmentResult, StudentExamResult, ActivityLogEntry } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ── Keys ──
const keys = {
  results: (classId: string) => ['lms', 'results', classId] as const,
  studentResult: (classId: string, studentId: string) => ['lms', 'results', classId, studentId] as const,
  contentProgress: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'content'] as const,
  assignmentResults: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'assignments'] as const,
  examResults: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'exams'] as const,
  activityLog: (classId: string, studentId: string) => ['lms', 'results', classId, studentId, 'activity'] as const,
}

export function useGetClassResults(classId: string, params?: { search?: string; semester?: string; year?: string }) {
  return useQuery({
    queryKey: [...keys.results(classId), params],
    queryFn: () => apiFetch<PaginatedResponse<LearningResult>>(
      `/api/lms/classes/${classId}/results?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
    enabled: !!classId,
  })
}

export function useGetStudentResult(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.studentResult(classId, studentId),
    queryFn: () => apiFetch<ApiResponse<LearningResult>>(`/api/lms/classes/${classId}/results/${studentId}`),
    enabled: !!classId && !!studentId,
  })
}

export function useGetContentProgress(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.contentProgress(classId, studentId),
    queryFn: () => apiFetch<ApiResponse<ContentProgress[]>>(`/api/lms/classes/${classId}/results/${studentId}/content`),
    enabled: !!classId && !!studentId,
  })
}

export function useGetStudentAssignmentResults(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.assignmentResults(classId, studentId),
    queryFn: () => apiFetch<ApiResponse<StudentAssignmentResult[]>>(`/api/lms/classes/${classId}/results/${studentId}/assignments`),
    enabled: !!classId && !!studentId,
  })
}

export function useGetStudentExamResults(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.examResults(classId, studentId),
    queryFn: () => apiFetch<ApiResponse<StudentExamResult[]>>(`/api/lms/classes/${classId}/results/${studentId}/exams`),
    enabled: !!classId && !!studentId,
  })
}

export function useGetActivityLog(classId: string, studentId: string) {
  return useQuery({
    queryKey: keys.activityLog(classId, studentId),
    queryFn: () => apiFetch<PaginatedResponse<ActivityLogEntry>>(`/api/lms/classes/${classId}/results/${studentId}/activity-log`),
    enabled: !!classId && !!studentId,
  })
}

export function useCompleteResult(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentIds: string[]; complete: boolean }) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/results/complete`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.results(classId) }) },
  })
}

export function useUpdateTranscript(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentIds: string[]; semester: string; overwrite?: boolean }) =>
      apiFetch<ApiResponse<{ success: number; failed: number }>>(`/api/lms/classes/${classId}/results/update-transcript`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.results(classId) }) },
  })
}

export function useSendNotification(classId: string) {
  return useMutation({
    mutationFn: (data: { studentId: string; title: string; content: string; channels: string[] }) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/results/${data.studentId}/notify`, { method: 'POST', body: JSON.stringify(data) }),
  })
}

export function useAddExamAttempt(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { studentId: string; sessionId: string; count: number; note?: string }) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/results/${data.studentId}/add-exam-attempt`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.results(classId) }) },
  })
}
