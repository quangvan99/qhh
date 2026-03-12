"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { ClassForm } from "@/features/lms/classes/components/ClassForm"
import { useGetClass, useUpdateClass } from "@/features/lms/classes/api/class.api"
import { toast } from "sonner"

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: cls, isLoading } = useGetClass(id)
  const mutation = useUpdateClass(id)

  if (isLoading) return <div className="p-8 text-muted-foreground">Đang tải...</div>
  if (!cls) return <div className="p-8 text-destructive">Không tìm thấy lớp học</div>

  return (
    <div>
      <PageHeader
        title={`Chỉnh sửa: ${cls.name}`}
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học", href: "/lms/classes" }, { label: cls.name, href: `/lms/classes/${id}/content` }, { label: "Chỉnh sửa" }]}
      />
      <ClassForm
        initialData={cls}
        onSubmit={(data) => {
          mutation.mutate(data, {
            onSuccess: () => { toast.success("Cập nhật thành công!"); router.push(`/lms/classes/${id}/content`) },
            onError: () => toast.error("Lỗi khi cập nhật"),
          })
        }}
        onCancel={() => router.back()}
        loading={mutation.isPending}
      />
    </div>
  )
}
