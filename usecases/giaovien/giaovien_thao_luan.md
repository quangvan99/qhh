# Quản Lý Thảo Luận — Role: Giáo viên

## Mục tiêu
Cung cấp cho giáo viên công cụ quản lý diễn đàn thảo luận lớp học online — trả lời câu hỏi học sinh, điều tiết nội dung, gợi ý thảo luận theo chủ đề — biến không gian online thành môi trường học tập tích cực, mở rộng giờ học ngoài phòng học, và giảm tải câu hỏi lặp lại nhờ FAQ thông minh.

## Người dùng
- **Giáo viên bộ môn**: Tạo chủ đề thảo luận, trả lời câu hỏi HS, ghim bài quan trọng, xóa/ẩn nội dung không phù hợp, đánh giá (điểm) sự tham gia thảo luận.
- **Giáo viên chủ nhiệm**: Xem và can thiệp diễn đàn lớp chủ nhiệm (không liên quan nội dung môn học, chỉ điều tiết hành vi, mâu thuẫn giữa HS).

---

## User Flow Chính

### Flow 1: Tạo chủ đề thảo luận mới (GV khởi xướng)
**Mô tả**: GV mở một chủ đề thảo luận để HS chia sẻ ý kiến về bài học hoặc câu hỏi mở.
**Trigger**: GV vào lớp học online → tab "Thảo luận" → bấm "+ Tạo chủ đề".
**Steps**:
1. Nhập **Tiêu đề** chủ đề (VD: "Ứng dụng đạo hàm trong kinh tế — Bạn nghĩ gì?").
2. Soạn **Nội dung mở đầu** — GV đặt câu hỏi gợi ý, đính kèm ảnh/video/link tham khảo.
3. Cài đặt chủ đề:
   - **Gắn với bài học**: Liên kết với bài học cụ thể trong khóa học.
   - **Loại**: Thảo luận mở / Q&A (HS hỏi, GV trả lời) / Phiếu bình chọn.
   - **Thời hạn**: Mở mãi / Đóng vào ngày X.
   - **Điểm tham gia**: Tham gia thảo luận được cộng điểm (VD: 0.5 điểm TX cho HS đăng ít nhất 1 bình luận có giá trị).
   - **Ẩn danh**: Cho HS đăng ẩn danh hay không.
4. Bấm "Đăng" → HS nhận thông báo chủ đề mới.
**Expected Result**: Chủ đề thảo luận sôi nổi, HS chủ động tham gia ngoài giờ học.

---

### Flow 2: Trả lời câu hỏi học sinh (Q&A)
**Mô tả**: HS đặt câu hỏi về bài tập hoặc bài giảng, GV trả lời và đánh dấu "Đã giải đáp".
**Trigger**: HS đăng câu hỏi → GV nhận thông báo "HS X đã đặt câu hỏi trong lớp 11A2".
**Steps**:
1. GV bấm thông báo → vào thread câu hỏi của HS.
2. GV đọc câu hỏi, xem context (bài học liên quan, câu hỏi trước của HS này).
3. Gõ câu trả lời (rich text, hỗ trợ LaTeX, ảnh, code block).
4. Bấm **"Trả lời"** → HS nhận thông báo "GV đã trả lời câu hỏi của bạn."
5. GV bấm **"Đánh dấu đã giải đáp ✓"** → câu hỏi chuyển sang tab "Đã giải đáp".
6. Nếu câu hỏi quan trọng/hay → GV bấm **"Ghim lên đầu"** → tất cả HS trong lớp đều thấy.
**Expected Result**: HS được GV trả lời trong < 24h. Câu hỏi hay được ghim thành tài nguyên chung.

---

### Flow 3: Quản lý và điều tiết nội dung
**Mô tả**: GV xem qua các bài đăng, ẩn/xóa nội dung không phù hợp, pin bài hay.
**Trigger**: GV vào tab "Thảo luận" → xem danh sách chủ đề có bài mới.
**Steps**:
1. Màn hình hiển thị danh sách chủ đề, sort theo: Hoạt động gần nhất / Chưa trả lời / Nhiều lượt xem nhất.
2. Badge đỏ trên chủ đề có bài HS đăng chờ GV duyệt (nếu bật chế độ kiểm duyệt).
3. GV bấm vào chủ đề → xem tất cả bình luận.
4. Với mỗi bình luận GV có thể:
   - **Thích ❤️**: Khuyến khích bình luận tốt.
   - **Ghim 📌**: Hiển thị bình luận này ở đầu thread.
   - **Chỉnh sửa** (chỉ sửa lỗi chính tả nếu cần).
   - **Ẩn**: Bình luận không hiển thị với HS khác, HS tác giả vẫn thấy.
   - **Xóa**: Xóa hoàn toàn, ghi log lý do.
   - **Cảnh báo HS**: Gửi cảnh báo riêng tư "Bình luận của bạn không phù hợp nội quy."
5. GV lọc "Chưa có phản hồi" → thấy ngay câu hỏi chưa được trả lời để ưu tiên.
**Expected Result**: Diễn đàn sạch sẽ, tích cực, HS được hỗ trợ kịp thời.

---

### Flow 4: Xem thống kê tham gia thảo luận
**Mô tả**: GV xem HS nào tham gia tích cực, HS nào thụ động để đánh giá điểm thảo luận.
**Trigger**: GV vào tab "Thống kê thảo luận" trong lớp.
**Steps**:
1. Bảng thống kê: HS, Số bài đăng, Số trả lời, Số lượt được GV like, Số câu hỏi đặt ra, Điểm tham gia (tự tính).
2. Biểu đồ hoạt động theo tuần: ai đang ngày càng tích cực, ai không tham gia.
3. GV chọn "Tính điểm tham gia" → hệ thống đề xuất điểm dựa trên hoạt động, GV xác nhận và điều chỉnh.
4. GV xuất bảng tham gia thảo luận ra Excel.
**Expected Result**: Chấm điểm thảo luận khách quan, dựa trên dữ liệu thực tế thay vì cảm tính.

---

### Flow 5: Tạo FAQ từ câu hỏi hay được lặp lại
**Mô tả**: GV ghom các câu hỏi HS hỏi nhiều nhất thành FAQ cho lớp.
**Trigger**: GV thấy nhiều HS hỏi cùng 1 vấn đề → bấm "Tạo FAQ từ câu hỏi này".
**Steps**:
1. GV chọn thread câu hỏi đã trả lời → bấm "Thêm vào FAQ lớp".
2. Hệ thống copy câu hỏi + câu trả lời GV vào section "Câu hỏi thường gặp".
3. FAQ xuất hiện ở đầu tab Thảo luận và trong trang bài học liên quan.
4. Khi HS gõ câu hỏi mới có độ tương đồng > 70% với FAQ → hệ thống gợi ý "Câu hỏi này đã có câu trả lời — xem FAQ" trước khi HS đăng.
**Expected Result**: GV không phải trả lời cùng 1 câu hỏi 10 lần. HS tìm được câu trả lời tự phục vụ.

---

## Tính năng & Màn hình

### Màn hình chính — Diễn đàn lớp
```
┌─────────────────────────────────────────────────────────┐
│  💬 Thảo luận — Toán 11 — Lớp 11A2       [+ Chủ đề]   │
│  [Tất cả] [❓ Chưa trả lời (5)] [📌 Đã ghim] [✅ Q&A]  │
│  [FAQ] [Thống kê tham gia]                              │
├─────────────────────────────────────────────────────────┤
│  📌 [GHIM] Tổng hợp kiến thức Chương 3 — GV đăng       │
│  👁 234 lượt xem | 12 bình luận | Mở từ 10/03          │
├─────────────────────────────────────────────────────────┤
│  ❓ [CHƯA TRẢ LỜI] Bài tập 3c em không hiểu bước 2     │
│  Nguyễn Văn An | 30 phút trước | 3 HS cùng thắc mắc    │
│  [Trả lời ngay →]                                       │
├─────────────────────────────────────────────────────────┤
│  ✅ Em hiểu hàm số mũ rồi ạ, cảm ơn thầy/cô!          │
│  Trần Thị Bình | 2 giờ trước | [Đã giải đáp ✓]         │
├─────────────────────────────────────────────────────────┤
│  💬 Ứng dụng đạo hàm trong thực tế — chủ đề tuần này  │
│  GV tạo | 18 bình luận | 3 ngày trước                  │
└─────────────────────────────────────────────────────────┘
```

### Màn hình chi tiết thread thảo luận
```
┌─────────────────────────────────────────────────────────┐
│  ❓ Bài tập 3c em không hiểu bước 2           [Ghim] [Ẩn]│
│  Nguyễn Văn An | 11A2 | 30 phút trước                   │
│  ─────────────────────────────────────────────────────  │
│  "Thầy/cô ơi, ở bước 2 bài 3c sách trang 45,           │
│   tại sao lại nhân cả 2 vế cho (x-1)?                  │
│   Em thử làm nhưng kết quả sai ạ. [ảnh bài làm]"       │
│  3 HS khác cũng có câu hỏi tương tự ↑                  │
├─────────────────────────────────────────────────────────┤
│  📎 Bình luận của GV: [Đang soạn...]                    │
│  [Rich text editor | LaTeX | Ảnh | Attach file]         │
│  [Hủy]          [Đăng trả lời] [Đăng & Đánh dấu đã giải đáp]│
├─────────────────────────────────────────────────────────┤
│  💬 Lê Văn Cường (HS): Em cũng không hiểu bước này ạ  │
│  20 phút trước | [❤️ Like] [Trả lời] [...]              │
└─────────────────────────────────────────────────────────┘
```

### Màn hình tạo chủ đề
```
┌─────────────────────────────────────────────────────────┐
│  + Tạo chủ đề thảo luận mới                            │
│  ─────────────────────────────────────────────────────  │
│  Tiêu đề: [_________________________________]           │
│  Nội dung: [Rich text editor — LaTeX | Ảnh | Video]    │
│  ─────────────────────────────────────────────────────  │
│  Gắn với bài học: [Chọn bài học ▼]                     │
│  Loại: ⬤ Thảo luận mở  ○ Q&A  ○ Bình chọn             │
│  Thời hạn: ○ Không giới hạn  ⬤ Đóng ngày [30/3/2026]  │
│  Điểm tham gia: [0.5] điểm TX (tối đa X bình luận/HS)  │
│  Ẩn danh: ○ Có  ⬤ Không                                │
│  ─────────────────────────────────────────────────────  │
│  [Lưu nháp]                          [Đăng ngay]       │
└─────────────────────────────────────────────────────────┘
```

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Tạo chủ đề | Bấm "+ Chủ đề" | Form tạo chủ đề |
| Trả lời câu hỏi | Bấm "Trả lời" trong thread | Ô soạn nội dung inline |
| Đánh dấu đã giải đáp | Bấm "Đã giải đáp ✓" | Thread chuyển màu xanh, ra khỏi danh sách chờ |
| Ghim bình luận | Bấm "Ghim 📌" | Bình luận lên đầu thread |
| Like bình luận | Bấm "❤️" | Khuyến khích HS, cộng điểm tham gia |
| Ẩn bình luận | Bấm "..." → Ẩn | Bình luận ẩn khỏi HS khác, HS tác giả vẫn thấy |
| Thêm vào FAQ | Bấm "Thêm vào FAQ" | Q&A xuất hiện trong section FAQ lớp |
| Tính điểm thảo luận | Bấm "Tính điểm tham gia" | Hệ thống đề xuất điểm dựa trên hoạt động |
| Đóng chủ đề | Bấm "Đóng" | HS không thể đăng bình luận mới |

---

## Gom nhóm tính năng thông minh

**Smart Grouping — Câu hỏi theo bài học**: Tự động nhóm câu hỏi theo bài học liên quan. Khi HS vào bài học, thấy ngay tab "Câu hỏi về bài này (3)" — không phải tìm trong toàn bộ diễn đàn.

**Notification Digest**: GV không nhận từng notification riêng lẻ mà nhận bản tóm tắt: "5 câu hỏi mới trong 3 giờ qua" — mở ra xem tất cả trong 1 panel.

**Upvote system**: HS có thể upvote câu hỏi của bạn ("+1 tôi cũng thắc mắc điều này"). GV thấy câu hỏi nào nhiều upvote nhất → ưu tiên trả lời trước (giải quyết thắc mắc của nhiều HS nhất).

**Gợi ý FAQ realtime**: Khi HS đang gõ câu hỏi, sidebar hiện "Câu hỏi tương tự đã có câu trả lời → xem ngay." Giảm tải Q&A trùng lặp.

---

## Edge Cases & Validation

- **Nội dung vi phạm (spam, tục tĩu, bắt nạt)**: Hệ thống AI scan keyword cơ bản, flag tự động để GV review. GV ẩn ngay lập tức.
- **HS đăng bài tập nhờ giải hộ (không phải hỏi bài)**: GV có thể comment hướng dẫn thay vì giải thẳng, hoặc chuyển thread sang private.
- **GV chưa trả lời trong > 48h**: Hệ thống nhắc GV "5 câu hỏi chưa được trả lời trong 48h". Nếu > 72h → GVCN hoặc tổ trưởng nhận cảnh báo.
- **HS tự trả lời cho nhau (peer learning)**: Bài trả lời của HS được tag "Trả lời từ HS" — GV có thể verify và đánh dấu "Chính xác ✓" hoặc bổ sung.
- **Thread quá dài (> 100 bình luận)**: Pagination, hiển thị 20 bình luận/trang, ưu tiên hiện: bình luận GV + bình luận được ghim.
- **HS xóa câu hỏi sau khi GV đã trả lời**: Câu hỏi bị xóa nhưng câu trả lời của GV vẫn lưu trong hệ thống (ẩn với HS, GV xem được trong log).
- **Thảo luận trong kỳ thi**: Tắt tab thảo luận tự động trong thời gian diễn ra kỳ thi của lớp đó.
- **Lớp học offline (không có E-learning)**: Module thảo luận không xuất hiện, không applicable.

---

## Tích hợp

- **Module E-learning**: Thảo luận gắn với bài học cụ thể trong khóa học, hiển thị inline trong trang bài học.
- **Module Kết quả học tập**: Điểm tham gia thảo luận được tính vào điểm TX nếu GV cài đặt.
- **Module Thông báo**: Push notification cho GV khi có câu hỏi mới chưa trả lời; cho HS khi GV trả lời.
- **Module QL Đào tạo**: Lấy danh sách HS theo lớp, quyền GV theo lớp phụ trách.
- **AI Content Moderation**: Quét nội dung tự động để phát hiện vi phạm.
- **Module Bài tập**: Link từ thread thảo luận đến bài tập liên quan và ngược lại.
