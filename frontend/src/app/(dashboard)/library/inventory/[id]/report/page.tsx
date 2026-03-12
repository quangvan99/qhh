import { InventoryReportPage } from '@/features/library/components/admin/InventoryReportPage'

export default async function InventoryReportRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <InventoryReportPage sessionId={id} />
}
