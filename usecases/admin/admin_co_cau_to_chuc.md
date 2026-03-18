# Cơ Cấu Tổ Chức Nhà Trường — Role: Admin

## Mục tiêu
Cho phép QTHT và CBQL xây dựng, duy trì và trực quan hóa cơ cấu tổ chức của trường THPT Quốc Học Huế dưới dạng **cây phân cấp động** (OrgTree): từ Ban Giám hiệu → Phó Hiệu trưởng → Tổ bộ môn → Giáo viên trong tổ. Module cũng quản lý thông tin pháp lý của trường, lịch học theo năm và lịch sử cơ cấu tổ chức qua từng năm học.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền CRUD tất cả node trong cây tổ chức; tạo/chuyển năm học; cấu hình thông tin trường; cấu hình lịch học; xuất PDF sơ đồ; xóa node có ràng buộc (với xác nhận).
- **CBQL**: Xem toàn bộ cây tổ chức; chỉnh sửa thông tin tổ bộ môn mình phụ trách (tên, mô tả, trưởng tổ); không thêm/xóa node cấp Hiệu trưởng/Phó HT; không thay đổi cơ cấu năm học đã kết thúc; không xuất PDF.

---

## User Flow Chính

### Flow 1: Xem cây cơ cấu tổ chức (OrgTree)
**Mô tả**: CBQL/QTHT truy cập màn hình cơ cấu tổ chức để nắm tổng quan nhân sự và cấu trúc phân cấp của trường trong năm học hiện tại.
**Trigger**: Menu Admin → "Cơ cấu Tổ chức" → Tab "Sơ đồ tổ chức".
**Steps**:
1. Màn hình tải cây OrgTree theo năm học đang hoạt động. Node gốc là **Hiệu trưởng**.
2. Cây mặc định hiển thị ở mức 2 (thu gọn tổ bộ môn, ẩn giáo viên). Nút **"Mở rộng tất cả"** / **"Thu gọn tất cả"** ở góc phải.
3. Mỗi node hiển thị: avatar (ảnh đại diện), tên, chức danh/chức vụ, badge số thành viên (đối với node nhóm).
4. Click vào node bất kỳ → **Panel thông tin** trượt từ phải vào, hiển thị:
   - Thông tin chi tiết người/đơn vị đó
   - Danh sách thành viên (nếu là node nhóm)
   - Lịch sử thay đổi (ai, khi nào, thay đổi gì)
5. Dùng chuột **scroll to zoom** (thu/phóng cây); **kéo canvas** để di chuyển toàn cây.
6. Selector **"Năm học"** góc trên trái → chọn năm học cũ → cây hiển thị cơ cấu của năm đó (read-only).
7. Toggle **"Chế độ xem"**: Cây dọc (top-down) ↔ Cây ngang (left-right).
**Expected Result**: Người dùng nắm được toàn bộ cơ cấu tổ chức trong vòng < 30 giây, có thể drill-down đến từng giáo viên.

---

### Flow 2: Thêm node vào cây (thêm tổ bộ môn, thêm giáo viên vào tổ)
**Mô tả**: QTHT bổ sung đơn vị hoặc nhân sự vào cây tổ chức khi có thay đổi (thành lập tổ mới, bổ sung GV).
**Trigger**: Hover vào node cha → Nút **"+ Thêm node con"** hiện ra → Click.
**Steps**:
1. Modal **"Thêm node"** mở ra với 2 loại:
   - **Thêm đơn vị/tổ**: Tên đơn vị (bắt buộc), mô tả, chọn trưởng đơn vị (dropdown GV), loại node (Phó HT / Tổ bộ môn / Bộ phận hành chính).
   - **Thêm thành viên/GV**: Tìm kiếm GV theo tên hoặc mã GV trong danh sách GV của trường; multi-select để thêm nhiều GV cùng lúc vào tổ.
2. Với **thêm đơn vị**: Preview node mới sẽ xuất hiện ở đâu trong cây (vị trí highlight màu xanh lá).
3. Với **thêm GV vào tổ**: Hệ thống kiểm tra GV đã thuộc tổ khác chưa → hiển thị cảnh báo "GV Nguyễn Văn A đang thuộc Tổ Toán. Chuyển sang tổ này?" với 2 lựa chọn: **"Chuyển tổ"** hoặc **"Cho phép kiêm nhiệm"**.
4. Confirm → node mới xuất hiện trong cây với hiệu ứng fade-in; hệ thống tự lưu và ghi log thay đổi.
5. Toast notification: "Đã thêm [tên node] vào [tên node cha]".
**Expected Result**: Node mới được thêm vào đúng vị trí trong cây, có đầy đủ thông tin và lịch sử.

---

### Flow 3: Chỉnh sửa thông tin node (tên tổ, trưởng tổ, mô tả)
**Mô tả**: CBQL/QTHT cập nhật thông tin một đơn vị hoặc thành viên trong cây tổ chức.
**Trigger**: Click vào node → Panel thông tin → Nút **"Chỉnh sửa"** (bút chì icon).
**Steps**:
1. Panel thông tin chuyển sang chế độ **Edit inline**:
   - **Tên đơn vị/tổ**: Trường text editable trực tiếp.
   - **Mô tả**: Textarea.
   - **Trưởng tổ**: Dropdown chỉ liệt kê GV đang thuộc tổ này.
   - **Môn học phụ trách** (với Tổ BM): Multi-select danh mục môn.
2. CBQL chỉ thấy nút "Chỉnh sửa" ở node tổ mình phụ trách; các node khác chỉ xem (read-only).
3. Nhấn **"Lưu"** → Validation: Tên không để trống, Trưởng tổ phải là thành viên trong tổ.
4. Hệ thống lưu thay đổi, cập nhật node trên cây ngay lập tức, ghi log: "CBQL [tên] đổi tên tổ từ [cũ] → [mới] lúc [timestamp]".
5. Nhấn **"Hủy"** → hoàn tác về trạng thái ban đầu, không lưu.
**Expected Result**: Thông tin node được cập nhật ngay trên cây mà không cần tải lại trang; lịch sử thay đổi được ghi lại.

---

### Flow 4: Di chuyển node (drag-and-drop giáo viên từ tổ này sang tổ khác)
**Mô tả**: QTHT tái cơ cấu bằng cách kéo thả node GV hoặc node tổ sang vị trí mới trong cây.
**Trigger**: Chế độ **"Chỉnh sửa cây"** (nút toggle góc phải) → Kéo node.
**Steps**:
1. Nhấn nút **"Bật chế độ chỉnh sửa cây"** → Cây chuyển sang trạng thái edit: các node có viền đứt nét, cursor đổi thành grab.
2. **Kéo node GV**: Kéo avatar/tên GV từ tổ cũ → thả vào tổ mới.
   - Trong khi kéo: các tổ hợp lệ để thả được highlight màu xanh; các node không hợp lệ (VD: kéo GV vào node Hiệu trưởng) highlight đỏ với tooltip "Không thể đặt tại đây".
   - Khi thả vào tổ đích: **Confirm dialog** "Chuyển GV [tên] từ Tổ [A] → Tổ [B]? Có hiệu lực từ ngày: [input date]".
3. **Kéo node tổ**: Kéo cả một tổ bộ môn sang dưới Phó HT khác (ví dụ tái phân công phụ trách).
   - Confirm dialog liệt kê tác động: "Tổ [tên] và [X] GV sẽ chuyển sang phụ trách của [Phó HT mới]".
4. Confirm → Cây cập nhật ngay, đường nối (edge) vẽ lại, ghi log đầy đủ.
5. Nút **"Hoàn tác"** (Undo) xuất hiện 10 giây sau khi thả — cho phép rollback.
6. Nhấn **"Tắt chế độ chỉnh sửa"** → lưu toàn bộ thay đổi trong phiên, thoát chế độ edit.
**Expected Result**: Tái cơ cấu tổ chức nhanh, trực quan bằng kéo thả; không cần form phức tạp; undo được nếu thả nhầm.

---

### Flow 5: Xóa node (kiểm tra ràng buộc — không xóa tổ còn GV)
**Mô tả**: QTHT xóa một node không còn cần thiết (tổ đã giải thể, GV đã nghỉ việc ra khỏi tổ).
**Trigger**: Click node → Panel thông tin → Menu ⋮ → **"Xóa node"**.
**Steps**:
1. Hệ thống **kiểm tra ràng buộc tức thì** trước khi hiện confirm:
   - Nếu node là **Tổ bộ môn còn GV**: Chặn ngay với thông báo lỗi: "Không thể xóa Tổ [tên] vì còn [X] giáo viên đang thuộc tổ. Hãy chuyển GV sang tổ khác trước." Kèm danh sách GV + nút "Chuyển tổ ngay".
   - Nếu node là **GV đang là trưởng tổ**: Cảnh báo "GV [tên] đang là Tổ trưởng. Sau khi xóa, tổ sẽ không có trưởng." Hỏi "Bổ nhiệm trưởng tổ mới trước khi xóa?" với nút tắt tắt.
   - Nếu node là **Phó Hiệu trưởng có tổ trực thuộc**: Chặn với thông báo liệt kê các tổ còn thuộc quản lý.
   - Nếu node là **GV thành viên thông thường** (không có ràng buộc): Hiển thị confirm đơn giản.
2. Với trường hợp GV thành viên: Dialog confirm "Xóa GV [tên] khỏi Tổ [tên]? Hành động này chỉ xóa khỏi cây tổ chức, không xóa tài khoản GV."
3. Confirm xóa → Node biến mất khỏi cây với hiệu ứng fade-out; ghi log xóa.
4. Toast: "Đã xóa [tên node] khỏi cây tổ chức".
**Expected Result**: Không thể xóa nhầm gây mất dữ liệu liên kết; hệ thống hướng dẫn xử lý đúng trình tự trước khi xóa.

---

### Flow 6: Quản lý năm học — tạo/chuyển năm học mới, lưu lịch sử cơ cấu
**Mô tả**: QTHT quản lý vòng đời năm học cho cơ cấu tổ chức: tạo mới, kích hoạt, lưu snapshot lịch sử.
**Trigger**: Tab "Năm học" trong module Cơ cấu Tổ chức → Nút **"+ Tạo năm học mới"**.
**Steps**:
1. Modal **"Tạo năm học mới"**:
   - Tên năm học: VD `2025-2026` (auto-suggest từ năm hiện tại).
   - Ngày bắt đầu, ngày kết thúc.
   - Checkbox **"Nhân bản cơ cấu từ năm học: [dropdown chọn năm]"**: copy toàn bộ cây tổ chức (tổ BM, phân công trưởng tổ) sang năm mới.
2. Preview **"Diff cơ cấu"**: So sánh cây năm cũ vs năm mới sẽ tạo — highlight node mới, node bị loại (nếu có chỉnh sửa trước khi confirm).
3. Confirm → Hệ thống tạo **snapshot bất biến** (immutable snapshot) của cơ cấu năm cũ vào kho lịch sử → tạo cây tổ chức mới cho năm mới.
4. Năm học mới có trạng thái **"Chuẩn bị"**. QTHT chỉnh sửa cây (thêm/bớt tổ, gán GV mới) trước khi kích hoạt.
5. Nút **"Kích hoạt năm học"**: Chuyển năm cũ sang **"Kết thúc"**, năm mới thành **"Đang hoạt động"**. Không thể đảo ngược sau khi kích hoạt.
6. Tab **"Lịch sử cơ cấu"**: Timeline các năm học — click vào năm bất kỳ → xem cây read-only của năm đó.
**Expected Result**: Mỗi năm học có một cây cơ cấu độc lập, được lưu vĩnh viễn; có thể tra cứu cơ cấu của 5 năm trước bất cứ lúc nào.

---

### Flow 7: Cấu hình thông tin trường
**Mô tả**: QTHT cập nhật thông tin pháp lý và nhận diện của trường: tên, địa chỉ, logo, thông tin liên hệ, mã trường.
**Trigger**: Tab **"Thông tin trường"** trong module Cơ cấu Tổ chức.
**Steps**:
1. Màn hình hiển thị **card thông tin trường** dạng xem trước (preview như trên đầu thư/sơ đồ):
   - Logo trường (có thể upload ảnh mới).
   - Tên trường đầy đủ (VD: Trường THPT Quốc Học Huế).
   - Tên viết tắt / tên giao dịch.
   - Mã trường (do Sở GD&ĐT cấp, bắt buộc, dùng để đồng bộ hệ thống Sở).
   - Địa chỉ (số nhà, đường, phường/xã, quận/huyện, tỉnh/TP).
   - Email chính thức, số điện thoại, website.
   - Người đại diện pháp lý (Hiệu trưởng hiện tại — liên kết với node Hiệu trưởng trong cây).
2. Nhấn **"Chỉnh sửa"** → Form inline, từng trường có thể sửa riêng lẻ.
3. **Upload logo**: Drag & drop hoặc click chọn file (PNG/JPG, tối đa 2MB, khuyến nghị 200×200px). Preview trước khi lưu. Tự động crop/resize về tỉ lệ chuẩn.
4. **Mã trường**: Validate format theo chuẩn Bộ GD&ĐT (8 ký tự số). Cảnh báo nếu không khớp.
5. Nhấn **"Lưu thay đổi"** → Thay đổi có hiệu lực ngay trên toàn hệ thống (header app, PDF xuất, thông báo email).
6. Lịch sử: Mỗi lần cập nhật ghi log "ai, thời điểm, trường nào thay đổi, giá trị cũ → mới".
**Expected Result**: Thông tin trường nhất quán trên toàn hệ thống; logo và tên trường hiển thị chính xác trên mọi tài liệu xuất ra.

---

### Flow 8: Cấu hình lịch học — số tiết/ngày, giờ từng tiết, ngày nghỉ hè, ngày lễ
**Mô tả**: QTHT thiết lập khung thời gian học trong ngày và các ngày không học trong năm — là nền tảng cho thời khóa biểu và điểm danh.
**Trigger**: Tab **"Lịch học"** trong module Cơ cấu Tổ chức.
**Steps**:
1. **Khung giờ tiết học** — Bảng editable:
   - Mặc định 10 tiết/ngày. QTHT có thể thêm/bớt (tối thiểu 5, tối đa 12 tiết).
   - Mỗi hàng: Số tiết | Giờ bắt đầu | Giờ kết thúc | Loại (Chính thức / Tự chọn / Tiết 0).
   - Tự động tính thời lượng (phút) và cảnh báo nếu 2 tiết bị chồng giờ.
   - Nút **"Reset về mặc định"**: khôi phục khung giờ chuẩn Bộ GD&ĐT (45 phút/tiết, giải lao 5 phút).
2. **Ngày làm việc trong tuần**: Toggle từng ngày (Thứ 2 → Thứ 7). Trường Quốc Học học cả Thứ 7 sáng.
3. **Quản lý ngày nghỉ lễ & nghỉ hè**:
   - Calendar view năm học — click ngày → chọn loại: Nghỉ lễ quốc gia / Nghỉ hè / Nghỉ bù / Nghỉ đột xuất / Ngày bồi dưỡng GV.
   - Import ngày lễ: Nút **"Import từ lịch quốc gia"** → tự động thêm các ngày lễ cố định (1/1, 30/4, 1/5, 2/9, Tết Nguyên đán...).
   - Nhập ngày nghỉ hè: Chọn range ngày (từ — đến), hệ thống tô màu đỏ toàn bộ range trên calendar.
4. Sau khi cấu hình: Hệ thống tính tự động và hiển thị:
   - Tổng số ngày học trong năm.
   - Tổng số tiết học tối đa.
   - Cảnh báo nếu tổng tiết < yêu cầu tối thiểu của Bộ GD&ĐT (35 tuần học).
5. Nhấn **"Lưu cấu hình"** → áp dụng cho toàn bộ năm học hiện tại; có thể copy sang năm học khác.
**Expected Result**: Khung thời gian học được cấu hình chính xác, phục vụ tự động tính tiết trống, lập TKB và điểm danh.

---

### Flow 9: Xuất sơ đồ tổ chức ra PDF
**Mô tả**: QTHT xuất sơ đồ cây tổ chức dưới dạng PDF để in ấn, trình Ban giám hiệu, nộp báo cáo Sở.
**Trigger**: Màn hình sơ đồ tổ chức → Nút **"Xuất PDF"** (góc phải trên).
**Steps**:
1. **Panel cấu hình xuất** trượt từ phải vào:
   - **Năm học**: Chọn năm xuất (mặc định năm hiện tại).
   - **Mức chi tiết**:
     - *Tổng quan*: Chỉ hiển thị Ban Giám hiệu → Phó HT → Tổ BM (không có GV).
     - *Đầy đủ*: Hiển thị đến từng GV trong tổ.
   - **Hướng trang**: Ngang (Landscape) hoặc Dọc (Portrait).
   - **Khổ giấy**: A3 hoặc A4.
   - **Bao gồm**: Checkbox "Thêm logo trường" / "Thêm tiêu đề" / "Thêm ngày xuất" / "Thêm chữ ký BGH".
2. Preview thumbnail PDF trên panel.
3. Nhấn **"Xuất PDF"** → Hệ thống render cây sang PDF (server-side, đảm bảo font tiếng Việt đúng).
4. File download tự động: `SoDoToChuc_QuocHocHue_2025-2026.pdf`.
5. Log xuất: ghi nhận ai xuất, lúc nào, cho năm học nào.
**Expected Result**: File PDF chất lượng cao, đúng tỉ lệ, logo và tiếng Việt chuẩn, sẵn sàng in trực tiếp hoặc gửi email.

---

## Tính năng & Màn hình

### Màn hình chính Sơ đồ Tổ chức — Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│ TOPBAR: Cơ cấu Tổ chức | Năm học: [2025-2026 ▼] | [Xuất PDF] [⚙ Cấu hình] │
├────────────────────────────────────────────────────────────────────────┤
│ TABS: [Sơ đồ Tổ chức] [Thông tin trường] [Lịch học] [Năm học] [Lịch sử] │
├─────────────────────────────────────────────────┬──────────────────────┤
│  TOOLBAR CÂY:                                   │  PANEL THÔNG TIN     │
│  [Mở rộng tất cả] [Thu gọn] [🔍 Tìm node]      │  (ẩn khi không chọn) │
│  [Cây dọc ↕ | Cây ngang ↔]  [✎ Chỉnh sửa cây] │                      │
├─────────────────────────────────────────────────┤  Khi click node:     │
│                                                 │  ┌──────────────────┐│
│  [Hiệu trưởng]                                  │  │ 👤 Ảnh đại diện  ││
│       │                                         │  │ Tên: Nguyễn X.Y. ││
│  ┌────┴──────┬──────────────────┐               │  │ Chức vụ: ...     ││
│  │           │                  │               │  │ Email: ...       ││
│ [Phó HT  ] [Phó HT  ]  [VP    ]               │  │ SĐT: ...         ││
│ [Chuyên  ] [CSVC    ]  [Nhà   ]               │  │ ──────────────── ││
│ [Môn     ]             [trường]               │  │ Thành viên: [X]  ││
│   │                                             │  │ [Danh sách ▼]    ││
│ ┌─┼──┬──┬──┬──┬──┬──┐                         │  │ ──────────────── ││
│ T  T  T  T  T  T  T                           │  │ [✎ Sửa] [🗑 Xóa] ││
│ Toán  Lý  Văn  NN Tin TD GDCD                 │  └──────────────────┘│
│  │   ...                                       │                      │
│ GV GV GV...                                   │                      │
│                                                 │                      │
│  [+ Thêm node con]  (hiện khi hover)            │                      │
└─────────────────────────────────────────────────┴──────────────────────┘
```

### Cây tổ chức Trường THPT Quốc Học Huế — Cấu trúc chuẩn
```
TRƯỜNG THPT QUỐC HỌC HUẾ
│
└── 👤 Hiệu trưởng
    │
    ├── 👤 Phó HT (Phụ trách Chuyên môn)
    │   ├── 📂 Tổ Toán
    │   │   ├── 👤 Tổ trưởng (Tổ trưởng Toán)
    │   │   ├── 👤 GV Toán 1
    │   │   └── 👤 GV Toán 2 ...
    │   ├── 📂 Tổ Lý - Hóa - Sinh
    │   │   ├── 👤 Tổ trưởng
    │   │   └── 👤 GV...
    │   ├── 📂 Tổ Văn - Sử - Địa
    │   ├── 📂 Tổ Ngoại ngữ
    │   ├── 📂 Tổ Tin học
    │   ├── 📂 Tổ Thể dục - Nghệ thuật
    │   └── 📂 Tổ GDCD
    │
    ├── 👤 Phó HT (Phụ trách Cơ sở Vật chất)
    │   ├── 📂 Thư viện
    │   │   └── 👤 Thủ thư
    │   └── 📂 Phòng Thiết bị
    │       └── 👤 NV Thiết bị
    │
    └── 📂 Văn phòng Nhà trường
        ├── 👤 Trưởng VP (Kế toán)
        ├── 👤 NV Hành chính
        └── 👤 NV Y tế học đường
```

### Màn hình Tab Thông tin trường — Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Tab: Thông tin trường                          [✎ Chỉnh sửa]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐   TRƯỜNG THPT QUỐC HỌC HUẾ                       │
│  │  [LOGO]  │   Mã trường: 75102710                             │
│  │  (200px) │   Địa chỉ: 12 Lê Lợi, P. Vĩnh Ninh, TP. Huế    │
│  └──────────┘   SĐT: (0234) 3822.468                           │
│                 Email: quochoc@thuathienhue.edu.vn               │
│                 Website: quochoc.edu.vn                          │
│                 Hiệu trưởng: [liên kết → node cây]              │
├─────────────────────────────────────────────────────────────────┤
│  [Upload logo mới]  [Lịch sử thay đổi ▼]                       │
└─────────────────────────────────────────────────────────────────┘
```

### Màn hình Tab Lịch học — Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Tab: Cấu hình Lịch học                 [Lưu cấu hình] [Reset]  │
├──────────────────────────┬──────────────────────────────────────┤
│  KHUNG GIỜ TIẾT HỌC      │  LỊCH NĂM HỌC 2025-2026             │
│ ┌──┬──────┬──────┬──────┐│  Th8  Th9  Th10 Th11 Th12 T1 T2 T3 │
│ │#1│07:00 │07:45 │Chính ││  [  ][██][  ][  ][ ██][  ][  ][  ] │
│ │#2│07:50 │08:35 │Chính ││  ██ = Nghỉ hè / lễ                  │
│ │#3│08:40 │09:25 │Chính ││                                      │
│ │#4│09:35 │10:20 │Chính ││  [+ Thêm ngày nghỉ]                 │
│ │#5│10:25 │11:10 │Chính ││  [Import lịch quốc gia]             │
│ ├──┼──────┼──────┼──────┤│                                      │
│ │  │ NGHỈ TRƯA (11:10-13:00)   ││  Thống kê:                  │
│ ├──┼──────┼──────┼──────┤│  Tổng ngày học: 175 ngày            │
│ │#6│13:00 │13:45 │Chính ││  Tổng tiết tối đa: 1750 tiết        │
│ │#7│13:50 │14:35 │Chính ││  ✅ Đủ theo quy định Bộ GD&ĐT       │
│ │#8│14:40 │15:25 │Chính ││                                      │
│ │#9│15:30 │16:15 │TC    ││  Ngày làm việc:                      │
│ │#10│16:20│17:05 │TC    ││  [✓]T2 [✓]T3 [✓]T4 [✓]T5 [✓]T6 [✓]T7│
│ └──┴──────┴──────┴──────┘│                                      │
│ [+ Thêm tiết]            │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

### Màn hình Tab Năm học — Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Tab: Quản lý Năm học                      [+ Tạo năm học mới]  │
├─────────────────────────────────────────────────────────────────┤
│  Timeline:                                                       │
│                                                                  │
│  [2022-2023]──[2023-2024]──[2024-2025]──●[2025-2026]── ...     │
│   Kết thúc     Kết thúc     Kết thúc    Đang hoạt động         │
│   (xám)        (xám)        (xám)        (xanh)                 │
│                                                                  │
│  Chi tiết năm học đang chọn [2025-2026]:                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Bắt đầu: 05/09/2025  |  Kết thúc: 31/05/2026              │ │
│  │ Số GV trong cơ cấu: 68  |  Số tổ BM: 9                    │ │
│  │ [Xem cây tổ chức] [Nhân bản] [Kết thúc năm học ⚠]         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Xem cây tổ chức | Menu → "Cơ cấu Tổ chức" | Tải OrgTree năm học hiện tại |
| Mở rộng/Thu gọn toàn cây | Nút "Mở rộng tất cả" / "Thu gọn" | Tất cả node expand/collapse |
| Xem chi tiết node | Click node bất kỳ | Panel thông tin trượt vào từ phải |
| Bật chế độ chỉnh sửa cây | Nút "✎ Chỉnh sửa cây" | Cây chuyển sang chế độ edit |
| Thêm node con | Hover node cha → "+" | Modal chọn loại: Đơn vị / Thành viên |
| Chỉnh sửa node | Panel → icon bút chì | Inline edit tên, mô tả, trưởng tổ |
| Di chuyển node | Drag & drop (chế độ edit) | Confirm dialog → cập nhật cây |
| Xóa node | Panel → ⋮ → "Xóa" | Kiểm tra ràng buộc → confirm → xóa |
| Tìm kiếm node | 🔍 Tìm node (thanh toolbar) | Highlight node trùng, scroll đến node |
| Chuyển xem năm khác | Dropdown "Năm học" | Cây read-only của năm được chọn |
| Tạo năm học mới | Tab "Năm học" → "+ Tạo" | Modal nhân bản cơ cấu |
| Sửa thông tin trường | Tab "Thông tin trường" → "Sửa" | Form inline, lưu → áp dụng toàn hệ thống |
| Upload logo | Tab "Thông tin trường" → upload | Preview + crop → lưu |
| Cấu hình tiết học | Tab "Lịch học" → edit bảng | Inline edit giờ, validate chồng giờ |
| Thêm ngày nghỉ | Click ngày trên calendar | Popup nhanh: chọn loại, tên ngày nghỉ |
| Import ngày lễ quốc gia | Nút "Import lịch quốc gia" | Tự động thêm ngày lễ cố định |
| Xuất PDF sơ đồ | Nút "Xuất PDF" | Panel cấu hình → download PDF |

---

## Gom nhóm tính năng thông minh

Module **Cơ cấu Tổ chức** gom ba nhóm tính năng tưởng chừng riêng biệt vào một module với lý do kết dính chặt chẽ:

1. **OrgTree + Quản lý năm học**: Cây tổ chức *chỉ có ý nghĩa trong ngữ cảnh của một năm học cụ thể*. Không thể tách rời — mỗi năm học có một cây tổ chức độc lập, và vòng đời của cây gắn liền với vòng đời năm học.

2. **Thông tin trường**: Dữ liệu trường (tên, logo, mã trường) là **metadata của toàn bộ hệ thống** — xuất hiện trên mọi PDF, email, header. Đặt ở đây vì QTHT khi vào quản lý tổ chức tất nhiên cũng quản lý thông tin định danh của tổ chức đó.

3. **Cấu hình lịch học**: Lịch học (tiết, giờ, ngày nghỉ) là **backbone của cơ cấu vận hành** — trực tiếp ảnh hưởng đến TKB, điểm danh, phân công GV. Cần thiết lập song hành với việc thiết lập cơ cấu nhân sự đầu năm.

**Quy tắc thiết kế giao diện**: Cây OrgTree là trung tâm tương tác (chiếm 70% màn hình); các tab phụ (thông tin trường, lịch học) là cấu hình bổ trợ, ít truy cập hơn.

---

## Edge Cases & Validation

- **Xóa tổ còn GV**: Bị chặn hoàn toàn. Hệ thống hiển thị danh sách GV trong tổ và đề xuất "Chuyển sang tổ nào?" với dropdown chọn tổ đích trước khi cho phép xóa.
- **GV kiêm nhiệm 2 tổ**: Hệ thống cảnh báo khi thêm GV vào tổ thứ 2 nhưng không block — cho phép QTHT xác nhận kiêm nhiệm. Node GV sẽ hiển thị badge "Kiêm nhiệm" trên cây.
- **Node Hiệu trưởng trống**: Nếu không có GV nào được gán vào node Hiệu trưởng, hệ thống hiển thị badge "Chưa có người đảm nhiệm" màu đỏ — không block nhưng cảnh báo trên dashboard.
- **Trưởng tổ không trong tổ**: Validation khi lưu — không cho phép gán trưởng tổ là người không thuộc tổ đó.
- **Cây rỗng / năm học mới chưa có cơ cấu**: Hiển thị onboarding guide "Bắt đầu bằng cách thêm Hiệu trưởng" với nút CTA.
- **Kích hoạt năm học khi cây chưa có Hiệu trưởng**: Block kích hoạt, hiển thị checklist: "Cây tổ chức cần có ít nhất: ✓ Hiệu trưởng, ✓ 1 Phó HT, ✓ 1 Tổ BM".
- **Xóa Hiệu trưởng (node gốc)**: Block tuyệt đối nếu còn node con. Cần xóa toàn bộ cây từ dưới lên mới xóa được gốc — thực tế chỉ dùng khi reset năm học mới.
- **Di chuyển node cha vào node con của nó**: Validate circular dependency — không cho phép kéo node A vào một node thuộc cây con của A.
- **Tên tổ bộ môn trùng nhau trong cùng năm học**: Cảnh báo và yêu cầu đổi tên trước khi lưu.
- **Upload logo kích thước quá lớn (> 2MB)**: Từ chối ngay khi chọn file, hiển thị "Ảnh quá lớn. Tối đa 2MB".
- **Upload logo định dạng không hỗ trợ (GIF, BMP, PDF...)**: Từ chối, chỉ chấp nhận PNG, JPG, SVG.
- **Giờ tiết bị chồng**: Nếu giờ kết thúc Tiết 3 > giờ bắt đầu Tiết 4, highlight đỏ cả 2 hàng, block lưu cho đến khi sửa.
- **Số tiết < 5 hoặc > 12**: Cảnh báo lệch chuẩn Bộ GD&ĐT, yêu cầu xác nhận trước khi lưu.
- **Nhân bản năm học từ năm đã kết thúc từ lâu (> 3 năm)**: Cảnh báo "Cơ cấu tổ chức có thể đã lỗi thời. Kiểm tra lại sau khi nhân bản."
- **Kết thúc năm học khi đang có tiết dạy hôm nay**: Cảnh báo "Hôm nay vẫn còn [X] tiết dạy theo TKB. Bạn có chắc chắn muốn kết thúc năm học?"
- **Xuất PDF cây quá lớn (> 100 node, nhiều GV)**: Hệ thống tự động khuyến nghị chọn mức "Tổng quan" thay vì "Đầy đủ" để tránh PDF dàn quá nhiều trang.
- **Mã trường không đúng format**: Validate ngay khi nhập (8 ký tự số). Tooltip "Mã trường được cấp bởi Sở GD&ĐT, kiểm tra trên hệ thống EMIS".

---

## Tích hợp

- **Module Quản lý Giáo viên**: Node GV trong cây OrgTree liên kết trực tiếp với hồ sơ GV (`/admin/giaovien/:id`). Khi GV nghỉ việc hoặc bị vô hiệu hóa trong module GV, node tương ứng trong cây tự động hiển thị badge "Không còn công tác" — không tự xóa.
- **Module Quản lý Lớp / Thời khóa biểu**: Tổ bộ môn trong cây OrgTree = nguồn dữ liệu cho phân công dạy: hệ thống biết GV nào thuộc tổ Toán → gợi ý phân công dạy Toán. Khung giờ tiết học (Flow 8) là nền tảng trực tiếp cho TKB.
- **Module Báo cáo**: Cơ cấu tổ chức cung cấp trục phân nhóm cho mọi báo cáo: báo cáo điểm danh theo tổ, báo cáo kết quả giảng dạy theo tổ bộ môn, thống kê nhân sự theo đơn vị.
- **Module Điểm danh**: Cấu hình số tiết/giờ tiết (Flow 8) là schema dữ liệu cho bản ghi điểm danh — mỗi bản ghi điểm danh tham chiếu tiết số mấy trong ngày.
- **Module Thư viện**: Tổ bộ môn liên kết với danh mục sách/tài liệu phù hợp; thủ thư biết sách Toán nên giới thiệu cho Tổ Toán.
- **Đồng bộ Sở GD&ĐT (EMIS/SMAS)**: Mã trường (Flow 7), tên trường, năm học phải khớp chính xác với dữ liệu trên hệ thống quản lý của Sở Giáo dục Thừa Thiên Huế. API sync định kỳ hàng tuần.
- **Thông báo & Email**: Tên trường + logo (Flow 7) tự động hiển thị trên header của mọi email hệ thống gửi ra (thông báo họp tổ, thông báo điểm, thư mời phụ huynh).
- **Export đa định dạng**:
  - PDF sơ đồ tổ chức (Flow 9) → in ấn, trình ký.
  - Excel danh sách nhân sự theo tổ → nộp báo cáo Sở.
  - JSON snapshot cơ cấu năm học → backup, tích hợp hệ thống bên ngoài.
