'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite'
import { AppInput, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface MemberGroupFormProps {
  groupId?: string
}

interface FormState {
  name: string
  description: string
  durationMonths: number
  maxBooks: number
  maxBorrowDays: number
  registrationFee: number
  autoRenew: boolean
}

const defaultForm: FormState = {
  name: '',
  description: '',
  durationMonths: 12,
  maxBooks: 5,
  maxBorrowDays: 14,
  registrationFee: 0,
  autoRenew: false,
}

// Mock data for edit mode
const mockGroupData: Record<string, FormState & { id: string }> = {
  '1': { id: '1', name: 'Học sinh', description: 'Nhóm dành cho học sinh các cấp', durationMonths: 12, maxBooks: 5, maxBorrowDays: 14, registrationFee: 0, autoRenew: true },
  '2': { id: '2', name: 'Giáo viên', description: 'Nhóm dành cho giáo viên, cán bộ giảng dạy', durationMonths: 24, maxBooks: 10, maxBorrowDays: 30, registrationFee: 0, autoRenew: true },
}

export function MemberGroupForm({ groupId }: MemberGroupFormProps) {
  const router = useRouter()
  const isEdit = !!groupId
  const initialData = groupId ? mockGroupData[groupId] : undefined

  const [form, setForm] = useState<FormState>(initialData ?? defaultForm)

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên nhóm')
      return
    }
    if (isEdit) {
      toast.success('Đã cập nhật nhóm bạn đọc')
    } else {
      toast.success('Đã tạo nhóm bạn đọc mới')
    }
    router.push('/library/members/groups')
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa nhóm bạn đọc' : 'Thêm nhóm bạn đọc'}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Bạn đọc', href: '/library/members' },
          { label: 'Nhóm bạn đọc', href: '/library/members/groups' },
          { label: isEdit ? 'Sửa' : 'Thêm mới' },
        ]}
      />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <AppInput
              label="Tên nhóm"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nhập tên nhóm bạn đọc..."
            />
            <AppTextarea
              label="Mô tả"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả về nhóm bạn đọc..."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                label="Thời hạn thẻ (số tháng)"
                type="number"
                required
                value={String(form.durationMonths)}
                onChange={(e) => setForm((p) => ({ ...p, durationMonths: Number(e.target.value) }))}
              />
              <AppInput
                label="Số sách mượn tối đa"
                type="number"
                required
                value={String(form.maxBooks)}
                onChange={(e) => setForm((p) => ({ ...p, maxBooks: Number(e.target.value) }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                label="Số ngày mượn tối đa"
                type="number"
                required
                value={String(form.maxBorrowDays)}
                onChange={(e) => setForm((p) => ({ ...p, maxBorrowDays: Number(e.target.value) }))}
              />
              <AppInput
                label="Phí đăng ký (VNĐ)"
                type="number"
                value={String(form.registrationFee)}
                onChange={(e) => setForm((p) => ({ ...p, registrationFee: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.autoRenew}
                onCheckedChange={(v) => setForm((p) => ({ ...p, autoRenew: v }))}
              />
              <Label>Tự động gia hạn khi hết hạn</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/library/members/groups')}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer">
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}
