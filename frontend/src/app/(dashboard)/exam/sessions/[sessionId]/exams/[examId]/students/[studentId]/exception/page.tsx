import { StudentExceptionForm } from '@/features/exam/sessions/components/StudentExceptionForm'

export default async function StudentExceptionRoute({ params }: { params: Promise<{ sessionId: string; examId: string; studentId: string }> }) {
  const { sessionId, examId, studentId } = await params
  return <StudentExceptionForm sessionId={sessionId} examId={examId} studentId={studentId} />
}
