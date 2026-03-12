import { DiscussionList } from '@/features/lms/discussions/components/DiscussionList'

export default async function DiscussionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DiscussionList classId={id} />
}
