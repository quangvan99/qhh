# Quản Lý Thư Viện — Role: Admin

## Mục tiêu
Cung cấp cho Admin công cụ quản lý toàn bộ nghiệp vụ thư viện trường: nhập sách mới, quản lý thẻ thư viện HS/GV, kiểm soát mượn-trả, gộp/kiểm thẻ, và báo cáo thống kê sử dụng thư viện — hướng đến tự động hóa tối đa công việc thủ công.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền CRUD toàn bộ module thư viện; quản lý mã thẻ hàng loạt; gộp ID; cấu hình quy tắc mượn trả; tích hợp với hệ thống phòng đọc.
- **CBQL**: Xem báo cáo thống kê sử dụng thư viện; xem tình trạng sách; không thể thêm/xóa sách; không quản lý thẻ; không điều chỉnh giao dịch mượn trả.

---

## User Flow Chính

### Flow 1: Nhập sách mới (Mua sắm & Đăng ký)
**Mô tả**: Thủ thư/QTHT đăng ký sách mới mua vào hệ thống quản lý thư viện.
**Trigger**: Menu "Thư viện" → Tab "Đầu sách" → Nút **"+ Nhập sách mới"**.
**Steps**:
1. **Phương thức nhập**:
   - **Quét mã ISBN**: Nhập ISBN → hệ thống tự động tra cứu thông tin từ Google Books API / OpenLibrary → điền tự động Tên sách, Tác giả, Nhà xuất bản, Năm, Ảnh bìa.
   - **Nhập tay**: Form đầy đủ nếu không tìm được qua ISBN.
   - **Import Excel**: Nhập hàng loạt từ danh sách hóa đơn nhập hàng.
2. **Form đăng ký đầu sách**:
   - Thông tin cơ bản: Tên sách, Tác giả (multi), Nhà xuất bản, Năm XB, ISBN/ISSN, Thể loại (có thể chọn nhiều), Ngôn ngữ, Số trang, Tóm tắt.
   - Thông tin thư viện: Mã phân loại DDC (Dewey Decimal), Khu vực lưu trữ (giá sách, kệ, tầng), Từ khóa tìm kiếm.
   - Thông tin nhập: Số lượng quyển nhập, Đơn giá, Tổng tiền, Ngày nhập, Nguồn mua (nhà sách/nhà tài trợ).
3. Hệ thống tự sinh **mã cá thể (barcode)** cho từng quyển: `TV-2025-001234`.
4. In nhãn barcode: chọn số lượng → hiển thị preview nhãn → gửi lệnh in đến máy in nhãn.
5. Sách mới hiển thị trong danh sách với badge "Mới nhập".
**Expected Result**: Sách được đăng ký đầy đủ, barcode sẵn sàng dán, có thể tìm kiếm ngay.

---

### Flow 2: Quản lý thẻ thư viện HS/GV
**Mô tả**: QTHT tạo, phát, hủy và quản lý thẻ thư viện cho toàn trường.
**Trigger**: Menu "Thư viện" → Tab **"Quản lý thẻ"**.
**Steps**:
1. Màn hình "Quản lý thẻ" hiển thị:
   - Thống kê: Tổng thẻ đã cấp | Thẻ hoạt động | Thẻ hết hạn | Thẻ bị khóa.
   - Danh sách thẻ với filter (loại thẻ HS/GV, trạng thái, lớp, ngày cấp).
2. **Tạo thẻ hàng loạt**:
   - Chọn đối tượng: Tất cả HS lớp 10 (mới vào) / Tất cả HS chưa có thẻ / Danh sách cụ thể.
   - Hệ thống sinh mã thẻ tự động theo quy tắc cấu hình (VD: `HS2025XXXXX`).
   - Preview danh sách thẻ sẽ tạo → Confirm → Tạo hàng loạt.
   - Xuất file Excel danh sách thẻ để in và phát cho HS.
3. **Gộp ID thẻ** (khi HS có nhiều thẻ do lỗi nhập):
   - Tìm các HS có > 1 thẻ hoạt động → hệ thống gợi ý danh sách cần gộp.
   - Admin chọn thẻ "chính" (giữ lại) và thẻ "phụ" (gộp vào chính).
   - Lịch sử mượn từ thẻ phụ được chuyển sang thẻ chính.
   - Thẻ phụ bị vô hiệu hóa.
4. **Kiểm thẻ hàng loạt** (đầu năm học):
   - Import file danh sách mã thẻ từ máy quét → so sánh với database.
   - Báo cáo: Thẻ hợp lệ | Thẻ không tìm thấy | Thẻ đã hủy (đang dùng lại).
5. Gia hạn thẻ hết hạn: bulk select → "Gia hạn 1 năm" → cập nhật tất cả.
**Expected Result**: Quản lý 1,500+ thẻ thư viện dễ dàng; không có thẻ trùng lặp hoặc thẻ ma.

---

### Flow 3: Mượn & Trả sách (Nghiệp vụ hàng ngày)
**Mô tả**: Thủ thư/QTHT xử lý giao dịch mượn và trả sách tại quầy thư viện.
**Trigger**: Menu "Thư viện" → Tab **"Mượn/Trả"** (màn hình thường xuyên nhất của thủ thư).
**Steps**:
**Mượn sách**:
1. Quét/nhập mã thẻ bạn đọc → Hiển thị ngay: Tên, lớp, ảnh, số sách đang mượn, số sách còn được mượn tối đa.
2. Quét mã barcode từng quyển sách → Mỗi quyển xuất hiện trên danh sách kèm tên sách, mã cá thể, hạn trả dự kiến.
3. Nếu vượt giới hạn mượn → Cảnh báo đỏ, block giao dịch.
4. Nếu bạn đọc có sách quá hạn chưa trả → Cảnh báo vàng, admin có thể override với lý do.
5. Nhấn **"Xác nhận mượn"** → In biên lai (tùy chọn) → Clear form cho giao dịch tiếp theo.

**Trả sách**:
1. Quét mã barcode quyển sách → Hệ thống tự nhận biết giao dịch mượn tương ứng.
2. Hiển thị: Người mượn, ngày mượn, hạn trả, số ngày quá hạn (nếu có), tiền phạt (nếu trường có quy định).
3. Kiểm tra tình trạng sách: dropdown (Tốt / Hư hỏng nhẹ / Hư hỏng nặng / Mất trang) + ghi chú.
4. Nếu hư hỏng/mất: ghi nhận, tính phí bồi hoàn (có thể cấu hình).
5. **"Xác nhận trả"** → Sách về trạng thái "Có sẵn"; cập nhật số lượt mượn của đầu sách.
**Expected Result**: Xử lý mượn/trả trong < 30 giây/giao dịch với UI tối giản cho thủ thư.

---

### Flow 4: Tra cứu & tìm kiếm sách (OPAC đơn giản)
**Mô tả**: Admin tra cứu tình trạng sách nhanh để trả lời bạn đọc.
**Trigger**: Tab "Đầu sách" → Thanh search (hoặc Ctrl+K).
**Steps**:
1. Search bar hỗ trợ: tên sách (fuzzy search), tác giả, ISBN, mã phân loại, từ khóa.
2. Kết quả hiển thị dạng card: ảnh bìa, tên, tác giả, năm, thể loại, **trạng thái tồn kho** (X/Y quyển có sẵn).
3. Click vào đầu sách → Chi tiết:
   - Tab "Thông tin": đầy đủ thư mục.
   - Tab "Tồn kho": danh sách từng quyển (mã cá thể, vị trí, trạng thái: Có sẵn / Đang mượn / Bảo trì).
   - Tab "Lịch sử": ai đã mượn quyển này, khi nào.
   - Tab "Đặt trước": danh sách người đang chờ mượn (nếu tất cả quyển đang được mượn).
4. Nút **"Đặt trước"** cho bạn đọc (HS/GV): hệ thống tự thông báo khi sách được trả.
**Expected Result**: Tìm sách và biết tình trạng tồn kho trong < 10 giây.

---

## Tính năng & Màn hình

### Màn hình Mượn/Trả — Layout tối ưu cho thủ thư
```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: Mượn/Trả Sách | [TAB: Mượn ●] [Trả ○] [Gia hạn ○]     │
├─────────────────────────────┬────────────────────────────────────┤
│ BƯỚC 1: QUÉT THẺ BẠN ĐỌC  │ THÔNG TIN BẠN ĐỌC                │
│ [Nhập mã thẻ / Quét QR]    │ 📷 Ảnh | Nguyễn Văn A | 11A2     │
│ hoặc tìm theo tên...        │ Đang mượn: 2/5 sách              │
│                              │ ⚠ Không có sách quá hạn          │
├─────────────────────────────┴────────────────────────────────────┤
│ BƯỚC 2: QUÉT SÁCH                                                │
│ [Nhập mã barcode / Quét]                                         │
├──────────┬────────────────────────────┬──────────┬──────────────┤
│ #        │ Tên sách                   │ Mã CT    │ Hạn trả      │
├──────────┼────────────────────────────┼──────────┼──────────────┤
│ 1        │ Toán đại số 11             │ TV-00123 │ 17/04/2026   │
│ 2        │ Vật lý đại cương           │ TV-00456 │ 17/04/2026   │
├──────────┴────────────────────────────┴──────────┴──────────────┤
│                              [Xóa dòng] [✓ XÁC NHẬN MƯỢN]       │
└──────────────────────────────────────────────────────────────────┘
```

### Màn hình Danh mục sách — Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ FILTER: [Thể loại ▼] [Tác giả ▼] [Năm XB ▼] [Trạng thái ▼]   │
│ [🔍 Tìm sách theo tên, tác giả, ISBN...]                        │
├──────────────────────────────────────────────────────────────────┤
│ VIEW: [Card ●] [Bảng ○]  Sort: [Mượn nhiều nhất ▼]              │
├────────────────────────────────────────────────────────────────── │
│ [📚 Ảnh bìa]  Tên sách              Tác giả     Tồn: 3/5 ✅    │
│               [Xem] [Sửa] [Nhập thêm] [⋮]                      │
└──────────────────────────────────────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Nhập sách mới | Nút "+ Nhập sách" | Form đăng ký + quét ISBN |
| Sửa thông tin sách | Nút "Sửa" | Drawer chỉnh sửa |
| Thanh lý sách | Menu ⋮ → Thanh lý | Ghi nhận lý do, giảm tồn kho |
| Tạo thẻ hàng loạt | Tab Thẻ → "Tạo hàng loạt" | Wizard chọn đối tượng |
| Gộp thẻ trùng | Tab Thẻ → "Gộp ID" | Wizard xác nhận thẻ chính/phụ |
| Mượn sách | Tab Mượn/Trả → quét thẻ | Giao dịch mượn |
| Trả sách | Tab Mượn/Trả → Trả → quét sách | Giao dịch trả |
| Gia hạn mượn | Tìm giao dịch → Gia hạn | Cộng thêm X ngày |
| Xuất báo cáo | Nút "Xuất" trên tab báo cáo | Excel/PDF |
| In nhãn barcode | Trong trang sách → In nhãn | Gửi lệnh in nhãn |

---

## Gom nhóm tính năng thông minh
Module thư viện gom **danh mục sách + quản lý thẻ + giao dịch mượn trả + báo cáo** thành một hệ thống tích hợp. Đặc biệt, tính năng "Gộp ID" và "Kiểm thẻ" được nhúng vào module thư viện (không phải QL HS) vì đây là nghiệp vụ riêng của thủ thư: xử lý thẻ thư viện độc lập với hồ sơ học sinh đầy đủ. Thủ thư không cần quyền vào module QL HS để làm công việc hàng ngày của mình.

---

## Edge Cases & Validation
- **Mượn sách đang được người khác mượn**: Block; hiển thị "Đang được mượn bởi [tên], hạn trả [ngày]"; gợi ý "Đặt trước".
- **Quét thẻ không tìm thấy**: Hiển thị "Thẻ không hợp lệ hoặc chưa đăng ký"; gợi ý "Tạo thẻ mới".
- **Sách quá hạn quá 30 ngày**: Tự động gửi thông báo nhắc nhở; sau 60 ngày → báo mất sách, tính phí bồi hoàn.
- **Import Excel sách trùng ISBN**: Hỏi "Cập nhật số lượng" hay "Tạo đầu sách mới".
- **Mất sách giữa năm học**: Ghi nhận sự kiện "Mất" với ảnh bằng chứng upload; giảm tồn kho; tính phí HS (nếu có).
- **Thẻ hết hạn vẫn đến mượn**: Cảnh báo "Thẻ hết hạn từ [ngày]"; cho phép gia hạn ngay trong giao dịch.
- **Thanh lý sách đang được mượn**: Block; yêu cầu chờ sách được trả trước.
- **Ảnh bìa sách**: Fallback về ảnh placeholder nếu không tìm thấy; cho phép upload ảnh bìa thủ công.
- **ISBN không hợp lệ**: Validate checksum ISBN-10/13; cảnh báo nhưng vẫn cho nhập nếu ISBN không có trong database.
- **Số lượng mượn tối đa**: Cấu hình riêng cho HS (3-5 quyển) và GV (10 quyển); có thể override có lý do cho từng người.

---

## Tích hợp
- **QL Học sinh**: Mã HS liên kết với thẻ thư viện; khi HS thôi học → tự động khóa thẻ; nhắc trả sách nếu còn mượn.
- **QL Giáo viên**: GV có thẻ thư viện riêng; đặc quyền mượn nhiều hơn và dài hơn.
- **Google Books API / OpenLibrary**: Tra cứu thông tin sách tự động qua ISBN.
- **HUE-S**: HS nhận thông báo sách sắp đến hạn trả, thông báo sách đặt trước đã có.
- **Email/SMS gateway**: Nhắc nhở trả sách quá hạn.
- **Máy in nhãn barcode**: API máy in nhãn Zebra/TSC để in barcode cá thể sách.
- **Máy quét barcode**: USB HID keyboard emulation; không cần driver đặc biệt.
- **Báo cáo tổng hợp**: Số liệu thư viện được đưa vào dashboard tổng hợp Admin.
- **Sở GD&ĐT**: Báo cáo tình trạng thư viện trường cuối năm học.
