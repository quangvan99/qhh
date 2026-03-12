import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ExamPaper } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

const keys = {
  exams: ['exam', 'papers'] as const,
  exam: (id: string) => ['exam', 'papers', id] as const,
}

export function useGetExams(params?: { categoryId?: string; year?: string; q?: string }) {
  return useQuery({
    queryKey: [...keys.exams, params],
    queryFn: () => apiFetch<PaginatedResponse<ExamPaper>>(
      `/api/exam/exams?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
  })
}

export function useGetExam(id: string) {
  return useQuery({
    queryKey: keys.exam(id),
    queryFn: () => apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${id}`),
    enabled: !!id,
  })
}

export function useCreateExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamPaper>) =>
      apiFetch<ApiResponse<ExamPaper>>('/api/exam/exams', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.exams }) },
  })
}

export function useUpdateExam(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamPaper>) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.exams })
      qc.invalidateQueries({ queryKey: keys.exam(id) })
    },
  })
}

export function useDeleteExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/exams/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.exams }) },
  })
}

export function useCopyExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${id}/copy`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.exams }) },
  })
}
