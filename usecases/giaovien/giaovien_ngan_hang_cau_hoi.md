# Ngân Hàng Câu Hỏi — Role: Giáo viên

## Mục tiêu
Cung cấp cho giáo viên công cụ xây dựng, phân loại và quản lý kho câu hỏi cá nhân và chung theo môn học, chương, mức độ nhận thức (Bloom's Taxonomy) — để tái sử dụng hiệu quả khi tạo đề thi, bài kiểm tra, bài tập; đồng thời cho phép cộng tác chia sẻ câu hỏi giữa các GV cùng bộ môn.

## Người dùng
- **Giáo viên bộ môn**: Tạo, sửa, xóa câu hỏi của mình; nhập câu hỏi từ Word/Excel; chia sẻ câu hỏi vào bộ câu hỏi chung bộ môn; tái sử dụng câu hỏi khi tạo đề thi/bài tập.
- **Giáo viên chủ nhiệm**: Không có quyền truy cập module này (chỉ GV bộ môn mới dùng).
- **Tổ trưởng bộ môn** (role nâng cao): Quản lý kho câu hỏi chung toàn bộ môn, duyệt câu hỏi của GV tổ viên trước khi đưa vào kho chung.

---

## User Flow Chính

### Flow 1: Tạo câu hỏi trắc nghiệm mới
**Mô tả**: GV tạo một câu hỏi trắc nghiệm 4 đáp án với giải thích chi tiết.
**Trigger**: GV vào Ngân hàng câu hỏi → bấm "+ Thêm câu hỏi".
**Steps**:
1. Chọn loại câu hỏi: **Trắc nghiệm 1 đáp án** (mặc định).
2. Nhập **nội dung câu hỏi** vào rich text editor (hỗ trợ LaTeX, ảnh, bảng).
3. Nhập 4 đáp án (A, B, C, D). Đánh dấu đáp án đúng.
4. Nhập **giải thích** (explanation) — hiển thị cho HS sau khi làm bài.
5. Phân loại câu hỏi:
   - **Môn học**: Toán 11
   - **Chương**: Chương 3 — Hàm số mũ
   - **Chủ đề/Tag**: hàm-số, mũ, lũy-thừa
   - **Mức độ**: Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao
   - **Thời gian làm**: X phút (gợi ý cho đề thi)
   - **Điểm**: X điểm (gợi ý)
6. Bấm **"Lưu"** hoặc **"Lưu & Thêm câu tiếp theo"** (để tạo hàng loạt).
**Expected Result**: Câu hỏi được lưu vào kho cá nhân GV, sẵn sàng dùng trong đề thi.

---

### Flow 2: Tạo câu hỏi tự luận
**Mô tả**: GV tạo câu hỏi tự luận với hướng dẫn chấm và thang điểm chi tiết.
**Trigger**: GV chọn loại câu hỏi "Tự luận" khi tạo câu hỏi mới.
**Steps**:
1. Nhập nội dung câu hỏi (rich text, hỗ trợ ảnh/bảng/LaTeX).
2. Thêm **file đính kèm đề** (nếu có hình vẽ, bảng số liệu đính kèm).
3. Nhập **Đáp án mẫu / Hướng dẫn chấm** (chỉ GV và admin thấy):
   - Lời giải chi tiết theo từng bước.
   - Thang điểm chi tiết (VD: Bước 1: 1đ, Bước 2: 2đ, Kết quả đúng: 1đ).
4. Nhập **Rubric chấm** (nếu dùng): bảng tiêu chí đánh giá.
5. Phân loại tương tự câu trắc nghiệm.
6. Lưu câu hỏi.
**Expected Result**: GV có câu tự luận đầy đủ hướng dẫn chấm, dùng được ngay khi ra đề.

---

### Flow 3: Import câu hỏi hàng loạt từ Word/Excel
**Mô tả**: GV có file Word/Excel câu hỏi cũ muốn import vào hệ thống nhanh.
**Trigger**: GV bấm "Import câu hỏi" trong ngân hàng câu hỏi.
**Steps**:
1. GV tải file mẫu Excel (template chuẩn của hệ thống).
2. GV điền câu hỏi theo đúng cột: Loại, Nội dung, A, B, C, D, Đúng, Chương, Mức độ...
3. Upload file Excel đã điền.
4. Hệ thống parse và hiển thị preview 5 câu đầu để GV kiểm tra.
5. Nếu có lỗi (ô trống bắt buộc, đáp án đúng không hợp lệ...) → hiển thị danh sách lỗi theo dòng.
6. GV sửa file và upload lại, hoặc bỏ qua dòng lỗi và import các dòng đúng.
7. Xác nhận → toàn bộ câu hỏi hợp lệ được import.
**Expected Result**: Import 100 câu hỏi trong < 5 phút thay vì nhập tay từng câu.

---

### Flow 4: Tìm kiếm và lọc câu hỏi
**Mô tả**: GV tìm câu hỏi phù hợp để đưa vào đề thi mới.
**Trigger**: GV vào màn hình ngân hàng câu hỏi → thanh tìm kiếm.
**Steps**:
1. Nhập từ khóa (VD: "đạo hàm hàm hợp") → gợi ý realtime hiện ra.
2. Dùng filter kết hợp:
   - Môn học / Lớp
   - Chương / Chủ đề
   - Loại câu (Trắc nghiệm / Tự luận)
   - Mức độ (Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao)
   - Nguồn: Câu của tôi / Câu chung bộ môn / Câu từ đề thi năm trước
   - Lọc theo: Chưa dùng trong kỳ này / Đã dùng > 1 lần / Tỷ lệ sai cao (câu phân loại tốt)
3. Kết quả hiển thị dạng thẻ, mỗi thẻ có: nội dung câu, tag, mức độ, số lần đã dùng, tỷ lệ HS trả lời đúng.
4. GV tick chọn câu hỏi → "Thêm vào đề thi đang soạn" hoặc "Thêm vào giỏ".
**Expected Result**: GV tìm được 30 câu phù hợp trong < 3 phút.

---

### Flow 5: Chia sẻ câu hỏi vào kho bộ môn
**Mô tả**: GV chia sẻ câu hỏi chất lượng của mình để đồng nghiệp cùng dùng.
**Trigger**: GV chọn câu hỏi → bấm "Chia sẻ lên kho bộ môn".
**Steps**:
1. Hệ thống hiện popup: "Bạn muốn chia sẻ câu hỏi này lên Kho Toán - Tổ Toán Lý Tin. Câu hỏi sẽ được tổ trưởng duyệt trước khi xuất hiện trong kho chung."
2. GV xác nhận → câu hỏi chuyển trạng thái "Chờ duyệt".
3. Tổ trưởng nhận thông báo, duyệt hoặc từ chối (kèm ghi chú).
4. GV nhận kết quả: "Câu hỏi X đã được duyệt vào kho bộ môn" hoặc "Từ chối — Lý do: [...]".
**Expected Result**: Kho câu hỏi bộ môn ngày càng phong phú, không bị trùng lặp.

---

## Tính năng & Màn hình

### Màn hình chính — Kho câu hỏi
```
┌─────────────────────────────────────────────────────────┐
│  🗃️ Ngân hàng câu hỏi — Toán               [+ Thêm câu]│
│  [Import Excel] [Xuất Excel] [Chia sẻ lên bộ môn]       │
├───────────────────┬─────────────────────────────────────┤
│  BỘ LỌC           │  DANH SÁCH CÂU HỎI (247 câu)       │
│  ────────────     │  ─────────────────────────────────  │
│  Nguồn:           │  [🔍 Tìm kiếm câu hỏi...       ]   │
│  ✅ Câu của tôi   │                                     │
│  ⬜ Kho bộ môn    │  Câu 1 — TRẮC NGHIỆM | CH.3 | Vận dụng │
│  ⬜ Đề thi cũ    │  "Hàm số y=2^x có đồ thị đi qua..." │
│  ────────────     │  Tag: hàm-số, mũ | Đã dùng: 3 lần  │
│  Môn: Toán 11     │  Đúng: 72% HS | [Sửa] [Xóa] [Share]│
│  Chương:          │  ─────────────────────────────────  │
│  [Tất cả ▼]      │  Câu 2 — TỰ LUẬN | CH.4 | VD cao   │
│  Mức độ:          │  "Tính diện tích hình phẳng giới..." │
│  ✅ Nhận biết     │  Rubric: 5 tiêu chí | Đã dùng: 1 lần│
│  ✅ Thông hiểu    │  [Sửa] [Xóa] [Share]                │
│  ✅ Vận dụng      │                                     │
│  ✅ VD cao        │  [← Trang trước] 1/13 [Tiếp →]     │
│  Loại:            │                                     │
│  ✅ Trắc nghiệm   │                                     │
│  ✅ Tự luận       │                                     │
└───────────────────┴─────────────────────────────────────┘
```

### Form tạo câu hỏi — Layout
```
┌─────────────────────────────────────────────────────────┐
│  Loại câu hỏi: [Trắc nghiệm ▼] [Tự luận] [Điền chỗ]  │
├─────────────────────────────────────────────────────────┤
│  NỘI DUNG CÂU HỎI:                                     │
│  [Rich text editor — Bold/Italic/LaTeX/Ảnh/Bảng]       │
│  ════════════════════════════════════════════════════   │
├─────────────────────────────────────────────────────────┤
│  ĐÁP ÁN:                                                │
│  ⬤ A. [Nhập đáp án A...]     ◯ B. [Nhập đáp án B...] │
│  ◯ C. [Nhập đáp án C...]     ◯ D. [Nhập đáp án D...] │
│                                                         │
│  GIẢI THÍCH (hiển thị sau khi làm):                    │
│  [Nhập giải thích chi tiết...]                         │
├─────────────────────────────────────────────────────────┤
│  PHÂN LOẠI:                                             │
│  Môn: [Toán 11 ▼]  Chương: [Chương 3 ▼]               │
│  Mức độ: [Vận dụng ▼]  Thời gian: [2] phút  Điểm: [1]│
│  Tag: [hàm-số] [mũ] [+ thêm tag]                       │
├─────────────────────────────────────────────────────────┤
│  [Xem trước]  [Lưu nháp]  [Lưu]  [Lưu & Tiếp theo →] │
└─────────────────────────────────────────────────────────┘
```

### Thống kê câu hỏi (hiển thị trong thẻ câu hỏi)
- **Đã dùng**: X lần (trong đề thi/bài tập)
- **Tỷ lệ đúng**: X% HS trả lời đúng (câu trắc nghiệm)
- **Thời gian làm bình quân**: X phút (so với dự kiến)
- **Chỉ số phân biệt**: Cao / Trung bình / Thấp (câu tốt cho phân loại HS)

### Actions

| Action | Trigger | Kết quả |
|--------|---------|---------|
| Tạo câu mới | Bấm "+ Thêm câu" | Mở form tạo câu hỏi |
| Lưu & tiếp theo | Bấm "Lưu & Tiếp theo" | Lưu câu, reset form cho câu mới |
| Import hàng loạt | Bấm "Import Excel" | Mở modal upload + preview |
| Sửa câu hỏi | Bấm "Sửa" | Mở form edit inline |
| Xóa câu hỏi | Bấm "Xóa" → xác nhận | Xóa (nếu chưa dùng) hoặc ẩn (nếu đã dùng trong đề) |
| Chia sẻ lên bộ môn | Bấm "Share" | Gửi duyệt, chuyển sang "Chờ duyệt" |
| Thêm vào đề thi | Tick câu → "Thêm vào đề" | Câu được thêm vào giỏ đề thi đang soạn |
| Xuất câu hỏi | Bấm "Xuất Excel" | Tải file với câu hỏi đã lọc |
| Lọc câu chưa dùng | Bấm filter "Chưa dùng kỳ này" | Chỉ hiện câu mới, tránh lặp đề |

---

## Gom nhóm tính năng thông minh

**Taxonomy auto-suggest**: Khi GV nhập nội dung câu hỏi, AI gợi ý mức độ Bloom phù hợp dựa trên động từ trong câu hỏi (VD: "Tính..." → Thông hiểu; "So sánh..." → Vận dụng; "Phân tích..." → Vận dụng cao).

**Duplicate detection**: Trước khi lưu câu mới, hệ thống kiểm tra độ tương đồng với câu hỏi đã có trong kho (cùng bộ môn). Nếu > 80% tương đồng → cảnh báo "Câu hỏi tương tự đã tồn tại" và hiển thị câu cũ để GV so sánh.

**Câu hỏi "hiệu quả"**: Hệ thống đánh dấu ⭐ các câu có tỷ lệ đúng 40-70% (câu phân loại tốt) và chỉ số phân biệt cao — giúp GV chọn câu khó vừa phải cho đề thi.

**Gom nhóm theo đề thi**: Mỗi câu hỏi tracking đã được dùng trong đề nào, tránh ra đề trùng.

---

## Edge Cases & Validation

- **Nội dung câu hỏi trống**: Disable nút "Lưu", hiển thị lỗi inline "Vui lòng nhập nội dung câu hỏi."
- **Trắc nghiệm chưa đánh dấu đáp án đúng**: Validate bắt buộc, không cho lưu.
- **LaTeX lỗi cú pháp**: Highlight lỗi inline trong editor ngay khi gõ, preview công thức realtime.
- **Ảnh trong câu hỏi quá lớn (>5MB)**: Tự động nén, cảnh báo nếu nén không đủ.
- **Import Excel — cột thiếu**: Hiển thị lỗi chi tiết "Dòng 5: Thiếu cột 'Đáp án đúng'."
- **Xóa câu đã dùng trong đề thi đang chạy**: Không cho xóa, chỉ cho ẩn. Cảnh báo "Câu này đang có trong kỳ thi X đang diễn ra."
- **Kho câu hỏi > 10,000 câu**: Implement full-text search, pagination, lazy loading.
- **Import file không đúng template**: Từ chối, hiển thị link tải template chuẩn.

---

## Tích hợp

- **Module Tổ chức Thi**: Khi tạo đề thi, GV kéo câu hỏi trực tiếp từ ngân hàng. Hệ thống random câu theo cấu trúc đề.
- **Module Bài tập**: Bài tập dạng quiz lấy câu hỏi từ ngân hàng.
- **Module Kết quả học tập**: Sau khi HS làm bài, thống kê tỷ lệ đúng/sai từng câu ghi ngược lại vào metadata câu hỏi.
- **AI Service**: Gợi ý mức độ Bloom, kiểm tra trùng lặp câu hỏi.
- **Module Tổ chuyên môn** (nếu có): Workflow duyệt câu hỏi từ GV → Tổ trưởng → Kho chung.
- **Export Service**: Xuất câu hỏi ra Word (định dạng đề thi in giấy), Excel (trao đổi giữa GV).
