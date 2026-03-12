---
title: "WF-06: Kết quả học tập, Bài tập, Thảo luận & Quản trị LMS"
cluster: "Learning - Manager / Results, Assignments, Discussions, Admin"
updated: 2026-03-11
sub_files:
  - WF-06a_ket_qua_bai_tap_thao_luan.md
  - WF-06b_giang_vien_bao_cao_quantri.md
---

# WF-06: Kết quả học tập, Bài tập, Thảo luận & Quản trị LMS

> **Lưu ý:** WF-06 được tách thành **2 file con** theo nhóm chức năng dành cho Giáo viên / Quản lý.
> Truy cập từng file bên dưới để xem đặc tả wireframe chi tiết.

---

## 📁 Danh sách file con

| File | Nội dung | Số màn hình |
|------|----------|-------------|
| [WF-06a – Kết quả, Bài tập & Thảo luận](WF-06a_ket_qua_bai_tap_thao_luan.md) | Quản lý buổi offline, xem kết quả học tập từng HS, chấm điểm bài tập (upload bài chấm, trả bài), quản lý thảo luận (thread + ghim) | 11 |
| [WF-06b – Giảng viên, Báo cáo & Quản trị LMS](WF-06b_giang_vien_bao_cao_quantri.md) | Thiết lập giảng viên cho lớp, báo cáo tổng hợp lớp học, quản trị user/role/phân quyền toàn hệ thống LMS | 10 |

**Tổng: 21 màn hình**

---

## 🗂️ Phân cấp chức năng

```
WF-06: Kết quả học tập, Bài tập, Thảo luận & Quản trị LMS
│
├── WF-06a: Kết quả, Bài tập & Thảo luận (Giáo viên)
│   │
│   ├── [Buổi offline]
│   │   ├── SCR-06a-101  Danh sách buổi offline (tìm/thêm/sửa/xóa)
│   │   └── SCR-06a-102  Form thêm/sửa buổi + tệp đính kèm
│   │
│   ├── [Kết quả học tập]
│   │   ├── SCR-06a-201  Bảng kết quả học tập theo lớp (xuất báo cáo)
│   │   └── SCR-06a-202  Chi tiết kết quả từng HS + xét Hoàn thành
│   │
│   ├── [Bài tập]
│   │   ├── SCR-06a-301  Danh sách bài tập (filter, sắp xếp, bulk)
│   │   ├── SCR-06a-302  Form thêm/sửa bài tập + tệp đính kèm
│   │   ├── SCR-06a-303  Danh sách bài nộp của HS
│   │   └── SCR-06a-304  Chấm điểm: xem bài + nhập điểm + trả bài
│   │
│   └── [Thảo luận]
│       ├── SCR-06a-401  Danh sách thảo luận (search/filter/ghim/bulk-delete)
│       ├── SCR-06a-402  Form thêm/sửa thảo luận
│       └── SCR-06a-403  Chi tiết thread + phản hồi lồng nhau
│
└── WF-06b: Giảng viên, Báo cáo & Quản trị LMS (Admin)
    │
    ├── [Thiết lập giảng viên]
    │   ├── SCR-06b-001  Danh sách giảng viên trong lớp
    │   └── SCR-06b-002  Dialog thêm giảng viên (dual-panel search)
    │
    ├── [Báo cáo lớp học]
    │   ├── SCR-06b-010  Hub báo cáo (4 tabs: DS HS / KQ Thi / KQ Học / Tổng hợp)
    │   └── SCR-06b-011  Xem báo cáo chi tiết + xuất Excel/PDF
    │
    └── [Quản trị hệ thống LMS]
        ├── SCR-06b-020  Danh sách người dùng (CRUD + khóa/mở + xuất)
        ├── SCR-06b-021  Form thêm/sửa người dùng
        ├── SCR-06b-022  Import người dùng từ Excel (3 bước stepper)
        ├── SCR-06b-030  Danh sách vai trò (CRUD + gán quyền)
        ├── SCR-06b-031  Form thêm/sửa vai trò
        └── SCR-06b-032  Phân quyền chức năng theo module
```

---

## 🔗 Liên kết điều hướng

- **Trước:** [WF-05 – Quản lý nội dung lớp học](WF-05_ql_noi_dung_lop_hoc.md)
- **Sau:** [WF-07a – Ngân hàng câu hỏi & Đề thi](WF-07a_ngan_hang_cau_hoi.md)
- **Index:** [INDEX.md](INDEX.md)
