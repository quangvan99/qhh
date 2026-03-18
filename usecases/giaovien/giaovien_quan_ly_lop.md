# Quản Lý Lớp Học — Role: Giáo viên

## Mục tiêu
Cho phép giáo viên nắm toàn diện thông tin về các lớp mình phụ trách: danh sách học sinh, tình trạng học tập, chuyên cần và liên lạc — tất cả trong một màn hình thống nhất, giúp GV ra quyết định kịp thời và cá nhân hóa việc hỗ trợ từng HS.

## Người dùng
- **Giáo viên bộ môn**: Xem danh sách HS của lớp đang dạy môn đó, điểm số, tiến độ học online, tỷ lệ chuyên cần theo môn.
- **Giáo viên chủ nhiệm**: Có thêm quyền xem toàn bộ điểm các môn của HS, liên lạc phụ huynh, ghi nhận sự kiện ngoài giờ học, xuất báo cáo lớp toàn diện.

---

## User Flow Chính

### Flow 1: Xem tổng quan lớp phụ trách
**Mô tả**: GV mở màn hình quản lý lớp, xem tổng quan tất cả lớp đang dạy trong kỳ.
**Trigger**: GV bấm vào menu "Quản lý lớp" hoặc bấm vào tên lớp từ dashboard.
**Steps**:
1. Màn hình hiển thị danh sách lớp GV đang phụ trách kỳ học hiện tại.
2. Mỗi thẻ lớp gồm: Tên lớp, Sĩ số, Môn dạy, Tiến độ học online (%), Tỷ lệ chuyên cần (%), số bài chưa nộp.
3. GV bấm vào thẻ lớp → vào màn hình chi tiết lớp.
4. Màn hình chi tiết có 4 tab: **Tổng quan | Danh sách HS | Lịch dạy | Tài liệu lớp**.
**Expected Result**: GV thấy ngay lớp nào đang có vấn đề (chuyên cần thấp, nhiều bài chưa nộp) chỉ qua scan thẻ lớp.

---

### Flow 2: Xem danh sách và hồ sơ từng học sinh
**Mô tả**: GV tìm kiếm, lọc và xem hồ sơ học tập chi tiết của từng HS.
**Trigger**: GV vào tab "Danh sách HS" của một lớp.
**Steps**:
1. Hiển thị bảng danh sách HS với cột: STT, Họ tên, MSSV, Ảnh, Điểm TB, Chuyên cần (%), Trạng thái (Bình thường / Cần chú ý / Nguy hiểm).
2. GV gõ tên/MSSV vào ô tìm kiếm → danh sách lọc realtime.
3. GV bấm lọc theo: "Chuyên cần < 80%" / "Chưa nộp bài" / "Điểm TB < 5.0" để phát hiện HS cần hỗ trợ.
4. Bấm tên HS → mở panel bên phải: ảnh, thông tin cá nhân, tab Điểm số / Chuyên cần / Bài tập / Lịch sử học online.
5. Panel HS có nút: "Nhắn tin" (gửi tin nhắn nội bộ) / "Báo cáo phụ huynh" (GVCN) / "Ghi chú GV" (ghi chú riêng, không HS thấy).
**Expected Result**: GV xem được toàn bộ hồ sơ học tập của HS trong < 5 giây, không cần hỏi phòng đào tạo.

---

### Flow 3: Theo dõi chuyên cần lớp chủ nhiệm
**Mô tả**: GVCN xem tổng hợp chuyên cần lớp trong tháng/học kỳ.
**Trigger**: GVCN vào tab "Tổng quan" → section Chuyên cần.
**Steps**:
1. Hệ thống hiển thị bảng nhiệt (heatmap) chuyên cần: ngày × HS, ô màu xanh = có mặt, đỏ = vắng, vàng = muộn.
2. GVCN lọc theo tuần/tháng/học kỳ.
3. Bấm vào ô đỏ của HS → xem lý do (nếu có), trạng thái xác nhận của GV bộ môn.
4. Bấm "Xuất báo cáo chuyên cần" → chọn định dạng Excel/PDF → tải về.
5. Nếu HS vắng > 3 buổi liên tiếp → hệ thống tự gắn tag "Cần liên hệ PH" và hiển thị cảnh báo cho GVCN.
**Expected Result**: GVCN có báo cáo chuyên cần lớp mà không cần tổng hợp thủ công từ nhiều sổ điểm danh.

---

### Flow 4: Gửi thông báo đến học sinh / phụ huynh
**Mô tả**: GV (chủ nhiệm hoặc bộ môn) gửi thông báo tới toàn lớp hoặc nhóm HS.
**Trigger**: GV bấm nút "Gửi thông báo" trong màn hình lớp.
**Steps**:
1. Modal mở ra: Tiêu đề, Nội dung (rich text), Gửi đến (Toàn lớp / Chọn HS / HS có chuyên cần < X% / HS chưa nộp bài Y).
2. Tùy chọn: Gửi đồng thời cho Phụ huynh (GVCN mới có quyền).
3. Đặt lịch gửi hoặc gửi ngay.
4. Xem lịch sử thông báo đã gửi trong tab "Tài liệu lớp".
**Expected Result**: GV liên lạc với HS/PH mà không cần dùng ứng dụng ngoài (Zalo, SMS), có lưu lịch sử.

---

## Tính năng & Màn hình

### Màn hình 1: Danh sách lớp phụ trách
```
┌─────────────────────────────────────────────────────────┐
│  📚 Lớp của tôi — Học kỳ 2, 2025-2026      [+ Kỳ khác] │
├──────────────┬──────────────┬──────────────┬────────────┤
│  11A2        │  12B1        │  10C3        │  ...       │
│  Môn: Toán   │  Môn: Toán   │  Môn: Toán   │            │
│  Sĩ số: 35   │  Sĩ số: 33   │  Sĩ số: 36   │            │
│  Online: 78% │  Online: 45% │  Online: 92% │            │
│  CC: 96%     │  CC: 88% ⚠️  │  CC: 99%     │            │
│  Chưa nộp: 2 │  Chưa nộp: 8 │  Chưa nộp: 0 │            │
│  [Vào lớp→]  │  [Vào lớp→]  │  [Vào lớp→]  │            │
└──────────────┴──────────────┴──────────────┴────────────┘
```

### Màn hình 2: Chi tiết lớp — Tab Tổng quan
**KPIs nổi bật**:
- Tổng sĩ số / Có mặt hôm nay / Vắng
- Điểm trung bình lớp (theo môn)
- Tỷ lệ hoàn thành bài tập kỳ này
- Số HS cần chú ý (màu đỏ/cam)

**Charts**:
- Biểu đồ đường: Điểm TB theo tuần (tracking cả kỳ)
- Biểu đồ cột: Tỷ lệ nộp bài theo từng bài tập
- Heatmap chuyên cần 30 ngày gần nhất

### Màn hình 3: Tab Danh sách HS

**Bảng HS**:
| STT | Ảnh | Họ tên | MSSV | Điểm TB | Chuyên cần | Bài chưa nộp | Trạng thái |
|-----|-----|--------|------|---------|-----------|--------------|-----------|
| 1 | 👤 | Nguyễn Văn A | 23001 | 7.8 | 98% | 0 | 🟢 Tốt |
| 2 | 👤 | Trần Thị B | 23002 | 4.2 | 75% | 3 | 🔴 Cần hỗ trợ |

**Thanh filter**:
- Lọc nhanh: [Tất cả] [Cần chú ý] [Chưa nộp bài] [Chuyên cần thấp]
- Tìm kiếm: tên / MSSV
- Sắp xếp: Tên / Điểm TB / Chuyên cần

**Panel chi tiết HS** (slide-in từ phải):
```
┌──────────────────────────────────┐
│  [Ảnh]  Nguyễn Văn An            │
│         Lớp 11A2 | MSSV: 23001   │
│         SĐT PH: 0905.xxx.xxx     │
├──────────────────────────────────┤
│  [Điểm số] [Chuyên cần] [Bài tập]│
│  [Lịch sử online] [Ghi chú GV]  │
├──────────────────────────────────┤
│  Điểm KT thường xuyên: 7.5       │
│  Điểm giữa kỳ: 6.0               │
│  Điểm cuối kỳ: chưa có           │
│  Điểm TB học kỳ: 6.8 (dự kiến)  │
├──────────────────────────────────┤
│  [Nhắn tin] [Ghi chú] [Báo PH]  │
└──────────────────────────────────┘
```

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Xem chi tiết lớp | Bấm thẻ lớp | Vào màn hình chi tiết 4 tab |
| Xem hồ sơ HS | Bấm tên HS trong bảng | Mở panel hồ sơ slide-in |
| Lọc HS cần chú ý | Bấm tag "Cần chú ý" | Bảng chỉ hiện HS có vấn đề |
| Nhắn tin HS | Bấm "Nhắn tin" trong panel HS | Mở chat nội bộ với HS đó |
| Ghi chú GV | Bấm "Ghi chú" → gõ nội dung | Lưu ghi chú riêng, HS không thấy |
| Gửi thông báo toàn lớp | Bấm "Gửi thông báo" | Modal soạn thông báo |
| Xuất danh sách | Bấm "Xuất Excel" | Tải file Excel danh sách HS + điểm |
| Xem kỳ học cũ | Dropdown "Kỳ khác" | Load lại dữ liệu kỳ đã chọn |

---

## Gom nhóm tính năng thông minh

**Phân loại HS tự động (Smart Alert)**:
- 🟢 **Tốt**: Chuyên cần ≥ 90%, Điểm TB ≥ 6.5, nộp đủ bài.
- 🟡 **Cần theo dõi**: Một trong ba chỉ số sụt giảm so với tuần trước.
- 🔴 **Cần hỗ trợ ngay**: Chuyên cần < 80% HOẶC Điểm TB < 5.0 HOẶC vắng 3 buổi liên tiếp.

**Nhóm HS nhanh** (Quick Groups):
- GV tạo nhóm tùy chỉnh (VD: "Nhóm học yếu", "Nhóm thi HSG") → giao bài tập riêng cho nhóm.
- Nhóm được lưu qua các kỳ, không phải tạo lại.

---

## Edge Cases & Validation

- **Lớp mới (đầu năm)**: Khi chưa có điểm/chuyên cần, hiển thị placeholder "Chưa có dữ liệu — Dạy tiết đầu tiên để bắt đầu ghi nhận."
- **HS chuyển lớp giữa kỳ**: Hệ thống gắn tag "Mới chuyển đến [ngày]", giữ lịch sử từ lớp cũ.
- **GV thay thế tạm thời**: GV thay thế chỉ xem được dữ liệu từ ngày được assign, không xem dữ liệu trước đó.
- **Sĩ số vượt 40**: Pagination danh sách HS, hiển thị 20 HS/trang.
- **Ảnh HS chưa có**: Hiển thị avatar mặc định với chữ cái đầu tên.
- **GVCN xem lớp không chủ nhiệm**: Chỉ xem được dữ liệu môn mình dạy, không thấy điểm môn khác.
- **Xuất file lớn (>100 HS)**: Hệ thống xử lý nền, gửi link tải về qua thông báo khi sẵn sàng.

---

## Tích hợp

- **Module QL Đào tạo**: Nguồn dữ liệu chính về danh sách HS, phân lớp, lịch học.
- **Module QL Chấm công**: Dữ liệu chuyên cần realtime từ hệ thống AI camera / máy chấm công.
- **Module E-learning & Thi**: Dữ liệu tiến độ khóa học, điểm bài tập, kết quả thi của HS.
- **Module Thông báo**: Gửi tin nhắn nội bộ GV↔HS, GV↔PH (qua app PH nếu có).
- **Hệ thống xác thực**: Phân quyền GVCN vs GV bộ môn, đảm bảo GV chỉ xem lớp mình phụ trách.
