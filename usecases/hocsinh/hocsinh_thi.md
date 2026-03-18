# Thi Trực Tuyến — Role: Học sinh

## Mục tiêu
Cung cấp trải nghiệm thi trực tuyến đáng tin cậy và ít căng thẳng nhất có thể: học sinh biết rõ lịch thi, vào phòng thi đúng giờ, làm bài với giao diện rõ ràng, và nhận kết quả ngay sau khi nộp.

## User Story
"Là học sinh, tôi muốn vào thi trực tuyến dễ dàng, không bị gián đoạn bởi lỗi kỹ thuật, và biết kết quả ngay sau khi nộp bài để tôi có thể tự đánh giá bản thân."

---

## User Flow Chính

### Flow 1: Kiểm tra lịch thi sắp tới
**Mô tả**: Học sinh xem toàn bộ lịch thi trong tuần/tháng để chuẩn bị.
**Trigger**: Nhấn tab "Thi" hoặc nhấn vào item "Bài thi sắp tới" từ Home feed.
**Steps**:
1. Màn hình Thi hiển thị 2 section: **Sắp diễn ra** và **Đã kết thúc**.
2. Section sắp diễn ra: card bài thi có countdown, môn học, thời gian làm bài, số câu hỏi.
3. Học sinh nhấn vào một bài thi → màn hình thông tin chi tiết bài thi.
4. Xem: thời gian bắt đầu/kết thúc, thời lượng (phút), hình thức (trắc nghiệm/tự luận), quy định.
5. Thêm vào lịch điện thoại (Google Calendar / Apple Calendar) bằng 1 nút.
**Expected Result**: HS biết đầy đủ thông tin bài thi trước ngày thi, không bỡ ngỡ.

### Flow 2: Vào phòng thi và bắt đầu làm bài
**Mô tả**: Đến giờ thi, học sinh vào phòng thi và bắt đầu làm bài.
**Trigger**: Nhấn nút **"Vào phòng thi"** (chỉ active khi đến giờ, trước 15 phút).
**Steps**:
1. Checklist kỹ thuật tự động: kiểm tra kết nối mạng ✅, dung lượng máy ✅, thời gian đồng bộ với server ✅.
2. Màn hình xác nhận quy định thi: danh sách ngắn các quy định + checkbox "Tôi đã đọc và đồng ý".
3. Nhấn **"Bắt đầu thi"** → đồng hồ đếm ngược bắt đầu.
4. Câu hỏi đầu tiên hiển thị. Navigation: vuốt ngang hoặc nhấn số câu ở panel bên.
5. HS lần lượt trả lời, có thể đánh dấu "Xem lại" (🚩) cho câu chưa chắc.
6. Bất kỳ lúc nào: nhấn "Nộp bài" → xem tổng quan các câu (đã trả lời/chưa/đánh dấu).
7. Xác nhận nộp → kết quả hiển thị (nếu trắc nghiệm và GV bật chế độ xem ngay).
**Expected Result**: Làm bài thi mượt mà, không lo mất bài, biết còn bao nhiêu thời gian.

### Flow 3: Xử lý mất kết nối trong khi thi
**Mô tả**: Mạng bị ngắt giữa buổi thi — xử lý gracefully.
**Trigger**: Phát hiện mất mạng (connection drop) trong phiên thi.
**Steps**:
1. Banner cảnh báo xuất hiện ngay lập tức: "⚠️ Mất kết nối — Bài làm đang được lưu offline"
2. Đồng hồ đếm ngược vẫn tiếp tục (offline timer).
3. HS tiếp tục làm bài, mỗi câu trả lời được lưu local trên máy.
4. Khi mạng trở lại: auto-sync, banner đổi thành "✅ Đã đồng bộ"
5. Nếu hết giờ mà vẫn offline: hệ thống ghi nhận bài đã làm đến thời điểm đó, nộp tự động khi có mạng.
**Expected Result**: HS không mất bài làm dù mạng yếu, tâm lý yên tâm hơn khi thi.

### Flow 4: Xem kết quả và đáp án sau thi
**Mô tả**: Học sinh xem điểm, đáp án đúng và phân tích bài làm sau khi thi.
**Trigger**: Vào tab "Đã kết thúc" → chọn bài thi → xem kết quả.
**Steps**:
1. Màn hình kết quả: điểm số to rõ, số câu đúng/sai, thời gian làm bài.
2. Nếu GV bật xem đáp án: hiển thị danh sách câu, câu đúng ✅ màu xanh, câu sai ❌ màu đỏ kèm đáp án đúng.
3. Nhấn vào từng câu sai → xem giải thích chi tiết (nếu GV thêm).
4. Biểu đồ phân tích: câu đúng theo chủ đề/chương → biết phần nào cần ôn lại.
5. So sánh với lớp (nếu GV bật): xếp hạng, histogram điểm.
**Expected Result**: HS hiểu được bài thi của mình ở mức nào và cần cải thiện gì.

---

## Tính năng & Màn hình

### Màn hình Lịch thi
- **Layout**: Dạng timeline dọc chia theo ngày. Badge màu theo trạng thái.
- **Components**:
  - `ExamCalendarView` — View lịch (list hoặc tháng, toggle)
  - `UpcomingExamCard` — Card bài thi sắp tới
  - `ExamHistoryList` — Danh sách bài đã thi với điểm
  - `CountdownTimer` — Đồng hồ đếm ngược đến bài thi gần nhất
  - `AddToCalendarButton` — Thêm vào lịch điện thoại

- **Info trên UpcomingExamCard**:
  - Tên bài thi + môn học (màu môn)
  - Ngày giờ bắt đầu — kết thúc
  - Thời lượng làm bài (phút)
  - Số câu hỏi
  - Hình thức: Trắc nghiệm / Tự luận / Hỗn hợp
  - Trạng thái: "Sắp tới" (xanh) / "Đang diễn ra" (đỏ nhấp nháy) / "Đã kết thúc" (xám)
  - CTA button: "Xem chi tiết" / "Vào thi" (active khi đến giờ)

### Màn hình Phòng thi
- **Layout**: Full-screen immersive, tắt notifications hệ thống trong khi thi.
- **Components**:
  - `ExamHeader` — Tên bài thi + đồng hồ đếm ngược (màu đỏ khi <5 phút)
  - `QuestionDisplay` — Hiển thị câu hỏi + các lựa chọn
  - `AnswerInput` — Input tương ứng: radio (1 đáp án) / checkbox (nhiều đáp án) / text area (tự luận)
  - `QuestionNavigator` — Panel số câu: ✅ đã trả lời / 🚩 đánh dấu / ⬜ chưa trả lời
  - `SubmitButton` — Nút "Nộp bài" luôn visible
  - `OfflineBanner` — Banner cảnh báo mất mạng
  - `AutoSaveIndicator` — "Đã lưu lúc 14:32:05"

- **Hiển thị câu hỏi**:
  - Câu hỏi text rõ ràng, font size tối thiểu 16px
  - Hình ảnh trong câu hỏi: tap để zoom
  - Công thức toán: render MathJax/KaTeX
  - Đáp án: card lớn dễ tap (min touch target 48dp)

### Màn hình Xem lại trước khi nộp
- Grid các ô số câu với màu: xanh (trả lời) / đỏ (chưa trả lời) / vàng (đánh dấu xem lại)
- Tổng kết: "Đã trả lời X/Y câu. Còn Z câu chưa trả lời."
- Nếu còn câu chưa trả lời: cảnh báo vàng + gợi ý xem lại trước khi nộp
- Nút "Quay lại làm tiếp" | "Nộp bài ngay"

### Màn hình Kết quả thi
- **Điểm to giữa màn hình** + circle animation
- Câu đúng / sai / bỏ qua (số lượng + %)
- Thời gian hoàn thành
- Grade label: Xuất sắc / Giỏi / Khá / Trung bình / Yếu
- Danh sách câu hỏi + câu trả lời của HS vs. đáp án đúng
- Nút chia sẻ kết quả (optional)

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Thêm lịch thi vào calendar | Tap "Thêm vào lịch" | Deep link mở Google Calendar/Apple Calendar |
| Vào phòng thi | Tap "Vào thi" (chỉ active đúng giờ) | Checklist → Bắt đầu thi |
| Chuyển câu | Tap số câu / Swipe | Di chuyển đến câu hỏi đó |
| Đánh dấu xem lại | Tap 🚩 | Câu đó hiển thị vàng trong navigator |
| Nộp bài | Tap "Nộp bài" | Màn hình review → Confirm → Kết quả |
| Nộp tự động | Hết giờ | Auto submit, thông báo "Hết giờ! Bài đã nộp tự động." |
| Xem đáp án | Tap câu sai trong kết quả | Hiển thị đáp án + giải thích |
| Xem phân tích | Tap tab "Phân tích" | Biểu đồ điểm theo chủ đề |

---

## Gom nhóm tính năng thông minh

**Tại sao gom "lịch thi + phòng thi + kết quả" vào một module?**
- Vòng đời thi gồm: Biết lịch → Chuẩn bị → Vào thi → Nộp → Xem kết quả → Ôn lại. Toàn bộ hành trình này cần ở một nơi để HS có mental model rõ ràng.
- Lịch thi tích hợp với Home feed + calendar điện thoại giúp HS không bao giờ quên thi.
- Màn hình kết quả chi tiết (câu đúng/sai + giải thích) biến bài thi từ "chỉ để lấy điểm" thành "công cụ học tập" — HS hiểu mình sai ở đâu.
- Navigator câu hỏi dạng grid giúp HS quản lý thời gian thi hiệu quả, biết còn bao nhiêu câu chưa làm.

---

## UX Notes
- **Màu sắc**:
  - Xanh lá: câu đã trả lời, điểm cao
  - Đỏ: câu sai, countdown nguy hiểm (<5 phút)
  - Vàng: đánh dấu xem lại, điểm trung bình
  - Xám: câu bỏ qua, bài thi đã kết thúc
- **Animation**:
  - Vào phòng thi: loading screen với hiệu ứng "bắt đầu thi" (countdown 3-2-1)
  - Nộp bài: animation "tờ giấy thi bay đi", transition sang màn hình kết quả
  - Kết quả điểm: số điểm count-up từ 0 đến điểm thực
  - Hết giờ: màn hình rung nhẹ + banner đỏ "Hết giờ! Đang nộp bài..."
- **Anti-distraction**: Khi thi, tắt toàn bộ notification từ app khác (nếu user grant permission). Nếu HS rời app (switch app): cảnh báo "Bạn vừa rời khỏi phòng thi. Lần vi phạm: 1/3."
- **Accessibility**: Font tối thiểu 16px, contrast ratio đạt AA. Câu hỏi có thể zoom bằng pinch.
- **Empty states**:
  - Không có bài thi sắp tới: "Không có bài thi nào trong thời gian tới. Tranh thủ ôn bài đi! 📚"
  - Chưa có lịch sử thi: "Bạn chưa thi bài nào. Kết quả sẽ hiển thị ở đây."

---

## Edge Cases
- **HS vào muộn** (sau giờ thi bắt đầu): Vẫn cho vào thi nhưng đồng hồ không dừng, thông báo "Bạn vào muộn X phút. Thời gian còn lại: Y phút."
- **Điện thoại tắt / hết pin giữa thi**: Khi mở lại, nếu còn trong khung giờ thi: hiện thông báo "Phiên thi của bạn vẫn còn. Thời gian còn lại: X phút. Tiếp tục?" với bài đã làm được khôi phục từ local storage.
- **Mạng rất chậm lúc submit**: Hiển thị "Đang nộp bài... (có thể mất vài giây)", không để HS nhấn nộp nhiều lần. Disable nút sau lần nhấn đầu tiên.
- **Câu hỏi có ảnh không tải được**: Placeholder + nút "Tải lại ảnh" nhỏ. Không block việc trả lời câu hỏi.
- **GV thay đổi thời gian thi đột xuất**: Notification push + thay đổi realtime trên màn hình lịch thi. Nếu đang trong phòng thi: cập nhật timer ngay.
- **Nhiều bài thi cùng lúc** (trường hợp schedule conflict): Thông báo cảnh báo + liên hệ GV để giải quyết.
- **HS làm xong trước giờ và nộp**: Xác nhận "Bạn còn X phút. Chắc chắn nộp bài không?" Sau khi nộp: không được vào lại phòng thi.
- **Server bị quá tải trong giờ thi**: Queue requests + retry tự động. HS thấy "Đang xử lý..." không thấy lỗi kỹ thuật thô.
