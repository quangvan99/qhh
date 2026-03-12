'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { AssignmentCard } from '@/features/lms/student/components/AssignmentCard'
import { useGetMyAssignments } from '@/features/lms/student/api/student.api'
import type { StudentAssignment } from '@/features/lms/student/types/student.types'

export default function MyAssignmentsPage() {
  const { data: assignments, isLoading } = useGetMyAssignments()
  const [tab, setTab] = useState('pending')

  const filtered = assignments?.filter((a: StudentAssignment) => {
    if (tab === 'pending') return a.status === 'pending'
    if (tab === 'submitted') return a.status === 'submitted' || a.status === 'late'
    if (tab === 'graded') return a.status === 'graded'
    return true
  })

  const pendingCount = assignments?.filter((a: StudentAssignment) => a.status === 'pending').length ?? 0
  const submittedCount = assignments?.filter((a: StudentAssignment) => a.status === 'submitted' || a.status === 'late').length ?? 0
  const gradedCount = assignments?.filter((a: StudentAssignment) => a.status === 'graded').length ?? 0

  return (
    <div>
      <PageHeader title="Tất cả bài tập" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">Chưa nộp ({pendingCount})</TabsTrigger>
          <TabsTrigger value="submitted">Đã nộp ({submittedCount})</TabsTrigger>
          <TabsTrigger value="graded">Đã chấm ({gradedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((a: StudentAssignment) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="Không có bài tập nào" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
