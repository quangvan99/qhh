'use client'

import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function SessionForm({ sessionId }: { sessionId?: string }) {
  const isEdit = !!sessionId

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa đợt thi' : 'Tạo đợt thi'}
        breadcrumbs={[{ label: 'Tổ chức thi', href: '/exam/sessions' }, { label: isEdit ? 'Sửa' : 'Tạo mới' }]}
        actions={[{ label: 'Lưu', onClick: () => toast.success('Đã lưu đợt thi') }]}
      />
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Thông tin đợt thi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField name="name" label="Tên đợt thi" required><Input placeholder="VD: Kiểm tra giữa kỳ 1" /></FormField>
            <FormField name="category" label="Danh mục" required>
              <Select><SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger><SelectContent><SelectItem value="gk1">Giữa kỳ 1</SelectItem><SelectItem value="ck1">Cuối kỳ 1</SelectItem></SelectContent></Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="year" label="Năm học" required><Input defaultValue="2025-2026" /></FormField>
              <FormField name="semester" label="Học kỳ" required>
                <Select><SelectTrigger><SelectValue placeholder="Chọn HK" /></SelectTrigger><SelectContent><SelectItem value="1">HK1</SelectItem><SelectItem value="2">HK2</SelectItem></SelectContent></Select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="startDate" label="Từ ngày" required><Input type="date" /></FormField>
              <FormField name="endDate" label="Đến ngày" required><Input type="date" /></FormField>
            </div>
            <FormField name="description" label="Mô tả"><Textarea rows={3} placeholder="Mô tả đợt thi..." /></FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cài đặt</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3"><Switch id="showScore" /><Label htmlFor="showScore">Hiển thị điểm ngay</Label></div>
            <div className="flex items-center gap-3"><Switch id="showAnswer" /><Label htmlFor="showAnswer">Cho phép xem đáp án sau thi</Label></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
