"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/composite/page-header"
import { VideoList } from "@/features/lms/content/components/VideoList"
import { VideoForm } from "@/features/lms/content/components/VideoForm"
import { useGetVideoItems, useCreateVideo, useDeleteVideo } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"
import type { VideoItem } from "@/features/lms/content/types/content.types"

export default function VideoPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<VideoItem | undefined>()

  const { data: items = [] } = useGetVideoItems(id, groupId)
  const createMutation = useCreateVideo(id, groupId)
  const deleteMutation = useDeleteVideo(id, groupId)

  return (
    <div>
      <PageHeader title="Video" breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "Video" }]} />
      <VideoList
        items={items}
        onAdd={() => { setEditItem(undefined); setFormOpen(true) }}
        onEdit={(item) => { setEditItem(item); setFormOpen(true) }}
        onDelete={(itemId) => deleteMutation.mutate(itemId, { onSuccess: () => toast.success("Đã xóa video") })}
        onPreview={() => {}}
      />
      <VideoForm open={formOpen} onOpenChange={setFormOpen} initialData={editItem} onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => { toast.success("Đã lưu video"); setFormOpen(false) } })} loading={createMutation.isPending} />
    </div>
  )
}
