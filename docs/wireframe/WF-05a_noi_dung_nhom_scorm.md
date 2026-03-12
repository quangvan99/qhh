---
title: "WF-05a: Quản lý nội dung – Nhóm & SCORM"
cluster: "Learning - Content Management / Group & SCORM"
screens: [SCR-05a-001, SCR-05a-002, SCR-05a-003, SCR-05a-004, SCR-05a-005, SCR-05a-006, SCR-05a-007, SCR-05a-008, SCR-05a-009, SCR-05a-010]
updated: 2026-03-11
---

# WF-05a: Quản lý nội dung – Nhóm & SCORM

---

## Tổng quan luồng

**Phần A – Nhóm nội dung:** CRUD nhóm nội dung lớp học (thêm đầy đủ / thêm nhanh inline, sửa, xóa), sao chép nội dung từ lớp khác.

**Phần B – Nội dung SCORM:** Thêm/sửa/xóa SCORM package (upload file hoặc chọn từ thư viện), xem preview, thiết lập ràng buộc hoàn thành và lịch hiển thị.

```
[SCR-05a-001: Danh sách nhóm nội dung]
        │
        ├──[+ Thêm nhóm]────────→ [SCR-05a-002: Form thêm nhóm (modal)]
        │                                  │ Lưu OK → [SCR-05a-001]
        │
        ├──[+ Nhanh]────────────→ inline input trong danh sách → [SCR-05a-001]
        │
        ├──[✏ Sửa]──────────────→ [SCR-05a-003: Form sửa nhóm (modal)]
        │                                  │ Lưu OK → [SCR-05a-001]
        │
        ├──[🗑 Xóa]──────────────→ [Dialog xác nhận] → [SCR-05a-001]
        │
        ├──[⇅ Kéo sắp xếp]──────→ cập nhật thứ tự → [SCR-05a-001]
        │
        ├──[Sao chép từ lớp khác]→ [SCR-05a-004: Chọn lớp nguồn + Xác nhận]
        │
        └──[Chọn nhóm]──────────→ [SCR-05a-005: Danh sách SCORM trong nhóm]
                                           │
                                           ├──[+ Thêm SCORM upload]───→ [SCR-05a-006: Form SCORM (upload)]
                                           │                                    │ Lưu OK → [SCR-05a-005]
                                           │
                                           ├──[+ Thêm từ thư viện]────→ [SCR-05a-007: Picker thư viện SCORM]
                                           │                                    │ Chọn + Lưu → [SCR-05a-005]
                                           │
                                           ├──[✏ Sửa SCORM]──────────→ [SCR-05a-008: Form SCORM (edit)]
                                           │                                    │ Lưu OK → [SCR-05a-005]
                                           │
                                           ├──[👁 Preview]────────────→ [SCR-05a-009: Xem trước SCORM]
                                           │
                                           ├──[⚙ Ràng buộc]───────────→ [SCR-05a-010: Thiết lập điều kiện]
                                           │
                                           └──[🗑 Xóa SCORM]──────────→ [Dialog xác nhận] → [SCR-05a-005]
```

---

## Phần A: Quản lý nhóm nội dung

---

### SCR-05a-001: Danh sách nhóm nội dung lớp học

**Mô tả:** Màn hình chính quản lý nhóm nội dung của một lớp học. Hiển thị danh sách nhóm theo thứ tự, hỗ trợ kéo thả sắp xếp, thêm mới (đầy đủ/nhanh), sửa, xóa và sao chép từ lớp khác.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏠 > Quản lý học tập > Nội dung lớp học > [Lớp Toán 10A1]       │
├──────────────────────────────────────────────────────────────────┤
│  Nhóm nội dung lớp học                                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ [+ Thêm nhóm]  [+ Thêm nhanh]  [⎘ Sao chép từ lớp khác] │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌───┬───────────────────────────┬──────────┬──────────────┐     │
│  │ ⠿ │ Tên nhóm                  │ Số ND    │ Thao tác     │     │
│  ├───┼───────────────────────────┼──────────┼──────────────┤     │
│  │ ⠿ │ Chương 1: Đại số          │ 3        │ [✏] [🗑]     │     │
│  │ ⠿ │ Chương 2: Hình học        │ 5        │ [✏] [🗑]     │     │
│  │ ⠿ │ Ôn tập cuối kỳ            │ 2        │ [✏] [🗑]     │     │
│  └───┴───────────────────────────┴──────────┴──────────────┘     │
│  ⠿ = handle kéo thả sắp xếp                                      │
└──────────────────────────────────────────────────────────────────┘
```

**Components:** Breadcrumb, Toolbar (3 nút), Drag-handle table (sortable), Action buttons mỗi hàng

**Flow:**
- Click tên nhóm → SCR-05a-005 (DS SCORM trong nhóm)
- Click `⠿` kéo → reorder → auto-save thứ tự
- `[✏]` → SCR-05a-003 · `[🗑]` → Dialog xác nhận
- `[+ Thêm nhóm]` → SCR-05a-002 · `[+ Thêm nhanh]` → inline row
- `[⎘ Sao chép]` → SCR-05a-004

**Business rules:**
- Thứ tự nhóm ảnh hưởng đến thứ tự hiển thị cho học sinh
- Xóa nhóm: cảnh báo nếu nhóm còn nội dung bên trong
- Tên nhóm: bắt buộc, tối đa 255 ký tự

**API:**
- `GET /api/classes/{classId}/content-groups` — lấy DS nhóm
- `PATCH /api/classes/{classId}/content-groups/reorder` — cập nhật thứ tự
- `DELETE /api/classes/{classId}/content-groups/{groupId}` — xóa nhóm

---

### SCR-05a-002: Form thêm nhóm nội dung (Modal đầy đủ)

**Mô tả:** Modal nhập thông tin chi tiết để tạo nhóm nội dung mới.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────┐
│  Thêm nhóm nội dung                    [✕]  │
├──────────────────────────────────────────────┤
│  Tên nhóm *                                  │
│  ┌────────────────────────────────────────┐  │
│  │ Nhập tên nhóm nội dung...              │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Mô tả                                       │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Thứ tự hiển thị                             │
│  ┌──────────┐                                │
│  │    1     │                                │
│  └──────────┘                                │
│                                              │
│        [Hủy]              [Lưu nhóm]         │
└──────────────────────────────────────────────┘
```

**Components:** Modal, TextInput (tên – required), Textarea (mô tả), NumberInput (thứ tự), Buttons

**Flow:** Điền → `[Lưu nhóm]` → validate → POST → đóng modal → toast success → reload SCR-05a-001

**Business rules:**
- Tên nhóm: bắt buộc, không trùng trong cùng lớp
- Thứ tự: mặc định cuối danh sách

**API:** `POST /api/classes/{classId}/content-groups`

---

### SCR-05a-003: Form sửa nhóm nội dung (Modal)

**Mô tả:** Modal chỉnh sửa thông tin nhóm nội dung, giống SCR-05a-002 nhưng pre-fill dữ liệu hiện tại.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────┐
│  Chỉnh sửa nhóm nội dung               [✕]  │
├──────────────────────────────────────────────┤
│  Tên nhóm *                                  │
│  ┌────────────────────────────────────────┐  │
│  │ Chương 1: Đại số                       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Mô tả                                       │
│  ┌────────────────────────────────────────┐  │
│  │ Nội dung chương 1 bao gồm...           │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Thứ tự hiển thị                             │
│  ┌──────────┐                                │
│  │    1     │                                │
│  └──────────┘                                │
│                                              │
│        [Hủy]           [Cập nhật nhóm]       │
└──────────────────────────────────────────────┘
```

**Components:** Như SCR-05a-002, pre-filled

**Flow:** Sửa → `[Cập nhật nhóm]` → validate → PUT → đóng modal → toast success

**API:** `PUT /api/classes/{classId}/content-groups/{groupId}`

---

### SCR-05a-004: Sao chép nội dung từ lớp học khác

**Mô tả:** Cho phép GV/CBQL chọn lớp nguồn và sao chép toàn bộ nhóm nội dung sang lớp hiện tại. Hiển thị preview nội dung lớp nguồn trước khi xác nhận.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────┐
│  Sao chép nội dung từ lớp học khác           [✕]    │
├──────────────────────────────────────────────────────┤
│  Chọn lớp nguồn *                                    │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🔍 Tìm tên lớp...                   [▼ Chọn]  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Preview nội dung lớp đã chọn:                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  📁 Chương 1 (3 nội dung)                      │  │
│  │  📁 Chương 2 (5 nội dung)                      │  │
│  │  📁 Ôn tập (2 nội dung)                        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ⚠ Thao tác này sẽ ghi đè nội dung hiện tại!        │
│                                                      │
│        [Hủy]               [Xác nhận sao chép]       │
└──────────────────────────────────────────────────────┘
```

**Components:** Modal, Searchable Select (lớp nguồn), Preview tree (read-only), Warning alert, Buttons

**Flow:** Chọn lớp → hệ thống load preview → `[Xác nhận sao chép]` → POST → loading → toast success → SCR-05a-001

**Business rules:**
- Cảnh báo rõ nếu lớp đích đã có nội dung (sẽ bị ghi đè)
- Chỉ sao chép cấu trúc nhóm và metadata nội dung, không sao chép dữ liệu học viên

**API:**
- `GET /api/classes` — tìm lớp nguồn
- `POST /api/classes/{classId}/content-groups/copy-from/{sourceClassId}`

---

## Phần B: Quản lý nội dung SCORM

---

### SCR-05a-005: Danh sách nội dung SCORM trong nhóm

**Mô tả:** Hiển thị danh sách SCORM package thuộc một nhóm nội dung. Hỗ trợ thêm mới (upload hoặc từ thư viện), xem preview, thiết lập ràng buộc, xóa.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏠 > Nội dung lớp > [Lớp Toán 10A1] > [Chương 1: Đại số]       │
├──────────────────────────────────────────────────────────────────┤
│  Nội dung SCORM                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [+ Upload SCORM]  [+ Từ thư viện ▼]                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────┬──────────┬──────────┬────────────┐   │
│  │ Tên SCORM              │ Trạng   │ Điều kiện│ Thao tác   │   │
│  │                        │ thái    │ hoàn thành│            │   │
│  ├────────────────────────┼──────────┼──────────┼────────────┤   │
│  │ Bài 1: Số hữu tỉ       │ 🟢 Hiện │ Hoàn thành│[👁][⚙][✏][🗑]│  │
│  │ Bài 2: Số vô tỉ        │ 🔴 Ẩn  │ Đạt điểm │[👁][⚙][✏][🗑]│  │
│  │ Bài 3: Luyện tập       │ 🟡 Lịch │ --       │[👁][⚙][✏][🗑]│  │
│  └────────────────────────┴──────────┴──────────┴────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**Components:** Breadcrumb, Toolbar (2 nút thêm), Table (sortable), Status badge, Action icons (4)

**Flow:**
- `[+ Upload SCORM]` → SCR-05a-006
- `[+ Từ thư viện ▼]` → dropdown: [Thư viện cá nhân | Thư viện đơn vị | Nguồn chia sẻ] → SCR-05a-007
- `[👁]` → SCR-05a-009 · `[⚙]` → SCR-05a-010 · `[✏]` → SCR-05a-008 · `[🗑]` → Dialog xác nhận

**Business rules:**
- Trạng thái: Hiển thị / Ẩn / Hiển thị theo lịch
- Điều kiện hoàn thành: Hoàn thành / Đạt điểm tối thiểu / Không yêu cầu

**API:** `GET /api/classes/{classId}/content-groups/{groupId}/scorm-items`

---

### SCR-05a-006: Form thêm/upload SCORM mới

**Mô tả:** Form nhập thông tin và upload file SCORM (.zip). Hỗ trợ thay thế file sau khi đã upload lần đầu.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────┐
│  Thêm nội dung SCORM                          [✕]   │
├──────────────────────────────────────────────────────┤
│  Tên nội dung *                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ Nhập tên bài học...                          │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  File SCORM *                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  📦 Kéo thả file .zip vào đây hoặc           │    │
│  │     [Chọn file từ máy tính]                  │    │
│  │  Hỗ trợ: SCORM 1.2, SCORM 2004 (.zip)        │    │
│  └──────────────────────────────────────────────┘    │
│  ✅ bai1_so_huu_ti.zip (2.4 MB)  [Xóa & thay thế]   │
│                                                      │
│  Trạng thái hiển thị                                 │
│  ◉ Hiển thị  ○ Ẩn  ○ Lên lịch                       │
│                                                      │
│  Mô tả                                               │
│  ┌──────────────────────────────────────────────┐    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│        [Hủy]                    [Lưu]                │
└──────────────────────────────────────────────────────┘
```

**Components:** Modal/Page, TextInput (tên – required), Dropzone (upload), File info + remove, Radio group (trạng thái), Textarea (mô tả), Buttons

**Flow:**
- Kéo thả / chọn file → validate định dạng + size → hiển thị tên file
- `[Xóa & thay thế]` → xóa file cũ → hiện lại dropzone
- `[Lưu]` → validate → `POST multipart/form-data` → upload + save → toast → SCR-05a-005

**Business rules:**
- Định dạng: chỉ `.zip` chứa chuẩn SCORM 1.2 hoặc SCORM 2004
- Giới hạn kích thước: theo cấu hình hệ thống (mặc định 500MB)
- Tên: bắt buộc, max 255 ký tự

**API:**
- `POST /api/classes/{classId}/content-groups/{groupId}/scorm-items` (multipart)
- `DELETE /api/scorm-files/{fileId}` — xóa file khi thay thế

---

### SCR-05a-007: Picker SCORM từ thư viện

**Mô tả:** Modal tìm kiếm và chọn SCORM từ thư viện (cá nhân / đơn vị / nguồn chia sẻ) để thêm vào nhóm nội dung lớp học.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────┐
│  Chọn SCORM từ thư viện                          [✕]    │
├──────────────────────────────────────────────────────────┤
│  [Thư viện cá nhân] [Thư viện đơn vị] [Nguồn chia sẻ]  │
├──────────────────────────────────────────────────────────┤
│  🔍 [Tìm theo tên...]    [Danh mục ▼]   [Hiện: 10 ▼]   │
│                                                          │
│  ┌──────┬──────────────────────────────┬─────────────┐  │
│  │  □   │ Tên SCORM                    │ Danh mục    │  │
│  ├──────┼──────────────────────────────┼─────────────┤  │
│  │  □   │ Số học lớp 10 - Phần 1       │ Toán học    │  │
│  │  □   │ Đại số tuyến tính cơ bản     │ Toán học    │  │
│  │  □   │ Hình học không gian          │ Toán học    │  │
│  └──────┴──────────────────────────────┴─────────────┘  │
│  ← 1 2 3 ... →   Hiển thị 1–10 / 48 kết quả            │
│                                                          │
│        [Hủy]                    [Thêm đã chọn (2)]      │
└──────────────────────────────────────────────────────────┘
```

**Components:** Modal, Tab group (3 nguồn), SearchInput, Select (danh mục), Select (số bản ghi/trang), Checkbox table, Pagination, Button đếm số đã chọn

**Flow:** Chọn tab → search/filter → tick checkbox → `[Thêm đã chọn]` → POST → toast → SCR-05a-005

**Business rules:**
- Có thể chọn nhiều SCORM cùng lúc
- SCORM đã có trong nhóm hiển thị disabled
- Phân trang mặc định 10 bản ghi/trang

**API:**
- `GET /api/library/personal/scorm?keyword=&category=&page=` — thư viện cá nhân
- `GET /api/library/unit/scorm?keyword=&category=&page=` — thư viện đơn vị
- `GET /api/library/shared/scorm?keyword=&category=&page=` — nguồn chia sẻ
- `POST /api/classes/{classId}/content-groups/{groupId}/scorm-items/from-library`

---

### SCR-05a-008: Form chỉnh sửa SCORM

**Mô tả:** Tương tự SCR-05a-006, pre-fill thông tin SCORM hiện tại. Cho phép đổi tên, mô tả, trạng thái và thay thế file SCORM.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────┐
│  Chỉnh sửa nội dung SCORM                     [✕]   │
├──────────────────────────────────────────────────────┤
│  Tên nội dung *                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ Bài 1: Số hữu tỉ                             │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  File SCORM hiện tại                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │  📦 bai1_so_huu_ti.zip (2.4 MB)              │    │
│  │  [Xóa & thay thế file]                       │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Trạng thái hiển thị                                 │
│  ○ Hiển thị  ◉ Ẩn  ○ Lên lịch                       │
│                                                      │
│  Mô tả                                               │
│  ┌──────────────────────────────────────────────┐    │
│  │ Bài học về số hữu tỉ chương 1...             │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│        [Hủy]                 [Cập nhật]              │
└──────────────────────────────────────────────────────┘
```

**Components:** Như SCR-05a-006, dạng edit (pre-filled)

**Flow:** Sửa → `[Cập nhật]` → PUT → toast → SCR-05a-005

**Business rules:** Giữ nguyên dữ liệu học viên khi chỉ sửa metadata; xóa dữ liệu tracking khi thay thế file SCORM

**API:** `PUT /api/classes/{classId}/content-groups/{groupId}/scorm-items/{itemId}`

---

### SCR-05a-009: Xem trước nội dung SCORM (Preview)

**Mô tả:** Tải và hiển thị nội dung SCORM trong iframe/player để GV/CBQL kiểm tra trước khi học sinh truy cập.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────────┐
│ ← Quay lại     Xem trước: Bài 1 – Số hữu tỉ        [✕ Đóng]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │          [  SCORM Player / iframe  ]                 │   │
│  │                                                      │   │
│  │          (Nội dung SCORM được render ở đây)          │   │
│  │                                                      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ℹ️ Đây là chế độ xem trước – tiến trình không được lưu     │
└──────────────────────────────────────────────────────────────┘
```

**Components:** Fullscreen page/modal, SCORM Player (iframe sandbox), Header bar, Info banner

**Flow:** Click `[👁]` → GET launch URL → render SCORM player → `[✕ Đóng]` / `← Quay lại` → SCR-05a-005

**Business rules:**
- Chế độ preview: không ghi nhận tiến trình học (cmi.core.lesson_status không lưu)
- Mở trong tab mới hoặc modal fullscreen

**API:** `GET /api/scorm-items/{itemId}/launch?preview=true` — trả về launch URL

---

### SCR-05a-010: Thiết lập điều kiện hoàn thành & lịch hiển thị SCORM

**Mô tả:** Panel cấu hình ràng buộc hoàn thành (completion condition) và lịch hiển thị (schedule) cho một nội dung SCORM.

**Actors:** GV, CBQL

```
┌──────────────────────────────────────────────────────────┐
│  Cấu hình: Bài 1 – Số hữu tỉ                    [✕]    │
├─────────────────────────┬────────────────────────────────┤
│  ĐIỀU KIỆN HOÀN THÀNH   │  LỊCH HIỂN THỊ                │
├─────────────────────────┼────────────────────────────────┤
│  Điều kiện:             │  Hiển thị:                    │
│  ◉ Hoàn thành bài học   │  ◉ Luôn hiển thị              │
│  ○ Đạt điểm tối thiểu  │  ○ Ẩn                         │
│  ○ Không yêu cầu        │  ○ Hiển thị theo lịch         │
│                         │                               │
│  Điểm tối thiểu:        │  Từ ngày:                     │
│  ┌────────────────┐     │  ┌─────────────────────────┐  │
│  │  80            │ %   │  │  dd/mm/yyyy  🗓          │  │
│  └────────────────┘     │  └─────────────────────────┘  │
│                         │                               │
│  Bắt buộc hoàn thành    │  Đến ngày:                    │
│  trước khi xem ND khác: │  ┌─────────────────────────┐  │
│  ☐ Áp dụng              │  │  dd/mm/yyyy  🗓          │  │
│                         │  └─────────────────────────┘  │
├─────────────────────────┴────────────────────────────────┤
│               [Hủy]           [Lưu cấu hình]             │
└──────────────────────────────────────────────────────────┘
```

**Components:** Modal 2 cột, Radio groups, NumberInput (điểm), Checkbox, DatePicker (from/to), Buttons

**Flow:**
- Chọn điều kiện → nếu "Đạt điểm" → hiện NumberInput
- Chọn "Hiển thị theo lịch" → hiện DatePicker
- `[Lưu cấu hình]` → validate → PUT → toast → SCR-05a-005

**Business rules:**
- Điểm tối thiểu: 0–100, bắt buộc nhập khi chọn "Đạt điểm tối thiểu"
- Ngày bắt đầu phải ≤ ngày kết thúc
- "Bắt buộc hoàn thành trước" chỉ có hiệu lực khi điều kiện ≠ Không yêu cầu

**API:** `PUT /api/classes/{classId}/content-groups/{groupId}/scorm-items/{itemId}/settings`

---

## Bảng tổng hợp màn hình

| Mã          | Tên màn hình                         | Loại         | Trigger từ       |
|-------------|--------------------------------------|--------------|------------------|
| SCR-05a-001 | Danh sách nhóm nội dung              | Page         | Menu > Nội dung  |
| SCR-05a-002 | Form thêm nhóm (đầy đủ)             | Modal        | SCR-05a-001      |
| SCR-05a-003 | Form sửa nhóm                        | Modal        | SCR-05a-001      |
| SCR-05a-004 | Sao chép nội dung từ lớp khác        | Modal        | SCR-05a-001      |
| SCR-05a-005 | Danh sách SCORM trong nhóm           | Page         | SCR-05a-001      |
| SCR-05a-006 | Form thêm/upload SCORM               | Modal/Page   | SCR-05a-005      |
| SCR-05a-007 | Picker SCORM từ thư viện             | Modal        | SCR-05a-005      |
| SCR-05a-008 | Form sửa SCORM                       | Modal/Page   | SCR-05a-005      |
| SCR-05a-009 | Preview SCORM                        | Fullscreen   | SCR-05a-005      |
| SCR-05a-010 | Thiết lập điều kiện & lịch SCORM     | Modal        | SCR-05a-005      |
