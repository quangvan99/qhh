import { ExceptionImportPage } from '@/features/exam/sessions/components/ExceptionImportPage'

export default async function ExceptionImportRoute({ params }: { params: Promise<{ sessionId: string; examId: string }> }) {
  const { sessionId, examId } = await params
  return <ExceptionImportPage sessionId={sessionId} examId={examId} />
}
