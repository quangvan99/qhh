'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
}

export function ChangePasswordModal({ open, onOpenChange, userName }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const passwordsMatch = newPassword === confirmPassword
  const isValid = newPassword.length >= 8 && passwordsMatch

  const handleSave = () => {
    if (!isValid) return
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      toast.success(`Đã đổi mật khẩu cho ${userName}`)
      setNewPassword('')
      setConfirmPassword('')
      onOpenChange(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu - {userName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPwd">Mật khẩu mới</Label>
            <Input
              id="newPwd"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
            />
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-xs text-red-500">Mật khẩu phải có tối thiểu 8 ký tự</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPwd">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPwd"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500">Mật khẩu không khớp</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleSave} disabled={!isValid || saving} className="cursor-pointer">
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
