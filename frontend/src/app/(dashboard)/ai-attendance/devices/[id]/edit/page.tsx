'use client'

import { use } from 'react'
import { DeviceForm } from '@/features/ai-attendance/components/DeviceForm'
import { useGetDevices } from '@/features/ai-attendance/api/attendance.api'

export default function EditDevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: devices = [] } = useGetDevices()
  const device = devices.find(d => d.id === id)

  if (!device) {
    return <div className="p-8 text-muted-foreground">Đang tải...</div>
  }

  return <DeviceForm device={device} />
}
