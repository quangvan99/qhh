---
title: "WF-03b: Thi trực tuyến – Người học (Web)"
cluster: "Learning - Student / Online Exam"
updated: 2026-03-11
---

# WF-03b: Thi trực tuyến – Người học

> **Phạm vi:** Toàn bộ luồng thi trực tuyến trên trình duyệt Web của học sinh (HV) – từ tìm kiếm bài thi bên ngoài lớp học, đăng ký tham gia, vào phòng thi, làm bài, nộp bài, đến xem kết quả.

---

## Mục lục màn hình

| Mã            | Tên màn hình                        | Ghi chú                                  |
|---------------|-------------------------------------|------------------------------------------|
| SCR-03b-001   | Danh sách bài thi (ngoài lớp học)   | Tìm kiếm, lọc năm, phân trang           |
| SCR-03b-002   | Chi tiết bài thi & Đăng ký thi      | Xem thông tin + form đăng ký             |
| SCR-03b-003a  | Thông tin ca thi (trước khi vào thi)| Bước xác nhận trước khi bắt đầu         |
| SCR-03b-003b  | Phòng thi / Làm bài thi             | Màn hình chính – timer, câu hỏi, nav    |
| SCR-03b-003c  | Xác nhận nộp bài (modal)            | Dialog cảnh báo trước khi nộp           |
| SCR-03b-004a  | Kết quả thi – Tóm tắt               | Điểm số, thống kê tổng quan             |
| SCR-03b-004b  | Kết quả thi – Chi tiết từng câu     | Review đáp án đúng/sai từng câu hỏi     |

---

## SCR-03b-001: Danh sách bài thi (ngoài lớp học)

### 1. Mô tả
Học sinh truy cập mục **"Bài thi"** trên menu để xem toàn bộ danh sách kỳ thi bên ngoài lớp học. Hỗ trợ tìm kiếm theo từ khóa, lọc theo năm, phân trang và chọn số bản ghi/trang.

### 2. Actors
- **Chính:** Học sinh (HV) đã đăng nhập
- **Hệ thống:** Backend truy vấn danh sách bài thi được phép xem

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Khóa học] [Bài thi ●] [Kết quả]  ...  👤 Nguyễn Văn A  ▼     ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║  📋 Danh sách bài thi                                                                ║
║  Trang chủ > Bài thi                                                                 ║
║                                                                                      ║
║ ┌──────────────────────────────────────────────────────────────────────────────────┐ ║
║ │  BỘ LỌC & TÌM KIẾM                                                              │ ║
║ │                                                                                  │ ║
║ │  🔍 [ Nhập tên bài thi, môn học...                              ] [Tìm kiếm]    │ ║
║ │                                                                                  │ ║
║ │  Năm học: [▼ Tất cả năm ]   Trạng thái: [▼ Tất cả ]   Môn: [▼ Tất cả môn ]    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║  Hiển thị [▼ 10 ] bản ghi / trang              Tổng: 48 bài thi                     ║
║                                                                                      ║
║ ┌──────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ STT │ Tên bài thi              │ Môn học  │ Năm  │ Thời gian thi │ Trạng thái   │ ║
║ ├─────┼──────────────────────────┼──────────┼──────┼───────────────┼──────────────┤ ║
║ │  1  │ Kiểm tra HK1 – Toán 10  │ Toán học │ 2026 │ 60 phút       │ [Đăng ký]    │ ║
║ ├─────┼──────────────────────────┼──────────┼──────┼───────────────┼──────────────┤ ║
║ │  2  │ Thi thử THPT – Vật Lý   │ Vật lý   │ 2026 │ 90 phút       │ [Đã đăng ký] │ ║
║ ├─────┼──────────────────────────┼──────────┼──────┼───────────────┼──────────────┤ ║
║ │  3  │ Kiểm tra giữa kỳ – Hóa  │ Hóa học  │ 2025 │ 45 phút       │ [Đã thi]     │ ║
║ ├─────┼──────────────────────────┼──────────┼──────┼───────────────┼──────────────┤ ║
║ │  4  │ Đánh giá năng lực T.Anh  │ Tiếng Anh│ 2026 │ 120 phút      │ [Đăng ký]    │ ║
║ ├─────┼──────────────────────────┼──────────┼──────┼───────────────┼──────────────┤ ║
║ │  5  │ Thi cuối kỳ – Lịch sử   │ Lịch sử  │ 2025 │ 50 phút       │ [Xem kết quả]│ ║
║ ├─────┼──────────────────────────┼──────────┼──────┼───────────────┼──────────────┤ ║
║ │ ... │ ...                      │ ...      │ ...  │ ...           │ ...          │ ║
║ └──────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║              [◀ Trước]  1  [2]  [3]  ...  [5]  [Sau ▶]                              ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  LEGEND – Màu trạng thái nút hành động:
  ┌─────────────────┬───────────────────────────────────────────────────────┐
  │ [Đăng ký]       │  Xanh lá  – Bài thi đang mở đăng ký                  │
  │ [Đã đăng ký]    │  Xanh dương – Đã đăng ký, chờ đến giờ thi            │
  │ [Làm bài]       │  Cam đậm  – Đang trong thời gian thi                  │
  │ [Đã thi]        │  Xám      – Đã nộp, chờ công bố kết quả              │
  │ [Xem kết quả]   │  Tím      – Có thể xem kết quả                        │
  └─────────────────┴───────────────────────────────────────────────────────┘
```

### 4. Components
| Component            | Loại       | Mô tả                                                          |
|----------------------|------------|----------------------------------------------------------------|
| SearchBar            | Input      | Tìm kiếm full-text theo tên bài thi, môn học                   |
| YearFilter           | Select     | Dropdown lọc theo năm học (2023, 2024, 2025, 2026, Tất cả)    |
| StatusFilter         | Select     | Lọc: Tất cả / Đang mở / Đã đăng ký / Đã thi                   |
| SubjectFilter        | Select     | Lọc theo môn học                                               |
| ExamTable            | Table      | Danh sách bài thi với các cột: STT, Tên, Môn, Năm, TG, Trạng thái |
| ActionButton         | Button     | Nút hành động động theo trạng thái (Đăng ký / Làm bài / Xem KQ) |
| PageSizeSelector     | Select     | Chọn số bản ghi/trang: 10 / 20 / 50                            |
| Pagination           | Nav        | Điều hướng phân trang                                           |

### 5. Flow điều hướng
```
[Menu: Bài thi] ──► SCR-03b-001
                         │
           ┌─────────────┼──────────────────────┐
           ▼             ▼                      ▼
   [Tìm kiếm/Lọc]  [Click tên bài thi]   [Click Đăng ký]
    (reload list)   → SCR-03b-002 (chi tiết)  → SCR-03b-002 (focus form đăng ký)
                                          [Click Làm bài]
                                          → SCR-03b-003a (thông tin ca thi)
                                          [Click Xem kết quả]
                                          → SCR-03b-004a
```

### 6. Business Rules
- **BR-001:** Chỉ hiển thị bài thi mà học sinh có quyền xem (theo phân quyền vai trò).
- **BR-002:** Bài thi đã quá hạn đăng ký → ẩn nút [Đăng ký], chỉ hiển thị trạng thái.
- **BR-003:** Học sinh đã thi → không thể đăng ký lại lần nữa trong cùng ca thi.
- **BR-004:** Tìm kiếm không phân biệt hoa thường, hỗ trợ tên viết tắt.
- **BR-005:** Mặc định sắp xếp theo ngày thi giảm dần (mới nhất lên đầu).

### 7. API
| Method | Endpoint                          | Mô tả                            |
|--------|-----------------------------------|----------------------------------|
| GET    | `/api/exams?keyword=&year=&page=` | Lấy danh sách bài thi có phân trang & lọc |
| GET    | `/api/exams/years`                | Lấy danh sách năm học để populate dropdown |

---

## SCR-03b-002: Chi tiết bài thi & Đăng ký tham gia thi

### 1. Mô tả
Học sinh xem thông tin chi tiết một kỳ thi (mô tả, môn học, số câu, thời gian, danh sách ca thi) và thực hiện đăng ký tham gia. Sau khi đăng ký thành công, hệ thống cập nhật trạng thái.

### 2. Actors
- **Chính:** Học sinh (HV)
- **Hệ thống:** Ghi nhận đăng ký, kiểm tra điều kiện

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Khóa học] [Bài thi ●] [Kết quả]           👤 Nguyễn Văn A ▼  ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║  ← Quay lại danh sách bài thi                                                        ║
║                                                                                      ║
║  ┌────────────────────────────────────────────────────────────────────────────────┐  ║
║  │ 📝  KIỂM TRA HỌC KỲ 1 – TOÁN 10                                               │  ║
║  │     Môn học: Toán học  │  Năm học: 2025–2026  │  Cấp độ: Trung học phổ thông  │  ║
║  └────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                      ║
║  ┌─────────────────────────────────┐  ┌─────────────────────────────────────────┐   ║
║  │  THÔNG TIN BÀI THI              │  │  ĐĂNG KÝ THAM GIA THI                   │   ║
║  │─────────────────────────────────│  │─────────────────────────────────────────│   ║
║  │  📚 Môn học : Toán học          │  │  Họ và tên : Nguyễn Văn A  (tự điền)   │   ║
║  │  ⏱  Thời gian: 60 phút         │  │  Ngày sinh : [────────────────]  📅     │   ║
║  │  ❓ Số câu hỏi: 40 câu          │  │  Số CMND   : [────────────────────────] │   ║
║  │  📅 Mở đăng ký: 01/03/2026     │  │  Số báo danh: [────────────────────────] │   ║
║  │  📅 Đóng đăng ký: 14/03/2026   │  │                                          │   ║
║  │  🏷  Hình thức: Trắc nghiệm    │  │  Chọn ca thi:                            │   ║
║  │  📖 Mô tả:                      │  │  ┌──────────────────────────────────┐   │   ║
║  │  Kiểm tra kiến thức học kỳ 1    │  │  │ ○ Ca 1: 08:00 – 09:00 (15/3)   │   │   ║
║  │  chương trình Toán lớp 10,      │  │  │   Còn 24/30 chỗ                │   │   ║
║  │  gồm đại số và hình học.        │  │  │ ● Ca 2: 14:00 – 15:00 (15/3)   │   │   ║
║  │                                 │  │  │   Còn 18/30 chỗ                │   │   ║
║  │  ───────────────────────────    │  │  │ ○ Ca 3: 08:00 – 09:00 (16/3)   │   │   ║
║  │  CA THI HIỆN CÓ                 │  │  │   Còn 30/30 chỗ                │   │   ║
║  │  • Ca 1: Sáng 15/3/2026        │  │  └──────────────────────────────────┘   │   ║
║  │  • Ca 2: Chiều 15/3/2026       │  │                                          │   ║
║  │  • Ca 3: Sáng 16/3/2026        │  │  ┌──────────────────────────────────┐   │   ║
║  │                                 │  │  │    ✅  ĐĂNG KÝ THAM GIA THI     │   │   ║
║  └─────────────────────────────────┘  │  └──────────────────────────────────┘   │   ║
║                                        │  * Nhấn Đăng ký để xác nhận tham gia   │   ║
║                                        └─────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌────────────────────────────────────────────────────────────────────────────────┐  ║
║  │ ⓘ  LƯU Ý                                                                       │  ║
║  │  • Học sinh chỉ được đăng ký 1 ca thi cho mỗi kỳ thi.                         │  ║
║  │  • Sau khi đăng ký, không thể thay đổi ca thi trừ khi BTC cho phép.           │  ║
║  │  • Vui lòng có mặt trước giờ thi 15 phút.                                      │  ║
║  └────────────────────────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  [TOAST SUCCESS] ✅ Đăng ký thành công ca thi 2 – Kiểm tra HK1 Toán 10
  Nút [ĐĂNG KÝ] → chuyển thành [✓ ĐÃ ĐĂNG KÝ] (disabled, màu xanh dương)
```

### 4. Components
| Component         | Loại    | Mô tả                                                              |
|-------------------|---------|--------------------------------------------------------------------|
| ExamInfoCard      | Card    | Thông tin tổng quan bài thi (môn, thời gian, số câu, mô tả)       |
| SessionList       | List    | Danh sách ca thi kèm slot còn trống                                |
| RegisterForm      | Form    | Form đăng ký: họ tên, ngày sinh, CMND, số báo danh, chọn ca      |
| SessionRadioGroup | Radio   | Chọn 1 trong nhiều ca thi                                          |
| RegisterButton    | Button  | Nút đăng ký – chuyển sang disabled sau khi đăng ký thành công     |
| ToastNotification | Toast   | Thông báo đăng ký thành công / thất bại                            |
| NoteBox           | Alert   | Hộp thông tin lưu ý cho học sinh                                   |

### 5. Flow điều hướng
```
SCR-03b-001 ──► SCR-03b-002
                     │
         ┌───────────┴─────────────┐
         ▼                         ▼
  [Điền form + Chọn ca]      [Không đăng ký]
  → [ĐĂNG KÝ] click             → ← Quay lại
         │
         ▼
  POST /api/exam-registrations
         │
    ┌────┴─────┐
    ▼          ▼
  Thành công  Lỗi (hết slot,
  → Toast ✅   trùng ca, ...)
  → Nút disabled → Toast ❌
```

### 6. Business Rules
- **BR-006:** Mỗi học sinh chỉ được đăng ký **1 ca thi** cho 1 kỳ thi.
- **BR-007:** Ca thi đã đủ slot → hiển thị "Hết chỗ", không cho chọn radio.
- **BR-008:** Thời hạn đăng ký đã qua → ẩn form, chỉ hiển thị thông báo.
- **BR-009:** Học sinh đã đăng ký trước đó → load màn hình với trạng thái đã đăng ký (không hiện form).

### 7. API
| Method | Endpoint                          | Mô tả                            |
|--------|-----------------------------------|----------------------------------|
| GET    | `/api/exams/{examId}`             | Chi tiết bài thi                 |
| GET    | `/api/exams/{examId}/sessions`    | Danh sách ca thi và slot còn trống |
| POST   | `/api/exam-registrations`         | Đăng ký tham gia thi (body: examId, sessionId, studentInfo) |

---

## SCR-03b-003a: Thông tin ca thi (Cửa vào phòng thi)

### 1. Mô tả
Màn hình trung gian trước khi học sinh vào phòng thi. Hiển thị đầy đủ thông tin ca thi, nội quy và nút **"Bắt đầu thi"**. Nhấn bắt đầu sẽ chính thức ghi nhận thời điểm vào thi và khởi động đồng hồ đếm ngược.

### 2. Actors
- **Chính:** Học sinh (HV) đã đăng ký, đang trong thời gian thi hợp lệ
- **Hệ thống:** Khởi tạo session thi, tải câu hỏi

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  LOGO                                                          👤 Nguyễn Văn A ▼   ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║              ┌──────────────────────────────────────────────────────┐               ║
║              │          🎓  THÔNG TIN CA THI                        │               ║
║              ├──────────────────────────────────────────────────────┤               ║
║              │                                                      │               ║
║              │  📋 Tên bài thi : Kiểm tra HK1 – Toán 10            │               ║
║              │  📚 Môn học     : Toán học                           │               ║
║              │  👤 Thí sinh    : Nguyễn Văn A                       │               ║
║              │  🏷  Số báo danh: 2026-T10-042                       │               ║
║              │                                                      │               ║
║              │  ──────────────────────────────────────────          │               ║
║              │  🕐 Ca thi      : Ca 2 – Chiều 15/03/2026            │               ║
║              │  🕑 Giờ bắt đầu : 14:00                              │               ║
║              │  🕔 Giờ kết thúc: 15:00                              │               ║
║              │  ⏱  Thời gian thi: 60 phút                          │               ║
║              │  ❓ Số câu hỏi  : 40 câu trắc nghiệm                │               ║
║              │  🏆 Điểm đạt   : ≥ 5.0 / 10.0                       │               ║
║              │                                                      │               ║
║              │  ──────────────────────────────────────────          │               ║
║              │  📌 NỘI QUY THI                                      │               ║
║              │  • Không được thoát khỏi trang trong khi thi.       │               ║
║              │  • Không sử dụng tài liệu nếu không được phép.      │               ║
║              │  • Hết giờ hệ thống sẽ tự động nộp bài.            │               ║
║              │  • Mỗi câu chỉ có 1 đáp án đúng.                   │               ║
║              │                                                      │               ║
║              │  ┌─────────────────────────────────────────────┐    │               ║
║              │  │  ☑  Tôi đã đọc và đồng ý với nội quy thi   │    │               ║
║              │  └─────────────────────────────────────────────┘    │               ║
║              │                                                      │               ║
║              │          ┌───────────────────────────┐              │               ║
║              │          │   🚀  BẮT ĐẦU THI         │              │               ║
║              │          └───────────────────────────┘              │               ║
║              │          (Nút active sau khi tick đồng ý)           │               ║
║              │                                                      │               ║
║              └──────────────────────────────────────────────────────┘               ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  ⚠  Cảnh báo: Nếu chưa đến giờ thi, nút [BẮT ĐẦU THI] bị disabled và hiển thị
     countdown: "Còn 00:45:30 đến giờ thi"
```

### 4. Components
| Component       | Loại     | Mô tả                                                          |
|-----------------|----------|----------------------------------------------------------------|
| SessionInfoCard | Card     | Thông tin đầy đủ ca thi: tên bài, thí sinh, giờ, số câu       |
| RulesBox        | List     | Danh sách nội quy phòng thi                                    |
| AgreeCheckbox   | Checkbox | Xác nhận đọc nội quy – required trước khi bấm Bắt đầu         |
| StartButton     | Button   | Nút "Bắt đầu thi" – disabled cho đến khi tick đồng ý          |
| PreCountdown    | Timer    | Đếm ngược đến giờ thi (nếu chưa đến giờ)                      |

### 5. Flow điều hướng
```
SCR-03b-002 ──► SCR-03b-003a
(hoặc từ danh sách bài thi → click [Làm bài])
                     │
              [Tick đồng ý nội quy]
              + [BẮT ĐẦU THI]
                     │
              POST /api/exam-sessions/{sessionId}/start
                     │
                     ▼
              SCR-03b-003b (Phòng thi)
```

### 6. Business Rules
- **BR-010:** Nút "Bắt đầu thi" chỉ active khi học sinh tick xác nhận nội quy.
- **BR-011:** Nếu chưa đến giờ thi → hiển thị đếm ngược, nút disabled.
- **BR-012:** Nếu đã quá giờ thi → hiển thị thông báo "Ca thi đã kết thúc".
- **BR-013:** Nếu học sinh đã bắt đầu thi trước đó (F5/tắt browser) → tự động load lại phòng thi với thời gian còn lại.

### 7. API
| Method | Endpoint                                   | Mô tả                               |
|--------|--------------------------------------------|-------------------------------------|
| GET    | `/api/exam-sessions/{sessionId}/my-info`   | Lấy thông tin ca thi của thí sinh   |
| POST   | `/api/exam-sessions/{sessionId}/start`     | Ghi nhận thời điểm bắt đầu thi, trả về attemptId + danh sách câu hỏi |

---

## SCR-03b-003b: Phòng thi / Làm bài thi

### 1. Mô tả
Màn hình **cốt lõi** của luồng thi. Gồm 3 vùng chính: (1) Header với đồng hồ đếm ngược và thông tin bài thi; (2) Vùng câu hỏi + đáp án (2/3 màn hình); (3) Panel điều hướng câu hỏi dạng grid số bên phải (1/3 màn hình). Học sinh có thể tích chọn đáp án, đánh dấu câu hỏi, chuyển câu tùy ý và nộp bài.

### 2. Actors
- **Chính:** Học sinh (HV) đang trong ca thi hợp lệ
- **Hệ thống:** Cập nhật đồng hồ real-time, lưu đáp án tạm thời, auto-submit khi hết giờ

### 3. ASCII Wireframe – Layout tổng thể

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░  HEADER PHÒNG THI  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║  📝 Kiểm tra HK1 – Toán 10       👤 Nguyễn Văn A  │  Số BD: 2026-T10-042           ║
║  ─────────────────────────────────────────────────────────────────────────────────  ║
║                                                                                      ║
║     ┌──────────────────────────────────────────┐      ┌──────────────────────────┐  ║
║     │          ⏱  THỜI GIAN CÒN LẠI            │      │   Câu đang làm: 7 / 40   │  ║
║     │                                          │      └──────────────────────────┘  ║
║     │           ╔═══════════════╗              │                                     ║
║     │           ║  00 : 43 : 17 ║              │                                     ║
║     │           ╚═══════════════╝              │                                     ║
║     │        (đỏ khi còn < 5 phút)             │                                     ║
║     └──────────────────────────────────────────┘                                    ║
╠════════════════════════════════════════╦═════════════════════════════════════════════╣
║                                        ║                                             ║
║   VÙNG CÂU HỎI  (chiếm ~65% width)   ║  PANEL ĐIỀU HƯỚNG  (~35% width)            ║
║                                        ║                                             ║
║  ┌──────────────────────────────────┐  ║  ┌─────────────────────────────────────┐   ║
║  │ Câu 7 / 40                   🚩 │  ║  │  DANH SÁCH CÂU HỎI                 │   ║
║  │  [Đánh dấu câu này]            │  ║  │─────────────────────────────────────│   ║
║  ├──────────────────────────────────┤  ║  │                                     │   ║
║  │                                  │  ║  │  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐  │   ║
║  │  Cho hàm số f(x) = 2x² – 3x + 1 │  ║  │  │ 1│ 2│ 3│ 4│ 5│ 6│▶7│ 8│ 9│10│  │   ║
║  │  Tập xác định của f(x) là?       │  ║  │  ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  │   ║
║  │                                  │  ║  │  │11│12│13│14│15│16│17│18│19│20│  │   ║
║  │  ───────────────────────         │  ║  │  ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  │   ║
║  │                                  │  ║  │  │21│22│23│24│25│26│27│28│29│30│  │   ║
║  │  ○  A.  ℝ \ {0}                  │  ║  │  ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  │   ║
║  │                                  │  ║  │  │31│32│33│34│35│36│37│38│39│40│  │   ║
║  │  ●  B.  ℝ   ◀ (đã chọn)         │  ║  │  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘  │   ║
║  │                                  │  ║  │                                     │   ║
║  │  ○  C.  (0; +∞)                  │  ║  │  CHÚ THÍCH MÀU                     │   ║
║  │                                  │  ║  │  ┌───┐  Đang xem  (viền xanh đậm) │   ║
║  │  ○  D.  ℝ \ {1/2}               │  ║  │  │▶7 │                              │   ║
║  │                                  │  ║  │  └───┘                              │   ║
║  │                                  │  ║  │  ┌───┐  Đã làm   (nền xanh lá)    │   ║
║  └──────────────────────────────────┘  ║  │  │ 3 │                              │   ║
║                                        ║  │  └───┘                              │   ║
║  ┌──────────────────────────────────┐  ║  │  ┌───┐  Đánh dấu (nền vàng + 🚩)  │   ║
║  │  [◀ Câu trước]  [Câu sau ▶]    │  ║  │  │🚩5│                              │   ║
║  └──────────────────────────────────┘  ║  │  └───┘                              │   ║
║                                        ║  │  ┌───┐  Chưa làm  (nền trắng)      │   ║
║                                        ║  │  │ 9 │                              │   ║
║                                        ║  │  └───┘                              │   ║
║                                        ║  │                                     │   ║
║                                        ║  │  Tóm tắt:                          │   ║
║                                        ║  │  ✅ Đã làm  : 18 / 40              │   ║
║                                        ║  │  ⬜ Chưa làm: 20 / 40              │   ║
║                                        ║  │  🚩 Đánh dấu:  2 / 40              │   ║
║                                        ║  │                                     │   ║
║                                        ║  │  ┌───────────────────────────────┐  │   ║
║                                        ║  │  │  ⚠  NỘP BÀI                  │  │   ║
║                                        ║  │  └───────────────────────────────┘  │   ║
║                                        ║  └─────────────────────────────────────┘   ║
╚════════════════════════════════════════╩═════════════════════════════════════════════╝
```

### 3b. ASCII Wireframe – Trạng thái đồng hồ cảnh báo (<5 phút)

```
  ╔══════════════════╗
  ║  ⚠  00 : 04 : 32 ║   ← Font đỏ, background nhấp nháy
  ╚══════════════════╝
  ⚠ Còn ít hơn 5 phút! Hãy nộp bài sớm.
```

### 3c. ASCII Wireframe – Câu hỏi dạng nhiều đáp án đúng

```
  ┌──────────────────────────────────────────────────────────────┐
  │ Câu 15 / 40                [Nhiều đáp án]               🚩  │
  ├──────────────────────────────────────────────────────────────┤
  │                                                              │
  │  Trong các mệnh đề sau, mệnh đề nào ĐÚNG?                   │
  │  (Chọn tất cả đáp án đúng)                                   │
  │                                                              │
  │  ☑  A.  sin²x + cos²x = 1        ◀ đã chọn                 │
  │  ☐  B.  tan x = sin x / cos x    (chưa chọn)               │
  │  ☑  C.  |sin x| ≤ 1              ◀ đã chọn                 │
  │  ☐  D.  cos 2x = cos²x + sin²x                              │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘
```

### 3d. ASCII Wireframe – Grid điều hướng câu hỏi (chi tiết trạng thái)

```
  PANEL ĐIỀU HƯỚNG CÂU HỎI
  ┌───────────────────────────────────────────────────────────┐
  │                  DANH SÁCH CÂU HỎI                        │
  ├───────────────────────────────────────────────────────────┤
  │                                                           │
  │   ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐    │
  │   │ ✅1│ ✅2│ ✅3│ ✅4│🚩 5│ ✅6│[▶7]│    8│    9│   10│   │
  │   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤    │
  │   │   11│   12│✅13│✅14│   15│   16│   17│✅18│   19│   20│   │
  │   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤    │
  │   │   21│   22│   23│   24│   25│   26│   27│   28│   29│   30│   │
  │   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤    │
  │   │   31│   32│   33│   34│   35│   36│   37│   38│   39│   40│   │
  │   └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘    │
  │                                                           │
  │  ✅ = Đã trả lời (nền xanh lá)                           │
  │  🚩 = Đánh dấu review (nền vàng)                         │
  │  [▶] = Câu đang hiển thị (viền xanh dương đậm)           │
  │      = Chưa làm (nền trắng / xám nhạt)                   │
  │                                                           │
  ├───────────────────────────────────────────────────────────┤
  │  Thống kê:  ✅ 18  │  🚩 2  │  ⬜ 20                      │
  ├───────────────────────────────────────────────────────────┤
  │                                                           │
  │       ╔═══════════════════════════════╗                   │
  │       ║   ⚠  NỘP BÀI THI            ║                   │
  │       ╚═══════════════════════════════╝                   │
  │                                                           │
  └───────────────────────────────────────────────────────────┘
```

### 4. Components
| Component           | Loại      | Mô tả                                                                     |
|---------------------|-----------|---------------------------------------------------------------------------|
| ExamHeader          | Header    | Tên bài thi, thông tin thí sinh, số báo danh                              |
| CountdownTimer      | Timer     | Đồng hồ đếm ngược HH:MM:SS, cập nhật mỗi giây (WebSocket hoặc setInterval) |
| QuestionPanel       | Container | Hiển thị số câu hiện tại, nội dung câu hỏi, danh sách đáp án             |
| AnswerOption        | Radio/Checkbox | 1 đáp án: Radio button; nhiều đáp án: Checkbox                    |
| FlagButton          | Button    | Nút 🚩 đánh dấu/bỏ đánh dấu câu hỏi hiện tại                            |
| PrevNextNav         | Button    | Nút [◀ Câu trước] và [Câu sau ▶]                                         |
| QuestionGridNav     | Grid      | Panel 40 ô số (4×10), màu sắc thể hiện trạng thái từng câu               |
| ProgressSummary     | Stat      | Tóm tắt: Đã làm / Chưa làm / Đánh dấu                                    |
| SubmitButton        | Button    | Nút "⚠ Nộp bài" – kích hoạt modal xác nhận                               |

### 5. Flow điều hướng
```
SCR-03b-003a ──► SCR-03b-003b (Phòng thi)
                         │
         ┌───────────────┼──────────────────────────────┐
         ▼               ▼                              ▼
  [Tích đáp án]  [Click số câu trên grid]     [Click 🚩 Đánh dấu]
  → PATCH /api/  → Cuộn/chuyển tới câu         → PATCH trạng thái
    attempts/      hỏi tương ứng                 câu hỏi = flagged
    {id}/answers
         │
         ▼
  [Click NỘP BÀI]
         │
         ▼
  SCR-03b-003c (Modal xác nhận nộp)
         │
    ┌────┴──────┐
    ▼           ▼
  [Xác nhận]  [Hủy – ở lại]
    → POST      → đóng modal
    /submit
    → SCR-03b-004a (Kết quả)

  [Hết giờ – auto submit]
  → hệ thống gọi /submit tự động
  → SCR-03b-004a
```

### 6. Business Rules
- **BR-014:** Đồng hồ được tính từ server (`startTime + duration`), không phụ thuộc client clock để tránh gian lận.
- **BR-015:** Mỗi lần học sinh chọn đáp án → gọi API lưu tạm thời (auto-save), không cần bấm Save thủ công.
- **BR-016:** Khi còn **5 phút** → đồng hồ chuyển màu đỏ, hiển thị toast cảnh báo.
- **BR-017:** Khi còn **1 phút** → toast cảnh báo lần 2, rung/nhấp nháy mạnh hơn.
- **BR-018:** Khi hết giờ (`remainingTime = 0`) → hệ thống **tự động nộp bài**, hiển thị thông báo "Hết giờ! Bài thi đã được nộp tự động".
- **BR-019:** Học sinh có thể đánh dấu (flag) bất kỳ câu nào, flag là toggle (bấm lại để bỏ đánh dấu).
- **BR-020:** Click vào ô số trên grid → nhảy đến câu hỏi đó ngay lập tức (không cần duyệt tuần tự).
- **BR-021:** Học sinh có thể đổi đáp án bất kỳ lúc nào trước khi nộp / hết giờ.
- **BR-022:** Nếu trang bị refresh/mất kết nối và học sinh vào lại → load lại phiên thi với `attemptId` đã có, giữ nguyên đáp án đã lưu và thời gian còn lại theo server.

### 7. API
| Method | Endpoint                                        | Mô tả                                            |
|--------|-------------------------------------------------|--------------------------------------------------|
| GET    | `/api/attempts/{attemptId}/questions`           | Lấy danh sách câu hỏi + đáp án (đã randomize)   |
| GET    | `/api/attempts/{attemptId}/remaining-time`      | Lấy thời gian còn lại từ server                  |
| PATCH  | `/api/attempts/{attemptId}/answers`             | Lưu đáp án tạm thời (body: questionId, answer)  |
| PATCH  | `/api/attempts/{attemptId}/flag`                | Đánh dấu / bỏ đánh dấu câu hỏi                  |
| POST   | `/api/attempts/{attemptId}/submit`              | Nộp bài – trả về kết quả (nếu chấm ngay)        |

---

## SCR-03b-003c: Modal xác nhận nộp bài

### 1. Mô tả
Dialog xác nhận trước khi nộp bài. Hiển thị tóm tắt số câu đã làm, chưa làm, đánh dấu để học sinh cân nhắc lần cuối trước khi xác nhận.

### 2. ASCII Wireframe

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                    ⚠  XÁC NHẬN NỘP BÀI                     ║
  ╠══════════════════════════════════════════════════════════════╣
  ║                                                              ║
  ║   Bạn có chắc chắn muốn nộp bài không?                     ║
  ║   Sau khi nộp, bạn không thể sửa đổi đáp án.               ║
  ║                                                              ║
  ║   ┌──────────────────────────────────────────────────────┐  ║
  ║   │  📊 TỔNG KẾT BÀI LÀM                                │  ║
  ║   │                                                      │  ║
  ║   │   ✅  Câu đã trả lời  :  18 / 40                    │  ║
  ║   │   ⬜  Câu chưa trả lời:  20 / 40                    │  ║
  ║   │   🚩  Câu đánh dấu   :   2 / 40                    │  ║
  ║   │                                                      │  ║
  ║   │   ⏱  Thời gian còn lại: 00:43:17                    │  ║
  ║   └──────────────────────────────────────────────────────┘  ║
  ║                                                              ║
  ║   ┌──────────────────┐        ┌─────────────────────────┐   ║
  ║   │  ← Tiếp tục làm  │        │   ✅  XÁC NHẬN NỘP BÀI │   ║
  ║   └──────────────────┘        └─────────────────────────┘   ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝

  Nền phía sau bị mờ (overlay). Modal không có nút [X] đóng –
  chỉ thoát bằng nút [← Tiếp tục làm].
```

### 3. Business Rules
- **BR-023:** Nếu còn câu chưa làm → hiển thị cảnh báo nổi bật màu cam "Bạn còn 20 câu chưa trả lời".
- **BR-024:** Nếu có câu đánh dấu → nhắc "Bạn có 2 câu đang đánh dấu, hãy xem lại trước khi nộp".
- **BR-025:** Modal không có nút [X] để tránh vô tình đóng nhầm thành xác nhận nộp.

---

## SCR-03b-004a: Kết quả thi – Tóm tắt

### 1. Mô tả
Sau khi nộp bài (thủ công hoặc tự động), học sinh được chuyển đến màn hình kết quả. Hiển thị điểm số, tỷ lệ đúng/sai, thời gian làm bài và trạng thái đạt/không đạt.

### 2. Actors
- **Chính:** Học sinh (HV) đã nộp bài
- **Hệ thống:** Chấm điểm tự động (trắc nghiệm), trả kết quả

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Khóa học] [Bài thi] [Kết quả ●]           👤 Nguyễn Văn A ▼  ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║  ┌────────────────────────────────────────────────────────────────────────────────┐  ║
║  │                    🎉  KẾT QUẢ BÀI THI                                         │  ║
║  │                  Kiểm tra HK1 – Toán 10                                        │  ║
║  │                  Ngày thi: 15/03/2026  │  Ca 2: 14:00 – 15:00                  │  ║
║  └────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                      ║
║   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────────┐    ║
║   │   ĐIỂM SỐ          │  │  TỶ LỆ ĐÚNG         │  │  THỜI GIAN LÀM BÀI         │    ║
║   │                    │  │                    │  │                            │    ║
║   │      7.5 / 10      │  │       30 / 40      │  │      00 : 16 : 43          │    ║
║   │                    │  │       (75%)        │  │  (Còn dư 43 phút 17 giây) │    ║
║   │   ✅  ĐẠT          │  │  ● ●●●●●●●●●●●○○  │  │                            │    ║
║   │   (Ngưỡng: 5.0)    │  │  [progress bar]   │  │                            │    ║
║   └────────────────────┘  └────────────────────┘  └────────────────────────────┘    ║
║                                                                                      ║
║   ┌────────────────────────────────────────────────────────────────────────────────┐ ║
║   │  📊  PHÂN TÍCH KẾT QUẢ                                                         │ ║
║   │                                                                                │ ║
║   │   ✅  Trả lời đúng  : 30 câu  ████████████████████████████████░░░░  75%        │ ║
║   │   ❌  Trả lời sai   :  8 câu  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  20%        │ ║
║   │   ⬜  Bỏ qua       :  2 câu  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   5%        │ ║
║   │                                                                                │ ║
║   └────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║   ┌────────────────────────────────────────────────────────────────────────────────┐ ║
║   │  📋  THÔNG TIN CHI TIẾT                                                        │ ║
║   │  Họ tên    : Nguyễn Văn A          Số báo danh : 2026-T10-042                 │ ║
║   │  Môn thi   : Toán học              Hình thức   : Trắc nghiệm (40 câu)         │ ║
║   │  Xếp hạng  : 12 / 120 thí sinh     Điểm trung bình lớp: 6.8                  │ ║
║   └────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║   ┌────────────────────────┐     ┌────────────────────────────────────────────────┐  ║
║   │  ← Về danh sách bài thi│     │   🔍  XEM CHI TIẾT TỪNG CÂU HỎI  →            │  ║
║   └────────────────────────┘     └────────────────────────────────────────────────┘  ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### 4. Components
| Component          | Loại   | Mô tả                                                              |
|--------------------|--------|--------------------------------------------------------------------|
| ResultHeader       | Card   | Tên bài thi, ngày, ca thi                                          |
| ScoreCard          | Stat   | Điểm số lớn, badge ĐẠT/KHÔNG ĐẠT                                  |
| AccuracyCard       | Stat   | Số câu đúng / tổng, progress bar tỷ lệ                             |
| TimeCard           | Stat   | Thời gian đã làm bài                                               |
| BreakdownChart     | Chart  | Bar/progress hiển thị: Đúng / Sai / Bỏ qua                       |
| CandidateInfoBox   | Card   | Thông tin thí sinh, xếp hạng, điểm trung bình lớp                 |
| ViewDetailButton   | Button | Chuyển sang SCR-03b-004b                                           |
| BackToListButton   | Button | Quay về SCR-03b-001                                                |

### 5. Flow điều hướng
```
SCR-03b-003b (Nộp bài)
SCR-03b-003b (Hết giờ – auto submit)
          │
          ▼
    SCR-03b-004a (Kết quả tóm tắt)
          │
    ┌─────┴────────────────┐
    ▼                      ▼
[Về danh sách]    [Xem chi tiết từng câu]
→ SCR-03b-001     → SCR-03b-004b
```

### 6. Business Rules
- **BR-026:** Hệ thống chấm điểm tự động ngay sau khi nhận submit (trắc nghiệm 1 đáp án = full điểm câu đó, sai = 0).
- **BR-027:** Nếu giáo viên cấu hình **không công bố kết quả ngay** → hiển thị "Đã nộp bài thành công. Kết quả sẽ được công bố sau.".
- **BR-028:** Xếp hạng chỉ hiển thị nếu ban tổ chức cho phép công khai bảng điểm.

### 7. API
| Method | Endpoint                              | Mô tả                                      |
|--------|---------------------------------------|--------------------------------------------|
| GET    | `/api/attempts/{attemptId}/result`    | Lấy kết quả thi: điểm, số đúng/sai, rank  |

---

## SCR-03b-004b: Kết quả thi – Chi tiết từng câu hỏi

### 1. Mô tả
Học sinh xem lại toàn bộ bài thi: từng câu hỏi, đáp án mình đã chọn, đáp án đúng, giải thích (nếu có). Cho phép lọc xem riêng câu đúng / sai / bỏ qua.

### 2. Actors
- **Chính:** Học sinh (HV) đã nộp bài
- **Điều kiện:** Giáo viên/BTC đã bật tùy chọn "Cho phép xem chi tiết đáp án"

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Bài thi] [Kết quả ●]                      👤 Nguyễn Văn A ▼  ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║  ← Quay lại kết quả tổng hợp                                                         ║
║                                                                                      ║
║  📝 Kiểm tra HK1 – Toán 10   │  Điểm: 7.5/10  ✅ ĐẠT  │  30/40 câu đúng            ║
║                                                                                      ║
║  Lọc: [ Tất cả ▼ ]  [ ✅ Đúng ]  [ ❌ Sai ]  [ ⬜ Bỏ qua ]                          ║
║                                                                                      ║
║ ┌──────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ ✅  Câu 1 / 40                                                                   │ ║
║ │ ─────────────────────────────────────────────────────────────────────────────── │ ║
║ │  Giá trị của biểu thức 2³ + 3² là?                                              │ ║
║ │                                                                                  │ ║
║ │   ○  A.  12                                                                      │ ║
║ │   ◉  B.  17   ◀ Bạn chọn  ✅  ĐÚNG                                              │ ║
║ │   ○  C.  18                                                                      │ ║
║ │   ○  D.  20                                                                      │ ║
║ │                                                                                  │ ║
║ │  📖 Giải thích: 2³ = 8, 3² = 9 → 8 + 9 = 17                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║ ┌──────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ ❌  Câu 2 / 40                                                                   │ ║
║ │ ─────────────────────────────────────────────────────────────────────────────── │ ║
║ │  Phương trình x² – 5x + 6 = 0 có nghiệm là?                                    │ ║
║ │                                                                                  │ ║
║ │   ○  A.  x = 1 hoặc x = 6                                                       │ ║
║ │   ◉  B.  x = 1 hoặc x = 5   ◀ Bạn chọn  ❌  SAI                                │ ║
║ │   ●  C.  x = 2 hoặc x = 3   ◀ Đáp án ĐÚNG  ✅                                  │ ║
║ │   ○  D.  x = –2 hoặc x = –3                                                    │ ║
║ │                                                                                  │ ║
║ │  📖 Giải thích: x² – 5x + 6 = (x–2)(x–3) = 0 → x = 2 hoặc x = 3              │ ║
║ └──────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║ ┌──────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ ⬜  Câu 5 / 40  (Bỏ qua – không trả lời)                                        │ ║
║ │ ─────────────────────────────────────────────────────────────────────────────── │ ║
║ │  Đạo hàm của f(x) = x³ – 2x + 1 tại x = 1 là?                                 │ ║
║ │                                                                                  │ ║
║ │   ○  A.  0                                                                       │ ║
║ │   ○  B.  1   (bạn không chọn câu này)                                            │ ║
║ │   ●  C.  1   ◀ Đáp án ĐÚNG  ✅                                                  │ ║
║ │   ○  D.  3                                                                       │ ║
║ │                                                                                  │ ║
║ │  📖 Giải thích: f'(x) = 3x² – 2 → f'(1) = 3 – 2 = 1                           │ ║
║ └──────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                      ║
║  ... (hiển thị tiếp các câu còn lại, scroll hoặc phân trang)                         ║
║                                                                                      ║
║              [◀ Trước]   Câu 1–5 / 40   [Sau ▶]                                     ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  MÀU SẮC CARD CÂU HỎI:
  ┌──────────────────────────────────────────────────────────────────────┐
  │  ✅ Đúng    → Viền trái xanh lá, header nền xanh nhạt               │
  │  ❌ Sai     → Viền trái đỏ,     header nền đỏ nhạt                  │
  │  ⬜ Bỏ qua → Viền trái xám,    header nền xám nhạt                  │
  │  Đáp án đúng (●) → Nền xanh lá nhạt trên option                    │
  │  Đáp án sai của thí sinh (◉) → Nền đỏ nhạt trên option             │
  └──────────────────────────────────────────────────────────────────────┘
```

### 4. Components
| Component         | Loại    | Mô tả                                                                |
|-------------------|---------|----------------------------------------------------------------------|
| ResultSummaryBar  | Bar     | Thanh điểm + trạng thái hiển thị cố định ở top                      |
| FilterTabs        | Tabs    | Lọc: Tất cả / Đúng / Sai / Bỏ qua                                   |
| QuestionReviewCard| Card    | Hiển thị từng câu: nội dung, đáp án đã chọn, đáp án đúng, giải thích |
| AnswerOptionReview| Option  | Option với trạng thái: Đúng-của-mình / Sai-của-mình / Đáp-án-đúng  |
| ExplanationBox    | Panel   | Giải thích đáp án (collapsible, nếu có)                              |
| Pagination        | Nav     | Phân trang theo câu hỏi (5 hoặc 10 câu/trang)                       |

### 5. Flow điều hướng
```
SCR-03b-004a ──► SCR-03b-004b
                     │
              [Filter: Đúng/Sai/Bỏ qua]
              → reload với filter param
                     │
              [← Quay lại]
              → SCR-03b-004a
```

### 6. Business Rules
- **BR-029:** Nếu GV/BTC **tắt** tùy chọn xem chi tiết đáp án → màn hình hiển thị thông báo "Kết quả chi tiết chưa được công bố" và ẩn toàn bộ nội dung câu hỏi.
- **BR-030:** Giải thích (📖) chỉ hiển thị nếu GV đã nhập lời giải thích khi tạo câu hỏi.
- **BR-031:** Đáp án đúng chỉ được highlight nếu BTC cho phép công bố đáp án.
- **BR-032:** Học sinh không thể sửa đáp án ở màn hình này – chỉ xem.

### 7. API
| Method | Endpoint                                           | Mô tả                                               |
|--------|----------------------------------------------------|-----------------------------------------------------|
| GET    | `/api/attempts/{attemptId}/review?filter=all`      | Lấy chi tiết từng câu: câu hỏi, đáp án HV, đáp án đúng, giải thích |
| GET    | `/api/attempts/{attemptId}/review?filter=correct`  | Lọc chỉ câu đúng                                    |
| GET    | `/api/attempts/{attemptId}/review?filter=incorrect`| Lọc chỉ câu sai                                     |
| GET    | `/api/attempts/{attemptId}/review?filter=skipped`  | Lọc chỉ câu bỏ qua                                  |

---

## Tổng hợp Flow điều hướng toàn luồng

```
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                    LUỒNG THI TRỰC TUYẾN – NGƯỜI HỌC (WEB)                      │
  └─────────────────────────────────────────────────────────────────────────────────┘

  [Menu: Bài thi]
       │
       ▼
  ┌─────────────┐     Tìm kiếm /      ┌─────────────┐
  │ SCR-03b-001 │◄───── lọc / trang ──│ SCR-03b-001 │
  │ Danh sách   │                     └─────────────┘
  │  bài thi    │
  └──────┬──────┘
         │ Click vào bài thi / [Đăng ký]
         ▼
  ┌─────────────┐
  │ SCR-03b-002 │
  │ Chi tiết &  │
  │ Đăng ký thi │
  └──────┬──────┘
         │ [Làm bài] (sau khi đã đăng ký + đến giờ thi)
         ▼
  ┌──────────────┐
  │SCR-03b-003a  │
  │Thông tin ca  │
  │thi + nội quy │
  └──────┬───────┘
         │ [BẮT ĐẦU THI] + tick đồng ý
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  SCR-03b-003b                             │
  │                 PHÒNG THI                                 │
  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
  │  │ ⏱ Đồng hồ  │  │  Câu hỏi +  │  │  Grid điều hướng│  │
  │  │ đếm ngược  │  │   đáp án     │  │   số câu hỏi    │  │
  │  └─────────────┘  └──────────────┘  └────────┬────────┘  │
  │                                               │ [NỘP BÀI] │
  └───────────────────────────────────────────────┼───────────┘
         │ Hết giờ (auto)                          │ Chủ động nộp
         │                                         ▼
         │                              ┌─────────────────┐
         │                              │  SCR-03b-003c   │
         │                              │  Modal xác nhận │
         │                              └────────┬────────┘
         │                                       │ [Xác nhận]
         └───────────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ SCR-03b-004a  │
                  │ Kết quả tóm  │
                  │    tắt        │
                  └───────┬───────┘
                          │ [Xem chi tiết]
                          ▼
                  ┌───────────────┐
                  │ SCR-03b-004b  │
                  │ Kết quả chi  │
                  │  tiết câu hỏi │
                  └───────────────┘
```

---

## Tổng hợp Business Rules

| Mã     | Phạm vi          | Nội dung                                                                              |
|--------|------------------|---------------------------------------------------------------------------------------|
| BR-001 | Danh sách        | Chỉ hiển thị bài thi theo phân quyền vai trò                                          |
| BR-002 | Danh sách        | Quá hạn đăng ký → ẩn nút Đăng ký                                                     |
| BR-003 | Danh sách        | Đã thi rồi → không đăng ký lại                                                       |
| BR-006 | Đăng ký          | Mỗi học sinh chỉ đăng ký 1 ca / 1 kỳ thi                                             |
| BR-007 | Đăng ký          | Ca thi hết slot → disabled radio                                                      |
| BR-010 | Vào phòng thi    | Nút Bắt đầu chỉ active khi tick đồng ý nội quy                                       |
| BR-013 | Vào phòng thi    | Refresh/reconnect → load lại phiên thi cũ                                             |
| BR-014 | Đồng hồ          | Thời gian tính từ server, không phụ thuộc client clock                                |
| BR-015 | Làm bài          | Auto-save đáp án mỗi lần chọn                                                         |
| BR-016 | Đồng hồ          | Còn 5 phút → cảnh báo đỏ                                                             |
| BR-018 | Hết giờ          | Auto-submit khi hết giờ                                                               |
| BR-019 | Flag             | Flag là toggle, bấm lại để bỏ                                                         |
| BR-020 | Grid nav         | Click số câu → nhảy ngay đến câu đó                                                  |
| BR-023 | Xác nhận nộp     | Cảnh báo nếu còn câu chưa làm                                                        |
| BR-026 | Kết quả          | Chấm điểm tự động ngay sau submit                                                     |
| BR-027 | Kết quả          | Nếu BTC chưa công bố → chỉ hiện thông báo đã nộp                                     |
| BR-029 | Kết quả chi tiết | Nếu BTC tắt xem đáp án → ẩn nội dung                                                 |

---

## Tổng hợp API Endpoints

| Method | Endpoint                                          | Màn hình         | Mô tả                                     |
|--------|---------------------------------------------------|------------------|-------------------------------------------|
| GET    | `/api/exams`                                      | 001              | Danh sách bài thi (có filter, page)       |
| GET    | `/api/exams/years`                                | 001              | Danh sách năm học                         |
| GET    | `/api/exams/{examId}`                             | 002              | Chi tiết bài thi                          |
| GET    | `/api/exams/{examId}/sessions`                    | 002              | Ca thi + slot còn trống                   |
| POST   | `/api/exam-registrations`                         | 002              | Đăng ký tham gia thi                      |
| GET    | `/api/exam-sessions/{sessionId}/my-info`          | 003a             | Thông tin ca thi của thí sinh             |
| POST   | `/api/exam-sessions/{sessionId}/start`            | 003a → 003b      | Bắt đầu thi, trả về attemptId + câu hỏi  |
| GET    | `/api/attempts/{attemptId}/questions`             | 003b             | Danh sách câu hỏi + đáp án               |
| GET    | `/api/attempts/{attemptId}/remaining-time`        | 003b             | Thời gian còn lại (server-side)           |
| PATCH  | `/api/attempts/{attemptId}/answers`               | 003b             | Lưu đáp án tạm thời                       |
| PATCH  | `/api/attempts/{attemptId}/flag`                  | 003b             | Đánh dấu / bỏ đánh dấu câu               |
| POST   | `/api/attempts/{attemptId}/submit`                | 003c → 004a      | Nộp bài chính thức                        |
| GET    | `/api/attempts/{attemptId}/result`                | 004a             | Kết quả thi tóm tắt                       |
| GET    | `/api/attempts/{attemptId}/review`                | 004b             | Chi tiết từng câu (filter: all/correct/incorrect/skipped) |
