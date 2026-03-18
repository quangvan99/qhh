# Điểm Danh / Chấm Công — Role: Học sinh

## Mục tiêu
Cho phép học sinh xem lịch sử điểm danh vào/ra trường hàng ngày, kiểm tra trạng thái điểm danh hôm nay, và theo dõi tổng số buổi vắng mặt — giúp học sinh chủ động nắm được tình hình chuyên cần của mình.

## User Story
"Là học sinh, tôi muốn xem được mình đã vào/ra trường lúc mấy giờ và có bao nhiêu buổi vắng trong tháng để tôi tự kiểm soát chuyên cần và biết sớm nếu có sai sót cần liên hệ nhà trường."

---

## User Flow Chính

### Flow 1: Kiểm tra điểm danh hôm nay
**Mô tả**: Học sinh muốn kiểm tra xem hệ thống đã ghi nhận mình vào trường hôm nay chưa.
**Trigger**: Nhấn tab "Điểm danh" trong bottom nav hoặc nhấn vào card "Điểm danh hôm nay" trên Home feed.
**Steps**:
1. Màn hình Điểm danh hiển thị ngay trạng thái hôm nay ở vùng nổi bật nhất đầu màn hình.
2. Hiển thị: "Hôm nay — Thứ Ba, 17/03/2026"
3. Trạng thái vào trường: "✅ Vào lúc 07:12" hoặc "❌ Chưa ghi nhận"
4. Trạng thái ra trường: "✅ Ra lúc 17:05" hoặc "⏳ Chưa ra (đang trong trường)"
5. Nếu có bất thường (vào muộn / về sớm): hiển thị badge cảnh báo màu cam.
**Expected Result**: Học sinh biết ngay trong <3 giây trạng thái điểm danh hôm nay của mình.

### Flow 2: Xem lịch sử điểm danh theo tuần/tháng
**Mô tả**: Học sinh muốn xem lại lịch sử vào/ra trường trong tháng này.
**Trigger**: Scroll xuống từ màn hình Điểm danh hoặc nhấn "Xem lịch sử".
**Steps**:
1. Hiển thị calendar view tháng hiện tại: mỗi ngày đi học là một ô nhỏ có màu.
2. Màu xanh = đúng giờ, vàng = vào muộn/về sớm, đỏ = vắng, xám = ngày nghỉ/lễ.
3. HS nhấn vào một ngày cụ thể → xem chi tiết: giờ vào, giờ ra, ghi chú (nếu có).
4. Chuyển tháng: swipe trái/phải hoặc nhấn mũi tên.
5. Tổng kết cuối tháng: "Tháng 3: Đi học 20/22 ngày | Vắng có phép: 1 | Vắng không phép: 1 | Vào muộn: 2"
**Expected Result**: Học sinh có cái nhìn tổng quan rõ ràng về tình hình chuyên cần cả tháng.

### Flow 3: Xem tổng kết điểm danh học kỳ
**Mô tả**: Học sinh muốn biết tổng số buổi vắng từ đầu học kỳ để tránh vượt ngưỡng.
**Trigger**: Nhấn tab "Tổng kết" hoặc nhấn vào thống kê trên màn hình chính Điểm danh.
**Steps**:
1. Hiển thị thống kê học kỳ: tổng số ngày học, số ngày có mặt, vắng có phép, vắng không phép, số lần vào muộn/về sớm.
2. Thanh progress: "X/Y ngày đã đi học (Z%)"
3. Cảnh báo nếu gần vượt ngưỡng cho phép: "⚠️ Bạn đã vắng 3/5 buổi tối đa không phép. Còn 2 buổi nữa!"
4. Gợi ý: "Theo quy định, vắng quá 45% số tiết một môn sẽ không được dự thi."
**Expected Result**: HS chủ động kiểm soát, không bị bất ngờ khi nhận quyết định không được thi.

### Flow 4: Báo cáo sai sót điểm danh
**Mô tả**: Học sinh phát hiện hệ thống ghi sai (ví dụ: có đi học nhưng bị ghi vắng do thiết bị lỗi).
**Trigger**: Nhấn vào ngày bị ghi sai → nhấn "Báo cáo sai sót".
**Steps**:
1. Form báo sai sót: chọn ngày, mô tả vấn đề, đính kèm bằng chứng (ảnh, lý do).
2. HS điền và gửi → thông báo "Đã gửi yêu cầu xem xét đến giáo viên chủ nhiệm".
3. GVCN xem xét và cập nhật → HS nhận thông báo kết quả.
**Expected Result**: HS có kênh phản ánh chính thức, không cần đến văn phòng xin sửa điểm danh.

---

## Tính năng & Màn hình

### Màn hình chính — Điểm danh hôm nay
- **Layout**: Header: trạng thái hôm nay (card lớn, chiếm ~40% màn hình). Bên dưới: mini calendar + nhanh thống kê tháng.
- **Components**:
  - `TodayStatusCard` — Card nổi bật: trạng thái vào/ra + giờ cụ thể
  - `MonthCalendar` — Lịch tháng dạng grid (compact, 7 cột)
  - `MonthSummary` — Tóm tắt nhanh tháng hiện tại
  - `AlertBanner` — Cảnh báo nếu gần vượt ngưỡng vắng
  - `ReportButton` — Nút "Báo sai sót" nhỏ dưới card hôm nay

- **TodayStatusCard** chi tiết:
  - Ngày, thứ, tháng
  - Row 1: 🏫 Vào trường — [Giờ] hoặc "Chưa ghi nhận"
  - Row 2: 🚪 Ra trường — [Giờ] hoặc "Chưa ra" / "Chưa ghi nhận"
  - Icon trạng thái tổng: ✅ Đầy đủ | ⚠️ Bất thường | ❌ Vắng mặt
  - Nếu vào muộn: badge cam "Muộn 12 phút"
  - Nếu về sớm: badge cam "Về sớm 30 phút"

### Calendar View (Lịch tháng)
- Grid 7 cột (T2–CN), ô vuông nhỏ mỗi ngày
- **Màu ô theo trạng thái**:
  - 🟢 Xanh lá: Đúng giờ cả vào lẫn ra
  - 🟡 Vàng: Vào muộn hoặc về sớm
  - 🔴 Đỏ: Vắng không phép
  - 🟠 Cam: Vắng có phép (nghỉ phép đã được duyệt)
  - ⚪ Xám: Ngày không có lịch học (thứ 7 CN, nghỉ lễ)
  - 🔵 Xanh dương: Hôm nay (highlight)
- Nhấn vào ô → popup chi tiết ngày đó

### Popup Chi tiết ngày
- Tiêu đề: Ngày [DD/MM/YYYY] — [Thứ]
- Vào trường: [Giờ:Phút]
- Ra trường: [Giờ:Phút]
- Ghi chú: "Vào muộn 15 phút" / "Nghỉ có phép — GV xác nhận" / "Vắng không phép"
- Nút "Báo sai sót" nếu thông tin không đúng

### Màn hình Tổng kết học kỳ
- **Layout**: Stats cards ở trên, bar chart bên dưới, cảnh báo nổi bật.
- **Components**:
  - `AttendanceRingChart` — Donut chart % chuyên cần
  - `StatCards` — 4 ô: Có mặt / Vắng có phép / Vắng không phép / Đi muộn/về sớm
  - `WarningCard` — Cảnh báo màu đỏ/cam nếu gần vi phạm quy định
  - `MonthlyTrend` — Bar chart số buổi vắng theo từng tháng
  - `RegulationInfo` — Thông tin quy định nhà trường (collapsible)

### Màn hình Báo sai sót
- **Components**:
  - `DateDisplay` — Ngày cần sửa (readonly)
  - `IssueType` — Radio buttons: Ghi thiếu giờ vào / Ghi thiếu giờ ra / Ghi sai ngày / Khác
  - `DescriptionInput` — Mô tả ngắn tình huống
  - `EvidenceUpload` — Đính kèm ảnh (tùy chọn)
  - `SubmitButton` — Gửi yêu cầu
  - `StatusTracker` — Theo dõi trạng thái yêu cầu (Đã gửi / Đang xem xét / Đã xử lý)

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Xem hôm nay | Mở màn hình Điểm danh | Hiển thị trạng thái ngay |
| Xem ngày cụ thể | Tap ô trên calendar | Popup chi tiết ngày |
| Chuyển tháng | Swipe calendar / Tap mũi tên | Cập nhật lịch tháng |
| Xem tổng kết HK | Tap tab "Tổng kết" | Dashboard thống kê |
| Báo sai sót | Tap "Báo sai sót" | Form báo cáo |
| Theo dõi yêu cầu | Tap "Xem yêu cầu của tôi" | Danh sách yêu cầu + trạng thái |
| Xem quy định | Tap "Quy định điểm danh" | Expand thông tin quy định |

---

## Gom nhóm tính năng thông minh

**Tại sao thiết kế "hôm nay nổi bật + lịch tháng + tổng kết" theo thứ tự đó?**
- HS quan tâm nhất đến "hôm nay tôi có bị ghi vắng không?" — câu hỏi có tính real-time, nên đặt ngay đầu màn hình.
- Lịch tháng (calendar) cung cấp cái nhìn pattern — HS thấy ngay "tuần này mình có vẻ đi học đều" hay "tháng này vắng nhiều quá".
- Tổng kết học kỳ + cảnh báo ngưỡng là thông tin "cần biết" quan trọng nhưng không cần xem hàng ngày — đặt ở tab riêng, không làm rối màn hình chính.
- Tính năng "Báo sai sót" quan trọng: thiếu nó, HS không có cách phản ánh khi hệ thống lỗi → mất lòng tin vào hệ thống.

---

## UX Notes
- **Màu sắc**:
  - Xanh lá `#43A047`: Đúng giờ, đầy đủ — an tâm
  - Vàng `#FDD835`: Bất thường nhỏ (muộn/sớm) — chú ý
  - Cam `#FB8C00`: Nghỉ có phép — bình thường nhưng cần theo dõi
  - Đỏ `#E53935`: Vắng không phép — cảnh báo
  - Xám nhạt: Ngày nghỉ, không có học
- **Animation**:
  - Card hôm nay: giờ điểm danh "type in" khi load (hiệu ứng số đếm lên)
  - Calendar: fade in từng ô khi scroll đến
  - Donut chart: animate từ 0% đến % thực tế
  - Cảnh báo vượt ngưỡng: badge nhấp nháy nhẹ (pulse animation)
- **Push notification**:
  - Sáng 7:00: "🏫 Nhớ điểm danh vào trường nhé!" (có thể tắt)
  - Khi phát hiện vào muộn: "⚠️ Hệ thống ghi nhận bạn vào lúc 7:35 (muộn 5 phút)"
  - Khi sắp vượt ngưỡng: "⚠️ Bạn đã vắng 4 buổi không phép. Còn 1 buổi nữa là vi phạm quy định!"
- **Privacy**: Chỉ HS và phụ huynh (nếu có app phụ huynh) mới xem được lịch sử điểm danh của HS đó.
- **Empty states**:
  - Chưa có dữ liệu hôm nay (buổi sáng chưa vào trường): "Bạn chưa vào trường hôm nay. Điểm danh sẽ tự động ghi nhận khi bạn đến."
  - Ngày nghỉ: "Hôm nay là [Thứ 7/Chủ nhật/Nghỉ lễ] — Không có lịch học."
  - Tháng chưa có dữ liệu: "Chưa có dữ liệu điểm danh cho tháng này."

---

## Edge Cases
- **Thiết bị điểm danh bị lỗi cả ngày**: Tất cả HS trong ngày đó sẽ hiển thị "Không có dữ liệu — Thiết bị bảo trì". Admin xử lý hàng loạt thay vì HS phải báo từng người.
- **HS điểm danh nhiều lần** (ra vào nhiều lần trong ngày, ví dụ đi học thêm giờ trưa): Hiển thị đầy đủ từng lần scan (07:12 vào / 12:30 ra / 13:45 vào / 17:05 ra).
- **Giờ hệ thống sai lệch** (timezone): Đồng bộ timestamp với server, không dùng giờ thiết bị client.
- **HS chuyển lớp giữa năm**: Lịch sử điểm danh trước và sau khi chuyển lớp đều được lưu, phân biệt bằng label [Lớp 11A2] / [Lớp 11A3].
- **Ngày nghỉ đột xuất** (trường thông báo bất ngờ): Admin cập nhật ngày nghỉ → calendar tự động tô xám ngày đó + không tính vắng.
- **HS vắng vì lý do của nhà trường** (tham gia thi Olympic, tập văn nghệ): Admin/GV đánh dấu "Vắng có phép — hoạt động nhà trường" — không ảnh hưởng chuyên cần.
- **Dữ liệu điểm danh bị mất hoặc duplicate**: Hiển thị cờ "Dữ liệu đang được xác minh" thay vì hiển thị thông tin sai.
- **HS chụp màn hình để gian lận** (báo đã vào trường): QR code điểm danh (nếu dùng) refresh mỗi phút, không thể dùng ảnh cũ.
