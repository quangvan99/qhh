---
title: "WF-03a1: Học tập – Xem lớp học (Người học)"
cluster: "Learning - Student / Class View"
updated: 2026-03-11
---

# WF-03a1: Học tập – Xem lớp học (Người học)

> **Phạm vi:** Các màn hình người học (HV) xem và tương tác với lớp học – từ đăng ký lớp, khám phá cấu trúc nội dung, xem giới thiệu, theo dõi kết quả tổng quan, lịch sử truy cập, đến thông báo trong lớp.

---

## Mục lục màn hình

| Mã             | Tên màn hình                              | Ghi chú                                           |
|----------------|-------------------------------------------|---------------------------------------------------|
| SCR-03a1-001   | Đăng ký lớp học                           | Danh sách lớp mở đăng ký + xác nhận đăng ký      |
| SCR-03a1-002   | Xem cấu trúc nội dung lớp học             | Sidebar cây phân cấp + content area               |
| SCR-03a1-003   | Xem thông tin giới thiệu lớp học          | Tab Giới thiệu trong trang lớp học                |
| SCR-03a1-004   | Xem tổng quan kết quả học tập             | Dashboard tóm tắt tiến độ + điểm + thời gian     |
| SCR-03a1-005   | Xem chi tiết lịch sử truy cập lớp học     | Danh sách log phiên học theo thời gian            |
| SCR-03a1-006   | Xem thông báo trong lớp học               | Danh sách + chi tiết thông báo của lớp            |

---

## SCR-03a1-001: Đăng ký lớp học

### 1. Mô tả
Học sinh truy cập chức năng **Đăng ký học**, hệ thống hiển thị danh sách các lớp đang mở đăng ký. Học sinh chọn lớp và xác nhận đăng ký; hệ thống kiểm tra điều kiện và lưu kết quả.

### 2. Actors
- **Chính:** Học sinh (HV) đã đăng nhập, có quyền đăng ký lớp học
- **Hệ thống:** Kiểm tra điều kiện, lưu CSDL, trả kết quả

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Lớp học ●] [Kết quả]  ...   👤 Nguyễn Văn A  ▼   ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  📚 Đăng ký lớp học                                                      ║
║  Trang chủ > Lớp học > Đăng ký lớp học                                  ║
║                                                                          ║
║  🔍 [ Tìm tên lớp, môn học...                    ]  [▼ Năm học]  [Lọc] ║
║                                                                          ║
║ ┌──────────────────────────────────────────────────────────────────────┐ ║
║ │ STT │ Tên lớp học          │ Môn    │ Giáo viên    │ Thời hạn  │ §  │ ║
║ ├─────┼──────────────────────┼────────┼──────────────┼───────────┼────┤ ║
║ │  1  │ Toán 10 – HK1        │ Toán   │ Trần Minh A  │ 30/03/26  │[ĐK]│ ║
║ ├─────┼──────────────────────┼────────┼──────────────┼───────────┼────┤ ║
║ │  2  │ Vật lý 11 – Cơ bản  │ Lý     │ Lê Thị B     │ 31/03/26  │[ĐK]│ ║
║ ├─────┼──────────────────────┼────────┼──────────────┼───────────┼────┤ ║
║ │  3  │ Ngữ văn 12 – Ôn thi │ Văn    │ Phạm Văn C   │ 01/04/26  │[ĐK]│ ║
║ └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                          ║
║  [< Trước]  1  2  3  ...  [Sau >]          Hiển thị [▼10] / trang       ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝

── Modal xác nhận đăng ký ──────────────────────────────────
│  ✅ Xác nhận đăng ký lớp học                             │
│  Tên lớp:  Toán 10 – HK1                                 │
│  Giáo viên: Trần Minh A                                  │
│  Thời hạn: 30/03/2026                                    │
│                                                           │
│       [Hủy]              [Xác nhận đăng ký]              │
─────────────────────────────────────────────────────────────
```

### 4. Components chính
- **Thanh tìm kiếm & bộ lọc:** từ khóa, năm học, môn học
- **Bảng danh sách lớp:** tên lớp, môn, giáo viên, thời hạn đăng ký, nút [Đăng ký]
- **Modal xác nhận:** tóm tắt thông tin lớp + nút Xác nhận / Hủy
- **Toast thông báo:** thành công / lỗi sau khi xác nhận

### 5. Flow điều hướng
```
Menu [Lớp học > Đăng ký lớp] → Danh sách lớp
  → Click [Đăng ký] → Modal xác nhận
    → Xác nhận → Toast thành công → Redirect SCR-03a1-002 (lớp vừa đăng ký)
    → Hủy → Đóng modal
```

### 6. Business Rules
- Chỉ hiển thị lớp đang trong thời hạn mở đăng ký
- Không hiển thị lớp học sinh đã đăng ký (hoặc hiện badge "Đã đăng ký")
- Kiểm tra số lượng học sinh tối đa trước khi cho đăng ký

### 7. API chính
| Method | Endpoint                       | Mô tả                         |
|--------|--------------------------------|-------------------------------|
| GET    | `/api/classes/open`            | Danh sách lớp mở đăng ký      |
| POST   | `/api/enrollments`             | Đăng ký lớp học               |

---

## SCR-03a1-002: Xem cấu trúc nội dung lớp học

### 1. Mô tả
Sau khi vào lớp, học sinh thấy toàn bộ cấu trúc nội dung dạng **cây phân cấp** (Sidebar trái) và **vùng nội dung** (Content area phải). Mỗi nút cây hiển thị trạng thái học tập (chưa học / đang học / hoàn thành) kèm điều kiện mở khóa nếu có.

### 2. Actors
- **Chính:** Học sinh đã đăng ký lớp, có quyền xem nội dung

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Lớp học ●] ...              👤 Nguyễn Văn A  ▼    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Toán 10 – HK1           [Giới thiệu] [Nội dung●] [Kết quả] [Thông báo]║
╠═══════════════════════╦══════════════════════════════════════════════════╣
║  SIDEBAR – Cây nội dung║  CONTENT AREA                                  ║
║  ─────────────────────║  ─────────────────────────────────────────────  ║
║  ▼ Module 1: Đại số    ║  📖 Bài 1.1: Hàm số bậc nhất                  ║
║    ✅ Bài 1.1 Hàm số  ║                                                  ║
║    ✅ Bài 1.2 Phương  ║  [Loại: Video SCORM]  [Thời gian: 45 phút]      ║
║    🔵 Bài 1.3 Bất PT  ║                                                  ║
║    🔒 Bài 1.4 (Khóa)  ║  ┌────────────────────────────────────────────┐║
║                        ║  │  ▶  Player / SCORM / Tài liệu             │║
║  ▶ Module 2: Hình học  ║  │                                            │║
║    ○ Bài 2.1           ║  │         [Nội dung hiển thị tại đây]        │║
║    ○ Bài 2.2           ║  │                                            │║
║    ○ Bài 2.3           ║  └────────────────────────────────────────────┘║
║                        ║                                                  ║
║  ▶ Module 3: Thống kê  ║  Trạng thái: 🔵 Đang học  │ Tiến độ: 65%      ║
║    ○ Bài 3.1           ║                                                  ║
║    ...                 ║  [◀ Bài trước]         [Bài tiếp theo ▶]       ║
║  ─────────────────────║                                                  ║
║  Tiến độ lớp: ████░ 65%║                                                  ║
╚═══════════════════════╩══════════════════════════════════════════════════╝

Chú thích icon: ✅ Hoàn thành  🔵 Đang học  ○ Chưa học  🔒 Bị khóa
```

### 4. Components chính
- **Tab bar lớp học:** Giới thiệu / Nội dung / Kết quả / Thông báo
- **Sidebar cây nội dung:** Module → Bài học, icon trạng thái, expand/collapse
- **Progress bar tổng:** % tiến độ toàn lớp
- **Content area:** player/SCORM/tài liệu embed, tên bài, loại, thời gian
- **Nút điều hướng:** Bài trước / Bài tiếp theo

### 5. Flow điều hướng
```
Danh sách lớp → Click vào lớp → SCR-03a1-002 (tab Nội dung mặc định)
  → Click bài trong sidebar → Load nội dung bài vào Content area
  → Click tab [Giới thiệu] → SCR-03a1-003
  → Click tab [Kết quả] → SCR-03a1-004
  → Click tab [Thông báo] → SCR-03a1-006
```

### 6. Business Rules
- Bài bị khóa (🔒): không cho click nếu chưa đáp ứng điều kiện tiên quyết
- Trạng thái học tập cập nhật real-time từ dữ liệu SCORM / tracking
- Thanh tiến độ tính theo số bài hoàn thành / tổng số bài
- Sidebar collapse được trên màn hình nhỏ (responsive)

### 7. API chính
| Method | Endpoint                                  | Mô tả                            |
|--------|-------------------------------------------|----------------------------------|
| GET    | `/api/classes/{id}/structure`             | Cây cấu trúc nội dung lớp        |
| GET    | `/api/classes/{id}/progress`              | Trạng thái học từng bài          |
| GET    | `/api/classes/{id}/contents/{contentId}`  | Nội dung bài học cụ thể          |

---

## SCR-03a1-003: Xem thông tin giới thiệu lớp học

### 1. Mô tả
Tab **Giới thiệu** trong trang lớp học, hiển thị tổng quan: mô tả lớp, thông tin giáo viên, thời hạn, mục tiêu, yêu cầu đầu vào.

### 2. Actors
- **Chính:** Học sinh có quyền xem thông tin lớp (đã đăng ký hoặc chưa)

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Lớp học ●] ...              👤 Nguyễn Văn A  ▼    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Toán 10 – HK1      [Giới thiệu●] [Nội dung] [Kết quả] [Thông báo]     ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌────────────────────────────┐  ┌──────────────────────────────────┐   ║
║  │  🖼 Banner/Ảnh lớp học    │  │  📌 Thông tin nhanh              │   ║
║  │                            │  │  Giáo viên:  Trần Minh A         │   ║
║  │   [Toán 10 – HK1]          │  │  Thời hạn:   01/01 – 31/05/2026  │   ║
║  └────────────────────────────┘  │  Số học viên: 32                 │   ║
║                                  │  Ngôn ngữ:   Tiếng Việt          │   ║
║  📝 Mô tả lớp học                │  Trạng thái: 🟢 Đang diễn ra     │   ║
║  ──────────────────────────────  └──────────────────────────────────┘   ║
║  Lớp học cung cấp kiến thức đại                                          ║
║  số và hình học lớp 10, bao gồm  🎯 Mục tiêu học tập                    ║
║  các chủ đề: hàm số, phương      ──────────────────────────────────      ║
║  trình, bất phương trình...      • Nắm vững kiến thức Toán 10            ║
║                                  • Giải thành thạo các dạng bài          ║
║                                  • Chuẩn bị tốt cho kỳ thi HK1          ║
║                                                                          ║
║  📋 Yêu cầu đầu vào                                                      ║
║  • Đã hoàn thành chương trình Toán 9                                     ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Tab bar lớp học:** Giới thiệu (active) / Nội dung / Kết quả / Thông báo
- **Banner lớp học:** ảnh hoặc gradient + tên lớp
- **Thông tin nhanh:** card bên phải – giáo viên, thời hạn, số HV, trạng thái
- **Mô tả:** rich text nội dung giới thiệu
- **Mục tiêu học tập** + **Yêu cầu đầu vào**

### 5. Flow điều hướng
```
Tab [Giới thiệu] → SCR-03a1-003
  → Click tab [Nội dung] → SCR-03a1-002
  → Click tab [Kết quả] → SCR-03a1-004
```

### 6. Business Rules
- Dữ liệu giới thiệu do GV/Admin cấu hình; hiển thị read-only với học sinh
- Cả học sinh chưa đăng ký vẫn có thể xem nếu lớp không bị ẩn

### 7. API chính
| Method | Endpoint                        | Mô tả                          |
|--------|---------------------------------|--------------------------------|
| GET    | `/api/classes/{id}/info`        | Thông tin giới thiệu lớp học   |

---

## SCR-03a1-004: Xem tổng quan kết quả học tập

### 1. Mô tả
Tab **Kết quả** trong lớp học. Tổng hợp trên một màn hình: thông tin cá nhân, trạng thái hoàn thành lớp, tổng thời gian học / yêu cầu, tổng điểm, số lượt xem, và bảng chi tiết trạng thái + điều kiện từng nội dung.

### 2. Actors
- **Chính:** Học sinh có quyền xem kết quả học tập

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Lớp học ●] ...              👤 Nguyễn Văn A  ▼    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Toán 10 – HK1       [Giới thiệu] [Nội dung] [Kết quả●] [Thông báo]    ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  👤 THÔNG TIN HỌC VIÊN                                                   ║
║  ┌──────────────────────────────────────────────────────────────────┐   ║
║  │  [Avatar]  Nguyễn Văn A  |  Mã HV: HV001  |  Lớp: 10A1          │   ║
║  └──────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  📊 TỔNG QUAN KẾT QUẢ                                                    ║
║  ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐ ┌───────────┐  ║
║  │ Hoàn thành lớp  │ │ Thời gian học   │ │ Tổng điểm  │ │ Lượt xem  │  ║
║  │   🟢 Đạt       │ │  8h30 / 10h YC  │ │   850 điểm │ │    47     │  ║
║  └─────────────────┘ └─────────────────┘ └────────────┘ └───────────┘  ║
║                                                                          ║
║  📋 CHI TIẾT TỪNG NỘI DUNG                                               ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │ Tên nội dung       │ Hoàn thành │ T.Gian │ Lượt xem │ Điều kiện  │  ║
║  ├────────────────────┼────────────┼────────┼──────────┼────────────┤  ║
║  │ Bài 1.1 Hàm số    │ ✅ Đạt     │ 45p    │    5     │ Không      │  ║
║  │ Bài 1.2 Phương PT │ ✅ Đạt     │ 60p    │    3     │ Bài 1.1    │  ║
║  │ Bài 1.3 Bất PT    │ 🔵 Đang học│ 20p    │    2     │ Bài 1.2    │  ║
║  │ Bài 1.4 Hệ PT     │ 🔒 Khóa   │  -     │    0     │ Bài 1.3    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                          [Xuất báo cáo PDF]              ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Card thông tin HV:** avatar, tên, mã HV, lớp
- **4 KPI cards:** trạng thái hoàn thành, thời gian học/yêu cầu, tổng điểm, lượt xem
- **Bảng chi tiết nội dung:** tên bài, trạng thái hoàn thành, thời gian, lượt xem, điều kiện yêu cầu
- **Nút Xuất PDF** (tùy chọn)

### 5. Flow điều hướng
```
Tab [Kết quả] → SCR-03a1-004
  → Click tên nội dung → Điều hướng tới SCR-03a1-002 (mở bài đó)
  → Click [Xem lịch sử truy cập] → SCR-03a1-005
```

### 6. Business Rules
- **Hoàn thành lớp:** dựa trên % nội dung hoàn thành + điều kiện do GV cấu hình
- **Thời gian yêu cầu:** so sánh tổng thời gian thực tế vs. ngưỡng tối thiểu lớp
- **Bài bị khóa:** hiển thị tên điều kiện tiên quyết cần hoàn thành
- Điểm tổng hợp từ tất cả hoạt động có điểm (bài tập, bài kiểm tra) trong lớp

### 7. API chính
| Method | Endpoint                                    | Mô tả                              |
|--------|---------------------------------------------|------------------------------------|
| GET    | `/api/classes/{id}/my-result`               | Tổng quan kết quả học tập HV       |
| GET    | `/api/classes/{id}/my-result/contents`      | Chi tiết từng nội dung             |

---

## SCR-03a1-005: Xem chi tiết lịch sử truy cập lớp học

### 1. Mô tả
Màn hình log chi tiết từng **phiên truy cập** của học sinh trong lớp học: thời điểm vào, nội dung đã xem, thời gian mỗi phiên. Hỗ trợ lọc theo ngày.

### 2. Actors
- **Chính:** Học sinh có quyền xem kết quả học tập; hệ thống đã ghi log

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Lớp học ●] ...              👤 Nguyễn Văn A  ▼    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Toán 10 – HK1       [Giới thiệu] [Nội dung] [Kết quả●] [Thông báo]    ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  🕐 Lịch sử truy cập lớp học         [← Quay lại Tổng quan]            ║
║                                                                          ║
║  Lọc: Từ [📅 01/03/2026]  đến [📅 11/03/2026]   [Áp dụng]              ║
║                                                                          ║
║ ┌──────────────────────────────────────────────────────────────────────┐ ║
║ │ #  │ Thời gian vào      │ Nội dung truy cập       │ Thời gian học  │ ║
║ ├────┼────────────────────┼─────────────────────────┼────────────────┤ ║
║ │ 1  │ 11/03/2026 08:15   │ Bài 1.3 Bất PT          │ 25 phút        │ ║
║ │ 2  │ 10/03/2026 20:30   │ Bài 1.2 Phương trình    │ 40 phút        │ ║
║ │ 3  │ 10/03/2026 14:10   │ Bài 1.1 Hàm số          │ 45 phút        │ ║
║ │ 4  │ 09/03/2026 19:45   │ Bài 1.1 Hàm số          │ 20 phút        │ ║
║ │ 5  │ 08/03/2026 21:00   │ Giới thiệu lớp học      │ 5 phút         │ ║
║ └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                          ║
║  Tổng: 12 phiên  │  Tổng thời gian: 8 giờ 30 phút                       ║
║  [< Trước]  1  2  [Sau >]           Hiển thị [▼10] / trang              ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 4. Components chính
- **Bộ lọc ngày:** date range picker (từ – đến)
- **Bảng log:** STT, thời điểm vào, nội dung, thời gian phiên học
- **Tổng kết:** số phiên, tổng thời gian
- **Phân trang**
- **Breadcrumb / nút quay lại** Tổng quan kết quả

### 5. Flow điều hướng
```
SCR-03a1-004 → Click [Xem lịch sử] → SCR-03a1-005
  → Chọn khoảng ngày → Lọc lại danh sách
  → Click [Quay lại] → SCR-03a1-004
```

### 6. Business Rules
- Dữ liệu log do hệ thống ghi nhận tự động khi HV truy cập nội dung
- Mỗi dòng = một phiên truy cập (từ lúc mở đến lúc thoát/hết thời gian idle)
- Học sinh chỉ xem được log của chính mình

### 7. API chính
| Method | Endpoint                                  | Mô tả                               |
|--------|-------------------------------------------|-------------------------------------|
| GET    | `/api/classes/{id}/my-access-history`     | Lịch sử truy cập (hỗ trợ lọc ngày) |

---

## SCR-03a1-006: Xem thông báo trong lớp học

### 1. Mô tả
Tab **Thông báo** trong trang lớp học. Hiển thị danh sách thông báo do GV/Admin đăng. Học sinh click để xem chi tiết; hệ thống cập nhật trạng thái đã đọc.

### 2. Actors
- **Chính:** Học sinh có quyền xem thông báo lớp học
- **Hệ thống:** Cập nhật trạng thái đã đọc

### 3. ASCII Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║  LOGO   [Trang chủ] [Lớp học ●] ...              👤 Nguyễn Văn A  ▼    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Toán 10 – HK1      [Giới thiệu] [Nội dung] [Kết quả] [Thông báo● 3]   ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  🔔 Thông báo lớp học                                                    ║
║  ─────────────────────────────────────────────────────────────────────  ║
║                                                                          ║
║  ┌──────────────────────────────────────────────────────────────────┐   ║
║  │ 🔴 [Lịch kiểm tra giữa kỳ – cập nhật mới]                       │   ║
║  │     👤 Trần Minh A (GV)   •   10/03/2026 09:00   •  Chưa đọc    │   ║
║  │     Lịch kiểm tra giữa kỳ đã được dời sang ngày 20/03...         │   ║
║  └──────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  ┌──────────────────────────────────────────────────────────────────┐   ║
║  │ 🔴 [Tài liệu bổ sung Chương 2]                                   │   ║
║  │     👤 Trần Minh A (GV)   •   08/03/2026 14:30   •  Chưa đọc    │   ║
║  │     Các em tải tài liệu bổ sung tại đây: [link]...               │   ║
║  └──────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  ┌──────────────────────────────────────────────────────────────────┐   ║
║  │ ⚪ [Chào mừng đến với lớp học Toán 10 – HK1]                     │   ║
║  │     👤 Trần Minh A (GV)   •   01/01/2026 08:00   •  Đã đọc      │   ║
║  │     Chào các em, đây là lớp học Toán 10 học kỳ 1...              │   ║
║  └──────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  [< Trước]  1  [Sau >]                                                   ║
╚══════════════════════════════════════════════════════════════════════════╝

── Chi tiết thông báo (panel hoặc trang riêng) ─────────────────────
│  🔔 Lịch kiểm tra giữa kỳ – cập nhật mới                        │
│  Người đăng: Trần Minh A (GV)  │  10/03/2026 09:00              │
│  ─────────────────────────────────────────────────              │
│  Lịch kiểm tra giữa kỳ đã được dời sang ngày 20/03/2026.        │
│  Địa điểm: Phòng 203. Mang theo đầy đủ dụng cụ học tập.         │
│                                                                  │
│  [Đính kèm: lich_kiem_tra.pdf  📎]                              │
│                                          [← Quay lại danh sách] │
─────────────────────────────────────────────────────────────────────
```

### 4. Components chính
- **Tab bar:** tab Thông báo có badge số chưa đọc
- **Danh sách thông báo:** card mỗi thông báo – icon đọc/chưa đọc, tiêu đề, người đăng, ngày, trích đoạn
- **Chi tiết thông báo:** panel slide-in hoặc trang riêng – nội dung đầy đủ, file đính kèm
- **Phân trang**

### 5. Flow điều hướng
```
Tab [Thông báo] → SCR-03a1-006 (danh sách)
  → Click thông báo → Hiển thị chi tiết (panel/trang)
    → Hệ thống cập nhật trạng thái "Đã đọc" tự động
    → Click [Quay lại] → Danh sách (badge số giảm)
```

### 6. Business Rules
- Badge số thông báo chưa đọc hiển thị trên tab; tự giảm khi HV mở thông báo
- Trạng thái đọc là per-user (mỗi HV có trạng thái riêng)
- GV/Admin mới có quyền đăng thông báo; HV chỉ đọc
- Thông báo sắp xếp theo thời gian đăng giảm dần (mới nhất trên cùng)

### 7. API chính
| Method | Endpoint                                        | Mô tả                               |
|--------|-------------------------------------------------|-------------------------------------|
| GET    | `/api/classes/{id}/announcements`               | Danh sách thông báo lớp học         |
| GET    | `/api/classes/{id}/announcements/{annId}`       | Chi tiết thông báo                  |
| PUT    | `/api/classes/{id}/announcements/{annId}/read`  | Đánh dấu đã đọc                    |
