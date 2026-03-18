# Tổ Chức Kỳ Thi & Giám Sát Thi Trực Tuyến — Role: Admin

## Mục tiêu
Cung cấp công cụ để QTHT/CBQL lập kế hoạch, tổ chức, giám sát và thống kê kết quả các kỳ thi trực tuyến toàn trường — từ kỳ thi định kỳ đến thi thử đại học — đảm bảo tính nghiêm túc, minh bạch và hiệu quả của công tác thi cử.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền: tạo/xóa kỳ thi, cấu hình hệ thống thi, phân công giám thị, xem toàn bộ log thi, điều chỉnh kết quả (với lý do), cấu hình ngân hàng câu hỏi.
- **CBQL**: Tạo kỳ thi (cần QTHT phê duyệt cho kỳ thi lớn); giám sát kỳ thi đang diễn ra; xem kết quả và thống kê; phê duyệt danh sách thí sinh; không chỉnh sửa điểm sau khi thi xong.

---

## User Flow Chính

### Flow 1: Lập kế hoạch & tạo kỳ thi
**Mô tả**: Admin tạo một kỳ thi mới với đầy đủ cấu hình: đối tượng, thời gian, đề thi, giám thị.
**Trigger**: Menu "Thi trực tuyến" → Tab "Kỳ thi" → Nút **"+ Tạo kỳ thi"**.
**Steps**:
1. Wizard **"Tạo kỳ thi"** — 5 bước:

**Bước 1 — Thông tin chung**:
   - Tên kỳ thi (VD: "Kiểm tra giữa kỳ 1 — Toán 11"), Loại thi (kiểm tra thường xuyên / định kỳ / thi thử / thi học bổng).
   - Môn thi, Học kỳ áp dụng.
   - Thời gian thi: Ngày, giờ bắt đầu, thời lượng làm bài (phút).
   - Thời gian mở đề (có thể khác giờ bắt đầu thi — cho phép HS vào phòng thi trước).

**Bước 2 — Đối tượng dự thi**:
   - Chọn: Toàn khối 11 / Các lớp cụ thể / Danh sách HS upload.
   - Xem preview số lượng thí sinh.
   - Cấu hình: Cho phép làm bài trễ không? Trễ tối đa bao nhiêu phút?

**Bước 3 — Đề thi**:
   - Phương án A: **Chọn từ ngân hàng câu hỏi** — filter câu hỏi theo môn, chương, độ khó, loại câu. Kéo thả câu hỏi vào đề hoặc dùng "Sinh đề tự động" theo tỷ lệ độ khó.
   - Phương án B: **Upload đề có sẵn** (Word/PDF — chỉ cho kỳ thi tự luận).
   - Cấu hình trộn đề: Trộn thứ tự câu hỏi | Trộn thứ tự đáp án.
   - Số mã đề: 1/2/4 mã đề (tự động sinh các mã đề từ đề gốc).
   - Preview đề: Xem trước như HS sẽ thấy.

**Bước 4 — Cài đặt thi**:
   - Chế độ chống gian lận: Khóa tab trình duyệt | Không cho copy-paste | Chụp ảnh webcam định kỳ | Phát hiện nhìn ra khỏi màn hình (eye tracking).
   - Xem lại đáp án: Sau khi nộp bài / Sau khi kết thúc kỳ thi / Không bao giờ.
   - Phân công giám thị: Chọn GV phụ trách giám sát online (có thể nhiều GV).
   - Cấu hình nộp bài: Nộp khi hết giờ tự động | Cảnh báo trước X phút.

**Bước 5 — Xem lại & Publish**:
   - Tóm tắt toàn bộ cấu hình.
   - Trạng thái: **Nháp** (chưa thông báo) | **Đã thông báo** (HS thấy lịch thi) | **Đang mở** (HS đang làm) | **Kết thúc** | **Đã chấm**.
   - Nút "Lưu nháp" / "Publish & Thông báo HS".
**Expected Result**: Kỳ thi được cấu hình đầy đủ trong < 10 phút; HS nhận thông báo tự động.

---

### Flow 2: Giám sát kỳ thi đang diễn ra
**Mô tả**: Admin/Giám thị theo dõi thi theo thời gian thực, phát hiện và xử lý gian lận.
**Trigger**: Kỳ thi bắt đầu → Nút **"Vào phòng giám sát"** hoặc từ Dashboard có kỳ thi đang chạy.
**Steps**:
1. Màn hình **"Phòng giám sát"**:
   - **Header**: Tên kỳ thi | Đồng hồ đếm ngược | X/Y HS đang làm bài | X HS chưa vào | X HS đã nộp.
   - **Grid thí sinh**: Mỗi HS là 1 card: ảnh webcam (nếu bật), tên, lớp, % đã làm, trạng thái (Đang làm / Chưa vào / Đã nộp / Cảnh báo vi phạm).
   - **Feed cảnh báo**: Real-time list các sự kiện vi phạm: "Nguyễn A chuyển tab [14:32]", "Trần B không nhìn màn hình 30s [14:33]".
2. **Filter nhanh**: Chỉ xem "Có cảnh báo" → focus vào thí sinh đáng ngờ.
3. **Hành động với thí sinh**:
   - Click HS → Xem chi tiết: tiến độ làm bài, danh sách cảnh báo đầy đủ, log webcam snapshots.
   - Gửi tin nhắn riêng cho HS (VD: "Hãy nhìn vào màn hình").
   - **Cảnh cáo chính thức**: Ghi nhận vi phạm vào hồ sơ thi.
   - **Khai trừ khỏi kỳ thi**: Buộc nộp bài sớm + ghi nhận lý do + thông báo HS.
4. **Gia hạn thời gian**: Cho HS cụ thể thêm X phút (trường hợp gặp sự cố kỹ thuật).
5. **Dừng/Hoãn kỳ thi**: Nếu xảy ra sự cố hệ thống → Nút khẩn cấp "Tạm dừng kỳ thi cho tất cả" (đồng hồ dừng lại, bài HS được autosave).
**Expected Result**: Giám thị phát hiện và xử lý gian lận ngay lập tức; kỳ thi diễn ra nghiêm túc.

---

### Flow 3: Chấm bài & Công bố kết quả
**Mô tả**: Sau kỳ thi, Admin quản lý quá trình chấm và công bố điểm.
**Trigger**: Kỳ thi kết thúc → Tab "Kết quả" của kỳ thi đó.
**Steps**:
1. **Câu hỏi trắc nghiệm**: Chấm tự động ngay khi HS nộp bài. Kết quả sẵn sàng trong vài giây sau khi kỳ thi kết thúc.
2. **Câu hỏi tự luận**: Phân công GV chấm:
   - Danh sách bài tự luận cần chấm, phân chia theo GV.
   - GV chấm trong giao diện: xem bài làm HS, nhập điểm từng câu, ghi nhận xét.
   - CBQL có thể review bài chấm bất kỳ.
3. **Kiểm tra kết quả trước khi công bố**:
   - Thống kê nhanh: điểm trung bình, điểm cao nhất/thấp nhất, phân phối điểm (histogram).
   - Phát hiện điểm bất thường: HS điểm 0 (có thể bị lỗi kỹ thuật), HS điểm 10 (kiểm tra có gian lận?).
   - Xem lại từng bài của HS bất kỳ trước khi công bố.
4. Nhấn **"Công bố kết quả"** → HS và phụ huynh nhận thông báo; HS có thể xem điểm và đáp án.
5. **Phúc khảo**: Nếu HS/phụ huynh yêu cầu phúc khảo → Admin mở lại bài, giao GV khác chấm lại.
**Expected Result**: Kết quả chính xác, công bố kịp thời, quy trình phúc khảo rõ ràng.

---

### Flow 4: Thống kê & Phân tích kết quả kỳ thi
**Mô tả**: CBQL phân tích kết quả kỳ thi để đánh giá chất lượng giảng dạy và học tập.
**Trigger**: Tab "Thống kê" trong màn hình chi tiết kỳ thi.
**Steps**:
1. **Overview**: Điểm TB toàn trường | Điểm TB theo lớp | Tỷ lệ đạt/không đạt | Tỷ lệ tham dự.
2. **Biểu đồ phân phối điểm**: Histogram điểm theo lớp; so sánh các lớp cùng khối.
3. **Phân tích câu hỏi** (Item Analysis):
   - Câu nào nhiều HS làm sai nhất → GV cần ôn luyện thêm phần đó.
   - Câu nào quá dễ hoặc quá khó → điều chỉnh ngân hàng câu hỏi.
   - Tỷ lệ chọn từng đáp án của câu trắc nghiệm (để phát hiện câu hỏi bị lỗi).
4. **So sánh liên kỳ**: Điểm kỳ này vs kỳ trước cùng môn → xu hướng cải thiện/sụt giảm.
5. Xuất **"Báo cáo kết quả kỳ thi"** dạng PDF chuẩn để trình ban giám hiệu.
**Expected Result**: Kết quả kỳ thi không chỉ để xếp loại HS mà còn là công cụ cải thiện chất lượng dạy học.

---

## Tính năng & Màn hình

### Màn hình Danh sách Kỳ thi
```
┌────────────────────────────────────────────────────────────────────┐
│ HEADER: Kỳ thi trực tuyến | [+ Tạo kỳ thi]                        │
├────────────────────────────────────────────────────────────────────┤
│ FILTER: [Môn ▼] [Lớp/Khối ▼] [Trạng thái ▼] [Học kỳ ▼]          │
├────────────────────────────────────────────────────────────────────┤
│ ĐANG DIỄN RA:                                                      │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ 🔴 Kiểm tra GK1 - Toán 11 | ⏱ Còn 23:45 | 234/240 HS vào  │   │
│ │ [Vào phòng giám sát →]                                       │   │
│ └─────────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────┤
│ SẮP TỚI:                                                           │
│ Kiểm tra CK1 - Văn 12 | 25/03/2026 08:00 | 360 HS | [Sửa][Xóa]  │
│ Thi thử ĐH - Anh     | 28/03/2026 14:00 | 480 HS | [Sửa][Xóa]  │
├────────────────────────────────────────────────────────────────────┤
│ ĐÃ KẾT THÚC: (Collapsible list) ...                               │
└────────────────────────────────────────────────────────────────────┘
```

### Màn hình Giám sát Phòng thi
```
┌────────────────────────────────────────────────────────────────────┐
│ Kiểm tra GK1 - Toán 11 | ⏱ 00:23:45 | [⏸ Tạm dừng] [⏹ Dừng KT] │
├────────────────────────────────────────────────────────────────────┤
│ 234 đang làm | 4 chưa vào | 2 đã nộp | ⚠ 3 cảnh báo              │
├────────────────────────────────────────────────────────────────────┤
│ FILTER: [Tất cả] [Có cảnh báo ●] [Chưa vào] [Đã nộp]             │
├───────────┬───────────┬───────────┬───────────┬───────────────────┤
│ [📷 Ảnh] │ [📷 Ảnh] │ [📷 Ảnh] │ [📷 Ảnh] │ [📷 Ảnh]         │
│ Ng.Văn A  │ Tr.Thị B  │ ⚠ Lê C   │ Phm.D    │ ...              │
│ 11A1 60%  │ 11A2 45%  │ 11A1 30%  │ 11A3 75%  │                   │
│ Đang làm  │ Đang làm  │ Chuyển tab│ Đang làm  │                   │
└───────────┴───────────┴───────────┴───────────┴───────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Tạo kỳ thi | Nút "+ Tạo kỳ thi" | Wizard 5 bước |
| Sao chép kỳ thi | Menu ⋮ → Sao chép | Tạo bản sao với thời gian mới |
| Publish kỳ thi | Nút "Publish" | Thông báo HS, lịch thi hiển thị |
| Tạm dừng kỳ thi | Nút "⏸ Tạm dừng" | Đồng hồ dừng, bài autosave |
| Gia hạn cho HS | Click HS → Gia hạn | +X phút cho HS đó |
| Khai trừ thí sinh | Click HS → Khai trừ | Buộc nộp, ghi log vi phạm |
| Công bố kết quả | Nút "Công bố" | HS thấy điểm, nhận thông báo |
| Mở phúc khảo | Menu ⋮ → Phúc khảo | Bài được giao chấm lại |
| Xuất kết quả | Nút "Xuất" | Excel danh sách điểm theo chuẩn |
| Phân tích câu hỏi | Tab "Thống kê" → Item Analysis | Báo cáo chất lượng câu hỏi |

---

## Gom nhóm tính năng thông minh
Module Thi gom **lập kế hoạch + cấu hình đề + danh sách thí sinh + giám sát thực tế + chấm bài + thống kê** vào một workflow liền mạch. Điểm đặc biệt: giám sát thi được thiết kế như "phòng giám sát ảo" — CBQL/giám thị thấy tất cả thí sinh trên 1 màn hình, giống như đi tuần trong phòng thi thực, thay vì phải xem từng bài một.

---

## Edge Cases & Validation
- **HS mất kết nối giữa chừng**: Bài làm được autosave mỗi 30 giây; khi HS kết nối lại, tiếp tục từ nơi bỏ dở trong thời gian còn lại.
- **Server quá tải khi nhiều HS vào thi cùng lúc**: Load balancing; HS vào thi theo batch (cách nhau 30 giây) để tránh spike.
- **HS nộp bài rỗng**: Cảnh báo "Bài làm của bạn đang trống. Bạn chắc chắn muốn nộp?".
- **Câu hỏi bị lỗi phát hiện sau khi thi**: Hai phương án: Loại câu đó khỏi tính điểm (cộng điểm đều cho tất cả) hoặc Tất cả đều được điểm tối đa câu đó.
- **Thời gian máy chủ và máy khách lệch nhau**: Đồng hồ đếm ngược chạy phía server, không phụ thuộc đồng hồ máy tính HS.
- **Đề thi bị lộ trước kỳ thi**: Mã hóa đề trên server; chỉ decrypt khi đến đúng giờ thi.
- **Gian lận giữa mã đề**: Nếu 2 HS ngồi cạnh nhau nhưng khác mã đề, thứ tự câu hỏi khác hoàn toàn.
- **CBQL dừng kỳ thi khi HS đang làm**: Confirm "Kỳ thi đang có X HS làm bài. Dừng sẽ tự nộp bài của tất cả HS. Tiếp tục?"
- **Thi tự luận quét bài làm giấy**: Hỗ trợ GV upload ảnh bài làm (scan) → lưu vào hệ thống → chấm điểm ghi nhận số.
- **Mất điện phòng máy giữa thi**: Bài làm được lưu; khi HS vào lại từ máy khác, nhận được bài cũ với thời gian còn lại chính xác.

---

## Tích hợp
- **Ngân hàng câu hỏi (E-learning)**: Dùng chung ngân hàng câu hỏi với module E-learning; GV thêm câu hỏi ở E-learning, Admin dùng cho kỳ thi.
- **QL Học sinh**: Danh sách thí sinh lấy từ module QL HS/Lớp; điểm thi được lưu vào hồ sơ học tập HS.
- **QL Giáo viên**: GV được phân công giám thị; GV chấm bài tự luận.
- **Điểm danh**: Camera AI có thể được dùng để xác minh danh tính HS trước khi vào phòng thi ảo.
- **HUE-S**: HS nhận lịch thi, nhận kết quả qua HUE-S.
- **Email/SMS**: Thông báo kỳ thi, nhắc nhở trước ngày thi 1 ngày và 1 tiếng.
- **Báo cáo tổng hợp**: Kết quả thi được tích hợp vào báo cáo học kỳ của trường.
- **Webcam API**: Truy cập webcam HS để chụp ảnh định kỳ (Anti-cheating); cần xin quyền trong trình duyệt.
