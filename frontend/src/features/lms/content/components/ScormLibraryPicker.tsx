"use client"

import { useState } from "react"
import { Search, Package } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppButton } from "@/components/base/app-button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { ScormLibraryItem } from "../types/content.types"

interface ScormLibraryPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: ScormLibraryItem[]
  loading?: boolean
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelect: (ids: string[]) => void
}

export function ScormLibraryPicker({ open, onOpenChange, items, loading, searchQuery, onSearchChange, onSelect }: ScormLibraryPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chọn SCORM từ thư viện</DialogTitle>
        </DialogHeader>

        <AppInput placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} leftAddon={<Search className="h-4 w-4" />} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">Không tìm thấy SCORM</div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className={cn("cursor-pointer transition-colors", selected.has(item.id) && "ring-2 ring-emerald-500")} onClick={() => toggle(item.id)}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={selected.has(item.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Package className="h-4 w-4 text-emerald-600 shrink-0" />
                        <p className="text-sm font-medium truncate">{item.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{(item.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <DialogFooter>
          <AppButton variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
          <AppButton module="lms" onClick={() => { onSelect(Array.from(selected)); setSelected(new Set()) }} disabled={selected.size === 0}>
            Chọn ({selected.size})
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
