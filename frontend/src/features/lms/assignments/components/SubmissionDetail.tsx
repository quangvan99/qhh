'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/base/app-avatar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export function SubmissionDetail({ classId, assignmentId, subId }: { classId: string; assignmentId: string; subId: string }) {
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSave = useCallback(() => {
    if (!score) { toast.error('Vui lòng nhập điểm'); return }
    toast.success('Đã lưu điểm')
  }, [score])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  return (
    <div>
      <PageHeader
        title="Chi tiết bài làm"
        breadcrumbs={[
          { label: 'Bài tập', href: `/lms/classes/${classId}/assignments` },
          { label: 'Bài nộp', href: `/lms/classes/${classId}/assignments/${assignmentId}/submissions` },
          { label: 'Chi tiết' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - student work */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Bài làm của HS</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <AppAvatar name="Nguyễn Văn A" size="sm" role="student" />
                <div>
                  <p className="font-medium">Nguyễn Văn A</p>
                  <p className="text-xs text-muted-foreground">Nộp lúc: 14/03/2026 10:30</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 min-h-[300px] bg-muted/30">
                <p className="text-sm text-muted-foreground">Nội dung bài làm của học sinh sẽ được hiển thị ở đây...</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">📎</span>
                    <a href="#" className="text-primary hover:underline cursor-pointer">bai_tap_1.pdf</a>
                    <span className="text-xs text-muted-foreground">(2.3 MB)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel - grading */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Chấm điểm</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField name="score" label="Điểm" required>
                <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} min={0} max={10} step={0.5} placeholder="0-10" />
              </FormField>
              <FormField name="feedback" label="Nhận xét">
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} placeholder="Nhận xét cho học sinh..." />
              </FormField>
              <div className="space-y-2">
                <Button onClick={handleSave} className="w-full cursor-pointer">Lưu điểm</Button>
                <Button variant="outline" onClick={() => { handleSave(); toast.info('Chuyển bài tiếp') }} className="w-full cursor-pointer">Lưu & Chuyển bài tiếp</Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Ctrl+S để lưu nhanh</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Điều hướng</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="cursor-pointer"><ChevronLeft className="h-4 w-4 mr-1" /> Bài trước</Button>
                <span className="text-sm text-muted-foreground">Bài 5/32</span>
                <Button variant="outline" size="sm" className="cursor-pointer">Bài tiếp <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
