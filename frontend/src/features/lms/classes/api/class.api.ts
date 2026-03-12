import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { LMSClass, ClassStudent, ClassDashboardStats, ClassFormData, PaginatedResponse } from "../types/class.types"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const T1 = { id: "t1", name: "Nguyễn Văn An" }
const T2 = { id: "t2", name: "Trần Thị Bích" }
const T3 = { id: "t3", name: "Lê Minh Cường" }
const T4 = { id: "t4", name: "Phạm Thị Dung" }
const T5 = { id: "t5", name: "Hoàng Văn Em" }
const MOCK_TEACHERS: { id: string; name: string; avatar?: string }[] = [T1, T2, T3, T4, T5]
const FALLBACK_TEACHER = T1

const MOCK_CLASSES: LMSClass[] = [
  {
    id: "cls-001",
    name: "Toán Đại Số 10A1",
    code: "TOAN-10A1-HK1",
    description: "Lớp toán đại số dành cho học sinh lớp 10A1, học kỳ 1 năm học 2025-2026. Tập trung vào các chủ đề hàm số, phương trình và bất phương trình.",
    teacher: T1,
    studentCount: 42,
    progress: 68,
    status: "active",
    year: "2025-2026",
    term: "HK1",
    enrollmentType: "approval",
    maxStudents: 45,
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    createdAt: "2025-08-15T08:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "cls-002",
    name: "Vật Lý Cơ Học 10A1",
    code: "LY-10A1-HK1",
    description: "Lớp vật lý phần cơ học cho lớp 10A1. Học về động học, động lực học và các định luật Newton.",
    teacher: T2,
    studentCount: 38,
    progress: 75,
    status: "active",
    year: "2025-2026",
    term: "HK1",
    enrollmentType: "open",
    maxStudents: 40,
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    createdAt: "2025-08-15T08:30:00Z",
    updatedAt: "2026-03-02T09:00:00Z",
  },
  {
    id: "cls-003",
    name: "Hóa Học Đại Cương 10B",
    code: "HOA-10B-HK1",
    description: "Lớp hóa đại cương lớp 10B. Học về cấu tạo nguyên tử, bảng tuần hoàn và liên kết hóa học.",
    teacher: T3,
    studentCount: 35,
    progress: 55,
    status: "active",
    year: "2025-2026",
    term: "HK1",
    enrollmentType: "approval",
    maxStudents: 40,
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    createdAt: "2025-08-16T08:00:00Z",
    updatedAt: "2026-02-28T14:00:00Z",
  },
  {
    id: "cls-004",
    name: "Ngữ Văn 11A",
    code: "VAN-11A-HK1",
    description: "Lớp ngữ văn lớp 11A. Học về văn học Việt Nam và thế giới, rèn luyện kỹ năng viết và phân tích.",
    teacher: T4,
    studentCount: 40,
    progress: 80,
    status: "active",
    year: "2025-2026",
    term: "HK1",
    enrollmentType: "open",
    maxStudents: 45,
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    createdAt: "2025-08-16T09:00:00Z",
    updatedAt: "2026-03-03T11:00:00Z",
  },
  {
    id: "cls-005",
    name: "Tiếng Anh 11B",
    code: "ANH-11B-HK1",
    description: "Lớp tiếng Anh lớp 11B. Phát triển 4 kỹ năng nghe, nói, đọc, viết theo chuẩn IELTS.",
    teacher: T5,
    studentCount: 32,
    progress: 62,
    status: "active",
    year: "2025-2026",
    term: "HK1",
    enrollmentType: "approval",
    maxStudents: 35,
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    createdAt: "2025-08-17T08:00:00Z",
    updatedAt: "2026-03-05T10:30:00Z",
  },
  {
    id: "cls-006",
    name: "Sinh Học 12A",
    code: "SINH-12A-HK1",
    description: "Lớp sinh học lớp 12A. Học về di truyền học, tiến hóa và sinh thái học.",
    teacher: T1,
    studentCount: 36,
    progress: 90,
    status: "completed",
    year: "2025-2026",
    term: "HK1",
    enrollmentType: "open",
    maxStudents: 40,
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    createdAt: "2025-08-17T09:00:00Z",
    updatedAt: "2026-01-20T16:00:00Z",
  },
  {
    id: "cls-007",
    name: "Lịch Sử Việt Nam 11C",
    code: "SU-11C-HK2",
    description: "Lớp lịch sử lớp 11C học kỳ 2. Học về lịch sử Việt Nam từ thế kỷ 19 đến hiện đại.",
    teacher: T2,
    studentCount: 38,
    progress: 30,
    status: "active",
    year: "2025-2026",
    term: "HK2",
    enrollmentType: "open",
    maxStudents: 40,
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "cls-008",
    name: "Địa Lý 10C",
    code: "DIA-10C-HK2",
    description: "Lớp địa lý lớp 10C học kỳ 2. Học về địa lý kinh tế-xã hội Việt Nam và thế giới.",
    teacher: T3,
    studentCount: 34,
    progress: 25,
    status: "active",
    year: "2025-2026",
    term: "HK2",
    enrollmentType: "approval",
    maxStudents: 40,
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    createdAt: "2026-01-21T08:00:00Z",
    updatedAt: "2026-03-08T14:00:00Z",
  },
  {
    id: "cls-009",
    name: "Toán Giải Tích 12B",
    code: "TOAN-12B-HK2",
    description: "Lớp toán giải tích lớp 12B. Học về đạo hàm, tích phân và ứng dụng.",
    teacher: T4,
    studentCount: 40,
    progress: 20,
    status: "active",
    year: "2025-2026",
    term: "HK2",
    enrollmentType: "open",
    maxStudents: 45,
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-03-09T10:00:00Z",
  },
  {
    id: "cls-010",
    name: "Vật Lý Điện Từ 11A",
    code: "LY-11A-HK2",
    description: "Lớp vật lý phần điện từ học cho lớp 11A. Học về điện trường, từ trường và cảm ứng điện từ.",
    teacher: T5,
    studentCount: 37,
    progress: 35,
    status: "active",
    year: "2025-2026",
    term: "HK2",
    enrollmentType: "approval",
    maxStudents: 40,
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    createdAt: "2026-01-23T08:00:00Z",
    updatedAt: "2026-03-11T11:00:00Z",
  },
  {
    id: "cls-011",
    name: "Tin Học Ứng Dụng 10D",
    code: "TIN-10D-FULL",
    description: "Lớp tin học ứng dụng lớp 10D cả năm. Học về lập trình Python cơ bản và ứng dụng.",
    teacher: T1,
    studentCount: 30,
    progress: 50,
    status: "active",
    year: "2025-2026",
    term: "full",
    enrollmentType: "locked",
    maxStudents: 30,
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    createdAt: "2025-08-18T08:00:00Z",
    updatedAt: "2026-03-06T10:00:00Z",
  },
  {
    id: "cls-012",
    name: "GDCD 12",
    code: "GDCD-12-FULL",
    description: "Lớp giáo dục công dân lớp 12 cả năm. Học về pháp luật, đạo đức và kinh tế.",
    teacher: T2,
    studentCount: 45,
    progress: 45,
    status: "active",
    year: "2025-2026",
    term: "full",
    enrollmentType: "open",
    maxStudents: 50,
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    createdAt: "2025-08-19T08:00:00Z",
    updatedAt: "2026-03-07T09:00:00Z",
  },
  {
    id: "cls-013",
    name: "Toán Đại Số 10A2",
    code: "TOAN-10A2-2425",
    description: "Lớp toán đại số lớp 10A2 năm 2024-2025. Đã kết thúc.",
    teacher: T3,
    studentCount: 41,
    progress: 100,
    status: "completed",
    year: "2024-2025",
    term: "HK1",
    enrollmentType: "open",
    maxStudents: 45,
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2025-01-20T16:00:00Z",
  },
  {
    id: "cls-014",
    name: "Hóa Hữu Cơ 12C",
    code: "HOA-12C-2425",
    description: "Lớp hóa hữu cơ lớp 12C năm 2024-2025. Học về hidrocacbon và dẫn xuất.",
    teacher: T4,
    studentCount: 33,
    progress: 100,
    status: "completed",
    year: "2024-2025",
    term: "HK2",
    enrollmentType: "approval",
    maxStudents: 35,
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    createdAt: "2025-01-20T08:00:00Z",
    updatedAt: "2025-07-05T10:00:00Z",
  },
  {
    id: "cls-015",
    name: "Tiếng Anh Nâng Cao 12",
    code: "ANH-NC-12-HK1",
    description: "Lớp tiếng Anh nâng cao dành cho học sinh lớp 12 chuẩn bị thi IELTS và đại học.",
    teacher: T5,
    studentCount: 28,
    progress: 15,
    status: "upcoming",
    year: "2026-2027",
    term: "HK1",
    enrollmentType: "approval",
    maxStudents: 30,
    startDate: "2026-09-01",
    endDate: "2027-01-15",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-10T08:00:00Z",
  },
  {
    id: "cls-016",
    name: "Vật Lý 12 Ôn Thi",
    code: "LY-12-ONTHI-2425",
    description: "Lớp ôn thi vật lý lớp 12 năm 2024-2025. Ôn tập toàn bộ chương trình vật lý THPT.",
    teacher: T1,
    studentCount: 48,
    progress: 100,
    status: "completed",
    year: "2024-2025",
    term: "HK2",
    enrollmentType: "open",
    maxStudents: 50,
    startDate: "2025-02-01",
    endDate: "2025-07-15",
    createdAt: "2025-01-25T08:00:00Z",
    updatedAt: "2025-07-20T16:00:00Z",
  },
]

// Build student pool (shared across classes)
function makeStudents(classId: string, count: number): ClassStudent[] {
  const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"]
  const midNames = ["Văn", "Thị", "Minh", "Quốc", "Thanh", "Thành", "Tuấn", "Anh", "Kim", "Xuân"]
  const lastNames = ["An", "Bình", "Cường", "Dũng", "Em", "Phong", "Giang", "Hoa", "Hùng", "Khoa",
    "Lan", "Mai", "Nam", "Oanh", "Phúc", "Quân", "Rộng", "Sơn", "Tú", "Uyên",
    "Việt", "Xuân", "Yến", "Zung", "Ánh", "Bảo", "Chí", "Duyên", "Đức", "Hải"]
  const statuses: ClassStudent["status"][] = ["approved", "approved", "approved", "approved", "pending", "approved", "approved", "approved", "removed", "approved"]

  return Array.from({ length: count }, (_, i): ClassStudent => {
    const idx = (i + classId.charCodeAt(classId.length - 1)) % 30
    const fn = firstNames[i % firstNames.length] ?? "Nguyễn"
    const mn = midNames[(i + 3) % midNames.length] ?? "Văn"
    const ln = lastNames[idx] ?? "An"
    const name = `${fn} ${mn} ${ln}`
    const statusIdx = (i + parseInt(classId.replace(/\D/g, "").slice(-2) || "0")) % statuses.length
    const enrollDate = new Date(2025, 7, 20 + (i % 10))
    return {
      id: `stu-${classId}-${String(i + 1).padStart(3, "0")}`,
      studentId: `stu-${classId}-${String(i + 1).padStart(3, "0")}`,
      name,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@student.edu.vn`,
      code: `HS${new Date().getFullYear()}${String(1000 + i + 1)}`,
      enrolledAt: enrollDate.toISOString(),
      progress: Math.min(100, Math.floor((i * 7 + 10) % 101)),
      status: statuses[statusIdx] ?? "approved",
      currentClass: classId,
    }
  })
}

const SEARCH_STUDENT_NAMES = [
  "Ngô Thị Trang", "Đinh Văn Hào", "Lý Thị Ngọc", "Cao Minh Trí", "Vương Thị Lam",
  "Tống Văn Kiên", "Dương Thị Hằng", "Mạc Văn Phát", "Chu Thị Sen", "Từ Minh Đạt",
  "Bùi Thị Thúy", "Đặng Văn Long", "Trịnh Thị Huyền", "Phan Văn Bình", "Hứa Thị Kim",
  "Quách Minh Tân", "Lương Thị Mỹ", "Thái Văn Dũng", "Ninh Thị Linh", "Tô Văn Hùng",
]

// Searchable student pool (users not in class)
const MOCK_SEARCH_STUDENTS: ClassStudent[] = Array.from({ length: 20 }, (_, i): ClassStudent => ({
  id: `pool-stu-${String(i + 1).padStart(3, "0")}`,
  studentId: `pool-stu-${String(i + 1).padStart(3, "0")}`,
  name: SEARCH_STUDENT_NAMES[i] ?? `Học sinh ${i + 1}`,
  email: `student${i + 100}@student.edu.vn`,
  code: `HS2025${String(2000 + i + 1)}`,
  enrolledAt: new Date(2025, 7, 1).toISOString(),
  progress: 0,
  status: "approved",
}))

const MOCK_DASHBOARD: ClassDashboardStats = {
  totalClasses: MOCK_CLASSES.length,
  totalStudents: MOCK_CLASSES.reduce((s, c) => s + c.studentCount, 0),
  avgCompletion: Math.round(MOCK_CLASSES.reduce((s, c) => s + c.progress, 0) / MOCK_CLASSES.length),
  activeClasses: MOCK_CLASSES.filter((c) => c.status === "active").length,
  studentDistribution: MOCK_CLASSES.slice(0, 8).map((c) => ({ name: c.code, count: c.studentCount })),
  completionByClass: MOCK_CLASSES.slice(0, 8).map((c) => ({ name: c.code, completion: c.progress })),
  lowProgressClasses: MOCK_CLASSES.filter((c) => c.status === "active" && c.progress < 40),
}

// ─── Helper: filter & paginate ────────────────────────────────────────────────

function filterClasses(params?: { year?: string; term?: string; status?: string; q?: string }): LMSClass[] {
  let result = [...MOCK_CLASSES]
  if (params?.year) result = result.filter((c) => c.year === params.year)
  if (params?.term) result = result.filter((c) => c.term === params.term)
  if (params?.status) result = result.filter((c) => c.status === params.status)
  if (params?.q) {
    const q = params.q.toLowerCase()
    result = result.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
  }
  return result
}

function paginate<T>(items: T[], page = 1, pageSize = 20): PaginatedResponse<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total, page, pageSize, totalPages }
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

const CLASSES_KEY = ["lms", "classes"]

// ─── Classes CRUD ─────────────────────────────────────────────────────────────

export function useGetClasses(params?: { year?: string; term?: string; status?: string; q?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.year) searchParams.set("year", params.year)
  if (params?.term) searchParams.set("term", params.term)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.q) searchParams.set("q", params.q)
  const qs = searchParams.toString()
  return useQuery({
    queryKey: [...CLASSES_KEY, params],
    queryFn: async (): Promise<PaginatedResponse<LMSClass>> => {
      try {
        return await apiFetch<PaginatedResponse<LMSClass>>(`/api/lms/classes${qs ? `?${qs}` : ""}`)
      } catch {
        const filtered = filterClasses(params)
        return paginate(filtered)
      }
    },
  })
}

export function useGetClass(id: string) {
  return useQuery({
    queryKey: [...CLASSES_KEY, id],
    queryFn: async (): Promise<LMSClass> => {
      try {
        return await apiFetch<LMSClass>(`/api/lms/classes/${id}`)
      } catch {
        const found = MOCK_CLASSES.find((c) => c.id === id)
        if (!found) throw new Error(`Class ${id} not found`)
        return found
      }
    },
    enabled: !!id,
  })
}

export function useCreateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: ClassFormData): Promise<LMSClass> => {
      try {
        return await apiFetch<LMSClass>("/api/lms/classes", { method: "POST", body: JSON.stringify(data) })
      } catch {
        const newClass: LMSClass = {
          id: `cls-${Date.now()}`,
          name: data.name,
          code: data.code,
          description: data.description,
          teacher: MOCK_TEACHERS.find((t) => t.id === data.teacherId) ?? FALLBACK_TEACHER,
          studentCount: 0,
          progress: 0,
          status: "upcoming",
          year: data.year,
          term: data.term,
          enrollmentType: data.enrollmentType,
          maxStudents: data.maxStudents,
          startDate: data.startDate,
          endDate: data.endDate,
          thumbnail: data.thumbnail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        MOCK_CLASSES.push(newClass)
        return newClass
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useUpdateClass(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: ClassFormData): Promise<LMSClass> => {
      try {
        return await apiFetch<LMSClass>(`/api/lms/classes/${id}`, { method: "PUT", body: JSON.stringify(data) })
      } catch {
        const idx = MOCK_CLASSES.findIndex((c) => c.id === id)
        if (idx === -1) throw new Error(`Class ${id} not found`)
        const existing = MOCK_CLASSES[idx] as LMSClass
        const updated: LMSClass = {
          ...existing,
          name: data.name,
          code: data.code,
          description: data.description,
          teacher: MOCK_TEACHERS.find((t) => t.id === data.teacherId) ?? existing.teacher,
          year: data.year,
          term: data.term,
          enrollmentType: data.enrollmentType,
          maxStudents: data.maxStudents,
          startDate: data.startDate,
          endDate: data.endDate,
          thumbnail: data.thumbnail,
          updatedAt: new Date().toISOString(),
        }
        MOCK_CLASSES[idx] = updated
        return updated
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useDeleteClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/lms/classes/${id}`, { method: "DELETE" })
      } catch {
        const idx = MOCK_CLASSES.findIndex((c) => c.id === id)
        if (idx !== -1) MOCK_CLASSES.splice(idx, 1)
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useCopyClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<LMSClass> => {
      try {
        return await apiFetch<LMSClass>(`/api/lms/classes/${id}/copy`, { method: "POST" })
      } catch {
        const src = MOCK_CLASSES.find((c) => c.id === id)
        if (!src) throw new Error(`Class ${id} not found`)
        const copy: LMSClass = {
          ...src,
          id: `cls-copy-${Date.now()}`,
          name: `${src.name} (Bản sao)`,
          code: `${src.code}-COPY`,
          studentCount: 0,
          progress: 0,
          status: "upcoming",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        MOCK_CLASSES.push(copy)
        return copy
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useImportClasses() {
  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData()
        formData.append("file", file)
        return await apiFetch<{ success: number; failed: number; errors?: { row: number; message: string }[] }>(
          "/api/lms/classes/import",
          { method: "POST", body: formData, headers: {} }
        )
      } catch {
        return { success: 3, failed: 0, errors: [] }
      }
    },
  })
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useClassDashboard(params?: { year?: string; term?: string }) {
  return useQuery({
    queryKey: [...CLASSES_KEY, "dashboard", params],
    queryFn: async (): Promise<ClassDashboardStats> => {
      try {
        return await apiFetch<ClassDashboardStats>("/api/lms/classes/dashboard-stats")
      } catch {
        const filtered = filterClasses(params)
        return {
          totalClasses: filtered.length,
          totalStudents: filtered.reduce((s, c) => s + c.studentCount, 0),
          avgCompletion: filtered.length
            ? Math.round(filtered.reduce((s, c) => s + c.progress, 0) / filtered.length)
            : 0,
          activeClasses: filtered.filter((c) => c.status === "active").length,
          studentDistribution: filtered.slice(0, 8).map((c) => ({ name: c.code, count: c.studentCount })),
          completionByClass: filtered.slice(0, 8).map((c) => ({ name: c.code, completion: c.progress })),
          lowProgressClasses: filtered.filter((c) => c.status === "active" && c.progress < 40),
        }
      }
    },
  })
}

// ─── Students ─────────────────────────────────────────────────────────────────

const STUDENTS_KEY = (classId: string) => [...CLASSES_KEY, classId, "students"]

// Cache built student lists to keep references stable
const studentCache: Record<string, ClassStudent[]> = {}

function getClassStudents(classId: string): ClassStudent[] {
  if (!studentCache[classId]) {
    const cls = MOCK_CLASSES.find((c) => c.id === classId)
    const count = cls?.studentCount ?? 30
    studentCache[classId] = makeStudents(classId, count)
  }
  return studentCache[classId]
}

export function useGetClassStudents(classId: string, params?: { status?: string }) {
  return useQuery({
    queryKey: [...STUDENTS_KEY(classId), params],
    queryFn: async (): Promise<PaginatedResponse<ClassStudent>> => {
      try {
        return await apiFetch<PaginatedResponse<ClassStudent>>(
          `/api/lms/classes/${classId}/students${params?.status ? `?status=${params.status}` : ""}`
        )
      } catch {
        let students = getClassStudents(classId)
        if (params?.status) {
          students = students.filter((s) => s.status === params.status)
        }
        return paginate(students)
      }
    },
    enabled: !!classId,
  })
}

export function useAddStudents(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (studentIds: string[]): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/lms/classes/${classId}/students/bulk-add`, {
          method: "POST",
          body: JSON.stringify({ studentIds }),
        })
      } catch {
        const toAdd = MOCK_SEARCH_STUDENTS.filter((s) => studentIds.includes(s.studentId))
        const students = getClassStudents(classId)
        for (const s of toAdd) {
          if (!students.find((x) => x.studentId === s.studentId)) {
            students.push({ ...s, status: "approved", currentClass: classId, enrolledAt: new Date().toISOString() })
          }
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

export function useRemoveStudent(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (studentId: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/lms/classes/${classId}/students/${studentId}`, { method: "DELETE" })
      } catch {
        const students = getClassStudents(classId)
        const idx = students.findIndex((s) => s.studentId === studentId)
        if (idx !== -1) {
          const s = students[idx] as ClassStudent
          students[idx] = { ...s, status: "removed" }
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

export function useApproveEnrollment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (studentId: string): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/lms/classes/${classId}/students/${studentId}/approve`, { method: "POST" })
      } catch {
        const students = getClassStudents(classId)
        const idx = students.findIndex((s) => s.studentId === studentId)
        if (idx !== -1) {
          const s = students[idx] as ClassStudent
          students[idx] = { ...s, status: "approved" }
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

export function useBulkApproveEnrollment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (studentIds: string[]): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/lms/classes/${classId}/students/bulk-approve`, {
          method: "POST",
          body: JSON.stringify({ studentIds }),
        })
      } catch {
        const students = getClassStudents(classId)
        for (const sid of studentIds) {
          const idx = students.findIndex((s) => s.studentId === sid)
          if (idx !== -1) {
            const s = students[idx] as ClassStudent
            students[idx] = { ...s, status: "approved" }
          }
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

// ─── Search available students ────────────────────────────────────────────────

export function useSearchStudents(query: string) {
  return useQuery({
    queryKey: ["students", "search", query],
    queryFn: async (): Promise<PaginatedResponse<ClassStudent>> => {
      try {
        return await apiFetch<PaginatedResponse<ClassStudent>>(
          `/api/users?role=student&q=${encodeURIComponent(query)}`
        )
      } catch {
        const q = query.toLowerCase()
        const filtered = MOCK_SEARCH_STUDENTS.filter(
          (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
        )
        return paginate(filtered)
      }
    },
    enabled: query.length >= 2,
  })
}
