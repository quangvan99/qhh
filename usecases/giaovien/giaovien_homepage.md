# Dashboard Giáo Viên (Homepage) — Role: Giáo viên

## Mục tiêu
Cung cấp cho giáo viên một bảng điều khiển tập trung, hiển thị ngay lập tức những việc cần làm trong ngày: lịch dạy, điểm danh cần xác nhận, bài nộp chờ chấm và thông báo quan trọng — giúp giáo viên bắt đầu ngày làm việc nhanh chóng mà không cần điều hướng nhiều màn hình.

## Người dùng
- **Giáo viên bộ môn**: Xem lịch dạy theo môn, bài nộp của lớp mình dạy, điểm danh tiết học của mình.
- **Giáo viên chủ nhiệm**: Có thêm widget tổng hợp chuyên cần toàn lớp chủ nhiệm, thông báo học sinh vi phạm, liên lạc phụ huynh nhanh.

---

## User Flow Chính

### Flow 1: Bắt đầu ngày làm việc — Xem việc cần làm hôm nay
**Mô tả**: GV mở ứng dụng, dashboard hiển thị tổng quan công việc trong ngày theo thứ tự ưu tiên.
**Trigger**: GV đăng nhập thành công hoặc mở lại app.
**Steps**:
1. Hệ thống xác thực phiên đăng nhập → load dashboard.
2. Widget **"Lịch dạy hôm nay"** hiển thị danh sách tiết theo thứ tự thời gian (tiết 1 → tiết cuối), mỗi tiết ghi rõ: Lớp – Môn – Phòng – Giờ bắt đầu.
3. Widget **"Điểm danh cần xác nhận"** nổi badge đỏ nếu có tiết chưa xác nhận. Hiển thị: Lớp, Tiết, Số HS vắng/muộn AI phát hiện.
4. Widget **"Bài tập/Thi chờ chấm"** liệt kê các bài tập đã đến hạn, số lượng bài đã nộp / chưa chấm.
5. Widget **"Thông báo mới"** hiển thị 5 thông báo gần nhất (BGH, phòng đào tạo, thông báo từ HS).
6. GV đọc tổng quan → bấm vào bất kỳ widget nào để đi thẳng vào chức năng tương ứng.
**Expected Result**: GV biết ngay 100% việc cần làm hôm nay trong vòng < 10 giây sau khi mở app.

---

### Flow 2: Xác nhận nhanh điểm danh từ Dashboard
**Mô tả**: GV xác nhận điểm danh ngay trên dashboard mà không cần vào module điểm danh.
**Trigger**: GV bấm vào widget "Điểm danh cần xác nhận".
**Steps**:
1. Mở modal/panel trượt từ phải sang, hiển thị danh sách tiết cần xác nhận.
2. Mỗi tiết có nút **"Xác nhận"** (nếu đồng ý với AI) hoặc **"Xem chi tiết"** (nếu muốn điều chỉnh).
3. Bấm **"Xác nhận tất cả"** → hệ thống bulk-confirm tất cả tiết đang hiển thị.
4. Badge đỏ biến mất. Panel tự đóng sau 1.5s.
**Expected Result**: GV xác nhận điểm danh trong < 30 giây, không cần rời dashboard.

---

### Flow 3: Chuyển lớp nhanh (Context Switching)
**Mô tả**: GV đang dạy nhiều lớp, cần xem thông tin lớp khác.
**Trigger**: GV bấm vào dropdown **"Đổi lớp"** ở header hoặc bấm tên lớp trên widget lịch dạy.
**Steps**:
1. Dropdown hiện danh sách tất cả lớp GV đang phụ trách kỳ này.
2. GV chọn lớp → dashboard lọc lại tất cả widget theo lớp đó.
3. Breadcrumb ở đầu trang cập nhật: `Dashboard > Lớp 11A2`.
4. GV bấm "Tất cả lớp" để quay về view tổng hợp.
**Expected Result**: Chuyển context giữa các lớp trong 2 click.

---

### Flow 4: Xem thông báo và phản hồi nhanh
**Mô tả**: GV đọc và xử lý thông báo ngay trên dashboard.
**Trigger**: GV bấm vào thông báo trong widget "Thông báo mới".
**Steps**:
1. Panel thông báo mở rộng ra, hiển thị nội dung đầy đủ.
2. Nếu thông báo yêu cầu hành động (VD: "Duyệt kế hoạch tuần") → có nút CTA inline.
3. Nếu là câu hỏi của HS → có ô trả lời nhanh ngay trong panel.
4. Sau khi xử lý → thông báo chuyển trạng thái "Đã đọc", biến khỏi danh sách chờ xử lý.
**Expected Result**: GV không cần rời dashboard để phản hồi các thông báo thông thường.

---

## Tính năng & Màn hình

### Màn hình chính — Layout Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Logo | [Đổi lớp ▼] | 🔔(3) | Avatar GV        │
├──────────────────────────┬──────────────────────────────┤
│  LỊCH DẠY HÔM NAY        │  ĐIỂM DANH CẦN XÁC NHẬN 🔴 │
│  ─────────────────────   │  ─────────────────────────  │
│  Tiết 1 | 11A2 | Toán   │  11A2 – Tiết 1: 2 HS vắng  │
│  07:00 – 07:45 | P.201   │  [Xem] [Xác nhận ✓]         │
│  ─────────────────────   │  ─────────────────────────  │
│  Tiết 3 | 12B1 | Toán   │  12B1 – Tiết 3: 1 HS muộn  │
│  09:00 – 09:45 | P.305   │  [Xem] [Xác nhận ✓]         │
│  ─────────────────────   │  ─────────────────────────  │
│  [Xem lịch đầy đủ →]    │  [Xác nhận tất cả]           │
├──────────────────────────┼──────────────────────────────┤
│  BÀI TẬP CHỜ CHẤM        │  THÔNG BÁO MỚI               │
│  ─────────────────────   │  ─────────────────────────  │
│  Bài KT 15' – 11A2       │  🏫 BGH: Lịch họp HĐ 18/3  │
│  Hạn: 16/3 | 28/30 bài   │  📚 TV: Sách mới nhập kho   │
│  [Chấm ngay →]           │  👤 HS Nguyễn Văn A hỏi...  │
│  ─────────────────────   │  ─────────────────────────  │
│  Đề thi GK – 12B1        │  [Xem tất cả thông báo →]   │
│  Hạn: 14/3 | 15/32 bài   │                              │
│  [Chấm ngay →]           │                              │
├──────────────────────────┴──────────────────────────────┤
│  TIẾN ĐỘ KHÓA HỌC (mini)                                │
│  11A2 – Toán 11: ████████░░ 78%  |  12B1 – Toán 12: ██░ 45% │
└─────────────────────────────────────────────────────────┘
```

### Components chi tiết

#### Widget Lịch dạy hôm nay
- Hiển thị tối đa 5 tiết (scroll nếu nhiều hơn).
- Tiết đang diễn ra: highlight màu xanh lá, ghi "Đang dạy".
- Tiết đã qua: mờ 50%, ghi "Hoàn thành".
- Tiết sắp tới (trong 30 phút): badge "Sắp đến" màu cam.
- Bấm vào tiết → mở modal chi tiết: danh sách HS, tài liệu tiết đó.

#### Widget Điểm danh cần xác nhận
- Badge số lượng tiết chưa xác nhận (màu đỏ).
- Mỗi dòng: Lớp + Tiết + Số HS vắng/muộn phát hiện bởi AI.
- Button "Xem" → mở màn hình điểm danh chi tiết.
- Button "Xác nhận ✓" → 1-click confirm ngay tại chỗ.
- Button "Xác nhận tất cả" → bulk confirm.

#### Widget Bài tập chờ chấm
- Sắp xếp theo: quá hạn (đỏ) > gần hạn (cam) > còn thời gian (xanh).
- Hiển thị: Tên bài, Lớp, Hạn nộp, Số bài đã nộp / Tổng số HS.
- Progress bar: X/Y bài đã chấm.
- Button "Chấm ngay" → vào màn hình chấm bài inline.

#### Widget Thông báo mới
- Phân loại bằng icon: 🏫 BGH, 📚 Thư viện, 👤 HS/PH, 📋 Hệ thống.
- Badge số thông báo chưa đọc.
- Click thông báo → expand inline (không redirect).
- Thông báo cần hành động có nút CTA màu cam.

#### Header Bar
- Dropdown "Đổi lớp": danh sách lớp đang dạy, có tìm kiếm nhanh.
- Icon chuông: số thông báo chưa đọc.
- Avatar GV: bấm → menu cá nhân (hồ sơ, cài đặt, đăng xuất).

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Xác nhận điểm danh 1-click | Bấm ✓ trên widget | Tiết đó xác nhận, badge giảm 1 |
| Xác nhận tất cả điểm danh | Bấm "Xác nhận tất cả" | Tất cả tiết hôm nay xác nhận, badge về 0 |
| Chấm bài nhanh | Bấm "Chấm ngay" | Mở panel chấm bài inline |
| Đổi lớp | Chọn lớp từ dropdown header | Toàn bộ dashboard lọc theo lớp |
| Xem lịch đầy đủ | Bấm link lịch dạy | Chuyển sang module Lịch dạy |
| Phản hồi thông báo | Expand thông báo → gõ phản hồi | Gửi trả lời ngay, đánh dấu đã xử lý |
| Xem tiến độ lớp | Bấm thanh progress | Chuyển sang module Kết quả học tập |

---

## Gom nhóm tính năng thông minh

Dashboard áp dụng nguyên tắc **"3-zone priority"**:
- **Zone Đỏ (Khẩn cấp)**: Điểm danh chưa xác nhận, bài quá hạn chưa chấm → hiển thị đầu tiên, màu đỏ/cam.
- **Zone Vàng (Hôm nay)**: Lịch dạy hôm nay, bài sắp đến hạn → hiển thị trung tâm.
- **Zone Xanh (Tổng quan)**: Tiến độ khóa học, thống kê tuần → hiển thị dưới cùng, ít nổi bật hơn.

Hệ thống **auto-collapse** các widget không liên quan hôm nay để giảm nhiễu thông tin. Cuối tuần/ngày nghỉ, dashboard tự chuyển sang "Chế độ lên kế hoạch" — hiển thị việc cần chuẩn bị cho tuần tới.

---

## Edge Cases & Validation

- **GV chưa có tiết nào hôm nay**: Widget lịch dạy hiển thị "Hôm nay bạn không có tiết dạy 🎉. Tiết gần nhất: [ngày/tiết]."
- **Không có bài nào chờ chấm**: Widget hiển thị "Không có bài nào chờ chấm. Bạn đang rảnh!" với icon vui.
- **Mất kết nối mạng**: Banner vàng đầu trang "Đang offline — hiển thị dữ liệu đã cache lúc HH:MM". Disable các action cần realtime.
- **Camera AI không hoạt động**: Widget điểm danh hiển thị cảnh báo "Hệ thống camera chưa ghi nhận tiết X — vui lòng điểm danh thủ công."
- **GV dạy > 8 lớp**: Dropdown đổi lớp có thanh tìm kiếm để tránh danh sách quá dài.
- **Thông báo chưa đọc > 99**: Badge hiển thị "99+" thay vì số thực.
- **Timezone**: Tất cả giờ hiển thị theo múi giờ Việt Nam (GMT+7), lịch dạy tính theo lịch học chính thức của trường.

---

## Tích hợp

- **Module QL Đào tạo**: Lấy dữ liệu lớp học, danh sách HS, lịch dạy.
- **Module QL Chấm công**: Nhận kết quả điểm danh AI camera theo thời gian thực.
- **Module E-learning & Thi trực tuyến**: Lấy danh sách bài tập/thi chờ chấm, tiến độ khóa học.
- **Module Thông báo**: Nhận push notification từ BGH, phòng đào tạo, HS/PH.
- **Calendar Service**: Đồng bộ lịch dạy với Google Calendar / iCal (tùy chọn).
- **WebSocket**: Cập nhật realtime cho badge điểm danh và bài nộp mới.
