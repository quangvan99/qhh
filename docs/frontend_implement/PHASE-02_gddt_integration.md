---
title: "Phase 2 — GDĐT Integration (Lớp học, HS, Điểm rèn luyện, Học bổng)"
phase: 2
agent: "Agent C"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-02-001
  - SCR-02-002
  - SCR-02-003
  - SCR-02-004
  - SCR-02-005
  - SCR-02-006
  - SCR-02-007
  - SCR-02-008
  - SCR-02-009
wireframes: ["WF-02"]
estimated_days: "3–4 ngày"
note: "SCR-02-010..012 (kết nối GDĐT) nằm trong Phase 1"
---

# Phase 2 — GDĐT Integration

> Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.
>
> Phase này tập trung: danh sách lớp/HS từ GDĐT, cấu hình điểm rèn luyện, học bổng.

## Phạm vi files

```
src/
├── app/(dashboard)/
│   └── gddt/
│       ├── classes/
│       │   ├── page.tsx                # SCR-02-001
│       │   └── [id]/
│       │       └── students/
│       │           └── page.tsx        # SCR-02-002
│       ├── conduct-score/
│       │   ├── page.tsx                # SCR-02-003 (danh sách tiêu chí)
│       │   ├── new/page.tsx            # SCR-02-004 (form thêm)
│       │   ├── [id]/edit/page.tsx      # SCR-02-004 (form sửa)
│       │   ├── input/
│       │   │   └── [studentId]/page.tsx # SCR-02-005 (nhập điểm từng HS)
│       │   └── import/page.tsx         # SCR-02-006 (import excel)
│       └── scholarship/
│           ├── levels/page.tsx         # SCR-02-007
│           ├── sessions/page.tsx       # SCR-02-008
│           └── results/page.tsx        # SCR-02-009
└── features/
    └── lms/                            # GDĐT nằm trong cluster lms
        ├── gddt/
        │   ├── components/
        │   │   ├── ClassListGDDT.tsx
        │   │   ├── StudentListGDDT.tsx
        │   │   ├── ConductScoreForm.tsx
        │   │   ├── ConductScoreImport.tsx
        │   │   ├── ScholarshipLevelForm.tsx
        │   │   ├── ScholarshipSessionForm.tsx
        │   │   └── ScholarshipResults.tsx
        │   ├── hooks/
        │   │   ├── useGDDTClasses.ts
        │   │   ├── useGDDTStudents.ts
        │   │   ├── useConductScore.ts
        │   │   └── useScholarship.ts
        │   ├── api/
        │   │   └── gddt.api.ts
        │   └── types/
        │       └── gddt.types.ts
```

---

## PHẦN A — Danh sách lớp học & học sinh GDĐT

### Task C-2-A-1: SCR-02-001 — Danh sách lớp học (sync GDĐT)

**Route:** `src/app/(dashboard)/gddt/classes/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Lớp học – GDĐT"
  Breadcrumbs: GDĐT > Lớp học
  Actions: [🔄 Đồng bộ GDĐT] (link → /gddt/sync)

[FilterBar]
  - Select: Năm học (dropdown, required)
  - Select: Khối lớp (10 | 11 | 12 | Tất cả)
  - SearchBar: Tên lớp / Mã lớp

[DataTable columns:]
  - Mã lớp (sortable)
  - Tên lớp
  - Khối
  - GVCN (tên giáo viên chủ nhiệm)
  - Sĩ số (số học sinh)
  - Trạng thái sync (badge: Đã sync / Chưa sync / Lỗi)
  - Lần cuối sync (timestamp)
  - Actions: [Xem HS] → link SCR-02-002
```

**API:**
- `GET /api/gddt/classes?year={year}&grade={grade}&q={search}` → PaginatedResponse\<GDDTClass\>

**Types:**
```typescript
interface GDDTClass {
  id: string
  code: string
  name: string
  grade: 10 | 11 | 12
  teacher: string
  studentCount: number
  syncStatus: 'synced' | 'pending' | 'error'
  lastSyncAt: string
}
```

**Deliverables:**
- [ ] Filter theo năm học + khối + search hoạt động
- [ ] DataTable hiển thị đúng, paginate
- [ ] Badge sync status đúng màu
- [ ] "Xem HS" link đến đúng route

---

### Task C-2-A-2: SCR-02-002 — Danh sách học sinh trong lớp (GDĐT)

**Route:** `src/app/(dashboard)/gddt/classes/[id]/students/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Học sinh – [Tên lớp]"
  Breadcrumbs: GDĐT > Lớp học > [Tên lớp] > Học sinh
  Actions: [Xuất Excel]

[Card thông tin lớp: Khối | GVCN | Sĩ số | Năm học]

[DataTable columns:]
  - STT
  - Mã HS (sortable)
  - Họ tên
  - Ngày sinh
  - Giới tính (badge: Nam/Nữ)
  - Hạnh kiểm (badge: Tốt/Khá/TB/Yếu)
  - Điểm TBchung
  - Điểm rèn luyện (nếu có)
  - Actions: [Nhập điểm RL] → link SCR-02-005
```

**API:**
- `GET /api/gddt/classes/{classId}/students` → PaginatedResponse\<GDDTStudent\>

**Types:**
```typescript
interface GDDTStudent {
  id: string
  code: string
  name: string
  dob: string
  gender: 'male' | 'female'
  conduct: 'excellent' | 'good' | 'average' | 'weak'
  avgScore: number
  conductScore?: number
  classId: string
}
```

**Deliverables:**
- [ ] Hiển thị đúng danh sách HS của lớp
- [ ] Xuất Excel hoạt động
- [ ] "Nhập điểm RL" link đúng

---

## PHẦN B — Điểm rèn luyện

### Task C-2-B-1: SCR-02-003 — Cấu hình điểm rèn luyện – Danh sách tiêu chí

**Route:** `src/app/(dashboard)/gddt/conduct-score/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Cấu hình điểm rèn luyện"
  Breadcrumbs: GDĐT > Điểm rèn luyện
  Actions: [+ Thêm tiêu chí] → /gddt/conduct-score/new

[DataTable columns:]
  - Mã tiêu chí
  - Tên tiêu chí
  - Điểm tối đa
  - Nhóm tiêu chí (badge)
  - Áp dụng cho khối (10/11/12/Tất cả)
  - Trạng thái (badge: Đang dùng / Tạm dừng)
  - Thứ tự (sortable)
  - Actions: [Sửa] [Xóa]
```

**Bulk actions:** Xóa nhiều tiêu chí

**API:**
- `GET /api/gddt/conduct-criteria` → ConductCriteria[]
- `DELETE /api/gddt/conduct-criteria/{id}`
- `DELETE /api/gddt/conduct-criteria/bulk` → bulk delete

**Deliverables:**
- [ ] DataTable CRUD (Edit/Delete)
- [ ] Delete confirm dialog
- [ ] Bulk delete hoạt động

---

### Task C-2-B-2: SCR-02-004 — Form thêm/sửa tiêu chí

**Route:** `src/app/(dashboard)/gddt/conduct-score/new/page.tsx` & `[id]/edit/page.tsx`

**Layout (Form page — full page, không dùng modal vì nhiều fields):**
```
[PageHeader]
  Title: "Thêm tiêu chí điểm rèn luyện" / "Sửa tiêu chí"
  Breadcrumbs: ... > Thêm tiêu chí
  Actions: [Hủy] [Lưu]

[Card: Thông tin tiêu chí]
  [FormField: Mã tiêu chí]         AppInput (required, unique)
  [FormField: Tên tiêu chí]        AppInput (required)
  [FormField: Nhóm tiêu chí]       AppSelect (options: Học tập|Hoạt động|Nếp sống|...)
  [FormField: Điểm tối đa]         AppInput type=number (required, min=0 max=100)
  [FormField: Điểm tối thiểu]      AppInput type=number
  [FormField: Áp dụng cho khối]    multi-checkbox (10 | 11 | 12)
  [FormField: Thứ tự hiển thị]     AppInput type=number
  [FormField: Mô tả]               AppTextarea (optional)
  [FormField: Trạng thái]          Switch (Đang dùng / Tạm dừng)
```

**Validation (zod):**
```typescript
const conductCriteriaSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(2).max(200),
  group: z.string(),
  maxScore: z.number().min(0).max(100),
  minScore: z.number().min(0).optional(),
  grades: z.array(z.enum(['10','11','12'])).min(1),
  order: z.number().int().positive(),
  description: z.string().optional(),
  active: z.boolean(),
})
```

**API:**
- `POST /api/gddt/conduct-criteria`
- `PUT /api/gddt/conduct-criteria/{id}`
- `GET /api/gddt/conduct-criteria/{id}` (edit mode: pre-fill)

**Deliverables:**
- [ ] Form validation đúng (required, min/max)
- [ ] Edit mode: pre-fill đúng data
- [ ] Submit → redirect danh sách + toast success
- [ ] Cancel → quay lại danh sách (không lưu)

---

### Task C-2-B-3: SCR-02-005 — Nhập điểm rèn luyện từng học sinh

**Route:** `src/app/(dashboard)/gddt/conduct-score/input/[studentId]/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Nhập điểm rèn luyện – [Tên HS]"
  Breadcrumbs: GDĐT > HS > [Tên HS] > Điểm RL
  Actions: [Hủy] [Lưu điểm]

[Card: Thông tin học sinh]
  Avatar | Họ tên | Mã HS | Lớp | Năm học

[Card: Nhập điểm]
  [Select: Học kỳ (HK1 | HK2 | Cả năm)]

  [Table nhập điểm:]
    Columns: Nhóm | Tiêu chí | Điểm tối đa | Điểm nhập (input number) | Ghi chú
    Rows: tất cả tiêu chí áp dụng cho khối HS
    Group rows by "Nhóm tiêu chí"
    Footer: Tổng điểm (auto-sum, readonly)

  [FormField: Nhận xét tổng quát]  AppTextarea

  [Card: Xếp loại]
    Dựa theo tổng điểm → hiển thị badge Xuất sắc/Tốt/Khá/TB/Yếu
    (Rules: configurable, default: ≥90=XS, ≥80=Tốt, ...)
```

**API:**
- `GET /api/gddt/conduct-score/{studentId}?term={term}&year={year}` → current scores
- `PUT /api/gddt/conduct-score/{studentId}` → save scores

**Deliverables:**
- [ ] Danh sách tiêu chí load đúng theo khối HS
- [ ] Input số điểm, validate min/max per criteria
- [ ] Tổng điểm tự động tính
- [ ] Xếp loại auto-update khi điểm thay đổi
- [ ] Lưu thành công → toast + redirect

---

### Task C-2-B-4: SCR-02-006 — Import điểm rèn luyện từ Excel

**Route:** `src/app/(dashboard)/gddt/conduct-score/import/page.tsx`

**Layout:** Dùng `ImportStepper` component (từ Phase 0)

**Config ImportStepper:**
```typescript
<ImportStepper
  title="Import điểm rèn luyện từ Excel"
  templateUrl="/templates/conduct-score-template.xlsx"
  onComplete={handleImport}
  validateFn={validateConductScoreRows}
  stepLabels={['Upload file', 'Kiểm tra dữ liệu', 'Xác nhận nhập']}
/>
```

**Template Excel columns:**
```
| Mã HS | Họ tên | Lớp | Học kỳ | [Tiêu chí 1] | [Tiêu chí 2] | ... | Nhận xét |
```

**Validation rules (validateFn):**
- Mã HS phải tồn tại trong hệ thống
- Điểm không vượt quá điểm tối đa của tiêu chí
- Học kỳ hợp lệ (HK1/HK2)

**API:**
- `POST /api/gddt/conduct-score/import` (bulk) → { imported, errors }

**Deliverables:**
- [ ] Download template link hoạt động
- [ ] Upload + parse Excel
- [ ] Preview với error rows highlighted
- [ ] Confirm import → loading → toast result

---

## PHẦN C — Học bổng

### Task C-2-C-1: SCR-02-007 — Cấu hình mức học bổng

**Route:** `src/app/(dashboard)/gddt/scholarship/levels/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Cấu hình học bổng – Mức học bổng"
  Tabs: [Mức học bổng] [Đợt xét tuyển]
  Actions: [+ Thêm mức]

[DataTable columns:]
  - Tên mức học bổng (vd: Loại 1, Loại 2, Học bổng khuyến khích)
  - Giá trị (số tiền hoặc %)
  - Điều kiện (điểm TB tối thiểu, hạnh kiểm)
  - Áp dụng cho khối
  - Trạng thái
  - Actions: [Sửa] [Xóa]

[Inline modal Form thêm/sửa mức:]
  Dùng shadcn Dialog (không cần trang mới)
  FormField: Tên mức | Giá trị | Điều kiện điểm | Điều kiện hạnh kiểm | Ghi chú
```

**API:**
- `GET /api/gddt/scholarship/levels`
- `POST /api/gddt/scholarship/levels`
- `PUT /api/gddt/scholarship/levels/{id}`
- `DELETE /api/gddt/scholarship/levels/{id}`

**Deliverables:**
- [ ] DataTable CRUD với modal dialog
- [ ] Modal form validate đúng
- [ ] Delete confirm

---

### Task C-2-C-2: SCR-02-008 — Cấu hình đợt xét tuyển học bổng

**Route:** Cùng page, tab "Đợt xét tuyển" (`?tab=sessions`)

**Layout:**
```
[Tab content: Đợt xét tuyển]

[DataTable columns:]
  - Tên đợt xét tuyển
  - Năm học
  - Học kỳ
  - Thời gian xét (từ ~ đến)
  - Mức học bổng áp dụng
  - Trạng thái (badge: Chưa xét / Đang xét / Đã xét)
  - Actions: [Sửa] [Xóa] [Xét học bổng →]

[Dialog form thêm/sửa đợt:]
  Tên đợt | Năm học | Học kỳ | Từ ngày | Đến ngày | Mức học bổng (multi-select)
```

**API:**
- `GET /api/gddt/scholarship/sessions`
- `POST /api/gddt/scholarship/sessions`
- `PUT /api/gddt/scholarship/sessions/{id}`
- `DELETE /api/gddt/scholarship/sessions/{id}`

**Deliverables:**
- [ ] Tab switch animation
- [ ] Form dialog hoạt động (create + edit)
- [ ] "Xét học bổng" → trigger background job → toast

---

### Task C-2-C-3: SCR-02-009 — Danh sách học sinh đạt học bổng

**Route:** `src/app/(dashboard)/gddt/scholarship/results/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Kết quả học bổng"
  Actions: [Xuất Excel] [In danh sách]

[FilterBar]
  - Select: Đợt xét tuyển (required)
  - Select: Mức học bổng (Tất cả | Loại 1 | ...)
  - Select: Khối (Tất cả | 10 | 11 | 12)
  - SearchBar: Tên HS / Mã HS

[Summary cards - StatGrid cols=3]
  [StatCard: Tổng số HS đạt]
  [StatCard: Tổng giá trị học bổng]
  [StatCard: % HS đạt / tổng HS]

[DataTable columns:]
  - STT
  - Mã HS
  - Họ tên
  - Lớp
  - Điểm TB
  - Hạnh kiểm
  - Điểm rèn luyện
  - Mức học bổng (badge)
  - Giá trị học bổng
  - Ghi chú
  [Readonly — không có actions sửa/xóa]
```

**API:**
- `GET /api/gddt/scholarship/results?sessionId={id}&level={}&grade={}&q={}`

**Deliverables:**
- [ ] Filter hoạt động đầy đủ
- [ ] StatCards summary đúng
- [ ] Export Excel toàn bộ kết quả
- [ ] In danh sách (window.print với CSS print styles)

---

## Phase 2 — Definition of Done

### Functionality
- [ ] SCR-02-001: Danh sách lớp GDĐT, filter, xem HS
- [ ] SCR-02-002: Danh sách HS trong lớp, xuất Excel
- [ ] SCR-02-003: Danh sách tiêu chí RL, CRUD
- [ ] SCR-02-004: Form thêm/sửa tiêu chí, validate
- [ ] SCR-02-005: Nhập điểm RL từng HS, tính tổng, xếp loại
- [ ] SCR-02-006: Import Excel điểm RL (3 bước)
- [ ] SCR-02-007: Mức học bổng CRUD (modal)
- [ ] SCR-02-008: Đợt xét tuyển CRUD (modal)
- [ ] SCR-02-009: Kết quả học bổng, filter, export

### Technical
- [ ] `npm run build` — success
- [ ] `npm run type-check` — 0 errors
- [ ] All API hooks dùng TanStack Query (loading, error, refetch)
- [ ] Form validation dùng react-hook-form + zod
- [ ] Export Excel dùng `xlsx` library

## Thời gian ước tính: 3–4 ngày
