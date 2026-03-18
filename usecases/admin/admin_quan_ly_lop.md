# Quản Lý Lớp Học — Role: Admin

## Mục tiêu
Cho phép Admin quản lý toàn bộ vòng đời của lớp học: tạo lớp, phân lớp học sinh, bổ nhiệm GVCN, chuyển lớp, lên lớp, tốt nghiệp — đảm bảo cấu trúc lớp học chính xác là nền tảng cho điểm danh, thời khóa biểu và quản lý học tập.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền CRUD lớp học; thực hiện lên lớp/tốt nghiệp hàng loạt; xóa lớp rỗng; cấu hình tiêu chí phân lớp tự động.
- **CBQL**: Xem danh sách lớp và HS trong lớp; chỉnh sửa thông tin lớp; bổ nhiệm GVCN; phê duyệt chuyển lớp; không được xóa lớp có HS, không được thực hiện lên lớp/tốt nghiệp hàng loạt mà không có QTHT confirm.

---

## User Flow Chính

### Flow 1: Tạo lớp học đầu năm
**Mô tả**: QTHT tạo cấu trúc lớp cho năm học mới, nhân bản từ năm trước hoặc tạo mới.
**Trigger**: Menu "QL Lớp" → Nút **"+ Tạo lớp học"** hoặc từ wizard "Khởi tạo năm học".
**Steps**:
1. Chọn phương thức:
   - **Tạo tự động từ năm trước**: Hệ thống gợi ý tạo các lớp 10 (mới tuyển), lớp 11 (từ lớp 10 năm cũ), lớp 12 (từ lớp 11 năm cũ). Admin xác nhận số lớp mỗi khối.
   - **Tạo thủ công**: Form tạo từng lớp.
2. **Form tạo lớp**: Tên lớp (10A1, 11B2...), khối (10/11/12), sĩ số tối đa, phòng học mặc định, năm học.
3. Sau khi tạo: lớp có trạng thái **"Chờ phân HS"** (màu vàng).
4. Nút **"Bổ nhiệm GVCN"** → dropdown chọn GV chưa là GVCN lớp nào trong năm học này.
5. Lớp hiển thị trên màn hình với sĩ số "0/X HS".
**Expected Result**: Skeleton lớp học được tạo sẵn, chờ phân học sinh vào.

---

### Flow 2: Phân lớp học sinh (Bulk)
**Mô tả**: CBQL/QTHT phân bổ học sinh vào các lớp đầu năm học — tác vụ quan trọng nhất của đầu năm.
**Trigger**: Màn hình danh sách lớp → Nút **"Phân lớp hàng loạt"** hoặc từ module QL HS.
**Steps**:
1. Màn hình **"Phân lớp hàng loạt"** dạng drag & drop:
   - Cột trái: Danh sách HS chưa có lớp (hoặc HS mới nhập) — có thể filter theo giới tính, điểm đầu vào.
   - Cột phải: Các lớp đã tạo, mỗi lớp là một "bucket" hiển thị sĩ số hiện tại/tối đa.
2. Kéo thả HS từ cột trái vào lớp tương ứng; hoặc chọn nhiều HS (Ctrl+Click) rồi "Gán vào lớp [chọn lớp]".
3. **Phân lớp tự động**: Nút "Phân tự động" → wizard:
   - Chọn tiêu chí: Ngẫu nhiên / Theo điểm đầu vào / Theo giới tính cân bằng / Theo khu vực.
   - Preview kết quả phân lớp → Admin điều chỉnh thủ công nếu cần.
   - Confirm → áp dụng.
4. Real-time validation: cảnh báo ngay nếu lớp vượt sĩ số tối đa.
5. Nhấn **"Xác nhận phân lớp"** → lưu toàn bộ thay đổi, gửi thông báo cho HS/phụ huynh.
**Expected Result**: 450 HS được phân vào 12 lớp trong < 10 phút; cân bằng sĩ số và giới tính.

---

### Flow 3: Xem & quản lý chi tiết một lớp
**Mô tả**: CBQL xem toàn bộ thông tin của một lớp: danh sách HS, GVCN, lịch học, thống kê.
**Trigger**: Click vào tên lớp trên danh sách.
**Steps**:
1. Trang **Chi tiết lớp** (`/admin/lop/:id`) — layout tabs:
   - **Tổng quan**: Card info (GVCN, phòng học, sĩ số, học lực/hạnh kiểm trung bình), biểu đồ điểm danh tháng.
   - **Danh sách HS**: Bảng đầy đủ (mã HS, tên, ngày sinh, học lực, hạnh kiểm, chuyên cần). Click tên HS → trang hồ sơ HS.
   - **Thời khóa biểu**: Grid tiết học theo ngày trong tuần.
   - **Điểm rèn luyện**: Bảng điểm theo kỳ, trạng thái duyệt.
   - **Thông báo**: Các thông báo đã gửi cho lớp.
2. **Action nhanh trong trang lớp**:
   - Thêm HS vào lớp (search & add)
   - Chuyển HS ra khỏi lớp
   - Đổi GVCN
   - Đổi phòng học mặc định
   - Gửi thông báo đến toàn lớp
3. Sort danh sách HS: theo tên, theo mã HS, theo học lực, theo số buổi vắng.
**Expected Result**: Một stop view cho toàn bộ thông tin về lớp học đó.

---

### Flow 4: Chuyển lớp học sinh
**Mô tả**: Xử lý yêu cầu chuyển lớp trong năm học (do phụ huynh yêu cầu, tái cơ cấu...).
**Trigger**: Hồ sơ HS → Menu ⋮ → "Chuyển lớp" HOẶC trong trang Chi tiết lớp → chọn HS → "Chuyển lớp".
**Steps**:
1. Modal **"Chuyển lớp"** mở ra:
   - Thông tin hiện tại: Lớp cũ, GVCN cũ.
   - Dropdown chọn **Lớp mới** (chỉ show lớp còn chỗ, cùng khối).
   - Trường **Lý do chuyển lớp** (textarea, bắt buộc).
   - Ngày hiệu lực.
2. Hệ thống hiển thị: "Lớp 11A3 hiện có 38/40 HS. Sau khi chuyển: 11A1 → 37 HS, 11A3 → 39 HS."
3. Checkbox **"Gửi thông báo cho GVCN cả 2 lớp và phụ huynh HS"**.
4. Nhấn **"Xác nhận chuyển"** → lưu với lịch sử đầy đủ (ai duyệt, lúc nào, lý do gì).
5. Log chuyển lớp xuất hiện trong tab "Học tập" của hồ sơ HS.
**Expected Result**: Chuyển lớp có đầy đủ audit trail; tất cả các bên liên quan được thông báo.

---

### Flow 5: Lên lớp & tốt nghiệp cuối năm
**Mô tả**: Cuối năm học, QTHT thực hiện lên lớp hàng loạt cho toàn trường.
**Trigger**: Menu "QL Lớp" → Tab "Kết thúc năm học" → Nút **"Thực hiện lên lớp"**.
**Steps**:
1. Wizard **"Lên lớp cuối năm"** — 4 bước:
   - **Bước 1**: Chọn năm học cần kết thúc, xác nhận đã có đủ điểm học kỳ 2 và điểm rèn luyện.
   - **Bước 2**: Hệ thống tự phân loại:
     - Lớp 10 → lên lớp 11 (HS đạt), lưu ban (HS không đạt)
     - Lớp 11 → lên lớp 12 (HS đạt), lưu ban
     - Lớp 12 → tốt nghiệp (đạt), lưu ban / thi lại
   - Preview danh sách từng nhóm; Admin điều chỉnh từng trường hợp đặc biệt.
   - **Bước 3**: Cấu hình năm học mới: chọn năm học đích, cách đặt tên lớp mới.
   - **Bước 4**: Confirm → thực hiện → progress bar → báo cáo kết quả.
2. Sau khi lên lớp: HS lớp 12 tốt nghiệp → tài khoản chuyển sang trạng thái "Alumni" (vẫn đọc được lịch sử).
**Expected Result**: Toàn trường lên lớp trong 1 thao tác duy nhất; dữ liệu năm học mới sẵn sàng.

---

## Tính năng & Màn hình

### Màn hình danh sách lớp — Layout
```
┌───────────────────────────────────────────────────────────────────┐
│ HEADER: Quản lý Lớp học | Năm học: 2025-2026 | [+ Tạo lớp]      │
├───────────────────────────────────────────────────────────────────┤
│ TABS: [Tất cả lớp] [Khối 10] [Khối 11] [Khối 12]                │
├───────────────────────────────────────────────────────────────────┤
│ VIEW TOGGLE: [Card Grid ●] [Bảng ○]  [Phân lớp hàng loạt]       │
├───────────────────────────────────────────────────────────────────┤
│ Card Grid View:                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 10A1     │ │ 10A2     │ │ 10A3     │ │ 10A4     │           │
│  │ GVCN:    │ │ GVCN:    │ │ GVCN:    │ │ GVCN:    │           │
│  │ Cô Lan   │ │ Thầy Hùng│ │ Cô Mai   │ │ Thầy An  │           │
│  │ 38/40 HS │ │ 40/40 HS │ │ 37/40 HS │ │ 39/40 HS │           │
│  │ 🟢 Bình  │ │ 🟡 Full  │ │ 🟢 Bình  │ │ 🟢 Bình  │           │
│  │ [Chi tiết]│ [Chi tiết]│ [Chi tiết]│ [Chi tiết]│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└───────────────────────────────────────────────────────────────────┘
```

### Màu trạng thái lớp
- 🟢 Xanh: Lớp bình thường (< 90% sĩ số)
- 🟡 Vàng: Lớp gần đầy (90-100% sĩ số) hoặc chưa có GVCN
- 🔴 Đỏ: Lớp quá tải hoặc chưa có HS nào

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Tạo lớp | Nút "+ Tạo lớp" | Form modal |
| Xem chi tiết lớp | Click card/row | Trang chi tiết |
| Đổi GVCN | Trong trang lớp → click GVCN | Dropdown chọn GV khác |
| Thêm HS vào lớp | Trong tab HS → "Thêm HS" | Search & select HS chưa có lớp |
| Chuyển HS ra | Checkbox HS → "Chuyển ra" | Modal chọn lớp đích |
| Phân lớp hàng loạt | Nút "Phân lớp HH" | Màn hình drag & drop |
| Đổi tên lớp | Click tên lớp inline | Edit trực tiếp |
| Gửi TB toàn lớp | Nút "Gửi thông báo" | Modal soạn thảo |
| Xuất danh sách lớp | Nút "Export" | Excel với tất cả HS |
| Lên lớp cuối năm | Tab "Kết thúc năm học" | Wizard 4 bước |

---

## Gom nhóm tính năng thông minh
Module Lớp học là **junction module** — kết nối HS với GV, với phòng học, với thời khóa biểu và với điểm số. Gom vào đây các tính năng: danh sách HS, phân lớp, GVCN, TKB lớp, điểm rèn luyện lớp — vì CBQL khi quản lý lớp cần thấy tất cả thông tin của lớp đó trên một màn hình, không phải nhảy sang module HS rồi lại module GV.

---

## Edge Cases & Validation
- **Lớp vượt sĩ số**: Block thêm HS khi đã đầy; hiển thị "Lớp đã đầy, sĩ số tối đa X". Gợi ý các lớp cùng khối còn chỗ.
- **Chuyển HS sang lớp khác khối**: Block hoàn toàn (không thể chuyển từ lớp 10 sang lớp 11 giữa năm).
- **Lớp không có GVCN**: Cảnh báo nhưng cho tồn tại; hiển thị badge "Chưa có GVCN".
- **Xóa lớp có HS**: Block; yêu cầu chuyển tất cả HS ra trước.
- **Lên lớp khi thiếu điểm**: Cảnh báo "X HS chưa có điểm HK2"; block lên lớp cho những HS đó cho đến khi điểm được nhập.
- **GVCN kiêm nhiệm 2 lớp**: Cảnh báo nhưng không block (trường hợp đặc biệt có thể xảy ra).
- **Tên lớp trùng**: Block nếu cùng năm học có 2 lớp cùng tên.
- **Phân lớp tự động không cân bằng**: Nếu số HS không chia đều, hiển thị preview và cho phép Admin điều chỉnh trước khi confirm.
- **Lưu ban ở lớp 12**: HS lưu ban lớp 12 cần được gán vào lớp 12 mới trong năm học tiếp theo (không tự động tốt nghiệp).

---

## Tích hợp
- **QL Học sinh**: Lớp là thuộc tính chính của HS; thay đổi lớp → cập nhật hồ sơ HS.
- **QL Giáo viên**: GVCN là GV được bổ nhiệm; phân công dạy lớp liên kết GV với lớp.
- **Điểm danh**: Camera và thiết bị điểm danh nhận diện HS theo lớp; báo cáo vắng theo lớp.
- **E-learning**: Lớp = nhóm học trong E-learning; HS trong lớp tự động được thêm vào khóa học của lớp.
- **Thi trực tuyến**: Danh sách thí sinh dự thi được lấy từ danh sách HS theo lớp/khối.
- **Thư viện**: Thẻ thư viện liên kết với lớp HS để thống kê mượn sách theo lớp.
- **Báo cáo**: Các báo cáo học lực, rèn luyện đều tổng hợp theo lớp → khối → toàn trường.
