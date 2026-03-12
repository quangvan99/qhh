---
title: "WF-10: Quản trị hệ thống"
cluster: "System Administration"
updated: 2026-03-11
---

# WF-10: Quản trị hệ thống

> **Actor chính:** Quản trị hệ thống (QTHT)
> **Tiền điều kiện chung:** Đã đăng nhập thành công; được cấp quyền tương ứng với từng chức năng.

---

## Phần A: Quản lý người dùng

---

### SCR-10-001: Danh sách người dùng

#### 1. Mã màn hình
`SCR-10-001`

#### 2. Mô tả
Màn hình trung tâm của phân hệ Quản lý người dùng. Hiển thị toàn bộ danh sách tài khoản trên hệ thống; hỗ trợ tìm kiếm theo từ khóa và đơn vị, phân trang, chọn số bản ghi/trang, bulk actions (đổi mật khẩu hàng loạt, khóa/mở khóa hàng loạt qua Excel), xuất báo cáo, thêm mới (form / import Excel).

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║  HEADER: Logo | Tên hệ thống                              [🔔] [Avatar - QTHT]  [Đăng xuất] ║
╠══════════════╦═══════════════════════════════════════════════════════════════════════════════╣
║              ║  QUẢN TRỊ HỆ THỐNG > Quản lý người dùng                                      ║
║  SIDEBAR     ╠═══════════════════════════════════════════════════════════════════════════════╣
║  ──────────  ║                                                                               ║
║  📋 Quản lý  ║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║     người    ║  │  DANH SÁCH NGƯỜI DÙNG                                                   │  ║
║     dùng  ◀  ║  ├────────────────────────────────────────┬────────────────────────────────┤  ║
║  👤 Quản lý  ║  │ 🔍 Từ khóa: [_____________________|🔍] │ Đơn vị: [▼ Chọn đơn vị______] │  ║
║     vai trò  ║  │                            [Tìm kiếm]  │                  [Tìm kiếm]    │  ║
║  🏢 Cơ cấu   ║  ├────────────────────────────────────────┴────────────────────────────────┤  ║
║     tổ chức  ║  │  Hiển thị: [10 ▼] bản ghi/trang                 Tổng: 245 người dùng   │  ║
║              ║  │                                                                         │  ║
║              ║  │  [+ Thêm mới]  [📥 Import Excel]  [📤 Xuất báo cáo]                    │  ║
║              ║  │  [🔒 Khóa/Mở khóa (Excel)]  [🔑 Đổi MK hàng loạt (Excel)]             │  ║
║              ║  ├─────┬────────────┬──────────────┬────────────┬──────────┬─────┬────────┤  ║
║              ║  │ [✓] │ Tên đăng  │ Họ và tên    │ Email      │ Đơn vị   │Trạng│ Thao   │  ║
║              ║  │     │ nhập      │              │            │          │thái │ tác    │  ║
║              ║  ├─────┼────────────┼──────────────┼────────────┼──────────┼─────┼────────┤  ║
║              ║  │ [✓] │ nguyenvana │ Nguyễn Văn A │ a@edu.vn   │ Phòng GD │ 🟢  │[✏][🗑]│  ║
║              ║  │     │           │              │            │          │     │[👤][🔑]│  ║
║              ║  ├─────┼────────────┼──────────────┼────────────┼──────────┼─────┼────────┤  ║
║              ║  │ [ ] │ tranthib   │ Trần Thị B   │ b@edu.vn   │ TH Lê Lợi│ 🟢  │[✏][🗑]│  ║
║              ║  │     │           │              │            │          │     │[👤][🔑]│  ║
║              ║  ├─────┼────────────┼──────────────┼────────────┼──────────┼─────┼────────┤  ║
║              ║  │ [ ] │ levanc     │ Lê Văn C     │ c@edu.vn   │ THCS NT  │ 🔴  │[✏][🗑]│  ║
║              ║  │     │           │              │            │          │     │[👤][🔑]│  ║
║              ║  ├─────┼────────────┼──────────────┼────────────┼──────────┼─────┼────────┤  ║
║              ║  │ [ ] │ phamthid   │ Phạm Thị D   │ d@edu.vn   │ THPT HCM │ 🟢  │[✏][🗑]│  ║
║              ║  │     │           │              │            │          │     │[👤][🔑]│  ║
║              ║  ├─────┼────────────┼──────────────┼────────────┼──────────┼─────┼────────┤  ║
║              ║  │ ...  (thêm các hàng)                                                   │  ║
║              ║  ├─────────────────────────────────────────────────────────────────────────┤  ║
║              ║  │  ← Trước   [1] [2] [3] ... [25]   Sau →        Trang 1 / 25            │  ║
║              ║  └─────────────────────────────────────────────────────────────────────────┘  ║
║              ║                                                                               ║
╚══════════════╩═══════════════════════════════════════════════════════════════════════════════╝

Chú thích icon Thao tác (mỗi hàng):
  [✏]  = Chỉnh sửa thông tin
  [🗑]  = Xóa người dùng
  [👤]  = Gán / Xóa vai trò
  [🔑]  = Đổi mật khẩu (đơn lẻ)

Trạng thái:  🟢 = Hoạt động   🔴 = Đã khóa
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | SearchKeyword | Input + Button | Tìm kiếm theo tên đăng nhập / họ tên / email |
| 2 | SearchUnit | Dropdown + Button | Tìm kiếm theo đơn vị (tree select) |
| 3 | PageSizeSelector | Dropdown | Chọn 10 / 20 / 50 / 100 bản ghi/trang |
| 4 | TotalCounter | Label | Hiển thị tổng số bản ghi |
| 5 | BtnAddNew | Button (Primary) | Mở SCR-10-002 (form thêm mới) |
| 6 | BtnImportExcel | Button | Mở SCR-10-003 (import Excel) |
| 7 | BtnExportReport | Button | Xuất báo cáo Excel danh sách ND |
| 8 | BtnBulkLockExcel | Button | Mở SCR-10-007 (khóa/mở khóa hàng loạt qua Excel) |
| 9 | BtnBulkChangePwdExcel | Button | Mở SCR-10-006 (đổi MK hàng loạt qua Excel) |
| 10 | SelectAllCheckbox | Checkbox (Header) | Chọn/bỏ chọn toàn bộ hàng hiện tại |
| 11 | RowCheckbox | Checkbox (Row) | Chọn từng người dùng |
| 12 | DataTable | Table | Cột: STT, Tên đăng nhập, Họ tên, Email, Đơn vị, Trạng thái, Thao tác |
| 13 | StatusBadge | Badge | Hoạt động (xanh) / Đã khóa (đỏ) |
| 14 | BtnEdit | Icon Button | Mở SCR-10-004 (chỉnh sửa) |
| 15 | BtnDelete | Icon Button | Hiện Dialog SCR-10-DLG-001 (xác nhận xóa) |
| 16 | BtnAssignRole | Icon Button | Mở SCR-10-005 (gán vai trò) |
| 17 | BtnChangePwd | Icon Button | Mở SCR-10-005b (đổi mật khẩu đơn lẻ) |
| 18 | Pagination | Component | Phân trang: nút ← Trước / Sau →, số trang |

#### 6. Luồng điều hướng

```
SCR-10-001 (Danh sách)
  ├── [+ Thêm mới]           → SCR-10-002 (Form thêm mới)
  ├── [📥 Import Excel]       → SCR-10-003 (Import Excel người dùng)
  ├── [📤 Xuất báo cáo]       → Trigger download file Excel
  ├── [🔒 Khóa/Mở khóa Excel]→ SCR-10-007 (Bulk khóa/mở khóa Excel)
  ├── [🔑 Đổi MK Excel]       → SCR-10-006 (Bulk đổi MK Excel)
  ├── [✏] (row)               → SCR-10-004 (Chỉnh sửa)
  ├── [🗑] (row)               → Dialog SCR-10-DLG-001 (Xác nhận xóa)
  ├── [👤] (row)               → SCR-10-005 (Gán/xóa vai trò)
  └── [🔑] (row)               → SCR-10-005b (Đổi MK đơn lẻ)
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Từ khóa tìm kiếm khớp với tên đăng nhập, họ tên, email (tìm kiếm không phân biệt hoa thường). |
| BR-002 | Dropdown "Đơn vị" hiển thị cây đơn vị; chọn một node sẽ bao gồm tất cả đơn vị con. |
| BR-003 | Mặc định hiển thị 10 bản ghi/trang; có thể chọn 20, 50, 100. |
| BR-004 | Checkbox "Chọn tất cả" chỉ chọn các bản ghi trên trang hiện tại. |
| BR-005 | Nút [📤 Xuất báo cáo] xuất toàn bộ kết quả sau lọc (không chỉ trang hiện tại). |
| BR-006 | Người dùng đang đăng nhập (chính mình) không thể tự xóa hoặc khóa tài khoản của mình. |
| BR-007 | Trạng thái "Đã khóa" hiển thị icon 🔴; khi hover hiện tooltip "Tài khoản bị khóa". |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/users?keyword=&unit_id=&page=1&size=10` | Lấy danh sách người dùng có phân trang + lọc |
| GET | `/api/v1/admin/users/export?keyword=&unit_id=` | Xuất báo cáo Excel |
| GET | `/api/v1/admin/units/tree` | Lấy cây đơn vị cho dropdown lọc |

---

### SCR-10-002: Thêm mới tài khoản người dùng

#### 1. Mã màn hình
`SCR-10-002`

#### 2. Mô tả
Form thêm mới tài khoản người dùng. QTHT nhập đầy đủ thông tin bắt buộc; hệ thống kiểm tra hợp lệ và lưu vào CSDL.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                        [Avatar] [X] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Quản lý người dùng > Thêm mới tài khoản                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  THÔNG TIN TÀI KHOẢN                                                 │   ║
║  ├──────────────────────────────┬───────────────────────────────────────┤   ║
║  │  Tên đăng nhập *             │  Họ và tên *                          │   ║
║  │  [________________________]  │  [____________________________]       │   ║
║  ├──────────────────────────────┼───────────────────────────────────────┤   ║
║  │  Email *                     │  Số điện thoại                        │   ║
║  │  [________________________]  │  [____________________________]       │   ║
║  ├──────────────────────────────┼───────────────────────────────────────┤   ║
║  │  Mật khẩu *                  │  Xác nhận mật khẩu *                  │   ║
║  │  [••••••••••••••••••••]  👁  │  [••••••••••••••••••••]  👁           │   ║
║  ├──────────────────────────────┼───────────────────────────────────────┤   ║
║  │  Đơn vị *                    │  Vai trò                              │   ║
║  │  [▼ Chọn đơn vị          ]   │  [▼ Chọn vai trò          ]          │   ║
║  ├──────────────────────────────┼───────────────────────────────────────┤   ║
║  │  Trạng thái *                │                                       │   ║
║  │  (●) Hoạt động  ( ) Khóa     │                                       │   ║
║  └──────────────────────────────┴───────────────────────────────────────┘   ║
║                                                                              ║
║  ⚠ Lưu ý: Các trường có dấu (*) là bắt buộc.                                ║
║                                                                              ║
║                              [  Hủy  ]  [  💾 Lưu  ]                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

  Inline validation (ví dụ khi để trống tên đăng nhập):
  ┌──────────────────────────────┐
  │  Tên đăng nhập *             │
  │  [________________________]  │
  │  ⛔ Vui lòng nhập tên đăng nhập│
  └──────────────────────────────┘
```

#### 5. Danh sách Components

| # | Component | Loại | Bắt buộc |
|---|-----------|------|----------|
| 1 | TenDangNhap | Text Input | ✅ |
| 2 | HoVaTen | Text Input | ✅ |
| 3 | Email | Email Input | ✅ |
| 4 | SoDienThoai | Text Input | ❌ |
| 5 | MatKhau | Password Input + Toggle | ✅ |
| 6 | XacNhanMatKhau | Password Input + Toggle | ✅ |
| 7 | DonVi | TreeSelect Dropdown | ✅ |
| 8 | VaiTro | Multi-select Dropdown | ❌ |
| 9 | TrangThai | Radio Group | ✅ |
| 10 | BtnHuy | Button | — |
| 11 | BtnLuu | Button (Primary) | — |
| 12 | InlineError | Validation Message | — |

#### 6. Luồng điều hướng

```
SCR-10-002
  ├── [Hủy]           → SCR-10-001 (Danh sách)
  ├── [💾 Lưu] + HỢP LỆ  → SCR-10-001 + Toast "Thêm tài khoản thành công"
  ├── [💾 Lưu] + THIẾU    → Inline error highlight trường bắt buộc
  └── [💾 Lưu] + SAI      → Inline error thông báo không hợp lệ
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Tên đăng nhập: bắt buộc, 4–50 ký tự, chỉ chứa chữ thường/số/dấu gạch dưới, không trùng với tên đã có. |
| BR-002 | Email: bắt buộc, đúng định dạng email, không trùng. |
| BR-003 | Mật khẩu: bắt buộc, tối thiểu 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt. |
| BR-004 | Xác nhận mật khẩu phải khớp với Mật khẩu. |
| BR-005 | Đơn vị: bắt buộc chọn từ cây đơn vị. |
| BR-006 | Trạng thái mặc định là "Hoạt động". |
| BR-007 | Khi lưu thành công, hệ thống hiển thị Toast thông báo và quay về SCR-10-001. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/v1/admin/users` | Tạo mới tài khoản người dùng |
| GET | `/api/v1/admin/units/tree` | Lấy cây đơn vị cho dropdown |
| GET | `/api/v1/admin/roles` | Lấy danh sách vai trò |

---

### SCR-10-003: Import tài khoản từ file Excel

#### 1. Mã màn hình
`SCR-10-003`

#### 2. Mô tả
Cho phép QTHT thêm mới hàng loạt tài khoản người dùng bằng cách tải xuống file biểu mẫu, điền thông tin, sau đó tải lên hệ thống để xác thực và lưu.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Quản lý người dùng > Thêm mới từ file Excel                                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 1: TẢI BIỂU MẪU                                               │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  Tải file biểu mẫu Excel về thiết bị, điền thông tin người dùng     │   ║
║  │  theo đúng cấu trúc cột được quy định.                               │   ║
║  │                                                                      │   ║
║  │  Cấu trúc file: TenDangNhap | HoTen | Email | SDT | DonVi | MK      │   ║
║  │                                                                      │   ║
║  │                    [📥 Tải biểu mẫu về máy]                          │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 2: TẢI FILE LÊN HỆ THỐNG                                      │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │                                                                      │   ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │   ║
║  │  │                                                                │  │   ║
║  │  │           📂  Kéo thả file vào đây hoặc                        │  │   ║
║  │  │                   [Chọn file Excel]                            │  │   ║
║  │  │        Hỗ trợ: .xlsx, .xls  |  Tối đa: 5MB                    │  │   ║
║  │  │                                                                │  │   ║
║  │  └────────────────────────────────────────────────────────────────┘  │   ║
║  │                                                                      │   ║
║  │  File đã chọn: danh_sach_NguoiDung.xlsx  [✕ Xóa]                    │   ║
║  │                         [📤 Tải lên & Xác thực]                      │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 3: KẾT QUẢ XÁC THỰC                          (hiện sau upload)│   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  ✅ Hợp lệ: 48 bản ghi                                               │   ║
║  │  ❌ Lỗi:    3 bản ghi                                                │   ║
║  │                                                                      │   ║
║  │  ┌──────┬────────────┬────────────────────────────────────────────┐ │   ║
║  │  │ Hàng │ Tên ĐN     │ Lỗi                                        │ │   ║
║  │  ├──────┼────────────┼────────────────────────────────────────────┤ │   ║
║  │  │  5   │ nguyenvana │ Email trùng trong hệ thống                 │ │   ║
║  │  │  12  │ (trống)    │ Tên đăng nhập không được để trống          │ │   ║
║  │  │  23  │ levanc     │ Định dạng email không hợp lệ               │ │   ║
║  │  └──────┴────────────┴────────────────────────────────────────────┘ │   ║
║  │                                                                      │   ║
║  │  ⚠ Chỉ các bản ghi hợp lệ được lưu. Sửa lỗi và tải lại nếu cần.    │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║                    [  Hủy  ]            [  💾 Lưu (48 bản ghi hợp lệ)  ]    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | BtnDownloadTemplate | Button | Tải file biểu mẫu .xlsx về máy |
| 2 | DropZone | File Upload Area | Kéo thả hoặc click chọn file |
| 3 | BtnChooseFile | Button | Mở dialog chọn file từ máy tính |
| 4 | FileInfo | Label + Remove | Hiển thị tên file đã chọn + nút xóa |
| 5 | BtnUploadValidate | Button | Tải lên và chạy xác thực dữ liệu |
| 6 | ValidationSummary | Alert | Tổng số hợp lệ / lỗi |
| 7 | ErrorTable | Table | Bảng chi tiết các hàng lỗi (Hàng, Tên ĐN, Mô tả lỗi) |
| 8 | BtnHuy | Button | Hủy, quay về SCR-10-001 |
| 9 | BtnLuu | Button (Primary) | Lưu các bản ghi hợp lệ |

#### 6. Luồng điều hướng

```
SCR-10-003
  ├── [📥 Tải biểu mẫu]     → Trigger download file template
  ├── [📤 Tải lên & Xác thực]→ Gọi API upload → hiển thị kết quả xác thực
  ├── [Hủy]                 → SCR-10-001
  └── [💾 Lưu]              → POST API lưu → SCR-10-001 + Toast thành công
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Chỉ chấp nhận file .xlsx / .xls, tối đa 5MB. |
| BR-002 | File phải có đúng cấu trúc cột theo biểu mẫu; nếu sai cấu trúc báo lỗi toàn file. |
| BR-003 | Mỗi hàng được xác thực riêng; hàng lỗi được liệt kê rõ vị trí và lý do. |
| BR-004 | Khi nhấn [Lưu], chỉ lưu các hàng hợp lệ; hàng lỗi bị bỏ qua và có thể sửa sau. |
| BR-005 | Tên đăng nhập và Email không được trùng với dữ liệu đã có trong hệ thống. |
| BR-006 | Số lượng bản ghi tối đa mỗi lần import: 500 bản ghi. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/users/import/template` | Tải file biểu mẫu |
| POST | `/api/v1/admin/users/import/validate` | Upload + xác thực (multipart/form-data) |
| POST | `/api/v1/admin/users/import/save` | Lưu dữ liệu hợp lệ |

---

### SCR-10-004: Chỉnh sửa thông tin người dùng

#### 1. Mã màn hình
`SCR-10-004`

#### 2. Mô tả
Form chỉnh sửa thông tin tài khoản người dùng đã có. Dữ liệu hiện tại được load sẵn vào form. QTHT thay đổi và nhấn Lưu.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Quản lý người dùng > Chỉnh sửa: Nguyễn Văn A (nguyenvana)                  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  THÔNG TIN TÀI KHOẢN                                                 │   ║
║  ├──────────────────────────────┬───────────────────────────────────────┤   ║
║  │  Tên đăng nhập *             │  Họ và tên *                          │   ║
║  │  [nguyenvana_________] 🔒    │  [Nguyễn Văn A_______________]        │   ║
║  │  (Không được chỉnh sửa)      │                                       │   ║
║  ├──────────────────────────────┼───────────────────────────────────────┤   ║
║  │  Email *                     │  Số điện thoại                        │   ║
║  │  [a@edu.vn______________]    │  [0912345678_______________]          │   ║
║  ├──────────────────────────────┼───────────────────────────────────────┤   ║
║  │  Đơn vị *                    │  Trạng thái *                         │   ║
║  │  [▼ Phòng GD - Quận 1   ]    │  (●) Hoạt động  ( ) Khóa             │   ║
║  └──────────────────────────────┴───────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  VAI TRÒ HIỆN TẠI                                                    │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  [🏷 Giáo viên  ✕]  [🏷 CBQL  ✕]                  [+ Thêm vai trò]  │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║                              [  Hủy  ]  [  💾 Lưu  ]                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### 5. Danh sách Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | TenDangNhap | Text Input (disabled) | Readonly, không chỉnh sửa được |
| 2 | HoVaTen | Text Input | Có thể chỉnh sửa |
| 3 | Email | Email Input | Có thể chỉnh sửa, kiểm tra trùng |
| 4 | SoDienThoai | Text Input | Tùy chọn |
| 5 | DonVi | TreeSelect Dropdown | Bắt buộc |
| 6 | TrangThai | Radio Group | Hoạt động / Khóa |
| 7 | RoleTags | Tag List + Remove | Danh sách vai trò hiện có, có thể xóa từng cái |
| 8 | BtnAddRole | Button | Mở panel chọn thêm vai trò |
| 9 | BtnHuy | Button | Quay về SCR-10-001 |
| 10 | BtnLuu | Button (Primary) | Lưu thay đổi |

#### 6. Luồng điều hướng

```
SCR-10-004
  ├── [✕ vai trò]       → Xóa vai trò khỏi người dùng (API call ngay hoặc chờ Lưu)
  ├── [+ Thêm vai trò]  → Mở modal chọn vai trò → thêm tag
  ├── [Hủy]             → SCR-10-001
  ├── [💾 Lưu] + HỢP LỆ → PUT API → SCR-10-001 + Toast "Cập nhật thành công"
  ├── [💾 Lưu] + THIẾU  → Inline error trường bắt buộc
  └── [💾 Lưu] + SAI    → Inline error thông báo không hợp lệ
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Tên đăng nhập không thể chỉnh sửa sau khi tạo. |
| BR-002 | Email mới không được trùng với tài khoản khác. |
| BR-003 | Khi xóa vai trò [✕], hiển thị xác nhận inline trước khi áp dụng. |
| BR-004 | Phải còn ít nhất 1 đơn vị; không được xóa đơn vị khi chưa chọn đơn vị mới. |
| BR-005 | Nếu QTHT tự chỉnh sửa tài khoản mình, không được chuyển trạng thái sang Khóa. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/users/{id}` | Lấy thông tin người dùng |
| PUT | `/api/v1/admin/users/{id}` | Cập nhật thông tin |
| GET | `/api/v1/admin/roles` | Lấy danh sách vai trò |

---

### SCR-10-005: Gán / Xóa vai trò cho người dùng

#### 1. Mã màn hình
`SCR-10-005`

#### 2. Mô tả
Màn hình/Dialog chuyên dụng để QTHT quản lý vai trò của một người dùng: xem vai trò hiện có, gán thêm vai trò mới, xóa vai trò đã gán.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔═════════════════════════════════════════════════════════════════════════╗
║  GÁN VAI TRÒ: Nguyễn Văn A (nguyenvana)                           [X] ║
╠═════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  ┌──────────────────────────────────────────────────────────────────┐  ║
║  │  VAI TRÒ HIỆN TẠI                                                │  ║
║  │  ───────────────────────────────────────────────────────────── │  ║
║  │  ┌──────────────────────┬─────────────────────┬──────────────┐  │  ║
║  │  │ Tên vai trò          │ Mô tả               │ Thao tác     │  │  ║
║  │  ├──────────────────────┼─────────────────────┼──────────────┤  │  ║
║  │  │ Giáo viên            │ Giảng dạy lớp học   │ [🗑 Gỡ]      │  │  ║
║  │  ├──────────────────────┼─────────────────────┼──────────────┤  │  ║
║  │  │ CBQL                 │ Cán bộ quản lý      │ [🗑 Gỡ]      │  │  ║
║  │  └──────────────────────┴─────────────────────┴──────────────┘  │  ║
║  └──────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║  ┌──────────────────────────────────────────────────────────────────┐  ║
║  │  GÁN THÊM VAI TRÒ                                                │  ║
║  │  ───────────────────────────────────────────────────────────── │  ║
║  │  Chọn vai trò: [▼ -- Chọn vai trò --                         ]  │  ║
║  │                                                                  │  ║
║  │  Danh sách vai trò chưa gán:                                     │  ║
║  │  [ ] Học sinh                                                    │  ║
║  │  [ ] Phụ huynh                                                   │  ║
║  │  [ ] Kế toán                                                     │  ║
║  │                              [+ Gán vai trò đã chọn]            │  ║
║  └──────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║                                        [  Đóng  ]  [  💾 Lưu  ]        ║
╚═════════════════════════════════════════════════════════════════════════╝

  Khi nhấn [🗑 Gỡ] → hiện confirm inline:
  ┌────────────────────────────────────────────────────────────┐
  │  ⚠ Xác nhận gỡ vai trò "Giáo viên" khỏi "Nguyễn Văn A"?   │
  │                              [Hủy]  [Xác nhận gỡ]         │
  └────────────────────────────────────────────────────────────┘
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | CurrentRolesTable | Table | Bảng vai trò hiện có: tên, mô tả, nút Gỡ |
| 2 | BtnRemoveRole | Icon Button | Gỡ vai trò (kèm confirm inline) |
| 3 | RoleSelector | Dropdown / Checkbox List | Chọn vai trò từ danh sách chưa gán |
| 4 | BtnAssign | Button | Gán vai trò đã chọn |
| 5 | InlineConfirm | Confirm Panel | Xác nhận gỡ vai trò |
| 6 | BtnDong | Button | Đóng modal |
| 7 | BtnLuu | Button (Primary) | Lưu thay đổi |

#### 6. Luồng điều hướng

```
SCR-10-005 (Modal/Page)
  ├── [🗑 Gỡ]        → Inline confirm → [Xác nhận] → API xóa vai trò
  ├── [+ Gán]        → API gán vai trò → cập nhật CurrentRolesTable
  ├── [Đóng]         → Đóng modal, quay SCR-10-001
  └── [💾 Lưu]       → PUT API → đóng modal + Toast thành công
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Không thể gán trùng vai trò đã có. |
| BR-002 | Phải chọn ít nhất 1 vai trò trong dropdown trước khi nhấn [+ Gán]. |
| BR-003 | Khi gỡ vai trò, hiển thị confirm inline; không dùng dialog popup riêng. |
| BR-004 | Sau khi gỡ vai trò cuối cùng, hiển thị cảnh báo "Người dùng chưa có vai trò nào". |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/users/{id}/roles` | Lấy vai trò hiện có |
| POST | `/api/v1/admin/users/{id}/roles` | Gán vai trò |
| DELETE | `/api/v1/admin/users/{id}/roles/{roleId}` | Gỡ vai trò |

---

### SCR-10-005b: Đổi mật khẩu người dùng (đơn lẻ)

#### 1. Mã màn hình
`SCR-10-005b`

#### 2. Mô tả
Dialog/Form cho phép QTHT đổi mật khẩu của một tài khoản cụ thể. Không cần nhập mật khẩu cũ (quyền admin).

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════╗
║  ĐỔI MẬT KHẨU: Nguyễn Văn A (nguyenvana)              [X]  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Mật khẩu mới *                                              ║
║  [•••••••••••••••••••••••••••••••]  👁                       ║
║                                                              ║
║  Xác nhận mật khẩu mới *                                     ║
║  [•••••••••••••••••••••••••••••••]  👁                       ║
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ ℹ Yêu cầu mật khẩu:                                  │   ║
║  │  ✅ Tối thiểu 8 ký tự                                │   ║
║  │  ✅ Có chữ hoa và chữ thường                         │   ║
║  │  ✅ Có ít nhất 1 chữ số                              │   ║
║  │  ✅ Có ít nhất 1 ký tự đặc biệt (!@#$...)            │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║               [  Hủy  ]      [  🔑 Đổi mật khẩu  ]          ║
╚══════════════════════════════════════════════════════════════╝
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | MatKhauMoi | Password Input + Toggle | Mật khẩu mới |
| 2 | XacNhanMatKhauMoi | Password Input + Toggle | Xác nhận lại |
| 3 | PasswordStrengthHints | Info Box | Gợi ý yêu cầu mật khẩu |
| 4 | BtnHuy | Button | Hủy, đóng dialog |
| 5 | BtnDoiMK | Button (Primary) | Thực hiện đổi mật khẩu |

#### 6. Luồng điều hướng

```
SCR-10-005b (Dialog)
  ├── [Hủy]               → Đóng dialog, ở lại SCR-10-001
  ├── [🔑 Đổi MK] + HỢP LỆ → PATCH API → đóng dialog + Toast "Đổi MK thành công"
  ├── [🔑 Đổi MK] + MK KHÔNG KHỚP → Lỗi inline "Xác nhận MK không khớp"
  └── [🔑 Đổi MK] + YẾU    → Lỗi inline danh sách yêu cầu chưa đạt
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Mật khẩu mới: tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt. |
| BR-002 | Xác nhận mật khẩu phải khớp chính xác với mật khẩu mới. |
| BR-003 | QTHT không cần nhập mật khẩu cũ của người dùng đó. |
| BR-004 | Sau khi đổi thành công, gửi thông báo qua email (nếu cấu hình). |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| PATCH | `/api/v1/admin/users/{id}/password` | Đổi mật khẩu người dùng |

---

### SCR-10-006: Đổi mật khẩu hàng loạt từ file Excel

#### 1. Mã màn hình
`SCR-10-006`

#### 2. Mô tả
Cho phép QTHT đổi mật khẩu hàng loạt cho nhiều tài khoản thông qua file Excel. Quy trình tương tự import: tải biểu mẫu → điền → upload → xác thực → lưu.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Quản lý người dùng > Đổi mật khẩu hàng loạt (Excel)                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 1: TẢI BIỂU MẪU ĐỔI MẬT KHẨU                                 │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  Cấu trúc file: TenDangNhap | MatKhauMoi | XacNhanMatKhau            │   ║
║  │                                                                      │   ║
║  │                 [📥 Tải biểu mẫu đổi mật khẩu]                       │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 2: TẢI FILE LÊN                                                │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │   ║
║  │  │         📂  Kéo thả file hoặc  [Chọn file Excel]               │  │   ║
║  │  │              Hỗ trợ: .xlsx, .xls  |  Tối đa: 5MB               │  │   ║
║  │  └────────────────────────────────────────────────────────────────┘  │   ║
║  │  File: doi_mat_khau.xlsx  [✕]          [📤 Tải lên & Xác thực]      │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 3: KẾT QUẢ XÁC THỰC                                           │   ║
║  │  ✅ Hợp lệ: 35 bản ghi   ❌ Lỗi: 2 bản ghi                          │   ║
║  │  ┌──────┬─────────────┬──────────────────────────────────────────┐  │   ║
║  │  │ Hàng │ Tên ĐN      │ Lỗi                                      │  │   ║
║  │  ├──────┼─────────────┼──────────────────────────────────────────┤  │   ║
║  │  │   3  │ nguyenvana  │ Mật khẩu không đủ mạnh                   │  │   ║
║  │  │   8  │ levanx      │ Tên đăng nhập không tồn tại              │  │   ║
║  │  └──────┴─────────────┴──────────────────────────────────────────┘  │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║                    [  Hủy  ]            [  💾 Lưu (35 bản ghi hợp lệ)  ]    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### 5. Danh sách Components
Tương tự SCR-10-003 (BtnDownloadTemplate, DropZone, BtnUploadValidate, ValidationSummary, ErrorTable, BtnHuy, BtnLuu).

#### 6. Luồng điều hướng
```
SCR-10-006
  ├── [📥 Tải biểu mẫu]      → Download template
  ├── [📤 Tải lên & Xác thực]→ API validate → hiển thị kết quả
  ├── [Hủy]                  → SCR-10-001
  └── [💾 Lưu]               → API save → SCR-10-001 + Toast
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Tên đăng nhập trong file phải tồn tại trong hệ thống. |
| BR-002 | Mật khẩu mới phải thỏa mãn chính sách mật khẩu. |
| BR-003 | Hàng lỗi bị bỏ qua; chỉ lưu hàng hợp lệ. |
| BR-004 | Tối đa 500 bản ghi mỗi lần import. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/users/bulk-password/template` | Tải biểu mẫu |
| POST | `/api/v1/admin/users/bulk-password/validate` | Upload + xác thực |
| POST | `/api/v1/admin/users/bulk-password/save` | Lưu |

---

### SCR-10-007: Khóa / Mở khóa tài khoản hàng loạt (Excel)

#### 1. Mã màn hình
`SCR-10-007`

#### 2. Mô tả
Cho phép QTHT khóa hoặc mở khóa hàng loạt tài khoản thông qua file Excel. Quy trình tương tự import.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Quản lý người dùng > Khóa / Mở khóa hàng loạt (Excel)                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 1: TẢI BIỂU MẪU KHÓA/MỞ KHÓA                                  │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  Cấu trúc file: TenDangNhap | TrangThai (KHOA / MO_KHOA)             │   ║
║  │                                                                      │   ║
║  │              [📥 Tải biểu mẫu khóa/mở khóa]                          │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 2: TẢI FILE LÊN                                                │   ║
║  │  ─────────────────────────────────────────────────────────────────  │   ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │   ║
║  │  │         📂  Kéo thả file hoặc  [Chọn file Excel]               │  │   ║
║  │  │              Hỗ trợ: .xlsx, .xls  |  Tối đa: 5MB               │  │   ║
║  │  └────────────────────────────────────────────────────────────────┘  │   ║
║  │  File: khoa_mo_khoa.xlsx  [✕]          [📤 Tải lên & Xác thực]      │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  BƯỚC 3: KẾT QUẢ XÁC THỰC                                           │   ║
║  │  ✅ Hợp lệ: 20 bản ghi   ❌ Lỗi: 1 bản ghi                          │   ║
║  │                                                                      │   ║
║  │  Thống kê thay đổi:                                                  │   ║
║  │  🔒 Sẽ KHÓA: 15 tài khoản                                           │   ║
║  │  🔓 Sẽ MỞ KHÓA: 5 tài khoản                                         │   ║
║  │                                                                      │   ║
║  │  ┌──────┬─────────────┬──────────────────────────────────────────┐  │   ║
║  │  │ Hàng │ Tên ĐN      │ Lỗi                                      │  │   ║
║  │  ├──────┼─────────────┼──────────────────────────────────────────┤  │   ║
║  │  │   7  │ admin_main  │ Không thể khóa tài khoản quản trị chính  │  │   ║
║  │  └──────┴─────────────┴──────────────────────────────────────────┘  │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║                    [  Hủy  ]            [  💾 Lưu (20 bản ghi hợp lệ)  ]    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### 5. Danh sách Components
Tương tự SCR-10-003 (BtnDownloadTemplate, DropZone, BtnUploadValidate, ValidationSummary với thống kê KHÓA/MỞ KHÓA, ErrorTable, BtnHuy, BtnLuu).

#### 6. Luồng điều hướng
```
SCR-10-007
  ├── [📥 Tải biểu mẫu]      → Download template
  ├── [📤 Tải lên & Xác thực]→ API validate → kết quả + thống kê
  ├── [Hủy]                  → SCR-10-001
  └── [💾 Lưu]               → API save → SCR-10-001 + Toast
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Cột TrangThai chỉ chấp nhận giá trị "KHOA" hoặc "MO_KHOA" (không phân biệt hoa thường). |
| BR-002 | Không thể khóa tài khoản đang đăng nhập thực hiện thao tác. |
| BR-003 | Không thể khóa tài khoản quản trị chính (super admin). |
| BR-004 | Tên đăng nhập phải tồn tại trong hệ thống. |
| BR-005 | Hiển thị rõ thống kê: bao nhiêu sẽ khóa, bao nhiêu sẽ mở khóa để QTHT xem trước. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/users/bulk-lock/template` | Tải biểu mẫu |
| POST | `/api/v1/admin/users/bulk-lock/validate` | Upload + xác thực |
| POST | `/api/v1/admin/users/bulk-lock/save` | Lưu |

---

### SCR-10-DLG-001: Dialog xác nhận xóa người dùng

#### 1. Mã màn hình
`SCR-10-DLG-001`

#### 2. Mô tả
Dialog popup xác nhận trước khi xóa vĩnh viễn một tài khoản người dùng.

#### 4. Layout ASCII Wireframe

```
        ┌────────────────────────────────────────────────────────┐
        │  ⚠ XÁC NHẬN XÓA NGƯỜI DÙNG                        [X] │
        ├────────────────────────────────────────────────────────┤
        │                                                        │
        │  Bạn có chắc chắn muốn xóa tài khoản:                 │
        │                                                        │
        │  👤 Nguyễn Văn A (nguyenvana)                          │
        │                                                        │
        │  ⛔ Hành động này không thể hoàn tác. Toàn bộ dữ liệu  │
        │     liên quan đến tài khoản này sẽ bị xóa vĩnh viễn.  │
        │                                                        │
        │                    [  Hủy  ]   [🗑 Xóa]                │
        └────────────────────────────────────────────────────────┘
```

#### 7. Business Rules

| # | Quy tắc |
|---|---------|
| BR-001 | Hiển thị tên + tên đăng nhập người dùng cần xóa để QTHT xác nhận đúng đối tượng. |
| BR-002 | Nhấn [Hủy] hoặc [X]: đóng dialog, không có thay đổi. |
| BR-003 | Nhấn [🗑 Xóa]: gọi API DELETE → đóng dialog → Toast "Xóa người dùng thành công" → reload danh sách. |
| BR-004 | Không thể xóa tài khoản đang đăng nhập. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| DELETE | `/api/v1/admin/users/{id}` | Xóa tài khoản người dùng |

---

## Phần B: Quản lý vai trò & quyền

---

### SCR-10-010: Danh sách vai trò

#### 1. Mã màn hình
`SCR-10-010`

#### 2. Mô tả
Màn hình liệt kê toàn bộ vai trò trong hệ thống. Hỗ trợ phân trang, chọn số bản ghi/trang, thêm mới, chỉnh sửa, gán quyền, xóa vai trò.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                           [Avatar] [Logout] ║
╠══════════════╦═══════════════════════════════════════════════════════════════════════╣
║              ║  QUẢN TRỊ HỆ THỐNG > Quản lý vai trò                                 ║
║  SIDEBAR     ╠═══════════════════════════════════════════════════════════════════════╣
║  ──────────  ║                                                                       ║
║  📋 Người    ║  ┌───────────────────────────────────────────────────────────────┐    ║
║     dùng     ║  │  DANH SÁCH VAI TRÒ                                            │    ║
║  👤 Vai trò◀ ║  ├───────────────────────────────────────────────────────────────┤    ║
║  🏢 Cơ cấu   ║  │  Hiển thị: [10 ▼] bản ghi/trang          Tổng: 8 vai trò     │    ║
║              ║  │                                                               │    ║
║              ║  │  [+ Thêm mới vai trò]                                         │    ║
║              ║  ├──────┬─────────────────────┬──────────────────────┬──────────┤    ║
║              ║  │ STT  │ Tên vai trò          │ Mô tả               │ Thao tác │    ║
║              ║  ├──────┼─────────────────────┼──────────────────────┼──────────┤    ║
║              ║  │  1   │ Quản trị hệ thống    │ Toàn quyền hệ thống │[✏][🔑][🗑]│    ║
║              ║  ├──────┼─────────────────────┼──────────────────────┼──────────┤    ║
║              ║  │  2   │ CBQL                 │ Cán bộ quản lý      │[✏][🔑][🗑]│    ║
║              ║  ├──────┼─────────────────────┼──────────────────────┼──────────┤    ║
║              ║  │  3   │ Giáo viên            │ Giảng dạy           │[✏][🔑][🗑]│    ║
║              ║  ├──────┼─────────────────────┼──────────────────────┼──────────┤    ║
║              ║  │  4   │ Học sinh             │ Tài khoản học sinh  │[✏][🔑][🗑]│    ║
║              ║  ├──────┼─────────────────────┼──────────────────────┼──────────┤    ║
║              ║  │  5   │ Phụ huynh            │ Tài khoản phụ huynh │[✏][🔑][🗑]│    ║
║              ║  ├──────┴─────────────────────┴──────────────────────┴──────────┤    ║
║              ║  │  ← Trước   [1]   Sau →                     Trang 1 / 1       │    ║
║              ║  └───────────────────────────────────────────────────────────────┘    ║
║              ║                                                                       ║
╚══════════════╩═══════════════════════════════════════════════════════════════════════╝

Chú thích icon:
  [✏]  = Chỉnh sửa tên/mô tả vai trò  → SCR-10-011
  [🔑]  = Gán quyền cho vai trò        → SCR-10-012
  [🗑]  = Xóa vai trò                  → Dialog SCR-10-DLG-002
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | PageSizeSelector | Dropdown | 10 / 20 / 50 bản ghi/trang |
| 2 | TotalCounter | Label | Tổng số vai trò |
| 3 | BtnAddRole | Button (Primary) | Mở SCR-10-011 (thêm mới) |
| 4 | DataTable | Table | STT, Tên vai trò, Mô tả, Thao tác |
| 5 | BtnEditRole | Icon Button | Mở SCR-10-011 (chỉnh sửa) |
| 6 | BtnAssignPermission | Icon Button | Mở SCR-10-012 (gán quyền) |
| 7 | BtnDeleteRole | Icon Button | Hiện Dialog SCR-10-DLG-002 |
| 8 | Pagination | Component | Phân trang |

#### 6. Luồng điều hướng

```
SCR-10-010 (Danh sách vai trò)
  ├── [+ Thêm mới]   → SCR-10-011 (Form thêm mới vai trò)
  ├── [✏] (row)       → SCR-10-011 (Form chỉnh sửa vai trò)
  ├── [🔑] (row)       → SCR-10-012 (Gán quyền vai trò)
  └── [🗑] (row)       → Dialog SCR-10-DLG-002 (Xác nhận xóa vai trò)
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Vai trò hệ thống mặc định (Quản trị hệ thống) không thể xóa — ẩn nút [🗑] hoặc disable. |
| BR-002 | Vai trò đang được gán cho người dùng không thể xóa; hiển thị thông báo. |
| BR-003 | Phân trang áp dụng; mặc định 10 bản ghi/trang. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/roles?page=1&size=10` | Lấy danh sách vai trò |

---

### SCR-10-011: Thêm mới / Chỉnh sửa vai trò

#### 1. Mã màn hình
`SCR-10-011`

#### 2. Mô tả
Form để QTHT tạo mới hoặc cập nhật thông tin cơ bản (tên, mô tả) của một vai trò.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  HEADER                                                              ║
╠══════════════════════════════════════════════════════════════════════╣
║  Quản lý vai trò > Thêm mới vai trò         (hoặc: Chỉnh sửa vai trò)║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │  THÔNG TIN VAI TRÒ                                           │   ║
║  │  ──────────────────────────────────────────────────────────  │   ║
║  │                                                              │   ║
║  │  Tên vai trò *                                               │   ║
║  │  [___________________________________________________]       │   ║
║  │                                                              │   ║
║  │  Mô tả                                                       │   ║
║  │  ┌──────────────────────────────────────────────────────┐   │   ║
║  │  │                                                      │   │   ║
║  │  │  (Textarea - nhập mô tả vai trò)                     │   │   ║
║  │  │                                                      │   │   ║
║  │  └──────────────────────────────────────────────────────┘   │   ║
║  │                                                              │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║                          [  Hủy  ]   [  💾 Lưu  ]                    ║
╚══════════════════════════════════════════════════════════════════════╝
```

#### 5. Danh sách Components

| # | Component | Loại | Bắt buộc |
|---|-----------|------|----------|
| 1 | TenVaiTro | Text Input | ✅ |
| 2 | MoTa | Textarea | ❌ |
| 3 | BtnHuy | Button | — |
| 4 | BtnLuu | Button (Primary) | — |
| 5 | InlineError | Validation Message | — |

#### 6. Luồng điều hướng

```
SCR-10-011
  ├── [Hủy]           → SCR-10-010 (Danh sách vai trò)
  ├── [💾 Lưu] + HỢP LỆ → POST/PUT API → SCR-10-010 + Toast thành công
  ├── [💾 Lưu] + THIẾU  → Inline "Vui lòng nhập tên vai trò"
  └── [💾 Lưu] + TRÙNG  → Inline "Tên vai trò đã tồn tại"
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Tên vai trò: bắt buộc, 2–100 ký tự, không được trùng tên vai trò đã có. |
| BR-002 | Mô tả: tùy chọn, tối đa 500 ký tự. |
| BR-003 | Khi chỉnh sửa, form load sẵn dữ liệu hiện tại; tên vai trò có thể sửa nếu không phải role hệ thống. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/v1/admin/roles` | Tạo mới vai trò |
| GET | `/api/v1/admin/roles/{id}` | Lấy thông tin vai trò |
| PUT | `/api/v1/admin/roles/{id}` | Cập nhật vai trò |

---

### SCR-10-012: Gán quyền cho vai trò

#### 1. Mã màn hình
`SCR-10-012`

#### 2. Mô tả
Màn hình phân quyền chức năng cho một vai trò. Hiển thị cây quyền (permission tree) theo module/chức năng; QTHT chọn các quyền cần gán và nhấn Lưu.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║  Quản lý vai trò > Gán quyền: CBQL                                                   ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║  ┌───────────────────────────────────────────────────────────────────────────────┐  ║
║  │  PHÂN QUYỀN CHO VAI TRÒ: CBQL                                                 │  ║
║  │  ─────────────────────────────────────────────────────────────────────────    │  ║
║  │                                                                               │  ║
║  │  [🔍 Tìm kiếm quyền...                      ]    [Chọn tất cả] [Bỏ chọn tất] │  ║
║  │                                                                               │  ║
║  │  ┌───────────────────────────────────────────────────────────────────────┐   │  ║
║  │  │                                                                       │   │  ║
║  │  │  [▼] 📦 QUẢN LÝ HỌC TẬP                                               │   │  ║
║  │  │      [▼] 📂 Khóa học                                                  │   │  ║
║  │  │          [✅]  Xem danh sách khóa học                                 │   │  ║
║  │  │          [✅]  Thêm mới khóa học                                      │   │  ║
║  │  │          [✅]  Chỉnh sửa khóa học                                     │   │  ║
║  │  │          [ ]   Xóa khóa học                                           │   │  ║
║  │  │          [ ]   Xuất báo cáo khóa học                                  │   │  ║
║  │  │      [▼] 📂 Bài học                                                   │   │  ║
║  │  │          [✅]  Xem danh sách bài học                                  │   │  ║
║  │  │          [✅]  Thêm mới bài học                                       │   │  ║
║  │  │          [ ]   Xóa bài học                                            │   │  ║
║  │  │                                                                       │   │  ║
║  │  │  [▶] 📦 QUẢN TRỊ HỆ THỐNG                                             │   │  ║
║  │  │      (click để mở rộng)                                               │   │  ║
║  │  │                                                                       │   │  ║
║  │  │  [▼] 📦 BÁO CÁO & THỐNG KÊ                                            │   │  ║
║  │  │      [▼] 📂 Báo cáo học tập                                           │   │  ║
║  │  │          [✅]  Xem báo cáo                                            │   │  ║
║  │  │          [✅]  Xuất báo cáo                                           │   │  ║
║  │  │          [ ]   Xóa báo cáo                                            │   │  ║
║  │  │                                                                       │   │  ║
║  │  └───────────────────────────────────────────────────────────────────────┘   │  ║
║  │                                                                               │  ║
║  │  Tổng quyền đã chọn: 8 / 45 quyền                                            │  ║
║  └───────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                      ║
║                              [  Hủy  ]    [  💾 Lưu phân quyền  ]                   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  Ghi chú trạng thái checkbox:
  [✅] = Đã chọn (quyền được gán)
  [ ]  = Chưa chọn
  [━]  = Chọn một phần (partial - áp dụng cho node cha khi chỉ chọn một số con)

  Khi chọn node cha → tự động chọn/bỏ chọn toàn bộ node con.
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | PermissionSearchInput | Text Input | Lọc nhanh tên quyền trong cây |
| 2 | BtnSelectAll | Button | Chọn tất cả quyền |
| 3 | BtnDeselectAll | Button | Bỏ chọn tất cả |
| 4 | PermissionTree | Tree Checkbox | Cây quyền theo cấu trúc Module > Nhóm > Quyền |
| 5 | TreeNodeExpand | Toggle [▶/▼] | Mở rộng / Thu gọn node |
| 6 | PermissionCheckbox | Checkbox | Chọn từng quyền; hỗ trợ partial state cho node cha |
| 7 | SelectedCounter | Label | "Tổng quyền đã chọn: X / Y quyền" |
| 8 | BtnHuy | Button | Hủy, quay về SCR-10-010 |
| 9 | BtnLuuPhanQuyen | Button (Primary) | Lưu cấu hình phân quyền |

#### 6. Luồng điều hướng

```
SCR-10-012
  ├── [Chọn tất cả]       → Tích chọn tất cả permission
  ├── [Bỏ chọn tất]       → Bỏ chọn tất cả
  ├── [▶/▼ Node cha]      → Mở rộng/thu gọn nhóm quyền
  ├── [Checkbox cha]      → Check/uncheck toàn bộ quyền con
  ├── [Hủy]               → SCR-10-010
  ├── [💾 Lưu] + CÓ CHỌN  → PUT API → SCR-10-010 + Toast thành công
  └── [💾 Lưu] + KHÔNG CHỌN → Cảnh báo "Chưa chọn quyền nào"; có thể vẫn lưu
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Cây quyền tổ chức theo 3 cấp: Module → Nhóm chức năng → Quyền cụ thể. |
| BR-002 | Khi chọn/bỏ node cha, toàn bộ node con được chọn/bỏ theo. |
| BR-003 | Node cha hiển thị trạng thái "partial" (━) khi chỉ một số node con được chọn. |
| BR-004 | Tìm kiếm quyền: lọc theo tên quyền, tự động mở rộng node chứa kết quả khớp. |
| BR-005 | Khi lưu với 0 quyền, hiện cảnh báo nhưng vẫn cho phép lưu (vai trò không có quyền). |
| BR-006 | Tải trang hiển thị sẵn trạng thái quyền hiện tại của vai trò. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/permissions/tree` | Lấy cây quyền toàn hệ thống |
| GET | `/api/v1/admin/roles/{id}/permissions` | Lấy quyền hiện có của vai trò |
| PUT | `/api/v1/admin/roles/{id}/permissions` | Cập nhật danh sách quyền cho vai trò |

---

### SCR-10-DLG-002: Dialog xác nhận xóa vai trò

#### 1. Mã màn hình
`SCR-10-DLG-002`

#### 2. Mô tả
Dialog popup xác nhận trước khi xóa vĩnh viễn một vai trò.

#### 4. Layout ASCII Wireframe

```
        ┌────────────────────────────────────────────────────────┐
        │  ⚠ XÁC NHẬN XÓA VAI TRÒ                           [X] │
        ├────────────────────────────────────────────────────────┤
        │                                                        │
        │  Bạn có chắc chắn muốn xóa vai trò:                   │
        │                                                        │
        │  🏷 Giáo viên                                          │
        │                                                        │
        │  ⛔ Hành động này không thể hoàn tác.                   │
        │     Tất cả phân quyền của vai trò này sẽ bị xóa.       │
        │                                                        │
        │                    [  Hủy  ]   [🗑 Xóa vai trò]        │
        └────────────────────────────────────────────────────────┘
```

#### 7. Business Rules

| # | Quy tắc |
|---|---------|
| BR-001 | Không thể xóa vai trò đang được gán cho ≥ 1 người dùng; hiển thị thông báo "Vai trò đang được sử dụng bởi X người dùng". |
| BR-002 | Không thể xóa vai trò hệ thống mặc định. |
| BR-003 | Nhấn [Hủy] hoặc [X]: đóng dialog. |
| BR-004 | Nhấn [🗑 Xóa]: DELETE API → đóng dialog → Toast → reload SCR-10-010. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| DELETE | `/api/v1/admin/roles/{id}` | Xóa vai trò |

---

## Phần C: Cơ cấu tổ chức

---

### SCR-10-020: Cơ cấu tổ chức

#### 1. Mã màn hình
`SCR-10-020`

#### 2. Mô tả
Màn hình hiển thị cây cơ cấu tổ chức của toàn hệ thống. QTHT có thể xem, thêm mới đơn vị cùng cấp hoặc thêm đơn vị con dưới một node đã có.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║  HEADER                                                             [Avatar] [Logout]   ║
╠══════════════╦═══════════════════════════════════════════════════════════════════════════╣
║              ║  QUẢN TRỊ HỆ THỐNG > Cơ cấu tổ chức                                      ║
║  SIDEBAR     ╠═══════════════════════════════════════════════════════════════════════════╣
║  ──────────  ║                                                                           ║
║  📋 Người    ║  ┌─────────────────────────────────────────────────────────────────────┐  ║
║     dùng     ║  │  CƠ CẤU TỔ CHỨC                                                     │  ║
║  👤 Vai trò  ║  ├──────────────────────────────────────┬──────────────────────────────┤  ║
║  🏢 Cơ cấu ◀ ║  │  CÂY TỔ CHỨC                         │  THÔNG TIN ĐƠN VỊ           │  ║
║     tổ chức  ║  │  ─────────────────────────────────   │  ─────────────────────────  │  ║
║              ║  │                                      │                              │  ║
║              ║  │  [+ Thêm đơn vị gốc]                 │  (Chọn một đơn vị bên trái   │  ║
║              ║  │                                      │   để xem chi tiết)           │  ║
║              ║  │  [▼] 🏛 Sở Giáo dục & Đào tạo        │                              │  ║
║              ║  │      [▼] 🏢 Phòng GD Quận 1           │  ┌──────────────────────┐   │  ║
║              ║  │          [▼] 🏫 TH Lê Lợi  [⊕][⊕c]   │  │ Tên đơn vị:          │   │  ║
║              ║  │              [—] Lớp 1A              │  │ TH Lê Lợi            │   │  ║
║              ║  │              [—] Lớp 1B              │  ├──────────────────────┤   │  ║
║              ║  │          [▼] 🏫 TH Trần Hưng Đạo      │  │ Mã đơn vị:           │   │  ║
║              ║  │      [▼] 🏢 Phòng GD Quận 3           │  │ THQ1-001             │   │  ║
║              ║  │          [—] 🏫 THCS Nguyễn Trãi      │  ├──────────────────────┤   │  ║
║              ║  │      [—] 🏢 Phòng GD Quận 5           │  │ Cấp:                 │   │  ║
║              ║  │                                      │  │ Trường Tiểu học      │   │  ║
║              ║  │                                      │  ├──────────────────────┤   │  ║
║              ║  │                                      │  │ Đơn vị cha:          │   │  ║
║              ║  │                                      │  │ Phòng GD Quận 1      │   │  ║
║              ║  │                                      │  └──────────────────────┘   │  ║
║              ║  │                                      │                              │  ║
║              ║  │                                      │  [⊕ Thêm đơn vị cùng cấp]   │  ║
║              ║  │                                      │  [⊕ Thêm đơn vị con]        │  ║
║              ║  └──────────────────────────────────────┴──────────────────────────────┘  ║
╚══════════════╩═══════════════════════════════════════════════════════════════════════════╝

Chú thích icon trên node cây:
  [▼]/[▶]  = Thu gọn / Mở rộng node
  [⊕]      = Thêm đơn vị cùng cấp (nằm cạnh node)
  [⊕c]     = Thêm đơn vị con (nằm cạnh node)
  [—]      = Node lá (không có con)
```

#### 5. Danh sách Components

| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | OrgTreePanel | Tree View | Panel trái: cây đơn vị có thể mở rộng/thu gọn |
| 2 | TreeNodeExpand | Toggle [▼/▶] | Mở/đóng node |
| 3 | BtnAddRoot | Button | Thêm đơn vị gốc (cấp cao nhất) |
| 4 | BtnAddSibling | Icon Button [⊕] | Thêm đơn vị cùng cấp với node đang chọn |
| 5 | BtnAddChild | Icon Button [⊕c] | Thêm đơn vị con dưới node đang chọn |
| 6 | OrgDetailPanel | Info Panel | Panel phải: hiển thị thông tin đơn vị đang chọn |
| 7 | BtnAddSiblingDetail | Button | Nút thêm cùng cấp trong panel chi tiết |
| 8 | BtnAddChildDetail | Button | Nút thêm đơn vị con trong panel chi tiết |

#### 6. Luồng điều hướng

```
SCR-10-020
  ├── [+ Thêm đơn vị gốc]           → Modal/Drawer SCR-10-021 (thêm mới, không có cha)
  ├── [⊕] (cạnh node)                → Modal/Drawer SCR-10-021 (thêm cùng cấp)
  ├── [⊕c] (cạnh node)               → Modal/Drawer SCR-10-022 (thêm cấp con)
  ├── [⊕ Thêm cùng cấp] (chi tiết)   → Modal/Drawer SCR-10-021
  ├── [⊕ Thêm đơn vị con] (chi tiết) → Modal/Drawer SCR-10-022
  └── Click node                     → Load thông tin vào OrgDetailPanel
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Cây tổ chức không giới hạn số cấp. |
| BR-002 | Node đang được chọn được highlight (background khác màu). |
| BR-003 | Node có con: hiển thị icon [▼/▶]; node lá: hiển thị icon [—]. |
| BR-004 | Khi thêm đơn vị con, hệ thống tự xác định đơn vị cha là node đang được chọn. |
| BR-005 | Khi thêm đơn vị cùng cấp, đơn vị cha kế thừa từ node đang chọn. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/admin/org-structure/tree` | Lấy toàn bộ cây tổ chức |
| GET | `/api/v1/admin/org-structure/{id}` | Lấy thông tin một đơn vị |

---

### SCR-10-021: Thêm mới đơn vị cùng cấp

#### 1. Mã màn hình
`SCR-10-021`

#### 2. Mô tả
Form/Modal thêm mới một đơn vị tổ chức ở cùng cấp với đơn vị đang chọn (hoặc tạo đơn vị gốc nếu chưa chọn node nào).

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
        ┌──────────────────────────────────────────────────────────┐
        │  THÊM MỚI ĐƠN VỊ CÙNG CẤP                           [X] │
        ├──────────────────────────────────────────────────────────┤
        │                                                          │
        │  Đơn vị cha (tham chiếu):                               │
        │  📂 Phòng GD Quận 1  (chỉ đọc)                          │
        │                                                          │
        │  Tên đơn vị *                                            │
        │  [__________________________________________________]   │
        │                                                          │
        │  Mã đơn vị *                                             │
        │  [__________________________________________________]   │
        │                                                          │
        │  Loại đơn vị                                             │
        │  [▼ Chọn loại đơn vị (Sở/Phòng/Trường/Lớp)          ]   │
        │                                                          │
        │  Mô tả                                                   │
        │  [__________________________________________________]   │
        │                                                          │
        │                    [  Hủy  ]   [  💾 Lưu  ]             │
        └──────────────────────────────────────────────────────────┘
```

#### 5. Danh sách Components

| # | Component | Loại | Bắt buộc |
|---|-----------|------|----------|
| 1 | DonViCha | Label (readonly) | — (tự động, chỉ hiển thị) |
| 2 | TenDonVi | Text Input | ✅ |
| 3 | MaDonVi | Text Input | ✅ |
| 4 | LoaiDonVi | Dropdown | ❌ |
| 5 | MoTa | Text Input | ❌ |
| 6 | BtnHuy | Button | — |
| 7 | BtnLuu | Button (Primary) | — |

#### 6. Luồng điều hướng

```
SCR-10-021 (Modal)
  ├── [Hủy] / [X]         → Đóng modal, ở lại SCR-10-020
  ├── [💾 Lưu] + HỢP LỆ   → POST API → đóng modal + cập nhật cây + Toast thành công
  ├── [💾 Lưu] + THIẾU    → Inline error trường bắt buộc
  └── [💾 Lưu] + TRÙNG MÃ → Inline "Mã đơn vị đã tồn tại"
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Tên đơn vị: bắt buộc, tối đa 200 ký tự. |
| BR-002 | Mã đơn vị: bắt buộc, duy nhất trong toàn hệ thống, không chứa ký tự đặc biệt (trừ gạch ngang). |
| BR-003 | Đơn vị cha được hệ thống tự xác định từ context; người dùng không cần chọn lại. |
| BR-004 | Sau khi lưu, cây tổ chức tự động cập nhật (không cần reload toàn trang). |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/v1/admin/org-structure` | Tạo mới đơn vị tổ chức |

---

### SCR-10-022: Thêm mới đơn vị con

#### 1. Mã màn hình
`SCR-10-022`

#### 2. Mô tả
Form/Modal thêm mới một đơn vị tổ chức làm cấp con trực tiếp của đơn vị đang chọn.

#### 3. Actors
- Quản trị hệ thống (QTHT)

#### 4. Layout ASCII Wireframe

```
        ┌──────────────────────────────────────────────────────────┐
        │  THÊM MỚI ĐƠN VỊ CON                                [X] │
        ├──────────────────────────────────────────────────────────┤
        │                                                          │
        │  Đơn vị cha (sẽ là đơn vị cha của đơn vị mới):          │
        │  🏫 TH Lê Lợi  (chỉ đọc)                                │
        │                                                          │
        │  Tên đơn vị con *                                        │
        │  [__________________________________________________]   │
        │                                                          │
        │  Mã đơn vị *                                             │
        │  [__________________________________________________]   │
        │                                                          │
        │  Loại đơn vị                                             │
        │  [▼ Chọn loại đơn vị (Lớp học/Tổ chuyên môn/...)    ]   │
        │                                                          │
        │  Mô tả                                                   │
        │  [__________________________________________________]   │
        │                                                          │
        │                    [  Hủy  ]   [  💾 Lưu  ]             │
        └──────────────────────────────────────────────────────────┘
```

#### 5. Danh sách Components
Tương tự SCR-10-021; điểm khác: nhãn tiêu đề là "Thêm mới đơn vị con", DonViCha hiển thị đơn vị hiện đang được chọn (sẽ trở thành đơn vị cha).

#### 6. Luồng điều hướng
```
SCR-10-022 (Modal)
  ├── [Hủy] / [X]         → Đóng modal, ở lại SCR-10-020
  ├── [💾 Lưu] + HỢP LỆ   → POST API (với parentId = node đang chọn) → đóng modal + cập nhật cây
  ├── [💾 Lưu] + THIẾU    → Inline error
  └── [💾 Lưu] + TRÙNG MÃ → Inline "Mã đơn vị đã tồn tại"
```

#### 7. Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-001 | Tên đơn vị: bắt buộc, tối đa 200 ký tự. |
| BR-002 | Mã đơn vị: bắt buộc, duy nhất toàn hệ thống. |
| BR-003 | `parentId` tự động gán = ID của node đang được chọn trong cây. |
| BR-004 | Sau khi lưu, node cha tự động được mở rộng để hiển thị đơn vị con vừa thêm. |
| BR-005 | Nếu node cha trước đó là node lá, icon sẽ chuyển từ [—] thành [▼]. |

#### 8. API Endpoints gợi ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/v1/admin/org-structure` | Tạo mới đơn vị (body gồm `parentId`) |

---

## Phụ lục: Sơ đồ điều hướng tổng thể (Navigation Map)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHẦN A: QUẢN LÝ NGƯỜI DÙNG                                                  │
│                                                                              │
│  SCR-10-001 [Danh sách ND]                                                   │
│      ├──→ SCR-10-002 [Thêm mới ND]                                           │
│      ├──→ SCR-10-003 [Import Excel ND]                                       │
│      │       ├──→ Download template                                          │
│      │       └──→ Upload & Validate → Save                                  │
│      ├──→ SCR-10-004 [Chỉnh sửa ND]                                          │
│      ├──→ SCR-10-005 [Gán/Xóa vai trò ND]                                    │
│      ├──→ SCR-10-005b [Đổi MK đơn lẻ]                                        │
│      ├──→ SCR-10-006 [Đổi MK hàng loạt Excel]                                │
│      ├──→ SCR-10-007 [Khóa/Mở khóa Excel]                                    │
│      ├──→ SCR-10-DLG-001 [Xác nhận xóa ND]                                   │
│      └──→ Xuất báo cáo (download)                                            │
│                                                                              │
│  PHẦN B: QUẢN LÝ VAI TRÒ & QUYỀN                                             │
│                                                                              │
│  SCR-10-010 [Danh sách vai trò]                                              │
│      ├──→ SCR-10-011 [Thêm mới / Chỉnh sửa vai trò]                          │
│      ├──→ SCR-10-012 [Gán quyền cho vai trò]                                 │
│      └──→ SCR-10-DLG-002 [Xác nhận xóa vai trò]                              │
│                                                                              │
│  PHẦN C: CƠ CẤU TỔ CHỨC                                                     │
│                                                                              │
│  SCR-10-020 [Cây cơ cấu tổ chức]                                             │
│      ├──→ SCR-10-021 [Thêm đơn vị cùng cấp]                                  │
│      └──→ SCR-10-022 [Thêm đơn vị con]                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Phụ lục: Toast Notifications

| Hành động | Loại | Nội dung thông báo |
|-----------|------|---------------------|
| Thêm người dùng thành công | ✅ Success | "Thêm tài khoản người dùng thành công" |
| Import người dùng thành công | ✅ Success | "Đã thêm X tài khoản thành công" |
| Cập nhật người dùng thành công | ✅ Success | "Cập nhật thông tin người dùng thành công" |
| Xóa người dùng thành công | ✅ Success | "Xóa người dùng thành công" |
| Đổi mật khẩu thành công | ✅ Success | "Đổi mật khẩu thành công" |
| Gán vai trò thành công | ✅ Success | "Gán vai trò thành công" |
| Gỡ vai trò thành công | ✅ Success | "Gỡ vai trò thành công" |
| Khóa/Mở khóa thành công | ✅ Success | "Cập nhật trạng thái X tài khoản thành công" |
| Thêm vai trò thành công | ✅ Success | "Thêm mới vai trò thành công" |
| Lưu phân quyền thành công | ✅ Success | "Cập nhật phân quyền thành công" |
| Xóa vai trò thành công | ✅ Success | "Xóa vai trò thành công" |
| Thêm đơn vị thành công | ✅ Success | "Thêm mới đơn vị tổ chức thành công" |
| Lỗi kết nối | ❌ Error | "Lỗi kết nối. Vui lòng thử lại." |
| Không có quyền | ⚠ Warning | "Bạn không có quyền thực hiện thao tác này." |
