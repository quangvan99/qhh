# Quản Lý Trường — Cơ Sở Vật Chất & Cấu Trúc Tổ Chức — Role: Admin

## Mục tiêu
Cho phép QTHT và CBQL thiết lập và duy trì toàn bộ cơ cấu tổ chức của trường: năm học, khối lớp, tổ bộ môn, phòng học, cơ sở vật chất — là nền tảng dữ liệu cho mọi module khác trong hệ thống.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền CRUD tất cả danh mục; nhân bản cấu hình năm học; xóa dữ liệu lỗi; quản lý cơ sở (nếu trường có nhiều cơ sở).
- **CBQL**: Xem cấu trúc trường; chỉnh sửa thông tin tổ bộ môn mình phụ trách; không được xóa năm học đang hoạt động; không thêm/sửa cơ sở vật chất hạ tầng.

---

## User Flow Chính

### Flow 1: Khởi tạo năm học mới
**Mô tả**: Đầu mỗi năm học, QTHT tạo cấu hình năm học mới, nhân bản cấu trúc từ năm trước.
**Trigger**: Menu "Quản lý trường" → Tab "Năm học" → Nút "Tạo năm học mới".
**Steps**:
1. Form "Tạo năm học" hiện ra: Tên năm học (VD: 2025-2026), ngày bắt đầu, ngày kết thúc, ngày khai giảng.
2. Checkbox **"Nhân bản cấu trúc từ năm học trước"**: tự động copy danh sách khối (10, 11, 12), tổ bộ môn, phòng học.
3. Hệ thống hiển thị **Preview diff**: "Sẽ tạo 3 khối, 12 lớp (placeholder), 8 tổ bộ môn, 42 phòng học".
4. QTHT xác nhận → hệ thống tạo năm học mới với trạng thái **"Chuẩn bị"**.
5. Banner hướng dẫn: "Tiếp theo: Phân lớp HS → Phân công GV → Kích hoạt năm học".
6. Nút **"Kích hoạt năm học"** chỉ hiện khi đã có ít nhất 1 lớp có danh sách HS.
7. Khi kích hoạt: năm học cũ chuyển sang **"Kết thúc"**, năm mới thành **"Đang hoạt động"**.
**Expected Result**: Năm học mới được thiết lập hoàn chỉnh trong < 5 phút với dữ liệu kế thừa từ năm cũ.

---

### Flow 2: Quản lý tổ bộ môn
**Mô tả**: QTHT tạo, chỉnh sửa tổ bộ môn và gán GV vào tổ.
**Trigger**: Menu "Quản lý trường" → Tab "Tổ bộ môn".
**Steps**:
1. Màn hình hiển thị danh sách tổ bộ môn dạng **Card Grid** (mỗi card: tên tổ, tổ trưởng, số GV, môn học phụ trách).
2. Nhấn **"+ Thêm tổ"** → Modal: Tên tổ, mô tả, chọn môn học, chọn tổ trưởng (dropdown GV).
3. Nhấn vào card tổ bộ môn → Panel bên phải mở ra hiển thị:
   - Danh sách GV trong tổ (avatar, tên, môn dạy, trạng thái)
   - Nút "Thêm GV vào tổ" (multi-select từ danh sách GV chưa thuộc tổ nào)
   - Nút "Xuất danh sách tổ"
4. Kéo-thả GV giữa các tổ (drag & drop giữa các card) để chuyển tổ nhanh.
5. Thay đổi tổ trưởng: click tên tổ trưởng → dropdown chọn GV khác trong tổ.
**Expected Result**: Cơ cấu tổ bộ môn rõ ràng, có thể chỉnh sửa trực tiếp không cần form phức tạp.

---

### Flow 3: Quản lý phòng học & cơ sở vật chất
**Mô tả**: QTHT quản lý phòng học, phòng chức năng, thiết bị gắn liền với phòng.
**Trigger**: Menu "Quản lý trường" → Tab "Cơ sở vật chất".
**Steps**:
1. Màn hình hiển thị **sơ đồ tòa nhà** dạng SVG tương tác (chọn tầng qua tab).
2. Mỗi phòng được tô màu theo trạng thái: Xanh = Đang dùng / Vàng = Bảo trì / Xám = Trống.
3. Click vào phòng → Popup chi tiết: Tên phòng, loại (phòng học/phòng máy/phòng lab), sức chứa, thiết bị, lớp đang dùng phòng này, lịch sử bảo trì.
4. Nhấn **"Chỉnh sửa"** trong popup → Form inline chỉnh sửa thông tin phòng.
5. Tab **"Danh sách"**: Bảng tất cả phòng với filter (loại phòng, tòa nhà, trạng thái) + tìm kiếm.
6. **Bulk action**: Chọn nhiều phòng → "Đánh dấu bảo trì" / "Gán lịch dọn dẹp".
7. Nhấn **"+ Thêm phòng"** → Form: Mã phòng, tên, tòa nhà, tầng, loại, sức chứa, mô tả thiết bị.
**Expected Result**: Admin nắm được tình trạng sử dụng toàn bộ cơ sở vật chất; cập nhật phòng học nhanh chóng.

---

### Flow 4: Cấu hình lịch học & học kỳ
**Mô tả**: Thiết lập cấu trúc thời gian của năm học (học kỳ, tuần, tiết học).
**Trigger**: Menu "Quản lý trường" → Tab "Lịch học & Học kỳ".
**Steps**:
1. Timeline view năm học hiển thị 2 học kỳ dạng thanh ngang với các cột mốc.
2. Click **"Thêm học kỳ"** → Form: Tên HK, ngày bắt đầu, ngày kết thúc, số tuần học.
3. Trong mỗi học kỳ, thiết lập **Khung giờ tiết học**: Tiết 1 (7:00-7:45), Tiết 2 (7:50-8:35)... (tối đa 10 tiết/ngày).
4. Thiết lập **ngày nghỉ lễ**: chọn ngày trên calendar → gán nhãn (Quốc khánh, Tết...) → hệ thống tự loại khỏi ngày học.
5. **"Kiểm tra xung đột"**: Hệ thống scan toàn bộ lịch → hiển thị danh sách ngày lỗi cần xử lý.
6. Xuất **"Khung kế hoạch năm học"** dạng PDF để trình ban giám hiệu.
**Expected Result**: Lịch học được thiết lập chính xác, phục vụ làm nền tảng cho thời khóa biểu và lịch thi.

---

## Tính năng & Màn hình

### Màn hình chính — Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Quản lý Trường | Năm học: [2025-2026 ▼] | [+ Tạo mới] │
├─────────────────────────────────────────────────────────────────┤
│ TABS: [Tổng quan] [Năm học] [Tổ bộ môn] [Cơ sở VCS] [Lịch học]│
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tab "Tổng quan":                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ 3 Khối    │ │ 36 Lớp    │ │ 8 Tổ BM   │ │ 42 Phòng  │  │
│  │ lớp       │ │ học        │ │            │ │ học        │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│                                                                   │
│  Sơ đồ tổ chức (org chart) trực quan                           │
│  Ban Giám Hiệu → Tổ Bộ Môn → Giáo Viên                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Tab Năm Học
- Danh sách năm học dạng timeline (horizontal scroll)
- Trạng thái: Đang hoạt động (xanh) | Kết thúc (xám) | Chuẩn bị (vàng)
- Mỗi năm học: click để xem/sửa chi tiết, nút nhân bản, nút kết thúc (có confirm)

### Tab Tổ Bộ Môn
- Card grid 3-4 cột, mỗi card có avatar tổ trưởng
- Click card → Side panel chi tiết danh sách GV
- Drag & drop GV giữa các tổ
- Nút "Xuất danh sách tổ bộ môn" → Excel

### Tab Cơ Sở Vật Chất
- Toggle: Sơ đồ tòa nhà | Danh sách bảng
- Sơ đồ: chọn tòa, chọn tầng, click phòng
- Danh sách: filter loại phòng, trạng thái; sort theo tên/sức chứa
- Bulk actions: bảo trì, gán lịch

### Tab Lịch Học & Học Kỳ
- Calendar view năm học
- Highlight các ngày lễ (màu đỏ), ngày bồi dưỡng (màu vàng)
- Bảng khung giờ tiết học (editable inline)

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Tạo năm học mới | Nút "+ Tạo năm học" | Form modal, nhân bản từ năm cũ |
| Sửa tên trường/địa chỉ | Click text inline | Edit trực tiếp, Enter để lưu |
| Thêm tổ bộ môn | Nút "+ Thêm tổ" | Modal form |
| Gán GV vào tổ | Multi-select dropdown | Cập nhật ngay, hiển thị trong card |
| Thêm phòng học | Nút "+ Thêm phòng" | Form đầy đủ |
| Đổi trạng thái phòng | Toggle trên popup phòng | Cập nhật màu sơ đồ ngay |
| Thêm ngày nghỉ | Click ô ngày trên calendar | Popup nhanh nhập tên ngày nghỉ |
| Xuất kế hoạch năm học | Nút "Xuất PDF" | Download file PDF |
| Kích hoạt năm học | Nút "Kích hoạt" (màu xanh) | Confirm dialog → chuyển trạng thái |
| Kết thúc năm học | Nút "Kết thúc năm học" | Confirm với cảnh báo + backup data |

---

## Gom nhóm tính năng thông minh
Module "Quản lý trường" gom tất cả **dữ liệu danh mục nền tảng** (master data) vào một nơi: năm học, tổ chức, không gian vật lý và thời gian. Lý do gom nhóm: mọi module khác (GV, HS, Thi, E-learning) đều **phụ thuộc** vào dữ liệu này — nếu tách rời sẽ gây ra vấn đề tham chiếu chéo phức tạp. Admin thiết lập một lần ở đây → dữ liệu được dùng xuyên suốt toàn hệ thống.

---

## Edge Cases & Validation
- **Trùng tên phòng**: Không cho phép 2 phòng có cùng mã phòng trong cùng tòa nhà.
- **Xóa năm học đang hoạt động**: Bị chặn; phải tạo năm học mới và kích hoạt trước.
- **Tổ bộ môn không có tổ trưởng**: Cảnh báo nhưng vẫn cho lưu (trạng thái "chưa có tổ trưởng").
- **Ngày học < 0**: Validate ngày kết thúc HK phải sau ngày bắt đầu ít nhất 30 ngày.
- **Kích hoạt năm học khi thiếu dữ liệu**: Block nếu chưa có lớp nào; hiển thị checklist những gì còn thiếu.
- **Xóa tổ bộ môn có GV**: Hỏi "Chuyển X GV sang tổ nào?" trước khi xóa.
- **Phòng đang được lớp sử dụng**: Không cho đổi sang "Bảo trì" nếu phòng có lịch học hôm nay; cảnh báo với lịch tiếp theo.
- **Nhân bản năm học**: Không nhân bản danh sách HS (chỉ nhân bản cấu trúc khối/tổ/phòng).
- **Học kỳ 3 / học bổ sung**: Hỗ trợ tạo học kỳ phụ với nhãn tùy chỉnh.

---

## Tích hợp
- **Kết nối với module**: QL Lớp học (dùng danh sách phòng), QL GV (gán vào tổ bộ môn), Thi trực tuyến (dùng phòng thi), Chấm công (camera gắn với phòng/tòa nhà).
- **Đồng bộ Sở GD&ĐT**: Danh mục cơ sở trường, mã trường, mã năm học phải khớp với hệ thống của Sở.
- **Export**: Kế hoạch năm học → PDF chuẩn trình ký; Danh sách tổ bộ môn → Excel báo cáo.
- **Import**: Hỗ trợ import danh sách phòng học từ Excel (template chuẩn); import ngày nghỉ lễ từ file ICS/CSV.
