import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  LibraryBook,
  BookCopy,
  LibraryMember,
  BorrowRecord,
  LibraryCategory,
  LibraryLocation,
  BorrowRule,
  NewsArticle,
  LibraryStats,
  PaginatedResponse,
  PortalContent,
  PortalNewsItem,
  EDocument,
  LibraryEmailSettings,
  LibraryLanguageSettings,
  ClassificationSystem,
  ActivityLog,
  PurchaseOrder,
  WarehouseLog,
  InventorySession,
  InventoryItem,
  PendingShelvingItem,
  AccessionItem,
} from '../types/library.types'

// ─────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────

// ── Categories Mock ──────────────────────────────────────────────
const MOCK_CATEGORIES: LibraryCategory[] = [
  { id: 'cat-1', name: 'Giáo trình', code: 'GT', description: 'Giáo trình, tài liệu học tập chính thức', bookCount: 124 },
  { id: 'cat-2', name: 'Tham khảo', code: 'TK', description: 'Sách tham khảo, nâng cao', bookCount: 87 },
  { id: 'cat-3', name: 'Tiểu thuyết', code: 'TT', description: 'Tiểu thuyết văn học trong nước và quốc tế', bookCount: 65 },
  { id: 'cat-4', name: 'Kỹ thuật', code: 'KT', description: 'Sách kỹ thuật công nghệ', bookCount: 93 },
  { id: 'cat-5', name: 'Khoa học', code: 'KH', description: 'Khoa học tự nhiên và xã hội', bookCount: 72 },
  { id: 'cat-6', name: 'Ngoại ngữ', code: 'NN', description: 'Tài liệu học ngoại ngữ', bookCount: 58 },
  { id: 'cat-7', name: 'Lịch sử', code: 'LS', description: 'Sách lịch sử, văn hóa', bookCount: 44 },
  { id: 'cat-8', name: 'Toán học', code: 'TH', description: 'Toán học đại cương và nâng cao', bookCount: 61 },
  { id: 'cat-9', name: 'Kinh tế', code: 'KE', description: 'Kinh tế học, quản trị kinh doanh', bookCount: 55 },
  { id: 'cat-10', name: 'Y học', code: 'YH', description: 'Y học, dược học, sức khỏe', bookCount: 38 },
]

// ── Locations Mock ───────────────────────────────────────────────
const MOCK_LOCATIONS: LibraryLocation[] = [
  { id: 'loc-1', name: 'Kho A – Tầng 1', code: 'KA1', floor: 'Tầng 1', description: 'Giáo trình và tài liệu học tập' },
  { id: 'loc-2', name: 'Kho B – Tầng 1', code: 'KB1', floor: 'Tầng 1', description: 'Sách tham khảo kỹ thuật' },
  { id: 'loc-3', name: 'Kho C – Tầng 2', code: 'KC2', floor: 'Tầng 2', description: 'Tiểu thuyết và văn học' },
  { id: 'loc-4', name: 'Kho D – Tầng 2', code: 'KD2', floor: 'Tầng 2', description: 'Khoa học tự nhiên' },
  { id: 'loc-5', name: 'Kho E – Tầng 3', code: 'KE3', floor: 'Tầng 3', description: 'Tài liệu ngoại ngữ' },
  { id: 'loc-6', name: 'Phòng đọc', code: 'PD', floor: 'Tầng 1', description: 'Sách để đọc tại chỗ' },
  { id: 'loc-7', name: 'Kho lưu trữ', code: 'KLT', floor: 'Tầng B1', description: 'Tài liệu lưu trữ dài hạn' },
]

// ── Borrow Rules Mock ────────────────────────────────────────────
const MOCK_BORROW_RULES: BorrowRule[] = [
  { id: 'rule-1', memberType: 'student', maxBooks: 5, loanDays: 14, finePerDay: 1000, renewalAllowed: true, maxRenewals: 2 },
  { id: 'rule-2', memberType: 'teacher', maxBooks: 10, loanDays: 30, finePerDay: 500, renewalAllowed: true, maxRenewals: 3 },
  { id: 'rule-3', memberType: 'staff', maxBooks: 7, loanDays: 21, finePerDay: 1000, renewalAllowed: true, maxRenewals: 2 },
]

// ── Books Mock ───────────────────────────────────────────────────
const MOCK_BOOKS: LibraryBook[] = [
  { id: 'book-001', isbn: '978-604-1-12345-1', title: 'Lập trình Python cơ bản', author: 'Nguyễn Văn An', publisher: 'NXB Giáo dục', publishYear: 2022, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'Giới thiệu lập trình Python từ cơ bản đến nâng cao', coverUrl: undefined, totalCopies: 8, availableCopies: 5, status: 'available' },
  { id: 'book-002', isbn: '978-604-1-22345-2', title: 'Toán cao cấp A1', author: 'Trần Thị Bình', publisher: 'NXB ĐHQG', publishYear: 2021, categoryId: 'cat-8', categoryName: 'Toán học', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Giải tích, đại số tuyến tính cho sinh viên năm nhất', coverUrl: undefined, totalCopies: 15, availableCopies: 3, status: 'available' },
  { id: 'book-003', isbn: '978-604-1-33345-3', title: 'Kinh tế vĩ mô', author: 'Lê Minh Châu', publisher: 'NXB Kinh tế', publishYear: 2023, categoryId: 'cat-9', categoryName: 'Kinh tế', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Giáo trình kinh tế vĩ mô cơ bản', coverUrl: undefined, totalCopies: 10, availableCopies: 7, status: 'available' },
  { id: 'book-004', isbn: '978-604-1-44345-4', title: 'Vật lý đại cương', author: 'Phạm Đức Duy', publisher: 'NXB Giáo dục', publishYear: 2020, categoryId: 'cat-5', categoryName: 'Khoa học', locationId: 'loc-4', locationName: 'Kho D – Tầng 2', description: 'Vật lý cơ học, nhiệt học, điện từ học', coverUrl: undefined, totalCopies: 12, availableCopies: 0, status: 'unavailable' },
  { id: 'book-005', isbn: '978-604-1-55345-5', title: 'Tiếng Anh chuyên ngành IT', author: 'Hoàng Thu Hà', publisher: 'NXB ĐHQG', publishYear: 2022, categoryId: 'cat-6', categoryName: 'Ngoại ngữ', locationId: 'loc-5', locationName: 'Kho E – Tầng 3', description: 'English for Information Technology students', coverUrl: undefined, totalCopies: 6, availableCopies: 4, status: 'available' },
  { id: 'book-006', isbn: '978-604-1-66345-6', title: 'Cơ sở dữ liệu', author: 'Vũ Quang Minh', publisher: 'NXB Giáo dục', publishYear: 2021, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'Thiết kế và quản trị cơ sở dữ liệu quan hệ', coverUrl: undefined, totalCopies: 9, availableCopies: 6, status: 'available' },
  { id: 'book-007', isbn: '978-604-1-77345-7', title: 'Mạng máy tính', author: 'Đỗ Hải Nam', publisher: 'NXB Khoa học', publishYear: 2022, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'Kiến trúc mạng, giao thức TCP/IP', coverUrl: undefined, totalCopies: 7, availableCopies: 2, status: 'available' },
  { id: 'book-008', isbn: '978-604-1-88345-8', title: 'Triết học Mác-Lênin', author: 'Bùi Lan Anh', publisher: 'NXB Chính trị', publishYear: 2019, categoryId: 'cat-1', categoryName: 'Giáo trình', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Giáo trình triết học bắt buộc', coverUrl: undefined, totalCopies: 20, availableCopies: 14, status: 'available' },
  { id: 'book-009', isbn: '978-604-1-99345-9', title: 'Lịch sử Đảng Cộng sản Việt Nam', author: 'Ngô Sơn Hải', publisher: 'NXB Chính trị', publishYear: 2020, categoryId: 'cat-7', categoryName: 'Lịch sử', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Lịch sử hình thành và phát triển của Đảng', coverUrl: undefined, totalCopies: 18, availableCopies: 10, status: 'available' },
  { id: 'book-010', isbn: '978-604-2-11345-0', title: 'Xác suất thống kê', author: 'Mai Thị Hương', publisher: 'NXB ĐHQG', publishYear: 2021, categoryId: 'cat-8', categoryName: 'Toán học', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Xác suất, thống kê toán cho kỹ thuật', coverUrl: undefined, totalCopies: 11, availableCopies: 8, status: 'available' },
  { id: 'book-011', isbn: '978-604-2-22345-1', title: 'JavaScript và React', author: 'Nguyễn Tuấn Anh', publisher: 'NXB Khoa học', publishYear: 2023, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'Lập trình web hiện đại với React', coverUrl: undefined, totalCopies: 5, availableCopies: 1, status: 'available' },
  { id: 'book-012', isbn: '978-604-2-33345-2', title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', publisher: 'NXB Văn học', publishYear: 2018, categoryId: 'cat-3', categoryName: 'Tiểu thuyết', locationId: 'loc-3', locationName: 'Kho C – Tầng 2', description: 'Truyện thiếu nhi kinh điển của văn học Việt Nam', coverUrl: undefined, totalCopies: 6, availableCopies: 5, status: 'available' },
  { id: 'book-013', isbn: '978-604-2-44345-3', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', publisher: 'NXB Tổng hợp TP.HCM', publishYear: 2019, categoryId: 'cat-2', categoryName: 'Tham khảo', locationId: 'loc-3', locationName: 'Kho C – Tầng 2', description: 'How to Win Friends and Influence People', coverUrl: undefined, totalCopies: 8, availableCopies: 3, status: 'available' },
  { id: 'book-014', isbn: '978-604-2-55345-4', title: 'Hệ điều hành Linux', author: 'Trần Quốc Bảo', publisher: 'NXB Khoa học', publishYear: 2022, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'Quản trị hệ thống Linux nâng cao', coverUrl: undefined, totalCopies: 4, availableCopies: 0, status: 'unavailable' },
  { id: 'book-015', isbn: '978-604-2-66345-5', title: 'Kỹ thuật lập trình C++', author: 'Lê Thanh Sơn', publisher: 'NXB Giáo dục', publishYear: 2020, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'C++ từ cơ bản đến lập trình hướng đối tượng', coverUrl: undefined, totalCopies: 10, availableCopies: 7, status: 'available' },
  { id: 'book-016', isbn: '978-604-2-77345-6', title: 'Quản trị kinh doanh', author: 'Phạm Thị Linh', publisher: 'NXB Kinh tế', publishYear: 2021, categoryId: 'cat-9', categoryName: 'Kinh tế', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Nguyên lý quản trị doanh nghiệp', coverUrl: undefined, totalCopies: 8, availableCopies: 5, status: 'available' },
  { id: 'book-017', isbn: '978-604-2-88345-7', title: 'Sinh học phân tử', author: 'Hà Văn Tuấn', publisher: 'NXB Khoa học', publishYear: 2021, categoryId: 'cat-5', categoryName: 'Khoa học', locationId: 'loc-4', locationName: 'Kho D – Tầng 2', description: 'Cơ sở sinh học phân tử và tế bào', coverUrl: undefined, totalCopies: 6, availableCopies: 4, status: 'available' },
  { id: 'book-018', isbn: '978-604-2-99345-8', title: 'TOEIC 900+', author: 'Kim Min Soo', publisher: 'NXB ĐHQG', publishYear: 2023, categoryId: 'cat-6', categoryName: 'Ngoại ngữ', locationId: 'loc-5', locationName: 'Kho E – Tầng 3', description: 'Luyện thi TOEIC đạt 900 điểm', coverUrl: undefined, totalCopies: 7, availableCopies: 5, status: 'available' },
  { id: 'book-019', isbn: '978-604-3-11345-9', title: 'Truyện Kiều', author: 'Nguyễn Du', publisher: 'NXB Văn học', publishYear: 2017, categoryId: 'cat-3', categoryName: 'Tiểu thuyết', locationId: 'loc-3', locationName: 'Kho C – Tầng 2', description: 'Tác phẩm văn học kinh điển của Việt Nam', coverUrl: undefined, totalCopies: 10, availableCopies: 8, status: 'available' },
  { id: 'book-020', isbn: '978-604-3-22345-0', title: 'Clean Code', author: 'Robert C. Martin', publisher: "O'Reilly", publishYear: 2022, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'A Handbook of Agile Software Craftsmanship', coverUrl: undefined, totalCopies: 3, availableCopies: 1, status: 'available' },
  { id: 'book-021', isbn: '978-604-3-33345-1', title: 'Giải tích hàm', author: 'Nguyễn Thế Hoàn', publisher: 'NXB ĐHQG', publishYear: 2020, categoryId: 'cat-8', categoryName: 'Toán học', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Giải tích hàm và phương trình vi phân', coverUrl: undefined, totalCopies: 9, availableCopies: 6, status: 'available' },
  { id: 'book-022', isbn: '978-604-3-44345-2', title: 'Hóa học đại cương', author: 'Đặng Thị Oanh', publisher: 'NXB Giáo dục', publishYear: 2021, categoryId: 'cat-5', categoryName: 'Khoa học', locationId: 'loc-4', locationName: 'Kho D – Tầng 2', description: 'Hóa vô cơ, hữu cơ, hóa lý cho đại học', coverUrl: undefined, totalCopies: 14, availableCopies: 9, status: 'available' },
  { id: 'book-023', isbn: '978-604-3-55345-3', title: 'Design Patterns', author: 'Gang of Four', publisher: 'Addison-Wesley', publishYear: 2020, categoryId: 'cat-4', categoryName: 'Kỹ thuật', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', description: 'Elements of Reusable Object-Oriented Software', coverUrl: undefined, totalCopies: 4, availableCopies: 2, status: 'available' },
  { id: 'book-024', isbn: '978-604-3-66345-4', title: 'Tâm lý học đại cương', author: 'Nguyễn Quang Uẩn', publisher: 'NXB ĐHSP', publishYear: 2019, categoryId: 'cat-1', categoryName: 'Giáo trình', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Cơ sở tâm lý học', coverUrl: undefined, totalCopies: 16, availableCopies: 11, status: 'available' },
  { id: 'book-025', isbn: '978-604-3-77345-5', title: 'Luật dân sự Việt Nam', author: 'Nguyễn Ngọc Điện', publisher: 'NXB Tư pháp', publishYear: 2022, categoryId: 'cat-1', categoryName: 'Giáo trình', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', description: 'Bộ luật dân sự và hướng dẫn áp dụng', coverUrl: undefined, totalCopies: 12, availableCopies: 8, status: 'available' },
]

// ── Members Mock ─────────────────────────────────────────────────
const MOCK_MEMBERS: LibraryMember[] = [
  { id: 'mem-001', userId: 'user-101', memberCode: 'LB-2024-001', fullName: 'Nguyễn Thị Lan', email: 'lan.nguyen@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 3, maxBooks: 5 },
  { id: 'mem-002', userId: 'user-102', memberCode: 'LB-2024-002', fullName: 'Trần Văn Minh', email: 'minh.tran@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 1, maxBooks: 5 },
  { id: 'mem-003', userId: 'user-103', memberCode: 'LB-2024-003', fullName: 'Lê Thị Hoa', email: 'hoa.le@school.edu.vn', memberType: 'teacher', cardExpiry: '2026-06-30', status: 'active', currentBorrows: 5, maxBooks: 10 },
  { id: 'mem-004', userId: 'user-104', memberCode: 'LB-2024-004', fullName: 'Phạm Đức Long', email: 'long.pham@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 0, maxBooks: 5 },
  { id: 'mem-005', userId: 'user-105', memberCode: 'LB-2024-005', fullName: 'Hoàng Thanh Mai', email: 'mai.hoang@school.edu.vn', memberType: 'staff', cardExpiry: '2026-06-30', status: 'active', currentBorrows: 2, maxBooks: 7 },
  { id: 'mem-006', userId: 'user-106', memberCode: 'LB-2024-006', fullName: 'Vũ Thị Thu', email: 'thu.vu@school.edu.vn', memberType: 'student', cardExpiry: '2024-12-31', status: 'expired', currentBorrows: 0, maxBooks: 5 },
  { id: 'mem-007', userId: 'user-107', memberCode: 'LB-2024-007', fullName: 'Đặng Văn Hùng', email: 'hung.dang@school.edu.vn', memberType: 'teacher', cardExpiry: '2026-06-30', status: 'active', currentBorrows: 8, maxBooks: 10 },
  { id: 'mem-008', userId: 'user-108', memberCode: 'LB-2024-008', fullName: 'Bùi Thị Ngọc', email: 'ngoc.bui@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'suspended', currentBorrows: 2, maxBooks: 5 },
  { id: 'mem-009', userId: 'user-109', memberCode: 'LB-2024-009', fullName: 'Ngô Quang Khải', email: 'khai.ngo@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 4, maxBooks: 5 },
  { id: 'mem-010', userId: 'user-110', memberCode: 'LB-2024-010', fullName: 'Mai Thị Bích', email: 'bich.mai@school.edu.vn', memberType: 'teacher', cardExpiry: '2026-06-30', status: 'active', currentBorrows: 3, maxBooks: 10 },
  { id: 'mem-011', memberCode: 'LB-2024-011', fullName: 'Lê Văn Tuấn', email: 'tuan.le@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 2, maxBooks: 5 },
  { id: 'mem-012', memberCode: 'LB-2024-012', fullName: 'Trần Thị Hằng', email: 'hang.tran@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 0, maxBooks: 5 },
  { id: 'mem-013', memberCode: 'LB-2024-013', fullName: 'Phạm Văn Thắng', email: 'thang.pham@school.edu.vn', memberType: 'staff', cardExpiry: '2026-06-30', status: 'active', currentBorrows: 1, maxBooks: 7 },
  { id: 'mem-014', memberCode: 'LB-2024-014', fullName: 'Nguyễn Thị Linh', email: 'linh.nguyen@school.edu.vn', memberType: 'student', cardExpiry: '2025-12-31', status: 'active', currentBorrows: 3, maxBooks: 5 },
  { id: 'mem-015', memberCode: 'LB-2024-015', fullName: 'Hoàng Văn Nam', email: 'nam.hoang@school.edu.vn', memberType: 'teacher', cardExpiry: '2026-06-30', status: 'active', currentBorrows: 6, maxBooks: 10 },
]

// ── BookCopies Mock ──────────────────────────────────────────────
const MOCK_COPIES: BookCopy[] = [
  { id: 'copy-001', bookId: 'book-001', copyCode: 'QH-00001', condition: 'good', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', isAvailable: true },
  { id: 'copy-002', bookId: 'book-001', copyCode: 'QH-00002', condition: 'good', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', isAvailable: true },
  { id: 'copy-003', bookId: 'book-001', copyCode: 'QH-00003', condition: 'fair', locationId: 'loc-2', locationName: 'Kho B – Tầng 1', isAvailable: false },
  { id: 'copy-004', bookId: 'book-002', copyCode: 'QH-00004', condition: 'good', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', isAvailable: true },
  { id: 'copy-005', bookId: 'book-002', copyCode: 'QH-00005', condition: 'good', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', isAvailable: false },
  { id: 'copy-006', bookId: 'book-003', copyCode: 'QH-00006', condition: 'good', locationId: 'loc-1', locationName: 'Kho A – Tầng 1', isAvailable: true },
  { id: 'copy-007', bookId: 'book-004', copyCode: 'QH-00007', condition: 'good', locationId: 'loc-4', locationName: 'Kho D – Tầng 2', isAvailable: false },
  { id: 'copy-008', bookId: 'book-005', copyCode: 'QH-00008', condition: 'good', locationId: 'loc-5', locationName: 'Kho E – Tầng 3', isAvailable: true },
]

// ── Borrow Records Mock ──────────────────────────────────────────
const MOCK_BORROWS: BorrowRecord[] = [
  { id: 'borrow-001', memberId: 'mem-001', memberName: 'Nguyễn Thị Lan', copyId: 'copy-003', copyCode: 'QH-00003', bookTitle: 'Lập trình Python cơ bản', borrowedAt: '2026-02-15T08:30:00Z', dueDate: '2026-03-01T23:59:00Z', status: 'overdue', fineAmount: 11000, finePaid: false },
  { id: 'borrow-002', memberId: 'mem-002', memberName: 'Trần Văn Minh', copyId: 'copy-005', copyCode: 'QH-00005', bookTitle: 'Toán cao cấp A1', borrowedAt: '2026-02-20T09:00:00Z', dueDate: '2026-03-06T23:59:00Z', status: 'overdue', fineAmount: 6000, finePaid: false },
  { id: 'borrow-003', memberId: 'mem-003', memberName: 'Lê Thị Hoa', copyId: 'copy-007', copyCode: 'QH-00007', bookTitle: 'Vật lý đại cương', borrowedAt: '2026-02-25T10:00:00Z', dueDate: '2026-03-27T23:59:00Z', status: 'borrowed', fineAmount: 0, finePaid: false },
  { id: 'borrow-004', memberId: 'mem-001', memberName: 'Nguyễn Thị Lan', copyId: 'copy-004', copyCode: 'QH-00004', bookTitle: 'Toán cao cấp A1', borrowedAt: '2026-03-01T08:00:00Z', dueDate: '2026-03-15T23:59:00Z', status: 'borrowed', fineAmount: 0, finePaid: false },
  { id: 'borrow-005', memberId: 'mem-004', memberName: 'Phạm Đức Long', copyId: 'copy-001', copyCode: 'QH-00001', bookTitle: 'Lập trình Python cơ bản', borrowedAt: '2026-01-10T08:00:00Z', dueDate: '2026-01-24T23:59:00Z', returnedAt: '2026-01-22T14:30:00Z', status: 'returned', fineAmount: 0, finePaid: true },
  { id: 'borrow-006', memberId: 'mem-005', memberName: 'Hoàng Thanh Mai', copyId: 'copy-006', copyCode: 'QH-00006', bookTitle: 'Kinh tế vĩ mô', borrowedAt: '2026-02-10T09:30:00Z', dueDate: '2026-03-03T23:59:00Z', status: 'overdue', fineAmount: 9000, finePaid: false },
  { id: 'borrow-007', memberId: 'mem-007', memberName: 'Đặng Văn Hùng', copyId: 'copy-008', copyCode: 'QH-00008', bookTitle: 'Tiếng Anh chuyên ngành IT', borrowedAt: '2026-03-05T08:00:00Z', dueDate: '2026-04-04T23:59:00Z', status: 'borrowed', fineAmount: 0, finePaid: false },
  { id: 'borrow-008', memberId: 'mem-009', memberName: 'Ngô Quang Khải', copyId: 'copy-002', copyCode: 'QH-00002', bookTitle: 'Lập trình Python cơ bản', borrowedAt: '2026-03-08T09:00:00Z', dueDate: '2026-03-22T23:59:00Z', status: 'borrowed', fineAmount: 0, finePaid: false },
  { id: 'borrow-009', memberId: 'mem-010', memberName: 'Mai Thị Bích', copyId: 'copy-004', copyCode: 'QH-00004', bookTitle: 'Toán cao cấp A1', borrowedAt: '2025-12-01T08:00:00Z', dueDate: '2025-12-31T23:59:00Z', returnedAt: '2025-12-28T10:00:00Z', status: 'returned', fineAmount: 0, finePaid: true },
  { id: 'borrow-010', memberId: 'mem-011', memberName: 'Lê Văn Tuấn', copyId: 'copy-001', copyCode: 'QH-00001', bookTitle: 'Lập trình Python cơ bản', borrowedAt: '2026-01-20T09:00:00Z', dueDate: '2026-02-03T23:59:00Z', returnedAt: '2026-02-01T11:00:00Z', status: 'returned', fineAmount: 0, finePaid: true },
]

// ── News Articles Mock ───────────────────────────────────────────
const MOCK_NEWS: NewsArticle[] = [
  { id: 'news-001', title: 'Thư viện mở cửa xuyên tết 2026', slug: 'thu-vien-mo-cua-xuyen-tet-2026', content: '<p>Thư viện trường sẽ mở cửa phục vụ bạn đọc xuyên suốt kỳ nghỉ tết nguyên đán 2026. Thời gian phục vụ: 8:00 - 17:00 tất cả các ngày trong tuần kể cả thứ Bảy và Chủ Nhật.</p><p>Đặc biệt, trong dịp tết, thư viện sẽ tổ chức nhiều hoạt động văn hóa đọc sách thú vị dành cho học sinh và cán bộ giáo viên.</p>', coverUrl: undefined, publishedAt: '2026-01-15T08:00:00Z', author: 'Ban Thư viện', tags: ['thư viện', 'tết', 'thông báo'] },
  { id: 'news-002', title: 'Bổ sung 500 đầu sách mới học kỳ 2', slug: 'bo-sung-500-dau-sach-moi-hoc-ky-2', content: '<p>Thư viện vui mừng thông báo đã bổ sung hơn 500 đầu sách mới cho học kỳ 2 năm học 2025-2026. Bao gồm giáo trình, sách tham khảo và tài liệu kỹ thuật mới nhất.</p>', coverUrl: undefined, publishedAt: '2026-02-01T09:00:00Z', author: 'Ban Thư viện', tags: ['sách mới', 'học kỳ 2'] },
  { id: 'news-003', title: 'Hội thảo Văn hóa đọc tháng 3/2026', slug: 'hoi-thao-van-hoa-doc-thang-3-2026', content: '<p>Nhân Ngày sách Việt Nam 21/4, thư viện tổ chức hội thảo về văn hóa đọc với sự tham gia của các chuyên gia giáo dục hàng đầu.</p>', coverUrl: undefined, publishedAt: '2026-03-01T10:00:00Z', author: 'Ban Thư viện', tags: ['sự kiện', 'văn hóa đọc'] },
  { id: 'news-004', title: 'Triển khai hệ thống mượn trả tự động', slug: 'trien-khai-he-thong-muon-tra-tu-dong', content: '<p>Thư viện chính thức đưa vào vận hành hệ thống mượn trả tự động với công nghệ mã vạch và RFID, giúp rút ngắn thời gian xử lý xuống còn 1-2 phút/lượt.</p>', coverUrl: undefined, publishedAt: '2026-02-20T08:00:00Z', author: 'Ban Thư viện', tags: ['công nghệ', 'tự động hóa'] },
  { id: 'news-005', title: 'Thông báo về chính sách phí phạt mới', slug: 'thong-bao-chinh-sach-phi-phat-moi', content: '<p>Kể từ ngày 01/03/2026, mức phí phạt trả sách trễ được điều chỉnh nhằm khuyến khích ý thức trả sách đúng hạn của bạn đọc.</p>', coverUrl: undefined, publishedAt: '2026-02-25T09:00:00Z', author: 'Ban Thư viện', tags: ['thông báo', 'chính sách'] },
]

// ── Library Stats Mock ───────────────────────────────────────────
const MOCK_STATS: LibraryStats = {
  totalBooks: 3420,
  availableBooks: 2145,
  totalMembers: 865,
  borrowsThisMonth: 248,
}

// ── Portal Contents Mock ─────────────────────────────────────────
const MOCK_PORTAL_CONTENTS: PortalContent[] = [
  { id: 'pc-1', title: 'Giới thiệu về Thư viện', type: 'introduction', content: '<p>Thư viện trường là trung tâm học liệu lớn nhất trong khu vực, với hơn 50.000 đầu sách và hàng nghìn tài liệu kỹ thuật số.</p>', isActive: true, displayOrder: 1, updatedAt: '2026-01-10T08:00:00Z' },
  { id: 'pc-2', title: 'Thông tin liên hệ', type: 'contact', content: '<p>Địa chỉ: Tòa nhà A, Tầng 1-3<br/>Điện thoại: 028.1234.5678<br/>Email: library@school.edu.vn<br/>Giờ làm việc: 7:30 – 17:30, Thứ 2 – Thứ 7</p>', isActive: true, displayOrder: 2, updatedAt: '2026-01-15T08:00:00Z' },
  { id: 'pc-3', title: 'Nội quy thư viện', type: 'regulation', content: '<p>1. Giữ trật tự, im lặng trong phòng đọc sách.<br/>2. Không mang đồ ăn, thức uống vào thư viện.<br/>3. Tắt hoặc chuyển điện thoại sang chế độ im lặng.<br/>4. Bảo quản sách cẩn thận, không làm hỏng hoặc mất sách.</p>', isActive: true, displayOrder: 3, updatedAt: '2026-02-01T08:00:00Z' },
  { id: 'pc-4', title: 'Lịch phục vụ', type: 'schedule', content: '<p>Thứ 2 – Thứ 6: 7:30 – 17:30<br/>Thứ 7: 8:00 – 12:00<br/>Chủ Nhật: Nghỉ<br/>Ngày lễ: Theo thông báo</p>', isActive: true, displayOrder: 4, updatedAt: '2026-02-01T08:00:00Z' },
]

// ── Portal News Mock ─────────────────────────────────────────────
const MOCK_PORTAL_NEWS: PortalNewsItem[] = [
  { id: 'pn-1', title: 'Khai trương phòng đọc tự học 24/7', slug: 'khai-truong-phong-doc-tu-hoc-24-7', category: 'news', publishDate: '2026-03-01T08:00:00Z', author: 'Ban Thư viện', summary: 'Phòng đọc tự học mở 24/7 với 50 chỗ ngồi, wifi tốc độ cao và máy tính đa năng.', content: '<p>Nhằm đáp ứng nhu cầu học tập ngày càng cao của học sinh sinh viên, thư viện đã hoàn thành nâng cấp phòng đọc tự học với đầy đủ tiện nghi hiện đại.</p>', thumbnailUrl: undefined, status: 'published' },
  { id: 'pn-2', title: 'Sự kiện: Ngày Sách Việt Nam 21/4/2026', slug: 'su-kien-ngay-sach-viet-nam-2026', category: 'event', publishDate: '2026-03-10T09:00:00Z', author: 'Ban Thư viện', summary: 'Thư viện tổ chức nhiều hoạt động đặc sắc chào mừng Ngày Sách và Văn hóa đọc Việt Nam.', content: '<p>Các hoạt động bao gồm: Triển lãm sách, Cuộc thi đọc sách hay, Gặp gỡ tác giả và nhiều phần quà hấp dẫn.</p>', thumbnailUrl: undefined, status: 'published' },
  { id: 'pn-3', title: 'Thông báo: Bảo trì hệ thống OPAC', slug: 'thong-bao-bao-tri-he-thong-opac', category: 'announcement', publishDate: '2026-03-08T08:00:00Z', author: 'Ban Thư viện', summary: 'Hệ thống OPAC sẽ tạm ngừng hoạt động để bảo trì vào ngày 15/03/2026.', content: '<p>Thời gian bảo trì: 22:00 ngày 15/03 đến 6:00 ngày 16/03/2026. Xin lỗi về sự bất tiện này.</p>', thumbnailUrl: undefined, status: 'published' },
  { id: 'pn-4', title: 'Hướng dẫn sử dụng tài nguyên điện tử', slug: 'huong-dan-su-dung-tai-nguyen-dien-tu', category: 'news', publishDate: '2026-02-20T09:00:00Z', author: 'Ban Thư viện', summary: 'Hướng dẫn toàn diện cách truy cập và sử dụng kho tài nguyên số của thư viện.', content: '<p>Tài nguyên số bao gồm: E-books, E-journals, Video lectures và nhiều hơn nữa. Bạn đọc có thể truy cập từ bất kỳ đâu với tài khoản thư viện.</p>', thumbnailUrl: undefined, status: 'draft' },
]

// ── EDocuments Mock ──────────────────────────────────────────────
const MOCK_EDOCS: EDocument[] = [
  { id: 'edoc-001', title: 'Giáo trình Python Programming', author: 'Nguyễn Văn An', publisher: 'NXB Giáo dục', publishYear: 2023, category: 'Kỹ thuật', docType: 'PDF', coverUrl: undefined, pageCount: 320, description: 'Lập trình Python từ cơ bản đến nâng cao, kèm bài tập thực hành', tags: ['python', 'lập trình', 'kỹ thuật'], isFree: true, fileUrl: '/docs/python-programming.pdf', relatedDocs: [] },
  { id: 'edoc-002', title: 'Advanced Machine Learning', author: 'Trần Thị Bình', publisher: 'NXB Khoa học', publishYear: 2023, category: 'AI/ML', docType: 'PDF', coverUrl: undefined, pageCount: 450, description: 'Học máy nâng cao: Deep Learning, Neural Networks, NLP', tags: ['machine learning', 'AI', 'deep learning'], isFree: false, fileUrl: '/docs/advanced-ml.pdf', relatedDocs: [] },
  { id: 'edoc-003', title: 'Microservices Architecture', author: 'Lê Minh Châu', publisher: 'NXB Khoa học', publishYear: 2022, category: 'Kiến trúc phần mềm', docType: 'PDF', coverUrl: undefined, pageCount: 280, description: 'Thiết kế hệ thống microservices hiện đại', tags: ['microservices', 'docker', 'kubernetes'], isFree: false, fileUrl: '/docs/microservices.pdf', relatedDocs: [] },
  { id: 'edoc-004', title: 'Giáo trình Tiếng Anh TOEIC', author: 'Phạm Đức Duy', publisher: 'NXB Ngoại ngữ', publishYear: 2023, category: 'Ngoại ngữ', docType: 'PDF', coverUrl: undefined, pageCount: 500, description: 'Tài liệu luyện thi TOEIC 700+ toàn diện', tags: ['tiếng Anh', 'TOEIC', 'ngoại ngữ'], isFree: true, fileUrl: '/docs/toeic-prep.pdf', relatedDocs: [] },
  { id: 'edoc-005', title: 'Bài giảng Toán cao cấp A1', author: 'Hoàng Thu Hà', publisher: 'Trường QH', publishYear: 2024, category: 'Toán học', docType: 'PDF', coverUrl: undefined, pageCount: 200, description: 'Bài giảng giải tích, đại số cho sinh viên năm nhất', tags: ['toán', 'giải tích', 'đại số'], isFree: true, fileUrl: '/docs/calculus-a1.pdf', relatedDocs: [] },
  { id: 'edoc-006', title: 'Clean Architecture Video Course', author: 'Robert C. Martin', publisher: 'O\'Reilly Media', publishYear: 2022, category: 'Kỹ thuật', docType: 'Video', coverUrl: undefined, pageCount: undefined, description: 'Khóa học video về kiến trúc phần mềm sạch', tags: ['clean architecture', 'design patterns'], isFree: false, fileUrl: '/docs/clean-architecture', relatedDocs: [] },
  { id: 'edoc-007', title: 'Kinh tế vĩ mô – Bài giảng điện tử', author: 'Lê Minh Châu', publisher: 'NXB Kinh tế', publishYear: 2023, category: 'Kinh tế', docType: 'PDF', coverUrl: undefined, pageCount: 380, description: 'Bài giảng điện tử kinh tế vĩ mô kèm case study', tags: ['kinh tế', 'macro economics'], isFree: true, fileUrl: '/docs/macro-economics.pdf', relatedDocs: [] },
  { id: 'edoc-008', title: 'Web Development với Next.js', author: 'Nguyễn Tuấn Anh', publisher: 'NXB Khoa học', publishYear: 2024, category: 'Kỹ thuật', docType: 'EPUB', coverUrl: undefined, pageCount: 260, description: 'Xây dựng ứng dụng web full-stack với Next.js 14', tags: ['nextjs', 'react', 'typescript', 'web'], isFree: false, fileUrl: '/docs/nextjs-development.epub', relatedDocs: [] },
]

// ── Email Settings Mock ──────────────────────────────────────────
const MOCK_EMAIL_SETTINGS: LibraryEmailSettings = {
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  senderEmail: 'library@school.edu.vn',
  ccOverdueEmail: 'admin@school.edu.vn',
  reminderFrequency: 'weekly',
}

// ── Language Settings Mock ───────────────────────────────────────
const MOCK_LANG_SETTINGS: LibraryLanguageSettings = {
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  currency: 'VND',
  fineUnit: 'đồng/ngày',
}

// ── Classification Systems Mock ──────────────────────────────────
const MOCK_CLASSIFICATIONS: ClassificationSystem[] = [
  { id: 'cls-1', code: 'DDC', name: 'Dewey Decimal Classification', description: 'Hệ thống phân loại thập phân Dewey – hệ thống phổ biến nhất thế giới', isActive: true },
  { id: 'cls-2', code: 'LCC', name: 'Library of Congress Classification', description: 'Hệ thống phân loại của Thư viện Quốc hội Mỹ', isActive: false },
  { id: 'cls-3', code: 'UDC', name: 'Universal Decimal Classification', description: 'Phân loại thập phân quốc tế', isActive: false },
  { id: 'cls-4', code: 'VN', name: 'Phân loại Việt Nam', description: 'Hệ thống phân loại tài liệu dùng trong thư viện Việt Nam', isActive: false },
]

// ── Activity Logs Mock ───────────────────────────────────────────
const MOCK_ACTIVITY_LOGS: ActivityLog[] = Array.from({ length: 50 }, (_, i) => {
  const actions = ['create', 'update', 'delete', 'borrow', 'return']
  const objTypes = ['Book', 'Member', 'BorrowRecord', 'Category', 'Location']
  const names = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Đức Duy', 'Hoàng Thu Hà']
  return {
    id: String(i + 1),
    timestamp: new Date(2026, 2, 12 - Math.floor(i / 5), 8 + (i % 8), (i * 7) % 60).toISOString(),
    userId: `U${100 + i}`,
    userName: names[i % 5]!,
    action: actions[i % 5]!,
    objectType: objTypes[i % 5]!,
    objectName: `${objTypes[i % 5]!} #${i + 1}`,
    ipAddress: `192.168.1.${100 + (i % 50)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    dataBefore: i % 2 === 0 ? JSON.stringify({ status: 'available', copies: 5 }) : undefined,
    dataAfter: i % 2 === 0 ? JSON.stringify({ status: 'available', copies: 6 }) : undefined,
  }
})

// ── Purchase Orders Mock ─────────────────────────────────────────
const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'po-01', title: 'Lập trình Python nâng cao', author: 'Nguyễn Văn An', publisher: 'NXB Giáo dục', quantity: 10, estimatedPrice: 150000, reason: 'Bổ sung tài liệu cho chương trình đào tạo CNTT', department: 'Khoa CNTT', requestedBy: 'Trần Thị Bình', requestedAt: '2026-03-01T08:00:00Z', status: 'pending' },
  { id: 'po-02', title: 'Toán cao cấp A2', author: 'Trần Thị Bình', publisher: 'NXB ĐHQG', quantity: 20, estimatedPrice: 95000, reason: 'Sách cũ đã hết, cần bổ sung', department: 'Khoa Toán', requestedBy: 'Lê Minh Châu', requestedAt: '2026-03-02T09:00:00Z', status: 'approved', reviewNote: 'Đồng ý bổ sung', reviewedBy: 'Nguyễn Văn Giám', reviewedAt: '2026-03-05T10:00:00Z' },
  { id: 'po-03', title: 'Kinh tế vi mô', author: 'Lê Minh Châu', publisher: 'NXB Kinh tế', quantity: 15, estimatedPrice: 120000, reason: 'Tài liệu học tập bắt buộc học kỳ 2', department: 'Khoa Kinh tế', requestedBy: 'Phạm Đức Duy', requestedAt: '2026-03-03T10:00:00Z', status: 'approved', reviewNote: 'Đã duyệt, chuyển mua ngay', reviewedBy: 'Nguyễn Văn Giám', reviewedAt: '2026-03-06T08:00:00Z' },
  { id: 'po-04', title: 'Vật lý thực nghiệm', author: 'Phạm Đức Duy', publisher: 'NXB Giáo dục', quantity: 5, estimatedPrice: 180000, reason: 'Tài liệu tham khảo cho phòng thí nghiệm', department: 'Khoa Vật lý', requestedBy: 'Hoàng Thu Hà', requestedAt: '2026-03-04T09:00:00Z', status: 'rejected', reviewNote: 'Đã có tài liệu tương đương trong thư viện', reviewedBy: 'Nguyễn Văn Giám', reviewedAt: '2026-03-07T11:00:00Z' },
  { id: 'po-05', title: 'Advanced English Grammar', author: 'Raymond Murphy', publisher: 'Cambridge', quantity: 30, estimatedPrice: 200000, reason: 'Bổ sung tài liệu luyện thi IELTS/TOEIC', department: 'Khoa Ngoại ngữ', requestedBy: 'Vũ Quang Minh', requestedAt: '2026-03-05T08:00:00Z', status: 'pending' },
  { id: 'po-06', title: 'Thuật toán và cấu trúc dữ liệu', author: 'Đỗ Hải Nam', publisher: 'NXB Khoa học', quantity: 8, estimatedPrice: 135000, reason: 'Môn học bắt buộc ngành CNTT', department: 'Khoa CNTT', requestedBy: 'Bùi Lan Anh', requestedAt: '2026-03-06T10:00:00Z', status: 'pending' },
]

// ── Warehouse Logs Mock ──────────────────────────────────────────
const MOCK_WAREHOUSE_LOGS: WarehouseLog[] = [
  { id: 'wl-01', action: 'open', performedBy: 'Nguyễn Văn An', performedAt: '2026-03-12T07:30:00Z', note: 'Mở kho đầu ngày' },
  { id: 'wl-02', action: 'close', performedBy: 'Trần Thị Bình', performedAt: '2026-03-11T17:30:00Z', note: 'Đóng kho cuối ngày' },
  { id: 'wl-03', action: 'open', performedBy: 'Nguyễn Văn An', performedAt: '2026-03-11T07:30:00Z', note: 'Mở kho đầu ngày' },
  { id: 'wl-04', action: 'close', performedBy: 'Trần Thị Bình', performedAt: '2026-03-10T17:30:00Z' },
  { id: 'wl-05', action: 'open', performedBy: 'Lê Minh Châu', performedAt: '2026-03-10T07:30:00Z' },
]

// ── Inventory Sessions Mock ──────────────────────────────────────
const MOCK_INVENTORY_SESSIONS: InventorySession[] = [
  { id: 'inv-1', name: 'Kiểm kê Q1/2026', startDate: '2026-03-10', endDate: '2026-03-12', scope: 'all', note: 'Kiểm kê toàn bộ kho tàng', status: 'in_progress', totalItems: 500, scannedItems: 320 },
  { id: 'inv-2', name: 'Kiểm kê kho A – Tháng 2', startDate: '2026-02-15', endDate: '2026-02-17', scope: 'area', note: 'Kiểm kê kho A, tầng 1', status: 'completed', totalItems: 180, scannedItems: 180 },
  { id: 'inv-3', name: 'Kiểm kê giáo trình HK1/2025', startDate: '2025-11-10', endDate: '2025-11-12', scope: 'category', note: 'Kiểm kê danh mục giáo trình', status: 'completed', totalItems: 250, scannedItems: 250 },
  { id: 'inv-4', name: 'Kế hoạch kiểm kê HK2/2026', startDate: '2026-06-15', endDate: '2026-06-17', scope: 'all', note: 'Dự kiến kiểm kê cuối học kỳ 2', status: 'draft', totalItems: 0, scannedItems: 0 },
]

// ── Inventory Items Mock ─────────────────────────────────────────
const MOCK_INVENTORY_ITEMS: InventoryItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  sessionId: 'inv-1',
  copyCode: `QH-${String(1000 + i).padStart(5, '0')}`,
  bookTitle: MOCK_BOOKS[i % MOCK_BOOKS.length]!.title,
  location: `Tầng ${(i % 3) + 1} - Kệ ${String.fromCharCode(65 + (i % 5))}`,
  scanStatus: i < 15 ? 'scanned' : i < 20 ? 'not_scanned' : i < 25 ? 'missing' : 'damaged',
  scannedAt: i < 15 ? new Date(2026, 2, 11, 8 + Math.floor(i / 5), (i * 4) % 60).toISOString() : undefined,
}))

// ── Pending Shelving Items Mock ──────────────────────────────────
const MOCK_PENDING_SHELVING: PendingShelvingItem[] = [
  { id: 'ps-01', copyCode: 'QH-NEW-001', bookTitle: 'Lập trình Python nâng cao', quantity: 10, supplier: 'Công ty Sách Giáo dục', receivedAt: '2026-03-10T09:00:00Z', shelfLocation: 'Kho B – Kệ C3' },
  { id: 'ps-02', copyCode: 'QH-NEW-002', bookTitle: 'Advanced English Grammar', quantity: 30, supplier: 'Nhà sách Fahasa', receivedAt: '2026-03-11T10:00:00Z', shelfLocation: undefined },
  { id: 'ps-03', copyCode: 'QH-NEW-003', bookTitle: 'Kinh tế vi mô', quantity: 15, supplier: 'Công ty Sách Giáo dục', receivedAt: '2026-03-12T08:00:00Z', shelfLocation: undefined },
  { id: 'ps-04', copyCode: 'QH-NEW-004', bookTitle: 'Toán cao cấp A2', quantity: 20, supplier: 'NXB ĐHQG', receivedAt: '2026-03-12T09:30:00Z', shelfLocation: 'Kho A – Kệ B2' },
]

// ── Accession Items Mock ─────────────────────────────────────────
const MOCK_ACCESSION_ITEMS: AccessionItem[] = [
  { id: 'acc-01', orderCode: 'PO-2026-01', bookTitle: 'Lập trình Python nâng cao', orderedQuantity: 10, receivedQuantity: 10, condition: 'good', accessionStatus: 'accepted' },
  { id: 'acc-02', orderCode: 'PO-2026-02', bookTitle: 'Toán cao cấp A2', orderedQuantity: 20, receivedQuantity: 18, condition: 'partial', accessionStatus: 'accepted' },
  { id: 'acc-03', orderCode: 'PO-2026-03', bookTitle: 'Kinh tế vi mô', orderedQuantity: 15, receivedQuantity: 15, condition: 'good', accessionStatus: 'pending' },
  { id: 'acc-04', orderCode: 'PO-2026-04', bookTitle: 'Advanced English Grammar', orderedQuantity: 30, receivedQuantity: 28, condition: 'partial', accessionStatus: 'pending' },
  { id: 'acc-05', orderCode: 'PO-2026-05', bookTitle: 'Vật lý thực nghiệm', orderedQuantity: 5, receivedQuantity: 5, condition: 'damaged', accessionStatus: 'rejected' },
]

// ─────────────────────────────────────────────────────────────────
// HELPER: paginate a list
// ─────────────────────────────────────────────────────────────────
function paginate<T>(items: T[], page = 1, pageSize = 20): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

// ─────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────

// ── Categories ───────────────────────────────────────────────────

export function useGetCategories() {
  return useQuery({
    queryKey: ['library-categories'],
    queryFn: async () => {
      try { return await apiFetch<LibraryCategory[]>('/api/library/categories') }
      catch { return MOCK_CATEGORIES }
    },
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryCategory, 'id' | 'bookCount'>) =>
      apiFetch<LibraryCategory>('/api/library/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-categories'] }) },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryCategory) =>
      apiFetch<LibraryCategory>(`/api/library/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-categories'] }) },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-categories'] }) },
  })
}

// ── Locations ────────────────────────────────────────────────────

export function useGetLocations() {
  return useQuery({
    queryKey: ['library-locations'],
    queryFn: async () => {
      try { return await apiFetch<LibraryLocation[]>('/api/library/locations') }
      catch { return MOCK_LOCATIONS }
    },
  })
}

export function useCreateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryLocation, 'id'>) =>
      apiFetch<LibraryLocation>('/api/library/locations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-locations'] }) },
  })
}

export function useUpdateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryLocation) =>
      apiFetch<LibraryLocation>(`/api/library/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-locations'] }) },
  })
}

export function useDeleteLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/locations/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-locations'] }) },
  })
}

// ── Borrow Rules ─────────────────────────────────────────────────

export function useGetBorrowRules() {
  return useQuery({
    queryKey: ['library-borrow-rules'],
    queryFn: async () => {
      try { return await apiFetch<BorrowRule[]>('/api/library/borrow-rules') }
      catch { return MOCK_BORROW_RULES }
    },
  })
}

export function useCreateBorrowRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<BorrowRule, 'id'>) =>
      apiFetch<BorrowRule>('/api/library/borrow-rules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-borrow-rules'] }) },
  })
}

export function useUpdateBorrowRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: BorrowRule) =>
      apiFetch<BorrowRule>(`/api/library/borrow-rules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-borrow-rules'] }) },
  })
}

export function useDeleteBorrowRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/borrow-rules/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-borrow-rules'] }) },
  })
}

// ── Books ─────────────────────────────────────────────────────────

export function useGetBooks(params: {
  search?: string
  categoryId?: string
  locationId?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-books', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params.search) sp.set('search', params.search)
        if (params.categoryId) sp.set('categoryId', params.categoryId)
        if (params.locationId) sp.set('locationId', params.locationId)
        if (params.status) sp.set('status', params.status)
        if (params.page) sp.set('page', String(params.page))
        if (params.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<LibraryBook>>(`/api/library/books?${sp.toString()}`)
      } catch {
        let books = [...MOCK_BOOKS]
        if (params.search) {
          const q = params.search.toLowerCase()
          books = books.filter((b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.includes(q)
          )
        }
        if (params.categoryId) books = books.filter((b) => b.categoryId === params.categoryId)
        if (params.locationId) books = books.filter((b) => b.locationId === params.locationId)
        if (params.status) books = books.filter((b) => b.status === params.status)
        return paginate(books, params.page ?? 1, params.pageSize ?? 20)
      }
    },
  })
}

export function useGetBook(id: string) {
  return useQuery({
    queryKey: ['library-book', id],
    queryFn: async () => {
      try { return await apiFetch<LibraryBook>(`/api/library/books/${id}`) }
      catch { return MOCK_BOOKS.find((b) => b.id === id) ?? MOCK_BOOKS[0]! }
    },
    enabled: !!id,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryBook, 'id' | 'totalCopies' | 'availableCopies' | 'status' | 'categoryName' | 'locationName'>) =>
      apiFetch<LibraryBook>('/api/library/books', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-books'] }) },
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryBook) =>
      apiFetch<LibraryBook>(`/api/library/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-books'] })
      void qc.invalidateQueries({ queryKey: ['library-book'] })
    },
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/books/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-books'] }) },
  })
}

export function useImportBooks() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
        '/api/library/books/import',
        { method: 'POST', body: fd, headers: {} }
      )
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-books'] }) },
  })
}

// ── Copies ────────────────────────────────────────────────────────

export function useGetBookCopies(bookId: string) {
  return useQuery({
    queryKey: ['library-copies', bookId],
    queryFn: async () => {
      try { return await apiFetch<BookCopy[]>(`/api/library/books/${bookId}/copies`) }
      catch { return MOCK_COPIES.filter((c) => c.bookId === bookId) }
    },
    enabled: !!bookId,
  })
}

export function useCreateCopy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { bookId: string; copyCode: string; condition: string; locationId?: string }) =>
      apiFetch<BookCopy>(`/api/library/books/${data.bookId}/copies`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
      void qc.invalidateQueries({ queryKey: ['library-books'] })
    },
  })
}

export function useUpdateCopy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, bookId, ...data }: BookCopy) =>
      apiFetch<BookCopy>(`/api/library/copies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
      void qc.invalidateQueries({ queryKey: ['library-books'] })
    },
  })
}

export function useDeleteCopy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/copies/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
      void qc.invalidateQueries({ queryKey: ['library-books'] })
    },
  })
}

// ── Members ───────────────────────────────────────────────────────

export function useGetMembers(params: {
  search?: string
  memberType?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-members', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params.search) sp.set('search', params.search)
        if (params.memberType) sp.set('memberType', params.memberType)
        if (params.status) sp.set('status', params.status)
        if (params.page) sp.set('page', String(params.page))
        if (params.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<LibraryMember>>(`/api/library/members?${sp.toString()}`)
      } catch {
        let members = [...MOCK_MEMBERS]
        if (params.search) {
          const q = params.search.toLowerCase()
          members = members.filter((m) =>
            m.fullName.toLowerCase().includes(q) ||
            m.memberCode.toLowerCase().includes(q) ||
            (m.email ?? '').toLowerCase().includes(q)
          )
        }
        if (params.memberType) members = members.filter((m) => m.memberType === params.memberType)
        if (params.status) members = members.filter((m) => m.status === params.status)
        return paginate(members, params.page ?? 1, params.pageSize ?? 20)
      }
    },
  })
}

export function useGetMember(id: string) {
  return useQuery({
    queryKey: ['library-member', id],
    queryFn: async () => {
      try { return await apiFetch<LibraryMember>(`/api/library/members/${id}`) }
      catch { return MOCK_MEMBERS.find((m) => m.id === id) ?? MOCK_MEMBERS[0]! }
    },
    enabled: !!id,
  })
}

export function useCreateMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryMember, 'id' | 'currentBorrows'>) =>
      apiFetch<LibraryMember>('/api/library/members', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-members'] }) },
  })
}

export function useUpdateMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryMember) =>
      apiFetch<LibraryMember>(`/api/library/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-members'] })
      void qc.invalidateQueries({ queryKey: ['library-member'] })
    },
  })
}

export function useDeleteMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/members/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-members'] }) },
  })
}

// ── Borrow / Circulation ──────────────────────────────────────────

export function useGetBorrows(params: {
  status?: string
  memberId?: string
  overdue?: boolean
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-borrows', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params.status) sp.set('status', params.status)
        if (params.memberId) sp.set('memberId', params.memberId)
        if (params.overdue) sp.set('overdue', 'true')
        if (params.page) sp.set('page', String(params.page))
        if (params.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<BorrowRecord>>(`/api/library/borrows?${sp.toString()}`)
      } catch {
        let borrows = [...MOCK_BORROWS]
        if (params.status) borrows = borrows.filter((b) => b.status === params.status)
        if (params.overdue) borrows = borrows.filter((b) => b.status === 'overdue')
        if (params.memberId) borrows = borrows.filter((b) => b.memberId === params.memberId)
        return paginate(borrows, params.page ?? 1, params.pageSize ?? 20)
      }
    },
  })
}

export function useCreateBorrow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { memberId: string; copyId: string; dueDate?: string }) =>
      apiFetch<BorrowRecord>('/api/library/borrows', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-borrows'] })
      void qc.invalidateQueries({ queryKey: ['library-members'] })
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
    },
  })
}

export function useReturnBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { copyId: string; condition?: string; note?: string; finePaid?: boolean }) =>
      apiFetch<BorrowRecord>('/api/library/borrows/return', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-borrows'] })
      void qc.invalidateQueries({ queryKey: ['library-members'] })
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
    },
  })
}

export function useRenewBorrow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { borrowId: string; newDueDate?: string }) =>
      apiFetch<BorrowRecord>(`/api/library/borrows/${data.borrowId}/renew`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-borrows'] })
    },
  })
}

// ── OPAC (Public) ─────────────────────────────────────────────────

export function useSearchOPAC(params: {
  q?: string
  categoryId?: string
  author?: string
  yearFrom?: number
  yearTo?: number
  available?: boolean
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['opac-search', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params.q) sp.set('q', params.q)
        if (params.categoryId) sp.set('categoryId', params.categoryId)
        if (params.author) sp.set('author', params.author)
        if (params.yearFrom) sp.set('yearFrom', String(params.yearFrom))
        if (params.yearTo) sp.set('yearTo', String(params.yearTo))
        if (params.available) sp.set('available', 'true')
        if (params.page) sp.set('page', String(params.page))
        if (params.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<LibraryBook>>(`/api/library/opac/search?${sp.toString()}`)
      } catch {
        let books = [...MOCK_BOOKS]
        if (params.q) {
          const q = params.q.toLowerCase()
          books = books.filter((b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.includes(q) ||
            (b.description ?? '').toLowerCase().includes(q)
          )
        }
        if (params.categoryId) books = books.filter((b) => b.categoryId === params.categoryId)
        if (params.author) books = books.filter((b) => b.author.toLowerCase().includes(params.author!.toLowerCase()))
        if (params.yearFrom) books = books.filter((b) => (b.publishYear ?? 0) >= params.yearFrom!)
        if (params.yearTo) books = books.filter((b) => (b.publishYear ?? 9999) <= params.yearTo!)
        if (params.available) books = books.filter((b) => b.availableCopies > 0)
        return paginate(books, params.page ?? 1, params.pageSize ?? 20)
      }
    },
  })
}

export function useGetBookDetail(bookId: string) {
  return useQuery({
    queryKey: ['opac-book', bookId],
    queryFn: async () => {
      try {
        return await apiFetch<LibraryBook & { copies: BookCopy[] }>(`/api/library/opac/books/${bookId}`)
      } catch {
        const book = MOCK_BOOKS.find((b) => b.id === bookId) ?? MOCK_BOOKS[0]!
        const copies = MOCK_COPIES.filter((c) => c.bookId === bookId)
        return { ...book, copies }
      }
    },
    enabled: !!bookId,
  })
}

// ── News ──────────────────────────────────────────────────────────

export function useGetNews(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['library-news', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params?.page) sp.set('page', String(params.page))
        if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<NewsArticle>>(`/api/library/news?${sp.toString()}`)
      } catch {
        return paginate(MOCK_NEWS, params?.page ?? 1, params?.pageSize ?? 10)
      }
    },
  })
}

export function useGetNewsArticle(slug: string) {
  return useQuery({
    queryKey: ['library-news', slug],
    queryFn: async () => {
      try { return await apiFetch<NewsArticle>(`/api/library/news/${slug}`) }
      catch { return MOCK_NEWS.find((n) => n.slug === slug) ?? MOCK_NEWS[0]! }
    },
    enabled: !!slug,
  })
}

// ── Library Stats ─────────────────────────────────────────────────

export function useGetLibraryStats() {
  return useQuery({
    queryKey: ['library-stats'],
    queryFn: async () => {
      try { return await apiFetch<LibraryStats>('/api/library/stats') }
      catch { return MOCK_STATS }
    },
  })
}

// ── Portal Content (Admin CMS) ────────────────────────────────────

export function useGetPortalContents() {
  return useQuery({
    queryKey: ['portal-contents'],
    queryFn: async () => {
      try { return await apiFetch<PortalContent[]>('/api/library/portal-content') }
      catch { return MOCK_PORTAL_CONTENTS }
    },
  })
}

export function useGetPortalContent(id: string) {
  return useQuery({
    queryKey: ['portal-content', id],
    queryFn: async () => {
      try { return await apiFetch<PortalContent>(`/api/library/portal-content/${id}`) }
      catch { return MOCK_PORTAL_CONTENTS.find((c) => c.id === id) ?? MOCK_PORTAL_CONTENTS[0]! }
    },
    enabled: !!id,
  })
}

export function useCreatePortalContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<PortalContent, 'id' | 'updatedAt'>) =>
      apiFetch<PortalContent>('/api/library/portal-content', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-contents'] }) },
  })
}

export function useUpdatePortalContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: PortalContent) =>
      apiFetch<PortalContent>(`/api/library/portal-content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['portal-contents'] })
      void qc.invalidateQueries({ queryKey: ['portal-content'] })
    },
  })
}

export function useDeletePortalContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/portal-content/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-contents'] }) },
  })
}

// ── Portal News (Admin CMS) ───────────────────────────────────────

export function useGetPortalNews(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['portal-news', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params?.page) sp.set('page', String(params.page))
        if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<PortalNewsItem>>(`/api/library/portal-news?${sp.toString()}`)
      } catch {
        return paginate(MOCK_PORTAL_NEWS, params?.page ?? 1, params?.pageSize ?? 10)
      }
    },
  })
}

export function useGetPortalNewsItem(id: string) {
  return useQuery({
    queryKey: ['portal-news-item', id],
    queryFn: async () => {
      try { return await apiFetch<PortalNewsItem>(`/api/library/portal-news/${id}`) }
      catch { return MOCK_PORTAL_NEWS.find((n) => n.id === id) ?? MOCK_PORTAL_NEWS[0]! }
    },
    enabled: !!id,
  })
}

export function useCreatePortalNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<PortalNewsItem, 'id'>) =>
      apiFetch<PortalNewsItem>('/api/library/portal-news', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-news'] }) },
  })
}

export function useUpdatePortalNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: PortalNewsItem) =>
      apiFetch<PortalNewsItem>(`/api/library/portal-news/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['portal-news'] })
      void qc.invalidateQueries({ queryKey: ['portal-news-item'] })
    },
  })
}

export function useDeletePortalNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/portal-news/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-news'] }) },
  })
}

// ── E-Documents (Portal) ──────────────────────────────────────────

export function useGetEDocuments(params?: {
  search?: string
  category?: string
  year?: number
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['edocuments', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params?.search) sp.set('search', params.search)
        if (params?.category) sp.set('category', params.category)
        if (params?.year) sp.set('year', String(params.year))
        if (params?.page) sp.set('page', String(params.page))
        if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<EDocument>>(`/api/library/edocs?${sp.toString()}`)
      } catch {
        let docs = [...MOCK_EDOCS]
        if (params?.search) {
          const q = params.search.toLowerCase()
          docs = docs.filter((d) =>
            d.title.toLowerCase().includes(q) ||
            d.author.toLowerCase().includes(q) ||
            (d.tags ?? []).some((t) => t.toLowerCase().includes(q))
          )
        }
        if (params?.category) docs = docs.filter((d) => d.category === params.category)
        if (params?.year) docs = docs.filter((d) => d.publishYear === params.year)
        return paginate(docs, params?.page ?? 1, params?.pageSize ?? 12)
      }
    },
  })
}

export function useGetEDocument(id: string) {
  return useQuery({
    queryKey: ['edocument', id],
    queryFn: async () => {
      try { return await apiFetch<EDocument>(`/api/library/edocs/${id}`) }
      catch { return MOCK_EDOCS.find((d) => d.id === id) ?? MOCK_EDOCS[0]! }
    },
    enabled: !!id,
  })
}

// ── Email Settings ────────────────────────────────────────────────

export function useGetEmailSettings() {
  return useQuery({
    queryKey: ['library-email-settings'],
    queryFn: async () => {
      try { return await apiFetch<LibraryEmailSettings>('/api/library/settings/email') }
      catch { return MOCK_EMAIL_SETTINGS }
    },
  })
}

export function useUpdateEmailSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: LibraryEmailSettings) =>
      apiFetch<LibraryEmailSettings>('/api/library/settings/email', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-email-settings'] }) },
  })
}

// ── Language Settings ─────────────────────────────────────────────

export function useGetLanguageSettings() {
  return useQuery({
    queryKey: ['library-language-settings'],
    queryFn: async () => {
      try { return await apiFetch<LibraryLanguageSettings>('/api/library/settings/language') }
      catch { return MOCK_LANG_SETTINGS }
    },
  })
}

export function useUpdateLanguageSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: LibraryLanguageSettings) =>
      apiFetch<LibraryLanguageSettings>('/api/library/settings/language', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-language-settings'] }) },
  })
}

// ── Classification Systems ────────────────────────────────────────

export function useGetClassifications() {
  return useQuery({
    queryKey: ['library-classifications'],
    queryFn: async () => {
      try { return await apiFetch<ClassificationSystem[]>('/api/library/settings/classification') }
      catch { return MOCK_CLASSIFICATIONS }
    },
  })
}

export function useUpdateClassification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: ClassificationSystem) =>
      apiFetch<ClassificationSystem>(`/api/library/settings/classification/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-classifications'] }) },
  })
}

// ── Activity Logs ─────────────────────────────────────────────────

export function useGetActivityLogs(params?: {
  action?: string
  userId?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-activity-logs', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params?.action) sp.set('action', params.action)
        if (params?.userId) sp.set('userId', params.userId)
        if (params?.page) sp.set('page', String(params.page))
        if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<ActivityLog>>(`/api/library/activity-logs?${sp.toString()}`)
      } catch {
        let logs = [...MOCK_ACTIVITY_LOGS]
        if (params?.action) logs = logs.filter((l) => l.action === params.action)
        if (params?.userId) logs = logs.filter((l) => l.userId === params.userId)
        return paginate(logs, params?.page ?? 1, params?.pageSize ?? 20)
      }
    },
  })
}

export function useGetActivityLog(id: string) {
  return useQuery({
    queryKey: ['library-activity-log', id],
    queryFn: async () => {
      try { return await apiFetch<ActivityLog>(`/api/library/activity-logs/${id}`) }
      catch { return MOCK_ACTIVITY_LOGS.find((l) => l.id === id) ?? MOCK_ACTIVITY_LOGS[0]! }
    },
    enabled: !!id,
  })
}

// ── Purchase Orders ───────────────────────────────────────────────

export function useGetPurchaseOrders(params?: {
  status?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-purchase-orders', params],
    queryFn: async () => {
      try {
        const sp = new URLSearchParams()
        if (params?.status) sp.set('status', params.status)
        if (params?.page) sp.set('page', String(params.page))
        if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
        return await apiFetch<PaginatedResponse<PurchaseOrder>>(`/api/library/purchase-orders?${sp.toString()}`)
      } catch {
        let orders = [...MOCK_PURCHASE_ORDERS]
        if (params?.status) orders = orders.filter((o) => o.status === params.status)
        return paginate(orders, params?.page ?? 1, params?.pageSize ?? 20)
      }
    },
  })
}

export function useGetPurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['library-purchase-order', id],
    queryFn: async () => {
      try { return await apiFetch<PurchaseOrder>(`/api/library/purchase-orders/${id}`) }
      catch { return MOCK_PURCHASE_ORDERS.find((o) => o.id === id) ?? MOCK_PURCHASE_ORDERS[0]! }
    },
    enabled: !!id,
  })
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<PurchaseOrder, 'id' | 'requestedAt' | 'status'>) =>
      apiFetch<PurchaseOrder>('/api/library/purchase-orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-purchase-orders'] }) },
  })
}

export function useReviewPurchaseOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, reviewNote }: { id: string; status: 'approved' | 'rejected'; reviewNote?: string }) =>
      apiFetch<PurchaseOrder>(`/api/library/purchase-orders/${id}/review`, {
        method: 'PUT',
        body: JSON.stringify({ status, reviewNote }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-purchase-orders'] })
      void qc.invalidateQueries({ queryKey: ['library-purchase-order'] })
    },
  })
}

// ── Warehouse ─────────────────────────────────────────────────────

export function useGetWarehouseLogs() {
  return useQuery({
    queryKey: ['library-warehouse-logs'],
    queryFn: async () => {
      try { return await apiFetch<WarehouseLog[]>('/api/library/warehouse/logs') }
      catch { return MOCK_WAREHOUSE_LOGS }
    },
  })
}

export function useWarehouseAction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { action: 'open' | 'close'; note?: string }) =>
      apiFetch<WarehouseLog>('/api/library/warehouse/action', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-warehouse-logs'] }) },
  })
}

// ── Inventory Sessions ────────────────────────────────────────────

export function useGetInventorySessions() {
  return useQuery({
    queryKey: ['library-inventory-sessions'],
    queryFn: async () => {
      try { return await apiFetch<InventorySession[]>('/api/library/inventory') }
      catch { return MOCK_INVENTORY_SESSIONS }
    },
  })
}

export function useGetInventorySession(id: string) {
  return useQuery({
    queryKey: ['library-inventory-session', id],
    queryFn: async () => {
      try { return await apiFetch<InventorySession>(`/api/library/inventory/${id}`) }
      catch { return MOCK_INVENTORY_SESSIONS.find((s) => s.id === id) ?? MOCK_INVENTORY_SESSIONS[0]! }
    },
    enabled: !!id,
  })
}

export function useCreateInventorySession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<InventorySession, 'id' | 'status' | 'totalItems' | 'scannedItems'>) =>
      apiFetch<InventorySession>('/api/library/inventory', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-inventory-sessions'] }) },
  })
}

export function useUpdateInventorySession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<InventorySession> & { id: string }) =>
      apiFetch<InventorySession>(`/api/library/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-inventory-sessions'] })
      void qc.invalidateQueries({ queryKey: ['library-inventory-session'] })
    },
  })
}

// ── Inventory Items ───────────────────────────────────────────────

export function useGetInventoryItems(sessionId: string) {
  return useQuery({
    queryKey: ['library-inventory-items', sessionId],
    queryFn: async () => {
      try { return await apiFetch<InventoryItem[]>(`/api/library/inventory/${sessionId}/items`) }
      catch { return MOCK_INVENTORY_ITEMS.filter((it) => it.sessionId === sessionId) }
    },
    enabled: !!sessionId,
  })
}

export function useScanInventoryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { sessionId: string; copyCode: string }) =>
      apiFetch<InventoryItem>(`/api/library/inventory/${data.sessionId}/scan`, {
        method: 'POST',
        body: JSON.stringify({ copyCode: data.copyCode }),
      }),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: ['library-inventory-items', variables.sessionId] })
      void qc.invalidateQueries({ queryKey: ['library-inventory-session', variables.sessionId] })
    },
  })
}

// ── Pending Shelving ──────────────────────────────────────────────

export function useGetPendingShelvingItems() {
  return useQuery({
    queryKey: ['library-pending-shelving'],
    queryFn: async () => {
      try { return await apiFetch<PendingShelvingItem[]>('/api/library/shelving/pending') }
      catch { return MOCK_PENDING_SHELVING }
    },
  })
}

export function useUpdateShelvingItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<PendingShelvingItem> & { id: string }) =>
      apiFetch<PendingShelvingItem>(`/api/library/shelving/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-pending-shelving'] }) },
  })
}

export function useConfirmShelving() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/shelving/${id}/confirm`, { method: 'POST' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-pending-shelving'] }) },
  })
}

// ── Accession ─────────────────────────────────────────────────────

export function useGetAccessionItems() {
  return useQuery({
    queryKey: ['library-accession'],
    queryFn: async () => {
      try { return await apiFetch<AccessionItem[]>('/api/library/accession') }
      catch { return MOCK_ACCESSION_ITEMS }
    },
  })
}

export function useUpdateAccessionItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<AccessionItem> & { id: string }) =>
      apiFetch<AccessionItem>(`/api/library/accession/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-accession'] }) },
  })
}

