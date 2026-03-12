import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  AdminSummary,
  TeacherSummary,
  StudentSummary,
  DashboardCharts,
  ActivityItem,
} from '../types/dashboard.types'

// ── Mock data for development ──
const MOCK_ADMIN_SUMMARY: AdminSummary = {
  students: 1842,
  classes: 48,
  attendanceToday: 94.2,
  booksOnLoan: 156,
  studentsDelta: 3.2,
  classesDelta: 0,
  attendanceDelta: 1.5,
}

const MOCK_TEACHER_SUMMARY: TeacherSummary = {
  teachingClasses: 6,
  studentsNeedHelp: 3,
  pendingAssignments: 12,
  completionRate: 78,
}

const MOCK_STUDENT_SUMMARY: StudentSummary = {
  enrolledClasses: 8,
  upcomingDeadlines: 3,
  avgScore: 7.8,
  scormCompletion: 65,
}

const MOCK_CHARTS: DashboardCharts = {
  classStudents: [
    { name: '10A1', value: 42 },
    { name: '10A2', value: 40 },
    { name: '11B1', value: 38 },
    { name: '11B2', value: 41 },
    { name: '12A1', value: 39 },
    { name: '12A2', value: 37 },
  ],
  attendance7Days: [
    { name: 'T2', value: 95 },
    { name: 'T3', value: 92 },
    { name: 'T4', value: 96 },
    { name: 'T5', value: 93 },
    { name: 'T6', value: 94 },
    { name: 'T7', value: 88 },
    { name: 'CN', value: 0 },
  ],
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'attendance', description: 'Điểm danh lớp 10A1 hoàn tất (42/42 HS)', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: { name: 'Nguyễn Văn A' } },
  { id: '2', type: 'submission', description: 'Bài tập Toán chương 3 — 35 bài nộp mới', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), user: { name: 'Trần Thị B' } },
  { id: '3', type: 'borrow', description: 'Mượn sách "Vật lý đại cương" — Thư viện', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), user: { name: 'Lê Văn C' } },
  { id: '4', type: 'login', description: 'Đăng nhập hệ thống', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), user: { name: 'Phạm Thị D' } },
  { id: '5', type: 'grade', description: 'Cập nhật điểm thi HK1 — lớp 12A1', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), user: { name: 'Võ Văn E' } },
]

// ── API Functions ──
async function fetchAdminSummary(): Promise<AdminSummary> {
  try {
    return await apiFetch<AdminSummary>('/api/dashboard/admin/summary')
  } catch {
    return MOCK_ADMIN_SUMMARY
  }
}

async function fetchTeacherSummary(): Promise<TeacherSummary> {
  try {
    return await apiFetch<TeacherSummary>('/api/dashboard/teacher/summary')
  } catch {
    return MOCK_TEACHER_SUMMARY
  }
}

async function fetchStudentSummary(): Promise<StudentSummary> {
  try {
    return await apiFetch<StudentSummary>('/api/dashboard/student/summary')
  } catch {
    return MOCK_STUDENT_SUMMARY
  }
}

async function fetchCharts(): Promise<DashboardCharts> {
  try {
    return await apiFetch<DashboardCharts>('/api/dashboard/charts')
  } catch {
    return MOCK_CHARTS
  }
}

async function fetchActivities(): Promise<ActivityItem[]> {
  try {
    return await apiFetch<ActivityItem[]>('/api/dashboard/activity')
  } catch {
    return MOCK_ACTIVITIES
  }
}

// ── Query Hooks ──
export function useAdminSummary() {
  return useQuery({
    queryKey: ['dashboard', 'admin', 'summary'],
    queryFn: fetchAdminSummary,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTeacherSummary() {
  return useQuery({
    queryKey: ['dashboard', 'teacher', 'summary'],
    queryFn: fetchTeacherSummary,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStudentSummary() {
  return useQuery({
    queryKey: ['dashboard', 'student', 'summary'],
    queryFn: fetchStudentSummary,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDashboardCharts() {
  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: fetchCharts,
    staleTime: 10 * 60 * 1000,
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: fetchActivities,
    staleTime: 1 * 60 * 1000,
  })
}
