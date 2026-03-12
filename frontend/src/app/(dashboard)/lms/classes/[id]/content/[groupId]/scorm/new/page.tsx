"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { ScormForm } from "@/features/lms/content/components/ScormForm"
import { useCreateScorm } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"

export default function NewScormPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const router = useRouter()
  const mutation = useCreateScorm(id, groupId)

  return (
    <div>
      <PageHeader
        title="Thêm SCORM mới"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "SCORM", href: `/lms/classes/${id}/content/${groupId}/scorm` }, { label: "Thêm mới" }]}
      />
      <ScormForm
        open={true}
        onOpenChange={(open) => { if (!open) router.back() }}
        onSubmit={(data) => mutation.mutate(data, { onSuccess: () => { toast.success("Đã thêm SCORM"); router.push(`/lms/classes/${id}/content/${groupId}/scorm`) } })}
        loading={mutation.isPending}
      />
    </div>
  )
}
