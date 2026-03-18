# Danh Sách Môn Học & Vào Học — Role: Học sinh

## Mục tiêu
Cho phép học sinh xem toàn bộ các môn học đang theo học, truy cập vào từng môn để học nội dung, và theo dõi tiến độ hoàn thành của bản thân một cách trực quan — không cần nhiều thao tác.

## User Story
"Là học sinh, tôi muốn nhìn thấy tất cả môn học của mình và vào học ngay trong 1 chạm để tôi không mất thời gian tìm kiếm và có thể tập trung học ngay."

---

## User Flow Chính

### Flow 1: Vào học một môn từ trang Học tập
**Mô tả**: Học sinh chọn môn học muốn học và truy cập nội dung ngay.
**Trigger**: Học sinh nhấn tab "Học tập" ở bottom navigation hoặc nhấn shortcut từ Home feed.
**Steps**:
1. Màn hình Học tập hiển thị danh sách card các môn học, sắp xếp theo thứ tự: môn có hoạt động mới nhất lên đầu.
2. Mỗi card môn hiển thị: Tên môn, tên GV, thanh tiến độ (%), số bài chưa hoàn thành.
3. Học sinh nhấn vào card môn học (ví dụ: Toán 12A).
4. Mở trang **Chi tiết môn học** — hiển thị các chương/tuần học dạng accordion.
5. Chương đang học / chưa hoàn thành được mở sẵn (auto-expand).
6. Học sinh nhấn vào bài học cụ thể → chuyển sang màn hình Xem nội dung.
**Expected Result**: Học sinh vào được bài học cụ thể trong tối đa 2 bước (chọn môn → chọn bài).

### Flow 2: Tiếp tục học từ chỗ dừng lại
**Mô tả**: Học sinh quay lại môn học đang học dở từ hôm trước.
**Trigger**: Nhấn nút "Tiếp tục học" trên card môn học, hoặc từ thông báo reminder.
**Steps**:
1. Hệ thống nhớ vị trí học cuối cùng (last position).
2. Nhấn "Tiếp tục học" → mở thẳng bài đang học dở, đúng vị trí (video đúng timestamp / SCORM đúng slide).
3. Màn hình hiển thị brief recap: "Bạn đang học: Chương 3 — Bài 2: Phương trình bậc hai"
**Expected Result**: Zero friction — tiếp tục học ngay từ chỗ dừng mà không cần tìm lại.

### Flow 3: Xem tổng quan tiến độ học tập
**Mô tả**: Học sinh muốn biết mình đã học được bao nhiêu trong từng môn.
**Trigger**: Nhấn vào biểu tượng tiến độ / tab "Tiến độ" trong trang môn học.
**Steps**:
1. Hiển thị màn hình **Tổng quan tiến độ** với vòng tròn % hoàn thành cho từng môn.
2. Bên dưới là breakdown: X/Y bài đã xem, X/Y bài tập đã nộp, X/Y bài kiểm tra đã làm.
3. Có thể nhấn vào môn cụ thể để xem chi tiết từng chương đã hoàn thành chưa.
**Expected Result**: Học sinh nắm được tổng quan tiến độ học tập của mình trong <5 giây.

### Flow 4: Tìm kiếm môn học / bài học cụ thể
**Mô tả**: Học sinh muốn tìm nhanh một bài học theo tên.
**Trigger**: Nhấn icon 🔍 tìm kiếm trên màn hình Học tập.
**Steps**:
1. Thanh tìm kiếm xuất hiện với bàn phím tự bật lên.
2. HS gõ tên bài (ví dụ: "nguyên hàm") → kết quả hiện realtime.
3. Kết quả chia nhóm: Bài học | Bài tập | Tài liệu.
4. Nhấn vào kết quả → mở thẳng nội dung đó.
**Expected Result**: Tìm và mở được bài học bất kỳ trong <10 giây.

---

## Tính năng & Màn hình

### Màn hình chính — Danh sách môn học
- **Layout**: Grid 2 cột (mobile nhỏ: 1 cột) hoặc list card dọc với thumbnail môn học. Toggle chuyển giữa dạng grid/list.
- **Components**:
  - `SearchBar` — Tìm kiếm nhanh bài học/môn học
  - `FilterChips` — Lọc: Tất cả | Đang học | Chưa bắt đầu | Hoàn thành
  - `SubjectCard` — Card môn học với đầy đủ thông tin
  - `ProgressRing` — Vòng tròn tiến độ mini trên mỗi card
  - `ContinueLearningBanner` — Banner "Tiếp tục học [Môn X]" nổi bật ở đầu màn hình nếu đang học dở

- **Info trên mỗi SubjectCard**:
  - Icon màu đại diện môn học (ví dụ: Toán = xanh dương, Văn = tím, Anh = cam)
  - Tên môn học + lớp
  - Tên giáo viên phụ trách
  - Thanh progress bar ngang (X% hoàn thành)
  - Số bài chưa xem / bài tập chưa nộp (badge đỏ nếu có)
  - Nhãn trạng thái: "Đang học" / "Có bài tập mới" / "Cần nộp bài" / "Hoàn thành"

### Màn hình Chi tiết môn học
- **Layout**: Header có ảnh/màu môn + tên môn + GV + % tiến độ. Phần dưới là danh sách chương dạng accordion.
- **Components**:
  - `SubjectHeader` — Tên môn, GV, tiến độ tổng
  - `ChapterAccordion` — Danh sách chương (Chapter List)
  - `LessonItem` — Từng bài học trong chương
  - `StatusIcon` — ✅ Đã xem / ▶️ Đang học / 🔒 Chưa mở khóa / ⬜ Chưa xem
  - `ContinueButton` — Nút "Tiếp tục học" sticky ở bottom

- **Info trên LessonItem**:
  - Icon loại nội dung (📹 Video / 📄 Tài liệu / 🎮 SCORM / 📝 Bài tập)
  - Tên bài học
  - Thời lượng ước tính (ví dụ: "~15 phút")
  - Trạng thái hoàn thành

### Tab Tiến độ (Progress Tab)
- Vòng tròn % lớn ở giữa cho môn đang xem
- Breakdown 3 chỉ số:
  - Nội dung: X/Y bài đã xem (📖)
  - Bài tập: X/Y đã nộp (📝)
  - Kiểm tra: X/Y đã làm (🎯)
- Biểu đồ timeline: Hoạt động học trong 7 ngày gần nhất (số phút học mỗi ngày)

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Chọn môn học | Tap card | Mở chi tiết môn học |
| Tiếp tục học | Tap "Tiếp tục học" | Mở thẳng bài học đang dở |
| Bắt đầu bài mới | Tap bài học chưa xem | Mở màn hình Xem nội dung |
| Xem tiến độ | Tap tab "Tiến độ" | Mở màn hình tổng quan tiến độ |
| Tìm kiếm | Tap 🔍 | Mở thanh tìm kiếm |
| Lọc môn | Tap filter chip | Lọc danh sách |
| Đánh dấu bài đã xem | Tap icon ✅ | Đánh dấu hoàn thành thủ công |
| Tải nội dung offline | Tap icon ⬇️ | Download bài học để xem offline |

---

## Gom nhóm tính năng thông minh

**Tại sao gom "danh sách môn + tiến độ + vào học" vào một màn hình?**
- Học sinh cần thấy **tình trạng + hành động** trong cùng một nơi. Nếu tách "xem tiến độ" ra trang khác, HS sẽ không chủ động theo dõi.
- Card môn học kết hợp cả thông tin tiến độ (%) lẫn nút hành động ("Tiếp tục học") giúp quyết định ngay: "Môn nào tôi cần học tiếp?"
- Banner "Tiếp tục học [Môn X]" ở đầu màn hình = zero-click access đến bài học quan trọng nhất, dựa trên: môn gần deadline nhất hoặc môn đang học dở gần nhất.
- Chia chương dạng accordion giúp HS không bị choáng ngợp khi môn có nhiều bài, nhưng vẫn thấy full structure.

---

## UX Notes
- **Màu sắc môn học** (nhất quán xuyên suốt app):
  - Toán: `#1E88E5` (xanh dương)
  - Văn: `#8E24AA` (tím)
  - Tiếng Anh: `#FB8C00` (cam)
  - Vật lý: `#00ACC1` (cyan)
  - Hóa học: `#43A047` (xanh lá)
  - Sinh học: `#7CB342` (xanh lá nhạt)
  - Lịch sử: `#E53935` (đỏ)
  - Địa lý: `#3949AB` (indigo)
- **Animation / Feedback**:
  - Mở accordion chương: smooth expand animation (200ms)
  - Progress bar fill: animate từ 0% đến X% khi vào trang (chỉ lần đầu)
  - Hoàn thành bài học: check ✅ bounce + tiến độ bar tăng lên với animation
  - Card có ripple effect khi tap
- **Empty states**:
  - Chưa có môn học nào: "Bạn chưa được đăng ký môn học nào. Liên hệ giáo viên chủ nhiệm để biết thêm. 📞"
  - Chương chưa có bài: "Giáo viên chưa đăng tải nội dung cho chương này. Theo dõi để nhận thông báo! 🔔"
- **Offline indicator**: Icon ⬇️ trên bài đã tải, icon 📶❌ nếu đang offline + bài chưa tải.
- **Sorting thông minh**: Mặc định sắp xếp môn theo "có hoạt động gần nhất" (không phải theo tên), giúp môn đang học hiện lên đầu.

---

## Edge Cases
- **Học sinh bị khóa khỏi nội dung** (GV đặt điều kiện tiên quyết): Bài học hiển thị icon 🔒 với tooltip "Hoàn thành [bài trước] để mở khóa bài này".
- **Môn học đã kết thúc / năm học cũ**: Hiển thị badge "Đã kết thúc" màu xám, vẫn có thể xem nội dung nhưng không nộp bài được.
- **GV cập nhật thêm bài học mới**: Badge "Mới" màu xanh xuất hiện trên card môn + bài học mới. Badge tự mất sau khi HS xem.
- **Tiến độ bị tính sai** (xem SCORM nhưng không load xong): Có nút "Đánh dấu đã xem" thủ công, gửi yêu cầu xác nhận cho GV.
- **Nhiều hơn 10 môn học** (hiếm gặp): Auto-paginate hoặc nhóm theo "Đang học" / "Khác" để tránh scroll quá dài.
- **Mất kết nối khi đang học**: Hệ thống lưu tiến độ offline, đồng bộ lại khi có mạng. Hiển thị "Tiến độ đang được đồng bộ..." khi mạng trở lại.
- **Nhiều lớp / buổi học cùng môn** (ví dụ: Toán 12A và Toán bổ trợ): Hiển thị tên lớp dưới tên môn để phân biệt rõ.
