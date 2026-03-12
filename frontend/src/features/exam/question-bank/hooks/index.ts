import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Question, QuestionCategory } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

const keys = {
  questions: ['exam', 'questions'] as const,
  question: (id: string) => ['exam', 'questions', id] as const,
  categories: ['exam', 'categories'] as const,
}

export function useGetQuestions(params?: { type?: string; difficulty?: string; categoryId?: string; q?: string }) {
  return useQuery({
    queryKey: [...keys.questions, params],
    queryFn: () => apiFetch<PaginatedResponse<Question>>(
      `/api/exam/questions?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
  })
}

export function useGetQuestion(id: string) {
  return useQuery({
    queryKey: keys.question(id),
    queryFn: () => apiFetch<ApiResponse<Question>>(`/api/exam/questions/${id}`),
    enabled: !!id,
  })
}

export function useGetCategories() {
  return useQuery({
    queryKey: keys.categories,
    queryFn: () => apiFetch<ApiResponse<QuestionCategory[]>>('/api/exam/categories'),
  })
}

export function useCreateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Question>) =>
      apiFetch<ApiResponse<Question>>('/api/exam/questions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.questions }) },
  })
}

export function useUpdateQuestion(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Question>) =>
      apiFetch<ApiResponse<Question>>(`/api/exam/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.questions })
      qc.invalidateQueries({ queryKey: keys.question(id) })
    },
  })
}

export function useDeleteQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.questions }) },
  })
}

export function useBulkDeleteQuestions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch<ApiResponse<void>>('/api/exam/questions/bulk', { method: 'DELETE', body: JSON.stringify({ ids }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.questions }) },
  })
}

export function useCopyQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<Question>>(`/api/exam/questions/${id}/copy`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.questions }) },
  })
}

export function useImportQuestions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { questions: Partial<Question>[] }) =>
      apiFetch<ApiResponse<{ success: number; failed: number }>>('/api/exam/questions/import', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.questions }) },
  })
}

export function useExportQuestions() {
  return useMutation({
    mutationFn: (data: { questionIds: string[]; format: string; includeAnswers: boolean; sort: string }) =>
      apiFetch<Blob>('/api/exam/questions/export', { method: 'POST', body: JSON.stringify(data) }),
  })
}
