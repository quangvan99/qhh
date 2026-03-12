---
title: "WF-05: Quản lý nội dung lớp học"
cluster: "Learning - Content Management"
updated: 2026-03-11
sub_files:
  - WF-05a_noi_dung_nhom_scorm.md
  - WF-05b_noi_dung_video_vanban.md
  - WF-05c_noi_dung_file_khaosat.md
---

# WF-05: Quản lý nội dung lớp học

> **Lưu ý:** Do khối lượng nội dung lớn, WF-05 được tách thành **3 file con** theo loại nội dung.
> Truy cập từng file bên dưới để xem đặc tả wireframe chi tiết.

---

## 📁 Danh sách file con

| File | Nội dung | Số màn hình |
|------|----------|-------------|
| [WF-05a – Nhóm & SCORM](WF-05a_noi_dung_nhom_scorm.md) | Quản lý nhóm nội dung (drag-drop sắp xếp), SCORM (upload, preview, cấu hình điều kiện hoàn thành, chọn từ thư viện) | 10 |
| [WF-05b – Video & Văn bản](WF-05b_noi_dung_video_vanban.md) | Nội dung Video (upload/embed YouTube/Vimeo, cấu hình tiến độ xem), Văn bản rich-text (text + hình ảnh + tệp đính kèm) | 6 |
| [WF-05c – File & Khảo sát](WF-05c_noi_dung_file_khaosat.md) | File tài liệu (PDF/Word/Excel, inline viewer), Khảo sát (builder câu hỏi, xem trước, báo cáo kết quả) | 11 |

**Tổng: 27 màn hình**

---

## 🗂️ Phân cấp chức năng

```
WF-05: Quản lý nội dung lớp học
│
├── WF-05a: Nhóm & SCORM
│   ├── SCR-05a-001  Danh sách nhóm nội dung (kéo-thả sắp xếp)
│   ├── SCR-05a-002  Form thêm nhóm (modal)
│   ├── SCR-05a-003  Form sửa nhóm (modal)
│   ├── SCR-05a-004  Sao chép nhóm từ lớp khác
│   ├── SCR-05a-005  Danh sách nội dung SCORM trong nhóm
│   ├── SCR-05a-006  Form upload SCORM mới
│   ├── SCR-05a-007  Picker SCORM từ thư viện
│   ├── SCR-05a-008  Form sửa SCORM
│   ├── SCR-05a-009  Preview SCORM (fullscreen iframe)
│   └── SCR-05a-010  Cấu hình điều kiện hoàn thành & lịch hiển thị
│
├── WF-05b: Video & Văn bản
│   ├── SCR-05b-001  Danh sách Video trong nhóm
│   ├── SCR-05b-002  Form thêm/sửa Video (upload / embed URL)
│   ├── SCR-05b-003  Cấu hình ràng buộc & lịch Video
│   ├── SCR-05b-004  Chọn Video từ thư viện
│   ├── SCR-05b-005  Danh sách Văn bản
│   └── SCR-05b-006  Form thêm/sửa Văn bản (rich-text + đính kèm)
│
└── WF-05c: File & Khảo sát
    ├── SCR-05c-001  Danh sách File trong nhóm
    ├── SCR-05c-002  Form thêm File (dropzone)
    ├── SCR-05c-003  Form sửa File
    ├── SCR-05c-004  Inline Viewer (PDF.js / Google Docs Viewer)
    ├── SCR-05c-005  Chọn File từ thư viện
    ├── SCR-05c-006  Danh sách Khảo sát
    ├── SCR-05c-007  Builder khảo sát (metadata + câu hỏi)
    ├── SCR-05c-008  Modal nhóm câu hỏi
    ├── SCR-05c-009  Modal câu hỏi ma trận
    ├── SCR-05c-010  Xem trước khảo sát (preview mode)
    └── SCR-05c-011  Báo cáo kết quả khảo sát (biểu đồ + xuất)
```

---

## 🔗 Liên kết điều hướng

- **Trước:** [WF-04 – Quản lý lớp học & học sinh](WF-04_ql_lop_hoc_hoc_sinh.md)
- **Sau:** [WF-06 – Kết quả, Bài tập, Thảo luận](WF-06_ket_qua_bai_tap_thao_luan.md)
- **Index:** [INDEX.md](INDEX.md)
