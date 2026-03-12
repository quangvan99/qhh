import { redirect } from 'next/navigation'

export default async function AssignmentPage({ params }: { params: Promise<{ id: string; assignmentId: string }> }) {
  const { id, assignmentId } = await params
  redirect(`/lms/classes/${id}/assignments/${assignmentId}/submissions`)
}
