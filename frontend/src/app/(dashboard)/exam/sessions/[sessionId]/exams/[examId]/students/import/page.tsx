import { ExamStudentImportPage } from '@/features/exam/sessions/components/ExamStudentImportPage'

export default async function ExamStudentImportRoute({ params }: { params: Promise<{ sessionId: string; examId: string }> }) {
  const { sessionId, examId } = await params
  return <ExamStudentImportPage sessionId={sessionId} examId={examId} />
}
