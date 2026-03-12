'use client'

import { use } from 'react'
import { AttendanceMonitor } from '@/features/ai-attendance/components/AttendanceMonitor'

export default function MonitorSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  return <AttendanceMonitor defaultSessionId={sessionId} />
}
