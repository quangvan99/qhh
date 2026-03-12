---
title: "WF-07a: Ngân hàng câu hỏi & Đề thi"
cluster: "Learning - Assessment / Question Bank"
updated: 2026-03-11
---

# WF-07a: Ngân hàng câu hỏi & Đề thi

## Tổng quan module

Module **Quản lý ngân hàng câu hỏi, đề thi dùng chung** cung cấp giao diện trung tâm để CBQL (Cán bộ quản lý) quản lý toàn bộ kho câu hỏi (trắc nghiệm, tự luận) và đề thi tái sử dụng trong toàn hệ thống. Giao diện được tổ chức thành **2 tab chính**: `Ngân hàng câu hỏi` và `Đề thi`.

### Danh sách màn hình

| Mã | Tên màn hình |
|----|-------------|
| SCR-07-001 | Danh sách Ngân hàng câu hỏi (tab Câu hỏi) |
| SCR-07-002 | Thêm / Sửa câu hỏi trắc nghiệm (Một lựa chọn / Nhiều lựa chọn / Chính-Phụ) |
| SCR-07-003 | Import câu hỏi trắc nghiệm từ Excel |
| SCR-07-004 | Sao chép câu hỏi trắc nghiệm |
| SCR-07-005 | Kết xuất câu hỏi |
| SCR-07-006 | Thêm / Sửa câu hỏi tự luận |
| SCR-07-007 | Import câu hỏi tự luận từ Excel |
| SCR-07-008 | Danh sách Đề thi & Danh mục đề thi (tab Đề thi) |
| SCR-07-009 | Thêm / Sửa đề thi (form tổng hợp) |
| SCR-07-010 | Modal: Thêm / Sửa phần thi |
| SCR-07-011 | Modal: Cấu trúc ngẫu nhiên (Thêm / Sửa / Sao chép / Xóa) |
| SCR-07-012 | Modal: Chọn câu hỏi đích danh cho đề thi |
| SCR-07-013 | Xuất đề thi Offline |

---

## SCR-07-001 — Danh sách Ngân hàng câu hỏi

### Mô tả
Màn hình chính của module. Hiển thị danh sách tất cả câu hỏi dùng chung (trắc nghiệm các loại và tự luận) với bộ lọc đa tiêu chí, phân trang và các action trên từng dòng.

### Actors
- **Cán bộ quản lý (CBQL)** — xem, tìm kiếm, thêm, sửa, xóa, sao chép, kết xuất câu hỏi.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [≡] LOGO   Quản lý học tập            [🔔] [👤 Nguyễn Văn A ▾]                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Học tập › Quản lý ngân hàng câu hỏi, đề thi dùng chung                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗   │
│  ║  [ Ngân hàng câu hỏi ]    [ Đề thi ]                                        ║   │
│  ╠══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                              ║   │
│  ║  ┌─── BỘ LỌC ───────────────────────────────────────────────────────────┐   ║   │
│  ║  │  🔍 [Nhập từ khóa tìm kiếm câu hỏi...              ]  [Tìm kiếm]    │   ║   │
│  ║  │                                                                      │   ║   │
│  ║  │  Danh mục: [Chọn danh mục câu hỏi ▾]                                 │   ║   │
│  ║  │  Loại CH:  [Tất cả ▾]  ← (Một lựa chọn | Nhiều lựa chọn |           │   ║   │
│  ║  │                            Chính-Phụ | Tự luận)                      │   ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘   ║   │
│  ║                                                                              ║   │
│  ║  ┌─── TOOLBAR ──────────────────────────────────────────────────────────┐   ║   │
│  ║  │  [+ Thêm câu hỏi ▾]  [📥 Thêm từ Excel]  [📤 Kết xuất]             │   ║   │
│  ║  │                                                                      │   ║   │
│  ║  │  ┌─── QUẢN LÝ DANH MỤC ──────────────────────────────────────────┐  │   ║   │
│  ║  │  │  [+ Thêm danh mục cùng cấp]  [+ Thêm danh mục cấp con]        │  │   ║   │
│  ║  │  │  [✎ Sửa danh mục]  [🗑 Xóa danh mục]                          │  │   ║   │
│  ║  │  └───────────────────────────────────────────────────────────────┘  │   ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘   ║   │
│  ║                                                                              ║   │
│  ║  ┌─── BẢNG DANH SÁCH CÂU HỎI ───────────────────────────────────────────┐  ║   │
│  ║  │ ☐  #   Nội dung câu hỏi       Loại CH        Danh mục      Hành động │  ║   │
│  ║  ├──────────────────────────────────────────────────────────────────────┤  ║   │
│  ║  │ ☐  1  [Câu hỏi 1: Thủ đô...]  Một lựa chọn  Địa lý › VN  [✎][⧉][🗑]│  ║   │
│  ║  │ ☐  2  [Câu hỏi 2: Phương...]  Nhiều lựa chọn Toán học     [✎][⧉][🗑]│  ║   │
│  ║  │ ☐  3  [Câu hỏi 3 (Chính)...]  Chính - Phụ   Tiếng Anh    [✎][⧉][🗑]│  ║   │
│  ║  │    ├─ [Câu hỏi con 3a...]     (con)          Tiếng Anh    [✎][🗑]   │  ║   │
│  ║  │    └─ [Câu hỏi con 3b...]     (con)          Tiếng Anh    [✎][🗑]   │  ║   │
│  ║  │ ☐  4  [Câu hỏi 4: Trình bày] Tự luận        Văn học      [✎][⧉][🗑]│  ║   │
│  ║  │  ...                                                                 │  ║   │
│  ║  ├──────────────────────────────────────────────────────────────────────┤  ║   │
│  ║  │  Hiển thị: [10 ▾]  bản ghi / trang          ← 1  2  3 ... 10 →      │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ╚══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

  Chú thích icon: [✎] = Sửa  [⧉] = Sao chép  [🗑] = Xóa
  Dropdown "+ Thêm câu hỏi ▾":
  ┌─────────────────────────────────┐
  │ • Một lựa chọn đúng             │
  │ • Nhiều lựa chọn đúng           │
  │ • Câu hỏi dạng Chính - Phụ      │
  │ • Câu hỏi Tự luận               │
  └─────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `TabBar` | 2 tab: "Ngân hàng câu hỏi" (active) / "Đề thi" |
| `SearchInput` | Tìm kiếm theo từ khóa nội dung câu hỏi |
| `CategorySelect` | Dropdown cây danh mục câu hỏi (đa cấp) |
| `TypeSelect` | Dropdown loại câu hỏi (4 loại) |
| `AddQuestionDropdown` | Nút split-button mở menu chọn loại câu hỏi cần thêm |
| `ImportExcelBtn` | Mở màn SCR-07-003 hoặc SCR-07-007 tùy loại |
| `ExportBtn` | Kết xuất câu hỏi đang chọn → SCR-07-005 |
| `CategoryToolbar` | Thêm cùng cấp / cấp con / Sửa / Xóa danh mục |
| `QuestionTable` | Bảng có checkbox, hỗ trợ cây Chính-Phụ fold/unfold |
| `RowActions` | Icon Sửa / Sao chép / Xóa inline |
| `Pagination` | Phân trang + Chọn số bản ghi/trang (10/20/50) |

### Flow điều hướng
```
SCR-07-001
 ├─[+ Thêm câu hỏi › Một/Nhiều lựa chọn / Chính-Phụ]──→ SCR-07-002
 ├─[+ Thêm câu hỏi › Tự luận]──────────────────────────→ SCR-07-006
 ├─[Thêm từ Excel] (trắc nghiệm)───────────────────────→ SCR-07-003
 ├─[Thêm từ Excel] (tự luận)────────────────────────────→ SCR-07-007
 ├─[Kết xuất]────────────────────────────────────────────→ SCR-07-005
 ├─[✎ Sửa câu hỏi trắc nghiệm]─────────────────────────→ SCR-07-002 (edit mode)
 ├─[✎ Sửa câu hỏi tự luận]──────────────────────────────→ SCR-07-006 (edit mode)
 ├─[⧉ Sao chép câu hỏi trắc nghiệm]─────────────────────→ SCR-07-004
 ├─[⧉ Sao chép câu hỏi tự luận]─────────────────────────→ SCR-07-006 (copy mode)
 └─[tab Đề thi]──────────────────────────────────────────→ SCR-07-008
```

### Business Rules
- **BR-001**: Danh mục câu hỏi tổ chức theo cây đa cấp; tên danh mục không được trùng trong cùng cấp cha.
- **BR-002**: Xóa danh mục cha sẽ xóa cascade toàn bộ danh mục con và câu hỏi bên trong — bắt buộc xác nhận.
- **BR-003**: Loại câu hỏi "Chính - Phụ" hiển thị dạng tree row (câu hỏi chính + các câu hỏi con); xóa câu hỏi chính sẽ xóa toàn bộ câu hỏi con.
- **BR-004**: Checkbox chọn tất cả trên header chỉ chọn các câu hỏi cùng loại; khi chọn nhiều câu hỏi mới hiển thị nút "Xóa nhiều".
- **BR-005**: CBQL phải được cấp quyền tương ứng (xem / thêm / sửa / xóa) mới thực hiện được thao tác.
- **BR-006**: Kết xuất áp dụng trên tập câu hỏi đang được lọc/chọn; output là file Excel.

### API Endpoints
```
GET    /api/v1/question-bank/questions          # Lấy danh sách câu hỏi (filter, paginate)
GET    /api/v1/question-bank/categories         # Lấy cây danh mục câu hỏi
POST   /api/v1/question-bank/categories         # Thêm danh mục
PUT    /api/v1/question-bank/categories/{id}    # Sửa danh mục
DELETE /api/v1/question-bank/categories/{id}    # Xóa danh mục (cascade)
DELETE /api/v1/question-bank/questions          # Xóa nhiều câu hỏi (body: {ids})
GET    /api/v1/question-bank/questions/export   # Kết xuất câu hỏi → file Excel
```

---

## SCR-07-002 — Thêm / Sửa câu hỏi trắc nghiệm

### Mô tả
Form nhập/chỉnh sửa câu hỏi dạng **Một lựa chọn đúng**, **Nhiều lựa chọn đúng** hoặc câu hỏi **Chính - Phụ** (câu hỏi chính và các câu hỏi con). Giao diện thống nhất, chỉ khác phần câu trả lời (radio vs checkbox) và block câu hỏi con (chỉ có ở Chính-Phụ).

### Actors
- **CBQL** — thêm mới hoặc chỉnh sửa câu hỏi.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại danh sách          THÊM MỚI CÂU HỎI TRẮC NGHIỆM                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─── THÔNG TIN CÂU HỎI ────────────────────────────────────────────────────────┐  │
│  │                                                                               │  │
│  │  Dạng câu hỏi: (*) Một lựa chọn đúng                                         │  │
│  │               ( ) Nhiều lựa chọn đúng                                        │  │
│  │               ( ) Câu hỏi dạng Chính - Phụ                                   │  │
│  │                                                                               │  │
│  │  Danh mục câu hỏi: [Chọn danh mục ▾]  *                                      │  │
│  │                                                                               │  │
│  │  Nội dung câu hỏi: *                                                          │  │
│  │  ┌────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │  [B] [I] [U] [Img] [Link] [Math]                                       │  │  │
│  │  │ ─────────────────────────────────────────────────────────────────────  │  │  │
│  │  │  Nhập nội dung câu hỏi tại đây...                                      │  │  │
│  │  └────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                               │  │
│  │  File audio: [Chọn file .mp3/.wav ...]  [Tải lên]                             │  │
│  │  ┌── Danh sách audio đã tải ──────────────────────────────────────────────┐  │  │
│  │  │  🎵 audio_01.mp3  [▶ Nghe]  [🗑 Xóa]                                  │  │  │
│  │  │  [+ Thêm file audio khác]                                               │  │  │
│  │  └────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── CÂU TRẢ LỜI (Một lựa chọn đúng) ────────────────────────────────────────┐   │
│  │                                                                               │  │
│  │  Đ/S   Nội dung câu trả lời                               Hành động          │  │
│  │  ────  ──────────────────────────────────────────────     ────────           │  │
│  │  (●)   [A. Hà Nội                                    ]   [🗑 Xóa]            │  │
│  │  ( )   [B. Hải Phòng                                 ]   [🗑 Xóa]            │  │
│  │  ( )   [C. TP. Hồ Chí Minh                           ]   [🗑 Xóa]            │  │
│  │  ( )   [D. Đà Nẵng                                   ]   [🗑 Xóa]            │  │
│  │                                                                               │  │
│  │  [+ Thêm câu trả lời]                                                         │  │
│  │                                                                               │  │
│  │  ⚠ Radio (●) = đánh dấu đáp án đúng (chỉ chọn 1)                            │  │
│  │    (Nếu dạng Nhiều lựa chọn → thay bằng ☑ checkbox)                          │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── [CHỈ HIỆN VỚI DẠNG CHÍNH - PHỤ] — CÂU HỎI CON ─────────────────────────┐   │
│  │                                                                               │  │
│  │  #  Nội dung câu hỏi con       Câu trả lời               Hành động           │  │
│  │  ─  ───────────────────────    ──────────────────────     ────────────        │  │
│  │  1  [Câu hỏi con 1...]         A/B/C/D (Đáp án: B)        [✎ Sửa] [🗑 Xóa]  │  │
│  │  2  [Câu hỏi con 2...]         A/B/C (Đáp án: A)          [✎ Sửa] [🗑 Xóa]  │  │
│  │                                                                               │  │
│  │  [+ Thêm câu hỏi con]                                                         │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              [Hủy]    [💾 Lưu câu hỏi]                      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘

--- Modal: THÊM / SỬA CÂU HỎI CON (Chính - Phụ) ---
┌────────────────────────────────────────────────────────────────┐
│  Sửa câu hỏi con                                          [✕] │
├────────────────────────────────────────────────────────────────┤
│  Nội dung câu hỏi con: *                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [B][I][U][Img]  Nhập nội dung câu hỏi con...            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  File audio: [Chọn file...]  [Tải lên]                         │
│  🎵 audio_con_01.mp3  [▶][🗑]   [+ Thêm file audio khác]      │
│                                                                │
│  Câu trả lời:                                                  │
│  (●) [A. Đáp án A...      ]  [🗑]                              │
│  ( ) [B. Đáp án B...      ]  [🗑]                              │
│  ( ) [C. Đáp án C...      ]  [🗑]                              │
│                         [+ Thêm câu trả lời]                   │
│                                                                │
│                      [Hủy]   [Lưu câu hỏi con]                │
└────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `QuestionTypeRadio` | 3 radio chọn dạng câu hỏi trắc nghiệm |
| `CategorySelect` | Dropdown chọn danh mục (bắt buộc) |
| `RichTextEditor` | Soạn thảo nội dung câu hỏi hỗ trợ rich-text + công thức toán |
| `AudioUpload` | Upload file âm thanh (.mp3/.wav); danh sách audio đã upload + xóa từng file |
| `AnswerList` | Danh sách câu trả lời: radio (1 lựa chọn) hoặc checkbox (nhiều lựa chọn); đánh dấu đáp án đúng |
| `AddAnswerBtn` | Thêm dòng câu trả lời mới |
| `SubQuestionTable` | Bảng câu hỏi con (chỉ dạng Chính-Phụ) + CRUD |
| `SubQuestionModal` | Modal thêm/sửa câu hỏi con |
| `SaveBtn` / `CancelBtn` | Lưu / Hủy form |
| `ValidationToast` | Hiển thị lỗi validation inline |

### Flow điều hướng
```
SCR-07-002 (Thêm/Sửa)
 ├─[Lưu thành công]──────────────────→ SCR-07-001 (toast "Lưu thành công")
 ├─[Hủy]─────────────────────────────→ SCR-07-001
 ├─[Lỗi validation]──────────────────→ Hiển thị inline error, giữ nguyên form
 └─[+ Thêm câu hỏi con › Lưu]────────→ Cập nhật bảng câu hỏi con, đóng modal
```

### Business Rules
- **BR-007**: Bắt buộc chọn danh mục và nhập nội dung câu hỏi; thiếu → hiện thông báo lỗi.
- **BR-008**: Câu hỏi dạng Một lựa chọn → chỉ được đánh dấu đúng 1 đáp án.
- **BR-009**: Câu hỏi dạng Nhiều lựa chọn → phải đánh dấu ít nhất 1 đáp án đúng.
- **BR-010**: Dạng Chính - Phụ → câu hỏi chính không có đáp án riêng; đáp án nằm ở từng câu hỏi con.
- **BR-011**: File audio chấp nhận `.mp3`, `.wav`; kích thước tối đa theo cấu hình hệ thống; sai định dạng → báo lỗi ngay lúc upload.
- **BR-012**: Câu hỏi đang được sử dụng trong đề thi → vẫn có thể sửa nhưng cảnh báo ảnh hưởng.

### API Endpoints
```
POST   /api/v1/question-bank/questions                      # Thêm câu hỏi mới
PUT    /api/v1/question-bank/questions/{id}                 # Sửa câu hỏi
POST   /api/v1/question-bank/questions/{id}/answers         # Thêm câu trả lời
DELETE /api/v1/question-bank/questions/{id}/answers/{aid}   # Xóa câu trả lời
POST   /api/v1/question-bank/questions/{id}/audio           # Upload audio
DELETE /api/v1/question-bank/questions/{id}/audio/{fid}     # Xóa audio
POST   /api/v1/question-bank/questions/{id}/sub-questions   # Thêm câu hỏi con
PUT    /api/v1/question-bank/questions/{id}/sub-questions/{sid}  # Sửa câu hỏi con
DELETE /api/v1/question-bank/questions/{id}/sub-questions/{sid}  # Xóa câu hỏi con
```

---

## SCR-07-003 — Import câu hỏi trắc nghiệm từ Excel

### Mô tả
Màn hình nhập câu hỏi trắc nghiệm (Một lựa chọn, Nhiều lựa chọn, Chính-Phụ) hàng loạt qua file Excel. Cung cấp chức năng tải template, upload file và xem kết quả preview trước khi lưu.

### Actors
- **CBQL** — tải template, upload file, xem preview, lưu lên hệ thống.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại            THÊM CÂU HỎI TRẮC NGHIỆM TỪ FILE EXCEL                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─── BƯỚC 1: CHỌN LOẠI CÂU HỎI & TẢI TEMPLATE ──────────────────────────────┐   │
│  │                                                                              │   │
│  │  Dạng câu hỏi: [Một lựa chọn đúng ▾]                                        │   │
│  │  (Một lựa chọn đúng | Nhiều lựa chọn đúng | Câu hỏi Chính - Phụ)            │   │
│  │                                                                              │   │
│  │  Danh mục đích: [Chọn danh mục câu hỏi ▾]  *                                │   │
│  │                                                                              │   │
│  │  📄 Tải file template Excel:  [📥 Tải file Excel mẫu]                        │   │
│  │     → Tải file template phù hợp với loại câu hỏi đã chọn.                   │   │
│  │                                                                              │   │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── BƯỚC 2: TẢI FILE LÊN ────────────────────────────────────────────────────┐  │
│  │                                                                              │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │  │
│  │  │                                                                     │    │  │
│  │  │        ☁  Kéo thả file Excel vào đây                               │    │  │
│  │  │             hoặc  [Chọn file từ máy tính]                           │    │  │
│  │  │                                                                     │    │  │
│  │  │        Định dạng hỗ trợ: .xlsx, .xls  (tối đa 10MB)                │    │  │
│  │  │                                                                     │    │  │
│  │  └─────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                              │  │
│  │  [Sau khi chọn file]                                                         │  │
│  │  📎 cau_hoi_tracnghiem.xlsx  (245 KB)   [✕ Xóa file]                        │  │
│  │  [📤 Tải lên & Xử lý]                                                        │  │
│  │                                                                              │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── BƯỚC 3: PREVIEW KẾT QUẢ ─────────────────────────────────────────────────┐  │
│  │                                                                              │  │
│  │  ✅ Xử lý thành công: 18 câu hỏi                                             │  │
│  │  ❌ Lỗi: 2 câu hỏi — xem chi tiết bên dưới                                  │  │
│  │                                                                              │  │
│  │  ┌─ Danh sách lỗi ─────────────────────────────────────────────────────┐    │  │
│  │  │  Dòng 5:  Thiếu nội dung câu hỏi (cột B để trống)                   │    │  │
│  │  │  Dòng 12: Không xác định được đáp án đúng (cột "Đáp án" không hợp lệ│    │  │
│  │  └─────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                              │  │
│  │  Bảng preview câu hỏi hợp lệ:                                                │  │
│  │  #   Nội dung câu hỏi              Loại CH          Đáp án đúng             │  │
│  │  ─────────────────────────────────────────────────────────────────────       │  │
│  │  1   Thủ đô của Việt Nam là...     Một lựa chọn     A. Hà Nội               │  │
│  │  2   Chọn các số nguyên tố...      Nhiều lựa chọn   B, D                    │  │
│  │  ...                                                                         │  │
│  │                                                                              │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │    [Quay lại]   [Tải lại file khác]          [💾 Lưu câu hỏi hợp lệ]        │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `QuestionTypeSelect` | Chọn loại câu hỏi trắc nghiệm để download template tương ứng |
| `CategorySelect` | Gán danh mục đích cho toàn bộ câu hỏi import |
| `DownloadTemplateBtn` | Download file Excel template theo loại đã chọn |
| `FileDropzone` | Drag-drop hoặc click chọn file .xlsx/.xls |
| `UploadProcessBtn` | Tải lên + xử lý phân tích file |
| `ErrorList` | Hiển thị danh sách lỗi từng dòng trong file |
| `PreviewTable` | Bảng xem trước câu hỏi hợp lệ |
| `SaveValidBtn` | Lưu chỉ câu hỏi hợp lệ vào NHCH |

### Flow điều hướng
```
SCR-07-003
 ├─[Tải file Excel mẫu]──────────────→ Download file .xlsx
 ├─[Tải lên & Xử lý - Thành công]────→ Hiển thị preview + danh sách lỗi
 ├─[Tải lên & Xử lý - Sai định dạng]→ Toast error "Sai định dạng file"
 ├─[Lưu câu hỏi hợp lệ]──────────────→ SCR-07-001 (toast "Lưu thành công X câu hỏi")
 └─[Quay lại]─────────────────────────→ SCR-07-001
```

### Business Rules
- **BR-013**: Chỉ chấp nhận file `.xlsx` hoặc `.xls`; sai định dạng → báo lỗi ngay.
- **BR-014**: Mỗi loại câu hỏi có template riêng; hệ thống tự detect dựa theo cấu trúc cột.
- **BR-015**: Các dòng lỗi bị bỏ qua; CBQL vẫn có thể lưu phần hợp lệ.
- **BR-016**: Sau khi lưu, câu hỏi mới được gán vào danh mục đã chọn ở bước 1.

### API Endpoints
```
GET    /api/v1/question-bank/questions/import/template?type={type}  # Download template
POST   /api/v1/question-bank/questions/import/preview               # Upload + parse (multipart)
POST   /api/v1/question-bank/questions/import/save                  # Lưu câu hỏi hợp lệ
```

---

## SCR-07-004 — Sao chép câu hỏi trắc nghiệm

### Mô tả
Khi nhấn icon **[⧉ Sao chép]** tại danh sách câu hỏi, hệ thống mở form giống SCR-07-002 nhưng tự động điền sẵn dữ liệu từ câu hỏi gốc (clone). CBQL chỉnh sửa nội dung cần thay đổi rồi lưu để tạo câu hỏi mới.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại danh sách          SAO CHÉP CÂU HỎI                                    │
│                                ⚠ Đây là bản sao. Vui lòng chỉnh sửa trước khi lưu.│
├─────────────────────────────────────────────────────────────────────────────────────┤
│  [Layout giống SCR-07-002 — toàn bộ trường đã được điền sẵn dữ liệu câu hỏi gốc]  │
│                                                                                     │
│  Dạng câu hỏi: (*) Một lựa chọn đúng   (readonly — không thay đổi loại khi sao chép│
│  Danh mục câu hỏi: [Địa lý › Việt Nam ▾]  (có thể thay đổi danh mục đích)          │
│                                                                                     │
│  Nội dung câu hỏi:  [Nội dung câu hỏi gốc — có thể chỉnh sửa]                     │
│  File audio: (kế thừa từ câu hỏi gốc — có thể xóa/thêm)                           │
│                                                                                     │
│  Câu trả lời: (kế thừa toàn bộ — có thể thêm/sửa/xóa)                             │
│  (●) [A. Hà Nội              ]  [🗑]                                                │
│  ( ) [B. Hải Phòng           ]  [🗑]                                                │
│  ...                                                                                │
│  [+ Thêm câu trả lời]                                                               │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              [Hủy]    [💾 Lưu câu hỏi mới]                  │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Business Rules
- **BR-017**: Sao chép tạo bản ghi mới hoàn toàn; không liên kết với câu hỏi gốc.
- **BR-018**: Loại câu hỏi (dạng) không được thay đổi trong luồng sao chép.
- **BR-019**: Câu hỏi mới sẽ không xuất hiện trong đề thi cũ; chỉ khả dụng sau khi lưu.

### API Endpoints
```
GET    /api/v1/question-bank/questions/{id}        # Lấy dữ liệu câu hỏi gốc để pre-fill
POST   /api/v1/question-bank/questions             # Lưu câu hỏi sao chép (tạo mới)
```

---

## SCR-07-005 — Kết xuất câu hỏi

### Mô tả
Cho phép CBQL xuất câu hỏi đang được lọc/chọn trong danh sách ra file Excel. Thao tác thực hiện nhanh — không có màn hình riêng, trigger từ SCR-07-001.

### ASCII Wireframe

```
[Trigger từ SCR-07-001 — CBQL chọn câu hỏi và nhấn [📤 Kết xuất]]

┌──────────────────────────────────────────────────────┐
│  Kết xuất câu hỏi                               [✕]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Phạm vi kết xuất:                                   │
│  (●) Toàn bộ câu hỏi đang hiển thị (theo bộ lọc)    │
│  ( ) Chỉ các câu hỏi đã chọn (18 câu)               │
│                                                      │
│  Định dạng: (*) Excel (.xlsx)   ( ) Word (.docx)     │
│                                                      │
│  Loại câu hỏi xuất:                                  │
│  ☑ Một lựa chọn đúng                                 │
│  ☑ Nhiều lựa chọn đúng                               │
│  ☑ Chính - Phụ                                       │
│  ☑ Tự luận                                           │
│                                                      │
│              [Hủy]   [📥 Kết xuất ngay]              │
└──────────────────────────────────────────────────────┘

[Sau khi nhấn Kết xuất → hệ thống tạo file và trình duyệt tự động tải về]
Toast: ✅ "Kết xuất thành công! File đang được tải về."
```

### Business Rules
- **BR-020**: Kết xuất theo bộ lọc hiện tại hoặc chỉ các câu hỏi đã tích chọn.
- **BR-021**: File kết xuất theo định dạng template chuẩn có thể tái import.

### API Endpoints
```
GET    /api/v1/question-bank/questions/export
       ?scope=[all|selected]&ids=1,2,3&types=single,multiple,essay
       → trả về file blob (.xlsx)
```

---

## SCR-07-006 — Thêm / Sửa câu hỏi tự luận

### Mô tả
Form nhập/chỉnh sửa câu hỏi dạng **Tự luận** (essay). Khác với trắc nghiệm, câu hỏi tự luận không có câu trả lời cố định mà chỉ có nội dung câu hỏi, hướng dẫn chấm (gợi ý đáp án) và file âm thanh tùy chọn.

### Actors
- **CBQL** — thêm mới hoặc chỉnh sửa câu hỏi tự luận.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại danh sách          THÊM MỚI CÂU HỎI TỰ LUẬN                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─── THÔNG TIN CÂU HỎI TỰ LUẬN ────────────────────────────────────────────────┐ │
│  │                                                                               │ │
│  │  Dạng câu hỏi: [Tự luận]  (cố định)                                          │ │
│  │                                                                               │ │
│  │  Danh mục câu hỏi: [Chọn danh mục ▾]  *                                      │ │
│  │                                                                               │ │
│  │  Nội dung câu hỏi: *                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  [B] [I] [U] [Img] [Link] [Math]                                       │  │ │
│  │  │ ─────────────────────────────────────────────────────────────────────  │  │ │
│  │  │  Nhập nội dung câu hỏi tự luận tại đây...                              │  │ │
│  │  └────────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                               │ │
│  │  File audio (tùy chọn):                                                       │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Chọn file .mp3/.wav...]  [Tải lên]                                   │  │ │
│  │  │                                                                        │  │ │
│  │  │  Danh sách audio:                                                      │  │ │
│  │  │  🎵 essay_audio_01.mp3  [▶ Nghe]  [🔄 Thay thế]  [🗑 Xóa]            │  │ │
│  │  │  [+ Thêm file audio khác]                                               │  │ │
│  │  └────────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                               │ │
│  │  Hướng dẫn chấm / Gợi ý đáp án: (tùy chọn)                                  │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  [B] [I] [U] [Img]                                                     │  │ │
│  │  │  Nhập gợi ý đáp án / rubric chấm điểm...                               │  │ │
│  │  └────────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                               │ │
│  │  Điểm tối đa: [____] (số)                                                     │ │
│  │                                                                               │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              [Hủy]    [💾 Lưu câu hỏi]                      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `CategorySelect` | Dropdown chọn danh mục |
| `RichTextEditor` | Soạn thảo nội dung câu hỏi |
| `AudioUploadManager` | Upload + danh sách audio (hỗ trợ thêm nhiều file, thay thế từng file, xóa) |
| `MarkingGuideEditor` | Rich-text nhập hướng dẫn chấm |
| `MaxScoreInput` | Nhập điểm tối đa (số nguyên dương) |
| `SaveBtn` / `CancelBtn` | Lưu / Hủy |

### Business Rules
- **BR-022**: Câu hỏi tự luận không có câu trả lời cố định; không validate bắt buộc câu trả lời.
- **BR-023**: Có thể upload nhiều file audio (mỗi file nghe riêng); hỗ trợ thay thế từng file (xóa cũ, upload mới).
- **BR-024**: Điểm tối đa là số nguyên dương; để trống = 0.
- **BR-025**: Hướng dẫn chấm chỉ CBQL thấy, không hiển thị cho học sinh khi làm bài.

### API Endpoints
```
POST   /api/v1/question-bank/questions                        # Thêm câu hỏi tự luận
PUT    /api/v1/question-bank/questions/{id}                   # Sửa câu hỏi tự luận
POST   /api/v1/question-bank/questions/{id}/audio             # Upload audio
PUT    /api/v1/question-bank/questions/{id}/audio/{fid}       # Thay thế audio
DELETE /api/v1/question-bank/questions/{id}/audio/{fid}       # Xóa audio
```

---

## SCR-07-007 — Import câu hỏi tự luận từ Excel

### Mô tả
Tương tự SCR-07-003 nhưng dành cho câu hỏi **Tự luận**. Template Excel có cấu trúc khác (cột nội dung câu hỏi, cột hướng dẫn chấm, cột điểm tối đa).

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại            THÊM CÂU HỎI TỰ LUẬN TỪ FILE EXCEL                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─── BƯỚC 1: CHỌN DANH MỤC & TẢI TEMPLATE ──────────────────────────────────┐   │
│  │  Loại câu hỏi: [Tự luận]  (cố định)                                        │   │
│  │  Danh mục đích: [Chọn danh mục câu hỏi ▾]  *                               │   │
│  │  📄 [📥 Tải file Excel mẫu (Tự luận)]                                       │   │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── BƯỚC 2: TẢI FILE LÊN ────────────────────────────────────────────────────┐  │
│  │  [Drag-drop / chọn file .xlsx — layout giống SCR-07-003]                    │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── BƯỚC 3: PREVIEW KẾT QUẢ ─────────────────────────────────────────────────┐  │
│  │  ✅ Hợp lệ: 10 câu hỏi tự luận                                              │  │
│  │  ❌ Lỗi: 1 câu hỏi (Dòng 7: Điểm tối đa không phải số nguyên)              │  │
│  │                                                                              │  │
│  │  #   Nội dung câu hỏi              Điểm tối đa   Hướng dẫn chấm             │  │
│  │  ─────────────────────────────────────────────────────────────────────      │  │
│  │  1   Trình bày về lịch sử...       10            Nêu đủ 5 ý chính...        │  │
│  │  2   Phân tích tác phẩm...         20            Yêu cầu lập dàn ý...       │  │
│  │  ...                                                                         │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  [Quay lại]  [Tải lại file khác]               [💾 Lưu câu hỏi hợp lệ]            │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Business Rules
- **BR-026**: Cột "Điểm tối đa" phải là số nguyên dương hoặc để trống (mặc định 0).
- Các rule còn lại tương tự BR-013 đến BR-016 của SCR-07-003.

### API Endpoints
```
GET    /api/v1/question-bank/questions/import/template?type=essay   # Download template tự luận
POST   /api/v1/question-bank/questions/import/preview               # Upload + parse
POST   /api/v1/question-bank/questions/import/save                  # Lưu hợp lệ
```

---

## SCR-07-008 — Danh sách Đề thi & Danh mục đề thi (tab Đề thi)

### Mô tả
Tab **Đề thi** trong module NHCH. Layout chia đôi: bên trái là **cây danh mục đề thi** (tree view), bên phải là **danh sách đề thi** thuộc danh mục đang chọn. Hỗ trợ thêm/sửa/xóa danh mục và thêm/sửa/xóa đề thi.

### Actors
- **CBQL** — quản lý danh mục đề thi và danh sách đề thi.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [≡] LOGO   Quản lý học tập            [🔔] [👤 Nguyễn Văn A ▾]                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Học tập › Quản lý ngân hàng câu hỏi, đề thi dùng chung                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗   │
│  ║  [ Ngân hàng câu hỏi ]    [ Đề thi ✦ ]                                      ║   │
│  ╠══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                              ║   │
│  ║  ┌── LEFT PANEL: CÂY DANH MỤC ────┐  ┌── RIGHT PANEL: DANH SÁCH ĐỀ THI ──┐ ║   │
│  ║  │                                │  │                                    │ ║   │
│  ║  │  [+ Thêm danh mục cùng cấp]    │  │  BỘ LỌC:                          │ ║   │
│  ║  │  [+ Thêm danh mục cấp con]     │  │  🔍[Nhập tên đề thi...] [Tìm]     │ ║   │
│  ║  │  [🗑 Xóa danh mục đã chọn]     │  │  Trạng thái: [Tất cả ▾]           │ ║   │
│  ║  │                                │  │  Danh mục:   [Tất cả ▾]           │ ║   │
│  ║  │  ▼ 📁 Đề thi môn Toán          │  │                                    │ ║   │
│  ║  │     ├─ 📁 Lớp 10               │  │  TOOLBAR:                          │ ║   │
│  ║  │     │   ├─ 📂 Chương 1 [3]     │  │  [+ Thêm đề thi]  [📤 Xuất offline]│ ║   │
│  ║  │     │   └─ 📂 Chương 2 [5]     │  │                                    │ ║   │
│  ║  │     └─ 📁 Lớp 11               │  │  ┌── BẢNG ĐỀ THI ──────────────┐  │ ║   │
│  ║  │  ▶ 📁 Đề thi môn Văn           │  │  │ ☐ #  Tên đề thi  Trạng thái │  │ ║   │
│  ║  │  ▶ 📁 Đề thi môn Anh           │  │  │    Danh mục      Hành động  │  │ ║   │
│  ║  │                                │  │  ├──────────────────────────────┤  │ ║   │
│  ║  │  [Context menu khi click danh  │  │  │ ☐ 1  Đề KT 45p HK1  Hoạt   │  │ ║   │
│  ║  │   mục - chuột phải]:           │  │  │      Toán lớp 10   động     │  │ ║   │
│  ║  │  ┌──────────────────────┐      │  │  │      [✎][👁][🗑]            │  │ ║   │
│  ║  │  │ + Thêm danh mục con  │      │  │  ├──────────────────────────────┤  │ ║   │
│  ║  │  │ ✎ Sửa tên danh mục   │      │  │  │ ☐ 2  Đề thi cuối HK2  Nháp  │  │ ║   │
│  ║  │  │ 🗑 Xóa danh mục      │      │  │  │      Toán lớp 10            │  │ ║   │
│  ║  │  └──────────────────────┘      │  │  │      [✎][👁][🗑]            │  │ ║   │
│  ║  │                                │  │  ├──────────────────────────────┤  │ ║   │
│  ║  │                                │  │  │  Hiển thị: [10 ▾] / trang   │  │ ║   │
│  ║  │                                │  │  │  ← 1  2  3 →                │  │ ║   │
│  ║  │                                │  │  └──────────────────────────────┘  │ ║   │
│  ║  └────────────────────────────────┘  └────────────────────────────────────┘ ║   │
│  ║                                                                              ║   │
│  ╚══════════════════════════════════════════════════════════════════════════════╝   │
└─────────────────────────────────────────────────────────────────────────────────────┘

  Modal: THÊM MỚI DANH MỤC ĐỀ THI
  ┌──────────────────────────────────────────────────┐
  │  Thêm danh mục đề thi                       [✕] │
  ├──────────────────────────────────────────────────┤
  │  Loại: (*) Cùng cấp với danh mục đã chọn        │
  │        ( ) Cấp con của danh mục đã chọn          │
  │                                                  │
  │  Tên danh mục: *  [                          ]   │
  │  ⚠ Tên không được trùng với danh mục khác        │
  │                                                  │
  │                     [Hủy]   [💾 Lưu]             │
  └──────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `TabBar` | Tab "Đề thi" active |
| `ExamCategoryTree` | Cây danh mục đề thi (collapsible, context menu chuột phải) |
| `CategoryModal` | Modal thêm/sửa danh mục đề thi (cùng cấp / cấp con) |
| `ExamSearchInput` | Tìm kiếm theo tên đề thi |
| `StatusFilter` | Dropdown trạng thái đề thi |
| `CategoryFilter` | Dropdown lọc theo danh mục |
| `AddExamBtn` | Điều hướng sang SCR-07-009 thêm mới |
| `ExportOfflineBtn` | Mở SCR-07-013 |
| `ExamTable` | Bảng đề thi với hành động Sửa / Xem / Xóa |
| `Pagination` | Phân trang + số bản ghi/trang |

### Flow điều hướng
```
SCR-07-008
 ├─[+ Thêm đề thi]───────────────────→ SCR-07-009 (add mode)
 ├─[✎ Sửa đề thi]────────────────────→ SCR-07-009 (edit mode)
 ├─[👁 Xem câu hỏi đích danh]─────────→ Modal danh sách câu hỏi đích danh
 ├─[📤 Xuất offline]─────────────────→ SCR-07-013
 ├─[Danh mục - Thêm cùng cấp/con]────→ Modal CategoryModal
 └─[tab Ngân hàng câu hỏi]───────────→ SCR-07-001
```

### Business Rules
- **BR-027**: Danh mục đề thi cũng tổ chức cây đa cấp; tên không trùng cùng cấp cha.
- **BR-028**: Xóa danh mục → phải không có đề thi con bên trong (hoặc hỏi xác nhận xóa cascade).
- **BR-029**: Đề thi có 2 trạng thái: **Nháp** (chưa dùng) và **Hoạt động** (đã gán vào kỳ thi).
- **BR-030**: Không thể xóa đề thi đang ở trạng thái Hoạt động đã được gán vào kỳ thi đang diễn ra.

### API Endpoints
```
GET    /api/v1/exam-bank/categories                    # Lấy cây danh mục đề thi
POST   /api/v1/exam-bank/categories                    # Thêm danh mục
PUT    /api/v1/exam-bank/categories/{id}               # Sửa danh mục
DELETE /api/v1/exam-bank/categories/{id}               # Xóa danh mục
GET    /api/v1/exam-bank/exams                         # Lấy danh sách đề thi (filter)
DELETE /api/v1/exam-bank/exams/{id}                    # Xóa đề thi
```

---

## SCR-07-009 — Thêm / Sửa đề thi

### Mô tả
Form tổng hợp để tạo mới hoặc chỉnh sửa một đề thi. Bao gồm: thông tin chung, danh sách **phần thi** (sections), cấu hình **cấu trúc ngẫu nhiên** (random pool) và danh sách **câu hỏi chọn đích danh** (manual pick).

### Actors
- **CBQL** — tạo và cấu hình đề thi.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại danh sách đề thi          THÊM MỚI ĐỀ THI                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─── 1. THÔNG TIN CHUNG ────────────────────────────────────────────────────────┐ │
│  │                                                                               │ │
│  │  Tên đề thi: *  [                                                         ]  │ │
│  │  Danh mục:   *  [Chọn danh mục đề thi ▾]                                     │ │
│  │  Mô tả:         [                                                         ]  │ │
│  │  Thời gian làm bài: [___] phút                                                │ │
│  │  Trạng thái:    (*) Nháp   ( ) Hoạt động                                      │ │
│  │                                                                               │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─── 2. PHẦN THI ───────────────────────────────────────────────────────────────┐ │
│  │                                                                               │ │
│  │  [+ Thêm phần thi]                                                            │ │
│  │                                                                               │ │
│  │  ┌── Danh sách phần thi ─────────────────────────────────────────────────┐   │ │
│  │  │  #  Tên phần thi        Loại CH          Số câu   Hành động           │   │ │
│  │  │  ─  ──────────────────  ────────────     ──────   ────────────        │   │ │
│  │  │  1  Phần Trắc nghiệm    Một lựa chọn     30 câu   [✎ Sửa] [🗑 Xóa]   │   │ │
│  │  │  2  Phần Tự luận        Tự luận          3 câu    [✎ Sửa] [🗑 Xóa]   │   │ │
│  │  └───────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                               │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─── 3. CẤU TRÚC NGẪU NHIÊN ────────────────────────────────────────────────────┐ │
│  │                                                                               │ │
│  │  Mô tả: Định nghĩa các nhóm câu hỏi ngẫu nhiên từ danh mục câu hỏi.          │ │
│  │  Hệ thống sẽ tự động chọn ngẫu nhiên khi sinh đề.                            │ │
│  │                                                                               │ │
│  │  [+ Thêm cấu trúc ngẫu nhiên]                                                 │ │
│  │                                                                               │ │
│  │  ┌── Danh sách cấu trúc ngẫu nhiên ─────────────────────────────────────┐   │ │
│  │  │  #  Danh mục nguồn     Loại CH         Số lấy  Hành động              │   │ │
│  │  │  ─  ────────────────   ─────────────   ──────  ──────────────         │   │ │
│  │  │  1  Toán › Chương 1    Một lựa chọn    10 câu  [✎][⧉ Sao chép][🗑]   │   │ │
│  │  │  2  Toán › Chương 2    Một lựa chọn    10 câu  [✎][⧉ Sao chép][🗑]   │   │ │
│  │  │  3  Toán › Chương 1    Nhiều lựa chọn  5 câu   [✎][⧉ Sao chép][🗑]   │   │ │
│  │  └───────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                               │ │
│  │  Tổng câu từ cấu trúc ngẫu nhiên: 25 / 30 câu yêu cầu                        │ │
│  │  ⚠ Cần thêm 5 câu nữa (hoặc giảm số câu yêu cầu ở Phần thi)                 │ │
│  │                                                                               │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─── 4. CÂU HỎI CHỌN ĐÍCh DANH ────────────────────────────────────────────────┐ │
│  │                                                                               │ │
│  │  Mô tả: Các câu hỏi cố định, bắt buộc xuất hiện trong đề thi.                │ │
│  │                                                                               │ │
│  │  [+ Chọn câu hỏi thủ công]                                                    │ │
│  │                                                                               │ │
│  │  ┌── Danh sách câu hỏi đích danh đã chọn ───────────────────────────────┐   │ │
│  │  │  ☐  #  Nội dung câu hỏi          Loại CH        Danh mục   Hành động │   │ │
│  │  │  ─────────────────────────────────────────────────────────────────── │   │ │
│  │  │  ☐  1  Trình bày định nghĩa...   Tự luận        Toán lớp10  [🗑]     │   │ │
│  │  │  ☐  2  Phương trình bậc hai...   Một lựa chọn   Toán lớp10  [🗑]     │   │ │
│  │  │                            [Xóa các câu đã chọn] [Xóa tất cả]        │   │ │
│  │  │  Hiển thị: [10 ▾]   ← 1  2 →                                         │   │ │
│  │  └───────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                               │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                 [Hủy]    [Lưu nháp]    [💾 Lưu & Kích hoạt]                 │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `ExamInfoForm` | Form thông tin chung: tên, danh mục, mô tả, thời gian, trạng thái |
| `SectionList` | Bảng danh sách phần thi + [+ Thêm] |
| `SectionModal` | Modal thêm/sửa phần thi (SCR-07-010) |
| `RandomStructureList` | Bảng cấu trúc ngẫu nhiên + [+ Thêm] |
| `RandomStructureModal` | Modal CRUD cấu trúc ngẫu nhiên (SCR-07-011) |
| `QuestionCountSummary` | Tổng câu ngẫu nhiên vs yêu cầu, cảnh báo nếu thiếu |
| `ManualPickBtn` | Mở modal chọn đích danh (SCR-07-012) |
| `ManualQuestionTable` | Bảng câu hỏi đích danh + xóa từng câu / xóa nhiều |
| `SaveBtn` / `DraftBtn` / `CancelBtn` | Lưu & kích hoạt / Lưu nháp / Hủy |

### Flow điều hướng
```
SCR-07-009
 ├─[+ Thêm phần thi]────────────────→ SCR-07-010 (Modal Thêm phần thi)
 ├─[✎ Sửa phần thi]────────────────→ SCR-07-010 (Modal Sửa phần thi)
 ├─[🗑 Xóa phần thi]────────────────→ Confirm dialog → Xóa inline
 ├─[+ Thêm cấu trúc ngẫu nhiên]─────→ SCR-07-011 (Modal Thêm)
 ├─[✎ Sửa cấu trúc ngẫu nhiên]──────→ SCR-07-011 (Modal Sửa)
 ├─[⧉ Sao chép cấu trúc ngẫu nhiên]→ SCR-07-011 (Modal Sao chép)
 ├─[🗑 Xóa cấu trúc ngẫu nhiên]──────→ Confirm dialog → Xóa inline
 ├─[+ Chọn câu hỏi thủ công]─────────→ SCR-07-012 (Modal chọn đích danh)
 ├─[🗑 Xóa câu hỏi đích danh]────────→ Confirm → Xóa inline
 ├─[Lưu / Lưu nháp - Thành công]─────→ SCR-07-008 (toast "Lưu thành công")
 └─[Hủy]─────────────────────────────→ SCR-07-008
```

### Business Rules
- **BR-031**: Tên đề thi không được trùng trong cùng danh mục.
- **BR-032**: Nếu ngân hàng câu hỏi không đủ câu để tạo đề → hiển thị cảnh báo "Không đủ câu hỏi", không block lưu nháp nhưng block kích hoạt.
- **BR-033**: Tổng số câu của tất cả cấu trúc ngẫu nhiên + câu đích danh phải ≥ tổng số câu yêu cầu trong phần thi khi kích hoạt.
- **BR-034**: Một câu hỏi đích danh không thể đồng thời nằm trong pool cấu trúc ngẫu nhiên.
- **BR-035**: Xóa phần thi sẽ xóa luôn cấu trúc ngẫu nhiên và câu hỏi đích danh thuộc phần đó.

### API Endpoints
```
POST   /api/v1/exam-bank/exams                               # Thêm đề thi
PUT    /api/v1/exam-bank/exams/{id}                          # Sửa đề thi
GET    /api/v1/exam-bank/exams/{id}                          # Lấy thông tin đề thi
```

---

## SCR-07-010 — Modal: Thêm / Sửa phần thi

### Mô tả
Modal hộp thoại để thêm mới hoặc chỉnh sửa một **phần thi** trong một đề thi. Phần thi định nghĩa loại câu hỏi và số câu yêu cầu cho phần đó.

### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│  Thêm phần thi                                              [✕] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tên phần thi: *                                                 │
│  [Nhập tên phần thi, vd: Phần Trắc nghiệm               ]       │
│                                                                  │
│  Loại câu hỏi: *                                                 │
│  [Chọn loại câu hỏi ▾]                                           │
│  (Một lựa chọn đúng | Nhiều lựa chọn | Chính-Phụ | Tự luận)     │
│                                                                  │
│  Số câu hỏi yêu cầu: *                                           │
│  [____]  câu                                                     │
│                                                                  │
│  Điểm mỗi câu: *                                                 │
│  [____]  điểm                                                    │
│                                                                  │
│  Mô tả / Hướng dẫn phần thi: (tùy chọn)                         │
│  [                                                          ]    │
│                                                                  │
│  ⚠ Lỗi: Vui lòng điền đầy đủ thông tin bắt buộc (*)            │
│                                                                  │
│                          [Hủy]   [💾 Lưu phần thi]              │
└──────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `SectionNameInput` | Tên phần thi (text, bắt buộc) |
| `QuestionTypeSelect` | Loại câu hỏi của phần thi (bắt buộc) |
| `QuestionCountInput` | Số câu hỏi yêu cầu (số nguyên dương, bắt buộc) |
| `ScorePerQuestionInput` | Điểm mỗi câu (số, bắt buộc) |
| `DescriptionInput` | Mô tả / hướng dẫn (tùy chọn) |
| `ValidationMessage` | Hiển thị lỗi inline |
| `SaveBtn` / `CancelBtn` | Lưu / Hủy |

### Business Rules
- **BR-036**: Mỗi đề thi có thể có nhiều phần thi; tên phần thi không được trùng trong cùng đề thi.
- **BR-037**: Số câu hỏi yêu cầu phải là số nguyên dương ≥ 1.
- **BR-038**: Điểm mỗi câu phải là số dương > 0.

### API Endpoints
```
POST   /api/v1/exam-bank/exams/{examId}/sections           # Thêm phần thi
PUT    /api/v1/exam-bank/exams/{examId}/sections/{id}      # Sửa phần thi
DELETE /api/v1/exam-bank/exams/{examId}/sections/{id}      # Xóa phần thi
```

---

## SCR-07-011 — Modal: Cấu trúc ngẫu nhiên

### Mô tả
Modal để **thêm**, **sửa** hoặc **sao chép** một cấu trúc ngẫu nhiên trong phần thi của đề thi. Mỗi cấu trúc ngẫu nhiên xác định: lấy bao nhiêu câu, từ danh mục nào, loại câu hỏi nào.

### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│  Thêm cấu trúc ngẫu nhiên                                   [✕] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phần thi áp dụng: *                                             │
│  [Chọn phần thi ▾]  (dropdown từ danh sách phần thi đề thi)     │
│                                                                  │
│  Danh mục nguồn: *                                               │
│  [Chọn danh mục câu hỏi ▾]                                       │
│  (Hỗ trợ chọn danh mục cha → lấy câu từ toàn bộ danh mục con)  │
│                                                                  │
│  Loại câu hỏi: *                                                 │
│  [Chọn loại câu hỏi ▾]                                           │
│                                                                  │
│  Số câu lấy ngẫu nhiên: *                                        │
│  [____]  câu                                                     │
│                                                                  │
│  Thông tin: Hiện có [47] câu hỏi trong danh mục & loại đã chọn  │
│  (cập nhật realtime khi thay đổi bộ lọc)                         │
│                                                                  │
│  ⚠ Số câu lấy không được vượt quá tổng câu hỏi khả dụng (47)   │
│                                                                  │
│                    [Hủy]   [💾 Lưu cấu trúc ngẫu nhiên]          │
└──────────────────────────────────────────────────────────────────┘

Khi sao chép: Title = "Sao chép cấu trúc ngẫu nhiên"
              Toàn bộ field pre-filled từ bản gốc, CBQL có thể chỉnh sửa trước khi lưu.
```

### Components
| Component | Mô tả |
|-----------|-------|
| `SectionSelect` | Dropdown chọn phần thi (bắt buộc) |
| `CategorySelect` | Dropdown cây danh mục câu hỏi nguồn |
| `QuestionTypeSelect` | Loại câu hỏi cần lấy |
| `CountInput` | Số câu lấy ngẫu nhiên |
| `AvailableCountInfo` | Hiển thị số câu khả dụng (realtime) |
| `ValidationMessage` | Cảnh báo nếu số câu > khả dụng |
| `SaveBtn` / `CancelBtn` | Lưu / Hủy |

### Business Rules
- **BR-039**: Số câu lấy ngẫu nhiên không được vượt quá tổng câu hỏi khả dụng trong danh mục + loại đã chọn.
- **BR-040**: Cho phép nhiều cấu trúc ngẫu nhiên cùng danh mục nhưng khác loại câu hỏi.
- **BR-041**: Khi sao chép, tạo bản ghi mới độc lập; thay đổi bản sao không ảnh hưởng bản gốc.
- **BR-042**: Cấu trúc ngẫu nhiên chỉ áp dụng cho một phần thi cụ thể trong đề thi.

### API Endpoints
```
POST   /api/v1/exam-bank/exams/{examId}/sections/{secId}/random-structures
PUT    /api/v1/exam-bank/exams/{examId}/sections/{secId}/random-structures/{id}
DELETE /api/v1/exam-bank/exams/{examId}/sections/{secId}/random-structures/{id}
GET    /api/v1/question-bank/questions/count?categoryId=&type=   # Đếm câu khả dụng
```

---

## SCR-07-012 — Modal: Chọn câu hỏi đích danh cho đề thi

### Mô tả
Modal hiển thị toàn bộ ngân hàng câu hỏi (có bộ lọc) để CBQL **tích chọn thủ công** các câu hỏi cụ thể muốn xuất hiện bắt buộc trong đề thi.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Chọn câu hỏi đích danh cho đề thi                                             [✕] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌── BỘ LỌC ──────────────────────────────────────────────────────────────────┐    │
│  │  Danh mục: [Chọn danh mục ▾]   Loại CH: [Tất cả ▾]                        │    │
│  │  🔍 [Nhập từ khóa tìm kiếm câu hỏi...                     ]  [Tìm kiếm]   │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                     │
│  ┌── DANH SÁCH CÂU HỎI ───────────────────────────────────────────────────────┐   │
│  │                                                                             │   │
│  │  ☐  #   Nội dung câu hỏi              Loại CH         Danh mục             │   │
│  │  ─────────────────────────────────────────────────────────────────         │   │
│  │  ☐  1   Thủ đô của Việt Nam là...     Một lựa chọn    Địa lý               │   │
│  │  ☑  2   Phương trình bậc hai có...    Một lựa chọn    Toán lớp 10          │   │
│  │  ☐  3   Trình bày về cách mạng...     Tự luận         Lịch sử              │   │
│  │  ☑  4   Choose the correct tense...   Một lựa chọn    Tiếng Anh           │   │
│  │  ...                                                                        │   │
│  │                                                                             │   │
│  │  Hiển thị: [10 ▾]   ← 1  2  3 ... 20 →                                     │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌── ĐÃ CHỌN ─────────────────────────────────────────────────────────────────┐   │
│  │  Đã chọn: 2 câu hỏi   (Câu #2 — Toán lớp 10, Câu #4 — Tiếng Anh)          │   │
│  │  [Xem tất cả câu đã chọn]                                                   │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│                              [Hủy]    [+ Thêm vào đề thi (2)]                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `CategoryFilter` | Dropdown lọc theo danh mục câu hỏi |
| `TypeFilter` | Dropdown lọc theo loại câu hỏi |
| `SearchInput` | Tìm kiếm theo nội dung |
| `QuestionSelectTable` | Bảng câu hỏi có checkbox multi-select |
| `Pagination` | Phân trang + số bản ghi/trang |
| `SelectedSummary` | Hiển thị số lượng và tóm tắt câu đã chọn |
| `AddToExamBtn` | Xác nhận thêm câu đã tích vào đề thi |
| `CancelBtn` | Đóng modal, bỏ thay đổi |

### Flow điều hướng
```
SCR-07-012 (Modal)
 ├─[+ Thêm vào đề thi]──→ Đóng modal, cập nhật bảng câu hỏi đích danh ở SCR-07-009
 └─[Hủy]────────────────→ Đóng modal, không thay đổi
```

### Business Rules
- **BR-043**: Câu hỏi đã nằm trong pool cấu trúc ngẫu nhiên của đề thi sẽ bị disable (không thể chọn đích danh).
- **BR-044**: Câu hỏi đã được chọn đích danh trước đó hiển thị checkbox ☑ và không tính thêm lần nữa.
- **BR-045**: Phải chọn ít nhất 1 câu để button "Thêm vào đề thi" active.
- **BR-046**: Câu hỏi dạng Chính-Phụ khi chọn sẽ thêm câu hỏi chính và toàn bộ câu con.

### API Endpoints
```
GET    /api/v1/question-bank/questions?excludeExamId={id}    # Lấy câu hỏi (exclude đã dùng)
POST   /api/v1/exam-bank/exams/{id}/manual-questions         # Thêm câu hỏi đích danh
DELETE /api/v1/exam-bank/exams/{id}/manual-questions         # Xóa câu hỏi đích danh {body: ids}
```

---

## SCR-07-013 — Xuất đề thi Offline

### Mô tả
Cho phép CBQL chọn một hoặc nhiều đề thi để **xuất file Offline** (gói đề thi portable có thể sử dụng không cần kết nối internet). Trigger từ tab Đề thi (SCR-07-008).

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại            XUẤT ĐỀ THI OFFLINE                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─── BỘ LỌC ─────────────────────────────────────────────────────────────────┐   │
│  │  🔍 [Tìm kiếm tên đề thi...                         ]  [Tìm]               │   │
│  │  Danh mục: [Tất cả ▾]   Trạng thái: [Hoạt động ▾]                          │   │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── DANH SÁCH ĐỀ THI CÓ THỂ XUẤT ─────────────────────────────────────────┐   │
│  │                                                                             │   │
│  │  ☐   #   Tên đề thi              Danh mục      Số câu  Trạng thái          │   │
│  │  ─────────────────────────────────────────────────────────────────         │   │
│  │  ☑   1   Đề KT 45p HK1 Toán 10   Toán › Lớp10  30      Hoạt động          │   │
│  │  ☐   2   Đề thi HK2 Văn 11        Văn › Lớp11   5       Hoạt động          │   │
│  │  ☑   3   Đề thi Anh giữa kỳ       Tiếng Anh     40      Hoạt động          │   │
│  │  ...                                                                        │   │
│  │  Hiển thị: [10 ▾]  ← 1  2  3 →                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─── TÙY CHỌN XUẤT ──────────────────────────────────────────────────────────┐   │
│  │                                                                              │   │
│  │  Đã chọn: 2 đề thi                                                          │   │
│  │                                                                              │   │
│  │  Định dạng xuất:                                                             │   │
│  │  (*) Gói offline (.zip — bao gồm HTML + câu hỏi + media)                    │   │
│  │  ( ) PDF                                                                     │   │
│  │  ( ) Word (.docx)                                                            │   │
│  │                                                                              │   │
│  │  ☑ Bao gồm đáp án và hướng dẫn chấm (tạo file riêng)                       │   │
│  │  ☑ Bao gồm file audio (nếu có)                                               │   │
│  │                                                                              │   │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │         [Hủy]                           [📥 Xuất đề thi Offline (2)]         │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  [Sau khi nhấn Xuất]                                                                │
│  ⏳ Đang tạo gói offline... (progress bar)                                          │
│  ✅ Hoàn tất! File đang được tải về: "offline_exams_2026-03-11.zip" (12.4 MB)      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Components
| Component | Mô tả |
|-----------|-------|
| `SearchInput` | Tìm theo tên đề thi |
| `CategoryFilter` | Lọc theo danh mục đề thi |
| `StatusFilter` | Lọc theo trạng thái (mặc định "Hoạt động") |
| `ExamSelectTable` | Bảng đề thi có checkbox multi-select |
| `Pagination` | Phân trang |
| `ExportFormatRadio` | Chọn định dạng xuất (zip / pdf / docx) |
| `ExportOptionsCheckbox` | Tùy chọn bao gồm đáp án, audio |
| `ExportBtn` | Trigger xuất file + progress |
| `ProgressBar` | Hiển thị tiến trình tạo file |

### Business Rules
- **BR-047**: Chỉ xuất được đề thi ở trạng thái **Hoạt động** (đề Nháp không đủ câu hỏi).
- **BR-048**: Gói zip offline bao gồm toàn bộ nội dung câu hỏi, hình ảnh và audio để dùng không cần internet.
- **BR-049**: File đáp án được tạo thành file riêng trong gói zip (có thể mở khóa bằng mật khẩu tùy cấu hình).
- **BR-050**: Phải chọn ít nhất 1 đề thi để button "Xuất" active.

### API Endpoints
```
POST   /api/v1/exam-bank/exams/export-offline
       Body: { examIds: [1,3], format: "zip", includeAnswers: true, includeAudio: true }
       → Trả về file blob hoặc presigned download URL
```

---

## Tóm tắt các Modal / Dialog trong module

| Modal | Trigger | Màn hình cha |
|-------|---------|--------------|
| Modal Thêm/Sửa Danh mục câu hỏi | Toolbar SCR-07-001 | SCR-07-001 |
| Modal Xác nhận Xóa câu hỏi | [🗑] trong bảng | SCR-07-001 |
| Modal Thêm/Sửa câu hỏi con | [+ Thêm CH con] trong form | SCR-07-002 |
| Modal Thêm/Sửa Danh mục đề thi | Toolbar SCR-07-008 | SCR-07-008 |
| Modal Xác nhận Xóa đề thi | [🗑] trong bảng | SCR-07-008 |
| Modal Thêm/Sửa Phần thi | [+ Thêm phần thi] | SCR-07-009 |
| Modal Cấu trúc ngẫu nhiên | [+ Thêm CTNN] | SCR-07-009 |
| Modal Chọn câu hỏi đích danh | [+ Chọn câu hỏi thủ công] | SCR-07-009 |
| Dialog Xác nhận Xóa phần thi | [🗑] phần thi | SCR-07-009 |
| Dialog Xác nhận Xóa CTNN | [🗑] cấu trúc ngẫu nhiên | SCR-07-009 |

---

## Tổng quan Flow toàn module

```
[Menu › Quản lý ngân hàng câu hỏi, đề thi dùng chung]
            │
            ▼
┌─────────────────────────────────┐
│   SCR-07-001: Danh sách CH      │◄────────────────────────────────────────┐
│   (tab: Ngân hàng câu hỏi)      │                                         │
└────────────┬────────────────────┘                                         │
             │                                                               │
    ┌────────┼────────────┬──────────────────────┬────────────┐            │
    ▼        ▼            ▼                      ▼            ▼            │
SCR-07-002 SCR-07-006 SCR-07-003             SCR-07-005  SCR-07-007        │
(Thêm/Sửa  (Thêm/Sửa  (Import Excel         (Kết xuất)  (Import TL       │
 Trắc Nghiệm) Tự luận)  Trắc nghiệm)                     Excel)          │
    │        │                                                               │
    └────────┴──────────────────────────────────────────────────────────────┘
                                                                             │
┌─────────────────────────────────┐                                         │
│   SCR-07-008: Danh sách Đề thi  │◄────────────────────────────────────────┘
│   (tab: Đề thi)                 │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
SCR-07-009        SCR-07-013
(Thêm/Sửa Đề thi) (Xuất Offline)
    │
    ├──→ Modal SCR-07-010 (Phần thi)
    ├──→ Modal SCR-07-011 (Cấu trúc ngẫu nhiên)
    └──→ Modal SCR-07-012 (Chọn đích danh)
```

---

## Phụ lục: Permission Matrix

| Chức năng | Xem | Thêm | Sửa | Xóa | Import | Export |
|-----------|-----|------|-----|-----|--------|--------|
| Danh mục câu hỏi | ✓ | ✓ | ✓ | ✓ | — | — |
| Câu hỏi trắc nghiệm | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Câu hỏi tự luận | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Danh mục đề thi | ✓ | ✓ | ✓ | ✓ | — | — |
| Đề thi | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Phần thi | — | ✓* | ✓* | ✓* | — | — |
| Cấu trúc ngẫu nhiên | — | ✓* | ✓* | ✓* | — | — |

> `✓*` = yêu cầu quyền **Thêm mới đề thi**; các thao tác này thực hiện trong ngữ cảnh form đề thi.
