---
title: "Phase 0 — Shared Components (BẮT BUỘC trước tất cả phase)"
phase: 0
agent: "Agent H (base + composite) → Agent I (patterns + layout)"
parallel: false
depends_on: null
screens: []
estimated_days: "3–5 ngày"
---

# Phase 0 — Shared Components

> ⚠️ **Phase này PHẢI hoàn thành TRƯỚC** khi bắt đầu bất kỳ Phase nào khác (1–8).
>
> Tất cả feature agents đều import từ đây. Không có Phase 0 → không build được Phase 1–8.

---

## 🚦 ĐIỀU KIỆN TIÊN QUYẾT — Bắt buộc pass TRƯỚC KHI làm bất cứ thứ gì

> **Không được bắt đầu Task H-1, H-2, H-3, I-1, I-2 cho đến khi 2 điều kiện dưới đây ĐÃ XANH HẾT.**

### Gate 1 — Docker Infrastructure Dev ✅

Container `frontend-dev` phải khởi động ổn định và giữ được trạng thái `Up` liên tục:

```bash
# Kiểm tra nhanh:
./scripts/start_dev.sh
docker ps --filter "name=frontend-dev"
# → STATUS phải là: Up X minutes (not Restarting / Exited)

docker logs --tail 30 frontend-dev
# → Phải thấy: ✓ Ready in Xms  (không có error, không crash-loop)

curl http://localhost:3000
# → HTTP 200 (bất kể nội dung)
```

**Checklist Gate 1:**
- [ ] `docker ps` → `frontend-dev` STATUS `Up` (không `Restarting`, không `Exited`)
- [ ] `docker logs frontend-dev` → thấy `✓ Ready in Xms`, không có crash
- [ ] Hot-reload: sửa 1 dòng bất kỳ trong `src/` → browser tự update, **không restart container**
- [ ] `WATCHPACK_POLLING=true` có trong `docker-compose.dev.yml`
- [ ] `--hostname 0.0.0.0` có trong `package.json` script `"dev"`
- [ ] `docker exec -it frontend-dev sh` → vào được shell

> **Nếu Gate 1 fail** → chạy lại Task I-6 (Docker & Scripts). Không được tiếp tục.

---

### Gate 2 — Homepage Chạy Ổn Định ✅

Trang chủ (`/`) phải render thành công trong container dev, không lỗi JS, không lỗi hydration:

```bash
# Kiểm tra:
curl -s http://localhost:3000 | grep -i "html"
# → Phải trả về HTML (không phải lỗi 500)

# Hoặc mở browser: http://localhost:3000
# → Trang render, không có "Application error" / "500 Internal Server Error"
```

**Trang homepage tối thiểu** (`src/app/(dashboard)/page.tsx`):

```typescript
// src/app/(dashboard)/page.tsx
// Trang placeholder — đủ để confirm routing + AppShell hoạt động
export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-teal-700">
        THPT Quốc Học Huế — Hệ thống quản lý
      </h1>
      <p className="text-muted-foreground mt-2">
        Phase 0 đang được xây dựng...
      </p>
    </div>
  )
}
```

**Checklist Gate 2:**
- [ ] `http://localhost:3000` → HTTP 200, trang render không lỗi
- [ ] Không có `Application error: a client-side exception has occurred`
- [ ] Không có React Hydration Error trong console
- [ ] `http://localhost:3000/api/health` → `{"status":"ok",...}` (cho Docker healthcheck)
- [ ] `npm run build` (bên trong container) → exit code 0, không có TypeScript/build error

> **Nếu Gate 2 fail** → fix lỗi build/runtime trước. Không được tiếp tục sang các Task component.

---

### Thứ tự thực hiện trong Phase 0

```
[Gate 1] Docker Dev ổn định
    ↓
[Gate 2] Homepage render OK
    ↓  ← CHỈ SAU KHI CẢ 2 GATE XANH
Task I-3: Project Scaffold & Dependencies
Task I-4: Config Files
Task I-5: Public Assets (fonts)
Task I-6: Docker & Scripts (hoàn thiện)
    ↓
Task H-1: Setup shadcn/ui
    ↓
Task H-2: Base Components      ←─ Agent H & I có thể song song sau H-1
Task H-3: Composite Components    (H-2/H-3 song song với I-1 được)
Task I-1: Pattern Components
Task I-2: Layout Components
    ↓
[Phase 0 Done] → Mở khoá Phase 1–8 (song song)
```

> **Lý do:** Agent H và I cần container dev chạy ổn định để `npm run dev`, `npx shadcn@latest add`, `npm run type-check` thực thi bên trong container. Nếu container chưa ổn → mọi lệnh cài đặt, lint, test đều fail ngay.

---

## Phụ thuộc thiết kế

| File design token | Nội dung |
|---|---|
| `docs/design_token/01_colors.md` | Brand colors, semantic colors per module |
| `docs/design_token/02_typography.md` | Font families, sizes, line-heights |
| `docs/design_token/03_spacing.md` | Spacing scale (4px base) |
| `docs/design_token/04_shadows.md` | Box shadow tokens |
| `docs/design_token/05_radius.md` | Border radius |
| `docs/design_token/06_components.md` | Component-level specs |
| `docs/design_token/07_motion.md` | Animation durations, easings |
| `docs/design_token/08_tailwind_config.md` | Tailwind config extension |

---

## AGENT H — Base & Composite Components

### Task H-1: Setup shadcn/ui (Level 0)

**Mục tiêu:** Scaffold tất cả shadcn primitives cần thiết, cài design token

**Bước 1 — Init shadcn:**
```bash
npx shadcn@latest init
# → Style: New York
# → Base color: Neutral (sẽ override bằng CSS vars)
# → CSS variables: Yes
```

**Bước 2 — Cập nhật `tailwind.config.ts`:**
```typescript
// Merge với docs/design_token/08_tailwind_config.md
// Brand colors:
//   primary: teal (#0d9488)
//   lms: emerald (#059669)
//   exam: amber (#d97706)
//   ai: blue (#2563eb)
//   library: purple (#7c3aed)
//   admin: slate (#475569)
// Custom fonts: Inter + font-mono
// Custom animations: từ 07_motion.md
```

**Bước 3 — Cập nhật `src/styles/globals.css`:**
```css
/* Map CSS vars cho shadcn override */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 173 76% 31%;         /* teal brand */
  --primary-foreground: 0 0% 100%;
  --ring: 173 76% 31%;
  /* ... từ design_token/01_colors.md */
}
.dark {
  /* dark mode vars */
}
```

**Bước 4 — Install shadcn components:**
```bash
npx shadcn@latest add button input label badge card dialog
npx shadcn@latest add select textarea table tabs toast
npx shadcn@latest add dropdown-menu popover sheet separator
npx shadcn@latest add avatar checkbox radio-group switch
npx shadcn@latest add progress skeleton tooltip
npx shadcn@latest add scroll-area command breadcrumb
npx shadcn@latest add calendar date-picker  # (nếu có hoặc dùng shadcn date)
npx shadcn@latest add collapsible accordion
```

**Files tạo ra:**
```
src/
├── components/ui/           # tất cả shadcn components (auto-generated)
├── styles/globals.css        # updated với CSS vars
└── tailwind.config.ts        # updated với brand tokens
```

**Deliverables & Test:**
- [ ] `npm run dev` không lỗi
- [ ] `src/app/test-components/page.tsx` render tất cả shadcn primitives
- [ ] Màu primary là teal brand, không phải blue default
- [ ] Dark mode toggle hoạt động cơ bản

---

### Task H-2: Base Components — Level 1

**Thư mục:** `src/components/base/`

#### H-2-1: `AppButton` — `src/components/base/app-button/index.tsx`

```typescript
interface AppButtonProps extends ButtonProps {
  loading?: boolean
  module?: 'lms' | 'exam' | 'ai' | 'library' | 'admin'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

**Behavior:**
- `loading=true`: disable + replace icon/text với Spinner
- `module` prop: thay đổi màu accent (override primary color per module)
- Min touch target: `min-h-[44px] min-w-[44px]`
- Focus ring: visible `focus-visible:ring-2`

**Module colors:**
```
lms     → emerald-600 (hover: emerald-700)
exam    → amber-600   (hover: amber-700)
ai      → blue-600    (hover: blue-700)
library → purple-600  (hover: purple-700)
admin   → slate-600   (hover: slate-700)
```

**Export:** Named export `AppButton`, default export cũng ok

---

#### H-2-2: `AppInput` — `src/components/base/app-input/index.tsx`

```typescript
interface AppInputProps extends InputProps {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}
```

**Behavior:**
- Hiển thị `label` phía trên (với `*` nếu `required`)
- `error` prop: border đỏ + error text phía dưới
- `helper` text: grey text phía dưới (ẩn nếu có error)
- `aria-describedby`: trỏ tới error hoặc helper
- `aria-invalid="true"` khi có error
- `aria-required="true"` khi required

---

#### H-2-3: `AppBadge` — `src/components/base/app-badge/index.tsx`

```typescript
type UserRole = 'student' | 'teacher' | 'principal' | 'admin' | 'librarian' | 'staff'
type SemanticVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface AppBadgeProps {
  role?: UserRole
  semantic?: SemanticVariant
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean              // hiển thị dot trước text
  children: React.ReactNode
}
```

**Role colors (background/text):**
```
student   → sky-100 / sky-800
teacher   → emerald-100 / emerald-800
principal → teal-100 / teal-800
admin     → purple-100 / purple-800
librarian → violet-100 / violet-800
staff     → slate-100 / slate-800
```

**Semantic colors:**
```
success → green-100 / green-800
warning → yellow-100 / yellow-800
error   → red-100 / red-800
info    → blue-100 / blue-800
neutral → gray-100 / gray-700
```

---

#### H-2-4: `AppAvatar` — `src/components/base/app-avatar/index.tsx`

```typescript
interface AppAvatarProps {
  name: string
  src?: string
  role?: UserRole
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showRing?: boolean    // colored ring based on role
}
```

**Behavior:**
- `src` có: hiển thị img
- `src` không có: initials (2 ký tự đầu của name)
- Initials background: hash từ name → consistent color
- Role ring: `ring-2 ring-{roleColor}`

**Size map:**
```
xs → h-6 w-6 (text-xs)
sm → h-8 w-8 (text-sm)
md → h-10 w-10 (text-sm)
lg → h-12 w-12 (text-base)
xl → h-16 w-16 (text-lg)
```

---

#### H-2-5: `AppSelect` — `src/components/base/app-select/index.tsx`

```typescript
interface AppSelectProps {
  label?: string
  error?: string
  options: { value: string; label: string; disabled?: boolean }[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchable?: boolean    // filter options by typing
  required?: boolean
  disabled?: boolean
}
```

**Behavior:**
- Wrap shadcn Select
- `searchable=true`: dùng shadcn Command+Popover pattern
- Label + error giống AppInput

---

#### H-2-6: `AppTextarea` — `src/components/base/app-textarea/index.tsx`

```typescript
interface AppTextareaProps extends TextareaProps {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  maxLength?: number
  showCount?: boolean    // hiển thị "X/maxLength"
  minRows?: number       // default 3
  autoResize?: boolean   // auto-grow theo content
}
```

**Files tạo ra:**
```
src/components/base/
├── app-button/
│   └── index.tsx
├── app-input/
│   └── index.tsx
├── app-badge/
│   └── index.tsx
├── app-avatar/
│   └── index.tsx
├── app-select/
│   └── index.tsx
└── app-textarea/
    └── index.tsx
```

**Export barrel:** `src/components/base/index.ts`
```typescript
export { AppButton } from './app-button'
export { AppInput } from './app-input'
export { AppBadge } from './app-badge'
export { AppAvatar } from './app-avatar'
export { AppSelect } from './app-select'
export { AppTextarea } from './app-textarea'
```

**Deliverables & Test:**
- [ ] Mỗi component render đúng trên test page
- [ ] `AppButton`: loading state spinner, module colors
- [ ] `AppInput`: label/error/helper render đúng, aria attributes
- [ ] `AppBadge`: tất cả role + semantic variants hiển thị
- [ ] `AppAvatar`: initials fallback, role ring
- [ ] `AppSelect`: searchable filter hoạt động
- [ ] `AppTextarea`: char count, auto-resize
- [ ] Visual check: màu đúng với `docs/design_token/01_colors.md`

---

### Task H-3: Composite Components — Level 2

**Thư mục:** `src/components/composite/`

#### H-3-1: `PageHeader` — `src/components/composite/page-header/index.tsx`

```typescript
interface Breadcrumb { label: string; href?: string }
interface Action {
  label: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  icon?: React.ReactNode
  loading?: boolean
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  actions?: Action[]
  className?: string
}
```

**Layout:**
```
[Breadcrumb nav — shadcn Breadcrumb] (nếu có)
[H1: title]  [Action buttons] (flex justify-between)
[p: subtitle] (grey, smaller)
```

**Responsive:** Actions collapse to `DropdownMenu` khi `actions.length > 2` trên mobile (`md:hidden`)

---

#### H-3-2: `StatCard` — `src/components/composite/stat-card/index.tsx`

```typescript
interface StatCardProps {
  title: string
  value: string | number
  delta?: number           // % change: +5.2 hoặc -3.1
  deltaType?: 'positive-is-good' | 'positive-is-bad'  // để tô màu đúng
  icon?: React.ReactNode
  module?: 'lms' | 'exam' | 'ai' | 'library' | 'admin'
  loading?: boolean
  unit?: string            // vd: "%" hoặc "học sinh"
}
```

**Layout:**
```
┌─────────────────────────────┐
│ border-left-4px moduleColor │
│                             │
│  [icon]  [title]            │
│  [value large] [unit]       │
│  [▲/▼ delta %] (colored)   │
└─────────────────────────────┘
```

**Loading state:** shadcn `Skeleton` placeholder

---

#### H-3-3: `FormField` — `src/components/composite/form-field/index.tsx`

```typescript
interface FormFieldProps {
  name: string
  label?: string
  required?: boolean
  description?: string   // helper text
  children: React.ReactNode  // actual input component
  // Tự động nhận error từ react-hook-form context nếu có
}
```

**Behavior:** Wrap `Controller` từ react-hook-form, pass down field props, display error

---

#### H-3-4: `SearchBar` — `src/components/composite/search-bar/index.tsx`

```typescript
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  debounceMs?: number         // default 300
  placeholder?: string
  className?: string
  disabled?: boolean
  loading?: boolean           // show spinner
}
```

**Behavior:**
- Debounce onChange với `debounceMs`
- Show clear button (×) khi có value
- `loading=true`: spinner icon bên phải

---

#### H-3-5: `ConfirmDialog` — `src/components/composite/confirm-dialog/index.tsx`

```typescript
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  title: string
  description: string
  confirmLabel?: string        // default: "Xác nhận"
  cancelLabel?: string         // default: "Hủy"
  variant?: 'default' | 'danger' | 'warning'
  loading?: boolean
}
```

**Behavior:**
- `variant=danger`: confirm button màu đỏ
- `variant=warning`: confirm button màu vàng/orange
- `loading=true`: disable buttons + spinner trên confirm button
- Click outside (nếu không loading): close dialog

---

#### H-3-6: `EmptyState` — `src/components/composite/empty-state/index.tsx`

```typescript
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode       // default: Inbox icon
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
  }
  className?: string
}
```

**Layout:**
```
[Centered column]
  [icon - large, muted color]
  [title - semibold]
  [description - muted, text-sm]
  [action button (primary)] [secondaryAction (ghost)]
```

---

#### H-3-7: `UserMenu` — `src/components/composite/user-menu/index.tsx`

```typescript
interface UserMenuProps {
  user: {
    name: string
    email: string
    avatar?: string
    role: UserRole
  }
  onSignOut: () => void
}
```

**Layout (DropdownMenu trigger = Avatar button):**
```
[Avatar]  →  Dropdown:
  ─────────────────
  [Avatar] [Tên đầy đủ]
           [AppBadge: role]
           [Email - muted]
  ─────────────────
  [Hồ sơ của tôi]
  [Đổi mật khẩu]
  ─────────────────
  [Đăng xuất] (red text)
```

**Files tạo ra:**
```
src/components/composite/
├── page-header/index.tsx
├── stat-card/index.tsx
├── form-field/index.tsx
├── search-bar/index.tsx
├── confirm-dialog/index.tsx
├── empty-state/index.tsx
└── user-menu/index.tsx
```

**Export barrel:** `src/components/composite/index.ts`

**Deliverables & Test:**
- [ ] `PageHeader`: breadcrumb + title + actions render, responsive collapse
- [ ] `StatCard`: loading skeleton → data, delta colors đúng
- [ ] `FormField`: nhận error từ react-hook-form
- [ ] `SearchBar`: debounce test (type fast → onChange gọi 1 lần)
- [ ] `ConfirmDialog`: open/close, loading state, variant colors
- [ ] `EmptyState`: icon + text + action render
- [ ] `UserMenu`: avatar trigger, dropdown items, signout

---

## AGENT I — Patterns & Layout Components

### Task I-1: Pattern Components — Level 3

**Thư mục:** `src/components/patterns/`

#### I-1-1: `DataTable` — `src/components/patterns/data-table/index.tsx`

**Library:** `@tanstack/react-table` v8

```typescript
interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  pageSize?: number              // default 20
  loading?: boolean
  onExport?: () => void
  searchable?: boolean
  searchPlaceholder?: string
  selectable?: boolean           // checkbox bulk select
  onSelectionChange?: (rows: TData[]) => void
  bulkActions?: BulkAction[]
  emptyState?: React.ReactNode
  stickyHeader?: boolean
}
```

**Features:**
- **Sort:** click column header → icon indicator (↑↓)
- **Search:** SearchBar on top (filter client-side or call onSearch)
- **Paginate:** `prev | 1 2 3 ... N | next` + page size select
- **Bulk select:** checkbox per row + header checkbox (select all page/all)
- **Loading:** Skeleton rows (same columns)
- **Export button:** gọi `onExport` prop
- **BulkActions toolbar:** hiện khi có rows selected (ConfirmDialog cho destructive)

**Column helper types:**
```typescript
// Feature agents dùng columnHelper.display() cho action column
// columnHelper.accessor() cho data columns
```

---

#### I-1-2: `CrudPage` — `src/components/patterns/crud-page/index.tsx`

```typescript
interface CrudPageProps<TData> {
  title: string
  breadcrumbs?: Breadcrumb[]
  columns: ColumnDef<TData>[]
  data: TData[]
  loading?: boolean
  onAdd?: () => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onExport?: () => void
  deleteConfirmMessage?: (row: TData) => string
  addButtonLabel?: string
  searchable?: boolean
  filters?: React.ReactNode   // FilterBar slot
}
```

**Auto-wires:**
- PageHeader (title + breadcrumbs + Add button)
- DataTable (columns + data)
- Delete: auto-inserts Actions column với Edit/Delete buttons → opens ConfirmDialog

---

#### I-1-3: `DetailDrawer` — `src/components/patterns/detail-drawer/index.tsx`

```typescript
interface DetailDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'  // sm=400 md=540 lg=700 xl=900
  footer?: React.ReactNode
}
```

**Layout:** shadcn `Sheet` (side=right) với header/body/footer slots

**Width map:**
```
sm → max-w-sm  (400px)
md → max-w-md  (540px)
lg → max-w-xl  (700px)
xl → max-w-2xl (900px)
```

---

#### I-1-4: `FilterBar` — `src/components/patterns/filter-bar/index.tsx`

```typescript
type FilterDef =
  | { type: 'search'; key: string; placeholder?: string }
  | { type: 'select'; key: string; label: string; options: Option[] }
  | { type: 'daterange'; key: string; label?: string }
  | { type: 'multiselect'; key: string; label: string; options: Option[] }

interface FilterBarProps {
  filters: FilterDef[]
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  onReset?: () => void
  loading?: boolean
  className?: string
}
```

**Layout:** `flex flex-wrap gap-2` với mỗi filter là một item, Reset button cuối

---

#### I-1-5: `StatGrid` — `src/components/patterns/stat-grid/index.tsx`

```typescript
interface StatGridProps {
  stats: StatCardProps[]
  cols?: 2 | 3 | 4
  loading?: boolean    // pass loading to all StatCards
}
```

**Layout:**
```
cols=2 → grid-cols-1 sm:grid-cols-2
cols=3 → grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
cols=4 → grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

---

#### I-1-6: `ChartCard` — `src/components/patterns/chart-card/index.tsx`

```typescript
interface ChartCardProps {
  title: string
  subtitle?: string
  option: EChartsOption        // from 'echarts'
  height?: number              // default 300
  loading?: boolean
  className?: string
  onEvents?: Record<string, Function>  // ECharts events
}
```

**Library:** `echarts-for-react` (ReactECharts)

**Behavior:**
- Loading: hiển thị Skeleton placeholder đúng kích thước
- Responsive: ReactECharts với `style={{ width: '100%', height }}`
- Error boundary: nếu render lỗi → show "Không thể hiển thị biểu đồ"

---

#### I-1-7: `ImportStepper` — `src/components/patterns/import-stepper/index.tsx`

```typescript
interface ImportStepperProps {
  title?: string
  templateUrl?: string              // download template link
  onComplete: (data: unknown[]) => Promise<void>
  validateFn?: (rows: unknown[]) => ValidationResult[]
  stepLabels?: [string, string, string]  // custom step labels
  maxFileSize?: number              // default 10MB
  acceptedFormats?: string[]        // default ['.xlsx', '.csv']
  previewColumns?: ColumnDef[]      // columns cho preview table
}
```

**3 bước:**

**Step 1 — Upload file:**
```
[H2: "Bước 1: Tải file lên"]
[Drag-drop zone:]
  Kéo thả file .xlsx hoặc .csv vào đây
  hoặc [Chọn file]
  [Tải template mẫu] link
[File info sau chọn: tên | size | type]
[Progress bar khi parsing]
[Lỗi: file sai format, quá size]
[Tiếp theo →]
```

**Step 2 — Preview & Validate:**
```
[H2: "Bước 2: Kiểm tra dữ liệu"]
[Summary: {n} dòng tìm thấy | {errorCount} lỗi]
[DataTable preview:]
  - Valid rows: normal style
  - Error rows: red background + tooltip lỗi
  - Max hiển thị 50 rows (paginate nếu nhiều hơn)
[Error list bên dưới nếu có lỗi]
[← Quay lại] [Tiếp theo → (disabled nếu có lỗi critical)]
```

**Step 3 — Confirm:**
```
[H2: "Bước 3: Xác nhận nhập liệu"]
[Summary card: Sẽ nhập {n} dòng]
[Warning nếu có soft errors]
[Loading khi đang import]
[← Quay lại] [✓ Xác nhận nhập liệu]
```

**Files tạo ra:**
```
src/components/patterns/
├── data-table/index.tsx
├── crud-page/index.tsx
├── detail-drawer/index.tsx
├── filter-bar/index.tsx
├── stat-grid/index.tsx
├── chart-card/index.tsx
└── import-stepper/index.tsx
```

**Deliverables & Test:**
- [ ] `DataTable`: sort + search + paginate với 50 mock rows
- [ ] `DataTable`: bulk select + custom bulk action
- [ ] `CrudPage`: render với mock data, edit/delete actions
- [ ] `DetailDrawer`: open/close, 4 widths
- [ ] `FilterBar`: date range + select + reset
- [ ] `ChartCard`: render bar chart với mock option
- [ ] `ImportStepper`: step 1→2→3 flow với mock xlsx parse

---

### Task I-2: Layout Components

**Thư mục:** `src/components/layout/`

#### I-2-1: `AppShell` — `src/components/layout/app-shell/index.tsx`

```typescript
interface AppShellProps {
  children: React.ReactNode
}
```

**Layout structure:**
```
<div className="min-h-screen bg-background">
  <Navbar />                          /* fixed top, h-16, z-20 */
  <div className="flex pt-16">
    <Sidebar />                       /* fixed left, top-16 */
    <main className="flex-1 ml-[sidebarWidth] p-6">
      {children}
    </main>
  </div>
</div>
```

**Sidebar width:** `256px` expanded | `64px` collapsed (từ Zustand `ui.store`)

**Mobile behavior:** Sidebar chuyển thành `Sheet` (drawer overlay, không chiếm space)

**Breakpoints:**
```
< md (768px): mobile → sidebar là drawer overlay
≥ md: desktop → sidebar fixed, main có margin-left
```

---

#### I-2-2: `Navbar` — `src/components/layout/navbar/index.tsx`

**Layout:**
```
<nav className="fixed top-0 left-0 right-0 h-16 z-20 bg-background border-b">
  <div className="flex items-center h-full px-4 gap-4">
    [SidebarToggle button]    /* hamburger icon */
    [Logo: THPT Quốc Học Huế]  /* text hoặc img */
    <div className="flex-1" />   /* spacer */
    [NotificationBell]          /* badge count */
    [UserMenu]                  /* từ composite */
  </div>
</nav>
```

**Logo:**
- Text: "THPT Quốc Học Huế" với brand teal color
- Hoặc img từ settings (configurable)

**NotificationBell:**
- Icon Bell với badge số thông báo chưa đọc
- Click → Popover danh sách 5 thông báo gần nhất + "Xem tất cả"

---

#### I-2-3: `Sidebar` — `src/components/layout/sidebar/index.tsx`

**Nav items (theo role):**
```typescript
const navItems = [
  {
    label: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['all']
  },
  {
    label: 'Học tập',
    icon: BookOpen,
    module: 'lms',
    roles: ['teacher', 'student', 'admin'],
    children: [
      { label: 'Lớp học', href: '/lms/classes', roles: ['teacher', 'admin'] },
      { label: 'Lớp của tôi', href: '/my-classes', roles: ['student'] },
      { label: 'Bài thi', href: '/my-exams', roles: ['student'] },
      { label: 'GDĐT', href: '/gddt/classes', roles: ['admin', 'teacher'] },
    ]
  },
  {
    label: 'Thi & Kiểm tra',
    icon: ClipboardList,
    module: 'exam',
    roles: ['teacher', 'admin'],
    children: [
      { label: 'Ngân hàng câu hỏi', href: '/exam/question-bank' },
      { label: 'Đề thi', href: '/exam/exams' },
      { label: 'Tổ chức thi', href: '/exam/sessions' },
    ]
  },
  {
    label: 'AI Điểm danh',
    icon: Camera,
    module: 'ai',
    href: '/ai-attendance',
    roles: ['admin', 'principal'],
  },
  {
    label: 'Thư viện',
    icon: Library,
    module: 'library',
    roles: ['admin', 'librarian', 'teacher', 'student'],
    children: [
      { label: 'Quản lý', href: '/library', roles: ['admin', 'librarian'] },
      { label: 'Tra cứu', href: '/library-portal/opac', roles: ['all'] },
    ]
  },
  {
    label: 'Quản trị',
    icon: Settings,
    module: 'admin',
    roles: ['admin'],
    children: [
      { label: 'Người dùng', href: '/admin/users' },
      { label: 'Vai trò', href: '/admin/roles' },
      { label: 'Cơ cấu tổ chức', href: '/admin/organization' },
      { label: 'Cài đặt', href: '/admin/settings' },
      { label: 'Audit Log', href: '/admin/audit-log' },
      { label: 'Tích hợp', href: '/admin/integrations' },
    ]
  },
]
```

**Active state:**
- Current route: `border-left: 3px solid moduleColor` + `bg-{moduleColor}-50`
- Hover: `bg-muted`

**Collapsed state (64px):** chỉ hiển thị icon + Tooltip với label

**Role-based:** ẩn items mà user không có role phù hợp

---

#### I-2-4: Global Setup Files

**`src/app/layout.tsx` — Root layout:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <SessionProvider>          {/* next-auth */}
          <QueryClientProvider>    {/* TanStack Query */}
            <ThemeProvider>        {/* next-themes dark mode */}
              {children}
              <Toaster />          {/* shadcn toast */}
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

**`src/app/(dashboard)/layout.tsx` — Dashboard layout:**
```typescript
export default function DashboardLayout({ children }) {
  return <AppShell>{children}</AppShell>
}
```

**`src/lib/query-client.ts`:**
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 phút
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
})
```

**`src/lib/api.ts` — Base fetch wrapper:**
```typescript
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T>
// - Tự thêm Authorization header từ session
// - Handle 401 → redirect /login
// - Handle 403 → redirect /unauthorized
// - Parse JSON response
// - Throw APIError với message từ server
```

**`src/stores/ui.store.ts` — Zustand:**
```typescript
interface UIStore {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  toggleSidebar: () => void
  collapseSidebar: () => void
  setTheme: (theme: UIStore['theme']) => void
}
```

**`src/stores/auth.store.ts` — Zustand:**
```typescript
interface AuthStore {
  currentUser: User | null
  role: UserRole | null
  permissions: Permission[]
  setUser: (user: User) => void
  hasPermission: (module: string, action: string) => boolean
}
```

**`src/types/index.ts` — Global types:**
```typescript
export type UserRole = 'admin' | 'principal' | 'teacher' | 'student' | 'librarian' | 'staff'

export interface User {
  id: string
  username: string
  fullName: string
  email: string
  avatar?: string
  role: UserRole
  unitId: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}
```

**Files tạo ra:**
```
src/
├── components/
│   └── layout/
│       ├── app-shell/index.tsx
│       ├── navbar/index.tsx
│       └── sidebar/index.tsx
├── lib/
│   ├── query-client.ts
│   ├── api.ts
│   └── auth.ts
├── stores/
│   ├── ui.store.ts
│   └── auth.store.ts
└── types/
    └── index.ts
```

**Deliverables & Test:**
- [ ] `AppShell`: layout render đúng (navbar + sidebar + content)
- [ ] `Sidebar`: toggle expand/collapse hoạt động
- [ ] `Sidebar`: active state đúng theo current route
- [ ] `Sidebar`: role-based: menu bị ẩn khi không có role
- [ ] `Navbar`: UserMenu hiển thị user info
- [ ] `Navbar`: SidebarToggle click → toggle sidebar
- [ ] `src/app/(dashboard)/page.tsx`: render với AppShell không lỗi
- [ ] Global: `npm run type-check` 0 TypeScript errors
- [ ] Zustand stores: persist sidebarCollapsed state

---

---

## Task I-3: Project Scaffold & Dependencies

> Thực hiện **một lần duy nhất** trước tất cả các task khác. Agent H hoặc I đảm nhận.

**Thư mục gốc:** `frontend/` (toàn bộ dự án nằm trong folder này)

### I-3-1: Khởi tạo dự án

```bash
# Tạo Next.js 15 project
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd frontend
```

### I-3-2: Cài đặt dependencies

```bash
# Production dependencies
npm install \
  @tanstack/react-table \
  @tanstack/react-query \
  react-hook-form \
  @hookform/resolvers \
  zod \
  zustand \
  echarts \
  echarts-for-react \
  next-auth@beta \
  lucide-react \
  clsx \
  tailwind-merge \
  class-variance-authority \
  next-themes \
  @dnd-kit/core \
  @dnd-kit/sortable \
  @dnd-kit/utilities \
  react-pdf \
  react-player \
  @tiptap/react \
  @tiptap/starter-kit \
  @tiptap/extension-image \
  @tiptap/extension-link \
  xlsx

# Dev dependencies
npm install -D \
  prettier \
  prettier-plugin-tailwindcss \
  @types/node
```

**Files tạo ra / cập nhật:**
```
frontend/
├── package.json          ← updated với tất cả deps
└── package-lock.json
```

**`package.json` scripts — lưu ý `--hostname 0.0.0.0`:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack --hostname 0.0.0.0",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

> `--hostname 0.0.0.0` trong script `dev` là **bắt buộc** để Next.js bind ra ngoài container. `CMD ["npm", "run", "dev"]` trong `Dockerfile.dev` sẽ gọi script này.

**Deliverables:**
- [ ] `npm install` hoàn thành không có peer dependency error
- [ ] `npm run dev` server khởi động tại `localhost:3000`

---

## Task I-4: Config Files

> Cấu hình toàn bộ tooling: Next.js, TypeScript, ESLint, Prettier, env.

**Thư mục:** `frontend/` (root)

### I-4-1: `next.config.ts`

```typescript
// Nội dung cần cấu hình:
// - output: 'standalone'           → cho Docker multi-stage build
// - images.domains: ['...']        → domain ảnh backend/CDN
// - experimental.turbo: {}         → Turbopack cho dev
// - env: {}                        → expose public env vars
```

**Lưu ý quan trọng:** `output: 'standalone'` là BẮT BUỘC để Docker `runner` stage copy đúng.

### I-4-2: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Lưu ý:** `noUncheckedIndexedAccess: true` — bắt lỗi array access an toàn hơn.

### I-4-3: `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/no-cycle": "error"
  }
}
```

**Lưu ý:** `import/no-cycle` — phát hiện circular imports giữa features.

### I-4-4: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### I-4-5: `.env.example`

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# next-auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# HUE-S SSO (OAuth2/OIDC)
HUES_CLIENT_ID=
HUES_CLIENT_SECRET=
HUES_ISSUER=https://sso.hue-s.vn

# GDĐT LGSP
LGSP_ENDPOINT=
LGSP_TOKEN=
```

### I-4-6: `.env.local`

- Copy từ `.env.example`, điền giá trị thực
- **Gitignored** (không commit)

### I-4-7: `.dockerignore`

```
node_modules
.next
.git
.env.local
*.log
coverage
.DS_Store
```

**Files tạo ra:**
```
frontend/
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs       ← auto-generated bởi create-next-app
├── tailwind.config.ts       ← sẽ update ở Task H-1
├── .eslintrc.json
├── .prettierrc
├── .env.example
├── .env.local               ← gitignored, tạo thủ công
└── .dockerignore
```

**Deliverables:**
- [ ] `npm run lint` — 0 errors
- [ ] `npm run type-check` — 0 TypeScript errors
- [ ] `prettier --check src/` — tất cả files đúng format
- [ ] `.env.local` tạo thành công từ `.env.example`

---

## Task I-5: Public Assets — `frontend/public/`

> Fonts tự host (tránh Google Fonts gọi ra ngoài, tăng tốc độ).

### I-5-1: Self-hosted Fonts

**Fonts cần dùng** (từ `docs/design_token/02_typography.md`):
- **Lexend** — font chính UI (weights: 400, 500, 600, 700)
- **Source Sans 3** — font nội dung dài (weights: 400, 600)

**Cấu trúc thư mục:**
```
frontend/public/
└── fonts/
    ├── lexend/
    │   ├── Lexend-Regular.woff2       # weight 400
    │   ├── Lexend-Medium.woff2        # weight 500
    │   ├── Lexend-SemiBold.woff2      # weight 600
    │   └── Lexend-Bold.woff2          # weight 700
    └── source-sans-3/
        ├── SourceSans3-Regular.woff2  # weight 400
        └── SourceSans3-SemiBold.woff2 # weight 600
```

**Nguồn tải:** Google Fonts (download `.woff2` về host local, không dùng CDN link)

### I-5-2: `src/styles/fonts.css`

```css
@font-face {
  font-family: 'Lexend';
  src: url('/fonts/lexend/Lexend-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Lexend';
  src: url('/fonts/lexend/Lexend-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Lexend';
  src: url('/fonts/lexend/Lexend-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Lexend';
  src: url('/fonts/lexend/Lexend-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Sans 3';
  src: url('/fonts/source-sans-3/SourceSans3-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Source Sans 3';
  src: url('/fonts/source-sans-3/SourceSans3-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

**Import vào** `src/styles/globals.css`:
```css
@import './fonts.css';
/* ... phần còn lại của globals.css */
```

**Deliverables:**
- [ ] Fonts load từ `/fonts/...` (không có request ra fonts.googleapis.com)
- [ ] DevTools Network: woff2 files trả về 200
- [ ] Text trên trang render đúng font Lexend (visible trong DevTools)

---

## Task I-6: Docker & Scripts — `frontend/`

> Tách biệt môi trường production và development. Scripts tự động build image nếu chưa có.

### Quy ước đặt tên

| Môi trường | Image name | Container name | Port |
|------------|-----------|----------------|------|
| Development | `frontend-dev:latest` | `frontend-dev` | `3000` |
| Production | `frontend-prod:latest` | `frontend-prod` | `3000` |

### I-6-1: `Dockerfile` — Production (multi-stage)

```
frontend/Dockerfile
```

**3 stage build:**

```
Stage 1 — deps:
  Base: node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production    ← chỉ prod deps, nhanh hơn

Stage 2 — builder:
  Base: node:20-alpine
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  ENV NEXT_TELEMETRY_DISABLED=1
  RUN npm run build               ← output: .next/standalone

Stage 3 — runner:
  Base: node:20-alpine
  WORKDIR /app
  ENV NODE_ENV=production
  ENV NEXT_TELEMETRY_DISABLED=1
  RUN addgroup --system nodejs && adduser --system nextjs
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  USER nextjs
  EXPOSE 3000
  CMD ["node", "server.js"]       ← standalone server
```

**Yêu cầu:** `next.config.ts` phải có `output: 'standalone'`

---

### I-6-2: `Dockerfile.dev` — Development

```
frontend/Dockerfile.dev
```

```
Base: node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install                   ← full deps bao gồm devDependencies
# KHÔNG COPY source code — toàn bộ code được mount qua volume
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "run", "dev"]         ← next dev --turbopack --hostname 0.0.0.0
```

**Cơ chế hot reload — Next.js Turbopack:**
- Source code **mount toàn bộ** vào container qua `volumes: .:/app` (không COPY)
- Sửa file trên host → container thấy ngay qua volume
- `WATCHPACK_POLLING=true` → Next.js polling detect thay đổi (cần thiết với Docker volume, tránh inotify không đáng tin)
- Turbopack compile incremental → gửi update qua **HMR WebSocket** trên **cùng port 3000** (`ws://localhost:3000/_next/webpack-hmr`)
- Browser nhận WebSocket message → hot-swap module, **không reload trang**
- `--hostname 0.0.0.0` là **bắt buộc** — không có flag này Next.js chỉ bind `127.0.0.1` bên trong container, browser ngoài host không kết nối được (kể cả HMR WebSocket)

> **Khác Vite:** Vite dùng port HMR riêng (default 24678, cần `server.hmr.port` + `server.hmr.host`). Next.js Turbopack dùng chung port 3000 — không cần mở thêm port.

---

### I-6-3: `docker-compose.yml` — Production

```
frontend/docker-compose.yml
```

```yaml
services:
  frontend-prod:
    container_name: frontend-prod
    image: frontend-prod:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Health check endpoint:** cần tạo `src/app/api/health/route.ts` trả về `{ status: 'ok' }`

---

### I-6-4: `docker-compose.dev.yml` — Development

```
frontend/docker-compose.dev.yml
```

```yaml
services:
  frontend-dev:
    container_name: frontend-dev
    image: frontend-dev:latest
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app                     # mount toàn bộ source code (không COPY trong Dockerfile.dev)
      - /app/node_modules          # giữ node_modules của container, không bị overwrite bởi host
      - /app/.next                 # giữ Turbopack build cache
    environment:
      - WATCHPACK_POLLING=true     # polling thay vì inotify — bắt buộc với Docker volume
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - .env.local
    stdin_open: true
    tty: true
```

---

### I-6-5: `scripts/start.sh` — Khởi động Production

```
frontend/scripts/start.sh
```

```bash
#!/bin/bash
set -e

IMAGE="frontend-prod:latest"
CONTAINER="frontend-prod"

echo "🔍 Checking image ${IMAGE}..."
if [[ "$(docker images -q ${IMAGE} 2>/dev/null)" == "" ]]; then
  echo "📦 Image not found → building production image..."
  docker build -t ${IMAGE} -f Dockerfile .
  echo "✅ Build complete."
fi

echo "🚀 Starting production server..."
docker compose -f docker-compose.yml up -d

echo "✅ Container '${CONTAINER}' running at http://localhost:3000"
```

---

### I-6-6: `scripts/stop.sh` — Dừng Production

```
frontend/scripts/stop.sh
```

```bash
#!/bin/bash
echo "🛑 Stopping production server..."
docker compose -f docker-compose.yml down
echo "✅ Stopped."
```

---

### I-6-7: `scripts/start_dev.sh` — Khởi động Development

```
frontend/scripts/start_dev.sh
```

```bash
#!/bin/bash
set -e

IMAGE="frontend-dev:latest"
CONTAINER="frontend-dev"

echo "🔍 Checking dev image ${IMAGE}..."
if [[ "$(docker images -q ${IMAGE} 2>/dev/null)" == "" ]]; then
  echo "📦 Dev image not found → building..."
  docker build -t ${IMAGE} -f Dockerfile.dev .
  echo "✅ Dev build complete."
fi

echo "🚀 Starting dev server with hot-reload..."
docker compose -f docker-compose.dev.yml up -d

echo "✅ Container '${CONTAINER}' running at http://localhost:3000"
echo "📝 Source code mounted — changes reflect instantly."
```

---

### I-6-8: `scripts/stop_dev.sh` — Dừng Development

```
frontend/scripts/stop_dev.sh
```

```bash
#!/bin/bash
echo "🛑 Stopping dev server..."
docker compose -f docker-compose.dev.yml down
echo "✅ Stopped."
```

---

### I-6-9: Health Check API — `src/app/api/health/route.ts`

```typescript
// Cần thiết cho Docker healthcheck
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

---

## Docker Workflow — Debug, Dev & Fix

> Tham chiếu nhanh các lệnh Docker để làm việc hàng ngày với container `frontend-dev` và `frontend-prod`.

### 🟢 Khởi động

```bash
# Development (lần đầu hoặc khi chưa có image → tự build)
cd frontend/
chmod +x scripts/*.sh
./scripts/start_dev.sh
# → Container: frontend-dev  |  http://localhost:3000

# Production
./scripts/start.sh
# → Container: frontend-prod  |  http://localhost:3000
```

### 🔴 Dừng

```bash
./scripts/stop_dev.sh    # dừng frontend-dev
./scripts/stop.sh        # dừng frontend-prod
```

---

### 🐛 Debug — Xem logs

```bash
# Xem log realtime của dev container
docker logs -f frontend-dev

# Xem log realtime của prod container
docker logs -f frontend-prod

# Xem 100 dòng log cuối
docker logs --tail 100 frontend-dev
docker logs --tail 100 frontend-prod

# Lọc log theo từ khóa (vd: lỗi)
docker logs -f frontend-dev 2>&1 | grep -i "error\|warn\|failed"
```

---

### 🔧 Dev — Làm việc bên trong container

```bash
# Mở shell vào dev container (để chạy lệnh npm, npx, etc.)
docker exec -it frontend-dev sh

# Chạy lệnh trực tiếp không cần vào shell
docker exec frontend-dev npm run lint
docker exec frontend-dev npm run type-check
docker exec frontend-dev npx shadcn@latest add button

# Cài thêm package (cần restart container sau)
docker exec frontend-dev npm install <package-name>
./scripts/stop_dev.sh && ./scripts/start_dev.sh
```

> **Lưu ý:** Source code được mount volume `./:/app` nên sửa file trên host → container thấy ngay, **không cần restart** để hot-reload. Chỉ cần restart khi cài thêm package mới.

---

### 🔄 Fix — Rebuild khi cần

```bash
# Rebuild dev image (khi thay đổi Dockerfile.dev hoặc package.json)
docker compose -f docker-compose.dev.yml down
docker rmi frontend-dev:latest
./scripts/start_dev.sh          # tự build lại

# Rebuild prod image (khi deploy)
docker compose -f docker-compose.yml down
docker rmi frontend-prod:latest
./scripts/start.sh              # tự build lại

# Xóa build cache Next.js bên trong container (nếu gặp lỗi build lạ)
docker exec frontend-dev rm -rf .next
# → Next.js tự rebuild khi có request tiếp theo

# Hard reset dev (xóa cả container + image + volumes)
docker compose -f docker-compose.dev.yml down -v
docker rmi frontend-dev:latest
./scripts/start_dev.sh
```

---

### 📊 Kiểm tra trạng thái

```bash
# Xem container đang chạy
docker ps --filter "name=frontend"

# Xem chi tiết container (health, ports, mounts)
docker inspect frontend-dev
docker inspect frontend-prod

# Xem health check status
docker inspect --format='{{.State.Health.Status}}' frontend-prod
# → healthy | starting | unhealthy

# Test health endpoint thủ công
curl http://localhost:3000/api/health
# → {"status":"ok","timestamp":"..."}

# Xem dung lượng image
docker images frontend-dev frontend-prod

# Xem resource usage realtime
docker stats frontend-dev
docker stats frontend-prod
```

---

### ⚡ Cheat sheet nhanh

| Tình huống | Lệnh |
|-----------|------|
| Xem log dev | `docker logs -f frontend-dev` |
| Xem log prod | `docker logs -f frontend-prod` |
| Vào shell dev | `docker exec -it frontend-dev sh` |
| Chạy lint | `docker exec frontend-dev npm run lint` |
| Chạy type-check | `docker exec frontend-dev npm run type-check` |
| Cài shadcn component | `docker exec frontend-dev npx shadcn@latest add <name>` |
| Restart dev | `./scripts/stop_dev.sh && ./scripts/start_dev.sh` |
| Rebuild dev từ đầu | `docker rmi frontend-dev:latest && ./scripts/start_dev.sh` |
| Rebuild prod từ đầu | `docker rmi frontend-prod:latest && ./scripts/start.sh` |
| Check health | `curl http://localhost:3000/api/health` |
| HMR không kết nối (WS error) | Kiểm tra `package.json` script `"dev"` có `--hostname 0.0.0.0` |
| File đổi không detect | Kiểm tra `WATCHPACK_POLLING=true` trong `docker-compose.dev.yml` |

---

**Files tạo ra:**
```
frontend/
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── docker-compose.dev.yml
├── .dockerignore
└── scripts/
    ├── start.sh
    ├── stop.sh
    ├── start_dev.sh
    └── stop_dev.sh
```

**Deliverables:**
- [ ] `chmod +x scripts/*.sh` — tất cả scripts có quyền execute
- [ ] `./scripts/start_dev.sh` — build image `frontend-dev:latest`, container `frontend-dev` chạy tại `:3000`
- [ ] `docker ps --filter "name=frontend"` — thấy container `frontend-dev` STATUS `Up`
- [ ] `docker logs -f frontend-dev` — thấy `✓ Ready in Xms`
- [ ] Hot-reload: sửa file `.tsx` trên host → browser tự refresh, không restart container
- [ ] `docker exec -it frontend-dev sh` — vào được shell
- [ ] `./scripts/stop_dev.sh` — container dừng sạch
- [ ] `./scripts/start.sh` — build image `frontend-prod:latest`, container `frontend-prod` chạy tại `:3000`
- [ ] `curl http://localhost:3000/api/health` — trả về `{"status":"ok",...}`
- [ ] `docker inspect --format='{{.State.Health.Status}}' frontend-prod` — trả về `healthy`
- [ ] Rebuild: `docker rmi frontend-dev:latest && ./scripts/start_dev.sh` — build lại thành công

---

## Cấu trúc đầy đủ thư mục `frontend/`

```
frontend/                            ← root của toàn bộ Next.js project
│
├── 🐳 Docker & Scripts
│   ├── Dockerfile                   ← Production multi-stage (Task I-6-1)
│   ├── Dockerfile.dev               ← Development + hot-reload (Task I-6-2)
│   ├── docker-compose.yml           ← Production (Task I-6-3)
│   ├── docker-compose.dev.yml       ← Development + volume (Task I-6-4)
│   ├── .dockerignore                ← Task I-4-7
│   └── scripts/
│       ├── start.sh                 ← auto build → up prod (Task I-6-5)
│       ├── stop.sh                  ← prod down (Task I-6-6)
│       ├── start_dev.sh             ← auto build → up dev (Task I-6-7)
│       └── stop_dev.sh              ← dev down (Task I-6-8)
│
├── ⚙️ Config
│   ├── next.config.ts               ← output standalone (Task I-4-1)
│   ├── tailwind.config.ts           ← design tokens (Task H-1)
│   ├── tsconfig.json                ← strict + path alias (Task I-4-2)
│   ├── postcss.config.mjs           ← auto-generated
│   ├── .env.example                 ← template (Task I-4-5)
│   ├── .env.local                   ← gitignored, tạo thủ công (Task I-4-6)
│   ├── .eslintrc.json               ← no-cycle rule (Task I-4-3)
│   └── .prettierrc                  ← tailwind plugin (Task I-4-4)
│
├── public/
│   └── fonts/                       ← self-hosted (Task I-5-1)
│       ├── lexend/
│       │   ├── Lexend-Regular.woff2
│       │   ├── Lexend-Medium.woff2
│       │   ├── Lexend-SemiBold.woff2
│       │   └── Lexend-Bold.woff2
│       └── source-sans-3/
│           ├── SourceSans3-Regular.woff2
│           └── SourceSans3-SemiBold.woff2
│
└── src/
    ├── app/
    │   ├── layout.tsx               ← Root layout + Providers (Task I-2-4)
    │   ├── not-found.tsx
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   └── health/route.ts      ← Docker healthcheck (Task I-6-9)
    │   ├── (auth)/
    │   │   └── login/page.tsx
    │   └── (dashboard)/
    │       ├── layout.tsx
    │       ├── page.tsx
    │       ├── lms/...
    │       ├── exam/...
    │       ├── ai-attendance/...
    │       ├── library/...
    │       └── admin/...
    ├── components/
    │   ├── ui/                      ← shadcn (Task H-1)
    │   ├── base/                    ← Level 1 (Task H-2)
    │   ├── composite/               ← Level 2 (Task H-3)
    │   ├── patterns/                ← Level 3 (Task I-1)
    │   └── layout/                  ← AppShell (Task I-2)
    ├── features/                    ← Agent-parallel clusters (Phase 1–8)
    ├── lib/
    │   ├── api.ts
    │   ├── auth.ts
    │   ├── utils.ts
    │   └── query-client.ts
    ├── hooks/
    │   ├── use-debounce.ts
    │   ├── use-local-storage.ts
    │   └── use-media-query.ts
    ├── stores/
    │   ├── ui.store.ts
    │   └── auth.store.ts
    ├── types/
    │   ├── index.ts
    │   └── env.d.ts
    └── styles/
        ├── globals.css
        └── fonts.css                ← @font-face khai báo (Task I-5-2)
```

---

## Phase 0 — Definition of Done (toàn bộ)

### 🚦 Gate 1 — Docker Infrastructure Dev (PHẢI XANH ĐẦU TIÊN)
- [ ] `frontend-dev` container STATUS `Up`, không crash-loop
- [ ] `docker logs frontend-dev` thấy `✓ Ready in Xms`
- [ ] Hot-reload hoạt động: sửa file `.tsx` trên host → browser update không restart container
- [ ] `docker exec -it frontend-dev sh` vào được shell
- [ ] `WATCHPACK_POLLING=true` và `--hostname 0.0.0.0` đã cấu hình đúng

### 🚦 Gate 2 — Homepage Ổn Định (PHẢI XANH TRƯỚC KHI LÀM COMPONENT)
- [ ] `http://localhost:3000` → HTTP 200, không có JS error, không Hydration Error
- [ ] `http://localhost:3000/api/health` → `{"status":"ok"}`
- [ ] `npm run build` bên trong container → exit 0, không có lỗi
- [ ] `frontend-prod` container khởi động, healthcheck `healthy`
- [ ] Workflow debug (`docker logs`, `docker exec`, rebuild) đã xác nhận hoạt động

---

### Components Render
- [ ] **Task H-1:** shadcn UI setup, brand colors đúng, dark mode cơ bản
- [ ] **Task H-2:** 6 base components render + export từ `components/base/index.ts`
- [ ] **Task H-3:** 7 composite components render + export từ `components/composite/index.ts`
- [ ] **Task I-1:** 7 pattern components render + export từ `components/patterns/index.ts`
- [ ] **Task I-2:** 3 layout components render, AppShell layout đúng

### Test Page
- [ ] `src/app/test-components/page.tsx` hiển thị:
  - Tất cả base components (tất cả variants)
  - Tất cả composite components
  - DataTable với 20 mock rows (sort/filter/paginate)
  - ImportStepper mock flow
  - ChartCard với mock ECharts option
  - AppShell layout wrapper

### Quality
- [ ] `npm run build` — success, 0 errors
- [ ] `npm run type-check` — 0 TypeScript errors
- [ ] `npm run lint` — 0 ESLint errors
- [ ] Design tokens đúng với `docs/design_token/` (màu, font, spacing)
- [ ] WCAG:
  - Tất cả interactive elements có aria-label hoặc visible label
  - Focus ring visible (không bị `outline: none`)
  - Min touch target 44×44px cho buttons
  - Error messages linked qua aria-describedby

### Performance
- [ ] No unnecessary re-renders trên test page
- [ ] DataTable với 100 rows: không lag khi sort/filter

---

## Thời gian ước tính: 3–5 ngày

| Giai đoạn | Agent | Tasks | Ngày |
|-----------|-------|-------|------|
| **[BẮT BUỘC TRƯỚC]** | Agent I | Gate 1: Docker dev + Gate 2: Homepage | 0.5 ngày |
| Sau Gate 1+2 | Agent H | H-1 (shadcn setup) + H-2 (base) + H-3 (composite) | 2–3 ngày |
| Sau Gate 1+2 | Agent I | I-1 (patterns) + I-2 (layout + global setup) | 2–3 ngày |

> Agent I có thể bắt đầu song song với H sau khi H-1 (shadcn setup) xong.
>
> **Tuyệt đối không skip Gate 1 và Gate 2** — mọi task component đều phụ thuộc vào container dev chạy ổn định.
