'use client'

import { use } from 'react'
import { CameraDetailPage } from '@/features/ai-attendance/components/CameraDetailPage'

export default function CameraDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <CameraDetailPage cameraId={id} />
}
