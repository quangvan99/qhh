---
title: "Phase 4 — LMS: Kết quả, Bài tập, Thảo luận & Thi kiểm tra"
phase: 4
agent: "Agent D"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-06a-201..206
  - SCR-06a-301..305
  - SCR-06a-401..404
  - SCR-06b-501
  - SCR-06b-601
  - SCR-07-001..013
  - SCR-07b-001..015
wireframes: ["WF-06", "WF-07"]
estimated_days: "5–7 ngày"
---

# Phase 4 — LMS: Kết quả, Bài tập, Thảo luận & Thi kiểm tra

> ✅ Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.

## Phạm vi files

```
src/
├── app/(dashboard)/
│   ├── lms/
│   │   ├── classes/[id]/
│   │   │   ├── results/page.tsx              # SCR-06a-201
│   │   │   ├── results/[studentId]/page.tsx  # SCR-06a-202
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx                  # SCR-06a-301
│   │   │   │   ├── new/page.tsx              # SCR-06a-302 (create)
│   │   │   │   └── [assignmentId]/
│   │   │   │       ├── edit/page.tsx         # SCR-06a-302 (edit)
│   │   │   │       ├── submissions/page.tsx  # SCR-06a-303
│   │   │   │       └── submissions/[subId]/page.tsx # SCR-06a-304
│   │   │   ├── discussions/
│   │   │   │   ├── page.tsx                  # SCR-06a-401
│   │   │   │   ├── new/page.tsx              # SCR-06a-402 (create)
│   │   │   │   └── [threadId]/page.tsx       # SCR-06a-403
│   │   │   ├── teachers/page.tsx             # SCR-06b-501
│   │   │   └── reports/page.tsx              # SCR-06b-601
│   └── exam/
│       ├── question-bank/
│       │   ├── page.tsx                       # SCR-07-001 (tab NHCH)
│       │   ├── mcq/
│       │   │   ├── new/page.tsx               # SCR-07-002
│       │   │   ├── import/page.tsx            # SCR-07-003
│       │   │   └── [id]/edit/page.tsx
│       │   └── essay/
│       │       ├── new/page.tsx               # SCR-07-006
│       │       └── [id]/edit/page.tsx
│       ├── exams/
│       │   ├── page.tsx                       # SCR-07-008 (tab Đề thi)
│       │   ├── new/page.tsx                   # SCR-07-009
│       │   └── [id]/edit/page.tsx
│       └── sessions/
│           ├── page.tsx                       # SCR-07b-002
│           ├── new/page.tsx                   # SCR-07b-003 (create)
│           └── [sessionId]/
│               ├── edit/page.tsx              # SCR-07b-003 (edit)
│               ├── exams/
│               │   ├── page.tsx              # SCR-07b-004 (ca thi)
│               │   └── [examId]/
│               │       ├── students/page.tsx # SCR-07b-007
│               │       └── students/[sId]/page.tsx # SCR-07b-013..014
└── features/
    ├── lms/
    │   ├── results/
    │   ├── assignments/
    │   └── discussions/
    └── exam/
        ├── question-bank/
        ├── exams/
        └── sessions/
```

---

## TASK D-1: Kết quả học tập (WF-06a-2xx)

### SCR-06a-201 — Danh sách kết quả học tập

**Route:** `app/(dashboard)/lms/classes/[id]/results/page.tsx`

**Layout:**
```
[PageHeader: "Kết quả học tập — [Tên lớp]"]
  Actions: [Cập nhật học bạ] [Xuất Excel]

[FilterBar]
  - Select: Năm học | Học kỳ
  - SearchBar: Tên HS / Mã HS

[StatGrid cols=4]
  [Tổng HS] [Đã hoàn thành] [Đang học] [Chưa bắt đầu]

[DataTable columns:]
  - Avatar + Tên HS (link → /results/[studentId])
  - Mã HS
  - Tiến độ nội dung (progress bar %)
  - Điểm BT TB (trung bình bài tập)
  - Điểm thi cuối (nếu có)
  - Điểm tổng kết
  - Trạng thái hoàn thành (badge: Hoàn thành | Đang học | Chưa bắt đầu)
  - Actions:
    [Nhật ký] → modal SCR-06a-203
    [Thông báo] → modal SCR-06a-204
    [Thêm lượt thi] → modal SCR-06a-205
    [Xét hoàn thành/Bỏ xét] → inline action
```

**Bulk actions:** Chọn nhiều → Cập nhật học bạ (SCR-06a-206)

---

**SCR-06a-202 — Chi tiết kết quả học tập:**

**Route:** `app/(dashboard)/lms/classes/[id]/results/[studentId]/page.tsx`

**Layout:**
```
[PageHeader: "[Tên HS] — Chi tiết kết quả"]
  Breadcrumbs: ... > Kết quả > [Tên HS]
  Actions: [Xét hoàn thành] [Gửi thông báo]

[Card: Thông tin tóm tắt]
  Avatar | Tên | Lớp | Điểm tổng kết | Badge trạng thái

[Tabs: Nội dung học | Bài tập | Lịch sử thi]

[Tab "Nội dung học" — DataTable:]
  - Nhóm nội dung
  - Tên nội dung
  - Loại (badge: SCORM/Video/Text/File)
  - Lần truy cập
  - Thời gian học (phút)
  - Điểm (nếu SCORM có điểm)
  - Trạng thái (Hoàn thành/Chưa hoàn thành)
  - Lần cuối truy cập

[Tab "Bài tập" — DataTable:]
  - Tên bài tập
  - Hạn nộp
  - Thời điểm nộp
  - Điểm
  - Nhận xét GV

[Tab "Lịch sử thi" — DataTable:]
  - Tên ca thi
  - Thời điểm thi
  - Điểm
  - Rank
  - Actions: [Xem bài làm]

[Footer actions: [Xét hoàn thành (confirm 2 bước)]]
```

---

**SCR-06a-203 — Modal Nhật ký học tập:**
```
[DetailDrawer: "Nhật ký học tập — [Tên HS]" width=md]
  [FilterBar: date range]
  [Timeline list:]
    DD/MM | HH:mm | [icon loại] | Mô tả hành động | Duration
  [Pagination]
```

**SCR-06a-204 — Modal Gửi thông báo:**
```
[Dialog: "Gửi thông báo đến [Tên HS]"]
  [FormField: Tiêu đề*]    AppInput
  [FormField: Nội dung*]   AppTextarea (rows=5)
  [FormField: Gửi qua]     Checkbox: Email | Push notification
  [Hủy] [Gửi ngay]
```

**SCR-06a-205 — Modal Thêm lượt thi:**
```
[Dialog: "Thêm lượt thi cho [Tên HS]"]
  [Select: Ca thi* (searchable)]
  [FormField: Số lượt thêm] number input (default 1)
  [FormField: Ghi chú]      AppInput
  [Hủy] [Thêm lượt]
```

**SCR-06a-206 — Cập nhật học bạ:**
```
[Dialog: "Cập nhật học bạ"]
  [Info: Sẽ cập nhật học bạ cho {n} học sinh]
  [Select: Học kỳ*]
  [Checkbox: Ghi đè nếu đã có]
  [Hủy] [Xác nhận cập nhật]
  → Loading progress bar → toast kết quả
```

**API:**
- `GET /api/lms/classes/{id}/results`
- `GET /api/lms/classes/{id}/results/{studentId}`
- `GET /api/lms/classes/{id}/results/{studentId}/activity-log`
- `POST /api/lms/classes/{id}/results/{studentId}/notify`
- `POST /api/lms/classes/{id}/results/{studentId}/add-exam-attempt`
- `POST /api/lms/classes/{id}/results/complete`
- `POST /api/lms/classes/{id}/results/update-transcript`

**Deliverables:**
- [ ] DataTable kết quả với filter
- [ ] Chi tiết HS: 3 tabs đầy đủ
- [ ] Xét hoàn thành: confirm 2-bước
- [ ] 3 modals (nhật ký, thông báo, thêm lượt)
- [ ] Bulk cập nhật học bạ với progress

---

## TASK D-2: Bài tập GV (WF-06a-3xx)

### SCR-06a-301 — Danh sách bài tập trong lớp

**Route:** `app/(dashboard)/lms/classes/[id]/assignments/page.tsx`

**Layout:**
```
[PageHeader: "Bài tập — [Tên lớp]"]
  Actions: [+ Tạo bài tập]

[FilterBar: Status (Tất cả|Đang mở|Hết hạn|Nháp) | Sort by (Hạn nộp|Tên|Ngày tạo)]

[DataTable columns:]
  - Tên bài tập (link → submissions)
  - Loại (badge: Nộp file | Văn bản | Cả hai)
  - Mở từ — Hạn nộp
  - Đã nộp / Tổng (vd: "15/32")
  - Điểm tối đa
  - Trạng thái (badge: Nháp | Đang mở | Hết hạn)
  - Actions: [✏️ Sửa] [🗑 Xóa] [👁 Xem bài nộp]
```

**API:**
- `GET /api/lms/classes/{id}/assignments`
- `DELETE /api/lms/classes/{id}/assignments/{assignmentId}`

---

### SCR-06a-302 — Form tạo/sửa bài tập

**Route:** `app/(dashboard)/lms/classes/[id]/assignments/new/page.tsx`

**Layout:**
```
[PageHeader: "Tạo bài tập mới"]
  Actions: [Lưu nháp] [Xuất bản]

[Card: Thông tin bài tập]
  [FormField: Tiêu đề*]
  [FormField: Mô tả/Yêu cầu*]  Tiptap editor (full toolbar)
  [FormField: Loại nộp]         Radio: Nộp file | Văn bản | Cả hai
  [FormField: File đính kèm GV] multi-file upload

[Card: Thời gian & Điểm]
  [FormField: Ngày mở*]    DateTimePicker
  [FormField: Hạn nộp*]    DateTimePicker
  [FormField: Điểm tối đa] number input
  [FormField: Cho nộp muộn] Switch + DateTimePicker nếu bật

[Card: Cài đặt nâng cao]
  [FormField: Nộp lại] Switch + số lần tối đa
  [FormField: Ẩn điểm] Switch (mặc định: ẩn cho đến khi GV publish)
```

**Validation:**
```typescript
// Hạn nộp > Ngày mở
// Điểm tối đa 0–100
// Tiêu đề required
```

**API:** `POST/PUT /api/lms/classes/{id}/assignments`

**Deliverables:**
- [ ] Tiptap editor đầy đủ
- [ ] DateTimePicker cho ngày mở/hạn nộp
- [ ] Lưu nháp (status=draft), Xuất bản (status=open)
- [ ] Edit: pre-fill đúng, kể cả files đính kèm

---

### SCR-06a-303 — Danh sách bài nộp

**Route:** `app/(dashboard)/lms/classes/[id]/assignments/[assignmentId]/submissions/page.tsx`

**Layout:**
```
[PageHeader: "Bài nộp — [Tên bài tập]"]
  Actions: [SCR-06a-305: Thiết lập hiển thị điểm] [Xuất Excel]

[FilterBar: Trạng thái (Tất cả|Đã nộp|Chưa nộp|Nộp muộn) | Đã chấm (Tất cả|Đã chấm|Chưa chấm)]

[StatGrid cols=4]
  [Đã nộp] [Chưa nộp] [Đã chấm] [Điểm TB]

[DataTable columns:]
  - Avatar + Tên HS
  - Thời điểm nộp (relative: "2 ngày trước")
  - Trạng thái nộp (badge: Đúng hạn | Nộp muộn | Chưa nộp)
  - Điểm (editable inline hoặc link)
  - Đã chấm (badge)
  - Actions: [Xem & Chấm →]
```

**API:** `GET /api/lms/assignments/{id}/submissions`

---

### SCR-06a-304 — Chi tiết bài làm + chấm điểm

**Route:** `app/(dashboard)/lms/classes/[id]/assignments/[assignmentId]/submissions/[subId]/page.tsx`

**Layout (2-panel):**
```
Left panel (2/3):
  [Card: Bài làm của HS]
    Thông tin HS | Thời gian nộp
    [Văn bản (nếu có): render HTML]
    [Files đính kèm: list với download + preview (PDF inline)]

Right panel (1/3):
  [Card: Chấm điểm]
    [FormField: Điểm*]  number input (0–{maxScore})
    [FormField: Nhận xét] AppTextarea (rows=5, rich-text lite)
    [FormField: File phản hồi] FileUpload optional
    [Lưu điểm] button
    [Lưu & Chuyển sang bài tiếp] button

  [Card: Navigation]
    [← Bài trước] [Bài tiếp →]
    "Bài {n}/{total}"
```

**API:**
- `GET /api/lms/submissions/{subId}`
- `PUT /api/lms/submissions/{subId}/grade` → { score, feedback }

**Deliverables:**
- [ ] PDF preview inline bên trái
- [ ] Chấm điểm + feedback
- [ ] Navigation prev/next submission
- [ ] Keyboard shortcut: Ctrl+S save

---

### SCR-06a-305 — Thiết lập hiển thị điểm

```
[Dialog: "Thiết lập hiển thị điểm"]
  [Radio: Ẩn điểm với HS | Hiển thị điểm ngay | Hiển thị từ ngày]
  [Nếu "từ ngày": DateTimePicker]
  [Checkbox: Hiển thị nhận xét GV]
  [Checkbox: Hiển thị đáp án đúng (nếu có)]
  [Hủy] [Lưu cài đặt]
```

---

## TASK D-3: Thảo luận GV (WF-06a-4xx)

### SCR-06a-401 — Danh sách thảo luận (GV view)

**Route:** `app/(dashboard)/lms/classes/[id]/discussions/page.tsx`

**Layout:**
```
[PageHeader: "Thảo luận — [Tên lớp]"]
  Actions: [+ Tạo thảo luận]

[FilterBar: Trạng thái (Đang mở|Đóng|Tất cả) | Sort (Mới nhất|Nhiều reply)]

[Card list (không phải DataTable):]
  Mỗi thread card:
    [Avatar GV/HS] [Tên người đăng] [Badge: GV/HS] [thời gian]
    [Tiêu đề thảo luận - link]
    [Nội dung rút gọn (150 chars)]
    [💬 {n} replies] [👁 {views}] [Pin badge nếu ghim] [Đóng/Mở toggle]
    [Actions GV: ✏️ Sửa | 🗑 Xóa | 📌 Ghim/Bỏ ghim]
```

**API:** `GET /api/lms/classes/{id}/discussions`

---

### SCR-06a-402 — Form tạo/sửa thảo luận (GV)

```
[Dialog hoặc page: "Tạo thảo luận mới"]
  [FormField: Tiêu đề*]      AppInput
  [FormField: Nội dung*]     Tiptap editor (lite version)
  [FormField: File đính kèm] FileUpload
  [FormField: Ghim lên đầu]  Switch
  [FormField: Cho phép HS trả lời] Switch (default: on)
  [Hủy] [Đăng thảo luận]
```

---

### SCR-06a-403 — Chi tiết thảo luận (GV)

**Route:** `app/(dashboard)/lms/classes/[id]/discussions/[threadId]/page.tsx`

**Layout:**
```
[PageHeader: "[Tiêu đề thảo luận]"]
  Breadcrumbs: ... > Thảo luận > [Tiêu đề]
  Actions: [✏️ Sửa] [🗑 Xóa] [Đóng/Mở thảo luận]

[Card: Post gốc]
  [Avatar] [Tên | Role badge] [Thời gian đăng]
  [Nội dung HTML]
  [Files đính kèm]
  [Like count] [Reply button]

[Divider: {n} phản hồi]

[Thread replies (nested nếu cần, max 2 level):]
  Mỗi reply:
    [Avatar] [Tên | Role badge] [Thời gian]
    [Nội dung]
    [GV actions: Xóa reply]

[Form phản hồi ở cuối:]
  [Tiptap lite]
  [FileUpload optional]
  [Gửi phản hồi] button
```

**SCR-06a-404 — Dialog xóa thảo luận:** ConfirmDialog

---

## TASK D-4: Thiết lập GV & Báo cáo LMS (WF-06b)

### SCR-06b-501 — Thiết lập giảng viên cho lớp

**Route:** `app/(dashboard)/lms/classes/[id]/teachers/page.tsx`

**Layout:**
```
[PageHeader: "Giảng viên — [Tên lớp]"]
  Actions: [+ Thêm giảng viên]

[Card: Giảng viên chính]
  [Avatar + Tên + Email + Role badge]
  [Thay đổi] button

[Card: Giảng viên hỗ trợ]
  [DataTable: Avatar + Tên + Email + Vai trò trong lớp + Actions: Xóa]
  [+ Thêm giảng viên hỗ trợ] button

[Modal thêm GV: search user (role=teacher) + chọn vai trò (chính/hỗ trợ)]
```

---

### SCR-06b-601 — Báo cáo trong lớp học

**Route:** `app/(dashboard)/lms/classes/[id]/reports/page.tsx`

**Layout:**
```
[PageHeader: "Báo cáo lớp — [Tên lớp]"]
  Actions: [Xuất Excel]

[Tabs: Tổng quan | Tiến độ nội dung | Bài tập | Thi]

[Tab Tổng quan:]
  [StatGrid cols=4]
  [ChartCard: Phân bố tiến độ HS (pie chart)]
  [ChartCard: Hoạt động theo tuần (line chart)]

[Tab Tiến độ nội dung:]
  [FilterBar: Nhóm nội dung]
  [DataTable: Tên HS | Tiến độ% | SCORM điểm | Thời gian học | Lần truy cập]

[Tab Bài tập:]
  [DataTable: Tên bài tập | Đã nộp | Chưa nộp | Điểm TB | Phân phối điểm]

[Tab Thi:]
  [DataTable: Ca thi | Đã thi | Điểm TB | Cao nhất | Thấp nhất]
```

---

## TASK D-5: Ngân hàng câu hỏi (WF-07-001..007)

### SCR-07-001 — Trang ngân hàng câu hỏi

**Route:** `app/(dashboard)/exam/question-bank/page.tsx`

**Layout (2-panel):**
```
Left sidebar (1/4):
  [Cây danh mục câu hỏi — collapsible tree]
    Tất cả câu hỏi
    └── Toán học
        ├── Đại số
        └── Hình học
    └── Vật lý
    ...
  [+ Thêm danh mục] button

Main area (3/4):
  [Tabs: Trắc nghiệm | Tự luận]

  [FilterBar:]
    - Select: Loại (1 lựa chọn | Nhiều lựa chọn | Chính-phụ)
    - Select: Độ khó (Dễ | TB | Khó | Rất khó)
    - SearchBar

  [DataTable với tree rows (Chính-phụ):]
    Columns: Checkbox | Loại badge | Nội dung rút gọn | Danh mục | Độ khó | Tác giả | Ngày tạo | Actions
    Trắc nghiệm Chính-Phụ: có indent row con

  [Toolbar phía trên DataTable:]
    [+ Thêm câu hỏi] [Import Excel] [Kết xuất] [Xóa đã chọn]
```

**SCR-07-004 — Sao chép câu hỏi:**
Inline action trong row → `POST /api/exam/questions/{id}/copy`

**SCR-07-005 — Kết xuất câu hỏi:**
```
[Dialog: "Kết xuất câu hỏi"]
  [Câu hỏi đã chọn: {n} câu]
  [FormField: Format] Radio: Word (.docx) | PDF | Excel
  [FormField: Bao gồm đáp án] Checkbox
  [FormField: Sắp xếp] Select: Theo danh mục | Ngẫu nhiên
  [Hủy] [Kết xuất & Tải về]
```

**API:**
- `GET /api/exam/questions?type={}&difficulty={}&categoryId={}&q={}`
- `GET /api/exam/categories` (tree)
- `DELETE /api/exam/questions/bulk`
- `POST /api/exam/questions/export`

---

### SCR-07-002 — Form câu hỏi trắc nghiệm

**Route:** `app/(dashboard)/exam/question-bank/mcq/new/page.tsx`

**Layout (full page):**
```
[PageHeader: "Thêm câu hỏi trắc nghiệm"]
  Actions: [Lưu nháp] [Lưu]

[Tabs: 1 lựa chọn | Nhiều lựa chọn | Chính-Phụ]

[Card: Thông tin chung]
  [Select: Danh mục*]    (tree select)
  [Select: Độ khó*]      Dễ | TB | Khó | Rất khó
  [Select: Tags]         multi-select (tạo tag mới inline)

[Card: Nội dung câu hỏi]
  [Tiptap editor: Đề câu hỏi (hỗ trợ math KaTeX, ảnh)]

[Card: Đáp án — Tab "1 lựa chọn"]
  [Options list — sortable:]
    A. [Tiptap lite] ○ Đúng
    B. [Tiptap lite] ○ Đúng
    C. [Tiptap lite] ○ Đúng
    D. [Tiptap lite] ○ Đúng
    [+ Thêm đáp án]
  [FormField: Giải thích đáp án] Tiptap lite

[Card: Đáp án — Tab "Nhiều lựa chọn"]
  Giống trên nhưng radio → checkbox

[Card: Đáp án — Tab "Chính-Phụ"]
  [Phần chính: editor + options]
  [Phần phụ: danh sách câu con (sortable, add/remove)]
    Mỗi câu con: [Nội dung] + [Options 4 đáp án] + [Đúng]
```

**SCR-07-003 — Import câu hỏi Excel:**
`ImportStepper` với template đặc thù + validation

**Deliverables:**
- [ ] 3 loại câu hỏi: 1 lựa chọn / nhiều / chính-phụ
- [ ] Tiptap editor với KaTeX support
- [ ] Add/remove/reorder options
- [ ] Import Excel 3 bước
- [ ] Copy câu hỏi
- [ ] Kết xuất Word/PDF

---

### SCR-07-006 — Form câu hỏi tự luận

**Layout:**
```
[Card: Thông tin chung] (giống trắc nghiệm)
[Card: Đề bài] Tiptap editor full
[Card: Đáp án gợi ý] Tiptap editor + file đính kèm
[Card: Rubric chấm điểm (optional)]
  Table: Tiêu chí | Điểm tối đa | Mô tả
```

---

### SCR-07-008 — Danh sách đề thi

**Route:** `app/(dashboard)/exam/exams/page.tsx`

**Layout:**
```
[PageHeader: "Đề thi"]
  Actions: [+ Tạo đề thi]

[FilterBar: Danh mục | Năm học | SearchBar]

[DataTable columns:]
  - Tên đề thi (link → edit)
  - Danh mục
  - Tổng câu hỏi
  - Thời gian thi (phút)
  - Tác giả
  - Ngày tạo
  - Actions: [✏️ Sửa] [📋 Sao chép] [⬇ Xuất] [🗑 Xóa]
```

---

### SCR-07-009 — Form tạo/sửa đề thi

**Route:** `app/(dashboard)/exam/exams/new/page.tsx`

**Layout:**
```
[PageHeader: "Tạo đề thi mới"]
  Actions: [Lưu nháp] [Lưu đề thi]

[Card: Thông tin đề thi]
  [FormField: Tên đề thi*]
  [FormField: Danh mục*]
  [FormField: Thời gian thi (phút)*]
  [FormField: Điểm tổng*]
  [FormField: Mô tả]
  [FormField: Hướng dẫn làm bài] Tiptap lite

[Card: Cấu trúc đề thi]
  [Button: + Thêm phần thi]
  [List phần thi (sortable):]
    Mỗi phần: [≡ drag] [Tên phần] [Điểm] [Số câu] [✏️] [🗑]
    [Expand: danh sách câu trong phần]

[Footer: Tổng {n} câu | {m} điểm | {t} phút]
```

**SCR-07-010 — Modal thêm/sửa phần thi:**
```
[Dialog: "Cấu hình phần thi"]
  [FormField: Tên phần*]     (vd: "Phần A - Trắc nghiệm")
  [FormField: Loại câu hỏi]  Select: Trắc nghiệm 1 | Nhiều lựa chọn | Tự luận
  [FormField: Số điểm/câu]   number
  [Radio: Ngẫu nhiên | Chọn đích danh]
  [Nếu Ngẫu nhiên → mở SCR-07-011]
  [Nếu Đích danh → mở SCR-07-012]
```

**SCR-07-011 — Modal cấu trúc ngẫu nhiên:**
```
[Dialog: "Cấu trúc ngẫu nhiên"]
  [Table: Danh mục | Độ khó | Số câu chọn]
  [+ Thêm dòng]
  [Tổng: {n} câu]
  [Preview ngẫu nhiên] button
```

**SCR-07-012 — Modal chọn câu đích danh:**
```
[Dialog: "Chọn câu hỏi" width=lg]
  [FilterBar câu hỏi: danh mục + độ khó + search]
  [DataTable câu hỏi: checkbox + nội dung rút gọn + metadata]
  [Footer: {n} câu đã chọn | [Hủy] [Xác nhận]]
```

**SCR-07-013 — Xuất đề offline:**
```
[Dialog: "Xuất đề thi offline"]
  [FormField: Tiêu đề trên đề] AppInput
  [FormField: Format] Radio: Word | PDF
  [Checkbox: Bao gồm đáp án (bản riêng)]
  [FormField: Số đề trộn] (1–99)
  [Hủy] [Xuất đề]
```

**Deliverables:**
- [ ] Form đề thi: phần thi drag-drop
- [ ] 3 modals (phần thi, ngẫu nhiên, đích danh)
- [ ] Preview ngẫu nhiên hoạt động
- [ ] Xuất Word/PDF

---

## TASK D-8: Tổ chức thi (WF-07b)

### SCR-07b-001 — Danh mục đợt thi (tree)

**Route:** Sidebar bên trái trang tổ chức thi

**Layout:**
```
[Tree sidebar collapsible:]
  Tất cả đợt thi
  └── Năm học 2025-2026
      ├── HK1
      │   ├── Giữa kỳ
      │   └── Cuối kỳ
      └── HK2
[+ Thêm danh mục] inline
[Right-click context menu: Sửa | Xóa | Thêm con]
```

---

### SCR-07b-002 — Danh sách đợt thi

**Route:** `app/(dashboard)/exam/sessions/page.tsx`

**Layout:**
```
[PageHeader: "Tổ chức thi"]

[2-panel: Tree sidebar (1/4) | Main (3/4)]

Main panel:
  [FilterBar: Danh mục (from tree) | Ngày bắt đầu | Trạng thái]

  [DataTable columns:]
    - Tên đợt thi (link → chi tiết)
    - Danh mục
    - Năm học | Học kỳ
    - Từ ngày — Đến ngày
    - Số ca thi
    - Số học sinh dự thi
    - Trạng thái (badge: Chuẩn bị | Đang thi | Đã kết thúc)
    - Actions: [Sửa] [Xóa] [Xem ca thi]
```

---

### SCR-07b-003 — Form thêm/sửa đợt thi

**Route:** `app/(dashboard)/exam/sessions/new/page.tsx`

```
[PageHeader: "Tạo đợt thi"]

[Card: Thông tin đợt thi]
  [FormField: Tên đợt thi*]
  [FormField: Danh mục*]      tree-select
  [FormField: Năm học*]
  [FormField: Học kỳ*]
  [FormField: Từ ngày*]       DatePicker
  [FormField: Đến ngày*]      DatePicker
  [FormField: Mô tả]
  [FormField: Cài đặt thi]
    - Cho phép xem đáp án sau: Switch + DatePicker
    - Hiển thị điểm ngay: Switch
```

---

### SCR-07b-004 — Danh sách ca thi trong đợt

**Route:** `app/(dashboard)/exam/sessions/[sessionId]/exams/page.tsx`

```
[PageHeader: "Ca thi — [Tên đợt thi]"]
  Breadcrumbs: Tổ chức thi > [Đợt thi] > Ca thi
  Actions: [+ Thêm ca thi] [Import từ Excel]

[DataTable columns:]
  - Tên ca thi
  - Đề thi
  - Bắt đầu — Kết thúc
  - Số HS dự thi
  - Phòng thi
  - Trạng thái
  - Actions: [Sửa] [HS trong ca] [Xóa]
```

---

### SCR-07b-005 — Form thêm/sửa ca thi (manual)

```
[Dialog: "Thêm ca thi"]
  [FormField: Tên ca thi*]
  [FormField: Đề thi*]          searchable Select
  [FormField: Ngày thi*]        DatePicker
  [FormField: Giờ bắt đầu*]     TimePicker
  [FormField: Thời gian làm bài (phút)*]
  [FormField: Phòng thi]
  [FormField: Giám thị]         multi-select users
  [FormField: Số HS tối đa]
  [FormField: Ghi chú]
```

**SCR-07b-006 — Import ca thi từ Excel:** `ImportStepper`

---

### SCR-07b-007 — Danh sách HS trong ca thi

**Route:** `app/(dashboard)/exam/sessions/[sessionId]/exams/[examId]/students/page.tsx`

```
[PageHeader: "Học sinh — [Tên ca thi]"]
  Actions: [+ Thêm HS] [Import Excel] [Import ngoại lệ] [Xuất Excel]

[DataTable columns:]
  - Checkbox
  - Mã báo danh
  - Avatar + Tên HS
  - Lớp
  - Số phòng thi
  - Số báo danh
  - Ngoại lệ (badge nếu có: thời gian extra, lượt thi thêm)
  - Trạng thái thi (chưa thi | đang thi | đã thi)
  - Điểm (nếu đã có)
  - Actions: [Hồ sơ] [Ngoại lệ] [Xem bài]
```

**SCR-07b-008 — Popup thêm HS từ hệ thống:**
Giống SCR-04-011/012 nhưng cho ca thi

**SCR-07b-009, 010 — Import HS Excel (ca / đợt):**
2 ImportStepper khác nhau: cấp ca (1 ca) vs cấp đợt (nhiều ca)

---

### SCR-07b-011/012 — Form ngoại lệ

**SCR-07b-012 — Ngoại lệ từng HS:**
```
[Dialog: "Thiết lập ngoại lệ — [Tên HS]"]
  [FormField: Thời gian extra (phút)] number (0=không)
  [FormField: Lượt thi thêm]          number (0=không)
  [FormField: Ghi chú]                AppInput
  [Hủy] [Lưu ngoại lệ]
```

**SCR-07b-011 — Ngoại lệ hàng loạt:** ImportStepper với template ngoại lệ

---

### SCR-07b-013 — Hồ sơ thi học sinh

**Route:** `app/(dashboard)/exam/sessions/[sessionId]/exams/[examId]/students/[studentId]/page.tsx`

```
[PageHeader: "Hồ sơ thi — [Tên HS]"]

[Card: Thông tin thí sinh]
  Avatar | Tên | Lớp | Mã báo danh | Phòng thi

[Card: Kết quả thi]
  [Nếu chưa thi: badge "Chưa thi"]
  [Nếu đã thi: Thời gian nộp | Điểm | Rank | Thời gian làm]

[Actions: [Xem chi tiết bài làm] [Thêm lượt thi] [Thiết lập ngoại lệ]]
```

---

### SCR-07b-014 — Chi tiết bài làm

```
[PageHeader: "Bài làm — [Tên HS] — [Tên ca thi]"]
  Actions: [In bài làm] [Xuất PDF]

[Card: Tóm tắt]
  Điểm | Số câu đúng/{tổng} | Thời gian làm | Nộp lúc

[Card: Chi tiết từng câu]
  Mỗi câu:
    [Số câu] [Badge: Đúng/Sai/Không trả lời]
    [Đề câu hỏi]
    [Đáp án HS đã chọn — highlight đỏ nếu sai]
    [Đáp án đúng — highlight xanh]
    [Giải thích (nếu có)]
```

**SCR-07b-015 — Dialog xác nhận xóa:** ConfirmDialog

---

## Phase 4 — Definition of Done

### LMS Kết quả/Bài tập/Thảo luận
- [ ] SCR-06a-201..206: Kết quả học tập đầy đủ (list + detail + 3 modals)
- [ ] SCR-06a-301..305: Bài tập CRUD + submissions + chấm điểm
- [ ] SCR-06a-401..404: Thảo luận GV CRUD + thread view
- [ ] SCR-06b-501: Thiết lập GV
- [ ] SCR-06b-601: Báo cáo 4 tabs

### Thi & Kiểm tra
- [ ] SCR-07-001..005: Ngân hàng câu hỏi trắc nghiệm (list + filter + CRUD + import + export)
- [ ] SCR-07-006..007: Câu hỏi tự luận
- [ ] SCR-07-008..013: Đề thi builder với 3 modals + export
- [ ] SCR-07b-001..015: Tổ chức thi hoàn chỉnh (tree + đợt + ca + HS + ngoại lệ + hồ sơ)

### Technical
- [ ] `npm run build` clean
- [ ] Tiptap với KaTeX render đúng
- [ ] Export Word/PDF hoạt động (server-side hoặc client-side)
- [ ] All form validates đúng

## Thời gian ước tính: 5–7 ngày
