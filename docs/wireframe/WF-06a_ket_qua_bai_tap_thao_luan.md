---
title: "WF-06a: Kết quả học tập, Bài tập & Thảo luận (Quản lý)"
cluster: "Learning - Manager / Results, Assignments, Discussions"
updated: 2026-03-11
---

# WF-06a: Kết quả học tập, Bài tập & Thảo luận (Quản lý)

---

## NHÓM 1 — QUẢN LÝ NỘI DUNG BUỔI OFFLINE

---

### SCR-06a-101 · Danh sách buổi học offline

**Mô tả:** Xem, tìm kiếm, tạo/sửa/xóa danh sách buổi học offline của lớp.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ Lớp: [Tên lớp]      Tab: Buổi offline               │
├─────────────────────────────────────────────────────┤
│ [🔍 Tìm kiếm buổi học...]          [+ Thêm buổi]    │
├──────┬──────────────┬────────┬──────────┬────────────┤
│ STT  │ Tên buổi học │ Ngày   │ Nội dung │ Thao tác   │
├──────┼──────────────┼────────┼──────────┼────────────┤
│  1   │ Buổi 1 – ... │ 10/03  │ Chương 1 │ ✏️ 🗑️      │
│  2   │ Buổi 2 – ... │ 17/03  │ Chương 2 │ ✏️ 🗑️      │
│  3   │ Buổi 3 – ... │ 24/03  │ Chương 3 │ ✏️ 🗑️      │
└──────┴──────────────┴────────┴──────────┴────────────┘
│ Tổng: 3 buổi                    [< 1 2 3 >]          │
└─────────────────────────────────────────────────────┘
```

**Components:** Breadcrumb, Search, Nút Thêm, Table (STT/Tên/Ngày/Nội dung/Action), Pagination
**Flow:** Vào màn → Xem danh sách → Nhấn Thêm → [SCR-06a-102] | Nhấn ✏️ → [SCR-06a-103] | Nhấn 🗑️ → Confirm xóa
**Business rules:** Xóa cần xác nhận; Tên buổi không được trùng trong lớp.
**API:** `GET /classes/{id}/offline-sessions` · `DELETE /offline-sessions/{id}`

---

### SCR-06a-102 · Thêm mới / Chỉnh sửa buổi offline

**Mô tả:** Form tạo mới hoặc chỉnh sửa nội dung buổi học offline.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← Danh sách buổi học      [Thêm mới buổi offline]   │
├─────────────────────────────────────────────────────┤
│ Tên buổi học *   [________________________]         │
│ Ngày học *       [DD/MM/YYYY  📅]                    │
│ Nội dung buổi   [________________________]          │
│                  [________________________]          │
│ Tệp đính kèm    [📎 Chọn tệp...]  [file.pdf ✕]     │
│ Ghi chú         [________________________]          │
├─────────────────────────────────────────────────────┤
│              [Hủy]          [💾 Lưu]                │
└─────────────────────────────────────────────────────┘
```

**Components:** Form fields (text, date-picker, textarea, file-upload), Btn Hủy/Lưu, Inline validation
**Flow:** Nhập thông tin → Lưu → Validate → Thành công: toast + quay về [SCR-06a-101] | Lỗi: highlight field
**Business rules:** Tên buổi bắt buộc; Ngày học bắt buộc; File đính kèm: đúng định dạng & kích thước.
**API:** `POST /offline-sessions` · `PUT /offline-sessions/{id}`

---

## NHÓM 2 — QUẢN LÝ KẾT QUẢ HỌC TẬP

---

### SCR-06a-201 · Danh sách kết quả học tập theo năm/lớp

**Mô tả:** Tổng quan kết quả học tập học sinh; chọn năm học và lớp để xem.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│  Quản lý kết quả học tập                            │
├─────────────────────────────────────────────────────┤
│  Năm học: [2025-2026 ▼]   Lớp: [Lớp A1 ▼]          │
├──────┬──────────────┬──────────┬──────────┬─────────┤
│ STT  │ Tên học sinh │ Tiến độ  │ Kết quả  │ Thao tác│
├──────┼──────────────┼──────────┼──────────┼─────────┤
│  1   │ Nguyễn A     │ 85%  ▓▓░ │ Hoàn thành│ Xem    │
│  2   │ Trần B       │ 50%  ▓░░ │ Đang học  │ Xem    │
│  3   │ Lê C         │ 30%  ▓░░ │ Không HT  │ Xem    │
└──────┴──────────────┴──────────┴──────────┴─────────┘
│  [📤 Xuất báo cáo]       [📣 Gửi thông báo]         │
└─────────────────────────────────────────────────────┘
```

**Components:** Dropdown Năm học / Lớp, Table (HS/Tiến độ/Kết quả), Progress bar, Btn Xuất/Gửi thông báo
**Flow:** Chọn năm + lớp → Xem danh sách → Nhấn "Xem" → [SCR-06a-202] | Xuất báo cáo → tải file | Gửi thông báo → modal compose
**Business rules:** Tiến độ tính tự động từ bài học hoàn thành / tổng bài; Kết quả chỉ GV/CBQL xét.
**API:** `GET /classes/{id}/learning-results?year=` · `GET /learning-results/export?classId=`

---

### SCR-06a-202 · Chi tiết kết quả học tập học sinh

**Mô tả:** Xem chi tiết kết quả từng môn/bài của học sinh; xét Hoàn thành / Không hoàn thành.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← Danh sách    Kết quả: Nguyễn A · Lớp A1          │
├─────────────────────────────────────────────────────┤
│  Tổng tiến độ: ▓▓▓▓▓▓░░░░ 60%   Bài thi: 8.5/10   │
├──────────────┬──────────┬──────────┬────────────────┤
│ Nội dung     │ Hoàn thành│ Điểm BT │ Nhật ký        │
├──────────────┼──────────┼──────────┼────────────────┤
│ Chương 1     │ ✅        │ 9.0      │ [Xem nhật ký]  │
│ Chương 2     │ ✅        │ 7.5      │ [Xem nhật ký]  │
│ Chương 3     │ ❌        │ —        │ [Xem nhật ký]  │
└──────────────┴──────────┴──────────┴────────────────┘
│  [✅ Xét hoàn thành]      [❌ Không hoàn thành]      │
└─────────────────────────────────────────────────────┘
```

**Components:** Header HS info, Progress summary, Table (nội dung/hoàn thành/điểm/nhật ký), Btn xét kết quả
**Flow:** Xem chi tiết → Nhấn "Xét hoàn thành/Không HT" → Confirm dialog → Lưu kết quả | Nhấn "Xem nhật ký" → modal log
**Business rules:** Xét kết quả yêu cầu xác nhận lần 2; Không thể hoàn tác sau khi xét.
**API:** `GET /students/{id}/learning-result?classId=` · `PUT /students/{id}/completion-status`

---

## NHÓM 3 — QUẢN LÝ BÀI TẬP

---

### SCR-06a-301 · Danh sách bài tập

**Mô tả:** Xem, tìm kiếm, sắp xếp thứ tự, tạo/sửa/xóa bài tập của lớp học.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ Lớp: [Tên lớp]              Tab: Bài tập            │
├─────────────────────────────────────────────────────┤
│ [🔍 Tìm bài tập...]  [↕ Sắp xếp ▼]  [+ Thêm bài]  │
├──┬────────────────┬────────────┬────────┬───────────┤
│☐ │ Tên bài tập    │ Hạn nộp    │ Đã nộp │ Thao tác  │
├──┼────────────────┼────────────┼────────┼───────────┤
│☐ │ BT Chương 1    │ 15/03/2026 │ 28/30  │ ✏️ 📋 🗑️  │
│☐ │ BT Chương 2    │ 22/03/2026 │  5/30  │ ✏️ 📋 🗑️  │
│☐ │ BT Tổng hợp   │ 30/03/2026 │  0/30  │ ✏️ 📋 🗑️  │
└──┴────────────────┴────────────┴────────┴───────────┘
│ [Xóa đã chọn]                   [< 1 2 >]           │
└─────────────────────────────────────────────────────┘
```

**Components:** Search, Dropdown sắp xếp, Checkbox multi-select, Table, Icon action (Sửa/Xem bài nộp/Xóa), Pagination
**Flow:** Xem ds → + Thêm → [SCR-06a-302] | ✏️ Sửa → [SCR-06a-302] | 📋 Xem bài nộp → [SCR-06a-303] | 🗑️ Xóa → Confirm
**Business rules:** Tên bài tập không trùng trong lớp; Xóa bài tập có bài nộp cần cảnh báo; Sắp xếp: Thủ công (drag-drop) hoặc Tự động.
**API:** `GET /classes/{id}/assignments` · `DELETE /assignments/{id}` · `PUT /assignments/reorder`

---

### SCR-06a-302 · Thêm mới / Chỉnh sửa bài tập

**Mô tả:** Form nhập thông tin bài tập, đính kèm tệp tài liệu.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← Danh sách bài tập          [Thêm mới bài tập]    │
├─────────────────────────────────────────────────────┤
│ Tên bài tập *    [________________________]         │
│ Mô tả / Đề bài  [________________________]          │
│                  [________________________]          │
│ Hạn nộp *        [DD/MM/YYYY HH:MM  📅]             │
│ Điểm tối đa *    [____]  (VD: 10)                   │
│                                                     │
│ Tệp đính kèm    [📎 Thêm tệp]                       │
│  ├─ tailieu.pdf  4.2MB                  [✕]         │
│  └─ dethi.docx   1.1MB                  [✕]         │
├─────────────────────────────────────────────────────┤
│              [Hủy]          [💾 Lưu]                │
└─────────────────────────────────────────────────────┘
```

**Components:** Text input, Textarea (rich-text), DateTimePicker, Number input, File upload list (thêm/xóa/thay thế), Validation inline
**Flow:** Nhập form → Thêm tệp (validate định dạng/kích thước) → Lưu → Thành công: về [SCR-06a-301]
**Business rules:** Tên & hạn nộp bắt buộc; File: đúng định dạng, 0 < size ≤ giới hạn; Tên bài tập không trùng.
**API:** `POST /assignments` · `PUT /assignments/{id}` · `POST /assignments/{id}/attachments` · `DELETE /assignments/{id}/attachments/{fileId}`

---

### SCR-06a-303 · Danh sách bài nộp của học sinh

**Mô tả:** Xem tất cả bài nộp của học sinh cho một bài tập; chấm điểm, trả bài, xóa bài nộp.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← BT Chương 1       Bài nộp (28/30 HS đã nộp)      │
├─────────────────────────────────────────────────────┤
│ [🔍 Tìm học sinh...]  [⚙️ Thiết lập hiển thị điểm] │
├──────────────┬─────────┬───────────┬────────────────┤
│ Học sinh     │ Nộp lúc │ Điểm      │ Thao tác       │
├──────────────┼─────────┼───────────┼────────────────┤
│ Nguyễn A     │ 14/03   │ 9.0  ✅   │ [Xem] [🗑️]    │
│ Trần B       │ 15/03   │ — (chưa chấm)│ [Xem] [🗑️] │
│ Lê C         │ —       │ Chưa nộp  │ —              │
└──────────────┴─────────┴───────────┴────────────────┘
│  [< 1 2 >]                                          │
└─────────────────────────────────────────────────────┘
```

**Components:** Header stats, Search, Btn thiết lập điểm, Table (HS/nộp lúc/điểm/action), Badge trạng thái
**Flow:** Nhấn [Xem] → [SCR-06a-304] chấm điểm | Nhấn [🗑️] → Confirm xóa bài nộp | Thiết lập hiển thị điểm → modal cấu hình
**Business rules:** Chỉ xóa bài nộp khi có quyền; Điểm hiển thị cho HS chỉ sau khi GV "Trả bài".
**API:** `GET /assignments/{id}/submissions` · `DELETE /submissions/{id}` · `PUT /assignments/{id}/score-visibility`

---

### SCR-06a-304 · Chấm điểm bài làm học sinh

**Mô tả:** Xem bài làm chi tiết, tải bài về, upload bài chấm, nhập điểm, trả bài.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← Bài nộp       Bài làm: Nguyễn A – BT Chương 1   │
├─────────────────┬───────────────────────────────────┤
│ BÀI LÀM HS      │ CHẤM ĐIỂM                        │
│                 │                                   │
│ 📄 baitap_A.pdf │ Tải bài chấm lên:                 │
│ [⬇️ Tải về]     │ [📎 Upload bài chấm GV]           │
│                 │  └─ cham_A.pdf  2.1MB   [✕]       │
│ 📝 Ghi chú HS:  │                                   │
│ "Em nộp bài..." │ Điểm số *: [____] / 10            │
│                 │ Nhận xét:  [________________]      │
│                 │            [________________]      │
├─────────────────┴───────────────────────────────────┤
│         [💾 Lưu nháp]     [📤 Lưu & Trả bài]       │
└─────────────────────────────────────────────────────┘
```

**Components:** Split-panel (bài HS / chấm điểm), File download, File upload, Number input điểm, Textarea nhận xét, Btn Lưu nháp / Trả bài
**Flow:** Xem bài → Tải bài về → Upload bài chấm → Nhập điểm → Lưu & Trả bài → cập nhật trạng thái HS
**Business rules:** Điểm: số hợp lệ trong [0, điểm tối đa]; Trả bài mới hiển thị điểm cho HS; Lưu nháp không thông báo HS.
**API:** `GET /submissions/{id}` · `POST /submissions/{id}/grading-file` · `PUT /submissions/{id}/grade` · `POST /submissions/{id}/return`

---

## NHÓM 4 — QUẢN LÝ THẢO LUẬN

---

### SCR-06a-401 · Danh sách thảo luận

**Mô tả:** Xem, tìm kiếm (từ khóa / lọc nội dung lớp), thêm, sửa, xóa, ghim thảo luận.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ Lớp: [Tên lớp]           Tab: Thảo luận             │
├─────────────────────────────────────────────────────┤
│ [🔍 Từ khóa...]  [Nội dung: Tất cả ▼]  [+ Thêm]   │
├──┬──────────────────────────┬──────────┬────────────┤
│☐ │ Tiêu đề thảo luận        │ Người đăng│ Thao tác  │
├──┼──────────────────────────┼──────────┼────────────┤
│☐ │ 📌 Thông báo quan trọng  │ GV Minh  │ ✏️ 💬 🗑️  │
│☐ │ Hỏi về bài tập chương 2  │ HS An    │ ✏️ 💬 🗑️  │
│☐ │ Chia sẻ tài liệu tham khảo│ GV Minh │ ✏️ 💬 🗑️  │
└──┴──────────────────────────┴──────────┴────────────┘
│ [Xóa đã chọn]                  [< 1 2 3 >]          │
└─────────────────────────────────────────────────────┘
```

**Components:** Search text, Dropdown lọc theo nội dung lớp, Btn Thêm, Checkbox multi-select, Table (📌 ghim/tiêu đề/tác giả/action), Icon (Sửa/Phản hồi/Xóa)
**Flow:** Tìm kiếm → lọc kết quả | + Thêm → [SCR-06a-402] | ✏️ → [SCR-06a-402 edit] | 💬 → [SCR-06a-403] | 🗑️ → Confirm
**Business rules:** Tìm kiếm theo từ khóa hoặc chọn nội dung lớp (filter); Thảo luận trùng nội dung bị từ chối; Xóa nhiều: chọn checkbox.
**API:** `GET /classes/{id}/discussions?keyword=&contentId=` · `DELETE /discussions` (bulk)

---

### SCR-06a-402 · Thêm mới / Chỉnh sửa thảo luận

**Mô tả:** Form tạo mới hoặc chỉnh sửa thảo luận; hỗ trợ ghim lên đầu.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← Thảo luận            [Thêm mới thảo luận]        │
├─────────────────────────────────────────────────────┤
│ Tiêu đề *        [________________________]         │
│ Nội dung lớp học [Chọn nội dung ▼]                  │
│ Nội dung *       [________________________]          │
│                  [________________________]          │
│                  [________________________]          │
│ 📌 Ghim lên đầu  [☐]                                │
├─────────────────────────────────────────────────────┤
│              [Hủy]          [💾 Lưu]                │
└─────────────────────────────────────────────────────┘
```

**Components:** Text input (tiêu đề), Dropdown nội dung lớp, Textarea (rich-text), Checkbox ghim, Validation inline
**Flow:** Nhập → Lưu → Validate (trùng nội dung / thiếu trường) → Thành công: về [SCR-06a-401]
**Business rules:** Tiêu đề & nội dung bắt buộc; Nội dung thảo luận không được trùng; Ghim: chỉ hiển thị ở đầu danh sách.
**API:** `POST /discussions` · `PUT /discussions/{id}`

---

### SCR-06a-403 · Chi tiết & Phản hồi thảo luận

**Mô tả:** Xem chi tiết chuỗi thảo luận, thêm phản hồi, sửa/xóa phản hồi.
**Actors:** GV, CBQL

```
┌─────────────────────────────────────────────────────┐
│ ← Thảo luận    "Hỏi về bài tập chương 2"           │
├─────────────────────────────────────────────────────┤
│ 👤 HS An  –  13/03/2026 09:00                       │
│   "Em không hiểu câu 3 bài tập chương 2, thầy..."  │
│                                    [✏️ Sửa] [🗑️]  │
├─────────────────────────────────────────────────────┤
│   ↳ 👤 GV Minh  –  13/03 10:30                      │
│      "Em xem lại phần lý thuyết trang 45..."        │
│                                    [✏️ Sửa] [🗑️]  │
│   ↳ 👤 HS An  –  13/03 11:00                        │
│      "Dạ em hiểu rồi, cảm ơn thầy ạ!"              │
│                                    [✏️ Sửa] [🗑️]  │
├─────────────────────────────────────────────────────┤
│ Phản hồi:  [________________________]               │
│            [________________________]               │
│                               [📤 Gửi phản hồi]    │
└─────────────────────────────────────────────────────┘
```

**Components:** Thread view (bài gốc + phản hồi lồng nhau), Avatar/tên/timestamp, Btn Sửa/Xóa per-comment, Textarea phản hồi, Btn Gửi
**Flow:** Xem thread → Nhập phản hồi → Gửi → Validate → Hiển thị mới | ✏️ Sửa → inline edit | 🗑️ Xóa → Confirm
**Business rules:** Nội dung phản hồi bắt buộc; GV/CBQL có thể sửa/xóa mọi bình luận; Không giới hạn độ sâu phản hồi.
**API:** `GET /discussions/{id}/replies` · `POST /discussions/{id}/replies` · `PUT /replies/{id}` · `DELETE /replies/{id}`

---

## NAVIGATION MAP

```
[SCR-06a-101] Buổi offline list
    ├─→ [SCR-06a-102] Thêm/Sửa buổi
[SCR-06a-201] Kết quả học tập list
    └─→ [SCR-06a-202] Chi tiết kết quả HS
[SCR-06a-301] Danh sách bài tập
    ├─→ [SCR-06a-302] Thêm/Sửa bài tập
    └─→ [SCR-06a-303] Bài nộp của HS
            └─→ [SCR-06a-304] Chấm điểm
[SCR-06a-401] Danh sách thảo luận
    ├─→ [SCR-06a-402] Thêm/Sửa thảo luận
    └─→ [SCR-06a-403] Chi tiết & Phản hồi
```
