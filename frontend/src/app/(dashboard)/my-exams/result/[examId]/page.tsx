'use client'

import { useParams } from 'next/navigation'
import { ExamResult } from '@/features/lms/student/components/ExamResult'

export default function ExamResultPage() {
  const params = useParams<{ examId: string }>()
  return <ExamResult sessionId={params.examId} />
}
