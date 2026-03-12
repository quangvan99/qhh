import { SubmissionList } from '@/features/lms/assignments/components/SubmissionList'

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string; assignmentId: string }> }) {
  const { id, assignmentId } = await params
  return <SubmissionList classId={id} assignmentId={assignmentId} />
}
