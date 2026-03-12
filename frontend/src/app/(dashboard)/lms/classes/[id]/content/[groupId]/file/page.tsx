"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/composite/page-header"
import { FileList } from "@/features/lms/content/components/FileList"
import { FileUploadForm } from "@/features/lms/content/components/FileUploadForm"
import { useGetFileItems, useCreateFile, useDeleteFile } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"
import type { FileItem } from "@/features/lms/content/types/content.types"

export default function FilePage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<FileItem | undefined>()

  const { data: items = [] } = useGetFileItems(id, groupId)
  const createMutation = useCreateFile(id, groupId)
  const deleteMutation = useDeleteFile(id, groupId)

  return (
    <div>
      <PageHeader title="Tài liệu" breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "Tài liệu" }]} />
      <FileList
        items={items}
        onAdd={() => { setEditItem(undefined); setFormOpen(true) }}
        onEdit={(item) => { setEditItem(item); setFormOpen(true) }}
        onDelete={(itemId) => deleteMutation.mutate(itemId, { onSuccess: () => toast.success("Đã xóa tài liệu") })}
        onView={() => {}}
      />
      <FileUploadForm open={formOpen} onOpenChange={setFormOpen} initialData={editItem} onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => { toast.success("Đã lưu"); setFormOpen(false) } })} loading={createMutation.isPending} />
    </div>
  )
}
