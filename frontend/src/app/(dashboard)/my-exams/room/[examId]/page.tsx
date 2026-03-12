'use client'

import { useParams } from 'next/navigation'
import { ExamRoom } from '@/features/lms/student/components/ExamRoom'

export default function ExamRoomPage() {
  const params = useParams<{ examId: string }>()
  return <ExamRoom sessionId={params.examId} />
}
