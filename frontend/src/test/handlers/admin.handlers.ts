import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8080'

// Matches SystemUser interface: fullName (not name), unitId/unitName, lastLogin
const mockUsers = [
  {
    id: 'user-1',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@school.edu.vn',
    username: 'admin',
    role: 'admin',
    status: 'active',
    unitId: 'ou-1',
    unitName: 'Ban giám hiệu',
    lastLogin: '2025-03-10T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    fullName: 'GV. Trần Thị Bình',
    email: 'binh@school.edu.vn',
    username: 'gv_binh',
    role: 'teacher',
    status: 'active',
    unitId: 'ou-2',
    unitName: 'Tổ Toán',
    lastLogin: '2025-03-11T07:30:00Z',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'user-3',
    fullName: 'HS. Lê Hoàng Nam',
    email: 'nam@school.edu.vn',
    username: 'hs_nam',
    role: 'student',
    status: 'active',
    unitId: null,
    unitName: null,
    lastLogin: null,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'user-4',
    fullName: 'Phạm Thu Hiệu Trưởng',
    email: 'hieupho@school.edu.vn',
    username: 'principal',
    role: 'principal',
    status: 'locked',
    unitId: 'ou-1',
    unitName: 'Ban giám hiệu',
    lastLogin: '2025-02-01T08:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
  },
]

const mockRoles = [
  {
    id: 'role-1',
    name: 'admin',
    displayName: 'Quản trị viên',
    isSystem: true,
    userCount: 2,
  },
  {
    id: 'role-2',
    name: 'teacher',
    displayName: 'Giáo viên',
    isSystem: true,
    userCount: 15,
  },
  {
    id: 'role-3',
    name: 'custom-role',
    displayName: 'Vai trò tùy chỉnh',
    isSystem: false,
    userCount: 3,
  },
]

// Matches SystemSettings interface: nested general/email/security structure
const mockSettings = {
  general: {
    schoolName: 'Trường THPT Quốc Học',
    logoUrl: '',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'no-reply@quochoc.edu.vn',
    fromName: 'Trường THPT Quốc Học',
    fromEmail: 'no-reply@quochoc.edu.vn',
  },
  security: {
    sessionTimeoutMinutes: 60,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: false,
  },
}

export const adminHandlers = [
  // Users
  http.get(`${BASE}/api/v1/admin/users`, () =>
    HttpResponse.json({ data: mockUsers, total: mockUsers.length, page: 1, pageSize: 10 }),
  ),
  http.get(`${BASE}/api/v1/admin/users/:id`, ({ params }) =>
    HttpResponse.json(mockUsers.find((u) => u.id === params['id']) ?? mockUsers[0]),
  ),
  http.post(`${BASE}/api/v1/admin/users`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'user-new', status: 'active', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/v1/admin/users/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/v1/admin/users/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/api/v1/admin/users/:userId/reset-password`, () =>
    HttpResponse.json({ message: 'Đã gửi email đặt lại mật khẩu' }),
  ),
  http.post(`${BASE}/api/v1/admin/users/bulk-activate`, () =>
    HttpResponse.json({ success: true }),
  ),
  http.post(`${BASE}/api/v1/admin/users/bulk-deactivate`, () =>
    HttpResponse.json({ success: true }),
  ),

  // Roles
  http.get(`${BASE}/api/v1/admin/roles`, () =>
    HttpResponse.json(mockRoles),
  ),
  http.get(`${BASE}/api/v1/admin/roles/:id`, ({ params }) =>
    HttpResponse.json(mockRoles.find((r) => r.id === params['id']) ?? mockRoles[0]),
  ),
  http.post(`${BASE}/api/v1/admin/roles`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'role-new', isSystem: false, userCount: 0, ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/v1/admin/roles/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/v1/admin/roles/:id`, () => new HttpResponse(null, { status: 204 })),

  // Permissions
  http.get(`${BASE}/api/v1/admin/permissions`, () =>
    HttpResponse.json([
      { key: 'users.view', name: 'Xem người dùng' },
      { key: 'users.create', name: 'Tạo người dùng' },
      { key: 'exam.view', name: 'Xem đề thi' },
    ]),
  ),
  http.get(`${BASE}/api/v1/admin/roles/:roleId/permissions`, () =>
    HttpResponse.json({ permissionKeys: ['users.view'] }),
  ),
  http.put(`${BASE}/api/v1/admin/roles/:roleId/permissions`, () =>
    HttpResponse.json({ success: true }),
  ),

  // Settings
  http.get(`${BASE}/api/v1/admin/settings`, () =>
    HttpResponse.json(mockSettings),
  ),
  http.patch(`${BASE}/api/v1/admin/settings`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ ...mockSettings, ...body })
  }),

  // Org units
  http.get(`${BASE}/api/v1/admin/org-units`, () =>
    HttpResponse.json([
      { id: 'ou-1', name: 'Ban giám hiệu', parentId: null },
      { id: 'ou-2', name: 'Tổ Toán', parentId: 'ou-1' },
    ]),
  ),

  // Audit logs
  http.get(`${BASE}/api/v1/admin/audit-logs`, () =>
    HttpResponse.json({
      data: [
        { id: 'log-1', action: 'user.create', actor: 'admin', createdAt: '2025-03-01T10:00:00Z' },
      ],
      total: 1,
    }),
  ),
]
