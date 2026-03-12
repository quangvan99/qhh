'use client'

import { useParams } from 'next/navigation'
import { Clock, BookOpen, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { useGetMyClass, useGetAccessHistory } from '@/features/lms/student/api/student.api'
import type { AccessLog } from '@/features/lms/student/types/student.types'

export default function ClassHistoryPage() {
  const params = useParams<{ classId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data: history, isLoading } = useGetAccessHistory(params.classId)

  return (
    <div>
      <PageHeader
        title="Lịch sử truy cập"
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Lịch sử' },
        ]}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : history?.data && history.data.length > 0 ? (
        <div className="space-y-2">
          {history.data.map((log: AccessLog) => (
            <Card key={log.id} size="sm">
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  {log.action.includes('nộp') ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <BookOpen className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.action}</p>
                  {log.contentTitle && (
                    <p className="text-xs text-muted-foreground">{log.contentTitle}</p>
                  )}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{new Date(log.timestamp).toLocaleDateString('vi-VN')}</p>
                  <p>{new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                  {log.duration !== undefined && (
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.duration} phút
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Chưa có lịch sử truy cập" />
      )}
    </div>
  )
}
