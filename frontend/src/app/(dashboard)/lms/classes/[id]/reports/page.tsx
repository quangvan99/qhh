import { ClassReports } from '@/features/lms/results/components/ClassReports'

export default async function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ClassReports classId={id} />
}
