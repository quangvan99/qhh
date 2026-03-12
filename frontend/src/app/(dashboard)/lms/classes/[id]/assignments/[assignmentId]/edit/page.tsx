import { AssignmentForm } from '@/features/lms/assignments/components/AssignmentForm'

export default async function EditAssignmentPage({ params }: { params: Promise<{ id: string; assignmentId: string }> }) {
  const { id, assignmentId } = await params
  return <AssignmentForm classId={id} assignmentId={assignmentId} />
}
