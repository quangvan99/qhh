"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { ScormList } from "@/features/lms/content/components/ScormList"
import { ScormForm } from "@/features/lms/content/components/ScormForm"
import { ScormLibraryPicker } from "@/features/lms/content/components/ScormLibraryPicker"
import { CompletionConditions } from "@/features/lms/content/components/CompletionConditions"
import { useGetScormItems, useCreateScorm, useDeleteScorm, useGetScormLibrary } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"
import type { ScormItem } from "@/features/lms/content/types/content.types"

export default function ScormPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [conditionsTarget, setConditionsTarget] = useState<ScormItem | null>(null)
  const [librarySearch, setLibrarySearch] = useState("")

  const { data: items = [] } = useGetScormItems(id, groupId)
  const { data: library } = useGetScormLibrary(librarySearch)
  const createMutation = useCreateScorm(id, groupId)
  const deleteMutation = useDeleteScorm(id, groupId)

  return (
    <div>
      <PageHeader
        title="Nội dung SCORM"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "SCORM" }]}
      />

      <ScormList
        items={items}
        onAdd={() => setFormOpen(true)}
        onAddFromLibrary={() => setLibraryOpen(true)}
        onPreview={(item) => router.push(`/lms/classes/${id}/content/${groupId}/scorm/${item.id}/preview`)}
        onEdit={(item) => router.push(`/lms/classes/${id}/content/${groupId}/scorm/${item.id}/edit`)}
        onDelete={(itemId) => deleteMutation.mutate(itemId, { onSuccess: () => toast.success("Đã xóa SCORM") })}
        onConditions={(item) => setConditionsTarget(item)}
      />

      <ScormForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => { toast.success("Đã thêm SCORM"); setFormOpen(false) } })}
        loading={createMutation.isPending}
      />

      <ScormLibraryPicker
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        items={library?.data ?? []}
        searchQuery={librarySearch}
        onSearchChange={setLibrarySearch}
        onSelect={(ids) => { toast.success(`Đã chọn ${ids.length} SCORM`); setLibraryOpen(false) }}
      />

      <CompletionConditions
        open={!!conditionsTarget}
        onOpenChange={(open) => { if (!open) setConditionsTarget(null) }}
        onSubmit={(data) => { toast.success("Đã lưu điều kiện"); setConditionsTarget(null) }}
        initialData={conditionsTarget ? { completionType: conditionsTarget.completionType, minScore: conditionsTarget.minScore, maxAttempts: conditionsTarget.maxAttempts } : undefined}
      />
    </div>
  )
}
