"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { ImportStepper } from "@/components/patterns/import-stepper"

export default function ImportClassesPage() {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="Import lớp học từ Excel"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học", href: "/lms/classes" }, { label: "Import" }]}
      />
      <ImportStepper
        templateUrl="/templates/import-classes-template.xlsx"
        onUpload={async (file) => {
          // Parse client-side or send to server for preview
          return { headers: ["Tên lớp", "Mã lớp", "Mô tả", "Năm học", "Học kỳ", "Mã GV", "Phương thức đăng ký"], rows: [], totalRows: 0 }
        }}
        onConfirm={async (data) => {
          return { success: data.totalRows, failed: 0 }
        }}
        onClose={() => router.push("/lms/classes")}
      />
    </div>
  )
}
