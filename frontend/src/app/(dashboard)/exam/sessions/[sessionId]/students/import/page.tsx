import { SessionStudentImportPage } from '@/features/exam/sessions/components/SessionStudentImportPage'

export default async function SessionStudentImportRoute({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  return <SessionStudentImportPage sessionId={sessionId} />
}
