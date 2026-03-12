import { BorrowList } from '@/features/library/components/admin/BorrowList'

export default function OverdueBorrowsPage() {
  return <BorrowList status="overdue" />
}
