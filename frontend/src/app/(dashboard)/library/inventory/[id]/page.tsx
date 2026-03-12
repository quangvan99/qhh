import { InventoryExecutionPage } from '@/features/library/components/admin/InventoryExecutionPage'

export default async function InventoryExecutionRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <InventoryExecutionPage sessionId={id} />
}
