---
title: "Skeleton Folder Structure — QHUE Web Frontend"
stack: "Next.js 15 + Tailwind CSS + shadcn/ui"
updated: "2026-03-11"
---

# 🗂️ Skeleton Folder Structure — QHUE Web Frontend

> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui
> **Nguyên tắc thiết kế:**
> - Components kế thừa theo 4 cấp từ thấp → cao
> - Mỗi feature cluster **độc lập hoàn toàn** → nhiều agent làm song song
> - Docker tách biệt prod / dev environment

---

## 📁 Cây thư mục đầy đủ

```
qhue-web/
│
├── 🐳 Docker & Scripts
│   ├── Dockerfile                   # Production multi-stage build
│   ├── Dockerfile.dev               # Development với hot-reload
│   ├── docker-compose.yml           # Production
│   ├── docker-compose.dev.yml       # Development + volume mounts
│   ├── .dockerignore
│   └── scripts/
│       ├── start.sh                 # Prod: check image → auto build → up
│       ├── stop.sh                  # Prod: down
│       ├── start_dev.sh             # Dev:  check image → auto build → up
│       └── stop_dev.sh              # Dev:  down
│
├── ⚙️ Config
│   ├── next.config.ts
│   ├── tailwind.config.ts           # ← paste từ design_token/08
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── .env.example
│   ├── .env.local                   # gitignored
│   ├── .eslintrc.json
│   └── .prettierrc
│
├── public/
│   └── fonts/                       # Self-hosted fonts (Lexend, Source Sans 3)
│
└── src/
    ├── app/                         # Next.js App Router
    ├── components/                  # Component hierarchy (4 levels)
    ├── features/                    # Agent-parallel feature clusters
    ├── lib/                         # Utilities, API client
    ├── hooks/                       # Global shared hooks
    ├── stores/                      # Global Zustand stores
    ├── types/                       # Global TypeScript types
    └── styles/                      # Global CSS, design tokens
```

---

## 🔀 App Router — `src/app/`

```
src/app/
│
├── layout.tsx                       # Root layout (fonts, providers)
├── not-found.tsx
│
├── (auth)/                          # Auth group — public, no AppShell
│   └── login/
│       └── page.tsx                 # SSO HUE-S login
│
├── (dashboard)/                     # Protected group — with AppShell
│   ├── layout.tsx                   # AppShell wrapper (Sidebar + Navbar)
│   ├── page.tsx                     # Dashboard tổng quan BGH
│   │
│   ├── lms/                         # ── CLUSTER: Học tập ──
│   │   ├── layout.tsx               # LMS sub-layout (breadcrumb context)
│   │   ├── page.tsx                 # LMS home
│   │   ├── classes/
│   │   │   ├── page.tsx             # Danh sách lớp học
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Chi tiết lớp
│   │   │       ├── content/page.tsx # Quản lý nội dung
│   │   │       └── results/page.tsx # Kết quả học tập
│   │   └── offline/page.tsx         # Buổi học offline
│   │
│   ├── exam/                        # ── CLUSTER: Thi & Kiểm tra ──
│   │   ├── page.tsx
│   │   ├── questions/               # Ngân hàng câu hỏi
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── sessions/                # Ca thi
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   │
│   ├── ai-attendance/               # ── CLUSTER: AI Điểm danh ──
│   │   ├── page.tsx
│   │   ├── monitor/page.tsx         # Camera live / điểm danh realtime
│   │   ├── devices/page.tsx         # Quản lý thiết bị
│   │   ├── faces/page.tsx           # Dữ liệu khuôn mặt HS
│   │   └── reports/page.tsx         # Báo cáo vào/ra
│   │
│   ├── library/                     # ── CLUSTER: Thư viện số ──
│   │   ├── page.tsx
│   │   ├── catalog/page.tsx         # Quản lý tài liệu
│   │   ├── circulation/page.tsx     # Mượn / Trả / Gia hạn
│   │   ├── readers/page.tsx         # Hồ sơ bạn đọc
│   │   └── portal/page.tsx          # OPAC tra cứu công khai
│   │
│   └── admin/                       # ── CLUSTER: Quản trị ──
│       ├── page.tsx
│       ├── users/page.tsx
│       ├── roles/page.tsx
│       └── settings/page.tsx
│
└── api/
    ├── auth/[...nextauth]/route.ts  # next-auth SSO handler
    └── health/route.ts              # Health check cho Docker
```

---

## 🧩 Component Hierarchy — `src/components/`

> **Quy tắc kế thừa:** cấp cao DÙNG cấp thấp, **không bao giờ ngược lại**.
> Agent chỉ cần biết cấp mình dùng — không cần hiểu cấp dưới.

```
src/components/
│
├── ui/                              # ══ LEVEL 0 — shadcn/ui primitives ══
│   │                                # Auto-generated bằng CLI, KHÔNG sửa tay
│   ├── button.tsx                   # npx shadcn@latest add button
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── ...                          # thêm bằng CLI khi cần
│
├── base/                            # ══ LEVEL 1 — Brand-aware wrappers ══
│   │                                # Áp design token, thêm variant hệ thống
│   │                                # EXTENDS: ui/
│   ├── app-button/                  # + loading state, module color, min 44px
│   ├── app-input/                   # + label, error msg, helper text, required
│   ├── app-badge/                   # + role variant, semantic variant
│   ├── app-avatar/                  # + role color ring, initials fallback
│   ├── app-select/                  # + label, error, searchable
│   └── app-textarea/                # + label, error, char count
│
├── composite/                       # ══ LEVEL 2 — Combined components ══
│   │                                # Kết hợp nhiều base components
│   │                                # EXTENDS: base/ + ui/
│   ├── page-header/                 # Breadcrumb + H1 + Action buttons
│   ├── stat-card/                   # Icon + Value + Delta badge + module accent
│   ├── form-field/                  # AppInput + validation wrapper
│   ├── search-bar/                  # AppInput + debounce + clear button
│   ├── confirm-dialog/              # Dialog + message + Confirm/Cancel buttons
│   ├── empty-state/                 # Illustration + message + CTA button
│   └── user-menu/                   # Avatar + name + role badge + dropdown
│
├── patterns/                        # ══ LEVEL 3 — Full UI patterns ══
│   │                                # Các pattern tái sử dụng toàn hệ thống
│   │                                # EXTENDS: composite/ + base/ + ui/
│   ├── data-table/                  # Search + Sort + Paginate + Export + Bulk
│   ├── crud-page/                   # PageHeader + DataTable + Dialogs liên kết
│   ├── detail-drawer/               # Slide-in panel xem chi tiết record
│   ├── filter-bar/                  # Multi-filter: date range + select + search
│   ├── stat-grid/                   # Grid 2-4 cột StatCard có responsive
│   ├── chart-card/                  # Card wrapper cho ECharts
│   └── import-stepper/              # 3-step: Upload → Preview → Confirm
│
└── layout/                          # ══ LAYOUT — App Shell ══
    │                                # Độc lập, không extend component khác
    ├── app-shell/                   # Root wrapper: Navbar + Sidebar + Main
    ├── navbar/                      # Fixed top 64px: logo + toggle + user menu
    └── sidebar/                     # Fixed left: collapsible 256px ↔ 64px
                                     # Active color theo module accent token
```

### Sơ đồ kế thừa

```
shadcn/ui (Level 0)
    ↓ wraps
Base Components (Level 1)        ← design tokens applied
    ↓ composes
Composite Components (Level 2)   ← UX logic added
    ↓ assembles into
Pattern Components (Level 3)     ← full reusable page sections
    ↓ used by
Feature Components               ← inside features/, specific to domain
```

---

## 🏝️ Feature Clusters — `src/features/`

> **Nguyên tắc agent-parallel:**
> - Mỗi cluster = 1 thư mục **hoàn toàn độc lập**
> - Agent A làm `features/lms/` trong khi Agent B làm `features/library/` → **zero conflict**
> - Import **chỉ** được phép: `@/components/`, `@/lib/`, `@/types/`, `@/hooks/`, `@/stores/`
> - **Cấm** import chéo giữa các feature: `features/lms` không được import từ `features/exam`

```
src/features/
│
├── auth/                            # ── Agent A scope ──
│   ├── components/                  # LoginForm, SSOButton
│   ├── hooks/                       # useSession, usePermission
│   ├── types/index.ts               # AuthUser, Session, Permission
│   └── README.md                    # Scope, routes, dependencies
│
├── dashboard/                       # ── Agent B scope ──
│   ├── components/                  # ModuleCard, ActivityFeed, QuickStats
│   ├── hooks/                       # useDashboardStats
│   ├── api/index.ts                 # GET /dashboard/summary
│   ├── types/index.ts
│   └── README.md
│
├── lms/                             # ── Agent C scope ──
│   ├── components/                  # ClassCard, ContentItem, ScormPlayer
│   ├── hooks/                       # useClasses, useContent, useResults
│   ├── stores/                      # lms.store.ts (Zustand: selectedClass, viewMode)
│   ├── api/index.ts                 # CRUD: /lms/classes, /lms/content
│   ├── types/index.ts               # LmsClass, Content, Result
│   └── README.md
│
├── exam/                            # ── Agent D scope ──
│   ├── components/                  # QuestionCard, ExamTimer, ScoreBoard
│   ├── hooks/                       # useQuestions, useExamSession
│   ├── stores/                      # exam.store.ts
│   ├── api/index.ts
│   ├── types/index.ts               # Question, ExamSession, Score
│   └── README.md
│
├── ai-attendance/                   # ── Agent E scope ──
│   ├── components/                  # CameraFeed, AttendanceRow, HeatmapChart
│   ├── hooks/                       # useAttendanceLive, useAttendanceReport
│   ├── stores/                      # attendance.store.ts
│   ├── api/index.ts
│   ├── types/index.ts               # AttendanceRecord, Device, FaceData
│   └── README.md
│
├── library/                         # ── Agent F scope ──
│   ├── components/                  # BookCard, BorrowForm, ReturnRow
│   ├── hooks/                       # useCatalog, useCirculation
│   ├── stores/                      # library.store.ts
│   ├── api/index.ts
│   ├── types/index.ts               # Book, Reader, BorrowRecord
│   └── README.md
│
└── admin/                           # ── Agent G scope ──
    ├── components/                  # UserForm, RoleMatrix, PermissionToggle
    ├── hooks/                       # useUsers, useRoles
    ├── stores/                      # admin.store.ts
    ├── api/index.ts
    ├── types/index.ts               # AdminUser, Role, Permission
    └── README.md
```

---

## 🔧 Shared Infrastructure — `src/lib/`, `src/hooks/`, `src/stores/`, `src/types/`

```
src/lib/
├── api.ts                           # Base fetch wrapper + error handling
├── auth.ts                          # next-auth config + HUE-S SSO provider
├── utils.ts                         # cn(), formatDate(), formatNumber()
└── query-client.ts                  # TanStack Query global config

src/hooks/
├── use-debounce.ts                  # Debounce value/callback
├── use-local-storage.ts             # Persist state to localStorage
└── use-media-query.ts               # Responsive breakpoint detection

src/stores/
├── ui.store.ts                      # Zustand: sidebarOpen, theme, toast queue
└── auth.store.ts                    # Zustand: currentUser, role, permissions

src/types/
├── index.ts                         # UserRole, User, ApiResponse<T>, Pagination
└── env.d.ts                         # process.env type declarations

src/styles/
├── globals.css                      # Tailwind base + shadcn :root CSS vars
└── fonts.css                        # @font-face self-hosted (nếu dùng)
```

---

## 🐳 Docker & Scripts

### `Dockerfile` — Production (multi-stage)

```
Stage 1: deps      → npm ci --only=production
Stage 2: builder   → npm ci + next build
Stage 3: runner    → copy .next/standalone, chạy node server.js
Port: 3000
User: non-root nextjs:nodejs
```

### `Dockerfile.dev` — Development

```
Base: node:20-alpine
npm install → next dev --turbopack
Port: 3000 (hot-reload qua volume mount)
```

### `docker-compose.yml` — Production

```yaml
services:
  web:
    image: qhue-web:latest          # dùng image đã build
    build: { context: ., dockerfile: Dockerfile }
    ports: ["3000:3000"]
    env_file: .env
    restart: unless-stopped
    healthcheck: GET /api/health
```

### `docker-compose.dev.yml` — Development

```yaml
services:
  web-dev:
    image: qhue-web:dev
    build: { dockerfile: Dockerfile.dev }
    ports: ["3000:3000"]
    volumes:
      - .:/app                       # source code live-sync
      - /app/node_modules            # tránh overwrite node_modules
      - /app/.next                   # tránh overwrite build cache
    env_file: .env.local
```

### `scripts/start.sh` — Logic auto-build

```bash
IMAGE="qhue-web:latest"

# Nếu chưa có image → tự build trước khi up
if [[ "$(docker images -q $IMAGE 2>/dev/null)" == "" ]]; then
  echo "Image not found → building..."
  docker build -t $IMAGE -f Dockerfile .
fi

docker compose -f docker-compose.yml up -d
```

### `scripts/start_dev.sh` — Logic auto-build (dev)

```bash
IMAGE="qhue-web:dev"

if [[ "$(docker images -q $IMAGE 2>/dev/null)" == "" ]]; then
  echo "Dev image not found → building..."
  docker build -t $IMAGE -f Dockerfile.dev .
fi

docker compose -f docker-compose.dev.yml up -d
```

### `scripts/stop.sh` / `scripts/stop_dev.sh`

```bash
docker compose -f docker-compose[.dev].yml down
```

---

## 📦 Dependencies

```
Production:
  next, react, react-dom
  @tanstack/react-table         # DataTable
  @tanstack/react-query         # Server state cache
  react-hook-form + zod         # Forms + validation
  zustand                       # Client state
  echarts + echarts-for-react   # Charts
  next-auth@beta                # SSO HUE-S
  lucide-react                  # Icons (built-in shadcn)
  clsx + tailwind-merge         # cn() utility
  class-variance-authority      # Component variants

Dev:
  typescript
  tailwindcss + tailwindcss-animate
  postcss + autoprefixer
  eslint + eslint-config-next
  prettier + prettier-plugin-tailwindcss
```

---

## 🤖 Agent Assignment Map

| Agent | Feature Scope | Có thể làm song song? |
|-------|-------------|----------------------|
| Agent A | `features/auth/` + `app/(auth)/` | ✅ Hoàn toàn độc lập |
| Agent B | `features/dashboard/` + `app/(dashboard)/page.tsx` | ✅ |
| Agent C | `features/lms/` + `app/(dashboard)/lms/` | ✅ |
| Agent D | `features/exam/` + `app/(dashboard)/exam/` | ✅ |
| Agent E | `features/ai-attendance/` + `app/(dashboard)/ai-attendance/` | ✅ |
| Agent F | `features/library/` + `app/(dashboard)/library/` | ✅ |
| Agent G | `features/admin/` + `app/(dashboard)/admin/` | ✅ |
| Agent H | `components/base/` + `components/composite/` | ✅ Shared, làm trước |
| Agent I | `components/patterns/` + `components/layout/` | ✅ Sau Agent H |

> ⚠️ **Thứ tự ưu tiên:** Agent H (base/composite) → Agent I (patterns/layout) → Agents A–G (features) song song

---

## 🚀 Lệnh khởi động

```bash
# Development (lần đầu hoặc khi chưa có image)
chmod +x scripts/*.sh
./scripts/start_dev.sh        # tự build nếu chưa có image → http://localhost:3000

# Production
./scripts/start.sh            # tự build nếu chưa có image → http://localhost:3000

# Dừng
./scripts/stop_dev.sh
./scripts/stop.sh

# Rebuild bắt buộc (khi thay đổi Dockerfile)
docker rmi qhue-web:dev       # xoá image cũ
./scripts/start_dev.sh        # build lại từ đầu
```

---

## 📋 Checklist trước khi bắt đầu code

- [ ] Copy `docs/design_token/08_tailwind_config.md` → `tailwind.config.ts`
- [ ] Copy CSS vars từ `08_tailwind_config.md` → `src/styles/globals.css`
- [ ] Chạy `npx shadcn@latest init` để scaffold `components/ui/` + cập nhật `globals.css`
- [ ] Tạo `.env.local` từ `.env.example`
- [ ] `chmod +x scripts/*.sh`
- [ ] Agent H làm `components/base/` + `components/composite/` trước
- [ ] Agent I làm `components/patterns/` + `components/layout/` trước
- [ ] Sau đó các Agent feature (A–G) chạy song song

---

*Tham khảo: `docs/design_token/`, `docs/framework_compare.md`, `docs/wireframe/`*
*Cập nhật: 2026-03-11*
