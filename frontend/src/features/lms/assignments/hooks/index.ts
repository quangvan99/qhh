import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Assignment, Submission, ScoreSettings } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

const keys = {
  assignments: (classId: string) => ['lms', 'assignments', classId] as const,
  assignment: (classId: string, id: string) => ['lms', 'assignments', classId, id] as const,
  submissions: (assignmentId: string) => ['lms', 'submissions', assignmentId] as const,
  submission: (subId: string) => ['lms', 'submissions', 'detail', subId] as const,
}

export function useGetAssignments(classId: string, params?: { status?: string; sort?: string }) {
  return useQuery({
    queryKey: [...keys.assignments(classId), params],
    queryFn: () => apiFetch<PaginatedResponse<Assignment>>(
      `/api/lms/classes/${classId}/assignments?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
    enabled: !!classId,
  })
}

export function useGetAssignment(classId: string, id: string) {
  return useQuery({
    queryKey: keys.assignment(classId, id),
    queryFn: () => apiFetch<ApiResponse<Assignment>>(`/api/lms/classes/${classId}/assignments/${id}`),
    enabled: !!classId && !!id,
  })
}

export function useCreateAssignment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Assignment>) =>
      apiFetch<ApiResponse<Assignment>>(`/api/lms/classes/${classId}/assignments`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.assignments(classId) }) },
  })
}

export function useUpdateAssignment(classId: string, id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Assignment>) =>
      apiFetch<ApiResponse<Assignment>>(`/api/lms/classes/${classId}/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.assignments(classId) })
      qc.invalidateQueries({ queryKey: keys.assignment(classId, id) })
    },
  })
}

export function useDeleteAssignment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/assignments/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.assignments(classId) }) },
  })
}

export function useGetSubmissions(assignmentId: string, params?: { status?: string; graded?: string }) {
  return useQuery({
    queryKey: [...keys.submissions(assignmentId), params],
    queryFn: () => apiFetch<PaginatedResponse<Submission>>(
      `/api/lms/assignments/${assignmentId}/submissions?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
    enabled: !!assignmentId,
  })
}

export function useGetSubmission(subId: string) {
  return useQuery({
    queryKey: keys.submission(subId),
    queryFn: () => apiFetch<ApiResponse<Submission>>(`/api/lms/submissions/${subId}`),
    enabled: !!subId,
  })
}

export function useGradeSubmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { subId: string; score: number; feedback?: string }) =>
      apiFetch<ApiResponse<Submission>>(`/api/lms/submissions/${data.subId}/grade`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: keys.submission(vars.subId) })
    },
  })
}

export function useUpdateScoreSettings(assignmentId: string) {
  return useMutation({
    mutationFn: (data: ScoreSettings) =>
      apiFetch<ApiResponse<void>>(`/api/lms/assignments/${assignmentId}/score-settings`, { method: 'PUT', body: JSON.stringify(data) }),
  })
}
