import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { PaginatedResponse } from '@/types'
import type {
  SystemUser,
  Role,
  Permission,
  OrgUnit,
  SystemSettings,
  AuditLog,
  Integration,
  UserFilterParams,
  AuditLogFilterParams,
} from '../types/admin.types'

// ── Query Keys ──
const keys = {
  users: ['admin', 'users'] as const,
  user: (id: string) => ['admin', 'users', id] as const,
  roles: ['admin', 'roles'] as const,
  role: (id: string) => ['admin', 'roles', id] as const,
  permissions: ['admin', 'permissions'] as const,
  rolePermissions: (roleId: string) => ['admin', 'roles', roleId, 'permissions'] as const,
  orgUnits: ['admin', 'org-units'] as const,
  settings: ['admin', 'settings'] as const,
  auditLogs: ['admin', 'audit-logs'] as const,
  integrations: ['admin', 'integrations'] as const,
}

// ─── Mock Data ──────────────────────────────────────────────────

const MOCK_USERS: SystemUser[] = [
  {
    id: 'u-001',
    username: 'superadmin',
    fullName: 'Nguyễn Văn Quản Trị',
    email: 'superadmin@truong.edu.vn',
    role: 'admin',
    unitId: 'ou-001',
    unitName: 'Trường THPT Nguyễn Du',
    avatar: undefined,
    status: 'active',
    lastLogin: '2026-03-12T08:15:00Z',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'u-002',
    username: 'admin.khoa',
    fullName: 'Trần Thị Bích Hoa',
    email: 'bichoa@truong.edu.vn',
    role: 'admin',
    unitId: 'ou-002',
    unitName: 'Khoa Công nghệ Thông tin',
    status: 'active',
    lastLogin: '2026-03-11T14:22:00Z',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'u-003',
    username: 'giaovien.toan',
    fullName: 'Lê Minh Tuấn',
    email: 'minhtuan@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-003',
    unitName: 'Bộ môn Toán',
    status: 'active',
    lastLogin: '2026-03-12T07:45:00Z',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'u-004',
    username: 'giaovien.ly',
    fullName: 'Phạm Thanh Hương',
    email: 'thanhuong@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-004',
    unitName: 'Bộ môn Vật lý',
    status: 'active',
    lastLogin: '2026-03-10T09:30:00Z',
    createdAt: '2024-03-05T00:00:00Z',
  },
  {
    id: 'u-005',
    username: 'giaovien.van',
    fullName: 'Hoàng Đức Mạnh',
    email: 'ducmanh@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-005',
    unitName: 'Bộ môn Ngữ văn',
    status: 'active',
    lastLogin: '2026-03-09T11:00:00Z',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'u-006',
    username: 'sinhvien.001',
    fullName: 'Nguyễn Thị Lan Anh',
    email: 'lananh.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-010',
    unitName: 'Lớp 12A1',
    status: 'active',
    lastLogin: '2026-03-12T06:20:00Z',
    createdAt: '2024-09-01T00:00:00Z',
  },
  {
    id: 'u-007',
    username: 'sinhvien.002',
    fullName: 'Trần Văn Bình',
    email: 'tvbinh.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-010',
    unitName: 'Lớp 12A1',
    status: 'active',
    lastLogin: '2026-03-11T20:10:00Z',
    createdAt: '2024-09-01T00:00:00Z',
  },
  {
    id: 'u-008',
    username: 'sinhvien.003',
    fullName: 'Lê Thị Cẩm Tú',
    email: 'camtu.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-011',
    unitName: 'Lớp 11B2',
    status: 'inactive',
    lastLogin: undefined,
    createdAt: '2024-09-02T00:00:00Z',
  },
  {
    id: 'u-009',
    username: 'thuthu.01',
    fullName: 'Võ Ngọc Thư',
    email: 'ngocthu@truong.edu.vn',
    role: 'librarian',
    unitId: 'ou-006',
    unitName: 'Thư viện trường',
    status: 'active',
    lastLogin: '2026-03-12T08:00:00Z',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'u-010',
    username: 'principal.01',
    fullName: 'PGS.TS Đinh Quang Hùng',
    email: 'quanghung@truong.edu.vn',
    role: 'principal',
    unitId: 'ou-001',
    unitName: 'Ban Giám hiệu',
    status: 'active',
    lastLogin: '2026-03-12T08:30:00Z',
    createdAt: '2023-07-01T00:00:00Z',
  },
  {
    id: 'u-011',
    username: 'giaovien.hoa',
    fullName: 'Nguyễn Thị Phương Linh',
    email: 'phuonglinh@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-007',
    unitName: 'Bộ môn Hóa học',
    status: 'active',
    lastLogin: '2026-03-11T16:45:00Z',
    createdAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 'u-012',
    username: 'giaovien.su',
    fullName: 'Đặng Tiến Dũng',
    email: 'tiendung@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-008',
    unitName: 'Bộ môn Lịch sử',
    status: 'locked',
    lastLogin: '2026-02-28T10:00:00Z',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'u-013',
    username: 'sinhvien.004',
    fullName: 'Bùi Khánh Linh',
    email: 'khanhlinh.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-012',
    unitName: 'Lớp 10C3',
    status: 'active',
    lastLogin: '2026-03-10T19:55:00Z',
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'u-014',
    username: 'sinhvien.005',
    fullName: 'Phan Anh Khoa',
    email: 'anhkhoa.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-012',
    unitName: 'Lớp 10C3',
    status: 'active',
    lastLogin: '2026-03-12T07:00:00Z',
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'u-015',
    username: 'staff.ketoan',
    fullName: 'Lê Thị Mỹ Duyên',
    email: 'myduyen@truong.edu.vn',
    role: 'staff',
    unitId: 'ou-009',
    unitName: 'Phòng Tài vụ',
    status: 'active',
    lastLogin: '2026-03-12T08:05:00Z',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u-016',
    username: 'staff.hcns',
    fullName: 'Trương Văn Nam',
    email: 'tvannam@truong.edu.vn',
    role: 'staff',
    unitId: 'ou-009',
    unitName: 'Phòng Hành chính',
    status: 'active',
    lastLogin: '2026-03-11T17:30:00Z',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'u-017',
    username: 'giaovien.anh',
    fullName: 'Ngô Thị Thu Hằng',
    email: 'thuhang@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-013',
    unitName: 'Bộ môn Tiếng Anh',
    status: 'inactive',
    lastLogin: '2026-01-15T09:00:00Z',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'u-018',
    username: 'sinhvien.006',
    fullName: 'Vũ Đình Hải',
    email: 'dinhhai.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-011',
    unitName: 'Lớp 11B2',
    status: 'locked',
    lastLogin: '2026-02-01T08:00:00Z',
    createdAt: '2024-09-03T00:00:00Z',
  },
  {
    id: 'u-019',
    username: 'giaovien.tin',
    fullName: 'Mai Xuân Trường',
    email: 'xuantruong@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-002',
    unitName: 'Khoa Công nghệ Thông tin',
    status: 'active',
    lastLogin: '2026-03-12T09:00:00Z',
    createdAt: '2024-08-01T00:00:00Z',
  },
  {
    id: 'u-020',
    username: 'thuthu.02',
    fullName: 'Lý Thị Kim Oanh',
    email: 'kimoanh@truong.edu.vn',
    role: 'librarian',
    unitId: 'ou-006',
    unitName: 'Thư viện trường',
    status: 'active',
    lastLogin: '2026-03-11T13:20:00Z',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'u-021',
    username: 'sinhvien.007',
    fullName: 'Đinh Thị Yến Nhi',
    email: 'yennhi.sv@truong.edu.vn',
    role: 'student',
    unitId: 'ou-010',
    unitName: 'Lớp 12A1',
    status: 'active',
    lastLogin: '2026-03-12T06:40:00Z',
    createdAt: '2024-09-01T00:00:00Z',
  },
  {
    id: 'u-022',
    username: 'giaovien.sinh',
    fullName: 'Cao Thị Ánh Nguyệt',
    email: 'anhnguyet@truong.edu.vn',
    role: 'teacher',
    unitId: 'ou-014',
    unitName: 'Bộ môn Sinh học',
    status: 'active',
    lastLogin: '2026-03-11T15:00:00Z',
    createdAt: '2024-09-15T00:00:00Z',
  },
]

const MOCK_ROLES: Role[] = [
  {
    id: 'role-001',
    name: 'Super Admin',
    description: 'Quyền cao nhất – toàn quyền quản trị hệ thống',
    userCount: 1,
    permissions: [
      'lms:read', 'lms:create', 'lms:update', 'lms:delete', 'lms:export',
      'exam:read', 'exam:create', 'exam:update', 'exam:delete', 'exam:export',
      'ai-attendance:read', 'ai-attendance:create', 'ai-attendance:update', 'ai-attendance:delete', 'ai-attendance:export',
      'library:read', 'library:create', 'library:update', 'library:delete', 'library:export',
      'admin:read', 'admin:create', 'admin:update', 'admin:delete', 'admin:export',
      'system:read', 'system:create', 'system:update', 'system:delete', 'system:export',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-002',
    name: 'Admin',
    description: 'Quản trị viên – quản lý người dùng và cài đặt hệ thống',
    userCount: 2,
    permissions: [
      'lms:read', 'lms:create', 'lms:update', 'lms:delete', 'lms:export',
      'exam:read', 'exam:create', 'exam:update', 'exam:delete',
      'ai-attendance:read', 'ai-attendance:update',
      'library:read', 'library:update',
      'admin:read', 'admin:create', 'admin:update', 'admin:delete',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-003',
    name: 'Giáo viên',
    description: 'Giảng viên – quản lý khóa học, bài giảng và điểm danh',
    userCount: 8,
    permissions: [
      'lms:read', 'lms:create', 'lms:update',
      'exam:read', 'exam:create', 'exam:update',
      'ai-attendance:read', 'ai-attendance:create', 'ai-attendance:update',
      'library:read',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-004',
    name: 'Sinh viên',
    description: 'Học sinh/sinh viên – xem tài liệu và nộp bài tập',
    userCount: 7,
    permissions: [
      'lms:read',
      'exam:read',
      'ai-attendance:read',
      'library:read',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-005',
    name: 'Thủ thư',
    description: 'Quản lý thư viện và tài nguyên học liệu',
    userCount: 2,
    permissions: [
      'lms:read',
      'library:read', 'library:create', 'library:update', 'library:delete', 'library:export',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-006',
    name: 'Ban Giám hiệu',
    description: 'Hiệu trưởng/Phó hiệu trưởng – xem báo cáo toàn trường',
    userCount: 1,
    permissions: [
      'lms:read', 'lms:export',
      'exam:read', 'exam:export',
      'ai-attendance:read', 'ai-attendance:export',
      'library:read',
      'admin:read',
      'system:read',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-007',
    name: 'Nhân viên',
    description: 'Nhân viên hành chính – hỗ trợ quản lý hồ sơ',
    userCount: 2,
    permissions: [
      'lms:read',
      'exam:read',
      'admin:read',
    ],
    isSystem: false,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'role-008',
    name: 'Trợ giảng',
    description: 'Hỗ trợ giáo viên trong giảng dạy và chấm bài',
    userCount: 0,
    permissions: [
      'lms:read', 'lms:create', 'lms:update',
      'exam:read', 'exam:update',
      'ai-attendance:read',
    ],
    isSystem: false,
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'role-009',
    name: 'Khách',
    description: 'Tài khoản khách – quyền xem giới hạn',
    userCount: 0,
    permissions: [
      'lms:read',
      'library:read',
    ],
    isSystem: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
]

const MOCK_PERMISSIONS: Permission[] = [
  // LMS
  { key: 'lms:read',   module: 'lms', action: 'read',   label: 'Xem khóa học' },
  { key: 'lms:create', module: 'lms', action: 'create', label: 'Tạo khóa học' },
  { key: 'lms:update', module: 'lms', action: 'update', label: 'Sửa khóa học' },
  { key: 'lms:delete', module: 'lms', action: 'delete', label: 'Xóa khóa học' },
  { key: 'lms:export', module: 'lms', action: 'export', label: 'Xuất dữ liệu LMS' },
  // Exam
  { key: 'exam:read',   module: 'exam', action: 'read',   label: 'Xem bài thi' },
  { key: 'exam:create', module: 'exam', action: 'create', label: 'Tạo bài thi' },
  { key: 'exam:update', module: 'exam', action: 'update', label: 'Sửa bài thi' },
  { key: 'exam:delete', module: 'exam', action: 'delete', label: 'Xóa bài thi' },
  { key: 'exam:export', module: 'exam', action: 'export', label: 'Xuất kết quả thi' },
  // AI Attendance
  { key: 'ai-attendance:read',   module: 'ai-attendance', action: 'read',   label: 'Xem điểm danh' },
  { key: 'ai-attendance:create', module: 'ai-attendance', action: 'create', label: 'Tạo phiên điểm danh' },
  { key: 'ai-attendance:update', module: 'ai-attendance', action: 'update', label: 'Cập nhật điểm danh' },
  { key: 'ai-attendance:delete', module: 'ai-attendance', action: 'delete', label: 'Xóa phiên điểm danh' },
  { key: 'ai-attendance:export', module: 'ai-attendance', action: 'export', label: 'Xuất báo cáo điểm danh' },
  // Library
  { key: 'library:read',   module: 'library', action: 'read',   label: 'Xem thư viện' },
  { key: 'library:create', module: 'library', action: 'create', label: 'Thêm tài liệu' },
  { key: 'library:update', module: 'library', action: 'update', label: 'Sửa tài liệu' },
  { key: 'library:delete', module: 'library', action: 'delete', label: 'Xóa tài liệu' },
  { key: 'library:export', module: 'library', action: 'export', label: 'Xuất danh mục' },
  // Admin
  { key: 'admin:read',   module: 'admin', action: 'read',   label: 'Xem quản trị' },
  { key: 'admin:create', module: 'admin', action: 'create', label: 'Tạo cấu hình' },
  { key: 'admin:update', module: 'admin', action: 'update', label: 'Cập nhật cấu hình' },
  { key: 'admin:delete', module: 'admin', action: 'delete', label: 'Xóa dữ liệu quản trị' },
  { key: 'admin:export', module: 'admin', action: 'export', label: 'Xuất báo cáo quản trị' },
  // System
  { key: 'system:read',   module: 'system', action: 'read',   label: 'Xem hệ thống' },
  { key: 'system:create', module: 'system', action: 'create', label: 'Tạo cài đặt hệ thống' },
  { key: 'system:update', module: 'system', action: 'update', label: 'Cập nhật hệ thống' },
  { key: 'system:delete', module: 'system', action: 'delete', label: 'Xóa cài đặt hệ thống' },
  { key: 'system:export', module: 'system', action: 'export', label: 'Xuất log hệ thống' },
]

const MOCK_ORG_UNITS: OrgUnit[] = [
  {
    id: 'ou-001',
    name: 'Trường THPT Nguyễn Du',
    code: 'THPTND',
    type: 'school',
    parentId: undefined,
    order: 1,
    userCount: 3,
    children: [
      {
        id: 'ou-002',
        name: 'Khoa Công nghệ Thông tin',
        code: 'CNTT',
        type: 'department',
        parentId: 'ou-001',
        order: 1,
        userCount: 12,
        children: [
          {
            id: 'ou-013',
            name: 'Bộ môn Lập trình',
            code: 'BM-LT',
            type: 'group',
            parentId: 'ou-002',
            order: 1,
            userCount: 5,
            children: [],
          },
          {
            id: 'ou-019',
            name: 'Bộ môn Mạng máy tính',
            code: 'BM-MMT',
            type: 'group',
            parentId: 'ou-002',
            order: 2,
            userCount: 4,
            children: [],
          },
        ],
      },
      {
        id: 'ou-015',
        name: 'Khoa Khoa học Tự nhiên',
        code: 'KHTN',
        type: 'department',
        parentId: 'ou-001',
        order: 2,
        userCount: 18,
        children: [
          {
            id: 'ou-003',
            name: 'Bộ môn Toán',
            code: 'BM-TOAN',
            type: 'group',
            parentId: 'ou-015',
            order: 1,
            userCount: 6,
            children: [],
          },
          {
            id: 'ou-004',
            name: 'Bộ môn Vật lý',
            code: 'BM-VL',
            type: 'group',
            parentId: 'ou-015',
            order: 2,
            userCount: 5,
            children: [],
          },
          {
            id: 'ou-007',
            name: 'Bộ môn Hóa học',
            code: 'BM-HH',
            type: 'group',
            parentId: 'ou-015',
            order: 3,
            userCount: 4,
            children: [],
          },
          {
            id: 'ou-014',
            name: 'Bộ môn Sinh học',
            code: 'BM-SH',
            type: 'group',
            parentId: 'ou-015',
            order: 4,
            userCount: 3,
            children: [],
          },
        ],
      },
      {
        id: 'ou-016',
        name: 'Khoa Khoa học Xã hội',
        code: 'KHXH',
        type: 'department',
        parentId: 'ou-001',
        order: 3,
        userCount: 14,
        children: [
          {
            id: 'ou-005',
            name: 'Bộ môn Ngữ văn',
            code: 'BM-NV',
            type: 'group',
            parentId: 'ou-016',
            order: 1,
            userCount: 5,
            children: [],
          },
          {
            id: 'ou-008',
            name: 'Bộ môn Lịch sử',
            code: 'BM-LS',
            type: 'group',
            parentId: 'ou-016',
            order: 2,
            userCount: 4,
            children: [],
          },
          {
            id: 'ou-017',
            name: 'Bộ môn Địa lý',
            code: 'BM-DL',
            type: 'group',
            parentId: 'ou-016',
            order: 3,
            userCount: 3,
            children: [],
          },
          {
            id: 'ou-018',
            name: 'Bộ môn Tiếng Anh',
            code: 'BM-TA',
            type: 'group',
            parentId: 'ou-016',
            order: 4,
            userCount: 2,
            children: [],
          },
        ],
      },
      {
        id: 'ou-006',
        name: 'Thư viện trường',
        code: 'TV',
        type: 'group',
        parentId: 'ou-001',
        order: 4,
        userCount: 2,
        children: [],
      },
      {
        id: 'ou-009',
        name: 'Phòng Hành chính - Tổng hợp',
        code: 'HCTH',
        type: 'group',
        parentId: 'ou-001',
        order: 5,
        userCount: 5,
        children: [],
      },
      {
        id: 'ou-020',
        name: 'Khối lớp 12',
        code: 'K12',
        type: 'department',
        parentId: 'ou-001',
        order: 6,
        userCount: 45,
        children: [
          {
            id: 'ou-010',
            name: 'Lớp 12A1',
            code: 'L12A1',
            type: 'class',
            parentId: 'ou-020',
            order: 1,
            userCount: 38,
            children: [],
          },
          {
            id: 'ou-021',
            name: 'Lớp 12A2',
            code: 'L12A2',
            type: 'class',
            parentId: 'ou-020',
            order: 2,
            userCount: 36,
            children: [],
          },
        ],
      },
      {
        id: 'ou-022',
        name: 'Khối lớp 11',
        code: 'K11',
        type: 'department',
        parentId: 'ou-001',
        order: 7,
        userCount: 42,
        children: [
          {
            id: 'ou-011',
            name: 'Lớp 11B2',
            code: 'L11B2',
            type: 'class',
            parentId: 'ou-022',
            order: 1,
            userCount: 40,
            children: [],
          },
        ],
      },
      {
        id: 'ou-023',
        name: 'Khối lớp 10',
        code: 'K10',
        type: 'department',
        parentId: 'ou-001',
        order: 8,
        userCount: 38,
        children: [
          {
            id: 'ou-012',
            name: 'Lớp 10C3',
            code: 'L10C3',
            type: 'class',
            parentId: 'ou-023',
            order: 1,
            userCount: 38,
            children: [],
          },
        ],
      },
    ],
  },
]

const MOCK_SETTINGS: SystemSettings = {
  general: {
    schoolName: 'Trường THPT Nguyễn Du',
    logoUrl: '/images/logo-school.png',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'no-reply@truong.edu.vn',
    smtpPassword: '',
    fromName: 'Hệ thống Trường THPT Nguyễn Du',
    fromEmail: 'no-reply@truong.edu.vn',
  },
  security: {
    sessionTimeoutMinutes: 60,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: false,
    passwordExpiryDays: 90,
  },
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-001',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T08:15:00Z',
    before: null,
    after: { sessionId: 'sess-001' },
  },
  {
    id: 'log-002',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'CREATE',
    module: 'admin',
    resourceType: 'user',
    resourceId: 'u-022',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T08:20:00Z',
    before: null,
    after: { username: 'giaovien.sinh', fullName: 'Cao Thị Ánh Nguyệt', role: 'teacher' },
  },
  {
    id: 'log-003',
    userId: 'u-002',
    userName: 'Trần Thị Bích Hoa',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'role',
    resourceId: 'role-007',
    ipAddress: '10.0.0.25',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/17',
    createdAt: '2026-03-12T09:05:00Z',
    before: { name: 'Staff', permissions: ['lms:read'] },
    after: { name: 'Nhân viên', permissions: ['lms:read', 'exam:read', 'admin:read'] },
  },
  {
    id: 'log-004',
    userId: 'u-010',
    userName: 'PGS.TS Đinh Quang Hùng',
    action: 'EXPORT',
    module: 'ai-attendance',
    resourceType: 'attendance_report',
    resourceId: 'report-mar-2026',
    ipAddress: '172.16.0.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122',
    createdAt: '2026-03-11T14:30:00Z',
    before: null,
    after: { format: 'xlsx', rows: 312 },
  },
  {
    id: 'log-005',
    userId: 'u-003',
    userName: 'Lê Minh Tuấn',
    action: 'CREATE',
    module: 'lms',
    resourceType: 'course',
    resourceId: 'course-045',
    ipAddress: '192.168.1.55',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T10:00:00Z',
    before: null,
    after: { title: 'Đại số tuyến tính – HK2 2025-2026', students: 38 },
  },
  {
    id: 'log-006',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'settings',
    resourceId: 'settings-general',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-10T16:00:00Z',
    before: { passwordExpiryDays: 180 },
    after: { passwordExpiryDays: 90 },
  },
  {
    id: 'log-007',
    userId: 'u-012',
    userName: 'Đặng Tiến Dũng',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-007',
    ipAddress: '203.113.131.200',
    userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Chrome/122',
    createdAt: '2026-03-08T23:55:00Z',
    before: null,
    after: { location: 'Unknown', suspicious: true },
  },
  {
    id: 'log-008',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'user',
    resourceId: 'u-012',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-09T08:30:00Z',
    before: { status: 'active' },
    after: { status: 'locked' },
  },
  {
    id: 'log-009',
    userId: 'u-009',
    userName: 'Võ Ngọc Thư',
    action: 'CREATE',
    module: 'library',
    resourceType: 'book',
    resourceId: 'book-0892',
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) Chrome/122',
    createdAt: '2026-03-11T11:20:00Z',
    before: null,
    after: { title: 'Giải tích hàm nhiều biến', isbn: '978-604-15-3892-1', copies: 5 },
  },
  {
    id: 'log-010',
    userId: 'u-004',
    userName: 'Phạm Thanh Hương',
    action: 'CREATE',
    module: 'exam',
    resourceType: 'exam',
    resourceId: 'exam-0234',
    ipAddress: '10.0.0.44',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/123',
    createdAt: '2026-03-10T15:45:00Z',
    before: null,
    after: { title: 'Kiểm tra 15 phút – Quang học', class: '11B2', duration: 15 },
  },
  {
    id: 'log-011',
    userId: 'u-002',
    userName: 'Trần Thị Bích Hoa',
    action: 'DELETE',
    module: 'admin',
    resourceType: 'org_unit',
    resourceId: 'ou-old-01',
    ipAddress: '10.0.0.25',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/17',
    createdAt: '2026-03-08T10:00:00Z',
    before: { name: 'Tổ tư vấn học đường (cũ)', userCount: 0 },
    after: null,
  },
  {
    id: 'log-012',
    userId: 'u-003',
    userName: 'Lê Minh Tuấn',
    action: 'EXPORT',
    module: 'lms',
    resourceType: 'grade_report',
    resourceId: 'grade-12A1-hk2',
    ipAddress: '192.168.1.55',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-09T17:00:00Z',
    before: null,
    after: { format: 'xlsx', students: 38, course: 'Toán 12' },
  },
  {
    id: 'log-013',
    userId: 'u-015',
    userName: 'Lê Thị Mỹ Duyên',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-013',
    ipAddress: '192.168.1.70',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T08:05:00Z',
    before: null,
    after: { sessionId: 'sess-013' },
  },
  {
    id: 'log-014',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'CREATE',
    module: 'admin',
    resourceType: 'integration',
    resourceId: 'int-004',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-07T14:00:00Z',
    before: null,
    after: { name: 'Zoom Meeting', type: 'lgsp', status: 'connected' },
  },
  {
    id: 'log-015',
    userId: 'u-006',
    userName: 'Nguyễn Thị Lan Anh',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-015',
    ipAddress: '171.244.10.200',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3) Mobile Safari/17',
    createdAt: '2026-03-12T06:20:00Z',
    before: null,
    after: { sessionId: 'sess-015', device: 'iPhone' },
  },
  {
    id: 'log-016',
    userId: 'u-019',
    userName: 'Mai Xuân Trường',
    action: 'UPDATE',
    module: 'lms',
    resourceType: 'course',
    resourceId: 'course-028',
    ipAddress: '192.168.1.92',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T09:10:00Z',
    before: { title: 'Nhập môn lập trình' },
    after: { title: 'Nhập môn lập trình – Python 3.12' },
  },
  {
    id: 'log-017',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'LOGOUT',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-001',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T18:00:00Z',
    before: null,
    after: null,
  },
  {
    id: 'log-018',
    userId: 'u-009',
    userName: 'Võ Ngọc Thư',
    action: 'DELETE',
    module: 'library',
    resourceType: 'book',
    resourceId: 'book-0120',
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) Chrome/122',
    createdAt: '2026-03-10T10:30:00Z',
    before: { title: 'Vật lý đại cương (tái bản 1998)', copies: 0, status: 'discontinued' },
    after: null,
  },
  {
    id: 'log-019',
    userId: 'u-011',
    userName: 'Nguyễn Thị Phương Linh',
    action: 'CREATE',
    module: 'ai-attendance',
    resourceType: 'attendance_session',
    resourceId: 'att-sess-0056',
    ipAddress: '10.0.0.77',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T07:30:00Z',
    before: null,
    after: { class: '12A1', subject: 'Hóa học', date: '2026-03-11', presentCount: 35 },
  },
  {
    id: 'log-020',
    userId: 'u-002',
    userName: 'Trần Thị Bích Hoa',
    action: 'EXPORT',
    module: 'admin',
    resourceType: 'user_list',
    resourceId: 'export-users-20260311',
    ipAddress: '10.0.0.25',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/17',
    createdAt: '2026-03-11T09:45:00Z',
    before: null,
    after: { format: 'xlsx', totalRows: 22, filters: { role: 'teacher' } },
  },
  {
    id: 'log-021',
    userId: 'u-004',
    userName: 'Phạm Thanh Hương',
    action: 'UPDATE',
    module: 'ai-attendance',
    resourceType: 'attendance_record',
    resourceId: 'att-rec-11B2-0311',
    ipAddress: '10.0.0.44',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/123',
    createdAt: '2026-03-11T08:10:00Z',
    before: { studentId: 'u-018', status: 'absent' },
    after: { studentId: 'u-018', status: 'present', note: 'Cập nhật thủ công' },
  },
  {
    id: 'log-022',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'settings',
    resourceId: 'settings-email',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-05T11:00:00Z',
    before: { smtpHost: 'mail.truong.edu.vn' },
    after: { smtpHost: 'smtp.gmail.com', smtpPort: 587 },
  },
  {
    id: 'log-023',
    userId: 'u-010',
    userName: 'PGS.TS Đinh Quang Hùng',
    action: 'EXPORT',
    module: 'exam',
    resourceType: 'exam_report',
    resourceId: 'exam-report-hk1-2025',
    ipAddress: '172.16.0.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122',
    createdAt: '2026-03-03T15:00:00Z',
    before: null,
    after: { semester: 'HK1 2025-2026', totalExams: 48, format: 'pdf' },
  },
  {
    id: 'log-024',
    userId: 'u-016',
    userName: 'Trương Văn Nam',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-024',
    ipAddress: '192.168.1.72',
    userAgent: 'Mozilla/5.0 (Windows NT 11.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T17:30:00Z',
    before: null,
    after: { sessionId: 'sess-024' },
  },
  {
    id: 'log-025',
    userId: 'u-003',
    userName: 'Lê Minh Tuấn',
    action: 'DELETE',
    module: 'exam',
    resourceType: 'exam',
    resourceId: 'exam-draft-0099',
    ipAddress: '192.168.1.55',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-08T14:20:00Z',
    before: { title: 'Bài kiểm tra nháp – chưa hoàn thiện', status: 'draft' },
    after: null,
  },
  // Thêm 25 log entries để đạt 50+
  {
    id: 'log-026',
    userId: 'u-005',
    userName: 'Hoàng Đức Mạnh',
    action: 'CREATE',
    module: 'lms',
    resourceType: 'assignment',
    resourceId: 'assign-0071',
    ipAddress: '10.0.0.60',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-10T13:00:00Z',
    before: null,
    after: { title: 'Phân tích tác phẩm Truyện Kiều', dueDate: '2026-03-20', class: '12A1' },
  },
  {
    id: 'log-027',
    userId: 'u-020',
    userName: 'Lý Thị Kim Oanh',
    action: 'UPDATE',
    module: 'library',
    resourceType: 'book',
    resourceId: 'book-0345',
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T14:00:00Z',
    before: { copies: 3 },
    after: { copies: 5, note: 'Nhập thêm 2 cuốn' },
  },
  {
    id: 'log-028',
    userId: 'u-007',
    userName: 'Trần Văn Bình',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-028',
    ipAddress: '171.244.55.100',
    userAgent: 'Mozilla/5.0 (Android 13; Mobile) Chrome/122',
    createdAt: '2026-03-11T20:10:00Z',
    before: null,
    after: { sessionId: 'sess-028', device: 'Android' },
  },
  {
    id: 'log-029',
    userId: 'u-002',
    userName: 'Trần Thị Bích Hoa',
    action: 'CREATE',
    module: 'admin',
    resourceType: 'org_unit',
    resourceId: 'ou-021',
    ipAddress: '10.0.0.25',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/17',
    createdAt: '2026-03-06T09:00:00Z',
    before: null,
    after: { name: 'Lớp 12A2', code: 'L12A2', type: 'class', parentId: 'ou-020' },
  },
  {
    id: 'log-030',
    userId: 'u-022',
    userName: 'Cao Thị Ánh Nguyệt',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-030',
    ipAddress: '10.0.0.99',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T07:55:00Z',
    before: null,
    after: { sessionId: 'sess-030' },
  },
  {
    id: 'log-031',
    userId: 'u-011',
    userName: 'Nguyễn Thị Phương Linh',
    action: 'EXPORT',
    module: 'ai-attendance',
    resourceType: 'attendance_report',
    resourceId: 'att-report-12A1-mar',
    ipAddress: '10.0.0.77',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T09:30:00Z',
    before: null,
    after: { class: '12A1', month: '03/2026', format: 'xlsx', rows: 38 },
  },
  {
    id: 'log-032',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'integration',
    resourceId: 'int-001',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-04T16:30:00Z',
    before: { status: 'disconnected' },
    after: { status: 'connected', lastTestedAt: '2026-03-04T16:30:00Z' },
  },
  {
    id: 'log-033',
    userId: 'u-019',
    userName: 'Mai Xuân Trường',
    action: 'CREATE',
    module: 'ai-attendance',
    resourceType: 'attendance_session',
    resourceId: 'att-sess-0060',
    ipAddress: '192.168.1.92',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T07:50:00Z',
    before: null,
    after: { class: '10C3', subject: 'Tin học', presentCount: 35 },
  },
  {
    id: 'log-034',
    userId: 'u-005',
    userName: 'Hoàng Đức Mạnh',
    action: 'UPDATE',
    module: 'exam',
    resourceType: 'exam',
    resourceId: 'exam-0189',
    ipAddress: '10.0.0.60',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-09T10:45:00Z',
    before: { status: 'draft' },
    after: { status: 'published', publishedAt: '2026-03-09T10:45:00Z' },
  },
  {
    id: 'log-035',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'CREATE',
    module: 'admin',
    resourceType: 'user',
    resourceId: 'u-020',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-10T09:00:00Z',
    before: null,
    after: { username: 'thuthu.02', fullName: 'Lý Thị Kim Oanh', role: 'librarian' },
  },
  {
    id: 'log-036',
    userId: 'u-009',
    userName: 'Võ Ngọc Thư',
    action: 'EXPORT',
    module: 'library',
    resourceType: 'borrow_report',
    resourceId: 'borrow-report-feb-2026',
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) Chrome/122',
    createdAt: '2026-03-01T10:00:00Z',
    before: null,
    after: { month: '02/2026', totalBorrows: 145, format: 'pdf' },
  },
  {
    id: 'log-037',
    userId: 'u-010',
    userName: 'PGS.TS Đinh Quang Hùng',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-037',
    ipAddress: '172.16.0.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122',
    createdAt: '2026-03-12T08:30:00Z',
    before: null,
    after: { sessionId: 'sess-037' },
  },
  {
    id: 'log-038',
    userId: 'u-003',
    userName: 'Lê Minh Tuấn',
    action: 'UPDATE',
    module: 'lms',
    resourceType: 'lesson',
    resourceId: 'lesson-0234',
    ipAddress: '192.168.1.55',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T11:00:00Z',
    before: { title: 'Bài 5: Phép tính vi phân' },
    after: { title: 'Bài 5: Phép tính vi phân – Nâng cao', videoUrl: 'https://cdn.truong.edu.vn/v/lesson-0234.mp4' },
  },
  {
    id: 'log-039',
    userId: 'u-004',
    userName: 'Phạm Thanh Hương',
    action: 'EXPORT',
    module: 'exam',
    resourceType: 'exam_result',
    resourceId: 'exam-0234-results',
    ipAddress: '10.0.0.44',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/123',
    createdAt: '2026-03-11T16:00:00Z',
    before: null,
    after: { exam: 'Kiểm tra 15 phút – Quang học', students: 40, format: 'xlsx' },
  },
  {
    id: 'log-040',
    userId: 'u-015',
    userName: 'Lê Thị Mỹ Duyên',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'user',
    resourceId: 'u-008',
    ipAddress: '192.168.1.70',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T10:00:00Z',
    before: { status: 'active' },
    after: { status: 'inactive', note: 'Nghỉ học kỳ' },
  },
  {
    id: 'log-041',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'DELETE',
    module: 'admin',
    resourceType: 'user',
    resourceId: 'u-old-999',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-07T09:00:00Z',
    before: { username: 'test.account', fullName: 'Tài khoản test', status: 'inactive' },
    after: null,
  },
  {
    id: 'log-042',
    userId: 'u-022',
    userName: 'Cao Thị Ánh Nguyệt',
    action: 'CREATE',
    module: 'lms',
    resourceType: 'course',
    resourceId: 'course-050',
    ipAddress: '10.0.0.99',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-12T08:00:00Z',
    before: null,
    after: { title: 'Sinh học phân tử – HK2 2025-2026', students: 36 },
  },
  {
    id: 'log-043',
    userId: 'u-002',
    userName: 'Trần Thị Bích Hoa',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'user',
    resourceId: 'u-017',
    ipAddress: '10.0.0.25',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/17',
    createdAt: '2026-03-06T14:00:00Z',
    before: { status: 'active' },
    after: { status: 'inactive', note: 'Nghỉ không lương' },
  },
  {
    id: 'log-044',
    userId: 'u-019',
    userName: 'Mai Xuân Trường',
    action: 'EXPORT',
    module: 'lms',
    resourceType: 'grade_report',
    resourceId: 'grade-10C3-hk2',
    ipAddress: '192.168.1.92',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-09T16:00:00Z',
    before: null,
    after: { course: 'Tin học 10', class: '10C3', format: 'xlsx', students: 38 },
  },
  {
    id: 'log-045',
    userId: 'u-009',
    userName: 'Võ Ngọc Thư',
    action: 'CREATE',
    module: 'library',
    resourceType: 'borrow_record',
    resourceId: 'borrow-00567',
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) Chrome/122',
    createdAt: '2026-03-12T09:00:00Z',
    before: null,
    after: { studentId: 'u-006', bookId: 'book-0892', dueDate: '2026-03-26' },
  },
  {
    id: 'log-046',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'admin',
    resourceType: 'role',
    resourceId: 'role-008',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-02T10:00:00Z',
    before: { name: 'Teaching Assistant' },
    after: { name: 'Trợ giảng', description: 'Hỗ trợ giáo viên trong giảng dạy và chấm bài' },
  },
  {
    id: 'log-047',
    userId: 'u-004',
    userName: 'Phạm Thanh Hương',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-047',
    ipAddress: '10.0.0.44',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/123',
    createdAt: '2026-03-12T07:55:00Z',
    before: null,
    after: { sessionId: 'sess-047' },
  },
  {
    id: 'log-048',
    userId: 'u-003',
    userName: 'Lê Minh Tuấn',
    action: 'CREATE',
    module: 'ai-attendance',
    resourceType: 'attendance_session',
    resourceId: 'att-sess-0059',
    ipAddress: '192.168.1.55',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T13:00:00Z',
    before: null,
    after: { class: '12A1', subject: 'Toán', presentCount: 36, totalStudents: 38 },
  },
  {
    id: 'log-049',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'system',
    resourceType: 'system_config',
    resourceId: 'config-maintenance',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-01T02:00:00Z',
    before: { maintenanceMode: false },
    after: { maintenanceMode: true, message: 'Bảo trì hệ thống định kỳ 02:00-04:00' },
  },
  {
    id: 'log-050',
    userId: 'u-001',
    userName: 'Nguyễn Văn Quản Trị',
    action: 'UPDATE',
    module: 'system',
    resourceType: 'system_config',
    resourceId: 'config-maintenance',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-01T04:05:00Z',
    before: { maintenanceMode: true },
    after: { maintenanceMode: false, completedAt: '2026-03-01T04:05:00Z' },
  },
  {
    id: 'log-051',
    userId: 'u-020',
    userName: 'Lý Thị Kim Oanh',
    action: 'LOGIN',
    module: 'system',
    resourceType: 'session',
    resourceId: 'sess-051',
    ipAddress: '192.168.1.90',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122',
    createdAt: '2026-03-11T13:20:00Z',
    before: null,
    after: { sessionId: 'sess-051' },
  },
  {
    id: 'log-052',
    userId: 'u-010',
    userName: 'PGS.TS Đinh Quang Hùng',
    action: 'EXPORT',
    module: 'admin',
    resourceType: 'school_report',
    resourceId: 'school-report-q1-2026',
    ipAddress: '172.16.0.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122',
    createdAt: '2026-03-11T09:00:00Z',
    before: null,
    after: { quarter: 'Q1 2026', format: 'pdf', sections: ['users', 'attendance', 'exams'] },
  },
]

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int-001',
    name: 'LDAP / Active Directory (SSO)',
    type: 'sso',
    status: 'connected',
    config: {
      host: 'ldap.truong.edu.vn',
      port: 389,
      baseDN: 'dc=truong,dc=edu,dc=vn',
      bindDN: 'cn=svc-lms,ou=service,dc=truong,dc=edu,dc=vn',
      useTLS: true,
      syncInterval: 'daily',
    },
    lastTestedAt: '2026-03-12T07:00:00Z',
    lastError: undefined,
  },
  {
    id: 'int-002',
    name: 'Email SMTP (Gmail Workspace)',
    type: 'email',
    status: 'connected',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      encryption: 'STARTTLS',
      username: 'no-reply@truong.edu.vn',
      fromName: 'Hệ thống Trường THPT Nguyễn Du',
    },
    lastTestedAt: '2026-03-10T08:00:00Z',
    lastError: undefined,
  },
  {
    id: 'int-003',
    name: 'LRS xAPI (SCORM Cloud)',
    type: 'lgsp',
    status: 'connected',
    config: {
      endpoint: 'https://cloud.scorm.com/lrs/xapi',
      version: '1.0.3',
      authType: 'basic',
      username: 'truong-edu-vn',
      syncStatements: true,
    },
    lastTestedAt: '2026-03-11T06:00:00Z',
    lastError: undefined,
  },
  {
    id: 'int-004',
    name: 'Zoom Meeting',
    type: 'lgsp',
    status: 'connected',
    config: {
      accountId: 'aBcD1234xYzW',
      clientId: 'zoom_oauth_client_id',
      autoCreateMeeting: true,
      defaultDuration: 90,
    },
    lastTestedAt: '2026-03-07T14:00:00Z',
    lastError: undefined,
  },
  {
    id: 'int-005',
    name: 'SMS Gateway (ViettelPost)',
    type: 'sms',
    status: 'error',
    config: {
      apiUrl: 'https://api.sms.viettelpost.vn/v2/send',
      senderName: 'TRUONGND',
      quota: 500,
    },
    lastTestedAt: '2026-03-09T09:00:00Z',
    lastError: 'Lỗi xác thực API key – vui lòng cập nhật token mới',
  },
  {
    id: 'int-006',
    name: 'Google Workspace (Calendar & Drive)',
    type: 'lgsp',
    status: 'disconnected',
    config: {
      domain: 'truong.edu.vn',
      serviceAccountEmail: 'lms-sync@truong-edu-vn.iam.gserviceaccount.com',
      scopes: ['calendar', 'drive.readonly'],
    },
    lastTestedAt: undefined,
    lastError: undefined,
  },
]

// ─── Helpers ────────────────────────────────────────────────────

/** Simulate network delay in development */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function filterUsers(users: SystemUser[], params: UserFilterParams): SystemUser[] {
  return users.filter((u) => {
    if (params.search) {
      const q = params.search.toLowerCase()
      if (
        !u.fullName.toLowerCase().includes(q) &&
        !u.username.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q)
      ) return false
    }
    if (params.role && u.role !== params.role) return false
    if (params.status && u.status !== params.status) return false
    if (params.unitId && u.unitId !== params.unitId) return false
    return true
  })
}

function filterAuditLogs(logs: AuditLog[], params: AuditLogFilterParams): AuditLog[] {
  return logs.filter((log) => {
    if (params.userId) {
      const q = params.userId.toLowerCase()
      if (!log.userName.toLowerCase().includes(q) && !log.userId.includes(q)) return false
    }
    if (params.action && log.action !== params.action) return false
    if (params.module && log.module !== params.module) return false
    if (params.dateFrom && log.createdAt < params.dateFrom) return false
    if (params.dateTo && log.createdAt > params.dateTo + 'T23:59:59Z') return false
    return true
  })
}

// ─── Users ──────────────────────────────────────────────────────

export function useGetUsers(params: UserFilterParams) {
  return useQuery({
    queryKey: [...keys.users, params],
    queryFn: async (): Promise<PaginatedResponse<SystemUser>> => {
      try {
        const searchParams = new URLSearchParams()
        if (params.search) searchParams.set('search', params.search)
        if (params.role) searchParams.set('role', params.role)
        if (params.status) searchParams.set('status', params.status)
        if (params.unitId) searchParams.set('unitId', params.unitId)
        return await apiFetch<PaginatedResponse<SystemUser>>(`/api/v1/admin/users?${searchParams.toString()}`)
      } catch {
        await delay()
        const filtered = filterUsers(MOCK_USERS, params)
        return {
          data: filtered,
          pagination: { page: 1, pageSize: filtered.length, total: filtered.length, totalPages: 1 },
        }
      }
    },
  })
}

export function useGetUser(id: string) {
  return useQuery({
    queryKey: keys.user(id),
    queryFn: async (): Promise<SystemUser> => {
      try {
        return await apiFetch<SystemUser>(`/api/v1/admin/users/${id}`)
      } catch {
        await delay()
        const user = MOCK_USERS.find((u) => u.id === id)
        if (!user) throw new Error(`User ${id} not found`)
        return user
      }
    },
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<SystemUser> & { password?: string }): Promise<SystemUser> => {
      try {
        return await apiFetch<SystemUser>('/api/v1/admin/users', { method: 'POST', body: JSON.stringify(data) })
      } catch {
        await delay()
        const newUser: SystemUser = {
          id: `u-${Date.now()}`,
          username: data.username ?? 'newuser',
          fullName: data.fullName ?? 'Người dùng mới',
          email: data.email ?? '',
          role: data.role ?? 'student',
          unitId: data.unitId,
          unitName: data.unitName,
          avatar: data.avatar,
          status: data.status ?? 'active',
          lastLogin: undefined,
          createdAt: new Date().toISOString(),
        }
        MOCK_USERS.push(newUser)
        return newUser
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SystemUser> & { id: string; password?: string }): Promise<SystemUser> => {
      try {
        return await apiFetch<SystemUser>(`/api/v1/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
      } catch {
        await delay()
        const idx = MOCK_USERS.findIndex((u) => u.id === id)
        if (idx === -1) throw new Error(`User ${id} not found`)
        const updated: SystemUser = { ...MOCK_USERS[idx]!, ...data } as SystemUser
        MOCK_USERS[idx] = updated
        return updated
      }
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: keys.users })
      void qc.invalidateQueries({ queryKey: keys.user(vars.id) })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/admin/users/${id}`, { method: 'DELETE' })
      } catch {
        await delay()
        const idx = MOCK_USERS.findIndex((u) => u.id === id)
        if (idx !== -1) MOCK_USERS.splice(idx, 1)
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: async (userId: string): Promise<{ message: string }> => {
      try {
        return await apiFetch<{ message: string }>(`/api/v1/admin/users/${userId}/reset-password`, { method: 'POST' })
      } catch {
        await delay()
        return { message: `Đã gửi email đặt lại mật khẩu cho người dùng` }
      }
    },
  })
}

export function useBulkActivateUsers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]): Promise<void> => {
      try {
        return await apiFetch<void>('/api/v1/admin/users/bulk-activate', { method: 'POST', body: JSON.stringify({ ids }) })
      } catch {
        await delay()
        ids.forEach((id) => {
          const user = MOCK_USERS.find((u) => u.id === id)
          if (user) user.status = 'active'
        })
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useBulkDeactivateUsers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]): Promise<void> => {
      try {
        return await apiFetch<void>('/api/v1/admin/users/bulk-deactivate', { method: 'POST', body: JSON.stringify({ ids }) })
      } catch {
        await delay()
        ids.forEach((id) => {
          const user = MOCK_USERS.find((u) => u.id === id)
          if (user) user.status = 'inactive'
        })
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

export function useImportUsers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File): Promise<{ imported: number; errors: { row: number; message: string }[] }> => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        return await apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
          '/api/v1/admin/users/import',
          { method: 'POST', body: formData, headers: {} }
        )
      } catch {
        await delay(800)
        return {
          imported: 15,
          errors: [
            { row: 4, message: 'Email đã tồn tại trong hệ thống' },
            { row: 9, message: 'Thiếu trường bắt buộc: fullName' },
          ],
        }
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.users }) },
  })
}

// ─── Roles ──────────────────────────────────────────────────────

export function useGetRoles() {
  return useQuery({
    queryKey: keys.roles,
    queryFn: async (): Promise<Role[]> => {
      try {
        return await apiFetch<Role[]>('/api/v1/admin/roles')
      } catch {
        await delay()
        return MOCK_ROLES
      }
    },
  })
}

export function useGetRole(id: string) {
  return useQuery({
    queryKey: keys.role(id),
    queryFn: async (): Promise<Role> => {
      try {
        return await apiFetch<Role>(`/api/v1/admin/roles/${id}`)
      } catch {
        await delay()
        const role = MOCK_ROLES.find((r) => r.id === id)
        if (!role) throw new Error(`Role ${id} not found`)
        return role
      }
    },
    enabled: !!id,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }): Promise<Role> => {
      try {
        return await apiFetch<Role>('/api/v1/admin/roles', { method: 'POST', body: JSON.stringify(data) })
      } catch {
        await delay()
        const newRole: Role = {
          id: `role-${Date.now()}`,
          name: data.name,
          description: data.description,
          userCount: 0,
          permissions: [],
          isSystem: false,
          createdAt: new Date().toISOString(),
        }
        MOCK_ROLES.push(newRole)
        return newRole
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.roles }) },
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name: string; description?: string }): Promise<Role> => {
      try {
        return await apiFetch<Role>(`/api/v1/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) })
      } catch {
        await delay()
        const idx = MOCK_ROLES.findIndex((r) => r.id === id)
        if (idx === -1) throw new Error(`Role ${id} not found`)
        const updated: Role = { ...MOCK_ROLES[idx]!, ...data }
        MOCK_ROLES[idx] = updated
        return updated
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.roles }) },
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/admin/roles/${id}`, { method: 'DELETE' })
      } catch {
        await delay()
        const idx = MOCK_ROLES.findIndex((r) => r.id === id)
        if (idx !== -1) MOCK_ROLES.splice(idx, 1)
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.roles }) },
  })
}

// ─── Permissions ────────────────────────────────────────────────

export function useGetPermissions() {
  return useQuery({
    queryKey: keys.permissions,
    queryFn: async (): Promise<Permission[]> => {
      try {
        return await apiFetch<Permission[]>('/api/v1/admin/permissions')
      } catch {
        await delay()
        return MOCK_PERMISSIONS
      }
    },
  })
}

export function useGetRolePermissions(roleId: string) {
  return useQuery({
    queryKey: keys.rolePermissions(roleId),
    queryFn: async (): Promise<{ permissionKeys: string[] }> => {
      try {
        return await apiFetch<{ permissionKeys: string[] }>(`/api/v1/admin/roles/${roleId}/permissions`)
      } catch {
        await delay()
        const role = MOCK_ROLES.find((r) => r.id === roleId)
        return { permissionKeys: role?.permissions ?? [] }
      }
    },
    enabled: !!roleId,
  })
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ roleId, permissionKeys }: { roleId: string; permissionKeys: string[] }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/admin/roles/${roleId}/permissions`, {
          method: 'PUT',
          body: JSON.stringify({ permissionKeys }),
        })
      } catch {
        await delay()
        const role = MOCK_ROLES.find((r) => r.id === roleId)
        if (role) role.permissions = permissionKeys
      }
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: keys.rolePermissions(vars.roleId) })
      void qc.invalidateQueries({ queryKey: keys.roles })
    },
  })
}

// ─── Org Units ──────────────────────────────────────────────────

export function useGetOrgUnits() {
  return useQuery({
    queryKey: keys.orgUnits,
    queryFn: async (): Promise<OrgUnit[]> => {
      try {
        return await apiFetch<OrgUnit[]>('/api/v1/admin/org-units')
      } catch {
        await delay()
        return MOCK_ORG_UNITS
      }
    },
  })
}

export function useCreateOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<OrgUnit, 'id' | 'children' | 'userCount'>): Promise<OrgUnit> => {
      try {
        return await apiFetch<OrgUnit>('/api/v1/admin/org-units', { method: 'POST', body: JSON.stringify(data) })
      } catch {
        await delay()
        const newUnit: OrgUnit = {
          id: `ou-${Date.now()}`,
          ...data,
          userCount: 0,
          children: [],
        }
        return newUnit
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

export function useUpdateOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<OrgUnit> & { id: string }): Promise<OrgUnit> => {
      try {
        return await apiFetch<OrgUnit>(`/api/v1/admin/org-units/${id}`, { method: 'PUT', body: JSON.stringify(data) })
      } catch {
        await delay()
        return { id, userCount: 0, type: 'group', order: 0, name: '', ...data } as OrgUnit
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

export function useDeleteOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/admin/org-units/${id}`, { method: 'DELETE' })
      } catch {
        await delay()
        // Mock: deletion succeeds silently
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

export function useReorderOrgUnits() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (items: { id: string; order: number }[]): Promise<void> => {
      try {
        return await apiFetch<void>('/api/v1/admin/org-units/reorder', { method: 'POST', body: JSON.stringify({ items }) })
      } catch {
        await delay()
        // Mock: reorder succeeds silently
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.orgUnits }) },
  })
}

// ─── Settings ───────────────────────────────────────────────────

export function useGetSettings() {
  return useQuery({
    queryKey: keys.settings,
    queryFn: async (): Promise<SystemSettings> => {
      try {
        return await apiFetch<SystemSettings>('/api/v1/admin/settings')
      } catch {
        await delay()
        return MOCK_SETTINGS
      }
    },
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
      try {
        return await apiFetch<SystemSettings>('/api/v1/admin/settings', { method: 'PATCH', body: JSON.stringify(data) })
      } catch {
        await delay()
        if (data.general) Object.assign(MOCK_SETTINGS.general, data.general)
        if (data.email) Object.assign(MOCK_SETTINGS.email, data.email)
        if (data.security) Object.assign(MOCK_SETTINGS.security, data.security)
        return { ...MOCK_SETTINGS }
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.settings }) },
  })
}

// ─── Audit Logs ─────────────────────────────────────────────────

export function useGetAuditLogs(params: AuditLogFilterParams) {
  return useQuery({
    queryKey: [...keys.auditLogs, params],
    queryFn: async (): Promise<PaginatedResponse<AuditLog>> => {
      try {
        const searchParams = new URLSearchParams()
        if (params.userId) searchParams.set('userId', params.userId)
        if (params.action) searchParams.set('action', params.action)
        if (params.module) searchParams.set('module', params.module)
        if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom)
        if (params.dateTo) searchParams.set('dateTo', params.dateTo)
        if (params.page) searchParams.set('page', String(params.page))
        if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<AuditLog>>(`/api/v1/admin/audit-logs?${searchParams.toString()}`)
      } catch {
        await delay()
        const filtered = filterAuditLogs(MOCK_AUDIT_LOGS, params)
        const page = params.page ?? 1
        const pageSize = params.pageSize ?? 20
        const start = (page - 1) * pageSize
        const paged = filtered.slice(start, start + pageSize)
        return {
          data: paged,
          pagination: {
            page,
            pageSize,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / pageSize),
          },
        }
      }
    },
  })
}

// ─── Integrations ───────────────────────────────────────────────

export function useGetIntegrations() {
  return useQuery({
    queryKey: keys.integrations,
    queryFn: async (): Promise<Integration[]> => {
      try {
        return await apiFetch<Integration[]>('/api/v1/admin/integrations')
      } catch {
        await delay()
        return MOCK_INTEGRATIONS
      }
    },
  })
}

export function useGetIntegration(id: string) {
  return useQuery({
    queryKey: [...keys.integrations, id],
    queryFn: async (): Promise<Integration> => {
      try {
        return await apiFetch<Integration>(`/api/v1/admin/integrations/${id}`)
      } catch {
        await delay()
        const integration = MOCK_INTEGRATIONS.find((i) => i.id === id)
        if (!integration) throw new Error(`Integration ${id} not found`)
        return integration
      }
    },
    enabled: !!id,
  })
}

export function useUpdateIntegration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Integration): Promise<Integration> => {
      try {
        return await apiFetch<Integration>(`/api/v1/admin/integrations/${id}`, { method: 'PUT', body: JSON.stringify(data) })
      } catch {
        await delay()
        const idx = MOCK_INTEGRATIONS.findIndex((i) => i.id === id)
        if (idx !== -1) {
          MOCK_INTEGRATIONS[idx] = { id, ...data }
        }
        return { id, ...data }
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.integrations }) },
  })
}

export function useTestIntegration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean; message: string; latency?: number }> => {
      try {
        return await apiFetch<{ success: boolean; message: string; latency?: number }>(
          `/api/v1/admin/integrations/${id}/test`,
          { method: 'POST' }
        )
      } catch {
        await delay(600)
        const integration = MOCK_INTEGRATIONS.find((i) => i.id === id)
        if (!integration) return { success: false, message: 'Integration không tồn tại' }

        if (integration.status === 'error') {
          return {
            success: false,
            message: integration.lastError ?? 'Kết nối thất bại',
          }
        }
        if (integration.status === 'disconnected') {
          return { success: false, message: 'Integration chưa được cấu hình' }
        }

        const latency = Math.floor(Math.random() * 120) + 30
        integration.lastTestedAt = new Date().toISOString()
        return {
          success: true,
          message: `Kết nối thành công tới ${integration.name}`,
          latency,
        }
      }
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: keys.integrations }) },
  })
}
