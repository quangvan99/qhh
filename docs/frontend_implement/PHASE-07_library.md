---
title: "Phase 7 — Thư viện số"
phase: 7
agent: "Agent F"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-09a1-001..003
  - SCR-09a1-010..012
  - SCR-09a1-020..023
  - SCR-09a1-030..033
  - SCR-09a1-040..042
  - SCR-09a2-001
  - SCR-09a2-010..012
  - SCR-09a2-020
  - SCR-09a2-030
  - SCR-09a3-010..011
  - SCR-09a3-020..021
  - SCR-09a3-030
  - SCR-09a3-040
  - SCR-09a3-050..055
  - SCR-09b-001..006
  - SCR-09b-010..011
  - SCR-09b-020..021
  - SCR-09b-030..032
wireframes: ["WF-09"]
estimated_days: "7–10 ngày"
---

# Phase 7 — Thư viện số

> ✅ Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.
>
> Phase phức tạp nhất về số lượng screens (~60). Chia thành 2 nhóm route chính:
> - Admin: `app/(dashboard)/library/` — quản lý nội bộ
> - Public portal: `app/library-portal/` — tra cứu công khai

## Phạm vi files

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── library/
│   │       ├── settings/
│   │       │   ├── page.tsx               # SCR-09a1-001..003
│   │       ├── logs/
│   │       │   ├── page.tsx               # SCR-09a1-010..012
│   │       ├── procurement/
│   │       │   ├── page.tsx               # SCR-09a1-020..022
│   │       │   └── report/page.tsx        # SCR-09a1-023
│   │       ├── inventory/
│   │       │   ├── page.tsx               # SCR-09a1-030..033
│   │       ├── shelving/
│   │       │   └── page.tsx               # SCR-09a1-040..042
│   │       ├── catalog/
│   │       │   └── page.tsx               # SCR-09a2-001 (báo cáo tài liệu)
│   │       ├── readers/
│   │       │   ├── page.tsx               # SCR-09a2-010 (danh sách)
│   │       │   ├── new/page.tsx           # SCR-09a2-011 (thêm)
│   │       │   ├── [readerId]/
│   │       │   │   ├── page.tsx           # SCR-09a2-012 (chi tiết)
│   │       │   │   └── edit/page.tsx
│   │       │   ├── print-cards/page.tsx   # SCR-09a2-020
│   │       │   └── reports/page.tsx       # SCR-09a2-030
│   │       └── circulation/
│   │           ├── borrow/page.tsx        # SCR-09a3-010..011
│   │           ├── return/page.tsx        # SCR-09a3-020..021
│   │           ├── renew/page.tsx         # SCR-09a3-030
│   │           ├── overdue/page.tsx       # SCR-09a3-040
│   │           └── reports/
│   │               └── page.tsx           # SCR-09a3-050..055
│   └── library-portal/                    # PUBLIC portal
│       ├── page.tsx                       # SCR-09b-010
│       ├── news/
│       │   └── [slug]/page.tsx            # SCR-09b-011
│       ├── opac/
│       │   ├── page.tsx                   # SCR-09b-020
│       │   └── [bookId]/page.tsx          # SCR-09b-021
│       ├── ebooks/
│       │   ├── page.tsx                   # SCR-09b-030
│       │   └── [ebookId]/
│       │       ├── page.tsx               # SCR-09b-031
│       │       └── read/page.tsx          # SCR-09b-032
│       └── admin/                         # Admin portal content
│           ├── pages/page.tsx             # SCR-09b-001..003
│           └── news/page.tsx              # SCR-09b-004..006
└── features/
    └── library/
        ├── settings/
        ├── catalog/
        ├── readers/
        ├── circulation/
        ├── portal/
        └── opac/
```

---

## TASK F-1: Tham số hệ thống thư viện (SCR-09a1-001..003)

**Route:** `app/(dashboard)/library/settings/page.tsx`

**Layout:**
```
[PageHeader: "Cài đặt thư viện"]
  [Tabs: Email | Ngôn ngữ & Locale | Phân loại tài liệu]
```

**Tab Email (SCR-09a1-001):**
```
[Card: Cấu hình SMTP]
  [FormField: SMTP Host*]
  [FormField: SMTP Port*]      number (25/465/587)
  [FormField: Security]        Radio: None | SSL | TLS/STARTTLS
  [FormField: Username*]
  [FormField: Password*]       masked
  [FormField: From email*]     email format
  [FormField: From name]

[Card: Cài đặt thông báo]
  [Switch: Gửi email nhắc nhở quá hạn]
  [FormField: Số ngày trước khi nhắc]   number
  [Switch: Gửi email xác nhận mượn/trả]

[Button: Test gửi email]
  → Dialog: nhập email test → POST /api/library/settings/email/test
  → Toast: Đã gửi | Lỗi (với message)

[Actions: [Lưu cài đặt email]]
```

**Tab Ngôn ngữ (SCR-09a1-002):**
```
[Card: Cài đặt locale]
  [Select: Ngôn ngữ hiển thị] (vi | en)
  [Select: Timezone]
  [Select: Định dạng ngày] (DD/MM/YYYY | MM/DD/YYYY | YYYY-MM-DD)
  [Select: Định dạng số tiền]  (VND | USD)
[Actions: [Lưu]]
```

**Tab Phân loại (SCR-09a1-003):**
```
[Card: Khung phân loại]
  [Radio: Dewey Decimal (DDC) | Universal (UDC) | Tự tạo]

  [Card: Danh mục tự tạo (nếu chọn Tự tạo)]
    [Tree view danh mục — CRUD inline]
    Mỗi node: [Mã] [Tên] [✏️] [🗑] [+ Con]
    [+ Thêm danh mục gốc]

[Actions: [Lưu]]
```

**API:** `GET/PUT /api/library/settings`

**Deliverables:**
- [ ] 3 tabs setting, save/load đúng
- [ ] Test email hoạt động
- [ ] Tree danh mục: CRUD inline
- [ ] Validation email format, SMTP fields

---

## TASK F-2: Nhật ký sử dụng (SCR-09a1-010..012)

**Route:** `app/(dashboard)/library/logs/page.tsx`

**Layout:**
```
[PageHeader: "Nhật ký sử dụng thư viện"]
  Actions: [Xuất/In]

[FilterBar]
  - DateRangePicker
  - Select: Loại hành động (Tất cả | Mượn | Trả | Đăng nhập | Tìm kiếm | ...)
  - Select: Người dùng (searchable)

[DataTable — sortable by time]
  Columns: Thời gian | Người dùng | Loại hành động | Đối tượng | IP | Chi tiết
  Row click → DetailDrawer chi tiết log

[DetailDrawer (SCR-09a1-011):]
  Title: "Chi tiết nhật ký"
  Full log info: JSON hoặc formatted

[Export/In modal (SCR-09a1-012):]
[Dialog: "Xuất nhật ký"]
  [DateRange]
  [Format: CSV | Excel | PDF]
  [Loại hành động: multi-select]
  [Hủy] [Xuất & Tải về]
```

**API:** `GET /api/library/logs?from={}&to={}&action={}&user={}`

**Deliverables:**
- [ ] Filter + DataTable
- [ ] DetailDrawer click-to-open
- [ ] Export dialog + download

---

## TASK F-3: Đặt mua ấn phẩm (SCR-09a1-020..023)

**Route:** `app/(dashboard)/library/procurement/page.tsx`

**Layout:**
```
[PageHeader: "Đặt mua ấn phẩm"]
  Tabs: [Yêu cầu đặt mua] [Đơn đặt] [Duyệt mua]
  Actions (tab Yêu cầu): [+ Tạo yêu cầu]

[SCR-09a1-020 — Form tạo yêu cầu:]
[Dialog: "Tạo yêu cầu đặt mua"]
  [FormField: Tên ấn phẩm*]
  [FormField: ISBN / Mã tài liệu]
  [FormField: Tác giả]
  [FormField: NXB]
  [FormField: Năm xuất bản]
  [FormField: Số lượng yêu cầu*]   number
  [FormField: Nhà cung cấp*]        Select
  [FormField: Đơn giá ước tính]     number
  [FormField: Lý do đặt mua]        AppTextarea
  [FormField: Đính kèm] (PDF mô tả)
  [Hủy] [Gửi yêu cầu]

[SCR-09a1-021 — Duyệt yêu cầu:]
[Tab "Yêu cầu đặt mua" DataTable:]
  - Tên ấn phẩm | Người yêu cầu | Số lượng | Đơn giá | Tổng | Trạng thái (badge) | Ngày gửi
  - Actions: [Duyệt (green)] [Từ chối (red)] [Chi tiết]
  - Inline approve/reject với optional feedback

[SCR-09a1-022 — Danh sách đơn đặt:]
[Tab "Đơn đặt" DataTable:]
  - Mã đơn | Nhà cung cấp | Ngày đặt | Số lượng | Tổng tiền | Trạng thái | Actions

[SCR-09a1-023 — Báo cáo duyệt mua:]
[Tab "Báo cáo"]
  [StatGrid cols=3: Tổng yêu cầu | Đã duyệt | Từ chối]
  [ChartCard: Tình trạng theo tháng (stacked bar)]
  [DataTable: Chi tiết tất cả yêu cầu + filter]
  [Export Excel]
```

**Deliverables:**
- [ ] 3 tabs
- [ ] Dialog tạo yêu cầu
- [ ] Duyệt/từ chối inline với optional feedback
- [ ] Báo cáo với chart

---

## TASK F-4: Kiểm kê kho (SCR-09a1-030..033)

**Route:** `app/(dashboard)/library/inventory/page.tsx`

**Layout:**
```
[PageHeader: "Quản lý kho — Kiểm kê"]
  Actions: [Tạo kỳ kiểm kê] [Lịch sử kiểm kê]

[Card: Trạng thái kho]
  [Badge lớn: ĐANG MỞ / ĐÓNG KHO]
  [Button: Đóng kho / Mở kho lại]
  → Đóng kho: ConfirmDialog "Đóng kho sẽ tạm dừng mượn trả. Xác nhận?"

[SCR-09a1-031 — Dialog Tạo kỳ kiểm kê:]
[Dialog: "Tạo kỳ kiểm kê mới"]
  [FormField: Tên kỳ*]
  [FormField: Từ ngày*]        DatePicker
  [FormField: Đến ngày*]       DatePicker
  [FormField: Phạm vi]         Radio: Toàn kho | Theo khu vực | Theo thể loại
  [FormField: Phương thức]     Radio: Barcode scan | Nhập thủ công
  [FormField: Nhân viên kiểm kê] multi-select users
  [Hủy] [Tạo kỳ kiểm kê]

[SCR-09a1-032 — Thực hiện kiểm kê:]
[Card: Kỳ đang kiểm kê (nếu có)]
  Tên kỳ | Tiến độ progress bar | Ngày tạo | Ngày hạn
  [Button: Tiến hành kiểm kê]
  → Mở Drawer hoặc page full:
    [Input scan barcode]
    [Table: đã scan: Mã | Tên | Kệ | Trạng thái scan]
    [Stats: Tổng scan | Khớp | Thiếu | Thừa]

[SCR-09a1-033 — Báo cáo kết quả kiểm kê:]
[Card: Kết quả]
  [StatGrid cols=4: Tổng kiểm kê | Khớp | Thiếu | Hỏng/Thừa]
  [DataTable: ấn phẩm thiếu | ấn phẩm thừa | ấn phẩm hỏng]
  [Export Excel báo cáo kiểm kê]
```

**Deliverables:**
- [ ] Toggle đóng/mở kho với confirm
- [ ] Tạo kỳ kiểm kê
- [ ] Scan barcode (input focus)
- [ ] Báo cáo kiểm kê với stats

---

## TASK F-5: Xếp giá & Kiểm nhận ấn phẩm (SCR-09a1-040..042)

**Route:** `app/(dashboard)/library/shelving/page.tsx`

**Layout:**
```
[PageHeader: "Ấn phẩm bổ sung"]
  Tabs: [Chờ xếp giá] [Xếp giá / Chuyển kho] [Kiểm nhận]

[SCR-09a1-040 — Ấn phẩm chưa kiểm nhận:]
[Tab "Chờ xếp giá" DataTable:]
  - Mã cá biệt | Tên ấn phẩm | Nguồn (Mua/Biếu/...) | Ngày về | Trạng thái
  - Actions: [Xếp giá] [Thanh lý]

[Xếp giá form (inline row expand hoặc Dialog):]
  Chọn kho | Chọn kệ/vị trí | Ghi chú

[SCR-09a1-041 — Xếp giá / Chuyển kho / Thanh lý:]
[Dialog khi click "Xếp giá":]
  - Loại thao tác: Radio: Xếp giá mới | Chuyển kho | Thanh lý
  - Thông tin kho đến | Lý do (nếu thanh lý) | Ghi chú

[SCR-09a1-042 — Kiểm nhận & Mở khóa:]
[Tab "Kiểm nhận" — DataTable ấn phẩm chờ duyệt]
  Bulk select → [Kiểm nhận & Mở khóa] → xác nhận
  Sau kiểm nhận: ấn phẩm có thể mượn
```

**Deliverables:**
- [ ] 3 tabs
- [ ] Xếp giá inline
- [ ] Dialog chuyển kho/thanh lý
- [ ] Bulk kiểm nhận

---

## TASK F-6: Báo cáo tài liệu (SCR-09a2-001)

**Route:** `app/(dashboard)/library/catalog/page.tsx`

**Layout:**
```
[PageHeader: "Báo cáo thống kê tài liệu"]
  Actions: [Xuất Excel]

[Tabs: Theo thể loại | Theo NXB | Theo năm | Theo tình trạng | Tổng hợp]

Mỗi tab:
  [FilterBar: DateRange | Danh mục | ...]
  [ChartCard: tương ứng]
  [DataTable: chi tiết]
```

---

## TASK F-7: Hồ sơ bạn đọc (SCR-09a2-010..012)

**Route:** `app/(dashboard)/library/readers/page.tsx`

**Layout:**
```
[PageHeader: "Hồ sơ bạn đọc"]
  Actions: [+ Thêm bạn đọc] [Import Excel] [In thẻ hàng loạt]

[FilterBar]
  - Select: Loại bạn đọc (HS | GV | NV | Khách)
  - Select: Trạng thái (Active | Suspended | Expired)
  - SearchBar: Tên / Mã thẻ / CCCD

[DataTable columns:]
  - Avatar + Tên
  - Mã thẻ
  - Loại bạn đọc (badge)
  - Lớp/Đơn vị
  - Email
  - Ngày hết hạn thẻ
  - Số sách đang mượn
  - Trạng thái (badge)
  - Actions: [Chi tiết] [Sửa] [In thẻ] [Khóa/Mở]
```

**SCR-09a2-011 — Form thêm/sửa bạn đọc:**
```
[Card: Thông tin cá nhân]
  [FormField: Loại*]            Select: HS/GV/NV/Khách
  [Nếu HS: Lớp*]               AppSelect (link với GDĐT)
  [Nếu GV: Đơn vị]
  [FormField: Họ tên*]
  [FormField: Mã thẻ]           auto-gen hoặc nhập tay
  [FormField: Số CCCD]
  [FormField: Email]
  [FormField: Số điện thoại]
  [FormField: Ngày sinh]        DatePicker
  [FormField: Địa chỉ]

[Card: Cài đặt thẻ]
  [FormField: Ngày cấp thẻ*]    DatePicker (default: hôm nay)
  [FormField: Ngày hết hạn*]    DatePicker
  [FormField: Hạn mức mượn]    number (mặc định theo loại)
  [FormField: Ghi chú]
```

**SCR-09a2-012 — Chi tiết bạn đọc:**
```
[PageHeader: "[Tên bạn đọc]"]
  Actions: [Sửa] [In thẻ] [Khóa/Mở tài khoản]

[Grid 2 cols]
Left:
  [Card: Thông tin cá nhân]
  [Card: Thông tin thẻ: Mã thẻ | Hạn thẻ | Hạn mức | Số đang mượn]

Right:
  [Card: Lịch sử mượn trả]
    DataTable lite: Tên tài liệu | Mượn | Trả | Trạng thái
    [Xem tất cả →]
  [Card: Sách đang mượn]
    DataTable: Tên | Mã | Hạn trả | Số ngày còn lại
```

**API:**
- `GET/POST/PUT/DELETE /api/library/readers`
- `GET /api/library/readers/{id}/borrow-history`

**Deliverables:**
- [ ] CRUD bạn đọc
- [ ] Import Excel
- [ ] Chi tiết với lịch sử mượn
- [ ] Khóa/mở tài khoản

---

## TASK F-8: In thẻ bạn đọc (SCR-09a2-020)

**Route:** `app/(dashboard)/library/readers/print-cards/page.tsx`

**Layout:**
```
[PageHeader: "In thẻ bạn đọc"]

[FilterBar: Select bạn đọc (multi-select searchable) | Loại | Lớp]
[Button: Chọn tất cả đang hiển thị]

[Preview grid (thẻ chuẩn 85x54mm):]
  Mỗi thẻ:
    [Logo trường]
    [Ảnh bạn đọc]
    [Mã thẻ + Barcode]
    [Tên]
    [Lớp/Đơn vị]
    [Hạn thẻ]

[Actions: [Chọn ({n})] [In thẻ]]
  → window.print() với CSS @page { size: 85mm 54mm }
  → Hoặc: export PDF với multiple cards
```

**Deliverables:**
- [ ] Preview thẻ đúng kích thước
- [ ] Multi-select + in batch
- [ ] Print CSS đúng (không in header/footer trình duyệt)

---

## TASK F-9: Báo cáo bạn đọc (SCR-09a2-030)

**Route:** `app/(dashboard)/library/readers/reports/page.tsx`

```
[StatGrid cols=4: Tổng bạn đọc | Đang hoạt động | Hết hạn thẻ | Bị khóa]
[ChartCard: Phân bố theo loại bạn đọc (pie)]
[ChartCard: Bạn đọc mới theo tháng (bar)]
[DataTable: Chi tiết]
```

---

## TASK F-10: Ghi mượn (SCR-09a3-010..011)

**Route:** `app/(dashboard)/library/circulation/borrow/page.tsx`

**Layout (Scan interface):**
```
[PageHeader: "Ghi mượn tài liệu"]

[Card: Thông tin bạn đọc]
  [Input scan thẻ (barcode/RFID) — auto-focus khi trang load]
  [Placeholder: "Quét mã thẻ bạn đọc..."]
  [Sau khi scan: hiển thị]
    Avatar | Tên | Mã thẻ | Hạn thẻ
    Số sách đang mượn / Hạn mức
    [Badge: Thẻ hợp lệ ✓ / Quá hạn ✗ / Bị khóa ✗]

[Card: Tài liệu mượn — chỉ hiển thị khi thẻ hợp lệ]
  [Input scan barcode sách — auto-focus sau khi scan thẻ]
  [Placeholder: "Quét mã tài liệu..."]

  [Danh sách tài liệu đã quét (session):]
    DataTable:
      - Barcode | Tên tài liệu | Kho | Vị trí | Trạng thái (Sẵn có ✓ / Đang mượn ✗)
    [Xóa item nếu scan nhầm]

  [Ngày hẹn trả*]    DatePicker (default: +14 ngày)
  [Ghi chú]          AppInput

[Actions: [Hủy] [Xác nhận mượn ({n} cuốn)]]
```

**SCR-09a3-011 — Xác nhận mượn:**
```
[Dialog hoặc summary card:]
  Bạn đọc: [Tên]
  Tài liệu: [list {n} cuốn]
  Ngày mượn: [hôm nay]
  Ngày trả: [chosen]
  [Xác nhận] → POST /api/library/circulation/borrow
  → Toast: "Ghi mượn thành công {n} cuốn"
  → Reset form (không redirect)
  → Print receipt option
```

**Keyboard flow:**
```
1. Focus: input thẻ bạn đọc → Enter → fetch thông tin HS
2. Focus tự động chuyển sang: input barcode sách
3. Scan sách → Enter → thêm vào danh sách → focus lại input barcode
4. Bấm F2 hoặc nút → confirm
```

**API:**
- `GET /api/library/readers/scan/{barcode}` → reader info
- `GET /api/library/books/scan/{barcode}` → book availability
- `POST /api/library/circulation/borrow`

**Deliverables:**
- [ ] Scan flow hoạt động (Enter → next input)
- [ ] Validate thẻ hợp lệ trước khi cho scan sách
- [ ] Validate sách sẵn có
- [ ] Confirm + receipt print option
- [ ] Reset form sau khi mượn

---

## TASK F-11: Ghi trả (SCR-09a3-020..021)

**Route:** `app/(dashboard)/library/circulation/return/page.tsx`

**Layout:**
```
[Tương tự Ghi mượn nhưng flow trả]

[Scan thẻ bạn đọc]
  → Hiển thị thông tin bạn đọc + danh sách sách đang mượn

[Danh sách sách đang mượn]
  DataTable: Tên | Mượn ngày | Hạn trả | Số ngày quá hạn (red nếu quá)
  Checkbox: chọn sách trả

  Hoặc: scan barcode từng sách → tự đánh dấu trong list

[Tình trạng sách (cho mỗi cuốn trả):]
  Radio: Tốt | Hư hỏng nhẹ | Hư hỏng nặng | Mất
  [Nếu hư/mất: nhập ghi chú + phí phạt]

[SCR-09a3-021 — Xác nhận trả:]
[Dialog:]
  [List sách trả + tình trạng]
  [Phí phạt (nếu có: quá hạn + hư hỏng)]
  [Tổng phí phạt]
  [Xác nhận trả]
```

**API:** `POST /api/library/circulation/return`

**Deliverables:**
- [ ] Scan thẻ → hiện danh sách mượn
- [ ] Checkbox + scan sách để trả
- [ ] Tình trạng sách + phí phạt
- [ ] Xác nhận với total fee

---

## TASK F-12: Gia hạn (SCR-09a3-030)

**Route:** `app/(dashboard)/library/circulation/renew/page.tsx`

**Layout:**
```
[Scan thẻ bạn đọc]
  → Danh sách sách đang mượn

[Chọn sách muốn gia hạn (checkbox)]
  [Hiển thị: Hạn trả hiện tại | Số lần đã gia hạn / Tối đa]

[DatePicker: Ngày gia hạn đến*]
  (Validate: không vượt quá max gia hạn)

[Button: Gia hạn ({n} cuốn)]
  → POST /api/library/circulation/renew
  → Toast success + print option
```

---

## TASK F-13: Quá hạn (SCR-09a3-040)

**Route:** `app/(dashboard)/library/circulation/overdue/page.tsx`

**Layout:**
```
[PageHeader: "Tài liệu quá hạn"]
  Actions: [Gửi nhắc nhở email hàng loạt] [Xuất Excel]

[FilterBar]
  - Select: Lớp
  - Select: Số ngày quá hạn (>0 | >7 | >14 | >30)
  - SearchBar

[StatGrid cols=3: Tổng quá hạn | Quá hạn >30 ngày | Tổng phí phạt ước tính]

[DataTable columns:]
  - Avatar + Tên HS
  - Lớp
  - Tên tài liệu
  - Ngày mượn
  - Hạn trả
  - Số ngày quá hạn (badge đỏ)
  - Phí phạt ước tính
  - Actions: [Ghi trả] [Gửi nhắc email] [Gia hạn]
```

**Bulk gửi email:** Chọn nhiều → ConfirmDialog → POST /api/library/circulation/send-reminders

---

## TASK F-14: Báo cáo lưu thông (SCR-09a3-050..055)

**Route:** `app/(dashboard)/library/circulation/reports/page.tsx`

**Layout:**
```
[PageHeader: "Báo cáo lưu thông"]

[Tabs: 6 loại báo cáo]
  [Mượn trả theo ngày]     SCR-09a3-050
  [Theo bạn đọc]           SCR-09a3-051
  [Theo tài liệu]          SCR-09a3-052
  [Quá hạn]                SCR-09a3-053
  [Gia hạn]                SCR-09a3-054
  [Tổng hợp]               SCR-09a3-055

Mỗi tab:
  [FilterBar: DateRange + filter đặc thù]
  [StatGrid mini (3-4 cards)]
  [ChartCard: phù hợp với loại báo cáo]
  [DataTable: chi tiết]
  [Actions: [Xuất Excel] [In]]
```

---

## TASK F-15: Admin Portal Content (SCR-09b-001..006)

**Route:** `app/(dashboard)/library/admin/pages/page.tsx` (và news/page.tsx)

**SCR-09b-001 — Quản lý trang nội dung tĩnh:**
```
[PageHeader: "Nội dung portal thư viện"]
  Tabs: [Trang tĩnh] [Tin tức & Sự kiện]

[Tab Trang tĩnh (SCR-09b-001..003):]
  DataTable: Tiêu đề | Slug | Trạng thái | Cập nhật lần cuối | Actions (Sửa|Xóa)

  [Dialog thêm/sửa trang (SCR-09b-002):]
    [FormField: Tiêu đề*]
    [FormField: Slug*]        (auto-gen từ tiêu đề)
    [FormField: Nội dung*]    Tiptap full editor
    [FormField: Trạng thái]   Switch
    [FormField: SEO: Meta description]

  [Dialog xóa (SCR-09b-003):]  ConfirmDialog

[Tab Tin tức (SCR-09b-004..006):]
  DataTable: Tiêu đề | Thể loại | Ngày đăng | Trạng thái | Actions

  [Dialog thêm/sửa tin tức (SCR-09b-005):]
    [FormField: Tiêu đề*]
    [FormField: Slug*]
    [FormField: Ảnh thumbnail]    ImageUpload
    [FormField: Thể loại]         Select/multi-select
    [FormField: Nội dung*]        Tiptap full
    [FormField: Ngày đăng]        DatePicker
    [FormField: Trạng thái]       Switch (Bản nháp/Đã đăng)
```

---

## TASK F-16: Public Portal (SCR-09b-010..011)

**Route:** `app/library-portal/page.tsx` (Public, không cần auth)

**Layout:**
```
[Navbar portal: Logo thư viện | Menu: Trang chủ | Tìm tài liệu | E-books | Tin tức | Liên hệ | Đăng nhập]

[Hero section:]
  Background ảnh thư viện
  [Heading: "Thư viện THPT Quốc Học Huế"]
  [SearchBar: Tìm kiếm tài liệu... (large)] → link /opac?q={}

[Section: Tài liệu nổi bật]
  Grid 4 cols: BookCard (bìa sách mini)

[Section: Tin tức & Sự kiện]
  Grid 3 cols: NewsCard (ảnh + tiêu đề + ngày)
  [Xem tất cả →]

[Section: Thống kê thư viện]
  [n] Tài liệu | [n] Bạn đọc | [n] Lượt mượn/năm

[Footer: Địa chỉ, giờ mở cửa, liên hệ]
```

**SCR-09b-011 — Chi tiết bài viết:**
```
[Breadcrumb: Trang chủ > Tin tức > [Tiêu đề]]
[Article: ảnh + tiêu đề + ngày + nội dung HTML]
[Bài viết liên quan (sidebar hoặc footer section)]
```

---

## TASK F-17 (=F-16 tiếp): OPAC Tra cứu (SCR-09b-020..021)

**Route:** `app/library-portal/opac/page.tsx`

**Layout:**
```
[Header: Tìm kiếm OPAC]

[SearchBar lớn: full-width, placeholder "Tìm theo tên, tác giả, ISBN, từ khóa..."]

[FilterBar (collapsible sidebar trên mobile):]
  - Select: Thể loại (tree)
  - Select: NXB
  - Select: Năm xuất bản
  - Select: Ngôn ngữ
  - CheckboxGroup: Chỉ hiện có sẵn
  - CheckboxGroup: Tài liệu điện tử

[Toggle view: [⊞ Card] [≡ List]]

[Results — Card view:]
  Grid 4 cols (responsive 2/1)
  Mỗi BookCard:
    [Bìa sách (fallback: icon)]
    [Tên tài liệu]
    [Tác giả]
    [NXB · Năm]
    [Badge: Có sẵn ({n}) | Hết sách | Điện tử]
    [→ Xem chi tiết] link

[Pagination]

[SCR-09b-021 — Chi tiết tài liệu vật lý:]
[PageHeader: "[Tên tài liệu]"]

[Grid 2 cols]
Left: [Bìa sách lớn]
Right:
  [Tên] [Tác giả] [ISBN] [NXB] [Năm] [Trang] [Ngôn ngữ]
  [Thể loại: badge list]
  [Mô tả: paragraph]
  [Từ khóa: badge list]

[Card: Tình trạng lưu kho]
  DataTable: Mã cá biệt | Kho | Kệ | Tình trạng (Có sẵn | Đang mượn | Đặt trước)
  [Số lượng có sẵn: {n}/{total}]

[Card: Tài liệu liên quan (similar)]
```

---

## TASK F-18 (=F-16 tiếp): Tài liệu điện tử & Viewer (SCR-09b-030..032)

**Route:**
- `app/library-portal/ebooks/page.tsx`
- `app/library-portal/ebooks/[ebookId]/page.tsx`
- `app/library-portal/ebooks/[ebookId]/read/page.tsx`

**SCR-09b-030 — Danh sách tài liệu điện tử:**
```
[SearchBar + FilterBar: thể loại | loại file (PDF/EPUB/Video)]
[Card grid — tương tự OPAC nhưng badge "PDF" "EPUB" "Video"]
```

**SCR-09b-031 — Chi tiết tài liệu điện tử:**
Giống SCR-09b-021 + thêm:
- Preview thumbnail / cover
- [Đọc ngay] → /read
- [Tải về] (nếu được phép)
- Lượt xem | Lượt tải

**SCR-09b-032 — Trình đọc tài liệu online:**
```
[Full-page reader — không có portal navbar]
[Top bar: [← Quay lại] [Tên tài liệu] [Download] [Fullscreen]]

[Reader area:]
  PDF: react-pdf với page navigation + zoom
    Toolbar: [< Trang trước] [Trang X/Y] [Trang tiếp >] [Zoom -/+] [Fit width/page]

  Video: ReactPlayer (nếu loại video)
    Controls: play/pause, volume, fullscreen, playback speed

[Sidebar (toggle): Mục lục nếu PDF có outline]
```

**API:**
- `GET /api/library/ebooks` (public)
- `GET /api/library/ebooks/{id}`
- `GET /api/library/ebooks/{id}/stream` (PDF bytes hoặc video URL)

**Deliverables:**
- [ ] PDF reader: page nav + zoom
- [ ] Video player với controls
- [ ] Sidebar mục lục PDF
- [ ] Auth check cho tài liệu nội bộ (chỉ HS/GV trường)

---

## Phase 7 — Definition of Done

### Admin Module
- [ ] F-1: 3 tabs settings (email test, tree phân loại)
- [ ] F-2: Nhật ký + DetailDrawer + export
- [ ] F-3: Đặt mua 3 tabs (yêu cầu, đơn, báo cáo)
- [ ] F-4: Kiểm kê: đóng/mở kho + tạo + thực hiện + báo cáo
- [ ] F-5: Xếp giá / Kiểm nhận 3 tabs
- [ ] F-6: Báo cáo tài liệu multi-tab
- [ ] F-7: CRUD bạn đọc + lịch sử mượn
- [ ] F-8: In thẻ batch với print CSS
- [ ] F-9: Báo cáo bạn đọc

### Lưu thông
- [ ] F-10: Scan mượn flow (thẻ → sách → confirm)
- [ ] F-11: Scan trả + tình trạng + phí phạt
- [ ] F-12: Gia hạn flow
- [ ] F-13: Quá hạn + bulk email
- [ ] F-14: 6 báo cáo lưu thông

### Portal
- [ ] F-15: Admin CRUD trang tĩnh + tin tức (Tiptap)
- [ ] F-16: Trang chủ portal với hero + sections
- [ ] F-17: OPAC search + filter + card/list view + detail
- [ ] F-18: E-book reader (PDF + Video)

### Technical
- [ ] Scan barcode: input focus management đúng
- [ ] PDF viewer render không lỗi
- [ ] Portal public: không cần auth
- [ ] `npm run build` clean

## Thời gian ước tính: 7–10 ngày
