import { SessionExamList } from '@/features/exam/sessions/components/SessionExamList'

export default async function SessionExamsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  return <SessionExamList sessionId={sessionId} />
}
