# Quản Lý Thiết Bị — Camera, Máy Điểm Danh & Dữ Liệu Khuôn Mặt — Role: Admin

## Mục tiêu

Cung cấp bộ công cụ quản lý toàn diện **phần cứng điểm danh AI** của trường THPT: từ cấu hình camera IP/RTSP, quản lý máy chấm công phần cứng, đến kho dữ liệu khuôn mặt sinh trắc học của toàn bộ học sinh và giáo viên. Module đảm bảo hệ thống nhận diện khuôn mặt hoạt động liên tục, độ chính xác cao và dễ bảo trì mà không cần kỹ sư IT can thiệp thường xuyên.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền — thêm/sửa/xóa camera và máy điểm danh, cấu hình RTSP, xem live stream, quản lý toàn bộ kho khuôn mặt, trigger re-train AI model, thực hiện đồng bộ hàng loạt.
- **CBQL**: Chỉ xem — xem danh sách thiết bị và trạng thái, xem thống kê khuôn mặt đã đăng ký, xem báo cáo độ chính xác; **không được** cấu hình thiết bị, xem live stream camera, xóa dữ liệu khuôn mặt, hoặc trigger re-train.

---

## User Flow Chính

---

### NHÓM 1: QUẢN LÝ CAMERA

---

### Flow 1: Xem danh sách camera
**Mô tả**: QTHT/CBQL xem tổng quan toàn bộ camera đang triển khai trong trường, theo dõi trạng thái hoạt động theo thời gian thực.
**Trigger**: Menu "Thiết bị" → Tab **"Camera"** (mặc định khi vào module).
**Steps**:
1. Màn hình tải danh sách camera từ API, hiển thị hai chế độ xem song song:
   - **Tab "Bản đồ tầng"**: Sơ đồ SVG tương tác theo tầng/khu vực, mỗi camera là một icon định vị trên bản đồ.
   - **Tab "Danh sách"**: Bảng dữ liệu có thể sắp xếp và lọc.
2. Mỗi camera trong bảng hiển thị các cột:
   - **Tên camera** (ví dụ: "Cổng chính – Hướng vào")
   - **Địa điểm** (Tầng/Khu vực/Phòng)
   - **IP / URL RTSP** (masked, hiện đủ khi hover)
   - **Loại camera** (IP Camera / PTZ / Fisheye / Speed dome)
   - **Trạng thái**: badge màu — `🟢 Online` / `🟡 Chậm` / `🔴 Offline` / `⚠️ Lỗi stream`
   - **Last seen**: thời gian ping thành công gần nhất (ví dụ: "2 phút trước")
   - **Hành động nhanh**: [▶ Preview] [✏️ Sửa] [⋮ Thêm]
3. Bộ lọc thanh ngang phía trên:
   - Tìm kiếm theo tên hoặc IP.
   - Lọc theo khu vực (Tầng 1 / Tầng 2 / Sân trường / Cổng / Hành lang...).
   - Lọc theo trạng thái (Online / Offline / Lỗi).
4. Phía đầu trang: 4 KPI card — **Tổng camera** | **Đang online** | **Đang offline** | **Có lỗi**.
5. Hệ thống tự refresh trạng thái mỗi 30 giây (polling) hoặc real-time qua WebSocket.
**Expected Result**: Admin nắm được tổng quan toàn hệ thống camera trong < 5 giây; phát hiện ngay camera bị mất kết nối.

---

### Flow 2: Thêm camera mới
**Mô tả**: QTHT đăng ký một camera IP mới vừa lắp đặt vào hệ thống quản lý.
**Trigger**: Nút **"+ Thêm camera"** (góc trên phải màn hình danh sách camera).
**Steps**:
1. Mở drawer **"Thêm camera mới"** gồm 4 tab: **[Thông tin cơ bản]** → **[Kết nối RTSP]** → **[Vị trí]** → **[Cấu hình AI]**.
2. **Tab Thông tin cơ bản**:
   - Tên camera* (bắt buộc, unique trong hệ thống): placeholder "VD: Cổng chính – Hướng vào".
   - Loại camera*: dropdown — IP Camera cố định | PTZ (xoay được) | Fisheye 360° | Speed dome.
   - Nhà sản xuất: Hikvision | Dahua | Axis | Hanwha | Khác (nhập tay).
   - Mô tả / Ghi chú kỹ thuật (textarea).
3. **Tab Kết nối RTSP**:
   - Địa chỉ IP* (validate format IPv4).
   - Port HTTP: mặc định 80; Port RTSP: mặc định 554.
   - Username RTSP* và Password RTSP* (masked, nút 👁 hiện/ẩn).
   - URL RTSP đầy đủ: tự động generate và preview → `rtsp://[user]:[pass]@[ip]:[port]/Streaming/Channels/101`.
   - Cho phép override URL thủ công nếu camera có path RTSP khác chuẩn.
   - Nút **"Kiểm tra kết nối"** (xem Flow 4).
4. **Tab Vị trí**:
   - Khu vực / Tầng: chọn từ danh sách đã định nghĩa (Cổng chính / Sân trường / Tầng 1 - Dãy A / ...).
   - Hướng quan sát: Bắc / Nam / Đông / Tây / Trong nhà.
   - Gắn lên bản đồ: click vào vị trí tương ứng trên sơ đồ tầng SVG để pin camera.
   - Ảnh lắp đặt thực tế: upload ảnh chụp tại chỗ (tùy chọn, hỗ trợ JPEG/PNG < 5MB).
5. **Tab Cấu hình AI**:
   - Bật/tắt nhận diện khuôn mặt trên camera này.
   - Ngưỡng nhận diện (confidence threshold): slider 60%–99%, mặc định 85%.
   - Chế độ ánh sáng: Ban ngày | Hồng ngoại ban đêm | Tự động (theo lịch).
   - Vùng nhận diện ROI (Region of Interest): preview ảnh tĩnh của camera → vẽ bounding box bằng chuột để chỉ nhận diện trong vùng đó.
   - Số luồng AI song song tối đa: 1 / 2 / 4 (tuỳ hiệu năng server).
6. Nhấn **"Lưu camera"**:
   - Validate toàn bộ trường bắt buộc.
   - Tự động ping + test RTSP trước khi lưu (nếu chưa test thủ công).
   - Nếu kết nối thất bại → cảnh báo "Không kết nối được. Bạn có muốn lưu tạm và kết nối sau không?" (Yes/No).
   - Nếu thành công → camera xuất hiện trong danh sách với badge `🟢 Online` và được pin lên bản đồ.
**Expected Result**: Camera mới được đăng ký đầy đủ thông tin, kết nối xác minh thành công, bắt đầu nhận stream trong < 2 phút.

---

### Flow 3: Sửa thông tin camera
**Mô tả**: QTHT cập nhật thông tin camera khi thay đổi cấu hình mạng, đổi vị trí lắp đặt, hoặc điều chỉnh thông số AI.
**Trigger**: Click **[✏️ Sửa]** trên hàng camera trong bảng danh sách, hoặc click icon camera trên bản đồ → nút **"Chỉnh sửa"** trong popup.
**Steps**:
1. Mở drawer **"Sửa camera"** — giao diện giống Flow 2 nhưng các trường được điền sẵn giá trị hiện tại.
2. Admin chỉnh sửa bất kỳ trường nào cần thiết.
3. Nếu thay đổi IP/Port/RTSP credentials → hiện banner vàng: _"Thay đổi kết nối sẽ ngắt stream hiện tại trong khoảng 10–30 giây."_
4. Nếu thay đổi ngưỡng AI hoặc vùng ROI → hiện thông tin: _"Thay đổi cấu hình AI có hiệu lực ngay lập tức với stream tiếp theo."_
5. Nhấn **"Lưu thay đổi"**:
   - Nếu có thay đổi kết nối → tự động re-test RTSP với credentials mới trước khi lưu.
   - Cập nhật database, đẩy config mới xuống AI service.
   - Toast: "✓ Đã cập nhật camera [Tên camera]".
6. Nhấn **"Hủy"** hoặc click ngoài drawer → hỏi confirm nếu có thay đổi chưa lưu: _"Bạn có thay đổi chưa lưu. Thoát?"_
**Expected Result**: Thông tin camera được cập nhật chính xác, stream tự phục hồi sau khi thay đổi kết nối.

---

### Flow 4: Kiểm tra kết nối camera (Test ping + Test RTSP)
**Mô tả**: QTHT xác minh camera có thể kết nối được từ server trước khi lưu hoặc khi camera báo offline.
**Trigger**: (a) Nút **"Kiểm tra kết nối"** trong form thêm/sửa camera. (b) Menu ⋮ → **"Kiểm tra kết nối"** trên hàng camera bất kỳ.
**Steps**:
1. Hệ thống hiện dialog **"Đang kiểm tra kết nối..."** với thanh progress animation.
2. **Bước 1 — Ping ICMP** (timeout 5 giây):
   - `✓ Ping thành công — Round trip: 12ms` → tiếp tục bước 2.
   - `✗ Ping thất bại — Host không phản hồi` → dừng, hiện hướng dẫn kiểm tra: _Kiểm tra nguồn điện camera, kết nối LAN, cấu hình firewall._
3. **Bước 2 — Kết nối HTTP/API** (port 80 hoặc 8080):
   - `✓ Web interface phản hồi — HTTP 200` hoặc `⚠ Port HTTP đóng (thường không ảnh hưởng RTSP)`.
4. **Bước 3 — Xác thực RTSP stream** (timeout 10 giây):
   - Server thử mở RTSP URL với credentials đã nhập.
   - `✓ RTSP kết nối thành công — Codec: H.264, Độ phân giải: 1920×1080, FPS: 25` → thành công hoàn toàn.
   - `✗ Xác thực thất bại (401)` → gợi ý kiểm tra lại username/password.
   - `✗ Stream path không đúng (404)` → gợi ý kiểm tra lại URL RTSP path.
   - `✗ Timeout kết nối RTSP` → gợi ý kiểm tra port 554 firewall.
5. Hiển thị kết quả tổng hợp dạng checklist với màu xanh/đỏ cho từng bước.
6. Nút **"Xem ảnh preview"** (nếu RTSP thành công) → chụp 1 frame từ stream, hiển thị trong dialog để xác nhận đúng camera.
7. Nút **"Lưu kết quả kiểm tra"** → ghi log kiểm tra vào lịch sử thiết bị (timestamp, người thực hiện, kết quả).
**Expected Result**: Admin biết chính xác camera có hoạt động không và nguyên nhân lỗi ở tầng nào (mạng / xác thực / stream).

---

### Flow 5: Xem live stream preview trong trình duyệt
**Mô tả**: QTHT xem video trực tiếp từ camera ngay trong giao diện web để kiểm tra hình ảnh, góc quay, chất lượng.
**Trigger**: Click **[▶ Preview]** trên hàng camera, hoặc click icon camera trên bản đồ tầng → **"Xem live"**.
**Steps**:
1. Mở modal fullscreen **"Live Preview — [Tên camera]"**.
2. Hiển thị player video (HLS.js hoặc WebRTC tùy cấu hình server):
   - **Độ trễ**: HLS ~ 5–10 giây; WebRTC ~ < 1 giây.
   - Thanh trạng thái phía dưới: `🔴 LIVE | Codec: H.264 | 1080p | 25fps | Latency: 6s`.
3. Overlay thông tin:
   - Tên camera + địa điểm (góc trên trái).
   - Thời gian thực (đồng hồ chạy, góc trên phải).
   - Bounding box AI (nếu đang bật nhận diện): highlight vùng ROI bằng khung xanh lá.
4. Thanh công cụ player:
   - **[⛶ Toàn màn hình]**: mở fullscreen trình duyệt.
   - **[📸 Chụp frame]**: lưu ảnh PNG frame hiện tại (tự động đặt tên `camera_[id]_[timestamp].png`).
   - **[🔊 Âm thanh]** (nếu camera có mic): bật/tắt audio.
   - **[⚙ Chất lượng]**: chọn độ phân giải xem (Sub-stream 480p / Main-stream 1080p).
5. Panel bên phải (có thể thu gọn): thông tin camera — IP, uptime, tổng lượt nhận diện hôm nay, ảnh chụp gần nhất kèm timestamp.
6. Nếu stream bị ngắt giữa chừng: hiện overlay đỏ `"Stream gián đoạn — Đang kết nối lại..."`, tự retry mỗi 5 giây.
7. Đóng modal → stream tự ngắt, giải phóng tài nguyên server.
**Expected Result**: Admin xem được video trực tiếp chất lượng tốt ngay trên browser mà không cần phần mềm ngoài; stream tự phục hồi khi mất kết nối tạm thời.

---

### Flow 6: Xóa camera
**Mô tả**: QTHT gỡ bỏ camera khỏi hệ thống khi camera hỏng, di chuyển vĩnh viễn hoặc thay thế bằng thiết bị mới.
**Trigger**: Menu ⋮ trên hàng camera → **"Xóa camera"**, hoặc chọn nhiều camera → **"Xóa đã chọn"** (bulk).
**Steps**:
1. Hiện dialog xác nhận:
   ```
   ┌────────────────────────────────────────────────┐
   │  ⚠️  Xóa camera "Cổng chính – Hướng vào"?     │
   │                                                │
   │  Hành động này sẽ:                             │
   │  • Xóa vĩnh viễn cấu hình camera               │
   │  • Ngừng nhận stream và nhận diện từ camera     │
   │  • Giữ nguyên lịch sử log điểm danh đã ghi     │
   │  • KHÔNG xóa dữ liệu khuôn mặt đã đăng ký      │
   │                                                │
   │  Nhập tên camera để xác nhận:                  │
   │  [ Cổng chính – Hướng vào        ]             │
   │                                                │
   │        [Hủy]       [Xóa camera]               │
   └────────────────────────────────────────────────┘
   ```
2. Admin phải gõ đúng tên camera vào ô xác nhận để nút "Xóa camera" được active.
3. Nhấn **"Xóa camera"**:
   - Dừng RTSP stream.
   - Xóa cấu hình khỏi database.
   - Xóa camera khỏi bản đồ tầng.
   - Ghi audit log: người xóa, thời gian, tên camera, IP.
4. Toast: `"✓ Đã xóa camera 'Cổng chính – Hướng vào'"`.
5. **Xóa hàng loạt**: Checkbox chọn nhiều → "Xóa [n] camera đã chọn" → dialog liệt kê danh sách, xác nhận một lần bằng checkbox "Tôi hiểu và muốn xóa [n] camera này".
**Expected Result**: Camera bị xóa sạch khỏi hệ thống, stream dừng ngay lập tức, lịch sử log được bảo toàn.

---

### NHÓM 2: QUẢN LÝ MÁY ĐIỂM DANH (HARDWARE DEVICE)

---

### Flow 7: Xem danh sách máy điểm danh
**Mô tả**: QTHT/CBQL xem tổng quan tất cả máy chấm công phần cứng (ZKTeco, Suprema, máy quét vân tay...) đang hoạt động.
**Trigger**: Menu "Thiết bị" → Tab **"Máy điểm danh"**.
**Steps**:
1. Bảng danh sách hiển thị các cột:
   - **Tên thiết bị** (ví dụ: "ZKTeco-01 – Cổng chính")
   - **Serial Number** (mã duy nhất của phần cứng)
   - **Địa chỉ IP**
   - **Vị trí lắp đặt**
   - **Loại thiết bị**: Máy vân tay | Máy nhận diện mặt | Máy thẻ từ | Máy QR code | Đa năng
   - **Firmware version**
   - **Trạng thái**: `🟢 Online` / `🔴 Offline` / `🔄 Đồng bộ đang chạy` / `⚠️ Lỗi đồng bộ`
   - **Số người đã đồng bộ**: "1,247 / 1,250 người"
   - **Last sync**: "Hôm nay lúc 06:30"
   - **Hành động**: [🔗 Kiểm tra] [🔄 Đồng bộ] [✏️ Sửa] [⋮]
2. KPI card phía trên: **Tổng thiết bị** | **Online** | **Offline** | **Cần đồng bộ**.
3. Bộ lọc: tìm theo tên/serial/IP, lọc theo vị trí, lọc theo loại, lọc theo trạng thái đồng bộ.
4. Cột "Số người đã đồng bộ" có màu đỏ nếu tỷ lệ đồng bộ < 95% (cảnh báo thiếu dữ liệu).
**Expected Result**: Admin thấy ngay máy nào offline, máy nào chưa đồng bộ đủ dữ liệu khuôn mặt để xử lý kịp thời.

---

### Flow 8: Thêm / Sửa / Xóa máy điểm danh
**Mô tả**: QTHT đăng ký máy điểm danh mới hoặc cập nhật thông tin thiết bị hiện có.
**Trigger**: Nút **"+ Thêm thiết bị"** (thêm mới) hoặc **[✏️ Sửa]** trên hàng máy (sửa thông tin).

**Thêm mới — Steps**:
1. Drawer **"Đăng ký máy điểm danh"**:
   - **Thông tin cơ bản**: Tên*, Serial Number*, Nhà sản xuất (ZKTeco / Suprema / Virdi / Hikvision / Khác), Model.
   - **Loại thiết bị***: Nhận diện khuôn mặt | Vân tay | Thẻ từ | QR code | Kết hợp (multi-modal).
   - **Kết nối mạng**: Địa chỉ IP*, Port SDK* (mặc định 4370 cho ZKTeco), Mật khẩu SDK (nếu có).
   - **Vị trí**: Khu vực*, Hướng cổng (Vào / Ra / Hai chiều), ghim trên bản đồ tầng.
   - **Chế độ hoạt động**: Chỉ ghi log | Tự động chấm công | Chấm công + mở khóa cửa.
2. Nhấn **"Kiểm tra kết nối SDK"** (xem Flow 9).
3. Nhấn **"Lưu & Kích hoạt"** → thiết bị được thêm, tự động trigger đồng bộ khuôn mặt lần đầu.

**Sửa — Steps**:
1. Mở drawer với dữ liệu điền sẵn, chỉnh sửa các trường cần thay đổi.
2. Nếu đổi IP/Port → cảnh báo ngắt kết nối tạm thời, yêu cầu re-test.
3. Lưu → cập nhật ngay, toast xác nhận.

**Xóa — Steps**:
1. Menu ⋮ → "Xóa thiết bị" → dialog xác nhận:
   - Cảnh báo: _"Dữ liệu khuôn mặt trên máy sẽ bị xóa nhưng kho dữ liệu trên server vẫn giữ nguyên."_
   - Yêu cầu nhập serial number để xác nhận.
2. Xóa cấu hình, ghi audit log, cập nhật danh sách.

**Expected Result**: Máy điểm danh được quản lý đầy đủ vòng đời từ lúc lắp đến lúc tháo gỡ, không mất dữ liệu server.

---

### Flow 9: Kiểm tra kết nối thiết bị
**Mô tả**: QTHT xác minh server có thể giao tiếp với máy điểm danh qua SDK protocol.
**Trigger**: Nút **"Kiểm tra kết nối SDK"** trong form thêm/sửa, hoặc **[🔗 Kiểm tra]** trong danh sách.
**Steps**:
1. Dialog **"Kiểm tra kết nối — [Tên thiết bị]"** với progress animation.
2. **Bước 1 — Ping ICMP**: Kiểm tra host có phản hồi không (timeout 3 giây).
3. **Bước 2 — Kết nối SDK**: Mở TCP socket đến IP:Port SDK, thử kết nối theo protocol của nhà sản xuất:
   - ZKTeco: ZKLib / ADMS protocol port 4370.
   - Suprema: BioStar2 API.
   - Hikvision: ISAPI.
4. **Bước 3 — Xác thực & đọc thông tin thiết bị**: Lấy thông tin firmware, serial number, số người đã lưu, thời gian hệ thống trên máy.
5. Hiển thị kết quả chi tiết:
   ```
   ✓ Ping: 8ms
   ✓ SDK Kết nối: Port 4370 mở
   ✓ Xác thực: Thành công
   ─────────────────────────────────────
   Thiết bị: ZKTeco F22 | Firmware: 6.60
   Serial: ABC123456789
   Số người trên máy: 1,247
   Đồng hồ thiết bị: 18/03/2026 07:42:15
   Lệch so với server: +2 giây ⚠️ (nên đồng bộ NTP)
   ```
6. Nút **"Đồng bộ giờ thiết bị"** xuất hiện nếu phát hiện lệch > 30 giây.
**Expected Result**: Admin biết máy có kết nối được không, trạng thái đồng bộ giờ, sẵn sàng cho bước đồng bộ dữ liệu.

---

### Flow 10: Đồng bộ dữ liệu khuôn mặt từ server xuống máy
**Mô tả**: QTHT đẩy toàn bộ (hoặc một phần) dữ liệu khuôn mặt từ server AI xuống máy điểm danh phần cứng để máy hoạt động độc lập.
**Trigger**: Nút **[🔄 Đồng bộ]** trên hàng thiết bị, hoặc chọn nhiều thiết bị → **"Đồng bộ hàng loạt"**.
**Steps**:
1. Dialog **"Đồng bộ dữ liệu khuôn mặt"** cho phép chọn phạm vi:
   - **Đồng bộ toàn bộ**: Ghi đè toàn bộ dữ liệu trên máy bằng dữ liệu server (an toàn nhất).
   - **Đồng bộ bổ sung**: Chỉ thêm người mới và cập nhật người thay đổi, không xóa người đã có (nhanh hơn).
   - **Đồng bộ theo nhóm**: Chọn lớp/khối/tổ bộ môn cụ thể (dùng khi máy chỉ quản lý một khu vực).
2. Hiển thị thống kê trước khi đồng bộ:
   - Server: 1,250 người có dữ liệu khuôn mặt.
   - Thiết bị hiện tại: 1,247 người.
   - Cần thêm: 3 người | Cần cập nhật: 12 người | Cần xóa (không còn học): 1 người.
3. Nhấn **"Bắt đầu đồng bộ"**:
   - Thanh progress realtime: "Đang xử lý 245/1,250..."
   - Log cuộn hiển thị từng action: `[07:43:01] ✓ Thêm: Nguyễn Văn A (HS12A1)`.
   - Ước tính thời gian còn lại.
4. Khi hoàn tất:
   - `✓ Đồng bộ thành công — 1,250/1,250 người | Thời gian: 4 phút 23 giây`.
   - Cập nhật cột "Số người đã đồng bộ" trong bảng.
   - Ghi log đồng bộ vào lịch sử thiết bị.
5. **Đồng bộ hàng loạt nhiều máy**: Chạy tuần tự từng máy, hiển thị tiến trình tổng hợp:
   - `Máy 1/3: ZKTeco-01 ✓ Hoàn tất | Máy 2/3: ZKTeco-02 🔄 Đang chạy 60%...`
6. Nếu đồng bộ thất bại giữa chừng (mất kết nối): ghi lại vị trí bị ngắt, hỗ trợ tiếp tục từ điểm đó khi retry.
**Expected Result**: 100% người có dữ liệu khuôn mặt hợp lệ được đồng bộ xuống thiết bị; máy hoạt động đúng ngay sau đồng bộ.

---

### NHÓM 3: QUẢN LÝ DỮ LIỆU KHUÔN MẶT (FACE DATA)

---

### Flow 11: Xem danh sách khuôn mặt đã đăng ký
**Mô tả**: QTHT/CBQL xem kho dữ liệu khuôn mặt toàn trường, kiểm tra ai đã đăng ký, ai chưa, chất lượng dữ liệu ra sao.
**Trigger**: Menu "Thiết bị" → Tab **"Dữ liệu khuôn mặt"**.
**Steps**:
1. Màn hình bao gồm:
   - **Progress bar tổng quan**: `HS: 1,230/1,250 đã đăng ký (98.4%)` | `GV: 87/90 đã đăng ký (96.7%)`.
   - Nút nhanh: **[Xem chưa đăng ký]** → lọc ngay về người thiếu dữ liệu.
2. Bảng danh sách với các cột:
   - **Ảnh đại diện** (thumbnail khuôn mặt, làm mờ với CBQL).
   - **Họ tên** (link sang hồ sơ chi tiết).
   - **Mã số** (Mã HS / Mã GV).
   - **Loại**: badge `HS` màu xanh dương | `GV` màu xanh lá.
   - **Lớp / Tổ bộ môn**.
   - **Số ảnh đã đăng ký** (ví dụ: 5 ảnh).
   - **Ngày đăng ký** lần đầu & lần cập nhật gần nhất.
   - **Độ chính xác nhận diện** (% trung bình 30 ngày gần nhất): màu xanh > 90%, vàng 75–90%, đỏ < 75%.
   - **Trạng thái**: `✓ Hợp lệ` / `⚠ Cần cập nhật` / `✗ Chưa đăng ký`.
   - **Hành động**: [👁 Xem ảnh] [✏️ Cập nhật] [🗑 Xóa]
3. Bộ lọc:
   - Tìm kiếm tên/mã.
   - Lọc theo loại (HS/GV), theo lớp/khối/tổ.
   - Lọc theo trạng thái (Hợp lệ / Cần cập nhật / Chưa đăng ký).
   - Lọc theo độ chính xác (< 80% → ưu tiên xử lý).
4. Sắp xếp theo độ chính xác tăng dần → dễ tìm người cần chụp lại ảnh.
**Expected Result**: Admin có cái nhìn tổng thể về chất lượng kho khuôn mặt, xác định được người cần can thiệp.

---

### Flow 12: Xem ảnh khuôn mặt của một người
**Mô tả**: QTHT kiểm tra chất lượng ảnh khuôn mặt đã đăng ký của một HS hoặc GV cụ thể.
**Trigger**: Click **[👁 Xem ảnh]** trên hàng người dùng, hoặc click tên người → Drawer **"Chi tiết khuôn mặt"**.
**Steps**:
1. Drawer bên phải mở ra với hai phần:
   - **Thông tin người**: Ảnh đại diện hồ sơ, Họ tên, Mã số, Lớp/Chức vụ.
   - **Dữ liệu khuôn mặt**: Danh sách ảnh đã đăng ký dạng gallery 3 cột.
2. Mỗi ảnh trong gallery hiển thị:
   - Thumbnail khuôn mặt (crop tự động).
   - Badge chất lượng: `⭐ 92 điểm` (màu xanh/vàng/đỏ).
   - Ngày chụp.
   - Góc mặt: Thẳng / Nghiêng trái / Nghiêng phải.
   - Nút `[🗑]` xóa ảnh này khỏi bộ.
3. Click vào ảnh → lightbox phóng to, hiển thị:
   - Ảnh gốc độ phân giải đầy đủ.
   - Metadata: ngày chụp, người upload, nguồn (Webcam admin / Upload / Camera điểm danh).
   - Kết quả phân tích: Độ sáng, Độ nét, Góc mặt, Che khuất (kính/khẩu trang), điểm chất lượng tổng.
4. **Panel thống kê nhận diện**:
   - Tổng số lần camera nhận diện thành công (30 ngày).
   - Tỷ lệ nhận diện thành công / thất bại.
   - Confidence trung bình: 91.3%.
   - Camera nhận diện chính xác nhất / kém nhất.
5. Nút **"Thêm ảnh mới"** → chụp ảnh webcam hoặc upload file (xem Flow 14 khi làm hàng loạt).
**Expected Result**: Admin hiểu được chất lượng từng ảnh, biết ảnh nào cần thay thế, và hiệu suất nhận diện thực tế của người đó.

---

### Flow 13: Xóa dữ liệu khuôn mặt
**Mô tả**: QTHT xóa toàn bộ dữ liệu khuôn mặt của một người khi họ thôi học, chuyển trường hoặc có yêu cầu xóa dữ liệu cá nhân.
**Trigger**: Nút **[🗑 Xóa]** trên hàng người trong danh sách, hoặc trong drawer chi tiết → nút **"Xóa toàn bộ dữ liệu khuôn mặt"**.
**Steps**:
1. Dialog xác nhận hai lớp:
   ```
   ┌────────────────────────────────────────────────────┐
   │  🗑️  Xóa dữ liệu khuôn mặt                        │
   │  Nguyễn Thị B — HS12A1 — Mã: HS2024001            │
   │                                                    │
   │  Hành động này sẽ:                                 │
   │  • Xóa 5 ảnh khuôn mặt khỏi server                │
   │  • Xóa face embedding khỏi AI model                │
   │  • Xóa dữ liệu người này trên TẤT CẢ 8 máy        │
   │  • Người này KHÔNG THỂ điểm danh bằng AI           │
   │  • Lịch sử điểm danh trước đây được GIỮ NGUYÊN     │
   │                                                    │
   │  Lý do xóa*:                                       │
   │  ○ Học sinh thôi học / chuyển trường                │
   │  ○ Yêu cầu xóa dữ liệu cá nhân                    │
   │  ○ Dữ liệu lỗi, cần đăng ký lại                   │
   │  ○ Khác: [________________]                        │
   │                                                    │
   │  [ Hủy ]    [ Xác nhận Xóa ]                      │
   └────────────────────────────────────────────────────┘
   ```
2. Bắt buộc chọn lý do xóa trước khi nút "Xác nhận Xóa" được kích hoạt.
3. Sau xác nhận:
   - Xóa ảnh và face embedding khỏi server AI.
   - Gửi lệnh xóa xuống tất cả máy điểm danh đang online.
   - Với máy đang offline: đưa vào queue xóa, thực hiện khi máy online lại.
   - Ghi audit log đầy đủ: người thực hiện, lý do, thời gian, số ảnh đã xóa.
4. Toast: `"✓ Đã xóa 5 ảnh khuôn mặt của Nguyễn Thị B. Đồng bộ đến 8/8 thiết bị."`.
5. **Xóa hàng loạt**: Chọn nhiều người (ví dụ: toàn bộ HS lớp 12 đã tốt nghiệp) → dialog tổng hợp + xác nhận một lần.
**Expected Result**: Dữ liệu sinh trắc học được xóa hoàn toàn và đồng bộ trên tất cả thiết bị, đảm bảo tuân thủ quyền riêng tư.

---

### Flow 14: Import ảnh khuôn mặt hàng loạt (ZIP)
**Mô tả**: QTHT nạp hàng loạt ảnh khuôn mặt cho nhiều HS/GV một lúc, thường dùng đầu năm học hoặc khi có đợt bổ sung lớn.
**Trigger**: Nút **"📥 Import hàng loạt"** trên màn hình Dữ liệu khuôn mặt.
**Steps**:
1. Mở wizard 4 bước **"Import ảnh khuôn mặt hàng loạt"**.
2. **Bước 1 — Tải lên file ZIP**:
   - Drop zone upload file ZIP (tối đa 500MB).
   - Hướng dẫn cấu trúc thư mục bắt buộc:
     ```
     faces_import.zip
     ├── HS2024001/          ← Mã HS làm tên thư mục
     │   ├── 1.jpg           ← Tối thiểu 3 ảnh, tối đa 10 ảnh
     │   ├── 2.jpg
     │   └── 3.jpg
     ├── HS2024002/
     │   └── ...
     └── GV001/              ← Mã GV cho giáo viên
         └── ...
     ```
   - Nút **"Tải template mẫu"** → download file ZIP mẫu với README hướng dẫn.
3. **Bước 2 — Phân tích & Kiểm tra**:
   - Hệ thống giải nén và phân tích từng ảnh (có thể mất 1–5 phút tùy số lượng).
   - Thanh progress với log cuộn:
     - `✓ HS2024001: 3 ảnh, chất lượng trung bình 88 điểm`
     - `⚠ HS2024002: 1 ảnh bị blur (điểm 42), 2 ảnh tốt`
     - `✗ HS2099999: Mã không tồn tại trong hệ thống`
   - Báo cáo tổng hợp sau phân tích:
     ```
     Tổng thư mục:          150
     ✓ Hợp lệ hoàn toàn:    132 người
     ⚠ Có ảnh cần thay:     15 người (34 ảnh chất lượng kém)
     ✗ Mã không tìm thấy:   3 người (HS2099999, HS2099998, GV099)
     ```
4. **Bước 3 — Review & Quyết định**:
   - Bảng chi tiết người có vấn đề: xem ảnh bị lỗi, hiểu lý do bị reject.
   - Với ảnh chất lượng kém: chọn "Bỏ qua ảnh đó & import phần còn lại" hoặc "Reject toàn bộ người này".
   - Với mã không tìm thấy: link "Xem danh sách mã gần giống" (gợi ý sửa typo).
   - Tick chọn **"Ghi đè ảnh cũ nếu đã có"** (unchecked mặc định — an toàn).
5. **Bước 4 — Import**:
   - Nhấn **"Bắt đầu Import"** → tiến trình lưu ảnh, tạo face embedding.
   - Log tiến trình chi tiết: `[08:15:32] ✓ HS2024001: đã tạo 3 embeddings`.
   - Sau khi xong: hiển thị báo cáo kết quả cuối → nút **"Tải báo cáo CSV"**.
6. Sau import → hệ thống gợi ý: `"Đã import thêm 395 ảnh mới. Bạn có muốn trigger re-train AI model không?"` (xem Flow 15).
**Expected Result**: Hàng trăm ảnh được import nhanh chóng với kiểm soát chất lượng tự động; admin biết chính xác ai cần chụp lại.

---

### Flow 15: Trigger re-train model AI
**Mô tả**: QTHT yêu cầu hệ thống huấn luyện lại (re-train) model AI nhận diện khuôn mặt sau khi có nhiều dữ liệu mới, đảm bảo độ chính xác tốt nhất.
**Trigger**: (a) Gợi ý tự động sau Import hàng loạt (Flow 14). (b) Nút **"🧠 Re-train AI Model"** trong tab Dữ liệu khuôn mặt → menu cài đặt nâng cao (chỉ QTHT).
**Steps**:
1. Dialog thông tin trước khi trigger:
   ```
   ┌──────────────────────────────────────────────────┐
   │  🧠 Re-train AI Model nhận diện khuôn mặt        │
   │                                                  │
   │  Model hiện tại:                                 │
   │  • Phiên bản: v2.14 (train ngày 01/03/2026)      │
   │  • Số người: 1,247 | Số ảnh: 6,103               │
   │  • Độ chính xác trung bình: 94.2%                │
   │                                                  │
   │  Thay đổi kể từ lần train trước:                 │
   │  • +395 ảnh mới (từ Import vừa rồi)              │
   │  • +12 người mới đăng ký                         │
   │  • 8 người đã xóa khuôn mặt                      │
   │                                                  │
   │  Ước tính thời gian train: ~15–25 phút           │
   │  Trong thời gian train: Model cũ vẫn hoạt động  │
   │                                                  │
   │  Lịch train:                                     │
   │  ○ Train ngay bây giờ                            │
   │  ● Train lúc: [22:00] tối nay (ngoài giờ học)   │
   │                                                  │
   │  [ Hủy ]     [ Xác nhận Train ]                 │
   └──────────────────────────────────────────────────┘
   ```
2. QTHT có thể chọn train ngay hoặc lên lịch vào giờ thấp điểm (khuyến nghị 22:00–04:00).
3. Nhấn **"Xác nhận Train"**:
   - Hệ thống ghi job vào queue.
   - Banner thông báo: `"⏳ AI model sẽ được re-train lúc 22:00. Model hiện tại vẫn hoạt động bình thường."`.
4. **Trong quá trình train** (nếu chọn ngay):
   - Widget nhỏ góc màn hình: `"🧠 Re-training... 43% | ETA: 12 phút"`.
   - QTHT có thể làm việc khác, không bị block.
5. **Sau khi train xong**:
   - Thông báo toast + email/notification cho QTHT: `"✓ AI Model v2.15 đã sẵn sàng"`.
   - So sánh hiệu suất tự động:
     - Model cũ v2.14: 94.2% | Model mới v2.15: 96.1% (+1.9%).
   - Nút **"Áp dụng model mới"** để deploy (hoặc tự động áp dụng nếu cài đặt auto-deploy).
6. Nếu kết quả train tệ hơn model cũ (hiếm): cảnh báo đỏ, đề xuất giữ model cũ, log nguyên nhân chi tiết.
**Expected Result**: Model AI được cập nhật với dữ liệu mới nhất mà không gián đoạn hoạt động điểm danh; độ chính xác tăng lên.

---

### Flow 16: Xem thống kê độ chính xác nhận diện theo từng người
**Mô tả**: QTHT phân tích hiệu suất nhận diện từng cá nhân để phát hiện người bị nhận diện kém và can thiệp (chụp lại ảnh, điều chỉnh góc camera).
**Trigger**: Tab **"Thống kê độ chính xác"** trong màn hình Dữ liệu khuôn mặt, hoặc từ drawer chi tiết của một người (Flow 12).
**Steps**:
1. **Màn hình Thống kê tổng quan**:
   - Bộ lọc: Khoảng thời gian (7/14/30/90 ngày) | Camera cụ thể | Loại (HS/GV) | Lớp.
   - **Biểu đồ phân phối độ chính xác**: histogram dạng cột — trục X là confidence (60–100%), trục Y là số người. Lý tưởng: hình chuông lệch phải.
   - **KPI tổng hợp**:
     - Độ chính xác trung bình toàn trường: 94.2%
     - Người nhận diện tốt nhất (Top 5): > 99%
     - Người cần chú ý (< 80%): 23 người
     - Tỷ lệ nhận diện thất bại (false negative): 1.8%
2. **Bảng xếp hạng theo độ chính xác** (sắp xếp tăng dần → người kém nhất lên đầu):
   | Hạng | Họ tên | Lớp | Confidence TB | Số lần đúng | Số lần sai | Camera kém nhất |
   |------|--------|-----|---------------|-------------|------------|-----------------|
   | ⚠ 1 | Trần Văn C | 11B3 | 71.2% | 45 | 18 | Cổng phụ |
   | ⚠ 2 | Lê Thị D | GV | 74.8% | 89 | 29 | Tầng 2 - Dãy B |
3. Click vào một người → Drawer **"Chi tiết độ chính xác"**:
   - Biểu đồ đường (line chart): confidence theo thời gian (phát hiện xu hướng giảm).
   - Biểu đồ cột theo từng camera: camera nào nhận diện tốt/kém.
   - Lịch sử các lần nhận diện gần nhất: thời gian, camera, confidence, ảnh chụp.
   - Phân tích nguyên nhân AI gợi ý:
     - `⚠ Thường đeo khẩu trang → Giảm confidence 15%`
     - `⚠ Ánh sáng yếu tại Cổng phụ buổi sáng → ảnh hưởng 8 người khác`
     - `💡 Đề xuất: Thêm ảnh chụp khi đeo khẩu trang (nếu quy định cho phép)`
4. Nút **"Gửi yêu cầu chụp lại ảnh"**: tạo task cho admin phụ trách gặp người này chụp bổ sung ảnh.
5. **Export báo cáo**: xuất danh sách người có confidence < [ngưỡng tùy chọn]% ra Excel để xử lý hàng loạt.
**Expected Result**: Admin chủ động phát hiện và xử lý điểm yếu trong kho dữ liệu khuôn mặt trước khi chúng gây ra sai sót điểm danh.

---

## Tính năng & Màn hình

### Màn hình Danh sách Camera — Layout bản đồ tầng
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📷 Quản lý Camera                                    [+ Thêm camera]        │
├──────────────────────────────────────────────────────────────────────────────┤
│  [🟢 Online: 14]  [🔴 Offline: 2]  [⚠️ Lỗi stream: 1]  [📷 Tổng: 17]       │
├──────────────────────────────────────────────────────────────────────────────┤
│  TABS: [🗺 Bản đồ tầng ●] [📋 Danh sách] [📜 Lịch sử sự kiện]              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Tầng 1 ●] [Tầng 2] [Tầng 3] [Sân trường] [Cổng chính]                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────── TẦNG 1 ────────────────────────────────┐  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐   │  │
│  │  │  DÃY A — HÀNH LANG PHÍA ĐÔNG                                   │   │  │
│  │  │                                                                │   │  │
│  │  │  [Cầu thang A]  📷🟢─────────[Giữa hành lang]─────📷🟢        │   │  │
│  │  │                  CAM-A01 ↓                        CAM-A02 ↓   │   │  │
│  │  │                  Cổng A                           Hành lang   │   │  │
│  │  │                                                                │   │  │
│  │  │  [101] [102] [103]  ═══ PHÒNG HỌC ═══  [104] [105] [106]     │   │  │
│  │  │                                                                │   │  │
│  │  └────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐   │  │
│  │  │  DÃY B — HÀNH LANG PHÍA TÂY                                    │   │  │
│  │  │                                                                │   │  │
│  │  │  📷🔴────────────────────────────────────────📷🟢             │   │  │
│  │  │  CAM-B01 OFFLINE                              CAM-B02 ↓       │   │  │
│  │  │  (2h trước)                                   Lab CNTT        │   │  │
│  │  │                                                                │   │  │
│  │  │  [Lab CNTT] [Thư viện] [Phòng GV] [Phòng BGH]               │   │  │
│  │  └────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐   │  │
│  │  │  SÂN TRƯỜNG & CỔNG                                            │   │  │
│  │  │                                                                │   │  │
│  │  │  📷🟢═══════════════════════════════════════📷⚠️             │   │  │
│  │  │  CAM-G01                                     CAM-G02          │   │  │
│  │  │  Cổng chính (Vào)                            Cổng chính (Ra) │   │  │
│  │  │                        ⚠️ Lỗi stream                         │   │  │
│  │  │                                                                │   │  │
│  │  │         📷🟢                   📷🟢                           │   │  │
│  │  │         CAM-S01                CAM-S02                        │   │  │
│  │  │         Sân trường giữa        Sân thể dục                    │   │  │
│  │  └────────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Legend: 📷🟢 Online  📷🟡 Chậm (fps<10)  📷🔴 Offline  📷⚠️ Lỗi stream   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Màn hình Danh sách Camera — Chế độ bảng
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🔍 [Tìm tên/IP...  ]  Khu vực:[Tất cả▼]  Trạng thái:[Tất cả▼]            │
├─────────────────────────┬──────────────┬────────────────┬──────────┬─────────┤
│  Tên camera             │ Vị trí       │ IP / RTSP      │ Trạng   │Last seen│
│                         │              │                │ thái    │         │
├─────────────────────────┼──────────────┼────────────────┼──────────┼─────────┤
│ Cổng chính – Vào        │ Cổng / Ngoài │ 192.168.1.101  │🟢 Online│ 1 phút  │
│ [▶ Preview] [✏️] [⋮]   │              │ :554           │         │ trước   │
├─────────────────────────┼──────────────┼────────────────┼──────────┼─────────┤
│ Cổng chính – Ra         │ Cổng / Ngoài │ 192.168.1.102  │⚠️ Lỗi  │45 phút  │
│ [▶ Preview] [✏️] [⋮]   │              │ :554           │ stream  │ trước   │
├─────────────────────────┼──────────────┼────────────────┼──────────┼─────────┤
│ Hành lang T1 – Dãy B   │ T1 / Dãy B   │ 192.168.1.103  │🔴Offline│ 2 giờ  │
│ [▶ Preview] [✏️] [⋮]   │              │ :554           │         │ trước   │
├─────────────────────────┼──────────────┼────────────────┼──────────┼─────────┤
│ Lab CNTT – Cửa vào      │ T1 / Lab     │ 192.168.1.104  │🟢 Online│ 30 giây │
│ [▶ Preview] [✏️] [⋮]   │              │ :554           │         │ trước   │
└─────────────────────────┴──────────────┴────────────────┴──────────┴─────────┘
```

### Màn hình Live Preview Camera — Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📷 Live Preview — Cổng chính – Hướng vào        [⛶ Fullscreen] [✕ Đóng]  │
├────────────────────────────────────────────────────┬─────────────────────────┤
│                                                    │ ℹ️ Thông tin camera     │
│  ┌──────────────────────────────────────────────┐  │ ─────────────────────── │
│  │ Cổng chính – Hướng vào       07:43:21 🔴LIVE│  │ IP: 192.168.1.101       │
│  │                                              │  │ RTSP Port: 554          │
│  │                                              │  │ Codec: H.264            │
│  │                                              │  │ Độ phân giải: 1080p     │
│  │      [ VIDEO STREAM 1920×1080 ]             │  │ FPS hiện tại: 25        │
│  │                                              │  │ Uptime: 14 ngày 6h      │
│  │   ┌──── ROI ZONE ──────────┐                │  │ Latency: ~6s (HLS)      │
│  │   │  Vùng nhận diện AI    │                 │  │ ─────────────────────── │
│  │   │  [bbox xanh khuôn mặt]│                 │  │ 📊 Hôm nay              │
│  │   └───────────────────────┘                 │  │ Lượt nhận diện: 847     │
│  │                                              │  │ Thành công: 831 (98.1%)│
│  └──────────────────────────────────────────────┘  │ Không nhận diện: 16    │
│                                                    │ ─────────────────────── │
│  [⛶ Fullscreen] [📸 Chụp frame]                   │ 🕐 Nhận diện gần nhất  │
│  [🔊 Tắt tiếng] [⚙ Chất lượng: 1080p ▼]          │ [thumbnail] 07:43:18   │
│                                                    │ Nguyễn A–HS10A1–96.2% │
└────────────────────────────────────────────────────┴─────────────────────────┘
```

### Màn hình Máy Điểm Danh — Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🖥 Quản lý Máy Điểm Danh                          [+ Thêm thiết bị]        │
├──────────────────────────────────────────────────────────────────────────────┤
│  [🟢 Online: 6]  [🔴 Offline: 1]  [🔄 Đang đồng bộ: 1]  [🖥 Tổng: 8]      │
├──────────────────────────────────────────────────────────────────────────────┤
│  🔍 [Tìm tên/serial/IP...]  Vị trí:[Tất cả▼]  Đồng bộ:[Tất cả▼]           │
├──────────────────┬─────────────┬──────────────┬─────────────────┬────────────┤
│ Tên thiết bị     │Serial/Model │ IP           │ Người đồng bộ   │ Trạng thái │
├──────────────────┼─────────────┼──────────────┼─────────────────┼────────────┤
│ ZKTeco-01        │ ABC123456   │192.168.1.20  │ 1,250/1,250     │🟢 Online  │
│ Cổng chính       │ ZKTeco F22  │Port 4370     │ ████████ 100%   │ [🔗🔄✏⋮]  │
│ Last sync: 06:30 │             │              │                 │            │
├──────────────────┼─────────────┼──────────────┼─────────────────┼────────────┤
│ ZKTeco-02        │ ABC123457   │192.168.1.21  │ 1,238/1,250     │🔄 Đồng bộ │
│ Cổng phụ         │ ZKTeco F22  │Port 4370     │ ███████░ 99%    │  đang chạy │
│ Last sync: đang..│             │              │ ⚠️ Thiếu 12 người│ [🔗🔄✏⋮]  │
├──────────────────┼─────────────┼──────────────┼─────────────────┼────────────┤
│ Suprema-01       │ XYZ789012   │192.168.1.30  │ 1,250/1,250     │🔴 Offline │
│ Tầng 2 – Dãy B  │ BioEntry W2 │Port 1471     │ ████████ 100%   │ 2h trước  │
│ Last sync: hôm qua│            │              │                 │ [🔗🔄✏⋮]  │
└──────────────────┴─────────────┴──────────────┴─────────────────┴────────────┘
  [Chọn tất cả]  [Đồng bộ hàng loạt đã chọn ▼]  Hiển thị 1-8 / 8 thiết bị
```

### Màn hình Dữ liệu Khuôn Mặt — Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🧑‍🤝‍🧑 Dữ liệu Khuôn Mặt       [📥 Import hàng loạt] [🧠 Re-train AI]   │
├──────────────────────────────────────────────────────────────────────────────┤
│  TABS: [👥 Danh sách ●] [📊 Thống kê độ chính xác] [📜 Lịch sử re-train]   │
├──────────────────────────────────────────────────────────────────────────────┤
│  HS: ████████████████████░  1,230 / 1,250 đã đăng ký  (98.4%)              │
│                                                [Xem 20 HS chưa đăng ký →]  │
│  GV: ███████████████████░░     87 /    90 đã đăng ký  (96.7%)              │
│                                                 [Xem 3 GV chưa đăng ký →]  │
├──────────────────────────────────────────────────────────────────────────────┤
│  🔍 [Tìm tên/mã...]  Loại:[Tất cả▼]  Lớp:[Tất cả▼]  Trạng thái:[Tất cả▼]│
│  Sắp xếp: [Độ chính xác tăng dần ▼] (người cần xử lý lên đầu)             │
├──────┬─────────────────┬─────────┬────┬──────┬──────┬─────────┬──────┬──────┤
│ Ảnh  │ Họ tên          │ Mã số   │Loại│Lớp/Tổ│Số ảnh│ Ngày ĐK │Conf% │ Act  │
├──────┼─────────────────┼─────────┼────┼──────┼──────┼─────────┼──────┼──────┤
│[😐🔴]│ Trần Văn C      │HS202418 │ HS │ 11B3 │  4   │01/09/25 │71.2% │👁✏🗑 │
│      │                 │         │    │      │      │         │ 🔴   │      │
├──────┼─────────────────┼─────────┼────┼──────┼──────┼─────────┼──────┼──────┤
│[😐🟡]│ Lê Thị D        │ GV0034  │ GV │Toán  │  6   │15/08/25 │74.8% │👁✏🗑 │
│      │                 │         │    │      │      │         │ 🟡   │      │
├──────┼─────────────────┼─────────┼────┼──────┼──────┼─────────┼──────┼──────┤
│[😐🟢]│ Nguyễn Văn A    │HS202401 │ HS │ 10A1 │  5   │02/09/25 │96.1% │👁✏🗑 │
│      │                 │         │    │      │      │         │ 🟢   │      │
└──────┴─────────────────┴─────────┴────┴──────┴──────┴─────────┴──────┴──────┘
```

### Màn hình Thống kê Độ Chính Xác — Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📊 Thống kê Độ Chính Xác Nhận Diện               [📤 Export Excel]         │
├──────────────────────────────────────────────────────────────────────────────┤
│  Kỳ: [30 ngày▼]  Camera: [Tất cả▼]  Loại: [Tất cả▼]                       │
├──────────────────┬──────────────────┬──────────────────┬───────────────────  │
│  Confidence TB   │  Người < 80%     │  Tỷ lệ thất bại  │  Tổng lượt         │
│     94.2%  🟢   │  23 người  ⚠️    │     1.8%         │   47,823 lượt      │
├──────────────────┴──────────────────┴──────────────────┴───────────────────  │
│  Phân phối confidence — 30 ngày (histogram):                                │
│                                                                              │
│  Số    80 ┤                                        ██                        │
│  người    │                                      ██████                      │
│        60 ┤                                   ████████████                  │
│           │                              ██████████████████                 │
│        40 ┤                         ████████████████████████                │
│           │              ███████████████████████████████████▌               │
│        20 ┤  ▌▌▌▌▌▌▌▌▌▌▌████████████████████████████████████▌▌             │
│         0 └──┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬──           │
│            60 65  70  75  80  85  90  92  94  96  98  99 100 %              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ⚠️ DANH SÁCH CẦN XỬ LÝ (confidence < 80%) — 23 người:                     │
│  ⚠ #1  Trần Văn C  | HS11B3 | 71.2% | Đề xuất: Chụp lại ảnh [Tạo task →] │
│  ⚠ #2  Lê Thị D    | GV-Math| 74.8% | Đề xuất: Kiểm tra camera Cổng phụ  │
│  ⚠ #3  Phạm Văn E  | HS10C2 | 76.1% | Đề xuất: Thêm ảnh góc khác          │
│                                                            [Xem tất cả 23 →]│
└──────────────────────────────────────────────────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| **Thêm camera** | Nút "+ Thêm camera" | Drawer wizard 4 tab: thông tin → RTSP → vị trí → AI config |
| **Sửa camera** | [✏️] trên hàng hoặc popup bản đồ | Drawer chỉnh sửa với dữ liệu điền sẵn |
| **Xem preview live** | [▶ Preview] hoặc click icon bản đồ | Modal player HLS/WebRTC với overlay AI |
| **Test kết nối camera** | [⋮ → Kiểm tra] hoặc trong form | Dialog 3 bước: Ping → HTTP → RTSP + chụp frame xác nhận |
| **Chụp frame nhanh** | [📸] trong modal preview | Tải ảnh PNG với timestamp về máy |
| **Xóa camera** | ⋮ → "Xóa camera" | Confirm bằng nhập tên + ghi audit log |
| **Xóa hàng loạt camera** | Checkbox nhiều → "Xóa đã chọn" | Dialog liệt kê + confirm một lần |
| **Thêm máy điểm danh** | Nút "+ Thêm thiết bị" | Drawer form: thông tin + SDK credentials + vị trí |
| **Test kết nối SDK** | [🔗 Kiểm tra] trên hàng máy | Dialog 3 bước: Ping → SDK → đọc thông tin & đồng hồ máy |
| **Đồng bộ khuôn mặt** | [🔄 Đồng bộ] hoặc bulk | Wizard: chọn phạm vi → progress realtime → kết quả |
| **Đồng bộ hàng loạt** | Chọn nhiều máy → Đồng bộ | Chạy tuần tự, progress tổng hợp từng máy |
| **Xem ảnh khuôn mặt** | [👁 Xem ảnh] hoặc click tên | Drawer gallery + lightbox + phân tích chất lượng AI |
| **Thêm ảnh cho người** | Trong drawer → "Thêm ảnh mới" | Webcam capture hoặc upload, kiểm tra chất lượng ngay |
| **Xóa khuôn mặt** | [🗑] trong danh sách hoặc drawer | Dialog 2 lớp + bắt buộc chọn lý do + đồng bộ xóa thiết bị |
| **Import hàng loạt** | Nút "📥 Import hàng loạt" | Wizard 4 bước: Upload ZIP → Phân tích → Review → Import |
| **Re-train AI** | Nút "🧠 Re-train AI Model" | Dialog thống kê + chọn lịch → job queue → so sánh hiệu suất |
| **Xem thống kê** | Tab "Thống kê độ chính xác" | Dashboard histogram + bảng xếp hạng + drill-down cá nhân |
| **Export báo cáo** | [📤 Export Excel] | File Excel danh sách + confidence + đề xuất xử lý |

---

## Gom nhóm tính năng thông minh

Module **Quản lý Thiết bị** được thiết kế theo nguyên tắc **"Một nơi — Toàn bộ vòng đời phần cứng AI"**:

**1. Camera + Máy điểm danh trong cùng một module**: Hai loại phần cứng phục vụ cùng một mục tiêu điểm danh. Admin không phải vào hai nơi khác nhau — cùng một module, chỉ khác tab. Bản đồ tầng hiển thị cả hai loại thiết bị trên cùng một sơ đồ.

**2. Bản đồ tầng theo khu vực thực tế**: Thay vì danh sách thuần túy, bản đồ cho phép admin thấy ngay thiết bị nào offline và ở vị trí nào trong trường, điều phối nhân viên kỹ thuật đến đúng tầng/dãy mà không cần hỏi.

**3. Kho khuôn mặt là Single Source of Truth**: Toàn bộ ảnh và face embedding sống trên server, tự đồng bộ xuống thiết bị. Khi xóa/cập nhật một người, chỉ cần làm một lần — hệ thống lo phần còn lại trên tất cả máy.

**4. Vòng lặp chất lượng khép kín tự động gợi ý**: Import ảnh → gợi ý Re-train → Re-train xong → hiển thị so sánh hiệu suất → Thống kê phát hiện người kém → gợi ý tạo task chụp lại ảnh → Import bổ sung → gợi ý Re-train. Mọi bước liên kết với nhau, không cần admin tự nhớ quy trình.

**5. Phân tích nguyên nhân thay vì chỉ báo lỗi**: Khi confidence thấp, hệ thống gợi ý lý do (đeo khẩu trang / ánh sáng yếu / góc camera) và đề xuất hành động cụ thể, giúp QTHT giải quyết vấn đề thay vì chỉ biết "có lỗi".

**6. Phân tầng quyền rõ ràng theo loại dữ liệu**: CBQL xem được trạng thái và thống kê nhưng không thể can thiệp cấu hình hay xóa dữ liệu sinh trắc. Dữ liệu khuôn mặt (ảnh gốc) bị làm mờ với CBQL. Chỉ QTHT có thể trigger re-train, xóa thiết bị, xóa khuôn mặt.

---

## Edge Cases & Validation

### Camera
- **RTSP credentials chứa ký tự đặc biệt** (`@`, `:`, `/`): Tự động URL-encode khi generate RTSP URL; hiển thị cảnh báo nếu password dễ gây lỗi parse URL, gợi ý dùng URL thủ công.
- **Camera trùng IP**: Cảnh báo khi thêm camera với IP đã tồn tại: _"IP 192.168.1.101 đã được dùng bởi 'Cổng chính – Vào'. Tiếp tục?"_ — không block nhưng yêu cầu xác nhận.
- **RTSP URL path không chuẩn**: Một số camera có path khác `/Streaming/Channels/101`. Cho phép nhập URL thủ công và test trước khi lưu.
- **Camera đang có người xem live thì bị xóa**: Ngắt stream gracefully, hiện thông báo cho người đang xem _"Camera này vừa bị gỡ khỏi hệ thống."_
- **Camera offline > 15 phút trong giờ học**: Tự động gửi alert email cho QTHT; đánh dấu khu vực tương ứng trên bản đồ bằng màu đỏ nhấp nháy; ghi vào log sự cố.
- **Stream bị lag nặng (fps < 5)**: Hiển thị cảnh báo `🟡 Chậm` trong danh sách; ghi log để theo dõi xu hướng và phân biệt lỗi tạm thời vs cố định.
- **Nhiều admin xem live cùng lúc**: Giới hạn 5 concurrent viewers mỗi camera để tránh overload transcoding server; người thứ 6 nhận thông báo _"Camera đang có tối đa người xem. Thử lại sau ít phút."_
- **Camera DHCP thay đổi IP**: Hệ thống không tự detect — camera badge chuyển Offline khi IP cũ không phản hồi; QTHT cập nhật thủ công; khuyến nghị cấu hình IP tĩnh cho tất cả camera.
- **Thay đổi RTSP credentials khi stream đang chạy**: Ngắt stream cũ → kết nối lại với credentials mới → nếu thất bại thì rollback sang credentials cũ và cảnh báo.

### Máy Điểm Danh
- **Thiết bị mất điện giữa chừng đồng bộ**: Ghi lại trạng thái (đã đồng bộ đến người thứ N); khi máy online lại tự tiếp tục từ điểm bị ngắt, không cần bắt đầu lại từ đầu.
- **Dung lượng bộ nhớ máy đầy (> 80%)**: Cảnh báo trước khi đồng bộ; hỏi "Xóa người không còn trong danh sách active để giải phóng dung lượng?" — xóa theo danh sách Sở/Trường cung cấp.
- **Đồng hồ thiết bị lệch múi giờ**: Phát hiện trong Flow 9; lệch > 5 phút → block đồng bộ và yêu cầu đồng bộ giờ trước; lệch > 30 phút → cảnh báo đỏ _"Timestamp điểm danh sẽ sai nghiêm trọng."_
- **SDK version không tương thích**: Hiển thị lỗi rõ ràng với phiên bản SDK cần thiết; link download firmware mới; không để lỗi 500 generic.
- **Máy đang có người điểm danh thì bắt đầu đồng bộ**: Đồng bộ chạy ở background thread trên máy, không ảnh hưởng chức năng điểm danh đang hoạt động.
- **Thiết bị không hỗ trợ xóa từng người**: Một số model chỉ cho phép xóa toàn bộ; hệ thống cảnh báo và đề xuất "Xóa tất cả rồi đồng bộ lại toàn bộ" thay vì xóa từng người.

### Dữ liệu Khuôn Mặt
- **Ảnh import không có khuôn mặt nào**: Reject ảnh đó, thông báo rõ: _"face_001.jpg: Không phát hiện khuôn mặt. Yêu cầu ảnh chân dung rõ mặt, không che."_
- **Ảnh import có nhiều khuôn mặt** (ảnh nhóm / ảnh chụp chung): Reject, hướng dẫn crop chỉ lấy 1 người.
- **Tên thư mục trong ZIP có dấu cách hoặc ký tự đặc biệt**: Tự chuẩn hóa (trim spaces), cảnh báo nếu sau chuẩn hóa vẫn không khớp mã nào.
- **File ZIP quá lớn (> 500MB)**: Hiện hướng dẫn chia nhỏ thành nhiều batch theo khối lớp; tối đa 500MB mỗi lần upload.
- **Đăng ký khuôn mặt trùng người đã có**: Hỏi confirm _"Nguyễn Văn A đã có 5 ảnh. Thêm ảnh mới vào bộ hay thay thế toàn bộ?"_
- **Re-train AI thất bại giữa chừng**: Rollback về model cũ tự động; ghi stack trace vào log; thông báo QTHT qua email với hướng dẫn kiểm tra dữ liệu đầu vào; model cũ tiếp tục hoạt động bình thường.
- **Model mới kém hơn model cũ sau re-train**: So sánh tự động; nếu kém > 2% → không auto-apply, hiện cảnh báo với phân tích nguyên nhân có thể (dữ liệu mới kém chất lượng, số lượng ảnh ít).
- **Xóa khuôn mặt của người vẫn đang học**: Cảnh báo bổ sung màu đỏ _"Nguyễn Văn A vẫn là HS đang học tại 11B3. Điểm danh bằng AI sẽ không hoạt động sau khi xóa."_
- **Import ảnh cho người đã bị xóa khỏi hệ thống**: Hiện trong báo cáo cột "Mã không tìm thấy", không import; gợi ý kiểm tra lại mã hoặc khôi phục hồ sơ nếu nhầm.
- **Đồng bộ xóa khuôn mặt đến thiết bị đang offline**: Đưa vào queue xóa; khi thiết bị online lại tự thực hiện; badge `⏳ Xóa chờ đồng bộ` trên thiết bị đó cho đến khi hoàn tất.
- **Ảnh chất lượng quá kém không thể tạo embedding**: Ghi nhận là lỗi kỹ thuật (không phải lỗi người dùng); yêu cầu chụp lại theo hướng dẫn cụ thể; người đó không điểm danh được bằng AI cho đến khi có ảnh tốt.
- **Người có ảnh trùng lặp hoàn toàn** (upload cùng một ảnh nhiều lần): Phát hiện hash ảnh trùng, từ chối thêm, thông báo _"Ảnh này đã tồn tại trong bộ. Vui lòng thêm ảnh chụp từ góc/điều kiện khác."_

---

## Tích hợp

- **Module Quản lý Học sinh**: Mã HS là khóa chính liên kết hồ sơ ↔ khuôn mặt. Khi admin xóa HS khỏi hệ thống → tự động trigger xóa khuôn mặt (với confirm riêng). Khi thêm HS mới → gợi ý "Đăng ký khuôn mặt ngay" ngay trong hồ sơ HS.
- **Module Quản lý Giáo viên**: Tương tự HS. Khi GV nghỉ việc/chuyển trường → flow xóa khuôn mặt được trigger tự động kèm thông báo cho QTHT.
- **Module Điểm danh**: Camera và máy điểm danh trong module này là nguồn cấp dữ liệu sự kiện điểm danh. Trạng thái online/offline của từng thiết bị ảnh hưởng trực tiếp đến khả năng điểm danh tại khu vực tương ứng — module Điểm danh đọc trạng thái này để chuyển sang chế độ điểm danh thủ công khi cần.
- **AI Face Recognition Service**: REST API nội bộ (hoặc self-hosted InsightFace/DeepFace) nhận ảnh → trả về face embedding (vector 512 chiều), điểm chất lượng, và metadata khuôn mặt. Module gọi API này trong: đăng ký khuôn mặt, kiểm tra chất lượng ảnh, re-train model, thống kê confidence. Xử lý gracefully khi AI service timeout hoặc overload (queue + retry).
- **RTSP → HLS Transcoding Service**: Trình duyệt không đọc được RTSP trực tiếp. Backend dùng FFmpeg hoặc MediaMTX chuyển RTSP → HLS segments hoặc WebRTC. Module quản lý danh sách stream đang mở, tự đóng stream khi không còn viewer sau 60 giây để tiết kiệm tài nguyên GPU/CPU.
- **Hardware SDK Adapters**: Mỗi nhà sản xuất máy điểm danh có protocol riêng. Hệ thống dùng lớp adapter chuẩn hóa: **ZKTeco** (ZKLib TCP port 4370), **Suprema** (BioStar2 REST API), **Hikvision** (ISAPI HTTP), **Virdi** (FingerStation SDK). Thêm nhà sản xuất mới chỉ cần implement adapter mới, không sửa core logic.
- **Redis Queue**: Quản lý job đồng bộ dữ liệu khuôn mặt xuống thiết bị (tránh duplicate sync jobs); job re-train AI; job xóa khuôn mặt trên thiết bị offline. Retry tự động với exponential backoff.
- **WebSocket / SSE**: Real-time cập nhật trạng thái thiết bị trên bản đồ; live log đồng bộ; notification khi re-train hoàn tất mà không cần F5 trang.
- **NTP / Time Sync**: Thiết bị điểm danh cần đồng bộ giờ với NTP server nội bộ. Module kiểm tra độ lệch giờ khi test kết nối và cảnh báo lệch > 30 giây để tránh timestamp điểm danh sai.
- **Notification Service**: Alert khi: camera offline > 15 phút trong giờ học, đồng bộ thất bại sau 3 lần retry, re-train hoàn tất, confidence trung bình toàn trường giảm > 5%. Kênh: Email QTHT, in-app notification, SMS (tùy chọn).
- **Audit Log Service** (bất biến): Mọi thao tác nhạy cảm ghi audit log gồm: timestamp UTC, user_id, action type, object_id, before/after values, IP request, lý do (với xóa khuôn mặt). Audit log không thể sửa/xóa — phục vụ tuân thủ quy định bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP).
- **Sở GD&ĐT**: Tỷ lệ HS/GV có dữ liệu khuôn mặt đã đăng ký và thống kê thiết bị hoạt động có thể được đưa vào báo cáo hạ tầng số định kỳ nộp Sở.
