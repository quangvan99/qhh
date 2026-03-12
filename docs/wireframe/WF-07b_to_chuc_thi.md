---
title: "WF-07b: Tổ chức thi kiểm tra trực tuyến"
cluster: "Learning - Assessment / Exam Organization"
updated: 2026-03-11
---

# WF-07b: Tổ chức thi kiểm tra trực tuyến

## Tổng quan màn hình

| Mã màn hình    | Tên màn hình                                           |
|----------------|--------------------------------------------------------|
| SCR-07b-001    | Quản lý Danh mục Đợt thi                               |
| SCR-07b-002    | Danh sách Đợt thi                                      |
| SCR-07b-003    | Form Thêm / Sửa Đợt thi                                |
| SCR-07b-004    | Danh sách Ca thi trong Đợt thi                         |
| SCR-07b-005    | Form Thêm / Sửa Ca thi (nhập tay)                      |
| SCR-07b-006    | Form Thêm Ca thi từ Excel                              |
| SCR-07b-007    | Danh sách Học sinh trong Ca thi                        |
| SCR-07b-008    | Popup Thêm Học sinh từ hệ thống                        |
| SCR-07b-009    | Form Thêm Học sinh từ Excel (cấp Ca thi)               |
| SCR-07b-010    | Form Thêm Học sinh từ Excel (cấp Đợt thi - nhiều ca)  |
| SCR-07b-011    | Form Thêm ngoại lệ cho nhiều Học sinh (Excel)          |
| SCR-07b-012    | Form Thêm ngoại lệ cho từng Học sinh                   |
| SCR-07b-013    | Hồ sơ thi của Học sinh                                 |
| SCR-07b-014    | Chi tiết bài làm của Học sinh                          |
| SCR-07b-015    | Popup Xác nhận xóa                                     |

---

## SCR-07b-001 — Quản lý Danh mục Đợt thi

### Mô tả
Màn hình cây danh mục cho phép CBQL xem, thêm mới (cùng cấp / cấp con), chỉnh sửa và xóa danh mục Đợt thi theo cấu trúc phân cấp.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   Học tập & Quản lý  >  Tổ chức thi  >  Danh mục Đợt thi          |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   DANH MỤC ĐỢT THI                                             |
|  > Tổ   |   +-------------------------------------------------------+     |
|    chức  |   | [+ Thêm mới cùng cấp]                                 |     |
|    thi   |   +-------------------------------------------------------+     |
|          |                                                                 |
|          |   Cây danh mục                                                  |
|          |   +-------------------------------------------------------+     |
|          |   | v  Năm học 2025-2026                    [Sửa] [Xóa]  |     |
|          |   |    v  Kỳ 1                              [Sửa] [Xóa]  |     |
|          |   |       >  Đợt thi giữa kỳ               [Sửa] [Xóa]  |     |
|          |   |       >  Đợt thi cuối kỳ               [Sửa] [Xóa]  |     |
|          |   |       [+ Thêm cấp con]                               |     |
|          |   |    >  Kỳ 2                              [Sửa] [Xóa]  |     |
|          |   |    [+ Thêm cấp con]                                  |     |
|          |   | >  Năm học 2024-2025                    [Sửa] [Xóa]  |     |
|          |   +-------------------------------------------------------+     |
|          |                                                                 |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Cây danh mục (Tree view) | Tree | Hiển thị các node danh mục có thể mở rộng/thu gọn |
| 2 | Nút [+ Thêm mới cùng cấp] | Button (primary) | Mở form thêm danh mục root |
| 3 | Nút [+ Thêm cấp con] | Button (link) | Mở form thêm danh mục con của node đang chọn |
| 4 | Nút [Sửa] | Button (text/icon) | Mở form chỉnh sửa node danh mục |
| 5 | Nút [Xóa] | Button (danger) | Mở popup xác nhận xóa node danh mục |

### Flow điều hướng
- [+ Thêm mới cùng cấp] → Mở inline form / modal điền Tên danh mục → Lưu → Cập nhật cây
- [+ Thêm cấp con] (dưới node cha) → Mở inline form / modal → Lưu → Cập nhật cây
- [Sửa] → Mở inline form / modal điền sẵn dữ liệu → Lưu → Cập nhật cây
- [Xóa] → SCR-07b-015 (Popup xác nhận) → Đồng ý → Xóa node, cập nhật cây

### Business Rules
- BR-001: Không xóa danh mục đang có Đợt thi hoặc danh mục con.
- BR-002: Tên danh mục là bắt buộc, không được trùng trong cùng cấp cha.
- BR-003: Chỉ CBQL được cấp quyền mới thực hiện được thao tác.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-categories/tree | Lấy cây danh mục đầy đủ |
| POST   | /api/exam-categories | Tạo danh mục mới |
| PUT    | /api/exam-categories/{id} | Cập nhật danh mục |
| DELETE | /api/exam-categories/{id} | Xóa danh mục |

---

## SCR-07b-002 — Danh sách Đợt thi

### Mô tả
Màn hình chính liệt kê toàn bộ Đợt thi. Hỗ trợ tìm kiếm (từ khóa, thời gian, danh mục), phân trang, chọn số bản ghi/trang; cho phép Thêm mới, Cập nhật, Xóa, Xuất báo cáo.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   Học tập & Quản lý  >  Tổ chức thi  >  Danh sách Đợt thi          |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   DANH SÁCH ĐỢT THI                                            |
|          |                                                                 |
|          |  +-----------Bộ lọc & Tìm kiếm---------------------------------+|
|          |  | Từ khóa: [________________________]  [Tìm kiếm]            ||
|          |  | Danh mục: [-- Chọn danh mục -------v]                       ||
|          |  | Từ ngày:  [dd/mm/yyyy]   Đến ngày: [dd/mm/yyyy]            ||
|          |  +-------------------------------------------------------------+|
|          |                                                                 |
|          |  [+ Thêm mới Đợt thi]                      [Xuất báo cáo ▼]   |
|          |                                                                 |
|          |  +------+------------------+----------+----------+------+------+|
|          |  | STT  | Tên Đợt thi      | Danh mục | Thời gian| Trạng| Hành ||
|          |  |      |                  |          | diễn ra  | thái | động ||
|          |  +------+------------------+----------+----------+------+------+|
|          |  |  1   | Đợt thi GK Kỳ1  | Kỳ 1     | 10-11/01 | Đang | [Sửa]||
|          |  |      |                  | 2025-26  | /2026    | diễn | [Xóa]||
|          |  |      |                  |          |          | ra   |      ||
|          |  +------+------------------+----------+----------+------+------+|
|          |  |  2   | Đợt thi CK Kỳ1  | Kỳ 1     | 20-21/03 | Sắp  | [Sửa]||
|          |  |      |                  | 2025-26  | /2026    | diễn | [Xóa]||
|          |  |      |                  |          |          | ra   |      ||
|          |  +------+------------------+----------+----------+------+------+|
|          |  |  3   | Đợt thi GK Kỳ2  | Kỳ 2     | 05-06/05 | Chưa | [Sửa]||
|          |  |      |                  | 2025-26  | /2026    | bắt  | [Xóa]||
|          |  |      |                  |          |          | đầu  |      ||
|          |  +------+------------------+----------+----------+------+------+|
|          |                                                                 |
|          |  Hiển thị: [10 v] bản ghi/trang    Tổng: 12 bản ghi            |
|          |  << < [1] [2] > >>                                              |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Input Từ khóa | TextInput | Nhập tên đợt thi tìm kiếm |
| 2 | Dropdown Danh mục | Select | Chọn danh mục lọc |
| 3 | DatePicker Từ ngày / Đến ngày | DateRangePicker | Lọc theo khoảng thời gian diễn ra |
| 4 | Nút [Tìm kiếm] | Button (primary) | Thực hiện tìm kiếm |
| 5 | Nút [+ Thêm mới Đợt thi] | Button (primary) | Điều hướng → SCR-07b-003 (mode Thêm) |
| 6 | Nút [Xuất báo cáo] | Button (outline) + dropdown | Xuất file kết quả Đợt thi |
| 7 | Bảng danh sách | DataTable | Hiển thị các cột: STT, Tên, Danh mục, Thời gian, Trạng thái, Hành động |
| 8 | Nút [Sửa] (hàng) | Button (icon/text) | Điều hướng → SCR-07b-003 (mode Sửa) |
| 9 | Nút [Xóa] (hàng) | Button (danger icon) | Mở SCR-07b-015 (Popup xác nhận xóa) |
| 10 | Tên Đợt thi (link) | Link | Click → SCR-07b-004 (Danh sách Ca thi) |
| 11 | Dropdown số bản ghi/trang | Select (10/20/50) | Thay đổi page size |
| 12 | Phân trang | Pagination | Điều hướng giữa các trang |

### Flow điều hướng
- [+ Thêm mới] → SCR-07b-003 (mode Thêm mới)
- [Sửa] → SCR-07b-003 (mode Chỉnh sửa, load sẵn dữ liệu)
- [Xóa] → SCR-07b-015 → Đồng ý → Xóa, reload danh sách
- Click tên Đợt thi → SCR-07b-004 (Danh sách Ca thi)
- [Xuất báo cáo] → Download file xlsx/pdf kết quả Đợt thi

### Business Rules
- BR-004: Tìm kiếm hỗ trợ kết hợp nhiều tiêu chí (AND logic).
- BR-005: Không xóa Đợt thi đang có Ca thi hoặc đang diễn ra.
- BR-006: Xuất báo cáo chỉ khả dụng khi Đợt thi đã kết thúc hoặc đang diễn ra.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-sessions?keyword=&categoryId=&fromDate=&toDate=&page=&size= | Lấy danh sách Đợt thi |
| DELETE | /api/exam-sessions/{id} | Xóa Đợt thi |
| GET    | /api/exam-sessions/{id}/report | Xuất báo cáo kết quả Đợt thi |

---

## SCR-07b-003 — Form Thêm / Sửa Đợt thi

### Mô tả
Form nhập liệu dùng chung cho cả Thêm mới và Chỉnh sửa Đợt thi. Khi Sửa, dữ liệu được điền sẵn vào form.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   Học tập & Quản lý  >  Tổ chức thi  >  Đợt thi  > [Thêm mới]     |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   THÊM MỚI ĐỢT THI                  (hoặc: CẬP NHẬT ĐỢT THI) |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Thông tin Đợt thi                                        |  |
|          |  +----------------------------------------------------------+  |
|          |  |                                                          |  |
|          |  |  Tên Đợt thi *                                          |  |
|          |  |  [____________________________________________]          |  |
|          |  |                                                          |  |
|          |  |  Danh mục *                                             |  |
|          |  |  [-- Chọn danh mục ---------------------------------v]  |  |
|          |  |                                                          |  |
|          |  |  Mô tả                                                  |  |
|          |  |  [                                                   ]  |  |
|          |  |  [                                                   ]  |  |
|          |  |                                                          |  |
|          |  |  Thời gian bắt đầu *          Thời gian kết thúc *     |  |
|          |  |  [dd/mm/yyyy hh:mm]            [dd/mm/yyyy hh:mm]       |  |
|          |  |                                                          |  |
|          |  |  Trạng thái                                             |  |
|          |  |  ( ) Chưa bắt đầu  ( ) Đang diễn ra  ( ) Đã kết thúc  |  |
|          |  |                                                          |  |
|          |  |  [      Lưu      ]   [      Hủy      ]                 |  |
|          |  |                                                          |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  ! Tên Đợt thi là bắt buộc.   (error state)                   |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Input Tên Đợt thi | TextInput (required) | Tên đợt thi, bắt buộc |
| 2 | Dropdown Danh mục | Select (required) | Gắn vào danh mục đã có, bắt buộc |
| 3 | Textarea Mô tả | Textarea | Mô tả tùy chọn |
| 4 | DateTimePicker Thời gian bắt đầu | DateTimePicker (required) | Ngày giờ bắt đầu |
| 5 | DateTimePicker Thời gian kết thúc | DateTimePicker (required) | Ngày giờ kết thúc |
| 6 | Radio Trạng thái | RadioGroup | Chưa bắt đầu / Đang diễn ra / Đã kết thúc |
| 7 | Nút [Lưu] | Button (primary) | Submit form |
| 8 | Nút [Hủy] | Button (outline) | Quay lại SCR-07b-002 không lưu |
| 9 | Inline error message | Alert/text (red) | Hiển thị lỗi validation |

### Flow điều hướng
- [Lưu] (dữ liệu hợp lệ) → Lưu DB → Toast thành công → Redirect → SCR-07b-002
- [Lưu] (thiếu/sai dữ liệu) → Hiển thị lỗi inline, giữ nguyên form
- [Hủy] → SCR-07b-002

### Business Rules
- BR-007: Tên Đợt thi, Danh mục, Thời gian bắt đầu, Thời gian kết thúc là bắt buộc.
- BR-008: Thời gian kết thúc phải sau Thời gian bắt đầu.
- BR-009: Không trùng tên Đợt thi trong cùng danh mục.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST   | /api/exam-sessions | Tạo mới Đợt thi |
| PUT    | /api/exam-sessions/{id} | Cập nhật Đợt thi |
| GET    | /api/exam-categories/tree | Load dropdown danh mục |

---

## SCR-07b-004 — Danh sách Ca thi trong Đợt thi

### Mô tả
Màn hình hiển thị tất cả Ca thi thuộc một Đợt thi cụ thể. Hỗ trợ tìm kiếm theo từ khóa, phân trang, chọn số bản ghi/trang; cho phép Thêm mới (tay/Excel), Cập nhật, Xóa, Thêm HS từ Excel (tất cả ca), Xuất báo cáo tổng hợp.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   Học tập & Quản lý  >  Tổ chức thi  >  Đợt thi GK Kỳ1  >  Ca thi |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   CA THI — Đợt thi: Đợt thi Giữa kỳ 1 (2025-2026)             |
|          |   Thời gian: 10/01/2026 — 11/01/2026   Trạng thái: Đang diễn ra|
|          |                                                                 |
|          |  +---------Tìm kiếm-----------------------------------------+  |
|          |  | Từ khóa: [__________________________________] [Tìm kiếm] |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  [+ Thêm mới Ca thi]  [+ Thêm từ Excel]                        |
|          |  [+ Thêm HS từ Excel (tất cả ca)]  [Xuất báo cáo tổng hợp]    |
|          |                                                                 |
|          |  +----+---------------+----------+----------+------+--------+  |
|          |  | STT| Tên Ca thi    | Đề thi   | Bắt đầu  | Kết  | Hành  |  |
|          |  |    |               |          |          | thúc | động  |  |
|          |  +----+---------------+----------+----------+------+--------+  |
|          |  |  1 | Ca 1 - Sáng  | Đề thi   | 10/01    | 10/01| [Sửa] |  |
|          |  |    | 10/01        | Toán 01  | 08:00    | 10:00| [Xóa] |  |
|          |  +----+---------------+----------+----------+------+--------+  |
|          |  |  2 | Ca 2 - Chiều | Đề thi   | 10/01    | 10/01| [Sửa] |  |
|          |  |    | 10/01        | Văn 01   | 13:30    | 15:30| [Xóa] |  |
|          |  +----+---------------+----------+----------+------+--------+  |
|          |  |  3 | Ca 1 - Sáng  | Đề thi   | 11/01    | 11/01| [Sửa] |  |
|          |  |    | 11/01        | Anh 01   | 08:00    | 10:00| [Xóa] |  |
|          |  +----+---------------+----------+----------+------+--------+  |
|          |                                                                 |
|          |  Hiển thị: [10 v] bản ghi/trang    Tổng: 6 ca thi             |
|          |  << < [1] > >>                                                  |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Label Tên Đợt thi + Thời gian + Trạng thái | Info header | Thông tin tóm tắt Đợt thi |
| 2 | Input Từ khóa + Nút [Tìm kiếm] | TextInput + Button | Tìm kiếm Ca thi theo tên |
| 3 | Nút [+ Thêm mới Ca thi] | Button (primary) | → SCR-07b-005 (mode Thêm) |
| 4 | Nút [+ Thêm từ Excel] | Button (outline) | → SCR-07b-006 |
| 5 | Nút [+ Thêm HS từ Excel (tất cả ca)] | Button (outline) | → SCR-07b-010 |
| 6 | Nút [Xuất báo cáo tổng hợp] | Button (outline) | Download file tổng hợp Ca thi |
| 7 | Bảng danh sách Ca thi | DataTable | STT, Tên Ca thi, Đề thi, Bắt đầu, Kết thúc, Hành động |
| 8 | Link Tên Ca thi | Link | Click → SCR-07b-007 (Danh sách HS trong Ca thi) |
| 9 | Nút [Sửa] (hàng) | Button (icon/text) | → SCR-07b-005 (mode Sửa) |
| 10 | Nút [Xóa] (hàng) | Button (danger) | → SCR-07b-015 (Popup xác nhận) |
| 11 | Dropdown số bản ghi/trang | Select | Thay đổi page size |
| 12 | Phân trang | Pagination | Điều hướng giữa các trang |

### Flow điều hướng
- [+ Thêm mới Ca thi] → SCR-07b-005 (mode Thêm)
- [+ Thêm từ Excel] → SCR-07b-006
- [+ Thêm HS từ Excel (tất cả ca)] → SCR-07b-010
- [Xuất báo cáo tổng hợp] → Download file
- Click tên Ca thi → SCR-07b-007
- [Sửa] → SCR-07b-005 (mode Sửa)
- [Xóa] → SCR-07b-015 → Đồng ý → Xóa, reload

### Business Rules
- BR-010: Không xóa Ca thi đang diễn ra hoặc đã có HS thi.
- BR-011: Mỗi Ca thi phải gắn với đúng một Đề thi.
- BR-012: Thời gian Ca thi phải nằm trong khoảng thời gian Đợt thi.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-sessions/{sessionId}/slots?keyword=&page=&size= | Lấy danh sách Ca thi |
| DELETE | /api/exam-slots/{id} | Xóa Ca thi |
| GET    | /api/exam-sessions/{sessionId}/slots/report | Xuất báo cáo tổng hợp |

---

## SCR-07b-005 — Form Thêm / Sửa Ca thi

### Mô tả
Form nhập liệu dùng chung để Thêm mới hoặc Chỉnh sửa một Ca thi trong Đợt thi. Cho phép tìm kiếm Đề thi theo từ khóa và theo danh mục.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   ...  >  Đợt thi GK Kỳ1  >  Ca thi  >  [Thêm mới Ca thi]         |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   THÊM MỚI CA THI            (hoặc: CẬP NHẬT CA THI)          |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Thông tin Ca thi                                         |  |
|          |  +----------------------------------------------------------+  |
|          |  |  Tên Ca thi *                                           |  |
|          |  |  [_______________________________________________]        |  |
|          |  |                                                          |  |
|          |  |  Thời gian bắt đầu *       Thời gian kết thúc *        |  |
|          |  |  [dd/mm/yyyy hh:mm]         [dd/mm/yyyy hh:mm]          |  |
|          |  |                                                          |  |
|          |  |  Ghi chú                                                |  |
|          |  |  [                                                   ]  |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Chọn Đề thi                                              |  |
|          |  +----------------------------------------------------------+  |
|          |  |  Tìm kiếm đề thi                                        |  |
|          |  |  Từ khóa: [______________________] [Tìm kiếm]           |  |
|          |  |  Danh mục: [-- Chọn danh mục ----v] [Lọc theo danh mục] |  |
|          |  |                                                          |  |
|          |  |  Kết quả đề thi:                                        |  |
|          |  |  +-------+--------------------+----------+-----------+  |  |
|          |  |  | Chọn  | Tên Đề thi         | Danh mục | Số câu    |  |  |
|          |  |  +-------+--------------------+----------+-----------+  |  |
|          |  |  | ( )   | Đề Toán GK1-2026   | Toán     |    40     |  |  |
|          |  |  +-------+--------------------+----------+-----------+  |  |
|          |  |  | ( )   | Đề Văn GK1-2026    | Ngữ văn  |    30     |  |  |
|          |  |  +-------+--------------------+----------+-----------+  |  |
|          |  |  | ( )   | Đề Anh GK1-2026    | T.Anh    |    50     |  |  |
|          |  |  +-------+--------------------+----------+-----------+  |  |
|          |  |                                                          |  |
|          |  |  Hiển thị: [10 v] / trang   << < [1] [2] > >>          |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  Đề thi đã chọn: Đề Toán GK1-2026  [x Bỏ chọn]               |
|          |                                                                 |
|          |  [      Lưu      ]   [      Hủy      ]                        |
|          |                                                                 |
|          |  ! Tên Ca thi là bắt buộc.   (error state)                    |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Input Tên Ca thi | TextInput (required) | Tên ca thi |
| 2 | DateTimePicker Bắt đầu / Kết thúc | DateTimePicker (required) | Khoảng thời gian ca thi |
| 3 | Textarea Ghi chú | Textarea | Ghi chú tùy chọn |
| 4 | Input Từ khóa tìm đề thi | TextInput | Tìm đề thi theo tên |
| 5 | Dropdown Danh mục đề thi | Select | Lọc đề thi theo danh mục |
| 6 | Nút [Tìm kiếm] / [Lọc theo danh mục] | Button | Gọi API tìm đề thi |
| 7 | Bảng kết quả đề thi | DataTable (selectable) | Radio chọn một đề |
| 8 | Phân trang danh sách đề | Pagination | Phân trang kết quả tìm đề |
| 9 | Label "Đề thi đã chọn" + Nút [x Bỏ chọn] | Badge/Tag | Hiển thị đề đã chọn |
| 10 | Nút [Lưu] | Button (primary) | Submit form |
| 11 | Nút [Hủy] | Button (outline) | Quay lại SCR-07b-004 |
| 12 | Inline error | Alert | Thông báo lỗi validation |

### Flow điều hướng
- [Tìm kiếm] / [Lọc theo danh mục] → Cập nhật bảng kết quả đề thi
- Chọn Radio đề thi → Cập nhật "Đề thi đã chọn"
- [Lưu] (hợp lệ) → Lưu DB → Toast thành công → Redirect → SCR-07b-004
- [Lưu] (lỗi) → Hiển thị lỗi inline
- [Hủy] → SCR-07b-004

### Business Rules
- BR-013: Tên Ca thi, Thời gian bắt đầu, Kết thúc, Đề thi là bắt buộc.
- BR-014: Thời gian Ca thi phải nằm trong khoảng Đợt thi.
- BR-015: Mỗi Ca thi chỉ được gắn một Đề thi.
- BR-016: Thời gian kết thúc phải sau thời gian bắt đầu.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST   | /api/exam-slots | Tạo Ca thi |
| PUT    | /api/exam-slots/{id} | Cập nhật Ca thi |
| GET    | /api/exams?keyword=&categoryId=&page=&size= | Tìm kiếm Đề thi |

---

## SCR-07b-006 — Form Thêm Ca thi từ Excel

### Mô tả
Giao diện upload file Excel để thêm nhiều Ca thi cùng lúc vào Đợt thi. Hỗ trợ tải mẫu, upload, preview kết quả xác thực, rồi Lưu.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   ...  >  Đợt thi GK Kỳ1  >  Ca thi  >  Thêm Ca thi từ Excel      |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   THÊM CA THI TỪ FILE EXCEL                                    |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 1: Tải file mẫu                                     |  |
|          |  |  Tải về file mẫu để điền thông tin Ca thi.               |  |
|          |  |  [⬇ Tải file mẫu (.xlsx)]                               |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 2: Upload file đã điền                              |  |
|          |  |                                                          |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  |                                                    |  |  |
|          |  |  |   [  Kéo thả file vào đây hoặc Click để chọn  ]   |  |  |
|          |  |  |          (Chỉ hỗ trợ .xlsx, .xls)                  |  |  |
|          |  |  |                                                    |  |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  [⬆ Tải lên]                                           |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 3: Xem trước & xác nhận                            |  |
|          |  |  Hệ thống đọc và xác thực file. Kết quả:               |  |
|          |  |                                                          |  |
|          |  |  Tổng dòng: 6  |  Hợp lệ: 5  |  Lỗi: 1               |  |
|          |  |                                                          |  |
|          |  |  +----+---------------+----------+----------+--------+  |  |
|          |  |  | STT| Tên Ca thi    | Đề thi   | Bắt đầu  | Trạng  |  |  |
|          |  |  |    |               |          |          | thái   |  |  |
|          |  |  +----+---------------+----------+----------+--------+  |  |
|          |  |  |  1 | Ca sáng 10/01 | Toán 01  | 10/01    | ✓ OK   |  |  |
|          |  |  +----+---------------+----------+----------+--------+  |  |
|          |  |  |  2 | Ca chiều 10/01| Văn 01   | 10/01    | ✓ OK   |  |  |
|          |  |  +----+---------------+----------+----------+--------+  |  |
|          |  |  |  3 | Ca sáng 11/01 | (trống)  | 11/01    | ✗ Lỗi  |  |  |
|          |  |  +----+---------------+----------+----------+--------+  |  |
|          |  |  Chi tiết lỗi: Dòng 3 - Thiếu mã đề thi.              |  |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  [  Lưu dữ liệu hợp lệ  ]   [  Hủy  ]                        |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Nút [Tải file mẫu] | Button (link/outline) | Download template Excel |
| 2 | Dropzone upload | File dropzone | Kéo thả hoặc chọn file .xlsx |
| 3 | Nút [Tải lên] | Button (primary) | Upload file lên hệ thống |
| 4 | Summary bar | Info bar | Tổng / Hợp lệ / Lỗi |
| 5 | Bảng preview | DataTable (readonly) | Xem kết quả từng dòng với trạng thái |
| 6 | Error detail | Alert/text (red) | Mô tả chi tiết lỗi từng dòng |
| 7 | Nút [Lưu dữ liệu hợp lệ] | Button (primary) | Lưu các dòng hợp lệ vào CSDL |
| 8 | Nút [Hủy] | Button (outline) | Quay lại SCR-07b-004 |

### Flow điều hướng
- [Tải file mẫu] → Download file template
- [Tải lên] → Upload file → Hiển thị bảng preview xác thực
- [Lưu dữ liệu hợp lệ] → Lưu DB → Toast thành công → Redirect → SCR-07b-004
- [Hủy] → SCR-07b-004

### Business Rules
- BR-017: Chỉ chấp nhận file .xlsx, .xls, kích thước ≤ 10MB.
- BR-018: Hệ thống bỏ qua dòng lỗi, chỉ lưu dòng hợp lệ (nếu CBQL xác nhận).
- BR-019: Hiển thị chi tiết lỗi từng dòng (dòng số, tên trường, lý do).

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/template | Tải file mẫu |
| POST   | /api/exam-slots/import/preview | Upload + xác thực, trả về kết quả |
| POST   | /api/exam-slots/import/save | Lưu dữ liệu hợp lệ vào CSDL |

---

## SCR-07b-007 — Danh sách Học sinh trong Ca thi

### Mô tả
Màn hình quản lý Học sinh trong một Ca thi cụ thể. Hỗ trợ tìm kiếm đa tiêu chí (từ khóa, trạng thái làm bài, số lần làm, đơn vị, số lần vi phạm, trạng thái vi phạm), phân trang; cho phép Thêm HS từ hệ thống, Thêm từ Excel, Thêm ngoại lệ cho nhiều HS, Thêm ngoại lệ từng HS, Xem hồ sơ thi, Xuất báo cáo kết quả Ca thi.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO  ...  >  Đợt thi GK Kỳ1  >  Ca sáng 10/01  >  Học sinh thi         |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   HỌC SINH THI — Ca: Ca sáng 10/01  |  Đề: Đề Toán GK1-2026  |
|          |   Thời gian: 10/01/2026 08:00-10:00   Trạng thái: Đang thi    |
|          |                                                                 |
|          |  +---------Bộ lọc tìm kiếm------------------------------------+|
|          |  | Từ khóa:   [_____________________]                         ||
|          |  | Trạng thái làm bài: [-- Tất cả --v]  (Chưa vào/Đang làm/  ||
|          |  |                                       Đã nộp/Quá giờ)      ||
|          |  | Số lần làm bài:     [-- Tất cả --v]  (= 0 / = 1 / > 1)    ||
|          |  | Đơn vị (Trường):    [-- Tất cả --v]                        ||
|          |  | Số lần vi phạm:     [-- Tất cả --v]  (= 0 / = 1 / > 1)    ||
|          |  | Trạng thái vi phạm: [-- Tất cả --v]  (Không/Cảnh báo/     ||
|          |  |                                       Đình chỉ)             ||
|          |  | [  Tìm kiếm  ]  [  Xóa bộ lọc  ]                          ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  [+ Thêm HS từ hệ thống]  [+ Thêm từ Excel]                   |
|          |  [+ Thêm ngoại lệ nhiều HS]  [Xuất báo cáo kết quả]           |
|          |                                                                 |
|          |  +--+-------+------+------+-------+------+-------+-----------+|
|          |  |[]| Họ tên| Mã HS|Đơn vị|Trạng  |#Lần  |Vi phạm| Hành động||
|          |  |  |       |      |      |thái   |làm   |       |           ||
|          |  +--+-------+------+------+-------+------+-------+-----------+|
|          |  |[]|Nguyễn |HS001 |THPT A|Đã nộp |  1   |Không  |[Hồ sơ]   ||
|          |  |  |Văn An |      |      |bài    |      |vi phạm|[Ngoại lệ]||
|          |  +--+-------+------+------+-------+------+-------+-----------+|
|          |  |[]|Trần   |HS002 |THPT B|Đang   |  1   |Cảnh   |[Hồ sơ]   ||
|          |  |  |Thị Bình|     |      |làm bài|      |báo(2) |[Ngoại lệ]||
|          |  +--+-------+------+------+-------+------+-------+-----------+|
|          |  |[]|Lê Văn |HS003 |THPT A|Chưa   |  0   |Không  |[Hồ sơ]   ||
|          |  |  |Cường  |      |      |vào thi|      |vi phạm|[Ngoại lệ]||
|          |  +--+-------+------+------+-------+------+-------+-----------+|
|          |                                                                 |
|          |  Đã chọn: 0 học sinh  [Thêm ngoại lệ cho học sinh đã chọn]    |
|          |                                                                 |
|          |  Hiển thị: [10 v] bản ghi/trang   Tổng: 120 học sinh          |
|          |  << < [1] [2] ... [12] > >>                                     |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Header Ca thi | Info header | Tên ca, đề thi, thời gian, trạng thái |
| 2 | Input Từ khóa | TextInput | Tìm theo tên / mã học sinh |
| 3 | Dropdown Trạng thái làm bài | Select | Chưa vào / Đang làm / Đã nộp / Quá giờ |
| 4 | Dropdown Số lần làm bài | Select | = 0 / = 1 / > 1 |
| 5 | Dropdown Đơn vị (Trường) | Select | Lọc theo trường |
| 6 | Dropdown Số lần vi phạm | Select | = 0 / = 1 / > 1 |
| 7 | Dropdown Trạng thái vi phạm | Select | Không / Cảnh báo / Đình chỉ |
| 8 | Nút [Tìm kiếm] | Button (primary) | Áp dụng bộ lọc |
| 9 | Nút [Xóa bộ lọc] | Button (text) | Reset tất cả bộ lọc |
| 10 | Nút [+ Thêm HS từ hệ thống] | Button (primary) | → SCR-07b-008 |
| 11 | Nút [+ Thêm từ Excel] | Button (outline) | → SCR-07b-009 |
| 12 | Nút [+ Thêm ngoại lệ nhiều HS] | Button (outline) | → SCR-07b-011 |
| 13 | Nút [Xuất báo cáo kết quả] | Button (outline) | Download file kết quả Ca thi |
| 14 | Checkbox (hàng + header) | Checkbox | Chọn nhiều HS để thêm ngoại lệ hàng loạt |
| 15 | Bảng danh sách HS | DataTable | Các cột như wireframe |
| 16 | Nút [Hồ sơ] (hàng) | Button (link) | → SCR-07b-013 |
| 17 | Nút [Ngoại lệ] (hàng) | Button (outline) | → SCR-07b-012 |
| 18 | Action bar "Đã chọn N HS" | Floating bar | Khi chọn ≥1 HS, hiện nút thêm ngoại lệ hàng loạt |
| 19 | Dropdown số bản ghi/trang | Select | Thay đổi page size |
| 20 | Phân trang | Pagination | Điều hướng trang |

### Flow điều hướng
- [+ Thêm HS từ hệ thống] → SCR-07b-008 (Popup/Panel)
- [+ Thêm từ Excel] → SCR-07b-009
- [+ Thêm ngoại lệ nhiều HS] → SCR-07b-011
- [Xuất báo cáo kết quả] → Download file
- Chọn checkbox HS → Action bar hiện → [Thêm ngoại lệ cho HS đã chọn] → SCR-07b-011 (pre-selected)
- [Hồ sơ] → SCR-07b-013
- [Ngoại lệ] → SCR-07b-012

### Business Rules
- BR-020: Một HS chỉ được thêm vào mỗi Ca thi một lần.
- BR-021: Tìm kiếm kết hợp nhiều tiêu chí (AND logic).
- BR-022: Xuất báo cáo kết quả Ca thi chứa điểm, trạng thái, thông tin vi phạm.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/{slotId}/students?keyword=&status=&attempts=&unit=&violations=&violationStatus=&page=&size= | Lấy danh sách HS |
| GET    | /api/exam-slots/{slotId}/students/report | Xuất báo cáo kết quả Ca thi |

---

## SCR-07b-008 — Popup Thêm Học sinh từ hệ thống

### Mô tả
Panel / Modal cho phép CBQL tìm kiếm học sinh đang có trong hệ thống, chọn một hoặc nhiều, rồi thêm vào Ca thi.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+====================================================================+
|  THÊM HỌC SINH TỪ HỆ THỐNG              [x Đóng]                 |
+====================================================================+
|  Tìm kiếm học sinh                                                 |
|  Từ khóa: [________________________________]  [Tìm kiếm]          |
|                                                                    |
|  Kết quả:                                                          |
|  +--+----------+--------+----------+----------+                   |
|  |[]| Họ và tên| Mã HS  | Lớp      | Trường   |                   |
|  +--+----------+--------+----------+----------+                   |
|  |[]| Nguyễn A | HS101  | 12A1     | THPT A   |                   |
|  +--+----------+--------+----------+----------+                   |
|  |[]| Trần B   | HS102  | 12A2     | THPT A   |                   |
|  +--+----------+--------+----------+----------+                   |
|  |[]| Lê C     | HS103  | 11B1     | THPT B   |                   |
|  +--+----------+--------+----------+----------+                   |
|  |[]| Phạm D   | HS104  | 11B2     | THPT B   |                   |
|  +--+----------+--------+----------+----------+                   |
|                                                                    |
|  Hiển thị: [10 v] / trang    Tổng: 480 HS                         |
|  << < [1] [2] ... [48] > >>                                        |
|                                                                    |
|  Đã chọn: 2 học sinh (HS101, HS102)                               |
|                                                                    |
|  [  Thêm vào Ca thi  ]    [  Hủy  ]                               |
+====================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Modal/Panel overlay | Modal | Hiển thị trên SCR-07b-007 |
| 2 | Input Từ khóa + Nút [Tìm kiếm] | TextInput + Button | Tìm HS theo tên/mã |
| 3 | Bảng kết quả HS | DataTable (multi-select) | Checkbox chọn nhiều HS |
| 4 | Dropdown số bản ghi/trang | Select | Page size |
| 5 | Phân trang | Pagination | |
| 6 | Label "Đã chọn N học sinh" | Badge | Thể hiện lựa chọn hiện tại |
| 7 | Nút [Thêm vào Ca thi] | Button (primary) | Xác nhận thêm các HS đã chọn |
| 8 | Nút [Hủy] / [x Đóng] | Button (outline) / Icon | Đóng modal, không thêm |

### Flow điều hướng
- [Tìm kiếm] → Cập nhật bảng kết quả
- Chọn checkbox → Cập nhật "Đã chọn N học sinh"
- [Thêm vào Ca thi] → Gọi API thêm HS → Toast thành công → Đóng modal → Reload SCR-07b-007
- [Hủy] / [x Đóng] → Đóng modal, quay lại SCR-07b-007

### Business Rules
- BR-023: HS đã có trong Ca thi sẽ bị disabled/grayed-out trong danh sách.
- BR-024: Phải chọn ít nhất 1 HS trước khi nhấn [Thêm vào Ca thi].

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/students?keyword=&page=&size= | Tìm kiếm HS từ hệ thống |
| POST   | /api/exam-slots/{slotId}/students | Thêm HS vào Ca thi |

---

## SCR-07b-009 — Form Thêm Học sinh từ Excel (cấp Ca thi)

### Mô tả
Upload file Excel để thêm danh sách Học sinh vào một Ca thi cụ thể. Hỗ trợ tải mẫu, upload, preview xác thực, lưu dữ liệu hợp lệ.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   ...  >  Ca sáng 10/01  >  Học sinh  >  Thêm HS từ Excel           |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   THÊM HỌC SINH TỪ EXCEL — Ca thi: Ca sáng 10/01              |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 1: Tải file mẫu                                     |  |
|          |  |  [⬇ Tải file mẫu danh sách học sinh (.xlsx)]            |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 2: Upload file đã điền                              |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  |  [ Kéo thả file hoặc Click để chọn (.xlsx/.xls) ] |  |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  [⬆ Tải lên]                                           |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 3: Kết quả xác thực                                |  |
|          |  |  Tổng dòng: 30  |  Hợp lệ: 29  |  Lỗi: 1             |  |
|          |  |                                                          |  |
|          |  |  +----+-----------+--------+----------+-------------+  |  |
|          |  |  | STT| Họ tên   | Mã HS  | Lớp      | Trạng thái  |  |  |
|          |  |  +----+-----------+--------+----------+-------------+  |  |
|          |  |  |  1 | Nguyễn A  | HS101  | 12A1     | ✓ Hợp lệ   |  |  |
|          |  |  +----+-----------+--------+----------+-------------+  |  |
|          |  |  |  2 | Trần B    | (trống)| 12A2     | ✗ Thiếu mã  |  |  |
|          |  |  +----+-----------+--------+----------+-------------+  |  |
|          |  |  Chi tiết lỗi: Dòng 2 - Mã học sinh không được trống.|  |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  [  Lưu dữ liệu hợp lệ  ]   [  Hủy  ]                        |
+===========================================================================+
```

### Components
*(Tương tự SCR-07b-006, áp dụng cho HS)*
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Nút [Tải file mẫu] | Button | Download template danh sách HS |
| 2 | Dropzone upload | File dropzone | Upload .xlsx |
| 3 | Nút [Tải lên] | Button (primary) | Upload file |
| 4 | Summary bar | Info | Tổng / Hợp lệ / Lỗi |
| 5 | Bảng preview | DataTable (readonly) | Kết quả từng dòng |
| 6 | Error detail | Alert | Mô tả chi tiết lỗi |
| 7 | Nút [Lưu dữ liệu hợp lệ] | Button (primary) | Lưu DB |
| 8 | Nút [Hủy] | Button (outline) | Quay lại SCR-07b-007 |

### Flow điều hướng
- [Tải file mẫu] → Download template
- [Tải lên] → Upload + xác thực → Hiển thị preview
- [Lưu dữ liệu hợp lệ] → Lưu DB → Toast → Redirect → SCR-07b-007
- [Hủy] → SCR-07b-007

### Business Rules
- BR-025: HS đã tồn tại trong Ca thi sẽ được đánh dấu "Trùng lặp" và bỏ qua khi lưu.
- BR-026: File mẫu phải có đúng cấu trúc cột quy định.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/{slotId}/students/template | Tải file mẫu HS |
| POST   | /api/exam-slots/{slotId}/students/import/preview | Upload + xác thực |
| POST   | /api/exam-slots/{slotId}/students/import/save | Lưu dữ liệu hợp lệ |

---

## SCR-07b-010 — Form Thêm Học sinh từ Excel (cấp Đợt thi — nhiều ca)

### Mô tả
Upload file Excel để phân phối Học sinh vào nhiều Ca thi cùng lúc trong Đợt thi. File mẫu có cột Ca thi, hệ thống xác thực và phân bổ.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   ...  >  Đợt thi GK Kỳ1  >  Ca thi  >  Thêm HS từ Excel (Đợt thi)|
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   THÊM HỌC SINH TỪ EXCEL CHO TẤT CẢ CA THI                    |
|          |   Đợt thi: Đợt thi Giữa kỳ 1 (2025-2026)                      |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 1: Tải file mẫu                                     |  |
|          |  |  File mẫu bao gồm cột: Mã HS, Họ tên, Ca thi, ...      |  |
|          |  |  [⬇ Tải file mẫu (.xlsx)]                               |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 2: Upload file đã điền                              |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  | [ Kéo thả hoặc Click để chọn file (.xlsx/.xls) ]  |  |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  [⬆ Tải lên]                                           |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 3: Kết quả xác thực (nhóm theo Ca thi)            |  |
|          |  |                                                          |  |
|          |  |  Tổng dòng: 120  |  Hợp lệ: 118  |  Lỗi: 2           |  |
|          |  |                                                          |  |
|          |  |  v Ca sáng 10/01 (40 HS, 0 lỗi)                       |  |
|          |  |    [Bảng 40 dòng ✓]                                    |  |
|          |  |  v Ca chiều 10/01 (40 HS, 1 lỗi)                      |  |
|          |  |    [Bảng 40 dòng - dòng 78 lỗi: Mã HS không tồn tại]  |  |
|          |  |  v Ca sáng 11/01 (40 HS, 1 lỗi)                       |  |
|          |  |    [Bảng 40 dòng - dòng 115 lỗi: Trùng lặp Ca thi]    |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  [  Lưu dữ liệu hợp lệ  ]   [  Hủy  ]                        |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Nút [Tải file mẫu] | Button | Download template đa Ca thi |
| 2 | Dropzone | File dropzone | Upload file |
| 3 | Nút [Tải lên] | Button (primary) | Upload + xác thực |
| 4 | Summary bar | Info | Tổng / Hợp lệ / Lỗi |
| 5 | Accordion nhóm theo Ca thi | Accordion | Mỗi Ca thi là một nhóm có thể mở rộng |
| 6 | Bảng preview từng Ca | DataTable (readonly) | Dữ liệu từng dòng + trạng thái |
| 7 | Nút [Lưu dữ liệu hợp lệ] | Button (primary) | Lưu vào CSDL |
| 8 | Nút [Hủy] | Button (outline) | Quay lại SCR-07b-004 |

### Flow điều hướng
- Tương tự SCR-07b-009, nhưng phạm vi là toàn bộ Ca thi trong Đợt thi.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-sessions/{sessionId}/students/template | Tải file mẫu đa ca |
| POST   | /api/exam-sessions/{sessionId}/students/import/preview | Upload + xác thực |
| POST   | /api/exam-sessions/{sessionId}/students/import/save | Lưu dữ liệu hợp lệ |

---

## SCR-07b-011 — Form Thêm ngoại lệ cho nhiều Học sinh (Excel)

### Mô tả
Upload file Excel để thêm ngoại lệ (gia hạn thời gian, cho phép làm lại, v.v.) cho nhiều Học sinh cùng lúc trong Ca thi.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO   ...  >  Ca sáng 10/01  >  Học sinh  >  Thêm ngoại lệ nhiều HS    |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   THÊM NGOẠI LỆ CHO NHIỀU HỌC SINH — Ca: Ca sáng 10/01        |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 1: Tải file mẫu ngoại lệ                           |  |
|          |  |  File mẫu gồm: Mã HS, Loại ngoại lệ, Giá trị, Ghi chú  |  |
|          |  |  [⬇ Tải file mẫu ngoại lệ (.xlsx)]                     |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 2: Upload file đã điền                              |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  | [ Kéo thả hoặc Click để chọn file (.xlsx/.xls) ]  |  |  |
|          |  |  +----------------------------------------------------+  |  |
|          |  |  [⬆ Tải lên]                                           |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  +----------------------------------------------------------+  |
|          |  | Bước 3: Kết quả xác thực                                |  |
|          |  |  Tổng dòng: 10  |  Hợp lệ: 9  |  Lỗi: 1              |  |
|          |  |                                                          |  |
|          |  | +----+--------+-------------------+-------+-----------+ |  |
|          |  | | STT| Mã HS  | Loại ngoại lệ     | Giá trị| Trạng thái|  |
|          |  | +----+--------+-------------------+-------+-----------+ |  |
|          |  | |  1 | HS101  | Gia hạn thêm giờ  | +15ph | ✓ Hợp lệ |  |  |
|          |  | +----+--------+-------------------+-------+-----------+ |  |
|          |  | |  2 | HS999  | Cho làm lại       | 1 lần | ✗ Mã HS   |  |  |
|          |  | |    |        |                   |       | không tồn |  |  |
|          |  | |    |        |                   |       | tại       |  |  |
|          |  | +----+--------+-------------------+-------+-----------+ |  |
|          |  +----------------------------------------------------------+  |
|          |                                                                 |
|          |  [  Lưu dữ liệu hợp lệ  ]   [  Hủy  ]                        |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Nút [Tải file mẫu ngoại lệ] | Button | Download template ngoại lệ |
| 2 | Dropzone | File dropzone | Upload file ngoại lệ |
| 3 | Nút [Tải lên] | Button (primary) | Upload + xác thực |
| 4 | Summary bar | Info | Tổng / Hợp lệ / Lỗi |
| 5 | Bảng preview | DataTable | Mã HS, Loại ngoại lệ, Giá trị, Trạng thái xác thực |
| 6 | Nút [Lưu dữ liệu hợp lệ] | Button (primary) | Lưu DB |
| 7 | Nút [Hủy] | Button (outline) | Quay lại SCR-07b-007 |

### Flow điều hướng
- [Tải file mẫu ngoại lệ] → Download template
- [Tải lên] → Upload + xác thực → Hiển thị preview
- [Lưu dữ liệu hợp lệ] → Lưu DB → Toast → Redirect → SCR-07b-007
- [Hủy] → SCR-07b-007

### Business Rules
- BR-027: Loại ngoại lệ phải thuộc danh sách hợp lệ (gia hạn thời gian / cho làm lại / khác).
- BR-028: Giá trị ngoại lệ phải hợp lệ theo từng loại (ví dụ: thời gian gia hạn > 0 phút).
- BR-029: HS phải đang có trong Ca thi thì mới áp dụng ngoại lệ được.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/{slotId}/exceptions/template | Tải file mẫu ngoại lệ |
| POST   | /api/exam-slots/{slotId}/exceptions/import/preview | Upload + xác thực |
| POST   | /api/exam-slots/{slotId}/exceptions/import/save | Lưu ngoại lệ hợp lệ |

---

## SCR-07b-012 — Form Thêm ngoại lệ cho từng Học sinh

### Mô tả
Form nhập tay để thêm hoặc chỉnh sửa ngoại lệ cho một Học sinh cụ thể trong Ca thi.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+=======================================================================+
|  THÊM NGOẠI LỆ CHO HỌC SINH                         [x Đóng]         |
|  Học sinh: Nguyễn Văn An (HS001)                                      |
|  Ca thi: Ca sáng 10/01  |  Đề: Đề Toán GK1-2026                      |
+=======================================================================+
|                                                                       |
|  Ngoại lệ hiện có:                                                    |
|  +------------------------------------------------+                  |
|  | Loại ngoại lệ     | Giá trị   | Ghi chú        |                  |
|  +-------------------+-----------+----------------+                  |
|  | (Chưa có ngoại lệ)                             |                  |
|  +------------------------------------------------+                  |
|                                                                       |
|  Thêm ngoại lệ mới:                                                   |
|  +-------------------------------------------------------------+     |
|  |  Loại ngoại lệ *                                            |     |
|  |  [-- Chọn loại ngoại lệ ---------------------------------v] |     |
|  |  ( ) Gia hạn thêm thời gian                                |     |
|  |  ( ) Cho phép làm lại thêm lần                             |     |
|  |  ( ) Ngoại lệ khác                                         |     |
|  |                                                             |     |
|  |  Giá trị *                                                  |     |
|  |  Nếu gia hạn: [___] phút                                   |     |
|  |  Nếu làm lại: [___] lần                                    |     |
|  |  Nếu khác:    [__________________________]                 |     |
|  |                                                             |     |
|  |  Ghi chú / Lý do                                           |     |
|  |  [                                                      ]  |     |
|  |  [                                                      ]  |     |
|  +-------------------------------------------------------------+     |
|                                                                       |
|  ! Loại ngoại lệ là bắt buộc.   (error state)                       |
|                                                                       |
|  [   Lưu ngoại lệ   ]   [   Hủy   ]                                  |
+=======================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Modal/Drawer header | Header | Thông tin HS + Ca thi |
| 2 | Bảng ngoại lệ hiện có | DataTable (readonly) | Liệt kê các ngoại lệ đã áp dụng |
| 3 | Dropdown / Radio Loại ngoại lệ | Select + RadioGroup (required) | Chọn loại |
| 4 | Input Giá trị | Dynamic input | Thay đổi theo loại (số phút / số lần / text) |
| 5 | Textarea Ghi chú / Lý do | Textarea | Lý do áp dụng ngoại lệ |
| 6 | Inline error | Alert | Thông báo lỗi validation |
| 7 | Nút [Lưu ngoại lệ] | Button (primary) | Submit |
| 8 | Nút [Hủy] / [x Đóng] | Button (outline) | Đóng modal |

### Flow điều hướng
- Chọn Loại ngoại lệ → Input Giá trị thay đổi theo loại
- [Lưu ngoại lệ] (hợp lệ) → Lưu DB → Toast thành công → Đóng modal → Reload SCR-07b-007
- [Lưu ngoại lệ] (lỗi) → Hiển thị lỗi inline
- [Hủy] / [x Đóng] → Đóng modal, quay lại SCR-07b-007

### Business Rules
- BR-030: Loại ngoại lệ và Giá trị là bắt buộc.
- BR-031: Giá trị gia hạn phải là số nguyên dương (phút), giá trị làm lại ≥ 1 lần.
- BR-032: Có thể áp dụng nhiều loại ngoại lệ cho một HS, nhưng mỗi loại chỉ một lần.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/{slotId}/students/{studentId}/exceptions | Lấy ngoại lệ hiện có |
| POST   | /api/exam-slots/{slotId}/students/{studentId}/exceptions | Thêm ngoại lệ mới |

---

## SCR-07b-013 — Hồ sơ thi của Học sinh

### Mô tả
Màn hình xem đầy đủ hồ sơ thi của một Học sinh trong Ca thi: danh sách các lần thi, điểm, trạng thái, thời gian, tóm tắt bài làm. Cho phép xem chi tiết từng lần thi.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO  ...  >  Ca sáng 10/01  >  HS: Nguyễn Văn An  >  Hồ sơ thi        |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   HỒ SƠ THI — Nguyễn Văn An (HS001)                           |
|          |                                                                 |
|          |  +--[ Thông tin học sinh ]-------------------------------------+|
|          |  | Họ tên: Nguyễn Văn An   Mã HS: HS001                      ||
|          |  | Lớp: 12A1   Trường: THPT A                                ||
|          |  | Ca thi: Ca sáng 10/01   Đề thi: Đề Toán GK1-2026         ||
|          |  | Trạng thái làm bài: Đã nộp bài                           ||
|          |  | Số lần làm: 1   Vi phạm: Không vi phạm                   ||
|          |  | Ngoại lệ: +15 phút gia hạn                               ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  +--[ Các lần thi ]-------------------------------------------+|
|          |  |                                                            ||
|          |  | +----+----------+----------+---------+-------+---------+  ||
|          |  | |Lần | Bắt đầu  | Kết thúc | Điểm   | Trạng | Hành   |  ||
|          |  | |thi |          |          | số     | thái  | động   |  ||
|          |  | +----+----------+----------+---------+-------+---------+  ||
|          |  | | 1  | 08:05    | 09:55    | 8.5/10 | Đã    |[Xem    |  ||
|          |  | |    | 10/01    | 10/01    |        | nộp   | tóm    |  ||
|          |  | |    |          |          |        | bài   | tắt]   |  ||
|          |  | |    |          |          |        |       |[Xem    |  ||
|          |  | |    |          |          |        |       | chi    |  ||
|          |  | |    |          |          |        |       | tiết]  |  ||
|          |  | +----+----------+----------+---------+-------+---------+  ||
|          |  |                                                            ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  +--[ Tóm tắt kết quả (lần thi được chọn) ]------------------+|
|          |  |  Tổng số câu: 40  |  Đúng: 34  |  Sai: 4  |  Bỏ: 2     ||
|          |  |  Điểm: 8.5/10   |  Thời gian làm: 110 phút               ||
|          |  |  Vi phạm trong lần thi này: Không                         ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  [ ← Quay lại danh sách HS ]                                   |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Card thông tin HS | Info card | Họ tên, mã, lớp, trường, ca thi, đề thi, trạng thái, ngoại lệ |
| 2 | Bảng Các lần thi | DataTable | Lần thi, Bắt đầu, Kết thúc, Điểm, Trạng thái, Hành động |
| 3 | Nút [Xem tóm tắt] (hàng) | Button (link) | Tải + hiển thị tóm tắt panel bên dưới |
| 4 | Nút [Xem chi tiết] (hàng) | Button (link) | → SCR-07b-014 |
| 5 | Panel Tóm tắt kết quả | Info panel | Số câu đúng/sai/bỏ, điểm, thời gian, vi phạm |
| 6 | Nút [Quay lại] | Button (outline) | → SCR-07b-007 |

### Flow điều hướng
- [Xem tóm tắt] → Cập nhật Panel Tóm tắt phía dưới với dữ liệu lần thi đó
- [Xem chi tiết] → SCR-07b-014 (Chi tiết bài làm)
- [Quay lại] → SCR-07b-007

### Business Rules
- BR-033: Điểm số, trạng thái lần thi là read-only, không cho phép chỉnh sửa tại đây.
- BR-034: Nếu HS có nhiều lần thi (ngoại lệ), hiển thị tất cả các lần theo thứ tự thời gian.
- BR-035: Panel tóm tắt mặc định hiển thị lần thi gần nhất.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/{slotId}/students/{studentId}/profile | Lấy hồ sơ thi HS |
| GET    | /api/exam-slots/{slotId}/students/{studentId}/attempts | Lấy danh sách lần thi |
| GET    | /api/exam-slots/{slotId}/students/{studentId}/attempts/{attemptId}/summary | Tóm tắt lần thi |

---

## SCR-07b-014 — Chi tiết bài làm của Học sinh

### Mô tả
Màn hình hiển thị chi tiết từng câu hỏi và câu trả lời của Học sinh trong một lần thi cụ thể.

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+===========================================================================+
|  LOGO  ... > Hồ sơ thi Nguyễn Văn An > Chi tiết lần thi 1                |
+===========================================================================+
| SIDEBAR  |                                                                 |
|  ...     |   CHI TIẾT BÀI LÀM — Nguyễn Văn An  |  Lần thi 1              |
|          |   Đề: Đề Toán GK1-2026  |  Điểm: 8.5/10  |  Thời gian: 110ph  |
|          |                                                                 |
|          |  +--[ Bảng điều hướng nhanh câu hỏi ]-------------------------+|
|          |  | [1✓][2✓][3✓][4✗][5✓][6✓][7-][8✓][9✓][10✗]...             ||
|          |  | Chú thích: ✓ Đúng  ✗ Sai  - Bỏ qua                      ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  +--[ Chi tiết từng câu ]--------------------------------------+|
|          |  |                                                            ||
|          |  | Câu 1 / 40  [◀ Trước] [Tiếp theo ▶]                      ||
|          |  |                                                            ||
|          |  | Nội dung câu hỏi:                                         ||
|          |  | Cho phương trình x² - 5x + 6 = 0. Tìm nghiệm x.          ||
|          |  |                                                            ||
|          |  | Các đáp án:                                               ||
|          |  |  (A) x = 2 và x = 3   ← Đáp án đúng  ← Học sinh chọn ✓ ||
|          |  |  (B) x = 1 và x = 6                                       ||
|          |  |  (C) x = -2 và x = -3                                     ||
|          |  |  (D) x = 2 và x = -3                                      ||
|          |  |                                                            ||
|          |  | Kết quả: ✓ Đúng   Điểm câu: 0.25 điểm                    ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  +--[ Thống kê tổng hợp ]-------------------------------------+|
|          |  | Đúng: 34/40  |  Sai: 4/40  |  Bỏ qua: 2/40              ||
|          |  | Điểm: 8.5/10  |  Thời gian làm bài: 110 phút             ||
|          |  | Số lần vi phạm trong lần thi này: 0                      ||
|          |  +------------------------------------------------------------+|
|          |                                                                 |
|          |  [ ← Quay lại Hồ sơ thi ]                                      |
+===========================================================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Header lần thi | Info header | Tên HS, lần thi, đề thi, điểm, thời gian |
| 2 | Grid điều hướng câu | Button grid | Nút cho từng câu, màu theo đúng/sai/bỏ |
| 3 | Panel chi tiết câu | Content panel | Nội dung câu, danh sách đáp án, đánh dấu chọn/đúng |
| 4 | Nút [Trước] / [Tiếp theo] | Button | Điều hướng qua các câu |
| 5 | Panel thống kê tổng hợp | Summary panel | Đúng/Sai/Bỏ, điểm, thời gian, vi phạm |
| 6 | Nút [Quay lại Hồ sơ thi] | Button (outline) | → SCR-07b-013 |

### Flow điều hướng
- Click ô câu trên Grid → Cuộn/chuyển đến chi tiết câu đó
- [Trước] / [Tiếp theo] → Điều hướng tuần tự qua các câu
- [Quay lại Hồ sơ thi] → SCR-07b-013

### Business Rules
- BR-036: Toàn bộ dữ liệu chi tiết bài làm là read-only.
- BR-037: Hiển thị rõ đáp án đúng, đáp án HS chọn, kết quả từng câu.
- BR-038: Câu bỏ qua (không trả lời) hiển thị trạng thái riêng.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/exam-slots/{slotId}/students/{studentId}/attempts/{attemptId}/detail | Lấy chi tiết bài làm |

---

## SCR-07b-015 — Popup Xác nhận xóa

### Mô tả
Popup xác nhận dùng chung cho thao tác Xóa (Danh mục Đợt thi, Đợt thi, Ca thi).

### Actors
- Cán bộ quản lý (CBQL)

### ASCII Wireframe

```
+=========================================+
|  ⚠  Xác nhận xóa                  [x]  |
+=========================================+
|                                         |
|  Bạn có chắc chắn muốn xóa             |
|  "[Tên đối tượng cần xóa]" không?       |
|                                         |
|  Hành động này không thể hoàn tác.      |
|                                         |
|   [   Đồng ý xóa   ]   [   Hủy   ]    |
+=========================================+
```

### Components
| # | Component | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Modal overlay | Modal (small) | Popup trung tâm màn hình |
| 2 | Icon cảnh báo | Icon (⚠ orange/red) | Nhấn mạnh tính nghiêm trọng |
| 3 | Nội dung xác nhận | Text | Hiển thị tên đối tượng sẽ xóa |
| 4 | Cảnh báo không hoàn tác | Text (red) | |
| 5 | Nút [Đồng ý xóa] | Button (danger) | Thực hiện xóa |
| 6 | Nút [Hủy] / [x] | Button (outline) / Icon | Đóng popup, hủy thao tác |

### Flow điều hướng
- [Đồng ý xóa] → Gọi API DELETE → Toast thành công → Đóng popup → Reload danh sách
- [Hủy] / [x] → Đóng popup, không thay đổi dữ liệu

### Business Rules
- BR-039: Nếu đối tượng không đủ điều kiện xóa (đang dùng/có dữ liệu con), nút [Đồng ý xóa] bị disabled và hiển thị lý do.

### API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| DELETE | /api/exam-categories/{id} | Xóa Danh mục Đợt thi |
| DELETE | /api/exam-sessions/{id} | Xóa Đợt thi |
| DELETE | /api/exam-slots/{id} | Xóa Ca thi |

---

## Sơ đồ điều hướng tổng thể

```
SCR-07b-001 (Danh mục Đợt thi)
    |
    v
SCR-07b-002 (Danh sách Đợt thi)
    |
    |--[+ Thêm mới]--> SCR-07b-003 (Form Thêm/Sửa Đợt thi)
    |--[Sửa]---------> SCR-07b-003
    |--[Xóa]---------> SCR-07b-015 (Popup xác nhận)
    |--[Click tên]---> SCR-07b-004 (Danh sách Ca thi)
                            |
                            |--[+ Thêm mới Ca thi]--------> SCR-07b-005 (Form Thêm/Sửa Ca thi)
                            |--[+ Thêm từ Excel]-----------> SCR-07b-006 (Thêm Ca thi từ Excel)
                            |--[+ Thêm HS từ Excel đợt]---> SCR-07b-010 (Thêm HS Excel đa ca)
                            |--[Sửa Ca thi]---------------> SCR-07b-005
                            |--[Xóa Ca thi]---------------> SCR-07b-015
                            |--[Click tên Ca thi]---------> SCR-07b-007 (DS HS trong Ca thi)
                                                                |
                                                                |--[+ Thêm HS từ hệ thống]---> SCR-07b-008 (Popup thêm HS)
                                                                |--[+ Thêm từ Excel]---------> SCR-07b-009 (Thêm HS Excel ca thi)
                                                                |--[+ Thêm ngoại lệ nhiều HS]> SCR-07b-011 (Ngoại lệ Excel)
                                                                |--[Ngoại lệ] (từng HS)------> SCR-07b-012 (Ngoại lệ từng HS)
                                                                |--[Hồ sơ] (từng HS)---------> SCR-07b-013 (Hồ sơ thi)
                                                                                                    |
                                                                                                    |--[Xem chi tiết lần thi]--> SCR-07b-014 (Chi tiết bài làm)
```

---

## Tổng hợp Business Rules

| Mã | Mô tả |
|----|-------|
| BR-001 | Không xóa danh mục đang có Đợt thi hoặc danh mục con |
| BR-002 | Tên danh mục không trùng trong cùng cấp cha |
| BR-003 | Chỉ CBQL được cấp quyền mới thực hiện thao tác |
| BR-004 | Tìm kiếm kết hợp nhiều tiêu chí (AND logic) |
| BR-005 | Không xóa Đợt thi đang có Ca thi hoặc đang diễn ra |
| BR-006 | Xuất báo cáo chỉ khi Đợt thi đã/đang diễn ra |
| BR-007 | Tên, Danh mục, Thời gian Đợt thi là bắt buộc |
| BR-008 | Thời gian kết thúc sau thời gian bắt đầu |
| BR-009 | Không trùng tên Đợt thi trong cùng danh mục |
| BR-010 | Không xóa Ca thi đang diễn ra hoặc đã có HS thi |
| BR-011 | Mỗi Ca thi gắn đúng một Đề thi |
| BR-012 | Thời gian Ca thi trong khoảng thời gian Đợt thi |
| BR-013 | Tên, Thời gian, Đề thi của Ca thi là bắt buộc |
| BR-014 | Thời gian Ca thi trong khoảng Đợt thi |
| BR-015 | Mỗi Ca thi chỉ gắn một Đề thi |
| BR-016 | Thời gian kết thúc Ca thi sau thời gian bắt đầu |
| BR-017 | Chỉ chấp nhận file .xlsx/.xls ≤ 10MB |
| BR-018 | Hệ thống bỏ qua dòng lỗi, lưu dòng hợp lệ |
| BR-019 | Hiển thị chi tiết lỗi từng dòng |
| BR-020 | Mỗi HS chỉ thêm vào Ca thi một lần |
| BR-021 | Tìm kiếm HS kết hợp nhiều tiêu chí (AND logic) |
| BR-022 | Báo cáo kết quả Ca thi chứa điểm, trạng thái, vi phạm |
| BR-023 | HS đã có trong Ca thi bị disabled trong popup thêm |
| BR-024 | Phải chọn ≥1 HS trước khi thêm vào Ca thi |
| BR-025 | HS trùng trong Excel được đánh dấu và bỏ qua khi lưu |
| BR-026 | File Excel phải đúng cấu trúc cột quy định |
| BR-027 | Loại ngoại lệ phải thuộc danh sách hợp lệ |
| BR-028 | Giá trị ngoại lệ hợp lệ theo từng loại |
| BR-029 | HS phải có trong Ca thi mới áp dụng được ngoại lệ |
| BR-030 | Loại ngoại lệ và Giá trị là bắt buộc |
| BR-031 | Gia hạn > 0 phút; làm lại ≥ 1 lần |
| BR-032 | Nhiều loại ngoại lệ cho một HS, mỗi loại một lần |
| BR-033 | Điểm số, trạng thái lần thi là read-only |
| BR-034 | Hiển thị tất cả lần thi theo thứ tự thời gian |
| BR-035 | Panel tóm tắt mặc định hiển thị lần thi gần nhất |
| BR-036 | Chi tiết bài làm là read-only |
| BR-037 | Hiển thị rõ đáp án đúng, HS chọn, kết quả từng câu |
| BR-038 | Câu bỏ qua hiển thị trạng thái riêng |
| BR-039 | Không đủ điều kiện xóa → nút disabled + hiển thị lý do |

---

## Tổng hợp API Endpoints

| Method | Endpoint | Màn hình | Mô tả |
|--------|----------|----------|-------|
| GET | /api/exam-categories/tree | 001 | Cây danh mục |
| POST | /api/exam-categories | 001 | Tạo danh mục |
| PUT | /api/exam-categories/{id} | 001 | Sửa danh mục |
| DELETE | /api/exam-categories/{id} | 001/015 | Xóa danh mục |
| GET | /api/exam-sessions | 002 | Danh sách Đợt thi (filter+paging) |
| DELETE | /api/exam-sessions/{id} | 002/015 | Xóa Đợt thi |
| GET | /api/exam-sessions/{id}/report | 002 | Xuất báo cáo Đợt thi |
| POST | /api/exam-sessions | 003 | Tạo Đợt thi |
| PUT | /api/exam-sessions/{id} | 003 | Sửa Đợt thi |
| GET | /api/exam-sessions/{id}/slots | 004 | Danh sách Ca thi |
| DELETE | /api/exam-slots/{id} | 004/015 | Xóa Ca thi |
| GET | /api/exam-sessions/{id}/slots/report | 004 | Báo cáo tổng hợp Ca thi |
| POST | /api/exam-slots | 005 | Tạo Ca thi |
| PUT | /api/exam-slots/{id} | 005 | Sửa Ca thi |
| GET | /api/exams | 005 | Tìm kiếm Đề thi |
| GET | /api/exam-slots/template | 006 | Tải mẫu Ca thi Excel |
| POST | /api/exam-slots/import/preview | 006 | Upload + xác thực Ca thi |
| POST | /api/exam-slots/import/save | 006 | Lưu Ca thi từ Excel |
| GET | /api/exam-slots/{id}/students | 007 | Danh sách HS trong Ca thi |
| GET | /api/exam-slots/{id}/students/report | 007 | Xuất báo cáo kết quả Ca thi |
| GET | /api/students | 008 | Tìm kiếm HS từ hệ thống |
| POST | /api/exam-slots/{id}/students | 008 | Thêm HS vào Ca thi |
| GET | /api/exam-slots/{id}/students/template | 009 | Mẫu Excel HS (cấp Ca thi) |
| POST | /api/exam-slots/{id}/students/import/preview | 009 | Upload + xác thực HS |
| POST | /api/exam-slots/{id}/students/import/save | 009 | Lưu HS từ Excel |
| GET | /api/exam-sessions/{id}/students/template | 010 | Mẫu Excel HS đa ca |
| POST | /api/exam-sessions/{id}/students/import/preview | 010 | Upload + xác thực đa ca |
| POST | /api/exam-sessions/{id}/students/import/save | 010 | Lưu HS đa ca |
| GET | /api/exam-slots/{id}/exceptions/template | 011 | Mẫu Excel ngoại lệ |
| POST | /api/exam-slots/{id}/exceptions/import/preview | 011 | Upload + xác thực ngoại lệ |
| POST | /api/exam-slots/{id}/exceptions/import/save | 011 | Lưu ngoại lệ từ Excel |
| GET | /api/exam-slots/{slotId}/students/{studentId}/exceptions | 012 | Ngoại lệ hiện có của HS |
| POST | /api/exam-slots/{slotId}/students/{studentId}/exceptions | 012 | Thêm ngoại lệ cho HS |
| GET | /api/exam-slots/{slotId}/students/{studentId}/profile | 013 | Hồ sơ thi HS |
| GET | /api/exam-slots/{slotId}/students/{studentId}/attempts | 013 | Danh sách lần thi |
| GET | /api/exam-slots/{slotId}/students/{studentId}/attempts/{attemptId}/summary | 013 | Tóm tắt lần thi |
| GET | /api/exam-slots/{slotId}/students/{studentId}/attempts/{attemptId}/detail | 014 | Chi tiết bài làm |
