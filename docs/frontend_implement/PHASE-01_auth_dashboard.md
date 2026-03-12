---
title: "Phase 1 — Auth & Dashboard"
phase: 1
agent: "Agent A (auth) + Agent B (dashboard)"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-01-001
  - SCR-01-002
  - SCR-01-003
  - SCR-01-004
  - SCR-01-005
  - SCR-01-006
  - SCR-02-010
  - SCR-02-011
  - SCR-02-012
wireframes: ["WF-01", "WF-02 (kết nối GDĐT)"]
estimated_days: "3–4 ngày"
---

# Phase 1 — Auth & Dashboard

> ✅ Có thể chạy **SONG SONG** với Phase 2–8 sau khi Phase 0 hoàn thành.
>
> Agent A và Agent B có thể làm đồng thời (không phụ thuộc nhau).

## Phạm vi files

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   └── page.tsx                    # Role-based dashboard
│   ├── unauthorized/
│   │   └── page.tsx
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SSOButton.tsx
│   │   │   └── AuthError.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── types/
│   │       └── auth.types.ts
│   └── dashboard/
│       ├── components/
│       │   ├── AdminDashboard.tsx
│       │   ├── TeacherDashboard.tsx
│       │   ├── StudentDashboard.tsx
│       │   ├── RecentActivity.tsx
│       │   └── QuickShortcuts.tsx
│       ├── hooks/
│       │   ├── useDashboardSummary.ts
│       │   └── useDashboardCharts.ts
│       ├── api/
│       │   └── dashboard.api.ts
│       └── types/
│           └── dashboard.types.ts
└── middleware.ts
```

---

## AGENT A — Feature: Auth

### Task A-1: Setup Authentication Infrastructure

**Việc cần làm:**

**1. Cấu hình next-auth v5 (`src/lib/auth.ts`):**
```typescript
// Provider: HUE-S OAuth2/OIDC
// Endpoints: lấy từ .env
//   HUES_CLIENT_ID
//   HUES_CLIENT_SECRET
//   HUES_ISSUER (discovery URL hoặc manual)
// Callbacks:
//   jwt: enrich token với { role, unitId, huesId }
//   session: map jwt → session.user
// Pages:
//   signIn: '/login'
//   error: '/login?error=...'
```

**2. Route handler (`src/app/api/auth/[...nextauth]/route.ts`):**
```typescript
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

**3. Middleware (`src/middleware.ts`):**
```typescript
// Matcher: ['/(dashboard)/:path*']
// Check: có session → proceed
// Không có session → redirect /login
// Role check: nếu cần quyền đặc biệt → /unauthorized
```

**4. Environment variables (.env.local):**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
HUES_CLIENT_ID=...
HUES_CLIENT_SECRET=...
HUES_ISSUER=https://sso.hue.edu.vn
```

**Deliverables:**
- [ ] next-auth cấu hình, route handler tạo xong
- [ ] Middleware protect routes đúng
- [ ] Env vars documented trong `.env.example`

---

### Task A-2: SCR-01-001 — Trang đăng nhập SSO HUE-S

**Route:** `src/app/(auth)/login/page.tsx`

**Layout (theo WF-01, SCR-01-001):**
```
[Full-page background — brand gradient hoặc ảnh trường]
┌─────────────────────────────────────────┐
│  [Logo: THPT Quốc Học Huế - SVG/PNG]   │
│  [Tên trường - heading 2xl]             │
│  ─────────────────────────────────      │
│  [🏛️ Đăng nhập qua HUE-S Portal]       │  ← Primary button, full width
│                                         │
│  ── hoặc đăng nhập nội bộ ──           │
│                                         │
│  [👤 Tên đăng nhập]                    │
│  [🔒 Mật khẩu]              [👁️]       │
│  [   Đăng nhập   ]                     │  ← Submit button
│                                         │
│  [Quên mật khẩu?]                      │
└─────────────────────────────────────────┘
[Footer: © 2026 THPT Quốc Học Huế]
```

**Components dùng:**
- `AppButton` (loading state khi đang redirect/submit)
- `AppInput` (username, password với show/hide toggle)
- shadcn `Card`, `Separator`
- Logo image (từ `/public/logo.svg`)

**State & Behavior:**
```typescript
// State:
// - isSSO loading: khi click HUE-S button
// - form loading: khi submit form nội bộ
// - error message: từ URL params (?error=Credentials)

// HUE-S button: signIn('hues', { callbackUrl: '/dashboard' })
// Form submit: signIn('credentials', { username, password, callbackUrl: '/dashboard' })
```

**Validation (zod):**
```typescript
const loginSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập tối thiểu 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})
```

**Error handling:**
- `?error=Credentials` → "Tên đăng nhập hoặc mật khẩu không đúng"
- `?error=AccessDenied` → "Tài khoản không có quyền truy cập"
- Network error → toast lỗi

**Deliverables:**
- [ ] Layout đúng theo WF-01-001 (centered card, brand background)
- [ ] SSO button click → redirect HUE-S portal (không lỗi)
- [ ] Form submit với credentials hợp lệ → redirect /dashboard
- [ ] Form submit sai → hiển thị error message phù hợp
- [ ] Loading spinner trên button khi đang xử lý
- [ ] Show/hide password toggle
- [ ] Enter key submit form
- [ ] Responsive: card đầy đủ trên mobile (max-w-md, mx-auto)

---

### Task A-3: SCR-01-002 — SSO Callback/Redirect

**Được xử lý tự động bởi next-auth. Tuy nhiên cần custom:**

**Callback behavior (`src/lib/auth.ts`):**
```typescript
callbacks: {
  async jwt({ token, account, profile }) {
    if (account?.provider === 'hues') {
      // Gọi API nội bộ để lấy role + unitId của user
      const userInfo = await fetchUserRole(profile?.sub)
      token.role = userInfo.role
      token.unitId = userInfo.unitId
    }
    return token
  },
  async session({ session, token }) {
    session.user.role = token.role
    session.user.unitId = token.unitId
    return session
  },
  async redirect({ url, baseUrl }) {
    // Redirect theo role sau khi login
    // admin → /admin/users
    // teacher → /lms/classes
    // student → /my-classes
    // default → /dashboard
    return url.startsWith(baseUrl) ? url : '/dashboard'
  }
}
```

**Deliverables:**
- [ ] JWT token có đầy đủ role, unitId
- [ ] Session.user có role, name, email, avatar
- [ ] Redirect đúng role sau SSO callback

---

### Task A-4: SCR-01-006 — Trang lỗi / Không có quyền

**Route:** `src/app/unauthorized/page.tsx`

**Layout:**
```
[AppShell minimal - không có sidebar]
[EmptyState component]
  Icon: ShieldX (red)
  Title: "Không có quyền truy cập"
  Description: "Bạn không có quyền xem trang này. Liên hệ quản trị viên nếu cần hỗ trợ."
  Action: "Về trang chủ" → href /dashboard
  Secondary: "Đăng xuất" → signOut()
```

**Cũng tạo:**
- `src/app/error.tsx` — Global error boundary
- `src/app/not-found.tsx` — 404 page (EmptyState với "Trang không tìm thấy")

**Deliverables:**
- [ ] /unauthorized hiển thị đúng
- [ ] "Về trang chủ" button link đến /dashboard
- [ ] "Đăng xuất" button gọi signOut
- [ ] 404 page custom

---

### Task A-5: `useAuth` Hook

**File:** `src/features/auth/hooks/useAuth.ts`

```typescript
export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    role: session?.user?.role,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: session?.user?.role === 'admin',
    isTeacher: session?.user?.role === 'teacher',
    isStudent: session?.user?.role === 'student',
    hasRole: (roles: UserRole[]) => roles.includes(session?.user?.role),
    signOut: () => signOut({ callbackUrl: '/login' }),
  }
}
```

**Deliverables:**
- [ ] Hook trả về đúng user info
- [ ] `hasRole` check đúng
- [ ] signOut hoạt động

---

## AGENT B — Feature: Dashboard

### Task B-1: Dashboard Data Layer

**API hooks (`src/features/dashboard/api/dashboard.api.ts`):**

```typescript
// GET /api/dashboard/admin/summary
// → { students: number, classes: number, attendanceToday: number, booksOnLoan: number }

// GET /api/dashboard/teacher/summary (userId)
// → { teachingClasses: number, studentsNeedHelp: number, pendingAssignments: number }

// GET /api/dashboard/student/summary (userId)
// → { enrolledClasses: number, upcomingDeadlines: number, avgScore: number }

// GET /api/dashboard/charts/attendance-7days
// → { dates: string[], values: number[] }

// GET /api/dashboard/charts/class-students
// → { classes: string[], counts: number[] }

// GET /api/dashboard/activity
// → Activity[]  (5 items gần nhất)
```

**TanStack Query hooks (`src/features/dashboard/hooks/`):**
```typescript
// useDashboardSummary(role) — staleTime 5min
// useDashboardCharts() — staleTime 10min
// useRecentActivity() — staleTime 1min
```

**Types:**
```typescript
interface AdminSummary {
  students: number
  classes: number
  attendanceToday: number       // percentage 0-100
  booksOnLoan: number
  studentsDelta?: number
  classesDelta?: number
}

interface Activity {
  id: string
  type: 'login' | 'submission' | 'attendance' | 'borrow'
  description: string
  timestamp: string
  user?: { name: string; avatar?: string }
}
```

**Deliverables:**
- [ ] API hooks tạo xong với types đầy đủ
- [ ] Suspense/loading states handle đúng
- [ ] Error handling với toast notification

---

### Task B-2: SCR-01-003 — Dashboard Admin/CBQL

**Route:** `src/app/(dashboard)/page.tsx` (conditional render theo role)
**Component:** `src/features/dashboard/components/AdminDashboard.tsx`

**Layout (theo WF-01, SCR-01-003):**
```
[PageHeader]
  Title: "Tổng quan hệ thống"
  Subtitle: "Thứ X, DD/MM/YYYY"
  Actions: [Xuất báo cáo]

[StatGrid cols=4]
  [StatCard: Tổng học sinh      (icon: Users,   module=lms)]
  [StatCard: Lớp đang hoạt động (icon: BookOpen, module=lms)]
  [StatCard: Điểm danh hôm nay  (icon: Camera,  module=ai, unit="%")]
  [StatCard: Sách đang mượn     (icon: Library, module=library)]

[Row 2 - grid 2 cols]
  [ChartCard: "Học sinh theo lớp"  — bar chart (ECharts)]
  [ChartCard: "Điểm danh 7 ngày"  — line chart (ECharts)]

[Row 3 - grid 2 cols]
  [Card: "Hoạt động gần đây"       — list 5 activities + "Xem tất cả"]
  [Card: "Truy cập nhanh"          — icon grid shortcuts]
```

**Quick Shortcuts (grid 3×2):**
```
[📚 Quản lý lớp học]  [👤 Người dùng]  [📷 Điểm danh]
[📝 Ngân hàng câu hỏi] [📖 Thư viện]  [⚙️ Cài đặt]
```

**ECharts configs:**

Bar chart — Học sinh theo lớp:
```javascript
{
  tooltip: { trigger: 'axis' },
  xAxis: { data: ['10A1','10A2','11B1',...] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [...], color: 'var(--color-lms)' }]
}
```

Line chart — Điểm danh 7 ngày:
```javascript
{
  tooltip: { trigger: 'axis' },
  xAxis: { data: ['T2','T3','T4','T5','T6','T7','CN'] },
  yAxis: { max: 100, axisLabel: { formatter: '{value}%' } },
  series: [{ type: 'line', smooth: true, data: [...] }]
}
```

**Deliverables:**
- [ ] Render 4 StatCards với dữ liệu real (loading skeleton → data)
- [ ] Bar chart và Line chart hiển thị đúng
- [ ] Recent activity list 5 items
- [ ] Quick shortcuts links đúng route
- [ ] Responsive: 4 cols → 2 cols (tablet) → 1 col (mobile)
- [ ] Export button (placeholder, hoặc CSV từ summary data)
- [ ] Màu cards đúng theo module

---

### Task B-3: SCR-01-004 — Dashboard Giáo viên

**Component:** `src/features/dashboard/components/TeacherDashboard.tsx`

**Layout (theo WF-01, SCR-01-004):**
```
[PageHeader]
  Title: "Xin chào, [Tên giáo viên]"
  Subtitle: "Thứ X, DD/MM/YYYY"

[StatGrid cols=3]
  [StatCard: Lớp đang dạy      (module=lms)]
  [StatCard: HS cần hỗ trợ     (variant=warning nếu >0)]
  [StatCard: Bài tập chờ chấm  (variant=warning nếu >0)]

[Row 2 - grid 2 cols]
  [Card: "Lớp học của tôi"     — list 5 lớp gần đây + link + progress]
  [Card: "Thông báo hệ thống"  — list 5 thông báo + timestamps]

[Card: "Bài tập sắp hết hạn"  — table: tên bài tập | lớp | hạn nộp | số chưa nộp]
```

**Lớp học list item:**
```
[ClassAvatar]  [Tên lớp - học kỳ]  [Progress bar tiến độ HS%]  [Xem lớp →]
```

**Deliverables:**
- [ ] Render khác với admin dashboard
- [ ] 3 StatCards teacher-specific
- [ ] Lớp học list với progress
- [ ] Bài tập hết hạn table
- [ ] Links đúng → /lms/classes/[id]

---

### Task B-4: SCR-01-005 — Dashboard Học sinh

**Component:** `src/features/dashboard/components/StudentDashboard.tsx`

**Layout (theo WF-01, SCR-01-005):**
```
[PageHeader]
  Title: "Chào [Tên học sinh]!"
  Subtitle: "[Lớp học — Năm học]"

[StatGrid cols=3]
  [StatCard: Lớp đang học       (module=lms)]
  [StatCard: Bài tập sắp hạn    (variant=warning nếu có)]
  [StatCard: Điểm TB tháng này  (module=exam)]

[Row 2 - grid 2 cols]
  [Card: "Lịch học tuần này"    — timeline view (7 ngày)]
  [Card: "Bài tập của tôi"      — list tab: Chưa nộp | Sắp hết hạn]

[Card: "Thông báo từ lớp học"   — list 5 thông báo mới nhất]
```

**Timeline học tuần:**
```
T2 | T3 | T4 | T5 | T6 | T7
[Lớp Toán 10A1] [Lớp Lý 10A1] ...
```

**Deliverables:**
- [ ] Render đúng theo role student
- [ ] 3 StatCards student-specific
- [ ] Bài tập tabs (Chưa nộp / Sắp hết hạn)
- [ ] Timeline tuần hiển thị
- [ ] Links → /my-classes/[id]

---

### Task B-5: Role-based Dashboard Routing

**File:** `src/app/(dashboard)/page.tsx`

```typescript
import { getServerSession } from 'next-auth'
import { auth } from '@/lib/auth'
import AdminDashboard from '@/features/dashboard/components/AdminDashboard'
import TeacherDashboard from '@/features/dashboard/components/TeacherDashboard'
import StudentDashboard from '@/features/dashboard/components/StudentDashboard'

export default async function DashboardPage() {
  const session = await auth()

  switch (session?.user?.role) {
    case 'admin':
    case 'principal':
      return <AdminDashboard />
    case 'teacher':
      return <TeacherDashboard />
    case 'student':
      return <StudentDashboard />
    default:
      redirect('/unauthorized')
  }
}
```

**Deliverables:**
- [ ] Admin role → AdminDashboard
- [ ] Teacher role → TeacherDashboard
- [ ] Student role → StudentDashboard
- [ ] Unknown role → /unauthorized

---

### Task B-6: GDĐT Kết nối (SCR-02-010 đến 02-012)

> Các màn hình kết nối GDĐT được assign vào Phase 1 vì phụ thuộc auth + được truy cập từ dashboard shortcuts

**Routes:**
- `src/app/(dashboard)/gddt/config/page.tsx` — SCR-02-010
- `src/app/(dashboard)/gddt/sync/page.tsx` — SCR-02-011
- `src/app/(dashboard)/gddt/history/page.tsx` — SCR-02-012

**SCR-02-010 — Cấu hình kết nối GDĐT:**
```
[PageHeader: "Kết nối GDĐT" breadcrumb=GDĐT>Cấu hình]

[Card: Thông tin kết nối LGSP/NGSP]
  [FormField: Endpoint URL]     input
  [FormField: API Key]          password input + show/hide
  [FormField: Mã đơn vị]        input
  [FormField: Năm học]          select
  [AppButton: Test kết nối]     → gọi API test, hiển thị badge Thành công/Lỗi
  [AppButton: Lưu cấu hình]     primary
```

**State:** Loading khi test kết nối, success/error badge inline

**SCR-02-011 — Kích hoạt đồng bộ:**
```
[PageHeader: "Đồng bộ GDĐT" actions=[Xem lịch sử]]

[Card: Trạng thái đồng bộ]
  [Badge: Lần cuối đồng bộ: DD/MM/YYYY HH:mm]
  [Badge: Trạng thái: Thành công / Đang chạy / Lỗi]

[Card: Tùy chọn đồng bộ]
  [Checkbox: Đồng bộ danh sách lớp]
  [Checkbox: Đồng bộ học sinh]
  [Checkbox: Đồng bộ giáo viên]
  [Checkbox: Đồng bộ điểm học bổng]

[AppButton: Bắt đầu đồng bộ]   (primary, large)
  → Khi click: confirm dialog → gọi API → hiển thị progress
  → Progress bar với step description
  → Done: toast success + redirect history
```

**SCR-02-012 — Lịch sử đồng bộ / Log:**
```
[PageHeader: "Lịch sử đồng bộ"]
[FilterBar: date range + status select]
[DataTable columns:]
  - Thời gian bắt đầu
  - Thời gian kết thúc
  - Loại đồng bộ
  - Trạng thái (badge: Thành công/Lỗi/Đang chạy)
  - Số bản ghi
  - Hành động (Xem chi tiết)
[DetailDrawer: Chi tiết log — full log text trong <pre> block]
```

**API:**
- `GET /api/gddt/config` → current config
- `PUT /api/gddt/config` → save config
- `POST /api/gddt/config/test` → { success, message }
- `POST /api/gddt/sync` → { jobId }
- `GET /api/gddt/sync/status/:jobId` → { status, progress, steps }
- `GET /api/gddt/sync/history` → PaginatedResponse\<SyncLog\>
- `GET /api/gddt/sync/history/:id` → SyncLog with full log

**Deliverables:**
- [ ] Form cấu hình lưu/tải đúng
- [ ] Test kết nối hiển thị result inline
- [ ] Đồng bộ: progress bar real-time (polling hoặc SSE)
- [ ] History table + filter
- [ ] DetailDrawer log đọc được

---

## Phase 1 — Definition of Done

### Auth (Agent A)
- [ ] Đăng nhập SSO HUE-S end-to-end thành công (redirect → callback → dashboard)
- [ ] Đăng nhập nội bộ (credentials) hoạt động
- [ ] Role-based redirect sau login (admin/teacher/student khác nhau)
- [ ] Session persist sau hard refresh
- [ ] Logout: xóa session + redirect /login
- [ ] Middleware block unauthenticated access đúng
- [ ] /unauthorized page hiển thị đúng
- [ ] useAuth hook trả về đúng data

### Dashboard (Agent B)
- [ ] 3 dashboard variants (Admin/Teacher/Student) render theo role
- [ ] StatCards load data thực từ API (không hardcode)
- [ ] Charts render đúng (không blank, không console error)
- [ ] Loading skeletons xuất hiện trong khi fetch
- [ ] Error states hiển thị khi API fail
- [ ] GDĐT config/sync/history pages hoạt động
- [ ] Quick shortcuts links đúng routes
- [ ] Mobile responsive layout (tất cả 3 dashboards)

### Technical
- [ ] `npm run build` — success
- [ ] `npm run type-check` — 0 errors
- [ ] No console errors khi chạy dev
- [ ] Page load < 3s (LCP)

## Thời gian ước tính: 3–4 ngày

| Agent | Tasks | Estimated |
|-------|-------|-----------|
| Agent A | A-1 + A-2 + A-3 + A-4 + A-5 | 1.5–2 ngày |
| Agent B | B-1 + B-2 + B-3 + B-4 + B-5 + B-6 | 2–3 ngày |
