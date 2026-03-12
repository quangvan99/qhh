# QH – Hệ thống Quản lý Trường học Thông minh

> **Trường THPT Quốc Học Huế** – Smart School Management System

Hệ thống quản lý toàn diện gồm LMS (học tập trực tuyến), AI điểm danh khuôn mặt, thư viện số và tích hợp Sở GDĐT.

---

## ✨ Tính năng chính

| Phân hệ | Mô tả |
|---------|-------|
| 🎓 **LMS** | Quản lý lớp học, nội dung (SCORM, video, file, khảo sát), bài tập, thảo luận |
| 📝 **Thi trực tuyến** | Ngân hàng câu hỏi, đề thi, tổ chức thi, chấm điểm tự động |
| 🤖 **AI Điểm danh** | Nhận diện khuôn mặt qua camera, dashboard realtime, báo cáo thống kê |
| 📚 **Thư viện số** | Catalog sách, mượn/trả/gia hạn, OPAC tra cứu, tài liệu điện tử |
| 🔗 **Tích hợp GDĐT** | Đồng bộ dữ liệu học sinh, điểm rèn luyện, học bổng với Sở GDĐT |
| ⚙️ **Quản trị** | Người dùng, vai trò, phân quyền, cơ cấu tổ chức, audit log |

**168 màn hình** theo wireframe đã được implement đầy đủ.

---

## 🚀 Cách chạy

> Yêu cầu: **Docker**

### Development (hot-reload)

```bash
cd frontend
./scripts/start_dev.sh   # Khởi động
./scripts/stop_dev.sh    # Dừng
```

Truy cập: http://localhost:3000

### Production

```bash
cd frontend
./scripts/start.sh       # Khởi động
./scripts/stop.sh        # Dừng
```

Truy cập: http://localhost:5174

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS, shadcn/ui |
| **State** | TanStack Query v5, Zustand |
| **Table** | TanStack Table v8 |
| **Form** | React Hook Form + Zod |
| **Editor** | Tiptap |
| **Charts** | ECharts |
| **Icons** | Lucide React |

---

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Đăng nhập
│   │   ├── (dashboard)/     # Toàn bộ màn hình dashboard
│   │   │   ├── admin/       # Quản trị hệ thống
│   │   │   ├── ai-attendance/   # AI Điểm danh
│   │   │   ├── exam/        # Thi trực tuyến
│   │   │   ├── gddt/        # Tích hợp GDĐT
│   │   │   ├── library/     # Thư viện
│   │   │   ├── lms/         # LMS Giảng viên
│   │   │   └── my-classes/  # Học tập (Học sinh)
│   │   └── library-portal/  # Portal thư viện (public)
│   ├── features/            # Business logic theo module
│   ├── components/          # UI components dùng chung
│   │   ├── ui/              # Base components (button, input…)
│   │   ├── base/            # App-level components
│   │   ├── composite/       # PageHeader, SearchBar…
│   │   └── patterns/        # DataTable, CrudPage…
│   ├── hooks/               # Custom hooks
│   ├── stores/              # Zustand stores
│   └── types/               # TypeScript types
├── scripts/
│   ├── start.sh             # Khởi động production
│   ├── stop.sh              # Dừng production
│   ├── start_dev.sh         # Khởi động development
│   └── stop_dev.sh          # Dừng development
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
└── docker-compose.dev.yml
```
