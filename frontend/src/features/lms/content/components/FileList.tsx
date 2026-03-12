"use client"

import { useState } from "react"
import { FileIcon, Pencil, Trash2, Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppBadge } from "@/components/base/app-badge"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import type { FileItem } from "../types/content.types"

interface FileListProps {
  items: FileItem[]
  onAdd: () => void
  onEdit: (item: FileItem) => void
  onDelete: (itemId: string) => void
  onView: (item: FileItem) => void
}

export function FileList({ items, onAdd, onEdit, onDelete, onView }: FileListProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={onAdd} className="cursor-pointer"><Plus className="h-3.5 w-3.5 mr-1" />Upload tài liệu</Button>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Chưa có tài liệu nào.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => onView(item)}>
              <FileIcon className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.fileName} • {formatSize(item.fileSize)}</p>
              </div>
              <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                <a href={item.fileUrl} download={item.fileName}>
                  <Button variant="ghost" size="sm" className="cursor-pointer h-7 w-7 p-0"><Download className="h-3.5 w-3.5" /></Button>
                </a>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="cursor-pointer h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item.id)} className="cursor-pointer h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} onConfirm={() => { if (deleteTarget) onDelete(deleteTarget); setDeleteTarget(null) }} title="Xóa tài liệu" description="Bạn có chắc chắn muốn xóa tài liệu này?" variant="danger" confirmLabel="Xóa" />
    </div>
  )
}
