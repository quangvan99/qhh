'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/composite'
import { useGetMyClass } from '@/features/lms/student/api/student.api'
import { SubmitForm } from '@/features/lms/student/components/SubmitForm'

export default function AssignmentSubmitPage() {
  const params = useParams<{ classId: string; assignmentId: string }>()
  const { data: cls } = useGetMyClass(params.classId)

  return (
    <div>
      <PageHeader
        title="Nộp bài"
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Bài tập', href: `/my-classes/${params.classId}/assignments` },
          { label: 'Nộp bài' },
        ]}
      />
      <SubmitForm classId={params.classId} assignmentId={params.assignmentId} />
    </div>
  )
}
