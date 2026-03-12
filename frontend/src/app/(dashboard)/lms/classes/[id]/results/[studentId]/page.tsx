import { StudentResultDetail } from '@/features/lms/results/components/StudentResultDetail'

export default async function StudentResultPage({ params }: { params: Promise<{ id: string; studentId: string }> }) {
  const { id, studentId } = await params
  return <StudentResultDetail classId={id} studentId={studentId} />
}
