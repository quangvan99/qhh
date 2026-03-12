'use client'

import { PageHeader } from '@/components/composite/page-header'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function StudentExamProfile({ sessionId, examId, studentId }: { sessionId: string; examId: string; studentId: string }) {
  return (
    <div>
      <PageHeader
        title="Hồ sơ thi"
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Học sinh', href: `/exam/sessions/${sessionId}/exams/${examId}/students` },
          { label: 'Hồ sơ' },
        ]}
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Thông tin thí sinh</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-4">
            <AppAvatar name="Nguyễn Văn A" size="lg" role="student" />
            <div>
              <p className="font-semibold text-lg">Nguyễn Văn A</p>
              <p className="text-sm text-muted-foreground">Lớp: 12A1 • Mã báo danh: 100 • Phòng: P.101</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Kết quả thi</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center"><p className="text-2xl font-bold">8.5</p><p className="text-xs text-muted-foreground">Điểm</p></div>
              <div className="text-center"><p className="text-2xl font-bold">25/30</p><p className="text-xs text-muted-foreground">Câu đúng</p></div>
              <div className="text-center"><p className="text-2xl font-bold">38</p><p className="text-xs text-muted-foreground">Phút làm bài</p></div>
              <div className="text-center"><p className="text-2xl font-bold">#5</p><p className="text-xs text-muted-foreground">Xếp hạng</p></div>
            </div>
            <AppBadge semantic="success" dot>Đã nộp</AppBadge>
            <p className="text-sm text-muted-foreground mt-2">Nộp lúc: 15/03/2026 08:38</p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="cursor-pointer">Xem chi tiết bài làm</Button>
          <Button variant="outline" className="cursor-pointer">Thêm lượt thi</Button>
          <Button variant="outline" className="cursor-pointer">Thiết lập ngoại lệ</Button>
        </div>
      </div>
    </div>
  )
}
