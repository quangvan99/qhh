import { StudentSubmissionDetail } from '@/features/exam/sessions/components/StudentSubmissionDetail'

export default async function StudentSubmissionRoute({ params }: { params: Promise<{ sessionId: string; examId: string; studentId: string }> }) {
  const { sessionId, examId, studentId } = await params
  return <StudentSubmissionDetail sessionId={sessionId} examId={examId} studentId={studentId} />
}
