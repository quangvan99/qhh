'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/base/app-avatar'
import { useResetUserPassword } from '../api/admin.api'
import type { SystemUser } from '../types/admin.types'
import { toast } from 'sonner'

interface ResetPasswordModalProps {
  user: SystemUser
  onClose: () => void
}

export function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
  const resetPassword = useResetUserPassword()

  const handleReset = () => {
    resetPassword.mutate(user.id, {
      onSuccess: () => {
        toast.success('Mật khẩu tạm thời đã được gửi qua email')
        onClose()
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi đặt lại mật khẩu')
      },
    })
  }

  return (
    <Dialog open onOpenChange={(open: boolean) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>
            Đặt lại mật khẩu cho người dùng
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <AppAvatar name={user.fullName} src={user.avatar} size="md" />
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Mật khẩu tạm thời sẽ được gửi qua email đến <span className="font-medium">{user.email}</span>.
          Người dùng sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần tiếp theo.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleReset} disabled={resetPassword.isPending} className="cursor-pointer">
            {resetPassword.isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
