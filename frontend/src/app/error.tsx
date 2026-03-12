'use client'

import { AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/components/composite/empty-state'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyState
        icon={<AlertTriangle className="h-12 w-12 text-amber-500" strokeWidth={1.5} />}
        title="Đã xảy ra lỗi"
        description={error.message || 'Có lỗi xảy ra trong quá trình tải trang. Vui lòng thử lại.'}
        action={{ label: 'Thử lại', onClick: reset }}
        secondaryAction={{ label: 'Về trang chủ', onClick: () => { window.location.href = '/' } }}
      />
    </div>
  )
}
