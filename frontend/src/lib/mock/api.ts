import { delay, paginate } from './utils'
import {
  mockStudents,
  mockTeachers,
  mockClasses,
  mockBooks,
  mockAssignments,
  mockExams,
  mockAttendanceToday,
  mockCameras,
  mockAdminKPIs,
  mockNotifications,
} from './data'

// ===== ADMIN API =====
export const adminMockApi = {
  getKPIs: async () => {
    await delay(400)
    return mockAdminKPIs
  },

  getStudents: async (p?: { page?: number; search?: string; classId?: string; status?: string }) => {
    await delay(300)
    let list = [...mockStudents]
    if (p?.search) list = list.filter(s => s.name.toLowerCase().includes(p.search!.toLowerCase()))
    if (p?.classId) list = list.filter(s => s.classId === p.classId)
    if (p?.status) list = list.filter(s => s.status === p.status)
    return paginate(list, p?.page)
  },

  getStudent: async (id: string) => {
    await delay(200)
    return mockStudents.find(s => s.id === id) ?? null
  },

  getTeachers: async (p?: { page?: number; search?: string; subject?: string; status?: string }) => {
    await delay(300)
    let list = [...mockTeachers]
    if (p?.search) list = list.filter(t => t.name.toLowerCase().includes(p.search!.toLowerCase()))
    if (p?.subject) list = list.filter(t => t.subject === p.subject)
    if (p?.status) list = list.filter(t => t.status === p.status)
    return paginate(list, p?.page)
  },

  getTeacher: async (id: string) => {
    await delay(200)
    return mockTeachers.find(t => t.id === id) ?? null
  },

  getClasses: async (p?: { grade?: number; search?: string }) => {
    await delay(200)
    let list = [...mockClasses]
    if (p?.grade) list = list.filter(c => c.grade === p.grade)
    if (p?.search) list = list.filter(c => c.name.toLowerCase().includes(p.search!.toLowerCase()))
    return list
  },

  getCameras: async () => {
    await delay(300)
    return mockCameras
  },

  getAttendanceToday: async (classId?: string) => {
    await delay(400)
    if (classId) return mockAttendanceToday.filter(a => a.classId === classId)
    return mockAttendanceToday
  },

  getBooks: async (p?: { page?: number; search?: string; category?: string }) => {
    await delay(300)
    let list = [...mockBooks]
    if (p?.search) list = list.filter(b =>
      b.title.toLowerCase().includes(p.search!.toLowerCase()) ||
      b.author.toLowerCase().includes(p.search!.toLowerCase())
    )
    if (p?.category) list = list.filter(b => b.category === p.category)
    return paginate(list, p?.page)
  },

  getNotifications: async () => {
    await delay(200)
    return mockNotifications
  },

  getExams: async (p?: { page?: number; status?: string }) => {
    await delay(300)
    let list = [...mockExams]
    if (p?.status) list = list.filter(e => e.status === p.status)
    return paginate(list, p?.page)
  },
}

// ===== TEACHER API =====
export const teacherMockApi = {
  getMyClasses: async (teacherId: string) => {
    await delay(300)
    // Classes where teacher is homeroom or teaches
    return mockClasses.filter(c => c.homeroom === teacherId).slice(0, 4)
  },

  getTodaySchedule: async (_teacherId: string) => {
    await delay(200)
    return [
      { id: 'sch-1', classId: 'lop-10a1', className: '10A1', subject: 'Toán', startTime: '07:30', endTime: '09:00', room: 'P201', type: 'lesson' },
      { id: 'sch-2', classId: 'lop-12a1', className: '12A1', subject: 'Toán', startTime: '09:30', endTime: '11:00', room: 'P401', type: 'exam' },
      { id: 'sch-3', classId: 'lop-11a1', className: '11A1', subject: 'Toán', startTime: '13:30', endTime: '15:00', room: 'P301', type: 'lesson' },
    ]
  },

  getPendingAttendance: async (_classId: string) => {
    await delay(300)
    return mockAttendanceToday.filter(a => a.status === 'present' && a.confidence !== null && a.confidence < 0.9)
  },

  getPendingGrading: async (teacherId: string) => {
    await delay(300)
    return mockAssignments.filter(a => a.teacherId === teacherId && a.submittedCount > 0).slice(0, 5)
  },

  getAssignments: async (classId: string) => {
    await delay(300)
    return mockAssignments.filter(a => a.classId === classId)
  },

  getExams: async (classId: string) => {
    await delay(300)
    return mockExams.filter(e => e.classId === classId)
  },

  confirmAttendance: async (ids: string[]) => {
    await delay(500)
    return { confirmed: ids.length }
  },

  getAttendanceHeatmap: async (classId: string) => {
    await delay(500)
    const students = mockStudents.filter(s => s.classId === classId).slice(0, 15)
    const days = Array.from({ length: 20 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (19 - i))
      return d.toISOString().split('T')[0]
    })
    const data = students.flatMap(s =>
      days.map(day => ({
        rowId: s.id,
        colId: day,
        value: Math.random() > 0.1 ? 1 : 0,
        tooltip: `${s.name} - ${day}`,
      }))
    )
    return {
      rows: students.map(s => ({ id: s.id, label: s.name })),
      cols: days.map(d => ({ id: d, label: (d ?? '').slice(8) })),
      data,
    }
  },
}

// ===== STUDENT API =====
export const studentMockApi = {
  getTodayAgenda: async (_studentId: string) => {
    await delay(400)
    return {
      urgent: [
        {
          type: 'assignment',
          title: 'Nộp bài Đạo hàm',
          deadline: new Date(Date.now() + 7200000).toISOString(),
          subject: 'Toán',
          link: '/hocsinh/bai-tap/bt-001',
        },
      ],
      today: [
        { type: 'class', title: 'Toán - 12A1', time: '07:30', room: 'P401', subject: 'Toán' },
        { type: 'class', title: 'Vật lý - 12A1', time: '09:30', room: 'P401', subject: 'Vật lý' },
        { type: 'class', title: 'Ngữ văn - 12A1', time: '13:30', room: 'P401', subject: 'Ngữ văn' },
      ],
      upcoming: [
        { type: 'exam', title: 'Kiểm tra Giữa kỳ - Toán', date: new Date(Date.now() + 86400000 * 3).toISOString(), subject: 'Toán' },
        { type: 'assignment', title: 'Bài tập Lượng giác', deadline: new Date(Date.now() + 86400000 * 7).toISOString(), subject: 'Toán' },
      ],
    }
  },

  getMySubjects: async (_studentId: string) => {
    await delay(300)
    return [
      { id: 'sub-1', name: 'Toán học', teacher: 'Nguyễn Thị Bích', progress: 65, completedLessons: 13, totalLessons: 20, color: 'blue', lastAccessed: new Date(Date.now() - 3600000).toISOString() },
      { id: 'sub-2', name: 'Vật lý', teacher: 'Trần Văn Hùng', progress: 45, completedLessons: 9, totalLessons: 20, color: 'purple', lastAccessed: new Date(Date.now() - 86400000).toISOString() },
      { id: 'sub-3', name: 'Ngữ văn', teacher: 'Phạm Văn Đức', progress: 80, completedLessons: 16, totalLessons: 20, color: 'orange', lastAccessed: new Date(Date.now() - 172800000).toISOString() },
      { id: 'sub-4', name: 'Tiếng Anh', teacher: 'Đặng Thị Hoa', progress: 30, completedLessons: 6, totalLessons: 20, color: 'green', lastAccessed: new Date(Date.now() - 259200000).toISOString() },
      { id: 'sub-5', name: 'Hóa học', teacher: 'Lê Thị Lan', progress: 55, completedLessons: 11, totalLessons: 20, color: 'yellow', lastAccessed: new Date(Date.now() - 345600000).toISOString() },
      { id: 'sub-6', name: 'Lịch sử', teacher: 'Hoàng Thị Mai', progress: 70, completedLessons: 14, totalLessons: 20, color: 'red', lastAccessed: new Date(Date.now() - 432000000).toISOString() },
    ]
  },

  getMyAssignments: async (_studentId: string) => {
    await delay(300)
    return {
      pending: mockAssignments.filter(a => a.status === 'active').map(a => ({ ...a, submitted: false })),
      submitted: mockAssignments.filter(a => a.status === 'grading').map(a => ({ ...a, submitted: true, score: null })),
      graded: [{ ...mockAssignments[1], submitted: true, score: 8.5, feedback: 'Bài làm tốt, cần bổ sung thêm dẫn chứng.' }],
    }
  },

  getMyResults: async (_studentId: string) => {
    await delay(400)
    return {
      gpa: 8.4,
      rank: 12,
      totalStudents: 39,
      semester: 'HK1 2024-2025',
      subjects: [
        { name: 'Toán', scores: [8.0, 7.5, 9.0, 8.5], avg: 8.25 },
        { name: 'Vật lý', scores: [7.5, 8.0, 7.0, 8.5], avg: 7.75 },
        { name: 'Hóa học', scores: [9.0, 8.5, 9.5, 9.0], avg: 9.0 },
        { name: 'Ngữ văn', scores: [7.0, 7.5, 8.0, 7.5], avg: 7.5 },
        { name: 'Tiếng Anh', scores: [8.5, 9.0, 8.5, 9.5], avg: 8.875 },
        { name: 'Lịch sử', scores: [8.0, 7.0, 8.5, 7.5], avg: 7.75 },
        { name: 'Địa lý', scores: [7.5, 8.0, 7.5, 8.0], avg: 7.75 },
      ],
    }
  },

  getAttendanceHistory: async (_studentId: string) => {
    await delay(300)
    const today = new Date()
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const day = date.getDay()
      if (day === 0 || day === 6) return null
      return {
        date: date.toISOString().split('T')[0],
        status: i === 3 || i === 15 ? 'absent' : i === 7 ? 'late' : 'present',
        checkIn: i === 3 || i === 15 ? null : `07:${String(10 + (i % 20)).padStart(2, '0')}`,
        checkOut: i === 3 || i === 15 ? null : '16:45',
      }
    }).filter(Boolean)
  },

  getMyExams: async (_studentId: string) => {
    await delay(300)
    return mockExams
  },
}
