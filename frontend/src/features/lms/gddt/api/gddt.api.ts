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

// ─── GDĐT Classes ──────────────────────────────────────────────

export function useGetGDDTClasses(filters: { year?: string; grade?: string; q?: string }) {
  return useQuery({
    queryKey: ['gddt-classes', filters],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters.year) params.set('year', filters.year)
      if (filters.grade) params.set('grade', filters.grade)
      if (filters.q) params.set('q', filters.q)
      return apiFetch<PaginatedResponse<GDDTClass>>(`/api/gddt/classes?${params.toString()}`)
    },
  })
}

export function useGetGDDTStudents(classId: string) {
  return useQuery({
    queryKey: ['gddt-students', classId],
    queryFn: () => apiFetch<PaginatedResponse<GDDTStudent>>(`/api/gddt/classes/${classId}/students`),
    enabled: !!classId,
  })
}

export function useSyncGDDTClasses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiFetch<{ message: string }>('/api/gddt/sync', { method: 'POST' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gddt-classes'] })
    },
  })
}

// ─── Conduct Criteria ──────────────────────────────────────────

export function useGetConductCriteria() {
  return useQuery({
    queryKey: ['conduct-criteria'],
    queryFn: () => apiFetch<ConductCriteria[]>('/api/gddt/conduct-criteria'),
  })
}

export function useGetConductCriteriaById(id: string) {
  return useQuery({
    queryKey: ['conduct-criteria', id],
    queryFn: () => apiFetch<ConductCriteria>(`/api/gddt/conduct-criteria/${id}`),
    enabled: !!id,
  })
}

export function useCreateConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<ConductCriteria, 'id'>) =>
      apiFetch<ConductCriteria>('/api/gddt/conduct-criteria', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

export function useUpdateConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: ConductCriteria) =>
      apiFetch<ConductCriteria>(`/api/gddt/conduct-criteria/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

export function useDeleteConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/gddt/conduct-criteria/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

export function useBulkDeleteConductCriteria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch<void>('/api/gddt/conduct-criteria/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-criteria'] })
    },
  })
}

// ─── Conduct Scores ────────────────────────────────────────────

export function useGetStudentConductScores(studentId: string, term?: string, year?: string) {
  return useQuery({
    queryKey: ['conduct-scores', studentId, term, year],
    queryFn: () => {
      const params = new URLSearchParams()
      if (term) params.set('term', term)
      if (year) params.set('year', year)
      return apiFetch<StudentConductData>(`/api/gddt/conduct-score/${studentId}?${params.toString()}`)
    },
    enabled: !!studentId,
  })
}

export function useSaveStudentConductScores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      studentId,
      ...data
    }: {
      studentId: string
      term: string
      year: string
      scores: { criteriaId: string; score: number; note?: string }[]
      comment?: string
    }) =>
      apiFetch<void>(`/api/gddt/conduct-score/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conduct-scores'] })
    },
  })
}

export function useImportConductScores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
        '/api/gddt/conduct-score/import',
        {
          method: 'POST',
          body: formData,
          headers: {}, // Let browser set Content-Type for FormData
        }
      )
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
    queryFn: () => apiFetch<ScholarshipLevel[]>('/api/gddt/scholarship/levels'),
  })
}

export function useCreateScholarshipLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<ScholarshipLevel, 'id'>) =>
      apiFetch<ScholarshipLevel>('/api/gddt/scholarship/levels', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-levels'] })
    },
  })
}

export function useUpdateScholarshipLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: ScholarshipLevel) =>
      apiFetch<ScholarshipLevel>(`/api/gddt/scholarship/levels/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-levels'] })
    },
  })
}

export function useDeleteScholarshipLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/gddt/scholarship/levels/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-levels'] })
    },
  })
}

// ─── Scholarship Sessions ──────────────────────────────────────

export function useGetScholarshipSessions() {
  return useQuery({
    queryKey: ['scholarship-sessions'],
    queryFn: () => apiFetch<ScholarshipSession[]>('/api/gddt/scholarship/sessions'),
  })
}

export function useCreateScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<ScholarshipSession, 'id' | 'status'>) =>
      apiFetch<ScholarshipSession>('/api/gddt/scholarship/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
    },
  })
}

export function useUpdateScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: ScholarshipSession) =>
      apiFetch<ScholarshipSession>(`/api/gddt/scholarship/sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
    },
  })
}

export function useDeleteScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/gddt/scholarship/sessions/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scholarship-sessions'] })
    },
  })
}

export function useProcessScholarshipSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ message: string }>(`/api/gddt/scholarship/sessions/${id}/process`, {
        method: 'POST',
      }),
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
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters.sessionId) params.set('sessionId', filters.sessionId)
      if (filters.level) params.set('level', filters.level)
      if (filters.grade) params.set('grade', filters.grade)
      if (filters.q) params.set('q', filters.q)
      return apiFetch<{
        data: ScholarshipResult[]
        summary: ScholarshipSummary
      }>(`/api/gddt/scholarship/results?${params.toString()}`)
    },
    enabled: !!filters.sessionId,
  })
}

export function useExportScholarshipResults() {
  return useMutation({
    mutationFn: async (filters: { sessionId: string; level?: string; grade?: string }) => {
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
    },
  })
}

export function useExportStudents() {
  return useMutation({
    mutationFn: async (classId: string) => {
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
    },
  })
}
