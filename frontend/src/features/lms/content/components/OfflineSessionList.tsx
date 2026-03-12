"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DataTable } from "@/components/patterns/data-table"
import { AppBadge } from "@/components/base/app-badge"
import { AppButton } from "@/components/base/app-button"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import type { OfflineSessionItem } from "../types/content.types"

interface OfflineSessionListProps {
  items: OfflineSessionItem[]
  onAdd: () => void
  onEdit: (item: OfflineSessionItem) => void
  onDelete: (itemId: string) => void
}

const statusLabels: Record<OfflineSessionItem["sessionStatus"], string> = {
  upcoming: "Sắp diễn ra",
  ongoing: "Đang diễn ra",
  completed: "Đã qua",
}

const statusVariants: Record<OfflineSessionItem["sessionStatus"], "info" | "success" | "neutral"> = {
  upcoming: "info",
  ongoing: "success",
  completed: "neutral",
}

export function OfflineSessionList({ items, onAdd, onEdit, onDelete }: OfflineSessionListProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const columns: ColumnDef<OfflineSessionItem, unknown>[] = [
    {
      accessorKey: "date",
      header: "Ngày giờ",
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{new Date(row.original.date).toLocaleDateString("vi-VN")}</p>
          <p className="text-xs text-muted-foreground">{row.original.startTime}{row.original.endTime ? ` - ${row.original.endTime}` : ""}</p>
        </div>
      ),
    },
    { accessorKey: "title", header: "Tiêu đề" },
    { accessorKey: "location", header: "Địa điểm", cell: ({ getValue }) => <span className="text-sm">{(getValue() as string) || "—"}</span> },
    {
      accessorKey: "sessionStatus",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const status = getValue() as OfflineSessionItem["sessionStatus"]
        return <AppBadge semantic={statusVariants[status]} size="sm">{statusLabels[status]}</AppBadge>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)} className="cursor-pointer h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original.id)} className="cursor-pointer h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div className="space-y-4">
      <AppButton module="lms" onClick={onAdd}><Plus className="h-4 w-4 mr-1" />Thêm buổi học</AppButton>
      <DataTable data={items} columns={columns} searchable searchPlaceholder="Tìm buổi học..." />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => { if (deleteTarget) onDelete(deleteTarget); setDeleteTarget(null) }}
        title="Xóa buổi học"
        description="Bạn có chắc chắn muốn xóa buổi học này?"
        variant="danger"
        confirmLabel="Xóa"
      />
    </div>
  )
}
