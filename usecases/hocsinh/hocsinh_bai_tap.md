# Bài Tập — Role: Học sinh

## Mục tiêu
Cho phép học sinh xem danh sách bài tập từ tất cả các môn, nộp bài đúng hạn, và nhận phản hồi & điểm từ giáo viên — tất cả trong một luồng đơn giản nhất có thể trên điện thoại.

## User Story
"Là học sinh, tôi muốn xem và nộp bài tập dễ dàng trên điện thoại, đồng thời nhận được phản hồi chi tiết từ GV để tôi biết cần cải thiện điều gì."

---

## User Flow Chính

### Flow 1: Xem danh sách bài tập & nộp bài
**Mô tả**: Học sinh kiểm tra bài tập đang có và nộp một bài tập trước hạn.
**Trigger**: Nhấn tab "Bài tập" hoặc nhấn vào một task bài tập từ Home feed.
**Steps**:
1. Màn hình Bài tập hiển thị danh sách chia 3 tab: **Cần nộp** | **Đã nộp** | **Tất cả**
2. Tab "Cần nộp" active mặc định, sắp xếp theo deadline gần nhất.
3. Mỗi bài tập hiển thị: tên môn, tên bài, deadline, loại nộp (văn bản / file / trắc nghiệm), trạng thái.
4. Học sinh nhấn vào bài tập → mở màn hình Chi tiết bài tập.
5. Đọc đề bài, xem yêu cầu, file đính kèm của GV.
6. Nhấn **"Nộp bài"** → mở form nộp tương ứng loại bài.
7. Điền/đính kèm bài làm → nhấn **"Gửi bài"** → confirm dialog.
8. Sau khi nộp: toast thành công, bài chuyển sang tab "Đã nộp" với trạng thái "Chờ chấm".
**Expected Result**: Nộp bài trong tối đa 3 bước (xem đề → điền bài → nộp).

### Flow 2: Nộp bài dạng file (chụp ảnh / upload)
**Mô tả**: Học sinh làm bài trên giấy, chụp ảnh và nộp qua app.
**Trigger**: Bài tập yêu cầu nộp file (PDF, ảnh, Word...).
**Steps**:
1. Vào chi tiết bài tập → nhấn "Nộp bài".
2. Hiển thị options: 📷 **Chụp ảnh** | 📁 **Chọn từ thư viện** | 📤 **Upload file**.
3. Chọn "Chụp ảnh": camera mở, HS chụp nhiều trang (multi-shot).
4. Preview ảnh: có thể xoay, crop, xóa từng trang, thêm ảnh.
5. Nhấn "Tiếp tục" → preview tổng trước khi nộp.
6. Nhấn "Nộp bài" → upload với thanh tiến độ.
7. Sau khi upload xong: xác nhận thành công.
**Expected Result**: Nộp bài viết tay nhanh chóng chỉ bằng camera điện thoại.

### Flow 3: Nộp bài dạng văn bản online
**Mô tả**: Bài tập yêu cầu viết bài trực tiếp trong app (essay, trả lời câu hỏi...).
**Trigger**: Bài tập có loại "Viết văn bản" — nộp text.
**Steps**:
1. Form nộp bài hiển thị rich text editor (đơn giản: in đậm, in nghiêng, danh sách).
2. HS viết bài. Auto-save mỗi 30 giây (indicator nhỏ "Đã lưu nháp lúc 14:35").
3. Xem trước bài làm trước khi nộp.
4. Nhấn "Nộp bài" → nếu quá deadline hỏi "Bài này đã quá hạn, bạn vẫn muốn nộp không?"
5. Sau khi nộp: không thể sửa (nếu GV khóa chỉnh sửa), hoặc có thể edit lại (nếu GV cho phép).
**Expected Result**: Viết bài trực tiếp trên điện thoại với auto-save, không mất dữ liệu khi thoát app.

### Flow 4: Xem phản hồi & điểm bài tập đã chấm
**Mô tả**: Học sinh nhận thông báo bài được chấm và xem chi tiết điểm + nhận xét.
**Trigger**: Push notification "📝 GV đã chấm bài [Tên bài] — Điểm: 8.5" hoặc tự vào xem.
**Steps**:
1. Vào tab "Đã nộp" → bài có trạng thái "Đã chấm" với điểm hiển thị rõ.
2. Nhấn vào → Màn hình kết quả bài tập.
3. Hiển thị: điểm số to rõ, nhận xét của GV (text + highlight trên bài làm nếu có).
4. Nếu GV annotate trực tiếp trên bài (PDF/ảnh): xem bài đã được chú thích.
5. Nếu GV cho phép nộp lại: hiện nút "Nộp lại" với hướng dẫn cải thiện.
6. HS có thể nhấn "💬 Hỏi GV về nhận xét này" → mở thread thảo luận riêng cho bài đó.
**Expected Result**: Học sinh hiểu rõ được điểm bao nhiêu, vì sao, và cần cải thiện gì.

---

## Tính năng & Màn hình

### Màn hình chính — Danh sách bài tập
- **Layout**: Tab bar ở trên (Cần nộp / Đã nộp / Tất cả), list bài tập dưới dạng card dọc.
- **Components**:
  - `TabBar` — 3 tab với số lượng badge (Cần nộp: 5)
  - `AssignmentCard` — Card bài tập với đầy đủ thông tin
  - `FilterChips` — Lọc theo môn học (all / Toán / Văn / Anh...)
  - `SortOption` — Sắp xếp: Deadline | Môn | Ngày giao
  - `EmptyStateIllustration` — Minh họa khi không có bài tập
- **Info trên AssignmentCard**:
  - 🏷️ Nhãn màu theo môn (xanh = Toán, tím = Văn...)
  - Tên bài tập
  - Tên giáo viên giao
  - ⏰ Deadline: "Còn 2 ngày" (cam) / "Còn 3 giờ" (đỏ nhấp nháy) / "Quá hạn" (xám)
  - 📎 Icon loại nộp: 📝 Văn bản / 📁 File / 📷 Ảnh / ✅ Trắc nghiệm
  - Trạng thái: Chờ nộp / Đã lưu nháp / Đã nộp / Đã chấm / Nộp muộn

### Màn hình Chi tiết bài tập
- **Layout**: Scroll dọc. Header = tên bài + deadline countdown. Body = đề bài. Footer sticky = nút CTA.
- **Components**:
  - `DeadlineCountdown` — Đồng hồ đếm ngược (nổi bật khi <24h)
  - `AssignmentDescription` — Mô tả đề bài với rich text + ảnh
  - `AttachmentList` — File đính kèm từ GV (có thể tải về)
  - `SubmissionForm` — Form nộp bài theo loại
  - `SubmitButton` — Nút nộp bài sticky ở bottom
  - `DraftBanner` — Banner "Bạn có bản nháp từ [giờ trước]" nếu đã lưu nháp

### Form nộp bài các loại

**Loại 1 — Văn bản (Text)**:
- Rich text editor mini: Bold / Italic / List / Link
- Word count / character count
- Auto-save indicator

**Loại 2 — Upload file**:
- Drag & drop area (mobile: tap to select)
- Multi-file support (nếu GV cho phép nhiều file)
- Progress bar từng file
- File type validation (GV quy định: chỉ nhận PDF, ảnh...)

**Loại 3 — Chụp ảnh**:
- Camera launcher tích hợp
- Multi-page capture: chụp nhiều ảnh, sắp xếp thứ tự, xóa
- Auto-enhance ảnh: tăng contrast, straighten, crop
- Nén ảnh tự động trước khi upload

**Loại 4 — Trắc nghiệm / Bài làm có cấu trúc**:
- Danh sách câu hỏi với radio button / checkbox
- Đánh dấu câu chưa trả lời
- Xem lại trước khi nộp

### Màn hình Kết quả bài tập
- **Điểm** hiển thị to, màu xanh lá (điểm cao) / vàng (trung bình) / đỏ (thấp)
- **Nhận xét GV**: Text comment, có thể có ảnh annotated
- **Rubric** (nếu có): Bảng chấm điểm chi tiết từng tiêu chí
- **So sánh điểm lớp** (nếu GV bật): "Điểm của bạn: 8.5 | Trung bình lớp: 7.2"
- **Nút hành động**: 💬 Hỏi GV | 🔄 Nộp lại (nếu được phép) | 📤 Chia sẻ

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Xem chi tiết bài | Tap card | Mở màn hình chi tiết |
| Lưu nháp | Auto (30s) / Tap "Lưu nháp" | Lưu tạm, bất kỳ lúc nào |
| Nộp bài | Tap "Nộp bài" | Confirm → Upload → Success |
| Chụp ảnh nộp | Tap 📷 | Mở camera multi-shot |
| Hỏi GV về điểm | Tap 💬 | Mở thread thảo luận bài tập |
| Nộp lại | Tap "Nộp lại" | Reset form, nộp lần 2 |
| Tải đề về | Tap 📥 trên file đính kèm | Download file GV |
| Lọc theo môn | Tap filter chip | Lọc danh sách |

---

## Gom nhóm tính năng thông minh

**Tại sao gom "xem bài tập + nộp bài + xem điểm" vào cùng một module?**
- Vòng đời của một bài tập là: Nhận → Làm → Nộp → Chờ → Nhận kết quả → Cải thiện. Toàn bộ vòng đời này cần ở cùng một nơi để HS không phải di chuyển qua nhiều trang.
- Tab "Cần nộp / Đã nộp" tổng hợp từ **tất cả môn học**, giúp HS có cái nhìn toàn cảnh một lần, thay vì phải vào từng môn tìm bài tập.
- Chức năng chụp ảnh tích hợp (không cần app camera riêng) giảm friction đáng kể cho HS THPT — đây là cách phổ biến nhất để nộp bài viết tay.
- Auto-save nháp đặc biệt quan trọng trên mobile, nơi app có thể bị kill bất ngờ.

---

## UX Notes
- **Màu sắc deadline**:
  - Xanh lá: còn >5 ngày
  - Vàng: còn 3–5 ngày
  - Cam: còn 1–2 ngày
  - Đỏ nhấp nháy: còn <24h
  - Xám gạch chân: đã quá hạn
- **Animation / Feedback**:
  - Nộp bài thành công: animation "tờ giấy bay đi" + confetti nhỏ
  - Upload file: progress bar mượt mà, không dùng spinner chờ đợi
  - Đồng hồ đếm ngược: update mỗi giây khi còn <1 giờ
  - Điểm mới: số điểm "flip in" như thẻ bài
- **Vibration**: Rung nhẹ khi nộp bài thành công (haptic feedback).
- **Empty states**:
  - Không có bài cần nộp: "🎉 Bạn đã nộp hết bài tập rồi! Giỏi quá!" + ảnh minh họa vui
  - Chưa có bài nào: "GV chưa giao bài tập. Theo dõi để nhận thông báo sớm! 🔔"

---

## Edge Cases
- **Nộp bài trễ hạn**: Hệ thống cho phép nộp nhưng đánh dấu "Nộp muộn". Cảnh báo trước khi gửi: "Bài tập đã quá hạn lúc 22:00. GV vẫn có thể chấm nhưng có thể bị trừ điểm." HS chọn tiếp tục hoặc hủy.
- **File quá nặng**: Giới hạn upload (ví dụ 50MB/file). Nếu vượt quá: "File quá lớn (80MB). Vui lòng nén lại hoặc chia thành nhiều file nhỏ hơn."
- **Mất mạng khi đang upload**: Queue upload, tự retry khi có mạng trở lại. Không mất dữ liệu. Hiển thị "Đang chờ kết nối để hoàn tất nộp bài..."
- **GV cập nhật đề bài sau khi HS đã xem**: Badge "Đề bài đã cập nhật" + highlight phần thay đổi.
- **Bài tập nhóm**: Giao diện thêm thành viên nhóm, track ai đã xem, ai nộp phần nào.
- **GV cho phép nhiều lần nộp lại**: Lịch sử các lần nộp hiển thị theo timeline, điểm cao nhất hoặc điểm lần cuối tùy cài đặt của GV.
- **HS mở bài tập trên 2 thiết bị**: Đồng bộ nháp realtime qua cloud, tránh conflict.
- **Bài tập bị xóa sau khi HS đã nộp**: Thông báo "Bài tập này đã bị GV xóa. Bài nộp của bạn cũng đã bị xóa theo."
