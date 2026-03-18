# Quản Lý E-Learning — Giám Sát Học Trực Tuyến — Role: Admin

## Mục tiêu
Cung cấp cho CBQL/QTHT góc nhìn toàn trường về hoạt động học trực tuyến: giám sát tiến độ học tập của HS theo lớp/khối, theo dõi hoạt động GV, phát hiện học sinh bị tụt hậu sớm, quản lý nội dung khóa học và hỏi đáp — đảm bảo chất lượng E-learning toàn trường.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền: xem tất cả khóa học, cấu hình platform, quản lý tài khoản E-learning, xóa nội dung vi phạm, export toàn bộ dữ liệu learning analytics.
- **CBQL**: Xem báo cáo tiến độ và điểm số toàn trường; xem danh sách HS chưa hoàn thành; duyệt/từ chối nội dung khóa học GV tạo; xem thống kê hỏi đáp; không thể tạo/sửa nội dung bài học.

---

## User Flow Chính

### Flow 1: Tổng quan tiến độ E-learning toàn trường
**Mô tả**: CBQL mở đầu ngày làm việc bằng việc xem tình trạng học online của toàn trường.
**Trigger**: Menu "E-learning" → Landing page (Tab "Tổng quan").
**Steps**:
1. Dashboard E-learning hiển thị:
   - **KPI Row**: Tổng khóa học đang chạy | HS hoàn thành đúng hạn / Tổng | Bài tập chờ chấm | Câu hỏi chưa trả lời.
   - **Heat Map tiến độ**: Ma trận Lớp × Môn học; màu ô = % HS hoàn thành nội dung tuần này. Đỏ = < 50%, Vàng = 50-80%, Xanh = > 80%.
   - **Bảng cảnh báo**: Top 10 HS có tiến độ học thấp nhất (có tên, lớp, % hoàn thành, môn học).
   - **Top GV hoạt động**: GV đăng bài nhiều nhất tuần này; GV có tỷ lệ phản hồi câu hỏi HS cao nhất.
2. Click vào ô trong heat map → Drill down: danh sách HS trong lớp/môn đó kèm % hoàn thành từng người.
3. Click vào HS trong bảng cảnh báo → Hồ sơ học tập của HS đó (modal).
4. **Bộ lọc thời gian**: Tuần này | Tháng này | Học kỳ 1 | Học kỳ 2 | Tùy chọn khoảng.
**Expected Result**: CBQL nắm toàn cảnh E-learning và nhận diện điểm yếu cần can thiệp trong < 2 phút.

---

### Flow 2: Duyệt nội dung khóa học của giáo viên
**Mô tả**: CBQL kiểm duyệt các khóa học/bài giảng mới trước khi GV publish cho HS.
**Trigger**: Tab "Duyệt nội dung" → Danh sách khóa học "Chờ duyệt".
**Steps**:
1. Danh sách khóa học với trạng thái: **Nháp** | **Chờ duyệt** | **Đã duyệt** | **Từ chối** | **Đang chạy**.
2. Click khóa học "Chờ duyệt" → Màn hình review:
   - Preview cấu trúc khóa: danh sách chương/bài (có thể expand từng bài).
   - Xem nội dung từng bài: video preview, slide, tài liệu PDF.
   - Xem danh sách bài tập/kiểm tra kèm preview câu hỏi.
3. CBQL có thể để lại **nhận xét từng bài** (inline comment) trước khi quyết định.
4. Nút **"Duyệt & Publish"** → Khóa học chuyển sang "Đang chạy"; GV nhận thông báo.
5. Nút **"Từ chối"** → Modal nhập lý do từ chối → GV nhận thông báo kèm ghi chú sửa đổi.
6. Nút **"Yêu cầu chỉnh sửa"** (trung gian) → Khóa về "Nháp" với comment cụ thể.
7. **Duyệt hàng loạt**: Chọn nhiều khóa → "Duyệt tất cả" (phù hợp khi đầu học kỳ có nhiều khóa mới).
**Expected Result**: Quy trình kiểm duyệt nhanh, GV nhận phản hồi cụ thể, nội dung chất lượng mới đến với HS.

---

### Flow 3: Theo dõi và xử lý bài tập chưa chấm
**Mô tả**: CBQL giám sát việc GV chấm bài để đảm bảo HS nhận phản hồi đúng hạn.
**Trigger**: Tab "Bài tập & Chấm bài" HOẶC Click vào KPI "Bài tập chờ chấm" trên Dashboard.
**Steps**:
1. Bảng tổng hợp bài tập chờ chấm theo GV:
   - Tên GV | Môn | Lớp | Số bài chờ chấm | Bài nộp cũ nhất (ngày) | Trạng thái.
2. **Cảnh báo quá hạn**: Bài nộp quá 7 ngày chưa chấm → highlight đỏ; CBQL có thể gửi nhắc nhở tự động cho GV.
3. Click vào GV → Danh sách chi tiết từng bài tập: môn, tên bài, lớp, số bài chưa chấm, deadline.
4. Nút **"Nhắc nhở GV"** → Gửi email/thông báo in-app: "Có X bài tập chưa chấm từ ngày Y, vui lòng xử lý."
5. **Báo cáo**: Tỷ lệ chấm bài đúng hạn theo GV/tháng → dùng để đánh giá thi đua.
**Expected Result**: Không có bài tập nào bị bỏ sót > 7 ngày; HS được phản hồi kịp thời.

---

### Flow 4: Quản lý hỏi đáp và tương tác
**Mô tả**: Admin giám sát và kiểm duyệt nội dung hỏi đáp giữa GV và HS.
**Trigger**: Tab **"Hỏi & Đáp"**.
**Steps**:
1. Feed câu hỏi theo thời gian (mới nhất trước), có thể filter: Chưa được trả lời | Cần kiểm duyệt | Đã trả lời.
2. **Kiểm duyệt nội dung**: Câu hỏi/câu trả lời bị báo cáo (flag) hiển thị với badge đỏ.
3. Click vào câu hỏi flagged → Xem nội dung đầy đủ → Quyết định: Giữ nguyên | Ẩn | Xóa | Cảnh báo người dùng.
4. **Thống kê**: Môn học có nhiều câu hỏi nhất | GV trả lời nhanh nhất | Tỷ lệ câu hỏi được trả lời.
5. **Tự động kiểm duyệt**: Cấu hình danh sách từ khóa bị cấm → câu hỏi/trả lời có từ khóa đó tự động bị giữ lại chờ duyệt.
**Expected Result**: Môi trường hỏi đáp lành mạnh, câu hỏi được trả lời kịp thời, nội dung không phù hợp được lọc.

---

### Flow 5: Xem hồ sơ học tập cá nhân học sinh
**Mô tả**: CBQL xem chi tiết quá trình học online của một HS cụ thể khi cần can thiệp.
**Trigger**: Click tên HS trong bảng cảnh báo / Tìm kiếm HS.
**Steps**:
1. Modal "Hồ sơ học tập E-learning" của HS:
   - **Tổng quan**: % hoàn thành trung bình tất cả môn, điểm trung bình bài kiểm tra online, thời gian học online tuần này.
   - **Theo môn học**: Bảng tiến độ từng môn (% bài học xem, % bài tập nộp, điểm TB).
   - **Timeline hoạt động**: Biểu đồ giờ học online theo ngày/tuần (thấy pattern học tập).
   - **Bài tập**: Danh sách bài tập đã nộp (điểm, nhận xét GV) và chưa nộp (tên bài, deadline).
2. Nút **"Gửi cảnh báo cho phụ huynh"**: Template sẵn "Học sinh [tên] chưa hoàn thành [X] bài học...".
3. Nút **"Ghi chú nội bộ"**: Admin ghi chú về trường hợp HS này (không hiển thị cho HS/phụ huynh).
**Expected Result**: Phát hiện và can thiệp sớm với HS có dấu hiệu học kém trên nền tảng E-learning.

---

## Tính năng & Màn hình

### Màn hình Tổng quan E-learning — Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: E-Learning — Giám sát toàn trường | [Năm học ▼] [HK ▼]  │
├──────────────────────────────────────────────────────────────────┤
│ TABS: [Tổng quan] [Duyệt nội dung] [Bài tập] [Hỏi đáp] [Báo cáo]│
├─────────────────────────────────────────────────────────────────┤
│ KPI: [47 KH đang chạy] [78% HS on-track] [234 bài chờ chấm]    │
├─────────────────────────────┬───────────────────────────────────┤
│ HEATMAP TIẾN ĐỘ             │ CẢNH BÁO HỌC SINH                │
│ (Lớp × Môn)                 │ HS tụt hậu cần theo dõi          │
│  Toán  Văn  Lý  Hóa  Anh   │ ─────────────────────────────    │
│ 10A1 🟢  🟢  🟡  🟢  🟢    │ Nguyễn A - 11B3 - 23% [Xem]    │
│ 10A2 🟡  🟢  🔴  🟢  🟡    │ Trần B   - 10A1 - 31% [Xem]    │
│ 11A1 🟢  🟢  🟢  🟡  🟢    │ Lê C     - 12C2 - 35% [Xem]    │
│ ...                          │ ...                              │
└─────────────────────────────┴───────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Xem tiến độ lớp | Click ô heatmap | Drill-down danh sách HS trong lớp/môn |
| Xem hồ sơ học tập HS | Click tên HS | Modal hồ sơ học tập đầy đủ |
| Duyệt khóa học | Tab Duyệt → Click khóa | Preview + nút Duyệt/Từ chối |
| Từ chối khóa học | Nút "Từ chối" | Modal nhập lý do bắt buộc |
| Nhắc nhở GV chấm bài | Tab Bài tập → Nhắc | Gửi thông báo cho GV |
| Ẩn câu hỏi | Tab Hỏi đáp → Ẩn | Nội dung bị ẩn, người dùng thấy "Đã bị ẩn" |
| Xuất báo cáo tiến độ | Tab Báo cáo → Xuất | Excel/PDF theo filter |
| Gửi cảnh báo PH | Trong hồ sơ HS → Gửi | Email/SMS theo template |
| Cấu hình từ khóa cấm | Hệ thống → E-learning config | Cập nhật danh sách |

---

## Gom nhóm tính năng thông minh
Module E-learning Admin **không phải** giao diện để tạo bài giảng (đó là vai trò GV) — mà là **control tower** để giám sát toàn hệ thống học online. Việc gom "duyệt nội dung + giám sát tiến độ + quản lý bài tập + kiểm duyệt hỏi đáp" vào một module Admin giúp CBQL không cần đăng nhập bằng tài khoản GV để kiểm tra nội dung, không cần vào từng lớp để xem tiến độ — tất cả được aggregate và hiển thị từ góc nhìn quản lý.

---

## Edge Cases & Validation
- **Khóa học bị từ chối nhiều lần**: Sau 3 lần từ chối cùng 1 khóa, hệ thống nhắc CBQL "Xem xét hỗ trợ GV này".
- **HS chưa đăng nhập E-learning lần nào**: Badge "Chưa kích hoạt" trong heatmap; gửi thông báo nhắc nhở HS.
- **GV upload file quá lớn**: Video > 500MB → hướng dẫn nén trước khi upload; tự động transcode sau khi upload.
- **Bài kiểm tra có câu hỏi lỗi**: GV có thể sửa câu hỏi sau khi HS đã làm → hệ thống tự tính lại điểm.
- **HS làm bài kiểm tra nhiều lần**: Cấu hình cho phép bao nhiêu lần; ghi nhận lần nào tính điểm (lần đầu/lần cao nhất/lần cuối).
- **Đường truyền HS yếu**: Video tự điều chỉnh chất lượng (adaptive bitrate); ghi nhận điểm tiếp tục xem từ nơi bỏ dở.
- **Khóa học quá hạn deadline**: Ẩn bài nộp nhưng HS vẫn xem được tài liệu học.
- **Xóa khóa học đang có HS học**: Yêu cầu xác nhận 2 lần; soft-delete (ẩn, không xóa vật lý) để giữ lịch sử điểm.

---

## Tích hợp
- **QL Học sinh**: Danh sách HS trong lớp tự động được enroll vào khóa học E-learning của lớp đó.
- **QL Giáo viên**: GV là content creator; tài khoản GV trong E-learning được đồng bộ từ QL GV.
- **QL Lớp học**: Khóa học gắn với lớp; phân lớp thay đổi → cập nhật enroll E-learning.
- **Thi trực tuyến**: Module Thi dùng chung engine câu hỏi với E-learning; điểm thi tích hợp vào hồ sơ học tập.
- **Báo cáo tổng hợp**: Learning analytics được đưa vào dashboard báo cáo tổng hợp Admin.
- **HUE-S**: HS nhận thông báo bài mới, deadline bài tập, kết quả điểm qua HUE-S.
- **Email/SMS**: Thông báo cảnh báo học sinh tụt hậu cho phụ huynh.
- **Video CDN**: Upload video lên CDN (AWS CloudFront / Cloudflare) để stream mượt mà; không lưu video trực tiếp trên server trường.
- **SCORM/xAPI**: Hỗ trợ import nội dung chuẩn SCORM 1.2/2004 từ các nhà cung cấp bên ngoài.
