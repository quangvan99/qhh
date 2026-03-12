import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8080'

const mockClasses = [
  {
    id: 'class-1',
    name: '10A1',
    subject: 'Toán học',
    teacher: { id: 'teacher-1', name: 'GV. Nguyễn Văn An' },
    studentCount: 35,
    status: 'active',
    semester: 'HK1 2024-2025',
  },
  {
    id: 'class-2',
    name: '11B2',
    subject: 'Vật lý',
    teacher: { id: 'teacher-2', name: 'GV. Trần Thị Bình' },
    studentCount: 30,
    status: 'active',
    semester: 'HK1 2024-2025',
  },
  {
    id: 'class-3',
    name: '12C3',
    subject: 'Hóa học',
    teacher: { id: 'teacher-1', name: 'GV. Nguyễn Văn An' },
    studentCount: 28,
    status: 'archived',
    semester: 'HK2 2023-2024',
  },
]

const mockStudents = [
  { id: 'stu-1', name: 'Nguyễn Thị Lan', studentCode: 'HS001', status: 'approved', avatar: null },
  { id: 'stu-2', name: 'Trần Văn Minh', studentCode: 'HS002', status: 'pending', avatar: null },
  { id: 'stu-3', name: 'Lê Hoàng Nam', studentCode: 'HS003', status: 'approved', avatar: null },
]

const mockAssignments = [
  {
    id: 'asgn-1',
    title: 'Bài tập chương 1',
    type: 'file',
    status: 'published',
    deadline: '2025-03-20T23:59:00Z',
    submissionCount: 20,
    totalStudents: 35,
    classId: 'class-1',
  },
  {
    id: 'asgn-2',
    title: 'Kiểm tra trắc nghiệm tuần 2',
    type: 'quiz',
    status: 'draft',
    deadline: '2025-03-25T23:59:00Z',
    submissionCount: 0,
    totalStudents: 35,
    classId: 'class-1',
  },
]

const mockContentGroups = [
  {
    id: 'cg-1',
    name: 'Chương 1: Hàm số',
    order: 1,
    classId: 'class-1',
    items: [
      { id: 'ci-1', title: 'Bài giảng slide', type: 'file', order: 1 },
      { id: 'ci-2', title: 'Video bài giảng', type: 'video', order: 2 },
    ],
  },
  {
    id: 'cg-2',
    name: 'Chương 2: Đạo hàm',
    order: 2,
    classId: 'class-1',
    items: [],
  },
]

export const lmsHandlers = [
  // Classes
  http.get(`${BASE}/api/lms/classes`, () =>
    HttpResponse.json({ data: mockClasses, total: mockClasses.length, page: 1, pageSize: 10 }),
  ),
  http.get(`${BASE}/api/lms/classes/dashboard-stats`, () =>
    HttpResponse.json({ totalClasses: 3, activeClasses: 2, totalStudents: 93 }),
  ),
  http.get(`${BASE}/api/lms/classes/:id`, ({ params }) =>
    HttpResponse.json(mockClasses.find((c) => c.id === params['id']) ?? mockClasses[0]),
  ),
  http.post(`${BASE}/api/lms/classes`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'class-new', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/lms/classes/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/lms/classes/:id`, () => new HttpResponse(null, { status: 204 })),

  // Students
  http.get(`${BASE}/api/lms/classes/:classId/students`, () =>
    HttpResponse.json({ data: mockStudents, total: mockStudents.length }),
  ),
  http.post(`${BASE}/api/lms/classes/:classId/students/:studentId/approve`, () =>
    HttpResponse.json({ success: true }),
  ),
  http.post(`${BASE}/api/lms/classes/:classId/students/bulk-approve`, () =>
    HttpResponse.json({ success: true }),
  ),
  http.delete(`${BASE}/api/lms/classes/:classId/students/:studentId`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // Assignments
  http.get(`${BASE}/api/lms/assignments`, () =>
    HttpResponse.json({ data: mockAssignments, total: mockAssignments.length }),
  ),
  http.get(`${BASE}/api/lms/assignments/:id`, ({ params }) =>
    HttpResponse.json(mockAssignments.find((a) => a.id === params['id']) ?? mockAssignments[0]),
  ),
  http.post(`${BASE}/api/lms/assignments`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'asgn-new', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/lms/assignments/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/lms/assignments/:id`, () => new HttpResponse(null, { status: 204 })),

  // Content groups
  http.get(`${BASE}/api/lms/content-groups`, () =>
    HttpResponse.json(mockContentGroups),
  ),
  http.post(`${BASE}/api/lms/content-groups`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'cg-new', items: [], ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/lms/content-groups/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/lms/content-groups/:id`, () => new HttpResponse(null, { status: 204 })),

  // Users (for student search)
  http.get(`${BASE}/api/users`, () =>
    HttpResponse.json({ data: mockStudents, total: mockStudents.length }),
  ),
]
