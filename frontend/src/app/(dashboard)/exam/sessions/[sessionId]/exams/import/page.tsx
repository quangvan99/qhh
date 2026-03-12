import { ExamSessionImportPage } from '@/features/exam/sessions/components/ExamSessionImportPage'

export default async function ExamImportRoute({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  return <ExamSessionImportPage sessionId={sessionId} />
}
