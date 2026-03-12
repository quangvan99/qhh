import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ExamPaper, ExamSection, RandomConfig } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SUBJECTS = ['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh', 'Lịch sử', 'Địa lý', 'Sinh học', 'GDCD', 'Tin học']
const AUTHORS = ['GV. Nguyễn Văn A', 'GV. Trần Thị B', 'GV. Lê Hoàng C', 'GV. Phạm Thu D', 'GV. Hoàng Minh E']
const CAT_IDS = ['cat-toan', 'cat-ly', 'cat-hoa', 'cat-van', 'cat-anh', 'cat-su', 'cat-dia', 'cat-sinh']
const DURATIONS = [15, 45, 60, 90, 120]
const PART_NAMES = ['Kiểm tra 15 phút', 'Kiểm tra 1 tiết', 'Kiểm tra giữa kỳ', 'Kiểm tra cuối kỳ', 'Thi thử THPT QG']

function makeSections(idx: number): ExamSection[] {
  return [
    {
      id: `sec-${idx}-a`,
      name: 'Phần I – Trắc nghiệm',
      questionType: 'single_choice',
      scorePerQuestion: 0.25,
      selectionMode: 'random',
      randomConfig: [
        { categoryId: CAT_IDS[idx % CAT_IDS.length]!, difficulty: 'easy', count: 10 },
        { categoryId: CAT_IDS[idx % CAT_IDS.length]!, difficulty: 'medium', count: 15 },
        { categoryId: CAT_IDS[idx % CAT_IDS.length]!, difficulty: 'hard', count: 5 },
      ],
      order: 1,
    },
    {
      id: `sec-${idx}-b`,
      name: 'Phần II – Tự luận',
      questionType: 'essay',
      scorePerQuestion: 1.25,
      selectionMode: 'manual',
      questions: Array.from({ length: 4 }, (_, j) => ({ questionId: `q-essay-${idx}-${j}`, order: j + 1 })),
      order: 2,
    },
  ]
}

const MOCK_EXAMS: ExamPaper[] = Array.from({ length: 25 }, (_, i) => {
  const subject = SUBJECTS[i % SUBJECTS.length]!
  const partName = PART_NAMES[i % PART_NAMES.length]!
  const year = 2025 + Math.floor(i / 5)
  return {
    id: `exam-${i}`,
    name: `${partName} – ${subject} (${year})`,
    categoryId: CAT_IDS[i % CAT_IDS.length],
    categoryName: subject,
    totalQuestions: 30 + (i % 20),
    duration: DURATIONS[i % DURATIONS.length]!,
    totalScore: 10,
    description: `Đề kiểm tra ${partName.toLowerCase()} môn ${subject} năm học ${year}-${year + 1}`,
    instructions: 'Học sinh đọc kỹ đề trước khi làm bài. Không sử dụng tài liệu. Thời gian tính từ khi phát đề.',
    sections: makeSections(i),
    authorId: `u-${(i % 5) + 1}`,
    authorName: AUTHORS[i % AUTHORS.length],
    status: i % 5 === 0 ? 'draft' : 'published',
    createdAt: `2026-0${Math.min(9, (i % 9) + 1)}-${String(Math.min(28, (i % 20) + 1)).padStart(2, '0')}`,
    updatedAt: `2026-03-${String(Math.min(28, (i % 20) + 5)).padStart(2, '0')}`,
  }
})

const MOCK_CATEGORIES = [
  { id: 'cat-toan', name: 'Toán học' },
  { id: 'cat-ly', name: 'Vật lý' },
  { id: 'cat-hoa', name: 'Hóa học' },
  { id: 'cat-van', name: 'Ngữ văn' },
  { id: 'cat-anh', name: 'Tiếng Anh' },
  { id: 'cat-su', name: 'Lịch sử' },
  { id: 'cat-dia', name: 'Địa lý' },
  { id: 'cat-sinh', name: 'Sinh học' },
  { id: 'cat-gdcd', name: 'GDCD' },
  { id: 'cat-tin', name: 'Tin học' },
]

function makePaginated<T>(data: T[]): PaginatedResponse<T> {
  return {
    data,
    pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
  }
}

function makeApiResponse<T>(data: T): ApiResponse<T> {
  return { data, success: true }
}

// ── Query Keys ──────────────────────────────────────────────────────────────

const keys = {
  all: ['exam', 'papers'] as const,
  list: (params?: object) => ['exam', 'papers', 'list', params] as const,
  detail: (id: string) => ['exam', 'papers', id] as const,
  categories: ['exam', 'paper-categories'] as const,
}

// ── Fetch Functions ──────────────────────────────────────────────────────────

async function fetchExams(params?: {
  categoryId?: string; q?: string; status?: string
}): Promise<PaginatedResponse<ExamPaper>> {
  try {
    return await apiFetch<PaginatedResponse<ExamPaper>>(
      `/api/exam/exams?${new URLSearchParams((params ?? {}) as Record<string, string>).toString()}`
    )
  } catch {
    let data = [...MOCK_EXAMS]
    if (params?.q) {
      const q = params.q.toLowerCase()
      data = data.filter((e) => e.name.toLowerCase().includes(q) || e.categoryName?.toLowerCase().includes(q))
    }
    if (params?.categoryId) data = data.filter((e) => e.categoryId === params.categoryId)
    if (params?.status) data = data.filter((e) => e.status === params.status)
    return makePaginated(data)
  }
}

async function fetchExam(id: string): Promise<ApiResponse<ExamPaper>> {
  try {
    return await apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${id}`)
  } catch {
    const found = MOCK_EXAMS.find((e) => e.id === id) ?? MOCK_EXAMS[0]!
    return makeApiResponse(found)
  }
}

// ── List & Detail Hooks ──────────────────────────────────────────────────────

export function useGetExams(params?: { categoryId?: string; q?: string; status?: string }) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => fetchExams(params),
  })
}

export function useGetExam(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchExam(id),
    enabled: !!id,
  })
}

// ── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamPaper>) =>
      apiFetch<ApiResponse<ExamPaper>>('/api/exam/exams', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useUpdateExam(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamPaper>) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
      qc.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeleteExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/exams/${examId}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useCopyExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${examId}/copy`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function usePublishExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${examId}/publish`, { method: 'POST' }),
    onSuccess: (_, examId) => {
      qc.invalidateQueries({ queryKey: keys.all })
      qc.invalidateQueries({ queryKey: keys.detail(examId) })
    },
  })
}

export function useUnpublishExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${examId}/unpublish`, { method: 'POST' }),
    onSuccess: (_, examId) => {
      qc.invalidateQueries({ queryKey: keys.all })
      qc.invalidateQueries({ queryKey: keys.detail(examId) })
    },
  })
}

export function useExportExam() {
  return useMutation({
    mutationFn: (data: {
      examId: string
      format: 'word' | 'pdf'
      includeAnswers: boolean
      includeExamCode: boolean
    }) =>
      apiFetch<Blob>(`/api/exam/exams/${data.examId}/export`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useUpdateExamSections(examId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sections: ExamSection[]) =>
      apiFetch<ApiResponse<ExamPaper>>(`/api/exam/exams/${examId}/sections`, {
        method: 'PUT',
        body: JSON.stringify({ sections }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
      qc.invalidateQueries({ queryKey: keys.detail(examId) })
    },
  })
}

export function usePreviewExamStructure(examId: string) {
  return useQuery({
    queryKey: [...keys.detail(examId), 'preview'],
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<{
          totalQuestions: number
          distribution: { difficulty: string; count: number }[]
        }>>(`/api/exam/exams/${examId}/preview`)
      } catch {
        return makeApiResponse({
          totalQuestions: 34,
          distribution: [
            { difficulty: 'easy', count: 10 },
            { difficulty: 'medium', count: 15 },
            { difficulty: 'hard', count: 5 },
            { difficulty: 'essay', count: 4 },
          ],
        })
      }
    },
    enabled: !!examId,
  })
}

// ── Category Hooks ───────────────────────────────────────────────────────────

export function useGetExamCategories() {
  return useQuery({
    queryKey: keys.categories,
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<{ id: string; name: string; parentId?: string }[]>>(
          '/api/exam/paper-categories'
        )
      } catch {
        return makeApiResponse(MOCK_CATEGORIES)
      }
    },
  })
}

export function useCreateExamCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; parentId?: string }) =>
      apiFetch<ApiResponse<{ id: string; name: string }>>('/api/exam/paper-categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}

export function useDeleteExamCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/paper-categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}
