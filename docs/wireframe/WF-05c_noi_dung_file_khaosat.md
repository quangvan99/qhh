---
title: "WF-05c: Quản lý nội dung – File & Khảo sát"
cluster: "Learning - Content Management / File & Survey"
screens: [SCR-05c-001, SCR-05c-002, SCR-05c-003, SCR-05c-004, SCR-05c-005, SCR-05c-006, SCR-05c-007, SCR-05c-008, SCR-05c-009, SCR-05c-010, SCR-05c-011, SCR-05c-012, SCR-05c-013, SCR-05c-014]
updated: 2026-03-11
---

# WF-05c: Quản lý nội dung – File & Khảo sát

---

## Tổng quan luồng

**Phần A – Nội dung dạng File (PDF/Word/Excel):** GV/CBQL upload file, xem inline, download, chỉnh sửa metadata, thiết lập ràng buộc & lịch hiển thị, xóa, hoặc chọn từ thư viện cá nhân/đơn vị.

**Phần B – Khảo sát trong lớp học:** GV/CBQL tạo khảo sát, quản lý nhóm câu hỏi + câu hỏi, xem trước, duyệt/bỏ duyệt, xóa, xem báo cáo kết quả (danh sách / biểu đồ / thống kê), xuất Excel.

```
[SCR-05c-001: DS File trong lớp]
    ├─[+ Thêm file]──→ [SCR-05c-002: Form thêm file]──→ Upload ──→ Lưu ──→ [SCR-05c-001]
    ├─[✏️ Sửa]────────→ [SCR-05c-003: Form sửa file]────────────────────→ [SCR-05c-001]
    ├─[👁 Xem trước]──→ [SCR-05c-004: Inline Viewer]
    ├─[🗑️ Xóa]────────→ Dialog xác nhận ──→ [SCR-05c-001]
    └─[📚 Thư viện]───→ [SCR-05c-005: Chọn file từ TV] ──→ Lưu ──→ [SCR-05c-001]

[SCR-05c-006: DS Khảo sát trong lớp]
    ├─[+ Tạo KS]──────→ [SCR-05c-007: Form tạo khảo sát]
    │                        └─[+ Nhóm CĐ]──→ [SCR-05c-008: Form nhóm câu hỏi]
    │                        └─[+ Câu hỏi]──→ [SCR-05c-009: Form câu hỏi]
    ├─[✏️ Sửa KS]──────→ [SCR-05c-007] (edit mode)
    ├─[👁 Xem trước]──→ [SCR-05c-010: Preview khảo sát]
    ├─[Duyệt/Bỏ]──────→ Inline toggle trạng thái
    ├─[🗑️ Xóa]────────→ Dialog xác nhận ──→ [SCR-05c-006]
    └─[📊 Kết quả]────→ [SCR-05c-011: Báo cáo kết quả] ──→ [Xuất XLSX]
```

---

## Phần A: Quản lý nội dung dạng File

---

### SCR-05c-001: Danh sách file trong lớp học

**Mô tả:** Liệt kê toàn bộ tài liệu dạng file (PDF/Word/Excel) thuộc lớp học, hỗ trợ tìm kiếm, phân trang, thêm mới, chỉnh sửa, xem trước, download và xóa.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│ 🏠 > Lớp học > [10A1] > Nội dung > File tài liệu            │
├──────────────────────────────────────────────────────────────┤
│  [+ Thêm file]  [📚 Từ thư viện cá nhân]  [🏢 Từ TV đơn vị] │
├──────────────────────────────────────────────────────────────┤
│  🔍 [Tìm tên tài liệu...          ]  [Tìm kiếm] [Đặt lại]   │
├──────────────────────────────────────────────────────────────┤
│  Tên tài liệu       │ Loại │ Ngày thêm  │ Trạng thái │ Tác   │
├─────────────────────┼──────┼────────────┼────────────┼───────┤
│  Bài giảng tuần 1   │ PDF  │ 2026-03-01 │ Hiển thị   │👁✏️🗑️ │
│  Bảng tính luyện tập│ XLSX │ 2026-03-05 │ Lên lịch   │👁✏️🗑️ │
│  Đề cương môn học   │ DOCX │ 2026-03-08 │ Hiển thị   │👁✏️🗑️ │
├─────────────────────┴──────┴────────────┴────────────┴───────┤
│  Hiển thị 1–3 / 12 bản ghi    [10 ▼] bản ghi/trang          │
│                  [◀]  1  2  3  [▶]                           │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Breadcrumb, Toolbar (3 nút thêm), Ô tìm kiếm, Bảng dữ liệu, Pagination, Badge trạng thái

**Flow:** Trang tải → hiển thị DS → Click [+ Thêm file] → SCR-05c-002 | Click [👁] → SCR-05c-004 | Click [✏️] → SCR-05c-003 | Click [🗑️] → Dialog xác nhận

**Business rules:**
- Hiển thị đúng loại file (PDF/DOCX/XLSX) bằng icon phân biệt
- File "Lên lịch" chưa hiện với học sinh đến thời điểm quy định
- Chỉ GV/CBQL có quyền mới thấy nút Thêm/Sửa/Xóa

**API:** `GET /api/classes/{id}/files?page=&limit=&q=`

---

### SCR-05c-002: Form thêm mới file tài liệu

**Mô tả:** Form 2 bước — (1) Upload file, (2) Nhập metadata và thiết lập. Hỗ trợ drag-and-drop hoặc chọn file từ thiết bị.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│  THÊM MỚI TÀI LIỆU FILE                            [✕ Đóng] │
├──────────────────────────────────────────────────────────────┤
│  Tiêu đề *  [_________________________________]              │
│                                                              │
│  File *                                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  ☁ Kéo thả file hoặc  [Chọn file...]       │             │
│  │  Hỗ trợ: PDF, DOCX, XLSX  (tối đa 50 MB)  │             │
│  └────────────────────────────────────────────┘             │
│  [████████████████░░░░░░░░] 68% đang tải lên...             │
│                                                              │
│  Mô tả     [_________________________________]              │
│  Danh mục  [Chọn danh mục...          ▼]                    │
│                                                              │
│  ─── Cài đặt hiển thị ───────────────────────────           │
│  Hiển thị ngay  ● Có  ○ Không                               │
│  Lên lịch từ   [dd/mm/yyyy] đến [dd/mm/yyyy]                │
│  Ràng buộc     [Hoàn thành nội dung trước: ▼]               │
│                                                              │
│              [Hủy]          [💾 Lưu tài liệu]               │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Text input, Dropzone upload, Progress bar, Textarea, Dropdown danh mục, Radio hiển thị, DateRangePicker, Dropdown ràng buộc, Buttons

**Flow:** Điền tiêu đề → Upload file (validate định dạng & kích thước) → Nhập metadata → [Lưu] → Validate → Lưu DB → quay về SCR-05c-001 + toast "Lưu thành công"

**Business rules:**
- File bắt buộc, tối đa 50 MB, định dạng PDF/DOCX/XLSX
- Tiêu đề bắt buộc, tối đa 255 ký tự
- Nếu chọn "Lên lịch", bắt buộc chọn ngày bắt đầu ≥ hôm nay

**API:** `POST /api/files/upload` → `POST /api/classes/{id}/files`

---

### SCR-05c-003: Form chỉnh sửa file tài liệu

**Mô tả:** Giống SCR-05c-002 nhưng điền sẵn dữ liệu hiện tại. Cho phép thay file (xóa file cũ → upload file mới) hoặc chỉ cập nhật metadata.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│  CHỈNH SỬA TÀI LIỆU                                [✕ Đóng] │
├──────────────────────────────────────────────────────────────┤
│  Tiêu đề *  [Bài giảng tuần 1________________]              │
│                                                              │
│  File hiện tại:  📄 bai-giang-t1.pdf  (2.4 MB)             │
│                  [🗑️ Xóa & thay file mới]                   │
│  ↳ (Nếu đã xóa): [Dropzone upload mới - như SCR-05c-002]   │
│                                                              │
│  Mô tả     [Bài giảng chương 1: Đại số tuyến tính_]         │
│  Danh mục  [Bài giảng                         ▼]            │
│                                                              │
│  ─── Cài đặt hiển thị ───────────────────────────           │
│  Hiển thị ngay  ● Có  ○ Không                               │
│  Lên lịch từ   [01/03/2026] đến [30/06/2026]                │
│  Ràng buộc     [Không có                     ▼]             │
│                                                              │
│              [Hủy]          [💾 Lưu thay đổi]               │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Giống SCR-05c-002 + hiển thị file hiện tại với nút xóa/thay thế

**Flow:** Load dữ liệu hiện tại → Sửa → [Lưu thay đổi] → Validate → Cập nhật DB → SCR-05c-001

**Business rules:** Khi xóa file cũ, bắt buộc upload file thay thế mới trước khi lưu

**API:** `PUT /api/classes/{id}/files/{fileId}` | Thay file: `DELETE file cũ` → `POST upload mới`

---

### SCR-05c-004: Xem trước file tài liệu (Inline Viewer)

**Mô tả:** Mở file trực tiếp trong trình duyệt (inline). Hỗ trợ PDF viewer tích hợp; Word/Excel hiển thị qua Google Docs Viewer hoặc Office Online. Có nút tải về.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│  XEM TRƯỚC: Bài giảng tuần 1          [⬇ Tải về] [✕ Đóng]  │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │              [  PDF / DOCX / XLSX Viewer  ]            │  │
│  │                                                        │  │
│  │   (Nội dung file hiển thị tại đây — iframe/embed)     │  │
│  │                                                        │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│   Trang: [◀]  1 / 12  [▶]          🔍 [+]  [−]  [100%▼]    │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Modal fullscreen, Embedded viewer (PDF.js / iframe), Pagination trang (PDF), Zoom controls, Nút Download

**Flow:** Click [👁] từ danh sách → Tải file → Render viewer → Xem → [✕ Đóng] → SCR-05c-001

**Business rules:**
- PDF: dùng PDF.js inline
- DOCX/XLSX: chuyển hướng qua Google Docs Viewer hoặc Office Online embed
- Nút [⬇ Tải về] luôn hiển thị với GV/CBQL

**API:** `GET /api/classes/{id}/files/{fileId}/download-url`

---

### SCR-05c-005: Chọn file từ thư viện

**Mô tả:** Modal tìm kiếm & chọn file từ thư viện cá nhân hoặc đơn vị để gắn vào lớp học. Hỗ trợ tìm theo từ khóa, lọc theo danh mục, phân trang, chọn nhiều.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│  CHỌN TỪ THƯ VIỆN                        [TV Cá nhân ▼]     │
├──────────────────────────────────────────────────────────────┤
│  Danh mục: [Tất cả          ▼]   🔍 [Tìm tên file...  ] [🔍]│
├────────────────────────────────────────────────────────────  │
│  ☐  📄 Bài giảng Đại số (PDF · 3.2 MB · 10/02/2026)        │
│  ☑  📊 Bảng số liệu thống kê (XLSX · 1.1 MB · 05/01/2026)  │
│  ☐  📝 Đề cương môn Vật lý (DOCX · 0.5 MB · 12/03/2026)    │
│  ☐  📄 Giáo trình Hóa học (PDF · 8.7 MB · 01/03/2026)      │
├──────────────────────────────────────────────────────────────┤
│  Đã chọn: 1 file     [◀]  1  2  [▶]    [10 ▼] /trang       │
│                              [Hủy]    [💾 Thêm vào lớp]     │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Modal, Dropdown nguồn TV (cá nhân/đơn vị), Dropdown danh mục, Search input, Danh sách checkbox, Pagination, Nút xác nhận

**Flow:** Chọn nguồn TV → Lọc/Tìm → Tick chọn file → [Thêm vào lớp] → Lưu liên kết → SCR-05c-001

**Business rules:**
- Cho phép chọn nhiều file cùng lúc
- File đã tồn tại trong lớp được đánh dấu "(Đã thêm)"

**API:** `GET /api/library/files?source=personal|unit&q=&category=` → `POST /api/classes/{id}/files/from-library`

---

## Phần B: Quản lý khảo sát trong lớp học

---

### SCR-05c-006: Danh sách khảo sát trong lớp học

**Mô tả:** Màn hình trung tâm quản lý khảo sát của lớp. Hiển thị danh sách khảo sát, tìm kiếm, phân trang, các thao tác tạo/sửa/xóa/duyệt/xem kết quả.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│ 🏠 > Lớp học > [10A1] > Nội dung > Khảo sát                 │
├──────────────────────────────────────────────────────────────┤
│  [+ Tạo khảo sát mới]                                        │
├──────────────────────────────────────────────────────────────┤
│  🔍 [Tìm tên khảo sát...         ]  [Tìm kiếm] [Đặt lại]   │
├──────────────────────────────────────────────────────────────┤
│  Tên khảo sát        │ Câu hỏi │ Trạng thái │    Thao tác   │
├──────────────────────┼─────────┼────────────┼───────────────┤
│  Khảo sát đầu kỳ    │   12    │ ✅ Đã duyệt │👁✏️📊🗑️        │
│  Đánh giá tuần 5    │    8    │ ⏳ Chờ duyệt│👁✏️📊🗑️[Duyệt] │
│  Khảo sát cuối kỳ  │    0    │ 📝 Nháp    │👁✏️📊🗑️        │
├──────────────────────┴─────────┴────────────┴───────────────┤
│  Hiển thị 1–3 / 8    [10 ▼] bản ghi/trang                   │
│                  [◀]  1  2  [▶]                              │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Breadcrumb, Toolbar, Search, Bảng + badge trạng thái, Action icons (👁 Xem trước / ✏️ Sửa / 📊 Kết quả / 🗑️ Xóa / Nút Duyệt inline), Pagination

**Flow:** Trang tải → DS khảo sát → [+ Tạo] → SCR-05c-007 | [✏️] → SCR-05c-007 (edit) | [👁] → SCR-05c-010 | [📊] → SCR-05c-011 | [🗑️] → Dialog xác nhận | [Duyệt] → Cập nhật trạng thái inline

**Business rules:**
- Khảo sát "Nháp" chưa hiển thị với học sinh
- Khảo sát "Đã duyệt" không cho phép thêm/xóa câu hỏi
- Duyệt yêu cầu ít nhất 1 câu hỏi trong khảo sát

**API:** `GET /api/classes/{id}/surveys?page=&limit=&q=` | `PATCH /api/surveys/{id}/approve`

---

### SCR-05c-007: Form tạo / chỉnh sửa khảo sát

**Mô tả:** Trang builder khảo sát hai vùng: (trái) metadata + danh sách nhóm câu hỏi; (phải) panel thêm câu hỏi vào nhóm đang chọn. Hỗ trợ nhiều loại câu hỏi (ma trận chọn một / chọn nhiều, v.v.).

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│  TẠO KHẢO SÁT                [👁 Xem trước]  [💾 Lưu]  [✕] │
├─────────────────────────────┬────────────────────────────────┤
│ THÔNG TIN CHUNG             │ NỘI DUNG KHẢO SÁT              │
│ Tiêu đề *                   │ [+ Thêm nhóm câu hỏi]          │
│ [_____________________]     │                                │
│ Mô tả                       │ ▼ Nhóm 1: Thông tin chung      │
│ [_____________________]     │   [+ Thêm câu hỏi]             │
│                             │   CĐ1. Bạn học lớp nào? [Ma    │
│ Thời gian mở                │        trận chọn 1] [✏️🗑️]     │
│ [dd/mm/yyyy hh:mm]          │   CĐ2. Đánh giá bài học?[✏️🗑️] │
│ Thời gian đóng              │                                │
│ [dd/mm/yyyy hh:mm]          │ ▼ Nhóm 2: Nội dung học tập     │
│                             │   [+ Thêm câu hỏi]             │
│ Ẩn danh  ● Có ○ Không       │   CĐ3. Bài nào khó nhất? [✏️🗑️]│
└─────────────────────────────┴────────────────────────────────┘
```

**Components:** Split layout, Text inputs, DateTimePicker (mở/đóng), Toggle ẩn danh, Accordion nhóm câu hỏi, Inline add/edit/delete câu hỏi, Nút Lưu + Xem trước

**Flow:** Nhập tiêu đề → [+ Thêm nhóm] → Nhập tên nhóm → [+ Thêm câu hỏi] → SCR-05c-009 (modal) → Lặp → [Lưu] → Validate → Lưu DB → SCR-05c-006

**Business rules:**
- Bắt buộc: tiêu đề khảo sát, ít nhất 1 nhóm, 1 câu hỏi
- Sau khi duyệt, không sửa được nội dung câu hỏi

**API:** `POST /api/classes/{id}/surveys` | `PUT /api/surveys/{id}` | `POST /api/surveys/{id}/groups` | `POST /api/surveys/{id}/groups/{gid}/questions`

---

### SCR-05c-008: Form nhóm câu hỏi (Modal)

**Mô tả:** Modal nhỏ để thêm hoặc chỉnh sửa tên và mô tả nhóm câu hỏi trong khảo sát.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────┐
│  THÊM NHÓM CÂU HỎI                  [✕] │
├──────────────────────────────────────────┤
│  Tên nhóm *  [_________________________] │
│  Mô tả       [_________________________] │
│                                          │
│              [Hủy]     [💾 Lưu nhóm]    │
└──────────────────────────────────────────┘
```

**Components:** Modal, Text input (tên bắt buộc), Textarea (mô tả), Buttons

**Flow:** [+ Thêm nhóm] → Modal → Nhập → [Lưu nhóm] → Đóng modal, cập nhật accordion SCR-05c-007

**Business rules:** Tên nhóm bắt buộc, tối đa 200 ký tự; tên không được trùng trong cùng khảo sát

**API:** `POST /api/surveys/{id}/groups` | `PUT /api/surveys/{id}/groups/{gid}`

---

### SCR-05c-009: Form câu hỏi (Modal)

**Mô tả:** Modal thêm/sửa câu hỏi trong nhóm. Hỗ trợ loại "Ma trận chọn một" và "Ma trận chọn nhiều" với bảng hàng/cột động.

**Actors:** GV, CBQL

```
┌────────────────────────────────────────────────────┐
│  THÊM CÂU HỎI                                  [✕] │
├────────────────────────────────────────────────────┤
│  Loại *  [Ma trận chọn một          ▼]             │
│  Nội dung câu hỏi *                                │
│  [______________________________________________]  │
│                                                    │
│  Các hàng (tiêu chí):         Các cột (mức độ):   │
│  [Nội dung hấp dẫn] [✕]      [Rất tốt    ] [✕]   │
│  [Giáo viên rõ ràng] [✕]     [Tốt        ] [✕]   │
│  [+ Thêm hàng]                [Chưa tốt  ] [✕]   │
│                               [+ Thêm cột]        │
│  Bắt buộc trả lời  ☑                              │
│                                                    │
│              [Hủy]      [💾 Lưu câu hỏi]          │
└────────────────────────────────────────────────────┘
```

**Components:** Modal, Dropdown loại câu hỏi, Textarea nội dung, Dynamic list hàng + cột (add/remove), Checkbox bắt buộc, Buttons

**Flow:** [+ Thêm câu hỏi] → Chọn loại → Nhập nội dung → Thêm hàng/cột → [Lưu câu hỏi] → Cập nhật panel SCR-05c-007

**Business rules:**
- Câu hỏi ma trận cần ít nhất 2 hàng và 2 cột
- Loại "chọn một": học sinh chỉ chọn 1 ô mỗi hàng
- Loại "chọn nhiều": học sinh có thể chọn nhiều ô

**API:** `POST /api/surveys/{id}/groups/{gid}/questions` | `PUT /api/.../questions/{qid}`

---

### SCR-05c-010: Xem trước khảo sát

**Mô tả:** Hiển thị khảo sát đúng như học sinh sẽ thấy — read-only, có phân trang theo nhóm câu hỏi, không gửi được.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│  XEM TRƯỚC: Khảo sát đầu kỳ           [✕ Đóng xem trước]   │
├──────────────────────────────────────────────────────────────┤
│  Nhóm 1: Thông tin chung                                     │
│  ─────────────────────────────────────────────────────────── │
│  CĐ1. Bạn đánh giá nội dung bài học như thế nào?            │
│                         │ Rất tốt │  Tốt  │ Chưa tốt │      │
│  Nội dung hấp dẫn       │   ○     │   ○   │    ○     │      │
│  GV giảng rõ ràng       │   ○     │   ○   │    ○     │      │
│  Tài liệu đầy đủ        │   ○     │   ○   │    ○     │      │
│                                                              │
│  [⚠ Chế độ xem trước — Không thể nộp]                       │
│                           [◀ Nhóm trước]  [Nhóm tiếp ▶]     │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Modal fullscreen, Header tên khảo sát, Câu hỏi ma trận (radio/checkbox), Banner cảnh báo xem trước, Điều hướng nhóm, Nút đóng

**Flow:** [👁] tại SCR-05c-006 → Load preview → Duyệt qua các nhóm → [✕ Đóng] → SCR-05c-006

**Business rules:** Các ô radio/checkbox hiển thị nhưng không tương tác được; không có nút "Nộp bài"

**API:** `GET /api/surveys/{id}/preview`

---

### SCR-05c-011: Báo cáo kết quả khảo sát

**Mô tả:** Trang báo cáo đa tab — (1) Danh sách người tham gia, (2) Biểu đồ (tròn/cột/đường), (3) Thống kê tổng hợp. Hỗ trợ xuất Excel.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│ 📊 Kết quả: Khảo sát đầu kỳ              [⬇ Xuất XLSX] [✕] │
├──────────────────────────────────────────────────────────────┤
│  [📋 Danh sách] [📊 Biểu đồ] [📈 Thống kê]                  │
├──────────────────────────────────────────────────────────────┤
│  TAB 1 – DANH SÁCH THAM GIA                                  │
│  Họ tên         │ Tham gia lúc       │ Hoàn thành │          │
│  Nguyễn A       │ 2026-03-10 08:32   │ ✅          │          │
│  Trần B         │ 2026-03-10 09:15   │ ✅          │          │
│  Lê C           │ —                  │ ❌ Chưa tham│          │
│  Tổng: 30 HS  │  Đã tham gia: 22  │  Chưa: 8   │          │
├──────────────────────────────────────────────────────────────┤
│  TAB 2 – BIỂU ĐỒ         [🥧 Tròn] [📊 Cột] [📈 Đường]     │
│  ┌────────────────────────────────────┐                      │
│  │   73%  ████████████████            │                      │
│  │   27%  ████                        │                      │
│  │   ■ Đã tham gia  ■ Chưa tham gia  │                      │
│  └────────────────────────────────────┘                      │
├──────────────────────────────────────────────────────────────┤
│  TAB 3 – THỐNG KÊ: Bảng tổng hợp câu trả lời theo từng CĐ  │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Tab navigation (3 tab), Bảng danh sách + badge hoàn thành, Summary row, Bộ chọn loại biểu đồ, Chart (pie/bar/line), Bảng thống kê câu trả lời, Nút Xuất XLSX

**Flow:** [📊] tại SCR-05c-006 → Load báo cáo → Chuyển tab → Đổi loại biểu đồ → [⬇ Xuất XLSX] → Download file

**Business rules:**
- Tab "Thống kê" tổng hợp số lượng và % từng lựa chọn cho mỗi câu hỏi
- Xuất XLSX bao gồm cả 3 phần báo cáo trong các sheet riêng

**API:** `GET /api/surveys/{id}/results` | `GET /api/surveys/{id}/results/export-xlsx` (→ file download)

---

## Bảng tổng hợp màn hình

| Mã màn hình   | Tên                                 | Actors     | Loại       |
|---------------|-------------------------------------|------------|------------|
| SCR-05c-001   | Danh sách file trong lớp            | GV, CBQL   | List       |
| SCR-05c-002   | Form thêm file tài liệu             | GV, CBQL   | Form       |
| SCR-05c-003   | Form chỉnh sửa file tài liệu        | GV, CBQL   | Form       |
| SCR-05c-004   | Xem trước file (Inline Viewer)      | GV, CBQL   | Modal      |
| SCR-05c-005   | Chọn file từ thư viện               | GV, CBQL   | Modal      |
| SCR-05c-006   | Danh sách khảo sát trong lớp        | GV, CBQL   | List       |
| SCR-05c-007   | Builder tạo/sửa khảo sát            | GV, CBQL   | Builder    |
| SCR-05c-008   | Form nhóm câu hỏi                   | GV, CBQL   | Modal      |
| SCR-05c-009   | Form câu hỏi (ma trận)              | GV, CBQL   | Modal      |
| SCR-05c-010   | Xem trước khảo sát                  | GV, CBQL   | Modal      |
| SCR-05c-011   | Báo cáo kết quả khảo sát            | GV, CBQL   | Dashboard  |
