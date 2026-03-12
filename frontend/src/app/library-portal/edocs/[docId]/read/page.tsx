import { EDocViewerPage } from '@/features/library/components/portal/EDocViewerPage'

interface EDocReadRouteProps {
  params: Promise<{ docId: string }>
}

export default async function EDocReadRoute({ params }: EDocReadRouteProps) {
  const { docId } = await params
  return <EDocViewerPage docId={docId} />
}
