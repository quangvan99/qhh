# Tổ Chức Thi Trực Tuyến — Role: Giáo viên

## Mục tiêu
Cho phép giáo viên tạo đề thi linh hoạt (từ ngân hàng câu hỏi hoặc soạn tay), tổ chức kỳ thi trực tuyến với giám sát an toàn, và chấm bài tự luận với công cụ hỗ trợ chấm nhanh — giúp số hóa hoàn toàn quy trình thi từ ra đề đến trả điểm, giảm gian lận và minh bạch kết quả.

## Người dùng
- **Giáo viên bộ môn**: Tạo đề thi cho lớp mình dạy, cài đặt kỳ thi, giám sát trực tuyến, chấm bài tự luận, công bố kết quả.
- **Giáo viên chủ nhiệm**: Không tạo đề thi; xem tổng hợp kết quả các kỳ thi của lớp chủ nhiệm.

---

## User Flow Chính

### Flow 1: Tạo đề thi từ ngân hàng câu hỏi
**Mô tả**: GV tạo đề thi 40 câu trắc nghiệm bằng cách chọn câu từ ngân hàng theo cấu trúc.
**Trigger**: GV vào module Tổ chức Thi → bấm "+ Tạo đề thi mới".
**Steps**:
1. Nhập thông tin đề:
   - Tên kỳ thi (VD: Kiểm tra giữa kỳ 2 — Toán 11)
   - Loại: Kiểm tra thường xuyên / Giữa kỳ / Cuối kỳ / Thi thử / Khác
   - Thời gian làm bài: X phút
   - Tổng điểm: 10 (mặc định)
2. Chọn **phương thức tạo đề**:
   - **Chọn tay**: GV browse ngân hàng, tick chọn từng câu.
   - **Random theo cấu trúc**: GV định nghĩa cơ cấu đề (VD: 10 câu Nhận biết CH1, 15 câu Thông hiểu CH2-3, 10 câu Vận dụng CH1-4, 5 câu VD cao). Hệ thống random câu tự động.
   - **Soạn tay**: GV nhập trực tiếp câu hỏi mà không qua ngân hàng.
   - **Kết hợp**: Phần trắc nghiệm random, phần tự luận soạn tay.
3. GV xem preview đề thi. Nếu có câu không phù hợp → swap bằng câu khác cùng tag/mức độ.
4. Cài đặt bảo mật:
   - Thứ tự câu hỏi: Cố định / Random mỗi HS
   - Thứ tự đáp án: Cố định / Random
   - Số phiên bản đề (A, B, C... — câu giống nhau, thứ tự khác)
5. Bấm "Lưu đề thi".
**Expected Result**: Đề thi 40 câu tạo trong < 10 phút với random tự động.

---

### Flow 2: Tổ chức kỳ thi (cài đặt và mở thi)
**Mô tả**: GV cài đặt thời gian, lớp, điều kiện và mở phòng thi trực tuyến.
**Trigger**: GV chọn đề thi đã tạo → bấm "Tổ chức thi".
**Steps**:
1. **Chọn lớp thi**: Có thể chọn nhiều lớp cùng 1 đề (hoặc mỗi lớp 1 đề).
2. **Cài đặt thời gian**:
   - Ngày thi, giờ bắt đầu, giờ kết thúc.
   - Thời gian làm bài (đếm ngược cá nhân).
   - Cho phép vào phòng thi trước bao nhiêu phút.
3. **Điều kiện tham gia**:
   - Yêu cầu hoàn thành bài học trước (gắn với nội dung E-learning).
   - Giới hạn thiết bị (chỉ máy tính, không điện thoại).
4. **Giám sát**:
   - Bật AI proctoring: phát hiện chuyển tab, mặt rời camera.
   - Lockdown browser (chặn copy-paste, mở tab khác).
   - Cho phép tài liệu (mở sách/ghi chú — thi có tài liệu).
5. **Sau khi thi**:
   - Hiển thị điểm ngay / Sau khi GV duyệt.
   - Cho xem lại bài làm (Y/N) / Cho xem đáp án (Y/N).
6. Bấm "Mở phòng thi" → HS có thể vào phòng thi từ giờ đã đặt.
**Expected Result**: Phòng thi online được thiết lập đầy đủ, HS tự vào thi đúng giờ.

---

### Flow 3: Giám sát kỳ thi realtime
**Mô tả**: GV theo dõi quá trình thi đang diễn ra, xử lý sự cố.
**Trigger**: Kỳ thi bắt đầu → GV vào màn hình "Giám sát thi".
**Steps**:
1. Dashboard giám sát hiển thị:
   - Số HS đã vào phòng thi / Tổng số.
   - Số HS đang làm bài / Đã nộp / Chưa vào.
   - Danh sách HS với trạng thái: đang làm, thời gian còn lại, số câu đã trả lời.
2. Cảnh báo bất thường (màu đỏ):
   - HS chuyển tab > 3 lần → cờ vàng cảnh báo.
   - HS rời camera > 30 giây → alert GV.
   - HS không hoạt động > 5 phút.
3. GV bấm vào tên HS để xem chi tiết: ảnh webcam snapshot (nếu bật proctoring), log hoạt động.
4. GV có thể: Gửi tin nhắn riêng cho HS / Gia hạn thêm giờ / Cho thi lại (nếu sự cố kỹ thuật) / Buộc nộp bài.
5. Cuối buổi thi: GV bấm "Kết thúc thi" → tất cả bài được nộp tự động.
**Expected Result**: GV giám sát toàn bộ lớp từ 1 màn hình, phát hiện gian lận hoặc sự cố kịp thời.

---

### Flow 4: Chấm bài tự luận
**Mô tả**: Sau kỳ thi có phần tự luận, GV chấm từng bài với công cụ hỗ trợ.
**Trigger**: Kỳ thi kết thúc → GV vào tab "Chấm tự luận".
**Steps**:
1. Danh sách HS đã nộp bài, trạng thái: "Đã chấm" / "Chưa chấm" / "Tự chấm xong" (phần trắc nghiệm).
2. Điểm trắc nghiệm đã được hệ thống tính tự động. GV chỉ cần chấm phần tự luận.
3. GV bấm vào bài của HS → split-view: **Trái** = bài làm HS | **Phải** = hướng dẫn chấm + ô nhập điểm.
4. Với mỗi câu tự luận:
   - Xem bài làm của HS.
   - Tham chiếu **Hướng dẫn chấm** (hiển thị sẵn bên phải).
   - Nhập điểm theo từng bước của thang điểm (VD: Bước 1: [1]/1đ, Bước 2: [0.5]/1đ).
   - Ghi nhận xét nếu cần.
5. Bấm Tab → chuyển sang câu tiếp theo, sau đó sang HS tiếp theo.
6. Khi chấm xong tất cả → bấm "Công bố kết quả" → HS nhận thông báo điểm.
**Expected Result**: GV chấm tự luận với tham chiếu thang điểm liền tay, không cần in đề, in hướng dẫn chấm.

---

### Flow 5: Xem phân tích đề thi sau kỳ thi
**Mô tả**: GV xem thống kê hiệu quả đề thi để cải thiện cho kỳ sau.
**Trigger**: Kỳ thi kết thúc, đã có kết quả → GV vào tab "Phân tích đề thi".
**Steps**:
1. Xem **phân phối điểm**: Biểu đồ histogram điểm toàn lớp.
2. Xem **thống kê từng câu**:
   - Tỷ lệ HS chọn từng đáp án A/B/C/D.
   - Tỷ lệ đúng của câu (nếu < 20%: câu quá khó hoặc sai đáp án).
   - Thời gian làm trung bình từng câu.
3. **Câu cần review**: Hệ thống flag câu có tỷ lệ đúng < 15% (có thể sai đáp án gốc) → GV review lại.
4. GV có thể **thay đổi đáp án** câu bị sai → hệ thống tính lại điểm tự động cho toàn bộ HS.
5. Xuất báo cáo phân tích đề thi ra PDF/Excel.
**Expected Result**: GV biết câu nào quá khó/quá dễ, câu nào cần xem lại đáp án, để hoàn thiện kho câu hỏi.

---

## Tính năng & Màn hình

### Màn hình 1: Danh sách kỳ thi
```
┌─────────────────────────────────────────────────────────┐
│  📝 Kỳ thi — Lớp 11A2 — Toán 11       [+ Tạo kỳ thi]  │
│  [Tất cả] [Sắp diễn ra] [Đang thi] [Đã xong] [Nháp]   │
├─────────────────────────────────────────────────────────┤
│  🟡 KIỂM TRA GIỮA KỲ 2                  ĐANG DIỄN RA   │
│  17/03/2026 | 09:00-10:00 | 33/35 HS đã vào            │
│  [Giám sát thi →]                                       │
├─────────────────────────────────────────────────────────┤
│  🔵 KIỂM TRA 15 PHÚT — SỐ 3             SẮP DIỄN RA   │
│  20/03/2026 | 07:00 | Lớp 11A2 + 12B1                  │
│  [Sửa cài đặt] [Hủy]                                   │
├─────────────────────────────────────────────────────────┤
│  ✅ KIỂM TRA THƯỜNG XUYÊN 2              ĐÃ XONG        │
│  08/03/2026 | Điểm TB: 7.2 | 35/35 đã chấm             │
│  [Xem kết quả] [Phân tích đề] [Xuất điểm]              │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 2: Giám sát thi realtime
```
┌─────────────────────────────────────────────────────────┐
│  🎯 GIÁM SÁT THI — KT Giữa kỳ 2 — 11A2                │
│  ⏱ Còn lại: 38:24   Đã nộp: 12/35   Đang thi: 21/35   │
├──────────────────────────────────────────────────────────┤
│  [ảnh] Nguyễn A  ⏳27:12  Đã làm: 28/40  🟢 Bình thường │
│  [ảnh] Trần B    ⏳27:14  Đã làm: 15/40  ⚠️ Đổi tab 2x  │
│  [ảnh] Lê C      ✅ Đã nộp lúc 09:22                   │
│  [ảnh] Phạm D    ❌ Chưa vào phòng thi                 │
├──────────────────────────────────────────────────────────┤
│  [📢 Thông báo toàn phòng] [⏰ Gia hạn cho HS] [🔒 Kết thúc]│
└─────────────────────────────────────────────────────────┘
```

### Màn hình 3: Chấm tự luận (Split-view)
```
┌────────────────────────┬────────────────────────────────┐
│  DANH SÁCH THI         │  BÀI LÀM: Nguyễn Văn An        │
│  ─────────────────     │  ─────────────────────────────  │
│ ✅ Nguyễn V.A  8.5TN  │  Câu 1 (Tự luận — 3 điểm):     │
│ 🔄 Trần Thị B  7.0TN  │  [Nội dung bài làm của HS...]  │
│ ⬜ Lê Văn C    6.5TN  │                                 │
│  ...                   │  HƯỚNG DẪN CHẤM:               │
│  TN: đã tính tự động   │  Bước 1: lập hệ PT → 1đ        │
│  TL: chờ chấm thủ công │  Bước 2: giải hệ PT → 1đ       │
│  ─────────────────     │  Bước 3: kết luận → 1đ          │
│  Chấm: 1/35 bài TL     │                                 │
│                        │  ĐIỂM CÂU 1: B1[1] B2[0.5] B3[1]│
│                        │  → Tổng: 2.5/3                  │
│                        │  [Nhận xét] [Tiếp → Câu 2]     │
└────────────────────────┴────────────────────────────────┘
```

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Tạo đề thi | Bấm "+ Tạo kỳ thi" | Wizard tạo đề 5 bước |
| Random câu theo cấu trúc | Chọn "Random theo cơ cấu" → điền cơ cấu | Hệ thống tự chọn câu từ ngân hàng |
| Swap câu không phù hợp | Bấm "↔ Đổi câu" trong preview đề | Hệ thống chọn câu khác cùng tag/mức độ |
| Mở phòng thi | Bấm "Mở phòng thi" | HS vào được từ giờ đã cài |
| Gửi nhắc nhở HS chưa vào | Bấm "Nhắc" cạnh HS chưa vào | Push notification tới HS |
| Gia hạn cho HS | Bấm "Gia hạn" → chọn HS + thêm giờ | Đồng hồ cá nhân HS cộng thêm thời gian |
| Buộc nộp bài | Bấm "Kết thúc thi" | Tất cả bài tự động nộp |
| Chấm tự luận | Bấm tên HS → nhập điểm từng bước | Điểm được lưu, tổng hợp với điểm TN |
| Sửa đáp án sau khi thi | Phân tích đề → Sửa đáp án | Hệ thống tính lại điểm tất cả HS |
| Công bố kết quả | Bấm "Công bố kết quả" | HS nhận thông báo điểm |
| Xuất điểm | Bấm "Xuất điểm" | File Excel điểm toàn lớp |

---

## Gom nhóm tính năng thông minh

**Cơ cấu đề thông minh (Smart Blueprint)**:
GV lưu "cơ cấu đề chuẩn" cho từng loại kiểm tra (VD: KT 15': 10 câu NB, 8 TH, 2 VD). Lần sau chỉ cần chọn blueprint, hệ thống tự random câu — không phải định nghĩa lại.

**Phát hiện đề trùng câu**: Khi tạo đề mới cho lớp đã từng thi, hệ thống warn "12 câu trong đề này đã xuất hiện trong kỳ thi [ngày] — HS này đã làm rồi. Đổi câu?"

**Chấm nhanh tự luận với gợi ý AI** (tùy chọn): AI đọc bài làm của HS, gợi ý điểm và highlight các bước đúng/sai — GV xác nhận hoặc điều chỉnh, không giao AI quyết định điểm cuối.

---

## Edge Cases & Validation

- **HS mất kết nối giữa buổi thi**: Hệ thống auto-save bài làm mỗi 30 giây. HS kết nối lại → tiếp tục từ câu đang làm, đồng hồ không dừng.
- **Server lag khi nhiều HS nộp cùng lúc**: Queue nộp bài, xử lý lần lượt, không mất dữ liệu. HS thấy "Đang xử lý..." thay vì lỗi.
- **GV kết thúc thi nhầm**: Hỏi xác nhận "Còn 5 HS đang làm bài. Bạn có chắc muốn kết thúc?"
- **Câu hỏi trong đề bị xóa khỏi ngân hàng**: Đề thi lưu snapshot độc lập, không ảnh hưởng.
- **HS thi từ điện thoại (nếu chặn)**: Hiển thị thông báo "Kỳ thi này yêu cầu máy tính. Vui lòng dùng trình duyệt máy tính."
- **GV tạo đề nhưng ngân hàng không đủ câu**: Cảnh báo "Chỉ tìm được 8/10 câu Vận dụng cao cho Chương 3. Thêm câu vào ngân hàng hoặc điều chỉnh cơ cấu."
- **Phân tích phát hiện đáp án có thể sai** (tỷ lệ đúng < 10%): Alert đỏ GV — "Câu 15: Chỉ 8% HS chọn đúng — Kiểm tra lại đáp án."
- **Chấm tự luận xong nhưng muốn sửa**: Cho sửa điểm trước khi "Công bố kết quả". Sau khi công bố, cần lý do để sửa lại.

---

## Tích hợp

- **Module Ngân hàng câu hỏi**: Nguồn câu hỏi chính cho đề thi, ghi ngược kết quả thống kê câu.
- **Module E-learning**: Prerequisite — HS cần hoàn thành bài học trước khi thi.
- **Module QL Đào tạo**: Lấy danh sách HS, phòng học, lịch thi theo thời khóa biểu.
- **Module Kết quả học tập**: Điểm thi đổ vào bảng điểm tổng hợp theo quy chế trường.
- **AI Proctoring Service**: Giám sát webcam, phát hiện chuyển tab, bất thường trong buổi thi.
- **Module Thông báo**: Nhắc HS sắp thi, thông báo điểm sau thi.
- **Audit Log**: Ghi mọi thay đổi điểm thi (ai sửa, lúc nào, lý do).
