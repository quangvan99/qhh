import { EDocDetailPage } from '@/features/library/components/portal/EDocDetailPage'

interface EDocDetailRouteProps {
  params: Promise<{ docId: string }>
}

export default async function EDocDetailRoute({ params }: EDocDetailRouteProps) {
  const { docId } = await params
  return <EDocDetailPage docId={docId} />
}
