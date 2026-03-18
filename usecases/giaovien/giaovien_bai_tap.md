# Quản Lý Bài Tập — Role: Giáo viên

## Mục tiêu
Cho phép giáo viên tạo bài tập linh hoạt (tự luận, trắc nghiệm, upload file, dự án nhóm), theo dõi tiến độ nộp bài theo thời gian thực, chấm điểm và trả phản hồi chi tiết ngay trên nền tảng — loại bỏ hoàn toàn việc chấm giấy tay, email đính kèm và tổng hợp điểm Excel thủ công.

## Người dùng
- **Giáo viên bộ môn**: Tạo bài tập cho lớp mình dạy, chấm và trả điểm, xem thống kê kết quả.
- **Giáo viên chủ nhiệm**: Xem tổng hợp kết quả bài tập tất cả môn của HS trong lớp (không chấm, chỉ xem).

---

## User Flow Chính

### Flow 1: Tạo bài tập mới
**Mô tả**: GV tạo một bài tập tự luận yêu cầu HS upload file Word hoặc PDF.
**Trigger**: GV vào lớp học online → tab "Bài tập" → bấm "+ Tạo bài tập".
**Steps**:
1. Nhập **Tiêu đề** bài tập.
2. Soạn **Đề bài** bằng rich text editor (hỗ trợ LaTeX, ảnh, bảng, file đính kèm đề).
3. Chọn **Loại bài tập**:
   - 📝 Tự luận (nhập text)
   - 📤 Nộp file (PDF, DOCX, ZIP, ảnh)
   - ✅ Trắc nghiệm (từ ngân hàng câu hỏi)
   - 👥 Bài tập nhóm
   - 🔗 Kết hợp (vừa trắc nghiệm vừa tự luận)
4. Cài đặt **thời hạn**: Hạn nộp (ngày giờ), cho nộp muộn không (Y/N), trừ điểm nộp muộn (X điểm/ngày).
5. Cài đặt **thang điểm**: Điểm tối đa, trọng số trong môn học.
6. Tùy chọn nâng cao:
   - Gắn với bài học (HS phải xem bài trước khi làm)
   - Cho phép làm lại (số lần, ghi nhận điểm cao nhất/lần cuối)
   - Hiển thị đáp án sau khi hạn nộp
7. Bấm **"Publish"** hoặc **"Lưu nháp"**.
**Expected Result**: Bài tập xuất hiện ngay trong lớp học của HS.

---

### Flow 2: Xem tiến độ nộp bài theo thời gian thực
**Mô tả**: GV theo dõi HS nào đã nộp, nộp muộn, chưa nộp mà không cần reload.
**Trigger**: GV vào màn hình chi tiết bài tập → tab "Bài nộp".
**Steps**:
1. Màn hình hiển thị 3 cột: **Đã nộp** | **Nộp muộn** | **Chưa nộp**.
2. Mỗi cột có số lượng và danh sách HS.
3. Số liệu cập nhật realtime (websocket) — không cần F5.
4. GV bấm "Nhắc nhở" bên cạnh danh sách "Chưa nộp" → hệ thống gửi thông báo tới HS đó.
5. "Nhắc nhở tất cả chưa nộp" → gửi bulk notification.
6. GV xem thời điểm nộp của từng HS (timeline dạng spark chart).
**Expected Result**: GV biết trạng thái nộp bài của cả lớp chỉ qua 1 màn hình, không cần điểm danh thủ công.

---

### Flow 3: Chấm điểm inline (không mở từng bài)
**Mô tả**: GV chấm điểm nhanh nhiều bài trong một màn hình danh sách.
**Trigger**: GV vào tab "Bài nộp" của bài tập → bấm "Chế độ chấm điểm nhanh".
**Steps**:
1. Màn hình chia 2 cột: **Trái** — danh sách HS đã nộp | **Phải** — nội dung bài nộp của HS đang chọn.
2. GV bấm tên HS ở cột trái → bài nộp hiện ngay ở cột phải (không mở tab mới).
3. GV đọc bài → nhập điểm vào ô số (tối đa = điểm max bài tập).
4. Nhập **nhận xét** vào ô text (hỗ trợ template nhận xét nhanh).
5. Bấm **Tab** hoặc phím tắt **Ctrl+Enter** → lưu điểm, tự động chuyển sang HS tiếp theo.
6. Ô điểm đã chấm → chuyển màu xanh. Ô chưa chấm → màu xám.
7. Thanh progress ở đầu: "Đã chấm: 15/28 bài".
**Expected Result**: GV chấm 28 bài trong ~ 20-30 phút thay vì 90 phút như chấm giấy tay.

---

### Flow 4: Chấm bài có file đính kèm (PDF/Word)
**Mô tả**: GV xem file PDF bài làm của HS và chú thích trực tiếp lên file.
**Trigger**: HS nộp bài dạng file → GV bấm vào file trong panel chấm.
**Steps**:
1. PDF viewer tích hợp mở file, hỗ trợ zoom, cuộn.
2. GV dùng công cụ **Annotate**:
   - Highlight đoạn văn
   - Gạch dưới / gạch ngang
   - Thêm comment vào từng đoạn (hiện dưới dạng sticky note màu vàng)
   - Vẽ mũi tên, khoanh tròn chỗ sai
3. Nhập điểm và nhận xét tổng thể.
4. Bấm "Trả bài" → HS nhận được file PDF có chú thích + điểm + nhận xét.
**Expected Result**: HS thấy cụ thể chỗ nào sai, tại sao sai, không cần hỏi lại GV.

---

### Flow 5: Tạo bài tập từ template / tái sử dụng
**Mô tả**: GV copy bài tập đã tạo từ kỳ trước, chỉnh sửa đề mới.
**Trigger**: GV bấm "+ Tạo bài tập" → chọn "Dùng bài cũ làm mẫu".
**Steps**:
1. Modal hiện danh sách bài tập GV đã tạo, lọc theo kỳ/lớp/loại.
2. GV chọn bài tập nguồn → preview nhanh nội dung.
3. Bấm "Dùng làm mẫu" → bài tập được clone vào lớp hiện tại.
4. GV chỉnh sửa đề, thang điểm, hạn nộp.
5. Publish.
**Expected Result**: Không phải gõ lại đề tương tự từ đầu, tiết kiệm 5-10 phút mỗi bài.

---

## Tính năng & Màn hình

### Màn hình chính — Danh sách bài tập của lớp
```
┌─────────────────────────────────────────────────────────┐
│  📝 Bài tập — 11A2 — Toán 11         [+ Tạo bài tập]   │
│  Lọc: [Tất cả] [Đang chờ chấm] [Đã đóng] [Nháp]       │
├──────────────────────────────────────────────────────────┤
│  BÀI TẬP SỐ 5 — Ứng dụng đạo hàm         🔴 Chờ chấm  │
│  Hạn: 15/03/2026 | Đã nộp: 28/35 | Đã chấm: 12/28     │
│  ████████████░░░ 43% đã chấm                            │
│  [Chấm ngay] [Xem thống kê] [Nhắc HS chưa nộp] [...]  │
├──────────────────────────────────────────────────────────┤
│  BÀI TẬP SỐ 4 — Tính tích phân          ✅ Hoàn thành  │
│  Hạn: 08/03/2026 | Đã nộp: 35/35 | Điểm TB: 7.4        │
│  [Xem kết quả] [Xuất điểm]                              │
├──────────────────────────────────────────────────────────┤
│  BÀI TẬP SỐ 6 — Hàm số mũ               📝 Nháp        │
│  Chưa publish | [Sửa] [Publish]                         │
└──────────────────────────────────────────────────────────┘
```

### Màn hình chấm điểm split-view
```
┌───────────────────────┬────────────────────────────────┐
│  DANH SÁCH NỘP BÀI    │  BÀI NỘP: Nguyễn Văn An        │
│  ─────────────────    │  ─────────────────────────────  │
│ ✅ Nguyễn Văn An  7.5 │  Nộp lúc: 14:23 ngày 15/3      │
│ ✅ Trần Thị B     8.0 │  ─────────────────────────────  │
│ 🔄 Lê Văn C   [chấm] │  [Nội dung bài làm / PDF viewer]│
│ ⬜ Phạm Thị D  [chấm] │                                 │
│ ⬜ Hoàng E     [chấm] │  ─────────────────────────────  │
│  ...                  │  ĐIỂM: [___] / 10               │
│  ─────────────────    │  NHẬN XÉT:                      │
│  Đã chấm: 12/28       │  [Làm bài tốt, tuy nhiên...   ]│
│  [Nhắc chưa nộp]     │  [Template: Tốt/Khá/Cần cải thiện]│
│                       │  [Lưu & Tiếp theo →] [Ctrl+Enter]│
└───────────────────────┴────────────────────────────────┘
```

### Form tạo bài tập — Các tab
- **Tab Đề bài**: Rich text editor, đính kèm file đề.
- **Tab Cài đặt**: Loại bài, hạn nộp, thang điểm, quy tắc nộp muộn.
- **Tab Nâng cao**: Prerequisite (xem bài trước), làm lại, nhóm, rubric chấm điểm.
- **Tab Rubric**: GV tạo bảng tiêu chí chấm điểm chi tiết (Optional).

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Tạo bài tập | Bấm "+ Tạo bài tập" | Mở form tạo bài tập |
| Publish bài | Toggle Publish / bấm "Publish" | HS thấy bài ngay trong lớp |
| Chấm nhanh | Bấm "Chấm ngay" | Mở split-view chấm điểm |
| Nhắc HS chưa nộp | Bấm "Nhắc nhở" | Gửi thông báo push tới HS chưa nộp |
| Trả bài | Bấm "Trả bài" sau khi nhập điểm | HS nhận thông báo + xem điểm/nhận xét |
| Xuất điểm | Bấm "Xuất điểm" → chọn format | Tải file Excel/CSV điểm cả lớp |
| Gia hạn | Bấm "..." → "Gia hạn" → chọn HS + ngày | HS đó có thêm thời gian nộp |
| Tắt nộp bài | Bấm "Đóng bài tập" | HS không nộp được nữa dù chưa hết hạn |
| Sao chép bài | Bấm "..." → "Sao chép" | Clone bài tập sang lớp khác |

---

## Gom nhóm tính năng thông minh

**Template nhận xét nhanh**: GV định nghĩa sẵn 5-10 nhận xét hay dùng (VD: "Trình bày tốt, cần giải thích rõ hơn bước 3.", "Thiếu đơn vị kết quả.") → khi chấm, chỉ cần click là insert vào ô nhận xét.

**Chấm theo rubric**: Thay vì nhập một con điểm, GV chọn mức đạt theo từng tiêu chí (VD: Lập luận: 3/4, Tính toán: 2/3, Trình bày: 1/3). Hệ thống tự tổng hợp điểm và sinh nhận xét tự động.

**Thống kê sau chấm**: Biểu đồ phân phối điểm, câu hỏi nào nhiều HS sai nhất, HS nào cải thiện so với bài trước.

**Auto-remind scheduler**: GV bật "Tự động nhắc" → hệ thống gửi nhắc nhở cho HS chưa nộp 1 ngày trước hạn và đúng ngày hạn.

---

## Edge Cases & Validation

- **HS nộp sau hạn**: Bài nộp gắn tag "Muộn X ngày", GV thấy rõ khi chấm. Điểm bị trừ tự động nếu GV đã cài quy tắc.
- **GV chấm rồi muốn sửa điểm**: Cho phép sửa điểm bất kỳ lúc nào trước khi "Khóa bài tập". HS nhận thông báo "Điểm của bạn đã được cập nhật."
- **File nộp bị virus/lỗi**: Quét virus khi upload, từ chối file .exe/.bat. Hiển thị lỗi rõ ràng cho HS.
- **HS nộp sai file format**: Cảnh báo ngay khi upload "Bài tập yêu cầu PDF, bạn đang nộp DOCX. Tiếp tục?"
- **Không có HS nộp bài**: Widget "Chờ chấm" không hiện bài tập này; thay vào đó hiển thị ở section "Bài tập chưa có bài nộp."
- **Bài tập nhóm — HS chưa vào nhóm**: Hệ thống cảnh báo GV danh sách HS chưa có nhóm, GV có thể assign thủ công.
- **Xóa bài tập đã có điểm**: Cảnh báo "Xóa bài này sẽ xóa X điểm trong bảng điểm. Bạn có muốn ẩn thay vì xóa?"
- **Timeout khi upload file lớn**: Hiển thị progress và không timeout trong 10 phút đầu.

---

## Tích hợp

- **Module E-learning**: Bài tập là một loại hoạt động (activity) trong khóa học, gắn vào bài học cụ thể.
- **Module Ngân hàng câu hỏi**: Import câu hỏi trắc nghiệm vào bài tập dạng quiz.
- **Module Kết quả học tập**: Điểm bài tập đổ vào bảng điểm tổng hợp của HS.
- **Module Thông báo**: Gửi thông báo tới HS khi bài được publish / trả điểm / nhắc hạn nộp.
- **Storage Service**: Lưu trữ file bài nộp của HS, file có chú thích GV.
- **Module QL Đào tạo**: Lấy danh sách HS, trọng số điểm theo quy chế trường.
