---
title: "WF-09a2: Thư viện – Báo cáo tài liệu & Bạn đọc"
cluster: "Digital Library - Admin / Reports & Readers"
updated: 2026-03-11
---

## NHÓM 1 – BÁO CÁO THỐNG KÊ TÀI LIỆU

---

### S01 – Báo cáo thống kê tài liệu (Hub)

> Màn hình trung tâm chọn tiêu chí & loại báo cáo tài liệu.

```
┌─────────────────────────────────────────────┐
│ 📊 Báo cáo thống kê tài liệu                │
├─────────────────────────────────────────────┤
│ Loại báo cáo:  [▼ Chọn loại báo cáo      ] │
│   ○ Theo dạng tài liệu                       │
│   ○ Theo vật mang tin                        │
│   ○ Theo thời gian bổ sung  [Từ][  ] [Đến][ ]│
│   ○ Theo ngôn ngữ           [▼ Ngôn ngữ   ] │
├─────────────────────────────────────────────┤
│              [Xem báo cáo]  [Xuất Excel]    │
└─────────────────────────────────────────────┘
```

**Components:** RadioGroup (loại BC), DateRangePicker, Select (ngôn ngữ), Button `Xem báo cáo`, Button `Xuất Excel`
**API:** `GET /api/library/reports/documents?type=&from=&to=&lang=`

---

### S02 – Kết quả báo cáo tài liệu

> Hiển thị bảng + biểu đồ kết quả sau khi chạy báo cáo.

```
┌──────────────────────────────────────────────────┐
│ Kết quả: Theo dạng tài liệu          [◀ Quay lại]│
├────────────────┬──────────┬──────────┬────────────┤
│ Dạng tài liệu  │ Tổng số  │ Số bản   │ Tỉ lệ %   │
├────────────────┼──────────┼──────────┼────────────┤
│ Sách           │   1,240  │   3,820  │   58.3%   │
│ Luận văn       │     430  │     430  │   20.2%   │
│ Tạp chí        │     310  │   1,200  │   14.6%   │
│ Tài liệu số    │     147  │     147  │    6.9%   │
├────────────────┼──────────┼──────────┼────────────┤
│ Tổng           │   2,127  │   5,597  │  100.0%   │
└────────────────┴──────────┴──────────┴────────────┘
│ [Biểu đồ cột / tròn ····················]         │
└──────────────────────────────────────────────────┘
```

**Components:** Table (sortable), Chart (Bar/Pie toggle), Pagination, Button `Xuất Excel`, Button `In`
**API:** `GET /api/library/reports/documents/result?type=doc_type`

---

## NHÓM 2 – HỒ SƠ BẠN ĐỌC

---

### S03 – Danh sách nhóm bạn đọc

> Quản lý nhóm bạn đọc; điểm vào để tạo mới hoặc chỉnh sửa nhóm.

```
┌────────────────────────────────────────────────┐
│ Nhóm bạn đọc                  [+ Thêm nhóm]   │
├──────┬──────────────────┬────────────┬──────────┤
│ STT  │ Tên nhóm         │ Số BD      │ Thao tác │
├──────┼──────────────────┼────────────┼──────────┤
│  1   │ Sinh viên ĐH     │    842     │ ✏ 🗑     │
│  2   │ Học viên SĐH     │    215     │ ✏ 🗑     │
│  3   │ Cán bộ GV        │    130     │ ✏ 🗑     │
│  4   │ Bên ngoài        │     47     │ ✏ 🗑     │
└──────┴──────────────────┴────────────┴──────────┘
```

**Components:** Table, Button `Thêm nhóm`, IconButton `Sửa/Xóa`, ConfirmDialog (xóa)
**API:** `GET /api/library/reader-groups` · `DELETE /api/library/reader-groups/:id`

---

### S04 – Form tạo / sửa nhóm bạn đọc

> Modal nhập tên nhóm, mô tả, thời hạn thẻ mặc định.

```
┌──────────────────────────────────────────┐
│ Thêm nhóm bạn đọc                  [✕]  │
├──────────────────────────────────────────┤
│ Tên nhóm *   [________________________] │
│ Mô tả        [________________________] │
│ Thời hạn thẻ [__] tháng                 │
│ Trạng thái   (●) Hoạt động  (○) Khóa    │
├──────────────────────────────────────────┤
│              [Hủy]        [Lưu]          │
└──────────────────────────────────────────┘
```

**Components:** Modal, Input (tên, mô tả), NumberInput (thời hạn), RadioGroup (trạng thái), Button `Lưu/Hủy`, inline validation
**API:** `POST /api/library/reader-groups` · `PUT /api/library/reader-groups/:id`

---

### S05 – Danh sách bạn đọc

> Tra cứu, lọc bạn đọc; điểm vào tạo mới hoặc xem chi tiết.

```
┌────────────────────────────────────────────────────────┐
│ Hồ sơ bạn đọc                         [+ Thêm mới]    │
├───────────────┬──────────────┬─────────────────────────┤
│ [🔍 Tìm tên/mã bạn đọc  ]  [▼ Nhóm]  [▼ Trạng thái] │
├───────┬───────────┬──────────┬──────────┬──────────────┤
│ Mã BD │ Họ tên    │ Nhóm     │ Hết hạn  │ Thao tác     │
├───────┼───────────┼──────────┼──────────┼──────────────┤
│ BD001 │ Nguyễn A  │ SV ĐH    │ 12/2026  │ 👁 ✏ 🗑     │
│ BD002 │ Trần B    │ CBGV     │ 06/2026  │ 👁 ✏ 🗑     │
├───────┴───────────┴──────────┴──────────┴──────────────┤
│ Tổng: 1,234 bạn đọc               [< 1 2 3 ... >]     │
└────────────────────────────────────────────────────────┘
```

**Components:** SearchInput, Select (nhóm, trạng thái), Table (sortable), Pagination, IconButton `Xem/Sửa/Xóa`
**API:** `GET /api/library/readers?q=&group=&status=&page=`

---

### S06 – Form thêm mới / sửa bạn đọc

> Nhập đầy đủ hồ sơ; upload ảnh; gán nhóm.

```
┌──────────────────────────────────────────────────┐
│ Thêm mới bạn đọc                           [✕]  │
├─────────────────────────────┬────────────────────┤
│ Họ và tên *  [____________] │  [  Ảnh thẻ   ]   │
│ Mã BD *      [____________] │  [  📷 Upload ]   │
│ Nhóm *       [▼ Chọn nhóm] │                    │
│ Ngày sinh    [dd/mm/yyyy  ] │                    │
│ Giới tính    (●)Nam (○)Nữ  │                    │
│ Đơn vị       [____________] │                    │
│ Email        [____________] │                    │
│ Điện thoại   [____________] │                    │
│ Ngày cấp *   [dd/mm/yyyy  ] │                    │
│ Ngày hết hạn [dd/mm/yyyy  ] │                    │
├─────────────────────────────┴────────────────────┤
│                     [Hủy]        [Lưu]            │
└──────────────────────────────────────────────────┘
```

**Components:** Input (× 7), DatePicker (× 3), Select (nhóm), RadioGroup (giới tính), ImageUpload, Button `Lưu/Hủy`, inline validation
**API:** `POST /api/library/readers` · `PUT /api/library/readers/:id` · `POST /api/library/readers/upload-photo`

---

## NHÓM 3 – IN THẺ BẠN ĐỌC

---

### S07 – Danh sách mẫu thẻ bạn đọc

> Quản lý các template thẻ; điểm vào tạo mẫu mới hoặc in thẻ.

```
┌──────────────────────────────────────────────────┐
│ Mẫu thẻ bạn đọc                  [+ Tạo mẫu]   │
├──────┬──────────────────┬─────────┬──────────────┤
│ STT  │ Tên mẫu          │ Kích cỡ │ Thao tác     │
├──────┼──────────────────┼─────────┼──────────────┤
│  1   │ Thẻ chuẩn 2026   │ 85×54mm │ 👁 ✏ 🖨 🗑  │
│  2   │ Thẻ tạm thời     │ 85×54mm │ 👁 ✏ 🖨 🗑  │
└──────┴──────────────────┴─────────┴──────────────┘
```

**Components:** Table, Button `Tạo mẫu`, IconButton `Xem/Sửa/In/Xóa`
**API:** `GET /api/library/card-templates` · `DELETE /api/library/card-templates/:id`

---

### S08 – Form tạo / sửa mẫu thẻ

> Thiết kế layout thẻ: logo, trường thông tin, màu nền, kích thước.

```
┌────────────────────────────────────────────────────┐
│ Tạo mẫu thẻ bạn đọc                         [✕]  │
├─────────────────────────┬──────────────────────────┤
│ Tên mẫu *  [__________] │  ┌── Xem trước ────────┐ │
│ Kích thước [▼ 85×54mm ] │  │ [LOGO] THƯ VIỆN     │ │
│ Hướng      (●)Ngang(○)Đứng│ │ Họ tên: ___         │ │
│ Màu nền    [🎨 #FFFFFF ] │  │ Mã BD : ___  [Ảnh] │ │
│ Hiện trường:            │  │ HH    : ___         │ │
│  ☑ Ảnh  ☑ Mã BD        │  └─────────────────────┘ │
│  ☑ Họ tên  ☑ Hết hạn   │                           │
│  ☐ Đơn vị  ☐ QR code   │                           │
├─────────────────────────┴──────────────────────────┤
│                        [Hủy]         [Lưu mẫu]     │
└────────────────────────────────────────────────────┘
```

**Components:** Input (tên), Select (kích thước), RadioGroup (hướng), ColorPicker, CheckboxGroup (trường hiển thị), LivePreview, Button `Lưu/Hủy`
**API:** `POST /api/library/card-templates` · `PUT /api/library/card-templates/:id`

---

### S09 – In thẻ bạn đọc

> Chọn mẫu thẻ + bạn đọc cần in; xem trước; gửi lệnh in.

```
┌──────────────────────────────────────────────────────┐
│ In thẻ bạn đọc                                       │
├──────────────────────────────────────────────────────┤
│ Mẫu thẻ    [▼ Thẻ chuẩn 2026               ]        │
│ Chọn BD    [🔍 Tìm tên/mã...  ] [+ Thêm từ DS]      │
├────────────────────────────────────────────────────  │
│ ☑ BD001 – Nguyễn Văn A – SV ĐH                      │
│ ☑ BD002 – Trần Thị B  – CBGV                         │
│ ☐ BD003 – Lê Văn C    – SV ĐH                        │
├──────────────────────────────────────────────────────┤
│ Đã chọn: 2 thẻ        [Xem trước]     [🖨 In thẻ]   │
└──────────────────────────────────────────────────────┘
```

**Components:** Select (mẫu thẻ), SearchInput, CheckboxList (bạn đọc), Badge (đã chọn), Button `Xem trước` (modal PDF), Button `In thẻ`
**API:** `GET /api/library/card-templates/:id/preview` · `POST /api/library/cards/print` (body: `{templateId, readerIds[]}`)

---

## NHÓM 4 – BÁO CÁO THỐNG KÊ BẠN ĐỌC

---

### S10 – Báo cáo thống kê bạn đọc (Hub)

> Màn hình chọn loại thống kê; chia 3 nhánh: tổng hợp / cấp mới / sắp hết hạn.

```
┌────────────────────────────────────────────────┐
│ 📋 Báo cáo thống kê bạn đọc                   │
├────────────────────────────────────────────────┤
│ Loại thống kê:                                 │
│  ○ Thống kê tổng hợp                           │
│     Tiêu chí: [▼ Nhóm / Trạng thái / Giới tính│
│               / Đơn vị / Thời gian đăng ký ]   │
│  ○ Thống kê cấp mới   Kỳ: [Từ][  ] [Đến][  ] │
│  ○ Thống kê sắp hết hạn   Trong: [__] ngày    │
├────────────────────────────────────────────────┤
│               [Thực hiện thống kê]             │
└────────────────────────────────────────────────┘
```

**Components:** RadioGroup (loại TK), Select (tiêu chí tổng hợp), DateRangePicker, NumberInput (ngày), Button `Thực hiện thống kê`
**API:** `GET /api/library/reports/readers?type=summary|new|expiring&criteria=&from=&to=&days=`

---

### S11 – Kết quả: Thống kê tổng hợp bạn đọc

> Bảng phân loại bạn đọc theo tiêu chí đã chọn + biểu đồ.

```
┌──────────────────────────────────────────────────────┐
│ Thống kê tổng hợp – Theo nhóm        [◀ Quay lại]   │
├──────────────────┬────────────┬────────────┬─────────┤
│ Nhóm             │ Hoạt động  │ Hết hạn    │ Tổng    │
├──────────────────┼────────────┼────────────┼─────────┤
│ Sinh viên ĐH     │    780     │     62     │   842   │
│ Học viên SĐH     │    198     │     17     │   215   │
│ Cán bộ GV        │    128     │      2     │   130   │
│ Bên ngoài        │     40     │      7     │    47   │
├──────────────────┼────────────┼────────────┼─────────┤
│ Tổng             │  1,146     │     88     │ 1,234   │
└──────────────────┴────────────┴────────────┴─────────┘
│ [Biểu đồ cột / tròn ·····················]           │
│                          [Xuất Excel]  [In báo cáo]  │
└──────────────────────────────────────────────────────┘
```

**Components:** Table, Chart (Bar/Pie toggle), Button `Xuất Excel`, Button `In báo cáo`
**API:** `GET /api/library/reports/readers/result?type=summary&criteria=group`

---

### S12 – Kết quả: Cấp mới & Sắp hết hạn

> Bảng danh sách bạn đọc cấp mới theo kỳ hoặc sắp hết hạn theo ngưỡng ngày.

```
┌──────────────────────────────────────────────────────────┐
│ Thống kê cấp mới  01/01/2026 – 11/03/2026  [◀ Quay lại] │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│ Thống kê sắp hết hạn  Trong 30 ngày tới  [◀ Quay lại]   │
├──────┬─────────────┬──────────┬──────────┬───────────────┤
│ Mã BD│ Họ tên      │ Nhóm     │ Ngày cấp │ Hết hạn       │
├──────┼─────────────┼──────────┼──────────┼───────────────┤
│BD150 │ Phạm Thị D  │ SV ĐH    │15/01/26  │ 15/01/2027    │
│BD151 │ Hoàng Văn E │ SĐH      │20/02/26  │ 20/02/2027    │
├──────┴─────────────┴──────────┴──────────┴───────────────┤
│ Tổng: 87 bạn đọc              [< 1 2 >]  [Xuất Excel]   │
└──────────────────────────────────────────────────────────┘
```

**Components:** Table (sortable), Pagination, Badge (trạng thái hết hạn), Button `Xuất Excel`, Button `Gia hạn` (inline, màn sắp hết hạn)
**API:** `GET /api/library/reports/readers/result?type=new&from=&to=` · `GET /api/library/reports/readers/result?type=expiring&days=30`

---

## INDEX

| Mã  | Màn hình                          | Nhóm                  |
|-----|-----------------------------------|-----------------------|
| S01 | Hub báo cáo tài liệu              | BC Tài liệu           |
| S02 | Kết quả báo cáo tài liệu          | BC Tài liệu           |
| S03 | Danh sách nhóm bạn đọc            | Hồ sơ bạn đọc         |
| S04 | Form tạo / sửa nhóm               | Hồ sơ bạn đọc         |
| S05 | Danh sách bạn đọc                 | Hồ sơ bạn đọc         |
| S06 | Form thêm mới / sửa bạn đọc       | Hồ sơ bạn đọc         |
| S07 | Danh sách mẫu thẻ                 | In thẻ                |
| S08 | Form tạo / sửa mẫu thẻ            | In thẻ                |
| S09 | In thẻ bạn đọc                    | In thẻ                |
| S10 | Hub báo cáo bạn đọc               | BC Bạn đọc            |
| S11 | Kết quả: Tổng hợp bạn đọc         | BC Bạn đọc            |
| S12 | Kết quả: Cấp mới & Sắp hết hạn    | BC Bạn đọc            |
