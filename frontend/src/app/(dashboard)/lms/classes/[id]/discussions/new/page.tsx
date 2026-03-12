import { DiscussionForm } from '@/features/lms/discussions/components/DiscussionForm'

export default async function NewDiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DiscussionForm classId={id} />
}
