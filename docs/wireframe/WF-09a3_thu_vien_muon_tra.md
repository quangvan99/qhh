---
title: "WF-09a3: Thư viện – Mượn, Trả, Gia hạn & Báo cáo lưu thông"
cluster: "Digital Library - Admin / Circulation"
updated: 2026-03-11
---

# WF-09a3: Thư viện – Mượn, Trả, Gia hạn & Báo cáo lưu thông

## Tổng quan module

Module **Lưu thông tài liệu** phục vụ CBQL thư viện xử lý toàn bộ vòng đời mượn–trả: quét thẻ độc giả, quét mã sách, xác nhận giao dịch, gia hạn, theo dõi quá hạn, gửi thông báo phạt và xuất 6 loại báo cáo.

### Danh sách màn hình

| Mã | Tên màn hình | Nhóm |
|----|-------------|------|
| SCR-09a3-001 | Ghi mượn – Bước 1: Scan thẻ độc giả | A – Ghi mượn |
| SCR-09a3-002 | Ghi mượn – Bước 2: Scan mã sách | A – Ghi mượn |
| SCR-09a3-003 | Ghi mượn – Bước 3: Xác nhận mượn | A – Ghi mượn |
| SCR-09a3-010 | Ghi trả – Scan & kiểm tra phạt | B – Ghi trả |
| SCR-09a3-011 | Ghi trả – Xác nhận phạt (Modal) | B – Ghi trả |
| SCR-09a3-020 | Gia hạn mượn | C – Gia hạn |
| SCR-09a3-030 | Danh sách quá hạn | D – Quá hạn |
| SCR-09a3-031 | Chi tiết quá hạn & cập nhật trạng thái | D – Quá hạn |
| SCR-09a3-040 | Hub báo cáo lưu thông | E – Báo cáo |
| SCR-09a3-041 | Báo cáo ra vào thư viện | E – Báo cáo |
| SCR-09a3-042 | Báo cáo đang mượn | E – Báo cáo |
| SCR-09a3-043 | Báo cáo lịch sử mượn trả | E – Báo cáo |
| SCR-09a3-044 | Báo cáo quá hạn | E – Báo cáo |
| SCR-09a3-045 | Báo cáo tủ đựng đồ | E – Báo cáo |
| SCR-09a3-046 | Thống kê top mượn nhiều | E – Báo cáo |

---

## Phần A: Ghi mượn tài liệu

> **Flow tổng quát:** Scan thẻ độc giả → Lookup hồ sơ → Scan từng mã sách → Lookup kho → Xác nhận → Lưu giao dịch

---

### SCR-09a3-001 — Ghi mượn · Bước 1: Scan thẻ độc giả

Bước khởi đầu luồng mượn: quét thẻ hoặc nhập mã độc giả, hệ thống tra cứu hồ sơ ngay lập tức.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  Lưu thông › Ghi mượn                                │
├──────────────────────────────────────────────────────┤
│  ── BƯỚC 1/3 ──────── BƯỚC 2/3 ──────── BƯỚC 3/3 ─  │
│  ● Scan thẻ        ○ Scan sách       ○ Xác nhận      │
├──────────────────────────────────────────────────────┤
│                                                      │
│   📷 [       KHUNG CAMERA / BARCODE SCANNER       ]  │
│       [  Hướng thẻ độc giả vào khung quét...      ]  │
│                                                      │
│   ─── HOẶC NHẬP THỦ CÔNG ─────────────────────────  │
│   Mã độc giả: [___________________________] [Tìm]   │
│                                                      │
│   ┌── KẾT QUẢ LOOKUP ────────────────────────────┐  │
│   │  ● Nguyễn Văn An  │ Lớp 10A1  │ Mã: DG-0042 │  │
│   │  Hạn thẻ: 31/12/2026   Đang mượn: 1/3 quyển  │  │
│   └──────────────────────────────────────────────┘  │
│                                                      │
│   [Hủy]                            [Tiếp theo →]    │
└──────────────────────────────────────────────────────┘
```

**Components:** Wizard stepper (3 bước), Camera/barcode scanner widget, Text input + Tìm button, Result card (tên, lớp, mã, hạn thẻ, số đang mượn), Alert (thẻ hết hạn / không tìm thấy), Button Tiếp theo (disabled nếu chưa lookup thành công).

**API:**
- `GET /api/v1/library/readers/lookup?card={code}` — tra cứu hồ sơ độc giả theo mã thẻ/barcode.

---

### SCR-09a3-002 — Ghi mượn · Bước 2: Scan mã sách

Sau khi xác định độc giả, CBQL quét lần lượt từng quyển sách cần mượn; hệ thống kiểm tra tồn kho và trạng thái khả dụng ngay sau mỗi lần quét.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  ── BƯỚC 1/3 ──────── BƯỚC 2/3 ──────── BƯỚC 3/3 ─  │
│  ✓ Scan thẻ        ● Scan sách       ○ Xác nhận      │
├──────────────────────────────────────────────────────┤
│  Độc giả: Nguyễn Văn An – DG-0042 (Lớp 10A1)        │
├──────────────────────────────────────────────────────┤
│   📷 [       KHUNG CAMERA / BARCODE SCANNER       ]  │
│       [  Quét mã vạch / QR sách...                ]  │
│   Mã sách:  [___________________________] [Quét]    │
│                                                      │
│   ┌── SÁCH ĐÃ QUÉT (2) ───────────────────────────┐ │
│   │ #  │ Mã sách  │ Tên tài liệu       │ Tình trạng│ │
│   │ 1  │ SACH-001 │ Toán 10 – Tập 1   │ ✓ Sẵn sàng│ │
│   │ 2  │ SACH-007 │ Vật lý đại cương  │ ✓ Sẵn sàng│ │
│   └──────────────────────────────────────────────-─┘ │
│   ⚠ Giới hạn còn lại: 1 quyển                        │
│                                                      │
│   [← Quay lại]                     [Tiếp theo →]    │
└──────────────────────────────────────────────────────┘
```

**Components:** Wizard stepper, Info bar (độc giả hiện tại), Camera scanner, Text input + Quét button, Danh sách sách đã quét (table xóa được từng dòng), Badge giới hạn còn lại, Alert inline (sách đang mượn / không tồn tại / đã mượn bởi người khác).

**API:**
- `GET /api/v1/library/items/lookup?barcode={code}` — tra cứu bản sao theo mã vạch, trả về tên, tình trạng, số bản.

---

### SCR-09a3-003 — Ghi mượn · Bước 3: Xác nhận mượn

Tổng hợp toàn bộ giao dịch trước khi lưu; CBQL kiểm tra, chọn ngày trả dự kiến và xác nhận một lần duy nhất.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  ── BƯỚC 1/3 ──────── BƯỚC 2/3 ──────── BƯỚC 3/3 ─  │
│  ✓ Scan thẻ        ✓ Scan sách       ● Xác nhận      │
├──────────────────────────────────────────────────────┤
│  ┌─── THÔNG TIN GIAO DỊCH ─────────────────────────┐ │
│  │ Độc giả : Nguyễn Văn An – DG-0042 (Lớp 10A1)   │ │
│  │ Ngày mượn: 11/03/2026   Hạn trả: [11/03/2026 ▾] │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ #  │ Mã sách  │ Tên tài liệu       │ Hạn trả    │ │
│  │ 1  │ SACH-001 │ Toán 10 – Tập 1   │ 25/03/2026 │ │
│  │ 2  │ SACH-007 │ Vật lý đại cương  │ 25/03/2026 │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ Ghi chú: [________________________________]     │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│   [← Quay lại]                    [✓ Xác nhận Mượn] │
└──────────────────────────────────────────────────────┘
```

**Components:** Wizard stepper, Summary card (độc giả, ngày mượn), DatePicker hạn trả (áp dụng đồng loạt), Table xác nhận (không chỉnh sửa được), Textarea ghi chú, Button Xác nhận (primary), Toast thành công / lỗi.

**API:**
- `POST /api/v1/library/loans` — tạo giao dịch mượn; body: `{ readerId, itemIds[], dueDate, note }`.

---

## Phần B: Ghi trả tài liệu

> **Flow:** Scan mã sách → Lookup giao dịch mượn → Tính phạt (nếu quá hạn) → Xác nhận phạt → Lưu trả.

---

### SCR-09a3-010 — Ghi trả · Scan & kiểm tra phạt

CBQL quét mã sách trả; hệ thống tra cứu giao dịch mượn, tính số ngày quá hạn và tiền phạt tự động.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  Lưu thông › Ghi trả                                 │
├──────────────────────────────────────────────────────┤
│   📷 [         KHUNG SCANNER – QUÉT MÃ SÁCH TRẢ  ]  │
│   Mã sách:  [___________________________] [Quét]    │
│                                                      │
│   ┌── KẾT QUẢ LOOKUP ──────────────────────────────┐ │
│   │ Sách   : Vật lý đại cương – SACH-007           │ │
│   │ Độc giả: Nguyễn Văn An – DG-0042               │ │
│   │ Ngày mượn: 11/03/2026   Hạn trả: 25/03/2026    │ │
│   │ Hôm nay : 11/03/2026   Quá hạn: 0 ngày         │ │
│   │ ─────────────────────────────────────────────  │ │
│   │ ✅ Trả đúng hạn – Không phát sinh phí           │ │
│   └────────────────────────────────────────────────┘ │
│                                                      │
│   Tình trạng sách: (●) Tốt  ( ) Hỏng nhẹ  ( ) Mất  │
│   Ghi chú: [_________________________________]       │
│                                                      │
│   [Hủy]                           [✓ Xác nhận Trả]  │
└──────────────────────────────────────────────────────┘
```

**Components:** Camera scanner, Text input + Quét button, Result card (sách, độc giả, ngày mượn, hạn trả, số ngày quá hạn), Fine summary (highlight đỏ nếu có phạt), Radio tình trạng sách, Textarea ghi chú, Button Xác nhận Trả.

**API:**
- `GET /api/v1/library/loans/active?barcode={code}` — tìm giao dịch mượn đang mở theo mã sách, trả về thông tin + tính phạt.
- `POST /api/v1/library/returns` — ghi nhận trả; body: `{ loanId, condition, note }`.

---

### SCR-09a3-011 — Ghi trả · Xác nhận phạt (Modal)

Modal hiện ra khi sách trả quá hạn; CBQL xác nhận khoản phạt trước khi hoàn tất giao dịch trả.

```
┌───────────────────────────────────────────────┐
│  ⚠ XÁC NHẬN PHẠT QUÁ HẠN                     │
├───────────────────────────────────────────────┤
│  Sách    : Toán 10 – Tập 1 (SACH-001)         │
│  Quá hạn : 5 ngày  (HT: 11/03 / Hạn: 06/03)  │
│  Đơn giá : 2.000 đ/ngày                       │
│  ─────────────────────────────────────────    │
│  Tổng phạt : 10.000 đ                         │
│                                               │
│  Miễn giảm: [0________] đ   Lý do: [______]  │
│  Còn lại   : 10.000 đ                         │
│                                               │
│  [Hủy]              [✓ Xác nhận & Thu phạt]  │
└───────────────────────────────────────────────┘
```

**Components:** Modal overlay, Fine detail (sách, số ngày, đơn giá, tổng), Input miễn giảm + lý do, Tổng còn lại (tính real-time), Button Xác nhận & Thu phạt (primary-danger).

**API:**
- `POST /api/v1/library/fines` — ghi nhận khoản phạt; body: `{ loanId, amount, discount, discountReason }`.

---

## Phần C: Gia hạn mượn

---

### SCR-09a3-020 — Gia hạn mượn

CBQL tìm giao dịch đang mượn (theo độc giả hoặc sách), chọn bản ghi cần gia hạn và cập nhật ngày trả mới.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  Lưu thông › Gia hạn mượn                            │
├──────────────────────────────────────────────────────┤
│  Tìm: [Mã độc giả / tên...          ] [Tìm kiếm]    │
│                                                      │
│  ┌── DANH SÁCH ĐANG MƯỢN ─────────────────────────┐  │
│  │ #│ Độc giả    │ Tên sách          │Hạn trả │    │  │
│  │ 1│ Văn An     │ Toán 10 – Tập 1  │06/03 ⚠│[GH]│  │
│  │ 2│ Thị Bình   │ Ngữ văn 11       │25/03  │[GH]│  │
│  │ 3│ Minh Cường │ Hóa học 12       │28/03  │[GH]│  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ── FORM GIA HẠN (hiện khi nhấn [GH]) ─────────────  │
│  Sách       : Toán 10 – Tập 1 (SACH-001)             │
│  Hạn cũ     : 06/03/2026  │  Gia hạn lần: 1/2       │
│  Hạn mới    : [20/03/2026 ▾]                         │
│  Ghi chú    : [_______________________________]      │
│                                                      │
│   [Hủy]                          [✓ Lưu gia hạn]    │
└──────────────────────────────────────────────────────┘
```

**Components:** Search input, Bảng danh sách mượn (badge ⚠ quá hạn), Inline form gia hạn (toggle theo dòng được chọn), DatePicker hạn mới (validate: không trước hạn cũ), Badge số lần gia hạn còn lại, Button Lưu gia hạn.

**API:**
- `GET /api/v1/library/loans?status=active&q={term}` — danh sách giao dịch đang mượn.
- `PATCH /api/v1/library/loans/{id}/renew` — gia hạn; body: `{ newDueDate, note }`.

---

## Phần D: Quản lý quá hạn

---

### SCR-09a3-030 — Danh sách quá hạn

Tổng quan tất cả giao dịch đã vượt hạn trả; hỗ trợ lọc, gửi thông báo nhắc nhở hàng loạt.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  Lưu thông › Quá hạn                                 │
├──────────────────────────────────────────────────────┤
│  Tìm: [Tên / mã độc giả...]   Lọc: [Tất cả lớp ▾]  │
│                                                      │
│  📊 Tổng quá hạn: 8  │ Tổng phạt ước tính: 96.000đ  │
│                                                      │
│  ┌── DANH SÁCH QUÁ HẠN ──────────────────────────┐  │
│  │☐│Độc giả  │Sách          │Quá hạn│Phạt  │Tình │  │
│  │☐│Văn An   │Toán 10 T.1  │5 ngày │10.000│Chưa │  │
│  │☐│Thị Lan  │Lịch sử 11   │3 ngày │6.000 │Chưa │  │
│  │☐│Nam Anh  │Sinh học 12  │12 ngày│24.000│Đ.LH │  │
│  └───────────────────────────────────────────────┘  │
│  [☐ Chọn tất cả]   [📢 Gửi thông báo đã chọn]      │
│                                  [↓ Xuất Excel]      │
└──────────────────────────────────────────────────────┘
```

**Components:** Search + Filter lớp, Summary bar (tổng số, tổng phạt ước tính), Bảng quá hạn (checkbox đa chọn, badge ngày quá hạn, badge tiền phạt, badge trạng thái: Chưa xử lý / Đã liên hệ / Đã xử lý), Button Gửi thông báo (bulk), Button Xuất Excel.

**API:**
- `GET /api/v1/library/overdue?q=&class=` — danh sách quá hạn, tự tính ngày và phạt.
- `POST /api/v1/library/overdue/notify` — gửi thông báo; body: `{ loanIds[] }`.
- `GET /api/v1/library/overdue/export` — xuất Excel.

---

### SCR-09a3-031 — Chi tiết quá hạn & cập nhật trạng thái

CBQL xem đầy đủ lịch sử liên hệ và cập nhật trạng thái xử lý cho một giao dịch quá hạn cụ thể.

```
┌──────────────────────────────────────────────────────┐
│  Lưu thông › Quá hạn › Chi tiết                      │
├──────────────────────────────────────────────────────┤
│  ┌── THÔNG TIN ──────────────────────────────────┐   │
│  │ Độc giả : Nguyễn Văn An – DG-0042 (Lớp 10A1) │   │
│  │ Sách    : Toán 10 – Tập 1 (SACH-001)          │   │
│  │ Mượn    : 11/02/2026   Hạn trả: 06/03/2026    │   │
│  │ Quá hạn : 5 ngày   Phạt: 10.000đ              │   │
│  └───────────────────────────────────────────────┘   │
│  ┌── CẬP NHẬT XỬ LÝ ────────────────────────────┐   │
│  │ Trạng thái: (●) Chưa xử lý                    │   │
│  │             ( ) Đã liên hệ                     │   │
│  │             ( ) Đã xử lý / Thu phạt            │   │
│  │ Ghi chú  : [_______________________________]  │   │
│  └───────────────────────────────────────────────┘   │
│  ┌── LỊCH SỬ LIÊN HỆ ───────────────────────────┐   │
│  │ 08/03  Gửi thông báo qua app – Tự động        │   │
│  │ 10/03  Gọi điện – CBQL Nguyễn B               │   │
│  └───────────────────────────────────────────────┘   │
│   [← Quay lại]               [💾 Lưu cập nhật]      │
└──────────────────────────────────────────────────────┘
```

**Components:** Info card (độc giả, sách, ngày, phạt), Radio trạng thái xử lý, Textarea ghi chú, Timeline lịch sử liên hệ, Button Lưu cập nhật.

**API:**
- `GET /api/v1/library/overdue/{id}` — chi tiết giao dịch quá hạn + lịch sử.
- `PATCH /api/v1/library/overdue/{id}` — cập nhật trạng thái, ghi chú; body: `{ status, note }`.

---

## Phần E: Thống kê & Báo cáo lưu thông

---

### SCR-09a3-040 — Hub báo cáo lưu thông

Màn hình điều hướng trung tâm; CBQL chọn một trong 6 loại báo cáo để truy cập.

```
┌──────────────────────────────────────────────────────┐
│  [≡] Thư viện số          [🔔] [👤 CBQL Thư viện ▾] │
├──────────────────────────────────────────────────────┤
│  Thống kê & Báo cáo lưu thông                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  📥 Ra/Vào   │  │  📚 Đang mượn│  │  🕒 Lịch sử│ │
│  │  thư viện    │  │              │  │  mượn trả  │ │
│  │  SCR-041     │  │  SCR-042     │  │  SCR-043   │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  ⚠ Quá hạn  │  │  🗄 Tủ đựng │  │  🏆 Top    │ │
│  │              │  │  đồ          │  │  mượn nhiều│ │
│  │  SCR-044     │  │  SCR-045     │  │  SCR-046   │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Components:** 6 Card-button điều hướng (icon + tên + mã màn hình).

**API:** _(không có — màn hình điều hướng thuần)_

---

### SCR-09a3-041 — Báo cáo bạn đọc ra vào thư viện

Thống kê lượt ra / vào thư viện theo khoảng thời gian; hiển thị biểu đồ cột và bảng chi tiết.

```
┌──────────────────────────────────────────────────────┐
│  Báo cáo › Ra vào thư viện                           │
├──────────────────────────────────────────────────────┤
│  Từ: [01/03/2026] Đến: [11/03/2026]  [Xem báo cáo]  │
├──────────────────────────────────────────────────────┤
│  📊 Tổng lượt vào: 312  │ TB/ngày: 28.4             │
│                                                      │
│  ▓▓▓▓▓▓░░▓▓▓▓░░▓▓▓▓▓▓░░▓▓▓▓░░▓▓▓▓▓▓  ← Bar chart   │
│  01/03  02/03  03/03  04/03  05/03                   │
│                                                      │
│  ┌── BẢNG CHI TIẾT ──────────────────────────────┐  │
│  │ Ngày       │ Lượt vào │ Lượt ra │ Đang trong  │  │
│  │ 11/03/2026 │    35    │   33    │      2      │  │
│  │ 10/03/2026 │    29    │   29    │      0      │  │
│  └───────────────────────────────────────────────┘  │
│                              [↓ Xuất Excel/PDF]      │
└──────────────────────────────────────────────────────┘
```

**Components:** DateRangePicker + Button Xem, KPI summary bar (tổng / TB ngày), Bar chart (theo ngày), Bảng chi tiết (vào/ra/đang trong), Button Xuất Excel/PDF.

**API:**
- `GET /api/v1/library/reports/entry?from=&to=` — dữ liệu ra vào theo ngày.
- `GET /api/v1/library/reports/entry/export?from=&to=&fmt=xlsx` — xuất file.

---

### SCR-09a3-042 — Báo cáo bạn đọc đang mượn

Danh sách real-time tất cả độc giả đang giữ sách tại thời điểm xem; không cần chọn ngày.

```
┌──────────────────────────────────────────────────────┐
│  Báo cáo › Đang mượn sách           Cập nhật: live  │
├──────────────────────────────────────────────────────┤
│  Lọc lớp: [Tất cả ▾]  Tìm: [___________]  [Lọc]    │
│  📊 Tổng đang mượn: 47 bản / 31 độc giả             │
├──────────────────────────────────────────────────────┤
│  ┌── DANH SÁCH ──────────────────────────────────┐  │
│  │ #│ Độc giả      │ Sách             │ Hạn trả  │  │
│  │ 1│ Nguyễn V. An │ Toán 10 – T.1   │ 25/03 ⚠  │  │
│  │ 2│ Trần T. Bình │ Ngữ văn 11      │ 01/04    │  │
│  │ 3│ Lê M. Cường  │ Hóa học 12      │ 28/03    │  │
│  └───────────────────────────────────────────────┘  │
│                              [↓ Xuất Excel]          │
└──────────────────────────────────────────────────────┘
```

**Components:** Filter lớp + Search, KPI (tổng bản / tổng người), Bảng (badge ⚠ cận hạn ≤3 ngày, badge 🔴 quá hạn), Button Xuất Excel.

**API:**
- `GET /api/v1/library/reports/active-loans?class=&q=` — danh sách đang mượn.
- `GET /api/v1/library/reports/active-loans/export` — xuất file.

---

### SCR-09a3-043 — Báo cáo lịch sử mượn trả

Tra cứu toàn bộ giao dịch đã hoàn tất (đã trả) trong khoảng thời gian chọn.

```
┌──────────────────────────────────────────────────────┐
│  Báo cáo › Lịch sử mượn trả                          │
├──────────────────────────────────────────────────────┤
│  Từ: [01/01/2026]  Đến: [11/03/2026]                 │
│  Lớp: [Tất cả ▾]   Sách: [Tất cả ▾]   [Xem]         │
├──────────────────────────────────────────────────────┤
│  📊 Tổng giao dịch: 248  │ Có phạt: 12  │ Phạt: 96k │
│                                                      │
│  ┌── LỊCH SỬ ────────────────────────────────────┐  │
│  │ Ngày trả  │ Độc giả    │ Sách         │ Phạt   │  │
│  │ 10/03     │ Nguyễn V.A │ Toán 10 T.1 │ –      │  │
│  │ 09/03     │ Trần T.B   │ Ngữ văn 11  │ 4.000đ │  │
│  │ 08/03     │ Lê M.C     │ Lý 12       │ –      │  │
│  └───────────────────────────────────────────────┘  │
│  [← 1 2 3 … →]               [↓ Xuất Excel/PDF]     │
└──────────────────────────────────────────────────────┘
```

**Components:** DateRangePicker, Multi-select lớp/sách, Button Xem, KPI bar (tổng GD, có phạt, tổng tiền phạt), Bảng lịch sử (phân trang), Button Xuất.

**API:**
- `GET /api/v1/library/reports/history?from=&to=&class=&item=&page=` — lịch sử phân trang.
- `GET /api/v1/library/reports/history/export` — xuất file.

---

### SCR-09a3-044 — Báo cáo bạn đọc mượn quá hạn

Thống kê tất cả giao dịch đã / đang quá hạn, phân loại theo mức độ vi phạm.

```
┌──────────────────────────────────────────────────────┐
│  Báo cáo › Quá hạn                                   │
├──────────────────────────────────────────────────────┤
│  Từ: [01/01/2026]  Đến: [11/03/2026]  [Xem]         │
│  Lọc: [Tất cả trạng thái ▾]                         │
├──────────────────────────────────────────────────────┤
│  📊 Tổng: 18  │ Chưa xử lý: 8  │ Tổng phạt: 192k   │
│                                                      │
│  ┌── DANH SÁCH ──────────────────────────────────┐  │
│  │ Độc giả    │ Sách         │Ngày QH│Phạt  │Tình │  │
│  │ Nguyễn V.A │ Toán 10 T.1 │5 ngày │10.0k │Chưa │  │
│  │ Trần T.B   │ Lịch sử 11  │3 ngày │6.0k  │Đ.LH │  │
│  │ Lê M.C     │ Sinh học 12 │12 ngày│24.0k │Đ.XL │  │
│  └───────────────────────────────────────────────┘  │
│  [← 1 2 →]                    [↓ Xuất Excel/PDF]    │
└──────────────────────────────────────────────────────┘
```

**Components:** DateRangePicker, Filter trạng thái xử lý, KPI bar, Bảng (badge màu: đỏ=chưa xử lý, cam=đã liên hệ, xanh=đã xử lý), Phân trang, Button Xuất.

**API:**
- `GET /api/v1/library/reports/overdue?from=&to=&status=&page=` — danh sách quá hạn có lọc.
- `GET /api/v1/library/reports/overdue/export` — xuất file.

---

### SCR-09a3-045 — Báo cáo sử dụng tủ đựng đồ

Thống kê tỷ lệ sử dụng, lượt dùng và thời gian chiếm dụng trung bình của tủ đựng đồ.

```
┌──────────────────────────────────────────────────────┐
│  Báo cáo › Tủ đựng đồ                                │
├──────────────────────────────────────────────────────┤
│  Từ: [01/03/2026]  Đến: [11/03/2026]  [Xem]         │
├──────────────────────────────────────────────────────┤
│  📊 Tổng tủ: 60  │ Đang dùng: 14  │ Tỷ lệ: 23%     │
│  Lượt dùng: 418  │ TB/ngày: 38    │ TB giờ/lượt: 2h │
│                                                      │
│  ┌── TÌNH TRẠNG TỦ (Heatmap số hiệu) ─────────────┐ │
│  │  A01[■] A02[■] A03[□] A04[■] A05[□] A06[■]    │ │
│  │  B01[□] B02[■] B03[□] B04[□] B05[■] B06[□]    │ │
│  └───────────────────────────────────────────────┘  │
│  ■ = Đang dùng   □ = Trống                          │
│                                                      │
│  ┌── BẢNG THEO NGÀY ────────────────────────┐       │
│  │ Ngày       │ Lượt SD │ Đỉnh giờ cao nhất │       │
│  │ 11/03/2026 │   42    │ 08:00 – 09:00     │       │
│  └──────────────────────────────────────────┘       │
│                              [↓ Xuất Excel]          │
└──────────────────────────────────────────────────────┘
```

**Components:** DateRangePicker, KPI summary (tổng tủ, đang dùng, tỷ lệ, lượt, TB), Heatmap tủ (grid, ■/□), Bảng theo ngày (lượt SD, giờ đỉnh), Button Xuất.

**API:**
- `GET /api/v1/library/reports/lockers?from=&to=` — thống kê tủ theo kỳ.
- `GET /api/v1/library/reports/lockers/status` — trạng thái tủ real-time (cho heatmap).
- `GET /api/v1/library/reports/lockers/export` — xuất file.

---

### SCR-09a3-046 — Thống kê top bạn đọc mượn nhiều nhất

Xếp hạng độc giả theo số lượt mượn trong giai đoạn; hỗ trợ lọc theo lớp và hiển thị biểu đồ.

```
┌──────────────────────────────────────────────────────┐
│  Báo cáo › Top mượn nhiều nhất                       │
├──────────────────────────────────────────────────────┤
│  Từ: [01/01/2026]  Đến: [11/03/2026]                 │
│  Lớp: [Tất cả ▾]   Top: [10 ▾]     [Xem]            │
├──────────────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓ 24  Nguyễn Văn An   (10A1)          │
│  ▓▓▓▓▓▓▓▓▓▓▓   19  Trần Thị Bình   (11B2)          │
│  ▓▓▓▓▓▓▓▓▓     17  Lê Minh Cường   (12A3)          │
│  ▓▓▓▓▓▓▓▓      15  Phạm Thị Dung   (10A1)          │
│  ▓▓▓▓▓▓▓       13  Hoàng Văn Em    (11C1)          │
│                                                      │
│  ┌── BẢNG XẾP HẠNG ─────────────────────────────┐  │
│  │ # │ Họ tên          │ Lớp  │ Lượt mượn │      │  │
│  │ 1 │ Nguyễn Văn An   │ 10A1 │     24    │ 🥇   │  │
│  │ 2 │ Trần Thị Bình   │ 11B2 │     19    │ 🥈   │  │
│  │ 3 │ Lê Minh Cường   │ 12A3 │     17    │ 🥉   │  │
│  └───────────────────────────────────────────────┘  │
│                              [↓ Xuất Excel/PDF]      │
└──────────────────────────────────────────────────────┘
```

**Components:** DateRangePicker, Select lớp, Select số lượng top (5/10/20/50), Button Xem, Horizontal bar chart (tên + số lượt), Bảng xếp hạng (icon huy chương top 3), Button Xuất.

**API:**
- `GET /api/v1/library/reports/top-borrowers?from=&to=&class=&limit=` — xếp hạng mượn nhiều.
- `GET /api/v1/library/reports/top-borrowers/export` — xuất file.

---

## Phụ lục: Bảng tổng hợp API

| Endpoint | Method | Màn hình sử dụng |
|----------|--------|-----------------|
| `/library/readers/lookup` | GET | SCR-001 |
| `/library/items/lookup` | GET | SCR-002 |
| `/library/loans` | POST | SCR-003 |
| `/library/loans/active` | GET | SCR-010 |
| `/library/returns` | POST | SCR-010 |
| `/library/fines` | POST | SCR-011 |
| `/library/loans` (active) | GET | SCR-020 |
| `/library/loans/{id}/renew` | PATCH | SCR-020 |
| `/library/overdue` | GET | SCR-030 |
| `/library/overdue/notify` | POST | SCR-030 |
| `/library/overdue/{id}` | GET/PATCH | SCR-031 |
| `/library/reports/entry` | GET | SCR-041 |
| `/library/reports/active-loans` | GET | SCR-042 |
| `/library/reports/history` | GET | SCR-043 |
| `/library/reports/overdue` | GET | SCR-044 |
| `/library/reports/lockers` | GET | SCR-045 |
| `/library/reports/top-borrowers` | GET | SCR-046 |
