import { Suspense } from 'react'
import { ScholarshipConfig } from '@/features/lms/gddt/components/ScholarshipConfig'

export default function ScholarshipLevelsPage() {
  return (
    <Suspense>
      <ScholarshipConfig />
    </Suspense>
  )
}
