# Cấu Hình Hệ Thống — SSO, Phân Quyền, Nhật Ký — Role: Admin (QTHT only)

## Mục tiêu
Cung cấp cho QTHT toàn bộ công cụ quản trị hệ thống: cấu hình tích hợp SSO, quản lý phân quyền chi tiết, cài đặt email/SMS gateway, giám sát sức khỏe hệ thống và xem nhật ký hoạt động — đảm bảo hệ thống vận hành ổn định, bảo mật và đúng quy định.

## Người dùng & Quyền hạn
- **QTHT**: Toàn quyền tất cả cài đặt hệ thống — đây là module **chỉ dành cho QTHT**.
- **CBQL**: **Không có quyền truy cập** module này. Nếu vô tình vào, hiển thị trang "403 - Bạn không có quyền truy cập". Mọi cài đặt hệ thống đều phải qua QTHT.

---

## User Flow Chính

### Flow 1: Cấu hình SSO (Single Sign-On)
**Mô tả**: QTHT thiết lập SSO để người dùng đăng nhập một lần dùng được tất cả các hệ thống của trường.
**Trigger**: Menu "Hệ thống" → Tab **"Xác thực & SSO"**.
**Steps**:
1. Màn hình **"Xác thực & SSO"** hiển thị:
   - Trạng thái SSO hiện tại (Bật/Tắt).
   - Phương thức đăng nhập đang dùng: Local (username/password) | LDAP/AD | OAuth2/OIDC | SAML2.
2. **Cấu hình LDAP/Active Directory**:
   - Server URL, Port, Bind DN, Bind Password.
   - Base DN cho user search; filter attributes (CN, mail, memberOf).
   - Mapping trường LDAP → trường hệ thống (VD: `mail` → `email`, `cn` → `fullName`).
   - **Test kết nối**: Nhập username test → hệ thống thử bind và trả về thông tin user.
3. **Cấu hình OAuth2/OIDC** (Google Workspace, Microsoft 365...):
   - Client ID, Client Secret, Authorization URL, Token URL, Userinfo URL.
   - Scope permissions.
   - Callback URL (copy để điền vào Google/MS Console).
   - Toggle "Tự động tạo tài khoản khi đăng nhập lần đầu".
4. **Cấu hình SAML2** (cho tích hợp HUE-S hoặc hệ thống tỉnh):
   - Upload Identity Provider metadata XML.
   - Download Service Provider metadata (để gửi cho IdP).
   - Mapping attributes.
5. **Cài đặt bảo mật đăng nhập**:
   - Số lần đăng nhập sai tối đa trước khi khóa tài khoản (mặc định: 5 lần).
   - Thời gian khóa tài khoản: 15 phút / 1 giờ / 24 giờ / Khóa vĩnh viễn.
   - Bật/tắt 2FA (Two-Factor Authentication): TOTP (Google Authenticator) | SMS OTP.
   - Thời gian session timeout (mặc định: 4 giờ inactive).
   - IP whitelist cho admin (chỉ đăng nhập được từ IP nội bộ trường).
6. Nút **"Lưu & Kiểm tra"** → Hệ thống gửi test login → hiển thị kết quả.
**Expected Result**: SSO được cấu hình đúng; GV/HS đăng nhập 1 lần dùng được tất cả module.

---

### Flow 2: Quản lý phân quyền & vai trò (RBAC)
**Mô tả**: QTHT thiết lập hệ thống phân quyền chi tiết cho từng vai trò và người dùng.
**Trigger**: Menu "Hệ thống" → Tab **"Phân quyền"**.
**Steps**:
1. Màn hình **"Quản lý vai trò"** hiển thị danh sách role: QTHT | CBQL | Giáo viên | Học sinh | Thủ thư | Phụ huynh (xem).
2. Click vào role → Ma trận phân quyền:
   - Hàng = Module (QL Trường, QL GV, QL HS, Thư viện, E-learning, Thi, Báo cáo, Hệ thống).
   - Cột = Hành động (Xem | Tạo | Sửa | Xóa | Xuất | Cấu hình).
   - Mỗi ô = Toggle (Có/Không) với màu xanh/xám.
3. **Chỉnh sửa quyền của role**:
   - Toggle từng ô, hoặc "Chọn tất cả hàng" / "Bỏ tất cả hàng".
   - Nút "Xem trước" → Show UI như người dùng role này sẽ thấy.
   - Lưu → áp dụng cho tất cả người dùng có role này.
4. **Tạo role tùy chỉnh** (VD: "Trưởng thư viện" = CBQL + toàn quyền Thư viện):
   - Nút "+ Tạo role mới" → đặt tên → copy quyền từ role có sẵn → tinh chỉnh.
5. **Quyền ngoại lệ theo người dùng** (User-level override):
   - Trong hồ sơ GV/CBQL → Tab "Quyền hạn" → thêm/bớt quyền đặc biệt ngoài role.
   - Ghi chú lý do bắt buộc.
   - Tự hết hạn sau ngày được chỉ định (tránh quyền đặc biệt tồn tại vĩnh viễn).
6. **Audit quyền**: Xem danh sách "Ai có quyền gì" → xuất Excel để kiểm tra định kỳ.
**Expected Result**: Phân quyền rõ ràng, linh hoạt, có thể kiểm tra và giải trình.

---

### Flow 3: Cấu hình Email & SMS Gateway
**Mô tả**: QTHT cài đặt dịch vụ gửi email và SMS để hệ thống gửi thông báo tự động.
**Trigger**: Menu "Hệ thống" → Tab **"Thông báo & Gateway"**.
**Steps**:
1. **Tab Email**:
   - Chọn provider: SMTP (tự cài) | SendGrid | Mailgun | AWS SES.
   - Nhập thông tin cấu hình (host, port, username, password/API key, from address).
   - Nút **"Gửi email test"** → nhập địa chỉ test → nhận email xác nhận → "✓ Cấu hình thành công".
   - Cài đặt giới hạn gửi (rate limit): Tối đa X email/phút để tránh bị spam filter.
2. **Tab SMS**:
   - Chọn provider: Esms | VNPT SMS | Viettel SMS | Twilio.
   - Nhập API Key, Sender Name.
   - Nút **"Gửi SMS test"** → nhập số điện thoại → nhận SMS.
3. **Tab Mẫu thông báo (Templates)**:
   - Danh sách tất cả mẫu email/SMS hệ thống (chào mừng, reset MK, vắng học, kết quả thi...).
   - Click mẫu → Editor HTML (email) hoặc Text (SMS).
   - Biến động: `{{studentName}}`, `{{className}}`, `{{date}}`, `{{absenceCount}}`...
   - Nút "Xem trước" render mẫu với dữ liệu mẫu.
   - Hỗ trợ đa ngôn ngữ (Tiếng Việt / Tiếng Anh).
4. **Tab Lịch sử gửi**:
   - Log tất cả email/SMS đã gửi: recipient, template, thời gian, trạng thái (Sent/Failed/Bounced).
   - Filter và search; xuất log ra CSV.
   - Nút "Gửi lại" cho các tin nhắn thất bại.
**Expected Result**: Hệ thống gửi thông báo tự động đúng người, đúng mẫu; dễ debug khi có vấn đề.

---

### Flow 4: Giám sát sức khỏe hệ thống
**Mô tả**: QTHT theo dõi tình trạng máy chủ, database, disk và các service để phát hiện vấn đề sớm.
**Trigger**: Menu "Hệ thống" → Tab **"Giám sát hệ thống"** (System Health).
**Steps**:
1. **Dashboard System Health**:
   - CPU Usage (gauge chart, cập nhật mỗi 10s)
   - RAM Usage (gauge)
   - Disk Usage (bar chart theo phân vùng)
   - Network In/Out (line chart 1 giờ qua)
   - Database connections (hiện tại / tối đa)
   - Số người dùng online
2. **Status Services** (checklist): Web server | Database | Redis cache | Email queue | Video transcoder | Background jobs | Camera stream relay.
   - Mỗi service: 🟢 Running | 🟡 Degraded | 🔴 Down.
   - Click service Down → Log lỗi + nút "Restart service" (với confirm).
3. **Cảnh báo ngưỡng**: Cấu hình alert khi:
   - CPU > 80% trong 5 phút liên tiếp
   - Disk > 85%
   - Có service bị Down
   → Gửi email/SMS đến QTHT.
4. **Log hệ thống**: Tab "Logs" hiển thị log file realtime (tail -f style), có thể filter theo level (ERROR/WARN/INFO) và tìm kiếm.
5. **Lịch bảo trì**: Cấu hình cửa sổ bảo trì → Hệ thống tự hiển thị banner "Bảo trì lúc X" cho người dùng trước 1 tiếng.
**Expected Result**: QTHT phát hiện sự cố trước khi ảnh hưởng đến người dùng; xử lý nhanh không cần SSH vào server.

---

### Flow 5: Xem nhật ký hoạt động (Audit Log)
**Mô tả**: QTHT tra cứu lịch sử hành động của người dùng trong hệ thống để điều tra sự cố hoặc kiểm toán.
**Trigger**: Menu "Hệ thống" → Tab **"Nhật ký hoạt động"**.
**Steps**:
1. Bảng audit log với các cột: Thời gian | Người dùng | IP | Loại hành động | Module | Đối tượng bị tác động | Giá trị cũ → Giá trị mới | Kết quả (Thành công/Thất bại).
2. **Bộ lọc mạnh**:
   - Người dùng cụ thể (search tên hoặc chọn từ list).
   - Khoảng thời gian.
   - Loại hành động: Đăng nhập | CRUD dữ liệu | Xuất báo cáo | Thay đổi cấu hình | Đăng nhập thất bại.
   - Module.
   - Kết quả: Chỉ hiện thất bại (để điều tra xâm nhập).
3. Click vào một record → Xem chi tiết đầy đủ (payload trước và sau thay đổi dạng JSON diff).
4. **Điều tra nhanh**: Tìm tất cả hành động của một người dùng trong một khoảng thời gian.
5. Xuất log ra Excel/CSV để lưu trữ hoặc gửi cho kiểm toán.
6. **Cấu hình retention**: Lưu log bao nhiêu ngày (mặc định 365 ngày theo quy định bảo mật).
**Expected Result**: Mọi hành động trong hệ thống đều có thể truy vết; điều tra sự cố trong vài phút.

---

## Tính năng & Màn hình

### Màn hình Hệ thống — Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER: Cấu hình Hệ thống | ⚠ Chỉ dành cho QTHT                   │
├─────────────────────────────────────────────────────────────────────┤
│ TABS:                                                               │
│ [Tổng quan] [SSO & Auth] [Phân quyền] [Thông báo] [Giám sát]      │
│ [Nhật ký] [Sao lưu] [Tích hợp API] [Cấu hình chung]              │
├─────────────────────────────────────────────────────────────────────┤
│ Tab "Tổng quan":                                                    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │ CPU: 23% │ │RAM: 61%  │ │Disk: 74% │ │Users: 89 │              │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                     │
│ Services: 🟢 Web 🟢 DB 🟢 Cache 🟢 Email 🟡 Video Transcode       │
│                                                                     │
│ Hoạt động gần đây: [5 log entries mới nhất]                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Tab Phân quyền — Ma trận quyền
```
┌─────────────────┬───────────┬────────────┬──────────────┬──────────┐
│ Module          │ QTHT      │ CBQL       │ Giáo viên    │ HS       │
├─────────────────┼───────────┼────────────┼──────────────┼──────────┤
│ QL Trường       │ ✅ Full   │ ✅ Edit    │ 👁 View only │ ❌       │
│ QL Giáo viên    │ ✅ Full   │ ✅ Edit    │ 👁 Own only  │ ❌       │
│ QL Học sinh     │ ✅ Full   │ ✅ Edit    │ 👁 Class only│ 👁 Own   │
│ Thư viện        │ ✅ Full   │ 👁 View    │ 👁 View      │ 👁 View  │
│ E-learning      │ ✅ Full   │ ✅ Monitor │ ✅ Create    │ 👁 Enroll│
│ Thi             │ ✅ Full   │ ✅ Manage  │ ✅ Create    │ 👁 Take  │
│ Báo cáo         │ ✅ Full   │ ✅ View+Ex │ 👁 Own class │ ❌       │
│ Hệ thống        │ ✅ Full   │ ❌         │ ❌           │ ❌       │
└─────────────────┴───────────┴────────────┴──────────────┴──────────┘
```

### Actions (CRUD)
| Action | Shortcut/Trigger | Kết quả |
|--------|-----------------|---------|
| Test kết nối SSO | Nút "Test kết nối" | Hiển thị kết quả test ngay |
| Lưu cấu hình SSO | Nút "Lưu" + Confirm | Áp dụng ngay; logout các session hiện tại |
| Tạo role mới | Tab Phân quyền → "+ Role" | Form tên + copy từ role có sẵn |
| Sửa quyền role | Toggle trong ma trận | Lưu tức thì; áp dụng trong < 1 phút |
| Gửi email test | Tab Email → "Gửi thử" | Gửi email đến địa chỉ nhập |
| Restart service | Click service Down → Restart | Confirm → Gửi lệnh restart |
| Xem log chi tiết | Click row trong audit log | Modal JSON diff |
| Export audit log | Nút "Xuất" trong tab Log | CSV với tất cả filter đang áp dụng |
| Cấu hình cảnh báo | Tab Giám sát → Ngưỡng | Form điền % threshold + người nhận |
| Sao lưu ngay | Tab Sao lưu → "Backup now" | Chạy job backup, progress indicator |

### Tab Sao Lưu
- Lịch sử backup: danh sách file backup với kích thước, thời gian, trạng thái.
- Cấu hình backup tự động: hàng ngày lúc 2:00AM, giữ 30 bản gần nhất.
- Backup bao gồm: Database dump + Files (ảnh, tài liệu upload) + Cấu hình.
- Nút "Restore từ backup" (với confirm 2 lần + nhập tên hệ thống để xác nhận).
- Lưu backup ra external storage: S3 / Google Drive / FTP.

### Tab Tích hợp API
- Danh sách API keys đã cấp (cho HUE-S, Sở GD, hệ thống bên ngoài).
- Tạo API key mới: chọn scope (quyền của key này), thời hạn, IP whitelist.
- Xem usage của từng key: số request trong 24h/7 ngày.
- Thu hồi key: ngay lập tức vô hiệu hóa.
- Webhook configuration: URL nhận webhook khi có sự kiện (HS vắng, kết quả thi...).

### Tab Cấu hình chung
- Tên trường, địa chỉ, logo (dùng cho email template, PDF báo cáo).
- Múi giờ (mặc định: Asia/Ho_Chi_Minh).
- Ngôn ngữ mặc định (Tiếng Việt).
- Cấu hình năm học hiện tại (lấy từ module QL Trường).
- Giới hạn upload file: kích thước tối đa, loại file cho phép.
- Cấu hình watermark PDF báo cáo.

---

## Gom nhóm tính năng thông minh
Module Hệ thống gom tất cả **infrastructure-level settings** vào một nơi và tách biệt hoàn toàn với các module nghiệp vụ. Lý do: QTHT cần một "trung tâm kiểm soát" riêng, tách biệt với màn hình của CBQL, để tránh nhầm lẫn giữa cấu hình hệ thống và cấu hình nghiệp vụ. Mọi thứ ảnh hưởng đến toàn bộ hệ thống (auth, quyền, gateway, log) đều nằm ở đây.

---

## Edge Cases & Validation
- **Thay đổi cấu hình SSO đang có session**: Cảnh báo "Thay đổi này sẽ buộc đăng xuất X người dùng đang online. Tiếp tục?".
- **Xóa role đang được gán cho user**: Block; hiển thị "Role này đang được gán cho X người dùng. Chuyển họ sang role nào?".
- **QTHT tự xóa quyền QTHT của mình**: Block; phải có ít nhất 1 QTHT active trong hệ thống.
- **Backup thất bại**: Alert email cho QTHT; retry lần tiếp theo sẽ full backup (không incremental).
- **Disk đầy khi backup**: Kiểm tra dung lượng trước khi backup; cảnh báo nếu < 20% dư.
- **Test SSO dùng tài khoản thật**: Log test connection vào audit log; không lưu password trong log.
- **Webhook URL không phản hồi**: Retry theo exponential backoff (1min, 5min, 15min, 1hr); sau 24h ngưng và alert.
- **API key bị lộ**: Nút "Thu hồi khẩn cấp" không cần confirm; log sự kiện; gửi alert ngay.
- **Thay đổi quyền role trong khi user đang đăng nhập**: Áp dụng trong session tiếp theo (sau khi logout/login lại); không force logout ngay.
- **Log bị xóa/chỉnh sửa**: Audit log là append-only; không có UI để xóa (chỉ expire theo thời gian); ghi hash của mỗi record để detect tampering.
- **Cấu hình sai dẫn đến không ai đăng nhập được**: QTHT có "emergency bypass code" (một lần dùng) được in ra khi cài hệ thống; hoặc đăng nhập trực tiếp vào server DB.

---

## Tích hợp
- **Tất cả module**: Module Hệ thống là layer cross-cutting — authentication, authorization, logging áp dụng cho tất cả module khác.
- **SSO / LDAP**: Active Directory trường (nếu có) hoặc Google Workspace (GSuite cho Edu).
- **HUE-S Platform**: OAuth2 identity federation với hệ thống HUE-S của tỉnh Thừa Thiên Huế.
- **Sở GD&ĐT**: API token cấp bởi Sở để đồng bộ dữ liệu.
- **Email providers**: SendGrid, Mailgun, AWS SES, hoặc SMTP nội bộ.
- **SMS providers**: ESMS.vn, VNPT SMS API (dịch vụ phổ biến tại Việt Nam).
- **Monitoring**: Prometheus metrics endpoint; Grafana dashboard (tùy chọn); hoặc tích hợp với Zabbix/Nagios của trường.
- **Cloud Storage**: AWS S3 / Google Cloud Storage / MinIO (self-hosted) cho lưu trữ backup và file.
- **Security**: Let's Encrypt SSL auto-renewal; OWASP headers (CSP, HSTS, X-Frame-Options).
