# Quản Lý Nội Dung Giảng Dạy — Role: Giáo viên

## Mục tiêu
Cho phép giáo viên tạo, tổ chức và phân phối nội dung học tập đa dạng (SCORM, Video, Văn bản, File, Khảo sát) cho từng lớp học online — với giao diện kéo-thả trực quan và khả năng tái sử dụng nội dung từ các kỳ trước, giúp giảm thời gian chuẩn bị bài tối đa.

## Người dùng
- **Giáo viên bộ môn**: Tạo và quản lý nội dung cho lớp học online của mình, phân phối nội dung theo lịch.
- **Giáo viên chủ nhiệm**: Không có quyền thêm, chỉ xem nội dung các môn trong lớp chủ nhiệm (để tổng hợp báo cáo).

---

## User Flow Chính

### Flow 1: Tạo bài học mới trong khóa học
**Mô tả**: GV tạo một bài học mới với nội dung dạng Video + Văn bản hỗ trợ.
**Trigger**: GV vào khóa học → bấm "+ Thêm bài học".
**Steps**:
1. GV chọn hoặc tạo **Chương** (VD: Chương 3 — Hàm số mũ).
2. Trong chương, bấm **"+ Thêm bài học"** → modal mở ra.
3. Nhập tiêu đề bài học. Chọn loại nội dung chính:
   - 🎬 Video
   - 📄 Văn bản / Bài giảng HTML
   - 📦 SCORM/xAPI
   - 📎 File đính kèm
   - 📊 Khảo sát / Phiếu phản hồi
4. GV upload hoặc soạn nội dung theo loại đã chọn.
5. Thêm tài liệu đính kèm phụ (PDF, slide, link ngoài).
6. Cài đặt hiển thị: Hiển thị ngay / Ẩn / Hiển thị từ ngày X.
7. Bấm **"Lưu bài học"** → bài học xuất hiện trong outline khóa học.
**Expected Result**: Bài học được tạo trong < 5 phút với nội dung video sẵn có.

---

### Flow 2: Upload và nhúng Video bài giảng
**Mô tả**: GV upload video bài giảng đã quay sẵn hoặc nhúng video từ YouTube/Vimeo.
**Trigger**: GV chọn loại nội dung "Video" khi tạo/sửa bài học.
**Steps**:
1. Hiển thị 3 tùy chọn:
   - **Upload video**: Kéo-thả hoặc chọn file (MP4/MOV/AVI, tối đa 2GB).
   - **Nhúng URL**: Dán link YouTube / Google Drive / Vimeo.
   - **Quay màn hình**: Tích hợp công cụ ghi màn hình (nếu dùng app desktop).
2. Nếu upload: Thanh tiến trình hiển thị % upload. Hệ thống tự convert sang HLS streaming.
3. Cài đặt video: Bắt buộc xem hết / Cho phép tua / Tốc độ xem tối thiểu (%).
4. Thêm **điểm tương tác** (interactive hotspot): tại thời điểm X giây, hiện câu hỏi nhỏ.
5. Xem preview trước khi lưu.
**Expected Result**: Video được publish và HS xem được trong < 2 phút sau khi upload (với file nhỏ < 200MB).

---

### Flow 3: Tạo nội dung SCORM
**Mô tả**: GV upload gói SCORM đã tạo từ phần mềm ngoài (Articulate, iSpring...).
**Trigger**: GV chọn loại nội dung "SCORM/xAPI".
**Steps**:
1. GV kéo-thả file .zip SCORM lên vùng upload.
2. Hệ thống tự parse manifest, hiển thị thông tin gói: Tiêu đề, Số module, Ước tính thời gian.
3. GV xem preview trong khung sandbox.
4. Cài đặt: Điểm đạt (%), Cho phép làm lại (Y/N), Ghi nhận completion khi nào (hoàn thành quiz / xem hết / điểm đạt).
5. Lưu → SCORM tích hợp vào bài học, tracking tự động ghi vào hệ thống.
**Expected Result**: SCORM hoạt động end-to-end, điểm và completion status được ghi nhận vào báo cáo HS.

---

### Flow 4: Tạo bài khảo sát / Phiếu phản hồi
**Mô tả**: GV tạo khảo sát nhanh để đánh giá sự hiểu bài hoặc lấy ý kiến HS.
**Trigger**: GV chọn loại nội dung "Khảo sát".
**Steps**:
1. Chọn mẫu: **Khảo sát trắc nghiệm** / **Phiếu phản hồi mở** / **Thăm dò ý kiến (Poll)**.
2. Thêm câu hỏi bằng drag-and-drop. Loại câu hỏi:
   - Trắc nghiệm 1 đáp án / nhiều đáp án
   - Điền chỗ trống
   - Thang điểm (Likert 1-5)
   - Câu hỏi mở (text)
3. Cài đặt: Ẩn danh / Hiện tên HS / Bắt buộc hoàn thành trước khi xem bài tiếp theo.
4. Xem kết quả tổng hợp sau khi HS làm.
**Expected Result**: GV biết được tỷ lệ HS hiểu bài ngay sau tiết học qua biểu đồ tổng hợp.

---

### Flow 5: Tái sử dụng nội dung từ kỳ trước
**Mô tả**: GV copy nguyên một chương hoặc bài học từ kỳ học cũ sang kỳ mới.
**Trigger**: GV bấm "Nhập từ khóa học cũ" trong màn hình tổ chức nội dung.
**Steps**:
1. Modal hiện danh sách khóa học GV đã tạo (theo kỳ, môn học).
2. GV chọn khóa học nguồn → xem cấu trúc chương/bài dạng cây.
3. Tích chọn chương/bài muốn copy (có thể chọn nhiều).
4. Bấm "Copy vào khóa học hiện tại" → nội dung được duplicate.
5. Nội dung copy là bản độc lập (chỉnh sửa bản mới không ảnh hưởng bản gốc).
6. GV chỉnh sửa nội dung cho phù hợp kỳ mới (ngày, ví dụ...).
**Expected Result**: Tiết kiệm 60-80% thời gian tạo nội dung so với làm mới hoàn toàn.

---

## Tính năng & Màn hình

### Màn hình chính — Outline khóa học (Course Builder)
```
┌─────────────────────────────────────────────────────────┐
│  📚 Toán 11 — Lớp 11A2   HK2/2025-2026   [Xem trước]   │
├──────────────┬──────────────────────────────────────────┤
│  OUTLINE     │  NỘI DUNG BÀI HỌC (Editor)               │
│  ──────────  │  ────────────────────────────────────    │
│ ▼ Chương 1   │  Bài 3.1 — Hàm số mũ                    │
│   Bài 1.1 ✅ │  ─────────────────────────────────────  │
│   Bài 1.2 ✅ │  [🎬 Video] [📄 Văn bản] [📦 SCORM]     │
│   Bài 1.3 📝 │  [📎 File]  [📊 Khảo sát] [🔗 Link]     │
│ ▼ Chương 2   │                                          │
│   Bài 2.1 ✅ │  THÊM NỘI DUNG:                         │
│   Bài 2.2 🔒 │  ┌────────────────────────────────────┐ │
│ ▶ Chương 3   │  │ Kéo-thả file vào đây hoặc [Chọn]  │ │
│   [+ Bài]    │  └────────────────────────────────────┘ │
│              │                                          │
│ [+ Chương]   │  TÀI LIỆU ĐÍNH KÈM:                     │
│              │  + Thêm file PDF / Slide / Link          │
│ [Nhập cũ]   │                                          │
│              │  HIỂN THỊ: ● Hiện ngay ○ Ẩn ○ Lên lịch │
└──────────────┴──────────────────────────────────────────┘
```

### Trạng thái bài học (status icons)
- ✅ Đã publish, HS có thể xem
- 📝 Bản nháp (GV đang soạn)
- 🔒 Đã ẩn / Chưa đến ngày mở
- ⏰ Có lịch mở (hiển thị ngày)
- ⚠️ Có lỗi (SCORM lỗi, video chưa xử lý xong)

### Các loại nội dung — Chi tiết

#### 🎬 Video
- Upload: MP4/MOV, tối đa 2GB/file.
- URL nhúng: YouTube, Vimeo, Google Drive.
- Cài đặt: Tua được (Y/N), tốc độ tối thiểu, interactive checkpoint.
- Tracking: ghi nhận % đã xem, số lần xem của từng HS.

#### 📄 Văn bản / Bài giảng HTML
- Rich text editor: Bold, Italic, Table, Code block, Math formula (LaTeX).
- Nhúng ảnh, nhúng video inline.
- Hỗ trợ công thức toán (MathJax/KaTeX) — quan trọng cho GV Toán/Vật lý.

#### 📦 SCORM / xAPI
- Upload .zip SCORM 1.2 hoặc SCORM 2004.
- Auto-detect phiên bản.
- Tracking: Score, Completion status, Time spent.
- Hiển thị trong iframe sandbox bảo mật.

#### 📎 File đính kèm
- PDF, DOCX, PPTX, XLSX, ZIP.
- Tối đa 100MB/file.
- Xem inline (PDF viewer tích hợp) hoặc tải về.
- Tracking: số lượt tải, lần xem đầu tiên.

#### 📊 Khảo sát / Poll
- Builder kéo-thả với 5 loại câu hỏi.
- Kết quả xem ngay (dạng chart) sau khi HS submit.
- Export kết quả ra Excel.

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Thêm chương | Bấm "+ Chương" | Tạo chương mới trong outline |
| Thêm bài học | Bấm "+ Bài" trong chương | Modal tạo bài học mới |
| Upload video | Kéo thả file vào editor | Upload, convert, tự động nhúng vào bài |
| Nhập từ khóa cũ | Bấm "Nhập từ khóa học cũ" | Modal chọn nội dung tái sử dụng |
| Publish bài | Toggle "Hiện ngay" | HS thấy ngay trong danh sách bài |
| Lên lịch publish | Chọn "Lên lịch" + ngày | Tự động publish đúng ngày giờ |
| Ẩn bài | Toggle "Ẩn" | HS không thấy, GV vẫn xem trong bản nháp |
| Sắp xếp lại | Kéo-thả bài trong outline | Thứ tự bài thay đổi |
| Xem trước | Bấm "Xem trước" | Mở preview như HS thấy |
| Xóa bài | Bấm "..." → Xóa | Xác nhận trước khi xóa, không xóa nếu đã có HS xem |

---

## Gom nhóm tính năng thông minh

**Auto-save**: Editor tự lưu nháp mỗi 30 giây. GV không bao giờ mất dữ liệu nếu đóng tab nhầm.

**Content Library** (Thư viện nội dung cá nhân):
- Tất cả file GV từng upload được lưu vào thư viện riêng.
- Khi tạo bài mới, GV tìm trong thư viện thay vì upload lại.
- Tag nội dung theo chủ đề, lớp, kỳ học.

**Duplicate bài học**: Bấm "..." → "Nhân đôi bài" → copy bài sang cùng lớp hoặc lớp khác.

**Bulk visibility**: Chọn nhiều bài → "Publish tất cả" / "Ẩn tất cả" / "Lên lịch theo series" (VD: mỗi thứ 2 mở 1 bài).

---

## Edge Cases & Validation

- **Upload video > 2GB**: Hiển thị lỗi "File quá lớn — vui lòng nén hoặc dùng link YouTube."
- **SCORM parse lỗi**: Hiển thị chi tiết lỗi manifest, gợi ý kiểm tra lại trong Articulate/iSpring.
- **Video đang xử lý (converting)**: Bài học có tag "Đang xử lý video ⏳", HS chưa xem được, GV thấy ETA hoàn thành.
- **Mất kết nối khi upload**: Hỗ trợ resume upload, không bắt đầu lại từ đầu.
- **GV xóa bài đã có HS xem**: Cảnh báo "23 học sinh đã xem bài này. Xóa sẽ ẩn hoàn toàn khỏi lịch sử của họ. Xác nhận?" với option "Ẩn thay vì xóa".
- **Công thức LaTeX lỗi**: Highlight inline lỗi ngay trong editor, gợi ý cú pháp đúng.
- **File SCORM quá lớn (> 500MB)**: Cảnh báo và gợi ý split thành nhiều phần nhỏ hơn.
- **Link YouTube bị gỡ**: Hệ thống kiểm tra link mỗi ngày, cảnh báo GV nếu link 404.

---

## Tích hợp

- **Module E-learning**: Lõi chính — lưu trữ, phân phối và tracking nội dung.
- **Storage Service**: Upload và serve video/file (S3-compatible hoặc hệ thống nội bộ).
- **Video Transcoding Service**: Convert video sang HLS, tạo thumbnail tự động.
- **SCORM Runtime**: Xử lý SCORM API, ghi nhận completion và score.
- **Module Ngân hàng câu hỏi**: Khi tạo khảo sát, GV có thể import câu hỏi từ ngân hàng.
- **Module Kết quả**: Dữ liệu tracking (% xem video, SCORM score) đổ vào báo cáo kết quả học tập.
- **Module Thi trực tuyến**: Bài học có thể liên kết trực tiếp với đề thi cuối chương.
