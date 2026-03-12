---
title: "WF-09a1: Thư viện – Tham số, Nhật ký, Đơn đặt, Kiểm kê"
cluster: "Digital Library - Admin / Config & Acquisition"
updated: 2026-03-11
---

# WF-09a1: Thư viện – Tham số, Nhật ký, Đơn đặt, Kiểm kê

## Danh sách màn hình

| Mã | Tên màn hình | Nhóm |
|----|-------------|------|
| SCR-09a1-001 | Cấu hình email hệ thống | A – Tham số hệ thống |
| SCR-09a1-002 | Cấu hình ngôn ngữ | A – Tham số hệ thống |
| SCR-09a1-003 | Cấu hình khung phân loại | A – Tham số hệ thống |
| SCR-09a1-010 | Danh sách nhật ký sử dụng | B – Nhật ký |
| SCR-09a1-011 | Chi tiết nhật ký | B – Nhật ký |
| SCR-09a1-012 | Xuất / In nhật ký (Modal) | B – Nhật ký |
| SCR-09a1-020 | Tạo yêu cầu đặt mua ấn phẩm | C – Đơn đặt mua |
| SCR-09a1-021 | Duyệt yêu cầu đặt mua | C – Đơn đặt mua |
| SCR-09a1-022 | Danh sách đơn đặt | C – Đơn đặt mua |
| SCR-09a1-023 | Báo cáo duyệt mua | C – Đơn đặt mua |
| SCR-09a1-030 | Đóng kho / Mở kho | D – Kiểm kê |
| SCR-09a1-031 | Tạo kỳ kiểm kê | D – Kiểm kê |
| SCR-09a1-032 | Thực hiện kiểm kê | D – Kiểm kê |
| SCR-09a1-033 | Báo cáo kết quả kiểm kê | D – Kiểm kê |
| SCR-09a1-040 | Xếp giá ấn phẩm chưa kiểm nhận | E – Ấn phẩm bổ sung |
| SCR-09a1-041 | Xếp giá / Chuyển kho / Thanh lý | E – Ấn phẩm bổ sung |
| SCR-09a1-042 | Kiểm nhận & Mở khóa ấn phẩm | E – Ấn phẩm bổ sung |

---

## Phần A: Tham số hệ thống thư viện

---

### SCR-09a1-001 — Cấu hình email hệ thống

Màn hình QTHT chỉnh sửa thông số SMTP để hệ thống gửi email thông báo.

```
┌────────────────────────────────────────────────┐
│  Tham số hệ thống › Cấu hình email             │
├────────────────────────────────────────────────┤
│  SMTP Host  [mail.example.com            ]     │
│  SMTP Port  [587 ]  Bảo mật [TLS ▾]           │
│  Tên đăng nhập  [noreply@example.com     ]     │
│  Mật khẩu       [••••••••••••••••        ]     │
│  Email gửi      [noreply@example.com     ]     │
│  Tên hiển thị   [Thư viện số             ]     │
│  ─────────────────────────────────────────     │
│  [Kiểm tra kết nối]   [Lưu cấu hình]           │
│  ─────────────────────────────────────────     │
│  ✓ Lưu thành công lúc 14:32 10/03/2026         │
└────────────────────────────────────────────────┘
```

**Components:** Form (6 text-input, 1 select), Btn-Test, Btn-Save, Toast-success/error
**API:** `GET /api/lib/config/email` · `PUT /api/lib/config/email` · `POST /api/lib/config/email/test`

---

### SCR-09a1-002 — Cấu hình ngôn ngữ

Màn hình QTHT chọn ngôn ngữ mặc định và danh sách ngôn ngữ cho phép.

```
┌────────────────────────────────────────────────┐
│  Tham số hệ thống › Ngôn ngữ                   │
├────────────────────────────────────────────────┤
│  Ngôn ngữ mặc định   [Tiếng Việt (vi) ▾]       │
│                                                │
│  Ngôn ngữ hỗ trợ:                              │
│  [✓] Tiếng Việt (vi)   [✓] Tiếng Anh (en)     │
│  [ ] Tiếng Pháp (fr)   [ ] Tiếng Nhật (ja)    │
│                                                │
│  Định dạng ngày  [DD/MM/YYYY ▾]               │
│  Múi giờ         [Asia/Ho_Chi_Minh ▾]          │
│  ─────────────────────────────────────────     │
│             [Lưu cấu hình]                     │
└────────────────────────────────────────────────┘
```

**Components:** Select (ngôn ngữ mặc định, ngày, múi giờ), CheckboxGroup (ngôn ngữ hỗ trợ), Btn-Save, Toast
**API:** `GET /api/lib/config/language` · `PUT /api/lib/config/language`

---

### SCR-09a1-003 — Cấu hình khung phân loại

Màn hình QTHT chọn và cấu hình bộ khung phân loại tài liệu áp dụng toàn hệ thống.

```
┌──────────────────────────────────────────────────┐
│  Tham số hệ thống › Khung phân loại              │
├──────────────────────────────────────────────────┤
│  Hệ phân loại  [DDC (Dewey) ▾]                  │
│                                                  │
│  ┌─ Cấu trúc cấp ──────────────────────────┐    │
│  │  Cấp 1  [Nhóm chính          ]          │    │
│  │  Cấp 2  [Phân nhóm           ]          │    │
│  │  Cấp 3  [Chuyên ngành        ]          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Áp dụng từ  [01/04/2026  📅]                   │
│  ─────────────────────────────────────────────   │
│  [Xem trước]        [Lưu cấu hình]               │
└──────────────────────────────────────────────────┘
```

**Components:** Select (hệ phân loại), Input×3 (tên cấp), DatePicker, Btn-Preview, Btn-Save, Toast
**API:** `GET /api/lib/config/classification` · `PUT /api/lib/config/classification`

---

## Phần B: Nhật ký sử dụng

---

### SCR-09a1-010 — Danh sách nhật ký sử dụng

Màn hình QTHT tra cứu toàn bộ lịch sử hoạt động của người dùng trên hệ thống.

```
┌──────────────────────────────────────────────────────────────┐
│  Nhật ký › Danh sách                   [Xuất] [In]           │
├──────────────────────────────────────────────────────────────┤
│  🔍 [Tìm theo tên / hành động...  ]  Từ [--/--] Đến [--/--] │
│  Loại: [Tất cả ▾]  Người dùng: [Tất cả ▾]   [Lọc]          │
├────┬──────────────┬──────────────┬──────────┬────────────────┤
│ #  │ Thời gian    │ Người dùng   │ Hành động│ Đối tượng      │
├────┼──────────────┼──────────────┼──────────┼────────────────┤
│ 1  │ 14:32 10/3   │ nguyen.van.a │ Xem      │ TL-00125       │
│ 2  │ 14:10 10/3   │ tran.thi.b   │ Mượn     │ TL-00098       │
│ 3  │ 13:55 10/3   │ admin        │ Sửa      │ TL-00077       │
│ 4  │ 13:20 10/3   │ nguyen.van.a │ Tìm kiếm │ "lịch sử"     │
├────┴──────────────┴──────────────┴──────────┴────────────────┤
│  Tổng: 1.240 bản ghi   « 1 2 3 … 62 »                       │
└──────────────────────────────────────────────────────────────┘
```

**Components:** SearchInput, DateRangePicker, Select×2, Btn-Filter, Table (sortable), Pagination, Btn-Export, Btn-Print
**API:** `GET /api/lib/logs?q&from&to&type&user&page`

---

### SCR-09a1-011 — Chi tiết nhật ký

Modal/trang con hiển thị toàn bộ thông tin một bản ghi nhật ký.

```
┌──────────────────────────────────────────┐
│  Chi tiết nhật ký  #LOG-20260310-00125   │
├──────────────────────────────────────────┤
│  Thời gian   : 14:32:05  10/03/2026      │
│  Người dùng  : nguyen.van.a (ID: 1042)   │
│  IP           : 192.168.1.55             │
│  Hành động   : Xem tài liệu              │
│  Đối tượng   : TL-00125 – Lịch sử VN T1 │
│  Module       : Thư viện số – OPAC       │
│  Trạng thái  : ✓ Thành công              │
│  Ghi chú      : —                        │
│  ────────────────────────────────────    │
│                          [Đóng]          │
└──────────────────────────────────────────┘
```

**Components:** Modal/DrawerPanel, LabelValueGrid, Badge-status, Btn-Close
**API:** `GET /api/lib/logs/{logId}`

---

### SCR-09a1-012 — Xuất / In nhật ký (Modal)

Modal xác nhận phạm vi và định dạng trước khi xuất hoặc in nhật ký.

```
┌────────────────────────────────────────┐
│  Xuất / In nhật ký                  ✕  │
├────────────────────────────────────────┤
│  Phạm vi                               │
│  (•) Bộ lọc hiện tại (1.240 bản ghi)  │
│  ( ) Toàn bộ nhật ký                  │
│                                        │
│  Định dạng    [Excel (.xlsx) ▾]        │
│                                        │
│  ─────────────────────────────────     │
│  [Hủy]              [Xác nhận xuất]   │
└────────────────────────────────────────┘
```

**Components:** Modal, RadioGroup (phạm vi), Select (định dạng: xlsx/csv/pdf), Btn-Cancel, Btn-Confirm
**API:** `POST /api/lib/logs/export` · `POST /api/lib/logs/print`

---

## Phần C: Đơn đặt mua

---

### SCR-09a1-020 — Tạo yêu cầu đặt mua ấn phẩm

CBQL tạo yêu cầu mua sách/tài liệu mới gửi lên hệ thống chờ duyệt.

```
┌──────────────────────────────────────────────────┐
│  Đơn đặt mua › Tạo yêu cầu mới                  │
├──────────────────────────────────────────────────┤
│  Tên ấn phẩm   [                           ]    │
│  Tác giả        [                           ]    │
│  NXB / Năm      [           ] / [      ]         │
│  ISBN            [                          ]    │
│  Số lượng        [   ]   Đơn giá (VNĐ) [      ] │
│  Nhà cung cấp   [                           ]    │
│  Mục đích        [Textarea – lý do đặt mua  ]    │
│  Đính kèm        [Chọn file PDF/Word... 📎 ]     │
│  ─────────────────────────────────────────────   │
│  [Hủy]              [Gửi yêu cầu]               │
└──────────────────────────────────────────────────┘
```

**Components:** Input×6, NumberInput×2, Textarea, FileUpload, Btn-Cancel, Btn-Submit, ValidationToast
**API:** `POST /api/lib/orders/request`

---

### SCR-09a1-021 — Duyệt yêu cầu đặt mua

CBQL cấp cao xem danh sách yêu cầu chờ duyệt, phê duyệt hoặc từ chối từng đơn.

```
┌──────────────────────────────────────────────────────────┐
│  Đơn đặt mua › Duyệt yêu cầu            [Xuất báo cáo]  │
├──────────────────────────────────────────────────────────┤
│  Trạng thái: [Chờ duyệt ▾]   🔍 [Tìm ấn phẩm...  ]     │
├────┬─────────────────────┬──────────┬────────┬───────────┤
│ #  │ Tên ấn phẩm         │ SL       │ TT     │ Thao tác  │
├────┼─────────────────────┼──────────┼────────┼───────────┤
│ 1  │ Lịch sử VN tập 1    │ 5        │ ⏳Chờ  │[✓][✕][👁]│
│ 2  │ Toán cao cấp T2     │ 3        │ ⏳Chờ  │[✓][✕][👁]│
│ 3  │ Giáo trình Hóa học  │ 10       │ ✓Duyệt │[👁]       │
├────┴─────────────────────┴──────────┴────────┴───────────┤
│  Tổng: 18 yêu cầu   « 1 2 »                              │
└──────────────────────────────────────────────────────────┘
```

**Components:** Select-filter, SearchInput, Table (sortable), Badge-status, Btn-Approve, Btn-Reject, Btn-View, Pagination
**API:** `GET /api/lib/orders?status&q&page` · `PATCH /api/lib/orders/{id}/approve` · `PATCH /api/lib/orders/{id}/reject`

---

### SCR-09a1-022 — Danh sách đơn đặt

Màn hình tổng hợp toàn bộ đơn đặt, hỗ trợ sửa/xóa đơn chưa duyệt.

```
┌────────────────────────────────────────────────────────────┐
│  Đơn đặt mua › Danh sách                [+ Tạo đơn mới]   │
├────────────────────────────────────────────────────────────┤
│  🔍 [Tìm tên ấn phẩm / mã đơn]  Từ[--/--] Đến[--/--]     │
│  TT: [Tất cả ▾]   Người yêu cầu: [Tất cả ▾]   [Lọc]      │
├────┬──────────────┬────────────────┬────────┬──────────────┤
│ #  │ Mã đơn       │ Tên ấn phẩm    │ TT     │ Thao tác     │
├────┼──────────────┼────────────────┼────────┼──────────────┤
│ 1  │ ORD-2026-001 │ Lịch sử VN T1  │ ✓Duyệt │ [👁]         │
│ 2  │ ORD-2026-002 │ Toán cao cấp T2│ ⏳Chờ  │ [✎][🗑][👁]  │
│ 3  │ ORD-2026-003 │ Giáo trình Hóa │ ✕Từchối│ [👁]         │
├────┴──────────────┴────────────────┴────────┴──────────────┤
│  Tổng: 42 đơn   « 1 2 3 »                                  │
└────────────────────────────────────────────────────────────┘
```

**Components:** SearchInput, DateRangePicker, Select×2, Btn-Filter, Btn-New, Table, Badge-status, Btn-Edit/Delete/View, Pagination, ConfirmModal (xóa)
**API:** `GET /api/lib/orders?q&from&to&status&user&page` · `DELETE /api/lib/orders/{id}`

---

### SCR-09a1-023 — Báo cáo duyệt mua

Màn hình xuất báo cáo tổng hợp tình trạng xét duyệt đơn đặt mua theo kỳ.

```
┌──────────────────────────────────────────────┐
│  Đơn đặt mua › Báo cáo duyệt mua            │
├──────────────────────────────────────────────┤
│  Kỳ báo cáo  Từ [01/01/2026] Đến [31/03/2026]│
│  Nhóm theo   [Tháng ▾]                       │
│                                              │
│  ┌─ Thống kê nhanh ──────────────────────┐  │
│  │  Tổng đơn: 42  │ Đã duyệt: 30         │  │
│  │  Từ chối : 7   │ Chờ duyệt: 5         │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  BarChart: Đơn duyệt / từ chối theo tháng   │
│  ══════════════════════════════════════      │
│  [Xem trước PDF]  [Xuất Excel]  [In]         │
└──────────────────────────────────────────────┘
```

**Components:** DateRangePicker, Select (nhóm theo), StatCard×4, BarChart, Btn-Preview, Btn-ExportExcel, Btn-Print
**API:** `GET /api/lib/orders/report?from&to&groupBy` · `POST /api/lib/orders/report/export`

---

## Phần D: Kiểm kê

---

### SCR-09a1-030 — Đóng kho / Mở kho

Màn hình CBQL kích hoạt trạng thái đóng kho (ngừng mượn/trả) để chuẩn bị kiểm kê.

```
┌──────────────────────────────────────────────┐
│  Kiểm kê › Quản lý trạng thái kho           │
├──────────────────────────────────────────────┤
│                                              │
│  Trạng thái hiện tại  ● ĐANG HOẠT ĐỘNG      │
│                                              │
│  Lý do đóng kho                              │
│  [Textarea: nhập lý do...               ]   │
│                                              │
│  Thời gian đóng dự kiến:                     │
│  Từ [11/03/2026  📅]  Đến [15/03/2026  📅]  │
│                                              │
│  ⚠ Đóng kho sẽ tạm dừng mọi giao dịch      │
│     mượn/trả cho đến khi mở lại.            │
│  ───────────────────────────────────────     │
│  [Hủy]              [Xác nhận đóng kho]     │
└──────────────────────────────────────────────┘
```

**Components:** StatusBadge, Textarea, DateRangePicker, AlertWarning, Btn-Cancel, Btn-Confirm (toggle đóng/mở)
**API:** `GET /api/lib/warehouse/status` · `POST /api/lib/warehouse/close` · `POST /api/lib/warehouse/open`

---

### SCR-09a1-031 — Tạo kỳ kiểm kê

CBQL khởi tạo kỳ kiểm kê mới: đặt tên, phạm vi kho, thời gian thực hiện.

```
┌──────────────────────────────────────────────┐
│  Kiểm kê › Tạo kỳ kiểm kê mới               │
├──────────────────────────────────────────────┤
│  Tên kỳ kiểm kê  [Kiểm kê Q1/2026      ]    │
│  Kho áp dụng     [Tất cả kho ▾]             │
│  Phạm vi phân loại [Tất cả ▾]               │
│                                              │
│  Thời gian  Từ [11/03/2026] Đến [15/03/2026]│
│  Người phụ trách  [Chọn nhân sự...  ▾]      │
│  Ghi chú   [Textarea...                 ]   │
│  ───────────────────────────────────────     │
│  [Hủy]         [Lưu nháp]   [Tạo kỳ KK]    │
└──────────────────────────────────────────────┘
```

**Components:** Input (tên), Select×3 (kho/phân loại/phụ trách), DateRangePicker, Textarea, Btn-Cancel, Btn-Draft, Btn-Create, ValidationToast
**API:** `POST /api/lib/inventory/periods` · `GET /api/lib/warehouse/list` · `GET /api/lib/staff`

---

### SCR-09a1-032 — Thực hiện kiểm kê

Màn hình đối chiếu thực tế–hệ thống, ghi nhận sai lệch từng ấn phẩm.

```
┌────────────────────────────────────────────────────────┐
│  Kiểm kê Q1/2026  [Tiến độ: 320/850 ấn phẩm  38%▓░]  │
├────────────────────────────────────────────────────────┤
│  🔍 [Quét mã vạch / nhập mã ấn phẩm...    ] [Xác nhận]│
├──────────────┬───────┬───────┬──────────┬─────────────┤
│ Mã AP        │ Tên   │ HT    │ Thực tế  │ Ghi chú     │
├──────────────┼───────┼───────┼──────────┼─────────────┤
│ TL-00125     │ Ls VN │ Có    │ ✓ Có     │ —           │
│ TL-00126     │ Toán  │ Có    │ ✕ Mất    │ [Nhập...]   │
│ TL-00127     │ Hóa   │ Có    │ ✓ Có     │ —           │
├──────────────┴───────┴───────┴──────────┴─────────────┤
│  Khớp: 319   Sai lệch: 1   Chưa kiểm: 530            │
│  ──────────────────────────────────────────────────    │
│  [Tạm lưu]                    [Hoàn thành kiểm kê]    │
└────────────────────────────────────────────────────────┘
```

**Components:** ProgressBar, BarcodeInput, Table (inline-edit ghi chú), StatRow (khớp/lệch/chưa kiểm), Btn-Save, Btn-Complete
**API:** `GET /api/lib/inventory/periods/{id}/items` · `PATCH /api/lib/inventory/items/{id}` · `POST /api/lib/inventory/periods/{id}/complete`

---

### SCR-09a1-033 — Báo cáo kết quả kiểm kê

Màn hình tổng hợp kết quả sau khi hoàn thành kỳ kiểm kê, xuất báo cáo.

```
┌────────────────────────────────────────────────┐
│  Kiểm kê Q1/2026 › Báo cáo kết quả            │
├───────────────┬────────────────────────────────┤
│  Tổng AP KK   │  850                           │
│  Khớp hệ thống│  844  (99,3%)                  │
│  Sai lệch     │  4    (0,5%)                   │
│  Mất / thiếu  │  2    (0,2%)                   │
├───────────────┴────────────────────────────────┤
│  ┌─ Chi tiết sai lệch ──────────────────────┐  │
│  │  TL-00126  Toán cao cấp  → Mất           │  │
│  │  TL-00301  Vật lý đại cương → Vị trí lệch│  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  [Xuất Excel]   [Xuất PDF]   [In báo cáo]      │
└────────────────────────────────────────────────┘
```

**Components:** StatGrid (4 chỉ số), Table chi tiết sai lệch, Btn-ExportExcel, Btn-ExportPDF, Btn-Print
**API:** `GET /api/lib/inventory/periods/{id}/report` · `POST /api/lib/inventory/periods/{id}/report/export`

---

## Phần E: Ấn phẩm bổ sung

---

### SCR-09a1-040 — Xếp giá ấn phẩm chưa kiểm nhận

CBQL gán vị trí tạm thời (kho/giá/ô) cho ấn phẩm mới nhập chưa qua kiểm nhận.

```
┌────────────────────────────────────────────────────┐
│  Ấn phẩm bổ sung › Xếp giá (chưa kiểm nhận)       │
├────────────────────────────────────────────────────┤
│  🔍 [Quét mã / nhập mã ấn phẩm...     ] [Tìm]     │
│                                                    │
│  Ấn phẩm: TL-NEW-0089 – Giáo trình CNTT           │
│  Trạng thái: 🔒 Chưa kiểm nhận                    │
│                                                    │
│  Kho đích    [Kho A – Tầng 2 ▾]                   │
│  Giá số      [Giá 05          ]                    │
│  Ô / Ngăn    [Ô 03            ]                    │
│  Ghi chú     [               ]                     │
│  ──────────────────────────────────────────────    │
│  [Hủy]               [Lưu vị trí tạm thời]        │
└────────────────────────────────────────────────────┘
```

**Components:** BarcodeInput/SearchInput, InfoCard (tên AP + trạng thái), Select (kho), Input×2 (giá/ô), Input (ghi chú), Btn-Cancel, Btn-Save
**API:** `GET /api/lib/items?code={code}&status=pending` · `PATCH /api/lib/items/{id}/shelve-temp`

---

### SCR-09a1-041 — Xếp giá / Chuyển kho / Thanh lý

Màn hình xử lý đồng thời 3 thao tác vị trí: sắp xếp lại giá, điều chuyển kho, hoặc thanh lý.

```
┌──────────────────────────────────────────────────────────┐
│  Ấn phẩm bổ sung › Xếp giá · Chuyển kho · Thanh lý      │
├──────────────────────────────────────────────────────────┤
│  🔍 [Tìm mã ấn phẩm / tên...    ]  TT: [Tất cả ▾] [Lọc]│
├────┬──────────────────┬────────────┬───────┬─────────────┤
│ #  │ Tên ấn phẩm      │ Vị trí HT  │ TT    │ Thao tác    │
├────┼──────────────────┼────────────┼───────┼─────────────┤
│ 1  │ Giáo trình CNTT  │ KhoA-G05-03│ Có mặt│[Xếp][Ck][Tl]│
│ 2  │ Lịch sử VN T2   │ KhoA-G02-11│ Có mặt│[Xếp][Ck][Tl]│
│ 3  │ Vật lý ĐC       │ KhoB-G01-07│ Hỏng  │[Tl]         │
├────┴──────────────────┴────────────┴───────┴─────────────┤
│  Tổng: 215 ấn phẩm   « 1 2 … 11 »                       │
└──────────────────────────────────────────────────────────┘
```

**Components:** SearchInput, Select-filter, Table, Badge-status, Btn-Shelve/Transfer/Liquidate (inline), ActionModal (xác nhận chuyển kho/thanh lý), Pagination
**API:** `GET /api/lib/items?q&status&page` · `PATCH /api/lib/items/{id}/shelve` · `PATCH /api/lib/items/{id}/transfer` · `PATCH /api/lib/items/{id}/liquidate`

---

### SCR-09a1-042 — Kiểm nhận & Mở khóa ấn phẩm

CBQL xác nhận ấn phẩm đạt yêu cầu, chuyển trạng thái sang "Đã kiểm nhận" để lưu thông.

```
┌───────────────────────────────────────────────────────┐
│  Ấn phẩm bổ sung › Kiểm nhận & Mở khóa               │
├───────────────────────────────────────────────────────┤
│  🔍 [Quét mã / nhập mã ấn phẩm...   ] [Tìm]          │
│  Lọc: TT [Chờ kiểm nhận ▾]   [Chọn tất cả]           │
│                                                       │
│  ☑ TL-NEW-0089  Giáo trình CNTT    🔒 Chờ KN         │
│  ☑ TL-NEW-0090  Toán rời rạc       🔒 Chờ KN         │
│  ☐ TL-NEW-0091  Hóa hữu cơ        🔒 Chờ KN         │
│                                                       │
│  Ngày kiểm nhận [11/03/2026  📅]                      │
│  Người kiểm nhận [Nguyễn Văn A      ]                 │
│  Ghi chú  [                                      ]    │
│  ──────────────────────────────────────────────────   │
│  Đã chọn: 2 ấn phẩm    [Mở khóa & Kiểm nhận]         │
└───────────────────────────────────────────────────────┘
```

**Components:** BarcodeInput, Select-filter, CheckboxList (AP chờ KN), DatePicker, Input (người KN), Textarea, Btn-Submit (bulk), CountBadge (đã chọn), SuccessToast
**API:** `GET /api/lib/items?status=pending-acceptance` · `POST /api/lib/items/accept` (bulk: `{ids[], date, inspector, note}`)
