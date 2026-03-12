---
title: "Frontend Implementation Plan — INDEX"
project: "QHUE Web - THPT Quốc Học Huế"
stack: "Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui"
updated: "2026-03-11"
---

# 📋 Frontend Implementation Plan — INDEX

## Tổng quan

| # | File | Phase | Cluster | Agent | Có thể song song? |
|---|------|-------|---------|-------|-------------------|
| 0 | [PHASE-00_shared_components.md](PHASE-00_shared_components.md) | Phase 0 | Shared Components | Agent H+I | ❌ Phải làm TRƯỚC |
| 1 | [PHASE-01_auth_dashboard.md](PHASE-01_auth_dashboard.md) | Phase 1 | Auth + Dashboard | Agent A+B | ✅ Song song với 2-8 |
| 2 | [PHASE-02_gddt_integration.md](PHASE-02_gddt_integration.md) | Phase 2 | GDĐT Integration | Agent C | ✅ Song song |
| 3 | [PHASE-03_lms_class_content.md](PHASE-03_lms_class_content.md) | Phase 3 | LMS – Lớp học & Nội dung | Agent C | ✅ Song song |
| 4 | [PHASE-04_lms_results_exam.md](PHASE-04_lms_results_exam.md) | Phase 4 | LMS – Kết quả, Thi, Kiểm tra | Agent D | ✅ Song song |
| 5 | [PHASE-05_student_learning.md](PHASE-05_student_learning.md) | Phase 5 | Người học – Học tập & Thi | Agent C | ✅ Song song |
| 6 | [PHASE-06_ai_attendance.md](PHASE-06_ai_attendance.md) | Phase 6 | AI Điểm danh | Agent E | ✅ Song song |
| 7 | [PHASE-07_library.md](PHASE-07_library.md) | Phase 7 | Thư viện số | Agent F | ✅ Song song |
| 8 | [PHASE-08_admin.md](PHASE-08_admin.md) | Phase 8 | Quản trị hệ thống | Agent G | ✅ Song song |

## Thứ tự thực hiện

```
Phase 0 — Bước 1 (BẮT BUỘC TRƯỚC NHẤT)
  └── [Gate 1] Docker Infrastructure Dev ổn định
  └── [Gate 2] Homepage render OK tại http://localhost:3000
      ↓ Sau khi Gate 1 + Gate 2 XANH

Phase 0 — Bước 2 (Shared Components ~3-5 ngày)
  └── Agent H: components/base/ + components/composite/
  └── Agent I: components/patterns/ + components/layout/
      ↓ Sau khi Phase 0 hoàn thành

Phase 1–8 (SONG SONG hoàn toàn)
  ├── Agent A+B: Phase 1 (Auth + Dashboard)       ~3-4 ngày
  ├── Agent C:   Phase 2 (GDĐT Integration)        ~3-4 ngày
  ├── Agent C:   Phase 3 (LMS Class + Content)     ~5-7 ngày
  ├── Agent D:   Phase 4 (LMS Results + Exam)      ~5-7 ngày
  ├── Agent C:   Phase 5 (Student Learning)        ~3-4 ngày
  ├── Agent E:   Phase 6 (AI Attendance)           ~4-5 ngày
  ├── Agent F:   Phase 7 (Library)                 ~7-10 ngày
  └── Agent G:   Phase 8 (Admin)                   ~3-4 ngày
```

> **Gate 1 + Gate 2 là điều kiện cứng** — không được bỏ qua.
> Chi tiết checklist: [PHASE-00_shared_components.md — Điều kiện tiên quyết](PHASE-00_shared_components.md#-điều-kiện-tiên-quyết--bắt-buộc-pass-trước-khi-làm-bất-cứ-thứ-gì)

## Tổng số màn hình: ~160 screens

| Phase | Màn hình | Wireframe refs |
|-------|---------|----------------|
| Phase 1 | 8 screens | WF-01 (6) + WF-02-010..012 (3) |
| Phase 2 | 12 screens | WF-02-001..012 |
| Phase 3 | 36 screens | WF-04 (15) + WF-05 (21) |
| Phase 4 | 34 screens | WF-06 (19) + WF-07 (27 — a+b) |
| Phase 5 | 19 screens | WF-03 |
| Phase 6 | 20 screens | WF-08 |
| Phase 7 | ~60 screens | WF-09 |
| Phase 8 | 14 screens | WF-10 |
| **TOTAL** | **~163** | |

## Docker Environments

| Container | Image | Môi trường | Port | Dùng khi |
|-----------|-------|------------|------|---------|
| `frontend-dev` | `frontend-dev:latest` | Development | `3000` | Phát triển, debug, fix code |
| `frontend-prod` | `frontend-prod:latest` | Production | `3000` | Test build prod, deploy |

```bash
# Khởi động dev
./scripts/start_dev.sh          # → container: frontend-dev

# Khởi động prod
./scripts/start.sh              # → container: frontend-prod

# Debug logs
docker logs -f frontend-dev
docker logs -f frontend-prod

# Vào shell dev để chạy lệnh
docker exec -it frontend-dev sh

# Xem trạng thái
docker ps --filter "name=frontend"
```

> Chi tiết đầy đủ: [PHASE-00_shared_components.md — Docker Workflow](PHASE-00_shared_components.md#docker-workflow--debug-dev--fix)

## Cấu trúc thư mục dự án

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx                        # Dashboard (role-based)
│   │   ├── lms/
│   │   │   ├── classes/
│   │   │   ├── content/
│   │   │   ├── results/
│   │   │   └── discussions/
│   │   ├── my-classes/                     # Student view
│   │   ├── exam/
│   │   │   ├── question-bank/
│   │   │   ├── exams/
│   │   │   └── sessions/
│   │   ├── ai-attendance/
│   │   │   ├── cameras/
│   │   │   ├── devices/
│   │   │   ├── faces/
│   │   │   ├── monitor/
│   │   │   ├── reports/
│   │   │   └── analytics/
│   │   ├── library/
│   │   │   ├── settings/
│   │   │   ├── catalog/
│   │   │   ├── readers/
│   │   │   ├── circulation/
│   │   │   └── reports/
│   │   ├── gddt/
│   │   └── admin/
│   │       ├── users/
│   │       ├── roles/
│   │       ├── organization/
│   │       ├── settings/
│   │       ├── audit-log/
│   │       └── integrations/
│   ├── library-portal/                     # Public portal
│   │   ├── page.tsx
│   │   ├── news/[slug]/page.tsx
│   │   └── opac/
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── unauthorized/page.tsx
├── components/
│   ├── ui/                                 # Level 0: shadcn primitives
│   ├── base/                               # Level 1: brand-aware wrappers
│   │   ├── app-button/
│   │   ├── app-input/
│   │   ├── app-badge/
│   │   ├── app-avatar/
│   │   ├── app-select/
│   │   └── app-textarea/
│   ├── composite/                          # Level 2: combined components
│   │   ├── page-header/
│   │   ├── stat-card/
│   │   ├── form-field/
│   │   ├── search-bar/
│   │   ├── confirm-dialog/
│   │   ├── empty-state/
│   │   └── user-menu/
│   ├── patterns/                           # Level 3: full patterns
│   │   ├── data-table/
│   │   ├── crud-page/
│   │   ├── detail-drawer/
│   │   ├── filter-bar/
│   │   ├── stat-grid/
│   │   ├── chart-card/
│   │   └── import-stepper/
│   └── layout/
│       ├── app-shell/
│       ├── navbar/
│       └── sidebar/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── lms/
│   ├── exam/
│   ├── ai-attendance/
│   ├── library/
│   └── admin/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── query-client.ts
├── stores/
│   ├── ui.store.ts
│   └── auth.store.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

## Thư viện / Dependencies chính

| Thư viện | Mục đích | Version |
|---------|---------|---------|
| `next` | Framework | 15.x |
| `react` | UI | 19.x |
| `typescript` | Type safety | 5.x |
| `tailwindcss` | Styling | 4.x |
| `shadcn/ui` | UI primitives | latest |
| `@tanstack/react-table` | DataTable | 8.x |
| `@tanstack/react-query` | Data fetching | 5.x |
| `next-auth` | Authentication | 5.x |
| `zustand` | State management | 5.x |
| `react-hook-form` | Forms | 7.x |
| `zod` | Validation | 3.x |
| `echarts-for-react` | Charts | 3.x |
| `@dnd-kit/sortable` | Drag-drop | 7.x |
| `react-pdf` | PDF viewer | 7.x |
| `tiptap` | Rich text editor | 2.x |
| `date-fns` | Date utilities | 3.x |

## Design Token References

- `docs/design_token/01_colors.md` — Brand colors (primary teal, module colors)
- `docs/design_token/02_typography.md` — Font stack, sizes, weights
- `docs/design_token/03_spacing.md` — Spacing scale
- `docs/design_token/04_breakpoints.md` — Responsive breakpoints
- `docs/design_token/05_shadows.md` — Shadow levels
- `docs/design_token/06_components.md` — Component-specific tokens
- `docs/design_token/07_motion.md` — Animation/transition tokens
- `docs/design_token/08_tailwind_config.md` — Final Tailwind config

## Quy ước đặt tên

- **Files:** kebab-case (`app-button.tsx`, `data-table.tsx`)
- **Components:** PascalCase (`AppButton`, `DataTable`)
- **Hooks:** camelCase với prefix `use` (`useAuth`, `useClassList`)
- **Stores:** camelCase với suffix `.store.ts` (`ui.store.ts`)
- **API hooks:** prefix `use` + resource + action (`useGetClasses`, `useCreateClass`)
- **Routes:** kebab-case theo folder (`/lms/classes/[id]/content`)

## Coding Standards

- Tất cả components phải có TypeScript types đầy đủ
- Props interfaces export riêng: `export interface ButtonProps {...}`
- Server Components mặc định, thêm `'use client'` khi cần
- Data fetching: TanStack Query hooks trong `features/*/api/`
- Form validation: react-hook-form + zod schemas
- Error boundaries tại route level
- Loading states: skeleton components (không dùng spinner đơn thuần)
- WCAG 2.1 AA: aria labels, focus management, color contrast
