# Quản Lý Học Sinh — Role: Admin

## Mục tiêu
Quản lý toàn diện vòng đời học sinh trong hệ thống: tuyển sinh, hồ sơ cá nhân, học bổng, điểm rèn luyện và tốt nghiệp — đảm bảo dữ liệu chính xác, tra cứu nhanh và đồng bộ với Sở GD&ĐT.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền CRUD; import/export hàng loạt; quản lý học bổng; xem và chỉnh sửa điểm rèn luyện; kích hoạt/hủy kích hoạt tài khoản HS; đồng bộ Sở GD.
- **CBQL**: Xem danh sách HS toàn trường; xem & nhận xét điểm rèn luyện; duyệt học bổng; không được xóa HS; không thấy thông tin tài khoản đăng nhập chi tiết.

---

## User Flow Chính

### Flow 1: Tuyển sinh — Nhập danh sách học sinh đầu năm
**Mô tả**: QTHT nhập danh sách tân sinh viên (lớp 10) và HS chuyển lớp/chuyển trường vào hệ thống.
**Trigger**: Menu "Quản lý HS" → Nút **"Import tân sinh viên"** / **"+ Thêm học sinh"**.
**Steps**:
1. **Chọn phương thức nhập**:
   - Import Excel hàng loạt (đợt đầu năm)
   - Nhập tay từng HS (trường hợp đặc biệt / chuyển trường)
   - Đồng bộ từ hệ thống tuyển sinh của Sở GD (nếu có API)
2. **Import Excel**:
   - Download template chuẩn (có sheet hướng dẫn, dropdown gợi ý).
   - Upload file → hệ thống validate: kiểm tra CCCD trùng toàn quốc, email trùng, lớp hợp lệ.
   - Preview: bảng dữ liệu với hàng lỗi highlight, tóm tắt "X hợp lệ / Y lỗi".
   - Admin chọn "Xử lý lỗi ngay" (sửa inline trong preview) hoặc "Bỏ qua lỗi, import hàng hợp lệ".
3. Sau import: tự động tạo tài khoản HS (username: mã HS, mật khẩu tạm = ngày sinh DDMMYYYY).
4. Gửi email thông báo cho phụ huynh (nếu có email) kèm thông tin đăng nhập.
5. Báo cáo kết quả: "Đã import 450 HS | 3 lỗi | 0 trùng lặp".
**Expected Result**: Toàn bộ danh sách tân sinh viên trong hệ thống sau 1 thao tác import, tài khoản sẵn sàng.

---

### Flow 2: Xem & chỉnh sửa hồ sơ học sinh
**Mô tả**: Admin tra cứu và cập nhật thông tin cá nhân, học tập của một học sinh cụ thể.
**Trigger**: Click tên HS trên danh sách / Tìm kiếm bằng thanh search (Ctrl+K).
**Steps**:
1. Trang **Hồ sơ HS** (route: `/admin/hocsinh/:id`) — layout 2 cột.
2. **Cột trái (30%)**: Avatar HS, thông tin nhận dạng nhanh (mã HS, lớp, trạng thái), các action buttons.
3. **Cột phải (70%) — Tabs**:
   - **Thông tin cá nhân**: Họ tên, ngày sinh, giới tính, dân tộc, CCCD, địa chỉ, số điện thoại liên hệ phụ huynh. Tất cả edit-inline.
   - **Học tập**: Lớp hiện tại, lịch sử lớp qua các năm, điểm học kỳ (view-only, do GV nhập), xếp loại học lực.
   - **Rèn luyện**: Điểm rèn luyện từng học kỳ, nhận xét GVCN, nhận xét BGH, xếp loại hạnh kiểm.
   - **Học bổng**: Danh sách học bổng đã nhận, trạng thái, lý do, số tiền.
   - **Chuyên cần**: Thống kê điểm danh (số buổi vắng có phép/không phép), biểu đồ theo tháng.
   - **Tài khoản**: Trạng thái tài khoản, lần đăng nhập cuối, nút reset MK.
   - **Tài liệu**: Ảnh hồ sơ, giấy khai sinh, bằng cấp, đơn từ.
4. Breadcrumb navigation: "HS > Lớp 10A1 > Nguyễn Văn A" với link back.
5. Nút **"In hồ sơ HS"** → PDF học bạ / hồ sơ tuyển sinh đúng mẫu.
**Expected Result**: Toàn bộ thông tin 1 HS trong 1 màn hình; chỉnh sửa nhanh không cần form phức tạp.

---

### Flow 3: Quản lý điểm rèn luyện
**Mô tả**: CBQL/QTHT theo dõi và duyệt điểm rèn luyện cuối kỳ cho toàn trường.
**Trigger**: Menu "QL HS" → Tab **"Điểm rèn luyện"**.
**Steps**:
1. Màn hình hiển thị bảng tổng hợp điểm rèn luyện theo học kỳ, có thể lọc theo lớp/khối.
2. **Trạng thái duyệt**: Chưa nộp (xám) | Đang chờ duyệt (vàng) | Đã duyệt (xanh) | Cần bổ sung (đỏ).
3. CBQL click vào lớp chưa duyệt → bảng điểm của lớp đó mở ra.
4. Review: xem từng HS, so sánh điểm GVCN chấm với tiêu chuẩn.
5. **Duyệt hàng loạt**: Chọn tất cả HS trong lớp đạt yêu cầu → "Duyệt tất cả".
6. Với HS cần xem xét: click vào → nhập nhận xét của BGH → chọn "Duyệt" / "Yêu cầu bổ sung".
7. Sau khi duyệt toàn bộ lớp → tự động gửi thông báo cho GVCN; HS có thể xem kết quả.
8. **Xuất báo cáo**: Danh sách HS theo xếp loại rèn luyện → Excel/PDF trình ký.
**Expected Result**: Quá trình duyệt điểm rèn luyện nhanh, minh bạch; GVCN nhận phản hồi ngay.

---

### Flow 4: Quản lý học bổng
**Mô tả**: CBQL xét duyệt và quản lý học bổng cho học sinh xuất sắc và hoàn cảnh khó khăn.
**Trigger**: Menu "QL HS" → Tab **"Học bổng"**.
**Steps**:
1. Dashboard học bổng: Tổng ngân sách học kỳ | Đã giải ngân | Còn lại | Số HS được học bổng.
2. **Danh sách loại học bổng**: Học bổng khuyến học (top 5% điểm), Học bổng chính sách, Học bổng tài trợ bên ngoài.
3. **Xét duyệt tự động**: Nhấn "Gợi ý HS đủ điều kiện" → hệ thống lọc HS theo tiêu chí đã cấu hình (điểm TB, hạnh kiểm, hoàn cảnh).
4. CBQL review danh sách gợi ý, điều chỉnh nếu cần, bổ sung lý do.
5. Nhấn **"Duyệt danh sách học bổng"** → gửi email thông báo cho HS/phụ huynh.
6. Ghi nhận lịch sử giải ngân (ngày, số tiền, hình thức thanh toán).
7. Xuất **"Quyết định học bổng"** dạng PDF chuẩn để trình ký ban giám hiệu.
**Expected Result**: Quy trình xét học bổng minh bạch, có thể giải trình; HS được thông báo kịp thời.

---

## Tính năng & Màn hình

### Màn hình danh sách HS — Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: Quản lý Học sinh | Tổng: 1,247 HS | [+ Thêm] [Import]   │
├──────────────────────────────────────────────────────────────────┤
│ TABS: [Danh sách] [Điểm rèn luyện] [Học bổng] [Chuyên cần]      │
├──────────────────────────────────────────────────────────────────┤
│ FILTER BAR:                                                        │
│ [Năm học ▼] [Khối ▼] [Lớp ▼] [Giới tính ▼] [Trạng thái ▼]     │
│ [🔍 Tìm tên/mã HS/CCCD...]                                       │
├────────┬────────────┬────────┬──────────┬────────────────────────┤
│ ☐      │ Họ tên HS  │ Mã HS  │ Lớp      │ Học lực | Hạnh kiểm   │
├────────┼────────────┼────────┼──────────┼────────────────────────┤
│ ☐ [Ảnh]│ Nguyễn A  │ HS001  │ 12A1     │ Giỏi    | Tốt          │
│        │            │        │          │ [Xem] [Sửa] [⋮]        │
├────────┴────────────┴────────┴──────────┴────────────────────────┤
│ BULK ACTIONS: Đã chọn 12 HS | [Chuyển lớp][Export][Gửi TB][Xóa] │
└──────────────────────────────────────────────────────────────────┘
```

### Smart Filters nâng cao
- Lọc theo kết quả học tập: Học lực (Giỏi/Khá/TB/Yếu/Kém), điểm TB range
- Lọc theo hạnh kiểm: Tốt/Khá/TB/Yếu
- Lọc theo chuyên cần: Vắng không phép > X buổi
- Lọc theo học bổng: Đang hưởng / Chưa có
- Lọc theo đặc điểm: Dân tộc thiểu số, Hộ nghèo, Con thương binh

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Thêm HS | Nút "+ Thêm" | Drawer form 3 bước |
| Import Excel | Nút "Import" | Modal import với validate |
| Xem hồ sơ | Click tên HS | Trang hồ sơ đầy đủ |
| Sửa thông tin | Edit inline hoặc Drawer | Lưu ngay với toast |
| Chuyển lớp (1 HS) | Menu ⋮ → Chuyển lớp | Modal chọn lớp mới + lý do |
| Chuyển lớp (nhiều HS) | Bulk → Chuyển lớp | Wizard: chọn HS → chọn lớp đích |
| Nghỉ học / Thôi học | Menu ⋮ → Thay đổi trạng thái | Chọn lý do, ngày hiệu lực |
| Reset mật khẩu | Menu ⋮ → Reset MK | Đặt lại về ngày sinh |
| Xuất hồ sơ | Nút "In" trong trang hồ sơ | PDF theo mẫu |
| Đồng bộ Sở GD | Nút "Đồng bộ" | Gửi danh sách HS lên Sở, hiện log |

---

## Gom nhóm tính năng thông minh
Module HS gom **hồ sơ cá nhân + kết quả học tập + rèn luyện + học bổng + tài khoản** vào một nơi. Trong thực tế quản lý, khi xét học bổng, admin cần đồng thời xem điểm học tập VÀ hạnh kiểm VÀ hoàn cảnh gia đình — nếu tách ra 3 module sẽ phải tra cứu chéo liên tục. Dashboard học bổng được nhúng trực tiếp vào module HS (không phải module tài chính riêng) vì học bổng gắn liền với hồ sơ HS.

---

## Edge Cases & Validation
- **HS trùng CCCD**: Block hoàn toàn, hiển thị thông tin HS đã có CCCD đó.
- **Nhập sai ngày sinh**: Validate tuổi hợp lý (14-20 tuổi cho THPT); cảnh báo nếu ngoài range.
- **Xóa HS có điểm**: Soft-delete; cảnh báo "HS có X bài kiểm tra trong hệ thống".
- **Học bổng vượt ngân sách**: Cảnh báo khi tổng học bổng vượt quá ngân sách đã thiết lập.
- **Điểm rèn luyện âm/vượt 100**: Validate range 0-100, block nếu ngoài range.
- **HS thôi học giữa năm**: Tài khoản bị lock, dữ liệu vẫn lưu đủ 5 năm theo quy định.
- **Import HS đã tốt nghiệp**: Cảnh báo "Mã HS này đã tồn tại trong năm học 202X".
- **Email phụ huynh trùng**: Cảnh báo nhưng không block (có thể nhiều HS cùng phụ huynh).
- **Đồng bộ Sở GD thất bại**: Ghi log lỗi; hiển thị danh sách HS chưa đồng bộ được; cho phép retry từng HS.

---

## Tích hợp
- **QL Lớp học**: HS được gán vào lớp → hiển thị trong danh sách lớp; phân lớp ảnh hưởng đến thời khóa biểu.
- **Điểm danh (Chấm công)**: Mã HS & ảnh khuôn mặt → thiết bị nhận diện điểm danh.
- **E-learning**: Tài khoản HS tự động có quyền truy cập các khóa học của lớp mình.
- **Thư viện**: Tạo thẻ thư viện tự động khi tạo HS mới; liên kết mã HS với thẻ.
- **Thi trực tuyến**: HS được đăng ký dự thi tự động dựa trên lớp.
- **HUE-S**: HS và phụ huynh nhận thông báo kết quả, học bổng qua app HUE-S.
- **Đồng bộ Sở GD&ĐT**: Danh sách HS, CCCD, kết quả học tập đồng bộ định kỳ (cuối học kỳ).
- **Email/SMS gateway**: Gửi thông báo học bổng, thông tin tài khoản, nhắc nhở đóng học phí.
