---
title: "WF-08: Phân hệ AI Điểm danh khuôn mặt"
cluster: "AI Attendance"
updated: 2026-03-11
---

# WF-08: Phân hệ AI Điểm danh khuôn mặt

---

## Tổng quan hệ thống

### Phạm vi phân hệ

Phân hệ AI Điểm danh khuôn mặt là hệ thống tự động nhận diện và ghi nhận sự hiện diện của học sinh/giáo viên thông qua camera và thiết bị điểm danh IoT. Hệ thống gồm 4 lớp chức năng chính:

| Lớp | Mô tả |
|-----|-------|
| **A – Quản lý tài khoản & thiết bị** | Tài khoản camera, tài khoản máy điểm danh |
| **B – Quản lý dữ liệu khuôn mặt** | Thu thập ảnh, duyệt khuôn mặt, embedding vector |
| **C – Nền tảng phân tích hình ảnh** | Pipeline AI realtime: detect khuôn mặt, hình dáng, matching |
| **D – Báo cáo & phân tích** | Báo cáo vào/ra theo địa điểm, nhật ký phân tích, chia sẻ Hue-S |

### Actors

| Actor | Mô tả |
|-------|-------|
| **QTHT** | Quản trị hệ thống – thao tác toàn bộ chức năng |
| **HT** | Hệ thống tự động – chạy pipeline AI ngầm |
| **Hue-S** | Hệ thống ngoài – nhận dữ liệu điểm danh qua API |

### Sơ đồ luồng tổng thể

```
Camera/IoT Device
      │
      ▼
[C] Pipeline AI Realtime
  ├── Tiền xử lý ảnh
  ├── Detect khuôn mặt → Embedding → So sánh vector → Lưu điểm danh
  └── Detect hình dáng → Embedding → So sánh vector → Lưu điểm danh
      │
      ▼
[D] Báo cáo & Phân tích
  ├── Báo cáo vào/ra theo địa điểm camera
  ├── Nhật ký phân tích camera / máy điểm danh
  └── Chia sẻ → Hue-S API

[A] Quản lý thiết bị ─── cấu hình ──▶ Camera / Máy điểm danh
[B] Quản lý khuôn mặt ── đăng ký ──▶ Vector DB
```

---

## Phần A: Quản lý tài khoản & thiết bị

---

### SCR-08-001: Danh sách tài khoản camera

#### Mô tả
Màn hình chính quản lý tất cả tài khoản camera được tích hợp vào hệ thống. QTHT có thể xem, tìm kiếm, sắp xếp, phân trang và kết xuất danh sách.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Quản lý tài khoản camera                   │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│ 📷 Tài   │  QUẢN LÝ TÀI KHOẢN CAMERA                                    │
│  khoản  │                                                              │
│  Camera  │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ 🔍 Tìm kiếm theo tên / mã camera...    [Tìm kiếm]  │    │
│ 🖥️ Máy   │  └─────────────────────────────────────────────────────┘    │
│  Điểm   │                                                              │
│  danh   │  Sắp xếp: [Tên A-Z ▾]    Hiển thị: [20 ▾] bản ghi/trang    │
│          │                                                              │
│ 👤 Khuôn │  [+ Thêm mới]                              [⬇ Xuất Excel]   │
│  mặt    │                                                              │
│          │  ┌────┬──────────────┬───────────┬──────────┬────────────┐  │
│ 📊 Báo   │  │ □  │ Tên camera   │ IP/URL    │ Vị trí  │ Trạng thái │  │
│  cáo    │  ├────┼──────────────┼───────────┼──────────┼────────────┤  │
│          │  │ □  │ Camera A101  │ 192.168.. │ Cổng 1  │ 🟢 Online  │  │
│          │  │ □  │ Camera B201  │ 192.168.. │ Sân T.  │ 🔴 Offline │  │
│          │  │ □  │ Camera C301  │ 192.168.. │ HT số 1 │ 🟢 Online  │  │
│          │  │ □  │ Camera D401  │ rtsp://.. │ Cổng 2  │ 🟡 Pending │  │
│          │  │ □  │ ...          │ ...       │ ...     │ ...        │  │
│          │  └────┴──────────────┴───────────┴──────────┴────────────┘  │
│          │         [Hành động ▾]  Đã chọn: 0                           │
│          │                                                              │
│          │         Xem chi tiết | Chỉnh sửa | Xóa   (inline actions)   │
│          │                                                              │
│          │  ◀ Trước  [1] [2] [3] ... [10]  Tiếp ▶     Tổng: 187 bản  │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| SearchBar | Input + Button | Tìm theo tên/mã camera |
| SortDropdown | Select | Sắp xếp A-Z / Z-A / Mới nhất |
| PageSizeDropdown | Select | 10 / 20 / 50 bản ghi/trang |
| AddButton | Button (Primary) | Mở form thêm mới |
| ExportButton | Button (Secondary) | Kết xuất Excel |
| DataTable | Table | Danh sách camera có checkbox |
| StatusBadge | Badge | Online / Offline / Pending |
| RowActions | Button group | Xem chi tiết / Sửa / Xóa |
| Pagination | Component | Phân trang |
| BulkActionDropdown | Select | Hành động với nhiều bản ghi |

#### Luồng điều hướng
```
[SCR-08-001] Danh sách Camera
    │
    ├── [+ Thêm mới]      ──▶  [SCR-08-002] Form thêm mới camera
    ├── [Xem chi tiết]    ──▶  [SCR-08-003] Chi tiết camera
    ├── [Chỉnh sửa]       ──▶  [SCR-08-004] Form chỉnh sửa camera
    ├── [Xóa]             ──▶  [SCR-08-005] Modal xác nhận xóa
    └── [Xuất Excel]      ──▶  Download file .xlsx
```

#### Business Rules / Validation
- Tìm kiếm theo tên camera hoặc mã camera (không phân biệt hoa thường)
- Sắp xếp mặc định: Tên A-Z
- Phân trang mặc định: 20 bản ghi/trang
- Trạng thái camera được refresh tự động mỗi 30 giây
- Chỉ QTHT có quyền `MANAGE_CAMERA_ACCOUNT` mới được truy cập màn hình này

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/cameras
       ?search=&sort=name_asc&page=1&size=20
       → { data: [...], total, page, size }

GET    /api/v1/ai-attendance/cameras/export
       ?search=&sort=name_asc
       → file: camera_list.xlsx
```

---

### SCR-08-002: Form thêm mới tài khoản camera

#### Mô tả
Form nhập thông tin để tạo mới tài khoản camera kết nối vào hệ thống.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Tài khoản Camera  >  Thêm mới             │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│  (thu    │                                                              │
│  gọn)   │  THÊM MỚI TÀI KHOẢN CAMERA                                  │
│          │  ─────────────────────────────────────────────────────────  │
│          │                                                              │
│          │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ THÔNG TIN CƠ BẢN                                    │    │
│          │  │                                                     │    │
│          │  │  Tên camera *                                       │    │
│          │  │  ┌───────────────────────────────────────────────┐  │    │
│          │  │  │ VD: Camera cổng trường A101                   │  │    │
│          │  │  └───────────────────────────────────────────────┘  │    │
│          │  │                                                     │    │
│          │  │  Mã camera *                   Vị trí / Địa điểm * │    │
│          │  │  ┌──────────────────────┐      ┌───────────────────┐│    │
│          │  │  │ CAM-001              │      │ [Chọn địa điểm ▾] ││    │
│          │  │  └──────────────────────┘      └───────────────────┘│    │
│          │  └─────────────────────────────────────────────────────┘    │
│          │                                                              │
│          │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ KẾT NỐI CAMERA                                      │    │
│          │  │                                                     │    │
│          │  │  Loại kết nối *                                     │    │
│          │  │  ◉ RTSP Stream   ○ HTTP/MJPEG   ○ SDK / IoT        │    │
│          │  │                                                     │    │
│          │  │  URL / IP Camera *                                  │    │
│          │  │  ┌───────────────────────────────────────────────┐  │    │
│          │  │  │ rtsp://192.168.1.x:554/stream                 │  │    │
│          │  │  └───────────────────────────────────────────────┘  │    │
│          │  │                                                     │    │
│          │  │  Tên đăng nhập            Mật khẩu                 │    │
│          │  │  ┌──────────────────┐     ┌──────────────────────┐ │    │
│          │  │  │ admin            │     │ ••••••••             │ │    │
│          │  │  └──────────────────┘     └──────────────────────┘ │    │
│          │  │                                                     │    │
│          │  │  [🔗 Kiểm tra kết nối]  ✅ Kết nối thành công      │    │
│          │  └─────────────────────────────────────────────────────┘    │
│          │                                                              │
│          │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ CÀI ĐẶT PHÂN TÍCH AI                                │    │
│          │  │                                                     │    │
│          │  │  Bật phân tích khuôn mặt   [● ON ]                  │    │
│          │  │  Bật phân tích hình dáng   [○ OFF]                  │    │
│          │  │  Loại camera  ◉ Camera vào   ○ Camera ra  ○ Cả hai │    │
│          │  └─────────────────────────────────────────────────────┘    │
│          │                                                              │
│          │         ┌──────────────────┐   ┌────────────────────┐       │
│          │         │      [Lưu lại]   │   │      [Hủy bỏ]     │       │
│          │         └──────────────────┘   └────────────────────┘       │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Validation |
|-----------|------|-----------|
| TênCamera | TextInput | Required, max 100 ký tự |
| MãCamera | TextInput | Required, unique, format: CAM-xxx |
| VịTrí | Select | Required, từ danh mục địa điểm |
| LoạiKếtNối | RadioGroup | Required |
| URL/IP | TextInput | Required, format URL/IP hợp lệ |
| Tài khoản | TextInput | Optional |
| MậtKhẩu | PasswordInput | Optional |
| TestConnectionBtn | Button | Gọi API kiểm tra kết nối live |
| BậtKhuônMặt | Toggle | Default: ON |
| BậtHìnhDáng | Toggle | Default: OFF |
| LoạiCamera | RadioGroup | Vào / Ra / Cả hai |
| LưuBtn | Button (Primary) | Submit form |
| HủyBtn | Button | Quay về danh sách |

#### Luồng điều hướng
```
[SCR-08-001] ──▶ [SCR-08-002] ──[Lưu thành công]──▶ [SCR-08-001] + toast "Thêm mới thành công"
                              ──[Hủy bỏ]──▶ [SCR-08-001]
                              ──[Lỗi validation]──▶ Hiển thị inline error
```

#### Business Rules / Validation
- Mã camera phải là duy nhất trong hệ thống
- URL phải theo định dạng hợp lệ (rtsp://, http://, https://)
- Nút "Kiểm tra kết nối" gọi API test live trước khi lưu
- Nếu test kết nối thất bại, vẫn cho phép lưu nhưng hiển thị cảnh báo
- Trạng thái ban đầu sau khi tạo: Đang chờ kết nối

#### API Endpoints gợi ý
```
POST   /api/v1/ai-attendance/cameras
       Body: { name, code, location_id, connection_type, url, username, password,
               face_detection_enabled, body_detection_enabled, camera_type }
       → 201 Created | 400 Validation Error | 409 Code already exists

POST   /api/v1/ai-attendance/cameras/test-connection
       Body: { url, username, password, connection_type }
       → { success: true/false, message }
```

---

### SCR-08-003: Chi tiết tài khoản camera

#### Mô tả
Màn hình xem toàn bộ thông tin chi tiết của một camera cụ thể, bao gồm thông tin kết nối, preview live feed và trạng thái hoạt động.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Tài khoản Camera  >  Chi tiết             │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  ◀ Quay lại       CAMERA A101 – CỔng TRƯỜNG CHÍNH           │
│          │                                          [Chỉnh sửa] [Xóa]  │
│          │  ┌─────────────────────────────┬───────────────────────────┐ │
│          │  │  THÔNG TIN CAMERA           │   LIVE FEED PREVIEW       │ │
│          │  │                             │                           │ │
│          │  │  Mã camera:  CAM-001        │  ╔═══════════════════════╗ │ │
│          │  │  Tên:        Camera A101    │  ║                       ║ │ │
│          │  │  Vị trí:     Cổng trường 1  │  ║   [🎥 LIVE STREAM]    ║ │ │
│          │  │  Loại kết:   RTSP           │  ║                       ║ │ │
│          │  │  URL:        rtsp://192...  │  ║   ● REC  12:34:56     ║ │ │
│          │  │  Trạng thái: 🟢 Online      │  ╚═══════════════════════╝ │ │
│          │  │  Loại camera: Vào + Ra      │   FPS: 25  Độ phân giải:  │ │
│          │  │  AI khuôn mặt: ✅ Bật       │   1920×1080               │ │
│          │  │  AI hình dáng: ❌ Tắt       │                           │ │
│          │  │  Tạo lúc: 2026-01-10 08:30  │   [📷 Chụp ảnh thử]       │ │
│          │  │  Cập nhật: 2026-03-01 14:20 │                           │ │
│          │  └─────────────────────────────┴───────────────────────────┘ │
│          │                                                              │
│          │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ THỐNG KÊ HOẠT ĐỘNG HÔM NAY                          │    │
│          │  │                                                     │    │
│          │  │  Tổng lượt nhận diện: 247    Thành công: 231 (93%)  │    │
│          │  │  Vào: 142    Ra: 89    Lỗi nhận diện: 16            │    │
│          │  │                                                     │    │
│          │  │  [Xem báo cáo chi tiết →]                           │    │
│          │  └─────────────────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| InfoPanel | Card | Thông tin camera |
| LiveFeedViewer | Video/Canvas | Hiển thị luồng camera realtime |
| StatusBadge | Badge | Online / Offline |
| RecordingIndicator | Animated dot | Trạng thái đang ghi |
| CaptureButton | Button | Chụp ảnh thử từ camera |
| StatsSummary | Stats Cards | Tổng hợp ngày hôm nay |
| EditButton | Button | Điều hướng sang chỉnh sửa |
| DeleteButton | Button (Danger) | Mở modal xóa |

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/cameras/{id}
       → { camera info, stats_today: { total, success, entry, exit, error } }

GET    /api/v1/ai-attendance/cameras/{id}/stream-url
       → { stream_url, token }
```

---

### SCR-08-004: Form chỉnh sửa tài khoản camera

#### Mô tả
Form chỉnh sửa thông tin camera, tương tự SCR-08-002 nhưng pre-fill dữ liệu hiện tại.

> **Layout**: Tương tự SCR-08-002 với các trường được điền sẵn giá trị hiện tại. Tiêu đề thay đổi thành "CHỈNH SỬA TÀI KHOẢN CAMERA". Thêm nút "Reset về mặc định".

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/cameras/{id}    → Lấy dữ liệu điền form
PUT    /api/v1/ai-attendance/cameras/{id}    → Cập nhật
```

---

### SCR-08-005: Modal xác nhận xóa camera

#### Layout ASCII Wireframe

```
                ┌──────────────────────────────────┐
                │  ⚠️  XÁC NHẬN XÓA                │
                │                                  │
                │  Bạn có chắc muốn xóa camera:    │
                │  📷 Camera A101 – Cổng trường 1   │
                │                                  │
                │  Thao tác này không thể hoàn tác. │
                │  Dữ liệu lịch sử điểm danh từ    │
                │  camera này sẽ vẫn được giữ lại.  │
                │                                  │
                │    [Hủy bỏ]    [Xóa camera]       │
                └──────────────────────────────────┘
```

#### Business Rules
- Chỉ được xóa khi camera đang ở trạng thái Offline
- Nếu camera đang Online: hiển thị lỗi "Vui lòng tắt camera trước khi xóa"
- Dữ liệu điểm danh lịch sử vẫn được bảo toàn sau khi xóa tài khoản camera

#### API Endpoints gợi ý
```
DELETE /api/v1/ai-attendance/cameras/{id}
       → 200 OK | 409 Camera is Online
```

---

### SCR-08-006: Danh sách tài khoản máy điểm danh

#### Mô tả
Quản lý các thiết bị điểm danh IoT (máy chấm công khuôn mặt độc lập). Tương tự SCR-08-001 nhưng dành cho máy điểm danh.

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Quản lý máy điểm danh                     │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  QUẢN LÝ TÀI KHOẢN MÁY ĐIỂM DANH                           │
│          │                                                              │
│          │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ 🔍 Tìm kiếm theo tên / mã máy...       [Tìm kiếm]  │    │
│          │  └─────────────────────────────────────────────────────┘    │
│          │                                                              │
│          │  Sắp xếp: [Tên A-Z ▾]    Hiển thị: [20 ▾] bản ghi/trang   │
│          │                                                              │
│          │  [+ Thêm mới]                              [⬇ Xuất Excel]   │
│          │                                                              │
│          │  ┌────┬───────────────┬──────────────┬──────────┬─────────┐ │
│          │  │ □  │ Tên máy       │ Mã máy       │ Vị trí  │ Trạng thái│ │
│          │  ├────┼───────────────┼──────────────┼──────────┼─────────┤ │
│          │  │ □  │ Máy DD - P.A  │ IOT-001      │ P. A101 │ 🟢 Active │ │
│          │  │ □  │ Máy DD - P.B  │ IOT-002      │ P. B201 │ 🔴 Error  │ │
│          │  │ □  │ Máy DD - Gym  │ IOT-003      │ Gym     │ 🟢 Active │ │
│          │  │ □  │ Máy DD - TV   │ IOT-004      │ T. Viện │ 🟡 Sync.. │ │
│          │  └────┴───────────────┴──────────────┴──────────┴─────────┘ │
│          │         [Hành động ▾]  Đã chọn: 0                          │
│          │                                                              │
│          │  ◀ Trước  [1] [2] [3]  Tiếp ▶          Tổng: 43 bản ghi   │
└──────────┴──────────────────────────────────────────────────────────────┘
```

> **SCR-08-007, SCR-08-008, SCR-08-009**: Form thêm mới, chỉnh sửa, modal xóa máy điểm danh – cấu trúc tương tự SCR-08-002, SCR-08-004, SCR-08-005 với các trường đặc thù: Mã máy, Firmware version, Kết nối (WiFi/LAN/4G), Đồng bộ dữ liệu.

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/devices
POST   /api/v1/ai-attendance/devices
GET    /api/v1/ai-attendance/devices/{id}
PUT    /api/v1/ai-attendance/devices/{id}
DELETE /api/v1/ai-attendance/devices/{id}
GET    /api/v1/ai-attendance/devices/export
```

---

## Phần B: Quản lý dữ liệu khuôn mặt

---

### SCR-08-010: Danh sách khuôn mặt điểm danh

#### Mô tả
Màn hình quản lý toàn bộ dữ liệu khuôn mặt của học sinh/giáo viên đã đăng ký vào hệ thống. Hiển thị dạng gallery + bảng. QTHT có thể xem, thêm mới, chỉnh sửa, xóa khuôn mặt.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Quản lý khuôn mặt điểm danh               │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  QUẢN LÝ KHUÔN MẶT ĐIỂM DANH                               │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  🔍 Tìm theo tên / mã học sinh...     [Tìm kiếm]     │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │  Lọc: Lớp [Tất cả ▾]  Trạng thái [Tất cả ▾]               │
│          │  Hiển thị: [🔲 Lưới] [☰ Bảng]     [+ Thêm mới] [⬇ Excel] │
│          │  ────────────────────────────────────────────────────────   │
│          │                                                              │
│          │  ── CHẾ ĐỘ LƯỚI (GALLERY) ──────────────────────────────   │
│          │                                                              │
│          │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│          │  │ ╔═════╗ │  │ ╔═════╗ │  │ ╔═════╗ │  │ ╔═════╗ │       │
│          │  │ ║ 👤  ║ │  │ ║ 👤  ║ │  │ ║ 👤  ║ │  │ ║ 👤  ║ │       │
│          │  │ ║     ║ │  │ ║     ║ │  │ ║     ║ │  │ ║     ║ │       │
│          │  │ ╚═════╝ │  │ ╚═════╝ │  │ ╚═════╝ │  │ ╚═════╝ │       │
│          │  │ Nguyễn  │  │ Trần    │  │ Lê Thị  │  │ Phạm    │       │
│          │  │ Văn A   │  │ Thị B   │  │ C       │  │ Văn D   │       │
│          │  │ 10A1    │  │ 10A2    │  │ GV Toán │  │ 11B1    │       │
│          │  │ ✅ Đã reg│  │ ✅ Đã reg│  │ ✅ Đã reg│  │ ⚠️ Lỗi  │       │
│          │  │ [✏][🗑] │  │ [✏][🗑] │  │ [✏][🗑] │  │ [✏][🗑] │       │
│          │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│          │                                                              │
│          │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│          │  │ ╔═════╗ │  │ ╔═════╗ │  │  + Thêm │  │         │       │
│          │  │ ║ 👤  ║ │  │ ║ 👤  ║ │  │  khuôn  │  │         │       │
│          │  │ ╚═════╝ │  │ ╚═════╝ │  │  mặt    │  │         │       │
│          │  │ ...     │  │ ...     │  │  mới    │  │         │       │
│          │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│          │                                                              │
│          │  ◀ Trước  [1] [2] [3] ... [25]  Tiếp ▶  Tổng: 482 người  │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Chế độ Bảng (Table view)

```
┌────┬─────────────┬───────────┬────────────┬───────────┬──────────────┐
│ □  │ Ảnh đại diện│ Họ tên    │ Mã HS/GV  │ Lớp/BP   │ Trạng thái   │
├────┼─────────────┼───────────┼────────────┼───────────┼──────────────┤
│ □  │   [👤 thumb] │ Nguyễn A  │ HS-10001  │ 10A1      │ ✅ Đã đăng ký│
│ □  │   [👤 thumb] │ Trần B    │ HS-10002  │ 10A2      │ ✅ Đã đăng ký│
│ □  │   [❌ no img] │ Lê C      │ HS-10003  │ 11B1      │ ⚠️ Lỗi vector│
└────┴─────────────┴───────────┴────────────┴───────────┴──────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| SearchInput | TextInput | Tìm theo tên/mã |
| ClassFilter | Select | Lọc theo lớp/bộ phận |
| StatusFilter | Select | Đã đăng ký / Lỗi vector / Chưa đăng ký |
| ViewToggle | Button group | Chuyển đổi Gallery ↔ Bảng |
| FaceCard | Card | Thumbnail khuôn mặt + tên + trạng thái |
| StatusBadge | Badge | Đã đăng ký / Lỗi / Chưa đăng ký |
| AddButton | Button | Mở form thêm mới khuôn mặt |
| EditIcon | Icon Button | Chỉnh sửa khuôn mặt |
| DeleteIcon | Icon Button | Xóa khuôn mặt |
| Pagination | Component | Phân trang |

#### Luồng điều hướng
```
[SCR-08-010] Danh sách Khuôn mặt
    │
    ├── [+ Thêm mới]   ──▶  [SCR-08-011] Form thêm khuôn mặt
    ├── [✏ Chỉnh sửa] ──▶  [SCR-08-012] Form chỉnh sửa khuôn mặt
    └── [🗑 Xóa]       ──▶  [SCR-08-013] Modal xác nhận xóa
```

#### Business Rules / Validation
- Trạng thái "Đã đăng ký" = học sinh có vector embedding hợp lệ trong CSDL
- Trạng thái "Lỗi vector" = ảnh được tải lên nhưng không thể tạo embedding (chất lượng ảnh kém)
- Trạng thái "Chưa đăng ký" = học sinh tồn tại trong HT nhưng chưa có ảnh
- Bộ lọc lớp được lấy từ danh mục lớp học của hệ thống
- Mỗi học sinh chỉ được có 1 bản ghi khuôn mặt chính (primary face)

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/faces
       ?search=&class_id=&status=&page=1&size=20
       → { data: [{ id, student_id, student_name, class, avatar_url, status }], total }

GET    /api/v1/ai-attendance/faces/export
```

---

### SCR-08-011: Form thêm mới khuôn mặt điểm danh

#### Mô tả
Form đăng ký khuôn mặt cho học sinh/giáo viên. Hệ thống tự động detect khuôn mặt trong ảnh upload, cho phép người dùng chọn khuôn mặt chính xác, sau đó chuyển đổi thành vector và lưu vào CSDL.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Khuôn mặt  >  Thêm mới                   │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  ĐĂNG KÝ KHUÔN MẶT ĐIỂM DANH                               │
│          │                                                              │
│          │  BƯỚC 1: Chọn học sinh / giáo viên                          │
│          │  ─────────────────────────────────                          │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ 🔍 Tìm theo tên hoặc mã học sinh...    [Tìm kiếm]    │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │  Kết quả: ○ Nguyễn Văn A – 10A1 – HS-10001               │   │
│          │           ○ Nguyễn Văn An – 10B2 – HS-10045              │   │
│          │  Đã chọn: ✅ Nguyễn Văn A (HS-10001 – Lớp 10A1)          │   │
│          │                                                              │
│          │  BƯỚC 2: Tải lên ảnh khuôn mặt                              │
│          │  ─────────────────────────────────                          │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │                                                      │   │
│          │  │   ┌─────────────────────────────────────────────┐   │   │
│          │  │   │                                             │   │   │
│          │  │   │         ☁️ Kéo thả ảnh vào đây              │   │   │
│          │  │   │         hoặc [Chọn từ máy tính]            │   │   │
│          │  │   │                                             │   │   │
│          │  │   │    Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB)    │   │   │
│          │  │   └─────────────────────────────────────────────┘   │   │
│          │  │                                                      │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  BƯỚC 3: Phát hiện & chọn khuôn mặt                         │
│          │  ──────────────────────────────────────                     │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  ⚙️ Đang phân tích ảnh...                            │   │
│          │  │  ████████████████░░░░  80%                           │   │
│          │  │                                                      │   │
│          │  │  Phát hiện 2 khuôn mặt. Vui lòng chọn khuôn mặt    │   │
│          │  │  cần đăng ký:                                        │   │
│          │  │                                                      │   │
│          │  │  ┌───────────────┐    ┌───────────────┐             │   │
│          │  │  │  ╔═════════╗  │    │  ╔═════════╗  │             │   │
│          │  │  │  ║  [👤]   ║  │    │  ║  [👤]   ║  │             │   │
│          │  │  │  ║         ║  │    │  ║         ║  │             │   │
│          │  │  │  ╚═════════╝  │    │  ╚═════════╝  │             │   │
│          │  │  │  Khuôn mặt 1  │    │  Khuôn mặt 2  │             │   │
│          │  │  │  [● Chọn]     │    │  [○ Chọn]     │             │   │
│          │  │  └───────────────┘    └───────────────┘             │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  BƯỚC 4: Xác nhận & lưu                                      │
│          │  ─────────────────────────                                  │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  Xem trước khuôn mặt đã chọn:                        │   │
│          │  │  ┌──────────┐  Học sinh: Nguyễn Văn A               │   │
│          │  │  │ ╔══════╗ │  Mã: HS-10001                         │   │
│          │  │  │ ║ [👤] ║ │  Lớp: 10A1                            │   │
│          │  │  │ ╚══════╝ │  Chất lượng ảnh: 🟢 Tốt (score: 0.95)│   │
│          │  │  └──────────┘                                        │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │    [⬅ Quay lại]   [Chọn ảnh khác]   [💾 Lưu & Tạo vector]  │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| StudentSearch | Autocomplete | Tìm và chọn học sinh |
| ImageDropzone | Upload Area | Kéo thả / chọn file ảnh |
| FaceDetectionProgress | ProgressBar | Hiển thị tiến trình AI detect |
| FaceSelector | Card Grid | Hiển thị các khuôn mặt đã detect |
| FaceHighlight | Canvas Overlay | Khoanh vùng khuôn mặt trên ảnh |
| QualityScore | Badge | Điểm chất lượng ảnh |
| FacePreview | Image | Ảnh khuôn mặt đã chọn |
| SaveButton | Button (Primary) | Lưu & tạo vector embedding |
| BackButton | Button | Quay lại |
| RetakeButton | Button | Chọn ảnh khác |

#### Luồng điều hướng
```
[SCR-08-010]
    │
    ▼
[SCR-08-011] Thêm khuôn mặt
    │
    ├── Upload ảnh → AI detect (background)
    │       │
    │       ├── 1 khuôn mặt tìm thấy → Auto chọn → Bước 4
    │       ├── Nhiều khuôn mặt → Hiện panel chọn → User chọn → Bước 4
    │       └── 0 khuôn mặt → Thông báo lỗi → Yêu cầu ảnh khác
    │
    ├── [Lưu & Tạo vector] → Embedding API → Lưu CSDL
    │       ├── Thành công → Toast "Đã đăng ký khuôn mặt" → [SCR-08-010]
    │       └── Thất bại → Toast lỗi
    │
    └── [Hủy] → [SCR-08-010]
```

#### Business Rules / Validation
- Ảnh phải chứa ít nhất 1 khuôn mặt có thể phát hiện được
- Chất lượng ảnh tối thiểu: score ≥ 0.7 (độ sắc nét, ánh sáng, góc mặt)
- Mỗi học sinh chỉ được đăng ký 1 vector khuôn mặt chính
- Nếu học sinh đã có vector → hỏi "Cập nhật khuôn mặt mới?" trước khi ghi đè
- Khuôn mặt được chọn phải nằm trong khung ảnh rõ ràng (confidence ≥ 0.85)
- Sau khi embedding thành công, trạng thái học sinh → "Đã đăng ký"

#### API Endpoints gợi ý
```
POST   /api/v1/ai-attendance/faces/detect
       Body: multipart/form-data { image }
       → { faces: [{ id, bbox, confidence, crop_url }] }

POST   /api/v1/ai-attendance/faces
       Body: { student_id, selected_face_id, original_image_id }
       → { face_id, vector_id, quality_score, status }
```

---

### SCR-08-012: Form chỉnh sửa khuôn mặt điểm danh

#### Mô tả
Cập nhật ảnh khuôn mặt và tái tạo vector embedding cho học sinh/giáo viên đã đăng ký.

> **Layout**: Tương tự SCR-08-011 với dữ liệu học sinh đã được điền sẵn. Hiển thị ảnh khuôn mặt cũ để so sánh. Tiêu đề: "CẬP NHẬT KHUÔN MẶT ĐIỂM DANH". Cảnh báo: "Cập nhật khuôn mặt sẽ thay thế vector cũ. Hệ thống sẽ sử dụng khuôn mặt mới cho tất cả điểm danh tiếp theo."

#### API Endpoints gợi ý
```
PUT    /api/v1/ai-attendance/faces/{id}
       Body: { selected_face_id, original_image_id }
       → { face_id, vector_id, quality_score }
```

---

### SCR-08-013: Modal xác nhận xóa khuôn mặt

#### Layout ASCII Wireframe

```
                ┌───────────────────────────────────┐
                │  ⚠️  XÓA KHUÔN MẶT ĐIỂM DANH     │
                │                                   │
                │  Học sinh: Nguyễn Văn A (HS-10001) │
                │                                   │
                │  ⚠️ Sau khi xóa, học sinh này sẽ   │
                │  không thể điểm danh tự động bằng  │
                │  khuôn mặt cho đến khi đăng ký lại.│
                │                                   │
                │  Dữ liệu điểm danh lịch sử vẫn    │
                │  được giữ nguyên.                  │
                │                                   │
                │    [Hủy bỏ]    [Xóa khuôn mặt]    │
                └───────────────────────────────────┘
```

#### API Endpoints gợi ý
```
DELETE /api/v1/ai-attendance/faces/{id}
       → 200 OK | 404 Not Found
```

---

## Phần C: Nền tảng phân tích hình ảnh thông minh

---

### SCR-08-020: Dashboard Live Camera – Giám sát AI realtime

#### Mô tả
Màn hình dashboard trung tâm hiển thị luồng hình ảnh realtime từ các camera, cùng với kết quả nhận diện AI được overlay trực tiếp trên feed. QTHT có thể bật/tắt camera và theo dõi trạng thái pipeline AI.

#### Actors
- QTHT, HT (tự động)

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Giám sát camera realtime                  │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  🔴 LIVE  GIÁM SÁT AI REALTIME               [Làm mới] [⚙]  │
│          │                                                              │
│          │  ┌──────────────────────────────┬──────────────────────────┐ │
│          │  │  ╔════════════════════════╗  │ ╔════════════════════════╗│ │
│          │  │  ║  CAMERA A101           ║  │ ║  CAMERA B201           ║│ │
│          │  │  ║  🟢 Online ● REC       ║  │ ║  🟢 Online ● REC       ║│ │
│          │  │  ║  ┌──────────────────┐  ║  │ ║  ┌──────────────────┐  ║│ │
│          │  │  ║  │  [LIVE STREAM]   │  ║  │ ║  │  [LIVE STREAM]   │  ║│ │
│          │  │  ║  │                  │  ║  │ ║  │                  │  ║│ │
│          │  │  ║  │  ┌──┐  ┌──┐     │  ║  │ ║  │  ┌──────┐       │  ║│ │
│          │  │  ║  │  │👤│  │👤│     │  ║  │ ║  │  │  👤  │       │  ║│ │
│          │  │  ║  │  └──┘  └──┘     │  ║  │ ║  │  └──────┘       │  ║│ │
│          │  │  ║  │  Nguyễn A ✅    │  ║  │ ║  │  Trần B ✅      │  ║│ │
│          │  │  ║  │  Trần B ✅      │  ║  │ ║  │  12:34:57       │  ║│ │
│          │  │  ║  └──────────────────┘  ║  │ ║  └──────────────────┘  ║│ │
│          │  │  ║  12:34:56 | FPS: 25    ║  │ ║  12:34:56 | FPS: 30   ║│ │
│          │  │  ║  Đã nhận diện: 2 người ║  │ ║  Đã nhận diện: 1 người║│ │
│          │  │  ╚════════════════════════╝  │ ╚════════════════════════╝│ │
│          │  │  [⏸ Tạm dừng] [⚙ Cài đặt]  │ [⏸ Tạm dừng] [⚙ Cài đặt]│ │
│          │  ├──────────────────────────────┼──────────────────────────┤ │
│          │  │  ╔════════════════════════╗  │ ╔════════════════════════╗│ │
│          │  │  ║  CAMERA C301           ║  │ ║  CAMERA D401           ║│ │
│          │  │  ║  🔴 Offline            ║  │ ║  🟡 Đang kết nối...    ║│ │
│          │  │  ║  ┌──────────────────┐  ║  │ ║  ┌──────────────────┐  ║│ │
│          │  │  ║  │  [NO SIGNAL]     │  ║  │ ║  │  [Đang tải...]   │  ║│ │
│          │  │  ║  │      📵          │  ║  │ ║  │      ⏳          │  ║│ │
│          │  │  ║  └──────────────────┘  ║  │ ║  └──────────────────┘  ║│ │
│          │  │  ╚════════════════════════╝  │ ╚════════════════════════╝│ │
│          │  │  [▶ Bật camera] [⚙]         │ [▶ Bật camera] [⚙]       │ │
│          │  └──────────────────────────────┴──────────────────────────┘ │
│          │                                                              │
│          │  HOẠT ĐỘNG NHẬN DIỆN GẦN ĐÂY (Realtime log)                │
│          │  ┌─────────────────────────────────────────────────────┐    │
│          │  │ 12:34:57  Camera A101  Nguyễn Văn A  ✅ Vào  0.97  │    │
│          │  │ 12:34:55  Camera B201  Trần Thị B    ✅ Vào  0.95  │    │
│          │  │ 12:34:52  Camera A101  UNKNOWN        ❌ Lỗi  0.43  │    │
│          │  │ 12:34:48  Camera A101  Lê Văn C      ✅ Ra   0.93  │    │
│          │  │ [Xem toàn bộ nhật ký →]                            │    │
│          │  └─────────────────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| CameraGrid | Grid Layout | Lưới 2×2 (hoặc 3×2) camera tiles |
| CameraFeedTile | Video Component | Feed video + AI overlay |
| FaceDetectionOverlay | Canvas Layer | Bounding box + tên người dùng |
| StatusIndicator | Live Badge | 🟢 Online / 🔴 Offline / 🟡 Pending |
| RecordingDot | Animated | Chấm đỏ nhấp nháy khi recording |
| ToggleCameraBtn | Button | Bật/Tắt camera |
| SettingsBtn | Icon Button | Cài đặt camera |
| ActivityLogPanel | Table | Log nhận diện realtime (scroll) |
| RecognitionRow | Row | Camera / Người / Trạng thái / Score |
| RefreshBtn | Button | Làm mới tất cả kết nối |

#### Luồng điều hướng
```
[SCR-08-020] Dashboard Live
    │
    ├── [⚙ Cài đặt camera]   ──▶  [SCR-08-003] Chi tiết camera
    ├── [▶ Bật camera]        ──▶  API bật camera, cập nhật live
    ├── [⏸ Tạm dừng]         ──▶  API tạm dừng stream
    └── [Xem toàn bộ nhật ký] ──▶  [SCR-08-031] Nhật ký phân tích camera
```

#### Business Rules
- Tự động kết nối tất cả camera Online khi mở màn hình
- FPS hiển thị realtime, cảnh báo nếu FPS < 10
- Nhận diện được overlay ngay trên frame với bounding box màu xanh (nhận diện được) hoặc đỏ (không nhận diện)
- Log hoạt động cuộn tự động, hiển thị tối đa 50 dòng gần nhất
- Confidence score < 0.7 → đánh dấu ❌ UNKNOWN

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/cameras/live-status
       → { cameras: [{ id, status, fps, stream_url }] }

GET    /api/v1/ai-attendance/recognition-log/realtime
       ?limit=50
       → WebSocket stream: { camera_id, user_id, user_name, type, score, timestamp }

POST   /api/v1/ai-attendance/cameras/{id}/toggle
       Body: { action: "start" | "stop" }
       → { status, message }
```

---

### SCR-08-021: Màn hình Pipeline AI – Trạng thái xử lý

#### Mô tả
Màn hình kỹ thuật hiển thị trạng thái chi tiết của các bước trong pipeline phân tích hình ảnh AI. Dành cho QTHT khi cần debug hoặc giám sát hiệu năng hệ thống.

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Pipeline AI  >  Trạng thái xử lý          │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  TRẠNG THÁI PIPELINE AI                   🔄 Tự động cập nhật│
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  LUỒNG XỬ LÝ (Processing Pipeline)                   │   │
│          │  │                                                      │   │
│          │  │  [📷 Camera]──▶[Capture Frame]──▶[Tiền xử lý]       │   │
│          │  │      ✅              ✅                ✅              │   │
│          │  │                                    │                 │   │
│          │  │                    ┌───────────────┤                 │   │
│          │  │                    ▼               ▼                 │   │
│          │  │             [Detect Khuôn mặt] [Detect Hình dáng]   │   │
│          │  │                    ✅                  ⚠️             │   │
│          │  │                    │                                 │   │
│          │  │                    ▼                                 │   │
│          │  │             [Embedding Vector]                       │   │
│          │  │                    ✅                                │   │
│          │  │                    │                                 │   │
│          │  │                    ▼                                 │   │
│          │  │             [So sánh CSDL]                           │   │
│          │  │                    ✅                                │   │
│          │  │                    │                                 │   │
│          │  │                    ▼                                 │   │
│          │  │             [Ghi nhận điểm danh]                     │   │
│          │  │                    ✅                                │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  TRẠNG THÁI MÔ HÌNH AI                                      │
│          │  ┌─────────────────────┬──────────────────────────────────┐ │
│          │  │ Mô hình             │ Trạng thái                       │ │
│          │  ├─────────────────────┼──────────────────────────────────┤ │
│          │  │ Face Detection      │ 🟢 Sẵn sàng   │ v2.1  │ RAM: 512MB│ │
│          │  │ Face Embedding      │ 🟢 Sẵn sàng   │ v1.8  │ RAM: 1.2GB│ │
│          │  │ Body Detection      │ ⚠️ Đang tải   │ v1.3  │ RAM: -    │ │
│          │  │ Body Embedding      │ 🔴 Không khả dụng│ -    │ -        │ │
│          │  └─────────────────────┴──────────────────────────────────┘ │
│          │                                                              │
│          │  HÀNG ĐỢI XỬ LÝ                                             │
│          │  Queue Camera: ████████░░  83 frames đang chờ               │
│          │  Queue Embedding: ██░░░░░░  12 faces đang chờ               │
│          │                                                              │
│          │  [Tải lại mô hình] [Xóa hàng đợi] [Xem log hệ thống]        │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/pipeline/status
       → { models: [...], queues: { camera_queue, embedding_queue }, pipeline_steps: [...] }

POST   /api/v1/ai-attendance/pipeline/reload-model
       Body: { model_name }
       → { success, message }

DELETE /api/v1/ai-attendance/pipeline/clear-queue
       → { cleared_count }
```

---

## Phần D: Báo cáo camera & phân tích dữ liệu

---

### SCR-08-030: Báo cáo vào theo địa điểm camera

#### Mô tả
Màn hình xem danh sách và thống kê dữ liệu người vào theo từng địa điểm camera. Hỗ trợ tìm kiếm, xác nhận tổng hợp và kết xuất Excel.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Báo cáo  >  Báo cáo Vào theo địa điểm    │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  BÁO CÁO VÀO THEO ĐỊA ĐIỂM CAMERA                          │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  ĐIỀU KIỆN TÌM KIẾM / LỌC                            │   │
│          │  │                                                      │   │
│          │  │  Địa điểm        Từ ngày          Đến ngày           │   │
│          │  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐  │   │
│          │  │  │[Tất cả ▾]   │ │ 2026-03-01   │ │ 2026-03-11   │  │   │
│          │  │  └─────────────┘ └──────────────┘ └──────────────┘  │   │
│          │  │  Camera           Đối tượng                          │   │
│          │  │  ┌─────────────┐ ┌──────────────────────────────┐  │   │
│          │  │  │[Tất cả ▾]   │ │[Học sinh / Giáo viên / Tất cả▾]│  │   │
│          │  │  └─────────────┘ └──────────────────────────────┘  │   │
│          │  │                              [Tìm kiếm] [Đặt lại]  │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  KẾT QUẢ:  Hiển thị: [20 ▾]    [✅ Xác nhận tổng hợp]     │
│          │            [⬇ Xuất Excel]                                   │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ THỐNG KÊ NHANH                                        │   │
│          │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │   │
│          │  │  │  Tổng lượt   │ │  Học sinh    │ │  Giáo viên  │ │   │
│          │  │  │   vào: 1,248 │ │  vào: 1,102  │ │  vào: 146   │ │   │
│          │  │  │  (hôm nay)   │ │              │ │             │ │   │
│          │  │  └──────────────┘ └──────────────┘ └──────────────┘ │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  ┌────┬──────────────┬────────────────┬──────────┬────────┐ │
│          │  │ #  │ Địa điểm     │ Camera         │ Thời gian│ Họ tên │ │
│          │  ├────┼──────────────┼────────────────┼──────────┼────────┤ │
│          │  │ 1  │ Cổng trường 1│ Camera A101    │ 07:05:12 │ Ng. A  │ │
│          │  │ 2  │ Cổng trường 1│ Camera A101    │ 07:05:38 │ Tr. B  │ │
│          │  │ 3  │ Cổng trường 2│ Camera A102    │ 07:06:14 │ Lê C   │ │
│          │  │ 4  │ Sân trường   │ Camera B201    │ 07:08:02 │ Ph. D  │ │
│          │  │ ...│ ...          │ ...            │ ...      │ ...    │ │
│          │  └────┴──────────────┴────────────────┴──────────┴────────┘ │
│          │                                                              │
│          │  ◀ Trước  [1] [2] ... [63]  Tiếp ▶    Tổng: 1,248 bản ghi │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| LocationFilter | Select | Chọn địa điểm/camera |
| DateRangePicker | Date inputs | Khoảng thời gian |
| CameraFilter | Select | Lọc theo camera cụ thể |
| SubjectFilter | Select | Học sinh / Giáo viên / Tất cả |
| SearchButton | Button | Áp dụng bộ lọc |
| ResetButton | Button | Reset bộ lọc |
| StatsSummary | Card row | Thống kê nhanh |
| ConfirmSynthBtn | Button (Success) | Xác nhận tổng hợp báo cáo |
| ExportButton | Button | Xuất Excel |
| DataTable | Table | Danh sách bản ghi vào |
| Pagination | Component | Phân trang |

#### Luồng điều hướng
```
[SCR-08-030] Báo cáo Vào
    │
    ├── [Tìm kiếm]           ──▶  Reload danh sách với filter
    ├── [Xác nhận tổng hợp]  ──▶  Modal xác nhận → API tổng hợp → Refresh
    ├── [Xuất Excel]          ──▶  Download file .xlsx
    └── Click vào tên         ──▶  [SCR-08-034] Chi tiết cá nhân
```

#### Business Rules / Validation
- Mặc định hiển thị dữ liệu ngày hôm nay
- Địa điểm lọc từ danh mục camera đang active
- Xác nhận tổng hợp: tổng hợp và đánh dấu đã xác nhận các bản ghi trong khoảng ngày đã chọn
- Chỉ bản ghi có confidence ≥ 0.7 mới hiển thị
- Kết xuất Excel theo dữ liệu hiển thị (đã lọc)

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/reports/entry-by-location
       ?location_id=&camera_id=&from=&to=&subject=&page=1&size=20
       → { data: [...], stats: { total, students, teachers }, total_records }

POST   /api/v1/ai-attendance/reports/entry-by-location/confirm
       Body: { from, to, location_id }
       → { confirmed_count }

GET    /api/v1/ai-attendance/reports/entry-by-location/export
       ?location_id=&camera_id=&from=&to=&subject=
       → file: entry_report.xlsx
```

---

### SCR-08-031: Báo cáo ra theo địa điểm camera

#### Mô tả
Màn hình xem dữ liệu người ra theo từng địa điểm camera.

> **Layout**: Tương tự SCR-08-030. Tiêu đề: "BÁO CÁO RA THEO ĐỊA ĐIỂM CAMERA". Cột trạng thái thay đổi thành "Ra". Thống kê nhanh hiển thị "Tổng lượt ra".

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/reports/exit-by-location
POST   /api/v1/ai-attendance/reports/exit-by-location/confirm
GET    /api/v1/ai-attendance/reports/exit-by-location/export
```

---

### SCR-08-032: Báo cáo tổng hợp vào/ra theo địa điểm

#### Mô tả
Màn hình tổng hợp cả lượt vào và ra theo từng địa điểm camera, hỗ trợ phân tích luồng người trong trường.

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Báo cáo  >  Tổng hợp Vào/Ra              │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  BÁO CÁO TỔNG HỢP VÀO/RA THEO ĐỊA ĐIỂM                    │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ Địa điểm [Tất cả ▾]  Từ [2026-03-01]  Đến [03-11]  │   │
│          │  │ Camera [Tất cả ▾]    Đối tượng [Tất cả ▾]           │   │
│          │  │                          [Tìm kiếm] [Đặt lại]       │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  [✅ Xác nhận tổng hợp]   [⬇ Xuất Excel]                   │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ BIỂU ĐỒ VÀO/RA THEO GIỜ (Hôm nay)                   │   │
│          │  │  Số lượng                                            │   │
│          │  │  │  █                                                │   │
│          │  │  │  ██ █                                             │   │
│          │  │  │ ████ ██   ████                                    │   │
│          │  │  │ ████ ████ ██████ █                                │   │
│          │  │  └────────────────────────────── Giờ                 │   │
│          │  │    6h  7h  8h  9h  10h 11h  12h 13h 14h ...         │   │
│          │  │  ■ Vào (xanh)  ■ Ra (cam)                            │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  ┌────┬──────────────┬──────────────┬────────┬───────────┐  │
│          │  │ #  │ Địa điểm     │ Camera       │ Loại  │ Thời gian │  │
│          │  ├────┼──────────────┼──────────────┼────────┼───────────┤  │
│          │  │ 1  │ Cổng trường  │ Camera A101  │ 🟢 Vào │ 07:05:12  │  │
│          │  │ 2  │ Cổng trường  │ Camera A101  │ 🔴 Ra  │ 07:06:20  │  │
│          │  │ 3  │ Sân trường   │ Camera B201  │ 🟢 Vào │ 07:08:02  │  │
│          │  │ ...│ ...          │ ...          │ ...    │ ...       │  │
│          │  └────┴──────────────┴──────────────┴────────┴───────────┘  │
│          │                                                              │
│          │  ◀ Trước  [1] [2] ... Tiếp ▶        Tổng: 2,496 bản ghi   │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| FilterPanel | Form | Lọc địa điểm/camera/ngày/đối tượng |
| HourlyBarChart | Chart (Bar) | Biểu đồ vào/ra theo giờ |
| ChartLegend | Legend | Màu vào / màu ra |
| ConfirmSynthBtn | Button | Xác nhận tổng hợp |
| ExportButton | Button | Xuất Excel |
| DataTable | Table | Bảng dữ liệu vào/ra |
| TypeBadge | Badge | 🟢 Vào / 🔴 Ra |
| Pagination | Component | Phân trang |

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/reports/entry-exit-by-location
       ?location_id=&camera_id=&from=&to=&subject=&page=1&size=20
       → { data: [...], chart_data: [{ hour, entry, exit }], total }

POST   /api/v1/ai-attendance/reports/entry-exit-by-location/confirm
GET    /api/v1/ai-attendance/reports/entry-exit-by-location/export
```

---

### SCR-08-033: Nhật ký phân tích camera

#### Mô tả
Màn hình xem chi tiết log phân tích từ camera: từng khung hình được phân tích, kết quả nhận diện, confidence score, ảnh snapshot. Dùng để kiểm tra, đối chiếu và tổng hợp báo cáo.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Báo cáo  >  Nhật ký phân tích camera      │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  NHẬT KÝ PHÂN TÍCH CAMERA                                   │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ Camera [CAM A101 ▾]  Từ [2026-03-11]  Đến [03-11]   │   │
│          │  │ Trạng thái [Tất cả ▾]  Confidence từ [0.0] đến [1.0]│   │
│          │  │ Người dùng [Tất kiếm...              ]               │   │
│          │  │                          [Tìm kiếm] [Đặt lại]       │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  [✅ Tổng hợp báo cáo]   [⬇ Xuất Excel]                    │
│          │                                                              │
│          │  ┌────┬────────────┬──────────────┬────────┬────────┬─────┐ │
│          │  │ #  │ Thời gian  │ Camera       │ Người  │ Loại  │Score│ │
│          │  ├────┼────────────┼──────────────┼────────┼────────┼─────┤ │
│          │  │ 1  │ 07:05:12   │ Camera A101  │ Ng.A   │ 🟢 Vào │0.97 │ │
│          │  │    │ [🖼 Xem ảnh]│              │        │        │     │ │
│          │  ├────┼────────────┼──────────────┼────────┼────────┼─────┤ │
│          │  │ 2  │ 07:05:38   │ Camera A101  │ Tr.B   │ 🟢 Vào │0.95 │ │
│          │  │    │ [🖼 Xem ảnh]│              │        │        │     │ │
│          │  ├────┼────────────┼──────────────┼────────┼────────┼─────┤ │
│          │  │ 3  │ 07:06:44   │ Camera A101  │UNKNOWN │ ❌ Lỗi │0.43 │ │
│          │  │    │ [🖼 Xem ảnh]│              │        │        │     │ │
│          │  └────┴────────────┴──────────────┴────────┴────────┴─────┘ │
│          │                                                              │
│          │  ◀ Trước  [1] [2] ... Tiếp ▶          Tổng: 3,847 bản ghi │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Modal Xem ảnh snapshot

```
         ┌──────────────────────────────────────────────────┐
         │  📸 SNAPSHOT – Camera A101  07:05:12             │
         │                                                  │
         │  ┌────────────────────────────────────────────┐  │
         │  │                                            │  │
         │  │         [ ẢNH TOÀN CẢNH TỪ CAMERA ]       │  │
         │  │                                            │  │
         │  │    ┌───────┐   Khuôn mặt nhận diện:       │  │
         │  │    │  👤   │   Nguyễn Văn A                │  │
         │  │    │ ─────── │   Confidence: 0.97          │  │
         │  │    └───────┘   Loại: Vào                   │  │
         │  │                                            │  │
         │  └────────────────────────────────────────────┘  │
         │                                                  │
         │  ┌─────────┐  ┌─────────────────────────────┐   │
         │  │[CROP 👤]│  │ Mã HS: HS-10001             │   │
         │  │         │  │ Lớp:  10A1                  │   │
         │  │  crop   │  │ Thời gian: 2026-03-11 07:05 │   │
         │  └─────────┘  └─────────────────────────────┘   │
         │                                      [Đóng]     │
         └──────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| FilterPanel | Form | Camera / Ngày / Trạng thái / Score range / Người |
| ConfirmBtn | Button (Success) | Tổng hợp báo cáo từ log |
| ExportButton | Button | Xuất Excel |
| LogTable | Table | Danh sách nhật ký chi tiết |
| SnapshotBtn | Icon Button | Mở modal xem ảnh |
| SnapshotModal | Modal | Hiển thị ảnh toàn cảnh + crop khuôn mặt |
| ConfidenceBar | Progress bar | Hiển thị score trực quan |
| TypeBadge | Badge | 🟢 Vào / 🔴 Ra / ❌ Lỗi |

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/logs/camera
       ?camera_id=&from=&to=&status=&min_score=&max_score=&user_id=&page=1&size=20
       → { data: [{ id, timestamp, camera_id, user_id, type, score, snapshot_url, crop_url }] }

GET    /api/v1/ai-attendance/logs/camera/{log_id}/snapshot
       → { full_image_url, crop_url, metadata }

POST   /api/v1/ai-attendance/logs/camera/aggregate
       Body: { camera_id, from, to }
       → { aggregated_count }

GET    /api/v1/ai-attendance/logs/camera/export
```

---

### SCR-08-034: Nhật ký phân tích máy điểm danh

#### Mô tả
Tương tự SCR-08-033 nhưng dữ liệu từ các thiết bị IoT máy điểm danh thay vì camera.

> **Layout**: Tương tự SCR-08-033. Bộ lọc "Camera" đổi thành "Máy điểm danh". Tiêu đề: "NHẬT KÝ PHÂN TÍCH MÁY ĐIỂM DANH". Cột thêm: "Firmware version", "Kiểu kết nối".

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/logs/device
GET    /api/v1/ai-attendance/logs/device/{log_id}/snapshot
POST   /api/v1/ai-attendance/logs/device/aggregate
GET    /api/v1/ai-attendance/logs/device/export
```

---

### SCR-08-035: Dữ liệu phân tích theo camera

#### Mô tả
Màn hình phân tích tổng hợp dữ liệu điểm danh theo từng camera, cung cấp thống kê chi tiết với biểu đồ và bảng dữ liệu. Hỗ trợ xem chi tiết, tìm kiếm, sắp xếp, phân trang, kết xuất Excel.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Phân tích  >  Dữ liệu theo camera         │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  DỮ LIỆU PHÂN TÍCH THEO CAMERA                              │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ 🔍 Tìm theo tên camera...          [Tìm kiếm]        │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │  Sắp xếp: [Tên camera A-Z ▾]  Hiển thị: [20 ▾] / trang    │
│          │  Ngày: [2026-03-11]                    [⬇ Xuất Excel]       │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ TỔNG QUAN HÔM NAY                                     │   │
│          │  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐│   │
│          │  │  │ Tổng camera │ │ Tổng lượt  │ │ Tỷ lệ nhận diện   ││   │
│          │  │  │  Active: 8  │ │ phân tích  │ │ thành công        ││   │
│          │  │  │  Offline: 2 │ │  5,842     │ │    94.2%          ││   │
│          │  │  └────────────┘ └────────────┘ └────────────────────┘│   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  ┌────┬──────────────┬───────────┬─────────┬──────────────┐ │
│          │  │ #  │ Tên camera   │ Vị trí    │ Phân tích│ Tỷ lệ thành │ │
│          │  │    │              │           │ hôm nay  │ công        │ │
│          │  ├────┼──────────────┼───────────┼──────────┼──────────────┤ │
│          │  │ 1  │ Camera A101  │ Cổng 1    │ 1,248    │ ████░  96%  │ │
│          │  │    │ [Xem chi tiết] [⬇ Xuất]                           │ │
│          │  ├────┼──────────────┼───────────┼──────────┼──────────────┤ │
│          │  │ 2  │ Camera B201  │ Sân TH    │ 987      │ ████░  93%  │ │
│          │  │    │ [Xem chi tiết] [⬇ Xuất]                           │ │
│          │  ├────┼──────────────┼───────────┼──────────┼──────────────┤ │
│          │  │ 3  │ Camera C301  │ Hội trường│ 0        │ ──  Offline │ │
│          │  │    │ [Xem chi tiết] [⬇ Xuất]                           │ │
│          │  └────┴──────────────┴───────────┴──────────┴──────────────┘ │
│          │                                                              │
│          │  ◀ Trước  [1] [2] [3]  Tiếp ▶           Tổng: 10 cameras  │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Luồng điều hướng
```
[SCR-08-035] Dữ liệu phân tích Camera
    │
    ├── [Xem chi tiết]  ──▶  [SCR-08-036] Chi tiết phân tích 1 camera
    └── [Xuất Excel]    ──▶  Download từng camera hoặc tất cả
```

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/analytics/cameras
       ?search=&sort=name_asc&date=2026-03-11&page=1&size=20
       → { data: [{ camera_id, name, location, analysis_count, success_rate }], summary }

GET    /api/v1/ai-attendance/analytics/cameras/export
```

---

### SCR-08-036: Chi tiết dữ liệu phân tích một camera

#### Mô tả
Xem toàn bộ dữ liệu phân tích chi tiết của một camera cụ thể, bao gồm biểu đồ theo giờ/ngày, danh sách nhận diện và thống kê.

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Phân tích  >  Camera  >  A101 Chi tiết    │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  ◀ Quay lại    CHI TIẾT PHÂN TÍCH – CAMERA A101             │
│          │                                                              │
│          │  Khoảng thời gian: [2026-03-01] đến [2026-03-11]  [Áp dụng] │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ BIỂU ĐỒ PHÂN TÍCH THEO NGÀY                          │   │
│          │  │  Số lượt                                             │   │
│          │  │ 1500│                  ██                            │   │
│          │  │ 1200│        ██  ██  ████  ██                        │   │
│          │  │  900│  ██  ████████████████████  ██                  │   │
│          │  │  600│ ████████████████████████████                   │   │
│          │  │  300│─────────────────────────────── Ngày            │   │
│          │  │     01  02  03  04  05  06  07  08  09  10  11       │   │
│          │  │  ■ Nhận diện thành công  ■ Nhận diện thất bại        │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  ┌─────────────────┬─────────────────┬───────────────────┐  │
│          │  │  Tổng phân tích │  Thành công     │  Thất bại         │  │
│          │  │    12,483       │  11,734 (94%)   │  749 (6%)         │  │
│          │  ├─────────────────┼─────────────────┼───────────────────┤  │
│          │  │  Lượt vào       │  Lượt ra        │  Avg. Score       │  │
│          │  │    7,218        │   4,516         │    0.94           │  │
│          │  └─────────────────┴─────────────────┴───────────────────┘  │
│          │                                                              │
│          │  TOP 5 NGƯỜI DÙNG THƯỜNG XUYÊN NHẤT                         │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │ 1. Nguyễn Văn A (10A1)  ─────────────────  423 lượt │   │
│          │  │ 2. Trần Thị B   (10A2)  ──────────────    387 lượt  │   │
│          │  │ 3. Lê Văn C     (GV)    ─────────────     312 lượt  │   │
│          │  │ 4. Phạm Thị D   (11B1)  ────────────      298 lượt  │   │
│          │  │ 5. Hoàng Văn E  (10B3)  ───────────       276 lượt  │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  [Xem nhật ký chi tiết →]          [⬇ Xuất báo cáo Excel]  │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| DateRangePicker | Date inputs | Chọn khoảng thời gian phân tích |
| DailyBarChart | Chart (Bar) | Biểu đồ theo ngày (thành công/thất bại) |
| StatsGrid | Stats Cards | 6 KPI cards |
| TopUsersChart | Horizontal Bar | Top 5 người dùng |
| ViewLogsLink | Link | Điều hướng tới nhật ký chi tiết |
| ExportBtn | Button | Xuất báo cáo Excel |

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/analytics/cameras/{id}
       ?from=2026-03-01&to=2026-03-11
       → { stats: { total, success, fail, entry, exit, avg_score },
           chart_daily: [{ date, success, fail }],
           top_users: [{ user_id, name, class, count }] }

GET    /api/v1/ai-attendance/analytics/cameras/{id}/export
       ?from=&to=
```

---

### SCR-08-037: Dữ liệu phân tích theo máy điểm danh

#### Mô tả
Tương tự SCR-08-035 nhưng dành cho máy điểm danh IoT.

> **Layout**: Giống SCR-08-035. Tiêu đề: "DỮ LIỆU PHÂN TÍCH THEO MÁY ĐIỂM DANH". Cột "Vị trí" hiển thị phòng học, tầng.

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/analytics/devices
GET    /api/v1/ai-attendance/analytics/devices/{id}
GET    /api/v1/ai-attendance/analytics/devices/export
```

---

### SCR-08-038: Chia sẻ dữ liệu điểm danh với Hue-S

#### Mô tả
Màn hình quản lý việc chia sẻ dữ liệu điểm danh học sinh với hệ thống Hue-S qua API. QTHT có thể xem lịch sử chia sẻ, trigger chia sẻ thủ công và kiểm tra trạng thái kết nối.

#### Actors
- QTHT

#### Layout ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ≡  HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC            👤 Admin ▾   🔔   [Đăng xuất] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │  AI Điểm danh  >  Chia sẻ dữ liệu  >  Hue-S Integration    │
│  MENU    ├──────────────────────────────────────────────────────────────┤
│          │                                                              │
│          │  CHIA SẺ DỮ LIỆU ĐIỂM DANH VỚI HUE-S                      │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  TRẠNG THÁI KẾT NỐI HUE-S                            │   │
│          │  │                                                      │   │
│          │  │  API Endpoint: https://api.hue-s.vn/attendance/...  │   │
│          │  │  Trạng thái: 🟢 Kết nối thành công                   │   │
│          │  │  Lần đồng bộ cuối: 2026-03-11 06:00:00               │   │
│          │  │  Tự động đồng bộ: ✅ Bật (mỗi ngày lúc 06:00)        │   │
│          │  │                                                      │   │
│          │  │  [🔗 Kiểm tra kết nối]   [⚙ Cấu hình API]            │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  ┌──────────────────────────────────────────────────────┐   │
│          │  │  CHIA SẺ THỦ CÔNG                                     │   │
│          │  │                                                      │   │
│          │  │  Khoảng ngày:  [2026-03-10]  đến  [2026-03-11]       │   │
│          │  │  Lớp:          [Tất cả ▾]                            │   │
│          │  │  Loại dữ liệu: ☑ Vào  ☑ Ra  ☑ Điểm danh tổng hợp   │   │
│          │  │                                                      │   │
│          │  │  Số bản ghi cần gửi: 2,496                           │   │
│          │  │                                                      │   │
│          │  │  [📤 Gửi ngay đến Hue-S]                              │   │
│          │  └──────────────────────────────────────────────────────┘   │
│          │                                                              │
│          │  LỊCH SỬ CHIA SẺ DỮ LIỆU                                   │
│          │  ┌────┬─────────────────┬──────────────┬────────┬────────┐  │
│          │  │ #  │ Thời gian gửi   │ Khoảng ngày  │ Số bản │ Kết   │  │
│          │  │    │                 │              │ ghi    │ quả   │  │
│          │  ├────┼─────────────────┼──────────────┼────────┼────────┤  │
│          │  │ 1  │ 2026-03-11 06:00│ 03-10~03-10  │ 2,387  │ ✅ OK  │  │
│          │  │ 2  │ 2026-03-10 06:00│ 03-09~03-09  │ 2,412  │ ✅ OK  │  │
│          │  │ 3  │ 2026-03-09 06:00│ 03-08~03-08  │ 2,298  │ ❌ Lỗi │  │
│          │  │    │   [🔄 Gửi lại]  │              │        │        │  │
│          │  └────┴─────────────────┴──────────────┴────────┴────────┘  │
│          │                                                              │
│          │  ◀ Trước  [1] [2]  Tiếp ▶              Tổng: 45 lần gửi   │
└──────────┴──────────────────────────────────────────────────────────────┘
```

#### Danh sách components
| Component | Loại | Mô tả |
|-----------|------|-------|
| ConnectionStatus | Status Card | Trạng thái kết nối Hue-S |
| TestConnectionBtn | Button | Kiểm tra API endpoint |
| ConfigBtn | Button | Cấu hình API key, endpoint |
| ManualShareForm | Form | Chọn ngày / lớp / loại dữ liệu |
| RecordCountPreview | Text | Số bản ghi preview trước khi gửi |
| SendButton | Button (Primary) | Gửi dữ liệu ngay |
| ShareHistoryTable | Table | Lịch sử chia sẻ |
| RetryBtn | Button | Gửi lại lần thất bại |
| ResultBadge | Badge | ✅ OK / ❌ Lỗi |

#### Business Rules
- Tự động chia sẻ hàng ngày theo lịch cấu hình sẵn
- Cho phép trigger thủ công bất kỳ lúc nào
- Nếu gửi thất bại: ghi log lỗi và cho phép gửi lại
- Dữ liệu gửi đi phải đã qua bước "Xác nhận tổng hợp" từ báo cáo
- Ghi log đầy đủ: thời gian, khoảng ngày, số bản ghi, response code Hue-S

#### API Endpoints gợi ý
```
GET    /api/v1/ai-attendance/hue-s/status
       → { endpoint, status, last_sync, auto_sync_enabled }

POST   /api/v1/ai-attendance/hue-s/test-connection
       → { success, response_time_ms }

POST   /api/v1/ai-attendance/hue-s/share
       Body: { from, to, class_ids, types: ["entry", "exit", "summary"] }
       → { job_id, record_count, status }

GET    /api/v1/ai-attendance/hue-s/history
       ?page=1&size=20
       → { data: [{ id, sent_at, date_range, record_count, status, error_message }] }

POST   /api/v1/ai-attendance/hue-s/retry/{history_id}
       → { status }
```

---

## Sơ đồ luồng điều hướng tổng thể

```
                        ┌─────────────────┐
                        │  Menu AI Điểm   │
                        │     danh        │
                        └────────┬────────┘
              ┌──────────────────┼──────────────────────────┐
              ▼                  ▼                           ▼
   ┌──────────────────┐  ┌───────────────────┐   ┌──────────────────────┐
   │  A. Tài khoản    │  │  B. Khuôn mặt     │   │  C. Giám sát Live    │
   │  & Thiết bị      │  │  điểm danh        │   │  Camera              │
   └──────────────────┘  └───────────────────┘   └──────────────────────┘
   SCR-08-001 (Camera)   SCR-08-010 (DS)          SCR-08-020 (Dashboard)
   SCR-08-002 (Add)      SCR-08-011 (Add)         SCR-08-021 (Pipeline)
   SCR-08-003 (Detail)   SCR-08-012 (Edit)
   SCR-08-004 (Edit)     SCR-08-013 (Delete)
   SCR-08-005 (Delete)
   SCR-08-006 (Máy DD)
   SCR-08-007 (Add)
   SCR-08-008 (Edit)
   SCR-08-009 (Delete)

              ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │  D. Báo cáo & Phân tích                                              │
   ├────────────────────────┬──────────────────────┬─────────────────────┤
   │ Báo cáo Camera         │ Phân tích            │ Hue-S               │
   │ SCR-08-030 (Vào)       │ SCR-08-035 (Camera)  │ SCR-08-038          │
   │ SCR-08-031 (Ra)        │ SCR-08-036 (Detail)  │                     │
   │ SCR-08-032 (Vào/Ra)    │ SCR-08-037 (Máy DD)  │                     │
   │ SCR-08-033 (Log Camera)│                      │                     │
   │ SCR-08-034 (Log Máy DD)│                      │                     │
   └────────────────────────┴──────────────────────┴─────────────────────┘
```

---

## Bảng tổng hợp màn hình

| Mã màn hình | Tên màn hình | Phần | Actors |
|-------------|--------------|------|--------|
| SCR-08-001 | Danh sách tài khoản camera | A | QTHT |
| SCR-08-002 | Form thêm mới camera | A | QTHT |
| SCR-08-003 | Chi tiết camera + live preview | A | QTHT |
| SCR-08-004 | Form chỉnh sửa camera | A | QTHT |
| SCR-08-005 | Modal xác nhận xóa camera | A | QTHT |
| SCR-08-006 | Danh sách máy điểm danh | A | QTHT |
| SCR-08-007 | Form thêm mới máy điểm danh | A | QTHT |
| SCR-08-008 | Form chỉnh sửa máy điểm danh | A | QTHT |
| SCR-08-009 | Modal xác nhận xóa máy điểm danh | A | QTHT |
| SCR-08-010 | Danh sách khuôn mặt (Gallery + Table) | B | QTHT |
| SCR-08-011 | Form thêm mới khuôn mặt (AI detect) | B | QTHT |
| SCR-08-012 | Form chỉnh sửa khuôn mặt | B | QTHT |
| SCR-08-013 | Modal xác nhận xóa khuôn mặt | B | QTHT |
| SCR-08-020 | Dashboard live camera + AI overlay | C | QTHT, HT |
| SCR-08-021 | Trạng thái pipeline AI | C | QTHT |
| SCR-08-030 | Báo cáo vào theo địa điểm | D | QTHT |
| SCR-08-031 | Báo cáo ra theo địa điểm | D | QTHT |
| SCR-08-032 | Báo cáo tổng hợp vào/ra + chart | D | QTHT |
| SCR-08-033 | Nhật ký phân tích camera (log + snapshot) | D | QTHT |
| SCR-08-034 | Nhật ký phân tích máy điểm danh | D | QTHT |
| SCR-08-035 | Dữ liệu phân tích theo camera | D | QTHT |
| SCR-08-036 | Chi tiết phân tích một camera + chart | D | QTHT |
| SCR-08-037 | Dữ liệu phân tích theo máy điểm danh | D | QTHT |
| SCR-08-038 | Chia sẻ dữ liệu điểm danh với Hue-S | D | QTHT |

---

## Ghi chú thiết kế

### Nguyên tắc UX

1. **Realtime feedback**: Các màn hình liên quan đến camera cần cập nhật trạng thái live, dùng WebSocket hoặc polling mỗi 30 giây.
2. **AI transparency**: Luôn hiển thị confidence score để người dùng hiểu độ chính xác nhận diện.
3. **Progressive disclosure**: Pipeline AI phức tạp (SCR-08-021) chỉ hiển thị với admin nâng cao.
4. **Error recovery**: Mọi tác vụ AI thất bại đều có nút thử lại rõ ràng.
5. **Gallery + Table toggle**: Màn hình khuôn mặt (SCR-08-010) cần hỗ trợ cả hai chế độ xem để linh hoạt.

### Màu sắc trạng thái
| Trạng thái | Màu | Ý nghĩa |
|------------|-----|---------|
| 🟢 Online / Thành công | Xanh lá (#22C55E) | Hoạt động bình thường |
| 🔴 Offline / Lỗi | Đỏ (#EF4444) | Cần xử lý |
| 🟡 Pending / Đang tải | Vàng (#EAB308) | Đang chờ |
| ✅ Đã nhận diện | Xanh dương (#3B82F6) | Xác nhận thành công |
| ❌ Không nhận diện | Đỏ nhạt (#FCA5A5) | Thất bại |

### Responsive
- Desktop (≥1280px): Layout đầy đủ, camera grid 2×2 hoặc 3×2
- Tablet (768–1279px): Camera grid 2×1, sidebar thu gọn
- Mobile: Không hỗ trợ màn hình live camera (chỉ xem báo cáo và danh sách)
