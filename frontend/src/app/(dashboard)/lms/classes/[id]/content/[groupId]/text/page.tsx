"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { AppInput } from "@/components/base/app-input"
import { AppButton } from "@/components/base/app-button"
import { TextEditor } from "@/features/lms/content/components/TextEditor"
import { useCreateText } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"

export default function TextContentPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const createMutation = useCreateText(id, groupId)

  return (
    <div>
      <PageHeader title="Thêm văn bản" breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "Văn bản" }]} />
      <div className="space-y-4 max-w-4xl">
        <AppInput label="Tiêu đề" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." />
        <div>
          <p className="text-sm font-medium mb-1.5">Nội dung <span className="text-destructive">*</span></p>
          <TextEditor content={content} onChange={setContent} />
        </div>
        <div className="flex gap-2 justify-end">
          <AppButton variant="outline" onClick={() => router.back()}>Hủy</AppButton>
          <AppButton module="lms" loading={createMutation.isPending} onClick={() => createMutation.mutate({ title, content }, { onSuccess: () => { toast.success("Đã lưu"); router.push(`/lms/classes/${id}/content`) } })}>
            Lưu
          </AppButton>
        </div>
      </div>
    </div>
  )
}
