---
title: "WF-09b: Thư viện số – Cổng thông tin & Tra cứu OPAC"
cluster: "Digital Library - Portal & OPAC"
updated: 2026-03-11
---

# WF-09b: Thư viện số – Cổng thông tin & Tra cứu OPAC

## Tổng quan module

Module **Thư viện số – Cổng thông tin & OPAC** cung cấp hai nhóm chức năng chính:

1. **Quản lý nội dung Portal** (dành cho Thủ thư / Admin): cập nhật thông tin trang thư viện, đăng tin tức – sự kiện.
2. **Tra cứu công khai** (dành cho Bạn đọc / Học sinh / Giáo viên): trang chủ Portal, tìm kiếm & lọc tài liệu vật lý (OPAC), tài liệu điện tử và đọc online.

### Danh sách màn hình

| Mã | Tên màn hình | Nhóm |
|----|-------------|------|
| SCR-09b-001 | Danh mục nội dung thông tin thư viện (Admin) | A – Quản lý nội dung |
| SCR-09b-002 | Thêm / Sửa nội dung thông tin thư viện | A – Quản lý nội dung |
| SCR-09b-003 | Xác nhận xóa nội dung (Modal) | A – Quản lý nội dung |
| SCR-09b-004 | Danh sách tin tức – sự kiện (Admin) | A – Quản lý nội dung |
| SCR-09b-005 | Thêm / Sửa tin tức – sự kiện | A – Quản lý nội dung |
| SCR-09b-006 | Xác nhận xóa tin tức (Modal) | A – Quản lý nội dung |
| SCR-09b-010 | Trang chủ thư viện điện tử (Portal Public) | B – Portal công khai |
| SCR-09b-011 | Trang chi tiết bài viết / tin tức | B – Portal công khai |
| SCR-09b-020 | OPAC – Tìm kiếm & Danh sách tài liệu | C – OPAC |
| SCR-09b-021 | OPAC – Chi tiết tài liệu vật lý | C – OPAC |
| SCR-09b-030 | Danh sách tài liệu điện tử | D – Tài liệu điện tử |
| SCR-09b-031 | Chi tiết tài liệu điện tử | D – Tài liệu điện tử |
| SCR-09b-032 | Trình đọc tài liệu online (Viewer) | D – Tài liệu điện tử |

---

## Phần A: Quản lý nội dung Portal (Admin)

---

### SCR-09b-001 — Danh mục nội dung thông tin thư viện

#### Mô tả
Màn hình quản lý trung tâm cho Thủ thư / Admin. Hiển thị toàn bộ danh mục bài viết / nội dung tĩnh đang được đăng tải trên trang thư viện (Giới thiệu, Hướng dẫn mượn–trả, Nội quy, Liên hệ, v.v.). Hỗ trợ thêm mới, chỉnh sửa, xóa và thay đổi trạng thái hiển thị.

#### Actors
- **Thủ thư / Admin thư viện** — xem, tìm kiếm, thêm, sửa, xóa, ẩn/hiện nội dung.

#### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [≡] LOGO   Thư viện số                        [🔔] [👤 Nguyễn Thị B – Thủ thư ▾] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Thư viện số › Cổng thông tin › Nội dung trang thư viện                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗   │
│  ║  THÔNG TIN TRANG THƯ VIỆN                                                    ║   │
│  ╠══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                              ║   │
│  ║  ┌─── BỘ LỌC & TÌM KIẾM ────────────────────────────────────────────────┐  ║   │
│  ║  │  🔍 [Nhập tiêu đề nội dung...                    ]  [Tìm kiếm]       │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Danh mục: [Tất cả ▾]   Trạng thái: [Tất cả ▾]                       │  ║   │
│  ║  │  (Giới thiệu | Hướng dẫn | Nội quy | Liên hệ | Khác)                 │  ║   │
│  ║  │  (Đang hiển thị | Đã ẩn)                                              │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║  ┌─── TOOLBAR ──────────────────────────────────────────────────────────┐  ║   │
│  ║  │  [+ Thêm nội dung mới]                    Tổng: 12 nội dung          │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║  ┌─── BẢNG DANH MỤC NỘI DUNG ───────────────────────────────────────────┐  ║   │
│  ║  │  #  │ Tiêu đề                   │ Danh mục    │ Trạng thái │ Hành động│  ║   │
│  ║  ├─────┼───────────────────────────┼─────────────┼────────────┼──────────┤  ║   │
│  ║  │  1  │ Giới thiệu thư viện       │ Giới thiệu  │ ● Hiển thị │ [✎][🗑] │  ║   │
│  ║  │  2  │ Hướng dẫn mượn – trả sách │ Hướng dẫn   │ ● Hiển thị │ [✎][🗑] │  ║   │
│  ║  │  3  │ Nội quy thư viện          │ Nội quy     │ ● Hiển thị │ [✎][🗑] │  ║   │
│  ║  │  4  │ Danh sách sách mới 2025   │ Giới thiệu  │ ○ Đã ẩn    │ [✎][🗑] │  ║   │
│  ║  │  5  │ Thông tin liên hệ         │ Liên hệ     │ ● Hiển thị │ [✎][🗑] │  ║   │
│  ║  │  6  │ Lịch mở cửa thư viện      │ Thông báo   │ ● Hiển thị │ [✎][🗑] │  ║   │
│  ║  │  ...                                                                  │  ║   │
│  ║  ├─────────────────────────────────────────────────────────────────────┤  ║   │
│  ║  │  Hiển thị: [10 ▾] bản ghi / trang          ← 1  2 →                 │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ╚══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

  Chú thích: ● Hiển thị (màu xanh)  ○ Đã ẩn (màu xám)
  [✎] = Sửa nội dung → SCR-09b-002
  [🗑] = Xóa → mở Modal SCR-09b-003
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `PageHeader` | Breadcrumb + tiêu đề module |
| `SearchInput` | Tìm kiếm theo tiêu đề nội dung |
| `CategoryFilter` | Dropdown lọc theo danh mục trang |
| `StatusFilter` | Dropdown lọc Hiển thị / Đã ẩn |
| `AddContentBtn` | Nút mở form thêm mới → SCR-09b-002 |
| `ContentTable` | Bảng hiển thị nội dung với badge trạng thái |
| `StatusBadge` | Pill màu xanh/xám thể hiện trạng thái |
| `RowActions` | Icon [✎] Sửa / [🗑] Xóa inline |
| `Pagination` | Phân trang + số bản ghi/trang |

#### Flow điều hướng
```
SCR-09b-001
 ├─[+ Thêm nội dung mới]──────────────────→ SCR-09b-002 (mode: CREATE)
 ├─[✎ Sửa] trên dòng bất kỳ──────────────→ SCR-09b-002 (mode: EDIT, pre-filled)
 └─[🗑 Xóa] trên dòng bất kỳ─────────────→ SCR-09b-003 (Modal xác nhận xóa)
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Chỉ Thủ thư / Admin thư viện mới có quyền truy cập màn hình này |
| BR-02 | Nội dung có trạng thái "Đã ẩn" không hiển thị trên Portal công khai |
| BR-03 | Không thể xóa nội dung đang có trạng thái "Hiển thị" — cần ẩn trước |
| BR-04 | Mỗi danh mục giữ thứ tự hiển thị (sort_order) có thể kéo-thả sắp xếp |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/portal/contents` | Lấy danh sách nội dung (filter, paginate) |
| `DELETE` | `/api/library/portal/contents/{id}` | Xóa nội dung theo ID |
| `PATCH` | `/api/library/portal/contents/{id}/status` | Thay đổi trạng thái hiển thị |

---

### SCR-09b-002 — Thêm / Sửa nội dung thông tin thư viện

#### Mô tả
Form đa trường cho phép Thủ thư nhập hoặc chỉnh sửa một bài viết / nội dung tĩnh. Bao gồm tiêu đề, danh mục, nội dung soạn thảo rich-text, ảnh đại diện và trạng thái xuất bản.

#### Actors
- **Thủ thư / Admin thư viện** — soạn thảo và lưu nội dung.

#### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [≡] LOGO   Thư viện số                        [🔔] [👤 Nguyễn Thị B – Thủ thư ▾] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Thư viện số › Nội dung trang thư viện › Thêm mới nội dung                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗   │
│  ║  THÊM MỚI NỘI DUNG THÔNG TIN THƯ VIỆN                                       ║   │
│  ╠══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                              ║   │
│  ║  ┌──────────────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  Tiêu đề *                                                           │  ║   │
│  ║  │  [                                                              ]    │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Danh mục *                     Trạng thái *                        │  ║   │
│  ║  │  [Chọn danh mục ▾]              [● Hiển thị ▾]                      │  ║   │
│  ║  │  (Giới thiệu / Hướng dẫn /      (Hiển thị | Đã ẩn)                  │  ║   │
│  ║  │   Nội quy / Liên hệ / Khác)                                          │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Thứ tự hiển thị                                                     │  ║   │
│  ║  │  [  1  ]                                                             │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Ảnh đại diện                                                        │  ║   │
│  ║  │  ┌────────────────────────────────────┐                              │  ║   │
│  ║  │  │  📷  Kéo thả ảnh vào đây           │  [Chọn file]                │  ║   │
│  ║  │  │      hoặc nhấn Chọn file           │                              │  ║   │
│  ║  │  │      (PNG, JPG – tối đa 2MB)       │                              │  ║   │
│  ║  │  └────────────────────────────────────┘                              │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Nội dung *                                                          │  ║   │
│  ║  │  ┌────────────────────────────────────────────────────────────────┐  │  ║   │
│  ║  │  │ [B] [I] [U] [H1] [H2] [•List] [1.List] [🔗] [🖼] [──]         │  │  ║   │
│  ║  │  ├────────────────────────────────────────────────────────────────┤  │  ║   │
│  ║  │  │                                                                │  │  ║   │
│  ║  │  │  (Vùng soạn thảo rich-text – min 200px height)                 │  │  ║   │
│  ║  │  │                                                                │  │  ║   │
│  ║  │  │                                                                │  │  ║   │
│  ║  │  │                                                                │  │  ║   │
│  ║  │  └────────────────────────────────────────────────────────────────┘  │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Tệp đính kèm (tuỳ chọn)                                            │  ║   │
│  ║  │  [📎 Thêm tệp đính kèm]  ← PDF, DOC, tối đa 10MB                   │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║  ┌── VALIDATION ERRORS (hiện khi có lỗi) ──────────────────────────────┐  ║   │
│  ║  │  ⚠ Tiêu đề không được để trống                                      │  ║   │
│  ║  │  ⚠ Vui lòng chọn danh mục                                           │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║                         [Hủy]          [💾 Lưu nội dung]                    ║   │
│  ║                                                                              ║   │
│  ╚══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

  Chế độ Sửa: Form pre-fill từ dữ liệu hiện có, tiêu đề trang đổi thành
              "Chỉnh sửa nội dung: [Tiêu đề bài viết]"
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `FormField` | Wrapper label + input + error message |
| `TextInput` | Nhập tiêu đề (required, max 255 ký tự) |
| `CategorySelect` | Dropdown chọn danh mục trang |
| `StatusSelect` | Dropdown Hiển thị / Đã ẩn |
| `NumberInput` | Thứ tự hiển thị (số nguyên dương) |
| `ImageUploader` | Drag-and-drop + preview ảnh đại diện |
| `RichTextEditor` | Editor WYSIWYG (TipTap / CKEditor) với toolbar |
| `FileAttachment` | Upload tệp đính kèm, hiển thị danh sách tệp đã đính |
| `ValidationBanner` | Hiển thị danh sách lỗi khi Submit thất bại |
| `CancelBtn` | Quay lại SCR-09b-001, không lưu |
| `SaveBtn` | Submit form, gọi API tạo/cập nhật |

#### Flow điều hướng
```
SCR-09b-002 (CREATE / EDIT)
 ├─[Lưu nội dung] → validate → lỗi: hiện ValidationBanner (stay)
 │                           → thành công: toast "Lưu thành công" → SCR-09b-001
 └─[Hủy]──────────────────────────────────────────────────────────→ SCR-09b-001
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Tiêu đề và Danh mục là bắt buộc; Nội dung rich-text không được rỗng |
| BR-02 | Ảnh đại diện tối đa 2 MB, định dạng PNG/JPG/WEBP |
| BR-03 | Thứ tự hiển thị phải là số nguyên dương, mặc định là số cuối + 1 |
| BR-04 | Khi lưu thành công ở chế độ EDIT, cập nhật `updated_at` và `updated_by` |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/library/portal/contents` | Tạo mới nội dung |
| `PUT` | `/api/library/portal/contents/{id}` | Cập nhật nội dung |
| `GET` | `/api/library/portal/contents/{id}` | Lấy chi tiết (chế độ EDIT) |
| `POST` | `/api/library/portal/contents/upload-image` | Upload ảnh đại diện |

---

### SCR-09b-003 — Modal xác nhận xóa nội dung

#### Mô tả
Modal cảnh báo xuất hiện khi người dùng nhấn [🗑 Xóa] trên danh sách. Yêu cầu xác nhận trước khi thực hiện xóa vĩnh viễn.

#### ASCII Wireframe

```
  ┌──────────────────────────────────────────────┐
  │  ⚠ Xác nhận xóa nội dung                    │
  ├──────────────────────────────────────────────┤
  │                                              │
  │  Bạn có chắc chắn muốn xóa nội dung:        │
  │                                              │
  │  "Hướng dẫn mượn – trả sách"                │
  │                                              │
  │  Hành động này không thể hoàn tác.           │
  │                                              │
  │              [Hủy]    [🗑 Xóa]              │
  │                                              │
  └──────────────────────────────────────────────┘
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Chỉ xóa được nội dung có trạng thái "Đã ẩn" |
| BR-02 | Sau khi xóa, reload danh sách SCR-09b-001 và hiện toast "Xóa thành công" |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `DELETE` | `/api/library/portal/contents/{id}` | Xóa nội dung |

---

### SCR-09b-004 — Danh sách tin tức – sự kiện (Admin)

#### Mô tả
Màn hình quản lý toàn bộ tin tức và sự kiện đăng trên trang thư viện. Hỗ trợ lọc theo danh mục (Tin tức / Sự kiện), trạng thái và khoảng thời gian đăng.

#### Actors
- **Thủ thư / Admin thư viện** — xem, thêm, sửa, xóa, ẩn/hiện tin tức.

#### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [≡] LOGO   Thư viện số                        [🔔] [👤 Nguyễn Thị B – Thủ thư ▾] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Thư viện số › Cổng thông tin › Tin tức – Sự kiện                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗   │
│  ║  TIN TỨC – SỰ KIỆN                                                           ║   │
│  ╠══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                              ║   │
│  ║  ┌─── BỘ LỌC ───────────────────────────────────────────────────────────┐  ║   │
│  ║  │  🔍 [Nhập tiêu đề tin tức...                      ]  [Tìm kiếm]     │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Loại:  [Tất cả ▾]       Trạng thái: [Tất cả ▾]                      │  ║   │
│  ║  │         (Tin tức | Sự kiện)            (Hiển thị | Đã ẩn | Nháp)     │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Từ ngày: [dd/mm/yyyy 📅]   Đến ngày: [dd/mm/yyyy 📅]                │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║  ┌─── TOOLBAR ──────────────────────────────────────────────────────────┐  ║   │
│  ║  │  [+ Thêm tin tức mới]                     Tổng: 28 bài              │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║  ┌─── BẢNG TIN TỨC ─────────────────────────────────────────────────────┐  ║   │
│  ║  │  # │ Tiêu đề                        │ Loại    │ Ngày đăng  │ Trạng thái │ Hành động │  ║   │
│  ║  ├────┼────────────────────────────────┼─────────┼────────────┼────────────┼───────────┤  ║   │
│  ║  │  1 │ Khai mạc tuần lễ đọc sách 2025 │ Sự kiện │ 10/03/2026 │ ● Hiển thị │ [✎][🗑]  │  ║   │
│  ║  │  2 │ Thư viện nhập 200 đầu sách mới │ Tin tức │ 08/03/2026 │ ● Hiển thị │ [✎][🗑]  │  ║   │
│  ║  │  3 │ Cuộc thi Đại sứ đọc sách 2026  │ Sự kiện │ 05/03/2026 │ ○ Nháp     │ [✎][🗑]  │  ║   │
│  ║  │  4 │ Hướng dẫn mượn sách online     │ Tin tức │ 01/03/2026 │ ● Hiển thị │ [✎][🗑]  │  ║   │
│  ║  │  5 │ Thông báo lịch nghỉ Tết 2026   │ Tin tức │ 15/01/2026 │ ○ Đã ẩn    │ [✎][🗑]  │  ║   │
│  ║  │  ...                                                                  │  ║   │
│  ║  ├─────────────────────────────────────────────────────────────────────┤  ║   │
│  ║  │  Hiển thị: [10 ▾] bản ghi / trang          ← 1  2  3 →              │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ╚══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

  Trạng thái: ● Hiển thị (xanh)  ○ Nháp (vàng)  ○ Đã ẩn (xám)
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `SearchInput` | Tìm theo tiêu đề tin tức |
| `TypeFilter` | Dropdown Tin tức / Sự kiện |
| `StatusFilter` | Dropdown Hiển thị / Nháp / Đã ẩn |
| `DateRangePicker` | Bộ chọn khoảng ngày đăng |
| `AddNewsBtn` | Mở SCR-09b-005 (mode: CREATE) |
| `NewsTable` | Bảng với badge loại + trạng thái |
| `TypeBadge` | Tag phân biệt Tin tức / Sự kiện |
| `StatusBadge` | Pill màu theo trạng thái |
| `RowActions` | [✎] Sửa / [🗑] Xóa |
| `Pagination` | Phân trang |

#### Flow điều hướng
```
SCR-09b-004
 ├─[+ Thêm tin tức mới]──────────────→ SCR-09b-005 (mode: CREATE)
 ├─[✎ Sửa]──────────────────────────→ SCR-09b-005 (mode: EDIT, pre-filled)
 └─[🗑 Xóa]─────────────────────────→ SCR-09b-006 (Modal xác nhận xóa)
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Tin tức ở trạng thái "Nháp" chỉ hiển thị cho Admin, không công khai |
| BR-02 | Bài có trạng thái "Hiển thị" xuất hiện trên Portal và được đánh dấu "Mới" trong 7 ngày kể từ ngày đăng |
| BR-03 | Không thể xóa bài đang ở trạng thái "Hiển thị" — cần ẩn trước |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/news` | Lấy danh sách tin tức (filter, paginate) |
| `DELETE` | `/api/library/news/{id}` | Xóa tin tức |
| `PATCH` | `/api/library/news/{id}/status` | Đổi trạng thái |

---

### SCR-09b-005 — Thêm / Sửa tin tức – sự kiện

#### Mô tả
Form soạn thảo tin tức / sự kiện. Ngoài tiêu đề và nội dung, có các trường đặc thù cho sự kiện: ngày tổ chức, địa điểm, ảnh banner.

#### Actors
- **Thủ thư / Admin thư viện**.

#### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [≡] LOGO   Thư viện số                        [🔔] [👤 Nguyễn Thị B – Thủ thư ▾] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Thư viện số › Tin tức – Sự kiện › Thêm mới                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗   │
│  ║  THÊM MỚI TIN TỨC – SỰ KIỆN                                                  ║   │
│  ╠══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                              ║   │
│  ║  ┌──────────────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  Tiêu đề *                                                           │  ║   │
│  ║  │  [                                                              ]    │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Loại *                          Trạng thái *                        │  ║   │
│  ║  │  ○ Tin tức  ● Sự kiện            [Nháp ▾]                            │  ║   │
│  ║  │                                  (Nháp | Hiển thị | Đã ẩn)           │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  ─── CHỈ HIỆN KHI CHỌN "SỰ KIỆN" ────────────────────────────────  │  ║   │
│  ║  │  Ngày tổ chức *                  Địa điểm                            │  ║   │
│  ║  │  [dd/mm/yyyy 📅]                 [Hội trường thư viện...        ]    │  ║   │
│  ║  │  ────────────────────────────────────────────────────────────────── │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Ảnh banner *                                                        │  ║   │
│  ║  │  ┌────────────────────────────────────┐                              │  ║   │
│  ║  │  │  🖼  Kéo thả ảnh hoặc [Chọn file] │  Tỉ lệ khuyến nghị: 16:9   │  ║   │
│  ║  │  │     (PNG, JPG – tối đa 3MB)       │                              │  ║   │
│  ║  │  └────────────────────────────────────┘                              │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Mô tả ngắn (excerpt)                                                │  ║   │
│  ║  │  [                                                              ]    │  ║   │
│  ║  │  (Hiển thị ở trang chủ Portal, tối đa 200 ký tự)                     │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Nội dung đầy đủ *                                                   │  ║   │
│  ║  │  ┌────────────────────────────────────────────────────────────────┐  │  ║   │
│  ║  │  │ [B] [I] [U] [H1] [H2] [H3] [•] [1.] [🔗] [🖼] [📹] [──]      │  │  ║   │
│  ║  │  ├────────────────────────────────────────────────────────────────┤  │  ║   │
│  ║  │  │                                                                │  │  ║   │
│  ║  │  │  (Vùng soạn thảo rich-text)                                    │  │  ║   │
│  ║  │  │                                                                │  │  ║   │
│  ║  │  └────────────────────────────────────────────────────────────────┘  │  ║   │
│  ║  │                                                                      │  ║   │
│  ║  │  Từ khóa SEO (tags)                                                  │  ║   │
│  ║  │  [đọc sách ×] [thư viện ×] [+ Thêm tag]                             │  ║   │
│  ║  └──────────────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                              ║   │
│  ║                     [Hủy]    [Lưu nháp]    [✅ Đăng bài]                   ║   │
│  ║                                                                              ║   │
│  ╚══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `TextInput` | Tiêu đề bài viết (required) |
| `RadioGroup` | Chọn loại: Tin tức / Sự kiện |
| `StatusSelect` | Nháp / Hiển thị / Đã ẩn |
| `ConditionalSection` | Nhóm trường Ngày tổ chức + Địa điểm (chỉ hiện khi chọn Sự kiện) |
| `DatePicker` | Chọn ngày tổ chức sự kiện |
| `ImageUploader` | Upload ảnh banner với preview |
| `TextArea` | Mô tả ngắn / excerpt |
| `RichTextEditor` | Nội dung đầy đủ |
| `TagInput` | Nhập và quản lý tag SEO |
| `DraftBtn` | Lưu ở trạng thái Nháp |
| `PublishBtn` | Lưu và chuyển trạng thái thành Hiển thị |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/library/news` | Tạo tin tức mới |
| `PUT` | `/api/library/news/{id}` | Cập nhật tin tức |
| `GET` | `/api/library/news/{id}` | Lấy chi tiết (mode EDIT) |

---

### SCR-09b-006 — Modal xác nhận xóa tin tức

#### ASCII Wireframe

```
  ┌──────────────────────────────────────────────┐
  │  ⚠ Xác nhận xóa tin tức                     │
  ├──────────────────────────────────────────────┤
  │                                              │
  │  Bạn có chắc muốn xóa tin tức:              │
  │                                              │
  │  "Khai mạc tuần lễ đọc sách 2025"           │
  │                                              │
  │  Thao tác này không thể hoàn tác.            │
  │                                              │
  │              [Hủy]    [🗑 Xóa]              │
  │                                              │
  └──────────────────────────────────────────────┘
```

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `DELETE` | `/api/library/news/{id}` | Xóa tin tức theo ID |

---

## Phần B: Trang chủ Portal thư viện (Public)

---

### SCR-09b-010 — Trang chủ thư viện điện tử

#### Mô tả
Trang chủ công khai của Portal thư viện THPT Quốc Học Huế. Không yêu cầu đăng nhập. Gồm header với thanh tìm kiếm nhanh, banner tin tức nổi bật, section tài liệu mới nhất, lịch sự kiện và footer liên hệ.

#### Actors
- **Bạn đọc / Học sinh / Giáo viên** — truy cập tự do, không cần đăng nhập.
- **Bạn đọc đã đăng nhập** — xem thêm tính năng Đặt mượn, Đọc online.

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  ╔════════════════════════════════════════════════════════════════════════════════╗  │
│  ║  [🏫 Logo]  THƯ VIỆN ĐIỆN TỬ – THPT QUỐC HỌC HUẾ           [Đăng nhập]     ║  │
│  ║  ─────────────────────────────────────────────────────────────────────────── ║  │
│  ║  Trang chủ │ Tài liệu │ Tài liệu điện tử │ Tin tức & Sự kiện │ Liên hệ     ║  │
│  ╚════════════════════════════════════════════════════════════════════════════════╝  │
│                                                                                      │
│  ┌──────────────────────────────── HERO / SEARCH ────────────────────────────────┐  │
│  │                                                                                │  │
│  │         TÌM KIẾM TÀI LIỆU THƯ VIỆN                                            │  │
│  │                                                                                │  │
│  │   🔍 [Nhập tên sách, tác giả, từ khóa...                      ]  [Tìm]        │  │
│  │                                                                                │  │
│  │   ○ Tất cả    ○ Sách in    ○ Tạp chí    ○ Tài liệu điện tử                    │  │
│  │                                                                                │  │
│  │   Tìm kiếm phổ biến: [Văn học] [Toán nâng cao] [Lịch sử VN] [Tiếng Anh]      │  │
│  │                                                                                │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌──── TIN TỨC NỔI BẬT ───────────────────┐  ┌──── TÀI LIỆU MỚI NHẤT ──────────┐  │
│  │                                         │  │                                  │  │
│  │  ┌─────────────────────────────────┐    │  │  ┌──────┐  ┌──────┐  ┌──────┐   │  │
│  │  │  [🖼 Ảnh banner sự kiện lớn]    │    │  │  │ 📚   │  │ 📚   │  │ 📚   │   │  │
│  │  │                                 │    │  │  │[Bìa] │  │[Bìa] │  │[Bìa] │   │  │
│  │  │  ● Khai mạc tuần đọc sách 2025 │    │  │  └──────┘  └──────┘  └──────┘   │  │
│  │  │  ○ Thư viện nhập 200 sách mới  │    │  │  Lập trình  Văn học  Toán PT    │  │
│  │  │  ○ Cuộc thi Đại sứ đọc sách    │    │  │  Python     Truyện   Giải tích  │  │
│  │  │                                 │    │  │  Nguyễn A   Tô Hoài  GS. Nam    │  │
│  │  │  ← [1] [2] [3] →               │    │  │                                  │  │
│  │  └─────────────────────────────────┘    │  │  ┌──────┐  ┌──────┐  ┌──────┐   │  │
│  │                                         │  │  │ 📚   │  │ 📚   │  │ 📚   │   │  │
│  │  TIN TỨC GẦN ĐÂY                       │  │  │[Bìa] │  │[Bìa] │  │[Bìa] │   │  │
│  │  ─────────────────────────────────────  │  │  └──────┘  └──────┘  └──────┘   │  │
│  │  📰 Thư viện nhập 200 đầu sách mới     │  │  Vật lý     Hóa học  Địa lý    │  │
│  │     08/03/2026 · Tin tức               │  │  Cơ học     Hữu cơ   VN-TG     │  │
│  │                                         │  │                                  │  │
│  │  📰 Hướng dẫn mượn sách online         │  │  [→ Xem tất cả tài liệu mới]     │  │
│  │     01/03/2026 · Tin tức               │  │                                  │  │
│  │                                         │  └──────────────────────────────────┘  │
│  │  [→ Xem tất cả tin tức]                 │                                        │
│  │                                         │                                        │
│  └─────────────────────────────────────────┘                                        │
│                                                                                      │
│  ┌──── THỐNG KÊ THƯ VIỆN ────────────────────────────────────────────────────────┐  │
│  │                                                                                │  │
│  │   📚 12,450        🖥 3,200         👥 1,850          📅 15                   │  │
│  │   Đầu sách vật lý  Tài liệu điện tử  Lượt mượn/tháng  Sự kiện năm nay        │  │
│  │                                                                                │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌──── SỰ KIỆN SẮP TỚI ──────────────────────────────────────────────────────────┐  │
│  │                                                                                │  │
│  │  [📅 15/03]  Khai mạc tuần lễ đọc sách 2026   –  Hội trường thư viện         │  │
│  │  [📅 22/03]  Cuộc thi Đại sứ đọc sách          –  Phòng đọc lớn              │  │
│  │  [📅 05/04]  Hội thảo "Đọc sách trong kỷ nguyên số"  –  Online               │  │
│  │                                                                                │  │
│  │  [→ Xem lịch sự kiện đầy đủ]                                                   │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌──── TÀI LIỆU ĐIỆN TỬ NỔI BẬT ────────────────────────────────────────────────┐  │
│  │                                                                                │  │
│  │  ┌──────────────────────────────┐  ┌──────────────────────────────┐           │  │
│  │  │ 📄 [Bìa]  Giải tích 1        │  │ 📄 [Bìa]  Văn học VN        │           │  │
│  │  │           GS. Nguyễn Văn Nam │  │           TS. Trần Thị Lan  │           │  │
│  │  │           PDF · 245 trang     │  │           PDF · 312 trang    │           │  │
│  │  │           [👁 Đọc ngay]       │  │           [👁 Đọc ngay]      │           │  │
│  │  └──────────────────────────────┘  └──────────────────────────────┘           │  │
│  │                                                                                │  │
│  │  [→ Xem tất cả tài liệu điện tử]                                               │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌──── FOOTER ────────────────────────────────────────────────────────────────────┐  │
│  │  THƯ VIỆN THPT QUỐC HỌC HUẾ                                                   │  │
│  │  📍 12 Lê Lợi, TP. Huế  |  📞 0234 382 xxxx  |  📧 thuvien@quochoc.edu.vn    │  │
│  │  Giờ mở cửa: T2–T6: 7:00–17:00  |  T7: 7:00–11:30                            │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `PublicHeader` | Logo, nav menu ngang, nút Đăng nhập |
| `HeroSearchBar` | Ô tìm kiếm lớn + radio loại tài liệu + tag phổ biến |
| `NewsBanner` | Carousel ảnh tin nổi bật (auto-play 5s) |
| `NewsListMini` | Danh sách 3–5 tin tức mới nhất kèm ngày |
| `BookGrid` | Lưới ảnh bìa tài liệu mới (6 ô, 2 hàng) |
| `StatisticsBar` | 4 chỉ số thống kê thư viện |
| `EventTimeline` | Danh sách sự kiện sắp diễn ra với ngày và địa điểm |
| `EbookHighlight` | Card tài liệu điện tử nổi bật + nút Đọc ngay |
| `Footer` | Thông tin liên hệ + giờ mở cửa |

#### Flow điều hướng
```
SCR-09b-010 (Trang chủ Portal)
 ├─[Tìm kiếm] (bất kỳ từ khóa)────────────────→ SCR-09b-020 (OPAC, kết quả tìm)
 ├─[Click tin tức / Xem tất cả tin tức]────────→ SCR-09b-011 (Chi tiết tin tức)
 ├─[Click bìa sách / Xem tất cả tài liệu]──────→ SCR-09b-020 (OPAC danh sách)
 ├─[Tài liệu điện tử / Đọc ngay]───────────────→ SCR-09b-030 (DS tài liệu điện tử)
 │   └─ [Đọc ngay] chưa đăng nhập────────────→ Redirect → trang Đăng nhập
 └─[Đăng nhập]──────────────────────────────────→ WF-01 Auth
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Trang chủ hoàn toàn công khai, không yêu cầu đăng nhập |
| BR-02 | Nút "Đọc ngay" tài liệu điện tử: nếu chưa đăng nhập → redirect về trang đăng nhập, sau đó redirect lại tài liệu |
| BR-03 | Tin tức "Hiển thị" mới nhất (theo ngày đăng DESC) được hiển thị trong NewsListMini |
| BR-04 | Tài liệu mới nhất lấy theo `created_at DESC`, giới hạn 6 |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/portal/home` | Lấy dữ liệu tổng hợp trang chủ (tin, sách mới, sự kiện) |
| `GET` | `/api/library/portal/statistics` | Thống kê thư viện (số sách, lượt mượn…) |

---

### SCR-09b-011 — Trang chi tiết bài viết / tin tức

#### Mô tả
Trang hiển thị toàn văn một bài tin tức hoặc thông tin thư viện. Gồm ảnh banner, tiêu đề, metadata (ngày đăng, danh mục, tác giả), nội dung rich-text và sidebar gợi ý bài liên quan.

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [Header Portal: Logo | Nav | Đăng nhập]                                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  Trang chủ › Tin tức › Khai mạc tuần lễ đọc sách 2026                              │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │                                             │  │  CÁC BÀI LIÊN QUAN           │  │
│  │  [🖼 Ảnh banner toàn chiều rộng – 16:9]     │  │  ──────────────────────────  │  │
│  │                                             │  │  📰 Thư viện nhập 200 sách   │  │
│  │  Sự kiện  ·  10/03/2026  ·  Thủ thư B      │  │     mới trong tháng 3        │  │
│  │                                             │  │     08/03/2026               │  │
│  │  KHAI MẠC TUẦN LỄ ĐỌC SÁCH 2026            │  │                              │  │
│  │                                             │  │  📰 Hướng dẫn mượn sách      │  │
│  │  ─────────────────────────────────────────  │  │     online qua ứng dụng      │  │
│  │                                             │  │     01/03/2026               │  │
│  │  (Nội dung bài viết rich-text đầy đủ)       │  │                              │  │
│  │                                             │  │  📰 Kết quả cuộc thi đọc     │  │
│  │  Nhân dịp kỷ niệm Ngày Sách và Văn hóa     │  │     sách năm 2025            │  │
│  │  đọc Việt Nam (21/4), Thư viện THPT...      │  │     25/02/2026               │  │
│  │                                             │  │                              │  │
│  │  [Tiếp tục nội dung...]                     │  │  ──────────────────────────  │  │
│  │                                             │  │  SỰ KIỆN SẮP TỚI             │  │
│  │  Tags: [đọc sách] [sự kiện] [thư viện]      │  │  📅 22/03 – Cuộc thi Đại sứ  │  │
│  │                                             │  │  📅 05/04 – Hội thảo số hóa  │  │
│  │  ─────────────────────────────────────────  │  │                              │  │
│  │  Chia sẻ: [🔗 Copy link] [Facebook] [Zalo]  │  └──────────────────────────────┘  │
│  │                                             │                                    │
│  └─────────────────────────────────────────────┘                                    │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/news/{id}` | Lấy chi tiết bài viết (public) |
| `GET` | `/api/library/news/{id}/related` | Bài viết liên quan |

---

## Phần C: OPAC – Tra cứu tài liệu vật lý

---

### SCR-09b-020 — OPAC: Tìm kiếm & Danh sách tài liệu

#### Mô tả
Màn hình tra cứu tài liệu vật lý (OPAC – Online Public Access Catalog). Giao diện 2 cột: bên trái là bộ lọc đa tiêu chí (faceted search), bên phải là kết quả dạng card hoặc list. Bất kỳ ai cũng có thể tra cứu không cần đăng nhập.

#### Actors
- **Bạn đọc / Học sinh / Giáo viên** — tra cứu, lọc tài liệu vật lý.

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [Header Portal: Logo | Nav | Đăng nhập]                                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  Trang chủ › Tra cứu tài liệu                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌── THANH TÌM KIẾM CHÍNH (full-width) ────────────────────────────────────────┐   │
│  │  🔍 [Nhập tên sách, tác giả, ISBN, từ khóa...              ]  [🔍 Tìm kiếm] │   │
│  │                                                                              │   │
│  │  Tìm theo: ○ Tất cả  ○ Nhan đề  ○ Tác giả  ○ ISBN  ○ Chủ đề               │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                      │
│  ┌── FILTER (trái, 240px) ─────┐  ┌── KẾT QUẢ TÌM KIẾM (phải) ────────────────┐  │
│  │                             │  │                                             │  │
│  │  🔽 LOẠI TÀI LIỆU           │  │  Tìm thấy 127 kết quả cho "Python"          │  │
│  │  ─────────────────────────  │  │  Sắp xếp: [Phù hợp nhất ▾]  [☰][⊞]        │  │
│  │  ☑ Sách (98)                │  │                                             │  │
│  │  ☐ Tạp chí (15)             │  │  ───────────────────────────────────────    │  │
│  │  ☐ Luận văn (9)             │  │                                             │  │
│  │  ☐ Báo cáo (5)              │  │  ┌──────────────────────────────────────┐   │  │
│  │                             │  │  │ 📚 [Bìa 60x80]  Lập trình Python    │   │  │
│  │  🔽 CHỦ ĐỀ / MÔN HỌC       │  │  │                 cho người mới bắt đầu│   │  │
│  │  ─────────────────────────  │  │  │                 Tác giả: Eric Matthes│   │  │
│  │  ☐ Toán học (42)            │  │  │                 NXB: O'Reilly · 2023 │   │  │
│  │  ☑ Công nghệ TT (38)        │  │  │                 Phân loại: 005.13    │   │  │
│  │  ☐ Văn học (31)             │  │  │                 ● Còn 3 bản / 5 bản  │   │  │
│  │  ☐ Lịch sử (18)             │  │  │                 Vị trí: Kệ A2-03     │   │  │
│  │  ☐ Địa lý (12)              │  │  │                 [Xem chi tiết] [📌 Đặt mượn]│
│  │  ☐ Ngoại ngữ (20)           │  │  └──────────────────────────────────────┘   │  │
│  │  ☐ Khác (...)               │  │                                             │  │
│  │  [Xem thêm...]              │  │  ┌──────────────────────────────────────┐   │  │
│  │                             │  │  │ 📚 [Bìa 60x80]  Python Crash Course  │   │  │
│  │  🔽 NĂM XUẤT BẢN            │  │  │                 2nd Edition          │   │  │
│  │  ─────────────────────────  │  │  │                 Tác giả: Eric Matthes│   │  │
│  │  [2020] ─────────── [2026]  │  │  │                 NXB: No Starch · 2022│   │  │
│  │   ●──────────────●          │  │  │                 Phân loại: 005.13    │   │  │
│  │                             │  │  │                 ○ Hết – chờ trả      │   │  │
│  │  🔽 NGÔN NGỮ                │  │  │                 [Xem chi tiết] [🔔 Thông báo]│
│  │  ─────────────────────────  │  │  └──────────────────────────────────────┘   │  │
│  │  ☑ Tiếng Việt (89)          │  │                                             │  │
│  │  ☐ Tiếng Anh (35)           │  │  ┌──────────────────────────────────────┐   │  │
│  │  ☐ Ngôn ngữ khác (3)        │  │  │ 📚 [Bìa 60x80]  Automate the Boring │   │  │
│  │                             │  │  │                 Stuff with Python     │   │  │
│  │  🔽 NHÀ XUẤT BẢN            │  │  │                 Tác giả: Al Sweigart  │   │  │
│  │  ─────────────────────────  │  │  │                 NXB: NXB Trẻ · 2021  │   │  │
│  │  ☐ NXB Giáo dục (45)        │  │  │                 Phân loại: 005.13    │   │  │
│  │  ☐ NXB Trẻ (22)             │  │  │                 ● Còn 1 bản / 2 bản  │   │  │
│  │  ☐ NXB KH&KT (18)           │  │  │                 Vị trí: Kệ A2-05     │   │  │
│  │  ...                        │  │  │                 [Xem chi tiết] [📌 Đặt mượn]│
│  │                             │  │  └──────────────────────────────────────┘   │  │
│  │  🔽 TÌNH TRẠNG              │  │                                             │  │
│  │  ─────────────────────────  │  │  [Đang hiển thị 1–10 / 127]                 │  │
│  │  ○ Tất cả                   │  │                                             │  │
│  │  ○ Còn sẵn                  │  │       ← 1  [2]  3  4  5 ... 13 →           │  │
│  │  ○ Đang mượn                │  │                                             │  │
│  │                             │  └─────────────────────────────────────────────┘  │
│  │  [Đặt lại bộ lọc]           │                                                   │
│  └─────────────────────────────┘                                                   │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘

  [☰] = Chế độ List (danh sách dọc)
  [⊞] = Chế độ Grid (lưới bìa sách)
  ● Còn sẵn (xanh lá)  ○ Hết – chờ trả (đỏ cam)
  [📌 Đặt mượn] → yêu cầu đăng nhập
  [🔔 Thông báo] → nhận thông báo khi sách được trả
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `FullWidthSearchBar` | Ô tìm kiếm chính + radio tìm theo trường |
| `FilterPanel` | Sidebar trái: accordion các nhóm lọc |
| `CheckboxFilter` | Lọc theo Loại tài liệu / Chủ đề / Ngôn ngữ / NXB |
| `RangeSlider` | Lọc theo khoảng năm xuất bản |
| `AvailabilityRadio` | Radio: Tất cả / Còn sẵn / Đang mượn |
| `ResetFilterBtn` | Xóa tất cả bộ lọc |
| `ResultHeader` | Số kết quả + dropdown sắp xếp + toggle view |
| `BookCard` | Card hiển thị ảnh bìa, metadata, tình trạng, nút action |
| `AvailabilityBadge` | Badge màu "Còn N bản" hoặc "Hết – chờ trả" |
| `BorrowBtn` | Nút Đặt mượn (yêu cầu đăng nhập) |
| `NotifyBtn` | Nút đăng ký thông báo khi sách trả |
| `Pagination` | Phân trang + thông tin số kết quả |

#### Flow điều hướng
```
SCR-09b-020 (OPAC)
 ├─[Xem chi tiết] trên bất kỳ card────────────→ SCR-09b-021 (Chi tiết tài liệu)
 ├─[Đặt mượn] chưa đăng nhập──────────────────→ Trang Đăng nhập → quay lại
 ├─[Đặt mượn] đã đăng nhập────────────────────→ SCR-09b-021 → Modal đặt mượn
 └─[🔔 Thông báo] ─────────────────────────────→ Modal đăng ký nhận thông báo
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Tra cứu OPAC hoàn toàn công khai, không yêu cầu đăng nhập |
| BR-02 | Tính năng Đặt mượn yêu cầu đăng nhập |
| BR-03 | Tìm kiếm full-text tìm trong: nhan đề, tác giả, ISBN, tóm tắt, chủ đề |
| BR-04 | Bộ lọc kết hợp (AND logic): chọn nhiều checkbox trong cùng một nhóm = OR, khác nhóm = AND |
| BR-05 | Chế độ Grid hiển thị 12 card/trang; List hiển thị 10 kết quả/trang |
| BR-06 | Từ khóa tìm kiếm được highlight trong kết quả |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/catalog/search` | Tìm kiếm OPAC (q, type, subject, year_from, year_to, lang, publisher, availability, sort, page) |
| `GET` | `/api/library/catalog/facets` | Lấy các nhóm facet (số lượng theo từng filter) |

---

### SCR-09b-021 — OPAC: Chi tiết tài liệu vật lý

#### Mô tả
Trang hiển thị đầy đủ thông tin thư mục của một tài liệu vật lý: ảnh bìa, thông tin biên mục, tóm tắt, tình trạng từng bản sách (copy), vị trí kệ và nút đặt mượn.

#### Actors
- **Bạn đọc / Học sinh / Giáo viên** — xem thông tin (công khai).
- **Bạn đọc đã đăng nhập** — đặt mượn.

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [Header Portal: Logo | Nav | Đăng nhập / Xin chào Nguyễn A]                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  Trang chủ › Tra cứu › Lập trình Python cho người mới bắt đầu                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                               │  │
│  │  ┌──────────────┐   THÔNG TIN TÀI LIỆU                                       │  │
│  │  │              │   ───────────────────────────────────────────────────────  │  │
│  │  │  [🖼 Bìa     │   Nhan đề:      Lập trình Python cho người mới bắt đầu     │  │
│  │  │   sách lớn  │   Tác giả:      Eric Matthes                               │  │
│  │  │   180x240px]│   Năm XB:       2023                                        │  │
│  │  │              │   Nhà XB:       O'Reilly Media                             │  │
│  │  │              │   Số trang:     544 trang                                  │  │
│  │  │              │   Ngôn ngữ:     Tiếng Việt (bản dịch)                     │  │
│  │  │              │   ISBN:         978-604-18-xxxx                            │  │
│  │  │              │   Phân loại:    005.13 – Ngôn ngữ lập trình               │  │
│  │  │              │   Chủ đề:       [Python] [Lập trình] [CNTT]               │  │
│  │  │              │                                                            │  │
│  │  │  [🔍 Xem bìa │   TÓM TẮT                                                  │  │
│  │  │   lớn hơn]   │   ──────────────────────────────────────────────────────  │  │
│  │  └──────────────┘   Cuốn sách này là hướng dẫn toàn diện dành cho người      │  │
│  │                     mới bắt đầu học lập trình Python. Nội dung bao gồm        │  │
│  │                     các khái niệm cơ bản, cấu trúc dữ liệu, hàm, lớp...      │  │
│  │                     [Xem thêm]                                                │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─── TÌNH TRẠNG & ĐẶT MƯỢN ────────────────────────────────────────────────────┐  │
│  │                                                                               │  │
│  │  ┌──────────────────────────────────────────────────────────────────────┐    │  │
│  │  │  Mã bản  │  Vị trí            │  Tình trạng        │  Hạn trả       │    │  │
│  │  ├──────────┼────────────────────┼────────────────────┼────────────────┤    │  │
│  │  │  PY-001  │  Phòng đọc – A2-03 │  ✅ Sẵn sàng       │  —             │    │  │
│  │  │  PY-002  │  Phòng đọc – A2-03 │  ✅ Sẵn sàng       │  —             │    │  │
│  │  │  PY-003  │  Phòng đọc – A2-03 │  🔴 Đang mượn      │  25/03/2026    │    │  │
│  │  │  PY-004  │  Kho dự trữ        │  ✅ Sẵn sàng       │  —             │    │  │
│  │  │  PY-005  │  Phòng đọc – A2-04 │  🔴 Đang mượn      │  18/03/2026    │    │  │
│  │  └──────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                               │  │
│  │  Tổng: 5 bản  ·  ✅ 3 bản sẵn sàng  ·  🔴 2 bản đang mượn                   │  │
│  │                                                                               │  │
│  │  ┌────────────────────────────────────────────┐                              │  │
│  │  │  [📌 Đặt mượn tài liệu này]               │  ← yêu cầu đăng nhập        │  │
│  │  │  [🔔 Nhận thông báo khi có bản trả lại]    │  ← cho bản đang mượn hết    │  │
│  │  └────────────────────────────────────────────┘                              │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─── TÀI LIỆU LIÊN QUAN ────────────────────────────────────────────────────────┐  │
│  │                                                                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │  │
│  │  │ 📚 [Bìa]     │  │ 📚 [Bìa]     │  │ 📚 [Bìa]     │  │ 📚 [Bìa]     │       │  │
│  │  │ Python       │  │ Django Web   │  │ Data Science │  │ Automate...  │       │  │
│  │  │ Cookbook     │  │ Development  │  │ with Python  │  │ with Python  │       │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │  │
│  │                                                                                │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘

  Modal "Đặt mượn" (khi nhấn nút, đã đăng nhập):
  ┌────────────────────────────────────────┐
  │  📌 Đặt mượn tài liệu                  │
  ├────────────────────────────────────────┤
  │  Tài liệu: Lập trình Python...         │
  │  Bạn đọc:  Nguyễn Văn A (HS_001)      │
  │  Ngày muốn mượn: [dd/mm/yyyy 📅]       │
  │  Ghi chú:  [                      ]   │
  ├────────────────────────────────────────┤
  │       [Hủy]     [✅ Xác nhận đặt]      │
  └────────────────────────────────────────┘
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `CoverImage` | Ảnh bìa lớn + lightbox khi click |
| `MetadataTable` | Bảng thông tin biên mục tài liệu |
| `SubjectTags` | Danh sách tag chủ đề có thể click (search) |
| `AbstractText` | Tóm tắt với nút "Xem thêm" (expand/collapse) |
| `CopyAvailabilityTable` | Bảng tình trạng từng bản sách (mã, vị trí, tình trạng, hạn) |
| `AvailabilitySummary` | Tóm tắt: tổng bản / còn sẵn / đang mượn |
| `BorrowBtn` | Mở Modal đặt mượn (yêu cầu đăng nhập) |
| `NotifyBtn` | Đăng ký nhận thông báo khi sách được trả |
| `BorrowModal` | Modal xác nhận đặt mượn với ngày mong muốn |
| `RelatedBooks` | Carousel 4 tài liệu liên quan cùng chủ đề |

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Thông tin biên mục và tình trạng bản sách hiển thị công khai |
| BR-02 | Nút "Đặt mượn" chỉ active khi còn ít nhất 1 bản sẵn sàng |
| BR-03 | Nút "Nhận thông báo" chỉ hiện khi tất cả bản đang mượn |
| BR-04 | Yêu cầu đặt mượn gửi tới thủ thư để xét duyệt, không tự động cấp phép |
| BR-05 | Một bạn đọc chỉ được đặt mượn tối đa 3 tài liệu cùng lúc |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/catalog/{id}` | Chi tiết tài liệu + tình trạng các bản |
| `GET` | `/api/library/catalog/{id}/related` | Tài liệu liên quan |
| `POST` | `/api/library/borrow-requests` | Tạo yêu cầu đặt mượn |
| `POST` | `/api/library/borrow-notifications` | Đăng ký nhận thông báo |

---

## Phần D: Tra cứu & Đọc tài liệu điện tử

---

### SCR-09b-030 — Danh sách tài liệu điện tử

#### Mô tả
Trang tra cứu tài liệu điện tử (e-book, bài giảng, đề thi, luận văn dạng số). Giao diện tương tự OPAC nhưng với các bộ lọc phù hợp: định dạng file, có thể xem miễn phí hay yêu cầu đăng nhập.

#### Actors
- **Bạn đọc / Học sinh / Giáo viên** — xem danh sách, lọc (công khai).
- **Bạn đọc đã đăng nhập** — đọc tài liệu online.

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [Header Portal: Logo | Nav | Đăng nhập]                                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  Trang chủ › Tài liệu điện tử                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌── THANH TÌM KIẾM ────────────────────────────────────────────────────────────┐  │
│  │  🔍 [Nhập tên tài liệu, tác giả, từ khóa...               ]  [🔍 Tìm kiếm]  │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌── FILTER (trái, 240px) ─────┐  ┌── DANH SÁCH TÀI LIỆU ĐIỆN TỬ ──────────────┐  │
│  │                             │  │                                             │  │
│  │  🔽 ĐỊNH DẠNG               │  │  Tìm thấy 89 tài liệu  Sắp xếp: [Mới nhất ▾]│ │
│  │  ─────────────────────────  │  │  [☰ Danh sách]  [⊞ Lưới]                    │  │
│  │  ☑ PDF (61)                 │  │                                             │  │
│  │  ☐ EPUB (14)                │  │  ─────────────────────────────────────────  │  │
│  │  ☐ Word/DOCX (8)            │  │                                             │  │
│  │  ☐ PowerPoint (6)           │  │  ┌──────────────────────────────────────┐  │  │
│  │                             │  │  │ 📄[Bìa] Giải tích 1 – Chương 1–5    │  │  │
│  │  🔽 CHỦ ĐỀ                  │  │  │         GS. Nguyễn Văn Nam           │  │  │
│  │  ─────────────────────────  │  │  │         PDF · 245 trang · 8.3 MB     │  │  │
│  │  ☐ Toán học (25)            │  │  │         Thêm: 01/03/2026             │  │  │
│  │  ☑ CNTT (22)                │  │  │         🔓 Miễn phí – Đăng nhập đọc  │  │  │
│  │  ☐ Văn học (18)             │  │  │         [Xem chi tiết] [👁 Đọc ngay] │  │  │
│  │  ☐ Lý (12)                  │  │  └──────────────────────────────────────┘  │  │
│  │  ☐ Hóa (8)                  │  │                                             │  │
│  │  ☐ Sử (6)                   │  │  ┌──────────────────────────────────────┐  │  │
│  │  ☐ Địa (5)                  │  │  │ 📄[Bìa] Bài giảng Hóa hữu cơ        │  │  │
│  │  ☐ Khác (...)               │  │  │         TS. Trần Thị Lan             │  │  │
│  │                             │  │  │         PDF · 182 trang · 5.1 MB     │  │  │
│  │  🔽 QUYỀN TRUY CẬP          │  │  │         Thêm: 25/02/2026             │  │  │
│  │  ─────────────────────────  │  │  │         🔒 Yêu cầu đăng nhập         │  │  │
│  │  ○ Tất cả                   │  │  │         [Xem chi tiết] [👁 Đọc ngay] │  │  │
│  │  ○ Miễn phí (45)            │  │  └──────────────────────────────────────┘  │  │
│  │  ○ Yêu cầu đăng nhập (44)   │  │                                             │  │
│  │                             │  │  ┌──────────────────────────────────────┐  │  │
│  │  🔽 LOẠI TÀI LIỆU           │  │  │ 📄[Bìa] Đề thi HSG Toán tỉnh 2025  │  │  │
│  │  ─────────────────────────  │  │  │         Ban chuyên môn Toán          │  │  │
│  │  ☐ Sách / Giáo trình (32)   │  │  │         PDF · 12 trang · 0.8 MB      │  │  │
│  │  ☐ Bài giảng (28)           │  │  │         Thêm: 10/02/2026             │  │  │
│  │  ☑ Đề thi (18)              │  │  │         🔓 Miễn phí                   │  │  │
│  │  ☐ Luận văn (11)            │  │  │         [Xem chi tiết] [👁 Đọc ngay] │  │  │
│  │                             │  │  └──────────────────────────────────────┘  │  │
│  │  [Đặt lại bộ lọc]           │  │                                             │  │
│  │                             │  │  [Đang hiển thị 1–10 / 89]                  │  │
│  └─────────────────────────────┘  │       ← 1  [2]  3 ... 9 →                  │  │
│                                   └─────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘

  🔓 = Miễn phí (xem không cần đăng nhập)
  🔒 = Yêu cầu đăng nhập để đọc
  [👁 Đọc ngay] → nếu chưa đăng nhập: redirect login → quay lại
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `SearchBar` | Tìm kiếm full-text tài liệu điện tử |
| `FormatFilter` | Lọc theo định dạng file |
| `SubjectFilter` | Lọc theo môn học / chủ đề |
| `AccessFilter` | Lọc Tất cả / Miễn phí / Yêu cầu đăng nhập |
| `DocTypeFilter` | Lọc theo loại: Sách / Bài giảng / Đề thi / Luận văn |
| `EbookCard` | Card tài liệu: bìa, tác giả, thông tin file, badge quyền truy cập |
| `AccessBadge` | Icon 🔓/🔒 + label quyền truy cập |
| `ReadNowBtn` | Nút đọc ngay → kiểm tra đăng nhập → mở Viewer |
| `ViewDetailBtn` | Xem chi tiết → SCR-09b-031 |
| `Pagination` | Phân trang |

#### Flow điều hướng
```
SCR-09b-030
 ├─[Xem chi tiết]─────────────────────────────→ SCR-09b-031 (Chi tiết ebook)
 ├─[👁 Đọc ngay] (đã đăng nhập)────────────────→ SCR-09b-032 (Viewer)
 └─[👁 Đọc ngay] (chưa đăng nhập)──────────────→ Trang Đăng nhập → SCR-09b-032
```

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/ebooks` | Lấy danh sách tài liệu điện tử (filter, paginate) |
| `GET` | `/api/library/ebooks/facets` | Facet counts cho filter |

---

### SCR-09b-031 — Chi tiết tài liệu điện tử

#### Mô tả
Trang hiển thị đầy đủ thông tin tài liệu điện tử: ảnh bìa lớn, thông tin biên mục, mô tả, thông tin file, preview vài trang và nút Đọc online.

#### Actors
- **Bạn đọc** — xem thông tin (công khai), đọc online (cần đăng nhập tùy cấu hình).

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [Header Portal]                                                                    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  Trang chủ › Tài liệu điện tử › Giải tích 1 – Chương 1–5                           │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                               │  │
│  │  ┌──────────────┐   THÔNG TIN TÀI LIỆU ĐIỆN TỬ                               │  │
│  │  │              │   ─────────────────────────────────────────────────────    │  │
│  │  │  [🖼 Bìa     │   Nhan đề:    Giải tích 1 – Chương 1–5                     │  │
│  │  │   tài liệu  │   Tác giả:    GS. Nguyễn Văn Nam                          │  │
│  │  │   180x240px]│   Năm:        2024                                          │  │
│  │  │              │   Loại TL:    Bài giảng / Giáo trình                       │  │
│  │  │              │   Định dạng:  📄 PDF                                       │  │
│  │  │              │   Số trang:   245 trang                                    │  │
│  │  │              │   Dung lượng: 8.3 MB                                       │  │
│  │  │              │   Ngôn ngữ:   Tiếng Việt                                   │  │
│  │  │  PDF         │   Chủ đề:     [Toán học] [Giải tích] [Đại học]            │  │
│  │  │  245 trang   │   Quyền:      🔓 Miễn phí – Yêu cầu đăng nhập đọc online  │  │
│  │  └──────────────┘   Lượt xem:   1,247                                        │  │
│  │                                                                               │  │
│  │  TÓM TẮT / MÔ TẢ                                                              │  │
│  │  ─────────────────────────────────────────────────────────────────────────── │  │
│  │  Tài liệu bài giảng Giải tích 1 dành cho học sinh chuyên Toán. Nội dung       │  │
│  │  bao gồm: Giới hạn, Liên tục, Đạo hàm, Tích phân bất định và xác định.       │  │
│  │  Kèm theo bài tập có lời giải chi tiết sau mỗi chương.                         │  │
│  │                                                                               │  │
│  │  MỤC LỤC TÓMT TẮT                                                             │  │
│  │  ─────────────────────────────────────────────────────────────────────────── │  │
│  │  • Chương 1: Giới hạn và Liên tục (trang 1–48)                               │  │
│  │  • Chương 2: Đạo hàm (trang 49–112)                                           │  │
│  │  • Chương 3: Ứng dụng đạo hàm (trang 113–168)                                │  │
│  │  • Chương 4: Tích phân bất định (trang 169–208)                               │  │
│  │  • Chương 5: Tích phân xác định (trang 209–245)                               │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─── PREVIEW & HÀNH ĐỘNG ───────────────────────────────────────────────────────┐  │
│  │                                                                               │  │
│  │  ┌────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │  [Trang 1/245]  [Trang 2/245]  [Trang 3/245]   (Preview 3 trang đầu)  │  │  │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                           │  │  │
│  │  │  │ [thumb 1] │  │ [thumb 2] │  │ [thumb 3] │   🔒 Các trang còn lại   │  │  │
│  │  │  │           │  │           │  │           │   yêu cầu đăng nhập       │  │  │
│  │  │  └───────────┘  └───────────┘  └───────────┘                           │  │  │
│  │  └────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                               │  │
│  │  ┌────────────────────────────────────┐                                      │  │
│  │  │  [👁 Đọc online đầy đủ]            │  ← yêu cầu đăng nhập               │  │
│  │  │  [⬇ Tải xuống]                    │  ← tuỳ cấu hình quyền              │  │
│  │  └────────────────────────────────────┘                                      │  │
│  │                                                                               │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─── TÀI LIỆU CÙNG CHỦ ĐỀ ─────────────────────────────────────────────────────┐  │
│  │  [Card 1]  [Card 2]  [Card 3]  [Card 4]                                       │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/ebooks/{id}` | Chi tiết tài liệu điện tử |
| `GET` | `/api/library/ebooks/{id}/preview` | URL các trang preview (3 trang đầu) |
| `GET` | `/api/library/ebooks/{id}/read-token` | Token truy cập để đọc (auth required) |

---

### SCR-09b-032 — Trình đọc tài liệu online (Viewer)

#### Mô tả
Màn hình đọc tài liệu điện tử trực tuyến toàn trang (full-page reader). Giao diện chia 2 cột: Sidebar trái chứa mục lục / trang thumbnail; Cột phải là vùng hiển thị tài liệu (PDF/EPUB viewer) với thanh điều khiển đầy đủ. Yêu cầu đăng nhập.

#### Actors
- **Bạn đọc đã đăng nhập** — đọc tài liệu online.

#### ASCII Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  [← Quay lại]  📄 Giải tích 1 – Chương 1–5 · GS. Nguyễn Văn Nam              │ │
│  │                                                     [👤 Nguyễn Văn A]  [✕ Đóng]│ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  ┌──────────────────┐  ┌────────────────────────────────────────────────────────┐   │
│  │  SIDEBAR TRÁI    │  │  VÙNG ĐỌC TÀI LIỆU                                     │   │
│  │  (280px)         │  │                                                        │   │
│  │  ──────────────  │  │  ┌── THANH ĐIỀU KHIỂN (toolbar) ─────────────────────┐ │   │
│  │  [ Mục lục ]     │  │  │  [⊞Mục lục] [⊟] ─────────── [−][100%][+] [⛶]    │ │   │
│  │  [Thumbnail]     │  │  │                                                   │ │   │
│  │  ──────────────  │  │  │  ← Trang [  48  ] / 245 →    [🔍][↓Tải][🖨]      │ │   │
│  │                  │  │  └───────────────────────────────────────────────────┘ │   │
│  │  MỤC LỤC         │  │                                                        │   │
│  │  ──────────────  │  │  ┌────────────────────────────────────────────────┐    │   │
│  │  ▼ Chương 1      │  │  │                                                │    │   │
│  │    Giới hạn và   │  │  │   [NỘI DUNG TRANG PDF ĐƯỢC RENDER]             │    │   │
│  │    Liên tục      │  │  │                                                │    │   │
│  │    (tr. 1–48)    │  │  │   Chương 2: ĐẠO HÀM                           │    │   │
│  │                  │  │  │                                                │    │   │
│  │  ▶ Chương 2      │  │  │   2.1 Định nghĩa đạo hàm                       │    │   │
│  │    Đạo hàm [●]   │  │  │                                                │    │   │
│  │    (tr. 49–112)  │  │  │   Cho hàm số y = f(x) xác định trên khoảng    │    │   │
│  │                  │  │  │   (a, b) và x₀ ∈ (a, b). Nếu tồn tại giới    │    │   │
│  │  ▶ Chương 3      │  │  │   hạn hữu hạn:                                │    │   │
│  │    Ứng dụng      │  │  │                                                │    │   │
│  │    đạo hàm       │  │  │       lim [f(x₀+Δx) − f(x₀)] / Δx            │    │   │
│  │    (tr. 113–168) │  │  │       Δx→0                                    │    │   │
│  │                  │  │  │                                                │    │   │
│  │  ▶ Chương 4      │  │  │   thì giới hạn đó gọi là đạo hàm của f tại   │    │   │
│  │    Tích phân     │  │  │   x₀, ký hiệu f'(x₀) hoặc dy/dx|x=x₀         │    │   │
│  │    bất định      │  │  │                                                │    │   │
│  │    (tr. 169–208) │  │  │   ...                                          │    │   │
│  │                  │  │  │                                                │    │   │
│  │  ▶ Chương 5      │  │  └────────────────────────────────────────────────┘    │   │
│  │    Tích phân     │  │                                                        │   │
│  │    xác định      │  │  ┌── ĐIỀU HƯỚNG TRANG ───────────────────────────────┐ │   │
│  │    (tr. 209–245) │  │  │   [← Trang trước]    Trang 48 / 245   [Trang sau →]│ │   │
│  │                  │  │  └───────────────────────────────────────────────────┘ │   │
│  │  ──────────────  │  │                                                        │   │
│  │  TÌM TRONG TL    │  │                                                        │   │
│  │  [🔍 Tìm...    ] │  │                                                        │   │
│  │                  │  │                                                        │   │
│  │  ──────────────  │  │                                                        │   │
│  │  THUMBNAIL       │  │                                                        │   │
│  │  ┌───┐  ┌───┐    │  │                                                        │   │
│  │  │46 │  │47 │    │  │                                                        │   │
│  │  └───┘  └───┘    │  │                                                        │   │
│  │  ┌───┐  ┌───┐    │  │                                                        │   │
│  │  │[48]│  │49 │   │  │                                                        │   │
│  │  └───┘  └───┘    │  │                                                        │   │
│  │  (trang hiện tại │  │                                                        │   │
│  │   viền xanh)     │  │                                                        │   │
│  └──────────────────┘  └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────┘

  TOOLBAR CHÚ THÍCH:
  [⊞Mục lục]  = Ẩn/hiện sidebar mục lục
  [⊟]         = Thu nhỏ sidebar
  [−][100%][+] = Zoom out / level / zoom in
  [⛶]         = Toàn màn hình (fullscreen)
  [🔍]         = Tìm kiếm trong tài liệu
  [↓Tải]      = Tải PDF (tuỳ quyền)
  [🖨]         = In tài liệu (tuỳ quyền)
  [●] trên Chương 2 = Chương đang đọc (highlight)
```

#### Components
| Component | Mô tả |
|-----------|-------|
| `ViewerHeader` | Nút quay lại, tiêu đề tài liệu, thông tin user, nút đóng |
| `TableOfContents` | Cây mục lục có thể expand/collapse, highlight chương hiện tại |
| `PageThumbnails` | Lưới thumbnail trang, click để nhảy trang |
| `InDocumentSearch` | Tìm kiếm từ khóa trong toàn văn tài liệu |
| `ViewerToolbar` | Thanh công cụ: toggle sidebar, zoom, fullscreen, tìm, tải, in |
| `PDFRenderer` | Vùng render trang PDF (lazy load theo trang) |
| `PageNavigator` | Input số trang + nút Trước/Sau + tổng số trang |
| `ZoomControl` | Tăng/giảm/đặt zoom level |
| `FullscreenBtn` | Bật/tắt toàn màn hình |
| `DownloadBtn` | Tải file (hiển thị theo cấu hình quyền) |
| `PrintBtn` | In tài liệu (hiển thị theo cấu hình quyền) |

#### Flow điều hướng
```
SCR-09b-032 (Viewer)
 ├─[← Quay lại]──────────────────────────────→ SCR-09b-031 (Chi tiết ebook)
 ├─[✕ Đóng]──────────────────────────────────→ SCR-09b-030 (Danh sách ebook)
 ├─[Click mục lục]───────────────────────────→ Nhảy tới trang tương ứng (in-page)
 ├─[Click thumbnail]─────────────────────────→ Nhảy tới trang đó (in-page)
 └─[⛶ Fullscreen]────────────────────────────→ Viewer full màn hình (in-page)
```

#### Business Rules
| # | Quy tắc |
|---|---------|
| BR-01 | Yêu cầu đăng nhập; chưa đăng nhập → redirect về trang login kèm `?redirect=/viewer/{id}` |
| BR-02 | Session đọc được ghi lại: `last_page_read`, thời gian đọc — phục vụ thống kê |
| BR-03 | Mỗi lần mở viewer ghi `view_count++` cho tài liệu (debounce 5 phút / user / tài liệu) |
| BR-04 | Không cho phép inspect/download file gốc trực tiếp; phục vụ qua streaming API có token |
| BR-05 | Nút Tải xuống / In chỉ hiển thị nếu tài liệu được cấu hình `allow_download = true` |
| BR-06 | Token đọc có thời hạn 2 giờ; hết hạn → hiện modal "Phiên đọc hết hạn, tải lại trang" |
| BR-07 | Tìm kiếm trong tài liệu highlight kết quả và nhảy tới trang đầu tiên có kết quả |

#### API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/ebooks/{id}/read-token` | Lấy signed token để stream PDF (auth required) |
| `GET` | `/api/library/ebooks/{id}/stream?token=...&page=N` | Stream nội dung trang PDF |
| `GET` | `/api/library/ebooks/{id}/toc` | Lấy mục lục tài liệu |
| `POST` | `/api/library/ebooks/{id}/reading-sessions` | Ghi nhận tiến độ đọc (page, duration) |
| `GET` | `/api/library/ebooks/{id}/search?q=...` | Tìm kiếm trong toàn văn tài liệu |

---

## Phụ lục: Flow tổng thể

```
                    ┌─────────────────────────────────────────┐
                    │     QUẢN LÝ NỘI DUNG PORTAL (Admin)     │
                    │                                         │
                    │  SCR-09b-001 ──→ SCR-09b-002            │
                    │  (DS nội dung)    (Thêm/Sửa nội dung)   │
                    │       └─────────→ SCR-09b-003 (Xóa)     │
                    │                                         │
                    │  SCR-09b-004 ──→ SCR-09b-005            │
                    │  (DS tin tức)     (Thêm/Sửa tin)        │
                    │       └─────────→ SCR-09b-006 (Xóa)     │
                    └───────────────────────────┬─────────────┘
                                                │ Nội dung xuất bản
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PORTAL CÔNG KHAI (Bạn đọc)                               │
│                                                                                 │
│  SCR-09b-010 (Trang chủ Portal)                                                 │
│      │                                                                          │
│      ├─[Tìm kiếm]──────────────────────────────────────────────────────────┐   │
│      │                                                                      │   │
│      ├─[Tin tức]──→ SCR-09b-011 (Chi tiết tin tức)                         │   │
│      │                                                                      │   │
│      ├─[Tài liệu]──────────────────────────────────────────────────────────┤   │
│      │           ▼                                                          │   │
│      │    SCR-09b-020 (OPAC – DS & Tìm kiếm tài liệu vật lý) ←────────────┘   │
│      │          │                                                               │
│      │          └─→ SCR-09b-021 (Chi tiết tài liệu vật lý)                     │
│      │                    │                                                     │
│      │                    └─→ [Modal Đặt mượn] (cần đăng nhập)                 │
│      │                                                                          │
│      └─[Tài liệu điện tử]                                                       │
│                 │                                                                │
│          SCR-09b-030 (DS tài liệu điện tử)                                      │
│                 │                                                                │
│                 ├─→ SCR-09b-031 (Chi tiết ebook)                                │
│                 │          │                                                     │
│                 │          └─→ SCR-09b-032 (Viewer – cần đăng nhập)             │
│                 │                                                                │
│                 └─→ SCR-09b-032 (Viewer – cần đăng nhập, qua nút Đọc ngay)      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phụ lục: Quy ước chung

| Ký hiệu | Nghĩa |
|---------|-------|
| `●` | Trạng thái active / Hiển thị / Còn sẵn |
| `○` | Trạng thái inactive / Đã ẩn / Nháp |
| `🔓` | Miễn phí / Công khai |
| `🔒` | Yêu cầu đăng nhập |
| `[✎]` | Nút Sửa |
| `[🗑]` | Nút Xóa |
| `[📌]` | Nút Đặt mượn |
| `[👁]` | Nút Đọc / Xem online |
| `[⛶]` | Chế độ toàn màn hình |
| `SCR-09b-xxx` | Mã màn hình thuộc module WF-09b |

| Actor | Quyền truy cập |
|-------|---------------|
| Thủ thư / Admin thư viện | Toàn bộ Phần A (quản lý nội dung + tin tức) |
| Bạn đọc / Học sinh / Giáo viên | Toàn bộ Phần B, C, D (chỉ xem, tra cứu) |
| Bạn đọc đã đăng nhập | Phần B, C, D + Đặt mượn + Đọc online |
