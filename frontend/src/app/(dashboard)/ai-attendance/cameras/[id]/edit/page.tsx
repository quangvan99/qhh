'use client'

import { use } from 'react'
import { CameraForm } from '@/features/ai-attendance/components/CameraForm'
import { useGetCameras } from '@/features/ai-attendance/api/attendance.api'

export default function EditCameraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: cameras = [] } = useGetCameras()
  const camera = cameras.find(c => c.id === id)

  if (!camera) {
    return <div className="p-8 text-muted-foreground">Đang tải...</div>
  }

  return <CameraForm camera={camera} />
}
