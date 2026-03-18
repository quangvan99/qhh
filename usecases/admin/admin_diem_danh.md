# Quản Lý Điểm Danh — Camera AI & Thiết Bị Chấm Công — Role: Admin

## Mục tiêu
Cung cấp công cụ quản lý toàn diện hệ thống chấm công tự động: thiết bị máy quét, camera AI nhận diện khuôn mặt, dữ liệu khuôn mặt HS/GV, giám sát ra vào trường thời gian thực và báo cáo chuyên cần cho Ban giám hiệu.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền: thêm/cấu hình thiết bị, quản lý dữ liệu khuôn mặt, xem feed camera live, điều chỉnh log điểm danh, cấu hình ngưỡng cảnh báo.
- **CBQL**: Xem báo cáo điểm danh, xem danh sách vắng mặt, xem thống kê theo lớp/GV; không thể cấu hình thiết bị; không xem camera live (trừ khi được cấp quyền riêng); không chỉnh sửa log.

---

## User Flow Chính

### Flow 1: Thêm & cấu hình thiết bị mới
**Mô tả**: QTHT kết nối thiết bị chấm công hoặc camera AI mới vào hệ thống.
**Trigger**: Menu "Chấm công" → Tab "Thiết bị" → Nút **"+ Thêm thiết bị"**.
**Steps**:
1. Form **"Đăng ký thiết bị"**:
   - Loại thiết bị: Camera AI (nhận diện khuôn mặt) | Máy quét vân tay | Máy quét thẻ từ | Máy quét QR.
   - Tên thiết bị, mã serial, địa điểm lắp đặt (chọn từ danh sách phòng/khu vực đã định nghĩa).
   - Loại cổng: Cổng vào trường | Cổng ra | Cổng phụ | Cổng phòng học | Cổng phòng lab.
   - IP address hoặc dùng DHCP (auto-detect).
   - Chế độ chấm công: Chỉ vào | Chỉ ra | Cả hai chiều | In-Out tự động phân biệt.
2. Nhấn **"Kiểm tra kết nối"** → hệ thống ping thiết bị; hiển thị "✓ Kết nối thành công" hoặc lỗi chi tiết.
3. Nếu là camera AI: cấu hình thêm:
   - Ngưỡng nhận dạng (confidence threshold): mặc định 85%.
   - Chế độ ánh sáng: Ban ngày / Hồng ngoại đêm / Tự động.
   - Vùng nhận diện: vẽ bounding box trên preview camera.
4. Nhấn **"Lưu & Kích hoạt"** → thiết bị xuất hiện trên bản đồ cơ sở với trạng thái 🟢 Online.
5. Thiết bị tự đồng bộ dữ liệu khuôn mặt đã enroll từ server.
**Expected Result**: Thiết bị mới online và bắt đầu chấm công trong < 5 phút sau khi lắp đặt.

---

### Flow 2: Đăng ký khuôn mặt học sinh / giáo viên
**Mô tả**: QTHT đăng ký dữ liệu sinh trắc học để hệ thống camera có thể nhận diện.
**Trigger**: Menu "Chấm công" → Tab "Dữ liệu khuôn mặt" HOẶC từ hồ sơ HS/GV → Nút "Đăng ký khuôn mặt".
**Steps**:
1. Màn hình "Quản lý khuôn mặt" hiển thị:
   - Thống kê: X/Y HS đã đăng ký (progress bar), X/Y GV đã đăng ký.
   - Danh sách chưa đăng ký (highlight màu vàng).
2. **Đăng ký từng người**:
   - Chọn HS/GV từ danh sách.
   - Chụp ảnh qua webcam admin (tức thì tại văn phòng) hoặc upload ảnh chân dung.
   - Hệ thống phân tích ảnh: kiểm tra chất lượng (độ sáng, góc mặt, độ nét) → hiển thị điểm chất lượng.
   - Cho phép chụp lại nếu chất lượng thấp (< 70 điểm).
   - Lưu → hệ thống trích xuất face embedding và đồng bộ xuống tất cả camera AI.
3. **Đăng ký hàng loạt qua ảnh**:
   - Upload folder ảnh (ZIP) với quy tắc đặt tên: `[MaHS/MaGV]_[Hovaten].jpg`.
   - Hệ thống tự đối chiếu với database, phân tích chất lượng từng ảnh.
   - Report: "350 ảnh hợp lệ / 12 ảnh chất lượng kém (cần chụp lại) / 3 ảnh không khớp mã".
4. Sau khi đăng ký: đồng bộ xuống tất cả thiết bị trong 30 giây.
5. **Test nhận diện**: Tab "Kiểm tra" → chụp ảnh từ webcam → hệ thống cho biết nhận diện được ai với độ chính xác bao nhiêu.
**Expected Result**: 100% HS/GV có dữ liệu khuôn mặt; camera nhận diện chính xác > 95%.

---

### Flow 3: Giám sát điểm danh thời gian thực
**Mô tả**: QTHT/CBQL giám sát hoạt động ra vào trường trong ngày học.
**Trigger**: Menu "Chấm công" → Tab **"Giám sát trực tiếp"** hoặc widget Dashboard.
**Steps**:
1. Màn hình giám sát real-time (auto-refresh mỗi 30s hoặc WebSocket):
   - **Bản đồ trường**: SVG tương tác; mỗi cổng/điểm chấm công hiển thị số lượt vào/ra trong giờ.
   - **Feed sự kiện** (live scroll từ dưới lên): mỗi lượt chấm công xuất hiện: [Ảnh] Tên, lớp/chức vụ, giờ, cổng, chiều (vào/ra), trạng thái (Đúng giờ/Trễ/Sớm).
   - **KPI thời gian thực**: HS có mặt / HS vắng / GV có mặt / Cảnh báo đang chờ.
2. **Bộ lọc feed**: Theo loại (HS/GV), theo lớp, theo cổng, theo trạng thái (chỉ Trễ, chỉ Không nhận diện được).
3. **Cảnh báo tức thì**: Nếu camera phát hiện khuôn mặt lạ (không trong database) → alert đỏ bật lên.
4. **Xem live camera**: Click vào icon camera trên bản đồ → popup xem stream video thời gian thực (RTSP → HLS/WebRTC).
5. **Can thiệp thủ công**: Admin có thể click vào một sự kiện chấm công và "Điều chỉnh" (đổi trạng thái, thêm ghi chú lý do).
**Expected Result**: Admin nắm toàn bộ tình hình ra vào trường trong 1 màn hình; phát hiện bất thường ngay lập tức.

---

### Flow 4: Xem báo cáo điểm danh & xử lý vắng mặt
**Mô tả**: CBQL xuất báo cáo điểm danh ngày/tuần/tháng và xử lý các trường hợp vắng.
**Trigger**: Menu "Chấm công" → Tab **"Báo cáo"**.
**Steps**:
1. Filter: Chọn ngày/tuần/tháng; chọn đối tượng (HS/GV); chọn lớp/tổ bộ môn.
2. Bảng điểm danh hiển thị dạng **heatmap**: trục X = ngày, trục Y = HS/GV; màu ô: Xanh = có mặt, Đỏ = vắng không phép, Vàng = vắng có phép, Xám = ngày nghỉ.
3. Click ô → popup chi tiết: giờ vào, giờ ra, ảnh chụp từ camera.
4. **Danh sách vắng hôm nay**: Tự động gom HS vắng theo lớp; nút "Gửi SMS phụ huynh" (hàng loạt hoặc từng người).
5. **Điều chỉnh điểm danh thủ công**: Nếu thiết bị lỗi hoặc HS quên chấm → Admin nhập thủ công với lý do và chữ ký số; lưu audit trail.
6. Xuất báo cáo: Excel (chi tiết từng người từng ngày) | PDF (tóm tắt theo lớp) | Gửi qua HUE-S.
**Expected Result**: Báo cáo điểm danh sẵn sàng trong < 1 phút; xử lý ngoại lệ nhanh có đầy đủ audit.

---

## Tính năng & Màn hình

### Màn hình Quản lý Thiết bị — Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ HEADER: Quản lý Thiết bị Chấm Công | [+ Thêm thiết bị]            │
├────────────────────────────────────────────────────────────────────┤
│ TABS: [Bản đồ thiết bị] [Danh sách] [Nhật ký sự kiện]             │
├────────────────────────────────────────────────────────────────────┤
│ Bản đồ thiết bị (Tab mặc định):                                   │
│  ┌────────────────────────────────────────┐                        │
│  │            SƠ ĐỒ TRƯỜNG               │                        │
│  │  🟢[Cổng chính]  🟢[Cổng phụ]        │                        │
│  │                                        │                        │
│  │  🟢[Tòa A - Tầng 1] 🔴[Lab máy tính] │                        │
│  │                                        │                        │
│  │  Legend: 🟢Online 🟡Cảnh báo 🔴Offline│                        │
│  └────────────────────────────────────────┘                        │
│ SIDEBAR: Danh sách thiết bị (click để highlight trên bản đồ)      │
└────────────────────────────────────────────────────────────────────┘
```

### Màn hình Giám sát Real-time
```
┌────────────────────────────────────────────────────────────────────┐
│ KPIs: [1,089 HS có mặt] [158 HS vắng] [82 GV có mặt] [⚠ 3 cảnh báo]
├─────────────────────────────────┬──────────────────────────────────┤
│ BẢN ĐỒ TRƯỜNG (interactive)    │ FEED SỰ KIỆN (live scroll)      │
│ [Mỗi cổng hiện lượt/giờ]        │ 07:45 Nguyễn A (10A1) - Vào    │
│                                  │ 07:45 GV Trần B - Vào [Trễ 3'] │
│                                  │ 07:46 Lê C (12B2) - Vào        │
│                                  │ ⚠ Khuôn mặt lạ - Cổng phụ     │
└─────────────────────────────────┴──────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Thêm thiết bị | Nút "+ Thêm thiết bị" | Form đăng ký + kiểm tra kết nối |
| Xem trạng thái thiết bị | Click thiết bị trên bản đồ | Popup: trạng thái, ping, số lượt hôm nay |
| Restart thiết bị từ xa | Menu ⋮ → Restart | Gửi lệnh restart qua API thiết bị |
| Cập nhật firmware | Menu ⋮ → Cập nhật | Download & flash firmware mới |
| Đăng ký khuôn mặt | Tab "Khuôn mặt" → chọn người | Chụp ảnh webcam hoặc upload |
| Xóa khuôn mặt | Trong danh sách → Xóa | Confirm → xóa embedding khỏi tất cả thiết bị |
| Điều chỉnh log | Click sự kiện → Điều chỉnh | Form sửa giờ, trạng thái + lý do bắt buộc |
| Gửi thông báo vắng | Bulk → Gửi SMS/Email | Soạn mẫu tin → gửi cho phụ huynh |
| Xuất báo cáo | Nút "Xuất" trên tab báo cáo | Excel/PDF theo filter đã chọn |

---

## Gom nhóm tính năng thông minh
Module Điểm danh gom **thiết bị phần cứng + dữ liệu sinh trắc học + log chấm công + báo cáo vắng mặt** vào một nơi. Điều này cho phép QTHT xử lý toàn bộ vòng đời: cấu hình thiết bị → đăng ký khuôn mặt → giám sát realtime → xử lý ngoại lệ → báo cáo. Tránh tình huống admin phải vào 4 module khác nhau để theo dõi 1 sự cố điểm danh.

---

## Edge Cases & Validation
- **Camera offline giữa ngày**: Alert ngay lập tức; tự động chuyển sang chế độ "Điểm danh thủ công" cho khu vực đó; thông báo QTHT qua email/SMS.
- **Nhận diện nhầm người**: Log ghi "Nhận diện không chắc chắn" (< 85% confidence); ảnh được lưu lại để QTHT review sau.
- **Một người chấm công 2 lần liên tiếp**: Chỉ ghi nhận lần đầu; lần thứ 2 trong vòng 5 phút bị bỏ qua (duplicate detection).
- **Ảnh khuôn mặt chất lượng kém**: Block enroll nếu điểm chất lượng < 60; hiển thị hướng dẫn chụp lại.
- **Đăng ký khuôn mặt cho người đã có**: Hỏi "Cập nhật khuôn mặt mới?" → xóa embedding cũ, thêm mới.
- **Không đồng bộ được với thiết bị**: Retry tự động 3 lần; sau đó ghi vào queue đồng bộ khi thiết bị online lại.
- **Điều chỉnh log sau khi đã export báo cáo**: Cảnh báo "Báo cáo ngày X đã được xuất lúc Y. Điều chỉnh sẽ tạo phiên bản báo cáo mới."
- **Múi giờ**: Tất cả timestamp lưu UTC; hiển thị theo giờ Việt Nam (UTC+7); cẩn thận khi thiết bị có đồng hồ lệch.
- **Mất điện toàn trường**: Thiết bị cần UPS; dữ liệu buffer trên thiết bị và đồng bộ khi kết nối lại.
- **Quyền riêng tư**: Live camera feed chỉ QTHT được xem; log điểm danh có thể xem nhưng ảnh chụp bị làm mờ cho CBQL.

---

## Tích hợp
- **QL Học sinh/GV**: Mã HS/GV liên kết trực tiếp với face embedding; khi xóa HS → tự xóa khuôn mặt khỏi thiết bị.
- **QL Lớp học**: Báo cáo vắng mặt được tổng hợp theo lớp; GVCN nhận thông báo khi HS lớp mình vắng.
- **Báo cáo tổng hợp**: Dữ liệu điểm danh được dùng trong báo cáo tổng hợp toàn trường.
- **HUE-S**: Phụ huynh nhận thông báo push khi con vắng học; học sinh xem lịch sử điểm danh của mình.
- **Email/SMS gateway**: Gửi thông báo vắng mặt hàng loạt cho phụ huynh.
- **Hardware API**: REST API hoặc SDK của nhà sản xuất thiết bị (Hikvision, ZKTeco, Suprema...).
- **Camera stream**: RTSP → HLS transcoding để xem trên web browser; WebRTC cho độ trễ thấp.
- **Sở GD&ĐT**: Tỷ lệ chuyên cần được báo cáo lên Sở định kỳ.
