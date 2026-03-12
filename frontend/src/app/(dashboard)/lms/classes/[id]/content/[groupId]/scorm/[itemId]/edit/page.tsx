"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { ScormForm } from "@/features/lms/content/components/ScormForm"
import { useGetScormItems, useUpdateScorm } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"

export default function EditScormPage({ params }: { params: Promise<{ id: string; groupId: string; itemId: string }> }) {
  const { id, groupId, itemId } = use(params)
  const router = useRouter()
  const { data: items = [] } = useGetScormItems(id, groupId)
  const item = items.find((i) => i.id === itemId)
  const mutation = useUpdateScorm(id, groupId)

  if (!item) return <div className="p-8 text-muted-foreground">Đang tải...</div>

  return (
    <div>
      <PageHeader
        title={`Sửa: ${item.title}`}
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "SCORM", href: `/lms/classes/${id}/content/${groupId}/scorm` }, { label: "Sửa" }]}
      />
      <ScormForm
        open={true}
        onOpenChange={(open) => { if (!open) router.back() }}
        initialData={item}
        onSubmit={(data) => {
          mutation.mutate(
            { itemId, ...data },
            { onSuccess: () => { toast.success("Đã cập nhật"); router.push(`/lms/classes/${id}/content/${groupId}/scorm`) } }
          )
        }}
        loading={mutation.isPending}
      />
    </div>
  )
}
