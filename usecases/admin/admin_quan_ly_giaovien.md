# Quản Lý Giáo Viên — Role: Admin

## Mục tiêu
Cung cấp đầy đủ công cụ để QTHT và CBQL quản lý toàn bộ vòng đời của giáo viên trong hệ thống: từ tạo hồ sơ, phân công dạy học, quản lý tài khoản đến theo dõi hoạt động nghiệp vụ — với tốc độ tối ưu cho cả thao tác đơn lẻ lẫn hàng loạt.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền CRUD giáo viên; tạo/reset tài khoản; phân quyền hệ thống cho GV; xem log hoạt động; xóa vĩnh viễn (soft-delete có thể khôi phục).
- **CBQL**: Xem danh sách & hồ sơ GV; chỉnh sửa thông tin công tác (tổ bộ môn, phân công); không thể xóa GV, không thấy thông tin lương/hợp đồng nhạy cảm, không quản lý tài khoản.

---

## User Flow Chính

### Flow 1: Thêm giáo viên mới
**Mô tả**: QTHT nhập hồ sơ giáo viên mới vào hệ thống, tự động tạo tài khoản.
**Trigger**: Nút **"+ Thêm giáo viên"** trên màn hình danh sách hoặc Quick Action Hub.
**Steps**:
1. Drawer (panel bên phải, chiều rộng 40vw) mở ra — không rời trang danh sách.
2. Form **3 bước** (stepper ở đầu drawer):
   - **Bước 1 — Thông tin cơ bản**: Họ tên, ngày sinh, giới tính, CMND/CCCD, số điện thoại, email cá nhân, địa chỉ. Avatar upload (kéo thả ảnh hoặc chụp webcam).
   - **Bước 2 — Thông tin công tác**: Mã GV (tự sinh hoặc nhập tay), ngày vào trường, loại hợp đồng (biên chế/hợp đồng), tổ bộ môn, môn dạy chính, trình độ chuyên môn, chức vụ (GV/Tổ trưởng/Phó HT/HT).
   - **Bước 3 — Tài khoản hệ thống**: Email đăng nhập (tự điền từ email cá nhân), vai trò (GV/CBQL), mật khẩu tạm thời (tự sinh, hiển thị để copy), cấu hình gửi email thông báo.
3. Nút **"Lưu & Gửi thông báo"** → lưu hồ sơ + gửi email chào mừng kèm thông tin đăng nhập.
4. Nút **"Lưu & Thêm tiếp"** → lưu và reset form để nhập GV tiếp theo (cho đợt nhập nhiều GV).
5. Card GV mới xuất hiện đầu danh sách với badge "Mới".
**Expected Result**: Hồ sơ GV được tạo đầy đủ, tài khoản active, GV nhận email thông tin đăng nhập — tất cả trong 1 flow.

---

### Flow 2: Import hàng loạt giáo viên từ Excel
**Mô tả**: Đầu năm học, QTHT import toàn bộ danh sách GV mới từ file Excel.
**Trigger**: Nút **"Import Excel"** trên màn hình danh sách GV.
**Steps**:
1. Modal "Import giáo viên" mở ra với 3 tab: Tải template | Upload file | Kết quả.
2. Tab "Tải template": Download file Excel mẫu với đầy đủ cột và hướng dẫn điền.
3. Tab "Upload file": Kéo thả hoặc browse file Excel (`.xlsx`, tối đa 5MB, tối đa 500 dòng).
4. Hệ thống **parse & validate** ngay trong browser:
   - Hiển thị preview bảng dữ liệu sẽ import (20 dòng đầu + total count).
   - Hàng lỗi được tô đỏ với tooltip giải thích lỗi (thiếu email, trùng mã GV...).
   - Tóm tắt: "450 hàng hợp lệ / 3 hàng lỗi / 2 hàng trùng".
5. Admin chọn xử lý hàng lỗi: Bỏ qua | Ghi đè (nếu là update) | Dừng toàn bộ.
6. Nhấn **"Xác nhận Import"** → Progress bar realtime.
7. Tab "Kết quả": Thống kê đã import, danh sách lỗi export được ra Excel để sửa sau.
**Expected Result**: Import 500 GV trong < 2 phút; lỗi được phát hiện trước khi ghi DB; không mất dữ liệu.

---

### Flow 3: Xem & chỉnh sửa hồ sơ giáo viên
**Mô tả**: Admin xem toàn bộ thông tin GV tại một nơi và chỉnh sửa nhanh.
**Trigger**: Click vào tên GV hoặc icon "Xem hồ sơ" trên row bảng danh sách.
**Steps**:
1. Màn hình **Hồ sơ GV** mở ra (route riêng: `/admin/giaovien/:id`).
2. Layout 2 cột: Cột trái (30%) — avatar, thông tin nhanh, trạng thái hoạt động, các nút action. Cột phải (70%) — tabs chi tiết.
3. **Tabs thông tin**:
   - **Cá nhân**: Thông tin cơ bản, liên hệ, địa chỉ (edit inline, click vào field để sửa).
   - **Công tác**: Tổ bộ môn, phân công dạy hiện tại, lịch sử phân công.
   - **Tài khoản**: Trạng thái tài khoản, vai trò, lần đăng nhập cuối, nút reset MK, nút khóa tài khoản.
   - **Hoạt động**: Lịch sử điểm danh, số buổi dạy trong tháng, các vi phạm (nếu có).
   - **Tài liệu**: Upload & xem văn bằng, hợp đồng, quyết định bổ nhiệm (PDF/ảnh).
4. Chỉnh sửa inline: click vào bất kỳ field nào → input hiện ra → Enter/blur để lưu → toast "Đã lưu".
5. **Action panel bên trái** (QTHT thấy đầy đủ):
   - Gửi thông báo trực tiếp
   - Reset mật khẩu (copy OTP)
   - Khóa / Mở khóa tài khoản
   - Chuyển tổ bộ môn
   - Xóa GV (soft-delete, có confirm)
**Expected Result**: Tất cả thông tin và hành động liên quan đến 1 GV tập trung tại 1 màn hình.

---

### Flow 4: Phân công dạy học
**Mô tả**: CBQL/QTHT phân công GV dạy môn học cho các lớp trong học kỳ.
**Trigger**: Tab "Công tác" trong hồ sơ GV → Nút "Phân công dạy" HOẶC menu "Phân công" → tab "Theo giáo viên".
**Steps**:
1. Màn hình phân công hiển thị 2 cột: Danh sách lớp + môn cần GV (trái) và GV đang được gán (phải).
2. Kéo thả hoặc chọn từ dropdown: Gán GV X dạy Môn Y tại Lớp Z, Học kỳ N.
3. Hệ thống **kiểm tra xung đột** realtime: nếu GV đã có tiết học trùng giờ → cảnh báo vàng.
4. Nút **"Tự động phân công"** (AI suggest): hệ thống gợi ý phân công tối ưu dựa trên chuyên môn GV và tải dạy hiện tại.
5. Nhấn **"Lưu phân công"** → broadcast thông báo đến GV được phân công.
6. Xuất **"Danh sách phân công"** ra Excel/PDF để trình ký.
**Expected Result**: Phân công học kỳ hoàn chỉnh với ít xung đột nhất; GV nhận thông báo tự động.

---

## Tính năng & Màn hình

### Màn hình danh sách GV — Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: Quản lý Giáo viên | Tổng: 87 GV | [+ Thêm] [Import]    │
├──────────────────────────────────────────────────────────────────┤
│ FILTER BAR:                                                       │
│ [Tổ bộ môn ▼] [Trạng thái ▼] [Loại HĐ ▼] [🔍 Tìm tên/mã GV]  │
├──────────┬───────────┬────────────┬──────────┬──────────────────┤
│ Họ tên   │ Mã GV    │ Tổ bộ môn  │ Môn dạy  │ Trạng thái      │
├──────────┼───────────┼────────────┼──────────┼──────────────────┤
│ ☐ [Ảnh] │ GV001    │ Toán       │ Đại số   │ 🟢 Đang dạy     │
│ Nguyễn A │           │            │           │ [Xem] [Sửa] [⋮] │
├──────────┼───────────┼────────────┼──────────┼──────────────────┤
│ ...      │ ...       │ ...        │ ...      │ ...              │
├──────────┴───────────┴────────────┴──────────┴──────────────────┤
│ BULK ACTIONS (hiện khi chọn ≥1 row):                            │
│ Đã chọn: 5 GV | [Gán tổ BM] [Gửi thông báo] [Export] [Xóa]    │
└──────────────────────────────────────────────────────────────────┘
```

### View modes
- **Bảng** (mặc định): Thông tin rõ ràng, sort/filter đầy đủ
- **Card Grid**: Avatar lớn, thông tin tóm tắt, phù hợp xem tổng thể
- **Theo tổ**: Gom nhóm theo tổ bộ môn (collapsible groups)

### Smart Filters
- Tổ bộ môn (multi-select)
- Trạng thái: Đang dạy / Nghỉ phép / Nghỉ thai sản / Nghỉ hưu / Đã nghỉ việc
- Loại hợp đồng: Biên chế / Hợp đồng / Thỉnh giảng
- Năm vào trường (range slider)
- Môn dạy (multi-select)
- Tìm kiếm full-text: tên, mã GV, số điện thoại, email

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Xem hồ sơ | Click tên GV | Mở trang hồ sơ đầy đủ |
| Sửa nhanh | Nút "Sửa" trên row | Drawer chỉnh sửa inline |
| Đổi tổ bộ môn | Dropdown inline trong bảng | Cập nhật ngay không cần reload |
| Reset mật khẩu | Menu ⋮ → Reset MK | Copy OTP, tự hết hạn sau 24h |
| Khóa tài khoản | Menu ⋮ → Khóa | GV không đăng nhập được; email thông báo |
| Gửi thông báo | Checkbox + "Gửi TB" | Modal soạn tin + gửi cho danh sách đã chọn |
| Export danh sách | Nút "Export" | Excel với cột tùy chỉnh |
| In hồ sơ GV | Trong trang hồ sơ | PDF chuẩn in hồ sơ nhân sự |
| Xóa GV | Menu ⋮ → Xóa | Soft-delete, có thể khôi phục trong 30 ngày |

---

## Gom nhóm tính năng thông minh
Module GV gom **hồ sơ nhân sự + tài khoản hệ thống + phân công dạy** vào một nơi thay vì để riêng ở HR system, User Management và Timetable. Lý do: người quản lý thường cần thực hiện cả 3 việc này cùng lúc (ví dụ: nhận GV mới → tạo hồ sơ → tạo tài khoản → phân công ngay). Việc tách rời gây ra việc phải di chuyển qua nhiều màn hình và nguy cơ quên bước nào đó.

---

## Edge Cases & Validation
- **Email trùng**: Không cho tạo 2 GV cùng email đăng nhập; gợi ý "email này đã thuộc về [tên GV]".
- **Mã GV trùng**: Validate realtime khi gõ, block submit nếu trùng.
- **Xóa GV đang dạy**: Cảnh báo "GV này đang phụ trách X lớp. Hãy phân công GV thay thế trước". Block xóa.
- **Import trùng email**: Nếu email đã tồn tại, hỏi "Cập nhật thông tin" hay "Bỏ qua".
- **GV không có tổ bộ môn**: Vẫn lưu được nhưng hiển thị badge "Chưa phân tổ" màu vàng.
- **Ảnh đại diện**: Resize về 200×200px, nén JPEG 80%, từ chối file > 5MB hoặc không phải ảnh.
- **Reset mật khẩu**: OTP chỉ dùng được 1 lần, hết hạn sau 24h, không hiển thị lại sau khi đóng modal.
- **Xem log đăng nhập**: Chỉ QTHT thấy; CBQL không thấy tab "Tài khoản" trong hồ sơ GV.
- **GV kiêm nhiệm CBQL**: Một người dùng có thể có 2 role (GV + CBQL); hiển thị badge role đặc biệt.
- **Số điện thoại**: Validate định dạng VN (10 số, bắt đầu 0); warning nếu trùng với GV khác.

---

## Tích hợp
- **QL Lớp học**: GV được phân công → xuất hiện trong danh sách GVCN/GV bộ môn của lớp.
- **Chấm công**: Mã GV liên kết với thiết bị chấm công và camera nhận diện khuôn mặt.
- **E-learning**: Tài khoản GV có quyền tạo khóa học, giao bài tập trong module E-learning.
- **Thi trực tuyến**: GV được phân công làm giám thị, chấm bài.
- **Email gateway**: Gửi email chào mừng, thông báo lịch dạy, reset mật khẩu.
- **SSO**: Tài khoản GV đồng bộ với hệ thống SSO của trường (LDAP/OAuth2).
- **Đồng bộ Sở GD**: Danh sách GV, mã định danh, trình độ chuyên môn đồng bộ lên hệ thống Sở định kỳ.
- **HUE-S**: GV có thể nhận thông báo từ trường qua app HUE-S.
