'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader, FormField } from '@/components/composite'
import { AppInput, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function PurchaseOrderForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '',
    quantity: 1,
    estimatedPrice: 0,
    reason: '',
    department: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tên ấn phẩm')
      return
    }
    toast.success('Đã gửi yêu cầu đặt mua')
    router.push('/library/orders')
  }

  return (
    <div>
      <PageHeader
        title="Tạo yêu cầu đặt mua"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Đơn đặt mua', href: '/library/orders' },
          { label: 'Tạo mới' },
        ]}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="title" label="Tên ấn phẩm" required>
                <AppInput
                  placeholder="Nhập tên ấn phẩm..."
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </FormField>
              <FormField name="author" label="Tác giả">
                <AppInput
                  placeholder="Nhập tên tác giả..."
                  value={form.author}
                  onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField name="publisher" label="Nhà xuất bản">
                <AppInput
                  placeholder="Nhập NXB..."
                  value={form.publisher}
                  onChange={(e) => setForm((p) => ({ ...p, publisher: e.target.value }))}
                />
              </FormField>
              <FormField name="quantity" label="Số lượng" required>
                <AppInput
                  type="number"
                  value={String(form.quantity)}
                  onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))}
                  placeholder="1"
                />
              </FormField>
              <FormField name="estimatedPrice" label="Đơn giá ước tính (VND)">
                <AppInput
                  type="number"
                  value={String(form.estimatedPrice)}
                  onChange={(e) => setForm((p) => ({ ...p, estimatedPrice: Number(e.target.value) }))}
                  placeholder="0"
                />
              </FormField>
            </div>
            <FormField name="department" label="Đơn vị đề xuất">
              <AppInput
                placeholder="Nhập đơn vị đề xuất..."
                value={form.department}
                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
              />
            </FormField>
            <FormField name="reason" label="Lý do đề xuất">
              <AppTextarea
                placeholder="Nhập lý do đề xuất mua..."
                value={form.reason}
                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                minRows={3}
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/library/orders')} className="cursor-pointer">
            Hủy
          </Button>
          <Button type="submit" className="cursor-pointer">
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </div>
  )
}
