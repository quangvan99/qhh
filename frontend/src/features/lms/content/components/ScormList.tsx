"use client"

import { useState } from "react"
import { Package, Eye, Pencil, Trash2, Settings, Plus, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppBadge } from "@/components/base/app-badge"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ScormItem } from "../types/content.types"

interface ScormListProps {
  items: ScormItem[]
  onAdd: () => void
  onAddFromLibrary: () => void
  onPreview: (item: ScormItem) => void
  onEdit: (item: ScormItem) => void
  onDelete: (itemId: string) => void
  onConditions: (item: ScormItem) => void
}

export function ScormList({ items, onAdd, onAddFromLibrary, onPreview, onEdit, onDelete, onConditions }: ScormListProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="cursor-pointer" />}>
            <Plus className="h-3.5 w-3.5 mr-1" />Thêm SCORM
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onAdd} className="cursor-pointer">Upload mới</DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFromLibrary} className="cursor-pointer"><Library className="h-3.5 w-3.5 mr-2" />Chọn từ thư viện</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Chưa có SCORM nào.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/30 transition-colors">
              <Package className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{(item.fileSize / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <AppBadge semantic={item.status === "published" ? "success" : "neutral"} size="sm">{item.status === "published" ? "Đã xuất bản" : "Nháp"}</AppBadge>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="sm" onClick={() => onPreview(item)} className="cursor-pointer h-7 w-7 p-0" title="Xem trước">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onConditions(item)} className="cursor-pointer h-7 w-7 p-0" title="Điều kiện">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="cursor-pointer h-7 w-7 p-0">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item.id)} className="cursor-pointer h-7 w-7 p-0 text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => { if (deleteTarget) onDelete(deleteTarget); setDeleteTarget(null) }}
        title="Xóa SCORM"
        description="Bạn có chắc chắn muốn xóa SCORM này?"
        variant="danger"
        confirmLabel="Xóa"
      />
    </div>
  )
}
