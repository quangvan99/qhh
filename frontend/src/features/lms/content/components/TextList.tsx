"use client"

import { useState } from "react"
import { FileText, Pencil, Trash2, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppBadge } from "@/components/base/app-badge"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import type { TextItem } from "../types/content.types"

interface TextListProps {
  items: TextItem[]
  onAdd: () => void
  onEdit: (item: TextItem) => void
  onDelete: (itemId: string) => void
  onPreview: (item: TextItem) => void
}

export function TextList({ items, onAdd, onEdit, onDelete, onPreview }: TextListProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={onAdd} className="cursor-pointer"><Plus className="h-3.5 w-3.5 mr-1" />Thêm văn bản</Button>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Chưa có văn bản nào.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/30 transition-colors">
              <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.attachments?.length ?? 0} file đính kèm</p>
              </div>
              <AppBadge semantic={item.status === "published" ? "success" : "neutral"} size="sm">{item.status === "published" ? "Đã xuất bản" : "Nháp"}</AppBadge>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="sm" onClick={() => onPreview(item)} className="cursor-pointer h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="cursor-pointer h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item.id)} className="cursor-pointer h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} onConfirm={() => { if (deleteTarget) onDelete(deleteTarget); setDeleteTarget(null) }} title="Xóa văn bản" description="Bạn có chắc chắn muốn xóa văn bản này?" variant="danger" confirmLabel="Xóa" />
    </div>
  )
}
