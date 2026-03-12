"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { ClassForm } from "@/features/lms/classes/components/ClassForm"
import { useCreateClass } from "@/features/lms/classes/api/class.api"
import { toast } from "sonner"

export default function NewClassPage() {
  const router = useRouter()
  const mutation = useCreateClass()

  return (
    <div>
      <PageHeader
        title="Tạo lớp học mới"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học", href: "/lms/classes" }, { label: "Tạo mới" }]}
      />
      <ClassForm
        onSubmit={(data) => {
          mutation.mutate(data, {
            onSuccess: (cls) => {
              toast.success("Tạo lớp học thành công!")
              router.push(`/lms/classes/${cls.id}/content`)
            },
            onError: () => toast.error("Lỗi khi tạo lớp học"),
          })
        }}
        onCancel={() => router.back()}
        loading={mutation.isPending}
      />
    </div>
  )
}
