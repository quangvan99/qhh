import { StudentExamProfile } from '@/features/exam/sessions/components/StudentExamProfile'

export default async function StudentExamProfilePage({ params }: { params: Promise<{ sessionId: string; examId: string; studentId: string }> }) {
  const { sessionId, examId, studentId } = await params
  return <StudentExamProfile sessionId={sessionId} examId={examId} studentId={studentId} />
}
