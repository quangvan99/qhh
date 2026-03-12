"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/composite/page-header"
import { AppInput } from "@/components/base/app-input"
import { AppButton } from "@/components/base/app-button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useGetClasses } from "@/features/lms/classes/api/class.api"
import { useGetContentGroups, useCopyContentFromClass } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"

export default function CopyContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [searchQ, setSearchQ] = useState("")
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())

  const { data: classes } = useGetClasses({ q: searchQ })
  const { data: sourceGroups = [] } = useGetContentGroups(selectedClass ?? "")
  const copyMutation = useCopyContentFromClass(id)

  const handleCopy = () => {
    if (!selectedClass) return
    copyMutation.mutate(
      { sourceClassId: selectedClass, groupIds: Array.from(selectedGroups) },
      { onSuccess: () => { toast.success("Đã sao chép nội dung"); router.push(`/lms/classes/${id}/content`) } }
    )
  }

  return (
    <div>
      <PageHeader
        title="Sao chép nội dung từ lớp khác"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học", href: "/lms/classes" }, { label: "Nội dung", href: `/lms/classes/${id}/content` }, { label: "Sao chép" }]}
      />

      <div className="space-y-4 max-w-xl">
        <AppInput placeholder="Tìm lớp học..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} leftAddon={<Search className="h-4 w-4" />} />

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {(classes?.data ?? []).filter((c) => c.id !== id).map((c) => (
            <Card key={c.id} className={`cursor-pointer transition-colors ${selectedClass === c.id ? "ring-2 ring-emerald-500" : ""}`} onClick={() => { setSelectedClass(c.id); setSelectedGroups(new Set()) }}>
              <CardContent className="p-3 text-sm">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.code} • {c.teacher.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedClass && sourceGroups.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Chọn nhóm nội dung để sao chép:</p>
            {sourceGroups.map((g) => (
              <label key={g.id} className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50">
                <Checkbox
                  checked={selectedGroups.has(g.id)}
                  onCheckedChange={() => {
                    setSelectedGroups((prev) => {
                      const next = new Set(prev)
                      if (next.has(g.id)) next.delete(g.id)
                      else next.add(g.id)
                      return next
                    })
                  }}
                />
                <span className="text-sm">{g.name} ({g.itemCount} mục)</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <AppButton variant="outline" onClick={() => router.back()}>Hủy</AppButton>
          <AppButton module="lms" onClick={handleCopy} disabled={selectedGroups.size === 0} loading={copyMutation.isPending}>
            Sao chép ({selectedGroups.size} nhóm)
          </AppButton>
        </div>
      </div>
    </div>
  )
}
