import { OverdueDetailPage } from '@/features/library/components/admin/OverdueDetailPage'

export default async function OverdueDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OverdueDetailPage id={id} />
}
