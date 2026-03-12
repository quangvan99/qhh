---
title: "Phase 6 — AI Điểm danh"
phase: 6
agent: "Agent E"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-08-001..005
  - SCR-08-010..011
  - SCR-08-020..023
  - SCR-08-030..031
  - SCR-08-040..041
  - SCR-08-050..051
wireframes: ["WF-08"]
estimated_days: "4–5 ngày"
---

# Phase 6 — AI Điểm danh

> Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.

## Phạm vi files

```
src/
├── app/(dashboard)/
│   └── ai-attendance/
│       ├── cameras/
│       │   ├── page.tsx                   # SCR-08-001 (danh sách)
│       │   ├── new/page.tsx               # SCR-08-002 (form thêm)
│       │   └── [cameraId]/
│       │       ├── page.tsx               # SCR-08-003 (chi tiết)
│       │       └── edit/page.tsx          # SCR-08-004 (form sửa)
│       ├── devices/
│       │   ├── page.tsx                   # SCR-08-010 (danh sách)
│       │   └── [deviceId]/
│       │       └── edit/page.tsx          # SCR-08-011
│       ├── faces/
│       │   ├── page.tsx                   # SCR-08-020 (danh sách HS)
│       │   └── [studentId]/
│       │       └── page.tsx               # SCR-08-021 (chi tiết khuôn mặt)
│       ├── monitor/
│       │   ├── page.tsx                   # SCR-08-030 (nhật ký camera)
│       │   └── devices/page.tsx           # SCR-08-031 (nhật ký máy ĐD)
│       ├── reports/
│       │   ├── page.tsx                   # SCR-08-040 (báo cáo vào/ra)
│       │   └── [locationId]/page.tsx      # SCR-08-041 (chi tiết 1 địa điểm)
│       └── analytics/
│           └── page.tsx                   # SCR-08-050..051
└── features/
    └── ai-attendance/
        ├── components/
        │   ├── CameraCard.tsx
        │   ├── CameraForm.tsx
        │   ├── CameraDetail.tsx
        │   ├── DeviceCard.tsx
        │   ├── DeviceForm.tsx
        │   ├── FaceStudentList.tsx
        │   ├── FaceGallery.tsx
        │   ├── FaceUploadModal.tsx
        │   ├── BatchApproveModal.tsx
        │   ├── AttendanceLogTable.tsx
        │   ├── AttendanceLogLive.tsx      # SSE/polling live
        │   ├── AttendanceReportFilter.tsx
        │   ├── AttendanceChart.tsx
        │   ├── AnalyticsDashboard.tsx
        │   └── HeatmapChart.tsx
        ├── hooks/
        │   ├── useCameras.ts
        │   ├── useDevices.ts
        │   ├── useFaces.ts
        │   ├── useAttendanceLogs.ts
        │   ├── useAttendanceReports.ts
        │   └── useAnalytics.ts
        ├── api/
        │   └── ai-attendance.api.ts
        └── types/
            └── ai-attendance.types.ts
```

---

## TASK E-1: Quản lý Camera (WF-08-001..005)

### SCR-08-001 — Danh sách tài khoản camera

**Route:** `app/(dashboard)/ai-attendance/cameras/page.tsx`

**Layout:**
```
[PageHeader: "Quản lý Camera"]
  Actions: [+ Thêm camera] [Làm mới trạng thái]

[FilterBar]
  - Select: Trạng thái (Tất cả | Online | Offline | Lỗi)
  - Select: Địa điểm (dropdown phân cấp)
  - SearchBar: Tên camera / IP

[StatGrid cols=3]
  [Online: {n}] [Offline: {n}] [Cảnh báo: {n}]

[DataTable — auto-refresh 30s]
  Columns:
    - Tên camera
    - Địa điểm
    - IP / RTSP URL
    - Loại kết nối (badge: RTSP | HTTP | SDK)
    - Trạng thái (badge: Online=green | Offline=red | Pending=yellow | Lỗi=red)
    - Lần cuối online (relative time)
    - FPS hiện tại
    - Actions: [Chi tiết] [Sửa] [Xóa]
```

**Auto-refresh:** `useInterval(refetch, 30000)` — polling trạng thái

**API:**
- `GET /api/ai/cameras?status={}&location={}&q={}`
- `DELETE /api/ai/cameras/{id}`

**Deliverables:**
- [ ] DataTable với auto-refresh 30s
- [ ] Status badge đúng màu
- [ ] Filter hoạt động
- [ ] Delete dialog

---

### SCR-08-002 — Form thêm camera

**Route:** `app/(dashboard)/ai-attendance/cameras/new/page.tsx`

**Layout:**
```
[PageHeader: "Thêm camera mới"]
  Actions: [Hủy] [Lưu]

[Card: Thông tin cơ bản]
  [FormField: Tên camera*]
  [FormField: Mã thiết bị*]
  [FormField: Địa điểm*]      tree-select (tòa nhà > tầng > phòng)
  [FormField: Mô tả]

[Card: Cài đặt kết nối]
  [FormField: Loại kết nối*]   Radio: RTSP | HTTP | SDK
  [Nếu RTSP:]
    [FormField: RTSP URL*]    AppInput (rtsp://...)
    [FormField: Username]
    [FormField: Password (masked)]
  [Nếu HTTP:]
    [FormField: HTTP URL*]
    [FormField: API Key]
  [Nếu SDK:]
    [FormField: SDK Type]     Select (Hikvision | Dahua | ...)
    [FormField: Host*]
    [FormField: Port*]
    [FormField: Username / Password]

[Card: Cài đặt nhận diện]
  [FormField: Ngưỡng tin cậy (%)] Slider 50–100, default 80
  [FormField: FPS xử lý]    Select: 1 | 5 | 10 | 15 | 30
  [FormField: Hướng điểm danh] Radio: Vào | Ra | Cả hai

[Button: Test kết nối]
  → gọi POST /api/ai/cameras/test-connection
  → hiển thị: ✓ Kết nối thành công | ✗ Lỗi: message
  → Nếu OK: hiển thị live thumbnail 3s

[Actions footer: [Hủy] [Lưu camera]]
```

**Validation:**
```typescript
const cameraSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  locationId: z.string(),
  connectionType: z.enum(['rtsp','http','sdk']),
  // RTSP
  rtspUrl: z.string().url().optional(),
  // HTTP
  httpUrl: z.string().url().optional(),
  // Common
  username: z.string().optional(),
  password: z.string().optional(),
  confidenceThreshold: z.number().min(50).max(100),
  fps: z.number(),
  direction: z.enum(['in','out','both']),
})
```

**Deliverables:**
- [ ] Form validate theo loại kết nối (dynamic required fields)
- [ ] Test kết nối hiển thị inline result
- [ ] Thumbnail preview khi test thành công
- [ ] Save redirect danh sách

---

### SCR-08-003 — Chi tiết camera

**Route:** `app/(dashboard)/ai-attendance/cameras/[cameraId]/page.tsx`

**Layout:**
```
[PageHeader: "[Tên camera]"]
  Breadcrumbs: AI Điểm danh > Camera > [Tên]
  Actions: [✏️ Sửa] [🗑 Xóa] [🔄 Khởi động lại]

[Grid 2 cols]
Left:
  [Card: Thông tin]
    Địa điểm | IP | Loại kết nối | FPS | Ngưỡng tin cậy
    Ngày thêm | Người thêm
    [Status badge lớn: ONLINE/OFFLINE]

  [Card: Thống kê hôm nay]
    Tổng lượt nhận diện | Nhận diện thành công | Thất bại | Uptime%

Right:
  [Card: Live thumbnail]
    [img với auto-refresh 5s hoặc MJPEG stream]
    [Badge: Live | Offline]
    [Nút: Xem fullscreen]

[Card: Nhật ký gần đây (5 entries)]
  DataTable lite + "Xem tất cả →" link
```

**Deliverables:**
- [ ] Auto-refresh thumbnail
- [ ] Status hiển thị real-time
- [ ] Restart action (với confirm)
- [ ] Link tới nhật ký

---

### SCR-08-004 — Form chỉnh sửa camera

Giống SCR-08-002 nhưng pre-fill + `PUT /api/ai/cameras/{id}`

### SCR-08-005 — Dialog xóa camera

`ConfirmDialog` với text: "Xóa camera [Tên]? Tất cả nhật ký liên quan sẽ bị giữ lại nhưng camera không còn hoạt động."

---

## TASK E-2: Quản lý máy điểm danh (WF-08-010..011)

### SCR-08-010 — Danh sách máy điểm danh

**Route:** `app/(dashboard)/ai-attendance/devices/page.tsx`

**Layout:** Tương tự SCR-08-001 nhưng cho IoT devices

**DataTable columns:**
- Tên máy | Mã thiết bị | Địa điểm | Loại (Turnstile/Camera pod/...) | Trạng thái | MAC address | Firmware version | Actions

---

### SCR-08-011 — Form thêm/sửa máy điểm danh

```
[Card: Thông tin cơ bản]
  Tên | Mã | Địa điểm (tree-select) | Loại thiết bị

[Card: Kết nối]
  IP Address | Port | Protocol (HTTP/MQTT) | API Key

[Card: Cấu hình]
  Hướng điểm danh | Ngưỡng tin cậy | Mode (nhận diện/PIN/cả hai)

[Test kết nối button]
```

---

## TASK E-3: Quản lý khuôn mặt (WF-08-020..023)

### SCR-08-020 — Danh sách học sinh – quản lý khuôn mặt

**Route:** `app/(dashboard)/ai-attendance/faces/page.tsx`

**Layout:**
```
[PageHeader: "Quản lý khuôn mặt học sinh"]
  Actions: [Upload ảnh hàng loạt] [Duyệt hàng loạt]

[FilterBar]
  - Select: Lớp (searchable)
  - Select: Trạng thái khuôn mặt (Tất cả | Chưa ĐK | Đã ĐK | Chờ duyệt | Lỗi)
  - SearchBar: Tên HS / Mã HS

[StatGrid cols=4]
  [Tổng HS] [Đã đăng ký KM] [Chờ duyệt] [Chưa đăng ký]

[DataTable columns:]
  - Avatar (nếu có ảnh khuôn mặt) + Tên HS
  - Mã HS
  - Lớp
  - Số ảnh đã upload
  - Trạng thái embedding (badge: Đã xử lý | Đang xử lý | Chờ duyệt | Lỗi | Chưa ĐK)
  - Ngày cập nhật
  - Actions: [Xem & Upload ảnh] [Duyệt (nếu chờ)] [Xóa ảnh]
```

---

### SCR-08-021 — Chi tiết khuôn mặt học sinh

**Route:** `app/(dashboard)/ai-attendance/faces/[studentId]/page.tsx`

**Layout:**
```
[PageHeader: "[Tên HS] — Khuôn mặt"]
  Breadcrumbs: AI ĐD > Khuôn mặt > [Tên HS]
  Actions: [Upload thêm ảnh] [Xóa tất cả ảnh] [Duyệt]

[Card: Thông tin HS]
  Avatar | Tên | Mã | Lớp | Embedding status badge

[Card: Thư viện ảnh khuôn mặt]
  [Grid ảnh (responsive 4 cols):]
    Mỗi ảnh:
      [img - square, object-cover]
      [Overlay khi hover: Xóa ảnh icon]
      [Badge góc: ✓ Duyệt | ⏳ Chờ | ✗ Lỗi]
      [Quality score badge (nếu có)]

  [Khi không có ảnh: EmptyState]

[Card: Trạng thái xử lý]
  Ngày upload | Ngày xử lý | Kết quả embedding
  [Nếu lỗi: thông báo lỗi chi tiết + nút thử lại]
```

**Deliverables:**
- [ ] Grid ảnh responsive
- [ ] Hover overlay xóa ảnh
- [ ] Upload từ trang chi tiết
- [ ] Status badge đúng

---

### SCR-08-022 — Upload ảnh khuôn mặt

**Component:** `FaceUploadModal.tsx`

**Layout (Dialog rộng):**
```
[Dialog: "Upload ảnh khuôn mặt" width=lg]
  [Nếu single HS: "HS: [Tên] — [Lớp]"]
  [Nếu bulk: "Upload cho nhiều HS từ file ZIP"]

[Mode toggle: Đơn lẻ | Hàng loạt (ZIP)]

[Mode Đơn lẻ:]
  [FileUpload: drag-drop multiple images]
    Accept: .jpg .jpeg .png, max 10MB/ảnh, max 20 ảnh
  [Preview grid: thumbnails của ảnh đã chọn]
  [Chú ý: Ảnh rõ mặt, nhìn thẳng, ánh sáng tốt]

[Mode Hàng loạt (ZIP):]
  [FileUpload: 1 file .zip]
  [Mô tả cấu trúc: /MaHS/*.jpg hoặc /HoTen/*.jpg]
  [Progress: đang parse ZIP]
  [Preview table: Mã HS | Tên HS | Số ảnh | Trạng thái map]

[Actions: [Hủy] [Upload {n} ảnh]]
  → Progress bar → toast kết quả
```

**API:**
- `POST /api/ai/faces/{studentId}/upload` (multi-file)
- `POST /api/ai/faces/bulk-upload` (ZIP file)

**Deliverables:**
- [ ] Single upload với drag-drop + preview
- [ ] Bulk ZIP upload với mapping preview
- [ ] Progress bar khi upload
- [ ] Validate: chỉ accept images, check size

---

### SCR-08-023 — Batch approve khuôn mặt

**Component:** `BatchApproveModal.tsx`

**Layout:**
```
[Dialog: "Duyệt khuôn mặt hàng loạt"]
  [FilterBar: Lớp | Date range upload]
  [DataTable: checkbox | Avatar + Tên | Lớp | Số ảnh | Ngày upload]
  [Footer: {n} HS đã chọn | [Duyệt tất cả đã chọn] | [Từ chối đã chọn]]
    → Confirm → PUT /api/ai/faces/batch-approve
    → Toast kết quả
```

---

## TASK E-4: Nhật ký phân tích (WF-08-030..031)

### SCR-08-030 — Nhật ký phân tích camera (live log)

**Route:** `app/(dashboard)/ai-attendance/monitor/page.tsx`

**Layout:**
```
[PageHeader: "Nhật ký phân tích Camera"]
  Actions: [⏸ Tạm dừng live] [🔄 Làm mới] [Xuất log]

[FilterBar]
  - Select: Camera (searchable, multiple)
  - DateTimePicker: Từ ~ Đến
  - Select: Loại sự kiện (Vào | Ra | Không nhận diện | Cảnh báo)
  - Select: Kết quả (Tất cả | Nhận diện được | Không nhận diện)

[Live indicator: [● LIVE — cập nhật tự động]]

[DataTable — live feed (mới nhất lên đầu)]
  Columns:
    - Thời gian (sortable, default DESC)
    - Camera
    - Thumbnail ảnh (50x50px)
    - Tên nhận diện (hoặc "Không nhận diện" badge)
    - Độ tin cậy (%) badge — màu theo %: ≥90=green, ≥70=yellow, <70=red
    - Loại sự kiện (Vào/Ra badge)
    - Trạng thái (Success/Failed)
  [Mỗi row click → xem ảnh gốc fullsize trong Dialog]
```

**Live update implementation:**
```typescript
// Option 1: Server-Sent Events (recommended)
const eventSource = new EventSource('/api/ai/attendance/monitor/stream?cameras=...')
eventSource.onmessage = (e) => {
  const newLog = JSON.parse(e.data)
  setLogs(prev => [newLog, ...prev].slice(0, 500)) // max 500 rows
}

// Option 2: Polling fallback (nếu SSE không support)
useInterval(() => fetchNewLogs(lastTimestamp), 3000)
```

**Pause/resume:** Toggle SSE connection hoặc polling

**Deliverables:**
- [ ] Live feed cập nhật real-time
- [ ] Thumbnail ảnh trong mỗi row
- [ ] Click ảnh → dialog fullsize
- [ ] Pause/resume live
- [ ] Filter không ngắt live feed (re-subscribe)
- [ ] Export log hiện tại (CSV)

---

### SCR-08-031 — Nhật ký phân tích máy điểm danh

**Route:** `app/(dashboard)/ai-attendance/monitor/devices/page.tsx`

Tương tự SCR-08-030, thay Camera → Thiết bị điểm danh

---

## TASK E-5: Báo cáo vào/ra (WF-08-040..041)

### SCR-08-040 — Báo cáo vào/ra theo địa điểm

**Route:** `app/(dashboard)/ai-attendance/reports/page.tsx`

**Layout:**
```
[PageHeader: "Báo cáo điểm danh vào/ra"]
  Actions: [Xuất Excel] [In báo cáo]

[FilterBar (required)]
  - Select: Địa điểm* (tree-select tòa nhà > tầng > khu vực)
  - DateRangePicker: Từ ngày* → Đến ngày*
  - Select: Loại (Vào | Ra | Cả hai)
  - Select: Lớp (optional, searchable)
  - Select: Giờ học (optional: Ca 1 | Ca 2 | ...)

[StatGrid cols=4]
  [Tổng lượt vào] [Tổng lượt ra] [HS duy nhất] [Tỉ lệ nhận diện %]

[ChartCard: "Biểu đồ vào/ra theo giờ trong ngày"]
  Line chart: x=giờ (0-23), y=số lượt, 2 series: Vào / Ra
  (Chọn từ nhiều ngày → aggregate trung bình)

[DataTable: Chi tiết giao dịch]
  Columns: Thời gian | Tên HS | Lớp | Địa điểm | Loại | Độ tin cậy | Thumbnail
  Sort: theo thời gian DESC
  Paginate: 50/trang
```

**API:**
- `GET /api/ai/reports/attendance?location={}&from={}&to={}&type={}&class={}`

---

### SCR-08-041 — Chi tiết báo cáo vào/ra một địa điểm

**Route:** `app/(dashboard)/ai-attendance/reports/[locationId]/page.tsx`

**Layout:**
```
[PageHeader: "Chi tiết — [Tên địa điểm]"]

[FilterBar: Date | Loại | Lớp | SearchBar HS]

[Grid 2 cols]
Left:
  [ChartCard: Timeline vào/ra trong ngày (area chart)]
  [ChartCard: So sánh theo ngày trong tuần (bar chart)]

Right:
  [Card: Top 10 giờ cao điểm]
  [Card: HS thường xuyên vào/ra muộn (top 5)]

[DataTable: Danh sách chi tiết]
  Mỗi row: click → Dialog xem ảnh + thông tin đầy đủ
```

---

## TASK E-6: Analytics & Phân tích dữ liệu (WF-08-050..051)

### SCR-08-050 — Phân hệ báo cáo thống kê

**Route:** `app/(dashboard)/ai-attendance/analytics/page.tsx`

**Layout:**
```
[PageHeader: "Phân tích dữ liệu điểm danh"]
  Actions: [Xuất báo cáo tổng hợp] [Cài đặt]

[FilterBar toàn cục]
  - DateRangePicker: Period (default: 30 ngày qua)
  - Select: Phạm vi (Toàn trường | Lớp cụ thể)

[Dashboard grid]
Row 1:
  [StatGrid cols=4]
    [Tổng HS điểm danh/ngày TB] [Tỉ lệ đúng giờ %] [Tỉ lệ muộn %] [Tỉ lệ vắng %]

Row 2: 2 cols
  [ChartCard: "Tỉ lệ điểm danh theo lớp" — horizontal bar, sorted]
  [ChartCard: "Xu hướng điểm danh 30 ngày" — line chart, smooth]

Row 3:
  [ChartCard: "Heatmap giờ đến/về" — ECharts calendar/heatmap]
    X: Ngày trong tuần, Y: Giờ trong ngày, Color: số lượt

Row 4: 2 cols
  [DataTable: "Top học sinh đến muộn" (top 10)]
    Columns: Tên | Lớp | Số lần muộn | Muộn TB (phút) | Xu hướng
  [DataTable: "Lớp có tỉ lệ vắng cao" (top 5)]
    Columns: Tên lớp | GV | Sĩ số | Vắng TB/ngày | Tỉ lệ%
```

**SCR-08-051 — Biểu đồ thống kê tổng hợp:**

Trang chi tiết hơn SCR-08-050, cho phép:
- Chọn loại biểu đồ (pie/bar/line/heatmap)
- Drill-down: click lớp → xem HS của lớp đó
- Compare mode: so sánh 2 kỳ

```
[ChartCard full-width: Biểu đồ đa chiều có thể cấu hình]
  [Toolbar: Loại chart | Group by | Filter | Drill-down level]
  [ECharts canvas]
  [DataTable phía dưới: dữ liệu raw cho chart đang xem]
```

**API:**
- `GET /api/ai/analytics/summary?from={}&to={}&scope={}`
- `GET /api/ai/analytics/class-attendance-rate`
- `GET /api/ai/analytics/heatmap?from={}&to={}`
- `GET /api/ai/analytics/late-students`
- `GET /api/ai/analytics/class-absence`

**Deliverables:**
- [ ] All 4 chart types render đúng
- [ ] Heatmap ECharts hoạt động với mock data
- [ ] Drill-down hoạt động (click lớp → xem HS)
- [ ] Export PDF/Excel báo cáo
- [ ] Loading state tất cả charts
- [ ] Date range filter áp dụng cho tất cả charts cùng lúc

---

## Phase 6 — Definition of Done

### Camera & Devices
- [ ] SCR-08-001: DataTable camera với auto-refresh 30s
- [ ] SCR-08-002: Form thêm camera với test kết nối
- [ ] SCR-08-003: Chi tiết camera với live thumbnail
- [ ] SCR-08-004: Sửa camera
- [ ] SCR-08-005: Xóa dialog
- [ ] SCR-08-010..011: Máy điểm danh CRUD

### Khuôn mặt
- [ ] SCR-08-020: Danh sách HS với filter trạng thái KM
- [ ] SCR-08-021: Gallery ảnh + status embedding
- [ ] SCR-08-022: Upload đơn lẻ + bulk ZIP
- [ ] SCR-08-023: Batch approve dialog

### Monitor
- [ ] SCR-08-030: Live log với SSE (hoặc polling fallback)
- [ ] SCR-08-031: Log máy điểm danh
- [ ] Pause/resume, filter không ngắt feed

### Báo cáo
- [ ] SCR-08-040: Filter + chart + table
- [ ] SCR-08-041: Chi tiết 1 địa điểm với drill-down
- [ ] SCR-08-050..051: Analytics dashboard 4+ charts
- [ ] Heatmap render đúng

### Technical
- [ ] SSE implementation cho live log
- [ ] ECharts: không lag với dữ liệu lớn
- [ ] `npm run build` clean

## Thời gian ước tính: 4–5 ngày
