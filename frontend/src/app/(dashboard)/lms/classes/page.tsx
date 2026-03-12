"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { Upload, Download, Copy } from "lucide-react"
import { CrudPage } from "@/components/patterns/crud-page"
import { AppAvatar } from "@/components/base/app-avatar"
import { AppBadge } from "@/components/base/app-badge"
import { AppSelect } from "@/components/base/app-select"
import { Progress } from "@/components/ui/progress"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import { useGetClasses, useDeleteClass, useCopyClass } from "@/features/lms/classes/api/class.api"
import type { LMSClass } from "@/features/lms/classes/types/class.types"

const statusLabels: Record<LMSClass["status"], string> = { active: "Đang học", completed: "Kết thúc", upcoming: "Sắp khai giảng" }
const statusVariants: Record<LMSClass["status"], "success" | "neutral" | "info"> = { active: "success", completed: "neutral", upcoming: "info" }

export default function ClassListPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<{ year?: string; term?: string; status?: string }>({})
  const [copyTarget, setCopyTarget] = useState<LMSClass | null>(null)
  const { data, isLoading } = useGetClasses(filters)
  const deleteMutation = useDeleteClass()
  const copyMutation = useCopyClass()

  const columns: ColumnDef<LMSClass, unknown>[] = [
    {
      id: "class",
      header: "Lớp học",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">{row.original.code.slice(0, 2)}</div>
          <div>
            <p className="font-medium text-sm cursor-pointer hover:text-emerald-600" onClick={() => router.push(`/lms/classes/${row.original.id}/content`)}>{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        </div>
      ),
    },
    {
      id: "teacher",
      header: "Giáo viên",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AppAvatar name={row.original.teacher.name} src={row.original.teacher.avatar} size="xs" />
          <span className="text-sm">{row.original.teacher.name}</span>
        </div>
      ),
    },
    { accessorKey: "studentCount", header: "Học sinh" },
    {
      accessorKey: "progress",
      header: "Tiến độ",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress value={getValue() as number} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground w-8">{getValue() as number}%</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const s = getValue() as LMSClass["status"]
        return <AppBadge semantic={statusVariants[s]} size="sm">{statusLabels[s]}</AppBadge>
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("vi-VN"),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <AppSelect placeholder="Năm học" options={[{ value: "2025-2026", label: "2025-2026" }, { value: "2024-2025", label: "2024-2025" }]} value={filters.year ?? ""} onChange={(v) => setFilters((f) => ({ ...f, year: v }))} className="w-[140px]" />
        <AppSelect placeholder="Học kỳ" options={[{ value: "HK1", label: "HK1" }, { value: "HK2", label: "HK2" }, { value: "full", label: "Cả năm" }]} value={filters.term ?? ""} onChange={(v) => setFilters((f) => ({ ...f, term: v }))} className="w-[120px]" />
        <AppSelect placeholder="Trạng thái" options={[{ value: "active", label: "Đang hoạt động" }, { value: "completed", label: "Kết thúc" }]} value={filters.status ?? ""} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} className="w-[160px]" />
      </div>

      <CrudPage<LMSClass>
        title="Quản lý lớp học"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học" }]}
        data={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        onCreate={() => router.push("/lms/classes/new")}
        onEdit={(row) => router.push(`/lms/classes/${row.id}/edit`)}
        onDelete={(row) => deleteMutation.mutate(row.id)}
        extraActions={[
          { label: "Import Excel", onClick: () => router.push("/lms/classes/import"), icon: <Upload className="h-4 w-4" />, variant: "outline" },
          { label: "Xuất Excel", onClick: () => {}, icon: <Download className="h-4 w-4" />, variant: "outline" },
        ]}
        searchPlaceholder="Tìm theo tên lớp, mã lớp..."
      />

      <ConfirmDialog
        open={!!copyTarget}
        onOpenChange={(open) => { if (!open) setCopyTarget(null) }}
        onConfirm={() => { if (copyTarget) copyMutation.mutate(copyTarget.id); setCopyTarget(null) }}
        title="Sao chép lớp"
        description={`Sao chép lớp "${copyTarget?.name}"? Nội dung sẽ được sao chép, học sinh sẽ không.`}
        confirmLabel="Sao chép"
      />
    </div>
  )
}
