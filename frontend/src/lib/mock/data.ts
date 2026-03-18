// ====== CLASSES ======
export const mockClasses = [
  { id: 'lop-10a1', name: '10A1', grade: 10, homeroom: 'gv-001', studentCount: 38, subject: 'Toán-Lý-Hóa', room: 'P201', year: '2024-2025' },
  { id: 'lop-10a2', name: '10A2', grade: 10, homeroom: 'gv-002', studentCount: 36, subject: 'Toán-Lý-Hóa', room: 'P202', year: '2024-2025' },
  { id: 'lop-10a3', name: '10A3', grade: 10, homeroom: 'gv-007', studentCount: 37, subject: 'Văn-Sử-Địa', room: 'P203', year: '2024-2025' },
  { id: 'lop-10a4', name: '10A4', grade: 10, homeroom: 'gv-008', studentCount: 35, subject: 'Toán-Lý-Hóa', room: 'P204', year: '2024-2025' },
  { id: 'lop-10a5', name: '10A5', grade: 10, homeroom: 'gv-009', studentCount: 39, subject: 'Văn-Sử-Địa', room: 'P205', year: '2024-2025' },
  { id: 'lop-10a6', name: '10A6', grade: 10, homeroom: 'gv-010', studentCount: 36, subject: 'Toán-Lý-Hóa', room: 'P206', year: '2024-2025' },
  { id: 'lop-10a7', name: '10A7', grade: 10, homeroom: 'gv-011', studentCount: 37, subject: 'Sinh-Hóa-Địa', room: 'P207', year: '2024-2025' },
  { id: 'lop-10a8', name: '10A8', grade: 10, homeroom: 'gv-012', studentCount: 38, subject: 'Anh-Văn', room: 'P208', year: '2024-2025' },

  { id: 'lop-11a1', name: '11A1', grade: 11, homeroom: 'gv-003', studentCount: 40, subject: 'Toán-Lý-Hóa', room: 'P301', year: '2024-2025' },
  { id: 'lop-11a2', name: '11A2', grade: 11, homeroom: 'gv-004', studentCount: 37, subject: 'Văn-Sử-Địa', room: 'P302', year: '2024-2025' },
  { id: 'lop-11a3', name: '11A3', grade: 11, homeroom: 'gv-013', studentCount: 38, subject: 'Toán-Lý-Hóa', room: 'P303', year: '2024-2025' },
  { id: 'lop-11a4', name: '11A4', grade: 11, homeroom: 'gv-014', studentCount: 36, subject: 'Sinh-Hóa-Địa', room: 'P304', year: '2024-2025' },
  { id: 'lop-11a5', name: '11A5', grade: 11, homeroom: 'gv-015', studentCount: 39, subject: 'Văn-Sử-Địa', room: 'P305', year: '2024-2025' },
  { id: 'lop-11a6', name: '11A6', grade: 11, homeroom: 'gv-016', studentCount: 37, subject: 'Toán-Lý-Hóa', room: 'P306', year: '2024-2025' },
  { id: 'lop-11a7', name: '11A7', grade: 11, homeroom: 'gv-017', studentCount: 36, subject: 'Anh-Văn', room: 'P307', year: '2024-2025' },
  { id: 'lop-11a8', name: '11A8', grade: 11, homeroom: 'gv-018', studentCount: 38, subject: 'Toán-Lý-Hóa', room: 'P308', year: '2024-2025' },

  { id: 'lop-12a1', name: '12A1', grade: 12, homeroom: 'gv-005', studentCount: 39, subject: 'Toán-Lý-Hóa', room: 'P401', year: '2024-2025' },
  { id: 'lop-12a2', name: '12A2', grade: 12, homeroom: 'gv-006', studentCount: 35, subject: 'Văn-Sử-Địa', room: 'P402', year: '2024-2025' },
  { id: 'lop-12a3', name: '12A3', grade: 12, homeroom: 'gv-019', studentCount: 38, subject: 'Toán-Lý-Hóa', room: 'P403', year: '2024-2025' },
  { id: 'lop-12a4', name: '12A4', grade: 12, homeroom: 'gv-020', studentCount: 36, subject: 'Sinh-Hóa-Địa', room: 'P404', year: '2024-2025' },
  { id: 'lop-12a5', name: '12A5', grade: 12, homeroom: 'gv-021', studentCount: 37, subject: 'Văn-Sử-Địa', room: 'P405', year: '2024-2025' },
  { id: 'lop-12a6', name: '12A6', grade: 12, homeroom: 'gv-022', studentCount: 40, subject: 'Toán-Lý-Hóa', room: 'P406', year: '2024-2025' },
  { id: 'lop-12a7', name: '12A7', grade: 12, homeroom: 'gv-023', studentCount: 38, subject: 'Anh-Văn', room: 'P407', year: '2024-2025' },
  { id: 'lop-12a8', name: '12A8', grade: 12, homeroom: 'gv-024', studentCount: 36, subject: 'Toán-Lý-Hóa', room: 'P408', year: '2024-2025' },
]

// ====== TEACHERS ======
export const mockTeachers = [
  { id: 'gv-001', name: 'Nguyễn Thị Bích', subject: 'Toán', email: 'bich.nt@quochoc.edu.vn', phone: '0901234567', status: 'active', joinYear: 2010, homeroom: 'lop-10a1', avatar: null },
  { id: 'gv-002', name: 'Trần Văn Hùng', subject: 'Vật lý', email: 'hung.tv@quochoc.edu.vn', phone: '0901234568', status: 'active', joinYear: 2012, homeroom: 'lop-10a2', avatar: null },
  { id: 'gv-003', name: 'Lê Thị Lan', subject: 'Hóa học', email: 'lan.lt@quochoc.edu.vn', phone: '0901234569', status: 'active', joinYear: 2008, homeroom: 'lop-11a1', avatar: null },
  { id: 'gv-004', name: 'Phạm Văn Đức', subject: 'Ngữ văn', email: 'duc.pv@quochoc.edu.vn', phone: '0901234570', status: 'active', joinYear: 2015, homeroom: 'lop-11a2', avatar: null },
  { id: 'gv-005', name: 'Hoàng Thị Mai', subject: 'Lịch sử', email: 'mai.ht@quochoc.edu.vn', phone: '0901234571', status: 'active', joinYear: 2011, homeroom: 'lop-12a1', avatar: null },
  { id: 'gv-006', name: 'Vũ Văn Thành', subject: 'Địa lý', email: 'thanh.vv@quochoc.edu.vn', phone: '0901234572', status: 'active', joinYear: 2016, homeroom: 'lop-12a2', avatar: null },
  { id: 'gv-007', name: 'Đặng Thị Hoa', subject: 'Tiếng Anh', email: 'hoa.dt@quochoc.edu.vn', phone: '0901234573', status: 'active', joinYear: 2014, homeroom: 'lop-10a3', avatar: null },
  { id: 'gv-008', name: 'Bùi Văn Khoa', subject: 'Tin học', email: 'khoa.bv@quochoc.edu.vn', phone: '0901234574', status: 'active', joinYear: 2019, homeroom: 'lop-10a4', avatar: null },
  { id: 'gv-009', name: 'Ngô Thị Hương', subject: 'Sinh học', email: 'huong.nt@quochoc.edu.vn', phone: '0901234575', status: 'active', joinYear: 2013, homeroom: 'lop-10a5', avatar: null },
  { id: 'gv-010', name: 'Lý Văn Quang', subject: 'Toán', email: 'quang.lv@quochoc.edu.vn', phone: '0901234576', status: 'active', joinYear: 2017, homeroom: 'lop-10a6', avatar: null },
  { id: 'gv-011', name: 'Đinh Thị Thu', subject: 'Ngữ văn', email: 'thu.dt@quochoc.edu.vn', phone: '0901234577', status: 'active', joinYear: 2009, homeroom: 'lop-10a7', avatar: null },
  { id: 'gv-012', name: 'Hà Văn Long', subject: 'Vật lý', email: 'long.hv@quochoc.edu.vn', phone: '0901234578', status: 'inactive', joinYear: 2020, homeroom: 'lop-10a8', avatar: null },
  { id: 'gv-013', name: 'Trịnh Thị Nga', subject: 'Hóa học', email: 'nga.tt@quochoc.edu.vn', phone: '0901234579', status: 'active', joinYear: 2007, homeroom: 'lop-11a3', avatar: null },
  { id: 'gv-014', name: 'Cao Văn Minh', subject: 'Sinh học', email: 'minh.cv@quochoc.edu.vn', phone: '0901234580', status: 'active', joinYear: 2018, homeroom: 'lop-11a4', avatar: null },
  { id: 'gv-015', name: 'Đỗ Thị Phương', subject: 'Địa lý', email: 'phuong.dt@quochoc.edu.vn', phone: '0901234581', status: 'active', joinYear: 2012, homeroom: 'lop-11a5', avatar: null },
  { id: 'gv-016', name: 'Tô Văn Dũng', subject: 'Toán', email: 'dung.tv@quochoc.edu.vn', phone: '0901234582', status: 'active', joinYear: 2016, homeroom: 'lop-11a6', avatar: null },
  { id: 'gv-017', name: 'Phan Thị Liên', subject: 'Tiếng Anh', email: 'lien.pt@quochoc.edu.vn', phone: '0901234583', status: 'active', joinYear: 2015, homeroom: 'lop-11a7', avatar: null },
  { id: 'gv-018', name: 'Võ Văn Hiệp', subject: 'Lịch sử', email: 'hiep.vv@quochoc.edu.vn', phone: '0901234584', status: 'active', joinYear: 2010, homeroom: 'lop-11a8', avatar: null },
  { id: 'gv-019', name: 'Chu Thị Ngọc', subject: 'Ngữ văn', email: 'ngoc.ct@quochoc.edu.vn', phone: '0901234585', status: 'active', joinYear: 2014, homeroom: 'lop-12a3', avatar: null },
  { id: 'gv-020', name: 'Lâm Văn Tú', subject: 'Hóa học', email: 'tu.lv@quochoc.edu.vn', phone: '0901234586', status: 'active', joinYear: 2019, homeroom: 'lop-12a4', avatar: null },
  { id: 'gv-021', name: 'Kiều Thị Nhung', subject: 'Vật lý', email: 'nhung.kt@quochoc.edu.vn', phone: '0901234587', status: 'active', joinYear: 2011, homeroom: 'lop-12a5', avatar: null },
  { id: 'gv-022', name: 'Từ Văn Phúc', subject: 'Toán', email: 'phuc.tv@quochoc.edu.vn', phone: '0901234588', status: 'active', joinYear: 2008, homeroom: 'lop-12a6', avatar: null },
  { id: 'gv-023', name: 'Mạc Thị Yến', subject: 'Tiếng Anh', email: 'yen.mt@quochoc.edu.vn', phone: '0901234589', status: 'active', joinYear: 2017, homeroom: 'lop-12a7', avatar: null },
  { id: 'gv-024', name: 'Nông Văn Bảo', subject: 'Tin học', email: 'bao.nv@quochoc.edu.vn', phone: '0901234590', status: 'active', joinYear: 2020, homeroom: 'lop-12a8', avatar: null },
  { id: 'gv-025', name: 'Quách Thị Hằng', subject: 'Toán', email: 'hang.qt@quochoc.edu.vn', phone: '0901234591', status: 'active', joinYear: 2013, homeroom: null, avatar: null },
  { id: 'gv-026', name: 'Sầm Văn Cường', subject: 'Vật lý', email: 'cuong.sv@quochoc.edu.vn', phone: '0901234592', status: 'active', joinYear: 2015, homeroom: null, avatar: null },
  { id: 'gv-027', name: 'Tạ Thị Kim', subject: 'Hóa học', email: 'kim.tt@quochoc.edu.vn', phone: '0901234593', status: 'active', joinYear: 2012, homeroom: null, avatar: null },
  { id: 'gv-028', name: 'Ung Văn Thái', subject: 'Sinh học', email: 'thai.uv@quochoc.edu.vn', phone: '0901234594', status: 'active', joinYear: 2018, homeroom: null, avatar: null },
  { id: 'gv-029', name: 'Vi Thị Bảo', subject: 'Ngữ văn', email: 'bao.vt@quochoc.edu.vn', phone: '0901234595', status: 'inactive', joinYear: 2016, homeroom: null, avatar: null },
  { id: 'gv-030', name: 'Xa Văn Chiến', subject: 'Lịch sử', email: 'chien.xv@quochoc.edu.vn', phone: '0901234596', status: 'active', joinYear: 2009, homeroom: null, avatar: null },
  { id: 'gv-031', name: 'Ân Thị Dịu', subject: 'Địa lý', email: 'diu.at@quochoc.edu.vn', phone: '0901234597', status: 'active', joinYear: 2014, homeroom: null, avatar: null },
  { id: 'gv-032', name: 'Bạch Văn Duyên', subject: 'Tiếng Anh', email: 'duyen.bv@quochoc.edu.vn', phone: '0901234598', status: 'active', joinYear: 2017, homeroom: null, avatar: null },
  { id: 'gv-033', name: 'Cát Thị Em', subject: 'Tin học', email: 'em.ct@quochoc.edu.vn', phone: '0901234599', status: 'active', joinYear: 2021, homeroom: null, avatar: null },
  { id: 'gv-034', name: 'Dao Văn Phong', subject: 'Thể dục', email: 'phong.dv@quochoc.edu.vn', phone: '0901234600', status: 'active', joinYear: 2013, homeroom: null, avatar: null },
  { id: 'gv-035', name: 'Ếch Thị Giang', subject: 'Âm nhạc', email: 'giang.et@quochoc.edu.vn', phone: '0901234601', status: 'active', joinYear: 2016, homeroom: null, avatar: null },
  { id: 'gv-036', name: 'Giáp Văn Hải', subject: 'Mỹ thuật', email: 'hai.gv@quochoc.edu.vn', phone: '0901234602', status: 'active', joinYear: 2018, homeroom: null, avatar: null },
  { id: 'gv-037', name: 'Hứa Thị Hiền', subject: 'GDCD', email: 'hien.ht@quochoc.edu.vn', phone: '0901234603', status: 'active', joinYear: 2011, homeroom: null, avatar: null },
  { id: 'gv-038', name: 'Ích Văn Hiếu', subject: 'Toán', email: 'hieu.iv@quochoc.edu.vn', phone: '0901234604', status: 'active', joinYear: 2019, homeroom: null, avatar: null },
  { id: 'gv-039', name: 'Khúc Thị Hồng', subject: 'Ngữ văn', email: 'hong.kt@quochoc.edu.vn', phone: '0901234605', status: 'active', joinYear: 2010, homeroom: null, avatar: null },
  { id: 'gv-040', name: 'Lộc Văn Huân', subject: 'Vật lý', email: 'huan.lv@quochoc.edu.vn', phone: '0901234606', status: 'inactive', joinYear: 2015, homeroom: null, avatar: null },
  { id: 'gv-041', name: 'Mùi Thị Huyền', subject: 'Hóa học', email: 'huyen.mt@quochoc.edu.vn', phone: '0901234607', status: 'active', joinYear: 2012, homeroom: null, avatar: null },
  { id: 'gv-042', name: 'Nại Văn Hương', subject: 'Tiếng Anh', email: 'huong.nv@quochoc.edu.vn', phone: '0901234608', status: 'active', joinYear: 2017, homeroom: null, avatar: null },
  { id: 'gv-043', name: 'Ổn Thị Khanh', subject: 'Sinh học', email: 'khanh.ot@quochoc.edu.vn', phone: '0901234609', status: 'active', joinYear: 2014, homeroom: null, avatar: null },
  { id: 'gv-044', name: 'Phiêu Văn Khoa', subject: 'Lịch sử', email: 'khoa.pv@quochoc.edu.vn', phone: '0901234610', status: 'active', joinYear: 2009, homeroom: null, avatar: null },
  { id: 'gv-045', name: 'Quý Thị Lan', subject: 'Địa lý', email: 'lan.qt@quochoc.edu.vn', phone: '0901234611', status: 'active', joinYear: 2016, homeroom: null, avatar: null },
]

// ====== STUDENTS ======
const vietnameseFirstNames = ['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Phương', 'Giang', 'Hà', 'Hùng', 'Ích', 'Khánh', 'Lan', 'Minh', 'Nam', 'Oanh']
const vietnameseFamilyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý']
const middleNames = ['Văn', 'Thị', 'Đức', 'Thanh', 'Ngọc', 'Công']

export const mockStudents = Array.from({ length: 240 }, (_, i) => {
  const family = vietnameseFamilyNames[i % vietnameseFamilyNames.length]
  const middle = middleNames[i % middleNames.length]
  const first = vietnameseFirstNames[i % vietnameseFirstNames.length]
  const classId = mockClasses[i % mockClasses.length]?.id ?? 'cls-1'
  return {
    id: `hs-${String(i + 1).padStart(3, '0')}`,
    name: `${family} ${middle} ${first}`,
    classId,
    email: `hs${String(i + 1).padStart(3, '0')}@quochoc.edu.vn`,
    dob: `200${5 + (i % 5)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    status: i % 20 === 0 ? 'inactive' : 'active',
    conductScore: 70 + (i % 30),
    scholarshipLevel: i % 15 === 0 ? 'loai1' : i % 10 === 0 ? 'loai2' : null,
    avatar: null,
    phone: `09${String(10000000 + i)}`,
  }
})

// ====== ATTENDANCE ======
// Confidence distribution để cover tất cả test cases:
// i 0-19: high confidence (0.88 - 0.99) → ConfidenceBadge xanh "Cao"
// i 20-26: medium confidence (0.65 - 0.84) → ConfidenceBadge vàng "Trung bình"
// i 27-34: low confidence (0.40 - 0.64) → ConfidenceBadge đỏ "Thấp"
// i 35-39: absent (null confidence)
function _getConfidence(i: number): number | null {
  if (i >= 35) return null
  if (i < 20) return (88 + (i * 3) % 12) / 100  // 0.88 - 0.99 (high, >= 0.85)
  if (i < 27) return (65 + ((i - 20) * 3) % 20) / 100  // 0.65 - 0.84 (medium)
  return (40 + ((i - 27) * 4) % 25) / 100  // 0.40 - 0.64 (low, < 0.65)
}

export const mockAttendanceToday = mockStudents.slice(0, 40).map((s, i) => ({
  id: `att-${i}`,
  studentId: s.id,
  studentName: s.name,
  classId: 'lop-10a1',
  date: new Date().toISOString().split('T')[0],
  checkInTime: i < 35 ? `0${6 + Math.floor(i / 15)}:${String((i * 7) % 60).padStart(2, '0')}` : null,
  status: i < 35 ? 'present' : 'absent',
  confidence: _getConfidence(i),
  method: i < 30 ? 'face_recognition' : 'manual',
  cameraId: 'cam-001',
}))

// ====== ASSIGNMENTS ======
export const mockAssignments = [
  { id: 'bt-001', title: 'Bài tập Đạo hàm - Chương 1', classId: 'lop-12a1', teacherId: 'gv-001', subject: 'Toán', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), maxScore: 10, submittedCount: 28, totalStudents: 39, status: 'active' },
  { id: 'bt-002', title: 'Phân tích tác phẩm Truyện Kiều', classId: 'lop-12a2', teacherId: 'gv-004', subject: 'Ngữ văn', dueDate: new Date(Date.now() + 86400000).toISOString(), maxScore: 10, submittedCount: 20, totalStudents: 35, status: 'active' },
  { id: 'bt-003', title: 'Bài tập Điện xoay chiều', classId: 'lop-11a1', teacherId: 'gv-002', subject: 'Vật lý', dueDate: new Date(Date.now() - 86400000).toISOString(), maxScore: 10, submittedCount: 40, totalStudents: 40, status: 'grading' },
  { id: 'bt-004', title: 'Essay: My future career', classId: 'lop-10a1', teacherId: 'gv-007', subject: 'Tiếng Anh', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), maxScore: 10, submittedCount: 10, totalStudents: 38, status: 'active' },
  { id: 'bt-005', title: 'Phân tích phản ứng hóa hữu cơ', classId: 'lop-11a1', teacherId: 'gv-003', subject: 'Hóa học', dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), maxScore: 10, submittedCount: 5, totalStudents: 40, status: 'active' },
  { id: 'bt-006', title: 'Bài tập Lượng giác', classId: 'lop-10a1', teacherId: 'gv-001', subject: 'Toán', dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), maxScore: 10, submittedCount: 0, totalStudents: 38, status: 'active' },
]

// ====== QUESTIONS (Ngân hàng câu hỏi) ======
export const mockQuestions = [
  { id: 'q-001', content: 'Tính đạo hàm của f(x) = x² + 3x + 2', subject: 'Toán', chapter: 'Đạo hàm', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. 2x+3', 'B. x+3', 'C. 2x', 'D. 3x+2'], correctAnswer: 'A' },
  { id: 'q-002', content: 'Phương trình bậc 2 ax²+bx+c=0 có nghiệm khi Δ bằng bao nhiêu?', subject: 'Toán', chapter: 'Phương trình', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. Δ≥0', 'B. Δ>0', 'C. Δ=0', 'D. Δ<0'], correctAnswer: 'A' },
  { id: 'q-003', content: 'Tìm giới hạn của hàm số f(x) = (x²-1)/(x-1) khi x→1', subject: 'Toán', chapter: 'Giới hạn', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. 2', 'B. 1', 'C. 0', 'D. ∞'], correctAnswer: 'A' },
  { id: 'q-004', content: 'Nguyên hàm của f(x) = 2x là gì?', subject: 'Toán', chapter: 'Nguyên hàm', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. x²+C', 'B. 2x²+C', 'C. x+C', 'D. 2+C'], correctAnswer: 'A' },
  { id: 'q-005', content: 'Tính tích phân ∫₀¹ x dx bằng bao nhiêu?', subject: 'Toán', chapter: 'Tích phân', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. 1/2', 'B. 1', 'C. 2', 'D. 0'], correctAnswer: 'A' },
  { id: 'q-006', content: 'Ma trận vuông cấp n có định thức bằng 0 gọi là gì?', subject: 'Toán', chapter: 'Ma trận', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. Ma trận suy biến', 'B. Ma trận đơn vị', 'C. Ma trận chéo', 'D. Ma trận đối xứng'], correctAnswer: 'A' },
  { id: 'q-007', content: 'Giải bất phương trình 2x - 3 > 5, tìm x?', subject: 'Toán', chapter: 'Bất phương trình', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. x>4', 'B. x>1', 'C. x<4', 'D. x<1'], correctAnswer: 'A' },
  { id: 'q-008', content: 'Chu kỳ của hàm số y = sin(2x) là bao nhiêu?', subject: 'Toán', chapter: 'Hàm lượng giác', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. π', 'B. 2π', 'C. π/2', 'D. 4π'], correctAnswer: 'A' },
  { id: 'q-009', content: 'Số hoán vị của n phần tử khác nhau là gì?', subject: 'Toán', chapter: 'Tổ hợp', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. n!', 'B. n²', 'C. 2ⁿ', 'D. nⁿ'], correctAnswer: 'A' },
  { id: 'q-010', content: 'Định lý Pythagore: Trong tam giác vuông ABC vuông tại A thì công thức nào đúng?', subject: 'Toán', chapter: 'Hình học', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. BC²=AB²+AC²', 'B. AB²=BC²+AC²', 'C. AC²=AB²+BC²', 'D. Tất cả sai'], correctAnswer: 'A' },
  { id: 'q-011', content: 'Logarithm cơ số a của x bằng y, điều đó có nghĩa là gì?', subject: 'Toán', chapter: 'Hàm logarithm', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. aʸ=x', 'B. xᵃ=y', 'C. yᵃ=x', 'D. aˣ=y'], correctAnswer: 'A' },
  { id: 'q-012', content: 'Số phức z = a + bi có modulus (môđun) bằng gì?', subject: 'Toán', chapter: 'Số phức', level: 'van-dung', type: 'trac-nghiem', answers: ['A. √(a²+b²)', 'B. a+b', 'C. a²+b²', 'D. √(a-b)'], correctAnswer: 'A' },
  { id: 'q-013', content: 'Phân tích cảm hứng yêu nước trong bài thơ "Nam quốc sơn hà" của Lý Thường Kiệt', subject: 'Ngữ văn', chapter: 'Văn học trung đại', level: 'van-dung', type: 'tu-luan', answers: [], correctAnswer: '' },
  { id: 'q-014', content: 'Nêu ý nghĩa biểu tượng của hình ảnh "sóng" trong thơ Xuân Quỳnh', subject: 'Ngữ văn', chapter: 'Thơ hiện đại', level: 'van-dung', type: 'tu-luan', answers: [], correctAnswer: '' },
  { id: 'q-015', content: 'Từ nào sau đây là từ láy hoàn toàn?', subject: 'Ngữ văn', chapter: 'Từ vựng', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. Lung linh', 'B. Bàn bạc', 'C. Học hỏi', 'D. Sách vở'], correctAnswer: 'A' },
  { id: 'q-016', content: 'Biện pháp tu từ "điệp ngữ" là gì?', subject: 'Ngữ văn', chapter: 'Tu từ', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. Lặp lại từ/cụm từ có chủ đích', 'B. So sánh hai sự vật', 'C. Nhân hóa vật vô tri', 'D. Phóng đại sự vật'], correctAnswer: 'A' },
  { id: 'q-017', content: 'Tác giả của "Truyện Kiều" là ai?', subject: 'Ngữ văn', chapter: 'Truyện Kiều', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. Nguyễn Du', 'B. Nguyễn Trãi', 'C. Hồ Xuân Hương', 'D. Đoàn Thị Điểm'], correctAnswer: 'A' },
  { id: 'q-018', content: 'Định luật Ohm phát biểu gì về mối quan hệ giữa điện áp U, dòng điện I và điện trở R?', subject: 'Vật lý', chapter: 'Điện học', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. U = IR', 'B. I = UR', 'C. R = UI', 'D. U = I/R'], correctAnswer: 'A' },
  { id: 'q-019', content: 'Tốc độ ánh sáng trong chân không xấp xỉ bằng bao nhiêu m/s?', subject: 'Vật lý', chapter: 'Quang học', level: 'nhan-biet', type: 'trac-nghiem', answers: ['A. 3×10⁸ m/s', 'B. 3×10⁶ m/s', 'C. 3×10¹⁰ m/s', 'D. 3×10⁴ m/s'], correctAnswer: 'A' },
  { id: 'q-020', content: 'Lực Lorentz tác dụng lên hạt điện tích q chuyển động vận tốc v trong từ trường B là gì?', subject: 'Vật lý', chapter: 'Từ trường', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. F = qvB sinα', 'B. F = qvB cosα', 'C. F = qvB', 'D. F = qv/B'], correctAnswer: 'A' },
  { id: 'q-021', content: 'Năng lượng nghỉ của vật có khối lượng m theo công thức Einstein là gì?', subject: 'Vật lý', chapter: 'Hạt nhân', level: 'thong-hieu', type: 'trac-nghiem', answers: ['A. E = mc²', 'B. E = mv²', 'C. E = m²c', 'D. E = mc/2'], correctAnswer: 'A' },
  { id: 'q-022', content: 'Tần số dao động riêng của mạch LC là gì?', subject: 'Vật lý', chapter: 'Điện từ', level: 'van-dung', type: 'trac-nghiem', answers: ['A. f = 1/(2π√LC)', 'B. f = 2π√LC', 'C. f = √LC/2π', 'D. f = 2π/√LC'], correctAnswer: 'A' },
]

// ====== EXAMS ======
export const mockExams = [
  { id: 'thi-001', title: 'Kiểm tra Giữa kỳ 1 - Toán 12', classId: 'lop-12a1', teacherId: 'gv-001', subject: 'Toán', scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(), duration: 90, totalQuestions: 40, status: 'upcoming' },
  { id: 'thi-002', title: 'Kiểm tra 15 phút - Vật lý 11', classId: 'lop-11a1', teacherId: 'gv-002', subject: 'Vật lý', scheduledAt: new Date(Date.now() - 86400000 * 2).toISOString(), duration: 15, totalQuestions: 15, status: 'completed', avgScore: 7.8 },
  { id: 'thi-003', title: 'Kiểm tra Cuối kỳ 1 - Ngữ văn 12', classId: 'lop-12a2', teacherId: 'gv-004', subject: 'Ngữ văn', scheduledAt: new Date(Date.now() + 86400000 * 14).toISOString(), duration: 120, totalQuestions: 5, status: 'upcoming' },
  { id: 'thi-004', title: 'Kiểm tra 1 tiết - Hóa học 11', classId: 'lop-11a1', teacherId: 'gv-003', subject: 'Hóa học', scheduledAt: new Date(Date.now() + 86400000 * 7).toISOString(), duration: 45, totalQuestions: 30, status: 'upcoming' },
  { id: 'thi-005', title: 'Kiểm tra Giữa kỳ - Tiếng Anh 10', classId: 'lop-10a1', teacherId: 'gv-007', subject: 'Tiếng Anh', scheduledAt: new Date(Date.now() - 86400000 * 5).toISOString(), duration: 60, totalQuestions: 50, status: 'completed', avgScore: 8.1 },
]

// ====== BOOKS ======
export const mockBooks = [
  { id: 'book-001', title: 'Giải tích 1', author: 'Nguyễn Đình Trí', isbn: '9786040234567', category: 'Toán học', available: 8, total: 10, coverUrl: null },
  { id: 'book-002', title: 'Vật lý đại cương', author: 'Lương Duyên Bình', isbn: '9786040234568', category: 'Vật lý', available: 5, total: 10, coverUrl: null },
  { id: 'book-003', title: 'Lịch sử Việt Nam', author: 'Nhiều tác giả', isbn: '9786040234569', category: 'Lịch sử', available: 12, total: 15, coverUrl: null },
  { id: 'book-004', title: 'Tiếng Anh B1', author: 'Cambridge', isbn: '9786040234570', category: 'Ngoại ngữ', available: 0, total: 8, coverUrl: null },
  { id: 'book-005', title: 'Hóa học hữu cơ', author: 'Trần Quốc Sơn', isbn: '9786040234571', category: 'Hóa học', available: 6, total: 8, coverUrl: null },
  { id: 'book-006', title: 'Sinh học đại cương', author: 'Nguyễn Thành Đạt', isbn: '9786040234572', category: 'Sinh học', available: 4, total: 7, coverUrl: null },
  { id: 'book-007', title: 'Địa lý kinh tế', author: 'Lê Thông', isbn: '9786040234573', category: 'Địa lý', available: 9, total: 12, coverUrl: null },
  { id: 'book-008', title: 'Văn học Việt Nam hiện đại', author: 'Nhiều tác giả', isbn: '9786040234574', category: 'Văn học', available: 7, total: 10, coverUrl: null },
  { id: 'book-009', title: 'Ngữ pháp tiếng Anh', author: 'Murphy Raymond', isbn: '9786040234575', category: 'Ngoại ngữ', available: 3, total: 8, coverUrl: null },
  { id: 'book-010', title: 'Toán học tổ hợp', author: 'Đinh Văn Khương', isbn: '9786040234576', category: 'Toán học', available: 5, total: 6, coverUrl: null },
  { id: 'book-011', title: 'Vật lý hạt nhân', author: 'Nguyễn Xuân Hãn', isbn: '9786040234577', category: 'Vật lý', available: 2, total: 5, coverUrl: null },
  { id: 'book-012', title: 'Lịch sử thế giới cận đại', author: 'Vũ Dương Ninh', isbn: '9786040234578', category: 'Lịch sử', available: 8, total: 10, coverUrl: null },
  { id: 'book-013', title: 'Hóa học vô cơ', author: 'Hoàng Nhâm', isbn: '9786040234579', category: 'Hóa học', available: 0, total: 6, coverUrl: null },
  { id: 'book-014', title: 'Di truyền học', author: 'Phạm Thành Hổ', isbn: '9786040234580', category: 'Sinh học', available: 6, total: 8, coverUrl: null },
  { id: 'book-015', title: 'Địa lý tự nhiên Việt Nam', author: 'Đặng Duy Lợi', isbn: '9786040234581', category: 'Địa lý', available: 10, total: 10, coverUrl: null },
  { id: 'book-016', title: 'Truyện Kiều', author: 'Nguyễn Du', isbn: '9786040234582', category: 'Văn học', available: 15, total: 20, coverUrl: null },
  { id: 'book-017', title: 'Lập trình Python cơ bản', author: 'Trần Đan Thư', isbn: '9786040234583', category: 'Tin học', available: 4, total: 8, coverUrl: null },
  { id: 'book-018', title: 'Cơ học lý thuyết', author: 'Đỗ Sanh', isbn: '9786040234584', category: 'Vật lý', available: 3, total: 5, coverUrl: null },
  { id: 'book-019', title: 'Toán giải tích 2', author: 'Nguyễn Đình Trí', isbn: '9786040234585', category: 'Toán học', available: 7, total: 10, coverUrl: null },
  { id: 'book-020', title: 'Văn học cổ điển Việt Nam', author: 'Nguyễn Lộc', isbn: '9786040234586', category: 'Văn học', available: 11, total: 15, coverUrl: null },
  { id: 'book-021', title: 'TOEIC 900+', author: 'Kim Seung Hyun', isbn: '9786040234587', category: 'Ngoại ngữ', available: 2, total: 6, coverUrl: null },
  { id: 'book-022', title: 'Đại số tuyến tính', author: 'Nguyễn Hữu Anh', isbn: '9786040234588', category: 'Toán học', available: 5, total: 8, coverUrl: null },
  { id: 'book-023', title: 'Nhiệt động lực học', author: 'Phan Văn Thích', isbn: '9786040234589', category: 'Vật lý', available: 4, total: 6, coverUrl: null },
  { id: 'book-024', title: 'Lịch sử Đảng Cộng sản Việt Nam', author: 'Ban Tuyên giáo TW', isbn: '9786040234590', category: 'Lịch sử', available: 14, total: 15, coverUrl: null },
  { id: 'book-025', title: 'Hóa học phân tích', author: 'Nguyễn Tinh Dung', isbn: '9786040234591', category: 'Hóa học', available: 3, total: 7, coverUrl: null },
  { id: 'book-026', title: 'Miễn dịch học', author: 'Nguyễn Ngọc Lanh', isbn: '9786040234592', category: 'Sinh học', available: 5, total: 6, coverUrl: null },
  { id: 'book-027', title: 'Khí hậu học', author: 'Nguyễn Khanh Vân', isbn: '9786040234593', category: 'Địa lý', available: 7, total: 8, coverUrl: null },
  { id: 'book-028', title: 'Thơ Tố Hữu tuyển tập', author: 'Tố Hữu', isbn: '9786040234594', category: 'Văn học', available: 9, total: 12, coverUrl: null },
  { id: 'book-029', title: 'JavaScript nâng cao', author: 'Marijn Haverbeke', isbn: '9786040234595', category: 'Tin học', available: 3, total: 5, coverUrl: null },
  { id: 'book-030', title: 'Quang học', author: 'Đinh Thị Thanh Bình', isbn: '9786040234596', category: 'Vật lý', available: 4, total: 6, coverUrl: null },
  { id: 'book-031', title: 'Xác suất thống kê', author: 'Tống Đình Quỳ', isbn: '9786040234597', category: 'Toán học', available: 6, total: 9, coverUrl: null },
  { id: 'book-032', title: 'Kinh tế học đại cương', author: 'Trần Chí Thành', isbn: '9786040234598', category: 'Kinh tế', available: 8, total: 10, coverUrl: null },
  { id: 'book-033', title: 'Tâm lý học đại cương', author: 'Nguyễn Quang Uẩn', isbn: '9786040234599', category: 'Tâm lý', available: 5, total: 8, coverUrl: null },
  { id: 'book-034', title: 'Pháp luật đại cương', author: 'Lê Minh Tâm', isbn: '9786040234600', category: 'Pháp luật', available: 6, total: 10, coverUrl: null },
  { id: 'book-035', title: 'Triết học Mác-Lênin', author: 'Nhiều tác giả', isbn: '9786040234601', category: 'Triết học', available: 10, total: 15, coverUrl: null },
  { id: 'book-036', title: 'Điện tử học', author: 'Ngô Diên Tập', isbn: '9786040234602', category: 'Vật lý', available: 2, total: 4, coverUrl: null },
  { id: 'book-037', title: 'Hóa học môi trường', author: 'Lê Huy Bá', isbn: '9786040234603', category: 'Hóa học', available: 4, total: 6, coverUrl: null },
  { id: 'book-038', title: 'Sinh thái học', author: 'Vũ Trung Tạng', isbn: '9786040234604', category: 'Sinh học', available: 5, total: 7, coverUrl: null },
  { id: 'book-039', title: 'Địa chất học', author: 'Tống Duy Thanh', isbn: '9786040234605', category: 'Địa lý', available: 6, total: 8, coverUrl: null },
  { id: 'book-040', title: 'Từ điển Tiếng Việt', author: 'Hoàng Phê', isbn: '9786040234606', category: 'Ngôn ngữ', available: 3, total: 5, coverUrl: null },
  { id: 'book-041', title: 'Toán rời rạc', author: 'Nguyễn Đức Nghĩa', isbn: '9786040234607', category: 'Toán học', available: 7, total: 10, coverUrl: null },
  { id: 'book-042', title: 'Thiết kế web', author: 'Vũ Hữu Tiến', isbn: '9786040234608', category: 'Tin học', available: 4, total: 7, coverUrl: null },
  { id: 'book-043', title: 'Cơ sở văn hóa Việt Nam', author: 'Trần Ngọc Thêm', isbn: '9786040234609', category: 'Văn hóa', available: 6, total: 8, coverUrl: null },
  { id: 'book-044', title: 'Tư tưởng Hồ Chí Minh', author: 'Mạch Quang Thắng', isbn: '9786040234610', category: 'Triết học', available: 9, total: 12, coverUrl: null },
  { id: 'book-045', title: 'Bài tập Vật lý nâng cao', author: 'Lê Đình', isbn: '9786040234611', category: 'Vật lý', available: 3, total: 5, coverUrl: null },
]

// ====== CAMERAS ======
export const mockCameras = [
  { id: 'cam-001', name: 'Cổng chính - Vào', location: 'Cổng trước', ip: '192.168.1.101', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-002', name: 'Cổng chính - Ra', location: 'Cổng trước', ip: '192.168.1.102', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-003', name: 'Hành lang A - Tầng 1', location: 'Tòa A', ip: '192.168.1.103', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-004', name: 'Thư viện', location: 'Thư viện', ip: '192.168.1.104', status: 'offline', lastSeen: new Date(Date.now() - 3600000).toISOString() },
  { id: 'cam-005', name: 'Sân trường', location: 'Sân chính', ip: '192.168.1.105', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-006', name: 'Hành lang B - Tầng 2', location: 'Tòa B', ip: '192.168.1.106', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-007', name: 'Phòng máy tính', location: 'P101', ip: '192.168.1.107', status: 'error', lastSeen: new Date(Date.now() - 7200000).toISOString() },
  { id: 'cam-008', name: 'Cổng phụ', location: 'Cổng sau', ip: '192.168.1.108', status: 'online', lastSeen: new Date().toISOString() },
]

// ====== NOTIFICATIONS ======
export const mockNotifications = [
  { id: 'noti-001', title: 'Điểm danh cần xác nhận', body: '12 học sinh lớp 10A1 chưa được xác nhận', type: 'attendance', read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'noti-002', title: 'Bài nộp mới', body: 'Nguyễn Văn An đã nộp bài Đạo hàm Chương 1', type: 'assignment', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'noti-003', title: 'Sách quá hạn', body: '3 học sinh chưa trả sách đã quá hạn 5 ngày', type: 'library', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'noti-004', title: 'Kỳ thi sắp tới', body: 'Kiểm tra Giữa kỳ - Toán 12 diễn ra sau 3 ngày', type: 'exam', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'noti-005', title: 'Học sinh vắng không phép', body: '5 học sinh vắng không có lý do hôm nay', type: 'attendance', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
]

// ====== KPI DATA ======
export const mockAdminKPIs = {
  todayAttendance: { present: 842, total: 960, percentage: 87.7 },
  activeTeachers: { count: 43, total: 47 },
  activeClasses: { count: 24, withLesson: 18 },
  libraryBorrows: { today: 12, overdue: 5 },
  alerts: [
    { id: 'alert-1', level: 'error', message: '5 học sinh vắng không phép hôm nay', link: '/admin/diem-danh' },
    { id: 'alert-2', level: 'warning', message: '3 sách thư viện quá hạn chưa trả', link: '/admin/thu-vien' },
    { id: 'alert-3', level: 'info', message: 'Kỳ thi Toán 12 diễn ra sau 3 ngày', link: '/admin/thi' },
  ],
}
