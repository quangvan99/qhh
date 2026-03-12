---
title: "Phase 5 — Người học: Học tập & Thi trực tuyến"
phase: 5
agent: "Agent C"
parallel: true
depends_on: "Phase 0"
screens:
  - SCR-03a1-001..006
  - SCR-03a2-001..008
  - SCR-03b-001..005
wireframes: ["WF-03"]
estimated_days: "3–4 ngày"
---

# Phase 5 — Người học: Học tập & Thi trực tuyến

> ✅ Chạy **SONG SONG** với các Phase khác sau khi Phase 0 xong.
>
> **Đây là phía học sinh** — giao diện người dùng cuối cho học sinh tương tác với hệ thống.

## Phạm vi files

```
src/
├── app/(dashboard)/
│   ├── my-classes/
│   │   ├── page.tsx                           # SCR-03a1-001 (đăng ký lớp)
│   │   └── [classId]/
│   │       ├── page.tsx                       # SCR-03a1-002 (cấu trúc nội dung)
│   │       ├── about/page.tsx                 # SCR-03a1-003 (giới thiệu)
│   │       ├── results/page.tsx               # SCR-03a1-004 (kết quả HS)
│   │       ├── history/page.tsx               # SCR-03a1-005 (lịch sử truy cập)
│   │       ├── announcements/page.tsx         # SCR-03a1-006 (thông báo)
│   │       ├── assignments/
│   │       │   ├── page.tsx                   # SCR-03a2-001 (danh sách BT)
│   │       │   └── [assignmentId]/
│   │       │       ├── page.tsx               # SCR-03a2-002 (chi tiết BT)
│   │       │       ├── submit/page.tsx        # SCR-03a2-003 (nộp bài)
│   │       │       └── result/page.tsx        # SCR-03a2-004 (kết quả)
│   │       └── discussions/
│   │           ├── page.tsx                   # SCR-03a2-005 (danh sách)
│   │           ├── new/page.tsx               # SCR-03a2-007 (tạo mới)
│   │           └── [threadId]/page.tsx        # SCR-03a2-006+008 (xem + reply)
│   └── my-exams/
│       ├── page.tsx                           # SCR-03b-001 (danh sách ca thi)
│       ├── register/
│       │   └── [examId]/page.tsx              # SCR-03b-002 (đăng ký thi)
│       ├── room/
│       │   └── [examId]/page.tsx              # SCR-03b-003 (phòng thi)
│       ├── result/
│       │   └── [examId]/page.tsx              # SCR-03b-004 (kết quả thi)
│       └── history/page.tsx                   # SCR-03b-005 (lịch sử)
└── features/
    └── lms/
        └── student/
            ├── components/
            │   ├── ClassCard.tsx               # card lớp học (student view)
            │   ├── ContentViewer.tsx           # viewer cho tất cả loại nội dung
            │   ├── ContentSidebar.tsx          # cây nội dung bên trái
            │   ├── ScormLauncher.tsx           # iframe SCORM
            │   ├── VideoViewerStudent.tsx
            │   ├── FileViewerStudent.tsx
            │   ├── SurveyForm.tsx              # điền khảo sát
            │   ├── AssignmentCard.tsx
            │   ├── SubmitForm.tsx
            │   ├── ExamCard.tsx
            │   ├── ExamRoom.tsx               # ⭐ phòng thi (critical)
            │   ├── ExamTimer.tsx
            │   ├── QuestionNav.tsx
            │   └── ExamResult.tsx
            ├── hooks/
            │   ├── useMyClasses.ts
            │   ├── useClassContent.ts
            │   ├── useAssignments.ts
            │   ├── useDiscussions.ts
            │   ├── useMyExams.ts
            │   └── useExamSession.ts
            └── api/
                └── student.api.ts
```

---

## TASK C-S1: Xem lớp học — Student (WF-03, nhóm 3a1)

### SCR-03a1-001 — Đăng ký lớp học

**Route:** `app/(dashboard)/my-classes/page.tsx`

**Layout:**
```
[PageHeader: "Lớp học của tôi"]
  Actions: [🔍 Tìm & Đăng ký lớp mới]

[Tabs: Đang học ({n}) | Đã hoàn thành | Tất cả]

[Card grid (3 cols, responsive 2/1):]
  Mỗi ClassCard:
    [Thumbnail ảnh lớp]
    [Tên lớp]
    [Giáo viên: avatar + tên]
    [Progress bar: {%} hoàn thành]
    [Badge trạng thái]
    [→ Vào lớp] button
```

**"Tìm & Đăng ký" dialog:**
```
[Dialog: "Đăng ký lớp học mới"]
  [SearchBar: tìm theo tên lớp]
  [List lớp mở đăng ký:]
    Card: Thumbnail | Tên | GV | {n} HS | Badge: Còn chỗ/Hết chỗ/Chờ duyệt
    [Đăng ký] button
  [Pagination]
→ Click Đăng ký → ConfirmDialog → POST /api/lms/classes/{id}/enroll
→ Nếu lớp cần phê duyệt: toast "Đã gửi yêu cầu, chờ GV duyệt"
→ Nếu tự do: toast "Đăng ký thành công" + vào lớp ngay
```

**API:**
- `GET /api/student/my-classes`
- `GET /api/lms/classes/public?q={}&status=open`
- `POST /api/lms/classes/{id}/enroll`

**Deliverables:**
- [ ] Card grid 3 cols responsive
- [ ] Tabs filter đúng
- [ ] Dialog tìm/đăng ký lớp
- [ ] Trạng thái đăng ký đúng (confirm/pending)

---

### SCR-03a1-002 — Xem cấu trúc nội dung lớp học

**Route:** `app/(dashboard)/my-classes/[classId]/page.tsx`

**Layout (2-panel):**
```
Left sidebar (1/4):
  [Tab bar: Nội dung | Giới thiệu | Kết quả | Thông báo]

  [Cây nội dung — ContentSidebar.tsx]
    Mỗi nhóm (accordion):
      [Icon nhóm] [Tên nhóm]
      └── [icon loại] [Tên item] [✓ nếu hoàn thành]
      └── [icon loại] [Tên item] [→ nếu đang học]

Main area (3/4):
  [ContentViewer.tsx]
    Render dựa theo loại content đang xem:
    - SCORM: ScormLauncher (iframe)
    - Video: VideoPlayer (react-player)
    - Text: render HTML
    - File: FileViewer (react-pdf / download)
    - Survey: SurveyForm (điền khảo sát)
    - Offline: info buổi học (địa điểm, thời gian, tài liệu)

    [Navigation bar cuối:]
      [← Nội dung trước] [Đánh dấu hoàn thành] [Nội dung tiếp →]
```

**State:**
- `selectedContentId`: item đang xem (URL param hoặc query)
- Auto-mark hoàn thành khi xem đủ (SCORM tracking, video >80%, text scroll)

**API:**
- `GET /api/student/classes/{id}/content-tree`
- `POST /api/student/classes/{id}/content/{contentId}/complete`
- `GET /api/student/classes/{id}/content/{contentId}/progress`

**Deliverables:**
- [ ] Sidebar cây nội dung với expand/collapse
- [ ] ContentViewer render đúng theo loại
- [ ] SCORM iframe launch
- [ ] Video player (YouTube + upload)
- [ ] Mark hoàn thành + update sidebar icon
- [ ] Navigation prev/next

---

### SCR-03a1-003 — Xem thông tin giới thiệu lớp học

**Route:** Tab "Giới thiệu" trong page lớp học

**Layout:**
```
[Class banner: thumbnail + overlay tên lớp]

[Card: Thông tin lớp]
  Giáo viên (avatar + tên)
  Học kỳ | Năm học
  Ngày khai giảng — Ngày kết thúc
  Số học sinh đang học
  Mô tả lớp (HTML rendered)
```

---

### SCR-03a1-004 — Xem tổng quan kết quả học tập (HS)

**Route:** Tab "Kết quả" trong page lớp học

**Layout:**
```
[StatGrid cols=3]
  [Tiến độ nội dung %]  progress circular
  [Điểm BT TB]
  [Điểm thi (nếu có)]

[Progress bar: nội dung đã học / tổng]

[Card: Kết quả từng bài tập]
  DataTable lite: Tên BT | Hạn nộp | Điểm | Nhận xét GV

[Card: Kết quả thi]
  DataTable lite: Ca thi | Ngày | Điểm | Rank
```

---

### SCR-03a1-005 — Lịch sử truy cập lớp học

**Route:** Tab "Lịch sử" hoặc page riêng

**Layout:**
```
[FilterBar: DateRange]
[Timeline list — chronological:]
  [DD/MM HH:mm] [icon] [Đã xem: Tên nội dung] [Duration: X phút]
  [DD/MM HH:mm] [icon] [Đã nộp bài: Tên BT]
  ...
[Load more button (infinite scroll hoặc paginate)]
```

---

### SCR-03a1-006 — Thông báo trong lớp học

**Route:** Tab "Thông báo"

**Layout:**
```
[Notification list:]
  Mỗi thông báo:
    [Avatar người gửi] [Tên] [thời gian]
    [Tiêu đề - bold nếu chưa đọc]
    [Nội dung rút gọn]
    [→ Xem đầy đủ] expand
    [Badge: Mới nếu <24h]
```

---

## TASK C-S2: Bài tập phía HS (WF-03, nhóm 3a2)

### SCR-03a2-001 — Danh sách bài tập (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/assignments/page.tsx`

**Layout:**
```
[PageHeader: "Bài tập — [Tên lớp]"]

[Tabs: Chưa nộp ({n}) | Đã nộp | Hết hạn]

[Card list (không dùng DataTable — UX friendlier):]
  Mỗi AssignmentCard:
    [Icon loại] [Tiêu đề bài tập]
    [Hạn nộp: Thứ X, DD/MM/YYYY HH:mm]
    [CountdownTimer nếu còn <24h: "Còn 2 giờ 30 phút"]
    [Badge: Chưa nộp (red) | Đã nộp (green) | Hết hạn (gray) | Nộp muộn (orange)]
    [Điểm: nếu đã chấm và GV cho xem]
    [→ Xem chi tiết] button
```

**API:** `GET /api/student/classes/{id}/assignments`

**Deliverables:**
- [ ] Tabs filter đúng
- [ ] Countdown timer hiển thị khi <24h
- [ ] Badge status đúng

---

### SCR-03a2-002 — Chi tiết bài tập (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/assignments/[assignmentId]/page.tsx`

**Layout:**
```
[PageHeader: "[Tên bài tập]"]
  Breadcrumbs: Bài tập > [Tên]
  Actions: [Nộp bài] (nếu chưa nộp và chưa hết hạn)

[Card: Thông tin bài tập]
  Hạn nộp | Điểm tối đa | Loại nộp
  [CountdownTimer nếu còn hạn]

[Card: Đề bài]
  [Render HTML from Tiptap]
  [Files đính kèm GV: list với download links]

[Card: Bài nộp của tôi (nếu đã nộp)]
  Thời điểm nộp | Điểm | Nhận xét GV
  [Files tôi đã nộp]
  [Nộp lại (nếu GV cho phép)]
```

---

### SCR-03a2-003 — Nộp bài tập (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/assignments/[assignmentId]/submit/page.tsx`

**Layout:**
```
[PageHeader: "Nộp bài — [Tên bài tập]"]
  [CountdownTimer: "Hết hạn: DD/MM HH:mm (còn X giờ)"]

[Card: Bài làm của tôi]
  [Nếu loại "Văn bản" hoặc "Cả hai":]
    [Tiptap editor lite — nộp văn bản]

  [Nếu loại "File" hoặc "Cả hai":]
    [FileUpload — multi, drag-drop]
    [Danh sách file đã chọn: tên | size | [Xóa]]

[Actions: [Lưu nháp] [Nộp bài]]
→ Nộp bài: ConfirmDialog "Bạn có chắc muốn nộp bài? Sau khi nộp không thể hoàn tác."
→ Sau nộp: redirect /assignments/[id]/result
```

**API:**
- `POST /api/student/assignments/{id}/submit` (multipart: text + files)

**Deliverables:**
- [ ] Upload file multi + preview
- [ ] Editor văn bản
- [ ] Confirm dialog trước khi nộp
- [ ] Lưu nháp (auto-save 30s)
- [ ] Không cho nộp khi hết hạn

---

### SCR-03a2-004 — Xem kết quả bài tập đã nộp (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/assignments/[assignmentId]/result/page.tsx`

**Layout:**
```
[PageHeader: "Kết quả — [Tên bài tập]"]

[Card: Kết quả]
  [Điểm: X/{max} — bold, large]
  [Badge: Đã chấm | Chờ chấm]
  [Nhận xét GV (nếu có)]
  [File phản hồi GV (nếu có)]

[Card: Bài đã nộp]
  Thời điểm nộp
  [Files đính kèm đã nộp]
  [Văn bản đã nộp (rendered)]
```

---

## TASK C-S3: Thảo luận phía HS (WF-03, nhóm 3a2-5..8)

### SCR-03a2-005 — Danh sách thảo luận (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/discussions/page.tsx`

**Layout:**
```
[PageHeader: "Thảo luận — [Tên lớp]"]
  Actions: [+ Tạo thảo luận mới]

[FilterBar: Sort (Mới nhất | Nhiều reply | Chưa đọc)]

[Card list — thread preview:]
  Mỗi thread:
    [Avatar] [Tên tác giả] [Role badge GV/HS] [thời gian]
    [📌 badge nếu ghim]
    [Tiêu đề — bold nếu chưa đọc]
    [Nội dung 2 dòng rút gọn]
    [💬 {n} replies] [Unread badge]
```

---

### SCR-03a2-006 — Xem chi tiết thảo luận (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/discussions/[threadId]/page.tsx`

Giống SCR-06a-403 (GV view) nhưng:
- Không có nút Ghim / Đóng/Mở
- Chỉ có thể xóa reply của chính mình

---

### SCR-03a2-007 — Tạo thảo luận mới (HS)

**Route:** `app/(dashboard)/my-classes/[classId]/discussions/new/page.tsx`

```
[Card: "Tạo thảo luận mới"]
  [FormField: Tiêu đề*]      AppInput
  [FormField: Nội dung*]     Tiptap lite
  [FormField: File đính kèm] FileUpload (optional)
  [Actions: [Hủy] [Đăng]]
```

---

### SCR-03a2-008 — Phản hồi thảo luận (HS)

Inline form trong thread detail page (giống GV view)

---

## TASK C-S4: Thi trực tuyến phía HS (WF-03, nhóm 3b) ⭐ CRITICAL

### SCR-03b-001 — Danh sách kỳ thi / ca thi (HS)

**Route:** `app/(dashboard)/my-exams/page.tsx`

**Layout:**
```
[PageHeader: "Kỳ thi của tôi"]

[Tabs: Sắp diễn ra | Đang thi | Đã kết thúc]

[Card list:]
  Mỗi ExamCard:
    [Tên ca thi / tên đề thi]
    [Ngày thi | Giờ bắt đầu | Thời gian làm]
    [Phòng thi (nếu có)]
    [Trạng thái badge]
    [CountdownTimer nếu <30 phút]
    [Điểm (nếu đã có kết quả)]
    [Actions tùy trạng thái:]
      - Sắp diễn ra + chưa đăng ký: [Đăng ký thi]
      - Sắp diễn ra + đã đăng ký: [Đã đăng ký ✓]
      - Đang thi: [Vào phòng thi]
      - Đã kết thúc + có kết quả: [Xem kết quả]
```

**API:** `GET /api/student/my-exams`

---

### SCR-03b-002 — Đăng ký thi (HS)

**Route:** `app/(dashboard)/my-exams/register/[examId]/page.tsx`

```
[PageHeader: "Đăng ký thi — [Tên ca thi]"]

[Card: Thông tin kỳ thi]
  Ngày thi | Giờ bắt đầu | Thời gian làm bài
  Tên đề thi | Số câu | Điểm tối đa

[Card: Điều kiện dự thi]
  [✓ Đã hoàn thành lớp liên kết (nếu có)]
  [✓ Có lượt thi]
  [Số lượt thi còn lại: {n}]

[Card: Lưu ý quan trọng]
  - Cần kết nối internet ổn định
  - Không dùng tab khác / thiết bị khác
  - Bài thi sẽ tự động nộp khi hết giờ

[Actions: [Hủy] [Xác nhận đăng ký]]
```

**API:** `POST /api/student/exams/{id}/register`

---

### SCR-03b-003 — Phòng thi — Giao diện làm bài ⭐ CRITICAL

**Route:** `app/(dashboard)/my-exams/room/[examId]/page.tsx`

**⚠️ Quan trọng: Full-screen layout, disable back navigation**

**Layout:**
```
[Fixed header - h-14]
  [Tên ca thi]  [━━━━━━━━━━━━━━━━━━━]  [ExamTimer]  [Nộp bài]

[2-panel body]
Left (2/3): Question Area
  [Card: Câu {currentQ}/{total}]
    [Nội dung câu hỏi (HTML + ảnh + math)]
    [Answers:]
      Trắc nghiệm 1: RadioGroup (A/B/C/D)
      Trắc nghiệm nhiều: CheckboxGroup
      Tự luận: AppTextarea (large)
    [← Câu trước]  [Câu tiếp →]

Right sidebar (1/3): Question Navigator
  [QuestionNav.tsx]
    Grid 5 cols của button câu hỏi:
      Màu xanh = đã trả lời
      Màu xám = chưa trả lời
      Màu vàng = đã đánh dấu xem lại
      Border đỏ = câu hiện tại
    [Legend: ■ Đã trả lời ■ Chưa trả lời ■ Đánh dấu]
    [Đánh dấu câu này để xem lại] Checkbox
```

**ExamTimer:**
```tsx
// Hiển thị: MM:SS hoặc HH:MM:SS
// Màu bình thường → warning (vàng) khi còn 5 phút
// Cảnh báo toast khi còn 5 phút
// Hết giờ: auto-submit (không cần confirm)
// Persist thời gian: localStorage (backup nếu reload)
```

**Auto-save behavior:**
```typescript
// Auto-save mỗi 30 giây: PUT /api/student/exam-sessions/{id}/answers
// Debounce: save ngay khi đổi đáp án (sau 1s)
// Visual: small "Đã lưu X:XX" indicator
// Reload/refresh: restore từ server state (không mất bài)
```

**Submit behavior:**
```typescript
// Nút "Nộp bài":
// 1. ConfirmDialog: "Bạn có {n} câu chưa trả lời. Xác nhận nộp bài?"
// 2. POST /api/student/exam-sessions/{id}/submit
// 3. Loading (không cho thoát)
// 4. Redirect → /my-exams/result/[examId]
```

**Anti-cheat (basic):**
- `window.addEventListener('blur', handleTabSwitch)` — log tab changes
- Disable right-click trong question area
- `beforeunload` warning nếu cố thoát

**API:**
- `GET /api/student/exam-sessions/{id}` → { questions, timeLeft, savedAnswers }
- `PUT /api/student/exam-sessions/{id}/answers` → { answers }
- `POST /api/student/exam-sessions/{id}/submit`

**State management (Zustand `exam.store.ts`):**
```typescript
interface ExamStore {
  questions: Question[]
  answers: Record<number, Answer>
  currentQuestion: number
  markedQuestions: Set<number>
  timeLeft: number
  sessionId: string
  // actions
  setAnswer: (questionIndex: number, answer: Answer) => void
  toggleMark: (questionIndex: number) => void
  setCurrentQuestion: (index: number) => void
  saveAnswers: () => Promise<void>
  submitExam: () => Promise<void>
}
```

**Deliverables:**
- [ ] Full-screen layout, không có Navbar/Sidebar
- [ ] Timer countdown với warning ở 5 phút
- [ ] Auto-save mỗi 30s + debounce
- [ ] Question navigator grid với status colors
- [ ] Mark để xem lại
- [ ] Trắc nghiệm 1/nhiều + tự luận render đúng
- [ ] Submit: confirm dialog → nộp → redirect kết quả
- [ ] Auto-submit khi hết giờ
- [ ] Reload: restore state từ server (không mất bài)
- [ ] Prevent accidental navigation (beforeunload)

---

### SCR-03b-004 — Xem kết quả thi (HS)

**Route:** `app/(dashboard)/my-exams/result/[examId]/page.tsx`

**Layout:**
```
[Centered page]

[Card: Kết quả thi]
  [Score badge: lớn, màu theo điểm (xanh/vàng/đỏ)]
  [X / {total} điểm]
  [Đúng {n} câu / {total} câu]
  [Thời gian làm: MM:SS]
  [Xếp hạng: {rank}/{total HS}]

[Card: Chi tiết từng câu — nếu GV cho phép]
  [List câu: ✓ Đúng / ✗ Sai / - Bỏ qua]
  [Click câu → expand đáp án đúng + giải thích]

[Actions: [Về trang kỳ thi] [Xem chi tiết bài làm]]
```

---

### SCR-03b-005 — Lịch sử kết quả thi (HS)

**Route:** `app/(dashboard)/my-exams/history/page.tsx`

**Layout:**
```
[PageHeader: "Lịch sử thi"]

[DataTable columns:]
  - Ca thi
  - Ngày thi
  - Đề thi
  - Điểm
  - Số câu đúng
  - Xếp hạng
  - Actions: [Xem kết quả]
```

---

## Phase 5 — Definition of Done

### Học tập
- [ ] SCR-03a1-001: Đăng ký lớp + card grid
- [ ] SCR-03a1-002: Content viewer (SCORM/Video/Text/File)
- [ ] SCR-03a1-003: Giới thiệu lớp
- [ ] SCR-03a1-004: Kết quả học tập tổng quan
- [ ] SCR-03a1-005: Lịch sử truy cập
- [ ] SCR-03a1-006: Thông báo

### Bài tập
- [ ] SCR-03a2-001: Danh sách BT với countdown
- [ ] SCR-03a2-002: Chi tiết đề bài
- [ ] SCR-03a2-003: Nộp bài (file + text) với confirm
- [ ] SCR-03a2-004: Xem kết quả + nhận xét GV

### Thảo luận
- [ ] SCR-03a2-005..008: Thread list + detail + create + reply

### Thi trực tuyến ⭐ Critical
- [ ] SCR-03b-001: Danh sách ca thi với status đúng
- [ ] SCR-03b-002: Đăng ký thi với check điều kiện
- [ ] SCR-03b-003: **Phòng thi**: timer + navigator + auto-save + submit
- [ ] SCR-03b-003: Reload không mất bài
- [ ] SCR-03b-003: Auto-submit khi hết giờ
- [ ] SCR-03b-004: Kết quả thi + chi tiết câu hỏi
- [ ] SCR-03b-005: Lịch sử thi

### Technical
- [ ] Exam store Zustand hoạt động đúng
- [ ] Auto-save không spam API (debounce đúng)
- [ ] Timer không drift (dùng server time làm reference)
- [ ] `npm run build` clean

## Thời gian ước tính: 3–4 ngày
