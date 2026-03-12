"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppButton } from "@/components/base/app-button"
import { AppAvatar } from "@/components/base/app-avatar"
import { Checkbox } from "@/components/ui/checkbox"
import type { ClassStudent } from "../types/class.types"

interface AddStudentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: ClassStudent[]
  loading?: boolean
  searchQuery: string
  onSearchChange: (q: string) => void
  onConfirm: (studentIds: string[]) => void
  confirming?: boolean
}

export function AddStudentModal({ open, onOpenChange, students, loading, searchQuery, onSearchChange, onConfirm, confirming }: AddStudentModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    onConfirm(Array.from(selected))
    setSelected(new Set())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm học sinh vào lớp</DialogTitle>
        </DialogHeader>

        <AppInput
          placeholder="Tìm theo tên, email, mã HS..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftAddon={<Search className="h-4 w-4" />}
        />

        <div className="max-h-64 overflow-y-auto border rounded-md divide-y">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Đang tải...</div>
          ) : students.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Không tìm thấy học sinh</div>
          ) : (
            students.map((s) => (
              <label key={s.studentId} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                <Checkbox checked={selected.has(s.studentId)} onCheckedChange={() => toggle(s.studentId)} />
                <AppAvatar name={s.name} src={s.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.code} • {s.email}</p>
                </div>
              </label>
            ))
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{selected.size} học sinh đã chọn</span>
          <div className="flex gap-2">
            <AppButton variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
            <AppButton module="lms" onClick={handleConfirm} loading={confirming} disabled={selected.size === 0}>
              Thêm vào lớp
            </AppButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
