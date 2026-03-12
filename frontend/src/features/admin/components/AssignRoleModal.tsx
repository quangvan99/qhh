'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface AssignRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  currentRoles?: string[]
}

const allRoles = [
  { id: 'admin', name: 'Quản trị viên', description: 'Toàn quyền hệ thống' },
  { id: 'teacher', name: 'Giáo viên', description: 'Quản lý lớp học, bài tập' },
  { id: 'student', name: 'Học sinh', description: 'Xem nội dung, nộp bài' },
  { id: 'principal', name: 'Ban giám hiệu', description: 'Xem báo cáo, thống kê' },
  { id: 'librarian', name: 'Thủ thư', description: 'Quản lý thư viện' },
  { id: 'staff', name: 'Nhân viên', description: 'Hỗ trợ quản trị' },
  { id: 'exam_admin', name: 'Quản trị thi', description: 'Quản lý đề thi, ca thi' },
]

export function AssignRoleModal({ open, onOpenChange, userName, currentRoles = [] }: AssignRoleModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(currentRoles))

  const toggleRole = (roleId: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(roleId)) {
        next.delete(roleId)
      } else {
        next.add(roleId)
      }
      return next
    })
  }

  const handleSave = () => {
    toast.success(`Đã cập nhật vai trò cho ${userName}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gán vai trò - {userName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {allRoles.map((role) => (
            <label
              key={role.id}
              className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                checked={selected.has(role.id)}
                onCheckedChange={() => toggleRole(role.id)}
                className="mt-0.5"
              />
              <div>
                <p className="font-medium text-sm">{role.name}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleSave} className="cursor-pointer">Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
