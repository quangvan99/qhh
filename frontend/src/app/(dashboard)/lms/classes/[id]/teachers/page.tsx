import { TeacherList } from '@/features/lms/results/components/TeacherList'

export default async function TeachersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TeacherList classId={id} />
}
