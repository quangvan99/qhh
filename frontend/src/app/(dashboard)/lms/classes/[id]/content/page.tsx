"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Copy } from "lucide-react"
import { PageHeader } from "@/components/composite/page-header"
import { ContentGroupList } from "@/features/lms/content/components/ContentGroupList"
import { ContentGroupForm } from "@/features/lms/content/components/ContentGroupForm"
import { useGetContentGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, useReorderGroups } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"
import type { ContentGroup, ContentItemType } from "@/features/lms/content/types/content.types"

export default function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editGroup, setEditGroup] = useState<ContentGroup | undefined>()

  const { data: groups = [], isLoading } = useGetContentGroups(id)
  const createMutation = useCreateGroup(id)
  const updateMutation = useUpdateGroup(id)
  const deleteMutation = useDeleteGroup(id)
  const reorderMutation = useReorderGroups(id)

  const handleAddItem = (groupId: string, type: ContentItemType) => {
    router.push(`/lms/classes/${id}/content/${groupId}/${type}`)
  }

  return (
    <div>
      <PageHeader
        title="Nội dung lớp học"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học", href: "/lms/classes" }, { label: "Nội dung" }]}
        actions={[
          { label: "Thêm nhóm", onClick: () => { setEditGroup(undefined); setFormOpen(true) }, icon: <Plus className="h-4 w-4" /> },
          { label: "Sao chép từ lớp khác", onClick: () => router.push(`/lms/classes/${id}/content/copy`), icon: <Copy className="h-4 w-4" />, variant: "outline" },
        ]}
      />

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
      ) : (
        <ContentGroupList
          groups={groups}
          classId={id}
          onReorder={(ids) => reorderMutation.mutate(ids)}
          onEdit={(g) => { setEditGroup(g); setFormOpen(true) }}
          onDelete={(gId) => deleteMutation.mutate(gId, { onSuccess: () => toast.success("Đã xóa nhóm") })}
          onAddItem={handleAddItem}
        />
      )}

      <ContentGroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editGroup}
        onSubmit={(data) => {
          if (data.groupId) {
            updateMutation.mutate({ groupId: data.groupId, name: data.name, description: data.description, visible: data.visible }, { onSuccess: () => toast.success("Đã cập nhật nhóm") })
          } else {
            createMutation.mutate({ name: data.name, description: data.description, visible: data.visible }, { onSuccess: () => toast.success("Đã tạo nhóm") })
          }
        }}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
