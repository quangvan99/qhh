'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader, FormField } from '@/components/composite'
import { AppInput, AppSelect, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

const scopeOptions = [
  { value: 'all', label: 'Toàn bộ kho' },
  { value: 'category', label: 'Theo danh mục' },
  { value: 'area', label: 'Theo khu vực' },
]

export function InventorySessionForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    scope: 'all',
    note: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên kỳ kiểm kê')
      return
    }
    if (!form.startDate || !form.endDate) {
      toast.error('Vui lòng chọn ngày bắt đầu và kết thúc')
      return
    }
    toast.success('Đã tạo kỳ kiểm kê mới')
    router.push('/library/inventory/warehouse')
  }

  return (
    <div>
      <PageHeader
        title="Tạo kỳ kiểm kê"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Kiểm kê', href: '/library/inventory/warehouse' },
          { label: 'Tạo kỳ kiểm kê' },
        ]}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField name="name" label="Tên kỳ kiểm kê" required>
              <AppInput
                placeholder="VD: Kiểm kê cuối kỳ 1 năm 2026..."
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="startDate" label="Ngày bắt đầu" required>
                <AppInput
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                />
              </FormField>
              <FormField name="endDate" label="Ngày kết thúc" required>
                <AppInput
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                />
              </FormField>
            </div>
            <FormField name="scope" label="Phạm vi kiểm kê">
              <AppSelect
                options={scopeOptions}
                value={form.scope}
                onChange={(v) => setForm((p) => ({ ...p, scope: v }))}
              />
            </FormField>
            <FormField name="note" label="Ghi chú">
              <AppTextarea
                placeholder="Ghi chú thêm về kỳ kiểm kê..."
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                minRows={3}
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
            Hủy
          </Button>
          <Button type="submit" className="cursor-pointer">
            Tạo kỳ kiểm kê
          </Button>
        </div>
      </form>
    </div>
  )
}
