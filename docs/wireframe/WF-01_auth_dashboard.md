---
title: "WF-01: Đăng nhập & Dashboard"
cluster: "Authentication & Navigation"
screens: [SCR-01-001, SCR-01-002, SCR-01-003, SCR-01-004, SCR-01-005, SCR-01-006]
updated: 2026-03-11
---

# WF-01: Đăng nhập & Dashboard

---

## Tổng quan luồng

Cụm màn hình này bao phủ toàn bộ hành trình từ khi người dùng lần đầu truy cập ứng dụng cho đến khi họ hạ cánh vào đúng Dashboard theo vai trò (role-based landing). Hệ thống hỗ trợ hai phương thức xác thực:

1. **SSO HUE-S (ưu tiên)** – Người dùng được chuyển hướng sang cổng xác thực HUE-S (OAuth2/OIDC), sau khi HUE-S xác thực thành công sẽ trả về token và redirect về callback endpoint của hệ thống.
2. **Đăng nhập nội bộ (dự phòng)** – Dành cho tài khoản quản trị viên hệ thống hoặc các tài khoản kỹ thuật chưa được đồng bộ với HUE-S.

Sau khi xác thực, hệ thống đọc `role` từ token/session rồi điều hướng tự động:
- `QTHT` (Quản trị hệ thống) → **SCR-01-003** Dashboard Admin
- `GV` (Giáo viên) → **SCR-01-004** Dashboard Giáo viên
- `HV` (Học sinh) → **SCR-01-005** Dashboard Học sinh
- `CBQL` (Cán bộ quản lý) → **SCR-01-003** Dashboard Admin (quyền hạn hẹp hơn QTHT)

Mọi request đến các trang được bảo vệ mà không có session hợp lệ sẽ bị redirect về **SCR-01-001**. Lỗi xác thực hoặc thiếu quyền truy cập sẽ dẫn đến **SCR-01-006**.

---

## Flow Diagram (text)

```
  [Người dùng truy cập URL]
            │
            ▼
  ┌─────────────────────┐
  │  Có session hợp lệ? │
  └─────────────────────┘
       │            │
      Có           Không
       │            │
       │            ▼
       │   ┌──────────────────────────┐
       │   │  SCR-01-001              │
       │   │  Trang Đăng nhập SSO     │
       │   └──────────────────────────┘
       │        │              │
       │   [Chọn SSO]    [Nhập nội bộ]
       │        │              │
       │        ▼              ▼
       │   [Redirect      [POST /api/
       │    HUE-S         auth/login]
       │    Portal]            │
       │        │         ┌────┴──────┐
       │        │        Thành       Lỗi
       │        │        công         │
       │        │         │           ▼
       │        │         │    SCR-01-006
       │        ▼         │    Trang Lỗi
       │   SCR-01-002      │
       │   Callback SSO ◄──┘
       │        │
       │   ┌────┴─────────────────┐
       │   │  Xác minh token OK?  │
       │   └────────────────────┬─┘
       │        │               │
       │      Thành           Thất bại
       │      công              │
       │        │               ▼
       │        │          SCR-01-006
       │        ▼          Trang Lỗi
       │   [Đọc role từ token]
       │        │
       │   ┌────┴──────────────────────────┐
       │   │  role == QTHT || CBQL?        │──► SCR-01-003 Dashboard Admin
       │   │  role == GV?                  │──► SCR-01-004 Dashboard Giáo viên
       │   │  role == HV?                  │──► SCR-01-005 Dashboard Học sinh
       │   └───────────────────────────────┘
       │
       └──────────────────────────────────────►  (redirect đến dashboard tương ứng)
```

---

## SCR-01-001: Trang Đăng nhập SSO

**Mô tả:** Màn hình điểm vào duy nhất của ứng dụng. Hiển thị hai tùy chọn xác thực: đăng nhập liên kết SSO với hệ thống HUE-S (luồng chính) và đăng nhập bằng tài khoản nội bộ (luồng phụ/dự phòng).

**Actors:** Tất cả người dùng — Học sinh (HV), Giáo viên (GV), Cán bộ quản lý (CBQL), Quản trị hệ thống (QTHT)

**Truy cập từ:**
- URL gốc của ứng dụng (`/`)
- Redirect tự động khi session hết hạn (HTTP 401)
- Redirect tự động khi chưa đăng nhập và cố truy cập trang bảo vệ
- Link từ SCR-01-006 (nút "Thử lại / Đăng nhập lại")

---

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [favicon]   TRƯỜNG THPT QUỐC HỌC HUẾ                         │
│              Hệ thống Quản lý Trường học Thông minh            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│        ┌──────────────────────────────────────────┐           │
│        │           [  LOGO TRƯỜNG  ]              │           │
│        │                                          │           │
│        │     ╔══════════════════════════════╗     │           │
│        │     ║  HỆ THỐNG QUẢN LÝ           ║     │           │
│        │     ║  TRƯỜNG HỌC THÔNG MINH      ║     │           │
│        │     ║  Trường THPT Quốc Học Huế   ║     │           │
│        │     ╚══════════════════════════════╝     │           │
│        │                                          │           │
│        │   ┌──────────────────────────────────┐   │           │
│        │   │  🏛  Đăng nhập với tài khoản     │   │           │
│        │   │         HUE-S                    │   │           │
│        │   │    (Sở GD&ĐT Thừa Thiên Huế)    │   │           │
│        │   └──────────────────────────────────┘   │           │
│        │          [Button - PRIMARY / LARGE]       │           │
│        │                                          │           │
│        │   ─────────── hoặc ─────────────────     │           │
│        │                                          │           │
│        │   Đăng nhập bằng tài khoản nội bộ        │           │
│        │                                          │           │
│        │   Tên đăng nhập                          │           │
│        │   ┌──────────────────────────────────┐   │           │
│        │   │ nhập tên đăng nhập...            │   │           │
│        │   └──────────────────────────────────┘   │           │
│        │                                          │           │
│        │   Mật khẩu                               │           │
│        │   ┌────────────────────────────────┬─┐   │           │
│        │   │ ••••••••••••••••••••••••••••   │👁│   │           │
│        │   └────────────────────────────────┴─┘   │           │
│        │                                          │           │
│        │   ┌──────────────────────────────────┐   │           │
│        │   │           Đăng nhập              │   │           │
│        │   └──────────────────────────────────┘   │           │
│        │          [Button - SECONDARY]             │           │
│        │                                          │           │
│        │   [Quên mật khẩu?]    [Liên hệ hỗ trợ]  │           │
│        │                                          │           │
│        └──────────────────────────────────────────┘           │
│                                                                │
│   ──────────────────────────────────────────────────────────   │
│   © 2026 Trường THPT Quốc Học Huế  |  Phiên bản 1.0.0        │
└────────────────────────────────────────────────────────────────┘

  [Trạng thái loading — hiện khi đang redirect/xử lý]
┌────────────────────────────────────────────────────────────────┐
│                    ⟳  Đang kết nối HUE-S...                    │
│               Vui lòng không đóng trình duyệt                  │
└────────────────────────────────────────────────────────────────┘
```

---

### Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | Logo trường | Image | SVG/PNG, hiển thị ở trên cùng card |
| 2 | Tiêu đề hệ thống | Heading H1 | "Hệ thống Quản lý Trường học Thông minh" |
| 3 | Tên trường | Heading H2 | "Trường THPT Quốc Học Huế" |
| 4 | Button "Đăng nhập với HUE-S" | Button (Primary, Large) | Trigger OAuth2 redirect sang cổng HUE-S |
| 5 | Divider "hoặc" | Divider | Phân tách 2 phương thức |
| 6 | Input "Tên đăng nhập" | Text Input | Placeholder, maxLength=100 |
| 7 | Input "Mật khẩu" | Password Input | Toggle hiện/ẩn mật khẩu (👁) |
| 8 | Button "Đăng nhập" | Button (Secondary) | Submit form nội bộ |
| 9 | Link "Quên mật khẩu?" | Anchor Link | Mở modal hoặc redirect trang reset |
| 10 | Link "Liên hệ hỗ trợ" | Anchor Link | Hiển thị thông tin liên hệ IT |
| 11 | Loading overlay | Spinner + Text | Hiển thị khi đang chờ redirect SSO |
| 12 | Toast/Alert lỗi | Alert (Error) | Hiển thị khi đăng nhập nội bộ thất bại |
| 13 | Footer | Footer | Version, copyright |

---

### Flow điều hướng

**Từ màn hình này đi đến:**
- → **SCR-01-002** Callback SSO (khi nhấn "Đăng nhập với HUE-S" và hoàn thành xác thực HUE-S)
- → **SCR-01-003** Dashboard Admin (khi đăng nhập nội bộ thành công với role QTHT/CBQL)
- → **SCR-01-004** Dashboard Giáo viên (khi đăng nhập nội bộ thành công với role GV)
- → **SCR-01-005** Dashboard Học sinh (khi đăng nhập nội bộ thành công với role HV)
- → **SCR-01-006** Trang Lỗi (khi thông tin đăng nhập sai hoặc tài khoản bị khóa)

**Đến màn hình này từ:**
- URL gốc `/`
- HTTP 401 từ bất kỳ trang được bảo vệ nào
- SCR-01-006 → nút "Đăng nhập lại"
- Session timeout (tự động redirect)

---

### Business Rules / Validation

| # | Rule | Chi tiết |
|---|------|---------|
| BR-01-001 | SSO là luồng ưu tiên | Button HUE-S hiển thị nổi bật, kích thước lớn hơn |
| BR-01-002 | Kiểm tra session trước | Nếu đã có session hợp lệ, tự redirect đến dashboard (không hiện trang login) |
| BR-01-003 | Tên đăng nhập không rỗng | Bắt buộc khi dùng form nội bộ; trim() trước khi validate |
| BR-01-004 | Mật khẩu không rỗng | Bắt buộc khi dùng form nội bộ; không hiện ký tự rõ mặc định |
| BR-01-005 | Giới hạn số lần đăng nhập | Sau 5 lần sai liên tiếp: khóa form 15 phút, hiển thị đếm ngược |
| BR-01-006 | Session timeout | Phiên làm việc tối đa 8 giờ; cảnh báo timeout 5 phút trước khi hết |
| BR-01-007 | HTTPS bắt buộc | Mọi request phải qua HTTPS; redirect HTTP → HTTPS tự động |
| BR-01-008 | State parameter CSRF | Tạo `state` ngẫu nhiên khi redirect SSO, xác minh lại trong callback |
| BR-01-009 | Đăng nhập nội bộ chỉ dành cho QTHT | Phần form nội bộ có thể ẩn đối với môi trường production |

---

### API Calls

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/auth/sso/redirect` | Khởi tạo luồng OAuth2, trả về URL redirect sang HUE-S |
| `POST` | `/api/auth/login` | Đăng nhập nội bộ; body: `{ username, password }` |
| `GET` | `/api/auth/session/status` | Kiểm tra session hiện tại khi load trang |

---

---

## SCR-01-002: Callback / Redirect sau SSO thành công

**Mô tả:** Màn hình trung gian — người dùng không trực tiếp tương tác. Sau khi HUE-S xác thực thành công, hệ thống HUE-S redirect trình duyệt về endpoint này kèm `authorization_code` và `state`. Hệ thống xử lý ngầm: xác minh token, tạo session, đọc role, sau đó redirect đến đúng Dashboard. Nếu có lỗi, chuyển đến SCR-01-006.

**Actors:** Hệ thống (tự động) — người dùng chỉ thấy màn hình chờ trong vài giây.

**Truy cập từ:**
- Redirect từ cổng xác thực HUE-S (sau khi đăng nhập HUE-S thành công)
- URL pattern: `/auth/callback?code=xxx&state=yyy`

---

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [favicon]   TRƯỜNG THPT QUỐC HỌC HUẾ                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                                                                │
│                                                                │
│              ┌──────────────────────────────────┐             │
│              │                                  │             │
│              │        [  LOGO TRƯỜNG  ]          │             │
│              │                                  │             │
│              │   ┌──────────────────────────┐   │             │
│              │   │   ◌  ◌  ◌  ◌  ◌         │   │             │
│              │   │   (animated spinner)     │   │             │
│              │   └──────────────────────────┘   │             │
│              │                                  │             │
│              │   Đang xác thực tài khoản...     │             │
│              │   Vui lòng chờ trong giây lát    │             │
│              │                                  │             │
│              │   ░░░░░░░░░░░░░░░░░░░░░░░░░░     │             │
│              │   [Progress bar — animation]      │             │
│              │                                  │             │
│              │   Bước: Xác minh token HUE-S     │             │
│              │   [1] ──► [2] ──► [3]            │             │
│              │   Nhận   Xác    Tạo              │             │
│              │   token  minh   phiên            │             │
│              │                                  │             │
│              └──────────────────────────────────┘             │
│                                                                │
│   Nếu không được chuyển hướng sau 10 giây,                     │
│   [nhấn vào đây để tiếp tục] hoặc [quay lại đăng nhập]        │
│                                                                │
└────────────────────────────────────────────────────────────────┘

  [Trạng thái: Lỗi callback - hiển thị thay cho spinner]
┌────────────────────────────────────────────────────────────────┐
│              │                                  │             │
│              │   ⚠  Xác thực không thành công  │             │
│              │   Lý do: Token không hợp lệ      │             │
│              │                                  │             │
│              │   [Thử lại]   [Liên hệ hỗ trợ]  │             │
└────────────────────────────────────────────────────────────────┘
```

---

### Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | Logo trường | Image | Nhỏ hơn SCR-01-001 |
| 2 | Spinner / Loading animation | Spinner | Quay liên tục trong khi xử lý |
| 3 | Progress bar | Progress Bar | Indeterminate hoặc 3 bước |
| 4 | Step indicator | Step Component | 3 bước: Nhận token → Xác minh → Tạo phiên |
| 5 | Text trạng thái | Paragraph | Cập nhật theo từng bước xử lý |
| 6 | Link dự phòng | Anchor | Hiện sau 10 giây nếu không redirect |
| 7 | Alert lỗi inline | Alert (Error) | Hiện nếu callback thất bại |
| 8 | Button "Thử lại" | Button | Redirect về SCR-01-001 |

---

### Flow điều hướng

**Từ màn hình này đi đến:**
- → **SCR-01-003** Dashboard Admin (role = QTHT hoặc CBQL)
- → **SCR-01-004** Dashboard Giáo viên (role = GV)
- → **SCR-01-005** Dashboard Học sinh (role = HV)
- → **SCR-01-006** Trang Lỗi (token không hợp lệ, hết hạn, state mismatch, role không xác định)

**Đến màn hình này từ:**
- Redirect từ cổng HUE-S sau đăng nhập thành công (`/auth/callback?code=&state=`)

---

### Business Rules / Validation

| # | Rule | Chi tiết |
|---|------|---------|
| BR-02-001 | Xác minh `state` parameter | So khớp `state` trong callback với `state` đã lưu trong session/cookie (chống CSRF) |
| BR-02-002 | Xác minh `authorization_code` | Gọi HUE-S token endpoint để đổi `code` lấy `access_token` + `id_token` |
| BR-02-003 | Xác minh JWT signature | Kiểm tra chữ ký JWT với public key của HUE-S (JWKS endpoint) |
| BR-02-004 | Kiểm tra token expiry | Từ chối token đã hết hạn (`exp` claim) |
| BR-02-005 | Ánh xạ role | Đọc claim `role` hoặc `groups` từ token, ánh xạ sang role nội bộ |
| BR-02-006 | Tạo session nội bộ | Sinh session ID, lưu vào Redis/DB, set HttpOnly cookie |
| BR-02-007 | Timeout xử lý | Nếu quá 10 giây không redirect, hiện link dự phòng cho người dùng |
| BR-02-008 | One-time use code | `authorization_code` chỉ dùng được 1 lần; từ chối nếu đã dùng |
| BR-02-009 | Đồng bộ người dùng | Nếu người dùng chưa tồn tại trong DB nội bộ, tạo mới từ thông tin token |

---

### API Calls

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/auth/sso/callback` | Nhận `code` + `state`, xử lý toàn bộ luồng xác minh và tạo session |
| `GET` | `[HUE-S]/oauth2/token` | (gọi từ backend) Đổi authorization_code lấy token |
| `GET` | `[HUE-S]/.well-known/jwks.json` | (gọn từ backend) Lấy public key xác minh JWT |
| `GET` | `/api/auth/me` | Lấy thông tin user + role sau khi tạo session, dùng để quyết định redirect |

---

---

## SCR-01-003: Dashboard Quản trị viên (Admin / CBQL)

**Mô tả:** Trang chủ sau đăng nhập của Quản trị hệ thống (QTHT) và Cán bộ quản lý (CBQL). Cung cấp cái nhìn tổng quan toàn trường: thống kê nhanh, cảnh báo hệ thống, truy cập nhanh các module quản lý, biểu đồ báo cáo, và nhật ký hoạt động gần đây.

**Actors:** Quản trị hệ thống (QTHT), Cán bộ quản lý (CBQL)

**Truy cập từ:**
- SCR-01-002 (callback SSO thành công với role QTHT/CBQL)
- SCR-01-001 (đăng nhập nội bộ thành công với role QTHT/CBQL)
- Nhấn logo/tên hệ thống từ bất kỳ trang nào (breadcrumb)

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                         │
│  [≡]  [LOGO] Quốc Học Huế - Quản lý Thông minh    [🔔 3]  [👤 Nguyễn Văn A ▾]│
├────────────────────────────────────────────────────────────────────────────────┤
│         │                                                                      │
│ SIDEBAR │  MAIN CONTENT                                                        │
│ (240px) │                                                                      │
│         │  ┌─────────────────────────────────────────────────────────────┐    │
│ 🏠 Tổng │  │ Chào mừng, Nguyễn Văn A  •  Thứ Tư, 11/03/2026  •  07:45  │    │
│  quan   │  └─────────────────────────────────────────────────────────────┘    │
│         │                                                                      │
│ 👥 Quản │  [STAT CARDS — hàng 1]                                               │
│  lý HS  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│         │  │ 👨‍🎓 Học sinh  │ │ 👩‍🏫 Giáo viên│ │ 🏛 Lớp học  │ │ 📋 Điểm   │ │
│ 👩‍🏫 Quản │  │              │ │              │ │              │ │  danh hôm  │ │
│  lý GV  │  │    1,248      │ │      87      │ │      32      │ │    nay     │ │
│         │  │   học sinh    │ │   giáo viên  │ │    lớp học   │ │   94.2%    │ │
│ 🏫 Lớp  │  │  ▲ +5 tháng  │ │  ▲ +2 tháng │ │              │ │  ▼ -1.3%  │ │
│  học    │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│         │                                                                      │
│ 📋 Điểm │  [STAT CARDS — hàng 2]                                               │
│  danh   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│         │  │ 📚 Thư viện  │ │ 📝 Kỳ thi   │ │ 📊 Khảo sát │ │ 🔴 Cảnh   │ │
│ 📚 Thư  │  │              │ │  sắp tới    │ │  đang mở    │ │  báo hệ   │ │
│  viện   │  │   2,345      │ │      3       │ │      2       │ │  thống    │ │
│         │  │   tài liệu   │ │  (7 ngày)   │ │              │ │     1     │ │
│ 📊 Báo  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│  cáo    │                                                                      │
│         │  ┌────────────────────────────────┐  ┌──────────────────────────┐   │
│ 🔧 Cấu  │  │ BIỂU ĐỒ ĐIỂM DANH 7 NGÀY GẦN │  │ CẢNH BÁO & THÔNG BÁO   │   │
│  hình   │  │ %  ▲                           │  │                          │   │
│         │  │100 │  ■  ■     ■              │  │ 🔴 Camera C3 mất kết nối │   │
│ 📷 Camera│  │ 95 │     ■  ■   ■  ■         │  │    Từ: 10/03 08:30       │   │
│         │  │ 90 │                           │  │ [Xử lý]                  │   │
│ 🤖 AI   │  │ 85─┼─────────────────────► T  │  │                          │   │
│         │  │    5  6  7  8  9 10 11 (tháng)│  │ 🟡 15 HS vắng chưa phép │   │
│ 📜 Nhật │  └────────────────────────────────┘  │    Hôm nay               │   │
│  ký     │                                       │ [Xem chi tiết]           │   │
│         │  ┌────────────────────────────────┐  │                          │   │
│ ─────── │  │ TRUY CẬP NHANH                │  │ 🟢 Đồng bộ HUE-S: OK   │   │
│ ⚙ Cài   │  │                               │  │    Cập nhật: 06:00 hôm  │   │
│  đặt    │  │ [+Thêm HS]  [+Thêm GV]        │  │    nay                   │   │
│         │  │ [Tạo lớp]   [Xuất BC]         │  │                          │   │
│ 🚪 Đăng │  │ [Điểm danh] [Cấu hình AI]     │  └──────────────────────────┘   │
│  xuất   │  └────────────────────────────────┘                                 │
│         │                                                                      │
│         │  ┌──────────────────────────────────────────────────────────────┐   │
│         │  │ HOẠT ĐỘNG GẦN ĐÂY                              [Xem tất cả] │   │
│         │  ├──────────────────────────────────────────────────────────────┤   │
│         │  │ 🔵 09:12  admin  Cập nhật thông tin HS Trần Thị B — 12A1    │   │
│         │  │ 🟢 08:55  system Đồng bộ dữ liệu HUE-S hoàn thành (1,248)  │   │
│         │  │ 🟡 08:30  admin  Thêm giáo viên mới: Lê Văn C (Toán)        │   │
│         │  │ 🔵 07:45  system Sao lưu dữ liệu tự động thành công         │   │
│         │  └──────────────────────────────────────────────────────────────┘   │
│         │                                                                      │
└─────────┴──────────────────────────────────────────────────────────────────────┘
│ FOOTER: © 2026 THPT Quốc Học Huế  |  v1.0.0  |  Hỗ trợ kỹ thuật: IT Dept   │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

### Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | Header bar | Layout | Logo, tên hệ thống, bell notification, user menu |
| 2 | Notification bell | Icon + Badge | Số thông báo chưa đọc |
| 3 | User dropdown | Dropdown Menu | Avatar, tên, role; tùy chọn: Hồ sơ, Đổi MK, Đăng xuất |
| 4 | Sidebar navigation | Nav Menu | Collapsible; highlight mục đang chọn |
| 5 | Sidebar toggle (≡) | Button | Thu/mở sidebar |
| 6 | Greeting bar | Info Bar | Tên người dùng + ngày giờ hiện tại |
| 7 | Stat cards (hàng 1) | Card x4 | Học sinh, Giáo viên, Lớp học, Điểm danh |
| 8 | Stat cards (hàng 2) | Card x4 | Thư viện, Kỳ thi, Khảo sát, Cảnh báo HT |
| 9 | Biểu đồ điểm danh 7 ngày | Line Chart | Thư viện recharts/chart.js; hover tooltip |
| 10 | Panel Cảnh báo & Thông báo | Alert List | 3 mức: Đỏ/Vàng/Xanh; mỗi item có nút xử lý |
| 11 | Panel Truy cập nhanh | Button Grid | 6 shortcut action phổ biến nhất |
| 12 | Bảng Hoạt động gần đây | Table/List | 4 dòng; timestamp, actor, action; link "Xem tất cả" |
| 13 | Footer | Footer | Version, copyright, link hỗ trợ |

---

### Flow điều hướng

**Từ màn hình này đi đến:**
- → Quản lý Học sinh (click sidebar hoặc stat card "Học sinh")
- → Quản lý Giáo viên (click sidebar hoặc stat card "Giáo viên")
- → Quản lý Lớp học (click sidebar hoặc stat card "Lớp học")
- → Module Điểm danh (click sidebar hoặc stat card "Điểm danh")
- → Module Thư viện (click sidebar)
- → Module Báo cáo/Thống kê (click sidebar)
- → Cấu hình hệ thống (click sidebar)
- → Module Camera (click sidebar)
- → Module AI (click sidebar)
- → Nhật ký sử dụng (click sidebar hoặc "Xem tất cả" ở Hoạt động gần đây)
- → Trang chi tiết cảnh báo (click "Xử lý" trong panel cảnh báo)
- → SCR-01-001 (click "Đăng xuất" trong user menu)

**Đến màn hình này từ:**
- SCR-01-002 (callback SSO với role QTHT/CBQL)
- SCR-01-001 (đăng nhập nội bộ QTHT/CBQL)
- Mọi trang con → click Logo/breadcrumb Home

---

### Business Rules / Validation

| # | Rule | Chi tiết |
|---|------|---------|
| BR-03-001 | Chỉ QTHT và CBQL được truy cập | Route guard kiểm tra role; HV/GV bị redirect về dashboard của họ |
| BR-03-002 | CBQL có quyền hẹp hơn QTHT | CBQL không thấy: Cấu hình hệ thống, Quản lý AI, Nhật ký kỹ thuật |
| BR-03-003 | Stat cards refresh tự động | Làm mới dữ liệu mỗi 5 phút (polling) hoặc dùng WebSocket |
| BR-03-004 | Cảnh báo đỏ phải hiển thị nổi bật | Badge đỏ trên notification bell; panel cảnh báo luôn hiện trước |
| BR-03-005 | Truy cập nhanh theo role | CBQL không thấy shortcut "Cấu hình AI", "Quản lý Camera kỹ thuật" |
| BR-03-006 | Nhật ký hoạt động | Chỉ hiện 4 dòng gần nhất; có link xem đầy đủ với phân trang |
| BR-03-007 | Đồng bộ HUE-S | Hiển thị trạng thái đồng bộ gần nhất; nếu lỗi hiện cảnh báo vàng |

---

### API Calls

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/dashboard/admin/summary` | Lấy tất cả stat cards (số HS, GV, lớp, điểm danh...) |
| `GET` | `/api/dashboard/admin/alerts` | Lấy danh sách cảnh báo hệ thống hiện tại |
| `GET` | `/api/dashboard/admin/attendance-chart` | Dữ liệu điểm danh 7 ngày gần nhất |
| `GET` | `/api/audit-log/recent?limit=4` | Lấy 4 hoạt động gần nhất |
| `GET` | `/api/sync/hues/status` | Trạng thái đồng bộ HUE-S |
| `GET` | `/api/notifications?unread=true` | Số thông báo chưa đọc cho bell icon |

---

---

## SCR-01-004: Dashboard Giáo viên / Giảng viên

**Mô tả:** Trang chủ sau đăng nhập của Giáo viên (GV). Tập trung vào lịch dạy, danh sách lớp phụ trách, điểm danh học sinh, thông báo từ nhà trường và các công cụ giảng dạy. Giao diện gọn hơn Admin, ưu tiên tác vụ hằng ngày của giáo viên.

**Actors:** Giáo viên (GV)

**Truy cập từ:**
- SCR-01-002 (callback SSO thành công với role GV)
- Breadcrumb Home từ bất kỳ trang con nào

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                         │
│  [≡]  [LOGO] Quốc Học Huế              [🔔 2]  [👤 Nguyễn Thị Hương (GV) ▾]  │
├────────────────────────────────────────────────────────────────────────────────┤
│         │                                                                      │
│ SIDEBAR │  MAIN CONTENT                                                        │
│         │                                                                      │
│ 🏠 Tổng │  ┌─────────────────────────────────────────────────────────────┐    │
│  quan   │  │ Xin chào, cô Hương!  •  Thứ Tư, 11/03/2026  •  07:45      │    │
│         │  └─────────────────────────────────────────────────────────────┘    │
│ 📅 Lịch │                                                                      │
│  dạy    │  [STAT CARDS]                                                        │
│         │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│ 🏫 Lớp  │  │ 🏫 Lớp phụ  │ │ 📋 Tiết hôm │ │ 👨‍🎓 HS vắng │ │ 📝 Bài cần │ │
│  của tôi│  │  trách      │ │  nay        │ │  hôm nay    │ │  chấm      │ │
│         │  │     4 lớp   │ │  3 tiết     │ │   5 học sinh│ │    12 bài  │ │
│ 📋 Điểm │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│  danh   │                                                                      │
│         │  ┌──────────────────────────────────┐  ┌──────────────────────────┐ │
│ 📝 Bài  │  │ LỊCH DẠY HÔM NAY (11/03/2026)  │  │ THÔNG BÁO TỪ NHÀ TRƯỜNG │ │
│  tập    │  ├──────────────────────────────────┤  ├──────────────────────────┤ │
│         │  │ ⏰ 07:15  Toán 11  - Lớp 11A1   │  │ 📌 11/03 Họp HĐ GD tuần │ │
│ 📊 Báo  │  │           Phòng 201              │  │    lúc 16:00, P.Hội đồng│ │
│  cáo    │  │           [● Điểm danh ngay]     │  │                          │ │
│         │  │ ─────────────────────────────    │  │ 📌 12/03 Nộp sổ đầu bài │ │
│ 💬 Nhắn │  │ ⏰ 09:00  Toán 12  - Lớp 12A3   │  │    hạn 17:00             │ │
│  tin    │  │           Phòng 305              │  │                          │ │
│         │  │           [Xem trước]            │  │ 📌 15/03 Kiểm tra 1 tiết │ │
│ 🚪 Đăng │  │ ─────────────────────────────    │  │    Toán 11 — Nhập điểm  │ │
│  xuất   │  │ ⏰ 13:30  Toán 10  - Lớp 10A2   │  └──────────────────────────┘ │
│         │  │           Phòng 102              │                                │
│         │  │           [Xem trước]            │  ┌──────────────────────────┐ │
│         │  └──────────────────────────────────┘  │ LỚP HỌC CỦA TÔI        │ │
│         │                                         ├──────────────────────────┤ │
│         │  ┌──────────────────────────────────┐  │ 10A2  Toán  45HS [►]    │ │
│         │  │ ĐIỂM DANH NHANH                  │  │ 11A1  Toán  43HS [►]    │ │
│         │  │ Lớp: [10A2 ▾]  Tiết: [1 ▾]      │  │ 12A3  Toán  42HS [►]    │ │
│         │  │                                   │  │ 11A3  CN    44HS [►]    │ │
│         │  │ ┌───┬────────────────┬─────────┐ │  └──────────────────────────┘ │
│         │  │ │ # │ Họ tên HS      │ Trạng  │ │                                │
│         │  │ ├───┼────────────────┼─────────┤ │                                │
│         │  │ │ 1 │ Nguyễn Văn An │ ✅ Có   │ │                                │
│         │  │ │ 2 │ Trần Thị Bình  │ ✅ Có   │ │                                │
│         │  │ │ 3 │ Lê Minh Cường  │ ❌ Vắng │ │                                │
│         │  │ │...│ ...            │ ...    │ │                                │
│         │  │ └───┴────────────────┴─────────┘ │                                │
│         │  │ [Lưu điểm danh]  [Xem đầy đủ]   │                                │
│         │  └──────────────────────────────────┘                                │
│         │                                                                      │
└─────────┴──────────────────────────────────────────────────────────────────────┘
│ FOOTER: © 2026 THPT Quốc Học Huế  |  v1.0.0                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

### Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | Header bar | Layout | Logo, bell, user dropdown (vai trò hiện rõ "GV") |
| 2 | Notification bell | Icon + Badge | Thông báo từ trường, nhắn tin |
| 3 | User dropdown | Dropdown | Hồ sơ, đổi mật khẩu, đăng xuất |
| 4 | Sidebar | Nav Menu | Gọn hơn Admin; chỉ hiện module GV có quyền |
| 5 | Greeting bar | Info Bar | Tên, ngày giờ; dùng "cô/thầy" tùy giới tính |
| 6 | Stat cards x4 | Card | Lớp phụ trách, Tiết hôm nay, HS vắng, Bài cần chấm |
| 7 | Lịch dạy hôm nay | Timeline List | Thứ tự thời gian; mỗi tiết có nút hành động nhanh |
| 8 | Panel thông báo từ trường | Announcement List | Danh sách thông báo, pin/quan trọng lên đầu |
| 9 | Widget điểm danh nhanh | Mini Form | Dropdown chọn lớp + tiết; bảng checklist HS |
| 10 | Bảng điểm danh inline | Table | Checkbox/toggle từng HS; nút "Lưu" |
| 11 | Panel lớp học | Card List | Danh sách lớp phụ trách; link [►] đến trang lớp |

---

### Flow điều hướng

**Từ màn hình này đi đến:**
- → Trang chi tiết lớp học (click [►] trong panel lớp)
- → Module Điểm danh đầy đủ (click "Xem đầy đủ" hoặc "Điểm danh ngay")
- → Module Bài tập / Kiểm tra
- → Báo cáo thống kê lớp (sidebar)
- → Nhắn tin / Thông báo (bell hoặc sidebar)
- → Lịch dạy chi tiết (click tiết học trong Lịch dạy hôm nay)
- → SCR-01-001 (Đăng xuất)

**Đến màn hình này từ:**
- SCR-01-002 (callback SSO với role GV)
- Breadcrumb Home từ mọi trang con

---

### Business Rules / Validation

| # | Rule | Chi tiết |
|---|------|---------|
| BR-04-001 | Chỉ GV được truy cập | Route guard; HV → SCR-01-005; QTHT → SCR-01-003 |
| BR-04-002 | Lịch dạy lấy theo NGÀY HIỆN TẠI | Tự động hiển thị lịch hôm nay khi load trang |
| BR-04-003 | Stat card HS vắng | Chỉ đếm lớp GV phụ trách, hôm nay, chưa có phép |
| BR-04-004 | Điểm danh nhanh | Lưu tạm thời; cần xác nhận trước 23:59 hôm đó |
| BR-04-005 | Stat card "Bài cần chấm" | Chỉ đếm bài đã nộp trong thời hạn, chưa được GV chấm |
| BR-04-006 | Thông báo pin | Thông báo của BGH/CBQL được hiển thị nổi bật (📌) |
| BR-04-007 | Widget điểm danh | Chỉ cho phép điểm danh khoảng 30 phút trước/sau giờ học |

---

### API Calls

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/dashboard/teacher/summary` | Stat cards: số lớp, tiết hôm nay, HS vắng, bài chấm |
| `GET` | `/api/schedule/today?teacherId={id}` | Lịch dạy hôm nay theo giáo viên |
| `GET` | `/api/classes?teacherId={id}` | Danh sách lớp phụ trách |
| `GET` | `/api/announcements?target=teacher&limit=5` | Thông báo từ nhà trường |
| `GET` | `/api/attendance/class/{classId}?date=today` | Danh sách HS để điểm danh nhanh |
| `POST` | `/api/attendance/submit` | Lưu kết quả điểm danh nhanh |
| `GET` | `/api/notifications?unread=true` | Số thông báo chưa đọc |

---

---

## SCR-01-005: Dashboard Học sinh / Người học

**Mô tả:** Trang chủ sau đăng nhập của Học sinh (HV). Hiển thị thông tin cá nhân học tập, lịch học hôm nay, trạng thái điểm danh, thư viện, thông báo từ giáo viên/nhà trường, và kết quả học tập gần đây. Giao diện thân thiện, trực quan, phù hợp lứa tuổi học sinh THPT.

**Actors:** Học sinh (HV)

**Truy cập từ:**
- SCR-01-002 (callback SSO thành công với role HV)
- Breadcrumb Home từ bất kỳ trang con nào

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                         │
│  [≡]  [LOGO] Quốc Học Huế              [🔔 5]  [👤 Trần Thị Mai (12A1)  ▾]   │
├────────────────────────────────────────────────────────────────────────────────┤
│         │                                                                      │
│ SIDEBAR │  MAIN CONTENT                                                        │
│         │                                                                      │
│ 🏠 Trang│  ┌──────────────────────────────────────────────────────────────┐   │
│  chủ    │  │  👋 Xin chào, Mai!  |  Lớp 12A1  |  Thứ Tư, 11/03/2026    │   │
│         │  └──────────────────────────────────────────────────────────────┘   │
│ 📅 Lịch │                                                                      │
│  học    │  [STAT CARDS]                                                        │
│         │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│ 📋 Điểm │  │ ✅ Điểm      │ │ 📚 Thư viện │ │ 📝 Bài tập  │ │ 🏆 Xếp    │ │
│  danh   │  │  danh hôm   │ │  đã mượn    │ │  sắp đến   │ │  loại HK1  │ │
│         │  │  nay        │ │             │ │  hạn nộp   │ │            │ │
│ 📚 Thư  │  │  Có mặt     │ │  2 cuốn     │ │   3 bài    │ │   Giỏi     │ │
│  viện   │  │  5/5 tiết   │ │  (hạn 5 ngày│ │  (2 ngày)  │ │  8.7 ĐTB   │ │
│         │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│ 📝 Bài  │                                                                      │
│  tập    │  ┌───────────────────────────────────┐  ┌──────────────────────────┐│
│         │  │ LỊCH HỌC HÔM NAY (11/03/2026)   │  │ ĐIỂM DANH TUẦN NÀY      ││
│ 📊 Kết  │  ├───────────────────────────────────┤  ├──────────────────────────┤│
│  quả    │  │ T1  07:15  Toán      -  GV Hương  │  │  T2  T3  T4  T5  T6  T7 ││
│         │  │     Phòng 201  ✅ Đã điểm danh    │  │  ✅  ✅  ✅  ✅  ✅  -  ││
│ 💬 Thông│  │ ─────────────────────────────     │  │  5/5 tiết có mặt hôm nay││
│  báo    │  │ T2  08:55  Văn       -  GV Lan    │  │  Chuỗi có mặt: 12 ngày ││
│         │  │     Phòng 103  ✅ Đã điểm danh    │  └──────────────────────────┘│
│ 🏅 Thành│  │ ─────────────────────────────     │                               │
│  tích   │  │ T3  10:50  Anh       -  GV Minh   │  ┌──────────────────────────┐│
│         │  │     Phòng 405  🕐 Sắp tới         │  │ THÔNG BÁO / BÀI TẬP    ││
│ 🚪 Đăng │  │ ─────────────────────────────     │  ├──────────────────────────┤│
│  xuất   │  │ T4  13:30  Lý        -  GV Dũng   │  │ 📌 GV Hương: Nộp bài tập││
│         │  │     Phòng 201  ○  Chưa đến        │  │    Toán chương 3 trước   ││
│         │  │ ─────────────────────────────     │  │    13/03 23:59           ││
│         │  │ T5  15:20  Hóa       -  GV Thu    │  │    [Làm bài ngay]        ││
│         │  │     Phòng 302  ○  Chưa đến        │  │ ─────────────────────    ││
│         │  └───────────────────────────────────┘  │ 📌 Nhà trường: Kiểm tra ││
│         │                                          │    học kỳ 2 ngày 20/03  ││
│         │  ┌───────────────────────────────────┐  │    Xem lịch thi         ││
│         │  │ KẾT QUẢ HỌC TẬP GẦN ĐÂY          │  └──────────────────────────┘│
│         │  ├─────────┬────────┬────────┬───────┤                               │
│         │  │ Môn     │ Bài KT │ Điểm   │ Xếp  │                               │
│         │  ├─────────┼────────┼────────┼───────┤                               │
│         │  │ Toán    │ 15 phút│  8.5   │ Giỏi │                               │
│         │  │ Văn     │ 1 tiết │  7.5   │ Khá  │                               │
│         │  │ Anh     │ 15 phút│  9.0   │ Giỏi │                               │
│         │  │         │        │        │[Xem +]│                               │
│         │  └─────────┴────────┴────────┴───────┘                               │
│         │                                                                      │
└─────────┴──────────────────────────────────────────────────────────────────────┘
│ FOOTER: © 2026 THPT Quốc Học Huế  |  v1.0.0                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

### Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | Header bar | Layout | Hiển thị tên + lớp học sinh |
| 2 | Notification bell | Icon + Badge | Thông báo từ GV và trường |
| 3 | User dropdown | Dropdown | Hồ sơ cá nhân, đổi mật khẩu, đăng xuất |
| 4 | Sidebar | Nav Menu | Chỉ module HS có quyền; không có quản trị |
| 5 | Greeting bar | Info Bar | Tên, lớp, ngày giờ; thân thiện hơn Admin |
| 6 | Stat cards x4 | Card | Điểm danh, Thư viện mượn, Bài tập hạn, Xếp loại |
| 7 | Lịch học hôm nay | Timeline List | Từng tiết với GV, phòng, trạng thái điểm danh |
| 8 | Panel Điểm danh tuần | Calendar Grid | 7 ô ngày trong tuần; màu xanh/đỏ/xám |
| 9 | Panel Thông báo/Bài tập | Notification List | Từ GV và trường; link hành động nhanh |
| 10 | Bảng Kết quả gần đây | Table | Môn - Loại bài - Điểm - Xếp loại; link "Xem +" |
| 11 | Badge chuỗi có mặt | Gamification Badge | Khuyến khích chuyên cần |

---

### Flow điều hướng

**Từ màn hình này đi đến:**
- → Lịch học đầy đủ (click vào Lịch học hôm nay hoặc sidebar)
- → Chi tiết điểm danh (click stat card hoặc panel điểm danh)
- → Module Thư viện (click stat card "Thư viện" hoặc sidebar)
- → Module Bài tập (click "Làm bài ngay" hoặc sidebar)
- → Kết quả học tập đầy đủ (click "Xem +" trong bảng kết quả)
- → Trang thông báo (bell hoặc sidebar)
- → Thành tích / Hồ sơ (sidebar)
- → SCR-01-001 (Đăng xuất)

**Đến màn hình này từ:**
- SCR-01-002 (callback SSO với role HV)
- Breadcrumb Home từ mọi trang con

---

### Business Rules / Validation

| # | Rule | Chi tiết |
|---|------|---------|
| BR-05-001 | Chỉ HV được truy cập dashboard này | Route guard; GV → SCR-01-004; QTHT → SCR-01-003 |
| BR-05-002 | HS chỉ xem dữ liệu của chính mình | Tất cả API call đều filter theo `studentId` của session |
| BR-05-003 | Lịch học theo ngày hiện tại | Tự động load lịch hôm nay |
| BR-05-004 | Trạng thái điểm danh real-time | Cập nhật khi GV lưu điểm danh (WebSocket hoặc polling 2 phút) |
| BR-05-005 | Thông báo hạn bài tập | Bài tập còn ≤ 2 ngày hiện badge cam; đã trễ hiện badge đỏ |
| BR-05-006 | Chuỗi có mặt | Tính liên tục; reset khi vắng không phép |
| BR-05-007 | HS không thấy dữ liệu HS khác | Không có route nào cho phép xem thông tin cá nhân HS khác |
| BR-05-008 | Điểm danh chỉ xem | HS không thể tự sửa trạng thái điểm danh |

---

### API Calls

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/dashboard/student/summary` | Stat cards: điểm danh, thư viện, bài tập, xếp loại |
| `GET` | `/api/schedule/today?studentId={id}` | Lịch học hôm nay |
| `GET` | `/api/attendance/student/{id}?week=current` | Điểm danh tuần hiện tại |
| `GET` | `/api/assignments/upcoming?studentId={id}&days=7` | Bài tập sắp đến hạn |
| `GET` | `/api/grades/recent?studentId={id}&limit=5` | Kết quả kiểm tra gần đây |
| `GET` | `/api/announcements?target=student&classId={id}&limit=5` | Thông báo từ GV và trường |
| `GET` | `/api/library/borrowed?studentId={id}` | Sách đang mượn |
| `GET` | `/api/notifications?unread=true` | Số thông báo chưa đọc |

---

---

## SCR-01-006: Trang lỗi đăng nhập / Không có quyền truy cập

**Mô tả:** Màn hình hiển thị khi có sự cố xác thực hoặc phân quyền. Bao gồm nhiều kịch bản lỗi: sai thông tin đăng nhập, token hết hạn, state CSRF không khớp, tài khoản bị khóa, hoặc người dùng không có quyền truy cập trang yêu cầu. Mỗi lỗi hiển thị thông điệp phù hợp và hướng dẫn bước tiếp theo.

**Actors:** Tất cả người dùng (khi gặp lỗi xác thực)

**Truy cập từ:**
- SCR-01-001 (nhập sai thông tin đăng nhập nội bộ quá giới hạn)
- SCR-01-002 (callback SSO thất bại: token lỗi, state mismatch, token hết hạn)
- Bất kỳ trang nào (HTTP 403 - không đủ quyền)
- Đường dẫn không tồn tại trong ứng dụng (404 nội bộ)

---

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [favicon]   TRƯỜNG THPT QUỐC HỌC HUẾ                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│         ┌──────────────────────────────────────────┐          │
│         │         [  LOGO TRƯỜNG (nhỏ)  ]          │          │
│         ├──────────────────────────────────────────┤          │
│         │                                          │          │
│         │   ┌──────────────────────────────────┐   │          │
│         │   │                                  │   │          │
│         │   │  [ICON LỖI - thay đổi theo type] │   │          │
│         │   │                                  │   │          │
│         │   │  🔐  Không có quyền truy cập     │   │          │
│         │   │  ──── (403 / 401 / SSO Error) ─  │   │          │
│         │   │                                  │   │          │
│         │   │  Mã lỗi:  AUTH-403               │   │          │
│         │   │                                  │   │          │
│         │   │  Tài khoản của bạn không có      │   │          │
│         │   │  quyền truy cập trang này.        │   │          │
│         │   │  Vui lòng liên hệ quản trị viên   │   │          │
│         │   │  nếu bạn cho rằng đây là lỗi.    │   │          │
│         │   │                                  │   │          │
│         │   │  ┌────────────────────────────┐  │   │          │
│         │   │  │  🏠  Về trang chủ          │  │   │          │
│         │   │  └────────────────────────────┘  │   │          │
│         │   │  ┌────────────────────────────┐  │   │          │
│         │   │  │  🔑  Đăng nhập lại         │  │   │          │
│         │   │  └────────────────────────────┘  │   │          │
│         │   │  ┌────────────────────────────┐  │   │          │
│         │   │  │  📞  Liên hệ hỗ trợ        │  │   │          │
│         │   │  └────────────────────────────┘  │   │          │
│         │   │                                  │   │          │
│         │   └──────────────────────────────────┘   │          │
│         │                                          │          │
│         │   [Chi tiết kỹ thuật - thu gọn mặc định] │          │
│         │   ▶ Xem chi tiết lỗi (dành cho IT)       │          │
│         │   ┌──────────────────────────────────┐   │          │
│         │   │ Error: invalid_token             │   │          │
│         │   │ TraceID: abc123-def456           │   │          │
│         │   │ Time: 2026-03-11T07:45:00+07:00  │   │          │
│         │   └──────────────────────────────────┘   │          │
│         │                                          │          │
│         └──────────────────────────────────────────┘          │
│                                                                │
│   ──────────────────────────────────────────────────────────   │
│   © 2026 THPT Quốc Học Huế  |  Hỗ trợ: it@quochoc.edu.vn    │
└────────────────────────────────────────────────────────────────┘
```

**Biến thể Icon & Thông điệp theo loại lỗi:**

```
┌─────────────────┬──────┬──────────────────────────────────────────────────────┐
│ Loại lỗi        │ Icon │ Thông điệp hiển thị                                  │
├─────────────────┼──────┼──────────────────────────────────────────────────────┤
│ Sai mật khẩu    │  🔑  │ "Tên đăng nhập hoặc mật khẩu không chính xác."       │
│ Tài khoản khóa  │  🔒  │ "Tài khoản đã bị tạm khóa do đăng nhập sai nhiều lần.│
│                 │      │  Thử lại sau: 14 phút 32 giây [đếm ngược]"           │
│ Token hết hạn   │  ⏰  │ "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại." │
│ SSO thất bại    │  🏛  │ "Không thể kết nối hệ thống HUE-S. Thử lại hoặc      │
│                 │      │  dùng đăng nhập nội bộ."                             │
│ 403 Forbidden   │  🔐  │ "Tài khoản không có quyền truy cập trang này."        │
│ State mismatch  │  ⚠   │ "Phiên đăng nhập không hợp lệ (lỗi bảo mật).         │
│                 │      │  Vui lòng thử lại từ đầu."                          │
│ Tài khoản chưa  │  👤  │ "Tài khoản chưa được kích hoạt trong hệ thống.       │
│ kích hoạt       │      │  Liên hệ quản trị viên để được hỗ trợ."              │
└─────────────────┴──────┴──────────────────────────────────────────────────────┘
```

---

### Components

| # | Component | Loại | Ghi chú |
|---|-----------|------|---------|
| 1 | Logo trường | Image | Nhỏ, ở trên cùng |
| 2 | Icon lỗi | Icon (large) | Thay đổi theo loại lỗi (xem bảng biến thể) |
| 3 | Tiêu đề lỗi | Heading H2 | Mô tả ngắn gọn loại lỗi |
| 4 | Mã lỗi | Code Badge | VD: AUTH-401, AUTH-403, SSO-ERR |
| 5 | Thông điệp lỗi | Paragraph | Giải thích thân thiện, không dùng thuật ngữ kỹ thuật |
| 6 | Đếm ngược khóa | Countdown Timer | Chỉ hiện khi tài khoản bị tạm khóa |
| 7 | Button "Về trang chủ" | Button (Primary) | → Dashboard (nếu có session) hoặc SCR-01-001 |
| 8 | Button "Đăng nhập lại" | Button (Secondary) | → SCR-01-001; xóa session cũ nếu có |
| 9 | Button "Liên hệ hỗ trợ" | Button (Outline) | Mở modal với SĐT + email IT |
| 10 | Accordion chi tiết kỹ thuật | Collapsible | Mặc định đóng; chứa error code, trace ID, timestamp |
| 11 | Modal liên hệ hỗ trợ | Modal Dialog | SĐT: xxx, Email: it@quochoc.edu.vn, Giờ làm việc |
| 12 | Footer | Footer | Copyright, email hỗ trợ |

---

### Flow điều hướng

**Từ màn hình này đi đến:**
- → **SCR-01-001** Đăng nhập (click "Đăng nhập lại" hoặc "Về trang chủ" khi chưa có session)
- → **SCR-01-003/004/005** Dashboard tương ứng (click "Về trang chủ" khi đã có session hợp lệ)
- → Modal Liên hệ hỗ trợ (click "Liên hệ hỗ trợ")

**Đến màn hình này từ:**
- SCR-01-001 (đăng nhập nội bộ sai, tài khoản bị khóa)
- SCR-01-002 (callback SSO lỗi: token sai, state mismatch, tài khoản chưa kích hoạt)
- Bất kỳ trang nào (HTTP 403 - không đủ quyền truy cập)
- Bất kỳ trang nào (HTTP 401 - session hết hạn — thường tự redirect SCR-01-001, chỉ vào đây nếu SSO fail)

---

### Business Rules / Validation

| # | Rule | Chi tiết |
|---|------|---------|
| BR-06-001 | Thông điệp lỗi thân thiện | Không hiển thị stack trace hoặc thông tin kỹ thuật nhạy cảm trực tiếp |
| BR-06-002 | Chi tiết kỹ thuật ẩn mặc định | Accordion chi tiết chỉ mở khi người dùng chủ động click; dành cho IT hỗ trợ |
| BR-06-003 | Trace ID bắt buộc | Mỗi lỗi phải có Trace ID để IT có thể tra cứu trong log |
| BR-06-004 | Đếm ngược tài khoản khóa | Thời gian đếm ngược tính từ server-side, không phải client-side |
| BR-06-005 | Nút "Về trang chủ" thông minh | Kiểm tra session: nếu còn hợp lệ → dashboard; nếu không → trang login |
| BR-06-006 | Không lộ lý do bảo mật chi tiết | Lỗi state mismatch chỉ nói "lỗi bảo mật" chứ không giải thích cơ chế CSRF |
| BR-06-007 | Log mọi lỗi xác thực | Ghi audit log mỗi lần có lỗi 401/403 kèm IP, timestamp, userAgent |
| BR-06-008 | Tự động redirect sau 401 | HTTP 401 thông thường → tự redirect SCR-01-001 (không qua trang lỗi này) |
| BR-06-009 | Trang lỗi không cần đăng nhập | Không yêu cầu session để hiển thị trang này (là trang public) |

---

### API Calls

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/auth/logout` | Xóa session server-side khi click "Đăng nhập lại" |
| `GET` | `/api/auth/session/status` | Kiểm tra session khi click "Về trang chủ" để quyết định redirect |
| `POST` | `/api/audit-log/error` | Ghi log lỗi xác thực từ client (kèm trace ID, error type) |

---

---

## Phụ lục: Ma trận điều hướng tổng hợp

```
                  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
                  │SCR-01-001│SCR-01-002│SCR-01-003│SCR-01-004│SCR-01-005│SCR-01-006│
 ─────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
 SCR-01-001       │    -     │  SSO OK  │  NB QTHT │  NB GV   │  NB HV   │ Lỗi NB   │
 SCR-01-002       │    -     │    -     │role=QTHT │ role=GV  │ role=HV  │Token lỗi │
 SCR-01-003       │ Đăng xuất│    -     │    -     │    -     │    -     │ 403 Guard│
 SCR-01-004       │ Đăng xuất│    -     │    -     │    -     │    -     │ 403 Guard│
 SCR-01-005       │ Đăng xuất│    -     │    -     │    -     │    -     │ 403 Guard│
 SCR-01-006       │ Thử lại  │    -     │ Home (GV)│Home(QTHT)│Home (HV) │    -     │
 ─────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

 Chú thích: NB = Đăng nhập nội bộ, SSO OK = SSO callback thành công
```

---

## Phụ lục: Danh sách lỗi Auth & Mã lỗi

| Mã lỗi | HTTP | Nguyên nhân | Màn hình hiển thị |
|--------|------|------------|-------------------|
| AUTH-401-SESSION | 401 | Session hết hạn / không tồn tại | Redirect SCR-01-001 |
| AUTH-401-INVALID | 401 | Sai username/password nội bộ | Toast lỗi trên SCR-01-001 |
| AUTH-401-LOCKED | 401 | Tài khoản bị khóa tạm thời | SCR-01-006 (đếm ngược) |
| AUTH-403-ROLE | 403 | Đủ quyền đăng nhập nhưng sai role cho route | SCR-01-006 |
| SSO-ERR-STATE | 400 | CSRF state mismatch | SCR-01-006 |
| SSO-ERR-TOKEN | 400 | Token JWT không hợp lệ hoặc hết hạn | SCR-01-006 |
| SSO-ERR-CONNECT | 503 | Không kết nối được HUE-S | SCR-01-006 |
| AUTH-403-INACTIVE | 403 | Tài khoản chưa được kích hoạt | SCR-01-006 |

---

## Phụ lục: Role Mapping (HUE-S → Hệ thống nội bộ)

| Claim trong token HUE-S | Role nội bộ | Dashboard |
|------------------------|-------------|-----------|
| `admin`, `system_admin` | QTHT | SCR-01-003 |
| `manager`, `cbql`, `principal` | CBQL | SCR-01-003 |
| `teacher`, `giaovien` | GV | SCR-01-004 |
| `student`, `hocsinh` | HV | SCR-01-005 |
| (không xác định) | — | SCR-01-006 |
