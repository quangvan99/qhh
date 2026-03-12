import { AssignmentForm } from '@/features/lms/assignments/components/AssignmentForm'

export default async function NewAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AssignmentForm classId={id} />
}
