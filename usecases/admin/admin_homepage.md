# Dashboard Tổng Quan (Homepage) — Role: Admin

## Mục tiêu
Cung cấp cho Admin (QTHT & CBQL) một bảng điều khiển trung tâm, hiển thị ngay lập tức các KPIs quan trọng nhất của toàn trường, cảnh báo cần xử lý và lối tắt đến các tác vụ thường dùng — tất cả trên một màn hình duy nhất khi mở ứng dụng.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền xem và tương tác tất cả widget; chỉnh sửa layout dashboard; nhận mọi loại cảnh báo hệ thống; truy cập nhanh mọi module.
- **CBQL**: Xem KPIs cấp trường; nhận thông báo về HS/GV; không thấy widget cấu hình hệ thống; có thể tùy chỉnh bố cục trong phạm vi quyền.

---

## User Flow Chính

### Flow 1: Mở ứng dụng & nhận diện tình trạng hệ thống
**Mô tả**: Admin đăng nhập và ngay lập tức nắm bắt tình trạng toàn trường trong vòng 10 giây.
**Trigger**: Đăng nhập thành công / Nhấn biểu tượng Home trên sidebar.
**Steps**:
1. Hệ thống load dashboard với skeleton screen (< 1.5s).
2. Hiển thị dải **Alert Banner** (nền vàng/đỏ) nếu có cảnh báo khẩn: thiết bị chấm công offline, thi đang diễn ra có sự cố, server disk > 90%.
3. Row 1 — **KPI Cards** (5 card ngang): Sĩ số HS hôm nay / Tỷ lệ đi học / GV có mặt / Sách đang mượn / Cuộc thi đang chạy.
4. Row 2 — **Biểu đồ nhanh**: Điểm danh 7 ngày (line chart) | Học bổng theo tháng (bar) | Top 5 lớp có tỉ lệ vắng cao nhất (horizontal bar).
5. Row 3 — **Panels**: Thông báo mới nhất (5 item) | Tác vụ chờ xử lý (to-do list) | Lịch sự kiện tuần này.
6. Admin đọc Alert Banner → click "Xem chi tiết" → chuyển đến module liên quan (không cần tìm trong menu).
**Expected Result**: Admin không cần điều hướng để nắm bức tranh toàn cảnh; nhấp 1 lần đến đúng nơi cần xử lý.

---

### Flow 2: Xử lý nhanh tác vụ từ Dashboard (Quick Actions)
**Mô tả**: Admin thực hiện tác vụ thường gặp mà không cần vào module con.
**Trigger**: Admin thấy một mục trong "Tác vụ chờ xử lý" hoặc nhấn nút **[+] Quick Action**.
**Steps**:
1. Nhấn nút **[+] Quick Action** (floating button góc dưới phải hoặc thanh ngang dưới KPI).
2. Popup "Quick Action Hub" hiện ra với 8 shortcut hay dùng nhất (có thể tùy chỉnh):
   - Thêm học sinh mới
   - Nhập điểm rèn luyện hàng loạt
   - Tạo thông báo toàn trường
   - Mở ca thi khẩn
   - Duyệt đơn xin nghỉ GV
   - Xuất báo cáo điểm danh hôm nay
   - Reset mật khẩu tài khoản
   - Kiểm tra camera live
3. Admin chọn shortcut → modal/drawer tương ứng mở ra ngay trên dashboard (không rời trang).
4. Hoàn thành tác vụ → đóng modal → dashboard tự refresh widget liên quan.
**Expected Result**: Hoàn thành tác vụ thường gặp trong < 3 click, không mất ngữ cảnh dashboard.

---

### Flow 3: Tùy chỉnh layout Dashboard cá nhân
**Mô tả**: Mỗi Admin có thể kéo-thả, ẩn/hiện widget phù hợp với công việc hàng ngày.
**Trigger**: Nhấn nút **"Tùy chỉnh Dashboard"** (icon bút chì góc trên phải).
**Steps**:
1. Dashboard chuyển sang **Edit Mode**: các widget có handle kéo-thả, nút X để ẩn.
2. Panel bên phải liệt kê "Widget Library" — tất cả widget khả dụng theo role.
3. Admin kéo widget muốn thêm từ library vào lưới dashboard.
4. Admin kéo thả để sắp xếp lại vị trí; resize widget (1×1, 1×2, 2×2 grid unit).
5. Nhấn **"Lưu bố cục"** → layout được ghi vào profile user.
6. Nút **"Reset về mặc định"** để khôi phục layout gốc theo role.
**Expected Result**: Dashboard phản ánh đúng ưu tiên công việc của từng admin; cài đặt lưu xuyên suốt các phiên đăng nhập.

---

### Flow 4: Theo dõi cảnh báo & thông báo thời gian thực
**Mô tả**: Admin nhận và xử lý thông báo khẩn không bị bỏ sót.
**Trigger**: Hệ thống sinh ra event (thiết bị offline, HS vắng bất thường, kỳ thi sắp bắt đầu...).
**Steps**:
1. Icon chuông trên topbar hiển thị badge số lượng thông báo chưa đọc (đỏ nếu có cảnh báo khẩn).
2. Click chuông → Drawer thông báo trượt từ phải: phân loại tab (Khẩn cấp | Hệ thống | Học vụ | Thư viện | E-learning).
3. Mỗi thông báo có: icon severity (đỏ/vàng/xanh), tiêu đề, mô tả ngắn, thời gian, nút "Xem / Xử lý".
4. Click "Xử lý" → Deep link đến đúng màn hình trong module tương ứng.
5. Admin có thể "Mark all as read" hoặc "Bỏ qua loại này trong X ngày".
6. Widget "Thông báo" trên dashboard cũng cập nhật real-time (WebSocket).
**Expected Result**: Không bỏ sót cảnh báo quan trọng; xử lý ngay từ notification panel mà không mất thời gian tìm kiếm.

---

## Tính năng & Màn hình

### Màn hình chính — Layout
```
┌─────────────────────────────────────────────────────────────┐
│ TOPBAR: Logo | Breadcrumb | 🔔 Thông báo | Avatar + Logout  │
├────────────┬────────────────────────────────────────────────┤
│            │ [!] ALERT BANNER (ẩn nếu không có cảnh báo)   │
│  SIDEBAR   ├────────────────────────────────────────────────┤
│  (collap-  │ KPI CARDS (5 cards ngang, responsive)          │
│   sible)   ├──────────────┬─────────────┬──────────────────┤
│            │ Chart: Điểm  │ Chart: Học  │ Top 5 Lớp        │
│  ● Home    │ danh 7 ngày  │ bổng/tháng  │ vắng nhiều nhất  │
│  ● QL Đào  ├──────────────┴──────┬──────┴──────────────────┤
│    tạo     │ Thông báo mới (5)   │ Tác vụ chờ (todo list) │
│  ● Thư     ├─────────────────────┤                         │
│    viện    │ Lịch sự kiện tuần  │ Trạng thái thiết bị     │
│  ● E-learn ├─────────────────────┴─────────────────────────┤
│  ● Thi     │ QUICK ACTION BAR: [+HS] [+GV] [Báo cáo] ...   │
│  ● Chấm    └─────────────────────────────────────────────────┘
│    công
│  ● Báo cáo
│  ● Hệ thống
└────────────
```

### KPI Cards — Chi tiết
| Card | Metric chính | Metric phụ | Màu cảnh báo |
|------|-------------|-----------|-------------|
| Sĩ số hôm nay | X/Y HS có mặt | % so hôm qua | Đỏ nếu < 90% |
| Giáo viên | X/Y GV đi dạy | Tiết dạy hôm nay | Vàng nếu < 95% |
| Thư viện | X sách đang mượn | X quá hạn | Đỏ nếu quá hạn > 0 |
| E-learning | X lớp đang học | X bài tập chờ chấm | Vàng nếu > 50 bài |
| Hệ thống | X thiết bị online | Disk/CPU trung bình | Đỏ nếu có thiết bị offline |

### Widget Library (đầy đủ)
- **Điểm danh**: Biểu đồ điểm danh ngày/tuần/tháng, heatmap vắng theo lớp
- **Học vụ**: Thống kê HS theo khối/lớp, học bổng tháng, điểm rèn luyện trung bình
- **Thư viện**: Top sách mượn nhiều, biểu đồ mượn trả, sách quá hạn
- **E-learning**: Tiến độ khóa học, điểm trung bình bài kiểm tra
- **Thi**: Lịch thi sắp tới, kết quả kỳ thi gần nhất
- **Hệ thống**: Trạng thái server, log lỗi gần đây, số user online
- **Nhân sự**: GV vắng hôm nay, đơn xin nghỉ chờ duyệt

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Refresh dashboard | F5 / Nút reload | Tất cả widget fetch data mới |
| Xem chi tiết KPI | Click vào KPI card | Mở modal drill-down hoặc chuyển module |
| Đánh dấu đọc thông báo | Click checkbox | Badge giảm, item mờ đi |
| Xóa thông báo | Swipe left / nút X | Xóa khỏi danh sách |
| Xuất snapshot | Nút "Xuất PDF" | Export dashboard hiện tại thành PDF |
| Chia sẻ KPI | Nút "Chia sẻ" | Gửi báo cáo nhanh qua email/HUE-S |
| Pin widget | Right-click → Pin | Widget không bị ẩn khi reset |
| Toggle dark mode | Topbar icon | Chuyển giao diện sáng/tối |

---

## Gom nhóm tính năng thông minh
Dashboard gom tất cả "đầu vào thông tin" (KPIs, thông báo, lịch) và "đầu ra hành động" (quick actions, links đến module) vào một trang duy nhất. Nguyên tắc: Admin không cần biết thông tin nằm ở module nào — hệ thống tự đưa đến. Việc nhóm Alert Banner + KPI Card + To-do List ở cùng viewport đảm bảo Admin có thể đọc "morning briefing" trong 30 giây mỗi sáng.

---

## Edge Cases & Validation
- **Dashboard trống**: Nếu là ngày đầu năm học, KPI hiển thị 0 kèm hint "Bắt đầu bằng việc nhập danh sách học sinh".
- **Dữ liệu trễ**: Nếu widget không fetch được (timeout 5s), hiển thị trạng thái "Đang tải..." với nút retry thay vì màn hình lỗi.
- **Role mismatch**: CBQL cố truy cập widget hệ thống → widget hiển thị "Bạn không có quyền xem mục này" thay vì ẩn hoàn toàn (tránh confusion).
- **Quá nhiều thông báo**: Nếu > 99 thông báo chưa đọc, badge hiện "99+"; drawer thông báo có lazy-load (load thêm khi scroll).
- **Session timeout**: Dashboard hiện modal "Phiên đăng nhập hết hạn" với nút "Đăng nhập lại" giữ nguyên URL hiện tại.
- **Mobile responsive**: KPI cards xếp 2×3 trên tablet, 1 cột trên mobile; sidebar thu gọn thành bottom navigation.
- **Offline mode**: Hiện banner "Mất kết nối — đang hiển thị dữ liệu cache" với timestamp cache lần cuối.

---

## Tích hợp
- **Kết nối với module**: Tất cả 4 khối chức năng (QL Đào tạo, Thư viện, E-learning/Thi, Chấm công) — dashboard pull KPI từ API của từng module.
- **Thông báo real-time**: WebSocket / Server-Sent Events để cập nhật KPI và notification live.
- **External API**: HUE-S (chia sẻ báo cáo), Sở GD&ĐT (đồng bộ dữ liệu), Email/SMS gateway (gửi cảnh báo khẩn).
- **Export**: PDF renderer (Puppeteer/WeasyPrint), Excel export (xlsx).
- **Auth**: SSO — dashboard là landing page sau khi xác thực thành công.
- **Analytics**: Ghi log hành vi Admin (widget nào được click nhiều nhất) để tối ưu layout mặc định theo thời gian.
