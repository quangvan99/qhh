import { SessionForm } from '@/features/exam/sessions/components/SessionForm'

export default async function EditSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  return <SessionForm sessionId={sessionId} />
}
