'use client'

import { ShieldX } from 'lucide-react'
import { EmptyState } from '@/components/composite/empty-state'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function UnauthorizedPage() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyState
        icon={<ShieldX className="h-12 w-12 text-red-500" strokeWidth={1.5} />}
        title="Không có quyền truy cập"
        description="Bạn không có quyền xem trang này. Liên hệ quản trị viên nếu cần hỗ trợ."
        action={{ label: 'Về trang chủ', href: '/' }}
        secondaryAction={{ label: 'Đăng xuất', onClick: signOut }}
      />
    </div>
  )
}
