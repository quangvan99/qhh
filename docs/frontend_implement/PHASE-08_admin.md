---
title: "Phase 8 — Quản trị hệ thống"
phase: 8
agent: "Agent G"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-10-001..007
  - SCR-10-010..011
  - SCR-10-020
  - SCR-10-030
  - SCR-10-040
  - SCR-10-050
wireframes: ["WF-10"]
estimated_days: "3–5 ngày"
---

# Phase 8 — Quản trị hệ thống

> ✅ Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.

## Phạm vi files

```
src/
├── app/(dashboard)/
│   └── admin/
│       ├── users/
│       │   ├── page.tsx                   # SCR-10-001 (danh sách)
│       │   ├── new/page.tsx               # SCR-10-002 (thêm)
│       │   ├── import/page.tsx            # SCR-10-003 (import Excel)
│       │   └── [userId]/
│       │       └── edit/page.tsx          # SCR-10-004 (sửa)
│       ├── roles/
│       │   ├── page.tsx                   # SCR-10-010 (danh sách)
│       │   └── [roleId]/
│       │       └── edit/page.tsx          # SCR-10-011 (sửa + permission matrix)
│       ├── organization/
│       │   └── page.tsx                   # SCR-10-020 (cơ cấu)
│       ├── settings/
│       │   └── page.tsx                   # SCR-10-030 (cấu hình)
│       ├── audit-log/
│       │   └── page.tsx                   # SCR-10-040
│       └── integrations/
│           └── page.tsx                   # SCR-10-050
└── features/
    └── admin/
        ├── users/
        │   ├── components/
        │   │   ├── UserForm.tsx
        │   │   ├── RoleAssignModal.tsx
        │   │   ├── PasswordModal.tsx
        │   │   └── BulkImportUser.tsx
        │   ├── hooks/
        │   │   └── useUsers.ts
        │   └── api/users.api.ts
        ├── roles/
        │   ├── components/
        │   │   ├── RoleForm.tsx
        │   │   └── PermissionMatrix.tsx   # ⭐ key component
        │   └── api/roles.api.ts
        ├── organization/
        │   ├── components/
        │   │   └── OrgTree.tsx            # tree CRUD
        │   └── api/organization.api.ts
        ├── settings/
        │   └── components/
        │       └── SystemSettingsForm.tsx
        ├── audit/
        │   └── components/
        │       └── AuditTable.tsx
        └── integrations/
            └── components/
                └── IntegrationCard.tsx
```

---

## TASK G-1: Quản lý người dùng (WF-10-001..007)

### SCR-10-001 — Danh sách người dùng

**Route:** `app/(dashboard)/admin/users/page.tsx`

**Layout:**
```
[PageHeader: "Quản lý người dùng"]
  Actions: [+ Thêm người dùng] [Import Excel] [Xuất Excel] [Bulk actions ▼]
    Bulk dropdown: [Khóa/Mở khóa qua Excel] [Đổi mật khẩu qua Excel]

[FilterBar]
  - SearchBar: Tên / username / email
  - TreeSelect: Đơn vị / Lớp
  - Select: Vai trò (All | QTHT | CBQL | GV | HS | ...)
  - Select: Trạng thái (All | Hoạt động | Bị khóa | Chờ kích hoạt)

[DataTable columns:]
  - Checkbox (bulk)
  - Avatar + Tên đầy đủ
  - Username
  - Email
  - Đơn vị/Lớp
  - Vai trò (badge list — multi-role)
  - Trạng thái (badge: Active=green | Locked=red | Pending=yellow)
  - Ngày tạo
  - Đăng nhập lần cuối
  - Actions: [Sửa] [Gán vai trò] [Đổi mật khẩu] [Khóa/Mở] [Xóa]
```

**Bulk actions (từ checkbox selection):**
- Xuất danh sách đã chọn
- Khóa/Mở khóa hàng loạt
- Xóa hàng loạt (với ConfirmDialog cảnh báo)

**SCR-10-005b — Modal đổi mật khẩu đơn lẻ:**
```
[Dialog: "Đổi mật khẩu — [Tên user]"]
  [FormField: Mật khẩu mới*]      password input + strength indicator
  [FormField: Xác nhận mật khẩu*]  password input
  [Checkbox: Yêu cầu đổi mật khẩu lần đăng nhập tiếp theo]
  [Hủy] [Đặt mật khẩu]
```

**SCR-10-006 — Bulk đổi mật khẩu qua Excel:**
```
[Dialog: "Bulk đổi mật khẩu"]
  [Text: Tải template Excel với cột: username | new_password]
  [Download template link]
  [FileUpload: .xlsx]
  [Preview table sau parse: username | new_password (masked)]
  [Hủy] [Áp dụng hàng loạt]
  → Toast: "{n} mật khẩu đã đổi thành công"
```

**SCR-10-007 — Bulk khóa/mở khóa qua Excel:**
```
[Dialog: "Bulk khóa/mở khóa"]
  Template: username | action (lock/unlock)
  [FileUpload] → Preview → [Áp dụng]
```

**API:**
- `GET /api/admin/users?q={}&unit={}&role={}&status={}`
- `POST /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`
- `PUT /api/admin/users/{id}/password`
- `PUT /api/admin/users/{id}/status`
- `POST /api/admin/users/bulk-password`
- `POST /api/admin/users/bulk-status`

**Types:**
```typescript
interface AdminUser {
  id: string
  username: string
  fullName: string
  email: string
  avatar?: string
  unit: { id: string; name: string }
  roles: Role[]
  status: 'active' | 'locked' | 'pending'
  createdAt: string
  lastLoginAt?: string
}
```

**Deliverables:**
- [ ] DataTable với filter + bulk select
- [ ] Bulk actions (lock/unlock/delete)
- [ ] Modal đổi mật khẩu đơn lẻ (với strength indicator)
- [ ] Bulk operations qua Excel (dialog)
- [ ] Export danh sách

---

### SCR-10-002 — Form thêm mới người dùng

**Route:** `app/(dashboard)/admin/users/new/page.tsx`

**Layout:**
```
[PageHeader: "Thêm người dùng mới"]
  Actions: [Hủy] [Lưu]

[Card: Thông tin tài khoản]
  [FormField: Username*]           AppInput (unique check)
  [FormField: Mật khẩu*]           password input
  [FormField: Xác nhận mật khẩu*]
  [FormField: Phương thức đăng nhập] Radio: Local | HUE-S SSO | Cả hai

[Card: Thông tin cá nhân]
  [FormField: Họ tên*]
  [FormField: Email*]
  [FormField: Số điện thoại]
  [FormField: Ngày sinh]           DatePicker
  [FormField: Giới tính]           Radio: Nam | Nữ | Khác
  [FormField: Ảnh đại diện]        ImageUpload (optional)

[Card: Phân công]
  [FormField: Đơn vị*]             TreeSelect
  [FormField: Vai trò*]            Multi-select (checkboxes)
  [FormField: Mã nhân viên/HS]     AppInput

[Card: Cài đặt]
  [Switch: Yêu cầu đổi mật khẩu lần đăng nhập đầu]
  [Switch: Kích hoạt ngay]
```

**Validation:**
```typescript
const userSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-z0-9._]+$/),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  passwordConfirm: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  unitId: z.string().min(1),
  roles: z.array(z.string()).min(1),
}).refine(data => data.password === data.passwordConfirm)
```

**API:** `POST /api/admin/users`

---

### SCR-10-003 — Import Excel người dùng

**Route:** `app/(dashboard)/admin/users/import/page.tsx`

**Dùng `ImportStepper` component**

**Template columns:**
```
| Username* | Họ tên* | Email* | Đơn vị* | Vai trò* | Mật khẩu | Mã HS/NV |
```

**Validation rules:**
- Username unique, format đúng
- Email unique
- Đơn vị phải tồn tại (code match)
- Vai trò phải hợp lệ

---

### SCR-10-004 — Form chỉnh sửa người dùng

Giống SCR-10-002 nhưng:
- Pre-fill tất cả (trừ mật khẩu — field riêng)
- `PUT /api/admin/users/{id}`

---

### SCR-10-005 — Gán/xóa vai trò

**Component:** `RoleAssignModal.tsx` (shadcn Dialog)

**Layout:**
```
[Dialog: "Gán vai trò — [Tên user]" width=md]

[Thông tin user: avatar + tên + username]

[Card: Vai trò hiện tại]
  [Badge list: Vai trò 1 × | Vai trò 2 ×]

[Card: Gán thêm vai trò]
  [Checkbox list tất cả roles với description:]
    ○ Quản trị hệ thống — Toàn quyền
    ○ CBQL/BGH — Xem báo cáo, phê duyệt
    ○ Giáo viên — Quản lý lớp học
    ○ Học sinh — Truy cập học tập
    ○ Thủ thư — Quản lý thư viện
    ○ ...

[Hủy] [Lưu thay đổi]
```

---

## TASK G-2: Quản lý vai trò (WF-10-010..011)

### SCR-10-010 — Danh sách vai trò

**Route:** `app/(dashboard)/admin/roles/page.tsx`

**Layout:**
```
[PageHeader: "Vai trò & Phân quyền"]
  Actions: [+ Tạo vai trò mới]

[DataTable columns:]
  - Tên vai trò
  - Mô tả
  - Số người dùng (count)
  - Số quyền được cấp (count)
  - Hệ thống (badge: Hệ thống / Tùy chỉnh) — system roles không xóa được
  - Ngày tạo
  - Actions: [✏️ Sửa & Phân quyền] [🗑 Xóa (nếu không phải system)]
```

---

### SCR-10-011 — Form thêm/sửa vai trò + Permission Matrix ⭐

**Route:** `app/(dashboard)/admin/roles/[roleId]/edit/page.tsx` (và `/new`)

**Layout:**
```
[PageHeader: "Cấu hình vai trò: [Tên]"]
  Actions: [Hủy] [Lưu]

[Card: Thông tin vai trò]
  [FormField: Tên vai trò*]      AppInput
  [FormField: Mô tả]             AppTextarea
  [FormField: Màu tag]           ColorPicker (optional)

[Card: Ma trận phân quyền — PermissionMatrix.tsx]

[Permission Matrix UI:]
  Header Row: Module | View | Create | Edit | Delete | Export | Approve | Import
  Data Rows:
    Auth                [✓]   [✓]    [✓]   [✓]    [✓]     [✓]     [✓]
    Dashboard           [✓]   [ ]    [ ]   [ ]    [✓]     [ ]     [ ]
    LMS - Lớp học       [✓]   [✓]    [✓]   [✓]    [✓]     [ ]     [✓]
    LMS - Nội dung      [✓]   [✓]    [✓]   [✓]    [ ]     [ ]     [ ]
    LMS - Kết quả       [✓]   [ ]    [✓]   [ ]    [✓]     [✓]     [ ]
    Thi - NHCH          [✓]   [✓]    [✓]   [✓]    [✓]     [ ]     [✓]
    Thi - Đề thi        [✓]   [✓]    [✓]   [✓]    [✓]     [ ]     [ ]
    Thi - Tổ chức       [✓]   [✓]    [✓]   [✓]    [✓]     [ ]     [✓]
    AI Điểm danh        [✓]   [✓]    [✓]   [✓]    [✓]     [ ]     [ ]
    Thư viện - Admin    [✓]   [✓]    [✓]   [✓]    [✓]     [✓]     [✓]
    Thư viện - Lưu thông[✓]  [✓]    [✓]   [✓]    [ ]     [ ]     [ ]
    Quản trị - User     [✓]   [✓]    [✓]   [✓]    [✓]     [ ]     [✓]
    Quản trị - Vai trò  [✓]   [✓]    [✓]   [✓]    [ ]     [ ]     [ ]
    GDĐT                [✓]   [✓]    [✓]   [✓]    [✓]     [✓]     [✓]

  Footer row:
    [Cấp tất cả] hoặc [Xóa tất cả] per column
    [Select preset: Admin Full | Teacher | Student | Librarian]
```

**PermissionMatrix Component Implementation:**
```typescript
interface Permission {
  moduleId: string
  moduleName: string
  actions: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
    approve: boolean
    import: boolean
  }
}

// Render: table với checkbox grid
// UX: click "View" unchecked → auto-check Create/Edit/Delete (depends on view)
// UX: click "Create" → auto-check "View"
// UX: Header checkbox per column → toggle all in column
// UX: Row checkbox → toggle all in row

// Presets:
const presets = {
  admin: { /* all true */ },
  teacher: { /* LMS teacher perms */ },
  student: { /* read-only learning */ },
  librarian: { /* library full */ }
}
```

**API:**
- `GET /api/admin/roles`
- `POST /api/admin/roles`
- `PUT /api/admin/roles/{id}`
- `DELETE /api/admin/roles/{id}`
- `GET /api/admin/permissions` → all available permissions

**Deliverables:**
- [ ] Permission matrix grid render đúng (14 rows × 7 cols)
- [ ] Checkbox toggle per cell
- [ ] "Cấp tất cả" per column/row
- [ ] Preset buttons (fill preset values)
- [ ] Save role + permissions → toast
- [ ] System roles: không thể xóa, có badge

---

## TASK G-3: Cơ cấu tổ chức (SCR-10-020)

**Route:** `app/(dashboard)/admin/organization/page.tsx`

**Layout:**
```
[PageHeader: "Cơ cấu tổ chức"]
  Actions: [+ Thêm đơn vị gốc] [Xuất cơ cấu]

[2-panel]
Left (tree view - 1/3):
  [OrgTree.tsx — @dnd-kit/sortable tree]
  Mỗi node:
    [≡ drag] [icon loại] [Tên đơn vị] [badge loại] [✏️] [🗑] [+ Con]

  Node types với icon:
    🏫 Trường | 🏢 Phòng ban | 👥 Khối lớp | 📚 Lớp học | 👤 Nhóm

Right (detail panel - 2/3):
  [Card: Chi tiết đơn vị đang chọn]
  [FormField: Tên đơn vị]
  [FormField: Mã đơn vị]
  [FormField: Loại]           Select
  [FormField: Trưởng đơn vị]  user picker
  [FormField: Mô tả]
  [Danh sách thành viên: DataTable với add/remove]
  [Lưu thay đổi]
```

**Tree CRUD operations:**
- Add node: inline click [+ Con] → inline input
- Edit node: click [✏️] → edit panel bên phải
- Delete node: click [🗑] → ConfirmDialog (cảnh báo nếu có con)
- Drag-drop: reorder trong cùng level hoặc chuyển parent

**API:**
- `GET /api/admin/org` → tree structure
- `POST /api/admin/org` → add node
- `PUT /api/admin/org/{id}`
- `DELETE /api/admin/org/{id}`
- `PUT /api/admin/org/reorder`

**Deliverables:**
- [ ] Tree render đúng với nhiều levels
- [ ] Drag-drop reorder
- [ ] Add/Edit/Delete inline
- [ ] Detail panel cho node đang chọn
- [ ] Delete cảnh báo khi có children

---

## TASK G-4: Cấu hình hệ thống (SCR-10-030)

**Route:** `app/(dashboard)/admin/settings/page.tsx`

**Layout:**
```
[PageHeader: "Cài đặt hệ thống"]

[Tabs: Thông tin trường | Năm học | Thông báo | Bảo mật | Hiển thị]

[Tab: Thông tin trường]
  [FormField: Tên trường*]         AppInput
  [FormField: Tên trường viết tắt] AppInput
  [FormField: Logo trường]         ImageUpload (preview)
  [FormField: Logo banner]         ImageUpload
  [FormField: Địa chỉ]
  [FormField: Email liên hệ]
  [FormField: Số điện thoại]
  [FormField: Website]

[Tab: Năm học]
  [FormField: Năm học hiện tại*]   AppInput (vd: 2025-2026)
  [FormField: Học kỳ hiện tại*]    Select: HK1 | HK2
  [FormField: Ngày khai giảng]     DatePicker
  [FormField: Ngày kết thúc]       DatePicker
  [Button: Tạo năm học mới]

[Tab: Thông báo]
  [Switch: Bật thông báo push]
  [Switch: Bật thông báo email]
  [FormField: Email admin nhận báo cáo lỗi]
  [Switch: Thông báo khi có HS quá hạn thư viện]
  [Switch: Thông báo điểm danh vắng]

[Tab: Bảo mật]
  [FormField: Session timeout (phút)]     number
  [FormField: Số lần đăng nhập sai tối đa] number
  [FormField: Thời gian khóa tài khoản (phút)]
  [Switch: Bắt buộc 2FA cho QTHT]
  [Switch: Bắt buộc đổi mật khẩu mỗi {n} ngày]

[Tab: Hiển thị]
  [Select: Ngôn ngữ mặc định]
  [Select: Timezone]
  [Select: Định dạng ngày]
  [FormField: Số items mỗi trang mặc định]

[Actions: [Khôi phục mặc định] [Lưu cài đặt]]
```

**API:**
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

**Deliverables:**
- [ ] 5 tabs settings
- [ ] Logo upload với preview
- [ ] Save + toast
- [ ] Restore defaults với confirm dialog

---

## TASK G-5: Audit Log (SCR-10-040)

**Route:** `app/(dashboard)/admin/audit-log/page.tsx`

**Layout:**
```
[PageHeader: "Nhật ký hệ thống (Audit Log)"]
  Actions: [Xuất Excel] [Xóa log cũ (>90 ngày)]

[FilterBar]
  - DateRangePicker (required, default: 7 ngày qua)
  - Select: Người dùng (searchable)
  - Select: Loại hành động (nhóm):
      Auth: Đăng nhập | Đăng xuất | Đổi mật khẩu
      User: Tạo | Sửa | Xóa | Khóa
      Role: Gán vai trò | Thu hồi
      Data: Tạo | Sửa | Xóa | Export | Import
      System: Cấu hình | Backup | Integration
  - Select: Module (All | LMS | Exam | AI | Library | Admin)
  - Select: Kết quả (All | Success | Failed)

[DataTable columns:]
  - Thời gian (sortable, default DESC)
  - Người dùng (avatar + tên)
  - Hành động (badge màu theo severity)
  - Module (badge)
  - Đối tượng (tên + ID ngắn gọn)
  - IP Address
  - Thiết bị/Browser
  - Kết quả (badge: Success=green | Failed=red)
  [Row click → DetailDrawer]

[DetailDrawer: "Chi tiết log"]
  Tất cả trường đầy đủ
  [Before state] JSON diff view (nếu là update action)
  [After state]
  Formatted JSON trong <pre> với syntax highlighting
```

**API:**
- `GET /api/admin/audit-log?from={}&to={}&userId={}&action={}&module={}&result={}`
- `DELETE /api/admin/audit-log/cleanup` → xóa log cũ

**Deliverables:**
- [ ] Filter đầy đủ
- [ ] DataTable sortable
- [ ] DetailDrawer với JSON diff
- [ ] Export Excel
- [ ] Cleanup old logs với confirm

---

## TASK G-6: Quản lý tích hợp API (SCR-10-050)

**Route:** `app/(dashboard)/admin/integrations/page.tsx`

**Layout:**
```
[PageHeader: "Tích hợp & API"]

[Card grid 2 cols:]

[IntegrationCard: "HUE-S Portal SSO"]
  [Logo HUE-S]
  Status badge: Đã kết nối | Chưa kết nối
  Mô tả: "Đăng nhập tập trung qua portal HUE-S"
  Lần kiểm tra cuối: timestamp
  [Button: Cấu hình] [Button: Test kết nối]

[IntegrationCard: "GDĐT — LGSP/NGSP"]
  Logo GDĐT
  Status badge
  Mô tả: "Đồng bộ danh sách lớp, học sinh từ GDĐT"
  [Button: Cấu hình] [Button: Đồng bộ ngay]

[IntegrationCard: "Email SMTP"]
  Status badge
  Provider: (host đang dùng)
  [Button: Cấu hình] [Button: Test gửi]

[IntegrationCard: "Storage (S3/Local)"]
  Status badge
  Provider: Local | S3 | MinIO
  Dung lượng đã dùng / Tổng
  [Button: Cấu hình]

[Dành cho mở rộng tương lai: thêm integrations ở đây]
```

**Config Form (mỗi integration — Dialog):**

HUE-S SSO:
```
[FormField: Client ID*]
[FormField: Client Secret*]    masked
[FormField: Issuer URL*]       (OIDC discovery)
[FormField: Callback URL]      readonly (auto-generated)
[Button: Test OAuth flow]
```

GDĐT:
```
[FormField: API Endpoint*]
[FormField: API Key*]          masked
[FormField: Mã đơn vị*]
[FormField: Năm học sync*]
[Button: Test kết nối]
```

**API:**
- `GET /api/admin/integrations`
- `PUT /api/admin/integrations/{provider}`
- `POST /api/admin/integrations/{provider}/test`

**Deliverables:**
- [ ] 4 integration cards với status
- [ ] Config dialog mỗi integration
- [ ] Test connection hiển thị result inline
- [ ] Status auto-refresh sau test

---

## Phase 8 — Definition of Done

### User Management
- [ ] SCR-10-001: DataTable users với tất cả filters
- [ ] SCR-10-001: Bulk actions (lock/unlock/delete)
- [ ] SCR-10-001: Bulk password/status qua Excel (dialog)
- [ ] SCR-10-002: Form thêm user với validation
- [ ] SCR-10-003: Import Excel 3 bước
- [ ] SCR-10-004: Sửa user pre-fill đúng
- [ ] SCR-10-005: Modal gán vai trò (checkbox)
- [ ] SCR-10-005b: Modal đổi mật khẩu (strength indicator)

### Role & Permissions
- [ ] SCR-10-010: Danh sách vai trò (badge system/custom)
- [ ] SCR-10-011: Permission matrix render đúng (14×7)
- [ ] SCR-10-011: Toggle per cell, per row, per column
- [ ] SCR-10-011: Preset buttons hoạt động
- [ ] SCR-10-011: System roles không xóa được

### Organization
- [ ] SCR-10-020: Tree view render đúng multi-level
- [ ] SCR-10-020: CRUD inline
- [ ] SCR-10-020: Drag-drop reorder

### System Config
- [ ] SCR-10-030: 5 tabs settings save/load
- [ ] SCR-10-030: Logo upload + preview

### Audit & Integrations
- [ ] SCR-10-040: Audit log filter + DetailDrawer với JSON diff
- [ ] SCR-10-050: 4 integration cards + config + test

### Technical
- [ ] `npm run build` clean
- [ ] `npm run type-check` 0 errors
- [ ] Permission matrix: không có logic bug khi toggle

## Thời gian ước tính: 3–5 ngày
