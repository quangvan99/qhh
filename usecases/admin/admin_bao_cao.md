# Dashboard Báo Cáo Tổng Hợp — Role: Admin

## Mục tiêu
Cung cấp cho CBQL và QTHT một trung tâm báo cáo thống nhất: tổng hợp dữ liệu từ tất cả module, tạo báo cáo theo nhiều chiều phân tích, xuất ra nhiều định dạng và chia sẻ lên HUE-S/email cho các cấp quản lý — giúp ban giám hiệu ra quyết định dựa trên dữ liệu.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền xem mọi báo cáo, cấu hình báo cáo định kỳ tự động, xuất dữ liệu thô (raw data), chia sẻ báo cáo lên HUE-S, truy cập báo cáo nhạy cảm (lương, cá nhân GV).
- **CBQL**: Xem báo cáo cấp trường và cấp lớp; xuất Excel/PDF; chia sẻ báo cáo lên HUE-S; không xem báo cáo nhân sự chi tiết; không truy cập dữ liệu thô.

---

## User Flow Chính

### Flow 1: Xem báo cáo tổng hợp theo yêu cầu nhanh
**Mô tả**: CBQL cần nhanh chóng tạo báo cáo để chuẩn bị họp Ban giám hiệu.
**Trigger**: Menu "Báo cáo" → Landing page hoặc Quick Action "Xuất báo cáo".
**Steps**:
1. Màn hình **"Trung tâm báo cáo"** hiển thị:
   - **Báo cáo nhanh** (Quick Reports): 8 tile lớn với các báo cáo hay dùng nhất:
     - "Điểm danh hôm nay" | "Kết quả học kỳ" | "Tình trạng thư viện"
     - "Tiến độ E-learning" | "Kết quả kỳ thi gần nhất" | "Thống kê HS/GV"
     - "Báo cáo nộp Sở GD" | "Xuất dữ liệu tùy chỉnh"
2. Click vào tile "Điểm danh hôm nay" → Hệ thống tự fetch data mới nhất, hiển thị preview báo cáo ngay.
3. **Tinh chỉnh nhanh** (không cần vào filter phức tạp):
   - Dropdown thay đổi phạm vi: Hôm nay / Tuần này / Tháng này / Học kỳ / Năm học / Tùy chỉnh.
   - Dropdown phạm vi: Toàn trường / Khối 10 / Khối 11 / Khối 12 / Lớp cụ thể.
4. Báo cáo cập nhật real-time theo filter.
5. Nút **"Xuất PDF"** / **"Xuất Excel"** / **"Gửi Email"** / **"Chia sẻ HUE-S"** ở header báo cáo.
**Expected Result**: Báo cáo sẵn sàng xuất trong < 1 phút mà không cần cấu hình phức tạp.

---

### Flow 2: Tạo báo cáo tùy chỉnh (Custom Report Builder)
**Mô tả**: CBQL tạo báo cáo theo yêu cầu đặc biệt không có trong template sẵn.
**Trigger**: Tile "Xuất dữ liệu tùy chỉnh" hoặc Tab "Báo cáo tùy chỉnh".
**Steps**:
1. Màn hình **Report Builder** — giao diện kéo thả:
   - **Bước 1**: Chọn nguồn dữ liệu (Data Source): Học sinh | Giáo viên | Điểm danh | Thư viện | E-learning | Kết quả thi.
   - **Bước 2**: Chọn cột hiển thị: Kéo thả từ danh sách field vào vùng "Cột báo cáo".
   - **Bước 3**: Cài bộ lọc (Filters): thêm điều kiện lọc (AND/OR) dạng wizard đơn giản.
   - **Bước 4**: Cài sắp xếp và gom nhóm (Group by lớp, khối...).
   - **Bước 5**: Chọn định dạng hiển thị: Bảng | Biểu đồ cột | Biểu đồ tròn | Biểu đồ đường.
2. **Preview live**: Bên phải màn hình hiển thị preview báo cáo cập nhật khi thay đổi config.
3. Nhấn **"Lưu mẫu báo cáo"** → đặt tên → xuất hiện trong Quick Reports.
4. Nhấn **"Xuất ngay"** → chọn định dạng → download.
5. Nhấn **"Lên lịch tự động"** → cấu hình gửi báo cáo này định kỳ (xem Flow 3).
**Expected Result**: Admin có thể tạo bất kỳ loại báo cáo nào mà không cần lập trình.

---

### Flow 3: Cấu hình báo cáo định kỳ tự động
**Mô tả**: QTHT thiết lập báo cáo tự động gửi định kỳ cho BGH và các bên liên quan.
**Trigger**: Tab **"Báo cáo định kỳ"** hoặc từ Report Builder → "Lên lịch tự động".
**Steps**:
1. Danh sách báo cáo định kỳ đang chạy (tên, tần suất, người nhận, lần gửi cuối, trạng thái).
2. Nút **"+ Tạo báo cáo định kỳ"** → Wizard:
   - Chọn mẫu báo cáo (từ Quick Reports hoặc Custom Report đã lưu).
   - **Tần suất**: Hàng ngày | Hàng tuần (chọn ngày trong tuần) | Hàng tháng | Đầu học kỳ | Cuối học kỳ | Tùy chỉnh (cron expression cho QTHT nâng cao).
   - **Người nhận**: Danh sách email/HUE-S (có thể thêm nhiều; có thể chọn từ danh sách GV/CBQL).
   - **Định dạng**: PDF đính kèm email | Link xem online | Excel đính kèm.
   - **Tiêu đề & nội dung email mẫu**: Có thể dùng biến động ({{date}}, {{schoolName}}, {{reportName}}).
3. Nút **"Gửi thử ngay"** → Gửi 1 bản cho admin để kiểm tra.
4. Lưu → báo cáo định kỳ hoạt động.
5. Toggle on/off để tạm dừng không cần xóa.
**Expected Result**: Ban giám hiệu nhận báo cáo định kỳ vào hộp thư mà không cần ai làm thủ công.

---

### Flow 4: Chuẩn bị báo cáo nộp Sở GD&ĐT
**Mô tả**: QTHT tạo báo cáo định kỳ theo mẫu quy định của Sở GD để nộp đúng hạn.
**Trigger**: Tab "Báo cáo Sở GD" hoặc Tile "Báo cáo nộp Sở GD".
**Steps**:
1. Danh sách các loại báo cáo theo mẫu Sở GD:
   - Báo cáo tuyển sinh đầu năm (Biểu 1)
   - Thống kê chất lượng học kỳ (Biểu 2, 3)
   - Danh sách GV theo trình độ (Biểu 4)
   - Báo cáo chuyên cần HS (Biểu 5)
   - Kết quả tốt nghiệp lớp 12 (Biểu 6)
2. Click vào biểu mẫu → Hệ thống tự điền dữ liệu từ database vào đúng ô theo mẫu.
3. Preview báo cáo trước khi xuất → Admin kiểm tra, chỉnh sửa tay nếu cần.
4. Xuất ra **Excel đúng mẫu Bộ/Sở** (không tự chỉnh sửa format — tránh bị trả lại).
5. Nút **"Gửi lên hệ thống Sở GD"** (nếu có API đồng bộ) hoặc "Tải về để nộp thủ công".
6. Ghi nhận ngày xuất/nộp báo cáo → dùng để track deadline.
**Expected Result**: Báo cáo Sở được tạo đúng mẫu trong < 5 phút thay vì mất cả ngày.

---

## Tính năng & Màn hình

### Màn hình Trung tâm Báo cáo — Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ HEADER: Báo Cáo & Thống Kê | [Lịch sử xuất] [Báo cáo định kỳ]    │
├────────────────────────────────────────────────────────────────────┤
│ TABS: [Báo cáo nhanh] [Tùy chỉnh] [Định kỳ] [Sở GD] [Lịch sử]   │
├────────────────────────────────────────────────────────────────────┤
│ Tab "Báo cáo nhanh":                                               │
│                                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│  │ 📊           │ │ 📋           │ │ 📚           │ │ 🎓      │ │
│  │ Điểm danh    │ │ Kết quả      │ │ Thư viện     │ │ E-learn │ │
│  │ hôm nay      │ │ học kỳ       │ │ tháng này    │ │ tiến độ │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ │
│                                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│  │ 📝           │ │ 👥           │ │ 📤           │ │ ⚙️      │ │
│  │ Kết quả thi  │ │ Thống kê     │ │ Báo cáo Sở   │ │ Tùy     │ │
│  │ gần nhất     │ │ HS/GV        │ │ GD&ĐT        │ │ chỉnh   │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Màn hình xem báo cáo (Preview panel)
```
┌────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO: Điểm danh toàn trường                                    │
│ FILTER: [Hôm nay ▼] [Toàn trường ▼] | [⟳ Cập nhật]               │
│ ACTIONS: [📥 Excel] [📄 PDF] [✉ Email] [📱 HUE-S] [⏰ Lên lịch]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  PHẦN HIỂN THỊ BÁOCÁO (render html/chart trong khung này)        │
│                                                                    │
│  KPI: 1,089/1,247 HS có mặt (87.3%) | 158 vắng | 42 vắng có phép │
│                                                                    │
│  Biểu đồ: Tỷ lệ điểm danh theo lớp                               │
│  Bảng: Danh sách vắng theo lớp (HS vắng, lý do)                  │
└────────────────────────────────────────────────────────────────────┘
```

### Danh sách báo cáo nhanh có sẵn

**Module Học vụ**:
- Thống kê HS theo khối/lớp/giới tính/dân tộc
- Học lực & hạnh kiểm theo học kỳ
- Danh sách học sinh xuất sắc / học sinh yếu kém
- Học bổng theo học kỳ
- Số liệu tuyển sinh

**Module Chấm công**:
- Điểm danh hôm nay (tổng hợp + chi tiết lớp)
- Báo cáo vắng mặt tuần/tháng
- Thống kê chuyên cần GV
- Danh sách HS vắng không phép > X buổi

**Module Thư viện**:
- Tình trạng mượn sách hiện tại
- Sách quá hạn chưa trả
- Top sách được mượn nhiều nhất
- Thống kê đầu sách theo thể loại

**Module E-learning**:
- Tiến độ học tập theo lớp/môn
- HS chưa hoàn thành nội dung
- Tỷ lệ tham gia học online

**Module Thi**:
- Kết quả kỳ thi theo lớp
- Phân phối điểm
- Thống kê tỷ lệ đạt/không đạt

### Actions
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Xuất Excel | Nút "📥 Excel" | Download xlsx với định dạng đẹp |
| Xuất PDF | Nút "📄 PDF" | PDF A4 portrait/landscape |
| Gửi Email | Nút "✉ Email" | Modal nhập địa chỉ, đính kèm file |
| Chia sẻ HUE-S | Nút "📱 HUE-S" | Push báo cáo dạng card lên HUE-S |
| Lên lịch tự động | Nút "⏰ Lên lịch" | Wizard tạo báo cáo định kỳ |
| Lưu mẫu báo cáo | Nút "💾 Lưu mẫu" | Lưu vào Quick Reports cá nhân |
| In trực tiếp | Nút "🖨 In" | Print dialog trình duyệt |
| Xem lịch sử xuất | Tab "Lịch sử" | Danh sách file đã xuất + download lại |
| Đặt báo cáo làm default | Right-click tile → Pin | Hiển thị đầu tiên trong Quick Reports |

---

## Gom nhóm tính năng thông minh
Module Báo cáo là **lớp tổng hợp** (aggregation layer) đứng trên tất cả module khác. Gom "báo cáo nhanh + tùy chỉnh + định kỳ + Sở GD" vào một nơi vì mục tiêu chung là **xuất thông tin ra bên ngoài hệ thống** (cho lãnh đạo, Sở GD, HUE-S). CBQL không cần vào từng module để tìm số liệu — module này tập hợp và trình bày theo đúng format cần thiết. Điểm mấu chốt: báo cáo nhanh chỉ cần 1 click, còn báo cáo tùy chỉnh không yêu cầu kiến thức SQL hay lập trình.

---

## Edge Cases & Validation
- **Dữ liệu chưa đầy đủ**: Nếu GV chưa nhập điểm HK → báo cáo kết quả học kỳ hiển thị "X lớp chưa có dữ liệu" thay vì số sai.
- **Báo cáo quá lớn** (> 10,000 dòng): Tự động paginate khi export Excel; không mở trên browser.
- **Timeout khi generate báo cáo nặng**: Chạy background job; user nhận thông báo khi file sẵn sàng (email + in-app notification).
- **Xuất PDF với font tiếng Việt**: Đảm bảo embed font; test trên mọi OS trước khi deploy.
- **Báo cáo định kỳ gửi thất bại**: Retry 3 lần; sau đó email alert cho QTHT.
- **Người dùng thay đổi trong khi xuất báo cáo**: Timestamp báo cáo ghi rõ "Dữ liệu tại thời điểm DD/MM/YYYY HH:MM".
- **CBQL xem báo cáo nhạy cảm**: Row-level security — lọc dữ liệu theo quyền trước khi hiển thị.
- **Lịch sử xuất báo cáo**: Lưu 90 ngày; QTHT có thể download lại file cũ (tránh mất file khi máy tính hỏng).
- **Mẫu báo cáo Sở GD thay đổi**: Mẫu báo cáo là file cấu hình (JSON mapping), QTHT có thể cập nhật mapping mà không cần deploy code mới.
- **Chia sẻ HUE-S thất bại**: Ghi log lỗi, thông báo cho admin; offer xuất PDF thay thế.

---

## Tích hợp
- **Tất cả module**: Báo cáo kéo dữ liệu từ tất cả 4 khối (Đào tạo, Thư viện, E-learning, Chấm công) thông qua Reporting API riêng (read-only replica để không ảnh hưởng performance hệ thống chính).
- **HUE-S**: API tích hợp HUE-S để đẩy báo cáo dạng card/post lên ứng dụng công dân Huế.
- **Sở GD&ĐT**: API đồng bộ dữ liệu theo mẫu quy định; authentication bằng token do Sở cấp.
- **Email gateway**: Sendgrid/SMTP để gửi báo cáo định kỳ với file đính kèm.
- **PDF renderer**: Puppeteer (headless Chrome) render HTML → PDF; WeasyPrint như backup.
- **Excel engine**: Apache POI (Java) hoặc ExcelJS (Node.js) với template-based generation.
- **BI Tools**: Hỗ trợ export data source cho Google Looker Studio / Power BI (CSV/JSON API) cho các trường có nhu cầu phân tích sâu.
- **Data warehouse**: Dữ liệu báo cáo được đẩy vào DW (nếu có) để phân tích lịch sử dài hạn.
