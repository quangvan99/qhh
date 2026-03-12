---
title: "WF-03a2: Học tập – Bài tập & Thảo luận (Người học)"
cluster: "Learning - Student / Assignment & Discussion"
updated: 2026-03-11
---

# WF-03a2: Học tập – Bài tập & Thảo luận (Người học)

> **Phạm vi:** Các màn hình người học tác động trực tiếp trong lớp học – làm và nộp bài tập, quản lý thảo luận (tìm kiếm, thêm, sửa, xóa, phản hồi).

---

## Mục lục màn hình

| Mã             | Tên màn hình                              | Ghi chú                                    |
|----------------|-------------------------------------------|--------------------------------------------|
| SCR-03a2-001   | Danh sách bài tập của lớp học             | Xem, lọc trạng thái, chọn bài tập         |
| SCR-03a2-002   | Chi tiết bài tập & Nộp bài               | Xem đề, quản lý file đính kèm, nộp bài    |
| SCR-03a2-003   | Kết quả / Trạng thái sau nộp bài          | Điểm số, nhận xét, file đã nộp            |
| SCR-03a2-004   | Danh sách thảo luận + Tìm kiếm            | Tìm theo từ khóa, lọc theo nội dung lớp   |
| SCR-03a2-005   | Thêm mới thảo luận                        | Form tạo bài thảo luận                     |
| SCR-03a2-006   | Chỉnh sửa thảo luận                       | Form sửa bài thảo luận của chính mình     |
| SCR-03a2-007   | Xóa thảo luận (modal xác nhận)            | Dialog xác nhận trước khi xóa             |
| SCR-03a2-008   | Chi tiết thảo luận & Phản hồi             | Xem thread, nhập & gửi phản hồi           |

---

## SCR-03a2-001: Danh sách bài tập của lớp học

### 1. Mô tả
Học sinh truy cập tab **"Bài tập"** trong lớp học để xem toàn bộ bài tập được giao. Danh sách hiển thị tiêu đề, hạn nộp, trạng thái nộp bài. Hỗ trợ lọc theo trạng thái.

### 2. Actors
- **Chính:** Học sinh (HV) đã đăng nhập, đã tham gia lớp học
- **Hệ thống:** Backend kiểm tra quyền và truy xuất danh sách bài tập theo lớp

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]  [Kết quả]       👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  Lớp học > Toán 10 – HK1 > Bài tập                                  ║
║                                                                      ║
║  [Nội dung] [Bài tập ●] [Thảo luận] [Thành viên] [Kết quả]          ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  📋 Bài tập của lớp                                                  ║
║                                                                      ║
║  Lọc: [▼ Tất cả ] [▼ Chưa nộp ] [▼ Đã nộp ] [▼ Quá hạn ]           ║
║                                                                      ║
║ ┌────────────────────────────────────────────────────────────────┐   ║
║ │ STT │ Tiêu đề bài tập        │ Hạn nộp      │ Trạng thái      │   ║
║ ├─────┼────────────────────────┼──────────────┼─────────────────┤   ║
║ │  1  │ BT chương 1 – Đại số  │ 15/03/2026   │ 🟡 Chưa nộp    │   ║
║ ├─────┼────────────────────────┼──────────────┼─────────────────┤   ║
║ │  2  │ BT chương 2 – Hình học │ 10/03/2026   │ ✅ Đã nộp      │   ║
║ ├─────┼────────────────────────┼──────────────┼─────────────────┤   ║
║ │  3  │ Kiểm tra 15 phút       │ 05/03/2026   │ 🔴 Quá hạn     │   ║
║ └────────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  < 1  2  3 >                                                         ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Tab navigation:** Nội dung / Bài tập / Thảo luận / Thành viên / Kết quả
- **Filter bar:** Dropdown lọc trạng thái (Tất cả / Chưa nộp / Đã nộp / Quá hạn)
- **Bảng danh sách:** STT, tiêu đề (link), hạn nộp, badge trạng thái
- **Phân trang:** Previous / page numbers / Next

### 5. Flow điều hướng
- Click tên bài tập → `SCR-03a2-002` (Chi tiết bài tập)
- Bài đã có điểm → `SCR-03a2-003` (Kết quả)

### 6. Business rules
- Chỉ hiển thị bài tập thuộc lớp học học sinh đang tham gia.
- Trạng thái **Quá hạn** không cho phép nộp mới; vẫn xem được chi tiết.
- Badge trạng thái: Chưa nộp (vàng) / Đã nộp (xanh) / Quá hạn (đỏ) / Đã chấm (xanh + điểm).

### 7. API chính
| Method | Endpoint                                      | Mô tả                         |
|--------|-----------------------------------------------|-------------------------------|
| GET    | `/api/classes/{classId}/assignments`          | Danh sách bài tập của lớp     |

---

## SCR-03a2-002: Chi tiết bài tập & Nộp bài

### 1. Mô tả
Học sinh xem đề bài, tải file đính kèm của giáo viên, tải lên/xóa file bài làm và nộp bài. Nếu bài chưa nộp và còn hạn: hiển thị khu vực nộp bài. Nếu đã nộp: hiển thị thông tin đã nộp + nút "Xem kết quả".

### 2. Actors
- **Chính:** Học sinh (HV)
- **Hệ thống:** Kiểm tra hạn nộp, lưu file, cập nhật trạng thái

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]                   👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  Lớp học > Toán 10 > Bài tập > BT chương 1 – Đại số                 ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  📄 BT chương 1 – Đại số                     🟡 Chưa nộp            ║
║  ─────────────────────────────────────────────────────────          ║
║  Hạn nộp: 15/03/2026 23:59    Điểm tối đa: 10                       ║
║                                                                      ║
║  ┌─────────────────────────────────────────────────────────────┐    ║
║  │ MÔ TẢ BÀI TẬP                                               │    ║
║  │ Hoàn thành các bài tập từ trang 12–15 sách giáo khoa...     │    ║
║  └─────────────────────────────────────────────────────────────┘    ║
║                                                                      ║
║  📎 File đính kèm của giáo viên                                      ║
║  ┌───────────────────────────────────────────────────┐              ║
║  │  📄 de_bai_chuong1.pdf              [⬇ Tải về]   │              ║
║  └───────────────────────────────────────────────────┘              ║
║                                                                      ║
║  📤 Bài làm của tôi                                                  ║
║  ┌───────────────────────────────────────────────────┐              ║
║  │  📄 bai_lam_chuong1.pdf    [✕ Xóa]               │              ║
║  │  ─────────────────────────────────────────────    │              ║
║  │  [⊕ Tải lên tệp đính kèm]                         │              ║
║  └───────────────────────────────────────────────────┘              ║
║                                                                      ║
║  Nhận xét của học sinh: (tuỳ chọn)                                   ║
║  ┌───────────────────────────────────────────────────┐              ║
║  │ Gõ nhận xét...                                    │              ║
║  └───────────────────────────────────────────────────┘              ║
║                                                                      ║
║                              [ Nộp bài ]                             ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Header bài tập:** Tiêu đề, badge trạng thái, hạn nộp, điểm tối đa
- **Mô tả bài tập:** Rich text hiển thị đề bài
- **File đính kèm GV:** Danh sách file + nút tải về từng file
- **Khu vực bài làm:** Danh sách file đã tải + nút Xóa từng file + nút Tải lên thêm
- **Textarea nhận xét:** Tuỳ chọn, giới hạn ký tự
- **Nút Nộp bài:** Disabled khi quá hạn hoặc đã nộp

### 5. Flow điều hướng
- Click `⬇ Tải về` → download file trực tiếp
- Click `⊕ Tải lên` → popup/modal upload file → cập nhật danh sách
- Click `✕ Xóa` file → modal xác nhận → xóa file khỏi danh sách
- Click `Nộp bài` → modal xác nhận → nộp thành công → reload sang trạng thái "Đã nộp"
- Nếu đã nộp → hiển thị `[Xem kết quả]` → `SCR-03a2-003`

### 6. Business rules
- Chỉ tải lên được khi bài **chưa nộp** và **còn hạn**.
- Định dạng file hợp lệ: pdf, doc, docx, jpg, png, zip (giới hạn theo cấu hình hệ thống).
- Sau khi nộp bài: trạng thái chuyển "Đã nộp", ghi nhận timestamp nộp.
- Quá hạn: ẩn khu vực nộp bài, chỉ xem mô tả và file GV.

### 7. API chính
| Method | Endpoint                                                        | Mô tả                           |
|--------|-----------------------------------------------------------------|---------------------------------|
| GET    | `/api/classes/{classId}/assignments/{assignmentId}`             | Chi tiết bài tập                |
| GET    | `/api/assignments/{assignmentId}/attachments/download/{fileId}` | Tải file đính kèm GV            |
| POST   | `/api/assignments/{assignmentId}/submission/attachments`        | Tải lên file bài làm            |
| DELETE | `/api/assignments/{assignmentId}/submission/attachments/{fileId}` | Xóa file bài làm              |
| POST   | `/api/assignments/{assignmentId}/submit`                        | Nộp bài                         |

---

## SCR-03a2-003: Kết quả / Trạng thái sau nộp bài

### 1. Mô tả
Hiển thị thông tin sau khi nộp bài: thời gian nộp, file đã nộp, điểm số (nếu đã chấm) và nhận xét của giáo viên.

### 2. Actors
- **Chính:** Học sinh (HV)
- **Hệ thống:** Truy xuất submission và kết quả chấm điểm

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]                   👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  Lớp học > Toán 10 > Bài tập > BT chương 2 – Hình học               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  📄 BT chương 2 – Hình học                   ✅ Đã nộp               ║
║  Hạn nộp: 10/03/2026 23:59   Nộp lúc: 09/03/2026 21:34              ║
║                                                                      ║
║  ┌───────────────────────────────────────────┐                      ║
║  │ KẾT QUẢ CHẤM ĐIỂM                        │                      ║
║  │                                           │                      ║
║  │  Điểm số:    8.5 / 10                     │                      ║
║  │  Nhận xét:   Bài làm tốt, cần trình bày   │                      ║
║  │              rõ hơn ở câu 3.              │                      ║
║  └───────────────────────────────────────────┘                      ║
║                                                                      ║
║  📎 File bài làm đã nộp                                              ║
║  ┌───────────────────────────────────────────┐                      ║
║  │  📄 bai_lam_chuong2.pdf    [⬇ Tải về]    │                      ║
║  └───────────────────────────────────────────┘                      ║
║                                                                      ║
║                      [ ← Quay lại danh sách ]                        ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Header:** Tiêu đề bài tập, badge "Đã nộp", thời gian nộp
- **Card kết quả:** Điểm số / điểm tối đa, nhận xét GV (ẩn nếu chưa chấm)
- **File đã nộp:** Danh sách file + nút tải lại
- **Nút quay lại:** Về danh sách bài tập

### 5. Flow điều hướng
- `← Quay lại` → `SCR-03a2-001`
- Nếu chưa chấm: hiển thị "Đang chờ chấm điểm"

### 6. Business rules
- Nếu chưa có điểm: ẩn phần điểm số & nhận xét, hiển thị badge "Đang chờ chấm".
- File đã nộp chỉ xem/tải, không chỉnh sửa.

### 7. API chính
| Method | Endpoint                                                      | Mô tả                         |
|--------|---------------------------------------------------------------|-------------------------------|
| GET    | `/api/assignments/{assignmentId}/submission`                  | Thông tin bài đã nộp + điểm   |

---

## SCR-03a2-004: Danh sách thảo luận + Tìm kiếm

### 1. Mô tả
Học sinh truy cập tab **"Thảo luận"** trong lớp học. Tìm kiếm thảo luận theo từ khóa hoặc lọc theo nội dung/chủ đề của lớp. Từ đây có thể tạo mới hoặc chọn bài để đọc/phản hồi/sửa/xóa.

### 2. Actors
- **Chính:** Học sinh (HV)
- **Hệ thống:** Tìm kiếm full-text, lọc theo nội dung lớp học

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]                   👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  [Nội dung] [Bài tập] [Thảo luận ●] [Thành viên] [Kết quả]          ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  💬 Thảo luận                             [ + Thêm thảo luận ]       ║
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │ 🔍 [ Tìm kiếm theo từ khóa...                    ] [Tìm]    │   ║
║  │                                                              │   ║
║  │ Lọc theo nội dung: [▼ Tất cả nội dung ]                      │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │ 👤 Nguyễn Văn B  •  12/03/2026                               │   ║
║  │ **Câu hỏi về bài 3 chương 1**                                │   ║
║  │ Mình không hiểu phần chứng minh, bạn nào giải thích...       │   ║
║  │ 🏷 Chương 1 – Đại số    💬 3 phản hồi          [Xem]         │   ║
║  ├──────────────────────────────────────────────────────────────┤   ║
║  │ 👤 Tôi (Nguyễn Văn A)  •  10/03/2026                        │   ║
║  │ **Chia sẻ tài liệu ôn tập hình học**                         │   ║
║  │ Mình tổng hợp lại các công thức...                           │   ║
║  │ 🏷 Chương 2 – Hình học   💬 5 phản hồi  [Sửa] [Xóa] [Xem]   │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  < 1  2 >                                                            ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Tab navigation:** Thảo luận đang active
- **Nút "+ Thêm thảo luận":** Góc phải tiêu đề
- **Search bar:** Input từ khóa + nút Tìm
- **Dropdown lọc nội dung:** Danh sách nội dung/chủ đề của lớp
- **Card thảo luận:** Avatar, tên tác giả, ngày đăng, tiêu đề, excerpt, tag nội dung, số phản hồi, action buttons
- **Action buttons:** Bài của mình → `[Sửa] [Xóa] [Xem]`; bài người khác → `[Xem]`

### 5. Flow điều hướng
- `+ Thêm thảo luận` → `SCR-03a2-005`
- `[Xem]` → `SCR-03a2-008`
- `[Sửa]` → `SCR-03a2-006`
- `[Xóa]` → `SCR-03a2-007` (modal)

### 6. Business rules
- Tìm kiếm khớp với tiêu đề và nội dung bài thảo luận.
- Lọc theo nội dung lớp: chỉ hiển thị thảo luận được gắn tag nội dung đó.
- Nút Sửa/Xóa chỉ hiển thị với bài thảo luận do chính học sinh tạo.

### 7. API chính
| Method | Endpoint                                                              | Mô tả                         |
|--------|-----------------------------------------------------------------------|-------------------------------|
| GET    | `/api/classes/{classId}/discussions?keyword=&contentId=&page=`       | Danh sách + tìm kiếm + lọc    |
| GET    | `/api/classes/{classId}/contents`                                     | Danh sách nội dung để lọc     |

---

## SCR-03a2-005: Thêm mới thảo luận

### 1. Mô tả
Form để học sinh tạo bài thảo luận mới trong lớp học. Bắt buộc nhập tiêu đề và nội dung; tuỳ chọn gắn tag nội dung lớp học.

### 2. Actors
- **Chính:** Học sinh (HV)
- **Hệ thống:** Validate và lưu thảo luận

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]                   👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  Lớp học > Toán 10 > Thảo luận > Thêm mới                           ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  💬 Thêm thảo luận mới                                               ║
║                                                                      ║
║  Tiêu đề *                                                           ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ Nhập tiêu đề thảo luận...                                  │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  Nội dung *                                                          ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ [B] [I] [U] [Link] [Img] [List]                            │     ║
║  │ ─────────────────────────────────────────────────          │     ║
║  │ Nhập nội dung thảo luận...                                 │     ║
║  │                                                            │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  Gắn với nội dung lớp học (tuỳ chọn)                                 ║
║  [▼ Chọn nội dung liên quan... ]                                      ║
║                                                                      ║
║              [ Hủy ]          [ Lưu thảo luận ]                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Input Tiêu đề:** Text field, bắt buộc, placeholder gợi ý
- **Rich-text Editor Nội dung:** Toolbar cơ bản (bold, italic, link, image, list), bắt buộc
- **Dropdown tag nội dung:** Tuỳ chọn, gắn thảo luận với nội dung học cụ thể
- **Nút Hủy / Lưu thảo luận**
- **Inline error message:** Hiển thị ngay dưới field lỗi

### 5. Flow điều hướng
- `Hủy` → quay về `SCR-03a2-004`
- `Lưu thảo luận` (valid) → lưu thành công → toast "Thêm thảo luận thành công" → về `SCR-03a2-004`
- `Lưu thảo luận` (thiếu/sai) → hiện lỗi inline, giữ nguyên form

### 6. Business rules
- Tiêu đề và nội dung là bắt buộc; không được để trống.
- Tiêu đề tối đa 255 ký tự.
- Sau khi lưu thành công, bài thảo luận hiển thị ngay đầu danh sách (sắp xếp theo mới nhất).

### 7. API chính
| Method | Endpoint                                  | Mô tả                      |
|--------|-------------------------------------------|----------------------------|
| POST   | `/api/classes/{classId}/discussions`      | Tạo mới thảo luận           |

---

## SCR-03a2-006: Chỉnh sửa thảo luận

### 1. Mô tả
Form chỉnh sửa bài thảo luận mà học sinh đã tạo trước đó. Dữ liệu được pre-fill từ bài gốc; học sinh cập nhật và lưu lại.

### 2. Actors
- **Chính:** Học sinh (HV) – chỉ chủ bài thảo luận
- **Hệ thống:** Validate và cập nhật bản ghi

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]                   👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  Lớp học > Toán 10 > Thảo luận > Chỉnh sửa                          ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ✏️  Chỉnh sửa thảo luận                                             ║
║                                                                      ║
║  Tiêu đề *                                                           ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ Chia sẻ tài liệu ôn tập hình học          ← pre-filled     │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  Nội dung *                                                          ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ [B] [I] [U] [Link] [Img] [List]                            │     ║
║  │ ─────────────────────────────────────────────────          │     ║
║  │ Mình tổng hợp lại các công thức...        ← pre-filled     │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  Gắn với nội dung lớp học                                            ║
║  [▼ Chương 2 – Hình học ]                    ← pre-filled           ║
║                                                                      ║
║              [ Hủy ]          [ Lưu thay đổi ]                       ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- Tương tự `SCR-03a2-005` nhưng các field được **pre-fill** với dữ liệu hiện tại
- **Nút Lưu thay đổi** thay vì "Lưu thảo luận"

### 5. Flow điều hướng
- `Hủy` → quay về `SCR-03a2-004`
- `Lưu thay đổi` (valid) → cập nhật thành công → toast "Cập nhật thành công" → về `SCR-03a2-004`
- `Lưu thay đổi` (thiếu/sai) → hiện lỗi inline

### 6. Business rules
- Chỉ chủ bài thảo luận mới được chỉnh sửa; hệ thống kiểm tra quyền trước khi load form.
- Nếu bài đã có phản hồi: vẫn cho phép sửa, hiển thị cảnh báo nhẹ "Bài đã có phản hồi".

### 7. API chính
| Method | Endpoint                                                  | Mô tả                        |
|--------|-----------------------------------------------------------|------------------------------|
| GET    | `/api/classes/{classId}/discussions/{discussionId}`       | Lấy dữ liệu pre-fill         |
| PUT    | `/api/classes/{classId}/discussions/{discussionId}`       | Cập nhật thảo luận           |

---

## SCR-03a2-007: Xóa thảo luận (modal xác nhận)

### 1. Mô tả
Modal xác nhận khi học sinh chọn xóa bài thảo luận của mình. Hiển thị tên bài và cảnh báo hành động không thể hoàn tác.

### 2. Actors
- **Chính:** Học sinh (HV) – chỉ chủ bài thảo luận
- **Hệ thống:** Kiểm tra ràng buộc và xóa bản ghi

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  ... (Nền màn hình SCR-03a2-004 bị mờ) ...                          ║
║                                                                      ║
║           ┌─────────────────────────────────────────┐               ║
║           │  🗑️  Xóa thảo luận                       │               ║
║           │  ─────────────────────────────────────   │               ║
║           │  Bạn có chắc muốn xóa thảo luận:         │               ║
║           │                                          │               ║
║           │  "Chia sẻ tài liệu ôn tập hình học"      │               ║
║           │                                          │               ║
║           │  ⚠️  Hành động này không thể hoàn tác.   │               ║
║           │     Các phản hồi liên quan cũng bị xóa.  │               ║
║           │                                          │               ║
║           │        [ Hủy ]    [ Xác nhận xóa ]       │               ║
║           └─────────────────────────────────────────┘               ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Modal dialog:** Overlay nền mờ
- **Tiêu đề bài cần xóa:** Hiển thị rõ để tránh nhầm
- **Cảnh báo:** Không thể hoàn tác; phản hồi sẽ bị xóa theo
- **Nút Hủy / Xác nhận xóa** (Xóa màu đỏ/destructive)

### 5. Flow điều hướng
- `Hủy` → đóng modal, giữ nguyên `SCR-03a2-004`
- `Xác nhận xóa` → xóa thành công → toast "Đã xóa thảo luận" → cập nhật danh sách

### 6. Business rules
- Xóa thảo luận sẽ xóa cascade toàn bộ phản hồi liên quan.
- Chỉ chủ bài được xóa; Backend validate lại quyền trước khi thực hiện.

### 7. API chính
| Method | Endpoint                                                  | Mô tả                    |
|--------|-----------------------------------------------------------|--------------------------|
| DELETE | `/api/classes/{classId}/discussions/{discussionId}`       | Xóa thảo luận            |

---

## SCR-03a2-008: Chi tiết thảo luận & Phản hồi

### 1. Mô tả
Trang xem đầy đủ nội dung một bài thảo luận và toàn bộ thread phản hồi. Học sinh có thể nhập và gửi phản hồi mới ở cuối trang.

### 2. Actors
- **Chính:** Học sinh (HV)
- **Hệ thống:** Lấy nội dung thảo luận + danh sách phản hồi theo thứ tự thời gian; lưu phản hồi mới

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  LOGO    [Trang chủ]  [Lớp học ●]                   👤 Nguyễn Văn A ║
╠══════════════════════════════════════════════════════════════════════╣
║  Lớp học > Toán 10 > Thảo luận > Chi tiết                           ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ← Quay lại thảo luận                                                ║
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │ 👤 Nguyễn Văn B  •  12/03/2026 14:20   🏷 Chương 1          │   ║
║  │                                                              │   ║
║  │ Câu hỏi về bài 3 chương 1                                    │   ║
║  │ ────────────────────────────────────────────────────         │   ║
║  │ Mình không hiểu phần chứng minh ở bài 3, trang 14.           │   ║
║  │ Bạn nào có thể giải thích giúp mình không ạ?                 │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  💬 3 phản hồi                                                       ║
║  ──────────────────────────────────────────                          ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │ 👤 Trần Thị C  •  12/03/2026 15:00                           │   ║
║  │ Bạn xem lại định lý Pytago nhé, áp dụng vào câu c là ra ạ.  │   ║
║  ├──────────────────────────────────────────────────────────────┤   ║
║  │ 👤 Nguyễn Văn B  •  12/03/2026 15:30                         │   ║
║  │ Mình hiểu rồi, cảm ơn bạn Trần Thị C nhiều nhé!             │   ║
║  ├──────────────────────────────────────────────────────────────┤   ║
║  │ 👤 Tôi (Nguyễn Văn A)  •  12/03/2026 16:00    [Sửa] [Xóa]   │   ║
║  │ Mình bổ sung thêm: công thức tổng quát là...                 │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  ✏️  Phản hồi của tôi                                                ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │ Nhập nội dung phản hồi...                                    │   ║
║  │                                                              │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                             [ Gửi phản hồi ]         ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Nút ← Quay lại:** Về danh sách thảo luận
- **Card bài gốc:** Avatar, tên tác giả, ngày giờ, tag nội dung, tiêu đề, nội dung đầy đủ
- **Danh sách phản hồi:** Sắp xếp tăng dần theo thời gian; mỗi phản hồi có avatar, tên, giờ, nội dung
- **Action phản hồi của tôi:** `[Sửa]` `[Xóa]` chỉ hiện với phản hồi của chính học sinh
- **Textarea phản hồi:** Input nội dung, bắt buộc không trống
- **Nút Gửi phản hồi:** Submit phản hồi mới

### 5. Flow điều hướng
- `← Quay lại` → `SCR-03a2-004`
- `Gửi phản hồi` (valid) → append phản hồi mới vào cuối thread + clear textarea
- `Gửi phản hồi` (trống) → hiện lỗi inline "Vui lòng nhập nội dung phản hồi"
- `[Sửa]` phản hồi → inline edit hoặc mở modal sửa
- `[Xóa]` phản hồi → modal xác nhận → xóa và cập nhật thread

### 6. Business rules
- Phản hồi hiển thị theo thứ tự thời gian tăng dần (mới nhất ở cuối).
- Nội dung phản hồi bắt buộc không được để trống.
- Chỉ chủ phản hồi mới được Sửa/Xóa phản hồi của mình.
- Xóa phản hồi: chỉ xóa phản hồi đó, không ảnh hưởng thread khác.

### 7. API chính
| Method | Endpoint                                                                    | Mô tả                        |
|--------|-----------------------------------------------------------------------------|------------------------------|
| GET    | `/api/classes/{classId}/discussions/{discussionId}`                         | Chi tiết thảo luận + replies |
| POST   | `/api/classes/{classId}/discussions/{discussionId}/replies`                 | Gửi phản hồi mới             |
| PUT    | `/api/classes/{classId}/discussions/{discussionId}/replies/{replyId}`       | Sửa phản hồi                 |
| DELETE | `/api/classes/{classId}/discussions/{discussionId}/replies/{replyId}`       | Xóa phản hồi                 |

---

## Tổng quan luồng điều hướng

```
SCR-03a2-001 (Danh sách BT)
    │
    ├──[click bài tập]──► SCR-03a2-002 (Chi tiết + Nộp bài)
    │                           │
    │                           └──[đã nộp / xem KQ]──► SCR-03a2-003 (Kết quả)
    │
    └──[tab Thảo luận]──► SCR-03a2-004 (Danh sách TL + Tìm kiếm)
                                │
                                ├──[+ Thêm]──────────► SCR-03a2-005 (Thêm TL)
                                │
                                ├──[Sửa]─────────────► SCR-03a2-006 (Sửa TL)
                                │
                                ├──[Xóa]─────────────► SCR-03a2-007 (Modal xóa)
                                │
                                └──[Xem / Phản hồi]──► SCR-03a2-008 (Chi tiết + Phản hồi)
```
