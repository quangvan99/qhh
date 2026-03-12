import { SubmissionDetail } from '@/features/lms/assignments/components/SubmissionDetail'

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string; assignmentId: string; subId: string }> }) {
  const { id, assignmentId, subId } = await params
  return <SubmissionDetail classId={id} assignmentId={assignmentId} subId={subId} />
}
