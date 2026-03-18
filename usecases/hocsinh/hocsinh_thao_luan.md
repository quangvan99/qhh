# Thảo Luận — Role: Học sinh

## Mục tiêu
Cho phép học sinh đặt câu hỏi, trao đổi với giáo viên và bạn học trong không gian thảo luận theo từng môn/lớp — tạo môi trường học tập tương tác mà học sinh cảm thấy thoải mái khi hỏi bài, không sợ bị phán xét.

## User Story
"Là học sinh, tôi muốn dễ dàng đặt câu hỏi cho GV hoặc thảo luận với bạn học về bài học để tôi giải quyết được chỗ chưa hiểu mà không cần phải đợi đến giờ học."

---

## User Flow Chính

### Flow 1: Đặt câu hỏi cho GV trong môn học
**Mô tả**: Học sinh không hiểu một bài, muốn hỏi GV nhanh qua app.
**Trigger**: Đang xem bài học → nhấn icon 💬 "Hỏi GV" hoặc vào tab Thảo luận.
**Steps**:
1. Màn hình Thảo luận của môn học mở ra, hiển thị các thread câu hỏi đã có.
2. HS kiểm tra nhanh xem có câu hỏi tương tự chưa (search hoặc scroll).
3. Nhấn nút "Đặt câu hỏi mới" (nút + nổi bật ở góc dưới phải).
4. Form hỏi: tiêu đề ngắn + nội dung chi tiết + đính kèm ảnh (chụp chỗ không hiểu trong sách).
5. Chọn tag: [Bài giảng] / [Bài tập] / [Bài thi] / [Khác]
6. Gửi → câu hỏi hiển thị trong thread, trạng thái "Chờ trả lời".
7. HS nhận push notification khi GV hoặc bạn học trả lời.
**Expected Result**: HS hỏi bài dễ như nhắn tin, nhận phản hồi không cần chờ đến lớp.

### Flow 2: Trả lời / tham gia vào câu hỏi của bạn
**Mô tả**: Học sinh đọc câu hỏi của bạn và biết câu trả lời, muốn chia sẻ.
**Trigger**: Nhấn vào một thread câu hỏi trong diễn đàn môn học.
**Steps**:
1. Mở thread câu hỏi: xem câu hỏi gốc + các trả lời đã có (thread dạng Q&A hoặc comment).
2. HS đọc qua các trả lời hiện có.
3. Nhấn "Trả lời" → text input với rich text đơn giản.
4. Gửi trả lời → hiển thị dưới thread.
5. Nếu trả lời được GV đánh dấu "Đúng" ✅ → badge "Được GV xác nhận" xuất hiện.
6. HS nhận được điểm thưởng tham gia thảo luận (gamification nhỏ).
**Expected Result**: Học sinh tích cực hỗ trợ nhau, tạo cộng đồng học tập tích cực.

### Flow 3: Thảo luận theo nhóm lớp (class feed)
**Mô tả**: GV đăng một chủ đề thảo luận cho cả lớp, HS tham gia.
**Trigger**: Notification "GV đã mở thảo luận: Ý nghĩa Truyện Kiều trong thời đại ngày nay".
**Steps**:
1. HS nhấn notification → mở thẳng thread thảo luận.
2. Thread hiển thị câu hỏi/chủ đề của GV ở trên, các bình luận của HS bên dưới.
3. HS nhập ý kiến của mình → gửi.
4. Có thể like 👍 bình luận của bạn, không thể dislike (tạo môi trường tích cực).
5. GV có thể highlight một số bình luận hay (hiển thị lên đầu).
**Expected Result**: Thảo luận sôi nổi, HS không ngại chia sẻ ý kiến trong môi trường an toàn.

### Flow 4: Tìm câu hỏi đã được trả lời trước đó
**Mô tả**: HS không hiểu bài, muốn tìm xem có ai đã hỏi câu tương tự chưa.
**Trigger**: Vào tab Thảo luận của môn → nhấn icon 🔍 tìm kiếm.
**Steps**:
1. Nhập từ khóa (ví dụ: "phương trình bậc 2", "công thức vi phân").
2. Kết quả hiển thị theo relevance, có filter: Có đáp án GV / Có đáp án bạn học / Tất cả.
3. Nhấn vào kết quả → xem thread đầy đủ.
**Expected Result**: HS tự tìm câu trả lời trong knowledge base cộng đồng trước khi hỏi thêm.

---

## Tính năng & Màn hình

### Màn hình chính — Thảo luận tổng hợp
- **Layout**: Tab bar trên: **Của tôi** | **Môn học** | **Lớp**. List thread dưới.
- **Components**:
  - `TabBar` — Chuyển giữa view: câu hỏi của tôi / theo môn / theo lớp
  - `DiscussionFeed` — Feed các thread thảo luận, sắp xếp theo mới nhất
  - `ThreadCard` — Card tóm tắt một thread
  - `FABButton` — Nút "Đặt câu hỏi" nổi góc phải dưới
  - `FilterBar` — Lọc: Chưa trả lời / Đã giải quyết / Tất cả

- **Info trên ThreadCard**:
  - Avatar + tên người hỏi (hoặc "Ẩn danh" nếu HS chọn)
  - Tiêu đề câu hỏi (tối đa 2 dòng)
  - Môn học + bài học liên quan (tag chip)
  - Số trả lời 💬 + số lượt xem 👁️ + số like 👍
  - Thời gian đăng / trả lời gần nhất
  - Badge: "✅ Đã giải quyết" / "🔥 Đang hot" / "📌 GV ghim"

### Màn hình Chi tiết Thread
- **Layout**: Full-screen scroll. Header = câu hỏi gốc. Body = các câu trả lời dạng nested comments.
- **Components**:
  - `QuestionCard` — Câu hỏi gốc (có thể có ảnh đính kèm)
  - `AnswerList` — Danh sách câu trả lời
  - `AcceptedAnswer` — Câu trả lời được GV xác nhận (highlight xanh lá, lên đầu)
  - `ReplyInput` — Ô nhập trả lời sticky ở bottom
  - `AttachImage` — Đính kèm ảnh vào trả lời
  - `MathInput` — Nhập công thức toán (LaTeX đơn giản nếu cần)
  - `LikeButton` — Nút 👍 trên mỗi câu trả lời

### Màn hình Đặt câu hỏi
- **Layout**: Form đơn giản, không phức tạp.
- **Components**:
  - `TitleInput` — Tiêu đề ngắn gọn câu hỏi
  - `ContentEditor` — Nội dung chi tiết (rich text + ảnh)
  - `SubjectSelector` — Chọn môn học liên quan
  - `LessonSelector` — Chọn bài học cụ thể (optional)
  - `TagSelector` — Tag: Bài giảng / Bài tập / Bài thi / Khác
  - `AnonymousToggle` — 🔒 Đăng ẩn danh (ẩn tên, nhưng GV vẫn thấy)
  - `SubmitButton` — "Gửi câu hỏi"

- **Smart suggest**: Khi HS đang gõ tiêu đề, hệ thống tự gợi ý "Có 3 câu hỏi tương tự. Xem trước?" — tránh trùng lặp.

### Tab "Của tôi"
- Câu hỏi tôi đã hỏi + status (chờ / đã trả lời / đã giải quyết)
- Câu hỏi tôi đã trả lời
- Câu hỏi tôi đã bookmark 🔖 (xem sau)
- Thống kê: Tổng câu hỏi / Số lần được helpful / Streak tham gia thảo luận

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Đặt câu hỏi mới | Tap FAB "+" | Mở form đặt câu hỏi |
| Xem thread | Tap ThreadCard | Mở chi tiết thread |
| Trả lời | Tap "Trả lời" | Focus vào ReplyInput |
| Like câu trả lời | Tap 👍 | Tăng like count |
| Bookmark thread | Tap 🔖 | Lưu vào "Của tôi" > Đã lưu |
| Báo cáo vi phạm | Long press > Báo cáo | Submit report |
| Tìm kiếm | Tap 🔍 | Mở search với autocomplete |
| Đính kèm ảnh | Tap 📷 trong form | Mở camera/gallery |
| Đăng ẩn danh | Toggle "Ẩn danh" | Ẩn tên khi đăng |
| Chia sẻ thread | Tap Share icon | Link deep link đến thread |

---

## Gom nhóm tính năng thông minh

**Tại sao thiết kế thảo luận dạng Q&A thread thay vì chat room?**
- Chat room (Messenger-style) tốt cho giao tiếp real-time nhưng kiến thức "tan biến" trong dòng tin nhắn, khó tìm lại sau.
- Q&A thread (Stack Overflow-style) giúp câu hỏi và câu trả lời hay được lưu lại như knowledge base, HS sau có thể tìm và dùng lại.
- "Câu trả lời được GV xác nhận" tạo độ tin cậy — HS biết câu nào đúng, không bị confuse bởi nhiều ý kiến trái chiều.
- Tính năng đăng ẩn danh quan trọng với học sinh THPT: nhiều em ngại hỏi bài trước đám đông vì sợ bị xem là "không biết". Ẩn danh tháo gỡ rào cản tâm lý này.
- Feed "Của tôi" cho HS cảm giác ownership về việc đã đóng góp cho cộng đồng học tập.

---

## UX Notes
- **Màu sắc**:
  - Thread chưa có trả lời: viền cam `#FB8C00`
  - Thread đã giải quyết: viền xanh lá `#43A047` + badge ✅
  - GV ghim: nền xanh nhạt, icon 📌
  - Đang hot (nhiều tương tác): icon 🔥
- **Animation / Feedback**:
  - Gửi câu hỏi: animation "giấy tờ bay đi" nhẹ nhàng
  - Câu trả lời mới: fade in từ dưới lên
  - Like: heart animation (bounce nhỏ)
  - Notification badge: số đỏ bounce khi có trả lời mới
- **Typing indicator**: Khi có người đang gõ trong thread, hiển thị "..." indicator nhỏ (optional).
- **Smart notification**: Chỉ notify khi có trả lời mới cho câu hỏi của tôi, hoặc GV trả lời — không notify mọi hoạt động trong forum.
- **Empty states**:
  - Không có câu hỏi nào: "Chưa có câu hỏi nào trong môn này. Bạn có thắc mắc gì không? Đặt câu hỏi đầu tiên đi! 🙋"
  - Không có kết quả tìm kiếm: "Không tìm thấy câu hỏi tương tự. Hãy đặt câu hỏi mới!"
- **Content moderation**: Filter tự động từ ngữ không phù hợp. GV có thể xóa/ẩn nội dung vi phạm.

---

## Edge Cases
- **HS gửi cùng lúc nhiều câu hỏi trùng nhau**: Sau khi gửi, hệ thống tự phát hiện câu hỏi tương tự trong 24h đầu và gợi ý merge: "Câu hỏi này có vẻ tương tự với câu của bạn X. Gộp lại hay giữ riêng?"
- **Thread quá dài** (>50 replies): Phân trang replies hoặc collapse replies cũ, chỉ show 5 gần nhất + "Xem tất cả X phản hồi".
- **GV không trả lời sau nhiều ngày**: Auto-reminder cho GV (system side). HS thấy badge "Đang chờ GV trả lời từ 3 ngày trước" — tạo áp lực nhẹ cho GV phản hồi.
- **Nội dung vi phạm** (spam, ngôn từ không phù hợp): Ẩn ngay sau khi bị report đủ ngưỡng, chờ GV/Admin xét duyệt. Tác giả nhận thông báo.
- **Đính kèm ảnh chứa thông tin nhạy cảm** (đề thi chưa công bố): Cảnh báo khi upload ảnh có chữ "đề thi" — nhắc nhở trước khi đăng.
- **HS bị chặn tham gia thảo luận** (do vi phạm): Thấy màn hình giải thích lý do + liên hệ GV để mở lại.
- **Mất mạng khi đang gõ câu trả lời dài**: Auto-save draft local. Khi mạng trở lại, hiện: "Bạn có bản nháp chưa gửi. Tiếp tục không?"
- **Thread từ năm học cũ**: Vẫn accessible để tham khảo nhưng khóa thêm trả lời mới. Label "Thread này từ năm học [X]".
