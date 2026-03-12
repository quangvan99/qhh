import { ActivityLogDetailPage } from '@/features/library/components/admin/ActivityLogDetailPage'

export default async function ActivityLogDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ActivityLogDetailPage logId={id} />
}
