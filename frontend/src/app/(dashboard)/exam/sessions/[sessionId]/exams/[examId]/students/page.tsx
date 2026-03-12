import { SessionStudentList } from '@/features/exam/sessions/components/SessionStudentList'

export default async function SessionStudentsPage({ params }: { params: Promise<{ sessionId: string; examId: string }> }) {
  const { sessionId, examId } = await params
  return <SessionStudentList sessionId={sessionId} examId={examId} />
}
