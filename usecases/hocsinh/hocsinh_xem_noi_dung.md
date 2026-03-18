# Xem Nội Dung Học — Role: Học sinh

## Mục tiêu
Cung cấp trải nghiệm xem nội dung học (SCORM, video, văn bản, tài liệu) mượt mà nhất có thể trên thiết bị di động, với khả năng học offline và tự động lưu tiến độ để học sinh không bao giờ mất chỗ đang học.

## User Story
"Là học sinh, tôi muốn xem bài học và tài liệu dễ dàng trên điện thoại — kể cả khi không có internet — để tôi có thể học mọi lúc mọi nơi mà không lo gián đoạn."

---

## User Flow Chính

### Flow 1: Xem video bài giảng
**Mô tả**: Học sinh mở và xem video bài giảng của giáo viên.
**Trigger**: Nhấn vào một bài học có icon 📹 (Video) trong danh sách môn học.
**Steps**:
1. Màn hình chuyển sang player video toàn màn hình (hoặc dạng embeded trong trang).
2. Video tự động bắt đầu phát. Nếu đã xem trước đó, hỏi "Tiếp tục từ [2:34]?" với 2 nút: **Tiếp tục** | **Xem lại từ đầu**.
3. Controls hiển thị: play/pause, tua (±10s), tốc độ phát (0.75x / 1x / 1.25x / 1.5x / 2x), chất lượng (Auto/360p/720p), phụ đề (nếu có), fullscreen.
4. Học sinh xem video. Thanh tiến độ phía dưới cho thấy đã xem đến đâu.
5. Khi xem đến 80% video → hệ thống tự đánh dấu "Đã xem". Toast nhỏ: "✅ Đã tính hoàn thành!"
6. Video kết thúc → hiển thị overlay "Bài tiếp theo: [Tên bài]" với countdown 5 giây + nút Skip/Cancel.
**Expected Result**: Học sinh xem video liền mạch, tiến độ được lưu tự động, không cần thao tác thêm.

### Flow 2: Học bài SCORM (bài học tương tác)
**Mô tả**: Học sinh truy cập và hoàn thành một bài học SCORM có tương tác.
**Trigger**: Nhấn vào bài học có icon 🎮 (SCORM) trong danh sách.
**Steps**:
1. Hiển thị splash screen môn học trong 1 giây → load SCORM viewer.
2. SCORM hiển thị trong webview responsive, tự động fit màn hình điện thoại.
3. HS tương tác với nội dung (nhấn, kéo, trả lời câu hỏi nhúng).
4. Điều hướng trong SCORM: nút Trước/Tiếp theo ở bottom, menu chương nhỏ ở góc.
5. Nếu SCORM có quiz nhúng: HS trả lời, nhận feedback ngay.
6. Khi HS đóng hoặc rời trang: auto-save vị trí + điểm tạm thời.
7. Hoàn thành SCORM → điểm completion được gửi về hệ thống.
**Expected Result**: SCORM chạy mượt trên mobile, không bị vỡ layout, lưu tiến độ khi thoát giữa chừng.

### Flow 3: Đọc tài liệu văn bản / PDF
**Mô tả**: Học sinh đọc tài liệu bài học dạng văn bản hoặc PDF.
**Trigger**: Nhấn vào bài học có icon 📄 (Tài liệu/PDF).
**Steps**:
1. Tài liệu văn bản (HTML/Markdown): render trực tiếp trong app với font đọc dễ (font-size có thể chỉnh).
2. Tài liệu PDF: mở trong PDF viewer tích hợp, có thể pinch-to-zoom, scroll trang.
3. Thanh công cụ đọc: cỡ chữ (A- / A+), chế độ tối (dark mode), đánh dấu highlight, ghi chú nhỏ.
4. Nút "Tải về" (⬇️) để lưu offline.
5. Khi scroll xuống >80% tài liệu → đánh dấu hoàn thành tự động.
**Expected Result**: Đọc tài liệu thoải mái, có thể zoom, highlight, và tải về đọc offline.

### Flow 4: Tải nội dung về xem offline
**Mô tả**: Học sinh tải trước nội dung để học khi không có mạng.
**Trigger**: Nhấn icon ⬇️ "Tải offline" trên bài học, hoặc nhấn "Tải cả chương".
**Steps**:
1. Hiển thị dialog xác nhận: "Tải [Tên bài] (45MB)? Cần kết nối WiFi để tải nhanh hơn."
2. HS xác nhận → download bắt đầu với progress bar.
3. Sau khi tải xong: icon ⬇️ đổi thành ✅ màu xanh, bài xuất hiện trong tab "Đã tải".
4. Khi offline: bài đã tải mở bình thường, bài chưa tải hiện thông báo "Cần kết nối mạng".
**Expected Result**: Học sinh có thể học trong xe, nơi không có wifi mà không bị gián đoạn.

---

## Tính năng & Màn hình

### Màn hình Video Player
- **Layout**: Video chiếm tối thiểu 50% chiều cao màn hình. Phần còn lại: tên bài, mô tả, tài liệu đính kèm, bình luận.
- **Components**:
  - `VideoPlayer` — Custom player hỗ trợ HLS streaming adaptive bitrate
  - `SpeedControl` — Nút tốc độ phát (0.75x–2x)
  - `ProgressBar` — Thanh tiến độ có thể tap để tua
  - `AutoNextOverlay` — Overlay bài tiếp theo sau khi xem xong
  - `AttachmentList` — Tài liệu đính kèm bên dưới video
  - `LessonNote` — Ô ghi chú nhỏ trong khi học
- **Gesture support**:
  - Double-tap trái/phải: tua lùi/tiến 10 giây
  - Swipe up trên video: fullscreen
  - Swipe down khi fullscreen: thu nhỏ lại

### Màn hình SCORM Viewer
- **Layout**: WebView full-screen với navigation bar nhỏ ở bottom (Trước / Tiếp).
- **Components**:
  - `SCORMWebView` — Iframe responsive với postMessage API để đồng bộ tiến độ
  - `ChapterMenu` — Hamburger menu nhỏ ở góc trên phải: danh sách slides/trang
  - `ProgressBar` — Thanh tiến độ SCORM (dựa trên completion status)
  - `ExitButton` — Nút X thoát, có confirm dialog nếu chưa hoàn thành
- **SCORM Standards**: Hỗ trợ SCORM 1.2 và SCORM 2004. Fallback graceful nếu SCORM cũ.

### Màn hình Đọc tài liệu (Document Reader)
- **Layout**: Full-screen đọc, topbar có thể ẩn khi scroll xuống (immersive mode).
- **Components**:
  - `ReadingToolbar` — Font size, Dark mode, Bookmark
  - `PDFViewer` — Viewer PDF tích hợp với thumbnail trang
  - `HighlightTool` — Bôi màu văn bản + ghi chú inline
  - `TableOfContents` — Mục lục cho tài liệu dài
  - `DownloadButton` — Tải về lưu ngoài app (nếu GV cho phép)

### Thanh điều hướng bài học
- **Previous / Next Lesson**: Luôn hiển thị ở cuối màn hình dù đang xem loại nội dung gì.
- **Breadcrumb**: [Tên môn] > [Chương X] > [Bài Y] — nhấn để quay về.
- **Progress chip**: "Bài 3/12 trong Chương 2" — cảm giác tiến độ rõ ràng.

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Phát video | Tap play | Video bắt đầu/tiếp tục |
| Thay đổi tốc độ | Tap speed chip | Dropdown tốc độ phát |
| Tua nhanh ±10s | Double-tap trái/phải | Tua video |
| Chuyển fullscreen | Tap icon / xoay ngang | Video fullscreen |
| Tải offline | Tap ⬇️ | Download bài học |
| Ghi chú | Tap icon 📝 | Mở ô ghi chú nhanh |
| Bài tiếp theo | Tap "Tiếp theo" / Auto | Mở bài học kế |
| Báo lỗi nội dung | Tap "..." > Báo lỗi | Gửi report đến GV/Admin |
| Highlight văn bản | Long press > chọn màu | Bôi màu đoạn văn |

---

## Gom nhóm tính năng thông minh

**Tại sao xử lý SCORM, Video, PDF trong cùng một flow "Xem nội dung"?**
- Từ góc nhìn học sinh, tất cả đều là "bài học" — HS không quan tâm đến định dạng kỹ thuật. Việc ẩn sự khác biệt kỹ thuật đằng sau một UI nhất quán giúp trải nghiệm liền mạch.
- Tự động lưu tiến độ cho mọi loại nội dung (video timestamp, SCORM bookmark, scroll position PDF) là tính năng cốt lõi — HS không bao giờ phải "bắt đầu lại từ đầu" nếu bị gián đoạn.
- Tính năng ghi chú inline và tải offline hoạt động nhất quán trên mọi loại nội dung, HS học được pattern 1 lần, dùng được ở mọi nơi.

---

## UX Notes
- **Màu sắc/icon**:
  - Video: 🎬 đỏ `#E53935`
  - SCORM: 🎮 xanh dương `#1E88E5`
  - PDF/Văn bản: 📄 cam `#FB8C00`
  - Đã tải offline: ✅ xanh lá
  - Đang tải: ⬇️ xanh dương với animation spinner
- **Animation / Feedback**:
  - Video load: skeleton animation trong khi buffer
  - Hoàn thành bài: confetti nhỏ + toast "✅ Hoàn thành [Tên bài]!"
  - SCORM navigate: fade transition giữa các slide
  - Download progress: thanh progress fill liên tục, không nhảy
  - Pinch-to-zoom PDF: smooth zoom với inertia
- **Dark mode**: Tự động theo system theme, đặc biệt quan trọng cho đọc ban đêm.
- **Font size accessibility**: Range A- đến A++, lưu preference theo user.
- **Empty states**:
  - Video đang bị lỗi/chưa có: "GV đang tải nội dung lên, hãy quay lại sau 🕐"
  - SCORM không tương thích mobile: "Bài học này cần mở trên máy tính. Bạn có muốn chuyển sang chế độ tương thích không?"

---

## Edge Cases
- **Video buffer chậm / mạng yếu**: Tự động hạ chất lượng xuống 360p khi buffer lag. Hiển thị indicator "Đang dùng chất lượng thấp để tiết kiệm data".
- **SCORM không responsive** (thiết kế cho desktop): Hiển thị cảnh báo + button "Mở chế độ ngang" (force landscape) hoặc "Dùng máy tính để trải nghiệm tốt hơn".
- **PDF quá lớn (>50MB)**: Hỏi HS trước khi tải: "File này nặng 60MB, bạn có muốn tải không?" + gợi ý "Tải về WiFi để tiết kiệm data".
- **Mất mạng giữa chừng khi xem video**: Pause video, hiển thị "Mất kết nối — Đang thử kết nối lại..." Khi mạng trở lại, tự resume. Không xóa tiến độ đã ghi.
- **SCORM gặp lỗi JavaScript**: Fallback hiển thị nội dung dạng HTML tĩnh nếu có, kèm thông báo "Một số tính năng tương tác không hoạt động".
- **Video có DRM** (bản quyền): Không cho phép screenshot/screen record. Thông báo nhẹ nhàng: "Nội dung này được bảo vệ bản quyền."
- **Pin thấp khi đang học SCORM**: Cảnh báo "Pin dưới 15% — Tiến độ sẽ tự lưu khi bạn thoát ra."
- **Đang tải offline thì mất mạng**: Pause download, giữ phần đã tải. Resume tự động khi có mạng trở lại.
- **GV xóa/cập nhật nội dung** đã tải offline: Khi mở bài, kiểm tra hash — nếu thay đổi, hỏi "Có bản cập nhật mới. Tải lại không?"
