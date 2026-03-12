---
title: "WF-04: Quản lý lớp học & học sinh"
cluster: "Learning - Class Management"
screens: [SCR-04-001, SCR-04-002, SCR-04-003, SCR-04-004, SCR-04-005, SCR-04-006, SCR-04-007, SCR-04-010, SCR-04-011, SCR-04-012, SCR-04-013, SCR-04-014, SCR-04-015]
updated: 2026-03-11
---

# WF-04: Quản lý lớp học & học sinh

---

## Tổng quan luồng

Cụm màn hình này bao phủ toàn bộ vòng đời quản lý **lớp học** và **học sinh trong lớp** thuộc phân hệ Học tập - Quản lý (Learning Management). Có hai nhóm chính:

**Nhóm A – Thông tin lớp học (06a):** Cho phép GV/CBQL tìm kiếm, xem danh sách, xem dashboard tổng hợp, thêm mới (thủ công hoặc từ Excel), chỉnh sửa, xóa, sao chép lớp học.

**Nhóm B – Học sinh trong lớp (06b):** Cho phép GV/CBQL xem danh sách học sinh của lớp, thêm nhanh/thêm mới từ hệ thống, import từ Excel, xóa học sinh khỏi lớp, duyệt/bỏ duyệt đăng ký lớp học.

```
[SCR-04-001: Danh sách lớp học]
        │
        ├──[+ Thêm lớp]──────────────→ [SCR-04-003: Form thêm mới lớp]
        │                                        │ Lưu thành công
        │                                        └────────────────────→ [SCR-04-001]
        │
        ├──[✏️ Chỉnh sửa]─────────────→ [SCR-04-004: Form chỉnh sửa lớp]
        │                                        │ Lưu thành công
        │                                        └────────────────────→ [SCR-04-001]
        │
        ├──[🗑️ Xóa]──────────────────→ [SCR-04-005: Dialog xác nhận xóa]
        │                                        │ Đồng ý → xóa → [SCR-04-001]
        │                                        └ Hủy   → [SCR-04-001]
        │
        ├──[📋 Sao chép]──────────────→ [SCR-04-006: Dialog xác nhận sao chép]
        │                                        │ Đồng ý → tạo mới → [SCR-04-001]
        │                                        └ Hủy   → [SCR-04-001]
        │
        ├──[📥 Import Excel]──────────→ [SCR-04-007: Stepper Import lớp học]
        │                                        │ Hoàn thành → [SCR-04-001]
        │
        ├──[Dashboard]───────────────→ [SCR-04-002: Dashboard lớp học]
        │
        └──[Click tên lớp]───────────→ [SCR-04-010: Danh sách học sinh trong lớp]
                                                │
                                                ├──[Thêm nhanh HS]────→ [SCR-04-011: Thêm nhanh HS]
                                                │                               │ Lưu → [SCR-04-010]
                                                │
                                                ├──[Thêm mới từ HT]───→ [SCR-04-012: Form tìm & chọn HS]
                                                │                               │ Lưu → [SCR-04-010]
                                                │
                                                ├──[Import Excel]─────→ [SCR-04-013: Stepper Import HS]
                                                │                               │ Hoàn thành → [SCR-04-010]
                                                │
                                                ├──[🗑️ Xóa HS]────────→ [SCR-04-014: Dialog xác nhận xóa HS]
                                                │                               │ Đồng ý → [SCR-04-010]
                                                │
                                                └──[Duyệt/Bỏ duyệt]──→ [SCR-04-015: Màn duyệt đăng ký]
                                                                                │ Lưu → [SCR-04-010]
```

---

## Phần A: Quản lý thông tin lớp học

---

### SCR-04-001: Danh sách lớp học

**Mô tả:** Màn hình trung tâm của phân hệ quản lý lớp học. Hiển thị toàn bộ danh sách lớp học dưới dạng bảng có phân trang, hỗ trợ tìm kiếm theo từ khóa, lọc theo năm học và khối lớp. Là điểm xuất phát cho mọi thao tác CRUD lớp học.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** Sidebar menu > Quản lý học tập > Lớp học

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Trang chủ > Quản lý học tập > Lớp học                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                        QUẢN LÝ LỚP HỌC                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ TOOLBAR                                                              │   │
│  │  [+ Thêm lớp học]  [📥 Import Excel]          [📊 Dashboard]        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ BỘ LỌC & TÌM KIẾM                                                    │   │
│  │                                                                      │   │
│  │  Năm học: [2025-2026        ▼]   Khối: [Tất cả  ▼]                  │   │
│  │                                                                      │   │
│  │  🔍 [Nhập tên lớp, mã lớp...              ] [Tìm kiếm] [Đặt lại]   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ DANH SÁCH LỚP HỌC                          Tổng: 45 lớp              │   │
│  ├───┬──────────┬───────┬───────────┬────────┬──────────────────┬───────┤   │
│  │ ☐ │ Tên lớp  │ Khối  │  Năm học  │ Số HS  │ GV chủ nhiệm     │Thao   │   │
│  │   │          │       │           │        │                  │tác    │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ☐ │ 10A1     │  10   │ 2025-2026 │   35   │ Nguyễn Văn An    │✏️🗑️📋 │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ☐ │ 10A2     │  10   │ 2025-2026 │   33   │ Trần Thị Bình    │✏️🗑️📋 │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ☐ │ 10B1     │  10   │ 2025-2026 │   36   │ Lê Văn Cường     │✏️🗑️📋 │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ☐ │ 11A1     │  11   │ 2025-2026 │   34   │ Phạm Thị Duyên   │✏️🗑️📋 │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ☐ │ 11A2     │  11   │ 2025-2026 │   32   │ Hoàng Văn Em     │✏️🗑️📋 │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ☐ │ 12A1     │  12   │ 2025-2026 │   30   │ Vũ Thị Fương     │✏️🗑️📋 │   │
│  ├───┼──────────┼───────┼───────────┼────────┼──────────────────┼───────┤   │
│  │ ...                                                                  │   │
│  ├───┴──────────┴───────┴───────────┴────────┴──────────────────┴───────┤   │
│  │                                                                      │   │
│  │  Hiển thị 1–10 / 45 bản ghi         [10 ▼] bản ghi/trang            │   │
│  │                         [◀ Trước]  1  2  3  4  5  [Sau ▶]           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Chú thích icon thao tác:
  ✏️  = Chỉnh sửa → SCR-04-004
  🗑️  = Xóa       → SCR-04-005
  📋  = Sao chép  → SCR-04-006
  (Click tên lớp) → SCR-04-010
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | Trang chủ > Quản lý học tập > Lớp học |
| Button "Thêm lớp học" | Button (primary) | Quyền: thêm mới; → SCR-04-003 |
| Button "Import Excel" | Button (secondary) | Quyền: thêm mới; → SCR-04-007 |
| Button "Dashboard" | Button (outline) | → SCR-04-002 |
| Dropdown "Năm học" | Filter Select | Mặc định: năm học hiện tại; danh sách từ API |
| Dropdown "Khối" | Filter Select | Options: Tất cả, 10, 11, 12, ... |
| Input tìm kiếm | Search Input | Tìm theo tên lớp, mã lớp; debounce 300ms |
| Button "Tìm kiếm" | Button | Kích hoạt search |
| Button "Đặt lại" | Button (ghost) | Reset filter về mặc định |
| Checkbox "chọn tất cả" | Checkbox | Ở header table; chọn/bỏ chọn toàn trang |
| Checkbox từng hàng | Checkbox | Chọn lớp cho bulk action |
| Cột "Tên lớp" | Link | Click → SCR-04-010 |
| Cột "Thao tác" | Action group | ✏️ Sửa / 🗑️ Xóa / 📋 Sao chép |
| Phân trang (pagination) | Pagination | Hiển thị tổng, trang hiện tại, prev/next |
| Dropdown "bản ghi/trang" | Select | Options: 10, 20, 50, 100 |
| Nhãn tổng số | Text | "Tổng: N lớp" |

#### Flow điều hướng

- **[+ Thêm lớp học]** → SCR-04-003
- **[📥 Import Excel]** → SCR-04-007
- **[📊 Dashboard]** → SCR-04-002
- **[Click tên lớp]** → SCR-04-010
- **[✏️ Sửa]** → SCR-04-004
- **[🗑️ Xóa]** → SCR-04-005 (dialog)
- **[📋 Sao chép]** → SCR-04-006 (dialog)
- **Đổi trang / đổi số bản ghi/trang** → reload danh sách (giữ filter)

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Mặc định filter năm học = năm học hiện tại khi mở màn hình |
| BR-002 | Tìm kiếm từ khóa áp dụng on tên lớp và mã lớp (ILIKE / không phân biệt hoa thường) |
| BR-003 | Phân trang mặc định 10 bản ghi/trang; tùy chọn: 10, 20, 50, 100 |
| BR-004 | GV chỉ thấy lớp mình chủ nhiệm hoặc có liên quan; CBQL thấy tất cả |
| BR-005 | Không cho phép xóa lớp học đang có học sinh hoặc đang có dữ liệu điểm danh |
| BR-006 | Khi không có kết quả tìm kiếm → hiển thị empty state: "Không tìm thấy lớp học phù hợp" |

#### API Endpoints

```
GET  /api/classes
     ?yearId={id}
     &grade={10|11|12}
     &keyword={string}
     &page={number}
     &size={10|20|50|100}
     &sortBy={name|grade|studentCount}
     &sortDir={asc|desc}

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "10A1",
      "grade": 10,
      "yearId": "uuid",
      "yearName": "2025-2026",
      "studentCount": 35,
      "homeroomTeacher": { "id": "uuid", "name": "Nguyễn Văn An" }
    }
  ],
  "total": 45,
  "page": 1,
  "size": 10
}

GET  /api/school-years          → Danh sách năm học cho dropdown
GET  /api/grades                → Danh sách khối lớp
```

---

### SCR-04-002: Dashboard / Khối thông tin lớp học

**Mô tả:** Màn hình tổng hợp thống kê dạng dashboard, hiển thị các widget/card thể hiện tình trạng tổng quan của các lớp học: số lớp, số học sinh, tỷ lệ duyệt, biểu đồ phân bố theo khối, danh sách lớp gần đây.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > [📊 Dashboard] hoặc Sidebar > Dashboard Lớp học

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Trang chủ > Quản lý học tập > Dashboard Lớp học                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                    DASHBOARD LỚP HỌC                                        │
│                                                                             │
│  Năm học: [2025-2026  ▼]                             [← Về danh sách lớp]   │
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │  📚 Tổng lớp  │  │  👥 Tổng HS  │  │ ✅ Đã duyệt   │  │⏳ Chờ duyệt │ │
│  │               │  │               │  │               │  │              │ │
│  │      45       │  │    1,520      │  │    1,380      │  │     140      │ │
│  │               │  │               │  │   (90.8%)     │  │    (9.2%)    │ │
│  │  lớp học      │  │  học sinh     │  │   học sinh    │  │  học sinh    │ │
│  └───────────────┘  └───────────────┘  └───────────────┘  └──────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌────────────────────────────────┐   │
│  │  PHÂN BỐ LỚP THEO KHỐI          │  │  TOP 5 LỚP NHIỀU HS NHẤT      │   │
│  │                                 │  │                                │   │
│  │  Khối 10 ████████████ 18 lớp    │  │  1. 10B1 – 38 học sinh        │   │
│  │  Khối 11 ██████████   15 lớp    │  │  2. 10A1 – 36 học sinh        │   │
│  │  Khối 12 ████████     12 lớp    │  │  3. 11A3 – 35 học sinh        │   │
│  │                                 │  │  4. 12A1 – 34 học sinh        │   │
│  │  [Biểu đồ cột hoặc bánh]        │  │  5. 10A2 – 33 học sinh        │   │
│  └─────────────────────────────────┘  └────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  DANH SÁCH LỚP HỌC GẦN ĐÂY (5 lớp mới nhất được tạo/cập nhật)      │   │
│  ├──────────┬───────┬───────────┬────────┬──────────────────┬───────────┤   │
│  │ Tên lớp  │ Khối  │  Năm học  │ Số HS  │ GV chủ nhiệm     │Cập nhật   │   │
│  ├──────────┼───────┼───────────┼────────┼──────────────────┼───────────┤   │
│  │ 10A1     │  10   │ 2025-2026 │   35   │ Nguyễn Văn An    │10/03/2026 │   │
│  ├──────────┼───────┼───────────┼────────┼──────────────────┼───────────┤   │
│  │ 10A2     │  10   │ 2025-2026 │   33   │ Trần Thị Bình    │09/03/2026 │   │
│  ├──────────┼───────┼───────────┼────────┼──────────────────┼───────────┤   │
│  │ ...                                                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                          [Xem tất cả lớp học →]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Dropdown "Năm học" | Filter Select | Reload toàn bộ widget khi đổi |
| Button "← Về danh sách lớp" | Button (ghost) | → SCR-04-001 |
| Card "Tổng lớp" | Stat Card | Số lớp học trong năm được chọn |
| Card "Tổng HS" | Stat Card | Tổng học sinh tất cả lớp |
| Card "Đã duyệt" | Stat Card | Số HS trạng thái đã duyệt + % |
| Card "Chờ duyệt" | Stat Card | Số HS trạng thái chờ duyệt + % |
| Biểu đồ phân bố theo khối | Bar/Pie Chart | Số lớp / khối |
| Bảng Top 5 lớp nhiều HS | Table (read-only) | Sắp xếp DESC theo studentCount |
| Bảng danh sách gần đây | Table | 5 bản ghi, click → SCR-04-010 |
| Link "Xem tất cả lớp học" | Link | → SCR-04-001 |

#### Flow điều hướng

- **[← Về danh sách lớp]** → SCR-04-001
- **[Đổi Năm học]** → Reload tất cả widget với yearId mới
- **[Click tên lớp ở bảng gần đây]** → SCR-04-010
- **[Xem tất cả lớp học →]** → SCR-04-001

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Widget lọc theo năm học được chọn (mặc định: năm hiện tại) |
| BR-002 | GV chỉ thấy thống kê các lớp mình liên quan; CBQL thấy tổng trường |
| BR-003 | Nếu không có dữ liệu → hiển thị "Chưa có dữ liệu lớp học" |
| BR-004 | Dữ liệu dashboard được cache phía server, làm mới mỗi 5 phút |

#### API Endpoints

```
GET /api/classes/dashboard?yearId={id}

Response:
{
  "totalClasses": 45,
  "totalStudents": 1520,
  "approvedStudents": 1380,
  "pendingStudents": 140,
  "byGrade": [
    { "grade": 10, "count": 18 },
    { "grade": 11, "count": 15 },
    { "grade": 12, "count": 12 }
  ],
  "topClasses": [...],
  "recentClasses": [...]
}
```

---

### SCR-04-003: Form thêm mới lớp học

**Mô tả:** Form nhập thông tin để tạo mới một lớp học trong hệ thống. Bao gồm các trường bắt buộc (tên lớp, khối, năm học) và tùy chọn (GV chủ nhiệm, mô tả). Sau khi lưu thành công, chuyển về danh sách và hiển thị thông báo.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > [+ Thêm lớp học]

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Trang chủ > Quản lý học tập > Lớp học > Thêm mới lớp học                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                      THÊM MỚI LỚP HỌC                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  Tên lớp học *                                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │ VD: 10A1                                                       │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │  ⚠ Tên lớp không được để trống                                       │   │
│  │                                                                      │   │
│  │  Năm học *                          Khối lớp *                       │   │
│  │  ┌──────────────────────────────┐   ┌───────────────────────────┐    │   │
│  │  │ 2025-2026                  ▼ │   │ 10                      ▼ │    │   │
│  │  └──────────────────────────────┘   └───────────────────────────┘    │   │
│  │                                                                      │   │
│  │  Giáo viên chủ nhiệm                                                 │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │ 🔍 Tìm giáo viên theo tên hoặc mã GV...                       │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                      │   │
│  │  Mô tả / Ghi chú                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │                                                                │  │   │
│  │  │                                                                │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │  Tối đa 500 ký tự                                                    │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                          [Hủy]          [💾 Lưu lớp học]                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Trạng thái khi validation lỗi:
┌──────────────────────────────────────────────────────────────────────────┐
│  Tên lớp học *                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                         [border-red]│  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  ⚠ Vui lòng nhập tên lớp học                   ← error message (red)     │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | ... > Thêm mới lớp học |
| Input "Tên lớp học" | Text Input | Bắt buộc (*); max 50 ký tự |
| Dropdown "Năm học" | Select | Bắt buộc; API: GET /api/school-years |
| Dropdown "Khối lớp" | Select | Bắt buộc; Options: 10, 11, 12, ... |
| Autocomplete "GV chủ nhiệm" | Autocomplete | Không bắt buộc; tìm theo tên/mã GV |
| Textarea "Mô tả/Ghi chú" | Textarea | Không bắt buộc; max 500 ký tự; counter |
| Button "Hủy" | Button (ghost) | → SCR-04-001 (không lưu) |
| Button "Lưu lớp học" | Button (primary) | Submit form |
| Error message | Inline text (red) | Xuất hiện dưới field khi validation lỗi |
| Toast thành công | Toast | "Thêm lớp học thành công!" |

#### Flow điều hướng

- **[Hủy]** → SCR-04-001 (không lưu, confirm nếu đã nhập dữ liệu)
- **[Lưu lớp học] – validation lỗi** → Hiển thị error inline, giữ nguyên form
- **[Lưu lớp học] – thành công** → Toast "Thêm lớp học thành công!" → SCR-04-001

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Tên lớp học là bắt buộc; không được để trống; max 50 ký tự |
| BR-002 | Năm học là bắt buộc |
| BR-003 | Khối lớp là bắt buộc |
| BR-004 | Tên lớp + Năm học phải là duy nhất trong hệ thống (không trùng lặp) |
| BR-005 | Nếu người dùng đã nhập dữ liệu và nhấn Hủy → hiện confirm dialog "Bỏ thay đổi?" |
| BR-006 | Sau khi lưu thành công → redirect về SCR-04-001, highlight dòng lớp mới |

#### API Endpoints

```
POST /api/classes
Body:
{
  "name": "10A1",
  "yearId": "uuid",
  "grade": 10,
  "homeroomTeacherId": "uuid" | null,
  "description": "string" | null
}

Response 201:
{ "id": "uuid", "name": "10A1", ... }

Response 400:
{ "error": "CLASS_NAME_DUPLICATE", "message": "Tên lớp đã tồn tại trong năm học này" }

GET /api/teachers/search?keyword={string}    → Autocomplete GV chủ nhiệm
GET /api/school-years                        → Dropdown năm học
```

---

### SCR-04-004: Form chỉnh sửa lớp học

**Mô tả:** Form cập nhật thông tin lớp học đã có. Hiển thị dữ liệu hiện tại, cho phép chỉnh sửa các trường, validate và lưu vào CSDL. Cấu trúc tương tự SCR-04-003 nhưng pre-fill dữ liệu cũ.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > [✏️ Chỉnh sửa] trên hàng lớp học

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Trang chủ > Quản lý học tập > Lớp học > Chỉnh sửa lớp học               │
├─────────────────────────────────────────────────────────────────────────────┤
│                     CHỈNH SỬA LỚP HỌC                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  Tên lớp học *                                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │ 10A1                                          [pre-filled]     │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                      │   │
│  │  Năm học *                          Khối lớp *                       │   │
│  │  ┌──────────────────────────────┐   ┌───────────────────────────┐    │   │
│  │  │ 2025-2026           [filled]▼│   │ 10              [filled]▼ │    │   │
│  │  └──────────────────────────────┘   └───────────────────────────┘    │   │
│  │                                                                      │   │
│  │  Giáo viên chủ nhiệm                                                 │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │ Nguyễn Văn An                                    [×] [filled] │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                      │   │
│  │  Mô tả / Ghi chú                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │ Lớp chọn – chương trình chuẩn năm 2025-2026          [filled] │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │  45/500 ký tự                                                        │   │
│  │                                                                      │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  Thông tin hệ thống (chỉ đọc)                                        │   │
│  │  Tạo lúc: 01/09/2025 08:00  |  Cập nhật lần cuối: 09/03/2026 14:30  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                          [Hủy]          [💾 Cập nhật lớp học]               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | ... > Chỉnh sửa lớp học |
| Input "Tên lớp học" | Text Input | Pre-filled; bắt buộc (*) |
| Dropdown "Năm học" | Select | Pre-filled; bắt buộc |
| Dropdown "Khối lớp" | Select | Pre-filled; bắt buộc |
| Autocomplete "GV chủ nhiệm" | Autocomplete | Pre-filled nếu có; [×] để xóa GV |
| Textarea "Mô tả/Ghi chú" | Textarea | Pre-filled; counter ký tự |
| Metadata section | Read-only text | createdAt, updatedAt |
| Button "Hủy" | Button (ghost) | → SCR-04-001 |
| Button "Cập nhật lớp học" | Button (primary) | Submit form PATCH |
| Toast thành công | Toast | "Cập nhật lớp học thành công!" |

#### Flow điều hướng

- **[Hủy]** → SCR-04-001
- **[Cập nhật lớp học] – validation lỗi** → Hiển thị error inline
- **[Cập nhật lớp học] – thành công** → Toast → SCR-04-001

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Tất cả validation giống SCR-04-003 |
| BR-002 | Không thể thay đổi năm học nếu lớp đã có dữ liệu điểm danh/điểm số |
| BR-003 | Nếu đổi tên lớp → kiểm tra trùng tên trong cùng năm học |
| BR-004 | Metadata (createdAt, updatedAt) chỉ hiển thị, không được chỉnh sửa |
| BR-005 | Nếu người dùng chưa thay đổi gì mà nhấn Cập nhật → cảnh báo "Không có thay đổi" |

#### API Endpoints

```
GET  /api/classes/{id}           → Load dữ liệu pre-fill
PATCH /api/classes/{id}
Body:
{
  "name": "10A1",
  "yearId": "uuid",
  "grade": 10,
  "homeroomTeacherId": "uuid" | null,
  "description": "string" | null
}
```

---

### SCR-04-005: Dialog xác nhận xóa lớp học

**Mô tả:** Dialog modal cảnh báo và xác nhận trước khi thực hiện xóa lớp học. Hiển thị tên lớp, cảnh báo hậu quả của việc xóa. Yêu cầu người dùng chủ động xác nhận.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > [🗑️ Xóa] trên hàng lớp học

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Màn hình nền SCR-04-001 – mờ/blur]                                         │
│                                                                             │
│              ┌────────────────────────────────────────┐                    │
│              │                                        │                    │
│              │   🗑️  Xác nhận xóa lớp học              │                    │
│              │   ──────────────────────────────────   │                    │
│              │                                        │                    │
│              │   Bạn có chắc chắn muốn xóa lớp học   │                    │
│              │   sau đây không?                       │                    │
│              │                                        │                    │
│              │   ┌────────────────────────────────┐   │                    │
│              │   │  Lớp: 10A1                     │   │                    │
│              │   │  Năm học: 2025-2026             │   │                    │
│              │   │  GV chủ nhiệm: Nguyễn Văn An    │   │                    │
│              │   │  Số học sinh: 35                │   │                    │
│              │   └────────────────────────────────┘   │                    │
│              │                                        │                    │
│              │   ⚠  Lưu ý: Thao tác này sẽ xóa      │                    │
│              │   vĩnh viễn lớp học và không thể      │                    │
│              │   hoàn tác.                            │                    │
│              │                                        │                    │
│              │         [Hủy]    [🗑️ Xác nhận xóa]     │                    │
│              │                                        │                    │
│              └────────────────────────────────────────┘                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Trạng thái: Lớp có học sinh (không cho xóa):
┌───────────────────────────────────────────┐
│  🚫  Không thể xóa lớp học               │
│  ──────────────────────────────────────   │
│                                           │
│  Lớp 10A1 hiện có 35 học sinh. Vui lòng  │
│  xóa hết học sinh khỏi lớp trước khi     │
│  thực hiện xóa lớp học.                   │
│                                           │
│                        [Đã hiểu]          │
└───────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Modal Overlay | Overlay | Background mờ; đóng khi click ngoài = Hủy |
| Icon cảnh báo | Icon | 🗑️ màu đỏ |
| Info card | Card (read-only) | Tên lớp, năm học, GV chủ nhiệm, số HS |
| Warning text | Text (orange/red) | Cảnh báo không thể hoàn tác |
| Button "Hủy" | Button (ghost) | Đóng dialog, về SCR-04-001 |
| Button "Xác nhận xóa" | Button (danger/red) | Thực hiện DELETE |
| Toast thành công | Toast | "Xóa lớp học thành công!" |
| Dialog lỗi | Alert Dialog | Khi lớp có học sinh: không cho xóa |

#### Flow điều hướng

- **[Hủy]** hoặc **[Click ngoài dialog]** → Đóng dialog, ở lại SCR-04-001
- **[Xác nhận xóa] – lớp có học sinh** → Hiển thị dialog lỗi "Không thể xóa"
- **[Xác nhận xóa] – thành công** → Toast → Reload SCR-04-001 (xóa dòng lớp đã xóa)

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Không cho xóa lớp học còn học sinh (studentCount > 0) |
| BR-002 | Không cho xóa lớp học đã có dữ liệu điểm danh hoặc điểm số |
| BR-003 | Xóa là xóa mềm (soft delete); dữ liệu vẫn lưu CSDL, flag deleted = true |

#### API Endpoints

```
DELETE /api/classes/{id}

Response 200: { "message": "Xóa thành công" }
Response 400: { "error": "CLASS_HAS_STUDENTS", "message": "Lớp học còn học sinh" }
Response 400: { "error": "CLASS_HAS_DATA",     "message": "Lớp học đã có dữ liệu" }
```

---

### SCR-04-006: Dialog sao chép lớp học

**Mô tả:** Dialog xác nhận và cấu hình khi sao chép một lớp học có sẵn thành lớp học mới. Cho phép người dùng điều chỉnh tên lớp mới và năm học đích trước khi xác nhận.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > [📋 Sao chép] trên hàng lớp học

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Màn hình nền SCR-04-001 – mờ/blur]                                         │
│                                                                             │
│              ┌─────────────────────────────────────────┐                   │
│              │                                         │                   │
│              │   📋  Sao chép lớp học                   │                   │
│              │   ───────────────────────────────────   │                   │
│              │                                         │                   │
│              │   Lớp nguồn:                            │                   │
│              │   ┌─────────────────────────────────┐   │                   │
│              │   │  10A1 – Năm học 2025-2026        │   │                   │
│              │   │  GV chủ nhiệm: Nguyễn Văn An     │   │                   │
│              │   └─────────────────────────────────┘   │                   │
│              │                                         │                   │
│              │   Thông tin lớp mới:                    │                   │
│              │                                         │                   │
│              │   Tên lớp mới *                         │                   │
│              │   ┌─────────────────────────────────┐   │                   │
│              │   │ 10A1 (Bản sao)                  │   │                   │
│              │   └─────────────────────────────────┘   │                   │
│              │                                         │                   │
│              │   Năm học *                             │                   │
│              │   ┌─────────────────────────────────┐   │                   │
│              │   │ 2025-2026                      ▼ │   │                   │
│              │   └─────────────────────────────────┘   │                   │
│              │                                         │                   │
│              │   ℹ Lớp mới sẽ không bao gồm danh      │                   │
│              │   sách học sinh của lớp gốc.            │                   │
│              │                                         │                   │
│              │       [Hủy]     [📋 Xác nhận sao chép]  │                   │
│              │                                         │                   │
│              └─────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Modal Overlay | Overlay | Background mờ |
| Card "Lớp nguồn" | Card (read-only) | Tên lớp, năm học, GV chủ nhiệm gốc |
| Input "Tên lớp mới" | Text Input | Pre-fill: "{TênGốc} (Bản sao)"; bắt buộc |
| Dropdown "Năm học" | Select | Pre-fill: năm hiện tại; bắt buộc |
| Info note | Info text (blue) | "Lớp mới sẽ không bao gồm học sinh" |
| Button "Hủy" | Button (ghost) | Đóng dialog |
| Button "Xác nhận sao chép" | Button (primary) | Thực hiện POST copy |
| Toast thành công | Toast | "Sao chép lớp học thành công!" |

#### Flow điều hướng

- **[Hủy]** → Đóng dialog, ở lại SCR-04-001
- **[Xác nhận sao chép] – validation lỗi** → Hiển thị error inline trên tên lớp
- **[Xác nhận sao chép] – thành công** → Toast → Reload SCR-04-001 + highlight lớp mới

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Tên lớp mới bắt buộc; không trùng với lớp khác cùng năm học |
| BR-002 | Sao chép chỉ copy metadata lớp (tên, khối, GV chủ nhiệm, mô tả); KHÔNG copy danh sách học sinh |
| BR-003 | Năm học mới có thể khác năm học gốc |

#### API Endpoints

```
POST /api/classes/{sourceId}/copy
Body:
{
  "newName": "10A1 (Bản sao)",
  "yearId": "uuid"
}

Response 201: { "id": "uuid", "name": "...", ... }
Response 400: { "error": "CLASS_NAME_DUPLICATE" }
```

---

### SCR-04-007: Import lớp học từ file Excel (Stepper)

**Mô tả:** Luồng import nhiều lớp học cùng lúc từ file Excel theo quy trình 4 bước (stepper): Tải mẫu → Upload file → Preview dữ liệu → Xác nhận lưu. Mỗi bước cần hoàn thành mới được chuyển sang bước tiếp theo.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > [📥 Import Excel]

#### Layout – Step 1: Tải file mẫu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Trang chủ > Quản lý học tập > Lớp học > Import từ Excel                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                    IMPORT LỚP HỌC TỪ FILE EXCEL                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  STEPPER                                                             │   │
│  │  ●─────────────○─────────────○─────────────○                        │   │
│  │  1.Tải mẫu   2.Upload     3.Preview     4.Xác nhận                  │   │
│  │  [active]    [inactive]   [inactive]    [inactive]                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  BƯỚC 1: TẢI FILE MẪU NHẬP LIỆU                                     │   │
│  │                                                                      │   │
│  │  Vui lòng tải file mẫu Excel về máy, điền thông tin lớp học         │   │
│  │  theo đúng định dạng, sau đó upload lên hệ thống.                   │   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │  📄 Cấu trúc file mẫu (mau_nhap_lop_hoc.xlsx)                 │  │   │
│  │  │                                                                │  │   │
│  │  │  Cột A: Tên lớp học *     (VD: 10A1)                          │  │   │
│  │  │  Cột B: Khối *            (VD: 10)                            │  │   │
│  │  │  Cột C: Năm học *         (VD: 2025-2026)                     │  │   │
│  │  │  Cột D: Mã GV chủ nhiệm   (VD: GV001) – tùy chọn             │  │   │
│  │  │  Cột E: Mô tả             – tùy chọn                          │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                      │   │
│  │                  [⬇ Tải file mẫu (mau_lop_hoc.xlsx)]               │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                 [Hủy]                            [Tiếp theo →]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Layout – Step 2: Upload file

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ●─────────────●─────────────○─────────────○                                │
│  1.Tải mẫu   2.Upload     3.Preview     4.Xác nhận                          │
│  [done]      [active]     [inactive]    [inactive]                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  BƯỚC 2: UPLOAD FILE EXCEL                                                   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │         ┌─────────────────────────────────────────────┐             │   │
│  │         │                                             │             │   │
│  │         │        📁                                   │             │   │
│  │         │   Kéo thả file vào đây                      │             │   │
│  │         │        hoặc                                 │             │   │
│  │         │   [Chọn file từ máy tính]                   │             │   │
│  │         │                                             │             │   │
│  │         │   Chỉ hỗ trợ: .xlsx, .xls                   │             │   │
│  │         │   Dung lượng tối đa: 5 MB                   │             │   │
│  │         └─────────────────────────────────────────────┘             │   │
│  │                                                                      │   │
│  │   Trạng thái sau khi chọn file:                                      │   │
│  │   ✅ danh_sach_lop_2026.xlsx (128 KB)  [× Xóa]                       │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│              [← Quay lại]                    [Tiếp theo →]                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Layout – Step 3: Preview dữ liệu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ●─────────────●─────────────●─────────────○                                │
│  1.Tải mẫu   2.Upload     3.Preview     4.Xác nhận                          │
│  [done]      [done]       [active]      [inactive]                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  BƯỚC 3: XEM TRƯỚC DỮ LIỆU                                                   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Tổng: 12 dòng dữ liệu  |  ✅ Hợp lệ: 10  |  ❌ Lỗi: 2            │   │
│  ├──────┬──────────┬───────┬───────────┬──────────────┬─────────────────┤   │
│  │ STT  │ Tên lớp  │ Khối  │  Năm học  │ GV chủ nhiệm │ Trạng thái      │   │
│  ├──────┼──────────┼───────┼───────────┼──────────────┼─────────────────┤   │
│  │  1   │ 10A1     │  10   │ 2025-2026 │ Nguyễn V. An │ ✅ Hợp lệ       │   │
│  ├──────┼──────────┼───────┼───────────┼──────────────┼─────────────────┤   │
│  │  2   │ 10A2     │  10   │ 2025-2026 │              │ ✅ Hợp lệ       │   │
│  ├──────┼──────────┼───────┼───────────┼──────────────┼─────────────────┤   │
│  │  3   │          │  10   │ 2025-2026 │              │ ❌ Thiếu tên lớp │   │
│  ├──────┼──────────┼───────┼───────────┼──────────────┼─────────────────┤   │
│  │  4   │ 10A1     │  10   │ 2025-2026 │              │ ❌ Trùng tên lớp │   │
│  ├──────┼──────────┼───────┼───────────┼──────────────┼─────────────────┤   │
│  │  ...                                                                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⚠ Có 2 dòng lỗi. Chỉ các dòng hợp lệ mới được nhập vào hệ thống.         │
│    Bạn có thể tiếp tục để nhập 10 dòng hợp lệ.                              │
│                                                                             │
│              [← Quay lại]                    [Tiếp theo →]                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Layout – Step 4: Xác nhận lưu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ●─────────────●─────────────●─────────────●                                │
│  1.Tải mẫu   2.Upload     3.Preview     4.Xác nhận                          │
│  [done]      [done]       [done]        [active]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  BƯỚC 4: XÁC NHẬN NHẬP DỮ LIỆU                                               │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Tóm tắt import:                                                     │   │
│  │                                                                      │   │
│  │     Tổng dòng dữ liệu trong file:    12                              │   │
│  │     ✅ Dòng sẽ được nhập:            10                              │   │
│  │     ❌ Dòng bị bỏ qua (lỗi):         2                              │   │
│  │                                                                      │   │
│  │  ℹ Sau khi xác nhận, 10 lớp học mới sẽ được tạo trong hệ thống.    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│              [← Quay lại]            [💾 Xác nhận nhập dữ liệu]             │
│                                                                             │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                                       │
│   Sau khi nhập thành công:                                                  │
│                                                                             │
│   ✅  Nhập dữ liệu thành công!                                              │
│      Đã tạo 10 lớp học mới.                                                 │
│                                                                             │
│                          [Về danh sách lớp học]                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Stepper (4 bước) | Stepper | Trạng thái: inactive / active / done / error |
| Button "Tải file mẫu" | Download Button | GET /api/classes/import/template |
| Bảng cấu trúc file mẫu | Info Table | Hiển thị tên cột, kiểu dữ liệu, bắt buộc |
| Dropzone upload | Drag-and-drop | Chỉ nhận .xlsx, .xls; max 5MB |
| Button "Chọn file" | Button | Trigger input[type=file] |
| Trạng thái file đã chọn | File preview | Tên file, dung lượng, [× Xóa] |
| Preview table | Table | Cột STT, Tên lớp, Khối, Năm học, GV, Trạng thái |
| Badge trạng thái | Badge | ✅ Hợp lệ (green) / ❌ + lý do lỗi (red) |
| Tóm tắt import | Summary card | Tổng / sẽ nhập / bỏ qua |
| Button "Tiếp theo" | Button (primary) | Chuyển bước; disabled khi chưa đủ điều kiện |
| Button "Quay lại" | Button (ghost) | Về bước trước |
| Button "Hủy" | Button | → SCR-04-001 |
| Success state | Success block | Hiển thị sau khi lưu xong |

#### Flow điều hướng

- **Step 1 [Tải file mẫu]** → Download file .xlsx
- **Step 1 [Tiếp theo →]** → Step 2
- **Step 2 [Upload file]** → Parse file, chuyển Step 3
- **Step 3 [Tiếp theo →]** → Step 4 (summary)
- **Step 4 [Xác nhận nhập]** → POST /api/classes/import → Hiển thị kết quả
- **[Về danh sách lớp học]** → SCR-04-001
- **[Hủy]** (bất kỳ step) → SCR-04-001

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Chỉ chấp nhận file .xlsx / .xls; dung lượng tối đa 5 MB |
| BR-002 | Dòng thiếu Tên lớp / Khối / Năm học → đánh dấu lỗi, bỏ qua khi nhập |
| BR-003 | Dòng trùng tên lớp trong cùng năm học → đánh dấu lỗi |
| BR-004 | Mã GV chủ nhiệm không tồn tại → dòng vẫn hợp lệ nhưng cột GV = null, cảnh báo |
| BR-005 | Chỉ nhập các dòng hợp lệ; dòng lỗi bị bỏ qua (không rollback toàn bộ) |
| BR-006 | Nếu tất cả dòng đều lỗi → không cho chuyển sang Step 4 |

#### API Endpoints

```
GET  /api/classes/import/template          → Download file .xlsx mẫu

POST /api/classes/import/preview
Body: FormData { file: .xlsx }
Response:
{
  "total": 12,
  "valid": 10,
  "errors": [
    { "row": 3, "error": "MISSING_NAME" },
    { "row": 4, "error": "DUPLICATE_NAME" }
  ],
  "preview": [...]
}

POST /api/classes/import/confirm
Body: FormData { file: .xlsx }
Response:
{
  "imported": 10,
  "skipped": 2,
  "classes": [...]
}
```

---

## Phần B: Quản lý học sinh trong lớp

---

### SCR-04-010: Danh sách học sinh trong lớp

**Mô tả:** Màn hình chi tiết của một lớp học, hiển thị danh sách học sinh thuộc lớp đó. Hỗ trợ tìm kiếm theo từ khóa, lọc theo trạng thái duyệt và trạng thái học, phân trang. Là điểm xuất phát cho các thao tác quản lý học sinh trong lớp.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-001 > Click tên lớp

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Trang chủ > Quản lý học tập > Lớp học > 10A1 – Danh sách học sinh        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  THÔNG TIN LỚP                                                       │   │
│  │  Lớp: 10A1  |  Khối: 10  |  Năm học: 2025-2026                      │   │
│  │  GV chủ nhiệm: Nguyễn Văn An  |  Sĩ số hiện tại: 35 học sinh        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ TOOLBAR                                                              │   │
│  │  [+ Thêm nhanh HS]  [+ Thêm mới từ hệ thống]  [📥 Import Excel]    │   │
│  │  [✅ Duyệt/Bỏ duyệt]                                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ BỘ LỌC & TÌM KIẾM                                                    │   │
│  │                                                                      │   │
│  │  TT Duyệt: [Tất cả  ▼]    TT Học: [Tất cả  ▼]                      │   │
│  │                                                                      │   │
│  │  🔍 [Nhập tên, mã học sinh...           ] [Tìm kiếm] [Đặt lại]     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ DANH SÁCH HỌC SINH                         Tổng: 35 học sinh         │   │
│  ├───┬──────┬────────────────┬──────────┬──────────────┬──────────┬─────┤   │
│  │ ☐ │ STT  │  Họ và tên     │ Mã HS    │  TT Duyệt    │  TT Học  │Xóa  │   │
│  ├───┼──────┼────────────────┼──────────┼──────────────┼──────────┼─────┤   │
│  │ ☐ │  1   │ Nguyễn A       │ HS001    │ ✅ Đã duyệt  │ Đang học │ 🗑️  │   │
│  ├───┼──────┼────────────────┼──────────┼──────────────┼──────────┼─────┤   │
│  │ ☐ │  2   │ Trần B         │ HS002    │ ⏳ Chờ duyệt │ Đang học │ 🗑️  │   │
│  ├───┼──────┼────────────────┼──────────┼──────────────┼──────────┼─────┤   │
│  │ ☐ │  3   │ Lê C           │ HS003    │ ✅ Đã duyệt  │ Nghỉ học │ 🗑️  │   │
│  ├───┼──────┼────────────────┼──────────┼──────────────┼──────────┼─────┤   │
│  │ ☐ │  4   │ Phạm D         │ HS004    │ ✅ Đã duyệt  │ Đang học │ 🗑️  │   │
│  ├───┼──────┼────────────────┼──────────┼──────────────┼──────────┼─────┤   │
│  │  ...                                                                 │   │
│  ├───┴──────┴────────────────┴──────────┴──────────────┴──────────┴─────┤   │
│  │  Hiển thị 1–10 / 35 bản ghi          [10 ▼] bản ghi/trang            │   │
│  │                         [◀ Trước]  1  2  3  4  [Sau ▶]              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [← Quay lại danh sách lớp]                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | ... > 10A1 > Danh sách học sinh |
| Card thông tin lớp | Info card | Tên lớp, khối, năm học, GV, sĩ số |
| Button "Thêm nhanh HS" | Button (primary) | Quyền: thêm HS; → SCR-04-011 |
| Button "Thêm mới từ hệ thống" | Button (secondary) | → SCR-04-012 |
| Button "Import Excel" | Button (secondary) | → SCR-04-013 |
| Button "Duyệt/Bỏ duyệt" | Button (outline) | → SCR-04-015 |
| Dropdown "TT Duyệt" | Filter Select | Tất cả / Đã duyệt / Chờ duyệt |
| Dropdown "TT Học" | Filter Select | Tất cả / Đang học / Nghỉ học / Hoàn thành |
| Input tìm kiếm | Search Input | Tìm theo tên, mã học sinh; debounce 300ms |
| Checkbox chọn tất cả | Checkbox | Ở header table |
| Checkbox từng hàng | Checkbox | Chọn HS cho bulk delete |
| Cột "TT Duyệt" | Badge | ✅ Đã duyệt (green) / ⏳ Chờ duyệt (orange) |
| Cột "TT Học" | Badge | Đang học / Nghỉ học / Hoàn thành |
| Nút 🗑️ xóa hàng | Icon Button | → SCR-04-014 |
| Phân trang | Pagination | Tổng, trang hiện tại |
| Dropdown bản ghi/trang | Select | 10, 20, 50, 100 |
| Button "← Quay lại" | Button (ghost) | → SCR-04-001 |

#### Flow điều hướng

- **[+ Thêm nhanh HS]** → SCR-04-011
- **[+ Thêm mới từ hệ thống]** → SCR-04-012
- **[📥 Import Excel]** → SCR-04-013
- **[✅ Duyệt/Bỏ duyệt]** → SCR-04-015
- **[🗑️ Xóa HS]** → SCR-04-014
- **[← Quay lại]** → SCR-04-001
- **Thay đổi filter/trang** → Reload danh sách (giữ nguyên filter)

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Danh sách học sinh thuộc đúng lớp đang xem; không hiển thị HS lớp khác |
| BR-002 | Tìm kiếm theo tên (họ và tên) hoặc mã học sinh (ILIKE) |
| BR-003 | Filter trạng thái duyệt: Tất cả / Đã duyệt / Chờ duyệt |
| BR-004 | Filter trạng thái học: Tất cả / Đang học / Nghỉ học / Hoàn thành |
| BR-005 | Phân trang mặc định 10/trang; tùy chọn: 10, 20, 50, 100 |
| BR-006 | GV chủ nhiệm chỉ xem được lớp mình; CBQL xem tất cả |

#### API Endpoints

```
GET /api/classes/{classId}/students
    ?keyword={string}
    &approvalStatus={approved|pending|all}
    &studyStatus={studying|on_leave|completed|all}
    &page={number}
    &size={number}

Response:
{
  "classInfo": { "id", "name", "grade", "year", "homeroomTeacher", "studentCount" },
  "data": [
    {
      "id": "uuid",
      "studentCode": "HS001",
      "fullName": "Nguyễn A",
      "approvalStatus": "approved",
      "studyStatus": "studying"
    }
  ],
  "total": 35,
  "page": 1,
  "size": 10
}
```

---

### SCR-04-011: Thêm nhanh học sinh từ hệ thống

**Mô tả:** Màn hình/Panel cho phép chọn nhanh một hoặc nhiều học sinh từ danh sách có sẵn trong hệ thống (chưa thuộc lớp hiện tại) để thêm vào lớp. Không cần nhập form chi tiết.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-010 > [+ Thêm nhanh HS]

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 > Lớp học > 10A1 > Thêm nhanh học sinh                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                   THÊM NHANH HỌC SINH VÀO LỚP 10A1                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  🔍 [Tìm học sinh theo tên hoặc mã HS...          ] [Tìm kiếm]      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌────────────────────────────┐   │
│  │  DANH SÁCH HỌC SINH TRONG HỆ THỐNG  │  │  ĐÃ CHỌN (3 học sinh)     │   │
│  │  (chưa thuộc lớp 10A1)              │  │                            │   │
│  │                                     │  │  ┌──────────────────────┐  │   │
│  │  ☐  Nguyễn Văn X  –  HS101          │  │  │ Nguyễn Thị Y  HS201 │  │   │
│  │  ☐  Trần Thị Y    –  HS102          │  │  │                  [×] │  │   │
│  │  ☑  Nguyễn Thị Y  –  HS201 ←chọn   │  │  └──────────────────────┘  │   │
│  │  ☑  Lê Văn Z      –  HS202 ←chọn   │  │  ┌──────────────────────┐  │   │
│  │  ☑  Phạm Thị W    –  HS203 ←chọn   │  │  │ Lê Văn Z      HS202 │  │   │
│  │  ☐  Hoàng Văn T   –  HS301          │  │  │                  [×] │  │   │
│  │  ...                                │  │  └──────────────────────┘  │   │
│  │                                     │  │  ┌──────────────────────┐  │   │
│  │  Hiển thị 1-6 / 120 bản ghi         │  │  │ Phạm Thị W    HS203 │  │   │
│  │  [◀]  1  2  3  ...  [▶]            │  │  │                  [×] │  │   │
│  └─────────────────────────────────────┘  │  └──────────────────────┘  │   │
│                                           │                            │   │
│                                           │  [Xóa tất cả]              │   │
│                                           └────────────────────────────┘   │
│                                                                             │
│              [Hủy]                    [💾 Thêm 3 học sinh vào lớp]          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | ... > Thêm nhanh học sinh |
| Search input | Text Input | Tìm theo tên / mã HS; debounce 300ms |
| Danh sách HS bên trái | Checkbox List | Chỉ hiển thị HS chưa thuộc lớp hiện tại; phân trang |
| Checkbox từng hàng | Checkbox | Click để chọn/bỏ chọn HS |
| Panel "Đã chọn" bên phải | Tag List / Chip List | Danh sách HS đã chọn; [×] để xóa từng người |
| Button "Xóa tất cả" | Button (ghost, red) | Xóa toàn bộ danh sách đã chọn |
| Badge số đã chọn | Badge | Hiển thị số lượng HS đã chọn ở header panel |
| Phân trang (trái) | Pagination | Phân trang danh sách HS hệ thống |
| Button "Hủy" | Button (ghost) | → SCR-04-010 |
| Button "Thêm N học sinh" | Button (primary) | N = số HS đã chọn; disabled khi = 0 |
| Toast thành công | Toast | "Đã thêm 3 học sinh vào lớp 10A1" |

#### Flow điều hướng

- **[Hủy]** → SCR-04-010
- **[Thêm N học sinh] – chưa chọn ai** → Button disabled
- **[Thêm N học sinh] – thành công** → Toast → SCR-04-010 (reload danh sách)
- **[×] trên tag HS đã chọn** → Bỏ chọn HS đó, tích checkbox bên trái = unchecked

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Chỉ hiển thị HS chưa thuộc lớp đang xem |
| BR-002 | Cho phép chọn nhiều HS cùng lúc |
| BR-003 | Button "Thêm" disabled khi chưa chọn HS nào |
| BR-004 | Sau khi thêm thành công → cập nhật sĩ số lớp |

#### API Endpoints

```
GET /api/students/available-for-class/{classId}
    ?keyword={string}&page={n}&size={n}
    → Danh sách HS chưa thuộc lớp classId

POST /api/classes/{classId}/students/bulk-add
Body: { "studentIds": ["uuid1", "uuid2", "uuid3"] }
Response 200: { "added": 3, "students": [...] }
```

---

### SCR-04-012: Thêm mới học sinh từ hệ thống (Form tìm kiếm + chọn)

**Mô tả:** Màn hình tìm kiếm đầy đủ hơn để chọn học sinh từ toàn bộ danh sách hệ thống và thêm vào lớp. Hỗ trợ tìm kiếm nâng cao, xem chi tiết HS trước khi thêm, phân trang, tùy chọn số bản ghi/trang.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-010 > [+ Thêm mới từ hệ thống]

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 > Lớp học > 10A1 > Thêm mới học sinh từ hệ thống                         │
├─────────────────────────────────────────────────────────────────────────────┤
│              THÊM MỚI HỌC SINH TỪ HỆ THỐNG VÀO LỚP 10A1                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  TÌM KIẾM HỌC SINH                                                   │   │
│  │                                                                      │   │
│  │  🔍 [Nhập tên hoặc mã học sinh...              ] [Tìm kiếm]         │   │
│  │                                                                      │   │
│  │  Lớp hiện tại: [Tất cả ▼]   Trạng thái: [Tất cả ▼]                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  KẾT QUẢ TÌM KIẾM                        Tổng: 120 học sinh         │   │
│  ├───┬───────────────────┬──────────┬────────────────┬──────────────────┤   │
│  │ ☐ │  Họ và tên        │ Mã HS    │ Lớp hiện tại   │ Trạng thái       │   │
│  ├───┼───────────────────┼──────────┼────────────────┼──────────────────┤   │
│  │ ☐ │ Nguyễn Văn X      │ HS101    │ Chưa có lớp    │ Đang học         │   │
│  ├───┼───────────────────┼──────────┼────────────────┼──────────────────┤   │
│  │ ☐ │ Trần Thị Y        │ HS102    │ 10B1           │ Đang học         │   │
│  ├───┼───────────────────┼──────────┼────────────────┼──────────────────┤   │
│  │ ☑ │ Lê Văn Z          │ HS103    │ Chưa có lớp    │ Đang học  ←chọn │   │
│  ├───┼───────────────────┼──────────┼────────────────┼──────────────────┤   │
│  │ ...                                                                  │   │
│  ├───┴───────────────────┴──────────┴────────────────┴──────────────────┤   │
│  │  Hiển thị 1–10 / 120  [10 ▼]/trang   [◀]  1  2  3  4  5  [▶]       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Đã chọn: 1 học sinh                                                        │
│  [Lê Văn Z – HS103 ×]                                                       │
│                                                                             │
│              [Hủy]                   [💾 Thêm 1 học sinh vào lớp]           │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | ... > Thêm mới học sinh |
| Input tìm kiếm | Search Input | Tên / mã HS |
| Dropdown "Lớp hiện tại" | Filter Select | Lọc theo lớp HS đang học (để biết HS có lớp chưa) |
| Dropdown "Trạng thái" | Filter Select | Đang học / Nghỉ học / Tất cả |
| Checkbox chọn tất cả | Checkbox | Ở header table |
| Checkbox từng hàng | Checkbox | Chọn HS |
| Cột "Lớp hiện tại" | Text | "Chưa có lớp" nếu HS chưa trong lớp nào |
| Phân trang | Pagination | Cùng chức năng SCR-04-010 |
| Dropdown bản ghi/trang | Select | 10, 20, 50, 100 |
| Chip bar "Đã chọn" | Tag/Chip | Tên HS + [×]; hiện ở dưới bảng |
| Label "Đã chọn: N HS" | Text | Đếm số đã chọn |
| Button "Hủy" | Button (ghost) | → SCR-04-010 |
| Button "Thêm N học sinh" | Button (primary) | disabled khi N = 0 |

#### Flow điều hướng

- **[Hủy]** → SCR-04-010
- **[Thêm N học sinh] – thành công** → Toast → SCR-04-010

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Hiển thị tất cả HS trong hệ thống (kể cả HS đã có lớp khác) |
| BR-002 | Cột "Lớp hiện tại" giúp người dùng biết HS có thuộc lớp khác không |
| BR-003 | Cho phép thêm HS đã có lớp khác (một HS có thể học nhiều lớp) |
| BR-004 | Không cho thêm HS đã có trong lớp hiện tại |
| BR-005 | Button "Thêm" disabled khi chưa chọn ai |

#### API Endpoints

```
GET /api/students
    ?keyword={string}
    &currentClassId={uuid}
    &status={studying|on_leave|all}
    &page={n}&size={n}
    → Danh sách tất cả HS hệ thống

POST /api/classes/{classId}/students/bulk-add
Body: { "studentIds": [...] }
```

---

### SCR-04-013: Import học sinh từ Excel (Stepper)

**Mô tả:** Luồng import danh sách học sinh vào một lớp cụ thể từ file Excel theo quy trình 4 bước (stepper), tương tự SCR-04-007 nhưng dành cho học sinh trong lớp.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-010 > [📥 Import Excel]

#### Layout – Tổng quan Stepper

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 > Lớp học > 10A1 > Import học sinh từ Excel                               │
├─────────────────────────────────────────────────────────────────────────────┤
│              IMPORT HỌC SINH VÀO LỚP 10A1 TỪ FILE EXCEL                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ●─────────────○─────────────○─────────────○                                │
│  1.Tải mẫu   2.Upload     3.Preview     4.Xác nhận                          │
│                                                                             │
├── BƯỚC 1: TẢI FILE MẪU ───────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Cấu trúc file mẫu (mau_nhap_hoc_sinh.xlsx):                          │ │
│  │  Cột A: Mã học sinh *    (VD: HS001)                                  │ │
│  │  Cột B: Họ và tên *      (VD: Nguyễn Văn A)                           │ │
│  │  Cột C: Ngày sinh        (VD: 01/01/2010) – tùy chọn                  │ │
│  │  Cột D: Giới tính        (VD: Nam/Nữ)    – tùy chọn                   │ │
│  │  Cột E: Email            – tùy chọn                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                  [⬇ Tải file mẫu học sinh]                                   │
│                                                                             │
├── BƯỚC 2: UPLOAD FILE ────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │     📁  Kéo thả file vào đây hoặc [Chọn file từ máy tính]              ││
│  │         Chỉ hỗ trợ: .xlsx, .xls  |  Max: 5 MB                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
├── BƯỚC 3: PREVIEW ────────────────────────────────────────────────────────┤
│  ┌──────┬─────────────┬──────────┬────────────┬──────────┬─────────────────┐│
│  │ STT  │ Mã HS       │ Họ tên   │ Ngày sinh  │Giới tính │ Trạng thái      ││
│  ├──────┼─────────────┼──────────┼────────────┼──────────┼─────────────────┤│
│  │  1   │ HS101       │ Ng. A    │ 01/01/2010 │ Nam      │ ✅ Hợp lệ       ││
│  │  2   │             │ Trần B   │            │ Nữ       │ ❌ Thiếu mã HS  ││
│  │  3   │ HS001       │ Lê C     │ 05/05/2010 │ Nam      │ ❌ Mã HS đã tồn ││
│  └──────┴─────────────┴──────────┴────────────┴──────────┴─────────────────┘│
│  Tổng: 20  |  ✅ Hợp lệ: 18  |  ❌ Lỗi: 2                                  │
│                                                                             │
├── BƯỚC 4: XÁC NHẬN ───────────────────────────────────────────────────────┤
│  Sẽ thêm 18 học sinh vào lớp 10A1.                                          │
│  2 dòng lỗi sẽ bị bỏ qua.                                                   │
│                                                                             │
│              [← Quay lại]            [💾 Xác nhận nhập dữ liệu]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Stepper (4 bước) | Stepper | Giống SCR-04-007 |
| Button "Tải file mẫu HS" | Download Button | File .xlsx mẫu học sinh |
| Dropzone | Drag-and-drop | .xlsx/.xls; max 5MB |
| Preview table | Table | STT, Mã HS, Họ tên, Ngày sinh, Giới tính, Trạng thái |
| Badge trạng thái dòng | Badge | ✅ Hợp lệ / ❌ + lý do lỗi |
| Summary card | Card | Tổng / sẽ nhập / bỏ qua |
| Nút điều hướng Stepper | Buttons | Tiếp theo / Quay lại / Hủy |
| Toast thành công | Toast | "Đã thêm 18 học sinh vào lớp 10A1" |

#### Flow điều hướng

- Giống SCR-04-007: Step 1 → 2 → 3 → 4 → Thành công → SCR-04-010
- **[Hủy]** bất kỳ step → SCR-04-010

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | File .xlsx/.xls; max 5MB |
| BR-002 | Bắt buộc: Mã học sinh, Họ và tên |
| BR-003 | Mã học sinh đã tồn tại trong lớp → lỗi trùng |
| BR-004 | Mã học sinh không tồn tại trong hệ thống → có thể tạo mới HS, hoặc báo lỗi (tùy cấu hình) |
| BR-005 | Chỉ nhập dòng hợp lệ; dòng lỗi bỏ qua |

#### API Endpoints

```
GET  /api/classes/{classId}/students/import/template
POST /api/classes/{classId}/students/import/preview
     Body: FormData { file }
POST /api/classes/{classId}/students/import/confirm
     Body: FormData { file }
```

---

### SCR-04-014: Dialog xác nhận xóa học sinh khỏi lớp

**Mô tả:** Dialog modal xác nhận trước khi xóa một học sinh khỏi lớp học. Hiển thị tên học sinh và cảnh báo hậu quả.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-010 > [🗑️ Xóa] trên hàng học sinh

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Màn hình nền SCR-04-010 – mờ/blur]                                         │
│                                                                             │
│              ┌────────────────────────────────────────┐                    │
│              │                                        │                    │
│              │   🗑️  Xác nhận xóa học sinh            │                    │
│              │   ──────────────────────────────────   │                    │
│              │                                        │                    │
│              │   Bạn có chắc muốn xóa học sinh        │                    │
│              │   sau đây khỏi lớp 10A1?               │                    │
│              │                                        │                    │
│              │   ┌────────────────────────────────┐   │                    │
│              │   │  Học sinh: Nguyễn Văn A        │   │                    │
│              │   │  Mã HS: HS001                  │   │                    │
│              │   │  Lớp: 10A1                     │   │                    │
│              │   │  TT duyệt: ✅ Đã duyệt          │   │                    │
│              │   └────────────────────────────────┘   │                    │
│              │                                        │                    │
│              │   ⚠  Lưu ý: Thao tác này chỉ xóa      │                    │
│              │   học sinh khỏi lớp học, không xóa     │                    │
│              │   tài khoản học sinh.                   │                    │
│              │                                        │                    │
│              │         [Hủy]    [🗑️ Xác nhận xóa]     │                    │
│              │                                        │                    │
│              └────────────────────────────────────────┘                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Modal Overlay | Overlay | Click ngoài = Hủy |
| Info card | Card (read-only) | Họ tên, mã HS, tên lớp, TT duyệt |
| Warning text | Text (orange) | Chỉ xóa khỏi lớp, không xóa tài khoản |
| Button "Hủy" | Button (ghost) | Đóng dialog |
| Button "Xác nhận xóa" | Button (danger) | DELETE học sinh khỏi lớp |
| Toast thành công | Toast | "Đã xóa Nguyễn Văn A khỏi lớp 10A1" |

#### Flow điều hướng

- **[Hủy]** / **[Click ngoài]** → Đóng dialog, ở lại SCR-04-010
- **[Xác nhận xóa] – thành công** → Toast → Reload SCR-04-010

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Xóa khỏi lớp (xóa liên kết student-class), không xóa tài khoản HS |
| BR-002 | Sau khi xóa → cập nhật sĩ số lớp (studentCount - 1) |
| BR-003 | Nếu HS đã có điểm danh trong lớp → cảnh báo nhưng vẫn cho xóa (admin confirm) |

#### API Endpoints

```
DELETE /api/classes/{classId}/students/{studentId}

Response 200: { "message": "Đã xóa học sinh khỏi lớp" }
Response 400: { "error": "STUDENT_HAS_ATTENDANCE", "message": "..." }
```

---

### SCR-04-015: Duyệt / Bỏ duyệt đăng ký lớp học

**Mô tả:** Màn hình quản lý trạng thái duyệt đăng ký của học sinh trong lớp. Cho phép GV/CBQL xem danh sách học sinh cùng trạng thái duyệt, thực hiện duyệt hoặc bỏ duyệt từng học sinh hoặc hàng loạt.

**Actors:** Giáo viên (GV), Cán bộ quản lý (CBQL)

**Truy cập từ:** SCR-04-010 > [✅ Duyệt/Bỏ duyệt]

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 > Lớp học > 10A1 > Duyệt đăng ký lớp học                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                DUYỆT / BỎ DUYỆT ĐĂNG KÝ LỚP HỌC – 10A1                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  THỐNG KÊ NHANH                                                      │   │
│  │  ✅ Đã duyệt: 28  |  ⏳ Chờ duyệt: 7  |  Tổng: 35 học sinh          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ BỘ LỌC                                                               │   │
│  │  TT Duyệt: [Tất cả  ▼]                                              │   │
│  │  🔍 [Tìm học sinh...                     ] [Tìm kiếm] [Đặt lại]    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ CÔNG CỤ BULK ACTION                                                  │   │
│  │  Đã chọn: 3 học sinh                                                 │   │
│  │  [✅ Duyệt tất cả đã chọn]   [🔄 Bỏ duyệt tất cả đã chọn]          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ DANH SÁCH HỌC SINH                                                   │   │
│  ├───┬──────┬────────────────────┬──────────┬──────────────┬────────────┤   │
│  │ ☐ │ STT  │  Họ và tên         │ Mã HS    │  TT Duyệt    │ Thao tác   │   │
│  ├───┼──────┼────────────────────┼──────────┼──────────────┼────────────┤   │
│  │ ☑ │  1   │ Nguyễn Văn A       │ HS001    │ ✅ Đã duyệt  │ [Bỏ duyệt] │   │
│  ├───┼──────┼────────────────────┼──────────┼──────────────┼────────────┤   │
│  │ ☑ │  2   │ Trần Thị B         │ HS002    │ ⏳ Chờ duyệt │ [Duyệt]    │   │
│  ├───┼──────┼────────────────────┼──────────┼──────────────┼────────────┤   │
│  │ ☑ │  3   │ Lê Văn C           │ HS003    │ ⏳ Chờ duyệt │ [Duyệt]    │   │
│  ├───┼──────┼────────────────────┼──────────┼──────────────┼────────────┤   │
│  │ ☐ │  4   │ Phạm Thị D         │ HS004    │ ✅ Đã duyệt  │ [Bỏ duyệt] │   │
│  ├───┼──────┼────────────────────┼──────────┼──────────────┼────────────┤   │
│  │  ...                                                                 │   │
│  ├───┴──────┴────────────────────┴──────────┴──────────────┴────────────┤   │
│  │  Hiển thị 1–10 / 35  [10 ▼]/trang   [◀]  1  2  3  [▶]              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                            [← Quay lại danh sách học sinh]                  │
└─────────────────────────────────────────────────────────────────────────────┘

Trạng thái inline action:
  Hàng HS "Chờ duyệt"  → Hiển thị nút [✅ Duyệt]     (button success/green)
  Hàng HS "Đã duyệt"   → Hiển thị nút [🔄 Bỏ duyệt]  (button warning/orange)
```

#### Components

| Component | Loại | Ghi chú |
|---|---|---|
| Breadcrumb | Navigation | ... > Duyệt đăng ký lớp học |
| Summary bar | Info bar | Đã duyệt / Chờ duyệt / Tổng |
| Dropdown "TT Duyệt" | Filter Select | Tất cả / Đã duyệt / Chờ duyệt |
| Search input | Search Input | Tìm theo tên / mã HS |
| Bulk action bar | Action bar | Hiện khi có HS được chọn; ẩn khi chưa chọn |
| Button "Duyệt tất cả đã chọn" | Button (success) | Bulk approve; disabled nếu không chọn ai |
| Button "Bỏ duyệt tất cả đã chọn" | Button (warning) | Bulk reject; disabled nếu không chọn ai |
| Checkbox chọn tất cả | Checkbox | Header table |
| Checkbox từng hàng | Checkbox | Chọn HS |
| Badge "TT Duyệt" | Badge | ✅ Đã duyệt (green) / ⏳ Chờ duyệt (orange) |
| Button inline "Duyệt" | Button (success, small) | Chỉ hiện nếu HS đang "Chờ duyệt" |
| Button inline "Bỏ duyệt" | Button (warning, small) | Chỉ hiện nếu HS đang "Đã duyệt" |
| Phân trang | Pagination | |
| Button "← Quay lại" | Button (ghost) | → SCR-04-010 |
| Toast thành công | Toast | "Đã duyệt 3 học sinh" / "Đã bỏ duyệt 1 học sinh" |

#### Flow điều hướng

- **[✅ Duyệt] inline** → PATCH trạng thái HS đó → Reload dòng / cập nhật badge
- **[🔄 Bỏ duyệt] inline** → PATCH trạng thái HS đó → Reload dòng / cập nhật badge
- **[Duyệt tất cả đã chọn] bulk** → PATCH nhiều HS → Toast → Reload danh sách
- **[Bỏ duyệt tất cả đã chọn] bulk** → PATCH nhiều HS → Toast → Reload
- **[← Quay lại]** → SCR-04-010

#### Business Rules

| # | Quy tắc |
|---|---|
| BR-001 | Thao tác duyệt/bỏ duyệt áp dụng cho từng HS hoặc hàng loạt |
| BR-002 | Nút inline thay đổi theo TT hiện tại: "Chờ duyệt" → nút [Duyệt]; "Đã duyệt" → nút [Bỏ duyệt] |
| BR-003 | Bulk action: "Duyệt tất cả" chỉ duyệt những HS đang "Chờ duyệt" trong số đã chọn |
| BR-004 | Bulk action: "Bỏ duyệt tất cả" chỉ bỏ duyệt những HS đang "Đã duyệt" trong số đã chọn |
| BR-005 | Sau mỗi thao tác → cập nhật Summary bar (số Đã duyệt / Chờ duyệt) |
| BR-006 | Chỉ CBQL có quyền bỏ duyệt; GV chỉ có quyền duyệt |

#### API Endpoints

```
PATCH /api/classes/{classId}/students/{studentId}/approval
Body: { "status": "approved" | "pending" }

PATCH /api/classes/{classId}/students/bulk-approval
Body:
{
  "studentIds": ["uuid1", "uuid2"],
  "status": "approved" | "pending"
}

Response 200: { "updated": 3 }

GET /api/classes/{classId}/students/approval-summary
Response: { "approved": 28, "pending": 7, "total": 35 }
```

---

## Phụ lục: Ma trận màn hình – API

| Màn hình | Method | Endpoint |
|---|---|---|
| SCR-04-001 | GET | `/api/classes` |
| SCR-04-001 | GET | `/api/school-years`, `/api/grades` |
| SCR-04-002 | GET | `/api/classes/dashboard` |
| SCR-04-003 | POST | `/api/classes` |
| SCR-04-003 | GET | `/api/teachers/search`, `/api/school-years` |
| SCR-04-004 | GET | `/api/classes/{id}` |
| SCR-04-004 | PATCH | `/api/classes/{id}` |
| SCR-04-005 | DELETE | `/api/classes/{id}` |
| SCR-04-006 | POST | `/api/classes/{id}/copy` |
| SCR-04-007 | GET | `/api/classes/import/template` |
| SCR-04-007 | POST | `/api/classes/import/preview` |
| SCR-04-007 | POST | `/api/classes/import/confirm` |
| SCR-04-010 | GET | `/api/classes/{classId}/students` |
| SCR-04-011 | GET | `/api/students/available-for-class/{classId}` |
| SCR-04-011 | POST | `/api/classes/{classId}/students/bulk-add` |
| SCR-04-012 | GET | `/api/students` |
| SCR-04-012 | POST | `/api/classes/{classId}/students/bulk-add` |
| SCR-04-013 | GET | `/api/classes/{classId}/students/import/template` |
| SCR-04-013 | POST | `/api/classes/{classId}/students/import/preview` |
| SCR-04-013 | POST | `/api/classes/{classId}/students/import/confirm` |
| SCR-04-014 | DELETE | `/api/classes/{classId}/students/{studentId}` |
| SCR-04-015 | PATCH | `/api/classes/{classId}/students/{studentId}/approval` |
| SCR-04-015 | PATCH | `/api/classes/{classId}/students/bulk-approval` |
| SCR-04-015 | GET | `/api/classes/{classId}/students/approval-summary` |

---

## Phụ lục: Ma trận quyền hạn

| Chức năng | GV (chủ nhiệm) | GV (khác) | CBQL |
|---|:---:|:---:|:---:|
| Xem danh sách lớp học (của mình) | ✅ | ❌ | ✅ |
| Xem tất cả lớp học | ❌ | ❌ | ✅ |
| Xem dashboard lớp học | ✅ (lớp mình) | ❌ | ✅ |
| Thêm lớp học | ❌ | ❌ | ✅ |
| Sửa lớp học | ✅ (lớp mình) | ❌ | ✅ |
| Xóa lớp học | ❌ | ❌ | ✅ |
| Sao chép lớp học | ❌ | ❌ | ✅ |
| Import lớp học từ Excel | ❌ | ❌ | ✅ |
| Xem danh sách HS trong lớp | ✅ (lớp mình) | ❌ | ✅ |
| Thêm nhanh HS vào lớp | ✅ | ❌ | ✅ |
| Thêm mới HS từ hệ thống | ✅ | ❌ | ✅ |
| Import HS từ Excel | ✅ | ❌ | ✅ |
| Xóa HS khỏi lớp | ✅ (lớp mình) | ❌ | ✅ |
| Duyệt đăng ký | ✅ (lớp mình) | ❌ | ✅ |
| Bỏ duyệt đăng ký | ❌ | ❌ | ✅ |

---

*Tài liệu tham chiếu: `06a_ql_thong_tin_lop_hoc.md`, `06b_ql_hoc_sinh_trong_lop.md`*
*Phiên bản: 1.0 – Ngày cập nhật: 2026-03-11*
