'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AppSelect } from '@/components/base/app-select'
import { PageHeader } from '@/components/composite/page-header'
import { toast } from 'sonner'

const lmsRoleOptions = [
  { value: 'admin_lms', label: 'Admin LMS' },
  { value: 'teacher', label: 'Giảng viên' },
  { value: 'assistant', label: 'Trợ giảng' },
  { value: 'student', label: 'Học viên' },
  { value: 'guest', label: 'Khách' },
]

interface LmsUserFormProps {
  userId?: string
}

export function LmsUserForm({ userId }: LmsUserFormProps) {
  const router = useRouter()
  const isEdit = !!userId
  const [saving, setSaving] = useState(false)

  const [fullName, setFullName] = useState(isEdit ? 'Nguyễn Văn An' : '')
  const [username, setUsername] = useState(isEdit ? 'nguyenvanan' : '')
  const [email, setEmail] = useState(isEdit ? 'an@example.com' : '')
  const [role, setRole] = useState(isEdit ? 'admin_lms' : '')
  const [unit, setUnit] = useState(isEdit ? 'Phòng CNTT' : '')
  const [active, setActive] = useState(true)

  const handleSave = () => {
    if (!fullName || !username || !email || !role) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      toast.success(isEdit ? 'Đã cập nhật người dùng' : 'Đã thêm người dùng')
      router.push('/lms/users')
    }, 800)
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Chỉnh sửa người dùng LMS' : 'Thêm người dùng LMS'}
        breadcrumbs={[
          { label: 'LMS', href: '/lms/users' },
          { label: 'Người dùng', href: '/lms/users' },
          { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' },
        ]}
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Thông tin người dùng</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ tên <span className="text-red-500">*</span></Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập <span className="text-red-500">*</span></Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="nguyenvana" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Vai trò LMS <span className="text-red-500">*</span></Label>
              <AppSelect options={lmsRoleOptions} value={role} onChange={setRole} placeholder="Chọn vai trò" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Đơn vị</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Tên đơn vị" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={active} onCheckedChange={(v) => setActive(!!v)} id="active" />
              <Label htmlFor="active" className="cursor-pointer">Kích hoạt tài khoản</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm người dùng'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/lms/users')} className="cursor-pointer">Hủy</Button>
        </div>
      </div>
    </div>
  )
}
