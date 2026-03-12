import { AssignmentList } from '@/features/lms/assignments/components/AssignmentList'

export default async function AssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AssignmentList classId={id} />
}
