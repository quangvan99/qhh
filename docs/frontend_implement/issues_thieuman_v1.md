# Issues: Màn hình còn thiếu (v1)

**Ngày phân tích:** 2026-03-12
**Người thực hiện:** AI Analysis
**Codebase:** `/home/qv/projects/qh/frontend/src/app/`
**Framework:** Next.js 15 (App Router)

---

## Tóm tắt

| Metric | Số lượng |
|--------|----------|
| Tổng số màn hình trong wireframe (ước tính từ tất cả WF) | ~168 |
| Số màn hình đã implement (có page.tsx hoặc component tương ứng) | ~105 |
| Số màn hình còn **thiếu hoàn toàn** | ~63 |

> **Lưu ý phương pháp:** Mỗi `page.tsx` được tính là 1 màn hình. Các modal/dialog nằm trong cùng trang được tính vào màn hình chứa. Một số wireframe dùng số tham chiếu như "tương tự SCR-XX" thay vì định nghĩa đầy đủ — những màn hình đó được tính là chưa có nếu route/component chuyên biệt chưa tồn tại.

---

## Danh sách màn hình còn thiếu

### WF-02: Tích hợp GDĐT (Sở Giáo dục & Đào tạo)

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 1 | Cấu hình kết nối GDĐT | SCR-02-010 | Màn hình cấu hình endpoint LGSP/NGSP, API key, token | High |
| 2 | Kích hoạt đồng bộ GDĐT | SCR-02-011 | Trigger đồng bộ thủ công, trạng thái đồng bộ realtime | High |
| 3 | Lịch sử đồng bộ / Log | SCR-02-012 | Danh sách lịch sử sync, chi tiết lỗi, filter theo ngày | Medium |

### WF-05a: Nội dung SCORM

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 4 | Picker SCORM từ thư viện | SCR-05a-007 | Chọn SCORM từ thư viện trường đã upload sẵn (không phải upload mới) | Medium |
| 5 | Thiết lập điều kiện hoàn thành SCORM | SCR-05a-010 | Modal cấu hình completion condition (min score, min time, etc.) & lịch hiển thị | High |

### WF-05b: Nội dung Video & Văn bản

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 6 | Thiết lập ràng buộc & lịch hiển thị Video | SCR-05b-003 | Modal/Form cấu hình deadline, điều kiện hoàn thành video, lịch hiển thị | High |
| 7 | Chọn Video từ Thư viện | SCR-05b-004 | Picker chọn video đã upload trong thư viện trường thay vì upload mới | Medium |

### WF-05c: Nội dung File & Khảo sát

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 8 | Form chỉnh sửa file tài liệu | SCR-05c-003 | Edit metadata của file đã upload (tên, mô tả, điều kiện) | Medium |
| 9 | Xem trước file tài liệu (Inline Viewer) | SCR-05c-004 | Preview PDF/Word/Excel trực tiếp trong trình duyệt | High |
| 10 | Chọn file từ thư viện | SCR-05c-005 | Picker chọn file từ thư viện trường | Medium |
| 11 | Danh sách khảo sát trong lớp học | SCR-05c-006 | Danh sách khảo sát đã tạo, thao tác CRUD | High |
| 12 | Form chỉnh sửa khảo sát | SCR-05c-007 (edit) | Chỉnh sửa khảo sát đã tạo (hiện tại chỉ có tạo mới) | High |
| 13 | Xem trước khảo sát | SCR-05c-010 | Preview khảo sát trước khi publish cho học sinh | Medium |
| 14 | Báo cáo kết quả khảo sát | SCR-05c-011 | Thống kê kết quả khảo sát theo câu hỏi, biểu đồ | High |

### WF-06b: Quản trị LMS (User & Role)

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 15 | Quản lý người dùng LMS | SCR-06b-020 | Danh sách user trong hệ thống LMS (khác admin/users) | Medium |
| 16 | Form thêm mới / chỉnh sửa user LMS | SCR-06b-021 | Form CRUD user LMS | Medium |
| 17 | Import user LMS từ Excel (Stepper) | SCR-06b-022 | Stepper import hàng loạt user vào LMS | Medium |
| 18 | Quản lý vai trò LMS | SCR-06b-030 | Danh sách role trong hệ thống LMS | Medium |
| 19 | Form thêm/sửa vai trò LMS | SCR-06b-031 | Form CRUD role LMS | Medium |
| 20 | Phân quyền chức năng LMS | SCR-06b-032 | Ma trận phân quyền chức năng cho từng role LMS | Medium |

### WF-07a: Ngân hàng câu hỏi & Đề thi

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 21 | Sao chép câu hỏi trắc nghiệm | SCR-07-004 | Duplicate câu hỏi MCQ (clone với ID mới) | Low |
| 22 | Kết xuất câu hỏi | SCR-07-005 | Export câu hỏi đang chọn ra file Excel/PDF | Low |
| 23 | Import câu hỏi tự luận từ Excel | SCR-07-007 | Stepper import essay questions từ Excel | Medium |
| 24 | Danh sách Đề thi & Danh mục đề thi (tab Đề thi) | SCR-07-008 | Tab đề thi trong ngân hàng câu hỏi | High |
| 25 | Thêm / Sửa đề thi (form tổng hợp) | SCR-07-009 | Form đầy đủ tạo đề thi (không chỉ là ExamForm hiện tại) | High |
| 26 | Modal thêm/sửa phần thi | SCR-07-010 | Modal cấu hình phần thi trong đề (section) | High |
| 27 | Cấu trúc ngẫu nhiên (random) | SCR-07-011 | Modal cấu hình câu hỏi ngẫu nhiên theo bộ lọc | High |
| 28 | Chọn câu hỏi đích danh | SCR-07-012 | Modal chọn câu hỏi cụ thể vào đề thi | High |
| 29 | Xuất đề thi Offline | SCR-07-013 | Export đề thi ra file Word/PDF để in | Medium |

### WF-07b: Tổ chức thi

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 30 | Quản lý Danh mục Đợt thi | SCR-07b-001 | Cây danh mục (năm học, học kỳ) để phân loại đợt thi | Medium |
| 31 | Form thêm Ca thi từ Excel | SCR-07b-006 | Import ca thi từ file Excel | Medium |
| 32 | Popup thêm học sinh từ hệ thống | SCR-07b-008 | Modal tìm & chọn học sinh vào ca thi | High |
| 33 | Form thêm học sinh từ Excel (cấp Ca thi) | SCR-07b-009 | Import danh sách thí sinh vào một ca thi cụ thể | Medium |
| 34 | Form thêm học sinh từ Excel (cấp Đợt thi) | SCR-07b-010 | Import danh sách thí sinh vào nhiều ca trong đợt thi | Medium |
| 35 | Form thêm ngoại lệ cho nhiều học sinh (Excel) | SCR-07b-011 | Import ngoại lệ (extra time, room exception...) từ Excel | Medium |
| 36 | Form thêm ngoại lệ cho từng học sinh | SCR-07b-012 | Form nhập ngoại lệ cho một thí sinh cụ thể | Medium |
| 37 | Chi tiết bài làm của học sinh | SCR-07b-014 | Xem chi tiết từng câu trả lời của thí sinh sau thi | High |

### WF-08: AI Điểm danh

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 38 | Chi tiết tài khoản camera | SCR-08-003 | Trang chi tiết camera: thông tin, trạng thái, lịch sử | Medium |
| 39 | Màn hình Pipeline AI – Trạng thái xử lý | SCR-08-021 | Dashboard realtime trạng thái pipeline AI (queue, FPS, latency) | High |
| 40 | Báo cáo ra theo địa điểm camera | SCR-08-031 | Báo cáo lượt ra (exit) theo từng địa điểm camera | Medium |
| 41 | Báo cáo tổng hợp vào/ra theo địa điểm | SCR-08-032 | Báo cáo kết hợp vào/ra, tổng hợp theo ngày/địa điểm | High |
| 42 | Nhật ký phân tích camera | SCR-08-033 | Xem log phân tích chi tiết của từng camera (timestamp, confidence) | Medium |
| 43 | Nhật ký phân tích máy điểm danh | SCR-08-034 | Log phân tích từ thiết bị IoT máy điểm danh | Medium |
| 44 | Dữ liệu phân tích theo camera | SCR-08-035 | Danh sách thống kê phân tích theo từng camera | Medium |
| 45 | Chi tiết dữ liệu phân tích một camera | SCR-08-036 | Deep-dive phân tích cho 1 camera: chart, heatmap | Medium |
| 46 | Dữ liệu phân tích theo máy điểm danh | SCR-08-037 | Danh sách thống kê phân tích theo máy điểm danh | Medium |
| 47 | Chia sẻ dữ liệu điểm danh với Hue-S | SCR-08-038 | Form cấu hình & kích hoạt chia sẻ dữ liệu lên Hue-S API | High |

### WF-09a1: Thư viện – Tham số & Đơn đặt

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 48 | Cấu hình email hệ thống thư viện | SCR-09a1-001 | Cài đặt email gửi thông báo quá hạn, nhắc trả sách | Low |
| 49 | Cấu hình ngôn ngữ thư viện | SCR-09a1-002 | Cài đặt ngôn ngữ hiển thị, múi giờ, định dạng ngày | Low |
| 50 | Cấu hình khung phân loại | SCR-09a1-003 | Quản lý hệ thống phân loại tài liệu (DDC, VN...) | Medium |
| 51 | Danh sách nhật ký sử dụng thư viện | SCR-09a1-010 | Log hoạt động trong thư viện (ai mượn gì, lúc nào) | Low |
| 52 | Chi tiết nhật ký | SCR-09a1-011 | Chi tiết 1 bản ghi nhật ký | Low |
| 53 | Xuất / In nhật ký (Modal) | SCR-09a1-012 | Export nhật ký ra Excel/PDF | Low |
| 54 | Tạo yêu cầu đặt mua ấn phẩm | SCR-09a1-020 | Form tạo yêu cầu mua tài liệu mới | Medium |
| 55 | Duyệt yêu cầu đặt mua | SCR-09a1-021 | Duyệt/từ chối yêu cầu mua từ giáo viên | Medium |
| 56 | Danh sách đơn đặt | SCR-09a1-022 | Quản lý các đơn đặt mua ấn phẩm | Medium |
| 57 | Báo cáo duyệt mua | SCR-09a1-023 | Báo cáo tình trạng đơn đặt mua | Low |
| 58 | Đóng kho / Mở kho | SCR-09a1-030 | Tạm đóng/mở lại hoạt động thư viện (kỳ kiểm kê) | Medium |
| 59 | Tạo kỳ kiểm kê | SCR-09a1-031 | Form tạo kỳ kiểm kê tài sản thư viện | Medium |
| 60 | Thực hiện kiểm kê | SCR-09a1-032 | Giao diện scan/nhập kết quả kiểm kê từng tài sản | High |
| 61 | Báo cáo kết quả kiểm kê | SCR-09a1-033 | Báo cáo chênh lệch kiểm kê, tài sản mất/hỏng | Medium |
| 62 | Xếp giá ấn phẩm chưa kiểm nhận | SCR-09a1-040 | Xếp ấn phẩm mới nhập chưa qua kiểm nhận vào vị trí tạm | Medium |
| 63 | Xếp giá / Chuyển kho / Thanh lý | SCR-09a1-041 | Di chuyển tài sản giữa các vị trí, thanh lý tài sản hỏng | Medium |
| 64 | Kiểm nhận & Mở khóa ấn phẩm | SCR-09a1-042 | Xác nhận kiểm nhận ấn phẩm mới, mở khóa để lưu thông | High |

### WF-09a2: Thư viện – Bạn đọc

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 65 | Báo cáo thống kê tài liệu (Hub) | S01 | Trang chọn loại báo cáo về tài liệu | Low |
| 66 | Kết quả báo cáo tài liệu | S02 | Kết quả báo cáo: tài liệu theo danh mục, theo năm... | Low |
| 67 | Danh sách nhóm bạn đọc | S03 | Quản lý nhóm bạn đọc (phân loại theo đối tượng) | Medium |
| 68 | Form tạo / sửa nhóm bạn đọc | S04 | CRUD nhóm bạn đọc | Medium |
| 69 | In thẻ bạn đọc | S07-S09 | Thiết kế mẫu thẻ & in thẻ bạn đọc | High |
| 70 | Báo cáo thống kê bạn đọc (Hub) | S10 | Trang chọn loại báo cáo về bạn đọc | Low |
| 71 | Kết quả thống kê tổng hợp bạn đọc | S11 | Thống kê bạn đọc theo nhóm, giới tính, trạng thái thẻ | Low |
| 72 | Bạn đọc cấp mới & Sắp hết hạn | S12 | Danh sách thẻ mới cấp / thẻ sắp hết hạn | Medium |

### WF-09a3: Thư viện – Mượn Trả

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 73 | Gia hạn mượn | SCR-09a3-020 | Màn hình gia hạn thời hạn mượn cho bạn đọc | High |
| 74 | Chi tiết quá hạn & cập nhật trạng thái | SCR-09a3-031 | Chi tiết 1 bản ghi quá hạn, cập nhật trạng thái xử lý | Medium |
| 75 | Hub báo cáo lưu thông | SCR-09a3-040 | Trang trung tâm chọn loại báo cáo lưu thông | Medium |
| 76 | Báo cáo bạn đọc ra vào thư viện | SCR-09a3-041 | Thống kê lượt vào ra thư viện theo ngày/bạn đọc | Medium |
| 77 | Báo cáo bạn đọc đang mượn | SCR-09a3-042 | Danh sách bạn đọc đang có sách mượn chưa trả | Medium |
| 78 | Báo cáo lịch sử mượn trả | SCR-09a3-043 | Lịch sử toàn bộ giao dịch mượn trả theo bộ lọc | Medium |
| 79 | Báo cáo bạn đọc mượn quá hạn | SCR-09a3-044 | Danh sách bạn đọc có sách quá hạn, chi tiết phạt | High |
| 80 | Báo cáo sử dụng tủ đựng đồ | SCR-09a3-045 | Thống kê sử dụng locker/tủ gửi đồ trong thư viện | Low |
| 81 | Thống kê top bạn đọc mượn nhiều nhất | SCR-09a3-046 | Bảng xếp hạng bạn đọc mượn nhiều nhất | Low |

### WF-09b: Thư viện Portal (Admin)

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 82 | Quản lý nội dung thông tin thư viện (Admin) | SCR-09b-001 | Danh mục nội dung CMS cho trang portal (giới thiệu, liên hệ...) | Medium |
| 83 | Form thêm/sửa nội dung thông tin | SCR-09b-002 | CRUD nội dung tĩnh trang portal | Medium |
| 84 | Quản lý tin tức – sự kiện (Admin) | SCR-09b-004 | Danh sách tin tức admin có thể quản lý | Medium |
| 85 | Form thêm/sửa tin tức – sự kiện | SCR-09b-005 | CRUD tin tức trong portal thư viện | Medium |
| 86 | Danh sách tài liệu điện tử | SCR-09b-030 | OPAC phân loại tài liệu điện tử (e-book, PDF) | High |
| 87 | Chi tiết tài liệu điện tử | SCR-09b-031 | Trang chi tiết e-book: metadata, nút đọc online | High |
| 88 | Trình đọc tài liệu online (Viewer) | SCR-09b-032 | Đọc PDF/ebook trực tiếp trên web (embedded viewer) | High |

### WF-10: Quản trị hệ thống

| # | Màn hình | WF Reference | Mô tả | Ưu tiên |
|---|----------|-------------|-------|---------|
| 89 | Gán / Xóa vai trò cho người dùng | SCR-10-005 | Trang/Modal gán vai trò riêng biệt cho user (hiện tại chỉ có trong edit form) | Medium |
| 90 | Đổi mật khẩu người dùng (đơn lẻ) | SCR-10-005b | Modal đổi mật khẩu cho 1 user cụ thể | Medium |
| 91 | Đổi mật khẩu hàng loạt từ Excel | SCR-10-006 | Stepper import file Excel để reset password hàng loạt | Medium |
| 92 | Khóa / Mở khóa tài khoản hàng loạt | SCR-10-007 | Stepper import Excel để khóa/mở khóa nhiều tài khoản | Medium |
| 93 | Thêm mới đơn vị cùng cấp | SCR-10-021 | Form thêm đơn vị tổ chức cùng cấp | Medium |
| 94 | Thêm mới đơn vị con | SCR-10-022 | Form thêm đơn vị tổ chức con (cấp dưới) | Medium |

---

## Chi tiết từng nhóm màn hình thiếu quan trọng

### Nhóm 1: Thư viện – Đơn đặt mua & Kiểm kê (WF-09a1)

- **WF:** SCR-09a1-020 đến SCR-09a1-042
- **Mô tả:** Toàn bộ nghiệp vụ bổ sung tài liệu mới và kiểm kê tài sản thư viện chưa được implement
- **Components cần tạo:**
  - `PurchaseOrderForm.tsx` – Tạo yêu cầu đặt mua
  - `PurchaseOrderApproval.tsx` – Duyệt yêu cầu
  - `PurchaseOrderList.tsx` – Danh sách đơn đặt
  - `InventorySession.tsx` – Tạo & thực hiện kỳ kiểm kê
  - `InventoryReport.tsx` (nâng cấp) – Báo cáo kiểm kê
  - `ShelvingForm.tsx` – Xếp giá/chuyển kho/thanh lý
  - `AccessionForm.tsx` – Kiểm nhận ấn phẩm mới
- **Routes cần thêm:**
  ```
  /library/orders/
  /library/orders/new
  /library/orders/[id]/review
  /library/inventory/
  /library/inventory/new
  /library/inventory/[id]/
  /library/inventory/[id]/report
  /library/shelving/
  /library/accession/
  ```

### Nhóm 2: Thư viện – Báo cáo lưu thông (WF-09a3 Phần E)

- **WF:** SCR-09a3-040 đến SCR-09a3-046
- **Mô tả:** Hiện tại chỉ có 2 report pages (`/library/reports/circulation` và `/library/reports/inventory`) nhưng wireframe yêu cầu 7 loại báo cáo chi tiết
- **Components cần tạo:**
  - `CirculationReportHub.tsx` – Trang trung tâm chọn báo cáo
  - `LibraryEntryReport.tsx` – Báo cáo ra vào thư viện
  - `ActiveBorrowersReport.tsx` – Bạn đọc đang mượn
  - `BorrowHistoryReport.tsx` – Lịch sử mượn trả
  - `OverdueBorrowersReport.tsx` – Bạn đọc quá hạn
  - `LockerUsageReport.tsx` – Sử dụng tủ đựng đồ
  - `TopBorrowersReport.tsx` – Top bạn đọc
- **Routes cần thêm:**
  ```
  /library/reports/entry-exit
  /library/reports/active-borrowers
  /library/reports/borrow-history
  /library/reports/overdue-borrowers
  /library/reports/locker
  /library/reports/top-borrowers
  ```

### Nhóm 3: Thư viện – Gia hạn mượn (WF-09a3 Phần C)

- **WF:** SCR-09a3-020
- **Mô tả:** Hiện có `/circulation/borrow` và `/circulation/return` nhưng thiếu `/circulation/renew`
- **Components cần tạo:** `RenewForm.tsx` – Gia hạn mượn (scan thẻ → chọn sách đang mượn → gia hạn)
- **Routes cần thêm:** `/library/circulation/renew`

### Nhóm 4: AI Điểm danh – Báo cáo phân tích nâng cao (WF-08 Phần D)

- **WF:** SCR-08-031 đến SCR-08-038
- **Mô tả:** Hiện chỉ có 1 trang báo cáo chung (`/ai-attendance/reports`) và 1 trang analytics tổng. Wireframe yêu cầu 8 màn hình chi tiết
- **Components cần tạo:**
  - `AttendanceExitReport.tsx` – Báo cáo lượt ra
  - `AttendanceSummaryReport.tsx` – Báo cáo tổng hợp vào/ra
  - `CameraAnalysisLog.tsx` – Nhật ký phân tích camera
  - `DeviceAnalysisLog.tsx` – Nhật ký phân tích máy điểm danh
  - `CameraAnalyticsTable.tsx` – Thống kê theo camera
  - `CameraDetailAnalytics.tsx` – Chi tiết phân tích 1 camera
  - `DeviceAnalyticsTable.tsx` – Thống kê theo thiết bị
  - `HueSIntegration.tsx` – Cấu hình chia sẻ Hue-S
- **Routes cần thêm:**
  ```
  /ai-attendance/reports/entry
  /ai-attendance/reports/exit
  /ai-attendance/reports/summary
  /ai-attendance/logs/cameras
  /ai-attendance/logs/devices
  /ai-attendance/analytics/cameras
  /ai-attendance/analytics/cameras/[id]
  /ai-attendance/analytics/devices
  /ai-attendance/hues-sync
  ```

### Nhóm 5: Ngân hàng đề thi – Cấu trúc đề thi (WF-07a)

- **WF:** SCR-07-008 đến SCR-07-013
- **Mô tả:** Hiện có CRUD đề thi cơ bản nhưng thiếu luồng tạo đề phức tạp (chọn câu ngẫu nhiên, đích danh, cấu trúc phần)
- **Components cần tạo:**
  - `ExamBuilder.tsx` – Builder đề thi với các phần (sections)
  - `RandomStructureModal.tsx` – Cấu hình câu hỏi ngẫu nhiên
  - `QuestionPickerModal.tsx` – Chọn câu hỏi đích danh
  - `ExamSectionForm.tsx` – Form thêm/sửa phần thi
  - `ExamExportModal.tsx` – Export đề offline
- **Routes cần thêm:**
  ```
  /exam/exams/[id]/builder  (hoặc nâng cấp /exam/exams/[id]/edit)
  /exam/exams/[id]/export
  ```

### Nhóm 6: GDĐT – Tích hợp đồng bộ (WF-02)

- **WF:** SCR-02-010, SCR-02-011, SCR-02-012
- **Mô tả:** Module đồng bộ với Sở GDĐT chưa có UI riêng. Hiện tại `/admin/integrations` chỉ cover tích hợp chung (SSO, LGSP, email, SMS) nhưng thiếu phần sync cụ thể cho GDĐT
- **Components cần tạo:**
  - `GDDTSyncConfig.tsx` – Cấu hình kết nối GDĐT
  - `GDDTSyncTrigger.tsx` – Kích hoạt đồng bộ + trạng thái
  - `GDDTSyncHistory.tsx` – Lịch sử và log đồng bộ
- **Routes cần thêm:**
  ```
  /gddt/sync/config
  /gddt/sync/trigger
  /gddt/sync/history
  ```
  Hoặc thêm tab trong `/admin/integrations/[id]` nếu tích hợp chung.

### Nhóm 7: Thư viện Portal – Tài liệu điện tử (WF-09b)

- **WF:** SCR-09b-030, SCR-09b-031, SCR-09b-032
- **Mô tả:** Portal thư viện hiện có OPAC tra cứu sách vật lý và tin tức, nhưng chưa có section tài liệu điện tử (e-book, PDF online)
- **Components cần tạo:**
  - `EDocumentList.tsx` – Danh sách tài liệu điện tử
  - `EDocumentDetail.tsx` – Chi tiết e-book
  - `EDocumentViewer.tsx` – Trình đọc online (embed PDF.js hoặc iframe)
- **Routes cần thêm:**
  ```
  /library-portal/edocs
  /library-portal/edocs/[docId]
  /library-portal/edocs/[docId]/read
  ```

### Nhóm 8: Thư viện – Bạn đọc (WF-09a2)

- **WF:** S03, S04, S07-S09, S10-S12
- **Mô tả:** Quản lý thẻ bạn đọc thiếu phần nhóm bạn đọc, in thẻ, và báo cáo bạn đọc
- **Components cần tạo:**
  - `MemberGroupList.tsx` – Danh sách nhóm bạn đọc
  - `MemberGroupForm.tsx` – CRUD nhóm
  - `MemberCardTemplate.tsx` – Mẫu thẻ bạn đọc
  - `PrintMemberCard.tsx` – In thẻ
  - `MemberStatsReport.tsx` – Báo cáo thống kê bạn đọc
- **Routes cần thêm:**
  ```
  /library/members/groups
  /library/members/groups/new
  /library/members/print-cards
  /library/reports/members
  /library/reports/members/expiring
  ```

---

## Màn hình đã implement

| # | Màn hình | WF Reference | Route / File |
|---|----------|-------------|--------------|
| 1 | Trang đăng nhập SSO | SCR-01-001 | `/login` |
| 2 | Dashboard Admin | SCR-01-003 | `/` (AdminDashboard) |
| 3 | Dashboard Giáo viên | SCR-01-004 | `/` (TeacherDashboard) |
| 4 | Dashboard Học sinh | SCR-01-005 | `/` (StudentDashboard) |
| 5 | Trang lỗi đăng nhập | SCR-01-006 | `/unauthorized` |
| 6 | Danh sách lớp GDĐT | SCR-02-001 | `/gddt/classes` |
| 7 | Danh sách học sinh GDĐT | SCR-02-002 | `/gddt/classes/[id]/students` |
| 8 | Cấu hình điểm rèn luyện (list) | SCR-02-003 | `/gddt/conduct-score` |
| 9 | Form thêm/sửa điểm rèn luyện | SCR-02-004 | `/gddt/conduct-score/new`, `/gddt/conduct-score/[id]/edit` |
| 10 | Nhập điểm rèn luyện từng HS | SCR-02-005 | `/gddt/conduct-score/input/[studentId]` |
| 11 | Import điểm rèn luyện Excel | SCR-02-006 | `/gddt/conduct-score/import` |
| 12 | Cấu hình học bổng – Mức | SCR-02-007 | `/gddt/scholarship/levels` |
| 13 | Cấu hình học bổng – Đợt | SCR-02-008 | `/gddt/scholarship/sessions` |
| 14 | Danh sách HS đạt học bổng | SCR-02-009 | `/gddt/scholarship/results` |
| 15 | Danh sách lớp học (my-classes) | SCR-03a1-001 | `/my-classes` |
| 16 | Xem cấu trúc nội dung lớp | SCR-03a1-002 | `/my-classes/[classId]` (ContentSidebar+Viewer) |
| 17 | Xem thông tin giới thiệu lớp | SCR-03a1-003 | `/my-classes/[classId]/about` |
| 18 | Xem tổng quan kết quả HT | SCR-03a1-004 | `/my-classes/[classId]/results` |
| 19 | Xem lịch sử truy cập lớp | SCR-03a1-005 | `/my-classes/[classId]/history` |
| 20 | Xem thông báo trong lớp | SCR-03a1-006 | `/my-classes/[classId]/announcements` |
| 21 | Danh sách bài tập (HS) | SCR-03a2-001 | `/my-classes/[classId]/assignments` |
| 22 | Chi tiết bài tập & Nộp bài | SCR-03a2-002 | `/my-classes/[classId]/assignments/[assignmentId]/submit` |
| 23 | Kết quả sau nộp bài | SCR-03a2-003 | `/my-classes/[classId]/assignments/[assignmentId]/result` |
| 24 | Danh sách thảo luận (HS) | SCR-03a2-004 | `/my-classes/[classId]/discussions` |
| 25 | Thêm mới thảo luận (HS) | SCR-03a2-005 | `/my-classes/[classId]/discussions/new` |
| 26 | Chi tiết & phản hồi thảo luận (HS) | SCR-03a2-008 | `/my-classes/[classId]/discussions/[threadId]` |
| 27 | Danh sách bài thi (HS) | SCR-03b-001 | `/my-exams` |
| 28 | Chi tiết bài thi & Đăng ký | SCR-03b-002 | `/my-exams/register/[examId]` |
| 29 | Phòng thi / Làm bài thi | SCR-03b-003b | `/my-exams/room/[examId]` |
| 30 | Kết quả thi – Tóm tắt | SCR-03b-004a | `/my-exams/result/[examId]` |
| 31 | Lịch sử thi (HS) | — | `/my-exams/history` |
| 32 | Danh sách bài tập tổng hợp | — | `/my-assignments` |
| 33 | Danh sách lớp học (GV/Admin) | SCR-04-001 | `/lms/classes` |
| 34 | Dashboard lớp học | SCR-04-002 | `/lms/classes/dashboard` |
| 35 | Form thêm mới lớp học | SCR-04-003 | `/lms/classes/new` |
| 36 | Form chỉnh sửa lớp học | SCR-04-004 | `/lms/classes/[id]/edit` |
| 37 | Import lớp học từ Excel | SCR-04-007 | `/lms/classes/import` |
| 38 | Danh sách học sinh trong lớp | SCR-04-010 | `/lms/classes/[id]/students` |
| 39 | Duyệt đăng ký lớp học | SCR-04-015 | `/lms/classes/[id]/students` (EnrollmentApproval) |
| 40 | Danh sách nhóm nội dung | SCR-05a-001 | `/lms/classes/[id]/content` |
| 41 | Sao chép nội dung từ lớp khác | SCR-05a-004 | `/lms/classes/[id]/content/copy` |
| 42 | Danh sách SCORM trong nhóm | SCR-05a-005 | `/lms/classes/[id]/content/[groupId]/scorm` |
| 43 | Form thêm/upload SCORM | SCR-05a-006 | `/lms/classes/[id]/content/[groupId]/scorm/new` |
| 44 | Form chỉnh sửa SCORM | SCR-05a-008 | `/lms/classes/[id]/content/[groupId]/scorm/[itemId]/edit` |
| 45 | Xem trước SCORM | SCR-05a-009 | `/lms/classes/[id]/content/[groupId]/scorm/[itemId]/preview` |
| 46 | Danh sách Video | SCR-05b-001 | `/lms/classes/[id]/content/[groupId]/video` |
| 47 | Form thêm/sửa Video | SCR-05b-002 | `/lms/classes/[id]/content/[groupId]/video` (VideoForm) |
| 48 | Danh sách Văn bản | SCR-05b-005 | `/lms/classes/[id]/content/[groupId]/text` |
| 49 | Form thêm/sửa Văn bản | SCR-05b-006 | `/lms/classes/[id]/content/[groupId]/text` (TextEditor) |
| 50 | Danh sách File tài liệu | SCR-05c-001 | `/lms/classes/[id]/content/[groupId]/file` |
| 51 | Form thêm file tài liệu | SCR-05c-002 | `/lms/classes/[id]/content/[groupId]/file` (FileUploadForm) |
| 52 | Form tạo khảo sát | SCR-05c-007 (create) | `/lms/classes/[id]/content/[groupId]/survey` |
| 53 | Danh sách buổi offline | SCR-06a-101 | `/lms/classes/[id]/content/[groupId]/offline` |
| 54 | Form thêm/sửa buổi offline | SCR-06a-102 | `/lms/classes/[id]/content/[groupId]/offline` (OfflineSessionForm) |
| 55 | Danh sách kết quả học tập | SCR-06a-201 | `/lms/classes/[id]/results` |
| 56 | Chi tiết kết quả học sinh | SCR-06a-202 | `/lms/classes/[id]/results/[studentId]` |
| 57 | Danh sách bài tập (GV) | SCR-06a-301 | `/lms/classes/[id]/assignments` |
| 58 | Form thêm/sửa bài tập | SCR-06a-302 | `/lms/classes/[id]/assignments/new`, `/assignments/[assignmentId]/edit` |
| 59 | Danh sách bài nộp | SCR-06a-303 | `/lms/classes/[id]/assignments/[assignmentId]/submissions` |
| 60 | Chấm điểm bài làm | SCR-06a-304 | `/lms/classes/[id]/assignments/[assignmentId]/submissions/[subId]` |
| 61 | Danh sách thảo luận (GV) | SCR-06a-401 | `/lms/classes/[id]/discussions` |
| 62 | Form thêm/sửa thảo luận (GV) | SCR-06a-402 | `/lms/classes/[id]/discussions/new` |
| 63 | Chi tiết & phản hồi (GV) | SCR-06a-403 | `/lms/classes/[id]/discussions/[threadId]` |
| 64 | Danh sách giảng viên trong lớp | SCR-06b-001 | `/lms/classes/[id]/teachers` |
| 65 | Báo cáo lớp học | SCR-06b-010/011 | `/lms/classes/[id]/reports` |
| 66 | Danh sách câu hỏi ngân hàng | SCR-07-001 | `/exam/question-bank` |
| 67 | Form thêm/sửa câu hỏi MCQ | SCR-07-002 | `/exam/question-bank/mcq/new`, `/mcq/[id]/edit` |
| 68 | Import câu hỏi MCQ từ Excel | SCR-07-003 | `/exam/question-bank/mcq/import` |
| 69 | Form thêm/sửa câu hỏi tự luận | SCR-07-006 | `/exam/question-bank/essay/new`, `/essay/[id]/edit` |
| 70 | Danh sách đề thi | SCR-07-008 (partial) | `/exam/exams` |
| 71 | Form thêm/sửa đề thi | SCR-07-009 (partial) | `/exam/exams/new`, `/exam/exams/[id]/edit` |
| 72 | Danh sách Đợt thi | SCR-07b-002 | `/exam/sessions` |
| 73 | Form thêm/sửa Đợt thi | SCR-07b-003 | `/exam/sessions/new`, `/exam/sessions/[sessionId]/edit` |
| 74 | Danh sách Ca thi trong Đợt | SCR-07b-004 | `/exam/sessions/[sessionId]/exams` |
| 75 | Form thêm Ca thi (nhập tay) | SCR-07b-005 (partial) | Trong `/exam/sessions/[sessionId]/exams` |
| 76 | Danh sách học sinh trong Ca thi | SCR-07b-007 | `/exam/sessions/[sessionId]/exams/[examId]/students` |
| 77 | Hồ sơ thi của học sinh | SCR-07b-013 | `/exam/sessions/[sessionId]/exams/[examId]/students/[studentId]` |
| 78 | Danh sách camera | SCR-08-001 | `/ai-attendance/cameras` |
| 79 | Form thêm camera | SCR-08-002 | `/ai-attendance/cameras/new` |
| 80 | Form chỉnh sửa camera | SCR-08-004 | `/ai-attendance/cameras/[id]/edit` |
| 81 | Danh sách máy điểm danh | SCR-08-006 | `/ai-attendance/devices` |
| 82 | Form thêm máy điểm danh | SCR-08-007 | `/ai-attendance/devices/new` |
| 83 | Form sửa máy điểm danh | SCR-08-008 | `/ai-attendance/devices/[id]/edit` |
| 84 | Danh sách khuôn mặt | SCR-08-010 | `/ai-attendance/faces` |
| 85 | Form thêm khuôn mặt | SCR-08-011 | `/ai-attendance/faces/new` |
| 86 | Import khuôn mặt từ ảnh | SCR-08-011 (import) | `/ai-attendance/faces/import` |
| 87 | Form sửa khuôn mặt | SCR-08-012 | `/ai-attendance/faces/[id]/edit` |
| 88 | Dashboard Live Camera | SCR-08-020 | `/ai-attendance/monitor` |
| 89 | Monitor realtime session | SCR-08-020 | `/ai-attendance/monitor/[sessionId]` |
| 90 | Báo cáo vào theo địa điểm | SCR-08-030 | `/ai-attendance/reports` (kết hợp) |
| 91 | Phân tích điểm danh (Analytics) | — | `/ai-attendance/analytics` |
| 92 | Danh sách phiên điểm danh | — | `/ai-attendance/sessions` |
| 93 | Chi tiết phiên điểm danh | — | `/ai-attendance/sessions/[id]` |
| 94 | Catalog sách (Danh sách) | — | `/library/catalog` |
| 95 | Chi tiết sách | — | `/library/catalog/[id]` |
| 96 | Form thêm/sửa sách | — | `/library/catalog/new`, `/catalog/[id]/edit` |
| 97 | Import sách từ Excel | — | `/library/catalog/import` |
| 98 | Ghi mượn | SCR-09a3-001/002/003 | `/library/circulation/borrow` |
| 99 | Ghi trả | SCR-09a3-010/011 | `/library/circulation/return` |
| 100 | Danh sách đang mượn | — | `/library/circulation/active` |
| 101 | Danh sách quá hạn | SCR-09a3-030 | `/library/circulation/overdue` |
| 102 | Quản lý bạn đọc (list) | S05 | `/library/members` |
| 103 | Form thêm/sửa bạn đọc | S06 | `/library/members/new`, `/members/[id]/edit` |
| 104 | Báo cáo lưu thông | — | `/library/reports/circulation` |
| 105 | Báo cáo kiểm kê | — | `/library/reports/inventory` |
| 106 | Cài đặt quy tắc mượn | — | `/library/settings/borrow-rules` |
| 107 | Cài đặt danh mục | — | `/library/settings/categories` |
| 108 | Cài đặt vị trí kho | — | `/library/settings/locations` |
| 109 | Trang chủ portal thư viện | SCR-09b-010 | `/library-portal` |
| 110 | Tin tức portal | SCR-09b-011 | `/library-portal/news/[slug]` |
| 111 | OPAC tìm kiếm | SCR-09b-020 | `/library-portal/opac` |
| 112 | Chi tiết sách OPAC | SCR-09b-021 | `/library-portal/opac/[bookId]` |
| 113 | Danh sách người dùng Admin | SCR-10-001 | `/admin/users` |
| 114 | Form thêm người dùng | SCR-10-002 | `/admin/users/new` |
| 115 | Import người dùng Excel | SCR-10-003 | `/admin/users/import` |
| 116 | Form chỉnh sửa người dùng | SCR-10-004 | `/admin/users/[id]/edit` |
| 117 | Danh sách vai trò | SCR-10-010 | `/admin/roles` |
| 118 | Form thêm/sửa vai trò + Phân quyền | SCR-10-011/012 | `/admin/roles/new`, `/admin/roles/[id]/edit` |
| 119 | Cây cơ cấu tổ chức | SCR-10-020 | `/admin/organization` |
| 120 | Cài đặt chung | — | `/admin/settings/general` |
| 121 | Cài đặt email | — | `/admin/settings/email` |
| 122 | Cài đặt bảo mật | — | `/admin/settings/security` |
| 123 | Audit log | — | `/admin/audit-log` |
| 124 | Quản lý tích hợp | — | `/admin/integrations` |
| 125 | Chi tiết tích hợp | — | `/admin/integrations/[id]` |

---

## Ghi chú

### Các màn hình implement nhưng có thể thiếu chức năng

| Màn hình | Route hiện tại | Chức năng thiếu theo WF |
|----------|---------------|------------------------|
| Form thêm/sửa đề thi | `/exam/exams/new` | Thiếu: cấu trúc phần thi, chọn câu ngẫu nhiên, chọn câu đích danh |
| Danh sách học sinh trong Ca thi | `/exam/sessions/[sessionId]/exams/[examId]/students` | Thiếu: thêm HS từ Excel, quản lý ngoại lệ |
| Danh sách Camera | `/ai-attendance/cameras` | Thiếu: trang chi tiết camera riêng biệt (SCR-08-003) |
| Danh sách bài tập (GV) | `/lms/classes/[id]/assignments` | Hợp nhất với form, ok nhưng cần kiểm tra |
| Báo cáo AI attendance | `/ai-attendance/reports` | Chỉ có 1 loại báo cáo, WF yêu cầu 5-8 loại khác nhau |
| Màn hình khảo sát | `/lms/classes/[id]/content/[groupId]/survey` | Chỉ có create, thiếu list, edit, preview, report |

### Ghi chú kỹ thuật

- **Screens SCR-03a2-006 (Chỉnh sửa thảo luận), SCR-03a2-007 (Xóa thảo luận):** Có thể đã được tích hợp vào màn hình chi tiết thảo luận `/my-classes/[classId]/discussions/[threadId]` như inline actions — cần kiểm tra lại UI thực tế.
- **SCR-06b-020/021/022 (LMS User Management) và SCR-06b-030/031/032 (LMS Role Management):** Hiện tại hệ thống dùng chung `/admin/users` và `/admin/roles` cho cả hệ thống. Nếu LMS cần user/role riêng biệt (phân quyền trong LMS khác với admin), cần tạo routes riêng.
- **SCR-10-021/022 (Thêm đơn vị tổ chức):** Các form thêm đơn vị có thể đã được tích hợp dưới dạng modal/dialog trong `/admin/organization` — cần kiểm tra `OrgUnitForm.tsx`.
- **SCR-09b-001/002/004/005 (Admin portal content):** Các màn hình quản trị nội dung portal thư viện cần route trong dashboard admin (`/library/portal-content/`), không phải trong `/library-portal/` (public).
- **WF-07b-001 (Danh mục Đợt thi):** Có thể là sidebar/tree trong `/exam/sessions` thay vì route riêng — kiểm tra `SessionList.tsx`.
- **SCR-08-007/008/009 (Form máy điểm danh):** WF ghi chú "tương tự SCR-08-002/004/005" — đã được implement tại `/ai-attendance/devices/new` và `/devices/[id]/edit`.
