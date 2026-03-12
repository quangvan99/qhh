'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { ExamCard } from '@/features/lms/student/components/ExamCard'
import { useGetMyExams } from '@/features/lms/student/api/student.api'
import type { StudentExamSession } from '@/features/lms/student/types/student.types'

export default function MyExamsPage() {
  const [tab, setTab] = useState('upcoming')
  const { data: exams, isLoading } = useGetMyExams(
    tab === 'all' ? undefined : { status: tab }
  )

  return (
    <div>
      <PageHeader title="Kỳ thi của tôi" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
          <TabsTrigger value="ongoing">Đang thi</TabsTrigger>
          <TabsTrigger value="completed">Đã kết thúc</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : exams && exams.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam: StudentExamSession) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <EmptyState title="Không có kỳ thi nào" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
