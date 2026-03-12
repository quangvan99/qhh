'use client'

import { Trophy } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { useGetExamHistory } from '@/features/lms/student/api/student.api'
import type { StudentExamSession } from '@/features/lms/student/types/student.types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ExamHistoryPage() {
  const { data: exams, isLoading } = useGetExamHistory()

  return (
    <div>
      <PageHeader
        title="Lịch sử thi"
        breadcrumbs={[
          { label: 'Kỳ thi', href: '/my-exams' },
          { label: 'Lịch sử' },
        ]}
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : exams && exams.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Ca thi</th>
                <th className="pb-3 font-medium">Ngày thi</th>
                <th className="pb-3 font-medium">Môn</th>
                <th className="pb-3 font-medium">Điểm</th>
                <th className="pb-3 font-medium">Xếp hạng</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam: StudentExamSession) => (
                <tr key={exam.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{exam.examTitle}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(exam.startTime).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3">{exam.subject}</td>
                  <td className="py-3 font-medium">
                    {exam.score !== undefined ? exam.score : '-'}
                  </td>
                  <td className="py-3">
                    {exam.rank ? (
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                        {exam.rank}/{exam.totalParticipants}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3">
                    <Link href={`/my-exams/result/${exam.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        Xem kết quả
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Chưa có lịch sử thi" />
      )}
    </div>
  )
}
