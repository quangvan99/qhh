'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function DiscussionForm({ classId, threadId }: { classId: string; threadId?: string }) {
  const isEdit = !!threadId
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pinned, setPinned] = useState(false)
  const [allowReplies, setAllowReplies] = useState(true)

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) { toast.error('Vui lòng nhập đầy đủ thông tin'); return }
    toast.success(isEdit ? 'Đã cập nhật thảo luận' : 'Đã đăng thảo luận')
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa thảo luận' : 'Tạo thảo luận mới'}
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Thảo luận', href: `/lms/classes/${classId}/discussions` }, { label: isEdit ? 'Sửa' : 'Tạo mới' }]}
      />
      <Card className="max-w-2xl">
        <CardContent className="p-6 space-y-4">
          <FormField name="title" label="Tiêu đề" required><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." /></FormField>
          <FormField name="body" label="Nội dung" required><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Nhập nội dung thảo luận..." /></FormField>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><Switch checked={pinned} onCheckedChange={setPinned} id="pin" /><Label htmlFor="pin">Ghim lên đầu</Label></div>
            <div className="flex items-center gap-2"><Switch checked={allowReplies} onCheckedChange={setAllowReplies} id="replies" /><Label htmlFor="replies">Cho phép trả lời</Label></div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" className="cursor-pointer">Hủy</Button>
            <Button onClick={handleSubmit} className="cursor-pointer">{isEdit ? 'Cập nhật' : 'Đăng thảo luận'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
