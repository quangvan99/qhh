# Quản lý Thông báo & Truyền thông Nội bộ — Role: Admin

## Mục tiêu
Cung cấp cho CBQL và QTHT một trung tâm điều phối thông tin thống nhất: soạn và gửi thông báo đến học sinh, giáo viên, phụ huynh qua nhiều kênh (In-app, Email, SMS, HUE-S), cấu hình thông báo tự động theo sự kiện nghiệp vụ, quản lý mẫu thông báo tái sử dụng, theo dõi hiệu quả truyền đạt qua thống kê tỷ lệ đọc — đảm bảo mọi thông tin nhà trường đến đúng người, đúng kênh, đúng thời điểm.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền — soạn/gửi/xóa mọi loại thông báo; cấu hình thông báo tự động (triggers); quản lý template; xem thống kê toàn trường; gửi thông báo khẩn cấp toàn hệ thống; cấu hình SMS/Email gateway; quản lý API HUE-S.
- **CBQL**: Soạn và gửi thông báo chung, học vụ, sự kiện đến các đối tượng thuộc phạm vi phụ trách; xem lịch sử thông báo do mình tạo; xem thống kê thông báo đã gửi; sử dụng template có sẵn; **không** cấu hình triggers tự động; **không** gửi thông báo khẩn cấp (cần QTHT xác nhận); **không** chỉnh sửa cấu hình gateway.

---

## User Flow Chính

### Flow 1: Soạn và gửi thông báo mới
**Mô tả**: CBQL cần thông báo lịch họp phụ huynh toàn khối 11 qua cả In-app lẫn Email.
**Trigger**: Menu "Thông báo" → Nút **"+ Tạo thông báo"** hoặc Quick Action từ Dashboard.
**Steps**:
1. Màn hình **"Soạn thông báo"** hiển thị theo dạng wizard 4 bước:
2. **Bước 1 — Phân loại**:
   - **Loại thông báo**: chọn 1 trong 4 loại:
     - `Thông báo chung` — tin tức, thông tin định kỳ
     - `Thông báo học vụ` — liên quan học tập, điểm số, lịch thi
     - `Cảnh báo khẩn` — ưu tiên cao, badge đỏ trên ứng dụng
     - `Sự kiện` — hoạt động có ngày/giờ cụ thể, tích hợp calendar
   - Mỗi loại kéo theo **màu badge** và **icon** mặc định khác nhau.
3. **Bước 2 — Nội dung**:
   - Tiêu đề (bắt buộc, tối đa 150 ký tự, hiển thị counter).
   - Nội dung chính: Rich-text editor (bold, italic, bullet list, đính kèm ảnh/file PDF).
   - Tóm tắt ngắn (dùng cho SMS / push notification preview, tối đa 160 ký tự).
   - Nút **"Chọn từ template"** → Mở sidebar danh sách template (xem Flow 4).
4. **Bước 3 — Đối tượng nhận**:
   - Phạm vi gửi (chọn 1 hoặc kết hợp nhiều):
     - `Toàn trường` — tất cả HS + GV + PH
     - `Theo khối` — chọn Khối 10 / 11 / 12 (multi-select)
     - `Theo lớp` — chọn lớp cụ thể từ dropdown có search
     - `Theo nhóm` — nhóm tùy chỉnh đã định nghĩa sẵn (VD: "Giáo viên chủ nhiệm", "Ban cán sự lớp")
     - `Cá nhân` — tìm kiếm theo tên/mã HS/GV và thêm vào danh sách
   - **Vai trò nhận**: Học sinh | Giáo viên | Phụ huynh | Tất cả (checkbox, multi-select).
   - Hiển thị **số lượng người nhận ước tính** (VD: "~387 người nhận") cập nhật real-time khi thay đổi bộ lọc.
5. **Bước 4 — Kênh & Lịch gửi**:
   - **Kênh gửi** (multi-select, bắt buộc chọn ít nhất 1):
     - `In-app notification` — hiển thị trong ứng dụng quản lý trường
     - `Email` — gửi qua SMTP/Sendgrid đến email đã đăng ký
     - `SMS` — gửi tin nhắn đến số điện thoại đã đăng ký (cảnh báo: phát sinh chi phí, hiển thị ước tính số SMS)
     - `HUE-S` — đẩy thông báo lên ứng dụng HUE-S của tỉnh Thừa Thiên Huế
   - **Thời gian gửi**:
     - `Gửi ngay` (mặc định)
     - `Hẹn giờ` → Date-time picker chọn ngày/giờ gửi → hệ thống hiển thị countdown "Sẽ gửi sau: 2 ngày 3 giờ 15 phút"
6. Nút **"Preview"** → Mở modal xem trước thông báo như user sẽ thấy trên từng kênh (tab chuyển đổi: In-app / Email / SMS / HUE-S).
7. Nút **"Gửi"** (hoặc **"Lên lịch"** nếu chọn hẹn giờ) → Xác nhận bằng dialog:
   - "Bạn sắp gửi thông báo '[Tiêu đề]' đến **387 người** qua **Email + SMS**. Chi phí SMS ước tính: 12,000đ. Xác nhận?"
   - [Xác nhận] / [Quay lại chỉnh sửa]
8. Hệ thống đẩy vào hàng đợi gửi (queue), hiển thị thanh tiến trình gửi.
**Expected Result**: Thông báo được gửi/lên lịch thành công; xuất hiện trong "Lịch sử thông báo" với trạng thái "Đang gửi" → "Đã gửi"; admin nhận xác nhận "Đã gửi thành công đến 385/387 người (99.5%)".

---

### Flow 2: Quản lý danh sách thông báo đã gửi
**Mô tả**: CBQL muốn kiểm tra thông báo họp phụ huynh đã gửi tuần trước đã có bao nhiêu phụ huynh đọc.
**Trigger**: Menu "Thông báo" → Tab **"Lịch sử thông báo"**.
**Steps**:
1. Màn hình **"Lịch sử thông báo"** hiển thị danh sách dạng bảng:
   - Các cột: Tiêu đề | Loại | Đối tượng | Kênh | Ngày gửi | Trạng thái | Người nhận | Đã đọc | Tỷ lệ đọc | Actions.
2. **Bộ lọc nhanh** trên đầu bảng:
   - Tìm kiếm theo tiêu đề.
   - Filter theo **trạng thái**: `Tất cả` | `Đã gửi` | `Đang gửi` | `Lỗi` | `Hẹn giờ` | `Đã hủy`.
   - Filter theo **loại**: Thông báo chung / Học vụ / Cảnh báo / Sự kiện.
   - Filter theo **khoảng thời gian**: tuần này / tháng này / tùy chỉnh.
3. Badge màu theo trạng thái:
   - `Đã gửi` — xanh lá
   - `Đang gửi` — xanh dương (spinner)
   - `Lỗi` — đỏ (kèm icon cảnh báo)
   - `Hẹn giờ` — vàng (kèm thời gian đếm ngược)
   - `Đã hủy` — xám
4. Click vào dòng → Mở **panel chi tiết** bên phải (slide-in):
   - Nội dung thông báo đầy đủ.
   - Thống kê theo kênh:
     ```
     In-app:  247 gửi | 231 đã đọc | 93.5%
     Email:   387 gửi | 312 đã đọc | 80.6%
     SMS:     387 gửi | 387 giao thành công | —
     HUE-S:  247 gửi |  89 đã đọc | 36.0%
     ```
   - Danh sách người **chưa đọc** (có thể xuất Excel để gọi điện nhắc).
   - Lỗi gửi (nếu có): danh sách người nhận thất bại + lý do.
5. **Actions** trên từng dòng:
   - **Xem chi tiết**: xem thống kê đầy đủ.
   - **Gửi lại** (Resend): gửi lại cho người chưa nhận hoặc nhận thất bại.
   - **Hủy** (chỉ khi trạng thái "Hẹn giờ"): hủy lịch gửi đã đặt.
   - **Nhân bản** (Duplicate): tạo bản nháp mới từ thông báo cũ, tiện chỉnh sửa để gửi lại.
   - **Xóa** (chỉ QTHT): xóa khỏi lịch sử.
**Expected Result**: CBQL thấy rõ trạng thái từng thông báo và có thể thực hiện hành động tiếp theo (gửi lại, nhân bản) mà không cần soạn lại từ đầu.

---

### Flow 3: Thông báo tự động (Automated Notifications)
**Mô tả**: QTHT cấu hình hệ thống tự động gửi SMS cho phụ huynh khi học sinh vắng không phép, không cần nhân viên thao tác thủ công.
**Trigger**: Menu "Thông báo" → Tab **"Thông báo tự động"** (chỉ QTHT).
**Steps**:
1. Màn hình **"Cấu hình thông báo tự động"** gồm 2 phần:
   - **Bên trái**: Danh sách trigger đang hoạt động (toggle on/off từng rule).
   - **Bên phải**: Chi tiết cấu hình của trigger được chọn.
2. Hệ thống cung cấp **5 trigger nghiệp vụ chuẩn** (pre-built):

   | STT | Trigger | Điều kiện | Kênh mặc định |
   |-----|---------|-----------|---------------|
   | 1 | HS vắng không phép | GV điểm danh "vắng không phép" → ngay lập tức | SMS + In-app (PH) |
   | 2 | Sách quá hạn | Ngày trả sách qua 1 ngày | In-app + Email (HS) |
   | 3 | Kỳ thi sắp tới | Trước N ngày so với ngày thi | In-app + Email (HS + GV) |
   | 4 | Kết quả thi có | GV nộp điểm → tức thì | In-app + Email (HS + PH) |
   | 5 | Học phí đến hạn | Trước N ngày hết hạn | SMS + Email (PH) |

3. **Chỉnh sửa chi tiết một trigger** (VD: Trigger "HS vắng không phép"):
   - **Điều kiện kích hoạt**:
     - Loại vắng: `Không phép` / `Có phép` / `Đi muộn` (checkbox).
     - Thời điểm gửi: `Ngay lập tức` / `Sau N phút` / `Cuối buổi học`.
     - Số lần vắng tích lũy: Gửi mỗi lần / Gửi khi đạt ngưỡng (VD: ≥ 3 buổi/tháng).
   - **Đối tượng nhận**: Học sinh | Phụ huynh | GVCN | Tổ hợp.
   - **Kênh gửi**: In-app | Email | SMS | HUE-S.
   - **Nội dung**: Chọn template từ danh sách (xem Flow 4) hoặc soạn trực tiếp với biến động.
   - **Giờ hoạt động** (throttle): Chỉ gửi SMS trong khoảng 7:00 – 21:00 (tránh nhắn tin đêm khuya).
   - **Ngoại lệ** (Exclusion): Không gửi cho HS/PH đã tắt nhận thông báo loại này.
4. Nút **"Test ngay"** → Gửi thử với dữ liệu mẫu đến số điện thoại/email của QTHT để kiểm tra nội dung.
5. Toggle **Bật/Tắt** từng rule; lưu log lịch sử thay đổi cấu hình (ai, lúc nào, thay đổi gì).
6. **Thêm trigger tùy chỉnh** (nâng cao): QTHT có thể tạo rule mới bằng cách chọn:
   - Nguồn sự kiện (Event source): Điểm danh / Thư viện / Kết quả thi / Học phí / Lịch thi.
   - Điều kiện (Condition builder dạng wizard).
   - Hành động (Action): Gửi thông báo theo cấu hình.
**Expected Result**: Mỗi khi HS vắng không phép, phụ huynh nhận SMS trong vòng 5 phút mà không cần nhân viên can thiệp; lịch sử gửi tự động được ghi nhận đầy đủ trong tab "Lịch sử thông báo" với nhãn "Tự động".

---

### Flow 4: Quản lý mẫu thông báo (Templates)
**Mô tả**: CBQL muốn tạo template chuẩn cho "Thông báo họp phụ huynh định kỳ" để dùng lại mỗi học kỳ.
**Trigger**: Menu "Thông báo" → Tab **"Mẫu thông báo"**.
**Steps**:
1. Màn hình **"Thư viện mẫu thông báo"** hiển thị dạng card grid, phân nhóm:
   - `Hệ thống` — template mặc định do nhà cung cấp cài sẵn (chỉ đọc, có thể nhân bản).
   - `Của trường` — template do QTHT tạo, dùng chung toàn trường.
   - `Của tôi` — template cá nhân của CBQL đang đăng nhập.
2. **Tạo mới template** — Nút **"+ Tạo mẫu"**:
   - **Tên template** (nội bộ, không hiển thị cho người nhận).
   - **Loại thông báo** tương ứng (Chung / Học vụ / Cảnh báo / Sự kiện).
   - **Tiêu đề mẫu**: Hỗ trợ biến động dạng `{{tên_biến}}`.
   - **Nội dung mẫu**: Rich-text editor với panel **"Chèn biến"** bên cạnh.
3. **Biến động hỗ trợ** (click để chèn vào vị trí con trỏ):

   | Biến | Giá trị lúc gửi |
   |------|----------------|
   | `{{tenHS}}` | Họ tên học sinh |
   | `{{maHS}}` | Mã học sinh |
   | `{{tenLop}}` | Tên lớp học |
   | `{{tenGVCN}}` | Tên giáo viên chủ nhiệm |
   | `{{ngayThi}}` | Ngày thi cụ thể |
   | `{{tenMonThi}}` | Tên môn thi |
   | `{{phongThi}}` | Phòng thi |
   | `{{diemThi}}` | Điểm thi (nếu có kết quả) |
   | `{{ngayVang}}` | Ngày học sinh vắng |
   | `{{soNgayVang}}` | Số ngày vắng tích lũy |
   | `{{tenPH}}` | Họ tên phụ huynh |
   | `{{hocPhi}}` | Số tiền học phí |
   | `{{ngayDongHP}}` | Hạn đóng học phí |
   | `{{tenTruong}}` | Tên trường |
   | `{{namHoc}}` | Năm học hiện tại |
   | `{{hocKy}}` | Học kỳ hiện tại |

4. **Preview với dữ liệu mẫu**: Nút **"Preview"** → Hệ thống điền dữ liệu giả (mock data) vào các biến → Hiển thị tab preview cho từng kênh (In-app / Email / SMS).
   - SMS preview hiển thị số ký tự thực (sau khi điền biến) và số SMS sẽ gửi (1 SMS = 160 ký tự).
5. **Lưu template** → Xuất hiện ngay trong dropdown "Chọn từ template" khi soạn thông báo.
6. **CRUD đầy đủ**:
   - **Sửa**: Chỉnh sửa template đã lưu (lịch sử chỉnh sửa được lưu lại).
   - **Nhân bản**: Tạo bản copy để sửa variant mới.
   - **Xóa**: Chỉ QTHT xóa template cấp trường; CBQL xóa template của mình.
   - **Tắt**: Ẩn template khỏi danh sách chọn nhưng không xóa (để dữ liệu lịch sử không mất tham chiếu).
**Expected Result**: Template được lưu và có thể chọn lại từ bất kỳ form soạn thông báo nào; preview đúng nội dung sau khi điền biến; không phải gõ lại nội dung lặp lại mỗi kỳ.

---

### Flow 5: Xem thống kê hiệu quả thông báo
**Mô tả**: CBQL cần đánh giá kênh nào hiệu quả nhất để điều chỉnh chiến lược truyền thông nội bộ.
**Trigger**: Menu "Thông báo" → Tab **"Thống kê & Phân tích"**.
**Steps**:
1. Màn hình **"Thống kê thông báo"** gồm các khu vực:
2. **KPI tổng quan** (khoảng thời gian lọc: tuần / tháng / học kỳ / năm học):
   - Tổng thông báo đã gửi.
   - Tổng người nhận (lượt).
   - Tỷ lệ giao thành công (delivery rate) theo kênh.
   - Tỷ lệ đọc trung bình (open rate) theo kênh.
3. **Biểu đồ so sánh hiệu quả theo kênh**:
   ```
   Kênh         Gửi    Giao thành công   Đã đọc   Tỷ lệ đọc
   ─────────────────────────────────────────────────────────
   In-app      4,521        4,521          3,876      85.7%
   Email       3,847        3,801          2,290      60.3%
   SMS         1,203        1,199          —          —
   HUE-S       2,100        2,085            743      35.6%
   ```
4. **Biểu đồ đường** xu hướng tỷ lệ đọc theo thời gian (theo ngày/tuần).
5. **Top 5 thông báo được đọc nhiều nhất** trong kỳ (title, loại, tỷ lệ đọc, kênh).
6. **Top 5 thông báo có tỷ lệ đọc thấp nhất** → Gợi ý hành động: "Xem xét đổi kênh gửi" / "Rút ngắn tiêu đề".
7. **Phân tích theo đối tượng**:
   - Tỷ lệ đọc của Học sinh / Giáo viên / Phụ huynh.
   - Tỷ lệ đọc theo khối lớp.
8. **Xuất báo cáo**: Nút "Xuất Excel" / "Xuất PDF" → Báo cáo thống kê định dạng đẹp.
**Expected Result**: CBQL nhìn thấy ngay In-app là kênh hiệu quả nhất (85.7%) và HUE-S cần cải thiện (35.6%); có đủ dữ liệu để ra quyết định điều chỉnh kênh gửi.

---

### Flow 6: Thông báo khẩn cấp (Emergency Broadcast)
**Mô tả**: Phó hiệu trưởng cần thông báo ngay đến toàn thể giáo viên và học sinh về việc hủy thi do sự cố đột xuất.
**Trigger**: Nút **"🚨 Thông báo khẩn"** — luôn hiển thị nổi bật ở header menu (mọi màn hình) hoặc Quick Action Dashboard.
**Steps**:
1. Click nút → Hệ thống mở **modal khẩn cấp** với nền đỏ, lớp phủ (overlay) ưu tiên cao nhất:
   ```
   ┌─────────────────────────────────────────┐
   │  🚨 PHÁT THÔNG BÁO KHẨN CẤP           │
   │  ─────────────────────────────────────  │
   │  Tất cả kênh sẽ được kích hoạt đồng thời│
   │                                         │
   │  Tiêu đề: [______________________]      │
   │                                         │
   │  Nội dung: [_____________________]      │
   │            [_____________________]      │
   │                                         │
   │  Đối tượng: ● Toàn trường               │
   │             ○ Chỉ Giáo viên             │
   │             ○ Chỉ Học sinh              │
   │             ○ Tùy chỉnh                 │
   │                                         │
   │  Chọn từ kịch bản nhanh:               │
   │  [Hỏa hoạn / Sơ tán] [Hủy thi]         │
   │  [Giải tán lớp ngay] [Thay đổi địa điểm]│
   │                                         │
   │  ⚠ SMS sẽ gửi ngay đến TẤT CẢ         │
   │    (~1,200 người). Không thể thu hồi.   │
   │                                         │
   │  [XÁC NHẬN GỬI NGAY] [Hủy bỏ]          │
   └─────────────────────────────────────────┘
   ```
2. **Kịch bản nhanh** (Quick Scenarios): Click vào kịch bản → Tự điền tiêu đề + nội dung mẫu, admin chỉ cần chỉnh sửa chi tiết:
   - **"Hỏa hoạn / Sơ tán"**: "KHẨN: Toàn thể HS-GV lập tức sơ tán ra sân trường, tập kết tại [địa điểm]. Không sử dụng thang máy."
   - **"Hủy thi"**: "Thông báo: Kỳ thi [môn] ngày [ngày] bị hủy do [lý do]. Sẽ thông báo lịch thi bù sau."
   - **"Giải tán lớp ngay"**: "Thông báo: Buổi học hôm nay kết thúc sớm, HS ra về ngay lúc [giờ]. GV nhớ thông báo cho HS."
   - **"Thay đổi địa điểm"**: "Thông báo: [Môn/Lớp/Sự kiện] đổi địa điểm sang [địa điểm mới], bắt đầu lúc [giờ]."
3. **Xác nhận gửi**: Yêu cầu **nhập mã PIN** (4 số, QTHT/CBQL được cấp riêng) để tránh nhấn nhầm.
4. Sau xác nhận → Hệ thống gửi **đồng thời tất cả kênh** (In-app push với âm thanh cảnh báo + Email + SMS + HUE-S), không qua hàng đợi thông thường — ưu tiên tối cao.
5. Màn hình hiển thị **thanh tiến trình gửi real-time** (số lượng đã gửi / tổng):
   - In-app: 1,247/1,247 ✓
   - SMS: 1,189/1,247 (đang gửi...)
   - Email: 1,247/1,247 ✓
6. Sau khi gửi xong → Thông báo khẩn xuất hiện trong "Lịch sử" với nhãn `🚨 KHẨN CẤP` màu đỏ, không thể xóa (lưu vĩnh viễn để audit).
7. Hệ thống tự động ghi log sự kiện: người gửi, thời điểm, nội dung, số người nhận.
**Expected Result**: Toàn bộ 1,247 người nhận thông báo trong vòng < 2 phút qua tất cả kênh; không cần gõ lại nội dung nếu dùng kịch bản nhanh.

---

## Tính năng & Màn hình

### Màn hình Trung tâm Thông báo — Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER: Thông báo & Truyền thông   [🚨 Thông báo khẩn]  [+ Tạo mới] │
├──────────────────────────────────────────────────────────────────────┤
│ TABS: [Lịch sử] [Tự động] [Mẫu thông báo] [Thống kê]                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  KPI NHANH:                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ 📬 Đã gửi   │ │ 👁 Tỷ lệ đọc│ │ ⏰ Hẹn giờ  │ │ ⚠ Lỗi    │  │
│  │ tháng này   │ │ trung bình   │ │ đang chờ    │ │ cần xử lý │  │
│  │   47        │ │   72.3%      │ │    3        │ │     2     │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│                                                                      │
│  DANH SÁCH THÔNG BÁO GẦN NHẤT                                       │
│  ┌────┬──────────────────────┬──────────┬──────────┬───────┬──────┐  │
│  │ #  │ Tiêu đề              │ Đối tượng│ Kênh     │Trạng  │ T.lệ │  │
│  │    │                      │          │          │ thái  │ đọc  │  │
│  ├────┼──────────────────────┼──────────┼──────────┼───────┼──────┤  │
│  │ 1  │ 📋 Lịch thi HK1     │ Toàn trg │ 📱✉📲   │ ✅Gửi │ 84% │  │
│  │ 2  │ 🔔 Họp PH khối 11   │ Khối 11  │ ✉📲     │ ✅Gửi │ 67% │  │
│  │ 3  │ ⏰ Thông báo học phí │ Phụ huynh│ 📲✉     │ ⏰Hẹn │  —  │  │
│  │ 4  │ 🚨 Hủy thi đột xuất │ Toàn trg │ 📱✉📲📳│ ✅Gửi │ 96% │  │
│  │ 5  │ 📚 Sách quá hạn     │ HS Lớp..│ 📱      │ ⚠Lỗi │  —  │  │
│  └────┴──────────────────────┴──────────┴──────────┴───────┴──────┘  │
│  [Xem tất cả] [Lọc nâng cao]                            Trang 1/8   │
└──────────────────────────────────────────────────────────────────────┘
```

### Màn hình Soạn thông báo — Layout (Wizard 4 bước)
```
┌──────────────────────────────────────────────────────────────────────┐
│ Soạn thông báo mới                                        [✕ Đóng]  │
├──────────────────────────────────────────────────────────────────────┤
│  [1. Phân loại] ──→ [2. Nội dung] ──→ [3. Đối tượng] ──→ [4. Kênh] │
│     (active)                                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  BƯỚC 1: Chọn loại thông báo                                         │
│                                                                      │
│  ┌───────────────────┐  ┌───────────────────┐                        │
│  │  📋               │  │  🎓               │                        │
│  │  Thông báo chung  │  │  Thông báo học vụ │                        │
│  │  Tin tức, hoạt    │  │  Điểm, thi, lịch  │                        │
│  │  động nhà trường  │  │  học...            │                        │
│  └───────────────────┘  └───────────────────┘                        │
│                                                                      │
│  ┌───────────────────┐  ┌───────────────────┐                        │
│  │  ⚠️               │  │  📅               │                        │
│  │  Cảnh báo khẩn    │  │  Sự kiện          │                        │
│  │  Ưu tiên cao,     │  │  Có ngày giờ,     │                        │
│  │  badge đỏ         │  │  tích hợp lịch    │                        │
│  └───────────────────┘  └───────────────────┘                        │
│                                                                      │
│                                       [Tiếp theo →]                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Màn hình Bước 3 — Chọn đối tượng — Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│  BƯỚC 3: Chọn đối tượng nhận                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Phạm vi:                       Vai trò nhận:                        │
│  ┌─────────────────────────┐    ☑ Học sinh                           │
│  │ ○ Toàn trường           │    ☑ Giáo viên                          │
│  │ ● Theo khối             │    ☑ Phụ huynh                          │
│  │   ☑ Khối 10             │                                         │
│  │   ☑ Khối 11             │    Số người nhận ước tính:              │
│  │   ○ Khối 12             │    ┌──────────────────────────────┐     │
│  │ ○ Theo lớp              │    │  👥 ~847 người nhận          │     │
│  │ ○ Theo nhóm             │    │  (HS: 712 | GV: 89 | PH: 46) │     │
│  │ ○ Cá nhân               │    └──────────────────────────────┘     │
│  └─────────────────────────┘                                         │
│                                                                      │
│                         [← Quay lại]  [Tiếp theo →]                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Màn hình Mẫu thông báo — Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│ Thư viện mẫu thông báo                            [+ Tạo mẫu mới]   │
├──────────────────────────────────────────────────────────────────────┤
│ [Hệ thống (12)] [Của trường (8)] [Của tôi (3)]   [🔍 Tìm kiếm...]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────┐ ┌────────────────────┐ ┌──────────────────┐ │
│  │ 🔒 Hệ thống        │ │ 🔒 Hệ thống        │ │ 🔒 Hệ thống     │ │
│  │ HS vắng không phép │ │ Kết quả thi        │ │ Học phí đến hạn │ │
│  │ ─────────────────  │ │ ─────────────────  │ │ ──────────────  │ │
│  │ "{{tenPH}}, em     │ │ "HS {{tenHS}},     │ │ "Kính gửi PH   │ │
│  │ {{tenHS}} vắng..." │ │ điểm thi {{mon}}..." │ │ em {{tenHS}}..." │ │
│  │                    │ │                    │ │                 │ │
│  │ [Xem] [Nhân bản]   │ │ [Xem] [Nhân bản]   │ │ [Xem] [Nhân bản]│ │
│  └────────────────────┘ └────────────────────┘ └──────────────────┘ │
│                                                                      │
│  ┌────────────────────┐ ┌────────────────────┐                       │
│  │ ✏️ Của trường       │ │ ✏️ Của tôi          │                       │
│  │ Họp PH định kỳ     │ │ Lịch kiểm tra 15'  │                       │
│  │ ─────────────────  │ │ ─────────────────  │                       │
│  │ "Kính mời PH..."   │ │ "Thông báo lịch..." │                       │
│  │                    │ │                    │                       │
│  │ [Xem][Sửa][Xóa]    │ │ [Xem][Sửa][Xóa]    │                       │
│  └────────────────────┘ └────────────────────┘                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Màn hình Thống kê — Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│ Thống kê hiệu quả thông báo    [Tháng này ▼] [Xuất Excel] [Xuất PDF]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 47       │ │ 18,432   │ │ 72.3%    │ │ 98.7%    │               │
│  │ TBao đã  │ │ Tổng lượt│ │ Tỷ lệ   │ │ Tỷ lệ   │               │
│  │ gửi      │ │ nhận     │ │ đọc TB  │ │ giao TC  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  HIỆU QUẢ THEO KÊNH:                                                 │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ In-app  ████████████████████████████████████  85.7% (3,876)   │  │
│  │ Email   ██████████████████████████            60.3% (2,290)   │  │
│  │ HUE-S   ████████████                          35.6%   (743)   │  │
│  │ SMS     ──── (không đo được tỷ lệ đọc) ────   —              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  XU HƯỚNG TỶ LỆ ĐỌC (4 TUẦN QUA):             TOP 5 TBao đọc nhiều:│
│   100% ┤                                        1. Lịch thi HK  96% │
│    80% ┤    ╭──╮   ╭──╮                         2. Khẩn hủy thi 94% │
│    60% ┤  ╭─╯  ╰───╯  ╰──                       3. Kết quả thi  89% │
│    40% ┤──╯                                      4. Họp PH HK1   84% │
│        └──────────────────                       5. Lịch NV Tết  81% │
│        T1   T2   T3   T4                                             │
└──────────────────────────────────────────────────────────────────────┘
```

### Màn hình Thông báo tự động — Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│ Cấu hình thông báo tự động                          (Chỉ QTHT)      │
├───────────────────────────┬──────────────────────────────────────────┤
│  DANH SÁCH TRIGGERS        │  CHI TIẾT: HS vắng không phép           │
│  ─────────────────────     │  ────────────────────────────────────── │
│  ● HS vắng không phép      │  Điều kiện kích hoạt:                   │
│    [ON ●────]   ✅ Active  │  Loại vắng: ☑Không phép ○Có phép       │
│                            │  Thời điểm: ● Ngay lập tức              │
│  ● Sách quá hạn            │                                          │
│    [ON ●────]   ✅ Active  │  Đối tượng nhận:                        │
│                            │  ☑ Phụ huynh  ☑ GVCN  ○ Học sinh       │
│  ● Kỳ thi sắp tới          │                                          │
│    [ON ●────]   ✅ Active  │  Kênh gửi:                              │
│                            │  ☑ SMS  ☑ In-app  ○ Email  ○ HUE-S    │
│  ● Kết quả thi có          │                                          │
│    [OFF ────○]  ⏸ Tắt     │  Template: [HS vắng không phép ▼]       │
│                            │                                          │
│  ● Học phí đến hạn         │  Giờ hoạt động SMS:                     │
│    [ON ●────]   ✅ Active  │  [07:00] đến [21:00]                    │
│                            │                                          │
│  [+ Thêm trigger mới]      │  [🔬 Test ngay]  [💾 Lưu cấu hình]    │
└───────────────────────────┴──────────────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Tạo thông báo mới | Nút "+ Tạo mới" / Quick Action | Mở wizard soạn thông báo 4 bước |
| Gửi ngay | Bước 4 → "Gửi" | Đẩy vào queue gửi ngay lập tức |
| Hẹn giờ gửi | Bước 4 → chọn date-time → "Lên lịch" | Lên lịch, đếm ngược thời gian |
| Preview thông báo | Nút "Preview" ở bước 4 | Modal xem trước theo từng kênh |
| Xem chi tiết | Click dòng trong lịch sử | Slide-in panel thống kê chi tiết |
| Gửi lại | Button "Gửi lại" trong chi tiết | Gửi cho người chưa nhận/nhận lỗi |
| Hủy lịch hẹn | Button "Hủy" (khi Hẹn giờ) | Hủy, chuyển trạng thái "Đã hủy" |
| Nhân bản | Button "Nhân bản" | Mở wizard với nội dung cũ đã điền sẵn |
| Xóa thông báo | Button "Xóa" (QTHT only) | Xóa khỏi lịch sử (không thu hồi đã gửi) |
| Tạo template | Tab "Mẫu" → "+ Tạo mẫu" | Form soạn template với biến động |
| Sửa template | Nút "Sửa" trên card template | Form chỉnh sửa template |
| Xóa template | Nút "Xóa" trên card template | Xác nhận → xóa (ẩn nếu đang được dùng) |
| Bật/Tắt trigger | Toggle ON/OFF trong "Tự động" | Kích hoạt hoặc tạm dừng rule tự động |
| Test trigger | Nút "Test ngay" | Gửi thử về email/SĐT của QTHT |
| Xuất thống kê | Nút "Xuất Excel/PDF" trong tab Thống kê | Download file báo cáo thống kê |
| Gửi khẩn cấp | Nút "🚨 Thông báo khẩn" | Modal khẩn cấp, yêu cầu xác nhận PIN |
| Xuất danh sách chưa đọc | Button "Xuất Excel" trong chi tiết | Danh sách người chưa đọc để liên hệ |

---

## Gom nhóm tính năng thông minh

Module Thông báo là **lớp truyền thông** (communication layer) kết nối toàn bộ hệ thống với người dùng cuối. Toàn bộ 6 flow được gom vào một module vì chúng đều xoay quanh bài toán trung tâm: **đưa thông tin đúng đến đúng người qua đúng kênh**.

**Lý do gom nhóm**:
- **Thông báo thủ công + Tự động** chia sẻ cùng hạ tầng gửi (queue, gateway, kênh) — việc tách module sẽ gây trùng lặp cấu hình kênh.
- **Template** phục vụ cả thông báo thủ công (Flow 1) lẫn tự động (Flow 3) — tập trung một chỗ dễ bảo trì.
- **Thống kê** phản ánh tổng thể hiệu quả của toàn bộ thông báo (thủ công + tự động + khẩn cấp) — không thể tách ra.
- **Khẩn cấp** về kỹ thuật chỉ là một thông báo ưu tiên cao — tách module sẽ phức tạp hóa không cần thiết.

**Nguyên tắc thiết kế**:
- **Progressive disclosure**: Gửi thông báo đơn giản chỉ cần 3 click (chọn loại → nhập nội dung → gửi); tính năng nâng cao (lên lịch, kênh SMS, thống kê) chỉ xuất hiện khi cần.
- **Fail-safe cho khẩn cấp**: Xác nhận 2 bước (dialog + PIN) tránh gửi nhầm gây hoảng loạn.
- **Cost awareness**: Luôn hiển thị ước tính số lượng SMS + chi phí trước khi gửi để CBQL kiểm soát.

---

## Edge Cases & Validation

**Nội dung & Soạn thảo**:
- Tiêu đề rỗng → Không cho qua bước 2; highlight field đỏ + tooltip "Tiêu đề là bắt buộc".
- Nội dung chứa biến `{{tenHS}}` nhưng không chọn template đúng loại → Cảnh báo: "Biến {{tenHS}} cần dữ liệu cá nhân — hệ thống sẽ điền tên từng người nhận khi gửi. Xác nhận?"
- SMS vượt 160 ký tự sau khi điền biến → Hiển thị "Tin nhắn này sẽ tính là 2 SMS (320 ký tự)" kèm ước tính chi phí tăng gấp đôi.
- Đính kèm file > 10MB trong email → Báo lỗi "File quá lớn, tối đa 10MB. Hãy upload lên Drive và chèn link."

**Đối tượng nhận**:
- Chọn "Toàn trường" nhưng một số HS/GV không có số điện thoại/email → Cảnh báo: "47 người không có thông tin liên hệ cho kênh SMS. Bỏ qua những người này?" [Bỏ qua / Xem danh sách].
- Chọn đối tượng → 0 người nhận (VD: lọc lớp không tồn tại) → Disable nút gửi + thông báo "Không có người nhận nào thỏa điều kiện".
- Gửi cho cá nhân cụ thể nhưng người đó đã nghỉ học / nghỉ việc → Cảnh báo "HS/GV này không còn hoạt động. Vẫn tiếp tục?"

**Gửi & Queue**:
- Mất kết nối SMS gateway trong lúc gửi → Ghi nhận lỗi từng bản tin; retry tự động 3 lần mỗi 5 phút; sau đó chuyển trạng thái "Lỗi một phần" + thông báo cho QTHT.
- Email gateway rate limit (VD: Sendgrid giới hạn 1,000 email/phút) → Hệ thống tự chia nhỏ batch và gửi theo hàng đợi, không block UI.
- Hẹn giờ gửi vào 2:00 AM → Cảnh báo thân thiện: "Bạn đang đặt lịch gửi SMS vào giữa đêm. SMS sẽ được hoãn đến 7:00 AM theo cấu hình 'Giờ hoạt động'."
- Hệ thống restart khi đang gửi hàng loạt → Queue được persist (Redis/DB); tiếp tục gửi từ vị trí dừng sau khi khởi động lại.
- Thông báo khẩn cấp nhấn nhầm → Yêu cầu PIN 4 số trước khi gửi; không có nút "Thu hồi" — chỉ có thể gửi thông báo cải chính.

**Thông báo tự động**:
- Trigger "HS vắng" kích hoạt nhưng GV điểm danh nhầm rồi sửa lại → Nếu sửa trong vòng 5 phút đầu, hệ thống cancel thông báo chưa gửi; nếu đã gửi rồi → không thu hồi, ghi log cho QTHT biết.
- Vòng lặp trigger: Thông báo A kích hoạt sự kiện B lại kích hoạt thông báo A → Hệ thống detect loop và ngắt, alert QTHT.
- Trigger SMS "Học phí đến hạn" gửi nhiều lần cùng một phụ huynh trong ngày → Throttle: Mỗi trigger chỉ gửi tối đa 1 lần/ngày cho mỗi người nhận.

**Template & Biến động**:
- Biến `{{diemThi}}` được dùng trong template nhưng hệ thống chưa có kết quả → Render thành "[Đang cập nhật]" thay vì chuỗi rỗng.
- Xóa template đang được dùng bởi một trigger tự động → Không cho xóa: "Template này đang được dùng bởi rule 'HS vắng không phép'. Hãy gỡ liên kết trước."
- Template của người dùng đã xóa tài khoản → Template được chuyển quyền sở hữu sang QTHT, không bị mất.

**Thống kê**:
- Kênh SMS không hỗ trợ đo tỷ lệ đọc → Cột "Tỷ lệ đọc" hiển thị "—" với tooltip giải thích.
- Dữ liệu "đã đọc" cho HUE-S phụ thuộc API phía HUE-S trả về → Nếu API không hỗ trợ, hiển thị "Không khả dụng" thay vì số sai.
- Báo cáo thống kê tháng quá lớn (> 100,000 bản ghi) → Chạy background job; hiển thị "Đang tổng hợp... Bạn sẽ nhận thông báo khi xong."

---

## Tích hợp

- **SMS Gateway**: VIETTEL SMS / FPT Telecom API / Esms.vn — Gửi SMS brandname (tên trường thay vì số điện thoại lạ); hỗ trợ Unicode tiếng Việt; callback webhook để cập nhật trạng thái giao thành công. Cấu hình trong "Cài đặt hệ thống" → "Tích hợp SMS" (QTHT).
- **Email Gateway**: Sendgrid hoặc SMTP nội bộ; hỗ trợ HTML email template với logo trường; SPF/DKIM để tránh vào spam; tracking pixel để đo open rate (có thể tắt theo chính sách bảo mật). Bounce handling: tự động đánh dấu email không hợp lệ.
- **HUE-S (Ứng dụng công dân Thừa Thiên Huế)**: Tích hợp qua HUE-S Open API — push notification đến tài khoản HUE-S của phụ huynh/học sinh đã liên kết; xác thực bằng OAuth2 token do Sở TT&TT Huế cấp; deep link đến màn hình chi tiết trong HUE-S app.
- **In-app Push Notification**: Firebase Cloud Messaging (FCM) cho Android; APNs cho iOS; Web Push API cho trình duyệt — real-time delivery với badge count; hỗ trợ action buttons trong notification (VD: "Đã đọc" / "Xem chi tiết").
- **Module Điểm danh**: Lắng nghe event `diemdanh.vang_khong_phep` để kích hoạt trigger tự động gửi SMS phụ huynh.
- **Module Thư viện**: Lắng nghe event `thuvien.sach_qua_han` để kích hoạt nhắc nhở học sinh.
- **Module Thi**: Lắng nghe event `thi.lich_thi_tao` (sắp thi) và `thi.ket_qua_nhap` (có kết quả) để kích hoạt thông báo tương ứng.
- **Module Học phí** *(nếu có)*: Lắng nghe event `hocphi.sap_den_han` để kích hoạt nhắc nhở phụ huynh.
- **Message Queue**: RabbitMQ / Redis Queue để xử lý gửi hàng loạt bất đồng bộ, tránh block request; đảm bảo at-least-once delivery với idempotency key tránh gửi trùng.
- **Audit Log**: Mọi hành động (tạo, gửi, hủy, xóa, thay đổi trigger) đều được ghi vào bảng `notification_audit_log` với timestamp, user_id, action, payload — phục vụ tra cứu sự cố và tuân thủ quy định.
- **Quản lý opt-out**: Phụ huynh/học sinh có thể tắt nhận thông báo theo loại (không bắt buộc với Cảnh báo khẩn); hệ thống tôn trọng danh sách opt-out khi gửi hàng loạt (trừ thông báo khẩn cấp).
