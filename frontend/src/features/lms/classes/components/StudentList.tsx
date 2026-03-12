"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, XCircle } from "lucide-react"
import { DataTable } from "@/components/patterns/data-table"
import { AppAvatar } from "@/components/base/app-avatar"
import { AppBadge } from "@/components/base/app-badge"
import { AppButton } from "@/components/base/app-button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import type { ClassStudent } from "../types/class.types"

interface StudentListProps {
  students: ClassStudent[]
  pendingCount: number
  loading?: boolean
  onApprove?: (studentId: string) => void
  onBulkApprove?: (studentIds: string[]) => void
  onRemove?: (studentId: string) => void
  onAddClick?: () => void
}

const statusLabels: Record<ClassStudent["status"], string> = {
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  removed: "Đã xóa",
}

const statusVariants: Record<ClassStudent["status"], "success" | "warning" | "error"> = {
  approved: "success",
  pending: "warning",
  removed: "error",
}

export function StudentList({ students, pendingCount, loading, onApprove, onBulkApprove, onRemove, onAddClick }: StudentListProps) {
  const [tab, setTab] = useState("all")
  const [removeTarget, setRemoveTarget] = useState<ClassStudent | null>(null)

  const filtered = tab === "all" ? students.filter((s) => s.status !== "removed")
    : tab === "pending" ? students.filter((s) => s.status === "pending")
    : students.filter((s) => s.status === "removed")

  const columns: ColumnDef<ClassStudent, unknown>[] = [
    {
      id: "student",
      header: "Học sinh",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AppAvatar name={row.original.name} src={row.original.avatar} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "code", header: "Mã HS" },
    { accessorKey: "enrolledAt", header: "Ngày tham gia", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("vi-VN") },
    {
      accessorKey: "progress",
      header: "Tiến độ",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={getValue() as number} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground">{getValue() as number}%</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const status = getValue() as ClassStudent["status"]
        return <AppBadge semantic={statusVariants[status]} size="sm">{statusLabels[status]}</AppBadge>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.status === "pending" && onApprove && (
            <AppButton variant="ghost" size="sm" onClick={() => onApprove(row.original.studentId)} className="h-8 px-2">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />Duyệt
            </AppButton>
          )}
          {row.original.status !== "removed" && onRemove && (
            <AppButton variant="ghost" size="sm" onClick={() => setRemoveTarget(row.original)} className="h-8 px-2 text-destructive">
              <XCircle className="h-3.5 w-3.5 mr-1" />Xóa
            </AppButton>
          )}
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all" className="cursor-pointer">Tất cả</TabsTrigger>
            <TabsTrigger value="pending" className="cursor-pointer">Chờ duyệt ({pendingCount})</TabsTrigger>
            <TabsTrigger value="removed" className="cursor-pointer">Đã xóa</TabsTrigger>
          </TabsList>
        </Tabs>
        {onAddClick && (
          <AppButton module="lms" onClick={onAddClick}>+ Thêm học sinh</AppButton>
        )}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Tìm theo tên, email, mã HS..."
        selectable={tab === "pending" && !!onBulkApprove}
        bulkActions={tab === "pending" && onBulkApprove ? [{
          label: "Duyệt tất cả",
          onClick: (rows) => onBulkApprove(rows.map((r) => r.studentId)),
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        }] : []}
      />

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null) }}
        onConfirm={() => {
          if (removeTarget && onRemove) onRemove(removeTarget.studentId)
          setRemoveTarget(null)
        }}
        title="Xóa học sinh"
        description={`Xóa ${removeTarget?.name} khỏi lớp? Thao tác này không thể hoàn tác.`}
        variant="danger"
        confirmLabel="Xóa"
      />
    </div>
  )
}
