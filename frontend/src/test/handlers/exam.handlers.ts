import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8080'

const mockExams = [
  {
    id: 'exam-1',
    name: 'Kiểm tra 1 tiết – Toán học (2025)',
    subject: 'Toán học',
    duration: 45,
    status: 'published',
    questionCount: 40,
    createdAt: '2025-01-15T07:00:00Z',
  },
  {
    id: 'exam-2',
    name: 'Kiểm tra giữa kỳ – Vật lý (2025)',
    subject: 'Vật lý',
    duration: 60,
    status: 'draft',
    questionCount: 30,
    createdAt: '2025-02-01T07:00:00Z',
  },
  {
    id: 'exam-3',
    name: 'Kiểm tra cuối kỳ – Hóa học (2025)',
    subject: 'Hóa học',
    duration: 90,
    status: 'published',
    questionCount: 50,
    createdAt: '2025-03-01T07:00:00Z',
  },
]

const mockQuestions = [
  {
    id: 'q-1',
    content: 'Phương trình bậc hai ax² + bx + c = 0 có nghiệm kép khi nào?',
    type: 'single_choice',
    difficulty: 'medium',
    options: [
      { id: 'o-1', text: 'Δ = 0', isCorrect: true },
      { id: 'o-2', text: 'Δ > 0', isCorrect: false },
      { id: 'o-3', text: 'Δ < 0', isCorrect: false },
      { id: 'o-4', text: 'a = 0', isCorrect: false },
    ],
  },
  {
    id: 'q-2',
    content: 'Phân tích ý nghĩa lịch sử của Cách mạng tháng Tám 1945.',
    type: 'essay',
    difficulty: 'hard',
  },
]

const mockSessions = [
  {
    id: 'session-1',
    name: 'Kiểm tra 1 tiết lần 1 (2025-2026)',
    categoryId: 'sc-2025-hk1',
    categoryName: 'HK1 – 2025-2026',
    academicYear: '2025-2026',
    semester: '1',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    examCount: 5,
    studentCount: 120,
    status: 'completed',
    showScoreImmediately: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'session-2',
    name: 'Kiểm tra giữa kỳ (2025-2026)',
    categoryId: 'sc-2025-hk1',
    categoryName: 'HK1 – 2025-2026',
    academicYear: '2025-2026',
    semester: '1',
    startDate: '2026-03-10',
    endDate: '2026-03-15',
    examCount: 3,
    studentCount: 80,
    status: 'active',
    showScoreImmediately: false,
    createdAt: '2026-02-01',
  },
  {
    id: 'session-3',
    name: 'Kiểm tra cuối kỳ (2025-2026)',
    categoryId: 'sc-2025-hk2',
    categoryName: 'HK2 – 2025-2026',
    academicYear: '2025-2026',
    semester: '2',
    startDate: '2026-06-01',
    endDate: '2026-06-10',
    examCount: 8,
    studentCount: 200,
    status: 'preparing',
    showScoreImmediately: false,
    createdAt: '2026-03-01',
  },
]

const mockQuestionsFull = [
  {
    id: 'q-sc-0',
    type: 'single_choice',
    categoryId: 'cat-toan',
    categoryName: 'Toán học',
    difficulty: 'medium',
    content: 'Phương trình bậc hai ax² + bx + c = 0 có nghiệm kép khi nào?',
    options: [
      { id: 'q0-a', content: 'Δ = 0', isCorrect: true, order: 0 },
      { id: 'q0-b', content: 'Δ > 0', isCorrect: false, order: 1 },
      { id: 'q0-c', content: 'Δ < 0', isCorrect: false, order: 2 },
      { id: 'q0-d', content: 'a = 0', isCorrect: false, order: 3 },
    ],
    tags: ['toán học', 'medium'],
    authorId: 'u-1',
    authorName: 'GV. Nguyễn Văn A',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 'q-essay-0',
    type: 'essay',
    categoryId: 'cat-van',
    categoryName: 'Ngữ văn',
    difficulty: 'hard',
    content: 'Phân tích vai trò của nhân vật Mị trong tác phẩm "Vợ chồng A Phủ" của Tô Hoài.',
    maxScore: 5,
    tags: ['tự luận', 'ngữ văn'],
    authorId: 'u-2',
    authorName: 'GV. Trần Thị B',
    createdAt: '2026-01-15',
    updatedAt: '2026-03-05',
  },
  {
    id: 'q-tf-0',
    type: 'true_false',
    categoryId: 'cat-ly',
    categoryName: 'Vật lý',
    difficulty: 'easy',
    content: 'Nhận định sau là Đúng hay Sai: Tốc độ ánh sáng trong chân không xấp xỉ 300.000 km/s',
    options: [
      { id: 'qtf0-t', content: 'Đúng', isCorrect: true, order: 0 },
      { id: 'qtf0-f', content: 'Sai', isCorrect: false, order: 1 },
    ],
    tags: ['đúng/sai', 'vật lý'],
    authorId: 'u-1',
    authorName: 'GV. Nguyễn Văn A',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-01',
  },
]

const mockCategories = [
  {
    id: 'cat-toan', name: 'Toán học',
    children: [
      { id: 'cat-toan-ds', name: 'Đại số', parentId: 'cat-toan' },
      { id: 'cat-toan-hh', name: 'Hình học', parentId: 'cat-toan' },
    ],
  },
  {
    id: 'cat-ly', name: 'Vật lý',
    children: [
      { id: 'cat-ly-co', name: 'Cơ học', parentId: 'cat-ly' },
    ],
  },
  { id: 'cat-van', name: 'Ngữ văn' },
]

const mockSessionCategories = [
  {
    id: 'sc-2025', name: '2025-2026',
    children: [
      { id: 'sc-2025-hk1', name: 'Học kỳ 1', parentId: 'sc-2025' },
      { id: 'sc-2025-hk2', name: 'Học kỳ 2', parentId: 'sc-2025' },
    ],
  },
]

const mockQuestionStats = {
  total: 78,
  byType: { single_choice: 40, multi_choice: 8, essay: 15, true_false: 5, fill_blank: 10 },
  byDifficulty: { easy: 20, medium: 24, hard: 20, very_hard: 14 },
  byCategory: [
    { id: 'cat-toan', name: 'Toán học', count: 15 },
    { id: 'cat-ly', name: 'Vật lý', count: 10 },
  ],
}

export const examHandlers = [
  // Exams CRUD
  http.get(`${BASE}/api/exam/exams`, () =>
    HttpResponse.json({ data: mockExams, total: mockExams.length, page: 1, pageSize: 10 }),
  ),
  http.get(`${BASE}/api/exam/exams/:id`, ({ params }) =>
    HttpResponse.json(mockExams.find((e) => e.id === params['id']) ?? mockExams[0]),
  ),
  http.post(`${BASE}/api/exam/exams`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'exam-new', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/exam/exams/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/exam/exams/:id`, () => new HttpResponse(null, { status: 204 })),

  // Publish/unpublish
  http.post(`${BASE}/api/exam/exams/:id/publish`, ({ params }) =>
    HttpResponse.json({ id: params['id'], status: 'published' }),
  ),
  http.post(`${BASE}/api/exam/exams/:id/unpublish`, ({ params }) =>
    HttpResponse.json({ id: params['id'], status: 'draft' }),
  ),

  // Paper categories
  http.get(`${BASE}/api/exam/paper-categories`, () =>
    HttpResponse.json([
      { id: 'cat-toan', name: 'Toán học', questionCount: 150 },
      { id: 'cat-ly', name: 'Vật lý', questionCount: 80 },
      { id: 'cat-van', name: 'Ngữ văn', questionCount: 60 },
    ]),
  ),

  // Question bank
  http.get(`${BASE}/api/exam/question-bank`, () =>
    HttpResponse.json({ data: mockQuestions, total: mockQuestions.length }),
  ),
  http.post(`${BASE}/api/exam/question-bank`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'q-new', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/exam/question-bank/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/exam/question-bank/:id`, () => new HttpResponse(null, { status: 204 })),

  // Questions (actual hook URLs) — stats MUST come before :id to avoid route collision
  http.get(`${BASE}/api/exam/questions/stats`, () =>
    HttpResponse.json({ data: mockQuestionStats, success: true }),
  ),
  http.get(`${BASE}/api/exam/questions`, () =>
    HttpResponse.json({
      data: mockQuestionsFull,
      pagination: { page: 1, pageSize: mockQuestionsFull.length, total: mockQuestionsFull.length, totalPages: 1 },
    }),
  ),
  http.get(`${BASE}/api/exam/questions/:id`, ({ params }) =>
    HttpResponse.json({ data: mockQuestionsFull.find((q) => q.id === params['id']) ?? mockQuestionsFull[0], success: true }),
  ),
  http.delete(`${BASE}/api/exam/questions/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/api/exam/questions/:id/copy`, ({ params }) =>
    HttpResponse.json({ data: { ...mockQuestionsFull[0], id: 'q-copy' }, success: true }),
  ),

  // Question categories (actual hook URL)
  http.get(`${BASE}/api/exam/categories`, () =>
    HttpResponse.json({ data: mockCategories, success: true }),
  ),

  // Session categories
  http.get(`${BASE}/api/exam/session-categories`, () =>
    HttpResponse.json({ data: mockSessionCategories, success: true }),
  ),

  // Sessions
  http.get(`${BASE}/api/exam/sessions`, () =>
    HttpResponse.json({
      data: mockSessions,
      pagination: { page: 1, pageSize: mockSessions.length, total: mockSessions.length, totalPages: 1 },
    }),
  ),
  http.get(`${BASE}/api/exam/sessions/:id`, ({ params }) =>
    HttpResponse.json({ data: mockSessions.find((s) => s.id === params['id']) ?? mockSessions[0], success: true }),
  ),
  http.delete(`${BASE}/api/exam/sessions/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/api/exam/sessions`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'session-new', status: 'draft', ...body }, { status: 201 })
  }),
]
