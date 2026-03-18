# Quản Lý Điểm Danh — Role: Giáo viên

## Mục tiêu
Cho phép giáo viên xem kết quả điểm danh được nhận diện tự động bởi hệ thống AI camera/máy chấm công, thực hiện xác nhận hàng loạt hoặc điều chỉnh từng trường hợp ngoại lệ, và theo dõi báo cáo chuyên cần lớp — biến công việc điểm danh từ 10-15 phút thủ công mỗi tiết xuống còn < 60 giây xác nhận.

## Người dùng
- **Giáo viên bộ môn**: Xem và xác nhận kết quả điểm danh của tiết dạy mình, điều chỉnh trường hợp camera nhận diện sai.
- **Giáo viên chủ nhiệm**: Xem tổng hợp chuyên cần lớp từ tất cả GV bộ môn, xuất báo cáo chuyên cần, gửi thông báo liên quan tới phụ huynh.

---

## User Flow Chính

### Flow 1: Xác nhận điểm danh sau tiết dạy (1-click bulk confirm)
**Mô tả**: Sau khi kết thúc tiết học, GV nhận thông báo "Tiết 1 - 11A2 đã có kết quả điểm danh" và xác nhận.
**Trigger**: Camera AI hoàn tất nhận diện → Hệ thống push thông báo tới GV đang dạy tiết đó.
**Steps**:
1. GV nhận thông báo push: "Điểm danh Tiết 1 — Lớp 11A2 đã sẵn sàng. Vắng: 2 HS, Muộn: 1 HS."
2. GV bấm thông báo → mở màn hình điểm danh tiết đó.
3. Hệ thống hiển thị 3 nhóm:
   - ✅ **Có mặt đúng giờ** (ảnh thumbnail nhận diện, độ tin cậy %)
   - ⏰ **Đến muộn** (thời điểm vào lớp)
   - ❌ **Vắng** (không ghi nhận)
4. GV scan qua danh sách. Nếu AI nhận diện chính xác → bấm **"Xác nhận tất cả"**.
5. Hệ thống lưu kết quả, gắn dấu "GV đã xác nhận" lên toàn bộ tiết.
6. Thông báo biến khỏi danh sách chờ xác nhận của GV.
**Expected Result**: Toàn bộ điểm danh tiết học được xác nhận trong < 30 giây.

---

### Flow 2: Điều chỉnh điểm danh khi AI nhận diện sai
**Mô tả**: AI nhận diện nhầm HS hoặc bỏ sót HS do camera góc khuất — GV sửa thủ công.
**Trigger**: GV xem danh sách điểm danh và phát hiện sai lệch.
**Steps**:
1. GV bấm vào tên HS cần điều chỉnh → panel điều chỉnh hiện ra.
2. Panel hiển thị: Ảnh AI nhận diện (nếu có), Trạng thái hiện tại (Vắng/Có mặt/Muộn).
3. GV chọn trạng thái đúng: **Có mặt / Vắng có phép / Vắng không phép / Đến muộn X phút**.
4. Nhập lý do điều chỉnh (bắt buộc): Dropdown chọn nhanh (Camera bị lỗi / HS có giấy phép / Ngồi góc khuất / Khác...).
5. Bấm **"Lưu điều chỉnh"** → hệ thống ghi log thay đổi: ai điều chỉnh, lúc nào, từ trạng thái nào → trạng thái nào.
6. Nếu thay đổi từ "Có mặt" → "Vắng": hệ thống hỏi "Có cần thông báo phụ huynh không?" (GVCN).
**Expected Result**: Sửa điểm danh 1 HS trong < 15 giây, có audit trail đầy đủ.

---

### Flow 3: Điểm danh thủ công khi hệ thống AI gặp sự cố
**Mô tả**: Camera hoặc máy chấm công bị lỗi — GV điểm danh thủ công trên app.
**Trigger**: Hệ thống gửi cảnh báo "Camera phòng 201 offline" tới GV bộ môn.
**Steps**:
1. GV vào màn hình điểm danh tiết đó → thấy trạng thái "Chờ điểm danh thủ công".
2. Danh sách HS hiện đầy đủ, mặc định tất cả là "Chưa điểm danh".
3. GV bấm từng HS hoặc dùng quick mode:
   - **Quick mode**: Mặc định tất cả "Có mặt" → GV chỉ bấm vào HS vắng.
   - **Manual mode**: Bấm từng HS, chọn trạng thái.
4. GV có thể dùng tính năng quét QR code trên thẻ HS (nếu trường có thẻ QR).
5. Bấm "Xác nhận" → điểm danh được lưu với ghi chú "Điểm danh thủ công — Camera offline".
**Expected Result**: GV điểm danh thủ công cả lớp 35 HS trong < 3 phút.

---

### Flow 4: Xem báo cáo chuyên cần lớp chủ nhiệm
**Mô tả**: GVCN xem, phân tích và xuất báo cáo chuyên cần lớp trong tháng/kỳ.
**Trigger**: GVCN vào module Điểm danh → chọn tab "Báo cáo chuyên cần".
**Steps**:
1. Chọn lớp chủ nhiệm (hoặc tất cả lớp phụ trách).
2. Chọn khoảng thời gian: Tuần này / Tháng này / Học kỳ / Tùy chọn.
3. Màn hình hiển thị:
   - **Bảng nhiệt (Heatmap)**: Ngày × HS, màu xanh/đỏ/vàng.
   - **Bảng tổng hợp**: HS, Số ngày vắng có phép, vắng không phép, đi muộn, tỷ lệ CC%.
   - **Biểu đồ trend**: Tỷ lệ chuyên cần của lớp theo tuần.
4. Click vào ô đỏ cụ thể → xem chi tiết: tiết nào, môn gì, GV bộ môn đã xác nhận chưa.
5. GVCN bấm **"Xuất báo cáo"** → chọn định dạng Excel / PDF → tải về.
6. Nút **"Gửi cảnh báo"**: GVCN chọn HS có CC < 80% → gửi thông báo tới phụ huynh với dữ liệu chi tiết.
**Expected Result**: GVCN có báo cáo chuyên cần đầy đủ mà không cần gom dữ liệu từ nhiều GV bộ môn.

---

### Flow 5: Xử lý đơn xin phép vắng
**Mô tả**: HS/PH gửi đơn xin nghỉ, GV duyệt và cập nhật trạng thái điểm danh.
**Trigger**: HS hoặc PH submit đơn xin nghỉ qua app → GV nhận thông báo.
**Steps**:
1. GV nhận thông báo: "Phụ huynh HS Trần Thị B xin phép nghỉ ngày 20/3/2026 — Lý do: Bệnh."
2. GV mở đơn → xem: Tên HS, Lớp, Ngày nghỉ, Lý do, File đính kèm (giấy khám bệnh nếu có).
3. GV duyệt: **Chấp thuận** / **Từ chối** / **Cần bổ sung**.
4. Nếu Chấp thuận → hệ thống tự cập nhật trạng thái điểm danh ngày đó sang "Vắng có phép".
5. HS và PH nhận thông báo kết quả xử lý.
**Expected Result**: Quy trình xin phép vắng hoàn toàn số hóa, không cần giấy tờ vật lý.

---

## Tính năng & Màn hình

### Màn hình 1: Danh sách tiết cần xác nhận
```
┌─────────────────────────────────────────────────────────┐
│  📋 Điểm danh hôm nay — 17/03/2026        [Lịch sử]    │
├─────────────────────────────────────────────────────────┤
│  🔴 Tiết 1 | 11A2 | Toán | 07:00        CHƯA XÁC NHẬN  │
│     Có mặt: 33 | Vắng: 2 (Trần B, Lê C) | Muộn: 0     │
│     [Xem chi tiết]              [✓ Xác nhận tất cả]    │
├─────────────────────────────────────────────────────────┤
│  🔴 Tiết 3 | 12B1 | Toán | 09:00        CHƯA XÁC NHẬN  │
│     Có mặt: 31 | Vắng: 1 (Phạm D) | Muộn: 1 (Hoàng E) │
│     [Xem chi tiết]              [✓ Xác nhận tất cả]    │
├─────────────────────────────────────────────────────────┤
│  ✅ Tiết 5 | 10C3 | Toán | 13:00          ĐÃ XÁC NHẬN  │
│     Có mặt: 36 | Vắng: 0 | Muộn: 0                    │
│     Xác nhận lúc 13:52 — Đúng giờ                      │
├─────────────────────────────────────────────────────────┤
│                       [✓ Xác nhận tất cả tiết hôm nay] │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 2: Chi tiết điểm danh một tiết
```
┌─────────────────────────────────────────────────────────┐
│  Tiết 1 — Lớp 11A2 — Toán — 07:00 ngày 17/03/2026      │
│  AI Camera P.201 | Độ tin cậy nhận diện: 97.2%         │
├────────────────────────┬────────────────────────────────┤
│  CÓ MẶT (33 HS)        │  HS NỔI BẬT                   │
│  [ảnh] Nguyễn V.A ✓   │  ❌ Trần Thị B — VẮNG         │
│  [ảnh] Lê Thị C ✓     │  🕐 Hoàng Văn E — MUỘN 7 phút │
│  [ảnh] ...            │  ❌ Lê Văn F — VẮNG            │
│                        │                                │
│                        │  [Điều chỉnh từng HS ↕]       │
├────────────────────────┴────────────────────────────────┤
│  [Điều chỉnh thủ công]          [✓ Xác nhận tất cả]   │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 3: Heatmap chuyên cần (GVCN)
```
┌─────────────────────────────────────────────────────────┐
│  Chuyên cần Lớp 11A2 — Tháng 3/2026                    │
│  [Tuần này] [Tháng này] [HK2] [Tùy chọn: 01/3-17/3]   │
├──────────┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┤
│  HS\Ngày │3 │4 │5 │6 │7 │10│11│12│13│14│17│..│..│..│  │
├──────────┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
│ Nguyễn A │🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│  │  │  │  │
│ Trần B   │🟢│🟢│🟡│🟢│🔴│🟢│🟢│🔴│🔴│🟢│🔴│  │  │  │  │
│ Lê C     │🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│🟢│  │  │  │  │
├──────────┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┤
│  🟢 Có mặt  🟡 Muộn  🔴 Vắng  ⬜ Chủ nhật/Lễ          │
│  [Xuất Excel] [Xuất PDF] [Gửi cảnh báo PH]             │
└─────────────────────────────────────────────────────────┘
```

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Xác nhận tất cả tiết | Bấm "Xác nhận tất cả" | Bulk confirm mọi tiết chưa xác nhận hôm nay |
| Xác nhận 1 tiết | Bấm "✓ Xác nhận" trên 1 hàng | Tiết đó được xác nhận |
| Điều chỉnh 1 HS | Bấm tên HS → sửa trạng thái | Log thay đổi, lưu lý do |
| Điểm danh thủ công | Bấm "Điểm danh thủ công" | Mở giao diện quick-tick toàn lớp |
| Duyệt đơn phép | Bấm thông báo đơn phép → Duyệt | Cập nhật tự động trạng thái vắng → vắng có phép |
| Xuất báo cáo chuyên cần | Bấm "Xuất báo cáo" | Tải Excel/PDF |
| Gửi cảnh báo phụ huynh | Chọn HS CC < 80% → Gửi | Thông báo tự động kèm dữ liệu chi tiết |
| Xem lịch sử chỉnh sửa | Bấm "Xem log" trên tiết đã xác nhận | Audit trail đầy đủ |

---

## Gom nhóm tính năng thông minh

**Smart Confidence Flag**: AI đánh dấu các nhận diện có độ tin cậy < 85% bằng icon ⚠️ vàng — GV chú ý xem lại những HS này thay vì xem toàn bộ.

**Cảnh báo thông minh**:
- HS vắng 2 ngày liên tiếp → hệ thống tự gửi cảnh báo cho GVCN.
- HS vắng ≥ 3 buổi/tháng không phép → GVCN nhận alert "Cần liên hệ phụ huynh".
- Tiết chưa xác nhận sau 4 giờ → nhắc GV bộ môn.

**Điểm danh ngoại lệ được nhớ**: Nếu HS A hay đến muộn vì lý do xe buýt (GV đã note), hệ thống hiển thị note đó khi GV điều chỉnh tiết tiếp theo — không phải gõ lại lý do.

---

## Edge Cases & Validation

- **Camera nhận diện nhầm 2 HS (mặt giống nhau)**: Hiển thị ảnh thumbnail cả 2 HS để GV phân biệt thủ công.
- **HS đeo khẩu trang / đổi kiểu tóc**: AI đánh độ tin cậy thấp → tự động đưa vào danh sách ⚠️ cần GV xem lại.
- **Điện cúp, camera không ghi được**: Tiết đó ở trạng thái "Camera offline — Chờ điểm danh thủ công". Hệ thống không hiện kết quả AI sai.
- **GV không xác nhận trong 24 giờ**: Hệ thống tự "pending xác nhận", GVCN có thể xác nhận thay, hoặc phòng đào tạo tự lock sau 48h.
- **Xác nhận nhầm — muốn sửa sau khi đã confirm**: Cho phép chỉnh sửa trong vòng 48 giờ sau khi xác nhận, sau đó cần xin phép BGH.
- **HS đặc biệt (khuyết tật, không nhận diện được)**: GV gắn flag "Điểm danh thủ công luôn" cho HS đó — hệ thống bỏ qua AI cho HS này.
- **Nhiều GV cùng 1 phòng (chia ca)**: Hệ thống tách điểm danh theo tiết/GV, không gộp chung.

---

## Tích hợp

- **Module QL Chấm công**: Nhận kết quả nhận diện khuôn mặt realtime từ AI camera tại cổng trường / cửa lớp, dữ liệu từ máy chấm công thẻ từ.
- **Module QL Đào tạo**: Lấy danh sách HS chính thức theo lớp/tiết, lịch học theo thời khóa biểu.
- **Module Thông báo**: Gửi alert cho GV (cần xác nhận), GVCN (cảnh báo chuyên cần), PH (HS vắng nhiều).
- **Module Kết quả học tập**: Điểm chuyên cần tích hợp vào bảng điểm tổng hợp (nếu trường tính điểm rèn luyện dựa vào CC).
- **Module QL Đào tạo — Điểm rèn luyện**: Vắng không phép trừ điểm rèn luyện theo quy chế trường.
- **Audit Log Service**: Ghi lại mọi thay đổi điểm danh với timestamp, user thực hiện.
