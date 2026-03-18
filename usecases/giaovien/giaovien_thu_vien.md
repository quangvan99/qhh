# Thư Viện Số — Role: Giáo viên

## Mục tiêu
Cho phép giáo viên tìm kiếm, mượn, đọc tài liệu nghiên cứu từ thư viện số của trường Quốc Học Huế ngay trên nền tảng — phục vụ nhu cầu tự học, chuẩn bị bài giảng, nghiên cứu chuyên môn — không cần đến thư viện vật lý, không cần làm thủ tục giấy tờ.

## Người dùng
- **Giáo viên bộ môn**: Tìm kiếm và mượn tài liệu phục vụ giảng dạy (sách giáo khoa tham khảo, tạp chí chuyên ngành, đề thi tham khảo), đọc online hoặc tải PDF, trả tài liệu kỹ thuật số.
- **Giáo viên chủ nhiệm**: Tương tự GV bộ môn, không có quyền đặc biệt hơn trong thư viện.
- **Giới hạn**: GV không thể nhập tài liệu vào thư viện (quyền đó thuộc Thủ thư/Admin).

---

## User Flow Chính

### Flow 1: Tìm kiếm tài liệu nghiên cứu
**Mô tả**: GV cần tìm sách tham khảo để chuẩn bị giáo án chương mới.
**Trigger**: GV vào module Thư viện → thanh tìm kiếm.
**Steps**:
1. GV nhập từ khóa: tên sách, tác giả, chủ đề, ISBN, hoặc từ khóa nội dung.
2. Kết quả tìm kiếm hiển thị ngay theo relevance:
   - Ảnh bìa, Tên tài liệu, Tác giả, Năm xuất bản, Nhà xuất bản.
   - Trạng thái: 🟢 Có sẵn / 🟡 Đang cho mượn / 🔵 Chỉ đọc online / 🔴 Hết số lượng.
   - Rating từ GV/HS khác đã đọc.
3. GV dùng bộ lọc nâng cao:
   - Loại tài liệu: Sách giáo khoa / Sách tham khảo / Tạp chí / Luận văn / Đề thi / Giáo án mẫu.
   - Môn học: Toán / Vật lý / Hóa / Sinh / Văn / Anh / Sử / Địa / ...
   - Ngôn ngữ: Tiếng Việt / Tiếng Anh / Khác.
   - Năm xuất bản: từ [X] đến [Y].
   - Chỉ hiện: Có thể mượn ngay / Có file digital.
4. GV bấm vào tài liệu → xem trang chi tiết: mô tả, mục lục, thông tin ấn bản, số bản vật lý, danh sách người mượn (ẩn danh).
**Expected Result**: GV tìm được tài liệu phù hợp trong < 2 phút.

---

### Flow 2: Mượn tài liệu kỹ thuật số (eBook/PDF)
**Mô tả**: GV mượn bản digital của tài liệu để đọc online hoặc tải về đọc offline.
**Trigger**: GV bấm "Mượn / Đọc online" trên trang chi tiết tài liệu có bản digital.
**Steps**:
1. Hệ thống kiểm tra quota mượn của GV (VD: GV được mượn tối đa 5 tài liệu digital cùng lúc).
2. Nếu còn quota → xác nhận mượn: "Bạn sẽ được đọc tài liệu này trong 30 ngày."
3. Tài liệu xuất hiện trong "Tủ sách của tôi" với countdown 30 ngày.
4. GV bấm "Đọc ngay" → PDF viewer tích hợp mở trong trình duyệt:
   - Zoom in/out, cuộn, nhảy trang.
   - Thêm bookmark ở trang cần quay lại.
   - Highlight đoạn văn + ghi chú sticky note.
   - Tìm kiếm từ khóa trong tài liệu.
5. Nếu GV muốn tải offline (nếu tài liệu cho phép): Bấm "Tải PDF" → file về máy.
6. Khi hết 30 ngày, tài liệu tự động "trả" (không còn truy cập được), ghi chú của GV vẫn lưu lại trong hệ thống.
**Expected Result**: GV đọc tài liệu không giới hạn giờ làm việc thư viện, mọi thiết bị có trình duyệt.

---

### Flow 3: Đặt mượn tài liệu vật lý
**Mô tả**: GV cần cuốn sách vật lý không có bản số, đặt mượn qua hệ thống để thủ thư chuẩn bị sẵn.
**Trigger**: GV bấm "Mượn bản vật lý" trên tài liệu có trạng thái "Có sẵn".
**Steps**:
1. Hệ thống hiển thị: Số bản có sẵn, Vị trí kệ sách, Thời hạn mượn tối đa (VD: 14 ngày).
2. GV xác nhận đặt mượn → hệ thống ghi nhận, thủ thư nhận thông báo.
3. Thủ thư chuẩn bị sách → cập nhật trạng thái "Sẵn sàng cho GV X lấy".
4. GV nhận thông báo "Sách X đã sẵn sàng. Vui lòng đến quầy thư viện lấy trước ngày Y."
5. GV đến lấy sách → thủ thư scan mã, hệ thống ghi nhận ngày mượn, ngày trả dự kiến.
6. Trả sách: GV mang sách đến thư viện, thủ thư scan → hệ thống cập nhật trả, GV nhận xác nhận.
**Expected Result**: GV không cần xếp hàng hay đợi thủ thư tìm sách — đến lấy là có ngay.

---

### Flow 4: Quản lý tủ sách cá nhân
**Mô tả**: GV xem danh sách tài liệu đang mượn, lịch trả, lịch sử mượn trả.
**Trigger**: GV bấm "Tủ sách của tôi" trong module Thư viện.
**Steps**:
1. Tab **"Đang mượn"**: Danh sách tài liệu hiện tại, hạn trả còn lại (cảnh báo màu đỏ nếu < 3 ngày).
2. Tab **"Đặt mượn"**: Đơn đặt mượn đang chờ xử lý.
3. Tab **"Lịch sử"**: Tất cả tài liệu đã mượn, đã trả, thời gian mượn.
4. Tab **"Đã lưu (Wishlist)"**: Tài liệu GV lưu lại để đọc sau (bookmark danh mục, khác với bookmark trang trong tài liệu).
5. GV gia hạn tài liệu đang mượn (nếu không có người khác đặt trước): Bấm "Gia hạn" → thêm 14 ngày.
6. GV đánh giá sao + viết nhận xét tài liệu đã đọc → giúp đồng nghiệp khác chọn tài liệu.
**Expected Result**: GV quản lý được deadline trả sách, không bao giờ bị phạt trễ hạn vì quên.

---

### Flow 5: Chia sẻ tài liệu hữu ích với đồng nghiệp
**Mô tả**: GV tìm thấy tài liệu hay và muốn giới thiệu cho đồng nghiệp cùng bộ môn.
**Trigger**: GV đang xem chi tiết tài liệu → bấm "Chia sẻ".
**Steps**:
1. Modal chia sẻ: Gửi đến (chọn từ danh sách GV), kèm ghi chú "Cuốn này giải thích hàm số mũ rất hay, chương 3 rất phù hợp lớp 11 mình dạy."
2. Tùy chọn: Chia sẻ lên "Nhóm Tổ Toán" (group thư viện bộ môn).
3. Người nhận thấy thông báo "GV [Tên] giới thiệu tài liệu [Tên sách]" kèm ghi chú.
**Expected Result**: Tri thức được lan tỏa trong tổ bộ môn, GV mới không phải mò mẫm tìm tài liệu một mình.

---

## Tính năng & Màn hình

### Màn hình 1: Trang chủ Thư viện (dành cho GV)
```
┌─────────────────────────────────────────────────────────┐
│  📚 Thư viện Quốc Học Huế                               │
│  [🔍 Tìm tài liệu: sách, tác giả, chủ đề, ISBN...  🔍] │
├──────────────────────────┬──────────────────────────────┤
│  GỢI Ý CHO BẠN            │  TỦ SÁCH CỦA TÔI            │
│  (dựa trên môn bạn dạy)  │  ─────────────────────────  │
│  ─────────────────────   │  Đang mượn: 3 tài liệu       │
│  📖 Toán cao cấp T.1      │  🔴 Hết hạn ngày mai: 1 cuốn │
│  ⭐4.5 | Còn sẵn          │  ⏳ Còn 12 ngày: 2 cuốn      │
│  [Mượn] [Đọc online]     │  [Xem tủ sách →]             │
│  ─────────────────────   │  ─────────────────────────  │
│  📖 Đề thi THPT QG 5 năm  │  ĐÃ LƯU (WISHLIST): 5       │
│  ⭐4.2 | Chỉ đọc online   │  [Xem wishlist →]            │
│  [Đọc online]            │                              │
├──────────────────────────┴──────────────────────────────┤
│  DANH MỤC:                                              │
│  [📐 Toán] [⚗️ Lý-Hóa] [📝 Văn] [🌏 Anh] [Tất cả →]  │
│  ─────────────────────────────────────────────────────  │
│  MỚI NHẬP KHO:                                         │
│  📖 Bài tập Giải tích (NXB ĐH QG) — Nhập ngày 15/3    │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 2: Trang chi tiết tài liệu
```
┌─────────────────────────────────────────────────────────┐
│  [← Quay lại]                                           │
│  ┌──────┐  Toán Giải Tích — Tập 1                       │
│  │ Bìa  │  Tác giả: Nguyễn Đình Trí                     │
│  │ sách │  NXB: Giáo dục | Năm: 2019 | ISBN: 978-xxx    │
│  └──────┘  Ngôn ngữ: Tiếng Việt                         │
│            ⭐⭐⭐⭐⭐ 4.7/5 (23 đánh giá)                │
│            ─────────────────────────────────────────── │
│            🟢 Bản vật lý: 3 bản / Kệ A2-15              │
│            🔵 Bản kỹ thuật số: Có (PDF 450 trang)       │
│            ─────────────────────────────────────────── │
│            [📖 Đọc online] [⬇️ Tải PDF] [📚 Mượn vật lý]│
│            [🔖 Lưu wishlist] [📤 Chia sẻ]               │
├─────────────────────────────────────────────────────────┤
│  MÔ TẢ: ...                                             │
│  MỤC LỤC: Chương 1... Chương 2...                       │
│  ĐÁNH GIÁ CỦA GV/HS: [xem 23 đánh giá]                │
│  [+ Viết đánh giá của bạn]                              │
└─────────────────────────────────────────────────────────┘
```

### Màn hình 3: Tủ sách cá nhân (My Library)
```
┌─────────────────────────────────────────────────────────┐
│  📚 Tủ sách của tôi                                     │
│  [Đang mượn (3)] [Đặt mượn (1)] [Lịch sử] [Wishlist]  │
├─────────────────────────────────────────────────────────┤
│  🔴 Toán Giải Tích T.1 (vật lý)                         │
│  Hạn trả: Ngày mai, 18/3/2026  ← CẦN TRẢ GẤP          │
│  [Gia hạn] [Trả sách (scan QR)]                         │
├─────────────────────────────────────────────────────────┤
│  🟢 Đề thi THPT 5 năm (digital)                         │
│  Còn 12 ngày | Đọc trang 145/320                        │
│  [Tiếp tục đọc →] [Trả sớm]                            │
├─────────────────────────────────────────────────────────┤
│  🟡 Phương pháp dạy học Toán (digital)                  │
│  Còn 8 ngày | Chưa đọc                                 │
│  [Đọc ngay →] [Trả sớm]                                │
└─────────────────────────────────────────────────────────┘
```

### PDF Reader tích hợp
```
┌─────────────────────────────────────────────────────────┐
│  📖 Toán Giải Tích T.1 | Trang 145/320    [X Đóng]     │
│  [🔖 Bookmark] [🔍 Tìm] [⬅️145/320➡️] [🔍+] [🔍-]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Nội dung PDF được render tại đây]                     │
│                                                         │
│  [Highlight text → popup: Màu | Ghi chú | Copy]        │
│                                                         │
└─────────────────────────────────────────────────────────┘
│  GHI CHÚ CỦA BẠN (trang này):                          │
│  📝 "Áp dụng cho ví dụ bài 3.4 khi dạy lớp 11A2"      │
│  [+ Thêm ghi chú]                                       │
└─────────────────────────────────────────────────────────┘
```

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Tìm kiếm tài liệu | Gõ từ khóa vào thanh tìm | Kết quả lọc realtime |
| Đọc online | Bấm "Đọc online" | Mở PDF reader tích hợp |
| Mượn digital | Bấm "Mượn / Đọc" | Thêm vào tủ sách, đếm ngược 30 ngày |
| Đặt mượn vật lý | Bấm "Mượn bản vật lý" | Thủ thư nhận đơn, GV nhận thông báo khi sẵn sàng |
| Gia hạn | Bấm "Gia hạn" trong tủ sách | Thêm 14 ngày (nếu không có người đặt trước) |
| Lưu vào wishlist | Bấm "🔖 Lưu" | Tài liệu vào tab Wishlist |
| Chia sẻ tài liệu | Bấm "Chia sẻ" → chọn người | Thông báo tới GV được chia sẻ |
| Đánh giá tài liệu | Bấm "Viết đánh giá" | Form nhập sao + nhận xét |
| Xem lịch sử mượn | Bấm tab "Lịch sử" | Danh sách tất cả lần mượn trả |

---

## Gom nhóm tính năng thông minh

**Gợi ý thông minh theo môn dạy**: Hệ thống biết GV dạy môn gì → tự lọc và gợi ý tài liệu phù hợp trên trang chủ thư viện. GV Toán thấy sách Toán; GV Văn thấy tác phẩm văn học, tài liệu giảng dạy Ngữ văn.

**Nhắc trả sách tự động**: 5 ngày trước hạn → thông báo in-app. 1 ngày trước hạn → SMS/email. Ngày hạn trả → thông báo khẩn. Quá hạn → ghi vào hồ sơ mượn trả của GV (ảnh hưởng quota).

**Bookmark và ghi chú xuyên phiên**: GV đọc đến trang 145 hôm nay, ngày mai mở lại → tự động nhảy đến trang đó. Ghi chú highlight được lưu cloud, xem được từ mọi thiết bị.

**Tài liệu liên quan**: Trang chi tiết tài liệu hiện "GV khác cũng mượn: [tài liệu B, C]" → gợi ý mở rộng danh sách đọc.

---

## Edge Cases & Validation

- **Hết quota mượn digital (5/5)**: Hiển thị "Bạn đang mượn 5 tài liệu (tối đa). Trả 1 tài liệu để mượn thêm." Không cho mượn thêm.
- **Tài liệu digital không cho tải về** (DRM): Chỉ hiện nút "Đọc online", không hiện "Tải PDF". Giải thích: "Tài liệu này chỉ đọc online theo quy định bản quyền."
- **GV đặt mượn vật lý nhưng không đến lấy trong 3 ngày**: Hủy đặt mượn, trả lại sách vào kho. Gửi thông báo cho GV.
- **Mất kết nối khi đang đọc PDF**: Hệ thống cache trang hiện tại, GV đọc được tạm thời. Bookmark tự lưu khi có kết nối trở lại.
- **Tài liệu bị xóa khỏi hệ thống khi GV đang mượn digital**: GV được phép đọc hết thời hạn 30 ngày. Sau đó không còn truy cập. Thông báo trước 7 ngày.
- **Tìm kiếm không có kết quả**: Hiển thị "Không tìm thấy tài liệu phù hợp. Gợi ý: Yêu cầu thủ thư nhập bổ sung [nút yêu cầu nhập sách]."
- **GV bị treo tài khoản mượn sách** (do quá hạn quá lâu): Thông báo rõ "Tài khoản mượn sách tạm khóa do trễ hạn X ngày. Liên hệ thủ thư để mở khóa."
- **Cùng 1 tài liệu nhiều GV muốn mượn vật lý**: Xếp hàng đặt mượn. Khi người mượn trả → tự động notify người tiếp theo trong danh sách chờ.

---

## Tích hợp

- **Module QL Thư viện**: Hệ thống backend quản lý danh mục, số lượng bản, trạng thái mượn/trả vật lý.
- **DRM Service**: Kiểm soát quyền đọc tài liệu kỹ thuật số, giới hạn download.
- **PDF Viewer Service**: Render PDF trong trình duyệt với tính năng annotation.
- **Module Thông báo**: Nhắc hạn trả, thông báo khi sách đặt trước sẵn sàng, chia sẻ tài liệu từ đồng nghiệp.
- **Storage Service**: Lưu trữ file PDF tài liệu kỹ thuật số.
- **Module Hệ thống xác thực**: GV chỉ truy cập thư viện sau khi đăng nhập, quota mượn gắn với tài khoản cá nhân.
- **Search Engine**: Full-text search trên mô tả, tiêu đề, từ khóa tài liệu để hỗ trợ tìm kiếm nâng cao.
