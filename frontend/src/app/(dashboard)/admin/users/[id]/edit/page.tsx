'use client'

import { use, useState } from 'react'
import { UserForm } from '@/features/admin/components/UserForm'
import { AssignRoleModal } from '@/features/admin/components/AssignRoleModal'
import { ChangePasswordModal } from '@/features/admin/components/ChangePasswordModal'
import { Button } from '@/components/ui/button'
import { Shield, KeyRound } from 'lucide-react'

export default function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [pwdModalOpen, setPwdModalOpen] = useState(false)

  return (
    <div>
      <UserForm userId={id} />

      {/* Extra action buttons */}
      <div className="flex items-center gap-3 mt-6 max-w-2xl">
        <Button variant="outline" onClick={() => setRoleModalOpen(true)} className="cursor-pointer">
          <Shield className="h-4 w-4 mr-2" /> Quản lý vai trò
        </Button>
        <Button variant="outline" onClick={() => setPwdModalOpen(true)} className="cursor-pointer">
          <KeyRound className="h-4 w-4 mr-2" /> Đổi mật khẩu
        </Button>
      </div>

      <AssignRoleModal
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        userName="Người dùng"
        currentRoles={['teacher']}
      />

      <ChangePasswordModal
        open={pwdModalOpen}
        onOpenChange={setPwdModalOpen}
        userName="Người dùng"
      />
    </div>
  )
}
