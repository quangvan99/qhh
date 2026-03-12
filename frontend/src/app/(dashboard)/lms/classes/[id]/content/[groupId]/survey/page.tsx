"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash2, Eye, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppBadge } from "@/components/base/app-badge"
import { PageHeader } from "@/components/composite/page-header"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import { DataTable } from "@/components/patterns/data-table"
import { AppInput } from "@/components/base/app-input"
import { AppButton } from "@/components/base/app-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SurveyBuilder } from "@/features/lms/content/components/SurveyBuilder"
import { useCreateSurvey } from "@/features/lms/content/api/content.api"
import { toast } from "sonner"
import type { SurveyQuestion } from "@/features/lms/content/types/content.types"

interface MockSurvey {
  id: string
  title: string
  createdAt: string
  questionCount: number
  responseCount: number
  status: "draft" | "published" | "closed"
}

const statusMap: Record<MockSurvey["status"], { label: string; variant: "warning" | "success" | "neutral" }> = {
  draft: { label: "Bản nháp", variant: "warning" },
  published: { label: "Đang mở", variant: "success" },
  closed: { label: "Đã đóng", variant: "neutral" },
}

const mockSurveys: MockSurvey[] = [
  { id: "s1", title: "Khảo sát chất lượng bài giảng", createdAt: "2026-02-01", questionCount: 5, responseCount: 32, status: "published" },
  { id: "s2", title: "Đánh giá giảng viên HK2", createdAt: "2026-02-15", questionCount: 8, responseCount: 0, status: "draft" },
  { id: "s3", title: "Phản hồi nội dung học trực tuyến", createdAt: "2026-03-01", questionCount: 6, responseCount: 45, status: "published" },
  { id: "s4", title: "Khảo sát nhu cầu học thêm", createdAt: "2026-01-20", questionCount: 4, responseCount: 28, status: "closed" },
  { id: "s5", title: "Đánh giá cơ sở vật chất", createdAt: "2026-03-10", questionCount: 7, responseCount: 12, status: "published" },
]

export default function SurveyPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
  const { id, groupId } = use(params)
  const router = useRouter()
  const [tab, setTab] = useState("list")
  const [deleteTarget, setDeleteTarget] = useState<MockSurvey | null>(null)

  // Create form state
  const [title, setTitle] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const createMutation = useCreateSurvey(id, groupId)

  const columns: ColumnDef<MockSurvey, unknown>[] = [
    { accessorKey: "title", header: "Tên khảo sát" },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("vi-VN"),
    },
    { accessorKey: "questionCount", header: "Số câu hỏi" },
    { accessorKey: "responseCount", header: "Số trả lời" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const s = statusMap[row.original.status]
        return <AppBadge semantic={s.variant} dot>{s.label}</AppBadge>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="sm"
            onClick={() => router.push(`/lms/classes/${id}/content/${groupId}/survey/${row.original.id}/preview`)}
            className="cursor-pointer h-8 w-8 p-0" title="Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => router.push(`/lms/classes/${id}/content/${groupId}/survey/${row.original.id}/report`)}
            className="cursor-pointer h-8 w-8 p-0" title="Báo cáo"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => router.push(`/lms/classes/${id}/content/${groupId}/survey/${row.original.id}/edit`)}
            className="cursor-pointer h-8 w-8 p-0" title="Sửa"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => setDeleteTarget(row.original)}
            className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive" title="Xóa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      enableSorting: false,
      size: 160,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Khảo sát"
        breadcrumbs={[
          { label: "LMS", href: "/lms" },
          { label: "Nội dung", href: `/lms/classes/${id}/content` },
          { label: "Khảo sát" },
        ]}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list">Danh sách khảo sát</TabsTrigger>
          <TabsTrigger value="create">Tạo mới</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setTab("create")} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" /> Tạo mới
            </Button>
          </div>
          <DataTable
            data={mockSurveys}
            columns={columns}
            searchable
            searchPlaceholder="Tìm khảo sát..."
          />

          <ConfirmDialog
            open={!!deleteTarget}
            onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
            onConfirm={() => {
              toast.success(`Đã xóa khảo sát "${deleteTarget?.title}"`)
              setDeleteTarget(null)
            }}
            title="Xóa khảo sát"
            description={`Bạn có chắc chắn muốn xóa khảo sát "${deleteTarget?.title ?? ""}"?`}
            variant="danger"
            confirmLabel="Xóa"
          />
        </TabsContent>

        <TabsContent value="create" className="mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <AppInput label="Tiêu đề khảo sát" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." />
              <div className="flex flex-col gap-3 justify-end">
                <div className="flex items-center gap-3">
                  <Switch checked={anonymous} onCheckedChange={(v) => setAnonymous(!!v)} id="anon" />
                  <Label htmlFor="anon" className="cursor-pointer">Ẩn danh</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={showResults} onCheckedChange={(v) => setShowResults(!!v)} id="results" />
                  <Label htmlFor="results" className="cursor-pointer">Hiện kết quả cho HS</Label>
                </div>
              </div>
            </div>

            <SurveyBuilder questions={questions} onChange={setQuestions} />

            <div className="flex gap-2 justify-end">
              <AppButton variant="outline" onClick={() => setTab("list")}>Hủy</AppButton>
              <AppButton module="lms" loading={createMutation.isPending} disabled={!title || questions.length === 0} onClick={() => {
                createMutation.mutate({ title, anonymous, showResults, questions, maxAttempts: 1 } as never, {
                  onSuccess: () => { toast.success("Đã tạo khảo sát"); setTab("list") },
                })
              }}>
                Tạo khảo sát
              </AppButton>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
