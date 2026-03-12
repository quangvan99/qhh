---
title: "WF-06b: Giảng viên, Báo cáo & Quản trị LMS"
cluster: "Learning - Manager / Instructor, Reports, Admin"
screens: [SCR-06b-001, SCR-06b-002, SCR-06b-010, SCR-06b-011, SCR-06b-020, SCR-06b-021, SCR-06b-022, SCR-06b-030, SCR-06b-031, SCR-06b-032]
updated: 2026-03-11
---

# WF-06b: Giảng viên, Báo cáo & Quản trị LMS

---

## Tổng quan luồng

**Nhóm A – Thiết lập giảng viên (06h):** CBQL thêm/xóa giảng viên khỏi lớp học, tìm kiếm và tích chọn từ danh sách hệ thống.

**Nhóm B – Báo cáo lớp học (06i):** CBQL xem báo cáo tổng quan và xuất file Excel/PDF các loại báo cáo học sinh, kết quả thi, kết quả học, tổng hợp.

**Nhóm C – Quản trị hệ thống LMS (06l):** QTHT quản lý người dùng (CRUD, phân quyền, khóa/mở khóa), quản lý vai trò, cơ cấu tổ chức.

```
[SCR-06b-001: Thiết lập GV trong lớp]
        │
        ├──[+ Thêm GV]──────→ [SCR-06b-002: Dialog tìm & chọn GV] ──→ Lưu → [SCR-06b-001]
        └──[🗑️ Xóa GV]──────→ Dialog xác nhận ──→ Đồng ý → [SCR-06b-001]

[SCR-06b-010: Báo cáo lớp học - Hub]
        ├──[Tab: DS Học sinh]──→ [SCR-06b-011: Xem báo cáo DS HS]
        ├──[Tab: KQ Thi]───────→ [SCR-06b-011] ──→ [Xuất Excel/PDF]
        ├──[Tab: KQ Học]───────→ [SCR-06b-011] ──→ [Xuất Excel/PDF]
        └──[Tab: Tổng hợp]─────→ [SCR-06b-011] ──→ [Xuất Excel/PDF]

[SCR-06b-020: QL Người dùng LMS]
        ├──[+ Thêm]───────→ [SCR-06b-021: Form thêm/sửa ND]
        ├──[Import Excel]──→ [SCR-06b-022: Stepper Import ND]
        ├──[Gán vai trò]───→ Dialog gán role
        ├──[Đổi mật khẩu]──→ Dialog đổi MK
        └──[Khóa/Mở khóa]──→ Dialog xác nhận | Import Excel

[SCR-06b-030: QL Vai trò LMS]
        ├──[+ Thêm role]───→ [SCR-06b-031: Form vai trò]
        ├──[✏️ Sửa]────────→ [SCR-06b-031]
        ├──[Gán quyền]─────→ [SCR-06b-032: Phân quyền chức năng]
        └──[🗑️ Xóa]────────→ Dialog xác nhận
```

---

## Phần A: Thiết lập giảng viên cho lớp học

---

### SCR-06b-001: Danh sách giảng viên trong lớp

**Mô tả:** Màn quản lý giảng viên của một lớp học cụ thể. CBQL xem, thêm mới, xóa giảng viên.

**Actors:** Cán bộ quản lý (CBQL)

**Truy cập từ:** Danh sách lớp học > Thiết lập giảng viên

#### Layout

```
┌─────────────────────────────────────────────────┐
│ 🏠 > Lớp học > 10A1 > Thiết lập giảng viên       │
├─────────────────────────────────────────────────┤
│       THIẾT LẬP GIẢNG VIÊN – Lớp 10A1           │
├─────────────────────────────────────────────────┤
│ [+ Thêm giảng viên]   [🗑️ Xóa]  (khi chọn ≥1)  │
├─────────────────────────────────────────────────┤
│ 🔍 [Tìm tên, mã giảng viên...      ] [Tìm kiếm] │
├────┬────────────┬───────────┬──────────┬─────────┤
│ ☐  │ Họ tên GV  │ Mã GV     │ Môn dạy  │ Thao tác│
├────┼────────────┼───────────┼──────────┼─────────┤
│ ☐  │ Nguyễn A   │ GV001     │ Toán     │ 🗑️      │
│ ☐  │ Trần B     │ GV002     │ Lý       │ 🗑️      │
│ ☐  │ Lê C       │ GV003     │ Hóa      │ 🗑️      │
├────┴────────────┴───────────┴──────────┴─────────┤
│ 1–3 / 3 bản ghi              [10▼] bản ghi/trang │
└─────────────────────────────────────────────────┘
```

**Components:** Breadcrumb, toolbar (Thêm, Xóa), search input, bảng có checkbox + phân trang

**Flow:** Vào màn → xem DS GV → tìm kiếm → chọn GV → Xóa hoặc Thêm mới

**Business rules:**
- Xóa GV khỏi lớp không xóa tài khoản GV trên hệ thống
- Xóa nhiều GV cùng lúc: chọn checkbox nhiều dòng → nhấn Xóa → xác nhận

**API:** `GET /api/classes/{id}/instructors` · `DELETE /api/classes/{id}/instructors`

---

### SCR-06b-002: Dialog thêm giảng viên vào lớp

**Mô tả:** Popup/modal tìm kiếm và tích chọn giảng viên từ hệ thống để thêm vào lớp.

**Actors:** CBQL

**Truy cập từ:** SCR-06b-001 > [+ Thêm giảng viên]

#### Layout

```
┌─────────────────────────────────────────────────┐
│  THÊM GIẢNG VIÊN VÀO LỚP 10A1           [✕]    │
├─────────────────────────────────────────────────┤
│ 🔍 [Nhập tên / mã GV để tìm...   ] [Tìm kiếm]  │
├──────────────────────────┬──────────────────────┤
│  KẾT QUẢ TÌM KIẾM        │  ĐÃ CHỌN (2)         │
│  ☐ Phạm D  – GV004       │  ✓ Phạm D – GV004    │
│  ☐ Hoàng E – GV005       │  ✓ Vũ F   – GV006    │
│  ☑ Vũ F    – GV006       │                      │
│  ☐ Đỗ G    – GV007       │  [✕ Xóa khỏi DS]     │
├──────────────────────────┴──────────────────────┤
│                        [Hủy]      [💾 Lưu]       │
└─────────────────────────────────────────────────┘
```

**Components:** Search input, dual-panel (kết quả / đã chọn), checkbox list, nút Lưu/Hủy

**Flow:** Nhập từ khóa → hệ thống lọc → tích chọn → hiện panel "Đã chọn" → Lưu → cập nhật SCR-06b-001

**Business rules:**
- GV đã có trong lớp không hiển thị trong kết quả tìm kiếm
- Phải chọn ít nhất 1 GV mới cho phép nhấn Lưu

**API:** `GET /api/instructors?q={keyword}` · `POST /api/classes/{id}/instructors`

---

## Phần B: Quản lý báo cáo lớp học

---

### SCR-06b-010: Hub báo cáo lớp học

**Mô tả:** Màn trung tâm báo cáo, dùng tab để chuyển giữa 4 loại báo cáo của lớp.

**Actors:** CBQL

**Truy cập từ:** Sidebar > Báo cáo lớp học

#### Layout

```
┌──────────────────────────────────────────────────┐
│ 🏠 > Lớp học > 10A1 > Báo cáo                    │
├──────────────────────────────────────────────────┤
│         QUẢN LÝ BÁO CÁO – Lớp 10A1              │
├────────────┬──────────┬───────────┬──────────────┤
│ DS Học sinh│ KQ Thi   │ KQ Học    │ Tổng hợp     │
├────────────┴──────────┴───────────┴──────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  [Nội dung báo cáo – xem SCR-06b-011]      │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│         [📥 Xuất Excel]   [📄 Xuất PDF]           │
└──────────────────────────────────────────────────┘
```

**Components:** Tab navigation (4 tabs), vùng nội dung báo cáo, nút xuất file

**Flow:** Chọn tab → hệ thống render báo cáo → xem → nhấn Xuất → download file

**Business rules:**
- Mỗi tab hiển thị đúng loại báo cáo tương ứng
- Xuất file: hệ thống tổng hợp dữ liệu → tạo file → trình duyệt tải xuống

**API:** `GET /api/classes/{id}/reports?type={type}` · `GET /api/classes/{id}/reports/export?type={type}&format={excel|pdf}`

---

### SCR-06b-011: Xem & xuất báo cáo chi tiết

**Mô tả:** Màn hiển thị nội dung báo cáo theo loại tab đang chọn (DS học sinh / KQ thi / KQ học / Tổng hợp).

**Actors:** CBQL

**Truy cập từ:** SCR-06b-010 (mỗi tab)

#### Layout

```
┌──────────────────────────────────────────────────┐
│  [← Quay lại]  BÁO CÁO KẾT QUẢ THI – Lớp 10A1  │
├──────────────────────────────────────────────────┤
│ Lớp: 10A1  |  Năm học: 2025-2026  |  Kỳ: HK1    │
├───────┬────────────┬──────────┬──────┬───────────┤
│ STT   │ Họ tên HS  │ Môn thi  │ Điểm │ Xếp loại  │
├───────┼────────────┼──────────┼──────┼───────────┤
│  1    │ Nguyễn A   │ Toán     │  8.5 │ Giỏi      │
│  2    │ Trần B     │ Toán     │  7.0 │ Khá       │
│  3    │ Lê C       │ Toán     │  5.5 │ TB        │
│  ...  │ ...        │ ...      │ ...  │ ...       │
├───────┴────────────┴──────────┴──────┴───────────┤
│ Tổng: 35 HS | Giỏi: 12 | Khá: 18 | TB: 5 | Yếu: 0│
├──────────────────────────────────────────────────┤
│  Hiển thị 1–10/35    [10▼]    [◀] 1 2 3 4 [▶]   │
│                 [📥 Xuất Excel]  [📄 Xuất PDF]    │
└──────────────────────────────────────────────────┘
```

**Components:** Header thông tin lớp, bảng dữ liệu + phân trang, dòng tổng hợp, nút xuất file

**Flow:** Render bảng → xem dữ liệu → (tùy chọn) xuất file → hộp thoại tải xuống

**Business rules:**
- Dữ liệu được tổng hợp real-time từ CSDL điểm
- Tên file xuất: `BaoCao_{type}_{className}_{date}.xlsx/.pdf`

**API:** `GET /api/classes/{id}/reports/students` · `GET /api/classes/{id}/reports/exam-results` · `GET /api/classes/{id}/reports/learning-results` · `GET /api/classes/{id}/reports/summary`

---

## Phần C: Quản trị hệ thống LMS

---

### SCR-06b-020: Danh sách người dùng LMS

**Mô tả:** Màn trung tâm quản lý toàn bộ tài khoản người dùng. QTHT tìm kiếm, lọc, thực hiện CRUD và các thao tác hàng loạt.

**Actors:** Quản trị hệ thống (QTHT)

**Truy cập từ:** Sidebar Admin > Quản lý người dùng

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ 🏠 > Quản trị hệ thống > Người dùng                  │
├─────────────────────────────────────────────────────┤
│              QUẢN LÝ NGƯỜI DÙNG LMS                 │
├─────────────────────────────────────────────────────┤
│ [+ Thêm mới] [📥 Import Excel] [🔑 Đổi MK Excel]    │
│ [🔒 Khóa/Mở Excel]             [📤 Xuất báo cáo]    │
├─────────────────────────────────────────────────────┤
│ 🔍 [Tên/mã/email...]  Đơn vị:[Tất cả ▼] [Tìm kiếm] │
├──┬───────────┬────────────┬──────────┬──────────────┤
│☐ │ Họ tên    │ Email      │ Đơn vị   │ Thao tác      │
├──┼───────────┼────────────┼──────────┼──────────────┤
│☐ │ Nguyễn A  │ a@edu.vn   │ Phòng IT │✏️🗑️🔑👤🔒    │
│☐ │ Trần B    │ b@edu.vn   │ THPT X   │✏️🗑️🔑👤🔒    │
│☐ │ Lê C      │ c@edu.vn   │ THPT Y   │✏️🗑️🔑👤🔒    │
├──┴───────────┴────────────┴──────────┴──────────────┤
│ [10▼] bản ghi/trang    1–10/256    [◀] 1 2 3 [▶]    │
└─────────────────────────────────────────────────────┘
```
*(icon: ✏️=sửa  🗑️=xóa  🔑=đổi MK  👤=gán role  🔒=khóa/mở)*

**Components:** Toolbar hành động hàng loạt, filter (keyword + đơn vị), bảng + phân trang + actions per row

**Flow:** Tìm kiếm/lọc → chọn người dùng → thực hiện thao tác (sửa / xóa / đổi MK / gán role / khóa)

**Business rules:**
- Xóa người dùng: yêu cầu xác nhận; soft-delete (ẩn, không mất dữ liệu)
- Khóa tài khoản: người dùng không thể đăng nhập cho đến khi mở khóa
- Xuất báo cáo: file Excel danh sách toàn bộ người dùng theo bộ lọc hiện tại

**API:** `GET /api/admin/users?q=&unit=&page=` · `DELETE /api/admin/users/{id}` · `PATCH /api/admin/users/{id}/lock` · `GET /api/admin/users/export`

---

### SCR-06b-021: Form thêm mới / chỉnh sửa người dùng

**Mô tả:** Form tạo mới hoặc cập nhật thông tin tài khoản người dùng (dùng chung).

**Actors:** QTHT

**Truy cập từ:** SCR-06b-020 > [+ Thêm mới] hoặc [✏️ Sửa]

#### Layout

```
┌──────────────────────────────────────────────────┐
│  THÊM MỚI NGƯỜI DÙNG              [✕]            │
├──────────────────────────────────────────────────┤
│  Họ và tên*  [____________________________]      │
│  Email*      [____________________________]      │
│  Mã NV/HS    [____________________________]      │
│  Đơn vị*     [Chọn đơn vị...           ▼]        │
│  Mật khẩu*   [____________________________]      │
│  Xác nhận MK*[____________________________]      │
│  Vai trò     [☐ CBQL] [☐ GV] [☐ HS] [☐ QTHT]    │
│                                                  │
│  ⚠ Trường (*) là bắt buộc                        │
│                        [Hủy]    [💾 Lưu]          │
└──────────────────────────────────────────────────┘
```

**Components:** Input fields, dropdown đơn vị, checkbox vai trò, validation inline, nút Lưu/Hủy

**Flow:** Điền thông tin → validate → Lưu → thông báo thành công → quay về SCR-06b-020

**Business rules:**
- Email phải duy nhất trong hệ thống
- Mật khẩu: min 8 ký tự, có chữ hoa và số
- Khi sửa: trường MK để trống = không đổi mật khẩu

**API:** `POST /api/admin/users` · `PUT /api/admin/users/{id}`

---

### SCR-06b-022: Import người dùng từ Excel (Stepper)

**Mô tả:** Quy trình 3 bước nhập hàng loạt tài khoản từ file Excel.

**Actors:** QTHT

**Truy cập từ:** SCR-06b-020 > [📥 Import Excel]

#### Layout

```
┌──────────────────────────────────────────────────┐
│  IMPORT NGƯỜI DÙNG TỪ EXCEL                      │
│  ●─────────────●─────────────○                   │
│  1.Tải mẫu     2.Upload file  3.Xác nhận & Lưu   │
├──────────────────────────────────────────────────┤
│  BƯỚC 2: UPLOAD FILE                             │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  📂 Kéo thả file vào đây hoặc            │    │
│  │     [Chọn file Excel (.xlsx)]            │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ✅ file_users.xlsx (2.3 KB) – 25 bản ghi         │
│  ❌ Dòng 5: Email đã tồn tại (b@edu.vn)           │
│  ❌ Dòng 9: Thiếu trường Họ tên                   │
├──────────────────────────────────────────────────┤
│        [◀ Quay lại]          [Tiếp theo ▶]        │
└──────────────────────────────────────────────────┘
```

**Components:** Stepper 3 bước, dropzone upload, bảng preview + lỗi validation, nút điều hướng bước

**Flow:** B1 Tải mẫu → B2 Upload → validate dữ liệu → xem lỗi → B3 Xác nhận → Lưu → thông báo

**Business rules:**
- Bước 1: cung cấp file mẫu `.xlsx` để download
- Bước 2: chỉ chấp nhận `.xlsx`, max 10MB
- Lỗi validation hiển thị theo dòng; dữ liệu hợp lệ vẫn được lưu (skip dòng lỗi)

**API:** `GET /api/admin/users/template` · `POST /api/admin/users/import` · `POST /api/admin/users/import/save`

---

### SCR-06b-030: Danh sách vai trò LMS

**Mô tả:** Quản lý toàn bộ vai trò (roles) trong hệ thống. QTHT thêm, sửa, xóa vai trò và gán quyền.

**Actors:** QTHT

**Truy cập từ:** Sidebar Admin > Quản lý vai trò

#### Layout

```
┌──────────────────────────────────────────────────┐
│ 🏠 > Quản trị hệ thống > Vai trò                  │
├──────────────────────────────────────────────────┤
│              QUẢN LÝ VAI TRÒ LMS                 │
├──────────────────────────────────────────────────┤
│  [+ Thêm vai trò]                                │
├──────┬───────────────┬───────────────┬────────────┤
│ STT  │ Tên vai trò   │ Mô tả         │ Thao tác   │
├──────┼───────────────┼───────────────┼────────────┤
│  1   │ QTHT          │ Quản trị viên │ ✏️ 🔐 🗑️  │
│  2   │ CBQL          │ Cán bộ QL     │ ✏️ 🔐 🗑️  │
│  3   │ Giảng viên    │ GV dạy lớp    │ ✏️ 🔐 🗑️  │
│  4   │ Học sinh      │ HS học lớp    │ ✏️ 🔐 🗑️  │
├──────┴───────────────┴───────────────┴────────────┤
│ 1–4 / 4 vai trò                [10▼] bản ghi/trang│
└──────────────────────────────────────────────────┘
```
*(icon: ✏️=sửa  🔐=gán quyền  🗑️=xóa)*

**Components:** Toolbar thêm mới, bảng vai trò, actions per row, phân trang

**Flow:** Xem DS vai trò → thêm/sửa (SCR-06b-031) hoặc gán quyền (SCR-06b-032) hoặc xóa (confirm)

**Business rules:**
- Không thể xóa vai trò đang được gán cho người dùng
- Vai trò mặc định hệ thống (QTHT, CBQL, GV, HS) không thể xóa

**API:** `GET /api/admin/roles` · `DELETE /api/admin/roles/{id}`

---

### SCR-06b-031: Form thêm mới / chỉnh sửa vai trò

**Mô tả:** Form tạo mới hoặc cập nhật thông tin vai trò (dùng chung).

**Actors:** QTHT

**Truy cập từ:** SCR-06b-030 > [+ Thêm] hoặc [✏️ Sửa]

#### Layout

```
┌──────────────────────────────────────────────────┐
│  THÊM MỚI VAI TRÒ                   [✕]         │
├──────────────────────────────────────────────────┤
│  Tên vai trò*   [_____________________________]  │
│  Mã vai trò*    [_____________________________]  │
│  Mô tả          [_____________________________]  │
│                 [_____________________________]  │
│                                                  │
│  ⚠ Trường (*) là bắt buộc                        │
│                         [Hủy]    [💾 Lưu]         │
└──────────────────────────────────────────────────┘
```

**Components:** Input text, textarea, validate inline, nút Lưu/Hủy

**Flow:** Nhập thông tin → Lưu → validate → thành công → quay SCR-06b-030

**Business rules:**
- Mã vai trò phải duy nhất, không có ký tự đặc biệt
- Sau khi tạo vai trò, cần gán quyền riêng qua SCR-06b-032

**API:** `POST /api/admin/roles` · `PUT /api/admin/roles/{id}`

---

### SCR-06b-032: Phân quyền chức năng cho vai trò

**Mô tả:** Màn gán/gỡ quyền chức năng cho một vai trò, tổ chức theo nhóm module.

**Actors:** QTHT

**Truy cập từ:** SCR-06b-030 > [🔐 Gán quyền]

#### Layout

```
┌──────────────────────────────────────────────────┐
│  PHÂN QUYỀN VAI TRÒ: Giảng viên       [✕]       │
├──────────────────────────────────────────────────┤
│  MODULE HỌC TẬP          MODULE BÁO CÁO          │
│  ☑ Xem danh sách lớp     ☑ Xem báo cáo lớp      │
│  ☑ Quản lý nội dung      ☐ Xuất Excel/PDF        │
│  ☐ Xóa lớp học           ☐ Báo cáo toàn trường   │
│                                                   │
│  MODULE NGÂN HÀNG CÂU HỎI  MODULE NGƯỜI DÙNG    │
│  ☑ Xem câu hỏi           ☐ Quản lý ND            │
│  ☑ Tạo câu hỏi           ☐ Phân quyền            │
│  ☐ Xóa câu hỏi           ☐ Xuất báo cáo ND       │
├──────────────────────────────────────────────────┤
│  [Chọn tất cả] [Bỏ chọn tất cả]                  │
│                         [Hủy]    [💾 Lưu]         │
└──────────────────────────────────────────────────┘
```

**Components:** Checkbox grouped theo module, nút chọn/bỏ chọn hàng loạt, nút Lưu/Hủy

**Flow:** Chọn vai trò → hiển thị ma trận quyền → tick/untick → Lưu → cập nhật ngay

**Business rules:**
- Thay đổi quyền có hiệu lực ngay với phiên đăng nhập tiếp theo của người dùng có vai trò đó
- Phải chọn ít nhất 1 quyền mới cho phép Lưu

**API:** `GET /api/admin/roles/{id}/permissions` · `PUT /api/admin/roles/{id}/permissions`
