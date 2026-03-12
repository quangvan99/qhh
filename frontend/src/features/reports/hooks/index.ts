import { useQuery } from '@tanstack/react-query'
import type {
  ReportType,
  ReportFilter,
  ReportMeta,
  StudentReportRow,
  AttendanceReportRow,
  LearningReportRow,
  LibraryReportRow,
  ActivityReportRow,
} from '../types'

// ── Report metadata ──
export const REPORT_META: ReportMeta[] = [
  { id: 'students', title: 'Học sinh', description: 'Báo cáo tổng hợp thông tin học sinh', icon: 'Users', color: 'text-emerald-600' },
  { id: 'attendance', title: 'Điểm danh', description: 'Báo cáo tỷ lệ chuyên cần theo lớp', icon: 'Camera', color: 'text-blue-600' },
  { id: 'learning', title: 'Kết quả HT', description: 'Báo cáo kết quả học tập theo môn', icon: 'GraduationCap', color: 'text-amber-600' },
  { id: 'library', title: 'Thư viện', description: 'Báo cáo mượn trả sách thư viện', icon: 'Library', color: 'text-purple-600' },
  { id: 'activity', title: 'Hoạt động', description: 'Nhật ký hoạt động hệ thống', icon: 'Activity', color: 'text-rose-600' },
]

// ── Mock data ──
const MOCK_STUDENTS: StudentReportRow[] = Array.from({ length: 25 }, (_, i) => {
  const classes = ['10A1', '10A2', '11B1', '11B2', '12A1'] as const
  const avgScore = +(Math.random() * 4 + 5).toFixed(1)
  return {
    id: `s${i + 1}`,
    code: `HS${String(1001 + i)}`,
    name: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}${i > 25 ? i : ''}`,
    className: classes[i % classes.length]!,
    avgScore,
    rank: (avgScore >= 8 ? 'Giỏi' : avgScore >= 6.5 ? 'Khá' : avgScore >= 5 ? 'Trung bình' : 'Yếu') as StudentReportRow['rank'],
    attendance: +(Math.random() * 15 + 85).toFixed(1),
  }
})

const MOCK_ATTENDANCE: AttendanceReportRow[] = (() => {
  const classes = ['10A1', '10A2', '11B1', '11B2', '12A1']
  const rows: AttendanceReportRow[] = []
  for (let d = 0; d < 5; d++) {
    const date = new Date()
    date.setDate(date.getDate() - d)
    for (const cls of classes) {
      const total = 40 + Math.floor(Math.random() * 5)
      const absent = Math.floor(Math.random() * 5)
      rows.push({
        date: date.toISOString().slice(0, 10),
        className: cls,
        total,
        present: total - absent,
        absent,
        rate: +((1 - absent / total) * 100).toFixed(1),
      })
    }
  }
  return rows
})()

const MOCK_LEARNING: LearningReportRow[] = (() => {
  const subjects = ['Toán', 'Văn', 'Anh', 'Lý', 'Hoá']
  const classes = ['10A1', '10A2', '11B1']
  const rows: LearningReportRow[] = []
  for (let i = 0; i < 25; i++) {
    const assignmentAvg = +(Math.random() * 4 + 5).toFixed(1)
    const examScore = +(Math.random() * 4 + 5).toFixed(1)
    rows.push({
      id: `l${i + 1}`,
      studentName: `Trần Thị ${String.fromCharCode(65 + (i % 26))}`,
      studentCode: `HS${String(2001 + i)}`,
      className: classes[i % classes.length]!,
      subject: subjects[i % subjects.length]!,
      assignmentAvg,
      examScore,
      finalScore: +((assignmentAvg * 0.4 + examScore * 0.6)).toFixed(1),
    })
  }
  return rows
})()

const MOCK_LIBRARY: LibraryReportRow[] = (() => {
  const titles = [
    'Toán cao cấp', 'Vật lý đại cương', 'Hoá học hữu cơ', 'Ngữ văn 11', 'Tiếng Anh giao tiếp',
    'Lịch sử Việt Nam', 'Địa lý kinh tế', 'Sinh học phân tử', 'Tin học đại cương', 'Triết học Mác-Lênin',
    'Giải tích I', 'Đại số tuyến tính', 'Cơ học lượng tử', 'Hóa phân tích', 'Văn học Việt Nam hiện đại',
    'IELTS Writing', 'Lịch sử thế giới', 'Kinh tế vĩ mô', 'Xác suất thống kê', 'Lập trình Python',
  ]
  const categories = ['Toán', 'Lý', 'Hoá', 'Văn', 'Anh', 'Sử', 'Địa', 'Sinh', 'Tin', 'KHXH']
  return titles.map((title, i) => {
    const borrowCount = 5 + Math.floor(Math.random() * 30)
    const returnedCount = Math.floor(borrowCount * (0.7 + Math.random() * 0.3))
    return {
      id: `lib${i + 1}`,
      bookTitle: title,
      borrowCount,
      returnedCount,
      overdueCount: Math.max(0, borrowCount - returnedCount - Math.floor(Math.random() * 3)),
      category: categories[i % categories.length]!,
    }
  })
})()

const MOCK_ACTIVITY: ActivityReportRow[] = (() => {
  const actions = ['Đăng nhập', 'Tạo lớp học', 'Điểm danh', 'Nộp bài', 'Chấm điểm', 'Mượn sách', 'Trả sách', 'Cập nhật điểm', 'Tạo đề thi', 'Xuất báo cáo']
  const modules = ['auth', 'lms', 'attendance', 'exam', 'library', 'admin']
  const users = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Võ Văn E', 'Hoàng Thị F', 'Đặng Văn G']
  return Array.from({ length: 25 }, (_, i) => {
    const action = actions[i % actions.length]!
    return {
      id: `act${i + 1}`,
      userName: users[i % users.length]!,
      action,
      detail: `${action} — chi tiết hoạt động #${i + 1}`,
      timestamp: new Date(Date.now() - i * 1000 * 60 * 30).toISOString(),
      module: modules[i % modules.length]!,
    }
  })
})()

// ── Fetch functions ──
type ReportDataMap = {
  students: StudentReportRow[]
  attendance: AttendanceReportRow[]
  learning: LearningReportRow[]
  library: LibraryReportRow[]
  activity: ActivityReportRow[]
}

async function fetchReportData<T extends ReportType>(
  type: T,
  _filter: ReportFilter,
): Promise<ReportDataMap[T]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400))
  const map: Record<ReportType, ReportRow[]> = {
    students: MOCK_STUDENTS,
    attendance: MOCK_ATTENDANCE,
    learning: MOCK_LEARNING,
    library: MOCK_LIBRARY,
    activity: MOCK_ACTIVITY,
  }
  return map[type] as ReportDataMap[T]
}

type ReportRow = StudentReportRow | AttendanceReportRow | LearningReportRow | LibraryReportRow | ActivityReportRow

// ── Hooks ──
export function useReportData<T extends ReportType>(type: T, filter: ReportFilter) {
  return useQuery<ReportDataMap[T]>({
    queryKey: ['reports', type, filter],
    queryFn: () => fetchReportData(type, filter),
    staleTime: 5 * 60 * 1000,
  })
}

export interface ClassOption {
  id: string
  name: string
}

const MOCK_CLASSES: ClassOption[] = [
  { id: '10a1', name: '10A1' },
  { id: '10a2', name: '10A2' },
  { id: '11b1', name: '11B1' },
  { id: '11b2', name: '11B2' },
  { id: '12a1', name: '12A1' },
  { id: '12a2', name: '12A2' },
]

export function useReportClasses() {
  return useQuery<ClassOption[]>({
    queryKey: ['reports', 'classes'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200))
      return MOCK_CLASSES
    },
    staleTime: 30 * 60 * 1000,
  })
}
