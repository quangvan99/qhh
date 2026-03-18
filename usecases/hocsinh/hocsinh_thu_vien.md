# Thư Viện — Role: Học sinh

## Mục tiêu
Cho phép học sinh tìm kiếm sách và tài liệu trong thư viện trường, thực hiện mượn/trả sách trực tuyến, và theo dõi lịch sử mượn — giúp học sinh tiếp cận nguồn tài liệu học tập mà không cần đến thư viện để hỏi thủ công.

## User Story
"Là học sinh, tôi muốn tìm và mượn sách thư viện từ điện thoại để tôi biết sách nào đang có sẵn, đặt mượn trước khi đến lấy, và không bị trả muộn vì quên."

---

## User Flow Chính

### Flow 1: Tìm kiếm và đặt mượn sách
**Mô tả**: Học sinh cần tìm một cuốn sách cho môn Văn, đặt mượn từ xa trước khi đến trường.
**Trigger**: Nhấn tab "Thư viện" trong bottom nav.
**Steps**:
1. Màn hình Thư viện hiển thị thanh tìm kiếm nổi bật ở đầu + các danh mục phổ biến.
2. HS nhập tên sách hoặc tác giả (ví dụ: "Truyện Kiều") → kết quả hiện realtime.
3. Kết quả: danh sách sách kèm thông tin: tên, tác giả, ảnh bìa, số lượng còn lại, vị trí kệ.
4. HS nhấn vào sách muốn mượn → trang chi tiết sách.
5. Trang chi tiết: ảnh bìa lớn, mô tả, thông tin (NXB, năm, số trang), trạng thái: "Còn 2 cuốn trên kệ A3".
6. Nhấn **"Đặt mượn"** → xác nhận ngày đến lấy (trong 3 ngày làm việc).
7. Hệ thống giữ sách cho HS đến hết ngày đã chọn. Gửi push notification nhắc nhở.
**Expected Result**: HS đặt mượn sách từ nhà, đến thư viện chỉ cần lấy sách đã sẵn sàng.

### Flow 2: Duyệt sách theo danh mục / gợi ý
**Mô tả**: Học sinh không có sách cụ thể trong đầu, muốn khám phá tài liệu liên quan đến môn học.
**Trigger**: Nhấn vào danh mục hoặc banner gợi ý trên màn hình Thư viện.
**Steps**:
1. Màn hình Thư viện hiển thị: Danh mục (Văn học / Khoa học / Tham khảo...) + Banner "Phổ biến tuần này" + "Liên quan môn học của bạn".
2. HS nhấn "Liên quan môn học của bạn" → hệ thống hiển thị sách được GV các môn đang học gợi ý.
3. Hoặc chọn danh mục → duyệt danh sách sách trong danh mục đó.
4. Nhấn vào sách → chi tiết + đặt mượn (như flow 1).
**Expected Result**: HS khám phá được tài liệu bổ trợ phù hợp mà không cần biết trước tên sách.

### Flow 3: Trả sách và gia hạn
**Mô tả**: Học sinh muốn kiểm tra hạn trả và gia hạn nếu cần.
**Trigger**: Nhấn tab "Đang mượn" trong màn hình Thư viện.
**Steps**:
1. Hiển thị danh sách sách đang mượn với ngày hạn trả, số ngày còn lại.
2. Màu cảnh báo: xanh (còn >3 ngày), vàng (còn 1–3 ngày), đỏ (hôm nay/quá hạn).
3. Nhấn vào sách → chi tiết.
4. Nhấn "Gia hạn" → nếu không có ai đang chờ sách đó, hệ thống gia hạn thêm 7 ngày.
5. Nếu không được gia hạn (có người khác đặt trước): "Hiện không thể gia hạn. Vui lòng trả sách trước [ngày]."
6. Khi đến trả sách tại thư viện: nhân viên quét QR code trên màn hình app của HS → xác nhận trả.
**Expected Result**: HS không bao giờ trả muộn nhờ nhắc nhở kịp thời, gia hạn dễ dàng.

### Flow 4: Tìm tài liệu điện tử (e-book / PDF tham khảo)
**Mô tả**: Học sinh muốn tìm tài liệu học tập dạng số có thể đọc ngay trên app.
**Trigger**: Nhấn tab "Tài liệu số" hoặc lọc "Có thể đọc online" trong tìm kiếm.
**Steps**:
1. Bộ lọc "Tài liệu số" hiển thị chỉ sách/tài liệu có file e-book hoặc PDF.
2. Nhấn vào tài liệu → xem preview vài trang đầu miễn phí.
3. Nhấn "Đọc đầy đủ" → mở trong Document Viewer (không cần mượn vật lý).
4. Có thể bookmark trang, highlight, ghi chú inline.
5. Giới hạn: một số tài liệu chỉ cho đọc online, không tải về (tùy bản quyền).
**Expected Result**: HS truy cập tài liệu số ngay lập tức, không cần chờ đến thư viện.

---

## Tính năng & Màn hình

### Màn hình chính — Thư viện
- **Layout**: Search bar nổi bật ở đầu. Bên dưới: banner ngang (Nổi bật / Gợi ý). Danh mục grid 2x3. Quick access: Đang mượn / Lịch sử.
- **Components**:
  - `SearchBar` — Tìm theo tên sách / tác giả / ISBN / chủ đề
  - `CategoryGrid` — Grid 6 danh mục phổ biến với icon
  - `FeaturedBanner` — Carousel sách nổi bật / GV gợi ý
  - `QuickStats` — "Đang mượn: 2 cuốn | Sắp hết hạn: 1 cuốn"
  - `RecommendedShelf` — "Dành cho bạn" dựa trên môn học + lịch sử mượn

- **Danh mục**:
  - 📚 Sách giáo khoa & tham khảo
  - 📖 Văn học trong nước & nước ngoài
  - 🔬 Khoa học & Kỹ thuật
  - 🌍 Địa lý & Lịch sử
  - 🎨 Nghệ thuật & Âm nhạc
  - 📰 Tạp chí & Báo

### Màn hình Kết quả tìm kiếm
- **Layout**: List card dọc với thumbnail bìa sách bên trái.
- **Components**:
  - `BookCard` — Card sách với thông tin tóm tắt
  - `FilterBar` — Lọc: Đang có sẵn / Tất cả | Sách vật lý / Tài liệu số | Danh mục
  - `SortOption` — Sắp xếp: Liên quan / Mới nhất / Phổ biến nhất
  - `AvailabilityBadge` — "Còn X cuốn" (xanh) / "Hết sách" (đỏ) / "Có file số" (xanh dương)

- **Info trên BookCard**:
  - Ảnh bìa (thumbnail)
  - Tên sách (tối đa 2 dòng)
  - Tác giả
  - Danh mục tag
  - Trạng thái: số lượng còn lại + icon loại (📚 vật lý / 💻 số)
  - Rating sao (nếu có đánh giá của HS khác)

### Màn hình Chi tiết sách
- **Layout**: Ảnh bìa lớn ở đầu. Thông tin chi tiết. Nút CTA.
- **Components**:
  - `BookCover` — Ảnh bìa lớn (có thể zoom)
  - `BookInfo` — Tên, tác giả, NXB, năm, số trang, ISBN, danh mục
  - `AvailabilityStatus` — "Còn 2 cuốn — Kệ A3, Tầng 1"
  - `Description` — Mô tả/tóm tắt sách (collapsible nếu dài)
  - `BorrowButton` — "Đặt mượn" (xanh dương) / "Vào danh sách chờ" (nếu hết sách)
  - `ReadOnlineButton` — "Đọc online" (nếu có file số)
  - `RelatedBooks` — "Sách liên quan" gợi ý bên dưới
  - `ReviewSection` — Đánh giá từ HS khác

### Màn hình Đang mượn & Lịch sử
- **Tabs**: Đang mượn | Chờ lấy | Lịch sử
- **Đang mượn**: Danh sách sách kèm hạn trả, countdown, nút Gia hạn
- **Chờ lấy**: Sách đã đặt, đang được giữ, thời hạn đến lấy
- **Lịch sử**: Toàn bộ sách đã mượn, có thể mượn lại nhanh

### Màn hình QR Code trả/lấy sách
- HS mở QR code → thủ thư quét để confirm mượn/trả
- QR code hiển thị to, sáng, dễ quét ngay cả dưới ánh sáng thư viện
- Tự động refresh QR sau 30 giây (anti-screenshot fraud)

### Actions
| Action | Trigger | Kết quả |
|--------|---------|---------|
| Tìm kiếm sách | Tap search + gõ | Kết quả realtime |
| Xem chi tiết | Tap BookCard | Mở trang chi tiết sách |
| Đặt mượn | Tap "Đặt mượn" | Confirm ngày lấy → Đặt thành công |
| Vào danh sách chờ | Tap "Chờ" (hết sách) | Thêm vào waiting list + nhận notify |
| Gia hạn | Tap "Gia hạn" | Tự động +7 ngày nếu được |
| Đọc online | Tap "Đọc online" | Mở Document Viewer |
| Xem QR | Tap "Lấy sách" / "Trả sách" | Hiển thị QR code |
| Đánh giá sách | Tap ⭐ | Rating + review ngắn |
| Bookmark sách | Tap 🔖 | Lưu vào danh sách "Muốn đọc" |

---

## Gom nhóm tính năng thông minh

**Tại sao tích hợp tìm kiếm + đặt mượn + tài liệu số vào một nơi?**
- Học sinh không phân biệt "tôi muốn tìm sách" vs "tôi muốn đọc tài liệu số" — họ chỉ muốn tìm nguồn tài liệu để học. Gộp vào một search bar duy nhất với filter giúp trải nghiệm liền mạch.
- "Gợi ý theo môn học đang học" tận dụng context đã có (HS đang học gì) để cá nhân hóa thư viện — thay vì hiển thị catalog chung chung.
- Nhắc nhở hạn trả tích hợp vào Home feed (không chỉ trong module Thư viện) đảm bảo HS không bao giờ quên trả sách.
- QR code mượn/trả đơn giản hóa quy trình thủ công tại quầy, tiết kiệm thời gian cho cả HS lẫn thủ thư.

---

## UX Notes
- **Màu sắc**:
  - Sẵn có: `#43A047` xanh lá
  - Hết sách / Không có: `#E53935` đỏ
  - Có file số: `#1E88E5` xanh dương
  - Sắp hết hạn: `#FB8C00` cam
  - Quá hạn: `#B71C1C` đỏ đậm với icon ⚠️
- **Animation**:
  - Tìm kiếm: kết quả fade in từng card (stagger animation)
  - Đặt mượn thành công: animation sách "nhảy vào túi" + confetti nhỏ
  - QR code: gentle pulse để cho thấy đang active
  - Pull-to-refresh danh sách sách đang mượn
- **Offline**: Cache danh sách sách đang mượn + QR code (để trả sách khi offline).
- **Empty states**:
  - Không có sách trong danh mục: "Chưa có sách nào trong danh mục này 📚. Thư viện đang cập nhật thêm!"
  - Không đang mượn sách nào: "Bạn chưa mượn cuốn nào. Khám phá thư viện và tìm sách hay nhé! 📖"
  - Không có kết quả tìm kiếm: "Không tìm thấy '[từ khóa]'. Thử từ khóa khác hoặc liên hệ thủ thư."

---

## Edge Cases
- **Đặt mượn nhưng không đến lấy**: Sau ngày hết hạn giữ sách, hủy đặt tự động + thông báo HS. Giới hạn 3 lần hủy trong học kỳ — lần 4 bị khóa đặt mượn trực tuyến 1 tuần.
- **Sách bị mất hoặc hư**: HS báo cáo trong app → thủ thư xử lý → trạng thái đơn mượn cập nhật + thông báo phí đền bù nếu có.
- **Nhiều HS cùng đặt cuốn sách cuối cùng cùng lúc**: First-come-first-served theo timestamp. Người thua được vào waiting list tự động kèm thông báo.
- **Sách có nhiều bản / tái bản**: Hiển thị rõ bản nào, năm xuất bản — để HS không nhầm lấy sai bản.
- **Thư viện đóng cửa** (cuối tuần, lễ): Vẫn cho đặt mượn online, ngày lấy sách chỉ hiển thị ngày làm việc tiếp theo.
- **HS có tiền phạt** (trả muộn): Hiển thị thông báo số tiền phạt + không cho phép mượn thêm sách cho đến khi đóng phạt (liên hệ thủ thư).
- **File tài liệu số không load**: Retry 2 lần tự động. Nếu vẫn lỗi: "File đang bảo trì, thử lại sau. Bạn vẫn có thể mượn bản vật lý."
- **ISBN không tìm thấy**: Gợi ý tìm kiếm bằng tên hoặc "Không tìm thấy? Yêu cầu thư viện bổ sung sách này" — form đề nghị bổ sung.
