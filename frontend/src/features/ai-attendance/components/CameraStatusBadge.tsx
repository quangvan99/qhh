import { AppBadge } from '@/components/base'
import type { Camera } from '../types/attendance.types'

const statusMap = {
  online: { semantic: 'success' as const, label: 'Online', dot: true },
  offline: { semantic: 'neutral' as const, label: 'Offline', dot: false },
  error: { semantic: 'error' as const, label: 'Lỗi', dot: true },
}

export function CameraStatusBadge({ status }: { status: Camera['status'] }) {
  const cfg = statusMap[status]
  return (
    <AppBadge semantic={cfg.semantic} dot={cfg.dot} size="sm">
      {cfg.label}
    </AppBadge>
  )
}
