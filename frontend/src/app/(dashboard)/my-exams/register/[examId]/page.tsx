'use client'

import { useParams, useRouter } from 'next/navigation'
import { AlertTriangle, Calendar, Clock, FileText, Wifi } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { ConfirmDialog } from '@/components/composite'
import { useGetExamSession, useRegisterExam } from '@/features/lms/student/api/student.api'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ExamRegisterPage() {
  const params = useParams<{ examId: string }>()
  const router = useRouter()
  const { data: exam, isLoading } = useGetExamSession(params.examId)
  const registerMutation = useRegisterExam()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync(params.examId)
      toast.success('Đăng ký thi thành công')
      router.push('/my-exams')
    } catch {
      toast.error('Đăng ký thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!exam) return null

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={`Đăng ký thi — ${exam.examTitle}`}
        breadcrumbs={[
          { label: 'Kỳ thi', href: '/my-exams' },
          { label: 'Đăng ký' },
        ]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin kỳ thi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Ngày thi: {new Date(exam.startTime).toLocaleDateString('vi-VN', {
                weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Giờ bắt đầu: {new Date(exam.startTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit', minute: '2-digit',
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Thời gian làm bài: {exam.duration} phút</span>
            </div>
            {exam.totalQuestions && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Số câu: {exam.totalQuestions}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Lưu ý quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Wifi className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Cần kết nối internet ổn định trong suốt thời gian thi</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Không sử dụng tab khác hoặc thiết bị khác trong khi thi</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Bài thi sẽ tự động nộp khi hết giờ</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
            Hủy
          </Button>
          <Button onClick={() => setShowConfirm(true)} className="cursor-pointer">
            Xác nhận đăng ký
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Xác nhận đăng ký thi"
        description={`Bạn muốn đăng ký thi "${exam.examTitle}"?`}
        onConfirm={handleRegister}
        confirmLabel="Đăng ký"
        loading={registerMutation.isPending}
      />
    </div>
  )
}
