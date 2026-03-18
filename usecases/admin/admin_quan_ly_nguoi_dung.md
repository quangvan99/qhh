# Quản Lý Tài Khoản Người Dùng Hệ Thống — Role: Admin

## Mục tiêu
Quản lý toàn diện tài khoản đăng nhập (account) của tất cả người dùng trong hệ thống — bao gồm giáo viên, cán bộ quản lý, thủ thư, học sinh — đảm bảo phân quyền chính xác, bảo mật tài khoản, tra cứu nhanh và kiểm soát lịch sử hoạt động.

> **Lưu ý phân biệt**: Module này quản lý **tài khoản hệ thống (login account)**, không phải hồ sơ nghiệp vụ. Thông tin chuyên môn của giáo viên xem ở "QL Giáo viên"; hồ sơ học sinh xem ở "QL Học sinh".

## Người dùng & Quyền hạn
- **QTHT (Quản trị hệ thống)**: Toàn quyền CRUD tài khoản; import/export hàng loạt; reset mật khẩu bất kỳ tài khoản; khóa/mở khóa tài khoản; gán/gỡ vai trò; xem lịch sử đăng nhập toàn hệ thống.
- **CBQL (Cán bộ quản lý)**: Xem danh sách tài khoản toàn trường; xem thông tin cơ bản; không được tạo/xóa tài khoản; không được reset mật khẩu; không được thay đổi vai trò; không thấy chi tiết lịch sử đăng nhập IP.

---

## User Flow Chính

### Flow 1: Xem danh sách tài khoản người dùng
**Mô tả**: QTHT/CBQL tra cứu, lọc, tìm kiếm toàn bộ tài khoản đăng nhập trong hệ thống theo nhiều tiêu chí.
**Trigger**: Menu "Quản lý người dùng" → Tab **"Danh sách tài khoản"**.
**Steps**:
1. Màn hình hiển thị DataTable tài khoản (phân trang, mặc định 25 dòng/trang).
2. **Header summary**: Tổng tài khoản | Đang hoạt động | Đang bị khóa | Chưa đăng nhập lần nào.
3. **Filter bar** (kết hợp multi-select):
   - **Vai trò**: Tất cả / Giáo viên / CBQL / Thủ thư / Học sinh / QTHT.
   - **Đơn vị/Tổ bộ môn**: Dropdown phân cấp (tổ chuyên môn, lớp, phòng ban).
   - **Trạng thái**: Tất cả / Đang hoạt động / Bị khóa / Chưa kích hoạt.
   - **Ngày tạo**: Khoảng thời gian (date range picker).
   - **Đăng nhập gần nhất**: Trong 7 ngày / 30 ngày / Chưa bao giờ.
4. Thanh tìm kiếm nhanh (Ctrl+K): tìm theo username, họ tên, email, số điện thoại.
5. Mỗi dòng hiển thị: Avatar | Họ tên | Username | Email | Vai trò (badge màu) | Đơn vị | Trạng thái | Đăng nhập cuối | Actions.
6. Click tên → mở trang chi tiết tài khoản.
7. Sort được tất cả cột; nhớ trạng thái filter khi quay lại trang.
**Expected Result**: Tra cứu nhanh bất kỳ tài khoản, lọc theo nhiều tiêu chí kết hợp, thấy ngay trạng thái hoạt động.

---

### Flow 2: Thêm mới tài khoản
**Mô tả**: QTHT tạo tài khoản đăng nhập mới cho một cá nhân (giáo viên mới vào trường, học sinh chuyển đến, nhân viên mới...).
**Trigger**: Nút **"+ Thêm tài khoản"** ở góc phải header màn hình danh sách.
**Steps**:
1. Mở **Drawer** từ bên phải (không chuyển trang), chia làm 2 cột.
2. **Bước 1 — Thông tin cơ bản**:
   - **Username** (bắt buộc): Gợi ý tự động theo pattern cấu hình (vd: `gv.nguyenvana`, `hs.12a1.001`); kiểm tra trùng real-time (debounce 500ms); chỉ chứa chữ thường, số và dấu chấm/gạch dưới.
   - **Họ và tên đệm** + **Tên** (bắt buộc): 2 field riêng để sắp xếp theo tên đúng.
   - **Email** (bắt buộc): Validate format; kiểm tra trùng; nếu trùng hiện cảnh báo "Email đã được dùng bởi [tên tài khoản]".
   - **Số điện thoại** (tùy chọn): Validate 10 số, bắt đầu 0.
3. **Bước 2 — Phân quyền**:
   - **Vai trò** (bắt buộc): Dropdown + radio button — Học sinh / Giáo viên / CBQL / Thủ thư / QTHT. Chọn vai trò sẽ tự động gợi ý các field phù hợp ở bước 3.
   - **Đơn vị** (bắt buộc): Dropdown phân cấp — chọn tổ bộ môn (nếu là GV), chọn lớp (nếu là HS), chọn phòng ban (nếu là CBQL/NV).
   - **Liên kết hồ sơ** (tùy chọn): Tìm kiếm và liên kết với hồ sơ nghiệp vụ đã có (tìm theo tên/mã — link đến hồ sơ GV hoặc HS tương ứng).
4. **Bước 3 — Mật khẩu**:
   - **Mật khẩu ban đầu**: Nhập thủ công hoặc nhấn **"Tạo ngẫu nhiên"** (12 ký tự, có chữ hoa/thường/số/ký tự đặc biệt).
   - **Bắt buộc đổi mật khẩu lần đăng nhập đầu**: Checkbox, mặc định bật.
   - **Gửi thông tin tài khoản qua email**: Checkbox — nếu bật sẽ gửi email chào mừng kèm username + link đổi mật khẩu.
5. Nhấn **"Tạo tài khoản"** → hệ thống validate toàn bộ → tạo tài khoản → đóng drawer → toast "Đã tạo tài khoản [username]" → làm mới danh sách.
6. Nếu có lỗi validation: highlight field lỗi, cuộn đến lỗi đầu tiên, không đóng drawer.
**Expected Result**: Tài khoản mới sẵn sàng đăng nhập, người dùng nhận email (nếu chọn), admin không cần rời trang danh sách.

---

### Flow 3: Import tài khoản hàng loạt từ Excel
**Mô tả**: QTHT tạo nhiều tài khoản cùng lúc từ file Excel (điển hình: đầu năm học mới, nhập học sinh/giáo viên mới hàng loạt).
**Trigger**: Nút **"Import"** → chọn **"Import tài khoản từ Excel"**.
**Steps**:
1. **Wizard gồm 4 bước** hiển thị trong Modal kích thước lớn (90vw):

   **Bước 1 — Tải file mẫu**:
   - Giới thiệu tính năng, hướng dẫn ngắn.
   - Nút **"Tải file mẫu (.xlsx)"** — file mẫu gồm 2 sheet: `Dữ liệu` (có header + 3 dòng ví dụ) và `Hướng dẫn` (giải thích từng cột, quy tắc nhập, danh sách vai trò hợp lệ).
   - Hiển thị các cột bắt buộc: `ho_ten`, `username`, `email`, `vai_tro`, `don_vi`; cột tùy chọn: `so_dien_thoai`, `mat_khau`.
   - Nút "Tiếp theo →".

   **Bước 2 — Upload file**:
   - Khu vực drag & drop hoặc nút chọn file; chỉ nhận `.xlsx` / `.xls`, tối đa 5MB.
   - Thanh progress upload.
   - Sau khi upload: hiển thị preview nhanh "Phát hiện X dòng dữ liệu, đang phân tích...".
   - Nút "← Quay lại" | "Phân tích →".

   **Bước 3 — Validate & Preview lỗi**:
   - Bảng preview toàn bộ dữ liệu; các dòng lỗi highlight màu đỏ, dòng cảnh báo màu vàng, dòng hợp lệ màu xanh nhạt.
   - **Panel tóm tắt** bên phải: `X dòng hợp lệ` | `Y dòng lỗi` | `Z dòng trùng lặp (sẽ bỏ qua)`.
   - **Chi tiết lỗi** từng dòng: Tooltip hoặc cột "Lỗi" mô tả rõ — vd: "Username đã tồn tại", "Email sai định dạng", "Vai trò không hợp lệ", "Đơn vị không tìm thấy".
   - **Tùy chọn xử lý lỗi**:
     - `Chỉ import dòng hợp lệ, bỏ qua lỗi`
     - `Dừng lại, tôi muốn sửa file trước`
   - Nút **"Xuất danh sách lỗi (.xlsx)"** để admin tải về sửa ngoài.
   - Nút "← Quay lại" | "Xác nhận import →".

   **Bước 4 — Import & Kết quả**:
   - Thanh progress import theo thời gian thực ("Đang tạo tài khoản 45/200...").
   - Kết quả cuối: `✓ Đã tạo 195 tài khoản` | `✗ 5 dòng bị lỗi (chi tiết bên dưới)`.
   - Tùy chọn: **"Gửi email thông báo cho tất cả tài khoản vừa tạo"** (checkbox, kèm preview nội dung email).
   - Nút **"Xuất báo cáo kết quả"** | **"Đóng"**.
2. Mật khẩu mặc định khi import (nếu cột `mat_khau` để trống):
   - Học sinh: ngày sinh DDMMYYYY (lấy từ hồ sơ liên kết) hoặc `Abc@12345` nếu không có ngày sinh.
   - Giáo viên/nhân viên: tự sinh ngẫu nhiên 10 ký tự.
   - Tất cả đều bật cờ "bắt buộc đổi mật khẩu lần đầu".
**Expected Result**: Hàng trăm tài khoản được tạo trong vài phút; lỗi được báo cáo rõ ràng; admin biết chính xác kết quả.

---

### Flow 4: Chỉnh sửa thông tin tài khoản
**Mô tả**: QTHT cập nhật thông tin cơ bản của một tài khoản (họ tên, email, SĐT, đơn vị — không phải mật khẩu, mật khẩu có flow riêng).
**Trigger**: Nút **"Sửa"** (icon bút) trên dòng danh sách, hoặc nút **"Chỉnh sửa thông tin"** trong trang chi tiết tài khoản.
**Steps**:
1. Mở **Drawer** chỉnh sửa từ bên phải (hoặc edit-inline trong trang chi tiết), pre-fill toàn bộ thông tin hiện tại.
2. Các field có thể chỉnh sửa:
   - Họ tên, email, số điện thoại.
   - Đơn vị/Tổ bộ môn (thay đổi đơn vị sẽ cảnh báo nếu ảnh hưởng quyền truy cập).
   - Ảnh đại diện (upload ảnh mới hoặc xóa).
   - Ghi chú nội bộ (chỉ QTHT thấy).
3. **Không được chỉnh sửa trực tiếp**: Username (xem thêm edge case), vai trò (có flow riêng — Flow 7), mật khẩu (Flow 5).
4. Thay đổi email: Gửi xác nhận đến email mới trước khi có hiệu lực; email cũ vẫn dùng được đến khi xác nhận.
5. Nhấn **"Lưu thay đổi"** → validate → lưu → toast "Đã cập nhật tài khoản [username]" → đóng drawer.
6. Lịch sử thay đổi: Mỗi lần sửa được ghi log (ai sửa, sửa gì, lúc nào) — xem trong tab "Lịch sử" của trang chi tiết.
**Expected Result**: Thông tin tài khoản cập nhật ngay, có audit log đầy đủ, không ảnh hưởng phiên đăng nhập hiện tại.

---

### Flow 5: Đổi / Reset mật khẩu
**Mô tả**: QTHT đặt lại mật khẩu cho người dùng khác (khi họ quên, hoặc yêu cầu bảo mật), hoặc reset hàng loạt từ Excel.
**Trigger**:
- Đơn lẻ: Menu **⋮** trên dòng danh sách → **"Reset mật khẩu"** / Hoặc trong trang chi tiết tài khoản → Tab "Bảo mật" → nút **"Reset mật khẩu"**.
- Hàng loạt: Chọn nhiều tài khoản → **"Reset mật khẩu hàng loạt"** / Hoặc **"Import"** → **"Reset mật khẩu từ Excel"**.
**Steps**:

**A. Reset đơn lẻ**:
1. Modal xác nhận mở ra, hiển thị tên & username tài khoản cần reset.
2. **Phương thức mật khẩu mới**:
   - `Tự sinh ngẫu nhiên` (mặc định, hiển thị preview mật khẩu sẽ được tạo).
   - `Nhập mật khẩu cụ thể` (hiện field nhập + strength indicator).
   - `Đặt lại về mặc định theo cấu hình` (vd: ngày sinh, mã HS...).
3. **Tùy chọn sau reset**:
   - ☑ Bắt buộc đổi mật khẩu khi đăng nhập lần tới (mặc định bật).
   - ☑ Gửi mật khẩu mới qua email cho người dùng.
   - ☑ Ngắt kết nối tất cả phiên đăng nhập hiện tại (kick out).
4. Nhấn **"Xác nhận reset"** → thực hiện → toast "Đã reset mật khẩu cho [tên]" → log lại hành động.
5. Nếu chọn "Gửi email": hiển thị preview email trước khi gửi (tên, username, mật khẩu mới, link đăng nhập).

**B. Reset hàng loạt (Bulk từ danh sách)**:
1. Tick chọn nhiều tài khoản trong DataTable → thanh Bulk Actions xuất hiện → **"Reset mật khẩu"**.
2. Modal bulk confirm: hiển thị danh sách X tài khoản sẽ bị reset.
3. Chọn phương thức (tự sinh ngẫu nhiên cho từng người / đặt về mặc định đồng loạt).
4. Tùy chọn gửi email thông báo cho tất cả.
5. Nhấn **"Reset tất cả"** → thanh progress → kết quả "X tài khoản đã reset thành công".

**C. Reset hàng loạt từ Excel**:
1. Nút **"Import"** → **"Reset mật khẩu từ Excel"**.
2. Tải file mẫu gồm 2 cột: `username` và `mat_khau_moi` (để trống nếu muốn tự sinh).
3. Upload → validate (username có tồn tại không, mật khẩu đủ mạnh không) → preview.
4. Xác nhận → import → báo cáo kết quả → tùy chọn gửi email.
**Expected Result**: Mật khẩu được reset an toàn; người dùng nhận thông báo kịp thời; phiên cũ bị ngắt nếu cần; audit log đầy đủ.

---

### Flow 6: Khóa / Mở khóa tài khoản
**Mô tả**: QTHT tạm đình chỉ quyền truy cập của một tài khoản (nghỉ việc, vi phạm nội quy, bảo mật...) hoặc mở khóa trở lại.
**Trigger**:
- Khóa: Menu **⋮** → **"Khóa tài khoản"** / Trong trang chi tiết → nút **"Khóa tài khoản"** (màu cam).
- Mở khóa: Menu **⋮** → **"Mở khóa"** / Trong trang chi tiết → nút **"Mở khóa tài khoản"** (màu xanh).
**Steps**:

**A. Khóa tài khoản**:
1. Modal xác nhận hiển thị: tên, username, vai trò, lần đăng nhập cuối của tài khoản.
2. **Thông tin bắt buộc**:
   - **Lý do khóa** (bắt buộc): Dropdown — Nghỉ việc / Nghỉ học / Vi phạm nội quy bảo mật / Yêu cầu của ban giám hiệu / Khác (nhập tay).
   - **Ghi chú nội bộ** (tùy chọn): Textarea, chỉ QTHT xem.
3. **Tùy chọn**:
   - ☑ Ngắt kết nối tất cả phiên đăng nhập hiện tại ngay lập tức (mặc định bật).
   - ☐ Khóa có thời hạn: Nhập ngày hết hạn → tự động mở khóa khi đến ngày.
   - ☐ Gửi email thông báo cho người dùng.
4. Nhấn **"Xác nhận khóa"** → tài khoản bị khóa → badge "Bị khóa" (đỏ) trên danh sách → log lịch sử.
5. Người dùng bị khóa khi đăng nhập sẽ thấy: "Tài khoản của bạn tạm thời bị khóa. Vui lòng liên hệ quản trị viên."

**B. Mở khóa tài khoản**:
1. Modal xác nhận hiển thị: lý do khóa ban đầu, ngày khóa, ai khóa.
2. **Lý do mở khóa** (bắt buộc): Textarea.
3. Tùy chọn: Reset mật khẩu đồng thời khi mở khóa (checkbox).
4. Nhấn **"Xác nhận mở khóa"** → tài khoản hoạt động trở lại → log lịch sử.

**C. Khóa hàng loạt**:
1. Tick chọn nhiều tài khoản → Bulk Actions → **"Khóa tài khoản"**.
2. Modal bulk: nhập lý do chung cho tất cả.
3. Confirm → thực hiện → báo cáo kết quả.
**Expected Result**: Tài khoản bị khóa ngay lập tức, phiên hiện tại bị ngắt, lịch sử khóa/mở khóa được lưu đầy đủ để tra cứu.

---

### Flow 7: Gán / Gỡ vai trò cho người dùng
**Mô tả**: QTHT thay đổi vai trò (quyền hạn) của một tài khoản — ví dụ: học sinh tốt nghiệp được thêm vai trò cựu học sinh; giáo viên được thêm vai trò tổ trưởng; nhân viên được thêm vai trò thủ thư.
**Trigger**: Trong trang chi tiết tài khoản → Tab **"Vai trò & Quyền"** → nút **"Quản lý vai trò"** / Hoặc menu **⋮** → **"Thay đổi vai trò"**.
**Steps**:
1. Mở **RoleAssignModal** — modal 2 cột:
   - **Cột trái**: Danh sách TẤT CẢ vai trò có trong hệ thống (checkbox), có search lọc nhanh.
   - **Cột phải**: Vai trò hiện đang gán cho tài khoản này (có thể kéo thả để sắp xếp thứ tự ưu tiên).
2. **Thông tin từng vai trò** (tooltip khi hover): Mô tả quyền hạn, số người đang có vai trò này, ngày tạo.
3. Thao tác:
   - **Gán thêm vai trò**: Tick checkbox bên trái → dòng vai trò chuyển sang cột phải.
   - **Gỡ vai trò**: Click nút "✕" bên cạnh vai trò ở cột phải / bỏ tick checkbox bên trái.
   - **Đặt vai trò chính (Primary Role)**: Radio button ở cột phải — vai trò chính ảnh hưởng đến giao diện mặc định khi đăng nhập.
4. **Cảnh báo khi gỡ vai trò chính**: "Tài khoản này cần ít nhất 1 vai trò. Bạn có muốn đặt [vai trò kia] làm vai trò chính không?"
5. **Cảnh báo khi gán vai trò QTHT**: Dialog confirm thêm — "Bạn đang cấp quyền quản trị cao nhất. Xác nhận?"
6. **Hiệu lực**: Chọn **"Có hiệu lực ngay"** hoặc **"Có hiệu lực từ ngày..."** (date picker — hữu ích khi GV kiêm nhiệm theo học kỳ).
7. **Ghi lý do thay đổi** (tùy chọn): Textarea — vd: "Bổ nhiệm làm Tổ trưởng tổ Toán từ HK2 2025-2026".
8. Nhấn **"Lưu vai trò"** → validate → áp dụng → phiên đăng nhập hiện tại của người dùng được làm mới quyền → log audit.
9. Nếu người dùng đang đăng nhập: Hệ thống tự động cập nhật quyền trong phiên hiện tại mà không cần đăng xuất (hoặc thông báo "Quyền của bạn vừa được cập nhật").
**Expected Result**: Vai trò được thay đổi chính xác, có hiệu lực đúng thời điểm, người dùng và admin đều nhận thấy thay đổi.

---

### Flow 8: Xem lịch sử đăng nhập của tài khoản
**Mô tả**: QTHT kiểm tra lịch sử truy cập của một tài khoản — phát hiện đăng nhập bất thường, điều tra sự cố bảo mật.
**Trigger**: Trong trang chi tiết tài khoản → Tab **"Lịch sử đăng nhập"** / Hoặc menu **⋮** → **"Xem lịch sử đăng nhập"**.
**Steps**:
1. Trang **Chi tiết tài khoản** (route: `/admin/users/:id`) mở Tab **"Lịch sử đăng nhập"**.
2. **Bảng lịch sử** (phân trang, mới nhất lên đầu):
   - Thời gian đăng nhập (datetime chính xác đến giây).
   - Địa chỉ IP.
   - Thiết bị / User-Agent (Browser + OS).
   - Vị trí địa lý (ước tính từ IP — tỉnh/thành phố).
   - Trạng thái: Thành công ✓ / Thất bại ✗ (sai mật khẩu) / Bị chặn 🚫 (tài khoản khóa).
   - Thời gian phiên (Session duration).
3. **Filter**: Lọc theo khoảng ngày, lọc chỉ đăng nhập thất bại, lọc theo IP.
4. **Cảnh báo tự động** (highlight màu đỏ): Đăng nhập từ IP lạ (lần đầu), đăng nhập lúc ngoài giờ hành chính, nhiều lần đăng nhập thất bại liên tiếp.
5. **Thống kê nhanh** phía trên bảng: Tổng phiên 30 ngày qua | Thiết bị thường dùng | IP thường dùng | Số lần thất bại gần đây.
6. QTHT có thể nhấn **"Ngắt kết nối phiên"** trên các dòng phiên đang active (biểu tượng •).
7. Nút **"Xuất lịch sử (.xlsx)"** — toàn bộ lịch sử trong khoảng thời gian đã lọc.
**Expected Result**: Admin nhanh chóng phát hiện hoạt động bất thường, có đủ bằng chứng để điều tra hoặc báo cáo bảo mật.

---

## Tính năng & Màn hình

### Màn hình Danh sách Tài khoản — Layout
```
┌──────────────────────────────────────────────────────────────────────────┐
│ HEADER: Quản lý Người dùng            [+ Thêm TK] [Import ▼] [Export]   │
│ Summary: Tổng 1,892 | Hoạt động 1,740 | Bị khóa 45 | Chưa đăng nhập 107│
├──────────────────────────────────────────────────────────────────────────┤
│ TABS: [Tất cả] [Giáo viên] [Học sinh] [CBQL] [Thủ thư] [QTHT]           │
├──────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR:                                                               │
│ [Vai trò ▼] [Đơn vị ▼] [Trạng thái ▼] [Đăng nhập cuối ▼]               │
│ [🔍 Tìm username / họ tên / email / SĐT...]       [Xóa bộ lọc]          │
├───┬──────────────────┬──────────────┬────────────┬──────────┬────────────┤
│ ☐ │ Họ tên           │ Username     │ Vai trò    │ Đơn vị   │ TT  │ Action│
├───┼──────────────────┼──────────────┼────────────┼──────────┼─────┼───────┤
│ ☐ │ 🟢 Nguyễn Văn A │ gv.nguyenvana│ [GV]       │ Tổ Toán  │ ✓   │ ⋮    │
│ ☐ │ 🔴 Trần Thị B   │ hs.12a1.025 │ [HS]       │ 12A1     │ 🔒  │ ⋮    │
│ ☐ │ 🟡 Lê Văn C     │ cbql.levanc  │ [CBQL][GV] │ BGH      │ ✓   │ ⋮    │
├───┴──────────────────┴──────────────┴────────────┴──────────┴─────┴───────┤
│ BULK ACTIONS: Đã chọn 8 TK | [Reset MK] [Khóa] [Mở khóa] [Gán vai trò] │
├────────────────────────────────────────────────────────────────────────────┤
│ Hiển thị 1–25 / 1,892    [← Trang trước]  [1] [2] ... [76]  [Sau →]      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Màn hình Chi tiết Tài khoản — Layout
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ← Quay lại   Chi tiết Tài khoản: gv.nguyenvana           [Sửa] [⋮]      │
├────────────────┬─────────────────────────────────────────────────────────┤
│  PANEL TRÁI    │  PANEL PHẢI — TABS                                       │
│  (25%)         │  (75%)                                                   │
│                │                                                           │
│  [Avatar 80px] │  [Thông tin] [Vai trò & Quyền] [Bảo mật] [Lịch sử ĐN] │
│  Nguyễn Văn A  ├─────────────────────────────────────────────────────────┤
│  gv.nguyenvana │  TAB: Thông tin cơ bản                                   │
│                │  Họ tên:  Nguyễn Văn A                                   │
│  🟢 Hoạt động  │  Email:   nguyenvana@school.edu.vn                       │
│                │  SĐT:     0912 345 678                                    │
│  Vai trò:      │  Đơn vị:  Tổ Toán – Lý – Tin                            │
│  [GV] [Tổ trg] │  Liên kết: → Hồ sơ GV Nguyễn Văn A                     │
│                │  Ghi chú: (trống)                                         │
│  Đơn vị:       │                                                           │
│  Tổ Toán       │  Tạo lúc: 01/09/2024 08:32 bởi admin.qtht               │
│                │  Sửa cuối: 15/01/2026 14:10 bởi admin.qtht               │
│  Đăng nhập     │                                                           │
│  cuối: 2h trước│                                                           │
│                │                                                           │
│  [Reset MK]    │                                                           │
│  [Khóa TK]     │                                                           │
│  [Xem LS ĐN]   │                                                           │
└────────────────┴─────────────────────────────────────────────────────────┘
```

### Màn hình RoleAssignModal — Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  Quản lý Vai trò — Nguyễn Văn A (gv.nguyenvana)              [✕]   │
├──────────────────────────────┬──────────────────────────────────────┤
│  TẤT CẢ VAI TRÒ              │  VAI TRÒ ĐANG GÁN                   │
│  [🔍 Tìm vai trò...]         │                                       │
│                              │  ● [GV] Giáo viên          [Chính ✓] │
│  ☑ Giáo viên                 │  ○ [Tổ trưởng] Tổ trưởng    [✕]     │
│  ☐ Học sinh                  │                                       │
│  ☐ CBQL                      │  ↕ Kéo để sắp xếp ưu tiên            │
│  ☐ Thủ thư                   │                                       │
│  ☑ Tổ trưởng                 │                                       │
│  ☐ QTHT                      │                                       │
│  ☐ Cựu học sinh              │                                       │
├──────────────────────────────┴──────────────────────────────────────┤
│  Hiệu lực: ● Ngay lập tức  ○ Từ ngày [____/__/____]                 │
│  Lý do: [___________________________________________________]        │
├─────────────────────────────────────────────────────────────────────┤
│                                    [Hủy]  [Lưu vai trò →]           │
└─────────────────────────────────────────────────────────────────────┘
```

### Màn hình Import Wizard — Layout (Bước 3: Preview lỗi)
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Import Tài khoản từ Excel       Bước [1] → [2] → [3●] → [4]     [✕]   │
├────────────────────────────────────────────┬─────────────────────────────┤
│  PREVIEW DỮ LIỆU                           │  TÓM TẮT                     │
│  ┌───┬────────────┬──────────┬─────┬──────┐│  ✓ Hợp lệ:    182 dòng      │
│  │ # │ Họ tên     │ Username │ ... │ Lỗi  ││  ✗ Lỗi:       13 dòng       │
│  ├───┼────────────┼──────────┼─────┼──────┤│  ⚠ Cảnh báo:  5 dòng        │
│  │ 1 │ Nguyễn A   │ gv.nva   │ ... │ ✓    ││  ↩ Trùng lặp: 2 dòng        │
│  │ 2 │ Trần B     │ (trùng!) │ ... │ ✗ ...││                               │
│  │ 3 │ Lê C       │ hs.lec   │ ... │ ⚠ ...││  TÙYCHỌN XỬ LÝ LỖI          │
│  │...│            │          │     │      ││  ● Import dòng hợp lệ (182)  │
│  └───┴────────────┴──────────┴─────┴──────┘│  ○ Dừng lại, sửa file trước │
│                                            │                               │
│  [Xuất danh sách lỗi (.xlsx)]              │  [← Quay lại]  [Xác nhận →] │
└────────────────────────────────────────────┴─────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut / Trigger | Kết quả |
|--------|-------------------|---------|
| Xem danh sách | Menu "Quản lý người dùng" | DataTable với filter đa chiều |
| Thêm tài khoản | Nút "+ Thêm TK" | Drawer 3 bước: Thông tin → Phân quyền → MK |
| Import hàng loạt | Nút "Import" → "Import từ Excel" | Wizard 4 bước với validate |
| Xem chi tiết | Click tên hoặc nút "Xem" | Trang chi tiết 2 cột + tabs |
| Sửa thông tin | Nút bút hoặc "Sửa" trong chi tiết | Drawer edit pre-fill |
| Reset mật khẩu | Menu ⋮ → "Reset MK" | Modal chọn phương thức + gửi email |
| Reset MK hàng loạt | Bulk select → "Reset MK" | Modal bulk confirm + progress |
| Reset MK từ Excel | "Import" → "Reset MK từ Excel" | Wizard upload + validate |
| Khóa tài khoản | Menu ⋮ → "Khóa TK" | Modal lý do + confirm + ngắt phiên |
| Mở khóa tài khoản | Menu ⋮ → "Mở khóa" | Modal lý do mở khóa |
| Khóa hàng loạt | Bulk select → "Khóa" | Modal bulk + lý do chung |
| Gán vai trò | "Quản lý vai trò" trong chi tiết | RoleAssignModal 2 cột |
| Xem lịch sử ĐN | Tab "Lịch sử ĐN" trong chi tiết | Bảng log + filter + thống kê |
| Ngắt phiên | Nút "Ngắt kết nối" trong lịch sử ĐN | Kick phiên active ngay lập tức |
| Export danh sách | Nút "Export" | File .xlsx toàn bộ hoặc theo filter |

---

## Gom nhóm tính năng thông minh

Module này gom **quản lý account + bảo mật + vai trò + audit log** vào một nơi thay vì phân tán. Lý do thiết kế:

- **Reset MK và Khóa/Mở khóa** được đặt cùng module vì cả hai đều liên quan đến trạng thái bảo mật của tài khoản — admin thường làm 2 việc này cùng lúc (vd: phát hiện tài khoản bị hack → khóa → reset MK → mở khóa).
- **RoleAssignModal** được thiết kế dạng 2 cột kéo thả thay vì checkbox đơn thuần — vì admin cần nhìn thấy đồng thời "những gì đang có" và "những gì có thể gán", tránh nhầm lẫn khi một người có nhiều vai trò.
- **Lịch sử đăng nhập** được gắn trực tiếp vào trang chi tiết tài khoản (không phải module log riêng) vì khi admin cần kiểm tra 1 người dùng cụ thể, họ cần thấy ngay — không phải vào module riêng rồi lọc theo user.
- **Import tài khoản** và **Import reset mật khẩu** dùng chung entry point "Import" nhưng tách wizard riêng — vì cả hai đều có quy trình upload-validate-preview giống nhau nhưng dữ liệu và hành động khác nhau.
- **Tab shortcut** (Tất cả / Giáo viên / Học sinh / CBQL...) giúp QTHT thường xuyên làm việc với 1 nhóm cụ thể không cần phải lọc lại mỗi lần.

---

## Edge Cases & Validation

- **Username trùng**: Block ngay khi nhập (real-time check debounce), hiện thông báo đỏ "Username đã tồn tại".
- **Email trùng**: Cảnh báo vàng (không block) "Email này đang dùng bởi [tên TK]" — vì có thể hợp lệ (HS chuyển trường giữ email cũ).
- **Đổi username**: Không cho phép trực tiếp — phải tạo tài khoản mới và vô hiệu hóa cái cũ. Ghi rõ lý do trong UI: "Username là định danh cố định trong hệ thống".
- **Xóa tài khoản**: Không có tính năng xóa vĩnh viễn — chỉ khóa (soft-delete logic). Tài khoản cần được giữ lại để tra cứu lịch sử điểm, điểm danh, hoạt động.
- **Tài khoản đang đăng nhập bị khóa**: Session bị invalidate ngay lập tức; lần request tiếp theo sẽ bị redirect về trang thông báo khóa.
- **Khóa tài khoản QTHT duy nhất**: Cảnh báo "Đây là tài khoản QTHT duy nhất trong hệ thống. Khóa tài khoản này có thể khiến hệ thống không thể quản lý được." — yêu cầu xác nhận 2 lần.
- **Gán vai trò QTHT cho chính mình**: Cho phép, nhưng log lại đặc biệt để kiểm toán.
- **Import file Excel lỗi format**: Nếu file không đúng cấu trúc (thiếu sheet, sai tên cột) → báo lỗi "File không đúng định dạng, vui lòng tải lại file mẫu" ngay bước upload.
- **Import file quá lớn**: Giới hạn 5MB / 2000 dòng mỗi lần — nếu vượt quá, gợi ý tách file.
- **Mật khẩu không đủ mạnh khi nhập tay**: Strength indicator real-time; block submit nếu dưới mức tối thiểu (8 ký tự, có chữ hoa + chữ thường + số).
- **Email gửi thất bại khi reset MK**: Vẫn reset MK thành công, thông báo "Reset thành công nhưng không gửi được email. Vui lòng thông báo mật khẩu thủ công." — log lại lỗi email.
- **Phiên lịch sử đăng nhập quá nhiều**: Chỉ lưu 1 năm gần nhất trong giao diện; dữ liệu cũ hơn được archive và có thể xuất nếu cần điều tra.
- **Đơn vị bị xóa / Tổ bộ môn giải thể**: Các tài khoản có đơn vị này bị đánh dấu "⚠ Đơn vị không còn tồn tại" — admin cần cập nhật lại đơn vị cho họ.
- **Vai trò bị xóa khỏi hệ thống**: Tài khoản giữ nguyên, vai trò đó hiển thị là "[Đã xóa]" màu xám — không ảnh hưởng quyền đã cấp cho đến khi admin cập nhật.
- **Bulk action với > 100 tài khoản**: Xử lý bất đồng bộ (background job) + thanh progress; admin nhận thông báo khi hoàn thành.

---

## Tích hợp

- **QL Giáo viên**: Tạo tài khoản GV tự động khi thêm hồ sơ giáo viên mới; liên kết 2 chiều (từ tài khoản xem được hồ sơ GV và ngược lại).
- **QL Học sinh**: Tạo tài khoản HS tự động khi import danh sách tuyển sinh đầu năm; mật khẩu mặc định từ ngày sinh HS.
- **Email / SMTP Gateway**: Gửi email chào mừng, thông báo reset mật khẩu, cảnh báo đăng nhập bất thường; hỗ trợ template tùy chỉnh.
- **E-learning**: Vai trò tài khoản quyết định danh mục khóa học được truy cập; thay đổi vai trò cập nhật quyền E-learning ngay lập tức.
- **Thư viện**: Vai trò "Thủ thư" trong module này quyết định quyền quản lý sách trong module Thư viện.
- **Điểm danh**: Mã tài khoản + ảnh đại diện được đồng bộ sang thiết bị điểm danh khuôn mặt.
- **Thi trực tuyến**: Tài khoản bị khóa không thể tham gia thi; vai trò HS trong lớp nào quyết định đề thi được giao.
- **Audit Log hệ thống**: Mọi thao tác trong module này (tạo/sửa/khóa/reset/gán vai trò) đều ghi vào Audit Log trung tâm của "QL Hệ thống" để QTHT có thể tra cứu toàn diện.
- **HUE-S / App phụ huynh**: Khi tài khoản HS bị khóa hoặc reset MK, phụ huynh nhận thông báo qua app (nếu đã liên kết).
- **SSO / LDAP** (tùy chọn): Nếu trường sử dụng LDAP/Active Directory, module đồng bộ tài khoản 2 chiều; mật khẩu quản lý bởi LDAP, hệ thống chỉ quản lý vai trò và trạng thái.
