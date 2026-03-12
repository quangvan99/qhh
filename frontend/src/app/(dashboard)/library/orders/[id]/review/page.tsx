import { PurchaseOrderReview } from '@/features/library/components/admin/PurchaseOrderReview'

export default async function OrderReviewRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PurchaseOrderReview orderId={id} />
}
