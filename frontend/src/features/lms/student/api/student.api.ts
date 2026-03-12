import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  StudentClass,
  PublicClass,
  StudentContentGroup,
  StudentContentItem,
  StudentAssignment,
  StudentExamSession,
  ExamAttempt,
  ExamResult,
  DiscussionThread,
  DiscussionReply,
  AccessLog,
  ClassNotification,
  StudentClassResult,
  PaginatedResponse,
} from '../types/student.types'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MY_CLASSES: StudentClass[] = [
  {
    id: 'cls-001',
    name: 'Toán Đại Số 10A1',
    subject: 'Toán học',
    teacher: 'Nguyễn Văn An',
    teacherAvatar: undefined,
    thumbnail: undefined,
    totalContent: 24,
    completedContent: 16,
    progressPercent: 67,
    status: 'active',
    semester: 'HK1',
    year: '2025-2026',
    startDate: '2025-09-01',
    endDate: '2026-01-15',
    studentCount: 42,
    description: 'Lớp toán đại số dành cho học sinh lớp 10A1. Tập trung vào hàm số, phương trình và bất phương trình.',
  },
  {
    id: 'cls-002',
    name: 'Vật Lý Cơ Học 10A1',
    subject: 'Vật lý',
    teacher: 'Trần Thị Bích',
    teacherAvatar: undefined,
    thumbnail: undefined,
    totalContent: 18,
    completedContent: 14,
    progressPercent: 78,
    status: 'active',
    semester: 'HK1',
    year: '2025-2026',
    startDate: '2025-09-01',
    endDate: '2026-01-15',
    studentCount: 38,
    description: 'Lớp vật lý phần cơ học cho lớp 10A1. Học về động học, động lực học và định luật Newton.',
  },
  {
    id: 'cls-007',
    name: 'Lịch Sử Việt Nam 11C',
    subject: 'Lịch sử',
    teacher: 'Trần Thị Bích',
    teacherAvatar: undefined,
    thumbnail: undefined,
    totalContent: 20,
    completedContent: 6,
    progressPercent: 30,
    status: 'active',
    semester: 'HK2',
    year: '2025-2026',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    studentCount: 38,
    description: 'Lớp lịch sử lớp 11C học kỳ 2. Học về lịch sử Việt Nam từ thế kỷ 19 đến hiện đại.',
  },
  {
    id: 'cls-006',
    name: 'Sinh Học 12A',
    subject: 'Sinh học',
    teacher: 'Nguyễn Văn An',
    teacherAvatar: undefined,
    thumbnail: undefined,
    totalContent: 22,
    completedContent: 22,
    progressPercent: 100,
    status: 'completed',
    semester: 'HK1',
    year: '2025-2026',
    startDate: '2025-09-01',
    endDate: '2026-01-15',
    studentCount: 36,
    description: 'Lớp sinh học lớp 12A. Học về di truyền học, tiến hóa và sinh thái học.',
  },
  {
    id: 'cls-013',
    name: 'Toán Đại Số 10A2',
    subject: 'Toán học',
    teacher: 'Lê Minh Cường',
    teacherAvatar: undefined,
    thumbnail: undefined,
    totalContent: 20,
    completedContent: 20,
    progressPercent: 100,
    status: 'completed',
    semester: 'HK1',
    year: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-01-15',
    studentCount: 41,
    description: 'Lớp toán đại số lớp 10A2 năm 2024-2025.',
  },
]

const MOCK_PUBLIC_CLASSES: PublicClass[] = [
  {
    id: 'cls-005',
    name: 'Tiếng Anh 11B',
    subject: 'Tiếng Anh',
    teacher: 'Hoàng Văn Em',
    teacherAvatar: undefined,
    thumbnail: undefined,
    studentCount: 32,
    capacity: 35,
    status: 'open',
  },
  {
    id: 'cls-008',
    name: 'Địa Lý 10C',
    subject: 'Địa lý',
    teacher: 'Lê Minh Cường',
    teacherAvatar: undefined,
    thumbnail: undefined,
    studentCount: 34,
    capacity: 40,
    status: 'open',
  },
  {
    id: 'cls-009',
    name: 'Toán Giải Tích 12B',
    subject: 'Toán học',
    teacher: 'Phạm Thị Dung',
    teacherAvatar: undefined,
    thumbnail: undefined,
    studentCount: 40,
    capacity: 45,
    status: 'open',
  },
  {
    id: 'cls-011',
    name: 'Tin Học Ứng Dụng 10D',
    subject: 'Tin học',
    teacher: 'Nguyễn Văn An',
    teacherAvatar: undefined,
    thumbnail: undefined,
    studentCount: 30,
    capacity: 30,
    status: 'full',
  },
  {
    id: 'cls-012',
    name: 'GDCD 12',
    subject: 'GDCD',
    teacher: 'Trần Thị Bích',
    teacherAvatar: undefined,
    thumbnail: undefined,
    studentCount: 45,
    capacity: 50,
    status: 'open',
  },
]

const MOCK_CONTENT_GROUPS: Record<string, StudentContentGroup[]> = {
  'cls-001': [
    {
      id: 'grp-001-1',
      name: 'Chương 1: Hàm số và đồ thị',
      order: 1,
      items: [
        { id: 'item-001-1', type: 'video', title: 'Bài giới thiệu hàm số', completed: true, locked: false, videoDuration: 1200, videoProgress: 100, videoUrl: '/videos/intro.mp4' },
        { id: 'item-001-2', type: 'text', title: 'Lý thuyết hàm số', completed: true, locked: false, textContent: '<h2>Định nghĩa hàm số</h2><p>Hàm số là quy tắc tương ứng...</p>' },
        { id: 'item-001-3', type: 'scorm', title: 'Bài tập tương tác hàm số', completed: true, locked: false, scormProgress: 85, scormUrl: '/scorm/hanso/' },
        { id: 'item-001-4', type: 'survey', title: 'Kiểm tra nhanh chương 1', completed: false, locked: false, surveyId: 'survey-001' },
      ],
    },
    {
      id: 'grp-001-2',
      name: 'Chương 2: Phương trình bậc nhất và bậc hai',
      order: 2,
      items: [
        { id: 'item-001-5', type: 'video', title: 'Phương trình bậc nhất', completed: true, locked: false, videoDuration: 900, videoProgress: 100, videoUrl: '/videos/pt1.mp4' },
        { id: 'item-001-6', type: 'file', title: 'Tài liệu bài tập phương trình', completed: true, locked: false, fileUrl: '/files/bt-pt.pdf', fileName: 'bt-phuong-trinh.pdf' },
        { id: 'item-001-7', type: 'scorm', title: 'Luyện tập phương trình bậc hai', completed: false, locked: false, scormProgress: 40, scormUrl: '/scorm/pt2/' },
        { id: 'item-001-8', type: 'offline', title: 'Buổi học trực tiếp tại phòng A101', completed: false, locked: true, offlineInfo: { location: 'Phòng A101', time: '08:00 - 10:00 Thứ 3', materials: 'SGK Toán 10, vở ghi' } },
      ],
    },
    {
      id: 'grp-001-3',
      name: 'Chương 3: Bất phương trình',
      order: 3,
      items: [
        { id: 'item-001-9', type: 'video', title: 'Bất phương trình bậc nhất', completed: false, locked: true, videoDuration: 1500, videoProgress: 0 },
        { id: 'item-001-10', type: 'text', title: 'Hệ bất phương trình', completed: false, locked: true },
      ],
    },
  ],
  'cls-002': [
    {
      id: 'grp-002-1',
      name: 'Phần 1: Động học chất điểm',
      order: 1,
      items: [
        { id: 'item-002-1', type: 'video', title: 'Chuyển động thẳng đều', completed: true, locked: false, videoDuration: 1800, videoProgress: 100, videoUrl: '/videos/cdtd.mp4' },
        { id: 'item-002-2', type: 'scorm', title: 'Mô phỏng chuyển động', completed: true, locked: false, scormProgress: 100 },
        { id: 'item-002-3', type: 'text', title: 'Gia tốc và chuyển động biến đổi', completed: true, locked: false, textContent: '<h2>Gia tốc</h2><p>Gia tốc là đại lượng...</p>' },
        { id: 'item-002-4', type: 'survey', title: 'Quiz chương động học', completed: true, locked: false, surveyId: 'survey-002' },
      ],
    },
    {
      id: 'grp-002-2',
      name: 'Phần 2: Lực và định luật Newton',
      order: 2,
      items: [
        { id: 'item-002-5', type: 'video', title: '3 Định luật Newton', completed: true, locked: false, videoDuration: 2400, videoProgress: 100, videoUrl: '/videos/newton.mp4' },
        { id: 'item-002-6', type: 'file', title: 'Đề kiểm tra 15 phút', completed: false, locked: false, fileUrl: '/files/kt15.pdf', fileName: 'kiem-tra-15p.pdf' },
        { id: 'item-002-7', type: 'offline', title: 'Thí nghiệm tại phòng Lab1', completed: false, locked: false, offlineInfo: { location: 'Lab1', time: '13:00 - 15:00 Thứ 5', materials: 'Xe đẩy, lực kế, đường ray' } },
      ],
    },
  ],
}

const MOCK_ASSIGNMENTS: Record<string, StudentAssignment[]> = {
  'cls-001': [
    {
      id: 'asgn-001-1',
      title: 'Bài tập chương 1: Hàm số',
      classId: 'cls-001',
      className: 'Toán Đại Số 10A1',
      description: 'Hoàn thành các bài tập trang 45-48 SGK và làm thêm 5 bài nâng cao trong file đính kèm.',
      deadline: '2026-03-20T23:59:00Z',
      maxScore: 10,
      type: 'both',
      status: 'pending',
      attachments: [{ name: 'bai-tap-chuong-1.pdf', url: '/files/bai-tap-c1.pdf' }],
    },
    {
      id: 'asgn-001-2',
      title: 'Kiểm tra 1 tiết - Phương trình',
      classId: 'cls-001',
      className: 'Toán Đại Số 10A1',
      description: 'Bài kiểm tra 1 tiết về phương trình bậc nhất và bậc hai. Thời gian 45 phút.',
      deadline: '2026-03-10T23:59:00Z',
      maxScore: 10,
      type: 'file',
      status: 'submitted',
      submittedAt: '2026-03-09T18:30:00Z',
      submissionFiles: [{ name: 'bai-lam-cua-toi.pdf', url: '/submissions/s1.pdf' }],
    },
    {
      id: 'asgn-001-3',
      title: 'Bài luận hàm số trong cuộc sống',
      classId: 'cls-001',
      className: 'Toán Đại Số 10A1',
      description: 'Viết bài luận ngắn (500-800 từ) về ứng dụng của hàm số trong đời sống hàng ngày.',
      deadline: '2026-02-28T23:59:00Z',
      maxScore: 10,
      type: 'text',
      status: 'graded',
      submittedAt: '2026-02-25T20:00:00Z',
      score: 8.5,
      feedback: 'Bài viết có nội dung tốt, lập luận logic. Cần bổ sung thêm ví dụ thực tế.',
      submissionText: 'Hàm số là một khái niệm toán học quan trọng có ứng dụng rộng rãi...',
    },
  ],
  'cls-002': [
    {
      id: 'asgn-002-1',
      title: 'Báo cáo thí nghiệm chuyển động',
      classId: 'cls-002',
      className: 'Vật Lý Cơ Học 10A1',
      description: 'Viết báo cáo kết quả thí nghiệm đo gia tốc chuyển động thẳng. Nộp file Word hoặc PDF.',
      deadline: '2026-03-25T23:59:00Z',
      maxScore: 10,
      type: 'file',
      status: 'pending',
    },
    {
      id: 'asgn-002-2',
      title: 'Bài tập định luật Newton',
      classId: 'cls-002',
      className: 'Vật Lý Cơ Học 10A1',
      description: 'Giải 10 bài tập về 3 định luật Newton trong tài liệu đính kèm.',
      deadline: '2026-03-05T23:59:00Z',
      maxScore: 10,
      type: 'both',
      status: 'graded',
      submittedAt: '2026-03-04T21:00:00Z',
      score: 9,
      feedback: 'Làm bài rất tốt! Trình bày rõ ràng, đầy đủ các bước.',
      attachments: [{ name: 'bai-tap-newton.pdf', url: '/files/newton.pdf' }],
    },
  ],
}

const MOCK_EXAMS: StudentExamSession[] = [
  // ── Sắp diễn ra ──
  {
    id: 'exam-001',
    examTitle: 'Kiểm tra giữa kỳ 2 – Toán học',
    subject: 'Toán học',
    startTime: '2026-03-18T07:30:00Z',
    endTime: '2026-03-18T09:00:00Z',
    duration: 90,
    status: 'upcoming',
    passingScore: 5,
    totalQuestions: 40,
    room: 'P.A101',
    registered: true,
    totalParticipants: 42,
  },
  {
    id: 'exam-005',
    examTitle: 'Kiểm tra 1 tiết – Hóa học',
    subject: 'Hóa học',
    startTime: '2026-03-20T13:30:00Z',
    endTime: '2026-03-20T14:45:00Z',
    duration: 45,
    status: 'upcoming',
    passingScore: 5,
    totalQuestions: 30,
    room: 'P.B203',
    registered: true,
    totalParticipants: 38,
  },
  {
    id: 'exam-006',
    examTitle: 'Kiểm tra giữa kỳ 2 – Vật lý',
    subject: 'Vật lý',
    startTime: '2026-03-22T07:30:00Z',
    endTime: '2026-03-22T09:00:00Z',
    duration: 90,
    status: 'upcoming',
    passingScore: 5,
    totalQuestions: 40,
    room: 'P.A201',
    registered: false,
    totalParticipants: 40,
  },
  {
    id: 'exam-007',
    examTitle: 'Kiểm tra 15 phút – Tiếng Anh',
    subject: 'Tiếng Anh',
    startTime: '2026-03-25T09:00:00Z',
    endTime: '2026-03-25T09:15:00Z',
    duration: 15,
    status: 'upcoming',
    passingScore: 5,
    totalQuestions: 10,
    room: 'P.C102',
    registered: true,
    totalParticipants: 45,
  },
  // ── Đang thi ──
  {
    id: 'exam-002',
    examTitle: 'Kiểm tra 15 phút – Vật lý (Đang thi)',
    subject: 'Vật lý',
    startTime: '2026-03-12T13:00:00Z',
    endTime: '2026-03-12T13:15:00Z',
    duration: 15,
    status: 'ongoing',
    passingScore: 5,
    totalQuestions: 10,
    room: 'P.B202',
    registered: true,
    totalParticipants: 38,
  },
  // ── Đã kết thúc ──
  {
    id: 'exam-003',
    examTitle: 'Kiểm tra 1 tiết – Toán học (HK2)',
    subject: 'Toán học',
    startTime: '2026-02-20T07:30:00Z',
    endTime: '2026-02-20T08:30:00Z',
    duration: 60,
    status: 'completed',
    score: 8.25,
    passingScore: 5,
    totalQuestions: 30,
    room: 'P.A101',
    registered: true,
    rank: 5,
    totalParticipants: 42,
  },
  {
    id: 'exam-004',
    examTitle: 'Kiểm tra cuối kỳ 1 – Sinh học',
    subject: 'Sinh học',
    startTime: '2026-01-10T07:30:00Z',
    endTime: '2026-01-10T09:00:00Z',
    duration: 90,
    status: 'completed',
    score: 9,
    passingScore: 5,
    totalQuestions: 50,
    room: 'P.B305',
    registered: true,
    rank: 2,
    totalParticipants: 36,
  },
  {
    id: 'exam-008',
    examTitle: 'Kiểm tra giữa kỳ 1 – Ngữ văn',
    subject: 'Ngữ văn',
    startTime: '2025-10-18T07:30:00Z',
    endTime: '2025-10-18T09:30:00Z',
    duration: 120,
    status: 'completed',
    score: 7.5,
    passingScore: 5,
    totalQuestions: 5,
    room: 'P.C201',
    registered: true,
    rank: 12,
    totalParticipants: 43,
  },
  {
    id: 'exam-009',
    examTitle: 'Kiểm tra 1 tiết – Hóa học (HK1)',
    subject: 'Hóa học',
    startTime: '2025-11-05T13:30:00Z',
    endTime: '2025-11-05T14:30:00Z',
    duration: 45,
    status: 'completed',
    score: 6.75,
    passingScore: 5,
    totalQuestions: 30,
    room: 'P.A302',
    registered: true,
    rank: 18,
    totalParticipants: 39,
  },
  {
    id: 'exam-010',
    examTitle: 'Kiểm tra cuối kỳ 1 – Tiếng Anh',
    subject: 'Tiếng Anh',
    startTime: '2025-12-15T07:30:00Z',
    endTime: '2025-12-15T09:00:00Z',
    duration: 60,
    status: 'completed',
    score: 8.75,
    passingScore: 5,
    totalQuestions: 50,
    room: 'P.B102',
    registered: true,
    rank: 3,
    totalParticipants: 44,
  },
  {
    id: 'exam-011',
    examTitle: 'Kiểm tra cuối kỳ 1 – Vật lý',
    subject: 'Vật lý',
    startTime: '2025-12-20T07:30:00Z',
    endTime: '2025-12-20T09:00:00Z',
    duration: 90,
    status: 'completed',
    score: 5.5,
    passingScore: 5,
    totalQuestions: 40,
    room: 'P.A201',
    registered: true,
    rank: 29,
    totalParticipants: 41,
  },
  {
    id: 'exam-012',
    examTitle: 'Kiểm tra cuối kỳ 1 – Toán học',
    subject: 'Toán học',
    startTime: '2025-12-22T07:30:00Z',
    endTime: '2025-12-22T09:30:00Z',
    duration: 120,
    status: 'completed',
    score: 9.25,
    passingScore: 5,
    totalQuestions: 50,
    room: 'P.A101',
    registered: true,
    rank: 1,
    totalParticipants: 42,
  },
  // ── Bỏ lỡ ──
  {
    id: 'exam-013',
    examTitle: 'Kiểm tra 15 phút – Sinh học',
    subject: 'Sinh học',
    startTime: '2026-03-10T07:00:00Z',
    endTime: '2026-03-10T07:15:00Z',
    duration: 15,
    status: 'missed',
    passingScore: 5,
    totalQuestions: 10,
    room: 'P.B305',
    registered: true,
    totalParticipants: 36,
  },
]

const MOCK_EXAM_ATTEMPT: ExamAttempt = {
  id: 'attempt-001',
  sessionId: 'exam-002',
  questions: [
    { id: 'q1', index: 1, content: 'Gia tốc của một vật chuyển động thẳng đều bằng bao nhiêu?', type: 'single_choice', options: [{ key: 'A', label: '1 m/s²' }, { key: 'B', label: '0' }, { key: 'C', label: '9.8 m/s²' }, { key: 'D', label: 'Không xác định' }] },
    { id: 'q2', index: 2, content: 'Đơn vị của vận tốc trong hệ SI là gì?', type: 'single_choice', options: [{ key: 'A', label: 'km/h' }, { key: 'B', label: 'm/s' }, { key: 'C', label: 'cm/s' }, { key: 'D', label: 'm/s²' }] },
    { id: 'q3', index: 3, content: 'Định luật I Newton phát biểu về điều gì?', type: 'single_choice', options: [{ key: 'A', label: 'Quán tính' }, { key: 'B', label: 'Gia tốc' }, { key: 'C', label: 'Phản lực' }, { key: 'D', label: 'Trọng lực' }] },
    { id: 'q4', index: 4, content: 'Chuyển động nào sau đây có gia tốc?', type: 'multiple_choice', options: [{ key: 'A', label: 'Xe chạy đều trên đường thẳng' }, { key: 'B', label: 'Xe đang phanh' }, { key: 'C', label: 'Vật ném ngang' }, { key: 'D', label: 'Vật rơi tự do' }] },
    { id: 'q5', index: 5, content: 'Nếu tổng hợp lực tác dụng lên vật bằng 0 thì vật đứng yên. ĐÚNG hay SAI?', type: 'true_false' },
    { id: 'q6', index: 6, content: 'Lực ma sát có chiều nào so với chiều chuyển động?', type: 'single_choice', options: [{ key: 'A', label: 'Cùng chiều chuyển động' }, { key: 'B', label: 'Ngược chiều chuyển động' }, { key: 'C', label: 'Vuông góc chuyển động' }, { key: 'D', label: 'Tùy trường hợp' }] },
    { id: 'q7', index: 7, content: 'Đơn vị của lực trong hệ SI là gì?', type: 'single_choice', options: [{ key: 'A', label: 'kg' }, { key: 'B', label: 'N' }, { key: 'C', label: 'J' }, { key: 'D', label: 'W' }] },
    { id: 'q8', index: 8, content: 'Ném vật theo phương ngang là chuyển động dạng nào?', type: 'single_choice', options: [{ key: 'A', label: 'Thẳng đều' }, { key: 'B', label: 'Tròn đều' }, { key: 'C', label: 'Parabol' }, { key: 'D', label: 'Elip' }] },
    { id: 'q9', index: 9, content: 'Hãy mô tả ngắn gọn về khái niệm quán tính và cho ví dụ minh họa trong đời sống.', type: 'essay' },
    { id: 'q10', index: 10, content: 'Hai vật có cùng khối lượng sẽ chịu cùng gia tốc dưới tác dụng của cùng lực. ĐÚNG hay SAI?', type: 'true_false' },
  ],
  answers: { q1: 'B', q2: 'B', q5: 'false' },
  timeLeft: 720,
  startedAt: new Date().toISOString(),
}

const MOCK_EXAM_RESULTS: Record<string, ExamResult> = {
  'exam-003': {
    id: 'result-003',
    sessionId: 'exam-003',
    examTitle: 'Kiểm tra 1 tiết – Toán học (HK2)',
    score: 8.25,
    totalScore: 10,
    correctCount: 24,
    totalQuestions: 30,
    timeTaken: 3120,
    rank: 5,
    totalParticipants: 42,
    showDetail: true,
    questions: [
      { id: 'q-r1', index: 1, content: 'Hàm số y = x² + 2x + 1 có tập xác định là gì?', type: 'single_choice', options: [{ key: 'A', label: 'ℝ' }, { key: 'B', label: '[0, +∞)' }, { key: 'C', label: '(-∞, 0]' }, { key: 'D', label: '(0, +∞)' }], userAnswer: 'A', correctAnswer: 'A', isCorrect: true, explanation: 'Hàm số đa thức xác định với mọi x ∈ ℝ' },
      { id: 'q-r2', index: 2, content: 'Phương trình x² - 5x + 6 = 0 có nghiệm là?', type: 'single_choice', options: [{ key: 'A', label: 'x = 2 và x = 3' }, { key: 'B', label: 'x = 1 và x = 6' }, { key: 'C', label: 'x = -2 và x = -3' }, { key: 'D', label: 'Vô nghiệm' }], userAnswer: 'A', correctAnswer: 'A', isCorrect: true, explanation: 'Δ = 25 - 24 = 1 > 0; x₁ = (5+1)/2 = 3; x₂ = (5-1)/2 = 2' },
      { id: 'q-r3', index: 3, content: 'Bất phương trình 2x + 3 > 7 có tập nghiệm là?', type: 'single_choice', options: [{ key: 'A', label: 'x > 2' }, { key: 'B', label: 'x < 2' }, { key: 'C', label: 'x ≥ 2' }, { key: 'D', label: 'x ≤ 2' }], userAnswer: 'B', correctAnswer: 'A', isCorrect: false, explanation: '2x + 3 > 7 → 2x > 4 → x > 2. Đáp án đúng là A.' },
      { id: 'q-r4', index: 4, content: 'Giá trị lớn nhất của hàm số y = -x² + 4x + 1 là bao nhiêu?', type: 'single_choice', options: [{ key: 'A', label: '3' }, { key: 'B', label: '4' }, { key: 'C', label: '5' }, { key: 'D', label: '6' }], userAnswer: 'C', correctAnswer: 'C', isCorrect: true, explanation: 'y = -(x-2)² + 5, max = 5 khi x = 2' },
      { id: 'q-r5', index: 5, content: 'sin(30°) bằng bao nhiêu?', type: 'single_choice', options: [{ key: 'A', label: '√2/2' }, { key: 'B', label: '1/2' }, { key: 'C', label: '√3/2' }, { key: 'D', label: '1' }], userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
    ],
  },
  'exam-004': {
    id: 'result-004',
    sessionId: 'exam-004',
    examTitle: 'Kiểm tra cuối kỳ 1 – Sinh học',
    score: 9,
    totalScore: 10,
    correctCount: 45,
    totalQuestions: 50,
    timeTaken: 4800,
    rank: 2,
    totalParticipants: 36,
    showDetail: false,
  },
  'exam-008': {
    id: 'result-008',
    sessionId: 'exam-008',
    examTitle: 'Kiểm tra giữa kỳ 1 – Ngữ văn',
    score: 7.5,
    totalScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    timeTaken: 6800,
    rank: 12,
    totalParticipants: 43,
    showDetail: false,
  },
  'exam-009': {
    id: 'result-009',
    sessionId: 'exam-009',
    examTitle: 'Kiểm tra 1 tiết – Hóa học (HK1)',
    score: 6.75,
    totalScore: 10,
    correctCount: 20,
    totalQuestions: 30,
    timeTaken: 2400,
    rank: 18,
    totalParticipants: 39,
    showDetail: false,
  },
  'exam-010': {
    id: 'result-010',
    sessionId: 'exam-010',
    examTitle: 'Kiểm tra cuối kỳ 1 – Tiếng Anh',
    score: 8.75,
    totalScore: 10,
    correctCount: 43,
    totalQuestions: 50,
    timeTaken: 3300,
    rank: 3,
    totalParticipants: 44,
    showDetail: false,
  },
  'exam-011': {
    id: 'result-011',
    sessionId: 'exam-011',
    examTitle: 'Kiểm tra cuối kỳ 1 – Vật lý',
    score: 5.5,
    totalScore: 10,
    correctCount: 22,
    totalQuestions: 40,
    timeTaken: 4900,
    rank: 29,
    totalParticipants: 41,
    showDetail: true,
    questions: [
      { id: 'q-ly1', index: 1, content: 'Gia tốc của vật chuyển động thẳng đều là?', type: 'single_choice', options: [{ key: 'A', label: '0' }, { key: 'B', label: '9.8 m/s²' }, { key: 'C', label: '1 m/s²' }, { key: 'D', label: 'Không xác định' }], userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
      { id: 'q-ly2', index: 2, content: 'Đơn vị đo lực là gì?', type: 'single_choice', options: [{ key: 'A', label: 'kg' }, { key: 'B', label: 'N' }, { key: 'C', label: 'J' }, { key: 'D', label: 'W' }], userAnswer: 'C', correctAnswer: 'B', isCorrect: false, explanation: 'Đơn vị của lực là Newton (N) trong hệ SI' },
    ],
  },
  'exam-012': {
    id: 'result-012',
    sessionId: 'exam-012',
    examTitle: 'Kiểm tra cuối kỳ 1 – Toán học',
    score: 9.25,
    totalScore: 10,
    correctCount: 46,
    totalQuestions: 50,
    timeTaken: 5900,
    rank: 1,
    totalParticipants: 42,
    showDetail: false,
  },
}

// Legacy alias for backward compat
const MOCK_EXAM_RESULT = MOCK_EXAM_RESULTS['exam-003']!

const MOCK_DISCUSSIONS: Record<string, DiscussionThread[]> = {
  'cls-001': [
    {
      id: 'thread-001-1',
      classId: 'cls-001',
      title: '[Thông báo] Lịch kiểm tra giữa kỳ',
      content: 'Các em chú ý: Kiểm tra giữa kỳ sẽ diễn ra vào ngày 15/3/2026 tại phòng A101, từ 7h30 đến 9h00. Đề thi bao gồm 40 câu trắc nghiệm về chương 1 và 2.',
      author: { id: 't1', name: 'Nguyễn Văn An', role: 'teacher' },
      createdAt: '2026-03-01T08:00:00Z',
      replyCount: 12,
      pinned: true,
      unread: false,
    },
    {
      id: 'thread-001-2',
      classId: 'cls-001',
      title: 'Thắc mắc về bài tập chương 2 - bài số 5',
      content: 'Thầy ơi, em không hiểu cách giải bài số 5 phần phương trình bậc hai. Em đã thử dùng công thức delta nhưng ra kết quả khác đáp án. Thầy có thể giải thích giúp em không?',
      author: { id: 'stu-001', name: 'Nguyễn Thị Lan', role: 'student' },
      createdAt: '2026-03-05T15:30:00Z',
      replyCount: 5,
      pinned: false,
      unread: true,
    },
    {
      id: 'thread-001-3',
      classId: 'cls-001',
      title: 'Chia sẻ tài liệu ôn tập chương 1',
      content: 'Mình tổng hợp lại các công thức và bài tập quan trọng chương 1 để mọi người cùng ôn. File đính kèm phía dưới.',
      author: { id: 'stu-002', name: 'Trần Văn Minh', role: 'student' },
      createdAt: '2026-03-03T20:00:00Z',
      replyCount: 8,
      pinned: false,
      unread: false,
      attachments: [{ name: 'on-tap-chuong-1.pdf', url: '/files/ontap-c1.pdf' }],
    },
  ],
  'cls-002': [
    {
      id: 'thread-002-1',
      classId: 'cls-002',
      title: '[Thông báo] Lịch thí nghiệm tuần tới',
      content: 'Tuần tới lớp sẽ có buổi thí nghiệm tại Lab1 vào thứ 5 (19/3). Các em mang theo SGK và vở thực hành.',
      author: { id: 't2', name: 'Trần Thị Bích', role: 'teacher' },
      createdAt: '2026-03-10T07:00:00Z',
      replyCount: 3,
      pinned: true,
      unread: true,
    },
    {
      id: 'thread-002-2',
      classId: 'cls-002',
      title: 'Câu hỏi về định luật II Newton',
      content: 'Thưa cô, trong bài tập 3 trang 78 em thấy lực tổng hợp bằng 0 nhưng vật vẫn chuyển động. Em chưa hiểu tại sao ạ?',
      author: { id: 'stu-003', name: 'Lê Thị Hoa', role: 'student' },
      createdAt: '2026-03-08T19:45:00Z',
      replyCount: 6,
      pinned: false,
      unread: false,
    },
  ],
}

const MOCK_DISCUSSION_REPLIES: Record<string, DiscussionReply[]> = {
  'thread-001-2': [
    {
      id: 'reply-001',
      threadId: 'thread-001-2',
      content: 'Em kiểm tra lại phần tính delta: Δ = b² - 4ac. Nếu Δ > 0 thì có 2 nghiệm phân biệt x = (-b ± √Δ) / 2a. Em xem lại bước nào nhé.',
      author: { id: 't1', name: 'Nguyễn Văn An', role: 'teacher' },
      createdAt: '2026-03-05T16:00:00Z',
      isOwn: false,
    },
    {
      id: 'reply-002',
      threadId: 'thread-001-2',
      content: 'Thầy ơi em đã tìm ra lỗi rồi ạ, em tính sai dấu của b. Cảm ơn thầy!',
      author: { id: 'stu-001', name: 'Nguyễn Thị Lan', role: 'student' },
      createdAt: '2026-03-05T16:30:00Z',
      isOwn: false,
    },
    {
      id: 'reply-003',
      threadId: 'thread-001-2',
      content: 'Mình cũng hay nhầm chỗ này lắm, mọi người nhớ kiểm tra dấu kỹ nhé!',
      author: { id: 'stu-004', name: 'Bùi Văn Đức', role: 'student' },
      createdAt: '2026-03-05T17:00:00Z',
      isOwn: true,
    },
  ],
}

const MOCK_ACCESS_LOGS: Record<string, AccessLog[]> = {
  'cls-001': [
    { id: 'log-001', action: 'Xem video', contentTitle: 'Bài giới thiệu hàm số', timestamp: '2026-03-11T08:30:00Z', duration: 1200 },
    { id: 'log-002', action: 'Hoàn thành SCORM', contentTitle: 'Bài tập tương tác hàm số', timestamp: '2026-03-10T14:20:00Z', duration: 2400 },
    { id: 'log-003', action: 'Đọc tài liệu', contentTitle: 'Lý thuyết hàm số', timestamp: '2026-03-09T20:15:00Z', duration: 600 },
    { id: 'log-004', action: 'Nộp bài tập', contentTitle: 'Kiểm tra 1 tiết - Phương trình', timestamp: '2026-03-09T18:30:00Z' },
    { id: 'log-005', action: 'Xem video', contentTitle: 'Phương trình bậc nhất', timestamp: '2026-03-08T09:00:00Z', duration: 900 },
    { id: 'log-006', action: 'Tải file', contentTitle: 'Tài liệu bài tập phương trình', timestamp: '2026-03-07T21:30:00Z' },
    { id: 'log-007', action: 'Hoàn thành SCORM', contentTitle: 'Bài tập tương tác hàm số', timestamp: '2026-03-06T15:00:00Z', duration: 1800 },
    { id: 'log-008', action: 'Đăng thảo luận', contentTitle: 'Câu hỏi về bài tập chương 2', timestamp: '2026-03-05T15:30:00Z' },
  ],
}

const MOCK_NOTIFICATIONS: Record<string, ClassNotification[]> = {
  'cls-001': [
    {
      id: 'notif-001',
      title: 'Hạn nộp bài tập sắp đến',
      content: 'Bài tập "Hàm số chương 1" sẽ đến hạn vào ngày 20/03/2026. Hãy nộp bài đúng hạn!',
      sender: { name: 'Hệ thống' },
      createdAt: '2026-03-10T08:00:00Z',
      read: false,
    },
    {
      id: 'notif-002',
      title: 'Bài tập đã được chấm điểm',
      content: 'Bài luận "Hàm số trong cuộc sống" của bạn đã được giáo viên chấm điểm: 8.5/10',
      sender: { name: 'Nguyễn Văn An' },
      createdAt: '2026-03-08T16:00:00Z',
      read: true,
    },
    {
      id: 'notif-003',
      title: 'Thông báo kiểm tra',
      content: 'Kiểm tra giữa kỳ sẽ diễn ra vào ngày 15/03/2026 tại phòng A101.',
      sender: { name: 'Nguyễn Văn An' },
      createdAt: '2026-03-01T08:00:00Z',
      read: true,
    },
  ],
  'cls-002': [
    {
      id: 'notif-004',
      title: 'Lịch thí nghiệm',
      content: 'Buổi thí nghiệm tại Lab1 sẽ diễn ra vào thứ 5 tuần tới (19/03/2026) lúc 13h00.',
      sender: { name: 'Trần Thị Bích' },
      createdAt: '2026-03-10T07:00:00Z',
      read: false,
    },
  ],
}

const MOCK_CLASS_RESULTS: Record<string, StudentClassResult> = {
  'cls-001': {
    contentProgress: 67,
    totalContent: 10,
    completedContent: 7,
    avgAssignmentScore: 8.5,
    avgExamScore: 8.25,
    assignments: [
      { id: 'asgn-001-3', title: 'Bài luận hàm số trong cuộc sống', deadline: '2026-02-28T23:59:00Z', score: 8.5, feedback: 'Bài viết tốt, cần thêm ví dụ thực tế.' },
      { id: 'asgn-001-2', title: 'Kiểm tra 1 tiết - Phương trình', deadline: '2026-03-10T23:59:00Z', score: undefined },
      { id: 'asgn-001-1', title: 'Bài tập chương 1: Hàm số', deadline: '2026-03-20T23:59:00Z', score: undefined },
    ],
    exams: [
      { id: 'exam-003', title: 'Kiểm tra 1 tiết - Toán', date: '2026-02-20T07:30:00Z', score: 8.25, rank: 5 },
      { id: 'exam-001', title: 'Kiểm tra giữa kỳ - Toán HK1', date: '2026-03-15T07:30:00Z', score: undefined },
    ],
  },
  'cls-002': {
    contentProgress: 78,
    totalContent: 7,
    completedContent: 5,
    avgAssignmentScore: 9,
    avgExamScore: undefined,
    assignments: [
      { id: 'asgn-002-2', title: 'Bài tập định luật Newton', deadline: '2026-03-05T23:59:00Z', score: 9, feedback: 'Làm bài rất tốt!' },
      { id: 'asgn-002-1', title: 'Báo cáo thí nghiệm chuyển động', deadline: '2026-03-25T23:59:00Z', score: undefined },
    ],
    exams: [],
  },
  'cls-006': {
    contentProgress: 100,
    totalContent: 22,
    completedContent: 22,
    avgAssignmentScore: 9.2,
    avgExamScore: 9,
    assignments: [
      { id: 'asgn-bio-1', title: 'Bài luận di truyền học', deadline: '2025-12-15T23:59:00Z', score: 9, feedback: 'Xuất sắc!' },
      { id: 'asgn-bio-2', title: 'Bài tập sinh thái học', deadline: '2025-11-30T23:59:00Z', score: 9.5, feedback: 'Rất tốt!' },
    ],
    exams: [
      { id: 'exam-004', title: 'Kiểm tra cuối kỳ - Sinh Học HK1', date: '2026-01-10T07:30:00Z', score: 9, rank: 2 },
    ],
  },
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function paginate<T>(items: T[], page = 1, pageSize = 20): PaginatedResponse<T> {
  const total = items.length
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total, page, pageSize }
}

// ─── My Classes ─────────────────────────────────────────────────────────────

export function useGetMyClasses(filters?: { status?: string }) {
  return useQuery({
    queryKey: ['student-classes', filters],
    queryFn: async (): Promise<StudentClass[]> => {
      try {
        const params = new URLSearchParams()
        if (filters?.status) params.set('status', filters.status)
        return await apiFetch<StudentClass[]>(`/api/v1/student/classes?${params.toString()}`)
      } catch {
        if (filters?.status) {
          return MOCK_MY_CLASSES.filter((c) => c.status === filters.status)
        }
        return MOCK_MY_CLASSES
      }
    },
  })
}

export function useGetMyClass(id: string) {
  return useQuery({
    queryKey: ['student-class', id],
    queryFn: async (): Promise<StudentClass> => {
      try {
        return await apiFetch<StudentClass>(`/api/v1/student/classes/${id}`)
      } catch {
        const found = MOCK_MY_CLASSES.find((c) => c.id === id)
        if (!found) {
          // Return a minimal fallback for classes not in my list
          return {
            id,
            name: `Lớp học ${id}`,
            subject: 'Môn học',
            teacher: 'Giáo viên',
            totalContent: 0,
            completedContent: 0,
            progressPercent: 0,
            status: 'active',
          }
        }
        return found
      }
    },
    enabled: !!id,
  })
}

export function useSearchPublicClasses(q: string) {
  return useQuery({
    queryKey: ['public-classes', q],
    queryFn: async (): Promise<PaginatedResponse<PublicClass>> => {
      try {
        return await apiFetch<PaginatedResponse<PublicClass>>(
          `/api/v1/lms/classes/public?q=${encodeURIComponent(q)}&status=open`
        )
      } catch {
        const lower = q.toLowerCase()
        const filtered = MOCK_PUBLIC_CLASSES.filter(
          (c) => c.name.toLowerCase().includes(lower) || c.subject.toLowerCase().includes(lower) || c.teacher.toLowerCase().includes(lower)
        )
        return paginate(filtered)
      }
    },
    enabled: q.length > 0,
  })
}

export function useEnrollClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (classId: string): Promise<{ message: string }> => {
      try {
        return await apiFetch<{ message: string }>(`/api/v1/lms/classes/${classId}/enroll`, { method: 'POST' })
      } catch {
        const pub = MOCK_PUBLIC_CLASSES.find((c) => c.id === classId)
        if (pub && pub.status === 'full') throw new Error('Lớp học đã đầy')
        return { message: pub?.status === 'pending_approval' ? 'Yêu cầu đăng ký đã được gửi, chờ giáo viên duyệt.' : 'Đăng ký lớp học thành công!' }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-classes'] })
    },
  })
}

// ─── Content ────────────────────────────────────────────────────────────────

export function useGetMyContentGroups(classId: string) {
  return useQuery({
    queryKey: ['student-content', classId],
    queryFn: async (): Promise<StudentContentGroup[]> => {
      try {
        return await apiFetch<StudentContentGroup[]>(`/api/v1/student/classes/${classId}/content`)
      } catch {
        return MOCK_CONTENT_GROUPS[classId] ?? []
      }
    },
    enabled: !!classId,
  })
}

export function useGetContentItem(classId: string, itemId: string) {
  return useQuery({
    queryKey: ['student-content-item', classId, itemId],
    queryFn: async (): Promise<StudentContentItem> => {
      try {
        return await apiFetch<StudentContentItem>(`/api/v1/student/classes/${classId}/content/${itemId}`)
      } catch {
        const groups = MOCK_CONTENT_GROUPS[classId] ?? []
        for (const g of groups) {
          const found = g.items.find((it) => it.id === itemId)
          if (found) return found
        }
        throw new Error(`Content item ${itemId} not found`)
      }
    },
    enabled: !!classId && !!itemId,
  })
}

export function useMarkContentViewed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ classId, itemId }: { classId: string; itemId: string }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/student/classes/${classId}/content/${itemId}/complete`, { method: 'POST' })
      } catch {
        const groups = MOCK_CONTENT_GROUPS[classId]
        if (groups) {
          for (const g of groups) {
            const item = g.items.find((it) => it.id === itemId)
            if (item) { item.completed = true; break }
          }
        }
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-content', variables.classId] })
    },
  })
}

export function useUpdateScormProgress() {
  return useMutation({
    mutationFn: async ({ classId, itemId, ...data }: { classId: string; itemId: string; score?: number; time?: number; completed?: boolean }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/student/classes/${classId}/content/${itemId}/progress`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        // Mock: update scormProgress in cache
        const groups = MOCK_CONTENT_GROUPS[classId]
        if (groups) {
          for (const g of groups) {
            const item = g.items.find((it) => it.id === itemId)
            if (item && data.score !== undefined) { item.scormProgress = data.score; break }
          }
        }
      }
    },
  })
}

// ─── Assignments ────────────────────────────────────────────────────────────

export function useGetMyAssignments(filters?: { classId?: string; status?: string }) {
  return useQuery({
    queryKey: ['student-assignments', filters],
    queryFn: async (): Promise<StudentAssignment[]> => {
      try {
        const params = new URLSearchParams()
        if (filters?.classId) params.set('classId', filters.classId)
        if (filters?.status) params.set('status', filters.status)
        return await apiFetch<StudentAssignment[]>(`/api/v1/student/assignments?${params.toString()}`)
      } catch {
        let all: StudentAssignment[] = []
        if (filters?.classId) {
          all = MOCK_ASSIGNMENTS[filters.classId] ?? []
        } else {
          all = Object.values(MOCK_ASSIGNMENTS).flat()
        }
        if (filters?.status) all = all.filter((a) => a.status === filters.status)
        return all
      }
    },
  })
}

export function useGetMyAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ['student-assignment', assignmentId],
    queryFn: async (): Promise<StudentAssignment> => {
      try {
        return await apiFetch<StudentAssignment>(`/api/v1/student/assignments/${assignmentId}`)
      } catch {
        const all = Object.values(MOCK_ASSIGNMENTS).flat()
        const found = all.find((a) => a.id === assignmentId)
        if (!found) throw new Error(`Assignment ${assignmentId} not found`)
        return found
      }
    },
    enabled: !!assignmentId,
  })
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ assignmentId, files, textContent }: { assignmentId: string; files?: File[]; textContent?: string }): Promise<{ message: string }> => {
      try {
        const formData = new FormData()
        if (textContent) formData.append('textContent', textContent)
        if (files) { for (const file of files) { formData.append('files[]', file) } }
        return await apiFetch<{ message: string }>(`/api/v1/student/assignments/${assignmentId}/submit`, {
          method: 'POST',
          body: formData,
          headers: {},
        })
      } catch {
        const all = Object.values(MOCK_ASSIGNMENTS).flat()
        const found = all.find((a) => a.id === assignmentId)
        if (found) { found.status = 'submitted'; found.submittedAt = new Date().toISOString() }
        return { message: 'Nộp bài thành công!' }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-assignments'] })
      void queryClient.invalidateQueries({ queryKey: ['student-assignment'] })
    },
  })
}

export function useSaveDraft() {
  return useMutation({
    mutationFn: async ({ assignmentId, textContent }: { assignmentId: string; textContent: string }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/student/assignments/${assignmentId}/draft`, {
          method: 'PUT',
          body: JSON.stringify({ textContent }),
        })
      } catch {
        // Mock: noop, draft saved locally
      }
    },
  })
}

// ─── Exams ──────────────────────────────────────────────────────────────────

export function useGetMyExams(filters?: { status?: string }) {
  return useQuery({
    queryKey: ['student-exams', filters],
    queryFn: async (): Promise<StudentExamSession[]> => {
      try {
        const params = new URLSearchParams()
        if (filters?.status) params.set('status', filters.status)
        return await apiFetch<StudentExamSession[]>(`/api/v1/student/exams?${params.toString()}`)
      } catch {
        if (filters?.status) return MOCK_EXAMS.filter((e) => e.status === filters.status)
        return MOCK_EXAMS
      }
    },
  })
}

export function useGetExamSession(sessionId: string) {
  return useQuery({
    queryKey: ['exam-session', sessionId],
    queryFn: async (): Promise<StudentExamSession> => {
      try {
        return await apiFetch<StudentExamSession>(`/api/v1/student/exams/${sessionId}`)
      } catch {
        const found = MOCK_EXAMS.find((e) => e.id === sessionId)
        if (!found) throw new Error(`Exam session ${sessionId} not found`)
        return found
      }
    },
    enabled: !!sessionId,
  })
}

export function useRegisterExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (examId: string): Promise<{ message: string }> => {
      try {
        return await apiFetch<{ message: string }>(`/api/v1/student/exams/${examId}/register`, { method: 'POST' })
      } catch {
        const found = MOCK_EXAMS.find((e) => e.id === examId)
        if (found) found.registered = true
        return { message: 'Đăng ký thi thành công!' }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-exams'] })
    },
  })
}

export function useGetExamAttempt(sessionId: string) {
  return useQuery({
    queryKey: ['exam-attempt', sessionId],
    queryFn: async (): Promise<ExamAttempt> => {
      try {
        return await apiFetch<ExamAttempt>(`/api/v1/student/exams/${sessionId}/attempt`)
      } catch {
        return { ...MOCK_EXAM_ATTEMPT, sessionId }
      }
    },
    enabled: !!sessionId,
  })
}

export function useStartExamAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: string): Promise<ExamAttempt> => {
      try {
        return await apiFetch<ExamAttempt>(`/api/v1/student/exams/${sessionId}/attempt`, { method: 'POST' })
      } catch {
        return { ...MOCK_EXAM_ATTEMPT, sessionId, startedAt: new Date().toISOString() }
      }
    },
    onSuccess: (_data, sessionId) => {
      void queryClient.invalidateQueries({ queryKey: ['exam-attempt', sessionId] })
    },
  })
}

export function useSaveExamAnswers() {
  return useMutation({
    mutationFn: async ({ sessionId, answers }: { sessionId: string; answers: Record<string, string | string[]> }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/student/exams/${sessionId}/answers`, {
          method: 'PUT',
          body: JSON.stringify({ answers }),
        })
      } catch {
        // Mock: merge answers into MOCK_EXAM_ATTEMPT
        Object.assign(MOCK_EXAM_ATTEMPT.answers, answers)
      }
    },
  })
}

export function useSubmitExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: string): Promise<{ message: string }> => {
      try {
        return await apiFetch<{ message: string }>(`/api/v1/student/exams/${sessionId}/submit`, { method: 'POST' })
      } catch {
        const found = MOCK_EXAMS.find((e) => e.id === sessionId)
        if (found) { found.status = 'completed'; found.score = 7.5 }
        return { message: 'Nộp bài thi thành công!' }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-exams'] })
    },
  })
}

export function useGetExamResult(sessionId: string) {
  return useQuery({
    queryKey: ['exam-result', sessionId],
    queryFn: async (): Promise<ExamResult> => {
      try {
        return await apiFetch<ExamResult>(`/api/v1/student/exams/${sessionId}/result`)
      } catch {
        const cached = MOCK_EXAM_RESULTS[sessionId]
        if (cached) return cached
        const exam = MOCK_EXAMS.find((e) => e.id === sessionId)
        return {
          id: `result-${sessionId}`,
          sessionId,
          examTitle: exam?.examTitle ?? 'Kỳ thi',
          score: exam?.score ?? 7.5,
          totalScore: 10,
          correctCount: Math.round(((exam?.score ?? 7.5) / 10) * (exam?.totalQuestions ?? 30)),
          totalQuestions: exam?.totalQuestions ?? 30,
          timeTaken: exam?.duration ? (exam.duration - 5) * 60 : 1800,
          rank: exam?.rank,
          totalParticipants: exam?.totalParticipants,
          showDetail: false,
        }
      }
    },
    enabled: !!sessionId,
  })
}

export function useGetExamHistory() {
  return useQuery({
    queryKey: ['exam-history'],
    queryFn: async (): Promise<StudentExamSession[]> => {
      try {
        return await apiFetch<StudentExamSession[]>('/api/v1/student/exams/history')
      } catch {
        return MOCK_EXAMS.filter((e) => e.status === 'completed')
      }
    },
  })
}

// ─── Discussions ────────────────────────────────────────────────────────────

export function useGetDiscussions(classId: string, sort?: string) {
  return useQuery({
    queryKey: ['student-discussions', classId, sort],
    queryFn: async (): Promise<DiscussionThread[]> => {
      try {
        const params = new URLSearchParams()
        if (sort) params.set('sort', sort)
        return await apiFetch<DiscussionThread[]>(`/api/v1/student/classes/${classId}/discussions?${params.toString()}`)
      } catch {
        const threads = MOCK_DISCUSSIONS[classId] ?? []
        if (sort === 'pinned') return [...threads].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
        if (sort === 'latest') return [...threads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        return threads
      }
    },
    enabled: !!classId,
  })
}

export function useGetDiscussionThread(classId: string, threadId: string) {
  return useQuery({
    queryKey: ['student-discussion', classId, threadId],
    queryFn: async (): Promise<{ thread: DiscussionThread; replies: DiscussionReply[] }> => {
      try {
        return await apiFetch<{ thread: DiscussionThread; replies: DiscussionReply[] }>(
          `/api/v1/student/classes/${classId}/discussions/${threadId}`
        )
      } catch {
        const threads = MOCK_DISCUSSIONS[classId] ?? []
        const thread = threads.find((t) => t.id === threadId)
        if (!thread) throw new Error(`Thread ${threadId} not found`)
        const replies = MOCK_DISCUSSION_REPLIES[threadId] ?? []
        return { thread, replies }
      }
    },
    enabled: !!classId && !!threadId,
  })
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ classId, title, content, files }: { classId: string; title: string; content: string; files?: File[] }): Promise<DiscussionThread> => {
      try {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        if (files) { for (const file of files) formData.append('files[]', file) }
        return await apiFetch<DiscussionThread>(`/api/v1/student/classes/${classId}/discussions`, {
          method: 'POST',
          body: formData,
          headers: {},
        })
      } catch {
        const newThread: DiscussionThread = {
          id: `thread-${classId}-${Date.now()}`,
          classId,
          title,
          content,
          author: { id: 'current-user', name: 'Tôi', role: 'student' },
          createdAt: new Date().toISOString(),
          replyCount: 0,
          pinned: false,
          unread: false,
        }
        if (!MOCK_DISCUSSIONS[classId]) MOCK_DISCUSSIONS[classId] = []
        MOCK_DISCUSSIONS[classId].unshift(newThread)
        return newThread
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-discussions', variables.classId] })
    },
  })
}

export function useReplyDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ classId, threadId, content, files }: { classId: string; threadId: string; content: string; files?: File[] }): Promise<DiscussionReply> => {
      try {
        const formData = new FormData()
        formData.append('content', content)
        if (files) { for (const file of files) formData.append('files[]', file) }
        return await apiFetch<DiscussionReply>(`/api/v1/student/classes/${classId}/discussions/${threadId}/replies`, {
          method: 'POST',
          body: formData,
          headers: {},
        })
      } catch {
        const newReply: DiscussionReply = {
          id: `reply-${Date.now()}`,
          threadId,
          content,
          author: { id: 'current-user', name: 'Tôi', role: 'student' },
          createdAt: new Date().toISOString(),
          isOwn: true,
        }
        if (!MOCK_DISCUSSION_REPLIES[threadId]) MOCK_DISCUSSION_REPLIES[threadId] = []
        MOCK_DISCUSSION_REPLIES[threadId].push(newReply)
        // Update reply count
        const threads = MOCK_DISCUSSIONS[classId] ?? []
        const t = threads.find((th) => th.id === threadId)
        if (t) t.replyCount++
        return newReply
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-discussion', variables.classId, variables.threadId] })
    },
  })
}

export function useDeleteReply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ classId, threadId, replyId }: { classId: string; threadId: string; replyId: string }): Promise<void> => {
      try {
        return await apiFetch<void>(`/api/v1/student/classes/${classId}/discussions/${threadId}/replies/${replyId}`, {
          method: 'DELETE',
        })
      } catch {
        if (MOCK_DISCUSSION_REPLIES[threadId]) {
          const idx = MOCK_DISCUSSION_REPLIES[threadId].findIndex((r) => r.id === replyId)
          if (idx !== -1) MOCK_DISCUSSION_REPLIES[threadId].splice(idx, 1)
        }
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['student-discussion', variables.classId, variables.threadId] })
    },
  })
}

// ─── Results ────────────────────────────────────────────────────────────────

export function useGetMyClassResult(classId: string) {
  return useQuery({
    queryKey: ['student-class-result', classId],
    queryFn: async (): Promise<StudentClassResult> => {
      try {
        return await apiFetch<StudentClassResult>(`/api/v1/student/classes/${classId}/results`)
      } catch {
        return MOCK_CLASS_RESULTS[classId] ?? {
          contentProgress: 0,
          totalContent: 0,
          completedContent: 0,
          avgAssignmentScore: undefined,
          avgExamScore: undefined,
          assignments: [],
          exams: [],
        }
      }
    },
    enabled: !!classId,
  })
}

// ─── History / Notifications ────────────────────────────────────────────────

export function useGetAccessHistory(classId: string, dateRange?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['access-history', classId, dateRange],
    queryFn: async (): Promise<PaginatedResponse<AccessLog>> => {
      try {
        const params = new URLSearchParams()
        if (dateRange?.from) params.set('from', dateRange.from)
        if (dateRange?.to) params.set('to', dateRange.to)
        return await apiFetch<PaginatedResponse<AccessLog>>(`/api/v1/student/classes/${classId}/history?${params.toString()}`)
      } catch {
        let logs = MOCK_ACCESS_LOGS[classId] ?? []
        if (dateRange?.from) {
          const from = new Date(dateRange.from).getTime()
          logs = logs.filter((l) => new Date(l.timestamp).getTime() >= from)
        }
        if (dateRange?.to) {
          const to = new Date(dateRange.to).getTime()
          logs = logs.filter((l) => new Date(l.timestamp).getTime() <= to)
        }
        return paginate(logs)
      }
    },
    enabled: !!classId,
  })
}

export function useGetClassNotifications(classId: string) {
  return useQuery({
    queryKey: ['class-notifications', classId],
    queryFn: async (): Promise<ClassNotification[]> => {
      try {
        return await apiFetch<ClassNotification[]>(`/api/v1/student/classes/${classId}/notifications`)
      } catch {
        return MOCK_NOTIFICATIONS[classId] ?? []
      }
    },
    enabled: !!classId,
  })
}
