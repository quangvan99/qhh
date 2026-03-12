---
title: "Phase 3 — LMS: Quản lý lớp học & Nội dung"
phase: 3
agent: "Agent C"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-04-001..007
  - SCR-04-010..015
  - SCR-05a-001..010
  - SCR-05b-001..006
  - SCR-05c-001..011
wireframes: ["WF-04", "WF-05"]
estimated_days: "5–7 ngày"
---

# Phase 3 — LMS: Quản lý lớp học & Nội dung

> ✅ Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.

## Phạm vi files

```
src/
├── app/(dashboard)/
│   └── lms/
│       ├── classes/
│       │   ├── page.tsx                     # SCR-04-001
│       │   ├── dashboard/page.tsx            # SCR-04-002
│       │   ├── new/page.tsx                  # SCR-04-003
│       │   ├── import/page.tsx               # SCR-04-007
│       │   └── [id]/
│       │       ├── edit/page.tsx             # SCR-04-004
│       │       ├── students/
│       │       │   └── page.tsx              # SCR-04-010
│       │       └── content/
│       │           ├── page.tsx              # SCR-05a-001 (nhóm nội dung)
│       │           ├── copy/page.tsx         # SCR-05a-004
│       │           └── [groupId]/
│       │               ├── scorm/
│       │               │   ├── page.tsx      # SCR-05a-005
│       │               │   ├── new/page.tsx  # SCR-05a-006
│       │               │   └── [itemId]/
│       │               │       ├── edit/page.tsx     # SCR-05a-008
│       │               │       └── preview/page.tsx  # SCR-05a-009
│       │               ├── video/
│       │               │   └── page.tsx      # SCR-05b-001..003
│       │               ├── text/
│       │               │   └── page.tsx      # SCR-05b-004..006
│       │               ├── file/
│       │               │   └── page.tsx      # SCR-05c-001..003
│       │               ├── survey/
│       │               │   └── page.tsx      # SCR-05c-004..008
│       │               └── offline/
│       │                   └── page.tsx      # SCR-05c-009..011
└── features/
    └── lms/
        ├── classes/
        │   ├── components/
        │   │   ├── ClassCard.tsx
        │   │   ├── ClassForm.tsx
        │   │   ├── ClassDashboard.tsx
        │   │   ├── StudentList.tsx
        │   │   ├── AddStudentModal.tsx
        │   │   └── EnrollmentApproval.tsx
        │   ├── hooks/
        │   │   ├── useClasses.ts
        │   │   └── useClassStudents.ts
        │   ├── api/class.api.ts
        │   └── types/class.types.ts
        └── content/
            ├── components/
            │   ├── ContentGroupList.tsx     # sortable
            │   ├── ContentGroupForm.tsx
            │   ├── ScormList.tsx
            │   ├── ScormForm.tsx
            │   ├── ScormLibraryPicker.tsx
            │   ├── ScormViewer.tsx
            │   ├── CompletionConditions.tsx
            │   ├── VideoList.tsx
            │   ├── VideoForm.tsx
            │   ├── VideoPlayer.tsx
            │   ├── TextList.tsx
            │   ├── TextEditor.tsx           # Tiptap rich-text
            │   ├── FileList.tsx
            │   ├── FileUploadForm.tsx
            │   ├── DocumentViewer.tsx
            │   ├── SurveyList.tsx
            │   ├── SurveyBuilder.tsx        # drag-drop
            │   ├── SurveyPreview.tsx
            │   ├── SurveyReport.tsx
            │   ├── OfflineSessionList.tsx
            │   └── OfflineSessionForm.tsx
            ├── hooks/
            │   ├── useContentGroups.ts
            │   ├── useScorm.ts
            │   ├── useVideo.ts
            │   ├── useText.ts
            │   ├── useFile.ts
            │   ├── useSurvey.ts
            │   └── useOfflineSession.ts
            ├── api/content.api.ts
            └── types/content.types.ts
```

---

## TASK C-1: Quản lý lớp học (WF-04)

### SCR-04-001 — Danh sách lớp học

**Route:** `app/(dashboard)/lms/classes/page.tsx`

**Layout:**
```
[PageHeader]
  Title: "Quản lý lớp học"
  Actions: [+ Thêm lớp] [Import Excel] [Xuất Excel]

[FilterBar]
  - Select: Năm học
  - Select: Học kỳ (HK1 | HK2 | Cả năm)
  - Select: Trạng thái (Đang hoạt động | Kết thúc | Tất cả)
  - SearchBar: Tên lớp / Mã lớp

[DataTable columns:]
  - Ảnh/Icon lớp
  - Tên lớp (link → /lms/classes/[id])
  - Mã lớp
  - Giáo viên
  - Học sinh (số lượng)
  - Tiến độ (progress bar %)
  - Trạng thái (badge: Đang học | Kết thúc | Sắp khai giảng)
  - Ngày tạo
  - Actions: [🖊 Sửa] [📋 Sao chép] [🗑 Xóa]
```

**Dialogs:**
- SCR-04-005: `ConfirmDialog` xóa — "Bạn có chắc muốn xóa lớp [Tên lớp]? Thao tác này không thể hoàn tác."
- SCR-04-006: `ConfirmDialog` sao chép — "Sao chép lớp [Tên lớp]? Nội dung sẽ được sao chép, học sinh sẽ không."

**API:**
- `GET /api/lms/classes?year={}&term={}&status={}&q={}` → PaginatedResponse\<Class\>
- `DELETE /api/lms/classes/{id}`
- `POST /api/lms/classes/{id}/copy`

**Types:**
```typescript
interface LMSClass {
  id: string
  name: string
  code: string
  teacher: { id: string; name: string; avatar?: string }
  studentCount: number
  progress: number     // 0-100
  status: 'active' | 'completed' | 'upcoming'
  year: string
  term: 'HK1' | 'HK2' | 'full'
  createdAt: string
  thumbnail?: string
}
```

**Deliverables:**
- [ ] DataTable với filter + search
- [ ] Delete dialog hoạt động
- [ ] Copy dialog hoạt động, gọi API copy
- [ ] Progress bar hiển thị đúng
- [ ] Pagination

---

### SCR-04-002 — Dashboard lớp học (thông tin khối)

**Route:** `app/(dashboard)/lms/classes/dashboard/page.tsx`

**Layout:**
```
[PageHeader: "Dashboard lớp học"]

[FilterBar: Năm học | Học kỳ]

[StatGrid cols=4]
  [Total lớp] [Total học sinh] [Tỉ lệ hoàn thành TB] [Lớp đang hoạt động]

[Grid 2 cols]
  [ChartCard: Phân bố học sinh theo lớp — bar]
  [ChartCard: Tỉ lệ hoàn thành theo lớp — horizontal bar]

[DataTable: Top lớp có tiến độ thấp]
  Columns: Tên lớp | GV | HS | Tiến độ% | Actions: [Xem chi tiết]
```

**API:** `GET /api/lms/classes/dashboard-stats`

**Deliverables:**
- [ ] Stats load đúng
- [ ] Charts render với dữ liệu thực

---

### SCR-04-003 — Form thêm mới lớp học

**Route:** `app/(dashboard)/lms/classes/new/page.tsx`

**Layout:**
```
[PageHeader: "Tạo lớp học mới"]

[Card: Thông tin cơ bản]
  [FormField: Tên lớp*]         AppInput
  [FormField: Mã lớp*]          AppInput (auto-gen hoặc nhập tay)
  [FormField: Mô tả]            AppTextarea
  [FormField: Thumbnail]        Upload ảnh (preview)

[Card: Cài đặt lớp]
  [FormField: Năm học*]         AppSelect
  [FormField: Học kỳ*]          AppSelect (HK1 | HK2 | Cả năm)
  [FormField: Ngày khai giảng]  DatePicker
  [FormField: Ngày kết thúc]    DatePicker
  [FormField: Giáo viên*]       AppSelect (searchable, user picker)
  [FormField: Phương thức đăng ký] Radio: Tự do | Có phê duyệt | Khóa
  [FormField: Số học sinh tối đa] AppInput type=number

[Actions: [Hủy] [Lưu lớp học]]
```

**Validation:**
```typescript
const classSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(50),
  description: z.string().optional(),
  year: z.string(),
  term: z.enum(['HK1', 'HK2', 'full']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  teacherId: z.string().min(1),
  enrollmentType: z.enum(['open', 'approval', 'locked']),
  maxStudents: z.number().int().positive().optional(),
})
```

**API:** `POST /api/lms/classes` → { id, ...class }

**Deliverables:**
- [ ] Form validate đúng tất cả fields
- [ ] User picker (teacher) searchable
- [ ] Upload thumbnail + preview
- [ ] Submit → redirect /lms/classes/[id]/content

---

### SCR-04-004 — Form chỉnh sửa lớp học

**Route:** `app/(dashboard)/lms/classes/[id]/edit/page.tsx`

Giống SCR-04-003 nhưng:
- Pre-fill tất cả fields từ API `GET /api/lms/classes/{id}`
- Title: "Chỉnh sửa: [Tên lớp]"
- `PUT /api/lms/classes/{id}` khi submit

**Deliverables:**
- [ ] Pre-fill đúng tất cả fields
- [ ] Update thành công → redirect chi tiết lớp

---

### SCR-04-007 — Stepper import lớp từ Excel

**Route:** `app/(dashboard)/lms/classes/import/page.tsx`

Dùng `ImportStepper` component.

**Template columns:**
```
| Tên lớp* | Mã lớp* | Mô tả | Năm học* | Học kỳ* | Mã GV* | Phương thức đăng ký |
```

**Deliverables:**
- [ ] Download template
- [ ] Upload → parse → preview
- [ ] Validation: mã GV phải tồn tại, mã lớp unique
- [ ] Import → toast kết quả

---

## TASK C-2: Quản lý học sinh trong lớp (WF-04)

### SCR-04-010 — Danh sách học sinh trong lớp

**Route:** `app/(dashboard)/lms/classes/[id]/students/page.tsx`

**Layout:**
```
[PageHeader: "Học sinh — [Tên lớp]"]
  Breadcrumbs: LMS > Lớp học > [Tên lớp] > Học sinh
  Actions: [+ Thêm học sinh] [Import Excel] [Xuất Excel]

[Tabs: Tất cả | Chờ duyệt ({count}) | Đã xóa]

[DataTable columns:]
  - Checkbox (bulk)
  - Avatar + Tên học sinh
  - Mã học sinh
  - Email
  - Ngày tham gia
  - Tiến độ học (progress bar %)
  - Trạng thái (badge: Đã duyệt | Chờ duyệt | Bị xóa)
  - Actions: [Duyệt] (nếu chờ) | [Xóa khỏi lớp]
```

**SCR-04-014 — Dialog xóa học sinh:**
```
ConfirmDialog: "Xóa [Tên HS] khỏi lớp [Tên lớp]?"
  variant=danger
```

**SCR-04-015 — Duyệt/bỏ duyệt đăng ký:**
- Button "Duyệt" inline trong row (status=pending)
- Bulk duyệt: chọn nhiều → "Duyệt tất cả" trong bulk toolbar

**API:**
- `GET /api/lms/classes/{id}/students` → PaginatedResponse\<ClassStudent\>
- `POST /api/lms/classes/{id}/students/{studentId}/approve`
- `DELETE /api/lms/classes/{id}/students/{studentId}`
- `POST /api/lms/classes/{id}/students/bulk-approve`

**Deliverables:**
- [ ] Tab filter (all/pending/deleted)
- [ ] Inline approve button
- [ ] Bulk approve hoạt động
- [ ] Remove student dialog
- [ ] Export Excel danh sách

---

### SCR-04-011/012 — Thêm học sinh từ hệ thống

**Component:** `AddStudentModal.tsx` (shadcn Dialog)

**Layout modal:**
```
[Dialog: "Thêm học sinh vào lớp"]
  [SearchBar: Tìm theo tên, email, mã HS]
  [DataTable (paginated, small):]
    Checkbox | Avatar + Tên | Mã HS | Lớp hiện tại | Email
  [Footer: {n} học sinh đã chọn | [Hủy] [Thêm vào lớp]]
```

**Behavior:**
- Chỉ hiển thị user có role=student chưa có trong lớp
- Multi-select
- `POST /api/lms/classes/{id}/students/bulk-add`

**Deliverables:**
- [ ] Search lọc đúng
- [ ] Multi-select + add
- [ ] Không hiển thị HS đã trong lớp

---

### SCR-04-013 — Import học sinh từ Excel

Dùng `ImportStepper`.

**Template:** `| Mã HS* |` hoặc `| Email* |`

**Deliverables:** Giống SCR-04-007

---

## TASK C-3: Quản lý nhóm nội dung (WF-05a-001..004)

### SCR-05a-001 — Danh sách nhóm nội dung (drag-drop sort)

**Route:** `app/(dashboard)/lms/classes/[id]/content/page.tsx`

**Layout:**
```
[PageHeader: "Nội dung lớp học — [Tên lớp]"]
  Breadcrumbs: LMS > [Tên lớp] > Nội dung
  Actions: [+ Thêm nhóm] [Sao chép từ lớp khác]

[Sortable list — @dnd-kit/sortable]
  Mỗi nhóm là một accordion card:
  ┌─────────────────────────────────────────────────────┐
  │ ≡ [Tên nhóm]  [icon loại]  [n items]  [✏️ Sửa] [🗑] │
  ├─────────────────────────────────────────────────────┤
  │ (Collapsed) — click để expand                       │
  │ (Expanded) — grid 4 cols content items:             │
  │   [SCORM card] [Video card] [Text card] [+Thêm]     │
  └─────────────────────────────────────────────────────┘

  Drag handle (≡) để reorder nhóm
```

**Content item card mini:**
```
[Icon type]  [Tên nội dung]  [status badge]  [...]
```

**SCR-05a-002 — Modal thêm nhóm:**
```
Dialog: "Thêm nhóm nội dung"
  [FormField: Tên nhóm*]      AppInput
  [FormField: Mô tả]          AppTextarea
  [FormField: Hiển thị]       Switch (ẩn/hiện cho HS)
  [Hủy] [Thêm nhóm]
```

**SCR-05a-003 — Modal sửa nhóm:** Giống thêm, pre-fill

**SCR-05a-004 — Sao chép nội dung từ lớp khác:**
```
Dialog: "Sao chép nội dung từ lớp khác"
  [SearchBar: Tìm lớp học]
  [List lớp: chọn 1 lớp]
  [Sau khi chọn lớp: checkbox list các nhóm nội dung]
  [Hủy] [Sao chép]
```

**API:**
- `GET /api/lms/classes/{id}/content-groups`
- `POST /api/lms/classes/{id}/content-groups`
- `PUT /api/lms/classes/{id}/content-groups/{groupId}`
- `DELETE /api/lms/classes/{id}/content-groups/{groupId}`
- `PUT /api/lms/classes/{id}/content-groups/reorder` (send sorted ids)
- `POST /api/lms/classes/{id}/content-groups/copy-from/{sourceClassId}`

**Deliverables:**
- [ ] Drag-drop reorder hoạt động + save order
- [ ] Accordion expand/collapse
- [ ] Modal thêm/sửa nhóm
- [ ] Sao chép từ lớp khác

---

## TASK C-4: Nội dung SCORM (WF-05a-005..010)

### SCR-05a-005 — Danh sách SCORM trong nhóm

**Route:** Là section trong content group page

**Layout (card list trong expanded group):**
```
[Thêm SCORM dropdown: Upload mới | Chọn từ thư viện]
[List SCORM items:]
  [SCORM icon] [Tên] [Size MB] [Trạng thái upload] [📋 Điều kiện] [✏️] [🗑]
```

**SCR-05a-006 — Form SCORM upload:**
```
[Modal: "Thêm SCORM"]
  [FormField: Tên SCORM*]        AppInput
  [FormField: Upload file*]      FileUpload (accept .zip, drag-drop)
                                 Progress bar khi upload
  [FormField: Mô tả]             AppTextarea
  [FormField: Điểm hoàn thành]  AppInput number (0-100)
  [Hủy] [Upload]
```

**SCR-05a-007 — Picker thư viện SCORM:**
```
[Dialog: "Chọn SCORM từ thư viện"]
  [SearchBar + filter loại]
  [Grid cards: SCORM thumbnail | Tên | Ngày tạo | Chọn]
  [Pagination]
  [Hủy] [Chọn ({n})]
```

**SCR-05a-008 — Edit SCORM:**
Form update tên, mô tả, điều kiện (không thể thay đổi file đã upload)

**SCR-05a-009 — SCORM Preview:**
```
[Full-page preview layout]
[Header: Tên SCORM | [Đóng preview]]
[iframe: src="/api/lms/scorm/{id}/launch" style="width:100%;height:calc(100vh-4rem)"]
```

**SCR-05a-010 — Điều kiện hoàn thành SCORM:**
```
[Dialog: "Thiết lập điều kiện hoàn thành"]
  [Radio: Dựa theo SCORM (tracking) | Dựa theo điểm | Thủ công]
  [Nếu "Dựa theo điểm": FormField điểm tối thiểu]
  [FormField: Số lần thi lại tối đa]
  [Hủy] [Lưu]
```

**API:**
- `POST /api/lms/scorm/upload` (multipart) → { id, name, size, url }
- `GET /api/lms/scorm/library` (reusable SCORM list)
- `POST /api/lms/classes/{id}/content-groups/{gId}/scorm`
- `DELETE /api/lms/classes/{id}/content-groups/{gId}/scorm/{scormId}`
- `PUT /api/lms/classes/{id}/content-groups/{gId}/scorm/{scormId}/conditions`

**Deliverables:**
- [ ] Upload SCORM .zip với progress bar
- [ ] Library picker hoạt động
- [ ] Preview iframe launch
- [ ] Conditions dialog save

---

## TASK C-5: Nội dung Video (WF-05b-001..003)

### SCR-05b-001 — Danh sách Video trong nhóm

Tương tự SCORM list, nhưng loại=Video. Thêm nút: "Upload video" | "Embed URL"

### SCR-05b-002 — Form Video upload:
```
[Dialog: "Upload video"]
  [FormField: Tên*]
  [FileUpload: accept video/*, max 500MB, progress bar]
  [FormField: Mô tả]
  [FormField: Thumbnail] optional
```

### SCR-05b-003 — Form Video embed URL:
```
[Dialog: "Thêm video từ URL"]
  [FormField: Tên*]
  [FormField: URL*]   AppInput (YouTube/Vimeo/direct URL)
                      Preview iframe khi URL valid
  [FormField: Mô tả]
```

**Player:** `react-player` cho embed + native HTML5 video cho upload

**API:**
- `POST /api/lms/video/upload`
- `POST /api/lms/classes/{id}/content-groups/{gId}/video`

**Deliverables:**
- [ ] Upload video với progress
- [ ] Embed URL với live preview
- [ ] Video player render đúng (YouTube, Vimeo, direct)

---

## TASK C-6: Nội dung Văn bản (WF-05b-004..006)

### SCR-05b-004 — Danh sách Văn bản trong nhóm

Tương tự, loại=Text

### SCR-05b-005 — Form Văn bản:
```
[Full-page editor layout]
[PageHeader: "Soạn văn bản — [Nhóm]"]
  Actions: [Preview] [Lưu nháp] [Xuất bản]

[FormField: Tiêu đề*]

[Tiptap Rich-text Editor]
  Toolbar: Bold | Italic | Underline | H1/H2/H3 | List | Link | Image | Table | Code
  Content editable area (min-height 400px)

[FormField: File đính kèm]
  Drag-drop multi-file upload
  List file đã upload: icon loại | tên | size | [Xóa]
```

**SCR-05b-006 — Preview Văn bản:**
```
[Dialog hoặc /preview page]
  Render HTML của Tiptap output
  File đính kèm: list download links
```

**API:**
- `POST /api/lms/classes/{id}/content-groups/{gId}/text`
- `PUT /api/lms/classes/{id}/content-groups/{gId}/text/{textId}`
- `POST /api/lms/upload/attachment`

**Deliverables:**
- [ ] Tiptap editor với full toolbar
- [ ] File đính kèm upload/delete
- [ ] Preview render đúng HTML
- [ ] Save draft không redirect

---

## TASK C-7: Nội dung File (WF-05c-001..003)

### SCR-05c-001 — Danh sách File trong nhóm

### SCR-05c-002 — Form upload File:
```
[Dialog: "Upload tài liệu"]
  [FormField: Tên*]
  [FileUpload: accept .pdf,.docx,.xlsx,.pptx, max 50MB]
  [FormField: Mô tả]
  [Preview thumbnail dựa theo loại file]
```

### SCR-05c-003 — Document viewer:
- PDF: `react-pdf` (PDFDocument + Page components)
- Word/Excel: chuyển đổi sang ảnh hoặc Google Docs viewer embed
- Toolbar: zoom in/out, full-screen, download

**API:** `GET /api/lms/files/{id}/stream`

**Deliverables:**
- [ ] PDF inline viewer (phân trang)
- [ ] Download button luôn hoạt động
- [ ] Zoom control

---

## TASK C-8: Khảo sát (WF-05c-004..008)

### SCR-05c-004 — Danh sách Khảo sát trong nhóm

### SCR-05c-005 — Survey Builder (drag-drop):

**Layout:**
```
[Full-page builder]
[PageHeader: "Xây dựng khảo sát"]
  Actions: [Preview] [Lưu]

[2-col layout]
Left (questions panel):
  [+ Thêm câu hỏi] dropdown:
    Trắc nghiệm 1 lựa chọn | Trắc nghiệm nhiều lựa chọn | Văn bản tự do | Thang điểm | Ma trận

  [SortableList câu hỏi — @dnd-kit/sortable]
    Mỗi câu: [drag handle] [icon type] [nội dung rút gọn] [✏️] [🗑]

Right (editor panel):
  [Khi chọn câu: hiển thị editor cho câu đó]
  Editor cho trắc nghiệm:
    [Nội dung câu hỏi — Tiptap lite]
    [Options: list drag-drop + add/remove + radio đúng]
    [Bắt buộc: Switch]

  Editor cho văn bản:
    [Nội dung câu hỏi]
    [Max length input]
    [Placeholder text]
```

### SCR-05c-006 — Cấu hình khảo sát:
```
[Dialog cài đặt khảo sát]
  Tên khảo sát | Mô tả | Thời hạn | Ẩn danh | Xem kết quả ngay | Giới hạn lần làm
```

### SCR-05c-007 — Preview khảo sát:
Render form với tất cả câu hỏi, readonly

### SCR-05c-008 — Báo cáo kết quả khảo sát:
```
[PageHeader: "Báo cáo — [Tên khảo sát]"]
[StatGrid cols=3: Đã làm | Chưa làm | Hoàn thành%]
[Per câu hỏi:]
  Trắc nghiệm → Pie chart (distribution)
  Văn bản → List responses (paginated)
[Export Excel]
```

**API:**
- `POST/PUT /api/lms/surveys`
- `GET /api/lms/surveys/{id}/responses`
- `GET /api/lms/surveys/{id}/report`

**Deliverables:**
- [ ] Builder drag-drop reorder câu hỏi
- [ ] Editor cho mỗi loại câu hỏi
- [ ] Preview render đúng
- [ ] Báo cáo: chart + list responses

---

## TASK C-9: Buổi học offline (WF-05c-009..011 / SCR-06a-101..102)

### SCR-05c-009 / SCR-06a-101 — Danh sách buổi offline

**Route:** `app/(dashboard)/lms/classes/[id]/content/[groupId]/offline/page.tsx`

**Layout:**
```
[PageHeader: "Buổi học offline"]
  Actions: [+ Thêm buổi học]

[DataTable columns:]
  - Ngày giờ
  - Tiêu đề buổi học
  - Địa điểm
  - Số tham dự dự kiến
  - File tài liệu (link)
  - Trạng thái (badge: Sắp diễn ra | Đang diễn ra | Đã qua)
  - Actions: [Sửa] [Xóa]
```

### SCR-05c-010 / SCR-06a-102 — Form thêm/sửa buổi offline:
```
[Dialog: "Thêm buổi học offline"]
  [FormField: Tiêu đề*]
  [FormField: Ngày*]     DatePicker
  [FormField: Giờ bắt đầu*] TimePicker
  [FormField: Giờ kết thúc]  TimePicker
  [FormField: Địa điểm]
  [FormField: Mô tả]     AppTextarea
  [FormField: Tài liệu]  FileUpload (multi)
```

**SCR-05c-011 — Dialog xóa buổi offline:** ConfirmDialog

**API:**
- `GET/POST/PUT/DELETE /api/lms/classes/{id}/offline-sessions`

**Deliverables:**
- [ ] CRUD buổi offline hoạt động
- [ ] Form validate ngày giờ (end > start)
- [ ] Badge trạng thái đúng theo thời gian hiện tại
- [ ] Upload tài liệu đính kèm

---

## Phase 3 — Definition of Done

### Lớp học (WF-04)
- [ ] SCR-04-001: DataTable lớp học, filter, CRUD, copy, import
- [ ] SCR-04-002: Dashboard thống kê lớp học
- [ ] SCR-04-003/004: Form tạo/sửa lớp, validate đầy đủ
- [ ] SCR-04-007: Import Excel 3 bước
- [ ] SCR-04-010: Danh sách HS, tabs, bulk approve, remove
- [ ] SCR-04-011/012: Modal thêm HS từ hệ thống
- [ ] SCR-04-013: Import HS Excel

### Nội dung (WF-05)
- [ ] SCR-05a-001: Sortable nhóm nội dung + accordion
- [ ] SCR-05a-002/003: CRUD nhóm (modal)
- [ ] SCR-05a-004: Copy từ lớp khác
- [ ] SCR-05a-005..010: SCORM upload/library/preview/conditions
- [ ] SCR-05b-001..006: Video (upload/embed) + Văn bản (Tiptap)
- [ ] SCR-05c-001..003: File upload + PDF viewer
- [ ] SCR-05c-004..008: Survey builder + preview + report
- [ ] SCR-05c-009..011: Buổi offline CRUD

### Technical
- [ ] Drag-drop (@dnd-kit) hoạt động mượt
- [ ] Tiptap editor render HTML đúng
- [ ] File upload: progress bar + error handling
- [ ] `npm run build` clean

## Thời gian ước tính: 5–7 ngày
