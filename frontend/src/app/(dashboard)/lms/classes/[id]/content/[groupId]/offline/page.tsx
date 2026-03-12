"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/composite/page-header"
import { OfflineSessionList } from "@/features/lms/content/components/OfflineSessionList"
import { OfflineSessionForm } from "@/features/lms/content/components/OfflineSessionForm"
import { useGetOfflineSessions, useCreateOffline, useUpdateOffline, useDeleteOffline } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"
import type { OfflineSessionItem } from "@/features/lms/content/types/content.types"

export default function OfflinePage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<OfflineSessionItem | undefined>()

  const { data: items = [] } = useGetOfflineSessions(id, groupId)
  const createMutation = useCreateOffline(id, groupId)
  const updateMutation = useUpdateOffline(id, groupId)
  const deleteMutation = useDeleteOffline(id, groupId)

  return (
    <div>
      <PageHeader title="Buổi học offline" breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "Offline" }]} />
      <OfflineSessionList
        items={items}
        onAdd={() => { setEditItem(undefined); setFormOpen(true) }}
        onEdit={(item) => { setEditItem(item); setFormOpen(true) }}
        onDelete={(itemId) => deleteMutation.mutate(itemId, { onSuccess: () => toast.success("Đã xóa") })}
      />
      <OfflineSessionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editItem}
        onSubmit={(data) => {
          if (data.itemId) {
            updateMutation.mutate({ itemId: data.itemId, title: data.title, date: data.date, startTime: data.startTime, endTime: data.endTime, location: data.location, description: data.description }, { onSuccess: () => { toast.success("Đã cập nhật"); setFormOpen(false) } })
          } else {
            const formData = new FormData()
            Object.entries(data).forEach(([k, v]) => { if (v) formData.append(k, String(v)) })
            createMutation.mutate(formData, { onSuccess: () => { toast.success("Đã thêm buổi học"); setFormOpen(false) } })
          }
        }}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
