# Kết Quả Học Tập — Role: Giáo viên

## Mục tiêu
Cung cấp cho giáo viên bảng tổng hợp kết quả học tập đa chiều của từng học sinh và toàn lớp — điểm số, tiến độ, chuyên cần, hoạt động online — để giáo viên can thiệp sớm với HS yếu, ghi nhận HS xuất sắc và xuất báo cáo phục vụ họp giáo viên, gặp phụ huynh, báo cáo BGH.

## Người dùng
- **Giáo viên bộ môn**: Xem và xuất kết quả môn học mình dạy, phân tích điểm từng bài/kỳ thi.
- **Giáo viên chủ nhiệm**: Xem kết quả tổng hợp tất cả môn của từng HS trong lớp chủ nhiệm, xuất học bạ điện tử cuối kỳ, gửi kết quả cho phụ huynh.

---

## User Flow Chính

### Flow 1: Xem bảng điểm lớp theo môn
**Mô tả**: GV xem bảng điểm đầy đủ tất cả HS trong lớp cho môn mình dạy.
**Trigger**: GV vào module Kết quả → chọn Lớp → chọn Môn học.
**Steps**:
1. Hệ thống hiển thị bảng điểm tổng hợp:
   - Cột: STT, Họ tên, Điểm TX (bình quân), Điểm GK, Điểm CK, Điểm TB, Xếp loại.
   - Hàng: từng HS.
2. Bấm vào tên HS → mở panel bên phải: chi tiết từng đầu điểm.
3. Bấm vào cột "Điểm TX" → xem từng bài kiểm tra thường xuyên đã tính vào.
4. GV thấy ô điểm nào đang "chờ nhập" (chưa có điểm) → bấm vào ô đó để nhập/sửa điểm trực tiếp.
5. Hệ thống tự tính lại Điểm TB và Xếp loại sau mỗi lần thay đổi.
**Expected Result**: GV nhìn tổng quan điểm cả lớp, phát hiện ngay HS nào đang thiếu điểm hoặc có nguy cơ trượt.

---

### Flow 2: Nhập điểm thủ công (điểm miệng, điểm kiểm tra giấy)
**Mô tả**: GV nhập điểm kiểm tra miệng hoặc điểm bài thi giấy vào hệ thống.
**Trigger**: GV vào tab "Nhập điểm" hoặc bấm vào ô điểm trống trong bảng.
**Steps**:
1. GV chọn "Thêm cột điểm mới" → điền: Tên cột (VD: KT Miệng 1), Loại (TX/GK/CK), Hệ số, Ngày kiểm tra.
2. Bảng điểm xuất hiện cột mới, tất cả ô màu xám (chưa có điểm).
3. GV bấm ô của HS đầu tiên → nhập điểm → Tab → tự chuyển ô tiếp theo (theo thứ tự sổ điểm).
4. Hỗ trợ paste từ Excel: GV copy cột điểm từ Excel → paste vào hệ thống.
5. Nhập xong → bấm "Lưu" → hệ thống xác nhận, tính lại điểm TB.
6. GV có thể "Xuất mẫu Excel" → điền offline → upload lên hệ thống.
**Expected Result**: Nhập điểm cả lớp 35 HS trong < 5 phút với phím Tab navigation.

---

### Flow 3: Theo dõi tiến độ học online từng HS
**Mô tả**: GV xem HS nào đang học tốt, HS nào bỏ bê khóa học online.
**Trigger**: GV vào tab "Tiến độ học tập" của lớp/môn.
**Steps**:
1. Màn hình hiển thị bảng: HS × Bài học, cell = % hoàn thành.
2. Màu cell: 🟢 > 80% | 🟡 40-80% | 🔴 < 40% | ⬜ Chưa học.
3. Cột cuối: % hoàn thành tổng thể khóa học, sắp xếp tăng dần (HS yếu ở trên).
4. Bấm vào cell của HS cụ thể → xem: Lần học gần nhất, Thời gian học tích lũy, Lần xem video, Điểm SCORM.
5. Bấm vào tên HS → panel chi tiết: timeline học tập theo từng ngày (có học/không học).
6. GV phát hiện HS không học online → gửi nhắc nhở 1-click.
**Expected Result**: GV phát hiện HS không học online trước khi điểm thi thể hiện vấn đề.

---

### Flow 4: Xuất báo cáo kết quả
**Mô tả**: GV xuất báo cáo điểm để dùng trong họp hội đồng hoặc gửi phụ huynh.
**Trigger**: GV bấm "Xuất báo cáo" ở góc trên màn hình kết quả.
**Steps**:
1. Modal xuất báo cáo mở ra:
   - **Loại báo cáo**: Bảng điểm đơn môn / Tổng hợp tất cả môn (GVCN) / Học bạ điện tử / Phân tích lớp.
   - **Kỳ học**: HK1 / HK2 / Cả năm.
   - **Lớp**: Chọn lớp (nếu dạy nhiều lớp).
   - **Định dạng**: Excel / PDF / Word.
2. GV preview trước khi xuất.
3. Bấm "Xuất" → tải file về máy.
4. Tùy chọn: "Gửi trực tiếp cho phụ huynh qua hệ thống" → GVCN gửi tự động tới app/email PH.
**Expected Result**: Báo cáo chất lượng, đúng format trường, không cần làm thủ công Excel.

---

### Flow 5: Phân tích và so sánh kết quả lớp
**Mô tả**: GVCN hoặc GV bộ môn xem phân tích sâu: so sánh lớp này vs lớp khác, kỳ này vs kỳ trước.
**Trigger**: GV vào tab "Phân tích" trong module Kết quả.
**Steps**:
1. Chọn chiều phân tích:
   - Theo lớp: So sánh điểm TB các lớp cùng khối (ẩn danh lớp khác, chỉ thấy "Lớp khác 1, 2...").
   - Theo thời gian: So sánh điểm TB môn Toán HK1 vs HK2.
   - Theo HS: Trend điểm của 1 HS qua các bài kiểm tra.
2. Biểu đồ đường, cột, box plot hiển thị trực quan.
3. Hệ thống highlight insights tự động: "Điểm TB lớp tăng 0.8 so với HK1", "3 HS cải thiện nhiều nhất".
4. GV xuất slide phân tích để trình bày trong họp hội đồng giáo viên.
**Expected Result**: GV có dữ liệu khách quan để đánh giá hiệu quả giảng dạy và đề xuất điều chỉnh phương pháp.

---

## Tính năng & Màn hình

### Màn hình 1: Bảng điểm tổng hợp
```
┌─────────────────────────────────────────────────────────┐
│  📊 Kết quả — Toán 11 — Lớp 11A2 — HK2/2025-2026       │
│  [Điểm số] [Tiến độ online] [Phân tích] [Xuất báo cáo]  │
├────┬──────────────┬──────┬──────┬──────┬──────┬─────────┤
│ STT│ Họ tên       │ TX(x2│ GK(x3│ CK(x5│ TB   │ Xếp loại│
├────┼──────────────┼──────┼──────┼──────┼──────┼─────────┤
│ 1  │ Nguyễn V.An  │ 8.5  │ 7.0  │ 8.0  │ 7.9  │ Khá     │
│ 2  │ Trần T.Bình  │ 6.0  │ 5.5  │ 🔴-- │ --   │ Thiếu đ.│
│ 3  │ Lê V.Cường   │ 9.0  │ 8.5  │ 9.2  │ 9.0  │ Giỏi    │
│ ...│ ...          │ ...  │ ...  │ ...  │ ...  │ ...     │
├────┴──────────────┴──────┴──────┴──────┴──────┴─────────┤
│ Thống kê lớp: TB 7.1 | Max 9.8 | Min 3.5 | Giỏi 8 HS  │
│ [+ Thêm cột điểm] [Nhập từ Excel] [Lưu tất cả]         │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 2: Tiến độ học online
```
┌─────────────────────────────────────────────────────────┐
│  📈 Tiến độ khóa học — Toán 11 — 11A2                   │
│  Tổng: 24 bài | Trung bình lớp: 68% hoàn thành         │
├──────────────┬────┬────┬────┬────┬────┬──────┬──────────┤
│ Họ tên       │ B1 │ B2 │ B3 │ B4 │ B5 │ ... │ Tổng %  │
├──────────────┼────┼────┼────┼────┼────┼─────┼──────────┤
│ Trần T.Bình  │🔴15│🔴0 │⬜  │⬜  │⬜  │ ... │ 🔴 6%   │
│ Phạm V.Dũng  │🟡60│🟢90│🟡55│⬜  │⬜  │ ... │ 🟡 41%  │
│ Nguyễn V.An  │🟢95│🟢88│🟢92│🟢80│🟢75│ ... │ 🟢 86%  │
├──────────────┴────┴────┴────┴────┴────┴─────┴──────────┤
│ [Nhắc HS chưa học] [Xem chi tiết HS] [Xuất báo cáo]    │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 3: Panel chi tiết HS (slide-in)
```
┌──────────────────────────────────────────┐
│  📋 Nguyễn Văn An — 11A2                 │
│  [Điểm số] [Tiến độ] [Chuyên cần]       │
├──────────────────────────────────────────┤
│  ĐIỂM MÔN TOÁN — HK2                     │
│  KT miệng 1:  8.0 (12/01)               │
│  KT 15' #1:   7.5 (22/01)               │
│  KT 15' #2:   9.0 (05/02)               │
│  KT 1 tiết:   8.0 (20/02)               │
│  GK:          7.0 (01/03)               │
│  CK:          chưa thi                  │
│  ─────────────────────────────────────  │
│  Điểm TX bình quân: 8.1                 │
│  Điểm TB (dự kiến): 7.7                 │
│  ─────────────────────────────────────  │
│  Online: 86% | Thời gian học: 14h 20p   │
│  Chuyên cần: 98% (1 buổi vắng có phép) │
│  ─────────────────────────────────────  │
│  [Nhắn tin HS] [Ghi chú GV] [Báo PH]   │
└──────────────────────────────────────────┘
```

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Nhập điểm inline | Bấm ô điểm trống | Ô chuyển sang input mode, Tab để qua ô tiếp |
| Thêm cột điểm | Bấm "+ Thêm cột điểm" | Modal tạo đầu điểm mới |
| Nhập từ Excel | Bấm "Nhập từ Excel" | Upload file, map cột, preview trước import |
| Xem chi tiết HS | Bấm tên HS | Panel chi tiết slide-in |
| Nhắc HS chưa học | Bấm "Nhắc" cạnh HS online thấp | Push notification tới HS |
| Xuất bảng điểm | Bấm "Xuất báo cáo" | Modal chọn format và phạm vi |
| Gửi kết quả PH | Bấm "Gửi cho phụ huynh" (GVCN) | Tự động gửi qua app/email PH |
| So sánh kỳ | Bấm tab "Phân tích" → chọn chiều | Biểu đồ so sánh |

---

## Gom nhóm tính năng thông minh

**Early Warning System (Cảnh báo sớm)**:
- HS có Điểm TB dự kiến < 5.0: 🔴 "Nguy cơ không đạt" — GV nhận alert cuối mỗi tuần.
- HS giảm điểm > 2 bậc so với kỳ trước: 🟡 "Đang sụt giảm" — gợi ý GV liên hệ tư vấn.
- HS đang cải thiện mạnh: 🟢 "Tiến bộ đáng khen" — gợi ý GV ghi nhận động viên.

**Tính điểm tự động theo quy chế**: Hệ thống biết công thức tính điểm TB theo quy chế bộ giáo dục (TX × 1 + GK × 2 + CK × 3) / (1+2+3) — GV không phải nhớ công thức, không phải Excel.

**Bulk operations**: Chọn nhiều HS → "Gửi thông báo", "Xuất học bạ", "Tag nhóm học yếu".

---

## Edge Cases & Validation

- **Điểm nhập ngoài thang (VD: 11/10)**: Từ chối, highlight đỏ "Điểm tối đa là 10."
- **Nhập điểm HS đã chuyển lớp**: Cảnh báo "HS này đã chuyển sang lớp 11B3 ngày 01/02. Điểm sẽ được gán vào hồ sơ tại lớp 11B3."
- **Cột điểm CK chưa có — tính điểm TB ước tính**: Hiển thị "TB dự kiến (chưa có CK)" với màu khác, tooltip giải thích.
- **GV nhập nhầm điểm, muốn sửa sau khi lưu**: Cho phép sửa bất kỳ lúc nào trong kỳ học. Sau khi kỳ học kết thúc (lock) cần xin phép BGH.
- **Import Excel bị lỗi cột**: Hiển thị chi tiết từng dòng lỗi, cho phép import dòng đúng, bỏ qua dòng lỗi.
- **Hai GV cùng nhập điểm 1 HS cùng lúc**: Optimistic locking — ai lưu sau thấy conflict, hỏi "Dữ liệu đã thay đổi bởi người khác. Giữ giá trị của bạn hay dùng giá trị mới?"
- **Lớp có > 50 HS (lớp học ghép)**: Pagination bảng điểm, vẫn hỗ trợ paste Excel toàn bộ.
- **GVCN xem tất cả môn nhưng GV bộ môn chưa nhập đủ điểm**: Hiển thị "--" cho ô thiếu, không hiện điểm TB ảo.

---

## Tích hợp

- **Module QL Đào tạo**: Quy chế tính điểm, danh sách HS, học kỳ, trọng số điểm từng loại.
- **Module E-learning**: Dữ liệu tiến độ học online (% hoàn thành bài học, thời gian online).
- **Module Bài tập**: Điểm bài tập tự động đổ vào cột điểm TX.
- **Module Tổ chức Thi**: Điểm bài thi đổ vào cột GK/CK tương ứng.
- **Module Điểm danh**: Dữ liệu chuyên cần hiển thị trong panel chi tiết HS.
- **Module QL Đào tạo — Học bạ điện tử**: Cuối kỳ, điểm tổng hợp được ghi vào học bạ điện tử chính thức.
- **Module Thông báo**: Gửi kết quả tới phụ huynh, nhắc HS học online.
- **Report Engine**: Sinh PDF báo cáo lớp, học bạ theo đúng mẫu của trường Quốc Học.
