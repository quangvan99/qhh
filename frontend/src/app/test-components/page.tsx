"use client"

import { useState } from "react"
import { Mail, Search, Plus } from "lucide-react"
import { AppButton } from "@/components/base/app-button"
import { AppInput } from "@/components/base/app-input"
import { AppBadge } from "@/components/base/app-badge"
import { AppAvatar } from "@/components/base/app-avatar"
import { AppSelect } from "@/components/base/app-select"
import { AppTextarea } from "@/components/base/app-textarea"

export default function TestComponentsPage() {
  const [loading, setLoading] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const [selectVal, setSelectVal] = useState("")
  const [textVal, setTextVal] = useState("")

  const handleLoadingTest = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold text-teal-700">Component Test Page — Phase 0</h1>

      {/* AppButton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">AppButton</h2>
        <div className="flex flex-wrap gap-3">
          <AppButton onClick={handleLoadingTest} loading={loading}>
            {loading ? "Loading..." : "Test Loading"}
          </AppButton>
          <AppButton module="lms" leftIcon={<Plus className="h-4 w-4" />}>LMS Button</AppButton>
          <AppButton module="exam">Exam</AppButton>
          <AppButton module="ai">AI</AppButton>
          <AppButton module="library">Library</AppButton>
          <AppButton module="admin">Admin</AppButton>
          <AppButton variant="outline">Outline</AppButton>
          <AppButton variant="destructive">Destructive</AppButton>
          <AppButton disabled>Disabled</AppButton>
        </div>
      </section>

      {/* AppInput */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">AppInput</h2>
        <div className="grid grid-cols-2 gap-4">
          <AppInput label="Tên đăng nhập" placeholder="Nhập tên..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
          <AppInput label="Email" required placeholder="email@example.com" leftAddon={<Mail className="h-4 w-4" />} />
          <AppInput label="Tìm kiếm" placeholder="Search..." rightAddon={<Search className="h-4 w-4" />} helper="Nhập từ khóa tìm kiếm" />
          <AppInput label="Lỗi ví dụ" error="Trường này là bắt buộc" required placeholder="Nhập..." />
        </div>
      </section>

      {/* AppBadge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">AppBadge</h2>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <AppBadge role="student">Học sinh</AppBadge>
            <AppBadge role="teacher">Giáo viên</AppBadge>
            <AppBadge role="principal">Hiệu trưởng</AppBadge>
            <AppBadge role="admin">Quản trị</AppBadge>
            <AppBadge role="librarian">Thủ thư</AppBadge>
            <AppBadge role="staff">Nhân viên</AppBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppBadge semantic="success" dot>Hoàn thành</AppBadge>
            <AppBadge semantic="warning" dot>Đang xử lý</AppBadge>
            <AppBadge semantic="error" dot>Lỗi</AppBadge>
            <AppBadge semantic="info" dot>Thông tin</AppBadge>
            <AppBadge semantic="neutral">Trung tính</AppBadge>
          </div>
        </div>
      </section>

      {/* AppAvatar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">AppAvatar</h2>
        <div className="flex flex-wrap items-end gap-4">
          <AppAvatar name="Nguyễn Văn A" size="xs" role="student" showRing />
          <AppAvatar name="Trần Thị B" size="sm" role="teacher" showRing />
          <AppAvatar name="Lê Văn C" size="md" role="admin" showRing />
          <AppAvatar name="Phạm Thị D" size="lg" role="librarian" showRing />
          <AppAvatar name="Hoàng Văn E" size="xl" role="principal" showRing />
        </div>
      </section>

      {/* AppSelect */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">AppSelect</h2>
        <div className="grid grid-cols-2 gap-4">
          <AppSelect
            label="Vai trò" required
            options={[
              { value: "student", label: "Học sinh" },
              { value: "teacher", label: "Giáo viên" },
              { value: "admin", label: "Quản trị viên" },
            ]}
            value={selectVal} onChange={setSelectVal}
          />
          <AppSelect
            label="Tìm kiếm môn học" searchable
            options={[
              { value: "math", label: "Toán học" },
              { value: "literature", label: "Ngữ văn" },
              { value: "english", label: "Tiếng Anh" },
              { value: "physics", label: "Vật lý" },
              { value: "chemistry", label: "Hóa học" },
            ]}
            value={selectVal} onChange={setSelectVal}
          />
          <AppSelect
            label="Lỗi ví dụ" error="Vui lòng chọn một giá trị"
            options={[{ value: "a", label: "Option A" }]}
          />
        </div>
      </section>

      {/* AppTextarea */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">AppTextarea</h2>
        <div className="grid grid-cols-2 gap-4">
          <AppTextarea label="Mô tả" placeholder="Nhập mô tả..." value={textVal} onChange={(e) => setTextVal(e.target.value)} helper="Tối đa 500 ký tự" />
          <AppTextarea label="Nội dung" required maxLength={200} showCount value={textVal} onChange={(e) => setTextVal(e.target.value)} />
          <AppTextarea label="Auto resize" autoResize placeholder="Textarea tự động giãn..." />
          <AppTextarea label="Lỗi ví dụ" error="Nội dung không được để trống" required />
        </div>
      </section>
    </div>
  )
}
