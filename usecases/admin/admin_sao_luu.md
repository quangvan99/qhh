# Sao Lưu & Khôi Phục Dữ Liệu — Role: Admin (QTHT only)

## Mục tiêu
Cung cấp cho QTHT công cụ quản lý toàn diện việc sao lưu và khôi phục dữ liệu hệ thống: cấu hình lịch backup tự động, giám sát tình trạng backup, lưu trữ an toàn lên cloud/external storage, và khôi phục dữ liệu khi cần — đảm bảo tính liên tục và an toàn dữ liệu của nhà trường.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền — xem lịch sử backup, chạy backup thủ công, cấu hình lịch tự động, restore dữ liệu, cấu hình storage destination. Đây là module **chỉ dành cho QTHT**.
- **CBQL**: **Không có quyền truy cập**. Nếu cần khôi phục dữ liệu phải yêu cầu QTHT.

---

## User Flow Chính

### Flow 1: Cấu hình lịch sao lưu tự động
**Mô tả**: QTHT thiết lập lịch backup tự động hàng ngày để đảm bảo dữ liệu luôn được bảo vệ mà không cần thao tác thủ công.
**Trigger**: Menu "Hệ thống" → Tab **"Sao lưu & Khôi phục"** → Section "Lịch sao lưu tự động".
**Steps**:
1. Màn hình cấu hình lịch backup hiển thị trạng thái hiện tại (Bật/Tắt) và cấu hình đang chạy.
2. **Cài đặt thời gian**:
   - Tần suất: Hàng ngày | Mỗi 6 giờ | Hàng tuần | Tùy chỉnh (cron expression).
   - Giờ chạy: Mặc định 2:00 AM (khuyến nghị — giờ thấp điểm).
   - Múi giờ: Asia/Ho_Chi_Minh (cố định).
3. **Phạm vi sao lưu** (có thể tick từng mục):
   - ✅ Database (PostgreSQL dump — bắt buộc)
   - ✅ Files & Uploads (ảnh HS, tài liệu, ảnh khuôn mặt)
   - ✅ Cấu hình hệ thống (config files, settings JSON)
   - ☐ Log files (tùy chọn — thường không cần backup)
4. **Loại backup**:
   - Full backup (đầy đủ — chạy mỗi tuần 1 lần vào Chủ nhật).
   - Incremental backup (chỉ phần thay đổi — chạy hàng ngày).
5. **Chính sách giữ bản backup**:
   - Giữ 7 bản daily gần nhất.
   - Giữ 4 bản weekly.
   - Giữ 12 bản monthly.
   - Tổng dung lượng ước tính hiển thị.
6. **Storage destination** (xem Flow 2).
7. **Cài đặt thông báo**: Gửi email khi backup thành công / thất bại → nhập địa chỉ email QTHT.
8. Nhấn **"Lưu cấu hình"** → hệ thống lên lịch cron job.
9. Nút **"Chạy backup ngay"** để test cấu hình vừa thiết lập.
**Expected Result**: Backup tự động chạy đúng lịch; QTHT nhận email xác nhận mỗi ngày mà không cần vào hệ thống.

---

### Flow 2: Cấu hình nơi lưu trữ (Storage Destination)
**Mô tả**: QTHT cấu hình nơi lưu file backup — có thể lưu nhiều nơi đồng thời để tăng độ an toàn.
**Trigger**: Section "Đích lưu trữ" trong tab Sao lưu.
**Steps**:
1. Danh sách destinations hiện tại (tên, loại, trạng thái, dung lượng đã dùng).
2. Nút **"+ Thêm đích lưu trữ"** → chọn loại:
   - **Local disk**: Đường dẫn thư mục trên server (backup nhanh nhưng cùng server — rủi ro cao).
   - **AWS S3 / MinIO**: Access Key, Secret Key, Bucket, Region.
   - **Google Cloud Storage**: Service Account JSON, Bucket name.
   - **FTP/SFTP**: Host, Port, Username, Password/SSH Key, Remote path.
   - **Rclone target**: Hỗ trợ 40+ cloud provider (Dropbox, OneDrive, B2...).
3. Nhập thông tin kết nối → Nút **"Kiểm tra kết nối"** → upload test file 1KB và xóa → xác nhận "✓ Kết nối thành công | Dung lượng còn: X GB".
4. Đặt **ưu tiên**: Primary (bắt buộc) | Secondary (mirror) | Tertiary (archive dài hạn).
5. Lưu → destination xuất hiện trong danh sách.
6. Có thể bật backup mirror: tự động ghi song song ra 2 destination.
**Expected Result**: Dữ liệu backup được lưu ở ít nhất 2 nơi độc lập (3-2-1 rule: 3 bản sao, 2 loại media, 1 off-site).

---

### Flow 3: Chạy sao lưu thủ công (Manual Backup)
**Mô tả**: QTHT chạy backup ngay lập tức trước khi thực hiện thay đổi lớn (nâng cấp hệ thống, import dữ liệu hàng loạt).
**Trigger**: Tab "Sao lưu" → Nút **"Sao lưu ngay"**.
**Steps**:
1. Modal xác nhận: "Tạo backup thủ công?"
   - Đặt tên mô tả: VD "Trước khi nâng cấp v2.5.0" (tùy chọn, có giá trị mặc định là timestamp).
   - Chọn phạm vi: Full | Database only | Files only.
   - Chọn destination.
2. Nhấn **"Bắt đầu"** → Modal đóng lại, hiện progress bar inline trên danh sách.
3. Progress hiển thị realtime:
   - `Đang dump database... 45%`
   - `Đang nén files... 72%`
   - `Đang upload lên S3... 89%`
4. Hoàn thành → badge xanh "✓ Thành công" kèm kích thước file và thời gian thực hiện.
5. Nếu thất bại → badge đỏ, log lỗi chi tiết, nút **"Thử lại"**.
**Expected Result**: File backup sẵn sàng trong < 5 phút (tùy kích thước dữ liệu); QTHT yên tâm tiến hành thay đổi.

---

### Flow 4: Xem lịch sử sao lưu
**Mô tả**: QTHT theo dõi lịch sử backup để đảm bảo hệ thống đang hoạt động bình thường.
**Trigger**: Tab "Sao lưu" → Danh sách lịch sử.
**Steps**:
1. Bảng lịch sử backup với columns:
   - Thời gian bắt đầu | Loại (Auto/Manual) | Phạm vi | Kích thước | Thời gian chạy | Trạng thái | Destination | Actions.
2. Filter: Khoảng thời gian | Trạng thái (Thành công/Thất bại) | Loại.
3. Click vào một bản backup → Chi tiết: danh sách file trong backup, checksum, log đầy đủ.
4. Nút **"Download"**: Tải file backup về local.
5. Nút **"Khôi phục từ bản này"**: Dẫn đến Flow 5.
6. Nút **"Xóa"** (với confirm): Xóa bản backup không cần thiết để tiết kiệm dung lượng.
7. **Dashboard dung lượng**: Biểu đồ dung lượng backup theo thời gian; cảnh báo khi > 80% quota storage.
**Expected Result**: QTHT luôn biết bản backup gần nhất là lúc nào, kích thước bao nhiêu, thành công hay không.

---

### Flow 5: Khôi phục dữ liệu (Restore)
**Mô tả**: QTHT khôi phục hệ thống từ một bản backup khi có sự cố nghiêm trọng (dữ liệu bị corrupt, xóa nhầm hàng loạt, server migrate).
**Trigger**: Nút **"Khôi phục"** trên một bản backup cụ thể HOẶC Tab "Khôi phục" riêng.
**Steps**:
1. **Cảnh báo nghiêm trọng** (màu đỏ đậm):
   ```
   ⚠️ CẢNH BÁO: Khôi phục sẽ GHI ĐÈ toàn bộ dữ liệu hiện tại.
   Thao tác này KHÔNG THỂ HOÀN TÁC.
   Đề nghị tạo backup dữ liệu hiện tại trước khi tiếp tục.
   ```
2. Nút **"Tạo backup dữ liệu hiện tại"** — bắt buộc hoàn thành trước khi tiếp tục.
3. **Chọn phạm vi khôi phục**:
   - Toàn bộ hệ thống (Full restore).
   - Chỉ Database.
   - Chỉ Files.
   - Chọn bảng/module cụ thể (Granular restore — nâng cao).
4. **Nhập xác nhận**: QTHT phải gõ tên hệ thống (VD: `QUOCHOC`) vào ô input để xác nhận.
5. Nhấn **"Bắt đầu khôi phục"**:
   - Hệ thống đặt vào Maintenance Mode — người dùng thấy trang "Hệ thống đang bảo trì".
   - Restore chạy với progress bar chi tiết.
   - Verify checksum sau khi restore.
6. Hoàn thành → tự động thoát Maintenance Mode → hệ thống online trở lại.
7. QTHT kiểm tra: đăng nhập → test vài chức năng → xác nhận "✓ Restore thành công".
8. Ghi nhận sự kiện restore vào Audit Log với đầy đủ thông tin.
**Expected Result**: Hệ thống khôi phục thành công đến thời điểm của bản backup; thời gian downtime < 30 phút.

---

### Flow 6: Giám sát và cảnh báo backup
**Mô tả**: Hệ thống tự động cảnh báo QTHT khi có vấn đề với backup.
**Trigger**: Tự động — hệ thống kiểm tra định kỳ.
**Steps**:
1. **Cảnh báo tự động kích hoạt khi**:
   - Backup tự động thất bại (gửi email + in-app notification ngay).
   - Không có backup thành công trong 48 giờ qua.
   - Dung lượng storage > 85%.
   - Checksum của bản backup không khớp (file bị hỏng).
   - Kết nối đến cloud storage bị mất > 1 giờ.
2. Dashboard "Tình trạng sao lưu" trên Tab Tổng quan Hệ thống:
   - ✅ Backup cuối: 02:15 AM hôm nay (3.2 GB) — Thành công
   - Storage còn lại: 67.3 GB / 100 GB (33%)
   - Bản backup hợp lệ gần nhất: 2 giờ trước
3. Click vào widget → chuyển đến trang chi tiết Backup.
**Expected Result**: QTHT phát hiện vấn đề backup trước khi quá muộn; luôn có bản backup sạch trong tầm tay.

---

## Tính năng & Màn hình

### Màn hình Sao lưu & Khôi phục — Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER: Sao Lưu & Khôi Phục | ⚠ Chỉ dành cho QTHT                 │
├─────────────────────────────────────────────────────────────────────┤
│ TABS: [Tổng quan] [Lịch sử sao lưu] [Cấu hình] [Khôi phục]         │
├─────────────────────────────────────────────────────────────────────┤
│ Tab "Tổng quan":                                                    │
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │ ✅ Backup cuối:       │  │ 💾 Storage:           │                │
│  │ 02:15 AM hôm nay     │  │ 67.3 / 100 GB (33%)  │                │
│  │ 3.2 GB | Full backup │  │ [████████░░░░] 67%   │                │
│  └──────────────────────┘  └──────────────────────┘                │
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │ 📅 Lịch tiếp theo:   │  │ 📦 Tổng bản backup:  │                │
│  │ Hôm nay 02:00 AM     │  │ 42 bản | 7 ngày qua │                │
│  │ (Incremental)         │  │ Thành công: 42/42   │                │
│  └──────────────────────┘  └──────────────────────┘                │
│                                                                     │
│  [▶ Chạy backup ngay]  [⚙ Cấu hình lịch]                          │
├─────────────────────────────────────────────────────────────────────┤
│ LỊCH SỬ GẦN ĐÂY:                                                   │
│ ✅ 02:15 03/18 | Auto Full | 3.2GB | 4m12s | S3+Local              │
│ ✅ 02:10 03/17 | Auto Inc. | 145MB | 0m38s | S3+Local              │
│ ✅ 02:11 03/16 | Auto Inc. | 203MB | 0m51s | S3+Local              │
│ ⚠ 02:00 03/15 | Auto Inc. | FAILED | Xem lỗi... | [Retry]          │
└─────────────────────────────────────────────────────────────────────┘
```

### Màn hình Khôi phục — Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ KHÔI PHỤC DỮ LIỆU                                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ⚠️ CẢNH BÁO NGHIÊM TRỌNG ⚠️                                      │
│  Thao tác này sẽ GHI ĐÈ dữ liệu hiện tại và KHÔNG THỂ HOÀN TÁC.   │
│  ─────────────────────────────────────────────────────────────────  │
│  Bước 1: [✅] Tạo backup dữ liệu hiện tại (bắt buộc)               │
│  Bước 2: Chọn bản backup để khôi phục:                             │
│    ○ 02:15 03/18 — Full — 3.2 GB                                   │
│    ○ 02:15 03/11 — Full — 3.0 GB                                   │
│    ○ 02:15 03/04 — Full — 2.8 GB                                   │
│  Bước 3: Phạm vi: ○ Toàn bộ  ○ Chỉ Database  ○ Chỉ Files         │
│  Bước 4: Xác nhận: Nhập tên hệ thống [ QUOCHOC______ ]             │
│                                                                     │
│  [❌ Hủy]                     [✅ Bắt đầu khôi phục]               │
└─────────────────────────────────────────────────────────────────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Chạy backup ngay | Nút "Chạy backup ngay" | Progress modal, thông báo khi xong |
| Cấu hình lịch | Tab "Cấu hình" | Form cài đặt cron, phạm vi, destination |
| Thêm storage destination | Section "Đích lưu trữ" → "+ Thêm" | Form nhập thông tin + test kết nối |
| Xem chi tiết backup | Click row trong lịch sử | Danh sách file, checksum, log |
| Download backup | Nút "Download" trên row | Tải file .tar.gz về local |
| Xóa bản backup | Nút "Xóa" + confirm | Xóa khỏi tất cả destinations |
| Khôi phục từ backup | Nút "Khôi phục" | Wizard 4 bước với xác nhận nghiêm ngặt |
| Bật/tắt backup tự động | Toggle trên màn hình cấu hình | On/Off backup job |
| Gửi thử email cảnh báo | Nút "Gửi thử" trong cài đặt thông báo | Email test đến QTHT |

---

## Gom nhóm tính năng thông minh
Module Sao lưu gom **cấu hình + lịch sử + storage + restore** vào một nơi và tách biệt hoàn toàn với người dùng không phải QTHT. Nguyên tắc thiết kế: thao tác backup phải **zero-friction** (tự động, im lặng, không cần can thiệp), còn thao tác restore phải **friction tối đa** (nhiều bước xác nhận, nhập text, không thể vô tình nhấn). Việc bắt buộc tạo backup hiện tại trước khi restore là lớp bảo vệ cuối cùng tránh mất dữ liệu do restore nhầm.

---

## Edge Cases & Validation
- **Backup chạy khi server bận (>90% CPU)**: Trì hoãn 15 phút; thử lại 3 lần; nếu vẫn không được thì alert QTHT.
- **Disk đầy khi backup đang chạy**: Dừng backup, xóa file partial, alert QTHT ngay với thông tin "cần thêm X GB".
- **Upload lên cloud bị ngắt giữa chừng**: Hỗ trợ resumable upload (multipart upload S3); không cần upload lại từ đầu.
- **Bản backup bị hỏng (checksum không khớp)**: Đánh dấu "CORRUPTED"; không cho phép restore từ bản này; tự động giữ bản cũ hơn.
- **Restore thất bại giữa chừng**: Rollback về trạng thái trước khi restore (transaction-based); hệ thống không bị half-restored.
- **QTHT nhập sai tên xác nhận**: Block restore, hiển thị "Tên không khớp. Vui lòng nhập đúng: QUOCHOC".
- **Hai backup chạy cùng lúc**: Hệ thống dùng mutex lock, backup thứ 2 phải chờ backup thứ 1 xong.
- **Storage đầy**: Tự động xóa bản backup cũ nhất theo chính sách retention trước khi tạo bản mới; alert QTHT.
- **Backup chứa dữ liệu nhạy cảm**: File backup phải được mã hóa AES-256 trước khi upload lên cloud.
- **Network timeout khi upload lên S3**: Retry với exponential backoff (10s, 30s, 2m, 10m); fallback sang destination secondary.
- **Server migration**: Hướng dẫn QTHT export backup → setup server mới → import → verify.

---

## Tích hợp
- **Tất cả module**: Backup bao gồm dữ liệu của tất cả module (DB tables cho HS, GV, điểm danh, thư viện, thi...).
- **AWS S3 / MinIO**: Primary cloud storage cho backup files; versioning bật để tránh xóa nhầm.
- **Google Cloud Storage**: Secondary destination; cross-region replication cho DR (Disaster Recovery).
- **FTP/SFTP**: Hỗ trợ lưu về NAS nội bộ trường (phổ biến với trường không có ngân sách cloud).
- **Rclone**: Wrapper hỗ trợ 40+ cloud provider; cài đặt qua config file.
- **Email gateway**: Gửi report backup hàng ngày và alert khi có lỗi.
- **Cron scheduler**: Quartz scheduler (Java) hoặc node-cron (Node.js) với hỗ trợ timezone.
- **PostgreSQL pg_dump**: Công cụ dump database; hỗ trợ custom format (.dump) cho restore nhanh.
- **Audit Log**: Mọi thao tác backup/restore đều được ghi vào audit log không thể xóa.
