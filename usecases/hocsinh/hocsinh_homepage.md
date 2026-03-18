# Feed Cá Nhân / Trang Chủ — Role: Học sinh

## Mục tiêu
Cung cấp cho học sinh một trang chủ cá nhân hóa, hiển thị ngay lập tức những việc cần làm hôm nay, deadline sắp đến, thông báo mới từ giáo viên và điểm số gần nhất — không cần phải đi tìm từng nơi.

## User Story
"Là học sinh, tôi muốn mở app và thấy ngay hôm nay tôi cần làm gì để tôi không bỏ lỡ bài tập, bài thi hay thông báo quan trọng nào."

---

## User Flow Chính

### Flow 1: Mở app buổi sáng — kiểm tra lịch học & việc cần làm
**Mô tả**: Học sinh mở app đầu ngày, lướt qua feed để nắm bắt toàn bộ nhiệm vụ trong ngày.
**Trigger**: Học sinh mở ứng dụng hoặc nhấn icon Home ở bottom nav.
**Steps**:
1. App hiển thị màn hình Home với greeting cá nhân: "Chào Minh! Hôm nay thứ Ba 📅"
2. Section **"Cần làm hôm nay"** xuất hiện ngay đầu — liệt kê tối đa 5 item ưu tiên nhất (bài tập sắp đến hạn, bài thi hôm nay, nội dung GV giao).
3. Section **"Deadline sắp tới"** (3–7 ngày tới) hiển thị dạng timeline nhỏ gọn.
4. Section **"Thông báo mới"** hiển thị badge đỏ nếu có thông báo chưa đọc.
5. Section **"Điểm gần đây"** hiển thị 2–3 điểm mới nhất vừa được GV chấm.
6. HS nhấn vào bất kỳ item nào → chuyển thẳng đến màn hình tương ứng (bài tập / phòng thi / môn học).
**Expected Result**: Học sinh biết rõ 3 việc quan trọng nhất cần làm ngay hôm nay, trong vòng <10 giây sau khi mở app.

### Flow 2: Nhận thông báo push → mở app → xử lý ngay
**Mô tả**: Học sinh nhận notification từ GV về bài tập mới, nhấn thẳng vào notification.
**Trigger**: Push notification từ hệ thống (GV đăng bài tập mới / sắp đến hạn nộp).
**Steps**:
1. Notification xuất hiện trên màn hình điện thoại: "📝 Toán - Bài tập số 5 sắp đến hạn (còn 2 giờ)"
2. Học sinh nhấn vào notification.
3. App mở thẳng tới màn hình chi tiết bài tập đó (deep link).
4. HS thấy đề bài, nộp bài hoặc đánh dấu "Xem sau".
**Expected Result**: HS đến thẳng nơi cần hành động, không phải tìm kiếm thêm.

### Flow 3: Kéo xuống refresh — cập nhật nội dung mới
**Mô tả**: Học sinh kiểm tra lại sau giờ học để xem GV có thêm gì không.
**Trigger**: Kéo xuống (pull-to-refresh) trên màn hình Home.
**Steps**:
1. Animation loading nhẹ xuất hiện trong 1–2 giây.
2. Feed cập nhật: thông báo mới nổi lên đầu, item đã hoàn thành tự động gạch bỏ.
3. Badge số trên icon thông báo cập nhật.
**Expected Result**: Nội dung luôn mới nhất, HS không cần đăng xuất/đăng nhập lại.

---

## Tính năng & Màn hình

### Màn hình chính — Home Feed
- **Layout**: Single-column scroll dọc, mobile-first. Top bar cố định (tên HS + avatar + bell icon). Content chia thành các card section rõ ràng.
- **Components**:
  - `GreetingCard` — Lời chào + ngày tháng + avatar HS
  - `TodayTaskList` — Danh sách việc cần làm hôm nay (tối đa 5 item)
  - `DeadlineTimeline` — Timeline dọc hiển thị deadline 7 ngày tới
  - `NotificationFeed` — Thông báo mới từ GV/hệ thống
  - `RecentScoreCard` — Điểm mới nhất (môn + điểm + ngày chấm)
  - `QuickAccessBar` — Shortcut: Học / Thi / Thư viện / Hồ sơ
- **Info hiển thị theo thứ tự ưu tiên**:
  1. Bài thi/kiểm tra **hôm nay** (màu đỏ, nổi bật nhất)
  2. Bài tập **sắp đến hạn** (còn < 24h — màu cam)
  3. Nội dung học **được GV giao tuần này** (màu xanh)
  4. Thông báo chưa đọc (badge số)
  5. Điểm vừa được chấm (xanh lá = đạt, đỏ = cần cải thiện)

### Vùng "Cần làm hôm nay"
- Hiển thị dạng checklist, mỗi item có icon loại (📝 bài tập / 🎯 bài thi / 📖 xem nội dung)
- Khi hoàn thành, item tự động check ✅ và mờ đi (không biến mất ngay — HS cảm thấy thành tựu)
- Nếu không có việc gì: hiển thị "🎉 Hôm nay bạn đã hoàn thành tất cả!" với confetti nhỏ

### Vùng Deadline sắp tới
- Dạng pill timeline ngang (có thể scroll ngang) hoặc list dọc
- Mỗi pill: [Tên môn] · [Tên bài] · [Còn X ngày]
- Màu sắc: đỏ (<1 ngày), cam (1–2 ngày), vàng (3–5 ngày), xanh (>5 ngày)

### Vùng Điểm gần đây
- Hiển thị tối đa 3 điểm mới nhất
- Format: Avatar môn + tên bài + điểm to + ngày chấm
- Nhấn vào → mở màn hình Kết quả chi tiết

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Nhấn item "Cần làm" | Tap vào task card | Mở thẳng màn hình tương ứng |
| Nhấn bell icon | Tap icon 🔔 | Mở trang Thông báo đầy đủ |
| Nhấn điểm gần đây | Tap score card | Mở trang Kết quả học tập |
| Pull-to-refresh | Kéo xuống từ top | Cập nhật toàn bộ feed |
| Nhấn avatar | Tap avatar/tên HS | Mở trang Hồ sơ cá nhân |
| Nhấn "Xem tất cả" | Tap link nhỏ cuối section | Expand đầy đủ danh sách |
| Swipe item sang trái | Swipe gesture | Option: Đánh dấu xong / Nhắc lại sau |

---

## Gom nhóm tính năng thông minh
**Tại sao gom nhóm theo "ngày hôm nay" thay vì theo môn học?**
- Học sinh không nghĩ theo logic hệ thống (môn A > bài tập A1), mà nghĩ theo thời gian: "Hôm nay tôi phải làm gì?"
- Gom tất cả deadline + nhiệm vụ vào một feed duy nhất giúp HS không phải vào từng môn để kiểm tra.
- Thứ tự ưu tiên theo urgency (gần deadline nhất = hiển thị trước) thay vì theo môn học, giúp tránh bỏ sót.
- Section "Điểm gần đây" ngay trên trang chủ thỏa mãn tâm lý muốn xem điểm ngay của HS mà không cần navigate nhiều tầng.

---

## UX Notes
- **Màu sắc**:
  - Đỏ `#E53935` — Khẩn cấp, hôm nay, sắp hết hạn
  - Cam `#FB8C00` — Cảnh báo, còn 1–2 ngày
  - Xanh dương `#1E88E5` — Hành động chính, nút CTA
  - Xanh lá `#43A047` — Đã hoàn thành, điểm tốt
  - Xám nhạt — Item đã xong (mờ đi)
- **Animation / Feedback**:
  - Check-off task: animation tick ✅ nhẹ nhàng + item mờ dần (0.3s)
  - Pull-to-refresh: spinner nhỏ, không che nội dung
  - Nhận điểm mới: số điểm "pop" to rồi về bình thường (scale animation)
  - Push notification badge: bounce nhẹ trên bell icon
- **Empty states**:
  - Không có việc hôm nay: "🎉 Ngày hôm nay trống! Tranh thủ học trước đi nhé 📖" + gợi ý môn học chưa hoàn thành
  - Không có thông báo: "Chưa có thông báo mới. Bạn đã cập nhật rồi! ✅"
  - Không có điểm gần đây: "Điểm của bạn sẽ hiện ở đây sau khi GV chấm bài"
- **Personalization**: Feed học thuộc lịch thi, ưu tiên hiển thị môn thi gần nhất lên đầu tự động.
- **Offline**: Cache feed của ngày hiện tại, hiển thị được dù mất mạng kèm badge "Đã cập nhật lúc 7:30"

---

## Edge Cases
- **Không có internet khi mở app**: Hiển thị dữ liệu cache lần cuối + banner nhỏ "Đang offline — nội dung cập nhật lúc [giờ]". Không hiển thị màn hình trắng/lỗi.
- **Quá nhiều deadline cùng lúc (>10 item)**: Chỉ hiển thị 5 item khẩn cấp nhất, có nút "Xem thêm X bài nữa". Tránh scroll dài gây choáng ngợp.
- **Học sinh đã hoàn thành hết mọi việc**: Màn hình ăn mừng nhỏ, gợi ý "Khám phá bài học mới" hoặc "Xem lại bài cũ".
- **Điểm bị chấm lại / cập nhật**: Hiển thị badge "Điểm vừa cập nhật" cạnh điểm mới, giữ điểm cũ trong ngoặc mờ.
- **GV hủy bài tập sau khi HS đã nộp**: Thông báo ngay: "Bài tập [tên] đã được GV hủy. Bài nộp của bạn đã được xóa."
- **Đăng nhập lần đầu / tài khoản mới**: Hiển thị onboarding 3 bước nhanh (swipe card), sau đó feed rỗng với hướng dẫn "Bắt đầu bằng cách chọn môn học đầu tiên →"
- **Thông báo hàng loạt từ GV**: Gom nhóm "3 thông báo mới từ Toán" thay vì liệt kê 3 dòng riêng biệt.
