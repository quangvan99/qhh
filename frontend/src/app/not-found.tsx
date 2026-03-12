import { FileQuestion } from 'lucide-react'
import { EmptyState } from '@/components/composite/empty-state'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyState
        icon={<FileQuestion className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />}
        title="Trang không tìm thấy"
        description="Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển."
        action={{ label: 'Về trang chủ', href: '/' }}
      />
    </div>
  )
}
