import { ThreadDetail } from '@/features/lms/discussions/components/ThreadDetail'

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string; threadId: string }> }) {
  const { id, threadId } = await params
  return <ThreadDetail classId={id} threadId={threadId} />
}
