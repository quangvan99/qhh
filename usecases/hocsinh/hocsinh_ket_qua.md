# Kết Quả Học Tập — Role: Học sinh

## Mục tiêu
Cung cấp cho học sinh cái nhìn tổng quan rõ ràng về điểm số từng môn, tiến độ học tập tổng thể, và học bạ điện tử — giúp học sinh tự đánh giá được mình đang ở đâu trong quá trình học mà không cần hỏi giáo viên.

## User Story
"Là học sinh, tôi muốn xem điểm số và tiến độ học tập của mình một cách trực quan để tôi biết mình đang học tốt môn nào, yếu môn nào, và cần cố gắng thêm ở đâu."

---

## User Flow Chính

### Flow 1: Xem điểm tổng kết tất cả môn học
**Mô tả**: Học sinh vào trang kết quả để có cái nhìn tổng quan về điểm tất cả các môn.
**Trigger**: Nhấn tab "Kết quả" hoặc nhấn vào điểm gần đây trên Home feed.
**Steps**:
1. Màn hình Kết quả hiển thị bảng điểm tổng quan: mỗi môn học là một row.
2. Mỗi row: tên môn, điểm trung bình hiện tại, thanh progress, trạng thái (Đạt/Cần cố gắng).
3. Sắp xếp mặc định: môn điểm thấp nhất lên đầu (ưu tiên cảnh báo).
4. Học sinh nhấn vào một môn → xem chi tiết điểm từng bài kiểm tra, bài tập của môn đó.
5. Có thể lọc theo học kỳ (HK1 / HK2 / Cả năm).
**Expected Result**: Học sinh thấy ngay mình đang đứng ở đâu trong từng môn trong <5 giây.

### Flow 2: Xem chi tiết điểm một môn cụ thể
**Mô tả**: Học sinh muốn biết điểm từng bài kiểm tra, bài tập trong một môn.
**Trigger**: Nhấn vào row môn học trong bảng tổng quan.
**Steps**:
1. Mở màn hình Chi tiết điểm môn [Tên môn].
2. Header: điểm TB hiện tại, biểu đồ xu hướng (trend line điểm qua các bài).
3. Danh sách điểm thành phần theo loại: Bài tập (hệ số 1) / Kiểm tra 15' (hệ số 1) / Kiểm tra 1 tiết (hệ số 2) / Thi HK (hệ số 3).
4. Mỗi điểm: tên bài, điểm số, ngày, nhận xét GV (nếu có), nút xem lại bài.
5. Ô "Điểm dự kiến": tính toán gợi ý "Để đạt 8.0 cả năm, bạn cần đạt ít nhất 8.5 trong kỳ thi tới."
**Expected Result**: HS hiểu rõ cấu trúc điểm và dự đoán được điểm tổng kết.

### Flow 3: Xem học bạ điện tử
**Mô tả**: Học sinh xem học bạ tổng hợp qua các năm học.
**Trigger**: Nhấn "Học bạ" trong tab menu hoặc từ màn hình Hồ sơ.
**Steps**:
1. Màn hình Học bạ: chọn năm học (dropdown: 2023–2024 / 2024–2025 / 2025–2026).
2. Hiển thị bảng điểm đầy đủ theo năm học + học kỳ.
3. Cuối trang: xếp loại học lực, hạnh kiểm, khen thưởng.
4. Nút chia sẻ / in học bạ (export PDF).
**Expected Result**: HS có học bạ điện tử đầy đủ, không cần đến phòng giáo vụ xin bản giấy.

### Flow 4: Xem tiến độ học tập tổng quan
**Mô tả**: Học sinh xem báo cáo tiến độ học tập dạng visual (charts).
**Trigger**: Nhấn tab "Tiến độ" hoặc icon biểu đồ trong màn hình Kết quả.
**Steps**:
1. Hiển thị dashboard tiến độ với các biểu đồ.
2. Biểu đồ radar (spider chart): điểm TB các môn → thấy ngay môn mạnh/yếu.
3. Biểu đồ đường: xu hướng điểm theo thời gian (tháng).
4. Thống kê học tập: số giờ học tuần này, số bài đã nộp, tỷ lệ hoàn thành.
5. So sánh với kỳ trước (nếu có): "So với HK1: bạn đã cải thiện được Toán +0.8 điểm!"
**Expected Result**: HS nhìn thấy sự tiến bộ hoặc sụt giảm một cách trực quan, có động lực cải thiện.

---

## Tính năng & Màn hình

### Màn hình chính — Bảng điểm tổng quan
- **Layout**: Scroll dọc. Header tổng kết (GPA + xếp loại). Danh sách môn học dạng card.
- **Components**:
  - `GPACard` — Thẻ điểm trung bình chung lớn ở đầu
  - `SemesterFilter` — Dropdown chọn học kỳ
  - `SubjectScoreRow` — Hàng điểm từng môn
  - `ProgressBar` — Thanh điểm màu gradient
  - `TrendBadge` — 📈 Tăng / 📉 Giảm / ➡️ Ổn định so với kỳ trước
  - `AlertBanner` — Cảnh báo môn có nguy cơ yếu (<5.0)

- **Info trên SubjectScoreRow**:
  - Icon màu môn học
  - Tên môn học
  - Điểm TB (số to, màu theo mức độ)
  - Thanh điểm 0–10 (fill màu)
  - Badge xu hướng 📈📉
  - Nhãn: "Xuất sắc" (≥9.0) / "Giỏi" (8.0–8.9) / "Khá" (6.5–7.9) / "TB" (5.0–6.4) / "Yếu" (<5.0)

- **GPACard**:
  - Điểm TB chung to ở giữa (ví dụ: 8.2)
  - Xếp loại: Giỏi
  - Hạnh kiểm: Tốt
  - Xếp hạng trong lớp (nếu GV bật): "Vị trí 5/42 trong lớp"

### Màn hình Chi tiết điểm môn học
- **Layout**: Header gradient màu môn + điểm TB + trend chart nhỏ. Body: list điểm theo loại.
- **Components**:
  - `ScoreTrendChart` — Biểu đồ đường điểm các bài theo thời gian
  - `ScoreTypeSection` — Nhóm điểm theo loại (bài tập / KT thường xuyên / KT định kỳ / Thi HK)
  - `ScoreItem` — Từng điểm bài cụ thể
  - `PredictorCard` — "Bạn cần bao nhiêu điểm nữa để đạt..."
  - `RetakeButton` — Xem lại bài (nếu bài đó có thể xem lại)

- **ScoreItem** bao gồm:
  - Tên bài kiểm tra / bài tập
  - Điểm: X/Y (ví dụ 8/10) — hiển thị cả tử số mẫu số
  - Hệ số (H1, H2, H3)
  - Ngày chấm
  - Nhận xét GV (nếu có) — collapsible
  - Status: ✅ Đã chấm / ⏳ Đang chờ / ❌ Vắng

### Màn hình Học bạ
- **Layout**: Dạng tài liệu, có thể scroll và chia trang.
- **Components**:
  - `YearSelector` — Chọn năm học
  - `GradeReport` — Bảng điểm đầy đủ dạng table
  - `Classification` — Xếp loại học lực + hạnh kiểm
  - `Achievement` — Khen thưởng, danh hiệu
  - `ExportButton` — Xuất PDF / Chia sẻ

### Dashboard Tiến độ học tập
- **Components**:
  - `RadarChart` — Biểu đồ radar 8 môn học
  - `TrendLineChart` — Xu hướng điểm theo tuần/tháng
  - `StudyStats` — Thống kê: giờ học, bài hoàn thành, streak
  - `ImprovementCard` — "Môn cần ôn thêm" dựa trên điểm thấp nhất
  - `StreakCounter` — Chuỗi ngày học liên tiếp (🔥 5 ngày liên tiếp!)

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Xem chi tiết môn | Tap row môn | Mở màn hình điểm chi tiết môn |
| Lọc học kỳ | Tap dropdown HK | Cập nhật toàn bộ bảng điểm |
| Xem học bạ | Tap "Học bạ" | Mở màn hình học bạ điện tử |
| Export học bạ PDF | Tap "Xuất PDF" | Download / Share file PDF |
| Xem lại bài đã chấm | Tap "Xem lại" trên ScoreItem | Mở bài làm + đáp án |
| Xem tiến độ | Tap tab "Tiến độ" | Dashboard biểu đồ |
| Chia sẻ kết quả | Tap nút share | Share image/PDF điểm |

---

## Gom nhóm tính năng thông minh

**Tại sao gom "điểm + tiến độ + học bạ" vào một module Kết quả?**
- Ba thứ này đều trả lời cùng câu hỏi của HS: "Tôi đang học tốt như thế nào?" — gom vào một nơi giúp HS không phải tìm kiếm nhiều chỗ.
- Bảng điểm ưu tiên hiển thị môn điểm thấp lên đầu (thay vì alphabet) tạo hành vi "tự nhìn vào điểm yếu" một cách tự nhiên, không cần GV nhắc.
- "Điểm dự kiến" tính toán tự động giúp HS hiểu được mục tiêu cụ thể cần đạt — thay vì chỉ thụ động nhìn điểm đã có.
- Dashboard tiến độ trực quan (radar chart) giúp HS thấy bức tranh tổng thể trong 1 cái nhìn, phù hợp với tư duy visual của học sinh THPT.

---

## UX Notes
- **Màu điểm số**:
  - ≥9.0 (Xuất sắc): `#1B5E20` xanh đậm, background `#E8F5E9`
  - 8.0–8.9 (Giỏi): `#2E7D32` xanh, background `#F1F8E9`
  - 6.5–7.9 (Khá): `#1565C0` xanh dương, background `#E3F2FD`
  - 5.0–6.4 (Trung bình): `#E65100` cam, background `#FFF3E0`
  - <5.0 (Yếu): `#B71C1C` đỏ đậm, background `#FFEBEE`
- **Animation**:
  - Vào màn hình: điểm count up từ 0 lên (chỉ lần đầu trong session)
  - Radar chart: animate từ tâm ra
  - Trend line: vẽ line từ trái sang phải
  - Điểm mới cập nhật: highlight flash màu vàng rồi về màu bình thường
- **Accessibility**: Không dùng màu sắc duy nhất để phân biệt — thêm icon + text label kèm theo.
- **Empty states**:
  - Chưa có điểm nào: "GV chưa nhập điểm. Điểm sẽ hiển thị ở đây sau khi có kết quả."
  - Học kỳ chưa bắt đầu: "Học kỳ 2 chưa bắt đầu. Kết quả sẽ có sau khi kỳ học diễn ra."

---

## Edge Cases
- **GV nhập sai điểm rồi sửa**: Hiển thị lịch sử thay đổi (điểm cũ gạch chân + điểm mới), kèm thông báo "Điểm bài [X] đã được GV cập nhật lại."
- **Môn học bị xóa khỏi chương trình**: Vẫn hiển thị trong lịch sử với badge "Không còn trong chương trình".
- **Điểm đang chờ phê duyệt** (GV chấm nhưng chưa công bố): Hiển thị "⏳ Đang xử lý" — không hiển thị số điểm trước khi công bố chính thức.
- **Điểm TB âm / bất thường** (lỗi nhập liệu): Đánh dấu đỏ + ẩn khỏi GPA, hiển thị "Điểm đang được kiểm tra lại".
- **Học sinh chuyển trường giữa năm**: Lịch sử điểm vẫn lưu, có label "Đã chuyển" trên năm học đó.
- **Nhiều hơn 15 môn học**: Phân trang hoặc collapse nhóm các môn tự chọn.
- **Export PDF fail**: Retry tự động 1 lần, nếu vẫn lỗi: "Không thể xuất PDF ngay lúc này. Thử lại sau hoặc liên hệ hỗ trợ."
