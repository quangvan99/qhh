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

## 🗂️ Cấu trúc dự án

```
qh/
├── frontend/          # Next.js 15 App (toàn bộ UI)
├── docs/
│   ├── wireframe/     # 21 file wireframe (WF-01 → WF-10)
│   └── frontend_implement/   # Tài liệu implement theo phase
├── design-system/     # Design tokens & guidelines
└── sections/          # Tài liệu đặc tả chức năng
```

---

## 🚀 Cách chạy

### Yêu cầu
- Node.js ≥ 18
- npm / pnpm
- Docker (tuỳ chọn)

### Chạy với npm

```bash
cd frontend
npm install
npm run dev
```

Truy cập: http://localhost:3000

### Chạy với Docker

```bash
# Dev (hot reload)
docker run -d --name frontend-dev \
  -p 3000:3000 \
  -v $(pwd)/frontend:/app \
  node:20-alpine sh -c "cd /app && npm install && npm run dev"

# Hoặc nếu đã có container
docker start frontend-dev
```

### Build production

```bash
cd frontend
npm run build
npm start
```

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

## 📁 Frontend Structure

```
frontend/src/
├── app/
│   ├── (auth)/          # Đăng nhập
│   ├── (dashboard)/     # Toàn bộ màn hình dashboard
│   │   ├── admin/       # Quản trị hệ thống
│   │   ├── ai-attendance/   # AI Điểm danh
│   │   ├── exam/        # Thi trực tuyến
│   │   ├── gddt/        # Tích hợp GDĐT
│   │   ├── library/     # Thư viện
│   │   ├── lms/         # LMS Giảng viên
│   │   └── my-classes/  # Học tập (Học sinh)
│   └── library-portal/  # Portal thư viện (public)
├── features/            # Business logic theo module
├── components/          # UI components dùng chung
│   ├── ui/              # Base components (button, input…)
│   ├── base/            # App-level components
│   ├── composite/       # PageHeader, SearchBar…
│   └── patterns/        # DataTable, CrudPage…
├── hooks/               # Custom hooks
├── stores/              # Zustand stores
└── types/               # TypeScript types
```

---

## 📋 Scripts

```bash
npm run dev          # Chạy development server (port 3000)
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Kiểm tra ESLint
npm run type-check   # Kiểm tra TypeScript
```

---

## 📖 Tài liệu

- [`docs/wireframe/`](docs/wireframe/) — Wireframe chi tiết từng màn hình
- [`docs/frontend_implement/`](docs/frontend_implement/) — Kế hoạch implement theo phase
- [`docs/design_token/`](docs/design_token/) — Design system & tokens
