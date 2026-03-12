'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { AssignmentCard } from '@/features/lms/student/components/AssignmentCard'
import { useGetMyClass, useGetMyAssignments } from '@/features/lms/student/api/student.api'
import type { StudentAssignment } from '@/features/lms/student/types/student.types'

export default function ClassAssignmentsPage() {
  const params = useParams<{ classId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data: assignments, isLoading } = useGetMyAssignments({ classId: params.classId })
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
      <PageHeader
        title={`Bài tập — ${cls?.name ?? '...'}`}
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Bài tập' },
        ]}
      />

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
