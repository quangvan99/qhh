'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'

interface StudentExceptionFormProps {
  sessionId: string
  examId: string
  studentId: string
}

export function StudentExceptionForm({ sessionId, examId, studentId }: StudentExceptionFormProps) {
  const [extraTime, setExtraTime] = useState(true)
  const [privateRoom, setPrivateRoom] = useState(false)
  const [specialSupport, setSpecialSupport] = useState(false)
  const [extraMinutes, setExtraMinutes] = useState('15')
  const [note, setNote] = useState('Học sinh có hoàn cảnh đặc biệt, cần thêm thời gian làm bài.')

  const handleSave = () => {
    toast.success('Đã lưu ngoại lệ thành công')
  }

  return (
    <div>
      <PageHeader
        title="Thiết lập ngoại lệ"
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Học sinh', href: `/exam/sessions/${sessionId}/exams/${examId}/students` },
          { label: `HS ${studentId}`, href: `/exam/sessions/${sessionId}/exams/${examId}/students/${studentId}` },
          { label: 'Ngoại lệ' },
        ]}
      />

      <div className="max-w-2xl space-y-6">
        {/* Student info */}
        <Card>
          <CardHeader><CardTitle>Thông tin học sinh</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Họ tên:</span> <span className="font-medium">Nguyễn Văn An</span></div>
              <div><span className="text-muted-foreground">Mã HS:</span> <span className="font-medium">HS0001</span></div>
              <div><span className="text-muted-foreground">Lớp:</span> <span className="font-medium">12A1</span></div>
              <div><span className="text-muted-foreground">Ca thi:</span> <span className="font-medium">Ca 1 - Sáng</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Exception types */}
        <Card>
          <CardHeader><CardTitle>Loại ngoại lệ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="extra-time"
                checked={extraTime}
                onCheckedChange={(v) => setExtraTime(v === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="extra-time" className="font-medium cursor-pointer">Thêm giờ</Label>
                <p className="text-sm text-muted-foreground">Cho phép học sinh có thêm thời gian làm bài</p>
              </div>
            </div>

            {extraTime && (
              <div className="ml-7">
                <FormField name="extraMinutes" label="Số phút thêm" required>
                  <Input
                    type="number"
                    value={extraMinutes}
                    onChange={(e) => setExtraMinutes(e.target.value)}
                    min={1}
                    max={120}
                    className="w-32"
                  />
                </FormField>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id="private-room"
                checked={privateRoom}
                onCheckedChange={(v) => setPrivateRoom(v === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="private-room" className="font-medium cursor-pointer">Phòng riêng</Label>
                <p className="text-sm text-muted-foreground">Học sinh thi trong phòng riêng biệt</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="special-support"
                checked={specialSupport}
                onCheckedChange={(v) => setSpecialSupport(v === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="special-support" className="font-medium cursor-pointer">Hỗ trợ đặc biệt</Label>
                <p className="text-sm text-muted-foreground">Cần người đọc đề, viết hộ, hoặc hỗ trợ khác</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <Card>
          <CardHeader><CardTitle>Ghi chú</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú về ngoại lệ..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="cursor-pointer" onClick={handleSave}>Lưu ngoại lệ</Button>
          <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students`}>
            <Button variant="outline" className="cursor-pointer">Hủy</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
