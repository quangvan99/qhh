# Hồ Sơ Cá Nhân — Role: Học sinh

## Mục tiêu
Cung cấp cho học sinh một trang hồ sơ cá nhân đầy đủ: thông tin cơ bản, điểm rèn luyện, học bổng, thành tích — tất cả trong một nơi duy nhất, giúp học sinh nắm được toàn bộ "vị thế học sinh" của mình tại trường.

## User Story
"Là học sinh, tôi muốn xem được thông tin cá nhân, điểm rèn luyện và học bổng của mình ở một nơi để tôi nắm rõ tình trạng của mình tại trường và không bỏ lỡ cơ hội nhận học bổng hay khen thưởng."

---

## User Flow Chính

### Flow 1: Xem thông tin cá nhân và hồ sơ học sinh
**Mô tả**: Học sinh muốn kiểm tra thông tin cá nhân đang được lưu trong hệ thống.
**Trigger**: Nhấn avatar/tên HS ở Home feed, hoặc nhấn tab "Hồ sơ" ở bottom nav.
**Steps**:
1. Màn hình Hồ sơ mở ra với ảnh đại diện + tên + lớp + mã học sinh.
2. Phần "Thông tin cá nhân": họ tên, ngày sinh, địa chỉ, số điện thoại, email, GVCN.
3. Phần "Thông tin học tập": lớp hiện tại, năm học, GPA hiện tại, hạnh kiểm.
4. HS kiểm tra thông tin, nhấn "Yêu cầu cập nhật" nếu có thông tin sai.
**Expected Result**: HS biết chính xác thông tin nhà trường đang lưu về mình.

### Flow 2: Xem điểm rèn luyện
**Mô tả**: Học sinh xem điểm rèn luyện tổng hợp từ đầu học kỳ và các mục đã được cộng/trừ điểm.
**Trigger**: Nhấn section "Điểm rèn luyện" trong trang Hồ sơ, hoặc từ thông báo "Điểm rèn luyện vừa cập nhật".
**Steps**:
1. Hiển thị điểm rèn luyện hiện tại (to, rõ ràng): ví dụ "87/100 điểm — Loại Tốt".
2. Breakdown theo nhóm tiêu chí: Học tập / Đạo đức / Hoạt động phong trào / Kỷ luật.
3. Lịch sử giao dịch điểm: từng lần +/- điểm, lý do, ngày tháng, người xác nhận.
4. So sánh với học kỳ trước (nếu có).
5. Gợi ý: "Tham gia 1 hoạt động phong trào nữa để đạt Loại Xuất sắc!"
**Expected Result**: HS hiểu điểm rèn luyện được tính như thế nào và cần làm gì để cải thiện.

### Flow 3: Kiểm tra học bổng
**Mô tả**: Học sinh xem học bổng đang nhận và kiểm tra các học bổng có thể đăng ký.
**Trigger**: Nhấn section "Học bổng" trong trang Hồ sơ.
**Steps**:
1. Hiển thị học bổng đang nhận (nếu có): tên học bổng, giá trị, thời hạn.
2. Lịch sử nhận học bổng các năm trước.
3. Tab "Học bổng sắp mở": danh sách học bổng đang nhận đăng ký / sắp mở / đã đóng.
4. Mỗi học bổng: tiêu chí, giá trị, hạn nộp hồ sơ, nút "Xem điều kiện".
5. Nếu đủ điều kiện: nút "Nộp hồ sơ" active. Nếu chưa đủ: hiển thị "Cần thêm [điều kiện X]".
6. Nhấn "Nộp hồ sơ" → checklist tài liệu cần chuẩn bị + link hướng dẫn.
**Expected Result**: HS biết sớm cơ hội học bổng và được nhắc nhở khi sắp đến hạn nộp.

### Flow 4: Xem thành tích và huy hiệu
**Mô tả**: Học sinh xem các thành tích học tập, khen thưởng và huy hiệu đã đạt được.
**Trigger**: Nhấn section "Thành tích" hoặc "Huy hiệu" trong trang Hồ sơ.
**Steps**:
1. Hiển thị gallery huy hiệu đã đạt: HS giỏi, Học sinh tiêu biểu, Tham gia các cuộc thi...
2. Nhấn vào huy hiệu → xem mô tả chi tiết (đạt khi nào, lý do).
3. Các giải thưởng, bằng khen chính thức (kèm file PDF có thể tải).
4. Danh sách cuộc thi đã tham gia + kết quả.
**Expected Result**: HS có hồ sơ thành tích đầy đủ, có thể dùng khi cần (xét tuyển ĐH, đăng ký học bổng...).

---

## Tính năng & Màn hình

### Màn hình chính — Hồ sơ
- **Layout**: Header profile (ảnh + tên + lớp). Bên dưới: scroll dọc các section card.
- **Components**:
  - `ProfileHeader` — Avatar, tên đầy đủ, lớp, mã HS, QR code cá nhân
  - `QuickStatsBar` — 3 số nhanh: GPA / Điểm rèn luyện / Chuyên cần %
  - `InfoSection` — Thông tin cá nhân dạng list
  - `ConductPointCard` — Card điểm rèn luyện với progress ring
  - `ScholarshipCard` — Card học bổng tóm tắt
  - `AchievementGallery` — Gallery huy hiệu nhỏ
  - `SettingsButton` — Icon ⚙️ góc trên phải: cài đặt thông báo, đổi mật khẩu

- **ProfileHeader** chi tiết:
  - Ảnh đại diện tròn (có thể đổi)
  - Họ và tên
  - Lớp + Khóa học (ví dụ: 12A3 - Khóa 2023–2026)
  - Mã học sinh
  - Nút nhỏ: [QR Code] [Chỉnh sửa] [Chia sẻ hồ sơ]

- **QuickStatsBar** — 3 thông số quan trọng nhất:
  - 🎓 GPA: 8.2 (Giỏi)
  - ⭐ Rèn luyện: 87 (Tốt)
  - 📅 Chuyên cần: 95%

### Section Thông tin cá nhân
- Layout: List row (label + value)
- Thông tin hiển thị:
  - Họ và tên đầy đủ
  - Ngày sinh
  - Giới tính
  - CCCD/CMND
  - Địa chỉ thường trú
  - Điện thoại liên hệ
  - Email học sinh
  - Tên phụ huynh + SĐT phụ huynh
  - Giáo viên chủ nhiệm
  - Phòng ban (tổ) học
- Nút "Yêu cầu cập nhật thông tin" — mở form gửi yêu cầu đến giáo vụ

### Section Điểm rèn luyện
- **Điểm tổng**: Số to + ring progress + xếp loại
- **Breakdown 4 nhóm**:
  - 📚 Học tập: XX/40 điểm
  - 💙 Đạo đức, lối sống: XX/25 điểm
  - 🎪 Hoạt động phong trào: XX/25 điểm
  - 📋 Kỷ luật, chuyên cần: XX/10 điểm
- **Lịch sử giao dịch** (collapsible):
  - +5 điểm — "Đạt giải Ba kỳ thi Toán tỉnh" — 15/11/2025
  - -2 điểm — "Vi phạm nội quy trang phục" — 03/09/2025
  - +3 điểm — "Tham gia hoạt động tình nguyện" — 20/10/2025
- **Xếp loại**:
  - Xuất sắc: 90–100
  - Tốt: 75–89
  - Khá: 60–74
  - Trung bình: 50–59
  - Yếu: <50

### Section Học bổng
- **Đang nhận** (nếu có): Card nổi bật — tên HB, giá trị/kỳ, hạn nhận tiếp theo
- **Lịch sử**: Các học bổng đã nhận qua các kỳ
- **Cơ hội mới**: List học bổng đang mở đăng ký
  - Tên học bổng
  - Tổ chức trao
  - Giá trị (triệu đồng/suất)
  - Hạn nộp (countdown nếu sắp hết)
  - Điều kiện ngắn gọn
  - CTA: "Đủ điều kiện — Nộp hồ sơ" / "Chưa đủ — Xem điều kiện"

### Section Thành tích & Huy hiệu
- **Huy hiệu**: Grid 4 cột các badge nhỏ tròn
  - 🏅 Học sinh Giỏi (bao nhiêu kỳ liên tiếp)
  - 🥇 Giải thưởng cuộc thi
  - 🌟 Học sinh tiêu biểu
  - 📖 Đọc sách thư viện nhiều nhất
  - 🎯 Hoàn thành 100% bài tập tháng X
  - v.v.
- **Bằng khen / Giấy khen**: List với thumbnail + nút tải PDF
- **Cuộc thi đã tham gia**: Timeline dọc

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Đổi ảnh đại diện | Tap avatar | Mở camera/gallery |
| Xem QR cá nhân | Tap "QR Code" | Hiển thị QR to |
| Yêu cầu sửa thông tin | Tap "Yêu cầu cập nhật" | Form gửi yêu cầu |
| Xem chi tiết rèn luyện | Tap ConductPointCard | Mở màn hình chi tiết |
| Xem học bổng | Tap ScholarshipCard | Mở danh sách học bổng |
| Nộp hồ sơ học bổng | Tap "Nộp hồ sơ" | Hướng dẫn + form nộp |
| Xem huy hiệu | Tap badge | Popup mô tả huy hiệu |
| Tải bằng khen | Tap "Tải PDF" | Download file bằng khen |
| Đổi mật khẩu | Tap ⚙️ > Bảo mật | Màn hình đổi mật khẩu |
| Đăng xuất | Tap ⚙️ > Đăng xuất | Confirm → Đăng xuất |

---

## Gom nhóm tính năng thông minh

**Tại sao gom "thông tin cá nhân + rèn luyện + học bổng + thành tích" vào Hồ sơ?**
- Tất cả đều thuộc về "danh tính học sinh tại trường" — không phải hoạt động hàng ngày, nhưng khi cần (đăng ký học bổng, xét tuyển ĐH) cần tìm được ngay.
- Điểm rèn luyện và học bổng thường bị HS bỏ qua vì không biết mình đang ở đâu. Đặt trong Hồ sơ + hiển thị trong QuickStatsBar trên Home giúp HS nhận thức hơn về các chỉ số này.
- "Gợi ý cải thiện điểm rèn luyện" biến trang hồ sơ từ nơi "xem thụ động" thành "công cụ hành động" — HS biết phải làm gì tiếp theo để cải thiện.
- Huy hiệu gamification tạo động lực học tập nội tại — HS cảm thấy được ghi nhận cho mọi nỗ lực, không chỉ điểm số.

---

## UX Notes
- **Màu sắc**:
  - Profile background: gradient nhẹ màu xanh dương đại diện trường
  - Rèn luyện Xuất sắc: gold `#FFD700`
  - Rèn luyện Tốt: xanh lá `#43A047`
  - Rèn luyện Khá: xanh dương `#1E88E5`
  - Cộng điểm: `+` xanh lá
  - Trừ điểm: `-` đỏ
- **Animation**:
  - Vào trang: ảnh đại diện zoom in + fade in header
  - Ring progress: animate fill khi scroll đến section
  - Huy hiệu mới: shimmer effect + "Mới!" badge
  - QuickStats: số count-up khi lần đầu vào trang
- **QR Code cá nhân**: Dùng cho mục đích nhận diện trong trường (kiểm tra thư viện, sự kiện...). Không embed thông tin nhạy cảm.
- **Privacy settings**: HS chọn thông tin nào hiển thị nếu hồ sơ có chế độ public (chia sẻ với bạn cùng lớp).
- **Empty states**:
  - Chưa có huy hiệu: "Bạn chưa có thành tích nào. Hoàn thành bài tập, thi tốt và tham gia hoạt động để nhận huy hiệu! 🏅"
  - Chưa có học bổng: "Hiện không có học bổng nào đang mở. Theo dõi để nhận thông báo sớm! 🔔"
  - Rèn luyện chưa được tổng kết: "Điểm rèn luyện sẽ được tổng kết vào cuối học kỳ."

---

## Edge Cases
- **Ảnh đại diện vi phạm quy định** (không phải ảnh thẻ): Hiển thị thông báo sau khi upload: "Ảnh đại diện cần là ảnh thẻ nền trắng. Ảnh của bạn đang chờ GV duyệt."
- **Thông tin cá nhân sai** (nhập nhầm CMND...): Form yêu cầu cập nhật gửi đến giáo vụ, không tự sửa được để tránh gian lận. Trạng thái yêu cầu hiển thị trong app.
- **Điểm rèn luyện bị khiếu nại**: Nút "Khiếu nại điểm" bên cạnh từng giao dịch điểm, gửi đến GVCN xem xét.
- **Nhiều loại học bổng phức tạp**: Filter học bổng theo "Đủ điều kiện ngay" để HS tập trung vào cơ hội thực tế.
- **File bằng khen bị lỗi / không tải được**: Retry + "Báo lỗi để Admin kiểm tra".
- **HS không có ảnh đại diện**: Hiển thị avatar mặc định với chữ cái đầu tên (tên: Nguyễn Minh → avatar "M") với màu ngẫu nhiên nhưng nhất quán.
- **Tài khoản bị vô hiệu hóa tạm thời**: Hiển thị banner đỏ giải thích lý do + số điện thoại liên hệ giáo vụ để giải quyết.
- **HS chuyển lớp**: Cập nhật thông tin lớp ngay lập tức. Lịch sử lớp cũ vẫn lưu trong hồ sơ.
