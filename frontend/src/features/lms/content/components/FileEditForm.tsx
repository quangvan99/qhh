'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/composite/page-header'
import { toast } from 'sonner'

interface FileEditFormProps {
  classId: string
  groupId: string
  fileId: string
}

export function FileEditForm({ classId, groupId, fileId }: FileEditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Mock prefilled data
  const [displayName, setDisplayName] = useState('Tài liệu hướng dẫn thực hành')
  const [description, setDescription] = useState('Tài liệu hướng dẫn thực hành cho bài học chương 3')
  const [viewCondition, setViewCondition] = useState('Hoàn thành bài kiểm tra chương 2')
  const [startDate, setStartDate] = useState('2026-03-01')
  const [endDate, setEndDate] = useState('2026-06-30')

  const handleSave = () => {
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      toast.success('Đã cập nhật thông tin file')
      router.push(`/lms/classes/${classId}/content/${groupId}/file`)
    }, 800)
  }

  return (
    <div>
      <PageHeader
        title="Chỉnh sửa File"
        breadcrumbs={[
          { label: 'LMS', href: '/lms' },
          { label: 'Nội dung', href: `/lms/classes/${classId}/content` },
          { label: 'File', href: `/lms/classes/${classId}/content/${groupId}/file` },
          { label: 'Chỉnh sửa' },
        ]}
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Thông tin file</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Tên hiển thị</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Nhập tên hiển thị" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả file..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewCondition">Điều kiện xem</Label>
              <Textarea id="viewCondition" value={viewCondition} onChange={(e) => setViewCondition(e.target.value)} placeholder="Điều kiện để học sinh có thể xem file..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fStartDate">Ngày bắt đầu</Label>
                <Input id="fStartDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fEndDate">Ngày kết thúc</Label>
                <Input id="fEndDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
          <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">Hủy</Button>
        </div>
      </div>
    </div>
  )
}
