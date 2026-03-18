# Quản Lý Vai Trò & Phân Quyền (RBAC) — Role: Admin

## Mục tiêu
Cung cấp cho QTHT bộ công cụ toàn diện để thiết lập và vận hành hệ thống phân quyền dựa trên vai trò (Role-Based Access Control): tạo/sửa/xóa vai trò, cấu hình ma trận quyền chi tiết theo từng module và từng hành động, xem trước giao diện theo góc nhìn của từng role, nhân bản vai trò, quản lý quyền ngoại lệ cấp người dùng có thời hạn, và kiểm toán định kỳ "ai có quyền gì" — đảm bảo nguyên tắc "tối thiểu quyền cần thiết" (Principle of Least Privilege) và bảo mật dữ liệu toàn trường.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền — tạo/sửa/xóa/nhân bản vai trò; cấu hình ma trận quyền theo từng module; gán quyền ngoại lệ cá nhân có ngày hết hạn; xem và xuất audit phân quyền. Đây là module **chỉ dành cho QTHT**.
- **CBQL**: **Không có quyền truy cập** module này. Mọi thay đổi phân quyền đều phải thông qua QTHT. Truy cập trực tiếp URL → hiển thị trang "403 — Bạn không có quyền truy cập".

---

## User Flow Chính

### Flow 1: Xem danh sách vai trò
**Mô tả**: QTHT xem tổng quan tất cả vai trò trong hệ thống — cả vai trò hệ thống mặc định lẫn vai trò tùy chỉnh — kèm số người dùng đang được gán và số quyền đang được cấp, hiển thị dạng RoleCard trực quan.
**Trigger**: Menu "Hệ thống" → Tab **"Vai trò & Phân quyền"** → Sub-tab **"Danh sách vai trò"**.
**Steps**:
1. Màn hình hiển thị danh sách **RoleCard** dạng grid (3 cột). Mỗi card gồm:
   - Tên vai trò (in đậm) + badge loại: "Hệ thống" (xanh dương) hoặc "Tùy chỉnh" (tím).
   - Mô tả ngắn (1 dòng, tối đa 60 ký tự).
   - **Số người dùng** đang được gán role này — click để xem danh sách chi tiết.
   - **Số quyền** được cấp / tổng quyền tối đa (VD: "31/48 quyền").
   - Thanh progress bar trực quan hóa % mức quyền.
   - Các nút action: [Sửa quyền] [Nhân bản] và [Xóa] (chỉ có ở role tùy chỉnh).
2. Các **vai trò hệ thống mặc định** — không thể xóa, chỉ sửa cấu hình quyền:
   - 🔴 **QTHT** (Quản trị hệ thống): Toàn quyền 48/48.
   - 🟠 **CBQL** (Cán bộ quản lý): Quản lý nghiệp vụ, không có quyền hệ thống.
   - 🟦 **Giáo viên**: Giảng dạy, theo dõi lớp chủ nhiệm, tạo nội dung.
   - 🟢 **Học sinh**: Học tập, xem kết quả bản thân.
   - 🟤 **Thủ thư**: Toàn quyền module thư viện.
3. Các **vai trò tùy chỉnh** (custom roles) hiển thị phía dưới với badge "Tùy chỉnh".
4. Bộ lọc nhanh: [Tất cả] [Hệ thống] [Tùy chỉnh] | Ô tìm kiếm theo tên role.
5. Nút **"+ Tạo vai trò mới"** ở góc trên phải header.
**Expected Result**: QTHT nắm bắt nhanh toàn cảnh phân quyền hệ thống; biết role nào có bao nhiêu người dùng và mức quyền ra sao mà không cần vào từng role.

---

### Flow 2: Tạo vai trò mới
**Mô tả**: QTHT tạo một vai trò tùy chỉnh mới phù hợp với cơ cấu đặc thù của trường (VD: "Trưởng thư viện", "Tổ trưởng chuyên môn", "Giáo viên kiêm nhiệm"), tùy chọn copy quyền từ vai trò có sẵn để làm điểm xuất phát.
**Trigger**: Nút **"+ Tạo vai trò mới"** trên màn hình danh sách.
**Steps**:
1. Drawer bên phải (rộng 45vw) trượt ra — **Bước 1/2: Thông tin vai trò**.
2. Form thông tin cơ bản:
   - **Tên vai trò** (bắt buộc): Validate ký tự hợp lệ, không trùng với role đã có — kiểm tra realtime khi gõ. Preview slug tự động (VD: "Trưởng thư viện" → `truong-thu-vien`).
   - **Mô tả** (tùy chọn): Textarea, tối đa 200 ký tự. Placeholder gợi ý "Mô tả ngắn gọn vai trò này để dễ nhận biết khi gán cho người dùng".
   - **Màu nhận diện**: Color picker, 12 màu gợi ý sẵn.
   - **Icon**: Chọn từ thư viện icon hoặc dùng emoji.
   - **Sao chép quyền từ vai trò có sẵn** (tùy chọn): Dropdown chọn role nguồn → hiển thị preview "Sẽ sao chép X quyền từ role [tên]". Hoặc chọn "Bắt đầu từ không có quyền nào" (mặc định).
3. Nhấn **"Tiếp theo →"** để sang **Bước 2/2: Cấu hình quyền**.
4. Bước 2 hiển thị **Ma trận phân quyền** với trạng thái ban đầu (rỗng hoặc đã điền sẵn từ role nguồn nếu chọn copy). QTHT tinh chỉnh ở đây.
5. Nhấn **"Tạo vai trò"** → Modal xác nhận: "Tạo vai trò [tên] với [X] quyền?".
6. Sau tạo thành công: Toast "✅ Đã tạo vai trò [tên]" + RoleCard mới xuất hiện trong danh sách với badge "Mới" (hiển thị 24 giờ).
**Expected Result**: Vai trò mới được tạo trong < 3 phút; QTHT có thể tái sử dụng cấu hình quyền từ role có sẵn thay vì tick từng ô từ đầu.

---

### Flow 3: Chỉnh sửa vai trò — Ma trận phân quyền chi tiết
**Mô tả**: QTHT điều chỉnh quyền hạn chi tiết của một vai trò thông qua ma trận Module × Hành động — 8 module × 6 loại hành động = 48 quyền có thể cấu hình.
**Trigger**: Nút **"Sửa quyền"** trên RoleCard, hoặc click vào tên role trong danh sách.
**Steps**:
1. Màn hình chuyển sang trang riêng `/admin/vai-tro/:id/chinh-sua` (không dùng drawer vì ma trận cần không gian rộng).
2. Header hiển thị: Tên role | Badge loại | Số người dùng đang dùng role | Nút [Xem trước] [Lưu thay đổi].
3. **Ma trận phân quyền** — dạng bảng 2 chiều, có thể cuộn ngang:
   - **Hàng** = 8 Module nghiệp vụ (xem bảng chi tiết bên dưới).
   - **Cột** = 6 Hành động: **Xem | Tạo | Sửa | Xóa | Xuất | Cấu hình**.
   - Mỗi ô = Checkbox toggle. Bật = ✅ nền xanh lá. Tắt = ☐ nền xám.
4. **Toolbar thao tác nhanh** (phía trên ma trận):
   - **[Chọn tất cả]**: Bật toàn bộ 48 quyền (Full Access).
   - **[Bỏ tất cả]**: Tắt toàn bộ (No Access).
   - **[Theo hàng ▼]**: Dropdown chọn module → tick/bỏ tất cả 6 hành động của module đó.
   - **[Theo cột ▼]**: Chọn loại hành động → tick/bỏ cho tất cả module (VD: "Tắt toàn bộ Xuất").
   - **[So sánh với role ▼]**: Chọn role khác → overlay diff: ô xanh nhạt = role đích có thêm, ô đỏ nhạt = role đích thiếu.
   - **[Áp dụng preset ▼]**: Các template nhanh: "View only", "Full CRUD", "Quản lý nội dung"...
5. **Quy tắc phụ thuộc tự động** (dependency enforcement):
   - Tick "Tạo/Sửa/Xóa/Xuất/Cấu hình" bất kỳ → hệ thống tự tick "Xem" nếu chưa có (không thể thao tác mà không thể xem).
   - Bỏ "Xem" → cảnh báo "Bỏ Xem sẽ ẩn luôn Tạo/Sửa/Xóa/Xuất/Cấu hình của module này. Tiếp tục?" → nếu xác nhận: tự động bỏ tất cả quyền còn lại của module đó.
6. **Tooltip chi tiết**: Hover vào bất kỳ ô nào → tooltip mô tả cụ thể quyền đó (VD: ô "Xuất" của "Báo cáo" → "Cho phép xuất báo cáo thống kê ra file Excel và PDF").
7. **Thanh trạng thái** phía dưới bảng: "Đã cấp [X]/48 quyền — [Progress bar]".
8. **Lưu nháp tự động** mỗi 30 giây → badge "Đã lưu nháp lúc HH:MM" ở góc phải header.
9. Nhấn **"Lưu thay đổi"** → Modal xác nhận hiển thị:
   - Tóm tắt thay đổi: "+3 quyền mới | -1 quyền | 28 quyền không đổi".
   - Cảnh báo tác động: "Thay đổi sẽ áp dụng cho [X] người dùng đang có vai trò này. Có hiệu lực ở phiên đăng nhập tiếp theo."
   - Lựa chọn thời điểm: [Áp dụng ngay] hoặc [Áp dụng lúc 00:00 đêm nay] (tránh gián đoạn giờ cao điểm).
10. Sau lưu: Audit log ghi nhận "QTHT [tên] sửa role [tên role]: +3 quyền, -1 quyền lúc HH:MM DD/MM/YYYY".
**Expected Result**: Ma trận phân quyền rõ ràng, trực quan; QTHT điều chỉnh chính xác từng quyền mà không cần ghi nhớ danh sách — mọi thứ hiển thị trên một màn hình.

---

### Flow 4: Preview "người dùng với vai trò X sẽ thấy màn hình nào"
**Mô tả**: Trước khi lưu cấu hình quyền, QTHT xem trước toàn bộ giao diện như người dùng có role đó — kiểm tra menu nào bị ẩn, nút nào bị disable, dữ liệu nào bị che — để xác nhận đúng ý muốn trước khi áp dụng cho hàng chục người dùng.
**Trigger**: Nút **"Xem trước"** trên trang chỉnh sửa role, hoặc từ RoleCard → menu ⋮ → "Xem trước giao diện".
**Steps**:
1. Hệ thống mở tab mới với toàn bộ ứng dụng được render theo quyền của role đang preview. Banner cố định phía trên cùng (không thể đóng):
   ```
   ⚠ CHẾ ĐỘ XEM TRƯỚC | Đang xem với tư cách: [Tên Role] | [Thoát xem trước]
   ```
2. Giao diện render đúng theo quyền role:
   - Sidebar menu: Chỉ hiển thị các module role có quyền "Xem".
   - Nút Tạo/Sửa/Xóa bị ẩn hoặc disabled nếu role không có quyền tương ứng.
   - Dữ liệu nhạy cảm bị ẩn theo phạm vi quyền (VD: lương GV hiển thị `***` với role Giáo viên).
   - Các section bị hạn chế hiển thị badge "🔒 Không có quyền truy cập".
3. **Chế độ Overlay Diff** (toggle góc trên phải): Bật → highlight màu đỏ nhạt tất cả phần tử bị ẩn/disable so với QTHT, kèm nhãn giải thích lý do.
4. QTHT có thể điều hướng tự do qua các trang/module để kiểm tra; không thể thực hiện hành động thực sự (tất cả action bị intercept, hiển thị "Đây là chế độ xem trước — hành động không được thực thi").
5. Nếu đang trong luồng chỉnh sửa **chưa lưu**: Preview dùng quyền từ **nháp hiện tại** (chưa ghi vào DB), cho phép QTHT kiểm tra "what-if" trước khi áp dụng thật.
6. Nhấn **"Thoát xem trước"** → đóng tab, quay về trang chỉnh sửa role.
**Expected Result**: QTHT xác nhận trải nghiệm người dùng đúng ý muốn trước khi lưu — không cần tạo tài khoản test riêng hay đăng nhập thử bằng tài khoản của người khác.

---

### Flow 5: Xóa vai trò
**Mô tả**: QTHT xóa một vai trò tùy chỉnh không còn cần thiết, đảm bảo mọi người dùng đang được gán role đó được chuyển sang role thay thế trước khi thực hiện xóa — không có ai bị mất quyền đột ngột.
**Trigger**: Nút **"Xóa"** trên RoleCard của vai trò tùy chỉnh (vai trò hệ thống không hiển thị nút này).
**Steps**:
1. Hệ thống kiểm tra ràng buộc ngay lập tức:
   - **Nếu role đang được gán cho ≥ 1 người dùng**: Hiển thị modal cảnh báo:
     ```
     ⚠ Vai trò "[Tên role]" đang được gán cho 12 người dùng.
     Hãy chuyển họ sang vai trò khác trước khi xóa.

     Chuyển sang vai trò: [Dropdown chọn role thay thế ▼]
                          (chỉ hiện các role cùng cấp hoặc thấp hơn)

     ☐ Gửi email thông báo đến người dùng bị thay đổi vai trò

     [Hủy]                          [Chuyển & Xóa vai trò]
     ```
   - **Nếu role không có người dùng nào**: Hiển thị confirm đơn giản "Xóa vai trò [tên]? Hành động này không thể hoàn tác."
2. QTHT chọn role thay thế từ dropdown (không cho chọn role đang xóa hoặc role QTHT nếu người dùng không đủ điều kiện).
3. Nhấn **"Chuyển & Xóa vai trò"** → Confirm lần 2 (prevent accidental click): "Xác nhận: Chuyển 12 người dùng sang [role thay thế] và xóa vai trò [tên]?"
4. Hệ thống thực hiện theo thứ tự:
   - Cập nhật tất cả user đang dùng role cũ → gán role mới.
   - Gửi email thông báo đến người dùng (nếu checkbox được chọn).
   - Xóa role khỏi hệ thống.
   - Ghi audit log đầy đủ.
5. Toast xác nhận: "✅ Đã xóa vai trò [tên]. 12 người dùng đã được chuyển sang [role thay thế]."
**Expected Result**: Không có người dùng nào bị mất quyền đột ngột; việc xóa role được thực hiện an toàn, có kiểm soát, có thông báo và có log đầy đủ.

---

### Flow 6: Nhân bản vai trò (Duplicate Role)
**Mô tả**: QTHT sao chép một vai trò có sẵn để tạo biến thể mới nhanh chóng (VD: copy "Giáo viên" → tạo "Giáo viên chủ nhiệm" với bổ sung thêm quyền quản lý lớp).
**Trigger**: Nút **"Nhân bản"** trên RoleCard, hoặc menu ⋮ → "Nhân bản vai trò".
**Steps**:
1. Modal nhỏ gọn xuất hiện ngay (không cần chuyển trang):
   ```
   Nhân bản vai trò: [Tên role nguồn]
   ──────────────────────────────────────
   Tên vai trò mới: [Bản sao của Giáo viên    ]
   Mô tả:           [                           ]
   ☑ Sao chép toàn bộ quyền (18/48 quyền)

   [Hủy]    [Nhân bản & Chỉnh sửa]    [Nhân bản & Lưu ngay]
   ```
2. Tên mặc định tự điền: "Bản sao của [tên role]" — QTHT có thể sửa ngay trong modal.
3. Validate realtime: Tên mới không được trùng với bất kỳ role nào. Nếu "Bản sao của X" đã tồn tại → tự tăng số: "Bản sao của X (2)".
4. **[Nhân bản & Chỉnh sửa]**: Tạo role mới với toàn bộ quyền giống role nguồn → chuyển thẳng vào trang chỉnh sửa ma trận quyền để tinh chỉnh.
5. **[Nhân bản & Lưu ngay]**: Tạo ngay không cần vào chỉnh sửa (cho trường hợp muốn giữ nguyên quyền, chỉ đổi tên).
6. Role mới xuất hiện trong danh sách với badge "Tùy chỉnh" và tag nhỏ "Nhân bản từ [tên role nguồn]" màu xám.
**Expected Result**: Tạo role biến thể trong < 30 giây; không cần tick lại toàn bộ ma trận 48 ô từ đầu.

---

### Flow 7: Quyền ngoại lệ theo người dùng (User-Level Override)
**Mô tả**: Trong trường hợp đặc biệt (GV kiêm nhiệm tạm thời, dự án đặc biệt, thay thế đột xuất), QTHT bổ sung hoặc bớt quyền cho một người dùng cụ thể ngoài quyền mặc định của role — bắt buộc ghi lý do và ngày hết hạn để đảm bảo quyền đặc biệt không tồn tại vĩnh viễn.
**Trigger**: Hồ sơ người dùng (GV/CBQL...) → Tab **"Quyền hạn"** → Nút **"+ Thêm quyền ngoại lệ"**.
**Steps**:
1. Tab "Quyền hạn" trong hồ sơ người dùng có 3 phần rõ ràng:
   - **Vai trò hiện tại**: Hiển thị role đang được gán + nút "Đổi vai trò".
   - **Quyền từ vai trò**: Danh sách tất cả quyền kế thừa từ role (chỉ đọc — sửa quyền này phải vào module RBAC).
   - **Quyền ngoại lệ cá nhân**: Bảng liệt kê các override đang active, sắp hết hạn, đã hết hạn.
2. Nhấn **"+ Thêm quyền ngoại lệ"** → Drawer:
   ```
   Thêm quyền ngoại lệ cho: Nguyễn Văn A (GV Toán)
   ───────────────────────────────────────────────────
   Loại:    ● Bổ sung quyền   ○ Bớt quyền

   Module:  [QL Báo cáo              ▼]
   Quyền:   ☑ Xuất  ☐ Xem  ☐ Tạo  ☐ Sửa  ☐ Xóa  ☐ Cấu hình

   Lý do:   [___________________________________] ← Bắt buộc, tối thiểu 20 ký tự
   Hết hạn: [📅 DD/MM/YYYY]   hoặc  ☐ Không giới hạn *
   * Không giới hạn yêu cầu nhập lý do bổ sung (tối thiểu 50 ký tự)

   Người phê duyệt: QTHT Trần Thị B (đang đăng nhập) — tự động

   [Hủy]                                    [Lưu ngoại lệ]
   ```
3. **Validation**: Lý do tối thiểu 20 ký tự. Ngày hết hạn phải trong tương lai. "Không giới hạn" cần lý do chi tiết hơn và tạo task review sau 90 ngày.
4. Sau lưu: Hệ thống tính toán **quyền thực tế** = (Quyền từ role) ∪ (Quyền bổ sung) − (Quyền bị bớt). Nguyên tắc: Deny luôn thắng Allow khi xung đột.
5. Banner cảnh báo xuất hiện trong hồ sơ người dùng: "⚠ Người dùng này đang có [X] quyền ngoại lệ active — xem chi tiết".
6. **Tự động hết hạn**: Cron job chạy mỗi đêm lúc 00:00 → kiểm tra ngày hết hạn → thu hồi quyền đã quá hạn → gửi email thông báo cho người dùng và QTHT.
7. **Email nhắc nhở tự động**: Gửi nhắc QTHT 7 ngày trước và 1 ngày trước khi quyền ngoại lệ hết hạn — để QTHT quyết định gia hạn hay để tự thu hồi.
8. **Xóa ngoại lệ thủ công**: QTHT click nút "Xóa" trên row quyền ngoại lệ → Confirm → Thu hồi ngay lập tức.
**Expected Result**: Quyền đặc biệt được cấp đúng người, đúng thời hạn, có ghi rõ lý do — không bao giờ bị "quên" thu hồi nhờ cơ chế tự động hết hạn.

---

### Flow 8: Audit quyền — Xem "ai có quyền gì" — Xuất Excel
**Mô tả**: QTHT tra cứu toàn cảnh phân quyền hệ thống để kiểm toán định kỳ, điều tra sự cố bảo mật, hoặc chuẩn bị báo cáo cho BGH/kiểm toán viên — với hai chiều tra cứu: theo người dùng hoặc theo quyền cụ thể.
**Trigger**: Tab **"Vai trò & Phân quyền"** → Sub-tab **"Kiểm toán quyền (Audit)"**.
**Steps**:
1. Màn hình Audit gồm **2 chế độ xem** (toggle button trên cùng):
   - **"Theo người dùng"**: Chọn người dùng → xem toàn bộ quyền thực tế của họ.
   - **"Theo quyền"**: Chọn một quyền cụ thể → xem danh sách tất cả người có quyền đó.
2. **Chế độ "Theo người dùng"**:
   - Ô search tìm người dùng (tên, email, mã số).
   - Sau khi chọn: Hiển thị bảng quyền phân theo module. Mỗi quyền ghi rõ **nguồn gốc**:
     - "Từ role [tên role]" — màu xanh dương.
     - "Ngoại lệ cá nhân (đến [ngày])" — màu vàng cam.
     - "Bị bớt bởi ngoại lệ" — màu đỏ gạch ngang.
   - Tổng kết: "Quyền thực tế: [X] quyền = [Y] từ role + [Z] ngoại lệ bổ sung − [W] ngoại lệ bớt".
3. **Chế độ "Theo quyền"**:
   - Chọn Module → Chọn Hành động (Xem/Tạo/Sửa/Xóa/Xuất/Cấu hình).
   - Kết quả: Danh sách tất cả người dùng có quyền này, phân nhóm theo role.
   - Thống kê tóm tắt: "Tổng [X] người dùng có quyền [Xuất Báo cáo]: [Y] từ role, [Z] từ ngoại lệ".
4. **Bộ lọc nâng cao** (sidebar trái):
   - Chỉ hiện người dùng có quyền ngoại lệ (phát hiện exception bất thường).
   - Chỉ hiện quyền ngoại lệ sẽ hết hạn trong 30 ngày tới.
   - Filter theo phòng ban / tổ bộ môn / trạng thái tài khoản.
   - Phát hiện bất thường tự động: Học sinh có quyền CRUD | Tài khoản bị khóa vẫn có ngoại lệ active | Quyền hệ thống ở người không phải QTHT.
5. **Xuất báo cáo phân quyền**:
   - Nút "Xuất Excel" → Modal tùy chỉnh:
     - Phạm vi: [Tất cả người dùng] [Chỉ một role cụ thể] [Chỉ người có quyền ngoại lệ].
     - Cột xuất: Họ tên | Email | Role | Module | Quyền | Nguồn gốc | Ngày hết hạn | Người phê duyệt.
   - File Excel gồm nhiều sheet: "Tổng quan" + Sheet riêng cho từng role + "Danh sách ngoại lệ".
   - Tên file tự động: `PhanQuyen_[TenTruong]_[YYYY-MM-DD].xlsx`.
6. **Snapshot phân quyền định kỳ**: Hệ thống tự tạo snapshot toàn bộ cấu hình quyền vào ngày 1 mỗi tháng → lưu trữ → QTHT có thể so sánh lịch sử: "Tháng này so với tháng trước quyền của ai thay đổi gì".
7. **Lịch sử thay đổi quyền**: Sub-tab "Lịch sử" → Timeline tất cả thay đổi RBAC: Ai thay đổi | Role nào | Thay đổi gì | Lúc nào — filter theo khoảng thời gian.
**Expected Result**: QTHT tra cứu "ai có quyền gì" trong < 1 phút; xuất được báo cáo phân quyền đầy đủ để kiểm toán định kỳ hoặc nộp cho BGH — không cần query thẳng vào database.

---

## Tính năng & Màn hình

### Màn hình Danh sách Vai trò — Layout
```
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Vai trò & Phân quyền                       [+ Tạo vai trò mới]    │
├────────────────────────────────────────────────────────────────────────────┤
│ SUB-TABS: [Danh sách vai trò ●] [Kiểm toán quyền] [Lịch sử thay đổi]     │
├────────────────────────────────────────────────────────────────────────────┤
│ [Tất cả ▼] [Hệ thống] [Tùy chỉnh]    🔍 Tìm tên vai trò...               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐│
│  │ 🔴 QTHT              │  │ 🟠 CBQL               │  │ 🟦 Giáo viên     ││
│  │ Quản trị hệ thống    │  │ Cán bộ quản lý        │  │ Giảng dạy & QL   ││
│  │ ─────────────────    │  │ ──────────────────    │  │ ─────────────     ││
│  │ 👥 3 người dùng      │  │ 👥 12 người dùng      │  │ 👥 87 người      ││
│  │ 🔑 48/48 quyền       │  │ 🔑 31/48 quyền        │  │ 🔑 18/48 quyền   ││
│  │ ████████████ 100%    │  │ ████████░░░░ 65%      │  │ █████░░░░░░ 38%  ││
│  │ [Hệ thống]           │  │ [Hệ thống]            │  │ [Hệ thống]       ││
│  │              [Sửa]   │  │               [Sửa]   │  │           [Sửa]  ││
│  └──────────────────────┘  └──────────────────────┘  └───────────────────┘│
│                                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐│
│  │ 🟢 Học sinh          │  │ 🟤 Thủ thư            │  │ 🟣 Trưởng TV 🆕  ││
│  │ Học tập & xem KQ     │  │ Quản lý thư viện      │  │ [Tùy chỉnh]      ││
│  │ ─────────────────    │  │ ──────────────────    │  │ ─────────────     ││
│  │ 👥 1.240 người       │  │ 👥 2 người dùng       │  │ 👥 1 người dùng  ││
│  │ 🔑 8/48 quyền        │  │ 🔑 14/48 quyền        │  │ 🔑 22/48 quyền   ││
│  │ ██░░░░░░░░░░ 17%     │  │ ███░░░░░░░░ 29%       │  │ ██████░░░░░ 46%  ││
│  │ [Hệ thống]           │  │ [Hệ thống]            │  │ Nhân bản từ: CBQL││
│  │              [Sửa]   │  │               [Sửa]   │  │ [Sửa][Nhân bản]⋮ ││
│  └──────────────────────┘  └──────────────────────┘  └───────────────────┘│
└────────────────────────────────────────────────────────────────────────────┘
```

### Màn hình Ma trận Phân quyền chi tiết — Layout
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ← Danh sách vai trò  |  ✏ Chỉnh sửa: CBQL  |  👥 12 người  | [Xem trước] [Lưu]  │
│                                                           Đã lưu nháp lúc 09:32   │
├────────────────────────────────────────────────────────────────────────────────────┤
│ [Chọn tất cả] [Bỏ tất cả] [Theo hàng ▼] [Theo cột ▼] [So sánh ▼] [Preset ▼]    │
├───────────────────────┬────────┬────────┬────────┬────────┬────────┬──────────────┤
│ MODULE                │  Xem  │  Tạo  │  Sửa  │  Xóa  │ Xuất  │  Cấu hình   │
├───────────────────────┼────────┼────────┼────────┼────────┼────────┼──────────────┤
│ 🏫 QL Trường         │  ✅   │  ✅   │  ✅   │  ☐    │  ✅   │      ☐       │
│ 👨‍🏫 QL Giáo viên     │  ✅   │  ✅   │  ✅   │  ☐    │  ✅   │      ☐       │
│ 👩‍🎓 QL Học sinh      │  ✅   │  ✅   │  ✅   │  ☐    │  ✅   │      ☐       │
│ 📖 Thư viện          │  ✅   │  ☐    │  ☐    │  ☐    │  ☐    │      ☐       │
│ 💻 E-learning        │  ✅   │  ☐    │  ☐    │  ☐    │  ✅   │      ☐       │
│ 📝 Thi / Kiểm tra   │  ✅   │  ☐    │  ✅   │  ☐    │  ✅   │      ☐       │
│ 📊 Báo cáo          │  ✅   │  ☐    │  ☐    │  ☐    │  ✅   │      ☐       │
│ ⚙️ Hệ thống          │  ☐    │  ☐    │  ☐    │  ☐    │  ☐    │      ☐       │
├───────────────────────┴────────┴────────┴────────┴────────┴────────┴──────────────┤
│ Tổng: 31 / 48 quyền                                   ████████████░░░░░░░  65%   │
│                                              [Hủy thay đổi]  [Lưu thay đổi]      │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Màn hình Kiểm toán Quyền (Audit) — Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│ Kiểm toán quyền (Audit)                      [Xuất báo cáo Excel ↓]   │
├────────────────────────────────────────────────────────────────────────┤
│ Xem theo:  ● Người dùng          ○ Quyền cụ thể                       │
├────────────────────────────────────────────────────────────────────────┤
│ Chọn người dùng: 🔍 [Nguyễn Thị Hương (CBQL)           ▼]             │
├───────────────────────────┬────────────────────────────────────────────┤
│ THÔNG TIN NGƯỜI DÙNG      │ QUYỀN THỰC TẾ                             │
│ ────────────────────────  │ ──────────────────────────────────────────│
│ 👤 Nguyễn Thị Hương       │ Module: QL Giáo viên                      │
│ 📧 huong@truong.edu.vn    │   ✅ Xem       ← Từ role: CBQL            │
│ 🎭 Vai trò: CBQL          │   ✅ Tạo       ← Từ role: CBQL            │
│                           │   ✅ Sửa       ← Từ role: CBQL            │
│ ⚠ 2 quyền ngoại lệ       │   ☐ Xóa       —                          │
│   đang hoạt động          │   ✅ Xuất      ← Từ role: CBQL            │
│                           │   ☐ Cấu hình  —                          │
│ Quyền thực tế:            │                                           │
│ 33 = 31 (role) + 2 (NT)   │ Module: Báo cáo                          │
│                           │   🟡 ✅ Xuất   ← Ngoại lệ (đến 31/3)    │
│                           │   🟡 ✅ Cấu hình← Ngoại lệ (đến 31/3)   │
│                           │                                           │
│                           │ Module: Hệ thống                         │
│                           │   ☐ Xem  ☐ Tạo  ☐ Sửa  ☐ Xóa ...       │
└───────────────────────────┴────────────────────────────────────────────┘
```

### Màn hình Tab "Quyền hạn" trong Hồ sơ Người dùng — Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Hồ sơ: Nguyễn Văn A  | [Cá nhân] [Công tác] [Tài khoản] [Quyền hạn ●]│
├─────────────────────────────────────────────────────────────────────────┤
│ VAI TRÒ HIỆN TẠI                                                        │
│ 🎭 Giáo viên  ───  18/48 quyền                   [Đổi vai trò]         │
├─────────────────────────────────────────────────────────────────────────┤
│ ⚠ QUYỀN NGOẠI LỆ CÁ NHÂN (2 active)      [+ Thêm quyền ngoại lệ]      │
├────────────────┬──────────┬────────────────────┬────────────┬───────────┤
│ Module         │ Quyền    │ Loại               │ Hết hạn    │ Thao tác  │
├────────────────┼──────────┼────────────────────┼────────────┼───────────┤
│ Báo cáo        │ Xuất     │ 🟢 Bổ sung         │ 31/03/2026 │ [Xóa]    │
│ E-learning     │ Cấu hình │ 🔴 Bớt (Deny)      │ Không giới │ [Xóa]    │
├────────────────┴──────────┴────────────────────┴────────────┴───────────┤
│ [▼ Xem toàn bộ quyền thực tế: 19 quyền (18 từ role + 1 bổ sung)]       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Ma trận Quyền chi tiết theo Module

| Module | Xem | Tạo | Sửa | Xóa | Xuất | Cấu hình |
|--------|-----|-----|-----|-----|------|----------|
| **QL Trường** | Xem thông tin trường, năm học, cơ cấu tổ chức, danh sách lớp | Tạo năm học, học kỳ, khối lớp, tổ bộ môn | Sửa thông tin trường, lịch học, cơ cấu tổ chức | Xóa năm học đã kết thúc, khóa khối lớp cũ | Xuất cơ cấu tổ chức, danh sách lớp, thống kê trường | Cài đặt logo, tên trường, quy tắc năm học, học kỳ |
| **QL Giáo viên** | Xem danh sách GV, hồ sơ cá nhân, thông tin công tác | Thêm GV mới, tạo tài khoản hệ thống, import Excel | Sửa hồ sơ GV, phân công dạy học, chuyển tổ bộ môn | Xóa GV (soft-delete, khôi phục được trong 30 ngày) | Xuất danh sách GV, phân công dạy, báo cáo nhân sự | Cấu hình các trường hồ sơ GV bắt buộc, quy tắc mã GV |
| **QL Học sinh** | Xem danh sách HS, hồ sơ, điểm rèn luyện, học bổng | Nhập HS mới, tạo tài khoản, import hàng loạt | Sửa hồ sơ HS, chuyển lớp, xếp lại lớp | Xóa HS (soft-delete, khôi phục được trong 30 ngày) | Xuất danh sách HS, bảng điểm, hồ sơ PDF | Cấu hình trường hồ sơ HS, quy tắc xếp lớp, điểm rèn luyện |
| **Thư viện** | Xem catalog sách, tình trạng mượn trả, thẻ thư viện | Nhập sách mới, tạo phiếu mượn, cấp thẻ | Sửa thông tin sách, gia hạn mượn, chỉnh phiếu | Xóa sách hỏng/thanh lý, thu hồi thẻ | Xuất báo cáo mượn trả, tồn kho, thống kê | Cấu hình thời hạn mượn, phí phạt, giới hạn số sách được mượn |
| **E-learning** | Xem danh sách khóa học, bài giảng, tiến độ học sinh | Tạo khóa học, bài giảng, bài tập, ngân hàng câu hỏi | Sửa nội dung bài giảng, câu hỏi, deadline bài tập | Xóa khóa học, bài giảng, bài tập đã tạo | Xuất báo cáo hoàn thành khóa học, điểm bài tập | Cấu hình định dạng file cho phép, dung lượng upload, quy tắc nộp bài |
| **Thi / Kiểm tra** | Xem danh sách đề thi, lịch thi, kết quả, thống kê | Tạo đề thi, lịch thi, ngân hàng câu hỏi, ca thi | Sửa đề thi, điều chỉnh kết quả có lý do, cập nhật lịch | Xóa đề thi nháp, hủy kỳ thi chưa diễn ra | Xuất đề thi PDF, xuất kết quả thi, bảng điểm | Cấu hình quy tắc chống gian lận, thời gian làm bài, chấm tự động |
| **Báo cáo** | Xem báo cáo thống kê, biểu đồ, dashboard | Tạo báo cáo tùy chỉnh, lên lịch báo cáo tự động | Sửa cấu hình báo cáo, chỉnh template | Xóa báo cáo đã lưu, hủy lịch báo cáo tự động | Xuất tất cả loại báo cáo ra Excel/PDF/CSV | Cấu hình kỳ báo cáo, template chuẩn, đơn vị đo lường, logo báo cáo |
| **Hệ thống** | Xem trạng thái hệ thống, log, cấu hình hiện tại | Tạo API key, tạo backup thủ công, thêm cài đặt | Sửa cấu hình SSO, email gateway, cài đặt chung | Thu hồi API key, xóa log cũ, xóa backup cũ | Xuất audit log, xuất cấu hình backup | Toàn quyền cấu hình hệ thống — chỉ dành cho QTHT |

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Xem danh sách vai trò | Menu Hệ thống → Vai trò & Phân quyền | Grid RoleCard với số người dùng, số quyền, % mức quyền |
| Tạo vai trò mới | Nút "+ Tạo vai trò mới" | Drawer 2 bước: thông tin cơ bản → ma trận quyền |
| Nhân bản vai trò | Nút "Nhân bản" trên RoleCard | Modal nhanh đặt tên → tạo bản sao toàn bộ quyền |
| Sửa ma trận quyền | Nút "Sửa quyền" → trang riêng | Toggle 48 ô, toolbar hàng/cột, so sánh role |
| Xem trước giao diện role | Nút "Xem trước" | Tab mới với banner preview, render UI đúng quyền role |
| So sánh 2 role | Toolbar → "So sánh với role ▼" | Overlay diff highlight xanh/đỏ trên ma trận |
| Lưu thay đổi quyền | Nút "Lưu thay đổi" | Modal tóm tắt thay đổi → chọn thời điểm áp dụng |
| Xóa vai trò tùy chỉnh | Nút "Xóa" (chỉ role tùy chỉnh) | Kiểm tra ràng buộc → chọn role thay thế → xóa an toàn |
| Xem chi tiết người dùng của role | Click số người dùng trên RoleCard | Danh sách người dùng đang có role đó |
| Thêm quyền ngoại lệ | Hồ sơ user → Tab Quyền hạn → "+ Thêm" | Drawer chọn module/quyền/loại + lý do bắt buộc + ngày hết hạn |
| Xóa quyền ngoại lệ | Nút "Xóa" trong bảng ngoại lệ | Confirm → Thu hồi quyền ngay lập tức |
| Audit theo người dùng | Sub-tab Kiểm toán → chọn user | Bảng quyền thực tế với nguồn gốc từng quyền |
| Audit theo quyền cụ thể | Sub-tab Kiểm toán → chọn quyền | Danh sách tất cả user có quyền đó + nguồn gốc |
| Xuất báo cáo phân quyền | Nút "Xuất báo cáo Excel" | File Excel nhiều sheet, tên tự động theo ngày xuất |
| Xem lịch sử thay đổi | Sub-tab "Lịch sử thay đổi" | Timeline tất cả thay đổi RBAC với diff chi tiết |

---

## Gom nhóm tính năng thông minh

Module RBAC gom **toàn bộ vòng đời phân quyền** vào một nơi thay vì phân tán qua nhiều module:

- **Định nghĩa role** (danh sách, ma trận 8×6) → màn hình chính Vai trò & Phân quyền.
- **Gán role cho người dùng** → Tab Quyền hạn trong hồ sơ từng người (không phải vào RBAC riêng).
- **Quyền ngoại lệ cá nhân** → cùng Tab Quyền hạn, cạnh thông tin role — để admin thấy toàn bộ bức tranh quyền của một người trên một màn hình.
- **Kiểm toán** → Sub-tab Audit ngay trong module RBAC, không cần chuyển sang Audit Log chung.

**Tại sao thiết kế ma trận 8×6 thay vì danh sách checkbox**:
Dạng bảng 2 chiều (Module × Hành động) cho phép QTHT đọc toàn bộ 48 quyền chỉ trong 1 lần nhìn. Nếu dùng danh sách checkbox dọc (48 dòng), QTHT phải scroll và mất bối cảnh tổng quan. Ma trận còn giúp phát hiện ngay pattern bất thường: VD một role có quyền Xóa nhưng không có Xem — sai logic, dễ thấy ngay trên ma trận.

**Tại sao quyền ngoại lệ phải có ngày hết hạn**:
Trong thực tế, quyền đặc biệt thường được cấp cho tình huống tạm thời (GV nghỉ thai sản → đồng nghiệp tạm thay). Không có ngày hết hạn → quyền bị "quên" thu hồi → privilege creep theo thời gian. Cơ chế tự thu hồi theo ngày + email nhắc là lớp bảo vệ tự động không cần QTHT nhớ thủ công.

---

## Edge Cases & Validation

- **Xóa role hệ thống mặc định**: Block hoàn toàn — nút "Xóa" không render. Hover tooltip giải thích: "Vai trò hệ thống không thể xóa. Chỉ có thể sửa cấu hình quyền."
- **Xóa role tùy chỉnh đang có người dùng**: Bắt buộc chọn role thay thế. Không cho phép xóa nếu không có role thay thế hợp lệ (phải là role khác đang active).
- **QTHT tự bỏ quyền Cấu hình Hệ thống của chính mình**: Block với thông báo "Bạn không thể tự bỏ quyền này vì sẽ khóa tài khoản của bạn khỏi module Hệ thống. Hãy nhờ QTHT khác thực hiện."
- **Còn 1 QTHT cuối cùng**: Không cho phép giáng cấp, vô hiệu hóa tài khoản, hoặc bỏ quyền QTHT của tài khoản QTHT duy nhất còn active. Thông báo: "Hệ thống cần ít nhất 1 QTHT active. Hãy tạo hoặc kích hoạt QTHT khác trước."
- **Quy tắc phụ thuộc quyền**: Tạo/Sửa/Xóa/Xuất/Cấu hình đều yêu cầu có Xem. Bỏ Xem → hệ thống tự bỏ tất cả quyền còn lại của module đó (có cảnh báo trước).
- **Quyền ngoại lệ xung đột — Deny vs Allow**: Nếu ngoại lệ "Bớt Xem" trong khi role có Xem → **Deny thắng** (Principle of Least Privilege). Hiển thị rõ nguồn gốc trong màn hình Audit.
- **Người dùng có nhiều vai trò**: Quyền hiệu lực = **UNION** của tất cả role (bất kỳ role nào cho phép là được). Ngoại lệ Deny vẫn thắng tất cả.
- **Tên role trùng khi nhân bản**: Tên mặc định "Bản sao của X" → nếu đã tồn tại, tự tăng số: "Bản sao của X (2)", "(3)"...
- **Thay đổi quyền trong khi user đang đăng nhập**: Áp dụng ở **session tiếp theo** (không force logout ngay để tránh mất công việc đang làm). Option "Áp dụng ngay + force logout" chỉ dùng khi phát hiện tài khoản bị xâm nhập.
- **Preview với dữ liệu thật**: Preview mode không cho phép thực hiện hành động thật (tất cả API call bị intercept ở chế độ preview). Không ghi audit log cho hành động trong preview.
- **Ngày hết hạn quyền ngoại lệ trong quá khứ**: Validate error ngay khi chọn: "Ngày hết hạn phải là ngày trong tương lai."
- **Import Excel người dùng với role không tồn tại**: Hàng có tên role không khớp → tô đỏ, tooltip "Role '[tên]' không tồn tại. Kiểm tra lại tên role hoặc tạo role này trước."
- **Thay đổi quyền role Học sinh khi có kỳ thi đang diễn ra**: Cảnh báo đặc biệt: "Có [X] kỳ thi đang diễn ra. Thay đổi quyền Thi có thể ảnh hưởng đến học sinh đang làm bài. Bạn chắc chắn muốn tiếp tục?"
- **Audit log của RBAC bị thao túng**: Bảng audit log là append-only, không có UI xóa dòng. Mỗi record có hash checksum. Ghi log cả việc "ai xem audit log" để phát hiện nếu kẻ xâm nhập cố tình xóa dấu vết.
- **Quyền ngoại lệ cho tài khoản QTHT**: Không cho phép thêm ngoại lệ "Bớt quyền" vào bất kỳ tài khoản QTHT nào — đảm bảo luôn có ít nhất 1 người có toàn quyền quản trị.
- **Snapshot phân quyền thất bại**: Retry tự động sau 1 giờ. Nếu vẫn thất bại sau 3 lần → gửi email alert QTHT, log lỗi chi tiết để điều tra.
- **Xóa module khỏi hệ thống** (trong tương lai khi upgrade): Tất cả quyền của module đó tự được dọn sạch khỏi tất cả role và ngoại lệ; ghi log danh sách người dùng bị ảnh hưởng.

---

## Tích hợp

- **Tất cả module nghiệp vụ**: RBAC là layer nền tảng cross-cutting — mọi API endpoint đều có middleware kiểm tra quyền trước khi thực thi; mọi route frontend đều có guard kiểm tra trước khi render. Thay đổi role áp dụng toàn hệ thống không cần deploy lại.
- **Module Hệ thống (SSO & Auth)**: Role và quyền của người dùng được nhúng vào JWT access token sau khi đăng nhập. Token refresh tự động cập nhật quyền mới nhất khi hết hạn (TTL 1 giờ).
- **QL Giáo viên & QL Học sinh**: Tab "Quyền hạn" trong hồ sơ người dùng gọi trực tiếp RBAC API để xem và quản lý quyền ngoại lệ — không cần chuyển sang module RBAC riêng, giảm context switch cho QTHT.
- **Audit Log (module Hệ thống)**: Mọi thay đổi trong RBAC (tạo/sửa/xóa role, bật/tắt từng quyền, thêm/thu hồi ngoại lệ) ghi vào audit log tập trung với đầy đủ context: ai làm, lúc nào, thay đổi gì (diff trước/sau).
- **Email Gateway**: Gửi email tự động cho các sự kiện: (1) Người dùng bị thay đổi role; (2) Quyền ngoại lệ sắp hết hạn (nhắc 7 ngày và 1 ngày trước); (3) Quyền ngoại lệ đã tự hết hạn và bị thu hồi; (4) Phát hiện bất thường trong audit scan.
- **Báo cáo**: Module Báo cáo đọc RBAC để kiểm tra user có quyền "Xuất" không trước khi hiển thị nút Xuất. Nếu không → disabled với tooltip "Bạn không có quyền xuất báo cáo. Liên hệ QTHT để được cấp quyền."
- **API Gateway (Tích hợp ngoài)**: API keys cấp cho hệ thống bên ngoài (Sở GD, HUE-S) cũng được gán scope quyền theo cùng cơ chế RBAC; scope được định nghĩa và quản lý trong module này.
- **SSO / LDAP / OAuth2**: Khi người dùng đăng nhập qua LDAP/OAuth2, LDAP groups hoặc OAuth2 claims được map tự động sang role nội bộ tương ứng (VD: LDAP group "teachers" → role "Giáo viên"). Mapping được cấu hình trong module Hệ thống → SSO.
- **HUE-S Platform**: Khi role người dùng thay đổi, scope quyền trong HUE-S federation token được cập nhật đồng bộ tại lần refresh token tiếp theo.
- **Redis Cache**: Quyền thực tế của mỗi user (sau khi tính role + ngoại lệ) được cache trong Redis với TTL 5 phút — tránh query DB mỗi request để đảm bảo hiệu năng. Cache bị invalidated ngay lập tức khi QTHT lưu thay đổi quyền của role hoặc thêm/xóa ngoại lệ cá nhân.
