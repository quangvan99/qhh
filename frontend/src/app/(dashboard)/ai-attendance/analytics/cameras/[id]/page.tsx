'use client'

import { use } from 'react'
import { CameraAnalyticsDetailPage } from '@/features/ai-attendance/components/CameraAnalyticsDetailPage'

export default function CameraAnalyticsDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <CameraAnalyticsDetailPage cameraId={id} />
}
