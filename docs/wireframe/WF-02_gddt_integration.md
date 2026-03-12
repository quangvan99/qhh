---
title: "WF-02: Tích hợp hệ thống Sở GDĐT"
cluster: "GDĐT Integration"
updated: 2026-03-11
---

# WF-02: Tích hợp hệ thống Sở GDĐT

## Tổng quan

Cụm màn hình này phục vụ nhóm chức năng **"Nâng cấp một số chức năng và tích hợp dữ liệu với hệ thống quản lý trường học Sở GD&ĐT"**. Dữ liệu được đồng bộ 2 chiều giữa hệ thống nhà trường và hệ thống Sở qua LGSP/NGSP.

### Danh sách màn hình

| Mã | Tên màn hình | Nhóm chức năng |
|----|-------------|----------------|
| SCR-02-001 | Danh sách lớp học | Quản lý lớp học |
| SCR-02-002 | Danh sách học sinh trong lớp | Quản lý học sinh |
| SCR-02-003 | Cấu hình điểm rèn luyện – Danh sách | Điểm rèn luyện |
| SCR-02-004 | Cấu hình điểm rèn luyện – Form thêm/sửa | Điểm rèn luyện |
| SCR-02-005 | Nhập điểm rèn luyện – Form từng học sinh | Điểm rèn luyện |
| SCR-02-006 | Import điểm rèn luyện từ Excel | Điểm rèn luyện |
| SCR-02-007 | Cấu hình học bổng – Mức học bổng | Học bổng |
| SCR-02-008 | Cấu hình học bổng – Đợt xét tuyển | Học bổng |
| SCR-02-009 | Danh sách học sinh đạt học bổng | Học bổng |
| SCR-02-010 | Kết nối & Đồng bộ GDĐT – Cấu hình kết nối | Tích hợp GDĐT |
| SCR-02-011 | Kết nối & Đồng bộ GDĐT – Kích hoạt đồng bộ | Tích hợp GDĐT |
| SCR-02-012 | Lịch sử đồng bộ / Log | Tích hợp GDĐT |

### Actors

- **CBQL** – Cán bộ quản lý nhà trường (vai trò chính)
- **Hệ thống** – Tiến trình tự động đồng bộ dữ liệu
- **Sở GD&ĐT** – Hệ thống bên ngoài (LGSP/NGSP gateway)

---

## SCR-02-001: Danh sách lớp học

### Mô tả
Màn hình trung tâm để CBQL xem, lọc toàn bộ danh sách lớp học. Hỗ trợ lọc theo **năm học**, **khối học**, **tên lớp** và phân trang kết quả.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  QUẢN LÝ LỚP HỌC                                         ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📊 Dashboard     ║                                                           ║
║  🏫 Lớp học  ◀    ║  ┌─ THANH LỌC ──────────────────────────────────────────┐ ║
║  👨‍🎓 Học sinh     ║  │  Năm học: [2024-2025          ▼]                       │ ║
║  📝 Điểm RL       ║  │  Khối:    [Tất cả             ▼]  Tên lớp: [________]  │ ║
║  🎓 Học bổng      ║  │                         [🔍 Tìm kiếm]  [↺ Làm mới]    │ ║
║  🔗 Tích hợp GD   ║  └──────────────────────────────────────────────────────┘ ║
║  ⚙️  Cấu hình     ║                                                           ║
║                   ║  Hiển thị: [10 ▼] bản ghi/trang          Tổng: 24 lớp   ║
║                   ║                                                           ║
║                   ║  ┌────────────────────────────────────────────────────────┐ ║
║                   ║  │ STT │ Tên lớp  │ Khối │ Năm học   │ Sĩ số │ GVCN      │ ║
║                   ║  ├─────┼──────────┼──────┼───────────┼───────┼───────────┤ ║
║                   ║  │  1  │ 10A1   ▲▼│  10  │ 2024-2025 │  38   │ Trần T. B │ ║
║                   ║  │  2  │ 10A2   ▲▼│  10  │ 2024-2025 │  40   │ Lê T. C   │ ║
║                   ║  │  3  │ 10A3   ▲▼│  10  │ 2024-2025 │  37   │ Phạm V. D │ ║
║                   ║  │  4  │ 11B1   ▲▼│  11  │ 2024-2025 │  39   │ Ngô T. E  │ ║
║                   ║  │  5  │ 11B2   ▲▼│  11  │ 2024-2025 │  38   │ Vũ V. F   │ ║
║                   ║  │ ... │ ...      │ ...  │ ...       │  ...  │ ...       │ ║
║                   ║  └────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 3  [Sau ▶]    Tổng: 24 bản ghi    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Dropdown Năm học | Select | Lọc theo năm học (2023-2024, 2024-2025...) |
| Dropdown Khối | Select | Lọc theo khối (10, 11, 12 / Tất cả) |
| Ô tìm kiếm Tên lớp | Text Input | Nhập tên lớp để lọc, autocomplete |
| Nút Tìm kiếm | Button (primary) | Kích hoạt lọc |
| Nút Làm mới | Button (secondary) | Reset bộ lọc |
| Dropdown số bản ghi | Select | Chọn 10/20/50/100 bản ghi/trang |
| Bảng danh sách | Table | STT, Tên lớp (sortable ▲▼), Khối, Năm học, Sĩ số, GVCN |
| Phân trang | Pagination | Nút Trước/Sau + thông tin trang hiện tại |
| Badge tổng số | Text | Hiển thị tổng số lớp |
| Row click | Action | Click vào hàng → SCR-02-002 |

### Luồng điều hướng
- **Đến từ:** Dashboard, Sidebar menu "Lớp học"
- **Đi đến:**
  - Click vào tên lớp → **SCR-02-002** (Danh sách học sinh trong lớp)

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Người dùng phải được cấp quyền `VIEW_CLASS_LIST` |
| BR-02 | Mặc định lọc theo năm học hiện tại khi mở màn hình |
| BR-03 | Cột "Tên lớp" hỗ trợ sắp xếp A→Z và Z→A |
| BR-04 | Dropdown số bản ghi: tùy chọn 10 / 20 / 50 / 100, mặc định 10 |
| BR-05 | Khi không có dữ liệu: hiển thị trạng thái trống "Không có lớp học nào" |
| BR-06 | Bộ lọc khối chỉ hiển thị khối có trong năm học đã chọn |

### API Endpoints (gợi ý)

```
GET  /api/v1/classes?schoolYear={year}&grade={grade}&name={name}&page={p}&size={s}
GET  /api/v1/school-years          # Lấy danh sách năm học
GET  /api/v1/grades                # Lấy danh sách khối
```

---

## SCR-02-002: Danh sách học sinh trong lớp học

### Mô tả
Hiển thị danh sách học sinh thuộc lớp được chọn. Hỗ trợ tìm kiếm theo từ khóa, sắp xếp theo tên (A→Z / Z→A), phân trang và chọn số bản ghi.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  DANH SÁCH HỌC SINH LỚP 10A1 (2024-2025)                 ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📊 Dashboard     ║  [← Quay lại Danh sách lớp]                              ║
║  🏫 Lớp học  ◀    ║                                                           ║
║  👨‍🎓 Học sinh     ║  ┌─ TÌM KIẾM ───────────────────────────────────────────┐ ║
║  📝 Điểm RL       ║  │  🔍 Nhập tên, mã số học sinh...  [Tìm kiếm] [Làm mới] │ ║
║  🎓 Học bổng      ║  └──────────────────────────────────────────────────────┘ ║
║  🔗 Tích hợp GD   ║                                                           ║
║  ⚙️  Cấu hình     ║  Hiển thị: [10 ▼] bản ghi/trang     Tổng: 38 học sinh   ║
║                   ║                                                           ║
║                   ║  ┌──────────────────────────────────────────────────────────┐ ║
║                   ║  │ STT │ Mã HS    │ Họ và tên     ▲▼ │ Ngày sinh │ Giới tính│ ║
║                   ║  ├─────┼──────────┼──────────────────┼───────────┼──────────┤ ║
║                   ║  │  1  │ HS000101 │ Bùi Thị An       │ 02/01/09  │   Nữ     │ ║
║                   ║  │  2  │ HS000102 │ Đặng Văn Bình    │ 15/03/09  │   Nam    │ ║
║                   ║  │  3  │ HS000103 │ Hoàng Thị Cúc    │ 20/07/09  │   Nữ     │ ║
║                   ║  │  4  │ HS000104 │ Lê Minh Đức      │ 08/11/09  │   Nam    │ ║
║                   ║  │  5  │ HS000105 │ Nguyễn Thị Em    │ 12/04/09  │   Nữ     │ ║
║                   ║  │ ... │ ...      │ ...              │ ...       │ ...      │ ║
║                   ║  └──────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 4  [Sau ▶]    Tổng: 38 bản ghi   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Breadcrumb / Back button | Link | "← Quay lại Danh sách lớp" → SCR-02-001 |
| Tiêu đề màn hình | Heading | Hiển thị "Danh sách học sinh lớp {TênLớp} ({NămHọc})" |
| Ô tìm kiếm | Text Input | Tìm theo tên hoặc mã học sinh (fuzzy search) |
| Nút Tìm kiếm | Button (primary) | Kích hoạt tìm kiếm |
| Nút Làm mới | Button (secondary) | Xoá bộ lọc |
| Dropdown số bản ghi | Select | 10/20/50/100 bản ghi/trang |
| Bảng học sinh | Table | STT, Mã HS, Họ và tên (sortable ▲▼), Ngày sinh, Giới tính |
| Phân trang | Pagination | Trước/Sau + số trang hiện tại |
| Badge tổng số | Text | Tổng số học sinh trong lớp |

### Luồng điều hướng
- **Đến từ:** SCR-02-001 (click vào tên lớp)
- **Đi đến:**
  - Nút Back → **SCR-02-001**

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Người dùng phải có quyền `VIEW_STUDENT_LIST` |
| BR-02 | Tìm kiếm từ khóa: không phân biệt hoa thường, tìm trên cả tên lẫn mã HS |
| BR-03 | Cột "Họ và tên" hỗ trợ sắp xếp A→Z / Z→A |
| BR-04 | Khi không có học sinh: hiển thị "Lớp này chưa có học sinh" |
| BR-05 | Số bản ghi mặc định = 10, các tùy chọn: 10/20/50/100 |

### API Endpoints (gợi ý)

```
GET  /api/v1/classes/{classId}/students?keyword={kw}&sort={field}&order={asc|desc}&page={p}&size={s}
```

---

## SCR-02-003: Cấu hình điểm rèn luyện – Danh sách

### Mô tả
Quản lý danh sách các tiêu chí / cấu hình điểm rèn luyện áp dụng cho học sinh. CBQL có thể xem, thêm mới, sửa, xóa cấu hình; đồng thời nhập điểm, import từ Excel và kết xuất Excel.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  CẤU HÌNH ĐIỂM RÈN LUYỆN                                 ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📊 Dashboard     ║                                                           ║
║  🏫 Lớp học       ║  [＋ Thêm mới]   [📥 Import Excel]   [📤 Kết xuất Excel]  ║
║  👨‍🎓 Học sinh     ║                                                           ║
║  📝 Điểm RL  ◀    ║  ┌──────────────────────────────────────────────────────────────┐ ║
║  🎓 Học bổng      ║  │ STT │ Tên tiêu chí          │ Điểm tối đa │ Mô tả  │ Thao tác│ ║
║  🔗 Tích hợp GD   ║  ├─────┼───────────────────────┼─────────────┼────────┼─────────┤ ║
║  ⚙️  Cấu hình     ║  │  1  │ Tinh thần học tập      │     30      │ ...    │[✏️][🗑️] │ ║
║                   ║  │  2  │ Chấp hành kỷ luật       │     25      │ ...    │[✏️][🗑️] │ ║
║                   ║  │  3  │ Tham gia hoạt động      │     20      │ ...    │[✏️][🗑️] │ ║
║                   ║  │  4  │ Đạo đức, lối sống       │     25      │ ...    │[✏️][🗑️] │ ║
║                   ║  │ ... │ ...                     │ ...         │ ...    │         │ ║
║                   ║  └──────────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 1  [Sau ▶]    Tổng: 4 tiêu chí   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Nút Thêm mới | Button (primary) | Mở SCR-02-004 (form thêm mới) |
| Nút Import Excel | Button (secondary) | Mở SCR-02-006 (luồng import) |
| Nút Kết xuất Excel | Button (secondary) | Tải về file Excel điểm rèn luyện |
| Bảng danh sách | Table | STT, Tên tiêu chí, Điểm tối đa, Mô tả, Thao tác |
| Nút Sửa (✏️) | Icon Button | Mở SCR-02-004 (form sửa) với dữ liệu đã điền sẵn |
| Nút Xóa (🗑️) | Icon Button | Hiển thị dialog xác nhận xóa |
| Phân trang | Pagination | Trước/Sau + số trang |

### Luồng điều hướng
- **Đến từ:** Sidebar "Điểm rèn luyện"
- **Đi đến:**
  - Nút Thêm mới → **SCR-02-004** (mode: Thêm mới)
  - Nút Sửa → **SCR-02-004** (mode: Cập nhật)
  - Nút Xóa → **Dialog xác nhận xóa** (inline popup)
  - Nút Import Excel → **SCR-02-006**
  - Nút Kết xuất → download file `.xlsx`

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Quyền `VIEW_TRAINING_POINT_CONFIG` để xem |
| BR-02 | Quyền `CREATE_TRAINING_POINT_CONFIG` để thêm |
| BR-03 | Quyền `EDIT_TRAINING_POINT_CONFIG` để sửa |
| BR-04 | Quyền `DELETE_TRAINING_POINT_CONFIG` để xóa |
| BR-05 | Xóa: hiện popup "Bạn có chắc muốn xóa?" → Đồng ý / Hủy |
| BR-06 | Xóa không được phép nếu tiêu chí đang có điểm học sinh đã nhập |
| BR-07 | Kết xuất Excel: bao gồm tất cả tiêu chí + điểm học sinh theo tiêu chí |

### API Endpoints (gợi ý)

```
GET    /api/v1/training-point-configs?page={p}&size={s}
POST   /api/v1/training-point-configs
PUT    /api/v1/training-point-configs/{id}
DELETE /api/v1/training-point-configs/{id}
GET    /api/v1/training-point-configs/export         # Kết xuất Excel
```

---

## SCR-02-004: Cấu hình điểm rèn luyện – Form Thêm mới / Cập nhật

### Mô tả
Form modal (hoặc trang riêng) cho phép CBQL thêm mới hoặc chỉnh sửa một tiêu chí cấu hình điểm rèn luyện.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════╗
║          CẤU HÌNH ĐIỂM RÈN LUYỆN – [THÊM MỚI / CẬP NHẬT]           ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║   Tên tiêu chí *                                                     ║
║   ┌────────────────────────────────────────────────────────────┐     ║
║   │  Nhập tên tiêu chí...                                      │     ║
║   └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║   Điểm tối đa *                                                      ║
║   ┌────────────────────────┐                                         ║
║   │  0                     │  (số nguyên ≥ 1)                        ║
║   └────────────────────────┘                                         ║
║                                                                      ║
║   Mô tả                                                              ║
║   ┌────────────────────────────────────────────────────────────┐     ║
║   │                                                            │     ║
║   │  (Textarea, tối đa 500 ký tự)                              │     ║
║   │                                                            │     ║
║   └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║   ┌────────────────────────────────────────────────────────────┐     ║
║   │  ⚠ [Thông báo lỗi hiển thị ở đây nếu có]                  │     ║
║   └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║              [Hủy]                       [💾 Lưu]                    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Bắt buộc | Mô tả |
|-----------|------|----------|-------|
| Tên tiêu chí | Text Input | ✅ | Tối đa 200 ký tự |
| Điểm tối đa | Number Input | ✅ | Số nguyên, min=1, max=100 |
| Mô tả | Textarea | ❌ | Tối đa 500 ký tự |
| Vùng thông báo lỗi | Alert (error) | — | Hiển thị khi có lỗi validate |
| Nút Hủy | Button (secondary) | — | Đóng form, quay lại SCR-02-003 |
| Nút Lưu | Button (primary) | — | Submit form |

### Luồng điều hướng
- **Đến từ:** SCR-02-003 (Thêm mới hoặc Sửa)
- **Đi đến:**
  - Lưu thành công → toast "Lưu thành công" + quay lại **SCR-02-003**
  - Hủy → quay lại **SCR-02-003** không lưu

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Tên tiêu chí: bắt buộc, không được trùng tên với tiêu chí đã có |
| BR-02 | Điểm tối đa: bắt buộc, phải là số nguyên dương (1–100) |
| BR-03 | Mô tả: không bắt buộc, tối đa 500 ký tự |
| BR-04 | Khi lỗi: highlight đỏ field sai + hiển thị thông báo cụ thể |
| BR-05 | Khi sửa: điền sẵn dữ liệu hiện tại vào form |
| BR-06 | Sau khi Lưu thành công: refresh danh sách SCR-02-003 |

### API Endpoints (gợi ý)

```
POST  /api/v1/training-point-configs          # Thêm mới
PUT   /api/v1/training-point-configs/{id}     # Cập nhật
```

---

## SCR-02-005: Nhập điểm rèn luyện cho từng học sinh

### Mô tả
CBQL chọn học sinh từ danh sách, sau đó nhập điểm rèn luyện theo từng tiêu chí đã cấu hình. Hỗ trợ cả xóa điểm đã nhập khi cần.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  NHẬP ĐIỂM RÈN LUYỆN CHO HỌC SINH                        ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📝 Điểm RL  ◀    ║  [← Quay lại Cấu hình ĐRL]                               ║
║                   ║                                                           ║
║                   ║  ┌─ CHỌN LỚP & HỌC SINH ────────────────────────────────┐ ║
║                   ║  │  Năm học: [2024-2025 ▼]  Lớp: [10A1 ▼]               │ ║
║                   ║  │  🔍 Tìm học sinh: [____________________]               │ ║
║                   ║  └──────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  ┌─ DANH SÁCH HỌC SINH ─────────────────────────────────┐ ║
║                   ║  │ STT │ Mã HS    │ Họ và tên       │ ĐRL HK1│ Thao tác  │ ║
║                   ║  ├─────┼──────────┼─────────────────┼────────┼───────────┤ ║
║                   ║  │  1  │ HS000101 │ Bùi Thị An      │  85    │[✏️ Nhập][🗑️]│ ║
║                   ║  │  2  │ HS000102 │ Đặng Văn Bình   │   —    │[✏️ Nhập]   │ ║
║                   ║  │  3  │ HS000103 │ Hoàng Thị Cúc   │  72    │[✏️ Nhập][🗑️]│ ║
║                   ║  └──────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  MODAL: NHẬP ĐIỂM – Bùi Thị An (HS000101)                                    ║
║  ─────────────────────────────────────────────────────────────────────────── ║
║                                                                               ║
║  Học kỳ: [Học kỳ 1 ▼]                                                         ║
║                                                                               ║
║  ┌──────────────────────────────────────────────────────┐                    ║
║  │ Tiêu chí               │ Điểm tối đa │ Điểm nhập    │                    ║
║  ├────────────────────────┼─────────────┼──────────────┤                    ║
║  │ Tinh thần học tập      │     30      │  [___]        │                    ║
║  │ Chấp hành kỷ luật      │     25      │  [___]        │                    ║
║  │ Tham gia hoạt động     │     20      │  [___]        │                    ║
║  │ Đạo đức, lối sống      │     25      │  [___]        │                    ║
║  ├────────────────────────┼─────────────┼──────────────┤                    ║
║  │ TỔNG                   │    100      │   85 / 100   │                    ║
║  └──────────────────────────────────────────────────────┘                    ║
║                                                                               ║
║  Xếp loại tự động: [Tốt ✅]                                                   ║
║                                                                               ║
║              [Hủy]                           [💾 Lưu điểm]                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Dropdown Năm học | Select | Chọn năm học |
| Dropdown Lớp | Select | Chọn lớp trong năm học đã chọn |
| Ô tìm kiếm học sinh | Text Input | Lọc học sinh theo tên/mã |
| Bảng danh sách học sinh | Table | STT, Mã HS, Họ tên, Điểm ĐRL hiện tại, Thao tác |
| Nút Nhập điểm (✏️) | Icon Button | Mở modal nhập điểm cho học sinh |
| Nút Xóa điểm (🗑️) | Icon Button | Xóa điểm đã nhập (hiện popup xác nhận) |
| Modal nhập điểm | Dialog | Chứa form chi tiết các tiêu chí |
| Dropdown Học kỳ | Select (in modal) | Chọn HK1/HK2 |
| Bảng tiêu chí điểm | Table (in modal) | Tiêu chí, Điểm tối đa, Ô nhập điểm |
| Tổng điểm (tự tính) | Label | Tự cộng khi nhập |
| Xếp loại tự động | Badge | Xuất xếp loại theo tổng điểm |
| Nút Hủy | Button (secondary) | Đóng modal |
| Nút Lưu điểm | Button (primary) | Lưu toàn bộ điểm |

### Luồng điều hướng
- **Đến từ:** SCR-02-003 (chức năng nhập điểm)
- **Đi đến:**
  - Lưu thành công → đóng modal, cập nhật cột ĐRL trong bảng
  - Hủy → đóng modal
  - Xóa điểm xác nhận xong → cột ĐRL hiển thị "—"

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Điểm từng tiêu chí: 0 ≤ điểm_nhập ≤ điểm_tối_đa |
| BR-02 | Tổng điểm được tính tự động = Σ (điểm_nhập) |
| BR-03 | Xếp loại tự động: Xuất sắc ≥ 90, Tốt 80–89, Khá 65–79, TB 50–64, Yếu < 50 |
| BR-04 | Không được bỏ trống bất kỳ tiêu chí nào khi nhấn Lưu |
| BR-05 | Xóa điểm: cần xác nhận, chỉ xóa được khi điểm chưa được phê duyệt |
| BR-06 | Quyền `INPUT_TRAINING_POINT` mới được nhập/xóa |

### API Endpoints (gợi ý)

```
GET    /api/v1/classes/{classId}/students/training-points?term={hk}
POST   /api/v1/students/{studentId}/training-points
DELETE /api/v1/students/{studentId}/training-points/{termId}
```

---

## SCR-02-006: Import điểm rèn luyện từ file Excel

### Mô tả
Luồng 3 bước: (1) Xem hướng dẫn & tải template Excel; (2) Upload file đã điền; (3) Xác nhận ghi dữ liệu vào hệ thống.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  IMPORT ĐIỂM RÈN LUYỆN TỪ FILE EXCEL                     ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📝 Điểm RL  ◀    ║  [← Quay lại]                                            ║
║                   ║                                                           ║
║                   ║  ●──────────────●──────────────●                         ║
║                   ║  1. Tải mẫu  2. Upload file  3. Xác nhận ghi              ║
║                   ║                                                           ║
║                   ║  ╔══ BƯỚC 1: TẢI BIỂU MẪU ════════════════════════════╗  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║  📋 Yêu cầu định dạng file:                         ║  ║
║                   ║  ║  • Định dạng: .xlsx hoặc .xls                       ║  ║
║                   ║  ║  • Cột bắt buộc: Mã HS, Họ tên, [tiêu chí 1..N]    ║  ║
║                   ║  ║  • Năm học: 2024-2025 | Học kỳ: [HK1 ▼]             ║  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║  [📥 Tải biểu mẫu Excel về máy]                     ║  ║
║                   ║  ║                                                     ║  ║
║                   ║  ╚═════════════════════════════════════════════════════╝  ║
║                   ║                                                           ║
║                   ║  ╔══ BƯỚC 2: UPLOAD FILE ═════════════════════════════╗  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║  ┌─ Khu vực kéo thả ───────────────────────────┐   ║  ║
║                   ║  ║  │                                              │   ║  ║
║                   ║  ║  │   📂  Kéo thả file vào đây                   │   ║  ║
║                   ║  ║  │       hoặc [Chọn file từ máy tính]           │   ║  ║
║                   ║  ║  │       (Chấp nhận: .xlsx, .xls – tối đa 5MB) │   ║  ║
║                   ║  ║  └──────────────────────────────────────────────┘   ║  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║  [File đã chọn: diem_ren_luyen_10A1.xlsx  ✅]       ║  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║  ┌─ Kết quả kiểm tra ─────────────────────────┐    ║  ║
║                   ║  ║  │ ✅ 38 bản ghi hợp lệ                        │    ║  ║
║                   ║  ║  │ ⚠️  2 bản ghi có lỗi: dòng 5, dòng 12      │    ║  ║
║                   ║  ║  │    [Xem chi tiết lỗi ▼]                     │    ║  ║
║                   ║  ║  └────────────────────────────────────────────┘    ║  ║
║                   ║  ╚═════════════════════════════════════════════════════╝  ║
║                   ║                                                           ║
║                   ║  ╔══ BƯỚC 3: GHI DỮ LIỆU ════════════════════════════╗  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║  ☑ Chỉ ghi các bản ghi hợp lệ (38 bản ghi)        ║  ║
║                   ║  ║  ○ Ghi đè lên dữ liệu đã có                       ║  ║
║                   ║  ║  ○ Bỏ qua bản ghi đã có điểm                      ║  ║
║                   ║  ║                                                     ║  ║
║                   ║  ║              [Hủy]        [✅ Ghi dữ liệu]          ║  ║
║                   ║  ╚═════════════════════════════════════════════════════╝  ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Stepper (3 bước) | Progress Indicator | Hiển thị tiến trình bước 1 → 2 → 3 |
| Dropdown Học kỳ | Select | Chọn HK1/HK2 cho import |
| Nút Tải biểu mẫu | Button (secondary) | Tải file template Excel về máy |
| Khu vực drag-drop | File Dropzone | Kéo thả hoặc browse file |
| Nút Chọn file | Button (secondary) | Mở hộp thoại file |
| Label file đã chọn | Text | Tên file + icon trạng thái |
| Vùng kết quả kiểm tra | Alert Panel | Số bản ghi hợp lệ/lỗi + link xem chi tiết |
| Chi tiết lỗi (collapse) | Expandable | Danh sách dòng lỗi + mô tả lỗi |
| Radio ghi đè / bỏ qua | Radio Group | Chiến lược khi trùng dữ liệu |
| Nút Hủy | Button (secondary) | Quay lại SCR-02-003 |
| Nút Ghi dữ liệu | Button (primary) | Confirm ghi vào DB |
| Toast thành công | Notification | "Import thành công X bản ghi" |

### Luồng điều hướng
- **Đến từ:** SCR-02-003 (nút "Import Excel")
- **Đi đến:**
  - Ghi thành công → toast + quay lại **SCR-02-003**
  - Hủy → **SCR-02-003**

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | File upload: chấp nhận .xlsx / .xls, tối đa 5MB |
| BR-02 | Kiểm tra cột: phải có cột Mã HS và các cột tiêu chí khớp cấu hình |
| BR-03 | Điểm mỗi tiêu chí: 0 ≤ điểm ≤ điểm_tối_đa (theo cấu hình) |
| BR-04 | Mã HS phải tồn tại trong hệ thống |
| BR-05 | Nếu chọn "Bỏ qua bản ghi đã có điểm": skip các hàng đã có điểm |
| BR-06 | Nếu chọn "Ghi đè": replace điểm cũ bằng điểm mới |
| BR-07 | Hiển thị số bản ghi hợp lệ / lỗi sau khi upload |
| BR-08 | Quyền `IMPORT_TRAINING_POINT` |

### API Endpoints (gợi ý)

```
GET  /api/v1/training-point-configs/template        # Tải template Excel
POST /api/v1/training-points/validate               # Validate file, trả về preview
POST /api/v1/training-points/import                 # Ghi dữ liệu vào DB
```

---

## SCR-02-007: Cấu hình học bổng – Quản lý mức học bổng

### Mô tả
CBQL quản lý các mức học bổng (tên mức, điều kiện, giá trị). Hỗ trợ thêm mới, sửa, xóa mức học bổng.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  CẤU HÌNH HỌC BỔNG                                        ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📊 Dashboard     ║  [Tab: Mức học bổng ●] [Tab: Đợt xét tuyển]               ║
║  📝 Điểm RL       ║  ─────────────────────────────────────────────────────── ║
║  🎓 Học bổng ◀    ║                                                           ║
║  🔗 Tích hợp GD   ║  [＋ Thêm mới mức học bổng]                               ║
║  ⚙️  Cấu hình     ║                                                           ║
║                   ║  ┌────────────────────────────────────────────────────────────────┐ ║
║                   ║  │ STT │ Tên mức          │ Điều kiện GPA │ Giá trị (VNĐ) │ Thao tác│ ║
║                   ║  ├─────┼──────────────────┼───────────────┼───────────────┼─────────┤ ║
║                   ║  │  1  │ Học bổng loại A   │  GPA ≥ 9.0   │  3,000,000    │[✏️][🗑️] │ ║
║                   ║  │  2  │ Học bổng loại B   │  GPA ≥ 8.0   │  2,000,000    │[✏️][🗑️] │ ║
║                   ║  │  3  │ Học bổng loại C   │  GPA ≥ 7.0   │  1,000,000    │[✏️][🗑️] │ ║
║                   ║  └────────────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 1  [Sau ▶]    Tổng: 3 mức        ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ┌─────────── FORM THÊM / SỬA MỨC HỌC BỔNG ─────────────────────────────────┐
  │                                                                             │
  │  Tên mức học bổng *   [_________________________________]                   │
  │                                                                             │
  │  Điều kiện GPA tối thiểu *   [____]  (0.0 – 10.0)                         │
  │                                                                             │
  │  Giá trị học bổng (VNĐ) *    [____________________]                        │
  │                                                                             │
  │  Mô tả                        [_________________________________]           │
  │                                                                             │
  │              [Hủy]                           [💾 Lưu]                       │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Tabs | Tab Bar | Tab "Mức học bổng" | "Đợt xét tuyển" |
| Nút Thêm mới | Button (primary) | Mở form thêm mới (inline hoặc modal) |
| Bảng mức học bổng | Table | STT, Tên mức, Điều kiện GPA, Giá trị, Thao tác |
| Nút Sửa (✏️) | Icon Button | Mở form sửa |
| Nút Xóa (🗑️) | Icon Button | Confirm xóa |
| Form thêm/sửa | Modal/Inline Form | Tên, GPA tối thiểu, Giá trị (VNĐ), Mô tả |
| Phân trang | Pagination | Trước/Sau |

### Luồng điều hướng
- **Đến từ:** Sidebar "Học bổng"
- **Đi đến:**
  - Tab "Đợt xét tuyển" → **SCR-02-008**
  - Sửa/Thêm → form inline/modal trên cùng trang

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Tên mức: bắt buộc, không trùng |
| BR-02 | GPA: số thực 0.0 – 10.0, bắt buộc |
| BR-03 | Giá trị học bổng: số nguyên dương, đơn vị VNĐ, bắt buộc |
| BR-04 | Xóa: không được xóa mức đang có đợt xét tuyển tham chiếu |
| BR-05 | Quyền `MANAGE_SCHOLARSHIP_CONFIG` |

### API Endpoints (gợi ý)

```
GET    /api/v1/scholarship-levels?page={p}&size={s}
POST   /api/v1/scholarship-levels
PUT    /api/v1/scholarship-levels/{id}
DELETE /api/v1/scholarship-levels/{id}
```

---

## SCR-02-008: Cấu hình học bổng – Quản lý đợt xét tuyển

### Mô tả
CBQL quản lý các đợt xét tuyển học bổng theo từng học kỳ. Hỗ trợ lọc theo từ khóa, theo học kỳ; thêm/sửa/xóa đợt; xem danh sách học sinh đạt học bổng trong mỗi đợt.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  CẤU HÌNH HỌC BỔNG                                        ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  🎓 Học bổng ◀    ║  [Tab: Mức học bổng] [Tab: Đợt xét tuyển ●]               ║
║                   ║  ─────────────────────────────────────────────────────── ║
║                   ║                                                           ║
║                   ║  [＋ Thêm đợt xét tuyển]                                  ║
║                   ║                                                           ║
║                   ║  ┌─ BỘ LỌC ─────────────────────────────────────────────┐ ║
║                   ║  │  🔍 Tìm kiếm: [____________________]                  │ ║
║                   ║  │  Học kỳ:     [Tất cả               ▼]                 │ ║
║                   ║  │                         [Tìm kiếm]  [Làm mới]         │ ║
║                   ║  └──────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  Hiển thị: [10 ▼] bản ghi/trang         Tổng: 6 đợt    ║
║                   ║                                                           ║
║                   ║  ┌───────────────────────────────────────────────────────────────────┐ ║
║                   ║  │ STT │ Tên đợt          │ Học kỳ │ Thời gian xét │ Trạng thái │ Thao tác │ ║
║                   ║  ├─────┼──────────────────┼────────┼──────────────┼────────────┼──────────┤ ║
║                   ║  │  1  │ Đợt 1 HK1 2024   │  HK1   │ 01–15/01/25  │ ✅ Đã xét  │[👁️][✏️][🗑️]│ ║
║                   ║  │  2  │ Đợt 2 HK1 2024   │  HK1   │ 16–31/01/25  │ 🕐 Chờ xét │[👁️][✏️][🗑️]│ ║
║                   ║  │  3  │ Đợt 1 HK2 2024   │  HK2   │ 01–15/05/25  │ 📅 Chưa bắt│[👁️][✏️][🗑️]│ ║
║                   ║  └───────────────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 1  [Sau ▶]    Tổng: 3 đợt       ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Tabs | Tab Bar | "Mức học bổng" \| "Đợt xét tuyển" |
| Nút Thêm đợt | Button (primary) | Mở form thêm đợt xét tuyển |
| Ô tìm kiếm | Text Input | Tìm theo tên đợt |
| Dropdown Học kỳ | Select | HK1 / HK2 / Tất cả |
| Dropdown số bản ghi | Select | 10/20/50/100 |
| Bảng đợt xét tuyển | Table | STT, Tên đợt, Học kỳ, Thời gian, Trạng thái, Thao tác |
| Badge Trạng thái | Colored Badge | ✅ Đã xét / 🕐 Chờ / 📅 Chưa bắt đầu |
| Nút Xem (👁️) | Icon Button | → SCR-02-009 |
| Nút Sửa (✏️) | Icon Button | Mở form sửa |
| Nút Xóa (🗑️) | Icon Button | Confirm xóa |
| Phân trang | Pagination | Trước/Sau + số trang |

### Form Thêm/Sửa đợt xét tuyển (modal)

```
  ┌──────────────── THÊM / SỬA ĐỢT XÉT TUYỂN HỌC BỔNG ───────────────────────┐
  │                                                                             │
  │  Tên đợt *          [_______________________________________]               │
  │                                                                             │
  │  Học kỳ *           [Học kỳ 1 ▼]                                           │
  │                                                                             │
  │  Năm học *          [2024-2025 ▼]                                           │
  │                                                                             │
  │  Thời gian bắt đầu xét *   [📅 dd/mm/yyyy]                                  │
  │  Thời gian kết thúc xét *  [📅 dd/mm/yyyy]                                  │
  │                                                                             │
  │  Mức học bổng áp dụng *    [Loại A ▼]  [Loại B ▼]  [＋ Thêm mức]           │
  │                                                                             │
  │  Mô tả               [___________________________________________]           │
  │                                                                             │
  │              [Hủy]                               [💾 Lưu]                   │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### Luồng điều hướng
- **Đến từ:** SCR-02-007 (tab "Đợt xét tuyển")
- **Đi đến:**
  - Nút Xem (👁️) → **SCR-02-009** (Danh sách HS đạt học bổng)
  - Lưu/Hủy form → giữ nguyên trang

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Tên đợt: bắt buộc, không trùng trong cùng học kỳ |
| BR-02 | Ngày kết thúc phải sau ngày bắt đầu |
| BR-03 | Học kỳ + Năm học: bắt buộc |
| BR-04 | Mức học bổng áp dụng: chọn ít nhất 1 mức |
| BR-05 | Xóa: không xóa đợt đã ở trạng thái "Đã xét" |
| BR-06 | Lọc theo từ khóa: tìm trên tên đợt (không phân biệt hoa thường) |
| BR-07 | Quyền `MANAGE_SCHOLARSHIP_PERIOD` |

### API Endpoints (gợi ý)

```
GET    /api/v1/scholarship-periods?keyword={kw}&term={hk}&page={p}&size={s}
POST   /api/v1/scholarship-periods
PUT    /api/v1/scholarship-periods/{id}
DELETE /api/v1/scholarship-periods/{id}
```

---

## SCR-02-009: Danh sách học sinh đạt học bổng trong đợt xét duyệt

### Mô tả
Xem danh sách học sinh đủ điều kiện và được xét học bổng trong một đợt cụ thể. Hỗ trợ kết xuất danh sách ra file Excel.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  HỌC SINH ĐẠT HỌC BỔNG – Đợt 1 HK1 2024                 ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  🎓 Học bổng ◀    ║  [← Quay lại Đợt xét tuyển]                              ║
║                   ║                                                           ║
║                   ║  ┌─ THÔNG TIN ĐỢT ───────────────────────────────────────┐ ║
║                   ║  │  Đợt: Đợt 1 HK1 2024 | Học kỳ: HK1 | Năm: 2024-2025  │ ║
║                   ║  │  Thời gian xét: 01/01/2025 – 15/01/2025               │ ║
║                   ║  │  Trạng thái: ✅ Đã xét | Tổng HS đạt: 42 học sinh     │ ║
║                   ║  └──────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [📤 Kết xuất Excel]                                      ║
║                   ║                                                           ║
║                   ║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║                   ║  │ STT │ Mã HS    │ Họ và tên       │ Lớp  │ GPA  │ Mức HB  │ Giá trị │ ║
║                   ║  ├─────┼──────────┼─────────────────┼──────┼──────┼─────────┼─────────┤ ║
║                   ║  │  1  │ HS000201 │ Nguyễn Anh Khoa │ 11A1 │ 9.2  │ Loại A  │ 3,000,000│ ║
║                   ║  │  2  │ HS000345 │ Trần Bích Ngọc  │ 10A3 │ 8.5  │ Loại B  │ 2,000,000│ ║
║                   ║  │  3  │ HS000512 │ Lê Hoàng Phúc   │ 12B2 │ 7.8  │ Loại C  │ 1,000,000│ ║
║                   ║  │ ... │ ...      │ ...             │ ...  │ ...  │ ...     │ ...      │ ║
║                   ║  └─────────────────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 5  [Sau ▶]    Tổng: 42 bản ghi   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Breadcrumb / Back button | Link | "← Quay lại Đợt xét tuyển" → SCR-02-008 |
| Panel thông tin đợt | Info Card | Tên đợt, học kỳ, thời gian, trạng thái, tổng số |
| Nút Kết xuất Excel | Button (secondary) | Tải file danh sách học bổng |
| Bảng học sinh | Table | STT, Mã HS, Họ tên, Lớp, GPA, Mức HB, Giá trị |
| Phân trang | Pagination | Trước/Sau + số trang |
| Badge tổng số | Text | Tổng HS đạt học bổng |

### Luồng điều hướng
- **Đến từ:** SCR-02-008 (nút Xem 👁️ trên đợt xét tuyển)
- **Đi đến:**
  - Back → **SCR-02-008**
  - Kết xuất → download file `.xlsx`

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Quyền `VIEW_SCHOLARSHIP_STUDENTS` |
| BR-02 | Danh sách chỉ gồm học sinh đủ điều kiện GPA theo mức học bổng của đợt |
| BR-03 | Kết xuất Excel: đầy đủ thông tin bảng + thông tin đợt xét |
| BR-04 | Nếu đợt chưa xét: hiển thị trạng thái "Đợt này chưa có kết quả xét tuyển" |

### API Endpoints (gợi ý)

```
GET  /api/v1/scholarship-periods/{id}/students?page={p}&size={s}
GET  /api/v1/scholarship-periods/{id}/students/export    # Kết xuất Excel
```

---

## SCR-02-010: Kết nối GDĐT – Cấu hình kết nối LGSP/NGSP

### Mô tả
Màn hình cấu hình tham số kết nối đến hệ thống Sở GD&ĐT qua gateway LGSP/NGSP. Cho phép kiểm tra kết nối, lưu thông số cấu hình (endpoint URL, API key, token...).

### Actors
- CBQL (vai trò quản trị hệ thống)

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  TÍCH HỢP HỆ THỐNG SỞ GD&ĐT                               ║
║  ─────────────    ║  ─────────────────────────────────────────────────────── ║
║  📊 Dashboard     ║  [Tab: Cấu hình kết nối ●] [Tab: Đồng bộ dữ liệu] [Tab: Lịch sử] ║
║  🔗 Tích hợp  ◀   ║  ─────────────────────────────────────────────────────── ║
║  ⚙️  Cấu hình     ║                                                           ║
║                   ║  ┌─ TRẠNG THÁI KẾT NỐI ──────────────────────────────────┐ ║
║                   ║  │                                                         │ ║
║                   ║  │   🟢 Đang kết nối    Sở GD&ĐT – LGSP Gateway            │ ║
║                   ║  │   Kiểm tra lần cuối: 11/03/2026 08:30:15               │ ║
║                   ║  │                              [🔄 Kiểm tra ngay]         │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  ┌─ THÔNG SỐ KẾT NỐI ────────────────────────────────────┐ ║
║                   ║  │                                                         │ ║
║                   ║  │  Môi trường:  ● Production  ○ Staging  ○ Development    │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Endpoint URL Sở GD&ĐT *                                │ ║
║                   ║  │  ┌───────────────────────────────────────────────────┐  │ ║
║                   ║  │  │  https://lgsp.gddt.tinhXY.gov.vn/api/v1          │  │ ║
║                   ║  │  └───────────────────────────────────────────────────┘  │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Client ID *                                             │ ║
║                   ║  │  ┌───────────────────────────────────────────────────┐  │ ║
║                   ║  │  │  truong_thpt_xyz_001                              │  │ ║
║                   ║  │  └───────────────────────────────────────────────────┘  │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Client Secret *                            [👁 Hiện]    │ ║
║                   ║  │  ┌───────────────────────────────────────────────────┐  │ ║
║                   ║  │  │  ••••••••••••••••••••••••••••••••••••••          │  │ ║
║                   ║  │  └───────────────────────────────────────────────────┘  │ ║
║                   ║  │                                                         │ ║
║                   ║  │  API Token                                [🔁 Làm mới]   │ ║
║                   ║  │  ┌───────────────────────────────────────────────────┐  │ ║
║                   ║  │  │  eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...        │  │ ║
║                   ║  │  └───────────────────────────────────────────────────┘  │ ║
║                   ║  │  Hết hạn: 15/04/2026 00:00:00  ⚠️ Còn 35 ngày          │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Timeout (giây):  [30    ]   Retry (lần):  [3     ]     │ ║
║                   ║  │                                                         │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  ┌─ PHẠM VI DỮ LIỆU ĐỒNG BỘ ─────────────────────────────┐ ║
║                   ║  │  ☑ Dữ liệu học sinh     ☑ Dữ liệu giáo viên            │ ║
║                   ║  │  ☑ Danh sách lớp         ☐ Điểm số                     │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║              [↺ Kiểm tra kết nối]     [💾 Lưu cấu hình]   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Tabs | Tab Bar | Cấu hình kết nối \| Đồng bộ dữ liệu \| Lịch sử |
| Panel trạng thái | Status Card | Đèn xanh/đỏ/vàng + thời gian kiểm tra cuối |
| Nút Kiểm tra ngay | Button (secondary) | Ping API Sở GD&ĐT, cập nhật trạng thái |
| Radio Môi trường | Radio Group | Production / Staging / Development |
| Endpoint URL | Text Input | URL gateway LGSP/NGSP |
| Client ID | Text Input | ID đăng ký với Sở |
| Client Secret | Password Input | Ẩn theo mặc định, có nút 👁 Hiện |
| API Token | Readonly Textarea | Token hiện tại |
| Nút Làm mới token | Button (link) | Gọi refresh token API |
| Thông báo hết hạn | Alert (warning) | Cảnh báo khi token < 30 ngày |
| Timeout / Retry | Number Input | Cấu hình kỹ thuật |
| Checkboxes phạm vi | Checkbox Group | Học sinh / Giáo viên / Lớp / Điểm số |
| Nút Kiểm tra kết nối | Button (secondary) | Test ping |
| Nút Lưu cấu hình | Button (primary) | Lưu vào DB |

### Luồng điều hướng
- **Đến từ:** Sidebar "Tích hợp GD" → Tab "Cấu hình kết nối"
- **Đi đến:**
  - Tab "Đồng bộ dữ liệu" → **SCR-02-011**
  - Tab "Lịch sử" → **SCR-02-012**

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Chỉ Quản trị viên hệ thống mới có quyền `MANAGE_INTEGRATION_CONFIG` |
| BR-02 | Endpoint URL: định dạng URL hợp lệ, bắt buộc |
| BR-03 | Client ID và Client Secret: bắt buộc |
| BR-04 | Client Secret: không hiển thị plaintext mặc định |
| BR-05 | Khi Kiểm tra kết nối: thực hiện HTTP ping, hiển thị kết quả trong 10 giây |
| BR-06 | Trạng thái kết nối: 🟢 OK (< 200ms), 🟡 Chậm (200–1000ms), 🔴 Lỗi |
| BR-07 | Cảnh báo token hết hạn khi còn ≤ 30 ngày |
| BR-08 | Lưu cấu hình: mã hóa Client Secret trước khi lưu DB |
| BR-09 | Phạm vi đồng bộ phải chọn ít nhất 1 loại dữ liệu |

### API Endpoints (gợi ý)

```
GET    /api/v1/gddt-integration/config
PUT    /api/v1/gddt-integration/config
POST   /api/v1/gddt-integration/test-connection    # Ping
POST   /api/v1/gddt-integration/refresh-token      # Làm mới token
```

---

## SCR-02-011: Kết nối GDĐT – Kích hoạt đồng bộ dữ liệu

### Mô tả
Cho phép CBQL hoặc hệ thống kích hoạt quá trình đồng bộ dữ liệu (học sinh, giáo viên, lớp học) từ/đến Sở GD&ĐT. Hiển thị tiến trình real-time và kết quả đồng bộ.

### Actors
- CBQL, Hệ thống (có thể chạy tự động theo lịch)

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  TÍCH HỢP HỆ THỐNG SỞ GD&ĐT                               ║
║  ─────────────    ║  [Tab: Cấu hình kết nối] [Tab: Đồng bộ dữ liệu ●] [Tab: Lịch sử] ║
║  🔗 Tích hợp  ◀   ║  ─────────────────────────────────────────────────────── ║
║                   ║                                                           ║
║                   ║  ┌─ ĐỒNG BỘ THỦ CÔNG ────────────────────────────────────┐ ║
║                   ║  │                                                         │ ║
║                   ║  │  Loại dữ liệu:                                          │ ║
║                   ║  │  ☑ Danh sách học sinh    ☑ Danh sách giáo viên          │ ║
║                   ║  │  ☑ Danh sách lớp học     ☐ Dữ liệu trường học           │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Năm học áp dụng:  [2024-2025 ▼]                        │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Chế độ đồng bộ:                                        │ ║
║                   ║  │  ● Chỉ lấy dữ liệu mới (incremental)                   │ ║
║                   ║  │  ○ Đồng bộ toàn bộ (full sync)                          │ ║
║                   ║  │                                                         │ ║
║                   ║  │              [🔄 Bắt đầu đồng bộ]                       │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  ┌─ TIẾN TRÌNH ĐỒNG BỘ ──────────────────────────────────┐ ║
║                   ║  │                                                         │ ║
║                   ║  │  Trạng thái: 🔄 Đang đồng bộ... (bắt đầu 08:45:02)     │ ║
║                   ║  │                                                         │ ║
║                   ║  │  ✅ Học sinh       [████████████████████░░] 80%  (320/400)│ ║
║                   ║  │  🔄 Giáo viên      [████████░░░░░░░░░░░░░░] 40%  (20/50) │ ║
║                   ║  │  ⏳ Lớp học        [░░░░░░░░░░░░░░░░░░░░░░]  0%  Chờ... │ ║
║                   ║  │                                                         │ ║
║                   ║  │  Thời gian ước tính còn lại: ~2 phút                   │ ║
║                   ║  │                                        [⏹ Dừng lại]     │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  ┌─ KẾT QUẢ ĐỢT ĐỒNG BỘ CUỐI ────────────────────────────┐ ║
║                   ║  │                                                         │ ║
║                   ║  │  Thời gian: 11/03/2026 08:30:00 → 08:32:45             │ ║
║                   ║  │  ✅ Học sinh:  400 bản ghi – 395 thành công, 5 lỗi      │ ║
║                   ║  │  ✅ Giáo viên:  50 bản ghi – 50 thành công              │ ║
║                   ║  │  ✅ Lớp học:    24 lớp   – 24 thành công                │ ║
║                   ║  │                              [📋 Xem log chi tiết]       │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  ┌─ LỊCH ĐỒNG BỘ TỰ ĐỘNG ────────────────────────────────┐ ║
║                   ║  │  ☑ Bật đồng bộ tự động                                 │ ║
║                   ║  │  Tần suất: ● Hàng ngày  ○ Hàng tuần  ○ Theo giờ        │ ║
║                   ║  │  Giờ chạy: [02:00 ▼]                                    │ ║
║                   ║  │                              [💾 Lưu lịch]              │ ║
║                   ║  └─────────────────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Checkboxes loại dữ liệu | Checkbox Group | Học sinh / Giáo viên / Lớp học / Trường |
| Dropdown Năm học | Select | Chọn năm học áp dụng |
| Radio chế độ đồng bộ | Radio Group | Incremental / Full sync |
| Nút Bắt đầu đồng bộ | Button (primary) | Kích hoạt đồng bộ thủ công |
| Progress bars | Progress Bar | Tiến trình từng loại dữ liệu |
| Trạng thái real-time | Status Label | Đang đồng bộ / Hoàn thành / Lỗi |
| Nút Dừng lại | Button (danger) | Hủy quá trình đang chạy |
| Panel kết quả cuối | Summary Card | Số bản ghi thành công/lỗi của đợt cuối |
| Link Xem log | Link | → SCR-02-012 lọc theo đợt đồng bộ vừa chạy |
| Checkbox bật tự động | Checkbox | Bật/tắt lịch tự động |
| Radio tần suất | Radio Group | Hàng ngày / Hàng tuần / Theo giờ |
| Dropdown giờ chạy | Select | Chọn giờ chạy tự động |
| Nút Lưu lịch | Button (primary) | Lưu cấu hình lịch |

### Luồng điều hướng
- **Đến từ:** Tab "Đồng bộ dữ liệu" từ SCR-02-010
- **Đi đến:**
  - Link "Xem log chi tiết" → **SCR-02-012**
  - Tab "Lịch sử" → **SCR-02-012**

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Kết nối phải ở trạng thái 🟢 OK trước khi cho phép đồng bộ |
| BR-02 | Phải chọn ít nhất 1 loại dữ liệu |
| BR-03 | Chỉ 1 tiến trình đồng bộ được chạy tại một thời điểm |
| BR-04 | Nút "Bắt đầu" bị disable trong khi đang đồng bộ |
| BR-05 | Nút "Dừng lại": dừng an toàn, ghi log trạng thái "Bị hủy" |
| BR-06 | Hệ thống ghi log đầy đủ: thời gian bắt đầu/kết thúc, số bản ghi, lỗi |
| BR-07 | Full sync: thực hiện replace toàn bộ dữ liệu loại đó |
| BR-08 | Incremental: chỉ lấy bản ghi có `updated_at` mới hơn lần sync cuối |
| BR-09 | Lịch tự động: chạy vào giờ ít traffic (khuyến nghị 02:00 – 04:00) |
| BR-10 | Quyền `SYNC_GDDT_DATA` |

### API Endpoints (gợi ý)

```
POST   /api/v1/gddt-integration/sync                    # Kích hoạt đồng bộ
DELETE /api/v1/gddt-integration/sync/current            # Dừng đồng bộ
GET    /api/v1/gddt-integration/sync/status             # Trạng thái real-time (polling/WebSocket)
GET    /api/v1/gddt-integration/sync/last-result        # Kết quả đợt cuối
PUT    /api/v1/gddt-integration/schedule                # Lưu lịch tự động
GET    /api/v1/gddt-integration/schedule                # Xem lịch hiện tại
```

---

## SCR-02-012: Lịch sử đồng bộ / Log

### Mô tả
Hiển thị toàn bộ lịch sử các đợt đồng bộ dữ liệu với Sở GD&ĐT. Hỗ trợ lọc theo thời gian, loại dữ liệu, trạng thái. Xem chi tiết lỗi từng bản ghi.

### Actors
- CBQL

### Layout

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🏫 HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC           [👤 Nguyễn Văn A ▼] [🔔] [Đăng xuất] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Sidebar          ║  TÍCH HỢP HỆ THỐNG SỞ GD&ĐT                               ║
║  ─────────────    ║  [Tab: Cấu hình] [Tab: Đồng bộ] [Tab: Lịch sử ●]           ║
║  🔗 Tích hợp  ◀   ║  ─────────────────────────────────────────────────────── ║
║                   ║                                                           ║
║                   ║  ┌─ BỘ LỌC ─────────────────────────────────────────────┐ ║
║                   ║  │  Từ ngày: [📅 dd/mm/yyyy]   Đến ngày: [📅 dd/mm/yyyy] │ ║
║                   ║  │  Loại dữ liệu: [Tất cả       ▼]                        │ ║
║                   ║  │  Trạng thái:   [Tất cả       ▼]                        │ ║
║                   ║  │  Kích hoạt bởi:[Tất cả       ▼]                        │ ║
║                   ║  │                    [🔍 Lọc]   [↺ Làm mới]              │ ║
║                   ║  └──────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  Hiển thị: [20 ▼] bản ghi/trang      Tổng: 128 đợt       ║
║                   ║                                                           ║
║                   ║  ┌──────────────────────────────────────────────────────────────────────────┐ ║
║                   ║  │ #  │ Thời gian bắt đầu │ Thời lượng│ Loại DL  │ Trạng thái│ Tổng│ Lỗi │ Chi tiết │ ║
║                   ║  ├────┼──────────────────┼───────────┼──────────┼───────────┼─────┼─────┼──────────┤ ║
║                   ║  │128 │ 11/03/26 08:30   │  2m 45s   │ HS+GV+Lớp│ ✅ Thành công│ 474 │  5  │  [📋]    │ ║
║                   ║  │127 │ 10/03/26 02:00   │  3m 12s   │ HS+GV+Lớp│ ✅ Thành công│ 474 │  0  │  [📋]    │ ║
║                   ║  │126 │ 09/03/26 02:00   │   45s     │ HS       │ ❌ Lỗi kết nối│  0  │  —  │  [📋]    │ ║
║                   ║  │125 │ 08/03/26 14:22   │  1m 05s   │ GV       │ ⚠️ Bị hủy  │  28 │  0  │  [📋]    │ ║
║                   ║  │ .. │ ...              │ ...       │ ...      │ ...       │ ... │ ... │  [📋]    │ ║
║                   ║  └──────────────────────────────────────────────────────────────────────────┘ ║
║                   ║                                                           ║
║                   ║  [◀ Trước]  Trang 1 / 7  [Sau ▶]    Tổng: 128 bản ghi  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  (Panel chi tiết – mở khi click [📋])                                         ║
║                                                                               ║
║  ┌─ CHI TIẾT ĐỢT ĐỒNG BỘ #128 ────────────────────────────────────────────┐   ║
║  │  Bắt đầu: 11/03/2026 08:30:00  |  Kết thúc: 08:32:45  |  Thời lượng: 2m 45s  ║
║  │  Kích hoạt bởi: Nguyễn Văn A (thủ công)                                │   ║
║  │  Chế độ: Incremental                                                    │   ║
║  │                                                                         │   ║
║  │  ┌──────────────┬──────────┬──────────┬──────────┬──────────────────┐   │   ║
║  │  │ Loại dữ liệu │ Tổng     │ Thành công│ Thất bại │ Ghi chú          │   │   ║
║  │  ├──────────────┼──────────┼──────────┼──────────┼──────────────────┤   │   ║
║  │  │ Học sinh     │ 400      │ 395      │ 5        │ Xem lỗi ▼        │   │   ║
║  │  │ Giáo viên    │  50      │  50      │ 0        │ OK               │   │   ║
║  │  │ Lớp học      │  24      │  24      │ 0        │ OK               │   │   ║
║  │  └──────────────┴──────────┴──────────┴──────────┴──────────────────┘   │   ║
║  │                                                                         │   ║
║  │  ▼ CHI TIẾT LỖI HỌC SINH (5 bản ghi)                                   │   ║
║  │  ┌──────────┬────────────────────────────────────────────────────────┐  │   ║
║  │  │ Mã HS    │ Lỗi                                                    │  │   ║
║  │  ├──────────┼────────────────────────────────────────────────────────┤  │   ║
║  │  │ HS009901 │ Không tìm thấy mã HS trong hệ thống Sở GD&ĐT          │  │   ║
║  │  │ HS009902 │ Dữ liệu ngày sinh không hợp lệ (format: 30/02/2010)   │  │   ║
║  │  │ HS009903 │ Trùng CMND với học sinh HS000123                       │  │   ║
║  │  └──────────┴────────────────────────────────────────────────────────┘  │   ║
║  │                                           [📤 Xuất log lỗi Excel]        │   ║
║  └─────────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Danh sách Components

| Component | Loại | Mô tả |
|-----------|------|-------|
| Tabs | Tab Bar | Cấu hình kết nối \| Đồng bộ dữ liệu \| Lịch sử |
| Date Picker "Từ ngày" | Date Input | Lọc từ ngày |
| Date Picker "Đến ngày" | Date Input | Lọc đến ngày |
| Dropdown Loại dữ liệu | Select | HS / GV / Lớp / Tất cả |
| Dropdown Trạng thái | Select | Thành công / Lỗi / Bị hủy / Tất cả |
| Dropdown Kích hoạt bởi | Select | Tự động / Thủ công / Tất cả |
| Nút Lọc | Button (primary) | Áp dụng bộ lọc |
| Nút Làm mới | Button (secondary) | Reset bộ lọc |
| Dropdown số bản ghi | Select | 10/20/50/100 |
| Bảng lịch sử | Table | #, Thời gian, Thời lượng, Loại DL, Trạng thái, Tổng, Lỗi, Chi tiết |
| Badge Trạng thái | Colored Badge | ✅ Thành công / ❌ Lỗi / ⚠️ Bị hủy |
| Nút Chi tiết (📋) | Icon Button | Mở panel chi tiết bên dưới (expand inline) |
| Panel chi tiết | Expandable Section | Bảng chi tiết theo loại DL + bảng lỗi |
| Bảng lỗi chi tiết | Table (in panel) | Mã HS/GV + mô tả lỗi |
| Nút Xuất log lỗi | Button (secondary) | Tải Excel danh sách lỗi |
| Phân trang | Pagination | Trước/Sau + số trang |

### Luồng điều hướng
- **Đến từ:**
  - Tab "Lịch sử" từ SCR-02-010 / SCR-02-011
  - Link "Xem log chi tiết" từ SCR-02-011
- **Đi đến:**
  - Nút Xuất log lỗi → download file `.xlsx`

### Business Rules / Validation

| # | Quy tắc |
|---|---------|
| BR-01 | Quyền `VIEW_SYNC_HISTORY` |
| BR-02 | Mặc định hiển thị 7 ngày gần nhất, sắp xếp mới nhất lên đầu |
| BR-03 | Khoảng thời gian lọc: không vượt quá 12 tháng |
| BR-04 | "Đến ngày" phải ≥ "Từ ngày" |
| BR-05 | Panel chi tiết chỉ mở 1 đợt tại một thời điểm |
| BR-06 | Log được giữ tối thiểu 12 tháng |
| BR-07 | Xuất log lỗi: chỉ xuất bản ghi lỗi của đợt đang xem chi tiết |
| BR-08 | Kích hoạt bởi "Tự động" = job scheduler; "Thủ công" = user cụ thể |

### API Endpoints (gợi ý)

```
GET  /api/v1/gddt-integration/sync/history
     ?from={date}&to={date}&dataType={type}&status={status}
     &triggeredBy={auto|manual}&page={p}&size={s}
GET  /api/v1/gddt-integration/sync/history/{syncId}          # Chi tiết đợt
GET  /api/v1/gddt-integration/sync/history/{syncId}/errors   # Danh sách lỗi
GET  /api/v1/gddt-integration/sync/history/{syncId}/errors/export  # Xuất Excel
```

---

## Phụ lục A: Luồng điều hướng tổng thể (Navigation Flow)

```
[Login] ──→ [Dashboard]
               │
               ├──→ [SCR-02-001: Danh sách lớp học]
               │           │
               │           └──→ [SCR-02-002: DS học sinh trong lớp]
               │
               ├──→ [SCR-02-003: Cấu hình ĐRL – Danh sách]
               │           ├──→ [SCR-02-004: Form thêm/sửa cấu hình ĐRL]
               │           ├──→ [SCR-02-005: Nhập điểm RL từng học sinh]
               │           └──→ [SCR-02-006: Import ĐRL từ Excel]
               │
               ├──→ [SCR-02-007: Mức học bổng]
               │           └──→ [SCR-02-008: Đợt xét tuyển học bổng]
               │                         └──→ [SCR-02-009: DS HS đạt học bổng]
               │
               └──→ [SCR-02-010: Cấu hình kết nối GDĐT]
                           ├──→ [SCR-02-011: Kích hoạt đồng bộ]
                           └──→ [SCR-02-012: Lịch sử đồng bộ / Log]
```

---

## Phụ lục B: Ma trận quyền truy cập

| Màn hình | Xem | Thêm | Sửa | Xóa | Import/Export | Đồng bộ |
|----------|-----|------|-----|-----|---------------|---------|
| SCR-02-001 Lớp học | ✅ CBQL | — | — | — | — | — |
| SCR-02-002 HS trong lớp | ✅ CBQL | — | — | — | — | — |
| SCR-02-003 Cấu hình ĐRL | ✅ CBQL | ✅ CBQL | ✅ CBQL | ✅ CBQL | ✅ CBQL | — |
| SCR-02-005 Nhập điểm RL | ✅ CBQL | ✅ CBQL | ✅ CBQL | ✅ CBQL | — | — |
| SCR-02-006 Import ĐRL | — | — | — | — | ✅ CBQL | — |
| SCR-02-007 Mức học bổng | ✅ CBQL | ✅ CBQL | ✅ CBQL | ✅ CBQL | — | — |
| SCR-02-008 Đợt xét tuyển | ✅ CBQL | ✅ CBQL | ✅ CBQL | ✅ CBQL | — | — |
| SCR-02-009 HS đạt HB | ✅ CBQL | — | — | — | ✅ CBQL | — |
| SCR-02-010 Cấu hình kết nối | ✅ Admin | — | ✅ Admin | — | — | — |
| SCR-02-011 Đồng bộ | ✅ Admin | — | — | — | — | ✅ Admin |
| SCR-02-012 Lịch sử | ✅ CBQL | — | — | — | ✅ CBQL | — |

---

## Phụ lục C: Bảng trạng thái đồng bộ

| Trạng thái | Ký hiệu | Màu | Mô tả |
|-----------|---------|-----|-------|
| Thành công | ✅ | Xanh lá | Tất cả bản ghi xử lý xong, không có lỗi hoặc lỗi không đáng kể |
| Thành công có lỗi | ⚠️ | Vàng | Hoàn thành nhưng có một số bản ghi lỗi |
| Đang chạy | 🔄 | Xanh dương | Tiến trình đang thực thi |
| Bị hủy | ⚠️ | Cam | Bị dừng thủ công |
| Lỗi kết nối | ❌ | Đỏ | Không thể kết nối đến Sở GD&ĐT |
| Lỗi dữ liệu | ❌ | Đỏ | Lỗi xử lý dữ liệu nghiêm trọng |

---

*Tài liệu này là wireframe cấp độ lo-fi đến mid-fi, phục vụ giai đoạn thiết kế UX. Mọi thay đổi nghiệp vụ cần được cập nhật đồng thời vào tài liệu use case (section 04).*
