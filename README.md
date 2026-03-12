---
title: "Tổng quan giải pháp đề xuất xây dựng phần mềm – INDEX"
generated: 2026-03-11
source: qh_full.md
---

# Tổng quan giải pháp đề xuất xây dựng phần mềm

> **Trường THPT Quốc Học Huế** – Hệ thống quản lý trường học thông minh
> Tài liệu được tách ra từ `qh_full.md` (30,331 dòng) thành các file nhỏ để dễ truy cập.

---

## 📋 Mục lục & Điều hướng nhanh

| # | File | Nội dung | Phần |
|---|------|----------|------|
| 1 | [01_tong_quan.md](sections/01_tong_quan.md) | Tổng quan giải pháp – Mục tiêu, yêu cầu kỹ thuật, tiêu chuẩn | §1 |
| 2 | [02_cac_tac_nhan.md](sections/02_cac_tac_nhan.md) | Các tác nhân trong hệ thống | §2.1 |
| 3 | [03_usecase_tong_quan.md](sections/03_usecase_tong_quan.md) | Sơ đồ Usecase tổng quan (tất cả phân hệ) | §2.2 |
| 4 | [04_mo_ta_nang_cap_gddt.md](sections/04_mo_ta_nang_cap_gddt.md) | Mô tả chức năng nâng cấp & tích hợp hệ thống Sở GDĐT | §2.3.1 |
| 5 | [05_hoc_tap_nguoi_hoc_web.md](sections/05_hoc_tap_nguoi_hoc_web.md) | Phân hệ học tập – Chức năng người học trên Web | §2.3.2.1 |
| 6 | [06_hoc_tap_quan_ly.md](sections/06_hoc_tap_quan_ly.md) → [📂 12 file con](sections/06_hoc_tap_quan_ly/) | Phân hệ học tập – Chức năng người Quản lý | §2.3.2.2 |
| 7 | [07_ai_diem_danh_tai_khoan.md](sections/07_ai_diem_danh_tai_khoan.md) | AI Điểm danh – Quản lý tài khoản & thiết bị | §2.3.3.1 |
| 8 | [08_ai_diem_danh_khuon_mat.md](sections/08_ai_diem_danh_khuon_mat.md) | AI Điểm danh – Quản lý dữ liệu khuôn mặt học sinh | §2.3.3.2 |
| 9 | [09_ai_phan_tich_hinh_anh.md](sections/09_ai_phan_tich_hinh_anh.md) | AI Điểm danh – Nền tảng phân tích hình ảnh thông minh | §2.3.3.3 |
| 10 | [10_ai_bao_cao_camera.md](sections/10_ai_bao_cao_camera.md) | AI Điểm danh – Báo cáo thống kê vào/ra theo camera | §2.3.3.4 |
| 11 | [11_ai_bao_cao_phan_tich.md](sections/11_ai_bao_cao_phan_tich.md) | AI Điểm danh – Phân hệ Báo cáo & phân tích dữ liệu | §2.3.3.5 |
| 12 | [12_thu_vien_so.md](sections/12_thu_vien_so.md) | Phân hệ quản lý thư viện số (19 chức năng) | §2.3.4 |
| 13 | [13_dang_nhap_sso.md](sections/13_dang_nhap_sso.md) | Đăng nhập SSO với hệ thống HUE-S | §2.3.5 |

---

## 🗂️ Cấu trúc phân cấp

```
qh/
├── README.md                        ← File index này
├── qh_full.md                       ← File gốc đầy đủ (30,331 dòng)
└── sections/
    ├── 01_tong_quan.md              §1    – Tổng quan & yêu cầu
    ├── 02_cac_tac_nhan.md           §2.1  – Các tác nhân
    ├── 03_usecase_tong_quan.md      §2.2  – Sơ đồ Usecase
    ├── 04_mo_ta_nang_cap_gddt.md    §2.3.1 – Tích hợp GDĐT
    ├── 05_hoc_tap_nguoi_hoc_web.md  §2.3.2.1 – Học tập (người học)
    ├── 06_hoc_tap_quan_ly.md        §2.3.2.2 – Học tập (quản lý) [stub → 12 file con]
    │   └── 06_hoc_tap_quan_ly/      §2.3.2.2 – 12 file con (README.md + 06a..06l)
    ├── 07_ai_diem_danh_tai_khoan.md §2.3.3.1 – AI: tài khoản thiết bị
    ├── 08_ai_diem_danh_khuon_mat.md §2.3.3.2 – AI: khuôn mặt
    ├── 09_ai_phan_tich_hinh_anh.md  §2.3.3.3 – AI: phân tích hình ảnh
    ├── 10_ai_bao_cao_camera.md      §2.3.3.4 – AI: báo cáo camera
    ├── 11_ai_bao_cao_phan_tich.md   §2.3.3.5 – AI: báo cáo phân tích
    ├── 12_thu_vien_so.md            §2.3.4 – Thư viện số
    └── 13_dang_nhap_sso.md          §2.3.5 – Đăng nhập SSO
```

---

## 🔍 Tìm kiếm nhanh theo chủ đề

| Chủ đề | File liên quan |
|--------|---------------|
| Kiến trúc, công nghệ (.NET, Angular, SQL Server) | [01_tong_quan.md](sections/01_tong_quan.md) |
| Tiêu chuẩn CNTT, LGSP/NGSP | [01_tong_quan.md](sections/01_tong_quan.md) |
| Usecase, sơ đồ chức năng | [03_usecase_tong_quan.md](sections/03_usecase_tong_quan.md) |
| Đồng bộ dữ liệu với Sở GDĐT | [04_mo_ta_nang_cap_gddt.md](sections/04_mo_ta_nang_cap_gddt.md) |
| Học trực tuyến, SCORM, Video | [05_hoc_tap_nguoi_hoc_web.md](sections/05_hoc_tap_nguoi_hoc_web.md), [06_hoc_tap_quan_ly.md](sections/06_hoc_tap_quan_ly.md) → [📂](sections/06_hoc_tap_quan_ly/) |
| Thi trực tuyến, ngân hàng câu hỏi | [06_hoc_tap_quan_ly.md](sections/06_hoc_tap_quan_ly.md) → [📂 06j](sections/06_hoc_tap_quan_ly/06j_ql_ngan_hang_cau_hoi.md), [06k](sections/06_hoc_tap_quan_ly/06k_to_chuc_thi_kiem_tra.md) |
| Camera AI, điểm danh khuôn mặt | [07](sections/07_ai_diem_danh_tai_khoan.md) · [08](sections/08_ai_diem_danh_khuon_mat.md) · [09](sections/09_ai_phan_tich_hinh_anh.md) |
| Báo cáo AI, thống kê vào/ra | [10_ai_bao_cao_camera.md](sections/10_ai_bao_cao_camera.md), [11_ai_bao_cao_phan_tich.md](sections/11_ai_bao_cao_phan_tich.md) |
| Thư viện số, mượn trả, OPAC | [12_thu_vien_so.md](sections/12_thu_vien_so.md) |
| SSO, HUE-S, xác thực | [13_dang_nhap_sso.md](sections/13_dang_nhap_sso.md) |

---

*Được tạo tự động từ `qh_full.md` ngày 2026-03-11*
