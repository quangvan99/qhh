---
title: "WF-05b: Quản lý nội dung – Video & Văn bản"
cluster: "Learning - Content Management / Video & Text"
updated: 2026-03-11
---

# WF-05b: Quản lý nội dung – Video & Văn bản

> **Phạm vi:** GV/CBQL quản lý nội dung loại **Video** (upload file, embed YouTube/Vimeo, cấu hình xem, ràng buộc, lịch hiển thị, chọn từ thư viện) và loại **Văn bản** (rich-text editor, tệp đính kèm) trong một lớp học cụ thể.

---

## Mục lục màn hình

| Mã            | Tên màn hình                                      | Ghi chú                                      |
|---------------|---------------------------------------------------|----------------------------------------------|
| SCR-05b-001   | Danh sách nội dung Video của lớp học              | Bảng list + toolbar thêm/sửa/xóa/xem trước  |
| SCR-05b-002   | Form Thêm mới / Chỉnh sửa nội dung Video         | Upload file hoặc embed URL + metadata        |
| SCR-05b-003   | Thiết lập ràng buộc & lịch hiển thị Video        | Modal cấu hình điều kiện + datetime picker   |
| SCR-05b-004   | Chọn Video từ Thư viện (cá nhân / đơn vị / chia sẻ) | Dialog tìm kiếm + phân trang + xác nhận  |
| SCR-05b-005   | Danh sách nội dung Văn bản của lớp học            | Bảng list + toolbar thêm/sửa/xóa/xem trước  |
| SCR-05b-006   | Form Thêm mới / Chỉnh sửa nội dung Văn bản       | Rich-text editor + quản lý file đính kèm     |

---

## PHẦN 1 — QUẢN LÝ NỘI DUNG VIDEO

---

## SCR-05b-001: Danh sách nội dung Video của lớp học

### 1. Mô tả
GV/CBQL truy cập mục quản lý nội dung Video của một lớp học. Hệ thống hiển thị danh sách video đã được thêm, cho phép thêm mới, chỉnh sửa, xóa, xem trước, thiết lập ràng buộc và lịch hiển thị.

### 2. Actors
- **Chính:** GV, CBQL (có quyền quản lý nội dung video)
- **Hệ thống:** Truy vấn danh sách, xử lý xóa, cập nhật trạng thái

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Quản lý lớp học] [Nội dung ●] [Kết quả] ...   👤 GV Trần A ▼  ║
╠══════════════════════════════════════════════════════════════════════════╣
║  📂 Lớp: Toán 10 – HK1  >  Nội dung  >  Video                           ║
║  ─────────────────────────────────────────────────────────────────────  ║
║  [+ Thêm mới ▼]  ┌──────────────────┐  🔍 [Tìm tên video...      ] [🔍]║
║                  │ Upload file      │                                    ║
║                  │ Embed URL        │                                    ║
║                  │ Từ thư viện    ► │                                    ║
║                  └──────────────────┘                                    ║
║ ┌────┬────────────────────────┬──────────┬──────────┬──────────────────┐ ║
║ │ □  │ Tên video              │ Loại     │ Trạng thái│ Thao tác        │ ║
║ ├────┼────────────────────────┼──────────┼──────────┼──────────────────┤ ║
║ │ □  │ Bài 1: Giới thiệu      │ Upload   │ ● Hiển thị│[Sửa][Xem][Xóa] │ ║
║ │ □  │ Bài 2: Đạo hàm cơ bản  │ YouTube  │ ○ Ẩn     │[Sửa][Xem][Xóa] │ ║
║ │ □  │ Bài 3: Bài tập tổng hợp│ Vimeo    │ ⏰ Lên lịch│[Sửa][Xem][Xóa]│ ║
║ └────┴────────────────────────┴──────────┴──────────┴──────────────────┘ ║
║  [Xóa đã chọn]   [< 1  2  3 >]   Hiển thị [▼10] / trang  Tổng: 24 mục  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components
- **Breadcrumb:** Lớp học > Nội dung > Video
- **Dropdown "Thêm mới":** Upload file | Embed URL | Từ thư viện (cá nhân / đơn vị / chia sẻ)
- **Bảng danh sách:** checkbox, tên, loại (Upload/YouTube/Vimeo), trạng thái, thao tác
- **Phân trang + số bản ghi/trang**

### 5. Flow
1. GV chọn lớp → hệ thống hiển thị danh sách video
2. Chọn **Thêm mới** → SCR-05b-002 hoặc SCR-05b-004
3. Chọn **Sửa** → SCR-05b-002 (pre-fill dữ liệu)
4. Chọn **Xóa** → dialog xác nhận → xóa → cập nhật danh sách
5. Chọn **Xem** → trình chiếu video preview (player modal)

### 6. Business Rules
- Chỉ GV/CBQL có quyền thêm/sửa/xóa nội dung video
- Video đang "Lên lịch" hiển thị theo thời gian đã cấu hình
- Xóa video kích hoạt dialog xác nhận bắt buộc

### 7. API
| Method | Endpoint                                  | Mô tả                          |
|--------|-------------------------------------------|--------------------------------|
| GET    | `/api/classes/{id}/contents/video`        | Lấy danh sách video            |
| DELETE | `/api/classes/{id}/contents/video/{vid}`  | Xóa video                      |
| PATCH  | `/api/classes/{id}/contents/video/{vid}/status` | Đổi trạng thái          |

---

## SCR-05b-002: Form Thêm mới / Chỉnh sửa nội dung Video

### 1. Mô tả
Form nhập thông tin video: upload file từ thiết bị hoặc nhập URL embed (YouTube/Vimeo), điền metadata. Sau khi upload/nhập URL, GV điền tiêu đề, mô tả rồi lưu.

### 2. Actors
- **Chính:** GV, CBQL
- **Hệ thống:** Nhận file/URL, validate, lưu CSDL

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  📂 Lớp: Toán 10  >  Nội dung  >  Video  >  Thêm mới                    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Nguồn video:  (●) Upload file   ( ) Embed URL                           ║
║  ─────────────────────────────────────────────────────────────────────  ║
║  ┌── Upload file ─────────────────────────────────────────────────────┐  ║
║  │  [  📁 Chọn file video (MP4, AVI, MOV — tối đa 500MB)  ]          │  ║
║  │  ████████████████░░░░░░░░░░  68%  bai1_toan.mp4  [✕ Thay thế]     │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                          ║
║  Tiêu đề *     [ Bài 1: Giới thiệu chương trình                    ]    ║
║  Mô tả         [ __________________________________________________ ]   ║
║  Thứ tự hiển thị [ 1  ]                                                  ║
║                                                                          ║
║  Cấu hình xem:  ☑ Bắt buộc xem hết video trước khi tiếp tục             ║
║                 ☐ Cho phép tua video                                     ║
║                 ☑ Ghi nhận tiến độ xem                                   ║
║                                                                          ║
║            [Hủy]                          [💾 Lưu nội dung]             ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components
- **Radio:** Upload file / Embed URL (toggle section bên dưới)
- **Upload zone:** progress bar, tên file, nút "Thay thế" (xóa + chọn lại)
- **Embed section** (khi chọn URL): input URL YouTube/Vimeo + preview thumbnail
- **Fields:** Tiêu đề (*bắt buộc), Mô tả, Thứ tự hiển thị
- **Checkboxes cấu hình xem:** bắt buộc xem hết / cho phép tua / ghi nhận tiến độ

### 5. Flow
1. Chọn nguồn "Upload" → hiển thị drop-zone → upload → progress bar → ✓ hoàn thành
2. Hoặc chọn "Embed URL" → nhập link → hệ thống render thumbnail preview
3. Điền metadata → nhấn **Lưu** → validate → lưu CSDL → quay về SCR-05b-001
4. Thông tin thiếu/sai → highlight lỗi inline, không lưu

### 6. Business Rules
- Tiêu đề bắt buộc, tối đa 255 ký tự
- File video: định dạng MP4/AVI/MOV/MKV; tối đa 500MB
- URL embed: phải là YouTube hoặc Vimeo hợp lệ
- "Bắt buộc xem hết" và "Cho phép tua" không được tích đồng thời

### 7. API
| Method | Endpoint                                    | Mô tả                        |
|--------|---------------------------------------------|------------------------------|
| POST   | `/api/classes/{id}/contents/video`          | Tạo mới video                |
| PUT    | `/api/classes/{id}/contents/video/{vid}`    | Cập nhật video               |
| POST   | `/api/upload/video`                         | Upload file video (multipart)|

---

## SCR-05b-003: Thiết lập ràng buộc & lịch hiển thị Video

### 1. Mô tả
Modal/trang phụ cho phép GV thiết lập ràng buộc học tập (điều kiện mở khóa) và lịch hiển thị (từ ngày – đến ngày) cho một video trong lớp học.

### 2. Actors
- **Chính:** GV, CBQL
- **Hệ thống:** Lưu cấu hình ràng buộc và lịch

### 3. ASCII Wireframe

```
╔═══════════════════════════════════════════════╗
║  ⚙ Cấu hình: "Bài 1 – Giới thiệu"             ║
║  ─────────────────────────────────────────    ║
║  [Ràng buộc]         [Lịch hiển thị]           ║
║  ════════════════════════════════════════════  ║
║  TAB: Ràng buộc                                ║
║  ☑ Phải hoàn thành nội dung trước:             ║
║     [▼ Chọn nội dung điều kiện        ]        ║
║  ☐ Phải đạt điểm bài tập (≥ ___ điểm)          ║
║                                                ║
║  TAB: Lịch hiển thị                            ║
║  ☑ Hiển thị theo lịch                          ║
║  Từ ngày:  [📅 dd/mm/yyyy  ⏰ hh:mm ]          ║
║  Đến ngày: [📅 dd/mm/yyyy  ⏰ hh:mm ]          ║
║  ☐ Ẩn sau khi hết hạn                          ║
║                                                ║
║  ⚠ Thông tin thiếu → báo lỗi inline            ║
║           [Hủy]       [✔ Áp dụng]             ║
╚═══════════════════════════════════════════════╝
```

### 4. Components
- **Tab:** Ràng buộc | Lịch hiển thị
- **Ràng buộc:** checkbox + dropdown chọn nội dung điều kiện, điểm tối thiểu
- **Lịch hiển thị:** datetime picker (từ–đến), toggle ẩn sau hết hạn

### 5. Flow
1. Từ SCR-05b-001, GV nhấn icon ⚙ hoặc chọn "Cấu hình" tại dòng video
2. Modal mở, GV cấu hình ràng buộc và/hoặc lịch → nhấn **Áp dụng**
3. Validate (ngày kết thúc > ngày bắt đầu) → lưu → trạng thái cột cập nhật

### 6. Business Rules
- Ngày bắt đầu ≤ ngày kết thúc (bắt buộc nếu bật lịch)
- Nội dung điều kiện phải thuộc cùng lớp học
- Ràng buộc và lịch có thể thiết lập độc lập hoặc kết hợp

### 7. API
| Method | Endpoint                                            | Mô tả                    |
|--------|-----------------------------------------------------|--------------------------|
| PUT    | `/api/classes/{id}/contents/video/{vid}/constraint` | Lưu ràng buộc            |
| PUT    | `/api/classes/{id}/contents/video/{vid}/schedule`   | Lưu lịch hiển thị        |

---

## SCR-05b-004: Chọn Video từ Thư viện

### 1. Mô tả
Dialog tìm kiếm và chọn video từ ba nguồn: **Thư viện cá nhân** (của GV), **Thư viện đơn vị**, **Nguồn chia sẻ**. Hỗ trợ tìm theo từ khóa, lọc theo danh mục/người chia sẻ, phân trang.

### 2. Actors
- **Chính:** GV, CBQL
- **Hệ thống:** Truy vấn thư viện, gắn liên kết video vào lớp học

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════╗
║  📚 Chọn Video từ Thư viện                              [✕]  ║
║  ──────────────────────────────────────────────────────────  ║
║  [Cá nhân ●]  [Đơn vị]  [Chia sẻ]                           ║
║  🔍 [Tìm tên video...            ]  [▼ Danh mục]  [Tìm kiếm]║
║                        *Tab "Chia sẻ" thêm: [▼ Người chia sẻ]║
║  Hiển thị [▼10] / trang                                      ║
║ ┌────┬────────────────────────┬──────────┬───────────────────┐║
║ │ □  │ Tên video              │ Danh mục │ Ngày tạo          │║
║ ├────┼────────────────────────┼──────────┼───────────────────┤║
║ │ ○  │ Toán cao cấp – Phần 1  │ Toán học │ 10/02/2026        │║
║ │ ●  │ Đạo hàm nâng cao       │ Toán học │ 15/02/2026        │║
║ │ ○  │ Ứng dụng tích phân     │ Toán học │ 20/02/2026        │║
║ └────┴────────────────────────┴──────────┴───────────────────┘║
║  [< 1  2  3 >]   Tổng: 18 kết quả                            ║
║  ─────────────────────────────────────────────────────────── ║
║  Đã chọn: Đạo hàm nâng cao                                   ║
║               [Hủy]                [✔ Xác nhận chọn]         ║
╚══════════════════════════════════════════════════════════════╝
```

### 4. Components
- **Tabs nguồn:** Cá nhân | Đơn vị | Chia sẻ
- **Thanh tìm kiếm:** từ khóa + dropdown danh mục + (tab Chia sẻ thêm: người chia sẻ)
- **Bảng kết quả:** radio button chọn 1 video, tên, danh mục, ngày tạo
- **Phân trang + số bản ghi/trang**
- **Footer:** hiển thị tên đã chọn + nút Hủy / Xác nhận

### 5. Flow
1. GV chọn "Từ thư viện" → dialog mở ở tab mặc định (Cá nhân)
2. Tìm kiếm hoặc duyệt danh sách → chọn radio một video
3. Nhấn **Xác nhận** → hệ thống gắn video vào lớp → quay SCR-05b-001
4. Khi chỉnh sửa (thay thế): dialog mở lại, GV chọn video khác → Xác nhận

### 6. Business Rules
- Chỉ hiển thị video GV sở hữu (tab Cá nhân) / video đơn vị / video được chia sẻ cho GV
- Một lần chỉ chọn được 1 video (radio, không phải checkbox)
- Tab Chia sẻ: lọc theo người chia sẻ là bắt buộc (không hiện tất cả)

### 7. API
| Method | Endpoint                                     | Mô tả                      |
|--------|----------------------------------------------|----------------------------|
| GET    | `/api/library/video?scope=personal&q=&cat=`  | Thư viện cá nhân           |
| GET    | `/api/library/video?scope=unit&q=&cat=`      | Thư viện đơn vị            |
| GET    | `/api/library/video?scope=shared&sharedBy=`  | Nguồn chia sẻ              |
| POST   | `/api/classes/{id}/contents/video/link`      | Gắn video từ thư viện      |

---

## PHẦN 2 — QUẢN LÝ NỘI DUNG VĂN BẢN

---

## SCR-05b-005: Danh sách nội dung Văn bản của lớp học

### 1. Mô tả
GV/CBQL xem và quản lý các nội dung văn bản (text, hình ảnh, tệp đính kèm) đã thêm vào lớp học. Cho phép thêm mới, chỉnh sửa, xóa, xem trước, lên lịch hiển thị.

### 2. Actors
- **Chính:** GV, CBQL
- **Hệ thống:** Truy vấn, xóa, cập nhật trạng thái

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Quản lý lớp học] [Nội dung ●] [Kết quả] ...   👤 GV Trần A ▼  ║
╠══════════════════════════════════════════════════════════════════════════╣
║  📂 Lớp: Toán 10 – HK1  >  Nội dung  >  Văn bản                         ║
║  ─────────────────────────────────────────────────────────────────────  ║
║  [+ Thêm mới]   🔍 [Tìm tiêu đề văn bản...               ] [🔍]         ║
║                                                                          ║
║ ┌────┬────────────────────────┬─────────────┬──────────┬───────────────┐ ║
║ │ □  │ Tiêu đề                │ Tệp đính kèm│ Trạng thái│ Thao tác    │ ║
║ ├────┼────────────────────────┼─────────────┼──────────┼───────────────┤ ║
║ │ □  │ Giới thiệu chương trình│ 2 tệp       │ ● Hiển thị│[Sửa][Xem][✕]│ ║
║ │ □  │ Lý thuyết đạo hàm      │ 0 tệp       │ ○ Ẩn     │[Sửa][Xem][✕]│ ║
║ │ □  │ Bài tập ứng dụng       │ 3 tệp       │ ⏰ Lên lịch│[Sửa][Xem][✕]│ ║
║ └────┴────────────────────────┴─────────────┴──────────┴───────────────┘ ║
║  [Xóa đã chọn]   [< 1  2 >]   Hiển thị [▼10] / trang   Tổng: 12 mục    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components
- **Breadcrumb:** Lớp học > Nội dung > Văn bản
- **Nút "Thêm mới"** → mở SCR-05b-006
- **Bảng danh sách:** checkbox, tiêu đề, số tệp đính kèm, trạng thái, thao tác
- **Phân trang + số bản ghi/trang**

### 5. Flow
1. GV chọn lớp → vào tab Văn bản → hiển thị danh sách
2. **Thêm mới** → SCR-05b-006 (form trống)
3. **Sửa** → SCR-05b-006 (pre-fill)
4. **Xóa** → dialog xác nhận → xóa → cập nhật danh sách

### 6. Business Rules
- Nội dung Văn bản có thể không có tệp đính kèm (chỉ rich-text)
- Xóa nội dung văn bản xóa cả tệp đính kèm liên quan
- Lịch hiển thị thiết lập tại cùng form chỉnh sửa (tab Lịch hiển thị)

### 7. API
| Method | Endpoint                                   | Mô tả                         |
|--------|--------------------------------------------|-------------------------------|
| GET    | `/api/classes/{id}/contents/text`          | Lấy danh sách văn bản         |
| DELETE | `/api/classes/{id}/contents/text/{tid}`    | Xóa nội dung văn bản          |

---

## SCR-05b-006: Form Thêm mới / Chỉnh sửa nội dung Văn bản

### 1. Mô tả
Form soạn thảo nội dung văn bản: rich-text editor (text + hình ảnh inline), quản lý tệp đính kèm (upload, xóa, sắp xếp thứ tự, cấu hình quyền tải/xem), thiết lập lịch hiển thị.

### 2. Actors
- **Chính:** GV, CBQL
- **Hệ thống:** Upload file, validate, lưu nội dung và tệp đính kèm

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  📂 Lớp: Toán 10  >  Văn bản  >  Thêm mới                               ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Tiêu đề *  [ Giới thiệu chương trình Toán 10                       ]   ║
║  Thứ tự     [ 1 ]                                                        ║
║  ─────────────────────────────────────────────────────────────────────  ║
║  Nội dung *                                                              ║
║  ┌─[B][I][U][H1][H2][—][🖼][🔗][…]──────────────────────────────────┐   ║
║  │                                                                   │   ║
║  │  Chương trình Toán lớp 10 gồm 3 chủ đề chính:                    │   ║
║  │  1. Đại số và tổ hợp                                              │   ║
║  │  2. Hình học phẳng   [hình ảnh inline]                            │   ║
║  │  3. Giải tích                                                     │   ║
║  │                                                                   │   ║
║  └───────────────────────────────────────────────────────────────────┘   ║
║  ─────────────────────────────────────────────────────────────────────  ║
║  Tệp đính kèm   [+ Tải lên tệp]                                         ║
║ ┌───┬──────────────────────┬───────┬──────────────┬───────────────────┐  ║
║ │ ≡ │ detong_mon_toan.pdf  │ 1.2MB │ 👁 Xem ☑ Tải │ [▲][▼] [✕]      │  ║
║ │ ≡ │ bai_tap_chuong1.docx │ 340KB │ 👁 Xem ☑ Tải │ [▲][▼] [✕]      │  ║
║ └───┴──────────────────────┴───────┴──────────────┴───────────────────┘  ║
║  ─────────────────────────────────────────────────────────────────────  ║
║  Lịch hiển thị  ☐ Bật lịch   Từ [📅──────]  Đến [📅──────]             ║
║                                                                          ║
║              [Hủy]                         [💾 Lưu nội dung]            ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components
- **Fields:** Tiêu đề (*), Thứ tự hiển thị
- **Rich-text editor:** toolbar định dạng, chèn hình ảnh inline, chèn link
- **Khu vực tệp đính kèm:**
  - Nút "Tải lên tệp" (multi-upload)
  - Bảng file: icon kéo-thả sắp xếp (≡), tên file, dung lượng, toggle Xem/Tải, nút lên/xuống thứ tự, nút xóa
- **Lịch hiển thị:** checkbox bật + datetime picker từ–đến

### 5. Flow
1. GV điền tiêu đề, soạn nội dung trong rich-text editor
2. Upload tệp đính kèm → hệ thống kiểm tra định dạng → hiển thị trong bảng
3. Cấu hình quyền từng tệp (toggle Xem / Tải)
4. Kéo-thả hoặc nhấn ▲▼ để sắp xếp thứ tự tệp
5. Tùy chọn bật lịch hiển thị → chọn ngày
6. Nhấn **Lưu** → validate (tiêu đề bắt buộc, ngày hợp lệ) → lưu → quay SCR-05b-005

### 6. Business Rules
- Tiêu đề bắt buộc, tối đa 255 ký tự
- Tệp đính kèm: tổng dung lượng ≤ 100MB/nội dung; định dạng PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, PNG, JPG
- Toggle "Tải" chỉ có tác dụng khi toggle "Xem" đã bật
- Xóa tệp đính kèm yêu cầu xác nhận inline (không cần dialog riêng)
- Ngày kết thúc lịch phải sau ngày bắt đầu nếu bật lịch hiển thị

### 7. API
| Method | Endpoint                                            | Mô tả                          |
|--------|-----------------------------------------------------|--------------------------------|
| POST   | `/api/classes/{id}/contents/text`                   | Tạo mới văn bản                |
| PUT    | `/api/classes/{id}/contents/text/{tid}`             | Cập nhật văn bản               |
| POST   | `/api/classes/{id}/contents/text/{tid}/attachments` | Upload tệp đính kèm            |
| DELETE | `/api/classes/{id}/contents/text/{tid}/attachments/{aid}` | Xóa tệp đính kèm         |
| PATCH  | `/api/classes/{id}/contents/text/{tid}/attachments/order` | Cập nhật thứ tự tệp      |
| PATCH  | `/api/classes/{id}/contents/text/{tid}/attachments/{aid}/permission` | Cấu hình quyền |
| PUT    | `/api/classes/{id}/contents/text/{tid}/schedule`    | Lưu lịch hiển thị              |

---

## Sơ đồ luồng tổng quan

```
                    ┌─────────────────┐
                    │  SCR-05b-001    │
                    │ DS Video lớp học│
                    └────────┬────────┘
          ┌─────────┬────────┼────────┬──────────┐
          ▼         ▼        ▼        ▼          ▼
    [+Upload]  [+Embed]  [+Thư viện] [Sửa]     [Xóa]
          │         │        │        │       (confirm)
          └────┬────┘        │        │
               ▼             ▼        │
        SCR-05b-002    SCR-05b-004    │
        Form Video     Chọn từ TV     │
               │             │        │
               └──────┬──────┘        │
                      ▼               │
               ⚙ SCR-05b-003 ◄────────┘
               Ràng buộc & Lịch

                    ┌─────────────────┐
                    │  SCR-05b-005    │
                    │ DS Văn bản lớp  │
                    └────────┬────────┘
               ┌─────────────┼──────────┐
               ▼             ▼          ▼
         [+ Thêm mới]     [Sửa]       [Xóa]
               │             │       (confirm)
               └──────┬──────┘
                      ▼
               SCR-05b-006
               Form Văn bản
               (Editor + Tệp đính kèm + Lịch)
```
